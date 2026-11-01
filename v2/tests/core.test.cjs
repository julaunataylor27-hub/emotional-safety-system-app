'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {processSituation}=require('../src/core/essCore.cjs');

test('v2 core preserves emotion evidence interpretation uncertainty choice',()=>{
 const r=processSituation({text:"He hasn't replied for 6 hours. I feel rejected and I think he doesn't care."});
 assert.ok(r.emotion.reported_or_detected.includes('rejected'));
 assert.ok(r.interpretation.possible_interpretations.length>0);
 assert.ok(r.uncertainty.unknowns.length>0);
 assert.equal(r.choice.user_remains_in_control,true);
 assert.equal(r.input.independently_verified,false);
});

test('v2 core preserves urgent safety routing',()=>{
 const r=processSituation({text:'I tried to leave. They blocked the exit and threatened to hurt me.'});
 assert.equal(r.safety.urgent,true);
 assert.equal(r.next_pathway,'urgent_safety');
});

test('v2 research snapshot excludes raw input',()=>{
 const secret='PRIVATE TEST TEXT 987';
 const r=processSituation({text:secret});
 assert.equal(JSON.stringify(r.research_snapshot).includes(secret),false);
 assert.equal(r.decision_record.verified_event,false);
});
