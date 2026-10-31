'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { processSituation, separateStatements, pathwayFor } = require('../src/essCore.cjs');

test('separates interpretation from reported information', () => {
  const r = processSituation({
    text: "He hasn't replied for 6 hours. I feel rejected and I think he doesn't care."
  });
  assert.equal(r.input.independently_verified, false);
  assert.ok(r.emotion.reported_or_detected.includes('rejected'));
  assert.ok(r.interpretation.possible_interpretations.length > 0);
  assert.equal(r.choice.user_remains_in_control, true);
  assert.equal(r.next_pathway, 'truth_and_evidence');
});

test('routes existing urgent classification to urgent safety', () => {
  const r = processSituation({
    text: 'I tried to leave. They blocked the exit and threatened to hurt me.'
  });
  assert.equal(r.safety.urgent, true);
  assert.equal(r.next_pathway, 'urgent_safety');
});

test('routes repeated pressure to boundaries and choice', () => {
  const r = processSituation({
    text: 'I asked for space and they kept asking me to explain after I asked them to stop.'
  });
  assert.equal(r.safety.classification, 'pressure');
  assert.equal(r.next_pathway, 'boundaries_and_choice');
});

test('never claims independent verification', () => {
  const r = processSituation({ text: 'Someone seemed upset.' });
  assert.equal(r.input.independently_verified, false);
  assert.match(r.evidence.verification_status, /not independently|no independent/i);
});

test('statement separator preserves distinct categories', () => {
  const s = separateStatements("They did not reply. I think they hate me.");
  assert.equal(s.reported.length, 1);
  assert.equal(s.interpretations.length, 1);
});

test('each known classification maps to a pathway', () => {
  for (const kind of ['healthy','pressure','coercion','danger','insufficient']) {
    assert.ok(pathwayFor(kind));
  }
});
