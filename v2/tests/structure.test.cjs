'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('v2 is a clean five-tab app shell',()=>{
 const app=read('App.js');
 for(const label of ['Home','Journal','Learn','Support','More']) assert.match(app,new RegExp("'"+label+"'"));
 assert.ok(!app.includes('home-support-now'));
 assert.ok(!app.includes("['evidence','Evidence']"));
 assert.match(app,/v2 clean rebuild/);
});

test('v2 imports only its own core and theme',()=>{
 const app=read('App.js');
 assert.match(app,/\.\/src\/core\/essCore\.cjs/);
 assert.match(app,/\.\/src\/theme/);
 assert.ok(!app.includes('../src/'));
 assert.ok(!app.includes('patch_'));
});

test('v2 explicitly rejects v1 layout migration',()=>{
 const readme=read('README.md');
 assert.match(readme,/Do not import v1 screen layouts/);
 assert.match(readme,/Do not run v1 UI patch scripts against v2/);
});
