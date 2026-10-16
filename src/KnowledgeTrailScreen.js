import React, {useEffect, useState} from 'react';
import {View, Image, Pressable, StyleSheet, Linking, BackHandler, Share, Alert} from 'react-native';
import {AppText as Text, AppInput as TextInput} from './AppPreferences';
import {P} from './PresentationTheme';
const M = require('./knowledgeTrail.cjs');

function Button({id, label, onPress, primary, selected, children}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={selected === undefined ? {} : {selected}}
    onPress={onPress} style={({pressed}) => [s.button, (primary || selected) && s.primary, pressed && s.pressed]}>
    <Text style={[s.buttonText, (primary || selected) && s.dark]}>{children || label}</Text>
  </Pressable>;
}

function Source({sourceId}) {
  const source = M.SOURCES[sourceId];
  const [failed, setFailed] = useState(false);
  async function open() {
    setFailed(false);
    try { await Linking.openURL(source.url); } catch { setFailed(true); }
  }
  return <View style={s.source}>
    <Text style={s.sourceTitle}>{source.label}</Text>
    <Text style={s.small}>{source.kind} · {source.date}</Text>
    <Text style={s.small}>{source.locator}</Text>
    <Text style={s.small}>{source.scope}</Text>
    <Pressable testID={'trail-source-' + sourceId} accessibilityRole="link"
      accessibilityLabel={'Read source: ' + source.label + ', opens an external website'} onPress={open} style={s.button}>
      <Text style={s.buttonText}>{sourceId === 'photo' ? 'Photo & licence' : 'Read original source'}</Text>
    </Pressable>
    {failed && <View testID={'trail-source-error-' + sourceId} accessibilityLiveRegion="polite">
      <Text style={s.small}>The website could not open. Copy the address below, or tap again to retry.</Text>
      <Text selectable style={s.url}>{source.url}</Text>
    </View>}
  </View>;
}

