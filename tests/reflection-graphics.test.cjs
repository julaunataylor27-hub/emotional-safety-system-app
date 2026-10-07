const {test}=require('node:test');
const assert=require('node:assert/strict');
const {reflectionGeometry,confineReflectionPoint,nearestReflectionCorner}=require('../src/reflectionGeometry');

test('reflection graphics keep the movable light inside both shapes at phone and tablet widths',()=>{
  for(const kind of ['diamond','triangle'])for(const width of [180,240,280,430,768]) {
    const scene=reflectionGeometry(kind,width);
    for(const point of [{x:-10000,y:-10000},{x:10000,y:10000},{x:width/2,y:scene.height/2},{x:NaN,y:Infinity},...Object.values(scene.vertices)]) {
      const next=confineReflectionPoint(point,scene);
      assert.ok(Number.isFinite(next.x)&&Number.isFinite(next.y));
      assert.deepEqual(confineReflectionPoint(next,scene),next);
      assert.ok(next.x>=0&&next.x<=width&&next.y>=0&&next.y<=scene.height);
    }
    for(const key of scene.keys)assert.equal(nearestReflectionCorner(scene.vertices[key],scene),key);
    assert.equal(scene.facets.length,kind==='diamond'?8:6);
  }
});

test('responsive artwork preserves proportions and supplies no emotional or safeguarding score',()=>{
  for(const kind of ['diamond','triangle']) {
    const small=reflectionGeometry(kind,240),large=reflectionGeometry(kind,480);
    assert.equal(large.height,small.height*2);
    assert.ok(!('score' in small));assert.ok(!('safety' in small));
    assert.equal(small.keys[0],kind==='diamond'?'truth':'care');
    assert.ok(small.facets.every(facet=>facet.path.endsWith(' Z')&&!facet.path.includes('NaN')));
  }
});
