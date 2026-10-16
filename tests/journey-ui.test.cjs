const {test} = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');
const React = require('react');
const {act, create} = require('react-test-renderer');
const {MEMORY_KEY} = require('../src/journeyMemory');
global.IS_REACT_ACT_ENVIRONMENT = true;

const disk = new Map();
const shares = [];
const alerts = [];
const openedLinks = [];
const backHandlers = new Set();
let failLink = false;
let failShare = false;
let failRead = false;
let failWrite = false;
let pdfSaveGranted = true;
let pdfFailPrint = false;
let pdfFailOpen = false;
const pdfPrints = [];
const pdfShares = [];
const pdfWrites = [];
const pdfOpens = [];
let systemReduceMotion=false;
const motionListeners=new Set();
const motionStarts=[];
const pdfFileSystem = {
  cacheDirectory:'file:///cache/', EncodingType:{Base64:'base64'},
  copyAsync:async()=>{}, deleteAsync:async()=>{}, getContentUriAsync:async()=>'content://pdf-reader/document',
  readAsStringAsync:async()=>'JVBERi0xLjQ=', writeAsStringAsync:async(...args)=>pdfWrites.push(args),
  StorageAccessFramework:{
    requestDirectoryPermissionsAsync:async()=>({granted:pdfSaveGranted,directoryUri:'content://user-files'}),
    createFileAsync:async()=>'content://user-files/my-summary.pdf'
  }
};
const storage = {
  getItem: async key => { if (failRead) throw Error('read failure'); return disk.get(key) ?? null; },
  setItem: async (key, value) => { if (failWrite) throw Error('write failure'); disk.set(key, value); }
};
const native = {
  SafeAreaView: 'SafeAreaView', ScrollView: 'ScrollView', View: 'View', Text: 'Text', TextInput: 'TextInput',
  Pressable: 'Pressable', Image: 'Image', ImageBackground: 'ImageBackground', Modal: 'Modal',
  StyleSheet: {create: value => value, absoluteFillObject: {}}, StatusBar: {}, Platform: {OS: 'android',select:options=>options.android}, useWindowDimensions:()=>({width:390,height:844,scale:3,fontScale:1}), Linking: {openURL:async url=>{if(failLink)throw Error('Link unavailable');openedLinks.push(url);}},
  PanResponder:{create:handlers=>({panHandlers:{onResponderGrant:handlers.onPanResponderGrant,onResponderMove:handlers.onPanResponderMove,onResponderRelease:handlers.onPanResponderRelease}})},
  AccessibilityInfo:{isReduceMotionEnabled:async()=>systemReduceMotion,addEventListener:(_,listener)=>{motionListeners.add(listener);return {remove:()=>motionListeners.delete(listener)};}},
  BackHandler:{addEventListener:(_,handler)=>{backHandlers.add(handler);return {remove:()=>backHandlers.delete(handler)};}},
  Animated: {Value: class {interpolate() {return '0deg';} setValue() {} stopAnimation() {}}, View: 'AnimatedView',
    timing:(_,options)=>({start(){motionStarts.push(options);},stop(){}}), loop:()=>({start(){},stop(){}})},
  Share: {share: async content => { if (failShare) throw Error('share failure'); shares.push(content); return {action: 'sharedAction'}; }},
  Alert: {alert: (...args) => alerts.push(args)}
};
const originalLoad = Module._load;
Module._load = function(name, parent, main) {
  if (name === 'react-native') return native;
  if (name === '@shopify/react-native-skia') return {Canvas:'SkiaCanvas',Group:'SkiaGroup',Path:'SkiaPath',Circle:'SkiaCircle',LinearGradient:'SkiaLinearGradient',RadialGradient:'SkiaRadialGradient'};
  if (name === 'react-native-svg') return {__esModule:true,default:'Svg',Path:'SvgPath',Circle:'SvgCircle',Line:'SvgLine',G:'SvgGroup',Defs:'SvgDefs',LinearGradient:'SvgLinearGradient',Stop:'SvgStop',Rect:'SvgRect'};
  if (name === '@react-native-async-storage/async-storage') return storage;
  if (name === 'expo-font') return {useFonts:()=>[true,null]};
  if (name === 'react-native-safe-area-context') return {SafeAreaProvider:'SafeAreaProvider',useSafeAreaInsets:()=>({top:24,bottom:16,left:0,right:0}),initialWindowMetrics:null};
  if (name === 'expo-status-bar') return {StatusBar: 'ExpoStatusBar'};
  if (name === 'expo-print') return {printToFileAsync:async options=>{if(pdfFailPrint)throw Error('PDF print failure');pdfPrints.push(options);return {uri:'file:///cache/tmp.pdf',numberOfPages:2};}};
  if (name === 'expo-file-system/legacy') return pdfFileSystem;
  if (name === 'expo-sharing') return {isAvailableAsync:async()=>true,shareAsync:async(...args)=>pdfShares.push(args)};
  if (name === 'expo-intent-launcher') return {startActivityAsync:async(...args)=>{if(pdfFailOpen)throw Error('No PDF reader');pdfOpens.push(args);}};
  if (name.includes('/assets/')) return 'test-image';
  return originalLoad.call(this, name, parent, main);
};
const originalJs = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
  if (filename===path.resolve(__dirname,'../App.js') || filename.startsWith(path.resolve(__dirname,'../src')+'/')) {
    const output = babel.transformSync(fs.readFileSync(filename, 'utf8'), {filename, presets: ['babel-preset-expo']});
    module._compile(output.code, filename);
  } else originalJs(module, filename);
};
const App = require('../App').default;
const Trail = require('../src/knowledgeTrail.cjs');
const textOf = node => node.findAllByType('Text').map(item => item.children.filter(value => typeof value === 'string').join('')).join(' ');
async function press(tree, label) {
  const button = tree.root.findAllByType('Pressable').find(node => textOf(node).toLowerCase().includes(label.toLowerCase()));
  assert.ok(button, 'Missing button ' + label);
  await act(async () => { await button.props.onPress(); });
}
async function mount() {
  let tree;
  await act(async () => {tree = create(React.createElement(App));});
  return tree;
}
async function write(tree, value) {
  const input = tree.root.findAllByType('TextInput').find(node => node.props.placeholder === 'Write your thoughts…');
  assert.ok(input);
  await act(async () => {input.props.onChangeText(value);});
}

test('actual summary button opens a preview, shares it, survives failure and restores after restart', async () => {
  let tree = await mount();
  await press(tree, 'Start my journey');
  await press(tree, 'Stage 1');
  await write(tree, 'My family deserve kindness and free choice.');
  assert.equal(JSON.parse(disk.get(MEMORY_KEY)).answers.foundationMessage, 'My family deserve kindness and free choice.');
  await press(tree, 'Journey');
  await press(tree, 'Stage 7');
  await write(tree, 'Safe and proud.');
  await press(tree, 'CREATE & SHARE MY SUMMARY');
  assert.ok(textOf(tree.root).includes('My Summary'));
  assert.ok(textOf(tree.root).includes('My family deserve kindness and free choice.'));
  assert.ok(textOf(tree.root).includes('Safe and proud.'));
  assert.equal(shares.length, 0, 'Preview must not send writing automatically');
  await press(tree, 'SAVE PDF TO MY FILES');
  assert.ok(pdfPrints[0].html.includes('My family deserve kindness and free choice.'));
  assert.ok(pdfPrints[0].html.includes('Safe and proud.'));
  assert.equal(pdfWrites[0][0],'content://user-files/my-summary.pdf');
  assert.ok(textOf(tree.root).includes('Saved to the folder you chose'));
  await press(tree, 'OPEN MY PDF');
  assert.equal(pdfOpens[0][1].type,'application/pdf');
  await press(tree, 'SHARE PDF');
  assert.ok(pdfShares[0][0].endsWith('.pdf'));
  pdfSaveGranted=false;
  await press(tree, 'SAVE PDF TO MY FILES');
  assert.ok(textOf(tree.root).includes('Saving cancelled'));
  pdfSaveGranted=true;
  await press(tree, 'SHARE AS TEXT');
  assert.ok(shares[0].message.includes('Safe and proud.'));
  failShare = true;
  await press(tree, 'SHARE AS TEXT');
  assert.equal(alerts.at(-1)[0], 'Sharing unavailable');
  assert.ok(textOf(tree.root).includes('My Summary'));
  failShare = false;
  await act(async () => {tree.unmount();});
  tree = await mount();
  await press(tree, 'Start my journey'); await press(tree, 'Stage 1');
  assert.equal(tree.root.findAllByType('TextInput')[0].props.value, 'My family deserve kindness and free choice.');
  await write(tree, 'My updated reflection belongs in the next PDF.');
  await press(tree, 'Journey'); await press(tree, 'Stage 7'); await press(tree, 'CREATE & SHARE MY SUMMARY');
  await press(tree, 'SAVE PDF TO MY FILES');
  assert.equal(pdfPrints.length,2,'Edited answers must create a fresh PDF');
  assert.ok(pdfPrints[1].html.includes('My updated reflection belongs in the next PDF.'));
  await press(tree, 'CLEAR SAVED JOURNEY');
  const confirmation = alerts.at(-1)[2];
  await act(async () => { await confirmation.find(item => item.text === 'Clear journey').onPress(); });
  assert.equal(JSON.parse(disk.get(MEMORY_KEY)).answers.foundationMessage, '');
  await act(async () => {tree.unmount();});
});

test('load and save failures display recovery controls and never replace saved text with defaults', async () => {
  const saved = JSON.stringify({version: 1, answers: {foundationMessage: 'Keep this writing'}});
  disk.set(MEMORY_KEY, saved); failRead = true;
  const tree = await mount();
  await press(tree, 'Start my journey');
  assert.ok(textOf(tree.root).includes('could not be opened'));
  assert.equal(tree.root.findAllByType('TextInput').length, 0);
  assert.equal(disk.get(MEMORY_KEY), saved);
  failRead = false;
  await press(tree, 'TRY AGAIN'); await press(tree, 'Stage 1');
  assert.equal(tree.root.findAllByType('TextInput')[0].props.value, 'Keep this writing');
  failWrite = true;
  await write(tree, 'My newest answer');
  assert.ok(textOf(tree.root).includes('could not be saved'));
  assert.equal(disk.get(MEMORY_KEY), saved);
  failWrite = false;
  await press(tree, 'TRY AGAIN');
  assert.equal(JSON.parse(disk.get(MEMORY_KEY)).answers.foundationMessage, 'My newest answer');
  await act(async () => {tree.unmount();});
});

