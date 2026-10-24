const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('presentation overview is accessible from Home and More and stays outside the scoring engine',()=>{
 const home=read('src/GoldenTreeHome.js');
 const screen=read('src/AustralianHumanityOverview.js');
 const patch=read('scripts/patch_presentation_walkthrough.py');
 const workflow=read('.github/workflows/build-android-apk.yml');
 assert.match(home,/testID="home-presentation-overview"/);
 assert.match(home,/navigate\('presentationWalkthrough'\)/);
 assert.match(patch,/screen==='presentationWalkthrough'/);
 assert.match(patch,/BackTitle title="More"/);
 assert.match(workflow,/python scripts\/patch_presentation_walkthrough\.py/);
 assert.match(screen,/testID="humanity-presentation-overview"/);
 assert.match(screen,/Cultural collaboration is essential/);
 assert.match(screen,/fictional example/);
 assert.ok(!/AsyncStorage|fetch\(|analyse\(|calculateScore|Permissions\./.test(screen));
});
test('six guided pages and routes to preserved working modules',()=>{
 const s=read('src/AustralianHumanityOverview.js');
 for(const route of ['assessment','evidence','journey','learn','twoFlames','support']){
  assert.match(s,new RegExp("'"+route+"'"));
 }
 for(const heading of ['Why it exists','How it works','What has been built','Live demonstration','Boundaries & safeguards','Next steps']){
  assert.ok(s.includes(heading));
 }
 assert.match(s,/SCENES\.home/);
 assert.match(s,/SCENES\.support/);
 assert.match(s,/overview-next/);
 assert.match(s,/overview-previous/);
});
