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
let failLink = false;
let failShare = false;
let failRead = false;
let failWrite = false;
let pdfSaveGranted = true;
const pdfPrints = [];
const pdfShares = [];
const pdfWrites = [];
const pdfOpens = [];
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
  Pressable: 'Pressable', Image: 'Image', ImageBackground: 'ImageBackground',
  StyleSheet: {create: value => value, absoluteFillObject: {}}, StatusBar: {}, Platform: {OS: 'android'}, Linking: {openURL:async url=>{if(failLink)throw Error('Link unavailable');openedLinks.push(url);}},
  PanResponder:{create:handlers=>({panHandlers:{onResponderGrant:handlers.onPanResponderGrant,onResponderMove:handlers.onPanResponderMove,onResponderRelease:handlers.onPanResponderRelease}})},
  Animated: {Value: class {interpolate() {return '0deg';} setValue() {}}, View: 'AnimatedView',
    timing:()=>({}), loop:()=>({start(){},stop(){}})},
  Share: {share: async content => { if (failShare) throw Error('share failure'); shares.push(content); return {action: 'sharedAction'}; }},
  Alert: {alert: (...args) => alerts.push(args)}
};
const originalLoad = Module._load;
Module._load = function(name, parent, main) {
  if (name === 'react-native') return native;
  if (name === '@react-native-async-storage/async-storage') return storage;
  if (name === 'expo-status-bar') return {StatusBar: 'ExpoStatusBar'};
  if (name === 'expo-print') return {printToFileAsync:async options=>{pdfPrints.push(options);return {uri:'file:///cache/tmp.pdf',numberOfPages:2};}};
  if (name === 'expo-file-system/legacy') return pdfFileSystem;
  if (name === 'expo-sharing') return {isAvailableAsync:async()=>true,shareAsync:async(...args)=>pdfShares.push(args)};
  if (name === 'expo-intent-launcher') return {startActivityAsync:async(...args)=>pdfOpens.push(args)};
  if (name.includes('/assets/')) return 'test-image';
  return originalLoad.call(this, name, parent, main);
};
const originalJs = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
  if (['../App.js','../src/useJourneyMemory.js','../src/journeyPdfService.js','../src/DiamondEffectScreen.js','../src/ReflectionTriangle.js','../src/ObservedResponsesForm.js','../src/WaSupportCard.js'].some(relative=>filename===path.resolve(__dirname,relative))) {
    const output = babel.transformSync(fs.readFileSync(filename, 'utf8'), {filename, presets: ['babel-preset-expo']});
    module._compile(output.code, filename);
  } else originalJs(module, filename);
};
const App = require('../App').default;
const textOf = node => node.findAllByType('Text').map(item => item.children.filter(value => typeof value === 'string').join('')).join(' ');
async function press(tree, label) {
  const button = tree.root.findAllByType('Pressable').find(node => textOf(node).includes(label));
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
  await press(tree, 'START JOURNEY');
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
  await press(tree, 'START JOURNEY'); await press(tree, 'Stage 1');
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
  await press(tree, 'START JOURNEY');
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
  await press(tree,'Home'); await press(tree,'TECH LAB');
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
  const tabs=tree.root.findAllByType('Pressable').filter(node=>node.props.accessibilityRole==='tab');
  assert.equal(tabs.length,4);
  assert.equal(tabs.filter(node=>node.props.accessibilityState.selected).length,1);
  assert.equal(tabs.find(node=>textOf(node)===label).props.accessibilityState.selected,true);
}

test('all explanation tabs show their own content, retain Next Steps and reset for a new assessment', async context => {
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();
  await press(tree,'SAFETY CHECK');
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
  await press(tree,'SAFETY CHECK'); await press(tree,'Something I witnessed / was told');
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
  await press(tree,'SAFETY CHECK');await press(tree,'Something I witnessed / was told');
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
  assert.ok(textOf(tree.root).includes('Analyse both options first'));
  await press(tree,'Analyse both options');await press(tree,'Continue with option 1');
  await press(tree,'Build my next-step plan');
  assert.ok(textOf(tree.root).includes('MY NEXT STEP TO CONSIDER'));
  await press(tree,'Back to my assessment');
  assert.ok(textOf(tree.root).includes('Priority child-safety concern to review'));
  await act(async()=>tree.unmount());
});
test('triangle exploration and explanation comparison preserve uncertainty and active safeguarding',async context=>{
  context.mock.timers.enable({apis:['setTimeout']});
  const tree=await mount();await press(tree,'SAFETY CHECK');await press(tree,'Something I witnessed / was told');
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
  const tree=await mount();await press(tree,'SAFETY CHECK');await press(tree,'Something I witnessed / was told');
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
  const tree=await mount();await press(tree,'SAFETY CHECK');await press(tree,'Something I witnessed / was told');
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
  const tree=await mount();await press(tree,'SAFETY CHECK');await press(tree,'Something I witnessed / was told');await press(tree,'18+');
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
  const tree=await mount();await press(tree,'SAFETY CHECK');await press(tree,'18+');
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
