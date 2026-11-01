'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('approved mockup Home is compact and does not contain the rejected giant hero/support bar',()=>{
  const home=read('src/GoldenTreeHome.js');
  assert.match(home,/MOCKUP_THEME_V6/);
  assert.match(home,/ESS Core Prototype/);
  assert.match(home,/Evidence & Truth Test Lab/);
  assert.match(home,/Learning Trails/);
  assert.match(home,/Safety & Support/);
  assert.ok(!home.includes('Understand. Reflect. Choose.'));
  assert.ok(!home.includes('home-support-now'));
  assert.ok(!home.includes("['evidence','Evidence']"));
});

test('bottom navigation matches the approved five-tab mockup',()=>{
  const home=read('src/GoldenTreeHome.js');
  const chrome=read('src/PresentationChrome.js');
  for(const source of [home,chrome]){
    assert.match(source,/journal/);
    assert.match(source,/learn/);
    assert.match(source,/support/);
    assert.match(source,/more/);
  }
  assert.ok(!chrome.includes("['evidence','Evidence']"));
  assert.match(chrome,/route==='journal'\?'Journal'/);
});

test('final Android patch runs after legacy UI and compacts Learning Centre',()=>{
  const patch=read('scripts/patch_mockup_theme_v6.py');
  const fast=read('.github/workflows/build-android-apk-fast.yml');
  const normal=read('.github/workflows/build-android-apk.yml');
  assert.match(patch,/MOCKUP_THEME_FINAL_V6/);
  assert.match(patch,/Choose a trail/);
  assert.match(patch,/mockupList/);
  assert.match(fast,/Apply approved mockup theme last/);
  assert.match(normal,/Apply approved mockup theme last/);
  assert.ok(fast.indexOf('Apply approved mockup theme last')>fast.indexOf('Reconnect ESS Core prototype'));
  assert.ok(normal.indexOf('Apply approved mockup theme last')>normal.indexOf('Reconnect ESS Core prototype'));
});
