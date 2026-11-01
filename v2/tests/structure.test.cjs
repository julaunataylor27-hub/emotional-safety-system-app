'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('v2 is a clean five-tab app shell',()=>{
 const app=read('App.js');
 for(const label of ['Home','Journal','Learn','Support','More']) assert.match(app,new RegExp("'"+label+"'"));
 assert.ok(!app.includes('home-support-now'));
 assert.ok(!app.includes("['evidence','Evidence']"));
 assert.match(app,/You’re in the right place\./);
 assert.match(app,/home-hero\.webp/);
 assert.match(app,/You’re in the right place\./);
});

test('v2 imports only its own core and theme plus approved raw media',()=>{
 const app=read('App.js');
 assert.match(app,/\.\/src\/core\/essCore\.cjs/);
 assert.match(app,/\.\/src\/theme/);
 assert.ok(!app.includes('../src/'));
 assert.match(app,/assets\/graphics\/australian-humanity\/home-hero\.webp/);
 assert.ok(!app.includes('patch_'));
});

test('v2 explicitly rejects v1 layout migration',()=>{
 const readme=read('README.md');
 assert.match(readme,/Do not import v1 screen layouts/);
 assert.match(readme,/Do not run v1 UI patch scripts against v2/);
});


test('v2 premium visual system stays restrained and non-sci-fi',()=>{
 const app=read('App.js');
 assert.match(app,/ImageBackground/);
 assert.match(app,/History & Truth/);
 assert.match(app,/How ESS reached this/);
 assert.ok(!app.includes('signal-orbit'));
 assert.ok(!app.includes('orbit-ring'));
 assert.ok(!app.includes('home-support-now'));
});


test('v2 uses the new Australian earth palette and rejects the old navy gold teal identity',()=>{
 const theme=read('src/theme.js');
 assert.match(theme,/bg:'#0A0907'/);
 assert.match(theme,/sand:'#D8C2A0'/);
 assert.match(theme,/eucalyptus:'#78927E'/);
 assert.match(theme,/clay:'#B66A4D'/);
 assert.match(theme,/ochre:'#C58D49'/);
 assert.ok(!theme.includes("gold:'#D9A93F'"));
 assert.ok(!theme.includes("teal:'#268E8C'"));
 assert.ok(!theme.includes("bg:'#071014'"));
});


test('2027 frame is the locked visual source of truth',()=>{
 const guide=fs.readFileSync(path.join(root,'..','docs','ESS_V2_2027_VISUAL_SOURCE_OF_TRUTH.md'),'utf8');
 assert.match(guide,/LOCKED DESIGN REFERENCE/);
 assert.match(guide,/Human on the surface\. Rigorous underneath\./);
 assert.match(guide,/Home\n2\. Journal\n3\. Learn\n4\. Support\n5\. More/);
 assert.match(guide,/retired navy \/ gold \/ teal identity must not return/);
 assert.match(guide,/avoids sci-fi \/ orbit \/ dashboard motifs/);
});


test('v2 uses a guided eight-stage ESS Core',()=>{
 const app=read('App.js');
 assert.match(app,/STEP \{step\+1\} OF 8/);
 assert.match(app,/What do we actually know\?/);
 assert.match(app,/What might be interpretation\?/);
 assert.match(app,/What is still uncertain\?/);
 assert.match(app,/What choices are still yours\?/);
 assert.match(app,/What feels like the next step\?/);
 assert.match(app,/I’m not ready to choose yet\./);
});


test('Core saves reflections into Journal and supports reviewed interpretation and uncertainty',()=>{
 const app=read('App.js');
 assert.match(app,/That fits/);
 assert.match(app,/Not what I meant/);
 assert.match(app,/Keep open/);
 assert.match(app,/I know this now/);
 assert.match(app,/Save this reflection to Journal/);
 assert.match(app,/journalEntries/);
 assert.match(app,/onSaveJournal/);
 assert.match(app,/COMPARE YOUR OPTIONS/);
});


test('Core routes into the rest of ESS without removing user choice',()=>{
 const app=read('App.js');
 assert.match(app,/Explore a learning trail/);
 assert.match(app,/View support options/);
 assert.match(app,/Where would you like to go next\?/);
 assert.match(app,/Review what you saved/);
 assert.match(app,/Explore more context/);
 assert.match(app,/See support options/);
 assert.match(app,/Return to the start/);
 assert.match(app,/Leave it for now/);
 assert.match(app,/onNavigate=\{go\}/);
});


test('v2 UI shows explainable destination recommendations and versions',()=>{
 const app=read('App.js');
 assert.match(app,/SUGGESTED/);
 assert.match(app,/recommendation\?\.reason/);
 assert.match(app,/Core version:/);
 assert.match(app,/Architecture version:/);
});


test('Learn uses guided evidence-aware trails and Core can target a trail',()=>{
 const app=read('App.js');
 assert.match(app,/WHAT IS THIS HELPING ME DO\?/);
 assert.match(app,/WHAT THIS HELPS YOU UNDERSTAND/);
 assert.match(app,/WHAT IS STILL UNCERTAIN\?/);
 assert.match(app,/SOURCE STATUS/);
 assert.match(app,/SOURCE DISCIPLINE ON/);
 assert.match(app,/RELATED TRAIL/);
 assert.match(app,/pendingLearnTrail/);
 assert.match(app,/initialTrail/);
});


test('Support uses context-aware pathways and preserves choice',()=>{
 const app=read('App.js');
 assert.match(app,/CALM SUPPORT/);
 assert.match(app,/BOUNDARY \/ PRESSURE/);
 assert.match(app,/STRONGER SUPPORT/);
 assert.match(app,/URGENT SAFETY/);
 assert.match(app,/Support is available, not compulsory/);
 assert.match(app,/pendingSupportMode/);
 assert.match(app,/initialMode/);
});
