const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

test('Connection Trail offers six optional non-judgmental clues and distinct bundled pictures', () => {
  const source = read('src/ConnectionAdventure.js');
  assert.match(source, /testID="connection-adventure-screen"/);
  assert.match(source, /testID="connection-selected-clue"/);
  assert.match(source, /testID="connection-open-clue"/);
  assert.match(source, /testID="connection-next"/);
  assert.match(source, /testID="connection-previous"/);
  for (const route of ['assessment','evidence','knowledgeTrail','exploreConnections','journey','support']) {
    assert.match(source, new RegExp("route:'" + route + "'"));
  }
  assert.equal((source.match(/route:'(?:assessment|evidence|knowledgeTrail|exploreConnections|journey|support)'/g) || []).length, 6);
  const images = [...source.matchAll(/image:require\('([^']+)'\)/g)].map(x => x[1]);
  assert.equal(images.length, 6);
  assert.equal(new Set(images).size, 6);
  assert.match(source, /not a test, verdict, or investigation of another person/i);
  assert.match(source, /no locked stages/i);
  assert.match(source, /Nothing here claims to prove what someone else feels or intends/i);
});

test('Shared compass, Home link and all six navigation tabs preserve existing destinations', () => {
  const home = read('src/GoldenTreeHome.js');
  const chrome = read('src/PresentationChrome.js');
  const patch = read('scripts/patch_connection_adventure.py');
  assert.match(home, /testID="home-connection-adventure"/);
  assert.match(home, /navigate\('connectionTrail'\)/);
  assert.match(chrome, /\['evidence','Evidence'\]/);
  assert.match(chrome, /\['support','Support'\]/);
  assert.match(patch, /ConnectionTrailCompass screen=\{screen\}/);
  assert.match(patch, /screen==='connectionTrail'/);
  assert.match(patch, /CONNECTION_ADVENTURE_V201/);
  assert.match(patch, /screen==='vision'/);
});

test('No content evaluation, personal data scoring, or permissions required', () => {
  const source = read('src/ConnectionAdventure.js');
  for (const forbidden of ['AsyncStorage', 'fetch(', 'Location.', 'Permissions.', 'analyse(', 'calculateScore', 'setTimeout(', 'Linking.openURL']) {
    assert.ok(!source.includes(forbidden), forbidden);
  }
});
