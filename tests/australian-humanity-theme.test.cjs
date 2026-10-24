const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('Australian Humanity single-source tokens and eight offline scenes',()=>{
  const theme=read('src/theme/AustralianHumanityTheme.js');
  const expected=['home-hero.webp','my-journey-bg.webp','knowledge-card.webp','emotional-safety-card.webp',
    'evidence-truth-card.webp','support-services-card.webp','culture-humanity-bg.webp','two-flames-bg.webp'];
  const found=[...theme.matchAll(/require\('\.\.\/\.\.\/assets\/graphics\/australian-humanity\/([^']+)'\)/g)].map(m=>m[1]);
  assert.deepEqual(found,expected);
  assert.equal(new Set(found).size,8);
  for(const name of expected)assert.ok(fs.statSync(path.join(root,'assets/graphics/australian-humanity',name)).size>10000,name);
  assert.match(theme,/minTouchTarget:48/);
  assert.match(theme,/sceneForTitle/);
});
test('shared app chrome, Home and legacy banners use the same visual foundation',()=>{
  const t=read('src/PresentationTheme.js');
  const h=read('src/GoldenTreeHome.js');
  const chrome=read('src/PresentationChrome.js');
  const scene=read('src/NightForestScene.js');
  assert.match(t,/export const P=HUMANITY\.colours/);
  assert.match(h,/SCENES\.home/);
  assert.match(h,/image:SCENES\.knowledge/);
  assert.match(h,/backgroundColor:P\.bg/);
  assert.match(chrome,/sceneForTitle\(title\)/);
  assert.match(chrome,/backgroundColor:P\.bg/);
  assert.match(scene,/SCENES\[scene\]/);
  assert.ok(!scene.includes('<Svg '),'old tree renderer must not be the shared scenic background');
});
test('major learning and support screens have distinct scenes without changing their safety logic',()=>{
  assert.match(read('src/EvidenceTruthScreen.js'),/scene="evidence"/);
  assert.match(read('src/SupportDirectoryScreen.js'),/scene="support"/);
  assert.match(read('src/SafeCuriosityScreen.js'),/scene="emotionalSafety"/);
  const testSmoke=read('scripts/android_smoke.py');
  assert.match(testSmoke,/Illustrated Australian river landscape under stars at dusk/);
});
