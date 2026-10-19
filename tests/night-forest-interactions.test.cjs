const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const React=require('react');
const Renderer=require('react-test-renderer');
const babel=require('@babel/core');
global.IS_REACT_ACT_ENVIRONMENT=true;
const opened=[];
let backAction=null;
const native={
 View:'View', Text:'Text',TextInput:'TextInput',Image:'Image',ScrollView:'ScrollView',Pressable:'Pressable',
 BackHandler:{addEventListener:(name,cb)=>{backAction=cb;return {remove:()=>{backAction=null;}};}},
 Linking:{openURL:async url=>{opened.push(url);}},
 Alert:{alert:()=>{}},Platform:{select:options=>options.android,OS:'android'},
 useWindowDimensions:()=>({width:390,height:844,fontScale:1,scale:3}),
 StyleSheet:{create:x=>x,flatten:x=>x,absoluteFillObject:{position:'absolute',top:0,right:0,bottom:0,left:0}},
};
const svg={__esModule:true,default:'Svg',Circle:'Circle',Path:'Path',Line:'Line',Ellipse:'Ellipse',G:'G',Defs:'Defs',LinearGradient:'LinearGradient',Stop:'Stop',Rect:'Rect'};
function load(name){
 const file=path.resolve(__dirname,'../src/'+name+'.js');
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,configFile:false,babelrc:false,presets:['babel-preset-expo'],plugins:['@babel/plugin-transform-modules-commonjs']}).code;
 const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(path.dirname(file));
 const standard=mod.require.bind(mod);
 mod.require=specifier=>specifier==='@react-native-async-storage/async-storage'?{getItem:async()=>null,setItem:async()=>{}}:
  specifier==='react-native'?native:specifier==='react-native-svg'?svg:
  specifier==='expo-font'?{useFonts:()=>[true,null]}:
  specifier==='expo-status-bar'?{StatusBar:'StatusBar'}:
  specifier==='react-native-safe-area-context'?{SafeAreaProvider:'SafeAreaProvider',useSafeAreaInsets:()=>({top:24,bottom:16,left:0,right:0}),initialWindowMetrics:null}:
  specifier.startsWith('./')&&!specifier.endsWith('.cjs')&&!/\.(png|webp|ttf)$/.test(specifier)?load(specifier.slice(2)):
  /\.(png|webp|ttf)$/.test(specifier)?1:standard(specifier);
 mod._compile(code,file);
 return mod.exports;
}
async function render(Component,props){let r;await Renderer.act(async()=>{r=Renderer.create(React.createElement(Component,props));});return r;}

test('Safe Curiosity examples navigate into live expandable Knowledge Trail, sources and quizzes',async()=>{
 const Safe=load('SafeCuriosityScreen').default;
 const r=await render(Safe,{onBack:()=>{},onScrollTop:()=>{}});
 assert.ok(r.root.findByProps({testID:'safe-curiosity-night-banner'}));
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-example-internet'}).props.onPress());
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-review'}).props.onPress());
 assert.ok(r.root.findByProps({testID:'safe-curiosity-result'}));
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-open-knowledge'}).props.onPress());
 assert.ok(r.root.findByProps({testID:'safe-curiosity-knowledge-trail'}));
 assert.equal(r.root.findByProps({testID:'safe-curiosity-back'}).props.accessibilityLabel,'Back to Safe Curiosity');
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-lesson-1'}).props.onPress());
 assert.ok(r.root.findByProps({testID:'safe-curiosity-lesson-body-1'}));
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-followup-0'}).props.onPress());
 assert.ok(r.root.findByProps({testID:'safe-curiosity-followup-answer'}));
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-quiz-1'}).props.onPress());
 assert.ok(r.root.findByProps({testID:'safe-curiosity-quiz-feedback'}));
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-source-0'}).props.onPress());
 assert.equal(opened.at(-1).startsWith('https://www.esafety.gov.au/'),true);
 await Renderer.act(async()=>r.root.findByProps({testID:'safe-curiosity-back'}).props.onPress());
 assert.equal(r.root.findByProps({testID:'safe-curiosity-back'}).props.accessibilityLabel,'Back to Learn');
 await Renderer.act(async()=>r.unmount());
});
test('Evidence & Truth still accepts choices and opens existing Support Resources',async()=>{
 const Screen=load('EvidenceTruthScreen').default;
 const events=[];
 const r=await render(Screen,{onBack:()=>events.push('back'),onSupport:()=>events.push('support')});
 assert.ok(r.root.findByProps({testID:'evidence-night-forest-banner'}));
 await Renderer.act(async()=>r.root.findByProps({accessibilityLabel:'Overwhelmed'}).props.onPress());
 await Renderer.act(async()=>r.root.findByProps({accessibilityLabel:'Open support resources'}).props.onPress());
 await Renderer.act(async()=>r.root.findByProps({accessibilityLabel:'Back to home'}).props.onPress());
 assert.deepEqual(events,['support','back']);
 await Renderer.act(async()=>r.unmount());
});