export default function KnowledgeTrailScreen({trail, onChange, onBack, onScrollTop}) {
  const [mode, setMode] = useState(null);
  const [index, setIndex] = useState(0);
  const [summary, setSummary] = useState(false);
  const [about, setAbout] = useState(false);
  const [status, setStatus] = useState('');
  const [sourceFailed, setSourceFailed] = useState(false);
  const step = M.STEPS[index];
  const own = mode === 'own';
  function move(next) { setIndex(next); setSummary(false); setStatus(''); setSourceFailed(false); onScrollTop?.(); }
  function start(next) { setMode(next); move(0); }
  function home() { setMode(null); setSummary(false); setStatus(''); onScrollTop?.(); }
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (summary) { setSummary(false); onScrollTop?.(); }
      else if (mode && index > 0) move(index - 1);
      else if (mode) home();
      else onBack();
      return true;
    });
    return () => handler.remove();
  }, [mode, index, summary, onBack, onScrollTop]);
  function update(key, value) { onChange({...trail, [key]: value}); setStatus(''); setSourceFailed(false); }
  async function openOwnSource() {
    const url = M.externalUrl(trail.sourceUrl);
    if (!url) return;
    setSourceFailed(false);
    try { await Linking.openURL(url); } catch { setSourceFailed(true); }
  }
  async function share() {
    setStatus('');
    try { await Share.share({title: 'My Knowledge Trail', message: M.trailText(trail)}); }
    catch { setStatus('Sharing could not open. Your writing is still here; select and copy the preview or try again.'); }
  }
  function clear() {
    Alert.alert('Clear my knowledge trail?', 'This clears only these session notes.', [
      {text: 'Keep my writing', style: 'cancel'},
      {text: 'Clear trail', style: 'destructive', onPress: () => {onChange(M.createTrail()); move(0);}},
    ]);
  }
  function field(key, label, placeholder) {
    return <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput testID={'trail-input-' + key} accessibilityLabel={label} value={trail[key]}
        onChangeText={value => update(key, value)} placeholder={placeholder} placeholderTextColor={P.muted}
        multiline={key !== 'sourceUrl'} autoCapitalize={key === 'sourceUrl' ? 'none' : 'sentences'}
        autoCorrect={key !== 'sourceUrl'} keyboardType={key === 'sourceUrl' ? 'url' : 'default'}
        textAlignVertical="top" style={[s.input, key === 'sourceUrl' && s.urlInput]}/>
    </View>;
  }

  return <View testID="knowledge-trail-screen" style={s.root}>
    <Button id="trail-back" label={mode ? 'Back to trails' : 'Back to Learn'} onPress={mode ? home : onBack}/>
    <Text style={s.eyebrow}>{M.META.status} · {M.META.title}</Text>
    {!mode ? <View testID="trail-start" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Follow your curiosity.</Text>
      <Text style={s.lead}>From a question to sources, understanding and your own next step.</Text>
      <View style={s.actions}>
        <Button id="trail-start-tim" label="Explore Tim’s story" primary onPress={() => start('tim')}/>
        <Button id="trail-start-own" label="Start my own trail" onPress={() => start('own')}/>
      </View>
      <View style={s.storyCard}>
        <Image source={require('../assets/learning/tim-berners-lee-2014.jpg')} resizeMode="contain" style={s.portrait}
          accessibilityLabel="Tim Berners-Lee, photographed by Paul Clarke in 2014"/>
        <Text style={s.small}>Photograph: Paul Clarke, 2014 · CC BY-SA 4.0</Text>
        <Text accessibilityRole="header" style={s.heading}>How did Tim Berners-Lee turn a question into the Web?</Text>
        <Text style={s.body}>Explore his public accounts through our five-step learning trail.</Text>
      </View>
      <Button id="trail-about-toggle" label={about ? 'Hide prototype details' : 'About this prototype'} onPress={() => setAbout(value => !value)}/>
      {about && <View testID="trail-about" style={s.card}>
        <Text style={s.small}>{M.META.scope}</Text>
        <Text style={s.small}>Sources checked {M.META.checked}. Browsing does not assess your safety or verify your writing.</Text>
        <Source sourceId="photo"/>
      </View>}
    </View> : <View style={s.section}>
      <Text style={s.mode}>{own ? 'My own trail' : 'Tim Berners-Lee · public learning example'}</Text>
      <Text accessibilityRole="header" style={s.title}>{summary ? 'My trail so far' : step.label}</Text>
      <View accessibilityLabel="Knowledge trail steps" style={s.steps}>
        {M.STEPS.map((item, position) => <View key={item.id} style={s.stepWrap}>
          <Button id={'trail-step-' + item.id} label={'Step ' + (position + 1) + ': ' + item.label}
            selected={!summary && index === position} onPress={() => move(position)}>{String(position + 1).padStart(2, '0')}</Button>
        </View>)}
      </View>
      {summary ? <View testID="trail-summary" style={s.card}>
        <Text style={s.small}>Your notes and interpretations · unverified</Text>
        {M.STEPS.map(item => <View key={item.id} style={s.field}>
          <Text style={s.label}>{item.label}</Text>
          <Text selectable style={s.body}>{trail[item.id]?.trim() || 'Not recorded'}</Text>
        </View>)}
        <Text style={s.label}>Source website</Text><Text selectable style={s.url}>{trail.sourceUrl.trim() || 'Not recorded'}</Text>
        <Text style={s.label}>Uncertainty / missing information</Text><Text selectable style={s.body}>{trail.unknowns.trim() || 'Not recorded'}</Text>
        <Text style={s.small}>Reading a source does not establish that a claim is true. Your next step is optional and can change.</Text>
        <Button id="trail-share" label="Share a copy of my trail" primary onPress={share}/>
        <Button id="trail-edit" label="Return to my writing" onPress={() => setSummary(false)}/>
        <Button id="trail-clear" label="Clear my trail" onPress={clear}/>
      </View> : <>
        <Text accessibilityLiveRegion="polite" style={s.small}>Step {index + 1} of 5 · {own ? 'Explore at your own pace' : 'Our framework, using his accounts'}</Text>
        <View style={s.card}>
          <Text accessibilityRole="header" style={s.heading}>{own ? step.prompt : step.tim.title}</Text>
          {own ? <>
            <Text style={s.body}>{step.hint}</Text>
            {field(step.id, step.prompt, 'Write in your own words…')}
            {step.id === 'sources' && <>
              {field('sourceUrl', 'Source website (optional)', 'https://…')}
              {!!trail.sourceUrl && !M.externalUrl(trail.sourceUrl) && <Text testID="trail-url-invalid" style={s.small}>Use a full https:// address without a username or password.</Text>}
              {!!M.externalUrl(trail.sourceUrl) && <Button id="trail-open-own-source" label="Open my source website" onPress={openOwnSource}/>}
              {sourceFailed && <View testID="trail-own-source-error" accessibilityLiveRegion="polite"><Text style={s.small}>The website could not open. Copy the address or try again.</Text><Text selectable style={s.url}>{trail.sourceUrl}</Text></View>}
            </>}
            {step.id === 'evidence' && field('unknowns', 'What remains uncertain or missing?', 'What would you need to check?')}
            <Text style={s.small}>{step.id === 'connections' ? 'Your possible interpretation remains an interpretation.' : 'Your writing is unverified. No truth or confidence score is calculated.'}</Text>
          </> : <View testID={'trail-tim-' + step.id} style={s.section}>
            <Text style={s.tag}>{step.tim.label}</Text>
            <Text selectable style={s.body}>{step.tim.text}</Text>
            {!!step.tim.unknown && <View style={s.note}><Text style={s.label}>What we still don’t know</Text><Text style={s.body}>{step.tim.unknown}</Text></View>}
            {!!step.tim.interpretation && <View style={s.note}><Text style={s.body}>{step.tim.interpretation}</Text></View>}
            <Text style={s.label}>Keep wondering</Text><Text style={s.body}>{step.tim.prompt}</Text>
          </View>}
        </View>
        {!own && step.tim.sources.map(sourceId => <Source key={sourceId} sourceId={sourceId}/>)}
        <View style={s.actions}>
          {index > 0 && <Button id="trail-previous" label="Previous step" onPress={() => move(index - 1)}/>}
          {index < 4 ? <Button id="trail-next" label="Next step" primary onPress={() => move(index + 1)}/>
            : own ? <Button id="trail-preview" label="Preview my trail" primary onPress={() => {setSummary(true); onScrollTop?.();}}/>
              : <Button id="trail-try-own" label="Try my own question" primary onPress={() => start('own')}/>}
        </View>
        {!own && <Text style={s.small}>An app-created learning aid. Sources checked {M.META.checked}. The five steps are not a method named or endorsed by Berners-Lee.</Text>}
      </>}
      {!!status && <Text testID="trail-status" accessibilityLiveRegion="polite" style={s.notice}>{status}</Text>}
      {own && <Text style={s.small}>{M.META.privacy}</Text>}
    </View>}
  </View>;
}