test('Journal tabs switch content, preserve drafts and entries, and link to live journey progress', async () => {
  disk.clear();
  const tree = await mount();
  await press(tree,'More'); await press(tree,'My Journal');
  const tabs = () => tree.root.findAllByType('Pressable').filter(node=>node.props.accessibilityRole==='tab');
  assert.equal(tabs().find(node=>textOf(node)==='Entries').props.accessibilityState.selected,true);
  const journalInput = () => tree.root.findAllByType('TextInput').find(node=>node.props.placeholder==='Write a short reflection or next step...');
  const reflection = 'I paused and wrote down my next step.';
  await act(async()=>journalInput().props.onChangeText(reflection));
  await press(tree,'Progress');
  assert.equal(journalInput(),undefined);
  assert.ok(textOf(tree.root).includes('Journal activity'));
  assert.ok(textOf(tree.root).includes('Journal entries this session: 0'));
  assert.ok(textOf(tree.root).includes('0 of 7 stages have your input.'));
  assert.equal(tabs().find(node=>textOf(node)==='Progress').props.accessibilityState.selected,true);
  await press(tree,'Entries');
  assert.equal(journalInput().props.value,reflection);
  await press(tree,'New Journal Entry'); await press(tree,'Progress');
  assert.ok(textOf(tree.root).includes('Journal entries this session: 1'));
  assert.ok(textOf(tree.root).includes('Latest reflection:'));
  await press(tree,'Entries');
  assert.ok(textOf(tree.root).includes(reflection));
  assert.equal(journalInput().props.value,'');
  await press(tree,'Progress'); await press(tree,'My Foundation');
  await write(tree,'I want people to feel welcome.');
  await press(tree,'More'); await press(tree,'My Journal');
  assert.ok(textOf(tree.root).includes('1 of 7 stages have your input.'));
  assert.ok(textOf(tree.root).includes('14%'));
  const foundation = tree.root.findAllByType('Pressable').find(node=>textOf(node).includes('My Foundation'));
  assert.ok(textOf(foundation).includes('Has answers'));
  await press(tree,'VIEW MY SUMMARY');
  assert.ok(textOf(tree.root).includes('I want people to feel welcome.'));
  await press(tree,'Home'); await press(tree,'Start my journey'); await press(tree,'Technology Lab');
  const progressCard = tree.root.findAllByType('Pressable').find(node=>node.props.accessibilityLabel==='Open journey progress');
  assert.ok(progressCard);
  await act(async()=>progressCard.props.onPress());
  assert.ok(textOf(tree.root).includes('Journal activity'));
  assert.equal(tabs().find(node=>textOf(node)==='Progress').props.accessibilityState.selected,true);
  assert.ok(textOf(tree.root).includes('Journal entries this session: 1'));
  await act(async()=>tree.unmount());
});

test('Journal progress offers retry rather than reporting empty progress when memory cannot load', async () => {
  disk.set(MEMORY_KEY,JSON.stringify({version:1,answers:{legacyWorld:'My saved hope'}}));
  failRead = true;
  const tree = await mount();
  await press(tree,'More'); await press(tree,'My Journal'); await press(tree,'Progress');
  assert.ok(textOf(tree.root).includes('could not be opened'));
  assert.ok(!textOf(tree.root).includes('0 of 7 stages'));
  failRead = false;
  await press(tree,'TRY AGAIN');
  assert.ok(textOf(tree.root).includes('1 of 7 stages have your input.'));
  await act(async()=>tree.unmount());
});

async function describe(tree,value) {
  const input=tree.root.findAllByType('TextInput').find(node=>node.props.maxLength===2500);
  assert.ok(input,'Missing assessment description');
  await act(async()=>input.props.onChangeText(value));
}
async function assessAndExplain(tree,context,label='Analyse My Situation') {
  await press(tree,label);
  await act(async()=>context.mock.timers.tick(2850));
  assert.ok(textOf(tree.root).includes('Your Safety Analysis'));
  await press(tree,'See Explanation');
}
function assertSelectedTab(tree,label) {
  const tabs=tree.root.findAllByType('Pressable').filter(node=>node.props.accessibilityRole==='tab'&&!String(node.props.testID||'').startsWith('app-nav-'));
  assert.equal(tabs.length,4);
  assert.equal(tabs.filter(node=>node.props.accessibilityState.selected).length,1);
  assert.equal(tabs.find(node=>textOf(node)===label).props.accessibilityState.selected,true);
}

test('all explanation tabs show their own content, retain Next Steps and reset for a new assessment', async context => {
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();
  await press(tree,'Explore a situation');
  const original='I said stop and they kept pressuring me to join the group.';
  await describe(tree,original); await press(tree,'Worried');
  await assessAndExplain(tree,context);
  assertSelectedTab(tree,'Overview');
  assert.ok(textOf(tree.root).includes('PLAIN LANGUAGE EXPLANATION'));
  await press(tree,'Signals');
  assertSelectedTab(tree,'Signals');
  for(const name of ['Choice','Boundaries','Pressure','Power','Dependency','Secrecy']) assert.ok(textOf(tree.root).includes(name));
  assert.ok(textOf(tree.root).includes('High Risk'));
  assert.ok(textOf(tree.root).includes('Unknown'));
  assert.ok(textOf(tree.root).includes('COERCION / GROOMING INDICATORS'));
  assert.ok(!textOf(tree.root).includes('PLAIN LANGUAGE EXPLANATION'));
  await press(tree,'Emotion');
  assertSelectedTab(tree,'Emotion');
  assert.ok(textOf(tree.root).includes('Emotion details'));
  assert.ok(textOf(tree.root).includes('Feeling selected: Worried'));
  assert.ok(!textOf(tree.root).includes('Six Safety Signals'));
  await press(tree,'Context');
  assertSelectedTab(tree,'Context');
  assert.ok(textOf(tree.root).includes('Assessment context'));
  assert.ok(textOf(tree.root).includes(original));
  assert.ok(textOf(tree.root).includes('Relationship setting: Partner / peer'));
  assert.ok(textOf(tree.root).includes('STRUCTURAL SAFETY'));
  for(const label of ['Context','Signals','Emotion','Overview']) {
    await press(tree,label); await press(tree,'Next Steps');
    assert.ok(textOf(tree.root).includes('Recommended Next Steps'));
    await press(tree,'‹'); assertSelectedTab(tree,label);
  }
  await press(tree,'Context'); await press(tree,'Review My Answers');
  await describe(tree,'We took a break and respected my boundary.'); await press(tree,'Okay');
  await assessAndExplain(tree,context);
  assertSelectedTab(tree,'Overview');
  await press(tree,'Emotion'); assert.ok(textOf(tree.root).includes('Feeling selected: Okay'));
  await press(tree,'Context');
  assert.ok(textOf(tree.root).includes('We took a break and respected my boundary.'));
  assert.ok(!textOf(tree.root).includes(original));
  await act(async()=>tree.unmount());
});

test('explanation tabs preserve Unknown witness emotions and unscored general questions', async context => {
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();
  await press(tree,'Explore a situation'); await press(tree,'Something I witnessed / was told');
  await describe(tree,'A young person attended a family meeting.');
  await press(tree,'10–12'); await press(tree,'Child involved'); await press(tree,'Family');
  await assessAndExplain(tree,context);
  await press(tree,'Emotion');
  assert.ok(textOf(tree.root).includes('Observed response selected: Unknown'));
  assert.ok(textOf(tree.root).includes('NOT ENOUGH EMOTIONAL INFORMATION TO SCORE'));
  assert.ok(!textOf(tree.root).includes('Feeling selected: Confused'));
  assert.ok(!textOf(tree.root).includes('/100'));
  await press(tree,'Signals');
  assert.ok(textOf(tree.root).includes('Unknown'));
  await press(tree,'Context');
  assert.ok(textOf(tree.root).includes('Age range setting: 10–12'));
  assert.ok(textOf(tree.root).includes('Whose age setting: Child involved'));
  await press(tree,'Review My Answers'); await press(tree,'A question / hypothetical');
  await describe(tree,'What are the six safety signals?');
  await assessAndExplain(tree,context,'Check My Question');
  assertSelectedTab(tree,'Overview');
  await press(tree,'Emotion');
  assert.ok(textOf(tree.root).includes('No personal feeling is assumed'));
  assert.ok(textOf(tree.root).includes('NOT SCORED FOR A GENERAL QUESTION'));
  assert.ok(!textOf(tree.root).includes('/100'));
  await press(tree,'Context');
  assert.ok(textOf(tree.root).includes('Input type: Question / hypothetical'));
  assert.ok(textOf(tree.root).includes('LEGAL & SAFETY CONTEXT'));
  await press(tree,'Signals');
  assert.ok(textOf(tree.root).includes('Six Safety Signals — context only'));
  await act(async()=>tree.unmount());
});

