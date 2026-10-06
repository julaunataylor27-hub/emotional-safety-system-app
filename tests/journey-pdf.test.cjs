const {test} = require('node:test');
const assert = require('node:assert/strict');
const {defaultAnswers} = require('../src/journeyMemory');
const {buildJourneyPdfHtml, createJourneyPdfService} = require('../src/journeyPdf');

function fixture(overrides = {}) {
  const calls = [];
  const fs = {
    cacheDirectory: 'file:///cache/', EncodingType: {Base64:'base64'},
    copyAsync: async options => calls.push(['copy', options]),
    deleteAsync: async uri => calls.push(['delete', uri]),
    getContentUriAsync: async () => 'content://pdf-reader/document',
    readAsStringAsync: async (_, options) => {assert.equal(options.encoding,'base64'); return 'JVBERi0xLjQ=';},
    writeAsStringAsync: async (uri, contents, options) => {assert.equal(options.encoding,'base64'); calls.push(['write',uri,contents]);},
    StorageAccessFramework: {
      requestDirectoryPermissionsAsync: async () => ({granted:true,directoryUri:'content://my-chosen-folder'}),
      createFileAsync: async (...args) => {calls.push(['create',...args]); return 'content://my-chosen-folder/new-pdf';}
    }, ...overrides
  };
  const service = createJourneyPdfService({
    print: {printToFileAsync: async options => {calls.push(['print', options]); return {uri:'file:///cache/print-temp.pdf',numberOfPages:2};}},
    fileSystem: fs, sharing: {isAvailableAsync: async () => true, shareAsync: async (...args) => calls.push(['share',...args])},
    intentLauncher: {startActivityAsync: async (...args) => calls.push(['open',...args])},
    platform:'android', now: () => new Date('2026-10-06T10:13:00Z')
  });
  return {calls,service,fs};
}

test('PDF HTML preserves all seven stages, Unicode and line breaks while escaping user markup', () => {
  const answers = {...defaultAnswers(),foundationMessage:'Culture & identity\nCountry <home>',storyNotes:'<script>alert("bad")</script>',
    legacyWorld:'Future generations — kindness × patience',projectSelections:['Website / App'],sharingSelections:['Schools']};
  const html = buildJourneyPdfHtml(answers,new Date('2026-10-06T10:13:00Z'));
  assert.equal((html.match(/<section>/g)||[]).length,7);
  assert.ok(html.includes('Culture &amp; identity\nCountry &lt;home&gt;'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('Future generations — kindness × patience'));
  assert.ok(!html.includes('http://')&&!html.includes('https://'));
  assert.ok(html.includes('size: A4'));
});

test('a named PDF is created and saved as PDF bytes to the chosen folder, then can open and share', async () => {
  const {calls,service} = fixture();
  const document = await service.create({...defaultAnswers(),foundationMessage:'My exact words'});
  assert.equal(document.pages,2);
  assert.ok(document.name.endsWith('.pdf'));
  const options=calls.find(call=>call[0]==='print')[1];
  assert.equal(options.width,595); assert.equal(options.height,842);
  assert.ok(options.html.includes('My exact words'));
  const saved=await service.save(document);
  assert.equal(saved.saved,true);
  const creation=calls.find(call=>call[0]==='create');
  assert.equal(creation[1],'content://my-chosen-folder');
  assert.ok(!creation[2].endsWith('.pdf'),'Android SAF adds the PDF extension');
  assert.equal(creation[3],'application/pdf');
  assert.deepEqual(calls.find(call=>call[0]==='write'),['write','content://my-chosen-folder/new-pdf','JVBERi0xLjQ=']);
  await service.open(document); await service.share(document);
  assert.deepEqual(calls.find(call=>call[0]==='open'),['open','android.intent.action.VIEW',{data:'content://pdf-reader/document',type:'application/pdf',flags:1}]);
  assert.equal(calls.find(call=>call[0]==='share')[2].mimeType,'application/pdf');
});

test('cancelled folder selection creates no file and a failed save removes its empty file', async () => {
  const cancelled=fixture();
  cancelled.fs.StorageAccessFramework.requestDirectoryPermissionsAsync=async()=>({granted:false});
  assert.deepEqual(await cancelled.service.save({uri:'file:///cache/a.pdf',name:'a.pdf'}),{cancelled:true});
  assert.equal(cancelled.calls.length,0);
  const failed=fixture({writeAsStringAsync:async()=>{throw Error('full disk');}});
  await assert.rejects(failed.service.save({uri:'file:///cache/a.pdf',name:'a.pdf'}),/full disk/);
  assert.ok(failed.calls.some(call=>call[0]==='delete'&&call[1]==='content://my-chosen-folder/new-pdf'));
});
