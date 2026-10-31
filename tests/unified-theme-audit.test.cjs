'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const src=path.join(root,'src');
const ALLOWED_VISUAL_PRIMITIVES=new Set(['NightForestScene.js']);

test('every styled product screen uses the unified master theme',()=>{
  const files=fs.readdirSync(src).filter(name=>name.endsWith('.js'));
  const styled=[];
  const outside=[];
  for(const name of files){
    const body=fs.readFileSync(path.join(src,name),'utf8');
    if(!body.includes('StyleSheet.create')) continue;
    styled.push(name);
    if(ALLOWED_VISUAL_PRIMITIVES.has(name)) continue;
    if(!body.includes('presentationStyles')) outside.push(name);
  }
  assert.ok(styled.length>=20,'expected full styled screen inventory');
  assert.deepEqual(outside,[],'Screens outside unified master theme: '+outside.join(', '));
});

test('all converted legacy screens carry the unified-theme source marker',()=>{
  const expected=[
    'AncientAnimalsScreen.js','AustralianHumanityOverview.js','ConnectionAdventure.js',
    'CulturalConnectionsScreen.js','CulturalInquiryScreen.js','EssCoreScreen.js',
    'ExploreConnectionsScreen.js','GoldenTreeHome.js','IndependenceCommitmentScreen.js',
    'KnowledgeTrailScreen.js','LawRightsKinshipScreen.js','LearningTogetherScreen.js',
    'SafeCuriosityScreen.js','SupportDirectoryScreen.js','TimPictureTrail.js','TwoFlamesScreen.js'
  ];
  for(const name of expected){
    const body=fs.readFileSync(path.join(src,name),'utf8');
    assert.match(body,/UNIFIED_THEME_V4/,name);
    assert.match(body,/presentationStyles/,name);
  }
});

test('master palette remains cinematic gold teal',()=>{
  const theme=fs.readFileSync(path.join(src,'theme','AustralianHumanityTheme.js'),'utf8');
  assert.match(theme,/bg:'#050A0F'/);
  assert.match(theme,/gold:'#DDAE45'/);
  assert.match(theme,/teal:'#188E8B'/);
  assert.match(theme,/glow:'#F4C65B'/);
});
