'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('cinematic theme uses shared dark, gold and teal tokens',()=>{
  const theme=read('src/theme/AustralianHumanityTheme.js');
  assert.match(theme,/bg:'#050A0F'/);
  assert.match(theme,/panel:'#0B1720'/);
  assert.match(theme,/gold:'#DDAE45'/);
  assert.match(theme,/teal:'#188E8B'/);
  assert.match(theme,/glow:'#F4C65B'/);
});

test('ESS Core uses the shared cinematic scene and technical reveal',()=>{
  const screen=read('src/EssCoreScreen.js');
  assert.match(screen,/SCENES\.home/);
  assert.match(screen,/Human on the surface · rigorous underneath/);
  assert.match(screen,/How ESS reached this/);
  assert.match(screen,/P\.bg/);
  assert.match(screen,/P\.gold/);
});

test('Home uses shared palette instead of separate gold and panel colours',()=>{
  const home=read('src/GoldenTreeHome.js');
  assert.match(home,/borderBottomColor:P\.gold/);
  assert.match(home,/backgroundColor:P\.panel/);
  assert.match(home,/backgroundColor:P\.gold/);
  assert.match(home,/backgroundColor:P\.red/);
});
