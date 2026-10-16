const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/learningTogether.cjs');

test('practice choices preserve omissions, accept choice zero and reject invalid updates', () => {
  const original = M.createPractice();
  const selected = M.updateAnswer(original, 'encouragement', 0);
  assert.equal(original.answers.encouragement, undefined);
  assert.equal(M.selectedApproach(selected, M.STEPS[0]), M.STEPS[0].options[0].plan);
  const leftOpen = M.updateAnswer(selected, 'encouragement', null);
  assert.match(M.selectedApproach(leftOpen, M.STEPS[0]), /Left open/);
  for (const bad of [-1, 2, '0', {}, undefined]) assert.equal(M.updateAnswer(selected, 'pace', bad), selected);
  assert.equal(M.updateAnswer(selected, 'unrecognised-step', 0), selected);
  assert.deepEqual(M.createPractice().answers, {});
});

test('preview keeps personal words, unknowns and proposed choices separate from outcomes', () => {
  let practice = {...M.createPractice(), topic: 'Learning with my brother', reflection: '<my own words>', unknowns: 'We still need another perspective.', nextStep: 'Ask if he wants to talk.'};
  practice = M.updateAnswer(practice, 'peace', 1);
  const preview = M.practiceText(practice);
  for (const value of [practice.topic, practice.reflection, practice.unknowns, practice.nextStep, 'Fictional', 'unverified', 'not measured outcomes', M.STEPS[5].options[1].plan, 'Left open']) assert.ok(preview.includes(value), value);
  assert.equal((preview.match(/Left open/g) || []).length, 5);
});

test('public learning search finds six principles without receiving private notes', () => {
  for (const query of ['', 'Learning together', 'learn together', 'encouragement', 'pace', 'timing', 'knowledge', 'conversation', 'peace']) assert.equal(M.matchesSearch(query), true);
  for (const query of [null, {}, 2, 'Learning with my brother']) assert.equal(M.matchesSearch(query), false);
});
