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
const native={View:'View',Text:'Text',Image:'Image',ScrollView:'ScrollView',Pressable:'Pressable',Platform:{select:o=>o.android},useWindowDimensions:()=>metrics,StyleSheet:{create:x=>x,absoluteFillObject:{position:'absolute',top:0,bottom:0,left:0,right:0}}};
const svg={__esModule:true,default:'Svg',Circle:'Circle',Path:'Path',Line:'Line',G:'G',Defs:'Defs',LinearGradient:'LinearGradient',Stop:'Stop',Rect:'Rect'};
function load(name){
 const file=path.resolve(__dirname,'../src/'+name+'.js');
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,configFile:false,babelrc:false,presets:['babel-preset-expo'],plugins:['@babel/plugin-transform-modules-commonjs']}).code;
 const mod=new Module(file,module);mod.paths=Module._nodeModulePaths(path.dirname(file));
 const normal=mod.require.bind(mod);
 mod.require=name=>name==='react-native'?native:name==='react-native-svg'?svg:name==='expo-font'?{useFonts:()=>[fontsLoaded,null]}:name==='expo-status-bar'?{StatusBar:'StatusBar'}:name==='react-native-safe-area-context'?{SafeAreaProvider:'SafeAreaProvider',useSafeAreaInsets:()=>({top:24,bottom:16,left:0,right:0}),initialWindowMetrics:null}:name==='./GoldenTreeIcons'?load('GoldenTreeIcons'):/\.(png|ttf)$/.test(name)?1:normal(name);
 mod._compile(code,file);return mod.exports;
}
const Home=load('GoldenTreeHome').default;
async function render(props={}){let r;await Renderer.act(async()=>{r=Renderer.create(React.createElement(Home,{onNavigate:()=>{},onValuePress:()=>{},...props}));});return r;}
test('approved artwork and all eight values render as separate native controls',async()=>{
 const r=await render();assert.equal(r.root.findByProps({testID:'golden-tree-home-artwork'}).props.accessibilityLabel,'Golden tree at sunset');
 for(const name of ['Knowledge','Understanding','Love','Kindness','Patience','Growth','Humanity','Life'])assert.equal(r.root.findByProps({testID:'home-value-'+name.toLowerCase()}).props.accessibilityLabel,'Explore '+name);
 assert.equal(r.root.findByProps({testID:'home-nav-home'}).props.accessibilityState.selected,true);
 await Renderer.act(async()=>r.unmount());
});
test('Journey, assessment, support, menu and navigation controls call their real routes',async()=>{
 const routes=[],values=[];const r=await render({onNavigate:x=>routes.push(x),onValuePress:x=>values.push(x)});
 for(const id of ['home-start-journey','home-explore-situation','home-find-support','home-open-menu','home-nav-home','home-nav-journey','home-nav-learn','home-nav-support','home-nav-more'])await Renderer.act(async()=>r.root.findByProps({testID:id}).props.onPress());
 assert.deepEqual(routes,['journey','assessment','support','more','home','journey','learn','support','more']);
 await Renderer.act(async()=>r.root.findByProps({testID:'home-value-knowledge'}).props.onPress());assert.deepEqual(values,['Knowledge']);
 await Renderer.act(async()=>r.unmount());
});
test('large system text uses two columns without hiding values or actions',async()=>{
 metrics={...metrics,fontScale:1.7};const r=await render();const p=r.root.findByProps({testID:'home-value-understanding'});assert.equal(p.props.style({pressed:false})[1].width,'50%');
 assert.ok(r.root.findByProps({testID:'home-start-journey'}));await Renderer.act(async()=>r.unmount());metrics={...metrics,fontScale:1};
});
test('font fallback keeps navigation available if a custom font has not loaded',async()=>{
 fontsLoaded=false;let route;const r=await render({onNavigate:x=>route=x});await Renderer.act(async()=>r.root.findByProps({testID:'home-start-journey'}).props.onPress());assert.equal(route,'journey');await Renderer.act(async()=>r.unmount());fontsLoaded=true;
});
