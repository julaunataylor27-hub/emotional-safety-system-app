const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const React=require('react');
const Renderer=require('react-test-renderer');
const babel=require('@babel/core');
global.IS_REACT_ACT_ENVIRONMENT=true;
let metrics={width:390,height:844,fontScale:1,scale:3};
let fontsLoaded=true;
let openedUrls=[],linkFailure=false,alerts=[];
const native={View:'View',Text:'Text',Image:'Image',ScrollView:'ScrollView',Pressable:'Pressable',Modal:'Modal',Linking:{openURL:async url=>{if(linkFailure)throw new Error('offline');openedUrls.push(url);}},Alert:{alert:(...args)=>alerts.push(args)},Platform:{select:o=>o.android},useWindowDimensions:()=>metrics,StyleSheet:{create:x=>x,absoluteFillObject:{position:'absolute',top:0,bottom:0,left:0,right:0}}};
const svg={__esModule:true,default:'Svg',Circle:'Circle',Path:'Path',Line:'Line',G:'G',Defs:'Defs',LinearGradient:'LinearGradient',Stop:'Stop',Rect:'Rect'};
function load(name){
 const file=path.resolve(__dirname,'../src/'+name+'.js');
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,configFile:false,babelrc:false,presets:['babel-preset-expo'],plugins:['@babel/plugin-transform-modules-commonjs']}).code;
 const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(path.dirname(file));
 const normal=mod.require.bind(mod);
 mod.require=name=>name==='@react-native-async-storage/async-storage'?{getItem:async()=>null,setItem:async()=>{}}:name==='react-native'?native:name==='react-native-svg'?svg:name==='expo-font'?{useFonts:()=>[fontsLoaded,null]}:name==='expo-status-bar'?{StatusBar:'StatusBar'}:name==='react-native-safe-area-context'?{SafeAreaProvider:'SafeAreaProvider',useSafeAreaInsets:()=>({top:24,bottom:16,left:0,right:0}),initialWindowMetrics:null}:name.startsWith('./')&&!name.endsWith('.cjs')&&!/\.(png|webp|ttf)$/.test(name)?load(name.slice(2)):/\.(png|webp|ttf)$/.test(name)?1:normal(name);
 mod._compile(code,file);return mod.exports;
}
const Home=load('GoldenTreeHome').default;
async function render(props={}){let r;await Renderer.act(async()=>{r=Renderer.create(React.createElement(Home,{onNavigate:()=>{},onValuePress:()=>{},...props}));});return r;}
test('approved artwork and all eight values render as separate native controls',async()=>{
 const r=await render();assert.match(r.root.findByProps({testID:'golden-tree-home-artwork'}).props.accessibilityLabel,/Australian river landscape under stars/);
 for(const id of ['home-open-knowledge','home-safe-curiosity','home-evidence-truth','home-find-support','home-support-now'])assert.ok(r.root.findByProps({testID:id}),id);
 for(const name of ['Knowledge','Understanding','Love','Kindness','Patience','Growth','Humanity','Life'])assert.equal(r.root.findByProps({testID:'home-value-'+name.toLowerCase()}).props.accessibilityLabel,'Explore '+name);
 assert.equal(r.root.findByProps({testID:'home-nav-home'}).props.accessibilityState.selected,true);
 await Renderer.act(async()=>r.unmount());
});
test('Journey, assessment, support, menu and navigation controls call their real routes',async()=>{
 const routes=[],values=[];const r=await render({onNavigate:x=>routes.push(x),onValuePress:x=>values.push(x)});
 for(const id of ['home-start-journey','home-explore-situation','home-life-journey','home-find-support','home-open-menu','home-nav-home','home-nav-journey','home-nav-learn','home-nav-support','home-nav-more'])await Renderer.act(async()=>r.root.findByProps({testID:id}).props.onPress());
 assert.deepEqual(routes,['journey','assessment','lifeJourney','support','more','home','journey','learn','support','more']);
 await Renderer.act(async()=>r.root.findByProps({testID:'home-value-knowledge'}).props.onPress());assert.deepEqual(values,[]);
 await Renderer.act(async()=>r.root.findByProps({testID:'value-meaning-reflect'}).props.onPress());assert.deepEqual(values,['Knowledge']);
 assert.equal(r.root.findAllByProps({testID:'value-meaning-modal'}).length,0);
 await Renderer.act(async()=>r.unmount());
});
test('large system text uses two columns without hiding values or actions',async()=>{
 metrics={...metrics,fontScale:1.7};const r=await render();const p=r.root.findByProps({testID:'home-value-understanding'});assert.equal(p.props.style({pressed:false})[1].width,'50%');
 assert.ok(r.root.findByProps({testID:'home-start-journey'}));await Renderer.act(async()=>r.unmount());metrics={...metrics,fontScale:1};
});
test('font fallback keeps navigation available if a custom font has not loaded',async()=>{
 fontsLoaded=false;let route;const r=await render({onNavigate:x=>route=x});await Renderer.act(async()=>r.root.findByProps({testID:'home-start-journey'}).props.onPress());assert.equal(route,'journey');await Renderer.act(async()=>r.unmount());fontsLoaded=true;
});
test('every circle opens its own offline definition, cultural context and question without leaving Home',async()=>{
 const {VALUE_MEANINGS,CULTURAL_NOTE}=require('../src/valueMeanings.cjs');
 const events=[];const r=await render({onNavigate:x=>events.push(x),onValuePress:x=>events.push(x)});
 for(const value of VALUE_MEANINGS){
  const id=value.name.toLowerCase();
  assert.ok(r.root.findByProps({testID:'home-value-info-'+id}));
  await Renderer.act(async()=>r.root.findByProps({testID:'home-value-'+id}).props.onPress());
  assert.equal(r.root.findByProps({testID:'value-meaning-definition'}).props.children,value.definition);
  assert.equal(r.root.findByProps({testID:'value-meaning-culture'}).props.children,value.culture);
  assert.equal(r.root.findByProps({testID:'value-meaning-reflection'}).props.children,value.reflection);
  assert.ok(r.root.findAllByType('Text').some(x=>x.props.children===CULTURAL_NOTE));
  assert.equal(r.root.findByProps({testID:'golden-tree-home-screen'}).props.importantForAccessibility,'no-hide-descendants');
  assert.equal(r.root.findByProps({testID:'value-meaning-sheet'}).props.accessibilityViewIsModal,true);
  await Renderer.act(async()=>r.root.findByProps({testID:'value-meaning-sources-toggle'}).props.onPress());
  assert.equal(r.root.findByProps({testID:'value-meaning-sources-toggle'}).props.accessibilityState.expanded,true);
  for(const source of value.sources)assert.ok(r.root.findByProps({testID:'value-source-'+source}));
  await Renderer.act(async()=>r.root.findByProps({testID:'value-meaning-close'}).props.onPress());
  assert.equal(r.root.findAllByProps({testID:'value-meaning-modal'}).length,0);
  assert.equal(r.root.findByProps({testID:'golden-tree-home-screen'}).props.importantForAccessibility,'auto');
 }
 assert.deepEqual(events,[]);
 await Renderer.act(async()=>r.unmount());
});
test('Android Back and backdrop dismiss; each opening resets sources; link errors preserve the sheet',async()=>{
 const {SOURCES}=require('../src/valueMeanings.cjs');
 const r=await render();
 const open=async()=>Renderer.act(async()=>r.root.findByProps({testID:'home-value-knowledge'}).props.onPress());
 await open();
 await Renderer.act(async()=>r.root.findByProps({testID:'value-meaning-modal'}).props.onRequestClose());
 assert.equal(r.root.findAllByProps({testID:'value-meaning-modal'}).length,0);
 await open();
 await Renderer.act(async()=>r.root.findByProps({testID:'value-meaning-sources-toggle'}).props.onPress());
 await Renderer.act(async()=>r.root.findByProps({testID:'value-source-knowledge'}).props.onPress());
 assert.deepEqual(openedUrls,[SOURCES.knowledge.url]);
 linkFailure=true;
 await Renderer.act(async()=>r.root.findByProps({testID:'value-source-knowledge'}).props.onPress());
 assert.equal(alerts[0][0],'Source could not open');assert.ok(r.root.findByProps({testID:'value-meaning-definition'}));linkFailure=false;
 await Renderer.act(async()=>r.root.findByProps({testID:'value-meaning-backdrop'}).props.onPress());
 await open();assert.equal(r.root.findByProps({testID:'value-meaning-sources-toggle'}).props.accessibilityState.expanded,false);
 await Renderer.act(async()=>r.unmount());
});

