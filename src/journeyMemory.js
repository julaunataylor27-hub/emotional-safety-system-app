const MEMORY_KEY = '@emotional-safety-system/journey-v1';
const EQUATION = '(Knowledge × Understanding) + (Love × Kindness × Patience) = Growth × Humanity = Life';

function defaultAnswers() {
  return {
    foundationMessage: '', foundationWhy: '', foundationHope: '',
    philosophyValues: ['Knowledge', 'Understanding', 'Love', 'Kindness', 'Patience'],
    valuesReflection: '', philosophyName: 'The Humanity Philosophy',
    philosophyMotto: 'Grow yourself. Grow humanity.', philosophyVision: '',
    bookTitle: '', storyNotes: '', projectSelections: [], sharingSelections: [],
    legacyFeeling: '', legacyWorld: ''
  };
}

function decodeMemory(raw) {
  if (raw === null) return defaultAnswers();
  const record = JSON.parse(raw);
  if (record.version !== 1 || !record.answers || typeof record.answers !== 'object') {
    throw new Error('Unsupported journey memory');
  }
  const answers = defaultAnswers();
  for (const key of Object.keys(answers)) {
    if (!(key in record.answers)) continue;
    const value = record.answers[key];
    if (Array.isArray(answers[key])) {
      if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
        throw new Error('Invalid journey selection');
      }
      answers[key] = [...value];
    } else {
      if (typeof value !== 'string') throw new Error('Invalid journey answer');
      answers[key] = value;
    }
  }
  return answers;
}

function createJourneyStore(storage) {
  let queue = Promise.resolve();
  return {
    async load() { return decodeMemory(await storage.getItem(MEMORY_KEY)); },
    save(answers) {
      // Serialize now and write in order so a slow write cannot replace newer text.
      const raw = JSON.stringify({version: 1, savedAt: new Date().toISOString(), answers});
      const next = queue.catch(() => {}).then(() => storage.setItem(MEMORY_KEY, raw));
      queue = next;
      return next;
    }
  };
}

function hasCustomValues(answers) {
  const values = new Set(answers.philosophyValues.map(value => value.trim()).filter(Boolean));
  const defaults = defaultAnswers().philosophyValues;
  return values.size > 0 && (values.size !== defaults.length || defaults.some(value => !values.has(value)));
}

function hasJourneyContent(answers) {
  const defaults = defaultAnswers();
  return Object.keys(answers).some(key => {
    if (key === 'philosophyValues') return hasCustomValues(answers);
    const value = answers[key];
    return Array.isArray(value) ? value.some(item => item.trim() !== '') : value.trim() !== '' && value.trim() !== defaults[key].trim();
  });
}

function buildJourneySummary(answers) {
  const text = value => value.trim() || 'Not answered yet.';
  const selection = value => value.length ? value.join(', ') : 'Not selected yet.';
  return [
    'MY HUMANITY PHILOSOPHY', text(answers.philosophyName), text(answers.philosophyMotto),
    'MY FOUNDATION', 'My message: ' + text(answers.foundationMessage),
    'Why it matters: ' + text(answers.foundationWhy), 'What I hope changes: ' + text(answers.foundationHope),
    'MY VALUES', selection(answers.philosophyValues), text(answers.valuesReflection),
    'MY VISION', text(answers.philosophyVision),
    'MY BOOK / MY STORY', 'Title: ' + text(answers.bookTitle), text(answers.storyNotes),
    'MY CREATIVE PROJECTS', selection(answers.projectSelections),
    'WHO I WANT TO REACH', selection(answers.sharingSelections),
    'MY LEGACY', 'How I want people to feel: ' + text(answers.legacyFeeling),
    'The world I hope future generations inherit: ' + text(answers.legacyWorld),
    'MY PHILOSOPHY EQUATION', EQUATION
  ].join('\n\n');
}

module.exports = {MEMORY_KEY, defaultAnswers, decodeMemory, createJourneyStore, hasCustomValues, hasJourneyContent, buildJourneySummary};
