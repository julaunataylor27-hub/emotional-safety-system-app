'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {processSituation} = require('../src/essCore.cjs');

test('decision record exposes versioned rules without claiming verification', () => {
  const r = processSituation({text:'I asked for space and they kept asking after I asked them to stop.'});
  assert.equal(r.decision_record.architecture_version,'ess-architecture-v2');
  assert.equal(r.decision_record.core_version,'ess-core-v2');
  assert.equal(r.decision_record.verified_event,false);
  assert.equal(r.decision_record.user_control_preserved,true);
  assert.ok(r.decision_record.rule_ids.length > 0);
});

test('research snapshot is aggregate-only and does not include raw text', () => {
  const secret = 'PERSONAL RAW TEXT 123';
  const r = processSituation({text:secret});
  const json = JSON.stringify(r.research_snapshot);
  assert.equal(json.includes(secret),false);
  assert.equal(typeof r.research_snapshot.uncertainty_count,'number');
  assert.equal(typeof r.research_snapshot.choice_count,'number');
});

test('uncertainty and interpretations remain independently measurable', () => {
  const r = processSituation({text:"They did not reply. I think they hate me."});
  assert.equal(r.research_snapshot.reported_information_count,1);
  assert.equal(r.research_snapshot.interpretation_count,1);
  assert.ok(r.research_snapshot.uncertainty_count >= 1);
});
