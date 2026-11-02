'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {processSituation}=require('../src/core/essCore.cjs');

const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'App.js'),'utf8');

test('end-to-end: uncertainty can route toward Learn while preserving choice',()=>{
 const r=processSituation({text:"He hasn't replied. I think he doesn't care."});
 assert.equal(r.next_pathway,'truth_and_evidence');
 assert.ok(r.uncertainty.unknowns.length>0);
 assert.ok(r.recommendations.some(x=>x.destination==='learn'));
 assert.equal(r.choice.user_remains_in_control,true);
});

test('end-to-end: pressure routes toward boundary support',()=>{
 const r=processSituation({text:'I said I need space but they keep asking me to explain my feelings right now even after I asked them to stop.'});
 assert.equal(r.safety.classification,'pressure');
 assert.equal(r.next_pathway,'boundaries_and_choice');
 assert.ok(r.recommendations.some(x=>x.destination==='support'));
});

test('end-to-end: coercion routes toward stronger support',()=>{
 const r=processSituation({text:"If you don't explain your feelings right now, I'll spread lies about you and make sure your friends turn against you."});
 assert.equal(r.safety.classification,'coercion');
 assert.equal(r.next_pathway,'safety_and_support');
 assert.ok(r.recommendations.some(x=>x.destination==='support'));
});

test('end-to-end: immediate danger routes urgently',()=>{
 const r=processSituation({text:'I asked for space and tried to leave. The other person blocked the exit and threatened to hurt me.'});
 assert.equal(r.safety.classification,'danger');
 assert.equal(r.safety.urgent,true);
 assert.equal(r.next_pathway,'urgent_safety');
});

test('end-to-end: app exposes connected destinations and journal handoff',()=>{
 for(const phrase of ['Save this reflection to Journal','Explore a learning trail','View support options','Review what you saved','Return to the start','Leave it for now']) assert.ok(app.includes(phrase));
 assert.match(app,/pendingLearnTrail/);
 assert.match(app,/pendingSupportMode/);
 assert.match(app,/journalEntries/);
});

test('end-to-end: journal history remains non-scoring and filterable',()=>{
 assert.match(app,/What has been showing up\?/);
 assert.match(app,/not a score, diagnosis or judgement/i);
 for(const label of ['Reflection','Boundary','Uncertainty','Choice']) assert.ok(app.includes(label));
});

test('end-to-end: key interactive controls include accessibility labels or roles',()=>{
 assert.match(app,/accessibilityLabel="Start a reflection"/);
 assert.match(app,/accessibilityRole="tab"/);
 assert.match(app,/journal filter/);
 assert.match(app,/support mode/);
});