const s = StyleSheet.create({
  root: {gap: 18, paddingBottom: 22}, section: {gap: 18}, eyebrow: {fontSize: 13, lineHeight: 21, color: P.gold},
  title: {fontFamily: 'ESSHeading', fontSize: 32, lineHeight: 42, color: P.text}, lead: {fontSize: 18, lineHeight: 28, color: P.muted},
  heading: {fontSize: 23, lineHeight: 32, color: P.text, fontWeight: '600'}, body: {fontSize: 17, lineHeight: 28, color: P.text},
  small: {fontSize: 14, lineHeight: 23, color: P.muted}, label: {fontSize: 16, lineHeight: 25, color: P.gold, fontWeight: '600'},
  card: {backgroundColor: P.panel, borderWidth: 1, borderColor: P.line, borderRadius: 20, padding: 20, gap: 17},
  storyCard: {backgroundColor: P.panel, borderWidth: 1, borderColor: P.line, borderRadius: 20, padding: 20, gap: 14},
  portrait: {width: '100%', height: 190, backgroundColor: P.bg},
  button: {minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: P.line, paddingHorizontal: 16, paddingVertical: 13, justifyContent: 'center'},
  primary: {backgroundColor: P.gold, borderColor: P.gold}, buttonText: {fontSize: 16, lineHeight: 25, color: P.text, textAlign: 'center', fontWeight: '600'}, dark: {color: P.bg}, pressed: {opacity: .78},
  source: {backgroundColor: P.panel2, borderRadius: 16, padding: 18, gap: 10}, sourceTitle: {fontSize: 17, lineHeight: 26, color: P.text, fontWeight: '600'},
  url: {fontSize: 14, lineHeight: 23, color: P.gold, flexShrink: 1}, tag: {fontSize: 14, lineHeight: 23, color: P.green},
  steps: {flexDirection: 'row', flexWrap: 'wrap', gap: 8}, stepWrap: {minWidth: 42},
  field: {gap: 10}, input: {backgroundColor: P.bg, borderWidth: 1, borderColor: P.line, borderRadius: 14, minHeight: 132, padding: 14, color: P.text, fontSize: 17, lineHeight: 28},
  urlInput: {minHeight: 54}, note: {borderLeftWidth: 2, borderLeftColor: P.gold, paddingLeft: 15, gap: 9},
  actions: {gap: 10}, mode: {fontSize: 15, lineHeight: 24, color: P.green}, notice: {fontSize: 15, lineHeight: 24, color: P.gold},
});