test('Diamond flow supports dragging, comparison, safety guards and keeping a personal plan as PDF', async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();
  await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');
  await describe(tree,'I want advice about a reported sexual concern.');
  async function labelled(label) {
    const button=tree.root.findAllByType('Pressable').find(node=>node.props.accessibilityLabel===label);
    assert.ok(button,'Missing control '+label);await act(async()=>button.props.onPress());
  }
  await labelled('Is anyone involved under 18? Yes');
  await labelled('Is there a sexual contact or sexual-boundary concern? Yes');
  await assessAndExplain(tree,context);
  await press(tree,'Context');
  assert.ok(textOf(tree.root).includes('Priority child-safety concern to review'));
  await press(tree,'EXPLORE MY DIAMOND EFFECT');
  assert.ok(textOf(tree.root).includes('Protective support comes first'));
  const field=label=>tree.root.findAllByType('TextInput').find(node=>node.props.accessibilityLabel===label);
  async function fill(label,value) {assert.ok(field(label),label);await act(async()=>field(label).props.onChangeText(value));}
  await fill('My observations','I heard a concern and wrote down the details.');
  await fill('What I still do not know','I do not know what occurred.');
  const canvas=()=>tree.root.findAllByType('View').find(node=>node.props.testID==='diamond-canvas');
  await act(async()=>{canvas().props.onResponderGrant();canvas().props.onResponderMove({}, {dx:-100,dy:0});canvas().props.onResponderRelease();});
  assert.ok(field('Values reflection'),'Dragging left must open Values');
  await fill('Values reflection','Care, respect and clear boundaries.');
  await press(tree,'Faith / Hope');await fill('Faith / Hope reflection','I can ask for support.');
  await press(tree,'Truth');assert.equal(field('My observations').props.value,'I heard a concern and wrote down the details.');
  await act(async()=>canvas().props.onAccessibilityAction({nativeEvent:{actionName:'increment'}}));
  assert.ok(field('Values reflection'),'Accessible adjustment must change the corner');
  await fill('Option 1','Pause and ask for safeguarding advice.');
  await fill('Option 2','Write my observations and clarify unknowns.');
  for(let check=1;check<=5;check++) await labelled(`Option 1, check ${check}, Yes`);
  assert.ok(textOf(tree.root).includes('5 of 5 checks supported'));
  await labelled('Option 2, check 1, No');
  assert.ok(!tree.root.findAllByType('Pressable').some(node=>textOf(node).includes('Continue with option')),'Choice must come after analysis');
  await press(tree,'Analyse both options');
  assert.ok(textOf(tree.root).includes('Both options · comparison review'));
  const blocked=tree.root.findAllByType('Pressable').find(node=>textOf(node)==='Continue with option 2');
  assert.equal(blocked.props.disabled,true);
  await press(tree,'Keep both open / pause');
  await fill('My purpose','Act with care without judging my worth.');
  await fill('One manageable next step','Write a short factual note.');
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('Include a protective support step'));
  await fill('My protective support step','Ask an appropriate safeguarding service for advice.');
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('SAFEGUARDING STILL APPLIES'));
  assert.ok(textOf(tree.root).includes('I AM STILL UNDECIDED'));
  const printCount=pdfPrints.length,writeCount=pdfWrites.length,shareCount=shares.length;
  await press(tree,'Save my plan as PDF');
  assert.equal(pdfPrints.length,printCount+1);assert.equal(pdfWrites.length,writeCount+1);
  assert.ok(pdfPrints.at(-1).html.includes('Act with care without judging my worth.'));
  assert.ok(pdfPrints.at(-1).html.includes('I AM STILL UNDECIDED'));
  assert.ok(pdfPrints.at(-1).html.includes('Write my observations and clarify unknowns.'));
  assert.ok(textOf(tree.root).includes('Your Diamond plan was saved'));
  assert.equal(shares.length,shareCount,'Writing and saving must not share automatically');
  pdfSaveGranted=false;await press(tree,'Save my plan as PDF');
  assert.ok(textOf(tree.root).includes('Saving cancelled'));pdfSaveGranted=true;
  await press(tree,'Share my plan as text');
  assert.ok(shares.at(-1).message.includes('SAFEGUARDING STILL APPLIES'));
  await fill('Option 1','A revised possible action.');
  assert.ok(!textOf(tree.root).includes('Both options · comparison review'));
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('Both written options have been reviewed together'));
  assert.ok(textOf(tree.root).includes('A revised possible action.'));
  await press(tree,'Analyse both options');await press(tree,'Continue with option 1');
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('MY NEXT STEP TO CONSIDER'));
  await press(tree,'Back to my assessment');
  assert.ok(textOf(tree.root).includes('Priority child-safety concern to review'));
  await act(async()=>tree.unmount());
});
test('triangle exploration and explanation comparison preserve uncertainty and active safeguarding',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');
  await describe(tree,'A generic reported situation needing advice.');
  await observationControl(tree,'Is anyone involved under 18? Yes');await observationControl(tree,'Is there a sexual contact or sexual-boundary concern? Yes');
  await assessAndExplain(tree,context);await press(tree,'Context');await press(tree,'EXPLORE MY DIAMOND EFFECT');
  await press(tree,'Read my reported situation');assert.ok(textOf(tree.root).includes('A generic reported situation needing advice.'));
  const triangle=()=>tree.root.findAllByType('View').find(node=>node.props.testID==='reflection-triangle');
  await act(async()=>{triangle().props.onResponderGrant();triangle().props.onResponderMove({}, {dx:-100,dy:120});triangle().props.onResponderRelease();});
  assert.equal(triangle().props.accessibilityValue.text,'Pressure / pain');
  await act(async()=>triangle().props.onAccessibilityAction({nativeEvent:{actionName:'increment'}}));
  assert.equal(triangle().props.accessibilityValue.text,'Choice / boundaries');
  for(const [key,value] of [['care','Yes'],['pressure','Yes'],['freedom','No'],['repeated','Yes']]) await observationControl(tree,`Triangle ${key}, ${value}`);
  assert.ok(textOf(tree.root).includes('Possible coercive caretaking'));
  await observationField(tree,'Specific behaviour behind these answers','A generic reported pattern, still requiring clarification.');
  await observationField(tree,'What remains uncertain in this pattern','The context and duration are uncertain.');
  await press(tree,'More room to choose');
  assert.ok(textOf(tree.root).includes('It does not change the reported situation'));
  await press(tree,'Possible explanations');
  await observationField(tree,'Option 1','One possible explanation, not confirmed.');
  await observationField(tree,'Option 2','Another possible explanation, not confirmed.');
  for(let check=1;check<=5;check++)await observationControl(tree,`Option 1, check ${check}, Yes`);
  await press(tree,'Analyse both options');
  assert.ok(!tree.root.findAllByType('Pressable').some(node=>textOf(node).includes('Continue with option')));
  await observationField(tree,'One manageable next step','Ask how to clarify a missing fact.');
  await press(tree,'Build my next-step plan');assert.ok(textOf(tree.root).includes('Include a protective support step'));
  await observationField(tree,'My protective support step','Ask a safeguarding service for advice.');
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('EXPLANATIONS REMAIN UNCONFIRMED'));
  assert.ok(textOf(tree.root).includes('The context and duration are uncertain.'));
  assert.ok(textOf(tree.root).includes('SAFEGUARDING STILL APPLIES'));
  await press(tree,'Possible next steps');
  assert.ok(!textOf(tree.root).includes('Both options · comparison review'));
  const yes=tree.root.findAllByType('Pressable').find(node=>node.props.accessibilityLabel==='Option 1, check 1, Yes');
  assert.equal(yes.props.accessibilityState.checked,false,'Checks must reset when their meaning changes');
  await act(async()=>tree.unmount());
});
test('paired feeling UI explains a middle word, exports its sources, and invalidates edited interpretations',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');
  await describe(tree,'A generic reported concern needing clarification.');
  await observationControl(tree,'Is anyone involved under 18? Yes');await observationControl(tree,'Is there a sexual contact or sexual-boundary concern? Yes');
  await assessAndExplain(tree,context);await press(tree,'Context');await press(tree,'EXPLORE MY DIAMOND EFFECT');
  const result=()=>tree.root.findAllByType('View').find(node=>node.props.testID==='feeling-pair-result');
  const beforeShares=shares.length;
  await press(tree,'Find a possible middle word');assert.ok(textOf(tree.root).includes('Choose Feeling 1 and Feeling 2 first'));
  for(const [index,feeling] of [[1,'Love'],[2,'Anger']]){
    await observationControl(tree,`Choose Feeling ${index}`);await observationControl(tree,`Feeling ${index}, ${feeling}`);
    await observationControl(tree,`Feeling ${index} source, My own feeling`);
    await observationField(tree,`Feeling ${index} belongs to`,'Me');
  }
  await observationControl(tree,'Feeling pair scope, One person, same situation');
  await observationField(tree,'Specific behaviour behind these answers','I heard a generic upsetting message.');
  await observationField(tree,'What remains uncertain in this pattern','Its intended meaning is not confirmed.');
  await press(tree,'Find a possible middle word');assert.ok(result());
  assert.ok(textOf(result()).includes('Ambivalence'));assert.ok(textOf(result()).includes('Why this word could fit'));
  assert.ok(textOf(result()).includes('Questions about the possible why'));assert.ok(textOf(result()).includes('Its intended meaning is not confirmed.'));
  const linkCount=openedLinks.length;await press(tree,'Read the meaning of ambivalence');
  assert.equal(openedLinks.length,linkCount+1);assert.equal(openedLinks.at(-1),'https://dictionary.apa.org/ambivalence');
  await observationField(tree,'One manageable next step','Write down the question I want help with.');
  await observationField(tree,'My protective support step','Ask for safeguarding advice.');
  await press(tree,'Build my next-step plan');const prints=pdfPrints.length;
  await press(tree,'Save my plan as PDF');assert.equal(pdfPrints.length,prints+1);
  assert.ok(pdfPrints.at(-1).html.includes('Ambivalence'));assert.ok(pdfPrints.at(-1).html.includes('source: My own feeling'));
  assert.ok(pdfPrints.at(-1).html.includes('SAFEGUARDING STILL APPLIES'));
  assert.equal(shares.length,beforeShares);
  await observationControl(tree,'Feeling 2 source, My impression');assert.ok(!result(),'Changing a source must clear the earlier interpretation');
  await press(tree,'Find a possible middle word');assert.ok(textOf(result()).includes('Mixed impressions'));
  assert.ok(!textOf(result()).includes('Ambivalence'));assert.ok(textOf(result()).includes('actual feelings and motives remain unconfirmed'));
  await observationControl(tree,'Feeling pair scope, Two people');await observationControl(tree,'Feeling 2 source, My own feeling');
  await press(tree,'Find a possible middle word');assert.ok(textOf(result()).includes('Check who feels what'));
  assert.ok(textOf(tree.root).includes('Protective support comes first'));
  await act(async()=>tree.unmount());
});

