const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/culturalInquiry.cjs');

test('every comparison statement has an attributed source with a date, scope and locator', () => {
  for (const [id, fact] of Object.entries(M.FACTS)) {
    assert.ok(fact.text, id);
    assert.ok(M.PREVIEWS[id], id + ': short summary');
    const source = M.SOURCES[fact.source];
    assert.ok(source, id);
    for (const field of ['label', 'date', 'kind', 'locator', 'scope']) assert.ok(source[field], id + ': ' + field);
    assert.equal(new URL(source.url).protocol, 'https:');
  }
  for (const topic of M.TOPICS) for (const group of M.GROUPS) {
    const account = topic.accounts[group.id];
    assert.ok(account && account.unknown, topic.id + ': ' + group.id);
    for (const id of account.facts) assert.ok(M.FACTS[id], id);
  }
});

test('missing evidence stays open and corporate dispute rules cannot become a personal repair procedure', () => {
  const disagreement = M.TOPICS.find(topic => topic.id === 'disagreement');
  assert.deepEqual(disagreement.accounts.badimia.facts, []);
  assert.match(disagreement.accounts.badimia.unknown, /not evidence that no such practices exist/);
  assert.match(disagreement.accounts.wajarri.unknown, /excludes individual disputes outside corporate roles/);
  assert.match(M.SOURCES.governance.scope, /not a general procedure for family or personal disputes/);
  assert.match(M.TOPICS.find(topic => topic.id === 'kinship').accounts.wajarri.unknown, /does not establish its absence/);
  assert.match(M.FACTS.trilogy.text, /not a system credited to Yagan personally/);
});

test('every curiosity path leads to distinct, available accounts and keeps an unanswered question', () => {
  assert.equal(new Set(M.QUESTIONS.map(question => question.id)).size, M.QUESTIONS.length);
  const groups = M.GROUPS.map(group => group.id);
  for (const question of M.QUESTIONS) {
    assert.ok(M.TOPICS.some(topic => topic.id === question.topic));
    assert.equal(new Set(question.pair).size, 2);
    assert.ok(question.pair.every(id => groups.includes(id)));
    assert.ok(question.start && question.open && question.prompts.length >= 2);
    assert.ok(question.sources.every(id => M.SOURCES[id]));
  }
  assert.match(M.QUESTIONS.find(question => question.id === 'triangle').open, /has not been verified/);
  assert.match(M.META.review, /No community endorsement claimed/);
});

test('search finds cultural names and curiosity without treating non-text or unrelated writing as a match', () => {
  for (const query of ['curiosity', 'curious', 'Yamaji', 'Yamatji', 'Noongar', 'Badimaya', 'Wajarri', 'kinship', 'triangle']) assert.equal(M.matchesSearch(query), true, query);
  for (const query of [null, {}, 42, 'a private note never supplied here']) assert.equal(M.matchesSearch(query), false);
});
