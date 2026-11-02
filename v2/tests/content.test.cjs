'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {CURATED_MODULES}=require('../src/data/knowledgeLibrary.cjs');
const directory=require('../src/data/supportDirectory.json');
const app=fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');
const visual=fs.readFileSync(path.join(__dirname,'../src/visual2027.js'),'utf8');
const readme=fs.readFileSync(path.join(__dirname,'../CONTENT_INTEGRATION.md'),'utf8');

test('baseline 2027 five-tab design and choice flows are preserved',()=>{
 for(const tab of ["'Home'","'Journal'","'Learn'","'Support'","'More'"])assert.ok(app.includes(tab));
 assert.ok(app.includes("height={300}"),'original Home sizing should remain');
 assert.ok(app.includes("s.homeSceneShade"),'locked landscape treatment should remain');
 assert.ok(app.includes('buildReflectionReview('),'choice summary must remain connected');
 assert.ok(app.includes('Save this reflection to Journal'));
 assert.ok(app.includes('Leave it for now without saving'));
 assert.ok(app.includes('Delete this saved reflection'));
 assert.ok(visual.includes('heroTitle:{'),'unified design tokens must remain');
 assert.doesNotMatch(app,/assets\/graphics\/australian-humanity/);
});

test('new public modules are unique, source-aware, and never contain private archive entries',()=>{
 assert.equal(CURATED_MODULES.length,7);
 const ids=new Set();
 for(const module of CURATED_MODULES){
  assert.ok(module.id&&module.title&&module.helps&&module.unknown&&module.sourceStatus&&module.reviewStatus&&module.scope);
  assert.ok(!ids.has(module.id),'duplicate learning id');
  ids.add(module.id);
  assert.ok(Array.isArray(module.ideas)&&module.ideas.length>=3);
  assert.ok(Array.isArray(module.sources));
  for(const source of module.sources){
   assert.match(source.url,/^https:\/\/[^/]+/);
   assert.ok(source.title&&source.author&&source.checked&&source.role);
   assert.ok(!/oai_link_source=/.test(source.url));
  }
 }
 assert.ok(!JSON.stringify(CURATED_MODULES).includes('julaunataylor27-hub'));
 assert.ok(!JSON.stringify(CURATED_MODULES).includes('Attrol Taylor'));
 assert.ok(!JSON.stringify(CURATED_MODULES).includes('Eunice Bynder'));
 assert.match(readme,/no private family research/i);
});

test('support records were migrated read-only with source provenance and regional coverage',()=>{
 assert.equal(directory.services.length,73);
 assert.equal(directory.checked,'18 October 2026');
 assert.deepEqual([...new Set(directory.services.flatMap(x=>x.regions))].sort(),['ACT','NSW','NT','National','QLD','SA','TAS','VIC','WA']);
 const ids=new Set();
 for(const item of directory.services){
  assert.ok(item.id&&item.name&&item.help&&item.category&&item.checked);
  assert.ok(!ids.has(item.id));ids.add(item.id);
  assert.ok(item.source_url?.startsWith('https://'));
  if(item.website)assert.ok(item.website.startsWith('https://'));
  for(const contact of item.contacts)assert.match(contact.url,/^(tel:|sms:)/);
 }
 assert.ok(directory.services.some(x=>x.id==='emergency'&&x.contacts.some(c=>c.number==='000')));
 assert.ok(!JSON.stringify(directory).includes('oai_link_source'));
});

test('knowledge sources open on deliberate tap, stay offline while reading, and connect to support',()=>{
 assert.match(app,/CURATED_MODULES\.map\(/);
 assert.match(app,/\{trail\.image\?<Image/);
 assert.match(app,/READ THE ORIGINAL SOURCES/);
 assert.match(app,/accessibilityRole="link" accessibilityLabel=\{\x60Open source /);
 assert.match(app,/Linking\.openURL\(url\)/);
 assert.match(app,/View support options if needed/);
 assert.match(app,/onNavigate\?\.\('support'\)/);
});

test('directory search and state filters do not request location or transfer personal reflections',()=>{
 assert.match(app,/function SupportDirectory\(\{onBack\}\)/);
 assert.match(app,/const regions=\['National','WA','NSW','VIC','QLD','SA','TAS','ACT','NT'\]/);
 assert.match(app,/const emergency=supportDirectory\.services\.find\(x=>x\.id==='emergency'\)/);
 assert.match(app,/Browse Australian support directory/);
 assert.match(app,/No GPS, account or personal reflection is used/);
 assert.match(app,/directoryOpen\)return <SupportDirectory/);
 assert.match(app,/accessibilityLabel="Search public support services"/);
 assert.match(app,/show more services/i);
 assert.ok(!app.includes('PermissionsAndroid.request'));
});

test('all content follows original separation of capability and evidence',()=>{
 assert.match(readme,/locked/i);
 assert.match(readme,/cultural review pending/i);
 assert.match(readme,/dated public directory/i);
 assert.match(readme,/source-specific/i);
 assert.ok(!app.includes("require('../src/LawRightsKinshipScreen')"));
 assert.ok(!app.includes('patch_law_rights_kinship.py'));
});
