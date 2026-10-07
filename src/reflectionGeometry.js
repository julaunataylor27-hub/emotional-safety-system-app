// Geometry only: the light selects a reflection prompt, never a safety score.
const GRAPHIC_COLOURS={truth:'#FFE5A1',values:'#E9BD5A',beliefs:'#7BD2DF',faith:'#B4D3AB',care:'#F5A8BA',pressure:'#FFBD32',freedom:'#78C4E3'};
const polygonPath=points=>'M '+points.map(point=>`${point.x} ${point.y}`).join(' L ')+' Z';
const linePath=(a,b)=>`M ${a.x} ${a.y} L ${b.x} ${b.y}`;
function reflectionGeometry(kind,width=280) {
  const w=Number.isFinite(width)&&width>0?width:280;
  const height=kind==='triangle'?w*.8:w;
  const inset=Math.min(52,w*.18),mid={x:w/2,y:height/2};
  const vertices=kind==='triangle'?{
    care:{x:w/2,y:Math.min(28,height*.12)},pressure:{x:w*.09,y:height*.88},freedom:{x:w*.91,y:height*.88}
  }:{truth:{x:w/2,y:inset},values:{x:inset,y:height/2},faith:{x:w/2,y:height-inset},beliefs:{x:w-inset,y:height/2}};
  const keys=kind==='triangle'?['care','pressure','freedom']:['truth','values','beliefs','faith'];
  const polygon=(kind==='triangle'?keys:['truth','values','faith','beliefs']).map(key=>vertices[key]);
  const centre=kind==='triangle'?{x:w/2,y:height*.57}:mid;
  const inner=polygon.map(point=>({x:centre.x+(point.x-centre.x)*.58,y:centre.y+(point.y-centre.y)*.58}));
  const facets=polygon.flatMap((point,index)=>{
    const next=polygon[(index+1)%polygon.length],a=inner[index],b=inner[(index+1)%polygon.length];
    return [{path:polygonPath([point,next,b,a]),shade:index},{path:polygonPath([a,b,centre]),shade:index+4}];
  });
  return {kind,width:w,height,keys,vertices,polygon,centre,inner,outline:polygonPath(polygon),facets,
    edges:polygon.map((point,index)=>linePath(point,polygon[(index+1)%polygon.length])),
    seams:polygon.map((point,index)=>linePath(point,inner[index])).concat(inner.map(point=>linePath(point,centre)))};
}
function confineReflectionPoint(point,geometry) {
  if(!Number.isFinite(point.x)||!Number.isFinite(point.y))return {...geometry.centre};
  const sides=geometry.polygon.map((a,i)=>{
    const b=geometry.polygon[(i+1)%geometry.polygon.length];
    return (b.x-a.x)*(point.y-a.y)-(b.y-a.y)*(point.x-a.x);
  });
  if(sides.every(value=>value>=-1e-6)||sides.every(value=>value<=1e-6))return {...point};
  let closest=null,distance=Infinity;
  geometry.polygon.forEach((a,i)=>{
    const b=geometry.polygon[(i+1)%geometry.polygon.length],dx=b.x-a.x,dy=b.y-a.y;
    const t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy)));
    const next={x:a.x+t*dx,y:a.y+t*dy},d=Math.hypot(next.x-point.x,next.y-point.y);
    if(d<distance){distance=d;closest=next;}
  });
  return closest;
}
function nearestReflectionCorner(point,geometry) {
  return geometry.keys.reduce((best,key)=>{
    const a=geometry.vertices[key],b=geometry.vertices[best];
    return Math.hypot(point.x-a.x,point.y-a.y)<Math.hypot(point.x-b.x,point.y-b.y)?key:best;
  },geometry.keys[0]);
}
module.exports={GRAPHIC_COLOURS,polygonPath,linePath,reflectionGeometry,confineReflectionPoint,nearestReflectionCorner};