async function observationControl(tree,label) {
  const control=tree.root.findAllByType('Pressable').find(node=>node.props.accessibilityLabel===label);
  assert.ok(control,'Missing observation control '+label);
  await act(async()=>control.props.onPress());
}
async function observationField(tree,label,value) {
  const input=tree.root.findAllByType('TextInput').find(node=>node.props.accessibilityLabel===label);
  assert.ok(input,'Missing observation field '+label);
  await act(async()=>input.props.onChangeText(value));
}
test('multiple observations stay separate by person, keep safeguarding active, and snapshot notes without sharing',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');
  const checked=label=>tree.root.findAllByType('Pressable').find(node=>node.props.accessibilityLabel===label).props.accessibilityState.checked;
  await observationControl(tree,'Person 1, feelings, Scared');await observationControl(tree,'Person 1, feelings, Confused');
  assert.equal(checked('Person 1, feelings, Scared'),true);assert.equal(checked('Person 1, feelings, Confused'),true);
  assert.equal(checked('Person 1, feelings, Unknown'),false);
  await observationControl(tree,'Person 1, feelings, Unknown');
  assert.equal(checked('Person 1, feelings, Scared'),false);assert.equal(checked('Person 1, feelings, Unknown'),true);
  await observationControl(tree,'Person 1, feelings, Calm');await observationControl(tree,'Person 1, feelings, Happy / cheerful');
  await observationControl(tree,'Person 1, behaviours, Smiling / laughing');await observationControl(tree,'Person 1, behaviours, Pulled away');
  await observationField(tree,'Person 1 label','Person A');
  await press(tree,'Add another person');await observationField(tree,'Person 2 label','Person B');
  await observationControl(tree,'Person 2, behaviours, Asleep');
  await observationField(tree,'Person 2 observation note','A private generic note for this assessment.');
  await observationField(tree,'Person 2 observation time','Approximately 6 pm, date uncertain.');
  await observationField(tree,'Person 2 interpretation note','A possible explanation that remains unconfirmed.');
  await observationField(tree,'Person 2 unknowns note','I do not know the exact sequence.');
  await describe(tree,'Please help me review a reported situation.');
  await observationControl(tree,'Is anyone involved under 18? Yes');await observationControl(tree,'Is there a sexual contact or sexual-boundary concern? Yes');
  const shareCount=shares.length;
  await assessAndExplain(tree,context);await press(tree,'Emotion');
  assert.ok(textOf(tree.root).includes('Observed response selected: Calm, Happy / cheerful'));
  assert.ok(textOf(tree.root).includes('OBSERVED RESPONSES RECORDED — NOT AN EMOTION SCORE'));
  assert.ok(textOf(tree.root).includes('2 appearance labels; 3 behaviour labels'));
  assert.ok(textOf(tree.root).includes('Person B — seemed: Unknown; behaviours: Asleep'));
  assert.ok(textOf(tree.root).includes('A private generic note for this assessment.'));
  for(const value of ['Direct observation','Interpretation · not confirmed','Still unknown','Approximately 6 pm, date uncertain.','A possible explanation that remains unconfirmed.','I do not know the exact sequence.']) assert.ok(textOf(tree.root).includes(value));
  assert.ok(!textOf(tree.root).includes('/100'));
  await press(tree,'Context');assert.ok(textOf(tree.root).includes('Priority child-safety concern to review'));
  await press(tree,'EXPLORE MY DIAMOND EFFECT');
  const screen=tree.root.findAll(node=>typeof node.type==='function'&&node.type.name==='DiamondEffectScreen')[0];
  const snapshot=screen.props.result.assessmentInput.observedPeople;
  assert.equal(screen.props.result.structuralSafety.capacityConcern,true);
  await press(tree,'Back to my assessment');await press(tree,'Review My Answers');
  assert.equal(checked('Person 1, feelings, Calm'),true);
  await observationField(tree,'Person 2 observation note','A revised generic note.');
  assert.equal(snapshot[1].details,'A private generic note for this assessment.');
  assert.equal(snapshot[1].interpretation,'A possible explanation that remains unconfirmed.');
  await assessAndExplain(tree,context);await press(tree,'Emotion');
  assert.ok(textOf(tree.root).includes('A revised generic note.'));
  assert.ok(!textOf(tree.root).includes('A private generic note for this assessment.'));
  assert.equal(shares.length,shareCount);
  assert.ok(![...disk.values()].some(value=>value.includes('A revised generic note.')));
  await act(async()=>tree.unmount());
});
test('observed sleep with an adult sexual concern gets capacity triage and is ignored when switching to a general question',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');await press(tree,'18+');
  await describe(tree,'I would like to clarify what I observed.');
  await observationControl(tree,'Person 1, feelings, Calm');await observationControl(tree,'Person 1, behaviours, Unresponsive');
  for(const label of ['Is anyone involved under 18? No','Is there a sexual contact or sexual-boundary concern? Yes','Is anyone in immediate danger now? No']) await observationControl(tree,label);
  await assessAndExplain(tree,context);await press(tree,'Context');
  assert.ok(textOf(tree.root).includes('Priority capacity / consent concern to review'));
  assert.ok(!textOf(tree.root).includes('Priority child-safety concern to review'));
  await press(tree,'EXPLORE MY DIAMOND EFFECT');assert.ok(textOf(tree.root).includes('Protective support comes first'));
  assert.ok(!textOf(tree.root).includes('WA Child Protection ·'));
  await press(tree,'Back to my assessment');await press(tree,'Review My Answers');await press(tree,'A question / hypothetical');
  assert.ok(!textOf(tree.root).includes('How did each person seem?'));
  await describe(tree,'What do respectful boundaries mean?');
  await assessAndExplain(tree,context,'Check My Question');await press(tree,'Context');
  assert.ok(!textOf(tree.root).includes('Priority capacity / consent concern to review'));
  assert.ok(!textOf(tree.root).includes('Observed behaviours: Unresponsive'));
  await act(async()=>tree.unmount());
});

test('WA support choices open only the requested dialler or official guidance and recover from link failure',async()=>{
  const before=openedLinks.length;
  const tree=await mount();await press(tree,'Support');
  assert.ok(textOf(tree.root).includes('WA support choices'));assert.ok(textOf(tree.root).includes('Crisis Care · after hours'));
  assert.equal(openedLinks.length,before,'Showing support must not call or open anything automatically');
  await observationControl(tree,'Child Protection · 1800 273 889');assert.equal(openedLinks.at(-1),'tel:1800273889');
  await observationControl(tree,'Crisis Care · 1800 199 008');assert.equal(openedLinks.at(-1),'tel:1800199008');
  await observationControl(tree,'Emergency · 000');assert.equal(openedLinks.at(-1),'tel:000');
  await observationControl(tree,'Read WA Crisis Care guidance');assert.equal(openedLinks.at(-1),'https://www.wa.gov.au/service/community-services/community-support/crisis-care');
  await observationControl(tree,'Read WA child safety guidance');assert.equal(openedLinks.at(-1),'https://www.wa.gov.au/organisation/department-of-communities/concerns-the-safety-or-wellbeing-of-child-or-young-person');
  failLink=true;await observationControl(tree,'Crisis Care · 1800 199 008');
  assert.ok(textOf(tree.root).includes('Could not open this link'));assert.ok(textOf(tree.root).includes('1800 199 008'));failLink=false;
  await act(async()=>tree.unmount());
});

test('an adult immediate-danger report gets priority without inventing a child-parent sexual pattern',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'18+');
  await describe(tree,'This situation needs urgent assistance.');
  for(const label of ['Is anyone involved under 18? No','Is there a sexual contact or sexual-boundary concern? No','Is anyone in immediate danger now? Yes']) {
    const button=tree.root.findAllByType('Pressable').find(node=>node.props.accessibilityLabel===label);
    assert.ok(button);await act(async()=>button.props.onPress());
  }
  await assessAndExplain(tree,context);await press(tree,'Context');
  assert.ok(textOf(tree.root).includes('Immediate safety needs attention'));
  assert.ok(!textOf(tree.root).includes('A child-parent/caregiver sexual context'));
  await press(tree,'EXPLORE MY DIAMOND EFFECT');
  assert.ok(textOf(tree.root).includes('Call emergency 000'));
  assert.ok(!textOf(tree.root).includes('WA Child Protection ·'));
  await act(async()=>tree.unmount());
});

test('final rights review keeps sources distinct, opens links on request and exports current guidance with encouragement',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');
  await describe(tree,'A generic reported concern to clarify with support.');
  await observationControl(tree,'Is anyone involved under 18? Yes');
  await observationControl(tree,'Is there a sexual contact or sexual-boundary concern? Yes');
  await observationField(tree,'Person 1 observation note','I recorded a generic direct observation.');
  await observationField(tree,'Person 1 interpretation note','A generic unconfirmed interpretation.');
  await assessAndExplain(tree,context);await press(tree,'Context');await press(tree,'EXPLORE MY DIAMOND EFFECT');
  await observationField(tree,'One manageable next step','Ask which facts need clarification.');
  await observationField(tree,'My protective support step','Ask for safeguarding advice.');
  await observationField(tree,'My question for a qualified adviser','How can I safely share my record?');
  await observationField(tree,'Statements I was told · who said what and when','A generic statement, date uncertain.');
  const linkCount=openedLinks.length,shareCount=shares.length;
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('Jurisdiction is unconfirmed'));
  assert.ok(!tree.root.findAllByType('Pressable').some(node=>node.props.accessibilityLabel==='Consent and capacity'));
  assert.ok(textOf(tree.root).includes('Encouragement'));
  await observationControl(tree,'Review jurisdiction · Western Australia');
  assert.ok(!textOf(tree.root).includes('My facts, rights and decision review'),'Changing review input hides the previous plan');
  await press(tree,'Build my next-step plan');
  await observationControl(tree,'Direct observations · recorded by me, not independently verified');
  await observationControl(tree,'Interpretations and possible explanations · unconfirmed');
  assert.ok(textOf(tree.root).includes('I recorded a generic direct observation.'));
  await observationControl(tree,'Consent and capacity');
  assert.ok(textOf(tree.root).includes('Lack of physical resistance'));
  assert.equal(openedLinks.length,linkCount,'Building and reading do not call or transmit information');
  await observationControl(tree,'Read source · WA Criminal Code · ss 319–322, 329');
  assert.ok(openedLinks.at(-1).endsWith('main_mrtitle_218_homepage.html'));
  failLink=true;await observationControl(tree,'Legal Aid WA · 1300 650 579');
  assert.ok(textOf(tree.root).includes('Could not open this link'));failLink=false;
  await observationControl(tree,'Legal Aid WA · 1300 650 579');assert.equal(openedLinks.at(-1),'tel:1300650579');
  await press(tree,'Save my plan as PDF');
  const html=pdfPrints.at(-1).html;
  for(const value of ['KNOW YOUR RIGHTS','ENCOURAGEMENT','How can I safely share my record?','I recorded a generic direct observation.','A generic unconfirmed interpretation.','main_mrtitle_218_homepage.html','SAFEGUARDING STILL APPLIES']) assert.ok(html.includes(value),value);
  assert.equal(shares.length,shareCount);
  assert.ok(![...disk.values()].some(value=>value.includes('How can I safely share my record?')));
  await observationControl(tree,'Review jurisdiction · Elsewhere');await press(tree,'Build my next-step plan');
  await press(tree,'Save my plan as PDF');assert.ok(!pdfPrints.at(-1).html.includes('Under s 319'));
  assert.ok(pdfPrints.at(-1).html.includes('WA legal rules are not applied here'));
  await act(async()=>tree.unmount());
});

