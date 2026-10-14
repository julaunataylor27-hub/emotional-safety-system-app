'use strict';
const {sanitiseNotes} = require('./lifeJourney.cjs');
const MEMORY_KEY = '@emotional-safety-system/yagan-life-journey-v1';
const stores = new WeakMap();

function decodeMemory(raw) {
  if (raw === null) return {};
  const record = JSON.parse(raw);
  if (record.version !== 1 || !record.notes || typeof record.notes !== 'object' || Array.isArray(record.notes)) {
    throw new Error('Unsupported Life Journey memory');
  }
  return sanitiseNotes(record.notes);
}

function createLifeJourneyStore(storage) {
  // Share the queue across mounts so reopening waits for older writes to finish.
  if (stores.has(storage)) return stores.get(storage);
  let queue = Promise.resolve();
  const store = {
    async load() {
      await queue.catch(() => {});
      return decodeMemory(await storage.getItem(MEMORY_KEY));
    },
    save(notes) {
      const raw = JSON.stringify({version:1, savedAt:new Date().toISOString(), notes:sanitiseNotes(notes)});
      const next = queue.catch(() => {}).then(() => storage.setItem(MEMORY_KEY, raw));
      queue = next;
      return next;
    }
  };
  stores.set(storage, store);
  return store;
}
module.exports = {MEMORY_KEY, decodeMemory, createLifeJourneyStore};
