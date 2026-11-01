'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {SERVICES,ACTION_GUIDES,getSupportAction}=require('../src/data/supportResources.cjs');
const app=fs.readFileSync(path.join(__dirname,'../App.js'),'utf8');

test('every support action displayed in each of the four modes has a working guidance record',()=>{
 const actions=[
 'Talk it through','Understand my options','Learn more first',
 'Pause before responding','Talk to someone','Understand boundary options',
 'Talk to a trusted support','Make a safer pause plan','Review support services',
 'Move toward safety','Contact emergency help','Do not gather extra evidence'];
 for(const title of actions){
  assert.ok(app.includes(`['${title}'`),`App should show: ${title}`);
  const guide=getSupportAction(title);
  assert.ok(guide,`No guidance for ${title}`);
  assert.ok(guide.steps.length>0,`No practical next steps for ${title}`);
  for(const id of guide.services||[])assert.ok(SERVICES[id],`Unknown service ID ${id}`);
 }
 assert.equal(Object.keys(ACTION_GUIDES).length,actions.length);
 assert.equal(getSupportAction('A made up button'),null);
});
test('support cards respond to tap and have accessible labels',()=>{
 assert.match(app,/function SupportCard\(\{title,subtitle,icon,tone,selected,onPress\}\)/);
 assert.match(app,/accessibilityLabel=\{title\} accessibilityState=\{\{selected\}\} onPress=\{onPress\}/);
 assert.match(app,/setSelectedAction\(title\)/);
 assert.match(app,/setSelectedAction\(null\)/);
 assert.match(app,/onNavigate=\{go\}/);
});
test('all support contact destinations are explicit, reputable and never contact anyone automatically',()=>{
 assert.deepEqual(Object.keys(SERVICES).sort(),['emergency','lifeline','respect','yarn']);
 assert.equal(SERVICES.emergency.phone,'000');
 assert.equal(SERVICES.yarn.phone,'13 92 76');
 assert.equal(SERVICES.lifeline.phone,'13 11 14');
 assert.equal(SERVICES.respect.phone,'1800 737 732');
 for(const service of Object.values(SERVICES)){
  assert.match(service.website,/^https:\/\//);
  assert.ok(service.phone.length>=3);
 }
 assert.match(app,/openExternal\('tel:'\+item.phone/);
 assert.match(app,/Opening a provider website leaves ESS|links open outside ESS|links open outside/i);
 assert.ok(!app.includes('fetch(item.website)'));
});
test('urgent support options always include emergency help, without pretending to assess risk definitively',()=>{
 for(const title of ['Move toward safety','Contact emergency help','Do not gather extra evidence']){
  assert.ok(getSupportAction(title).services.includes('emergency'));
 }
 assert.match(app,/If there may be immediate danger/);
});
