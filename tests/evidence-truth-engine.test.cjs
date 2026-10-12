'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { EXAMPLES, assessEvidence } = require('../src/evidenceTruthEngine.cjs');

const byId = id => {
  const item = EXAMPLES.find(x => x.id === id);
  return assessEvidence({text:item.text,exampleId:item.id,feeling:'Not specified'});
};

test('fictional example: respected boundary stays a qualified low concern',()=>{
  const r=byId('healthy');
  assert.equal(r.kind,'healthy');
  assert.equal(r.urgent,false);
  assert.match(r.interpretation,/does not prove/i);
});
test('fictional example: persistent emotional pressure is a possible boundary concern',()=>{
  const r=byId('pressure');
  assert.equal(r.kind,'pressure');
  assert.match(r.interpretation,/does not establish/i);
});
test('fictional example: threat of retaliation is a serious concern, not a diagnosis',()=>{
  const r=byId('coercion');
  assert.equal(r.kind,'coercion');
  assert.match(r.interpretation,/further evidence/i);
});
test('fictional example: physical threat escalates to urgent safety guidance',()=>{
  const r=byId('danger');
  assert.equal(r.kind,'danger');
  assert.equal(r.urgent,true);
  assert.match(r.options.join(' '),/000/);
});
test('editable custom description can raise boundary concern',()=>{
  const r=assessEvidence({text:'I asked for space and they kept asking me to explain. I asked them to stop.'});
  assert.equal(r.kind,'pressure');
});
test('insufficient details remain unknown; not automatically safe',()=>{
  const r=assessEvidence({text:'Someone was upset.'});
  assert.equal(r.kind,'insufficient');
  assert.match(r.interpretation,/not proof of safety/i);
});
test('blank descriptions produce no findings',()=>{
  const r=assessEvidence({text:'  '});
  assert.equal(r.kind,'insufficient');
  assert.equal(r.proof,'Not independently verified');
});
test('feelings are kept separate from behavioural evidence',()=>{
  const r=assessEvidence({text:'Someone seemed strange.',feeling:'Scared'});
  assert.equal(r.kind,'insufficient');
  assert.match(r.feelings,/Self-selected feeling/);
  assert.match(r.feelings,/not evidence/i);
});
test('negated physical threat does not trigger emergency classification',()=>{
  const r=assessEvidence({text:'I did not block the exit. We talked calmly.'});
  assert.notEqual(r.kind,'danger');
});
test('positive danger after an unrelated negation still escalates',()=>{
  const r=assessEvidence({text:'I did not block the exit. Then they threatened to hurt me.'});
  assert.equal(r.kind,'danger');
});
test('input has a finite, privacy-conscious length and is not verified',()=>{
  const r=assessEvidence({text:'x'.repeat(4000)});
  assert.equal(r.reported.length < 2700,true);
  assert.match(r.proof,/not independent/i);
});
test('the screen is reachable from the app menus without deleting old features',()=>{
  const app = fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');
  const screen = fs.readFileSync(path.join(__dirname,'../src/EvidenceTruthScreen.js'),'utf8');
  assert.match(app,/screen==='evidence'/);
  assert.match(app,/EvidenceTruthScreen/);
  assert.match(app,/title="New Assessment"|New Assessment/);
  assert.match(app,/title="Support Resources"/);
  assert.match(screen,/onSupport/);
  assert.match(screen,/not upload or automatically save/i);
});
