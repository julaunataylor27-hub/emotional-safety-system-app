const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/exploreConnections.cjs');

test('every connection has a valid destination and an explanation, and all parts are reachable', () => {
  const reached = new Set(['question']);
  for (let i = 0; i < M.NODES.length; i++) for (const id of [...reached]) {
    for (const link of M.related(id)) {
      assert.ok(M.node(link.from)); assert.ok(M.node(link.to));
      assert.ok(link.label && link.why && link.target); reached.add(link.target.id);
    }
  }
  assert.equal(reached.size, M.NODES.length);
  assert.equal(new Set(M.LINKS.map(x => x.id)).size, M.LINKS.length);
});
test('visiting follows a reversible path without changing notes, and rejects unknown nodes', () => {
  const original = M.createExploration();
  const start = M.visit(original, 'question');
  const next = M.visit(start, 'knowledge');
  const after = M.visit(next, 'evidence');
  assert.deepEqual(original.visited, []);
  assert.deepEqual(after.visited, ['question', 'knowledge', 'evidence']);
  assert.equal(M.goBack(after).nodeId, 'knowledge');
  assert.equal(M.goBack(M.goBack(after)).nodeId, 'question');
  assert.equal(M.goBack(start).view, 'intro');
  assert.equal(M.goBack(original), null);
  assert.equal(M.visit(after, 'invalid'), after);
  assert.deepEqual(M.visit(after, 'question').visited, after.visited);
  assert.deepEqual(M.goBack({...after, paused: true}), {...after, paused: false});
});
test('reflection exports fresh unverified notes and preserves unanswered fields and source limits', () => {
  const original = M.createExploration();
  let state = M.updateNote(original, 'question', '<my own question>');
  state = M.updateNote(state, 'unknowns', 'Intentions remain unknown.');
  state = M.visit(state, 'unknowns');
  const text = M.reflectionText(state);
  for (const item of ['<my own question>', 'Intentions remain unknown.', 'unverified', 'fictional', 'Left open', M.SOURCES.respect.url, 'does not verify my notes', 'No diagnosis']) assert.ok(text.includes(item), item);
  assert.equal(original.notes.question, '');
  assert.equal(M.updateNote(state, 'extra', 'bad'), state);
  assert.equal(M.updateNote(state, 'question', null), state);
  assert.equal(M.updateNote(state, 'question', 'x'.repeat(2000)).notes.question.length, 1500);
  assert.equal(M.createExploration().notes.question, '');
});
test('learning search receives public topic names only', () => {
  for (const term of ['', 'Explore connections', 'linked information', 'evidence', 'uncertainty']) assert.equal(M.matchesSearch(term), true);
  for (const term of [null, {}, 'my private reflection']) assert.equal(M.matchesSearch(term), false);
});