test('PDF controls work before build, preserve unfinished writing and build reviews both options without hiding the document',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');
  await describe(tree,'A generic private report to preserve.');
  await observationControl(tree,'Is anyone involved under 18? Yes');await observationControl(tree,'Is there a sexual contact or sexual-boundary concern? Yes');
  await assessAndExplain(tree,context);await press(tree,'Context');await press(tree,'EXPLORE MY DIAMOND EFFECT');
  await observationField(tree,'Option 1','One generic unfinished option.');
  await observationField(tree,'My question for a qualified adviser','A generic first question.');
  const writes=pdfWrites.length,sharing=pdfShares.length,opens=pdfOpens.length,prints=pdfPrints.length;
  await press(tree,'Open my PDF');
  assert.equal(pdfOpens.length,opens+1);assert.equal(pdfPrints.length,prints+1);
  assert.equal(pdfWrites.length,writes);assert.equal(pdfShares.length,sharing);
  const html=pdfPrints.at(-1).html;
  for(const text of ['My Diamond Effect · Draft','COMPARISON NOT REVIEWED','One generic unfinished option.','A generic private report to preserve.','SAFEGUARDING STILL APPLIES','ENCOURAGEMENT']) assert.ok(html.includes(text),text);
  pdfSaveGranted=false;await press(tree,'Save my writing as PDF');pdfSaveGranted=true;
  assert.ok(textOf(tree.root).includes('Saving cancelled'));
  assert.equal(pdfWrites.length,writes);assert.equal(pdfPrints.length,prints+1,'An unchanged prepared PDF can be saved again');
  await press(tree,'Share PDF');assert.equal(pdfShares.length,sharing+1);assert.ok(pdfShares.at(-1)[0].includes('My-Diamond-Draft-'));
  pdfFailOpen=true;await press(tree,'Open my PDF');pdfFailOpen=false;
  assert.ok(textOf(tree.root).includes('Could not open your PDF reader'));
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('My gathered writing · Draft'));
  assert.ok(textOf(tree.root).includes('STILL TO REVIEW'));
  await observationField(tree,'My question for a qualified adviser','A revised generic question.');
  assert.ok(!textOf(tree.root).includes('PDF prepared ·'));
  pdfFailPrint=true;await press(tree,'Save my writing as PDF');pdfFailPrint=false;
  assert.ok(textOf(tree.root).includes('could not be exported'));
  await press(tree,'Save my writing as PDF');
  assert.equal(pdfWrites.length,writes+1);
  assert.ok(textOf(tree.root).includes('Your draft PDF was saved'));
  assert.ok(pdfPrints.at(-1).html.includes('A revised generic question.'));
  assert.ok(!pdfPrints.at(-1).html.includes('A generic first question.'));
  await observationField(tree,'Option 2','A second generic option.');
  await observationField(tree,'One manageable next step','Ask for clarification.');
  await observationField(tree,'My protective support step','Seek appropriate safeguarding advice.');
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('Both written options have been reviewed together'));
  assert.ok(textOf(tree.root).includes('BOTH OPTIONS REVIEWED'));
  assert.ok(!textOf(tree.root).includes('My gathered writing · Draft'));
  await press(tree,'Save my plan as PDF');
  assert.ok(pdfPrints.at(-1).html.includes('I AM STILL UNDECIDED'));
  assert.ok(!pdfPrints.at(-1).html.includes('DRAFT — NOT A COMPLETED'));
  await act(async()=>tree.unmount());
});

test('new graphics resize, preserve writing and safeguarding, and respect both motion controls',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  systemReduceMotion=true;
  const beforeListeners=motionListeners.size,beforePulses=motionStarts.filter(item=>item.duration===280).length;
  const tree=await mount();await press(tree,'Explore a situation');await press(tree,'Something I witnessed / was told');
  await describe(tree,'A generic concern for a child requiring clarification.');
  await observationControl(tree,'Is anyone involved under 18? Yes');await observationControl(tree,'Is there a sexual contact or sexual-boundary concern? Yes');
  await assessAndExplain(tree,context);await press(tree,'Context');await press(tree,'EXPLORE MY DIAMOND EFFECT');
  const control=()=>tree.root.findAllByType('Pressable').find(node=>node.props.accessibilityLabel==='Reduce motion');
  assert.equal(control().props.accessibilityState.checked,true);assert.equal(control().props.disabled,true);
  const graphic=id=>tree.root.findAllByType('View').find(node=>node.props.testID===id);
  await observationField(tree,'My observations','This private writing should survive graphics changes.');
  const prints=pdfPrints.length,shared=pdfShares.length;
  for(const width of [240,640]) {
    for(const id of ['diamond-canvas','reflection-triangle']) {
      await act(async()=>graphic(id).props.onLayout({nativeEvent:{layout:{width}}}));
      await act(async()=>{graphic(id).props.onResponderGrant();graphic(id).props.onResponderMove({}, {dx:10000,dy:10000});graphic(id).props.onResponderRelease();});
      assert.equal(graphic(id).props.style.width,'100%');
    }
  }
  await press(tree,'Truth');
  assert.equal(tree.root.findAllByType('TextInput').find(node=>node.props.accessibilityLabel==='My observations').props.value,'This private writing should survive graphics changes.');
  assert.ok(textOf(tree.root).includes('Protective support comes first'));
  assert.equal(motionStarts.filter(item=>item.duration===280).length,beforePulses,'System reduced motion must suppress selection pulses');
  assert.equal(pdfPrints.length,prints);assert.equal(pdfShares.length,shared,'Graphics must not export or share writing');
  await act(async()=>{systemReduceMotion=false;for(const listener of motionListeners)listener(false);});
  assert.equal(control().props.disabled,false);assert.equal(control().props.accessibilityState.checked,false);
  await observationControl(tree,'Reduce motion');assert.equal(control().props.accessibilityState.checked,true);
  const pausedPulses=motionStarts.filter(item=>item.duration===280).length;
  await press(tree,'Values');assert.equal(motionStarts.filter(item=>item.duration===280).length,pausedPulses);
  await observationControl(tree,'Reduce motion');await press(tree,'Beliefs');
  assert.ok(motionStarts.filter(item=>item.duration===280).length>pausedPulses);
  await act(async()=>tree.unmount());assert.equal(motionListeners.size,beforeListeners,'Motion listener must be removed on leaving the screen');
});


test('Support Resources switches between WA and National tabs',async()=>{
  const tree=await mount();
  await press(tree,'Support');
  const tabs=()=>tree.root.findAllByType('Pressable').filter(node=>node.props.accessibilityRole==='tab');
  const selected=label=>tabs().find(node=>textOf(node)===label).props.accessibilityState.selected;
  assert.equal(selected('WA Services'),true);
  assert.equal(selected('National'),false);
  assert.ok(textOf(tree.root).includes('WA support choices'));
  assert.ok(!textOf(tree.root).includes('Kids Helpline'));
  await press(tree,'National');
  assert.equal(selected('WA Services'),false);
  assert.equal(selected('National'),true);
  for(const label of ['Emergency — 000','Kids Helpline','1800RESPECT','Lifeline','13YARN','eSafety Commissioner']) {
    assert.ok(textOf(tree.root).includes(label),label);
  }
  assert.ok(!textOf(tree.root).includes('WA support choices'));
  const before=openedLinks.length;
  await press(tree,'Kids Helpline');
  assert.equal(openedLinks.at(-1),'tel:1800551800');
  assert.equal(openedLinks.length,before+1);
  await press(tree,'WA Services');
  assert.equal(selected('WA Services'),true);
  assert.ok(textOf(tree.root).includes('WA support choices'));
  assert.ok(!textOf(tree.root).includes('Kids Helpline'));
  await act(async()=>tree.unmount());
});

const {MEMORY_KEY:LIFE_MEMORY_KEY}=require('../src/lifeJourneyMemory.cjs');
const byId=(tree,id)=>tree.root.findAll(node=>node.props.testID===id&&typeof node.type==='string')[0];
async function pressId(tree,id){const node=byId(tree,id);assert.ok(node,'Missing '+id);await act(async()=>{await node.props.onPress();});}
async function writeLife(tree,id,text){await act(async()=>{byId(tree,id).props.onChangeText(text);});}

test('Home and More open Life Journey with distinct evidence tabs and unknown early-life feelings',async()=>{
  disk.delete(LIFE_MEMORY_KEY);const beforeLinks=openedLinks.length,beforeShares=shares.length;
  const tree=await mount();await pressId(tree,'home-life-journey');
  assert.ok(byId(tree,'life-journey-screen'));
  assert.ok(textOf(tree.root).includes('Country under pressure'));
  await pressId(tree,'life-tab-meaning');await pressId(tree,'life-feeling-distress');
  assert.equal(byId(tree,'life-feeling-distress').props.accessibilityState.selected,true);
  await pressId(tree,'life-previous');
  assert.ok(textOf(tree.root).includes('No feelings are assigned in this chapter'));
  assert.equal(tree.root.findAll(node=>typeof node.type==='string'&&String(node.props.testID).startsWith('life-feeling-')).length,0);
  assert.equal(byId(tree,'life-previous').props.disabled,true);
  await pressId(tree,'life-next');
  assert.equal(byId(tree,'life-feeling-distress').props.accessibilityState.selected,true);
  await pressId(tree,'life-tab-signals');assert.ok(textOf(tree.root).includes('QUESTIONS, NOT SCORES'));
  await pressId(tree,'life-sources');assert.ok(textOf(tree.root).includes('Original handwritten letters'));
  assert.equal(openedLinks.length,beforeLinks,'Sources must not open automatically');
  assert.equal(shares.length,beforeShares,'Writing must not be shared automatically');
  await pressId(tree,'life-journey-back');await press(tree,'More');await press(tree,'Yagan Life Journey');
  assert.ok(byId(tree,'life-journey-screen'));
  await act(async()=>tree.unmount());
});

