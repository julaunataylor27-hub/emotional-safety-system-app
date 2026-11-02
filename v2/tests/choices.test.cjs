'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {processSituation}=require('../src/core/essCore.cjs');
const {buildReflectionReview}=require('../src/core/reflectionReview.cjs');
const app=fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');

test('selected feelings affect user reflection but do not alter independently verified status or safety routing',()=>{
 const text='I tried to leave. They blocked the exit and threatened to hurt me.';
 const base=processSituation({text});
 const selected=processSituation({text,selectedFeelings:['confused','sad'],otherFeeling:'hopeful'});
 assert.deepEqual(selected.emotion.user_selected,['confused','sad','hopeful']);
 assert.ok(selected.emotion.reported_or_detected.includes('hopeful'));
 assert.equal(selected.safety.classification,base.safety.classification);
 assert.equal(selected.safety.urgent,base.safety.urgent);
 assert.equal(selected.input.independently_verified,false);
 assert.equal(selected.decision_record.verified_event,false);
});

test('language cue alone is not presented as a feeling the user selected',()=>{
 const result=processSituation({text:'I feel anxious about not getting a reply.'});
 assert.ok(result.emotion.language_cues.includes('anxious'));
 assert.deepEqual(result.emotion.user_selected,[]);
 assert.ok(result.emotion.note.includes('not verified facts'));
});

test('review records agreement, disagreement and unknown status without certifying evidence',()=>{
 const text='They did not reply.';
 const review=buildReflectionReview({
   selectedFeelings:['confused','sad'],
   interpretationChecks:{'They dislike me':'no','They might be occupied':'fits'},
   unknownChecks:{'Why they have not replied':'open','When they arrived':'known'},
   choicePreview:'Wait for more information.',
   selectedNext:'Not ready yet'
 });
 assert.deepEqual(review.feelings,['confused','sad']);
 assert.equal(review.interpretations[0].status,'Not what I meant');
 assert.equal(review.interpretations[1].status,'That fits');
 assert.equal(review.uncertainties[0].status,'Still open');
 assert.match(review.uncertainties[1].status,/not independently verified/);
 assert.equal(review.focused_option,'Wait for more information.');
 assert.equal(review.left_open,true);
 assert.equal(processSituation({text}).input.independently_verified,false);
});

test('a review is not forced when user skips feelings or leaves decisions open',()=>{
 const review=buildReflectionReview();
 assert.equal(review.has_user_review,false);
 assert.deepEqual(review.feelings,[]);
 assert.equal(review.next_step,'');
 assert.equal(review.left_open,false);
 assert.equal(buildReflectionReview({selectedNext:'Leave it for now'}).left_open,true);
});

test('user selections reach the core and the end-screen summary, rather than decorative controls',()=>{
 assert.match(app,/processSituation\(\{text,selectedFeelings:confirmedFeelings,otherFeeling\}\)/);
 assert.match(app,/buildReflectionReview\(\{selectedFeelings:confirmedFeelings,otherFeeling,interpretationChecks,unknownChecks,choicePreview,selectedNext\}\)/);
 assert.match(app,/review\.interpretations\.map/);
 assert.match(app,/review\.uncertainties\.map/);
 assert.match(app,/review\.feelings\.join/);
 assert.match(app,/tag:'Choice',icon:'◇',review/);
 assert.match(app,/item\.review\?\.feelings/);
 assert.match(app,/setInterpretationChecks\(\{\}\);setUnknownChecks\(\{\}\)/);
 assert.match(app,/const \[text,setText\]=useState\(''\)/);
});

test('How ESS reached this opens explanation; leaving exits without an automatic save',()=>{
 assert.ok(app.includes("setScreen('more','How ESS reached this')"));
 assert.ok(app.includes("setDetail('How ESS reached this')"));
 assert.ok(app.includes('No decision is forced'));
 assert.match(app,/accessibilityLabel="Leave it for now without saving" onPress=\{\(\)=>onNavigate\?\.\('home'\)\}/);
 assert.match(app,/Nothing is saved unless you choose Save this reflection to Journal/);
 assert.match(app,/onSaveJournal\?\.\(/);
});

test('journal entry chevrons open the actual reviewed details',()=>{
 assert.match(app,/function JournalEntryCard\(\{item,accent,onDelete\}\)/);
 assert.match(app,/accessibilityLabel="Review saved journal entry"/);
 assert.match(app,/onPress=\{\(\)=>setExpanded\(v=>!v\)\}/);
 assert.match(app,/\{expanded&&<View style=\{s\.journalExpanded\}>/);
 assert.match(app,/item\.review\?\.interpretations\?\.map/);
 assert.match(app,/item\.review\?\.uncertainties\?\.map/);
});
test('transparency details are visible immediately rather than hidden below the More menu',()=>{
 assert.match(app,/if\(detail\) return <>/);
 assert.match(app,/Back to More menu/);
 assert.match(app,/initialDetail=\{pendingMoreDetail\}/);
 assert.match(app,/if\(id==='more'&&detail\)setPendingMoreDetail\(detail\)/);
});

test('a saved session-only journal entry can be removed by the person after confirmation',()=>{
 assert.match(app,/accessibilityLabel="Delete this saved reflection"/);
 assert.match(app,/Alert\.alert\('Delete this reflection\?'/);
 assert.match(app,/\{text:'Cancel',style:'cancel'\}/);
 assert.match(app,/\{text:'Delete',style:'destructive',onPress:\(\)=>onDelete\?\.\(\)\}/);
 assert.match(app,/setEntries\(current=>current\.filter\(x=>x!==item\)\)/);
});
