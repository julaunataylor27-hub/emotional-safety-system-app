const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/lawRightsKinship.cjs');

test('public topics retain attribution, jurisdiction, limits and a fixed review date', () => {
  assert.equal(M.TOPICS.length, 18);
  assert.equal(new Set(M.TOPICS.map(topic => topic.id)).size, M.TOPICS.length);
  for (const topic of M.TOPICS) {
    assert.ok(topic.jurisdiction && topic.status && topic.summary && topic.question, topic.id);
    assert.ok(topic.can.length && topic.limits.length && topic.sources.length, topic.id);
    assert.ok(M.SECTIONS.some(section => section.id === topic.section));
    for (const id of topic.sources) {
      const source = M.SOURCES[id];
      assert.ok(source.author && source.scope && source.date && source.locator, id);
      assert.equal(source.checked, M.META.checked);
      assert.match(M.sourceUrl(id), /^https:\/\//);
    }
  }
  assert.match(M.META.time, /fixed review date, not a live law feed/);
  assert.match(M.META.review, /legal and cultural review pending/);
});

test('filters do not present WA-only rules as Australia-wide law', () => {
  for (const section of M.SECTIONS) for (const scope of M.SCOPES) {
    for (const topic of M.filterTopics({section: section.id, scope: scope.id})) {
      assert.ok(section.id === 'all' || section.id === topic.section);
      assert.ok(scope.id === 'all' || topic.scope.includes(scope.id));
    }
  }
  const national = M.filterTopics({section: 'law', scope: 'AU'});
  assert.ok(national.some(topic => topic.id === 'marriage'));
  for (const id of ['consent', 'ages', 'violence', 'recording', 'childsafety']) assert.ok(!national.some(topic => topic.id === id), id);
  const authority = M.filterTopics({section: 'law', scope: 'WA', query: 'authority'});
  assert.ok(authority.some(topic => topic.id === 'ages'));
  assert.ok(authority.every(topic => topic.scope.includes('WA')));
  assert.deepEqual(M.filterTopics({section: 'missing'}), []);
  assert.deepEqual(M.filterTopics({scope: 'NSW'}), []);
  assert.deepEqual(M.filterTopics({query: {}}), []);
});

test('public search finds LGBTQ, polyamory, kinship and Parliament without inspecting private writing', () => {
  for (const query of ['', 'LGBTQ', 'polyamory', 'kindship', 'kinship', 'parlimant', 'legalisation', 'consent', 'law rights']) assert.equal(M.matchesSearch(query), true, query);
  assert.deepEqual(M.filterTopics({query: 'throuple'}).map(topic => topic.id), ['threepartners']);
  for (const query of [null, {}, 'my private journal phrase zyxwvu']) assert.equal(M.matchesSearch(query), false);
  for (const id of ['javascript:alert(1)', 'https://example.com', '__proto__', 'constructor', 'missing', null]) assert.equal(M.sourceUrl(id), null);
});

test('cultural context and reform proposals cannot grant consent, identity or marriage eligibility', () => {
  const get = id => JSON.stringify(M.topicById(id));
  assert.match(get('systems'), /many Aboriginal Nations/);
  assert.match(get('noongar'), /not a universal rule/);
  assert.match(get('noongar'), /does not assign anyone/);
  assert.match(get('kinshipmeaning'), /cannot determine ancestry, partner eligibility/);
  assert.match(get('consent'), /signature.*cannot replace current consent/);
  assert.match(get('threepartners'), /does not allow all three people to marry/);
  assert.match(get('parliament'), /commencement also matters/);
  assert.match(get('haveyoursay'), /does not send your writing/);
  assert.match(get('permissions'), /not permission to copy everything/);
  assert.equal(M.topicById('missing'), null);
});
