const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../src/culturalConnections.cjs');

test('every cultural view, node and glossary item resolves to a public HTTPS source',()=>{
 assert.equal(Object.keys(M.views).length,10);assert.equal(M.words.length,20);assert.equal(Object.keys(M.sources).length,21);
 assert.deepEqual(M.VIEW_OPTIONS.map(([id])=>id),Object.keys(M.views));
 for(const [id,view] of Object.entries(M.views)){
  assert.ok(['documented','comparison'].includes(view.type),id);
  assert.ok(M.sources[view.source],id);
  for(const item of view.nodes)assert.ok(M.sources[item.source],id+': '+item.label);
 }
 for(const word of M.words)assert.ok(M.sources[word[3]],word[0]);
 for(const [label,url] of [...Object.values(M.sources),...M.READING_LINKS.map(([,label,url])=>[label,url])]){
  assert.equal(new URL(url).protocol,'https:',label);assert.ok(label);
 }
});

test('educational draft, interpretive comparisons and source-only use limits remain explicit',()=>{
 assert.match(M.META.status,/Research draft/);
 assert.match(M.META.review,/Cultural review, reuse permissions and legal review pending/);
 assert.match(M.META.scope,/not a genealogy or boundary map/);
 assert.match(M.META.limits,/do not establish a shared bloodline/);
 assert.equal(M.evidenceLabel('ngarrindjeri',true),'Source pointer · Use guidance pending');
 assert.equal(M.evidenceLabel('yawuru',true),'Our thematic comparison · Cultural review pending');
 for(const word of M.words.filter(word=>M.SOURCE_POINTERS.includes(word[3])))assert.match(word[2],/Use guidance is pending/);
 assert.match(M.views.care.nodes.find(item=>item.source==='yamaji').detail,/one named voice/);
});

test('learning search matches public names and concepts without any personal input',()=>{
 for(const query of ['Yamatji','Noongar','kinship','Yannarumi','mabu liyan','Seven Sisters'])assert.equal(M.matchesSearch(query),true,query);
 assert.equal(M.matchesSearch('a private journal entry which was never supplied'),false);
 assert.equal(M.matchesSearch(''),true);
});
