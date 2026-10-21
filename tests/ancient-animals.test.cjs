const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const M=require('../src/ancientAnimals.cjs');

test('six different identifiable fossil species with direct museum sources',()=>{
 assert.equal(M.ANIMALS.length,6);
 assert.equal(new Set(M.ANIMALS.map(a=>a.id)).size,6);
 for(const a of M.ANIMALS){
  assert.ok(a.name&&a.scientific&&a.fossil&&a.interpretation&&a.question);
  assert.equal(M.isMuseumSource(a.source),true,a.id);
  assert.equal(M.getAnimal(a.id),a);
 }
 assert.equal(M.getAnimal('unknown'),null);
});

test('public learning search does not inspect personal questions',()=>{
 assert.equal(M.matchesSearch(''),true);
 assert.equal(M.matchesSearch('marsupial lion'),true);
 assert.equal(M.matchesSearch('Yamuti'),true);
 assert.equal(M.matchesSearch('Nullarbor'),true);
 assert.equal(M.matchesSearch('my private journal'),false);
 assert.equal(M.matchesSearch(null),false);
});

test('attributed account and landscape references are explicit and not silently conflated',()=>{
 assert.match(M.SOURCES.yamuti.url,/australian\.museum\/learn\/first-nations\/yamuti/);
 assert.match(M.SOURCES.country.url,/nma\.gov\.au/);
 assert.match(M.SOURCES.pangaea.url,/australian\.museum/);
 assert.match(M.META.artwork,/not fossil photographs/i);
 const screen=fs.readFileSync(require.resolve('../src/AncientAnimalsScreen.js'),'utf8');
 assert.match(screen,/Adnyamathanha and Ngarrindjeri/);
 assert.match(screen,/not a scientific identification/i);
 assert.match(screen,/permission/i);
 for(const a of M.ANIMALS) assert.ok(screen.includes("id==='"+a.id+"'"),a.id+' needs a distinct illustration');
 assert.ok(!/Image\s+source=\{\{uri:/.test(screen),'No third-party image hotlink or unlicensed image copy');
});

test('module connects through the existing build-time patch',()=>{
 const p=fs.readFileSync(require.resolve('../scripts/patch_ancient_animals.py'),'utf8');
 assert.match(p,/SAFE_CURIOSITY_V190/);
 assert.match(p,/AncientAnimalsScreen/);
 assert.match(p,/matchesAncientAnimalsSearch/);
 assert.match(p,/ancientAnimals/);
 assert.doesNotMatch(p,/analysisEngine|assessmentLogic/);
});
