const {test}=require('node:test');
const assert=require('node:assert/strict');
const {DIRECTORY,REGIONS,CATEGORIES,EMERGENCY,filterServices}=require('../src/supportDirectory.cjs');

test('all eight jurisdictions have reachable contacts, housing and legal pathways',()=>{
  assert.equal(new Set(DIRECTORY.services.map(s=>s.id)).size,DIRECTORY.services.length);
  assert.deepEqual(REGIONS.map(x=>x.id),['National','WA','NSW','VIC','QLD','SA','TAS','ACT','NT']);
  assert.equal(EMERGENCY.contacts[0].url,'tel:000');
  for(const region of REGIONS){
    const list=filterServices({region:region.id});
    assert.ok(list.length>=5,region.id);
    for(const s of list){
      assert.ok(s.name&&s.audience&&s.help&&s.hours&&s.checked,s.id);
      assert.match(s.website,/^https:\/\//);
      assert.match(s.source_url,/^https:\/\//);
      for(const c of s.contacts)assert.match(c.url,/^(tel:|sms:)/);
      assert.ok(CATEGORIES.some(c=>c.id!=='all'&&filterServices({region:region.id,category:c.id}).includes(s)),s.id+' must be discoverable by type');
    }
    if(region.id!=='National'){
      assert.ok(list.some(s=>s.category==='Housing'),region.id+' housing');
      assert.ok(list.some(s=>s.category==='Child safety and reporting'),region.id+' child safety');
      assert.ok(list.some(s=>s.category==='First Nations legal'),region.id+' First Nations legal');
    }
  }
});

test('filters combine location, need and public search without mixing regions',()=>{
  assert.ok(filterServices({region:'WA',category:'housing'}).some(s=>s.id==='wa-house'));
  assert.ok(filterServices({region:'ACT',category:'housing',query:'OneLink'}).some(s=>s.id==='act-house'));
  assert.equal(filterServices({region:'NSW',category:'housing',query:'Perth'}).length,0);
  assert.equal(filterServices({region:'WA',category:'all',query:'  ENTrypoint   accommodation '})[0].id,'wa-house');
  assert.ok(filterServices({region:'National',category:'access'}).some(s=>s.id==='relay'));
  assert.ok(filterServices({region:'National',category:'first-nations'}).some(s=>s.id==='naccho'));
});

test('regional child-protection and sexual assault contacts retain their purpose and hours',()=>{
  const get=id=>DIRECTORY.services.find(s=>s.id===id);
  assert.equal(get('qld-child').contacts[0].label,'After hours');
  assert.match(get('qld-child').notes,/Business-hours numbers differ by region/);
  assert.equal(get('vic-child').contacts.length,5);
  assert.match(get('vic-sex').hours,/Response line: 5pm-9am/);
  assert.match(get('wa-sarc').hours,/Telephone counselling: 8:30am-11pm/);
  assert.match(get('nt-darwin-dv').audience,/Darwin/);
  assert.match(get('sa-sex').audience,/16\+ at the time/);
});
