const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/knowledgeTrail.cjs');

test('the learning example attributes claims, keeps uncertainty and separates our interpretation', () => {
  assert.deepEqual(M.STEPS.map(step => step.id), ['question', 'sources', 'evidence', 'connections', 'choice']);
  for (const step of M.STEPS) {
    assert.ok(step.prompt && step.hint && step.tim.prompt);
    for (const id of step.tim.sources) {
      const source = M.SOURCES[id];
      assert.ok(source.label && source.date && source.kind && source.locator && source.scope);
      assert.equal(new URL(source.url).hostname, 'www.w3.org');
    }
  }
  assert.match(M.STEPS[2].tim.unknown, /do not establish a complete algorithm/);
  assert.match(M.STEPS[3].tim.interpretation, /our reading/);
  assert.match(M.META.scope, /not his own named method/);
});

test('user source links reject active content, credentials and non-https addresses', () => {
  for (const value of ['', null, {}, 'javascript:alert(1)', 'file:///etc/passwd', 'http://example.com', 'https://user:pass@example.com']) assert.equal(M.externalUrl(value), null);
  assert.equal(M.externalUrl(' https://www.w3.org/People/Berners-Lee/Kids.html '), M.SOURCES.questions.url);
});

test('export preserves the person’s words and missing evidence without inventing a finding', () => {
  const trail = {...M.createTrail(), question: 'How do I check this?', connections: '<my interpretation>', unknowns: 'The date is unknown.'};
  const text = M.trailText(trail);
  for (const value of [trail.question, trail.connections, trail.unknowns, 'Not recorded', 'unverified', 'does not establish']) assert.ok(text.includes(value));
  assert.equal(M.createTrail().question, '', 'Fresh notes do not inherit another trail');
});

test('public search includes the example without searching private writing', () => {
  for (const query of ['', 'knowledge trail', 'Berners', 'Lee', 'Tim', 'curiosity', 'internet']) assert.equal(M.matchesSearch(query), true);
  for (const query of [null, {}, 1, 'my private question']) assert.equal(M.matchesSearch(query), false);
});
