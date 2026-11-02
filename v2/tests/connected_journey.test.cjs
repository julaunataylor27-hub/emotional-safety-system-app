'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {CONNECTION_STEPS,connectionStep}=require('../src/data/connectionPath.cjs');
const {CURATED_MODULES}=require('../src/data/knowledgeLibrary.cjs');
const app=fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');
const visual=fs.readFileSync(path.join(__dirname,'../src/visual2027.js'),'utf8');
const topics=new Set(['Culture & Country','History & Truth','Emotional Wellbeing','Rights & Systems','Everyday Tools',...CURATED_MODULES.map(x=>x.title)]);
test('six optional clues connect to real modules and preserve freedom of choice',()=>{
 assert.equal(CONNECTION_STEPS.length,6);
 assert.deepEqual(CONNECTION_STEPS.map(x=>x.id),['spark','clues','sources','other-paths','meaning','choice']);
 for(const [i,step] of CONNECTION_STEPS.entries()){
  assert.ok(step.title&&step.prompt&&step.helps&&step.label&&step.hint);
  assert.equal(connectionStep(i),step);
  assert.ok(['core','learn','journal','support'].includes(step.destination));
  if(step.destination==='learn')assert.ok(topics.has(step.target),'Unknown target '+step.target);
 }
 assert.equal(connectionStep(99),null);
});
test('Connection Trail is selectable, reversible and never blocks a route',()=>{
 assert.match(app,/trail\.id==='connection-trail'/);
 assert.match(app,/CONNECTION_STEPS\.map/);
 assert.match(app,/setClueIndex\(i=>Math\.max\(0,i-1\)\)/);
 assert.match(app,/setClueIndex\(i=>Math\.min\(CONNECTION_STEPS\.length-1,i\+1\)\)/);
 assert.match(app,/onPress=\{onBack\} style=\{s\.leaveOpenButton\}/);
 assert.match(app,/accessibilityLabel=\{'Open clue '/);
 assert.match(app,/openClue\(selectedClue\)/);
 assert.match(app,/No progress score, surveillance or automatic saving/i);
});
test('new routes connect blank Core, Learn, Journal and Support without text transfer',()=>{
 assert.match(app,/if\(id==='core'\)\{setReturnTrail\(detail\|\|null\);setScreen\('home'\);setCoreOpen\(true\);return;\}/);
 assert.match(app,/onNavigate\?\.\('learn',next\.title\)/);
 assert.match(app,/onNavigate\?\.\('core',trail\.title\)/);
 assert.match(app,/onNavigate\?\.\('support'\)/);
 assert.match(app,/onNavigate\?\.\(clue\.destination\)/);
 assert.match(app,/const \[text,setText\]=useState\(''\)/);
 assert.match(app,/routeRevision=\{routeRevision\}/);
 assert.match(app,/key=\{screen\+"-"\+routeRevision\}/);
 assert.match(app,/onBack=\{\(\)=>returnTrail\?go\('learn',returnTrail\):go\('home'\)\}/);
 assert.ok(!app.includes('setText(clue.prompt)'));
});
test('connection navigation shares the complete 2027 visual identity',()=>{
 for(const key of ['connectionChapters','connectionChip','connectionChipOn','connectionSelected','disabledStep']){
  assert.ok(visual.includes(key+':'),key+' missing shared style');
 }
 assert.match(app,/ESS_V2_2027_FULL_APP_VISUAL_CONTRACT/);
 assert.doesNotMatch(app,/assets\/graphics\/australian-humanity/);
});

test('connected APK uses separate Android package to protect the approved installed app',()=>{
 const identity=JSON.parse(fs.readFileSync(path.join(__dirname,'../app.json'),'utf8'));
 assert.equal(identity.expo.android.package,'au.com.emotionalsafetysystem.v2.connected');
 assert.equal(identity.expo.android.versionCode,2);
 const doc=fs.readFileSync(path.join(__dirname,'../CONTENT_INTEGRATION.md'),'utf8');
 assert.ok(doc.includes('ess-v2-layout-locked-20261102'));
});

test('System Map has real routes and does not create a sixth navigation tab',()=>{
 assert.match(app,/detail==='System Map'/);
 assert.match(app,/One system · six useful pathways/);
 assert.match(app,/onNavigate\?\.\(target,subtarget\)/);
 assert.match(app,/onNavigate=\{go\}/);
 for(const label of ['Understand','Evidence','Learn','Reflect','Support','Connection Trail']){
  assert.ok(app.includes("['"+label+"',"),'Missing pathway: '+label);
 }
 assert.match(app,/function More\(\{initialDetail,onConsumeInitialDetail,onNavigate\}\)/);
 assert.match(visual,/systemMapAction:/);
 assert.ok(!app.includes("['map','Map'"));
});

test('returning from Core restores the learning topic without transferring reading into reflection',()=>{
 assert.match(app,/setReturnTrail\(detail\|\|null\)/);
 assert.match(app,/returnTrail=\{returnTrail\}/);
 assert.match(app,/onBack=\{\(\)=>returnTrail\?go\('learn',returnTrail\):go\('home'\)\}/);
 assert.match(app,/onNavigate\?\.\('learn',returnTrail\)/);
 assert.match(app,/const \[text,setText\]=useState\(''\)/);
 assert.ok(!app.includes('setText(trail.helps)'));
});
