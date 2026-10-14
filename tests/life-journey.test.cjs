const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../src/lifeJourney.cjs');
const {MEMORY_KEY,decodeMemory,createLifeJourneyStore}=require('../src/lifeJourneyMemory.cjs');
const {buildLifeJourneyPdfHtml}=require('../src/lifeJourneyPdf.cjs');

function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}

test('unknown childhood and posthumous emotions stay unassigned even in imported notes',()=>{
  const notes=M.sanitiseNotes({'early-life':{reflection:'A question, not a finding',feelings:['Anger']},letters:{feelings:['Grief']},country:{feelings:['Distress','diagnosed trauma'],type:'confirmed',reflection:7},outsider:{reflection:'invalid chapter'}});
  assert.deepEqual(notes['early-life'].feelings,[]);
  assert.deepEqual(notes.letters.feelings,[]);
  assert.deepEqual(notes.country.feelings,['Distress']);
  assert.equal(notes.country.type,'family');
  assert.equal(notes.country.reflection,'');
  assert.equal(notes.outsider,undefined);
  assert.equal(M.getNote(M.sanitiseNotes({country:{reflection:'x'.repeat(13000)}}),M.stages[1]).reflection.length,12000);
});

test('every chapter retains alternatives, unknowns and valid sources rather than a single emotional conclusion',()=>{
  const ids=new Set(M.sources.map(source=>source.id));
  assert.equal(ids.size,8);assert.equal(M.stages.length,7);
  for(const stage of M.stages){
    assert.equal(stage.readings.length,2);assert.ok(stage.unknown);assert.ok(stage.limits);
    assert.equal(M.lessonQuestions(stage).length,2);
    assert.deepEqual(Object.keys(stage.signals),['Truth','Choice','Boundaries','Coercion','Dependency','Safety']);
    for(const id of stage.sources)assert.ok(ids.has(id));
  }
  for(const source of M.sources)for(const [,url] of source.links)assert.equal(new URL(url).protocol,'https:');
  assert.match(M.stages.at(-1).readings.join(' '),/pseudoscience/);
  assert.match(M.stages[4].record,/I regret I could not understand it/);
});

test('PDF and text exports retain the whole reflection and label additional knowledge without accepting markup',()=>{
  const notes={country:{reflection:'Country <home> & family\n<script>bad()</script>',additional:'A family question',type:'culture',feelings:['Protectiveness']}};
  const html=buildLifeJourneyPdfHtml(notes,new Date('2026-10-14T10:00:00Z'));
  const text=M.exportText(notes);
  assert.equal((html.match(/<section>/g)||[]).length,7);
  assert.ok(html.includes('Country &lt;home&gt; &amp; family\n&lt;script&gt;bad()&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('Cultural guidance - unverified in this tool'));
  assert.ok(html.includes('Selected possible feelings - not findings'));
  assert.ok(html.includes('Possible reading 2 - keep both open'));
  assert.ok(html.includes('Evidence limit'));
  assert.ok(html.includes('Choice - reflection question'));
  assert.ok(text.includes('SIX REFLECTION SIGNALS (QUESTIONS, NOT SCORES)'));
  assert.ok(text.includes('EVIDENCE LIMIT:'));
  assert.ok(text.includes('A family question'));
  for(const source of M.sources)for(const [,url] of source.links){assert.ok(text.includes(url));assert.ok(html.includes(M.escapeHTML(url)));}
});

test('malformed or future-version memory fails closed, preserving the existing data for recovery',()=>{
  assert.deepEqual(decodeMemory(null),{});
  for(const raw of ['bad JSON','null','{"version":2,"notes":{}}','{"version":1,"notes":[]}'])assert.throws(()=>decodeMemory(raw));
  assert.deepEqual(decodeMemory('{"version":1,"notes":{"country":{"reflection":"Keep me"}}}').country.reflection,'Keep me');
});

test('reopening a screen waits for queued notes and rapid writes cannot restore an older draft',async()=>{
  const first=deferred(),started=deferred(),disk=new Map(),writes=[];
  let calls=0;
  const storage={getItem:async key=>disk.get(key)??null,setItem:async(key,value)=>{writes.push(value);if(calls++===0){started.resolve();await first.promise;}disk.set(key,value);}};
  const store=createLifeJourneyStore(storage);
  assert.equal(createLifeJourneyStore(storage),store);
  const a=store.save({country:{reflection:'first draft'}});
  const b=store.save({country:{reflection:'latest draft'}});
  let restored=false;const reopening=store.load().then(notes=>{restored=true;return notes;});
  await started.promise;assert.equal(restored,false);assert.equal(writes.length,1);
  first.resolve();await Promise.all([a,b]);
  assert.equal((await reopening).country.reflection,'latest draft');
  assert.equal(JSON.parse(disk.get(MEMORY_KEY)).notes.country.reflection,'latest draft');
});

test('a storage failure rejects that write but does not poison retry or overwrite the personal journey',async()=>{
  const personalKey=require('../src/journeyMemory').MEMORY_KEY;
  const disk=new Map([[personalKey,'keep personal journey']]);let failed=true;
  const store=createLifeJourneyStore({getItem:async key=>disk.get(key)??null,setItem:async(key,value)=>{if(failed)throw Error('disk full');disk.set(key,value);}});
  await assert.rejects(store.save({country:{reflection:'retry this'}}),/disk full/);
  assert.equal(disk.get(MEMORY_KEY),undefined);
  failed=false;await store.save({country:{reflection:'retry this'}});
  assert.equal((await store.load()).country.reflection,'retry this');
  assert.equal(disk.get(personalKey),'keep personal journey');
});
