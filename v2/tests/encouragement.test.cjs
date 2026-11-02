'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {ENCOURAGEMENT_LESSON,ENCOURAGEMENT_CHOICES,encouragementChoice}=require('../src/data/encouragementGuide.cjs');
const app=fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');
const visual=fs.readFileSync(path.join(__dirname,'../src/visual2027.js'),'utf8');

test('encouragement learning is distinct, evidence-aware and no clinical claim is invented',()=>{
 assert.equal(ENCOURAGEMENT_LESSON.id,'encouragement-stamina');
 assert.equal(ENCOURAGEMENT_LESSON.title,'Encouragement & Emotional Stamina');
 assert.equal(ENCOURAGEMENT_LESSON.related,'Emotional Wellbeing');
 assert.match(ENCOURAGEMENT_LESSON.unknown,/cannot measure resilience/);
 assert.match(ENCOURAGEMENT_LESSON.sourceStatus,/not a clinically validated programme/);
 assert.match(ENCOURAGEMENT_LESSON.reviewStatus,/review pending/);
 for(const src of ENCOURAGEMENT_LESSON.sources){
  assert.match(src.url,/^https:\/\//);
  assert.ok(src.author&&src.checked&&src.role);
 }
 assert.deepEqual(ENCOURAGEMENT_LESSON.sources.map(s=>s.author),[
  'healthdirect Australia','American Psychological Association','World Health Organization'
 ]);
});

test('a person can select rest, acknowledge effort, try a small step or seek support',()=>{
 assert.deepEqual(ENCOURAGEMENT_CHOICES.map(c=>c.id),['notice','pause','step','connection']);
 assert.deepEqual(ENCOURAGEMENT_CHOICES.map(c=>c.action),['journal','learn','core','support']);
 assert.equal(encouragementChoice('unknown'),null);
 for(const c of ENCOURAGEMENT_CHOICES){
  assert.equal(encouragementChoice(c.id),c);
  assert.ok(c.title&&c.message&&c.note&&c.actionLabel);
  assert.ok(!/you (must|should) (push|persist|endure|keep going)/i.test(c.message));
 }
 assert.match(encouragementChoice('pause').message,/Resting/);
 assert.match(encouragementChoice('connection').message,/Asking for help/);
});

test('educational UI is interactive, non-scoring and has an accessible leave-open choice',()=>{
 assert.match(app,/ENCOURAGEMENT_LESSON,image:ART\.emotional/);
 assert.match(app,/trail\.id==='encouragement-stamina'/);
 assert.match(app,/ENCOURAGEMENT_CHOICES\.map/);
 assert.match(app,/accessibilityState=\{\{selected:encouragementId===option\.id\}\}/);
 assert.match(app,/onPress=\{\(\)=>setEncouragementId\(id=>id===option\.id\?null:option\.id\)\}/);
 assert.match(app,/\{encouragement&&<View style=\{s\.encouragementResponse\}>/);
 assert.match(app,/accessibilityLabel="Clear encouragement choice"/);
 assert.match(app,/onPress=\{\(\)=>setEncouragementId\(null\)\}/);
 assert.match(app,/You do not have to feel positive/);
 assert.match(app,/Choosing rest, a boundary, or human help is never a failure/);
 for(const key of ['encouragementPanel','encouragementChoices','encouragementOption','encouragementOptionOn','encouragementResponse','encouragementMessage']){
  assert.ok(visual.includes(key+':'),key+' does not use common 2027 styles');
 }
});

test('an encouragement option opens a real destination, without auto-saving text or notes',()=>{
 assert.match(app,/encouragement\.action==='core'\?onNavigate\?\.\('core',trail\.title\):onNavigate\?\.\(encouragement\.action\)/);
 assert.match(app,/const \[text,setText\]=useState\(''\)/);
 assert.doesNotMatch(app,/onSaveJournal\?\.\(\{when:'Just now',text:encouragement/);
 assert.match(app,/setEncouragementId\(null\)/);
});

test('the optional Core encouragement link never overrides higher-risk safety routing',()=>{
 assert.match(app,/!\['danger','coercion','pressure'\]\.includes\(result\.safety\.classification\)/);
 assert.match(app,/accessibilityLabel="Explore encouragement and emotional stamina"/);
 assert.match(app,/onNavigate\?\.\('learn','Encouragement & Emotional Stamina'\)/);
 assert.match(app,/result\.safety\.urgent/);
 assert.match(app,/onNavigate\?\.\('support'/);
});
