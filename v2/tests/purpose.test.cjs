'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {ESS_PURPOSE}=require('../src/data/essPurpose.cjs');
const app=fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');
const style=fs.readFileSync(path.join(__dirname,'../src/visual2027.js'),'utf8');

test('founder-selected reason for ESS exists verbatim with dated adoption, not invented early provenance',()=>{
 assert.equal(ESS_PURPOSE.title,'Why ESS Exists');
 assert.equal(ESS_PURPOSE.statement,"Strength isn't always pushing forward. Sometimes it's recognising your effort, allowing yourself to recover, and choosing what comes next.");
 assert.equal(ESS_PURPOSE.adopted,'2 November 2026');
 assert.match(ESS_PURPOSE.status,/current|Founder-selected/i);
 assert.match(ESS_PURPOSE.status,/not proven clinical outcomes/);
 assert.match(ESS_PURPOSE.status,/earliest drafts/);
 assert.match(ESS_PURPOSE.mission,/The Emotional Safety System was created to help people/);
});
test('ESS purpose includes all three user-guided principles without coercive or harmful optimism',()=>{
 assert.deepEqual(ESS_PURPOSE.principles,[
  'The system guides. The human decides.',
  'One question can open many doors. The person chooses which door to enter.',
  'Every experience can create an opportunity for understanding, learning and positive growth.'
 ]);
 const commitments=ESS_PURPOSE.commitments.join(' ');
 assert.match(commitments,/No one has to feel positive/);
 assert.match(commitments,/A pause, a boundary, asking for help/);
 assert.match(commitments,/Safety comes before exercises/);
 assert.match(commitments,/cannot|do not|do not|the person|Feelings matter/i);
});
test('Home purpose link opens an actual More detail instead of decorative text',()=>{
 assert.match(app,/accessibilityLabel="Why the Emotional Safety System exists"/);
 assert.match(app,/onPress=\{\(\)=>setScreen\('more','Why ESS Exists'\)\}/);
 assert.match(app,/\[ESS_PURPOSE.title\]:\{/);
 assert.match(app,/\[ESS_PURPOSE.title,'The reason this system was created'/);
 assert.match(app,/detail===ESS_PURPOSE.title/);
 assert.match(app,/ESS_PURPOSE.statement/);
 assert.match(app,/ESS_PURPOSE.mission/);
 assert.match(app,/ESS_PURPOSE.principles.map/);
 assert.match(app,/ESS_PURPOSE.commitments/);
});
test('new purpose stays within one five-tab ESS layout and does not change safety routing',()=>{
 for(const rule of ['purposeHomeLink:','purposeStatement:','purposeQuote:','purposePrinciples:'])assert.ok(style.includes(rule),rule);
 assert.match(app,/height=\{300\}/);
 assert.match(app,/ESS_V2_2027_FULL_APP_VISUAL_CONTRACT/);
 assert.match(app,/result\.safety\.urgent/);
 assert.match(app,/!\['danger','coercion','pressure'\]\.includes\(result\.safety\.classification\)/);
 assert.match(app,/const \[journalEntries,setJournalEntries\]=useState\(\[\]\)/);
 assert.doesNotMatch(app,/autoSavePurpose|uploadPurpose|Promise\.all\(.*journalEntries/);
});