test('Life Journey notes restore across restart, update PDFs, and clear only the chosen chapter',async()=>{
  disk.delete(LIFE_MEMORY_KEY);const existingPersonal=disk.get(MEMORY_KEY),printCount=pdfPrints.length;
  let tree=await mount();await pressId(tree,'home-life-journey');
  await writeLife(tree,'life-reflection','My first <question> & Country.');
  await press(tree,'Cultural guidance');await writeLife(tree,'life-additional-note','Unverified cultural question.');
  assert.equal(JSON.parse(disk.get(LIFE_MEMORY_KEY)).notes.country.reflection,'My first <question> & Country.');
  await pressId(tree,'life-pdf-save');
  assert.ok(textOf(tree.root).includes('saved to the folder you chose'));
  assert.ok(pdfPrints.at(-1).html.includes('My first &lt;question&gt; &amp; Country.'));
  assert.ok(pdfPrints.at(-1).html.includes('Cultural guidance - unverified in this tool'));
  await pressId(tree,'life-pdf-open');await pressId(tree,'life-pdf-share');
  assert.equal(pdfPrints.length,printCount+1,'Unchanged reflection reuses its PDF');
  await writeLife(tree,'life-reflection','My updated question.');await pressId(tree,'life-pdf-save');
  assert.equal(pdfPrints.length,printCount+2);
  assert.ok(pdfPrints.at(-1).html.includes('My updated question.'));
  await pressId(tree,'life-text-share');assert.ok(shares.at(-1).message.includes('My updated question.'));
  await pressId(tree,'life-previous');await writeLife(tree,'life-reflection','An early-life question remains open.');
  await act(async()=>tree.unmount());
  tree=await mount();await pressId(tree,'home-life-journey');
  assert.equal(byId(tree,'life-reflection').props.value,'My updated question.');
  await pressId(tree,'life-clear-chapter');
  assert.equal(byId(tree,'life-reflection').props.value,'My updated question.','Confirmation must not clear before choosing');
  await act(async()=>alerts.at(-1)[2].find(item=>item.text==='Clear notes').onPress());
  assert.equal(byId(tree,'life-reflection').props.value,'');
  await pressId(tree,'life-previous');assert.equal(byId(tree,'life-reflection').props.value,'An early-life question remains open.');
  assert.equal(disk.get(MEMORY_KEY),existingPersonal,'Historical notes cannot overwrite personal journey memory');
  await act(async()=>tree.unmount());
});

test('Life Journey load errors prevent replacement and save errors preserve the current draft for retry',async()=>{
  const original=JSON.stringify({version:1,notes:{country:{reflection:'Preserve my saved history'}}});
  disk.set(LIFE_MEMORY_KEY,original);failRead=true;
  const tree=await mount();await pressId(tree,'home-life-journey');
  assert.equal(byId(tree,'life-reflection').props.editable,false);
  assert.equal(byId(tree,'life-pdf-save').props.disabled,true);
  await writeLife(tree,'life-reflection','Must not replace saved text');
  assert.equal(disk.get(LIFE_MEMORY_KEY),original);
  failRead=false;await press(tree,'Retry loading Life Journey notes');
  assert.equal(byId(tree,'life-reflection').props.value,'Preserve my saved history');
  failWrite=true;await writeLife(tree,'life-reflection','Current draft to retry');
  assert.ok(textOf(tree.root).includes('Device autosave failed'));
  assert.equal(disk.get(LIFE_MEMORY_KEY),original);
  failWrite=false;await press(tree,'Retry saving Life Journey notes');
  assert.equal(JSON.parse(disk.get(LIFE_MEMORY_KEY)).notes.country.reflection,'Current draft to retry');
  await act(async()=>tree.unmount());
});

test('Life Journey accurately reports PDF cancellation, print and reader failure without losing writing',async()=>{
  disk.delete(LIFE_MEMORY_KEY);const tree=await mount();await pressId(tree,'home-life-journey');
  await writeLife(tree,'life-reflection','Keep this during export failures');
  pdfFailPrint=true;await pressId(tree,'life-pdf-save');
  assert.ok(textOf(tree.root).includes('Could not export the PDF'));
  pdfFailPrint=false;pdfSaveGranted=false;await pressId(tree,'life-pdf-save');
  assert.ok(textOf(tree.root).includes('Saving cancelled'));
  pdfSaveGranted=true;pdfFailOpen=true;await pressId(tree,'life-pdf-open');
  assert.ok(textOf(tree.root).includes('Could not open a PDF reader'));
  pdfFailOpen=false;await pressId(tree,'life-pdf-share');
  assert.ok(textOf(tree.root).includes('PDF sharing menu opened'));
  assert.equal(byId(tree,'life-reflection').props.value,'Keep this during export failures');
  await act(async()=>tree.unmount());
});

test('presentation overview explains current capabilities and opens the fictional example',async()=>{
 const tree=await mount();await press(tree,'Our purpose & vision');
 assert.ok(textOf(tree.root).includes('Healthy growth.'));
 assert.ok(textOf(tree.root).includes('does not use a live AI service'));
 assert.ok(textOf(tree.root).includes('Aspirations are not measured outcomes'));
 await pressId(tree,'presentation-example');assert.ok(textOf(tree.root).includes('Choose a fictional example'));
 await act(async()=>tree.unmount());
});
test('language and reading preferences save locally, affect Home and restore after restart',async()=>{
 const {PREFERENCE_KEY}=require('../src/appPreferences.cjs');disk.delete(PREFERENCE_KEY);
 let tree=await mount();await press(tree,'Language & reading');
 await pressId(tree,'preference-language-es');await pressId(tree,'preference-size-large');await pressId(tree,'preference-motion-true');
 const request=tree.root.findAllByType('TextInput').find(x=>x.props.testID==='preference-requested-language');
 await act(async()=>request.props.onChangeText('Noongar'));
 await pressId(tree,'preferences-save');
 const saved=JSON.parse(disk.get(PREFERENCE_KEY)).preferences;
 assert.equal(saved.language,'es');assert.equal(saved.readingSize,'large');assert.equal(saved.reduceMotion,true);assert.equal(saved.requestedLanguage,'Noongar');
 await pressId(tree,'app-nav-home');assert.ok(textOf(tree.root).includes('Conocimiento'));
 assert.equal(tree.root.findByProps({testID:'home-value-understanding'}).props.style({pressed:false})[1].width,'50%');
 await act(async()=>tree.unmount());tree=await mount();assert.ok(textOf(tree.root).includes('Comenzar mi camino'));
 await act(async()=>tree.unmount());disk.delete(PREFERENCE_KEY);
});
test('international support does not show Australian dialler actions as local services',async()=>{
 const {PREFERENCE_KEY}=require('../src/appPreferences.cjs');disk.delete(PREFERENCE_KEY);
 const tree=await mount();await press(tree,'Language & reading');await pressId(tree,'preference-country-NZ');await pressId(tree,'preferences-save');
 await pressId(tree,'app-nav-support');assert.ok(tree.root.findByProps({testID:'international-support'}));
 assert.ok(textOf(tree.root).includes('not a local service directory'));
 assert.ok(!tree.root.findAllByType('Pressable').some(x=>String(x.props.accessibilityLabel||'').includes('1800')));
 await act(async()=>tree.unmount());disk.delete(PREFERENCE_KEY);
});
test('preference save and load failures preserve choices and never overwrite saved preferences',async()=>{
 const {PREFERENCE_KEY}=require('../src/appPreferences.cjs');disk.delete(PREFERENCE_KEY);
 let tree=await mount();await press(tree,'Language & reading');await pressId(tree,'preference-country-CA');failWrite=true;
 await pressId(tree,'preferences-save');assert.ok(textOf(tree.root).includes('Preferences could not be saved'));assert.equal(disk.get(PREFERENCE_KEY),undefined);
 assert.equal(tree.root.findByProps({testID:'preference-country-CA'}).props.accessibilityState.checked,true);
 failWrite=false;await pressId(tree,'preferences-save');const old=disk.get(PREFERENCE_KEY);await act(async()=>tree.unmount());
 failRead=true;tree=await mount();await press(tree,'Language & reading');
 assert.equal(tree.root.findByProps({testID:'preferences-save'}).props.disabled,true);assert.equal(disk.get(PREFERENCE_KEY),old);
 failRead=false;await act(async()=>tree.unmount());disk.delete(PREFERENCE_KEY);
});
test('learning search filters public topics, supports empty results and clears without changing writing',async()=>{
 const tree=await mount();await press(tree,'Learn');
 const field=()=>tree.root.findAllByType('TextInput').find(x=>x.props.accessibilityLabel==='Search learning topics');
 await act(async()=>field().props.onChangeText('boundaries'));assert.ok(textOf(tree.root).includes('Healthy Boundaries'));assert.ok(!textOf(tree.root).includes('Child Development'));
 await act(async()=>field().props.onChangeText('zzznomatch'));assert.ok(textOf(tree.root).includes('No matching topics'));
 await act(async()=>field().props.onChangeText(''));assert.ok(textOf(tree.root).includes('Child Development'));
 await act(async()=>tree.unmount());
});

test('Living connections opens from Learn, preserves draft boundaries, changes selection and handles Android Back',async()=>{
 const linksBefore=openedLinks.length,personalBefore=disk.get(MEMORY_KEY);
 const tree=await mount();await press(tree,'Learn');
 const search=tree.root.findAllByType('TextInput').find(x=>x.props.accessibilityLabel==='Search learning topics');
 await act(async()=>search.props.onChangeText('kinship'));
 assert.ok(textOf(tree.root).includes('Living connections'));
 assert.ok(!textOf(tree.root).includes('No matching topics'));
 await press(tree,'Living connections');
 assert.ok(byId(tree,'cultural-connections-screen'));
 assert.equal(byId(tree,'app-nav-learn').props.accessibilityState.selected,true);
 assert.match(textOf(byId(tree,'connections-draft-status')),/Cultural review, reuse permissions and legal review pending/);
 assert.ok(textOf(tree.root).includes('not a genealogy or boundary map'));
 await pressId(tree,'connections-choose-view');await pressId(tree,'connections-view-family');
 await pressId(tree,'connections-node-0');
 assert.ok(textOf(byId(tree,'connections-detail')).includes('Bennelong'));
 assert.equal(openedLinks.length,linksBefore,'Reading and selecting cannot open a source automatically');
 await pressId(tree,'connections-detail-source');
 assert.equal(openedLinks.at(-1),require('../src/culturalConnections.cjs').sources.family[1]);
 await pressId(tree,'connections-choose-view');await pressId(tree,'connections-view-care');
 assert.ok(textOf(byId(tree,'connections-detail')).includes('Our thematic comparison'));
 assert.ok(!textOf(byId(tree,'connections-detail')).includes('Bennelong'));
 assert.equal(tree.root.findAllByType('Pressable').filter(x=>String(x.props.testID||'').startsWith('connections-node-')).length,6);
 assert.equal(backHandlers.size,1);
 await act(async()=>assert.equal([...backHandlers][0](),true));
 assert.ok(textOf(tree.root).includes('Learning Centre'));assert.equal(backHandlers.size,0);
 assert.equal(disk.get(MEMORY_KEY),personalBefore,'Cultural browsing cannot change personal journey answers');
 await act(async()=>tree.unmount());
});

