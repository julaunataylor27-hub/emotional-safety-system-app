'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('ESS Core prototype is reachable from the home screen', () => {
  const app = fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');
  assert.match(app,/import EssCoreScreen from '.\/src\/EssCoreScreen'/);
  assert.match(app,/screen==='esscore'/);
  assert.match(app,/ESS CORE PROTOTYPE/i);
  assert.match(app,/go\('esscore'\)/);
});

test('visible ESS Core screen exposes the core categories', () => {
  const screen = fs.readFileSync(path.join(__dirname,'../src/EssCoreScreen.js'),'utf8');
  assert.match(screen,/Emotion/);
  assert.match(screen,/Evidence \/ reported information/);
  assert.match(screen,/Interpretation/);
  assert.match(screen,/Uncertainty/);
  assert.match(screen,/Safety check/);
  assert.match(screen,/Choices remain yours/);
  assert.match(screen,/Your next step/);
  assert.match(screen,/processSituation/);
  assert.match(screen,/How ESS reached this/);
  assert.match(screen,/Research snapshot/);
  assert.match(screen,/showTechnical/);
});
