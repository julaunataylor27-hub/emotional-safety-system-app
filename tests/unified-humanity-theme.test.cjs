'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {THEME_ID, design, screenFamily, valueGridColumns} = require('../src/unifiedHumanityTheme.cjs');

function luminance(hex) {
  const channel = [1, 3, 5].map(index => {
    const n = parseInt(hex.slice(index, index + 2), 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return channel[0] * 0.2126 + channel[1] * 0.7152 + channel[2] * 0.0722;
}
function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

test('single approved design foundation covers all six top-level screens', () => {
  assert.equal(THEME_ID, 'unified-humanity');
  assert.equal(design.status, 'design-foundation-not-activated');
  assert.equal(design.tagline, 'Grow Yourself. Grow Humanity.');
  assert.deepEqual(design.nav.map(item => item.route), ['home', 'journey', 'learn', 'evidence', 'support', 'more']);
  assert.deepEqual(Object.keys(design.screens), design.nav.map(item => item.route));
  for (const item of design.nav) {
    assert.ok(design.screens[item.route].heading.length > 3);
    assert.ok(design.screens[item.route].subtitle.length > 4);
    assert.ok(design.screens[item.route].hero.length > 10);
  }
});

test('the eight values retain full names, accessible icons and stable order', () => {
  assert.deepEqual(design.values.map(v => v.label), [
    'Knowledge', 'Understanding', 'Love', 'Kindness',
    'Patience', 'Growth', 'Humanity', 'Life',
  ]);
  assert.equal(new Set(design.values.map(v => v.id)).size, 8);
  for (const value of design.values) assert.ok(value.icon && value.caption);
});

test('secondary screens have visual groups without changing any navigation destination', () => {
  for (const key of Object.keys(design.screens)) assert.equal(screenFamily(key), key);
  assert.equal(screenFamily('lifeJourney'), 'journey');
  assert.equal(screenFamily('journal'), 'journey');
  assert.equal(screenFamily('safeCuriosity'), 'learn');
  assert.equal(screenFamily('lawRightsKinship'), 'learn');
  assert.equal(screenFamily('results'), 'evidence');
  assert.equal(screenFamily('settings'), 'more');
  assert.equal(screenFamily('totallyNewScreen'), 'shared');
});

test('small screens or larger fonts use readable two-column value labels', () => {
  assert.equal(valueGridColumns(360), 2);
  assert.equal(valueGridColumns(390), 2);
  assert.equal(valueGridColumns(440), 4);
  assert.equal(valueGridColumns(440, 1.3), 2);
  assert.equal(valueGridColumns(440, 1, 'large'), 2);
  assert.ok(design.geometry.minTouchTarget >= 48);
  assert.ok(design.typography.body.fontSize >= 16);
});

test('readable surface, header, controls, urgency and muted text have at least 4.5:1 contrast', () => {
  const pairs = [
    [design.components.screen.backgroundColor, design.components.screen.textColor],
    [design.components.header.backgroundColor, design.components.header.textColor],
    [design.components.card.backgroundColor, design.components.card.titleColor],
    [design.components.primaryButton.backgroundColor, design.components.primaryButton.textColor],
    [design.components.secondaryButton.backgroundColor, design.components.secondaryButton.textColor],
    [design.components.urgentButton.backgroundColor, design.components.urgentButton.textColor],
    [design.colors.canvas, design.colors.muted],
  ];
  for (const [background, foreground] of pairs)
    assert.ok(contrast(background, foreground) >= 4.5, `Low contrast for ${foreground} on ${background}`);
});

test('the foundation is immutable and does not introduce data, safety or link changes', () => {
  assert.ok(Object.isFrozen(design));
  assert.ok(Object.isFrozen(design.colors));
  assert.ok(Object.isFrozen(design.nav));
  assert.ok(Object.isFrozen(design.screens.home));
  assert.equal(design.privacyPolicy, undefined);
  assert.equal(design.savedData, undefined);
  assert.equal(design.supportNumbers, undefined);
  assert.equal(design.safetyRules, undefined);
});
