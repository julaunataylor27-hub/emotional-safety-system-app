const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/twoFlames.cjs');

test('Two Flames presents independent choice and mutual support, without a relationship score', () => {
  assert.match(M.TITLE, /Two Flames/);
  assert.match(M.QUOTE, /burning itself out/);
  assert.deepEqual(M.PRINCIPLES.map(x => x.id), ['mine','theirs','shared']);
  assert.match(M.PRINCIPLES[0].explanation, /choose my pace/);
  assert.match(M.PRINCIPLES[1].explanation, /without assuming their feelings/);
  assert.match(M.PRINCIPLES[2].explanation, /Neither person owes/);
  assert.match(M.LIMITS, /not a relationship test/);
});
test('Every reflection can be chosen and an invalid selection stays open', () => {
  const ids = M.REFLECTIONS.map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of M.REFLECTIONS) {
    assert.equal(M.findReflection(item.id), item);
    assert.ok(item.question && item.example);
  }
  assert.equal(M.findReflection('unknown'), null);
});
test('Consent, safety and ability to leave remain explicit', () => {
  const all = M.REFLECTIONS.map(x => x.example).join(' ');
  assert.match(all, /accept a no/);
  assert.match(all, /end it/);
  assert.match(M.LIMITS, /seek trusted support/);
});