test('Living connections keeps source-only word entries, supports failed-link retry and lists all research resources',async()=>{
 const personalBefore=disk.get(MEMORY_KEY),linksBefore=openedLinks.length;
 const tree=await mount();await press(tree,'More');await press(tree,'Living connections');
 await pressId(tree,'connections-words-toggle');await pressId(tree,'connections-choose-word');await pressId(tree,'connections-word-10');
 assert.ok(textOf(byId(tree,'connections-word-detail')).includes('Use guidance is pending'));
 assert.ok(!textOf(byId(tree,'connections-word-detail')).includes('assessing what is healthy'));
 failLink=true;await pressId(tree,'connections-word-source');
 const url=require('../src/culturalConnections.cjs').sources.ngarrindjeri[1];
 assert.ok(textOf(byId(tree,'connections-word-source-error')).includes(url));
 assert.equal(openedLinks.length,linksBefore);
 failLink=false;await pressId(tree,'connections-word-source');assert.equal(openedLinks.at(-1),url);
 assert.equal(byId(tree,'connections-word-source-error'),undefined);
 await pressId(tree,'connections-sources-toggle');
 const links=tree.root.findAllByType('Pressable').filter(x=>String(x.props.testID||'').startsWith('connections-source-'));
 const resources=tree.root.findAllByType('Pressable').filter(x=>String(x.props.testID||'').startsWith('connections-resource-'));
 assert.equal(links.length,21);assert.equal(resources.length,7);
 await pressId(tree,'connections-resource-austlang');assert.equal(openedLinks.at(-1),'https://aiatsis.gov.au/research/languages/austlang');
 await pressId(tree,'connections-back');assert.ok(textOf(tree.root).includes('Learning Centre'));
 assert.equal(disk.get(MEMORY_KEY),personalBefore);
 await act(async()=>tree.unmount());assert.equal(backHandlers.size,0);
});

test('cultural comparison opens from learning search, swaps distinct accounts and keeps evidence gaps visible',async()=>{
 const personalBefore=disk.get(MEMORY_KEY),linksBefore=openedLinks.length;
 const tree=await mount();await press(tree,'Learn');
 const field=tree.root.findAllByType('TextInput').find(x=>x.props.accessibilityLabel==='Search learning topics');
 await act(async()=>field.props.onChangeText('curiosity'));
 assert.ok(textOf(tree.root).includes('Compare & stay curious'));
 assert.ok(!textOf(tree.root).includes('No matching topics'));
 await press(tree,'Compare & stay curious');
 assert.ok(byId(tree,'cultural-inquiry-screen'));
 assert.equal(byId(tree,'app-nav-learn').props.accessibilityState.selected,true);
 assert.ok(byId(tree,'inquiry-question-list'),'The first screen starts with questions');
 assert.equal(byId(tree,'inquiry-compare'),undefined);
 await pressId(tree,'inquiry-tab-compare');
 assert.ok(byId(tree,'inquiry-account-whadjuk'));assert.ok(byId(tree,'inquiry-account-badimia'));
 assert.equal(byId(tree,'inquiry-fact-trilogy'),undefined,'Full accounts begin collapsed');
 assert.ok(textOf(byId(tree,'inquiry-preview-whadjuk')).includes('Noongar-authored'));
 assert.match(textOf(byId(tree,'inquiry-account-whadjuk')),/does not establish Yagan/);
 await pressId(tree,'inquiry-choose-pair-0');
 await pressId(tree,'inquiry-pair-0-badimia');
 assert.equal(byId(tree,'inquiry-pair-options-0'),undefined,'Choosing an account closes its options');
 assert.match(textOf(byId(tree,'inquiry-choose-pair-0')),/Badimia/);
 assert.match(textOf(byId(tree,'inquiry-choose-pair-1')),/Whadjuk Noongar/);
 await pressId(tree,'inquiry-choose-pair-1');await pressId(tree,'inquiry-pair-1-wajarri');
 await pressId(tree,'inquiry-choose-topic');await pressId(tree,'inquiry-topic-disagreement');
 assert.equal(byId(tree,'inquiry-topic-options'),undefined);
 assert.match(textOf(byId(tree,'inquiry-account-badimia')),/not evidence that no such practices exist/);
 assert.match(textOf(byId(tree,'inquiry-account-wajarri')),/excludes individual disputes outside corporate roles/);
 assert.ok(!byId(tree,'inquiry-fact-moieties'));
 assert.equal(openedLinks.length,linksBefore);
 assert.equal(disk.get(MEMORY_KEY),personalBefore);
 await act(async()=>tree.unmount());assert.equal(backHandlers.size,0);
});

test('curiosity paths keep unknowns, link to the relevant comparison and unwind using Android Back',async()=>{
 const tree=await mount();await press(tree,'More');await press(tree,'Compare & stay curious');
 await pressId(tree,'inquiry-question-triangle');
 assert.match(textOf(byId(tree,'inquiry-question-detail-triangle')),/has not been verified/);
 await pressId(tree,'inquiry-explore-question');
 assert.ok(byId(tree,'inquiry-compare'));assert.ok(byId(tree,'inquiry-account-whadjuk'));assert.ok(byId(tree,'inquiry-account-badimia'));
 await pressId(tree,'inquiry-choose-topic');
 await act(async()=>assert.equal([...backHandlers][0](),true));
 assert.equal(byId(tree,'inquiry-topic-options'),undefined,'Back closes an open selector first');
 assert.ok(byId(tree,'inquiry-compare'));
 await act(async()=>assert.equal([...backHandlers][0](),true));
 assert.ok(byId(tree,'inquiry-question-detail-triangle'),'Switching modes preserves the selected question');
 await act(async()=>assert.equal([...backHandlers][0](),true));
 assert.ok(byId(tree,'inquiry-question-list'));assert.ok(!byId(tree,'inquiry-question-detail-triangle'));
 await act(async()=>assert.equal([...backHandlers][0](),true));assert.ok(textOf(tree.root).includes('Learning Centre'));
 assert.equal(backHandlers.size,0);await act(async()=>tree.unmount());
});

test('comparison source links require a tap, recover after failure and connect to existing learning',async()=>{
 const linksBefore=openedLinks.length,personalBefore=disk.get(MEMORY_KEY);
 const tree=await mount();await press(tree,'More');await press(tree,'Living connections');
 await pressId(tree,'connections-explore-inquiry');assert.ok(byId(tree,'cultural-inquiry-screen'));
 await pressId(tree,'inquiry-tab-compare');
 assert.equal(openedLinks.length,linksBefore);
 const sourceId='inquiry-source-whadjuk-noongar';
 const source=require('../src/culturalInquiry.cjs').SOURCES.noongar.url;
 failLink=true;await pressId(tree,sourceId);
 assert.ok(textOf(byId(tree,sourceId+'-error')).includes(source));assert.equal(openedLinks.length,linksBefore);
 failLink=false;await pressId(tree,sourceId);assert.equal(openedLinks.at(-1),source);assert.equal(byId(tree,sourceId+'-error'),undefined);
 await pressId(tree,'inquiry-about-toggle');assert.ok(textOf(byId(tree,'inquiry-about')).includes('not establish shared ancestry'));
 await pressId(tree,'inquiry-connections');assert.ok(byId(tree,'cultural-connections-screen'));
 await pressId(tree,'connections-back');assert.ok(textOf(tree.root).includes('Learning Centre'));
 assert.equal(disk.get(MEMORY_KEY),personalBefore);
 await act(async()=>tree.unmount());assert.equal(backHandlers.size,0);
});

test('short cultural summaries expand to every original statement and keep source context available',async()=>{
 const tree=await mount();await press(tree,'More');await press(tree,'Compare & stay curious');
 await pressId(tree,'inquiry-tab-compare');
 assert.equal(byId(tree,'inquiry-expand-whadjuk').props.accessibilityState.expanded,false);
 await pressId(tree,'inquiry-expand-whadjuk');
 assert.match(textOf(byId(tree,'inquiry-fact-trilogy')),/not a system credited to Yagan personally/);
 assert.ok(byId(tree,'inquiry-fact-access'),'The full account includes the additional statement');
 assert.equal(byId(tree,'inquiry-preview-whadjuk'),undefined);
 const source='inquiry-source-whadjuk-noongar';
 assert.equal(byId(tree,source+'-details'),undefined);
 await pressId(tree,source+'-details-toggle');
 assert.match(textOf(byId(tree,source+'-details')),/Printed pp. 14–15 and 42–43/);
 assert.match(textOf(byId(tree,source+'-details')),/Whadjuk-focused research/);
 await pressId(tree,'inquiry-expand-whadjuk');
 assert.ok(byId(tree,'inquiry-preview-whadjuk'));
 assert.match(textOf(byId(tree,'inquiry-account-whadjuk')),/does not establish Yagan/);
 await pressId(tree,'inquiry-expand-whadjuk');
 await pressId(tree,'inquiry-choose-topic');await pressId(tree,'inquiry-topic-kinship');
 assert.equal(byId(tree,'inquiry-expand-whadjuk').props.accessibilityState.expanded,false,'Changing topic starts with the matching short summary');
 assert.match(textOf(byId(tree,'inquiry-preview-whadjuk')),/Manitj and Wardung/);
 await act(async()=>tree.unmount());assert.equal(backHandlers.size,0);
});

