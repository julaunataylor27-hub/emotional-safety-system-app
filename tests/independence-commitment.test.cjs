const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/independenceCommitment.cjs');

test('a new reflection leaves choice open and exports only the person’s own proposed writing', () => {
  const reflection = {...M.createReflection(), space: 'Time with friends', commitment: 'Offer a call tomorrow'};
  const text = M.reflectionText(reflection);
  for (const value of ['Leave this open', 'Time with friends', 'Offer a call tomorrow', 'Another person has not agreed', 'not a contract', 'No reminder is scheduled']) assert.ok(text.includes(value), value);
  assert.equal(reflection.choice, 'open');
  assert.equal(M.createReflection().space, '');
});

test('uncertain and negative choice stay visible in exports, and unknown answers never become yes', () => {
  for (const choice of ['no', 'unsure']) {
    const text = M.reflectionText({...M.createReflection(), choice});
    assert.ok(text.includes(M.choiceLabel(choice)));
    assert.match(text, /pause before agreeing/);
    assert.match(text, /do not have to share/);
  }
  assert.equal(M.choiceLabel('unexpected'), 'Leave this open');
  const changed = {...M.createReflection(), changePlan: 'I need to revise the timing.'};
  assert.match(M.reflectionText(changed), /I need to revise the timing/);
});

test('learning search uses public topics and sources remain fixed HTTPS resources', () => {
  for (const query of ['', 'independence', 'independence commitment', 'personal space', 'check-in', 'promise', 'balance']) assert.equal(M.matchesSearch(query), true, query);
  for (const query of ['My private reflection about tomorrow', null, {}]) assert.equal(M.matchesSearch(query), false);
  for (const source of M.SOURCES) assert.equal(new URL(source.url).protocol, 'https:');
});
