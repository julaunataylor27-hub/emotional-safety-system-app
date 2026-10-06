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
  StyleSheet: {create: value => value, absoluteFillObject: {}}, StatusBar: {}, Platform: {OS: 'android'}, Linking: {},
  Animated: {Value: class {interpolate() {return '0deg';} setValue() {}}, View: 'AnimatedView'},
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
  if (['../App.js','../src/useJourneyMemory.js','../src/journeyPdfService.js'].some(relative=>filename===path.resolve(__dirname,relative))) {
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