test('Knowledge Trail walks through sourced history, distinguishes interpretation and handles link retry', async () => {
  const personalBefore=disk.get(MEMORY_KEY), linksBefore=openedLinks.length;
  const tree=await mount();await press(tree,'Learn');
  const search=tree.root.findAllByType('TextInput').find(x=>x.props.accessibilityLabel==='Search learning topics');
  await act(async()=>search.props.onChangeText('Tim'));
  assert.ok(textOf(tree.root).includes('Knowledge Trail'));assert.ok(!textOf(tree.root).includes('No matching topics'));
  await press(tree,'Knowledge Trail');assert.ok(byId(tree,'trail-start'));
  assert.equal(byId(tree,'app-nav-learn').props.accessibilityState.selected,true);
  await pressId(tree,'trail-start-tim');assert.ok(byId(tree,'trail-tim-question'));
  assert.equal(openedLinks.length,linksBefore,'Browsing cannot open external sources automatically');
  await pressId(tree,'trail-next');assert.ok(byId(tree,'trail-tim-sources'));
  failLink=true;await pressId(tree,'trail-source-proposal');
  assert.match(textOf(byId(tree,'trail-source-error-proposal')),/https:\/\/www.w3.org/);
  failLink=false;await pressId(tree,'trail-source-proposal');
  assert.equal(openedLinks.at(-1),Trail.SOURCES.proposal.url);assert.equal(byId(tree,'trail-source-error-proposal'),undefined);
  await pressId(tree,'trail-next');assert.match(textOf(byId(tree,'trail-tim-evidence')),/do not establish a complete algorithm/);
  await pressId(tree,'trail-next');assert.match(textOf(byId(tree,'trail-tim-connections')),/our reading/);
  await pressId(tree,'trail-next');assert.ok(byId(tree,'trail-tim-choice'));
  await pressId(tree,'trail-try-own');assert.ok(byId(tree,'trail-input-question'));
  assert.equal(disk.get(MEMORY_KEY),personalBefore);
  await act(async()=>tree.unmount());assert.equal(backHandlers.size,0);
});

test('own Knowledge Trail preserves session writing, previews fresh notes and handles sharing and clear cancellation', async () => {
  const personalBefore=disk.get(MEMORY_KEY), sharesBefore=shares.length;
  const tree=await mount();await press(tree,'More');await press(tree,'Knowledge Trail');await pressId(tree,'trail-start-own');
  const change=async(key,value)=>act(async()=>byId(tree,'trail-input-'+key).props.onChangeText(value));
  await change('question','Where did this information come from?');
  await pressId(tree,'trail-next');await change('sources','Original document, author and date.');
  await change('sourceUrl','javascript:alert(1)');assert.ok(byId(tree,'trail-url-invalid'));assert.equal(byId(tree,'trail-open-own-source'),undefined);
  await change('sourceUrl',Trail.SOURCES.questions.url);assert.equal(byId(tree,'trail-url-invalid'),undefined);
  failLink=true;await pressId(tree,'trail-open-own-source');assert.ok(byId(tree,'trail-own-source-error'));
  failLink=false;await pressId(tree,'trail-open-own-source');assert.equal(openedLinks.at(-1),Trail.SOURCES.questions.url);
  await pressId(tree,'trail-next');await change('evidence','The document describes a proposal.');await change('unknowns','I have not checked the later outcome.');
  await pressId(tree,'trail-next');await change('connections','This is my possible connection.');
  await pressId(tree,'trail-next');await change('choice','Read another source.');await pressId(tree,'trail-preview');
  assert.match(textOf(byId(tree,'trail-summary')),/I have not checked the later outcome/);assert.equal(shares.length,sharesBefore);
  failShare=true;await pressId(tree,'trail-share');assert.match(textOf(byId(tree,'trail-status')),/Your writing is still here/);
  failShare=false;await pressId(tree,'trail-share');assert.match(shares.at(-1).message,/This is my possible connection/);assert.match(shares.at(-1).message,/unverified/);
  await pressId(tree,'trail-edit');await change('choice','Pause and ask a new question.');await pressId(tree,'trail-preview');await pressId(tree,'trail-share');
  assert.match(shares.at(-1).message,/Pause and ask a new question/);assert.ok(!shares.at(-1).message.includes('Read another source.'));
  await pressId(tree,'app-nav-home');await press(tree,'Learn');await press(tree,'Knowledge Trail');await pressId(tree,'trail-start-own');
  assert.equal(byId(tree,'trail-input-question').props.value,'Where did this information come from?');
  await pressId(tree,'trail-step-choice');await pressId(tree,'trail-preview');await pressId(tree,'trail-clear');
  const confirmation=alerts.at(-1);assert.equal(confirmation[0],'Clear my knowledge trail?');
  assert.ok(textOf(byId(tree,'trail-summary')).includes('Where did this information come from?'),'Opening confirmation cannot clear notes');
  await act(async()=>confirmation[2].find(item=>item.text==='Clear trail').onPress());
  assert.equal(byId(tree,'trail-input-question').props.value,'');assert.equal(disk.get(MEMORY_KEY),personalBefore);
  await act(async()=>tree.unmount());
  const fresh=await mount();await press(fresh,'Learn');await press(fresh,'Knowledge Trail');await pressId(fresh,'trail-start-own');assert.equal(byId(fresh,'trail-input-question').props.value,'');await act(async()=>fresh.unmount());
});

test('Knowledge Trail Android Back walks steps and exits, and the presentation opens the prototype', async () => {
  const tree=await mount();await press(tree,'More');await press(tree,'Our Purpose & Vision');
  await pressId(tree,'presentation-knowledge-trail');assert.ok(byId(tree,'knowledge-trail-screen'));
  await pressId(tree,'trail-start-own');await pressId(tree,'trail-step-choice');await pressId(tree,'trail-preview');
  await act(async()=>assert.equal([...backHandlers][0](),true));assert.equal(byId(tree,'trail-summary'),undefined);assert.ok(byId(tree,'trail-input-choice'));
  await act(async()=>assert.equal([...backHandlers][0](),true));assert.ok(byId(tree,'trail-input-connections'));
  await pressId(tree,'trail-step-question');await act(async()=>[...backHandlers][0]());assert.ok(byId(tree,'trail-start'));
  await act(async()=>[...backHandlers][0]());assert.ok(textOf(tree.root).includes('Learning Centre'));assert.equal(backHandlers.size,0);
  await act(async()=>tree.unmount());
});

test('Learning together is reachable through public search and Knowledge Trail, with optional choices and pause', async () => {
  const tree=await mount();await press(tree,'Learn');
  const search=tree.root.findAllByType('TextInput').find(x=>x.props.accessibilityLabel==='Search learning topics');
  await act(async()=>search.props.onChangeText('encouragement'));
  assert.ok(!textOf(tree.root).includes('No matching topics'));
  await press(tree,'Learning together');assert.ok(byId(tree,'together-intro'));
  assert.equal(byId(tree,'app-nav-learn').props.accessibilityState.selected,true);
  await pressId(tree,'together-open-trail');await pressId(tree,'trail-learn-together');
  await pressId(tree,'together-start');await pressId(tree,'together-option-0');
  assert.equal(byId(tree,'together-option-0').props.accessibilityState.selected,true);
  await pressId(tree,'together-pause');assert.ok(byId(tree,'together-paused'));
  await pressId(tree,'app-nav-home');await press(tree,'More');await press(tree,'Learning together');
  assert.ok(byId(tree,'together-paused'),'Leaving the screen must preserve the paused practice');
  await pressId(tree,'together-resume');assert.equal(byId(tree,'together-option-0').props.accessibilityState.selected,true);
  await pressId(tree,'together-leave-open');assert.match(textOf(byId(tree,'together-selected')),/Left open/);
  await pressId(tree,'together-next');assert.ok(byId(tree,'together-step-pace'));
  await act(async()=>assert.equal([...backHandlers][0](),true));assert.ok(byId(tree,'together-step-encouragement'));
  await act(async()=>[...backHandlers][0]());assert.ok(byId(tree,'together-intro'));
  await act(async()=>[...backHandlers][0]());assert.ok(textOf(tree.root).includes('Learning Centre'));
  await act(async()=>tree.unmount());assert.equal(backHandlers.size,0);
});

test('Learning together previews current writing, preserves other journeys and recovers from share failure', async () => {
  const tree=await mount();const before=disk.get(MEMORY_KEY), sharesBefore=shares.length;
  await press(tree,'More');await press(tree,'Our Purpose & Vision');await pressId(tree,'presentation-learning-together');
  await act(async()=>byId(tree,'together-input-topic').props.onChangeText('Learning to listen together'));
  await pressId(tree,'together-start');await pressId(tree,'together-option-0');
  for(let part=0;part<6;part++) await pressId(tree,'together-next');
  assert.ok(byId(tree,'together-summary'));assert.match(textOf(tree.root),/Left open/);
  await act(async()=>byId(tree,'together-input-unknowns').props.onChangeText('We have not tried this with anyone.'));
  await act(async()=>byId(tree,'together-input-nextStep').props.onChangeText('Ask whether they would like to take part.'));
  await pressId(tree,'together-preview');
  const preview=textOf(byId(tree,'together-preview-text'));
  assert.ok(preview.includes('We have not tried this with anyone.'));assert.ok(preview.includes('not measured outcomes'));
  assert.equal(shares.length,sharesBefore,'A preview must not open sharing automatically');
  failShare=true;await pressId(tree,'together-share');assert.match(textOf(byId(tree,'together-status')),/Your plan is still here/);
  failShare=false;await pressId(tree,'together-share');assert.equal(shares.at(-1).message,preview);
  await pressId(tree,'together-edit-plan');
  await act(async()=>byId(tree,'together-input-nextStep').props.onChangeText('Pause and think first.'));
  await pressId(tree,'together-preview');await pressId(tree,'together-share');assert.ok(shares.at(-1).message.includes('Pause and think first.'));
  await pressId(tree,'app-nav-home');await press(tree,'Learn');await press(tree,'Learning together');
  assert.match(textOf(byId(tree,'together-preview-text')),/Pause and think first/);
  await act(async()=>[...backHandlers][0]());assert.ok(byId(tree,'together-summary'));
  await pressId(tree,'together-clear');const confirmation=alerts.at(-1);
  assert.equal(confirmation[0],'Clear this learning practice?');assert.ok(byId(tree,'together-summary'));
  await act(async()=>confirmation[2].find(item=>item.text==='Clear practice').onPress());
  assert.ok(byId(tree,'together-intro'));assert.equal(byId(tree,'together-input-topic').props.value,'');
  assert.equal(disk.get(MEMORY_KEY),before,'Clearing the practice cannot change journey memory');
  await act(async()=>tree.unmount());assert.equal(backHandlers.size,0);
});