test('cinematic riders theme keeps interactive routes connected',async()=>{
 const routes=[];const r=await render({onNavigate:route=>routes.push(route)});
 for(const id of ['home-explore-situation','home-safe-curiosity','home-evidence-truth','home-find-support','home-more'])
   await Renderer.act(async()=>r.root.findByProps({testID:id}).props.onPress());
 assert.deepEqual(routes,['assessment','safeCuriosity','evidence','support','more']);
 assert.ok(r.root.findByProps({testID:'golden-tree-home-artwork'}));
 assert.ok(r.root.findByProps({testID:'home-start-journey'}));
 await Renderer.act(async()=>r.unmount());
});

test('photographic Knowledge card and support-now action navigate to the real tools',async()=>{
 const routes=[];const r=await render({onNavigate:route=>routes.push(route)});
 for(const id of ['home-open-knowledge','home-support-now'])await Renderer.act(async()=>r.root.findByProps({testID:id}).props.onPress());
 assert.deepEqual(routes,['learn','support']);
 assert.ok(r.root.findByProps({testID:'home-nav-evidence'}));
 await Renderer.act(async()=>r.unmount());
});


test('Australian Humanity art stays offline and all eight individual assets are bundled',async()=>{
 const base=path.resolve(__dirname,'../assets/graphics/australian-humanity');
 const names=['home-hero.webp','knowledge-card.webp','emotional-safety-card.webp','evidence-truth-card.webp',
 'support-services-card.webp','culture-humanity-bg.webp','my-journey-bg.webp','two-flames-bg.webp'];
 for(const name of names){
  const file=path.join(base,name);
  assert.ok(fs.existsSync(file),name+' is bundled');
  assert.ok(fs.statSync(file).size>10000,name+' must contain actual artwork');
 }
 const home=fs.readFileSync(path.resolve(__dirname,'../src/GoldenTreeHome.js'),'utf8');
 for(const name of names.slice(0,6))assert.ok(home.includes(name),name+' is linked from Home');
 assert.match(fs.readFileSync(path.resolve(__dirname,'../src/TwoFlamesScreen.js'),'utf8'),/two-flames-bg\.webp/);
 assert.match(fs.readFileSync(path.resolve(__dirname,'../src/LifeJourneyScreen.js'),'utf8'),/my-journey-bg\.webp/);
 assert.match(fs.readFileSync(path.resolve(__dirname,'../src/CulturalConnectionsScreen.js'),'utf8'),/culture-humanity-bg\.webp/);
});
