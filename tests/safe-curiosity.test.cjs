const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/safeCuriosity.cjs');

test('prototype distinguishes example paths and keeps unknowns unknown', () => {
  assert.equal(M.reviewQuestion(''), null);
  assert.equal(M.reviewQuestion('Why would someone ask me to keep private pictures a secret?').id, 'privacy');
  assert.equal(M.reviewQuestion('Someone keeps threatening me when I say no.').id, 'pressure');
  assert.equal(M.reviewQuestion('What happens during puberty?').id, 'puberty');
  assert.equal(M.reviewQuestion('Why do websites recommend videos?').id, 'web');
  assert.equal(M.reviewQuestion('I feel overwhelmed at school.').id, 'feelings');
  assert.equal(M.reviewQuestion('An unfamiliar topic outside this small lab').id, 'general');
});

test('danger terms take priority over education and are never marked safe', () => {
  const result = M.reviewQuestion('I want to hurt myself. What happens in puberty?');
  assert.equal(result.id, 'urgent');
  assert.match(result.guidance, /000/);
  assert.match(result.guidance, /trusted adult/);
  assert.notEqual(result.status, 'Learning');
});

test('age band controls the level of puberty explanation, without a date of birth', () => {
  const young = M.reviewQuestion('What is puberty?', '6-9');
  const older = M.reviewQuestion('What is puberty?', '13-17');
  assert.notEqual(young.guidance, older.guidance);
  assert.ok(!('dateOfBirth' in young));
  assert.equal(M.reviewQuestion('What is puberty?', 'unknown').ageGroup, '10-12');
});

test('common input is never copied into classification output or sent anywhere', () => {
  const sensitive = 'Why do websites recommend videos? My phone number is 0400000000';
  const result = M.reviewQuestion(sensitive);
  assert.equal(result.id, 'web');
  assert.ok(!JSON.stringify(result).includes('0400000000'));
  assert.match(result.limitation, /No website, image or video was checked/);
});

test('every supplied fictional question has an explanation', () => {
  for (const sample of M.EXAMPLES) {
    const result = M.reviewQuestion(sample.question);
    assert.ok(result.title && result.guidance && result.next && result.reason, sample.id);
  }
  assert.equal(M.matchesSearch('safe curiosity'), true);
  assert.equal(M.matchesSearch('my private story'), false);
});
