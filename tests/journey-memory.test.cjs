const {test} = require('node:test');
const assert = require('node:assert/strict');
const {MEMORY_KEY, defaultAnswers, decodeMemory, createJourneyStore, hasJourneyContent, buildJourneySummary} = require('../src/journeyMemory');

test('all seven stages survive a new storage instance and summary preserves the words', async () => {
  const disk = new Map();
  const storage = {getItem: async key => disk.get(key) ?? null, setItem: async (key, value) => disk.set(key, value)};
  const answers = {...defaultAnswers(), foundationMessage: 'Truth and kindness', foundationWhy: 'For my family',
    foundationHope: 'Free choice', valuesReflection: 'Ask before judging', philosophyName: 'My roots',
    philosophyMotto: 'Keep growing', philosophyVision: 'A kinder future', bookTitle: 'Our story',
    storyNotes: 'Chapter one', projectSelections: ['Website / App'], sharingSelections: ['Family'],
    legacyFeeling: 'Safe and understood', legacyWorld: 'A world with respect'};
  await createJourneyStore(storage).save(answers);
  const restored = await createJourneyStore(storage).load();
  assert.deepEqual(restored, answers);
  const summary = buildJourneySummary(restored);
  for (const value of Object.values(answers)) for (const item of Array.isArray(value) ? value : [value]) assert.ok(summary.includes(item));
  assert.equal(hasJourneyContent(defaultAnswers()), false);
  assert.equal(hasJourneyContent(restored), true);
  assert.equal(JSON.parse(disk.get(MEMORY_KEY)).version, 1);
});

test('slow writes remain ordered, and a failed write can be retried', async () => {
  const writes = [];
  let release;
  const first = new Promise(resolve => { release = resolve; });
  let count = 0;
  const store = createJourneyStore({getItem: async () => null, setItem: async (_, raw) => {
    count++;
    if (count === 1) await first;
    if (count === 3) throw new Error('disk unavailable');
    writes.push(JSON.parse(raw).answers.foundationMessage);
  }});
  const a = store.save({...defaultAnswers(), foundationMessage: 'Older'});
  const b = store.save({...defaultAnswers(), foundationMessage: 'Newer'});
  release(); await Promise.all([a, b]);
  assert.deepEqual(writes, ['Older', 'Newer']);
  await assert.rejects(store.save(defaultAnswers()), /disk unavailable/);
  await store.save({...defaultAnswers(), foundationMessage: 'Retry'});
  assert.equal(writes.at(-1), 'Retry');
});

test('invalid or future saved data fails instead of silently overwriting the writing', () => {
  for (const raw of ['broken', '{}', '{"version":2,"answers":{}}', '{"version":1,"answers":{"legacyFeeling":99}}']) assert.throws(() => decodeMemory(raw));
  assert.deepEqual(decodeMemory(null), defaultAnswers());
  assert.equal(decodeMemory('{"version":1,"answers":{"foundationMessage":"Saved"}}').foundationMessage, 'Saved');
  assert.ok(buildJourneySummary(defaultAnswers()).includes('Not answered yet.'));
});
