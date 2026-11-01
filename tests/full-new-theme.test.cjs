'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('new Home is structurally different from the retired giant-hero design',()=>{
  const home=read('src/GoldenTreeHome.js');
  assert.ok(!home.includes('Knowledge Creates Choice'));
  assert.match(home,/ESS Core Prototype/);
  assert.match(home,/Understand what you feel/);
  assert.match(home,/testID="home-ess-core"/);
  assert.match(home,/Evidence & Truth Test Lab/);
  assert.match(home,/title="Connection Trail"/);
});

test('new shared shell replaces old subtitle and removes evidence from persistent bottom nav',()=>{
  const chrome=read('src/PresentationChrome.js');
  assert.match(chrome,/Australian Humanity/);
  assert.ok(!chrome.includes('Reflect · Learn · Grow'));
  assert.match(chrome,/const items=\[\['home','Home'\],\['journal','Journey'\],\['learn','Knowledge'\],\['support','Humanity'\],\['more','More'\]\]/);
});

test('Evidence & Truth uses the new insight and next-step composition',()=>{
  const evidence=read('src/EvidenceTruthScreen.js');
  assert.match(evidence,/SORT WHAT’S KNOWN FROM WHAT’S ASSUMED/);
  assert.match(evidence,/ESS REFLECTION/);
  assert.match(evidence,/Separate what is known/);
  assert.match(evidence,/Choose your next step/);
  assert.ok(!evidence.includes('1 · Choose a fictional example'));
  assert.ok(!evidence.includes('2 · System interpretation'));
});

test('Connection Trail is no longer injected above every page',()=>{
  const patch=read('scripts/patch_connection_adventure.py');
  assert.ok(!patch.includes('ConnectionTrailCompass screen={screen}'));
  assert.match(patch,/screen==='connectionTrail'/);
});
