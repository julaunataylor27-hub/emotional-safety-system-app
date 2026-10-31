import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, BackHandler, Linking, Share, Alert} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
import {AppText as Text, AppInput as TextInput} from './AppPreferences';
import {P,presentationStyles} from './PresentationTheme';
const M = require('./exploreConnections.cjs');

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
  return <View testID={'explore-source-card-' + sourceId} style={s.source}>
    <Text style={s.label}>{source.author}</Text>
    <Text style={s.heading}>{source.title}</Text>
    <Text style={s.small}>{source.date} · Checked {M.META.checked}</Text>
    <Text style={s.small}>{source.locator}</Text>
    <Text style={s.body}>{source.summary}</Text>
    <Text style={s.small}>{source.limit}</Text>
    <Pressable testID={'explore-source-' + sourceId} accessibilityRole="link"
      accessibilityLabel={'Read original source: ' + source.title + ', opens an external website'} onPress={open} style={s.button}>
      <Text style={s.buttonText}>Read original source</Text>
    </Pressable>
    {failed && <View testID={'explore-source-error-' + sourceId} accessibilityLiveRegion="polite" style={s.section}>
      <Text style={s.small}>The website could not open. Copy this address or tap again to retry.</Text>
      <Text selectable style={s.url}>{source.url}</Text>
    </View>}
  </View>;
}
function LinkedArtwork() {
  const points = [[150,20],[55,66],[245,66],[35,130],[112,130],[188,130],[265,130]];
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Svg width="100%" height={145} viewBox="0 0 300 150">
      <Path d="M150 20 L55 66 L35 130 L112 130 L188 130 L265 130 L245 66 L150 20 L112 130 M55 66 L245 66 M245 66 L188 130 M265 130 L150 20" stroke={P.line} strokeWidth={1.5} fill="none"/>
      {points.map(([cx, cy], index) => <Circle key={index} cx={cx} cy={cy} r={index ? 7 : 11} stroke={P.gold} strokeWidth={1.5} fill={index ? P.panel2 : P.gold}/>)}
    </Svg>
  </View>;
}
export default function ExploreConnectionsScreen({exploration, onChange, onBack, onOpenTrail, onLearnTogether, onSupport, onScrollTop}) {
  const [status, setStatus] = useState('');
  const [allParts, setAllParts] = useState(false);
  const current = M.node(exploration.nodeId);
  function update(patch, scroll = true) {
    onChange(previous => ({...previous, ...patch})); setStatus('');
    if (scroll) onScrollTop?.();
  }
  function visit(id) { onChange(previous => M.visit(previous, id)); setStatus(''); onScrollTop?.(); }
  function back() {
    const previous = M.goBack(exploration);
    if (previous) {onChange(previous); setStatus(''); onScrollTop?.();} else onBack();
  }
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {back(); return true;});
    return () => handler.remove();
  }, [exploration, onBack, onScrollTop]);
  function clear() {
    Alert.alert('Clear this exploration?', 'This clears only this exploration and its session reflections.', [
      {text: 'Keep my reflection', style: 'cancel'},
      {text: 'Clear exploration', style: 'destructive', onPress: () => {onChange(M.createExploration()); setStatus(''); setAllParts(false); onScrollTop?.();}},
    ]);
  }
  async function share() {
    setStatus('');
    try {await Share.share({title: 'My Explore connections reflection', message: M.reflectionText(exploration)});}
    catch {setStatus('Share options could not open. Your reflection is still here. Select and copy the preview, or try again.');}
  }
  return <View testID="explore-connections-screen" style={s.root}>
    <Button id="explore-back" label={exploration.view === 'intro' && !exploration.paused ? 'Back to Learn' : 'Back'} onPress={back}/>
    <Text style={s.eyebrow}>{M.META.status} · {M.META.title}</Text>
    {exploration.paused ? <View testID="explore-paused" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Room to pause.</Text>
      <Text style={s.body}>You decide when to continue. Your place and optional notes remain here during this app session.</Text>
      <Button id="explore-resume" label="Continue when ready" primary onPress={() => update({paused: false})}/>
      <Button id="explore-pause-leave" label="Return to Learn" onPress={onBack}/>
    </View> : exploration.view === 'intro' ? <View testID="explore-intro" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>One question. Many connections.</Text>
      <Text style={s.lead}>Follow what happened, feelings, knowledge and choices. Keep room for what remains unknown.</Text>
      <View style={s.card}>
        <LinkedArtwork/>
        <Text accessibilityRole="header" style={s.heading}>What could respect for a pause look like?</Text>
        <Text style={s.body}>Jo asks for space. Alex keeps asking for an explanation. Explore this fictional adult example in any order.</Text>
        <Text style={s.small}>Tap a connection to see why it is relevant. You can return, pause or leave it open.</Text>
        <Button id="explore-start" label={exploration.visited.length ? 'Continue exploring' : 'Try the linked example'} primary onPress={() => visit(exploration.nodeId)}/>
      </View>
      <Button id="explore-intro-reflect" label="My optional reflection" onPress={() => update({view: 'reflection'})}/>
      <Button id="explore-about" label="How these connections work" onPress={() => update({view: 'about'})}/>
    </View> : exploration.view === 'about' ? <View testID="explore-about-details" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Follow ideas with care.</Text>
      <Text style={s.body}>{M.META.scope}</Text>
      <View style={s.card}><Text style={s.heading}>Your six principles</Text><Text style={s.body}>Encouragement welcomes questions. Pace and timing let you pause. Knowledge keeps sources visible. Conversation invites reflection. Peace leaves you free to stop.</Text><Text style={s.small}>Personal experience framework · Julauna Taylor. These principles are part of this app’s design.</Text></View>
      <Source sourceId="proposal"/>
      <View style={s.card}><Text style={s.heading}>Cultural knowledge keeps its context.</Text><Text style={s.body}>This example makes no cultural claims. Cultural learning in the app identifies its public sources and their particular communities; review and reuse permissions remain visible in those sections.</Text></View>
      <Text style={s.small}>{M.META.privacy}</Text>
    </View> : exploration.view === 'reflection' ? <View testID="explore-reflection" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>My reflection.</Text>
      <Text style={s.lead}>A separate space for your own question. Every field is optional.</Text>
      <Text style={s.small}>{M.META.privacy}</Text>
      {M.FIELDS.map(field => <View key={field.id} style={s.field}>
        <Text style={s.label}>{field.label}</Text>
        <TextInput testID={'explore-input-' + field.id} accessibilityLabel={field.label} value={exploration.notes[field.id]}
          onChangeText={value => {onChange(previous => M.updateNote(previous, field.id, value)); setStatus('');}}
          placeholder={field.placeholder} placeholderTextColor={P.muted} multiline maxLength={1500} textAlignVertical="top" style={s.input}/>
      </View>)}
      <Text style={s.small}>Your writing stays labelled as unverified personal notes. No truth, danger or confidence score is calculated.</Text>
      <Button id="explore-preview" label="Preview my reflection" primary onPress={() => update({view: 'preview'})}/>
      <Button id="explore-clear" label="Clear this exploration" onPress={clear}/>
    </View> : exploration.view === 'preview' ? <View testID="explore-preview" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>A copy you control.</Text>
      <Text style={s.small}>Review the exact text below before opening share options.</Text>
      <View style={s.card}><Text selectable testID="explore-preview-text" style={s.body}>{M.reflectionText(exploration)}</Text></View>
      <Button id="explore-share" label="Share a copy of my reflection" primary onPress={share}/>
      <Button id="explore-edit" label="Edit my reflection" onPress={() => update({view: 'reflection'})}/>
    </View> : <View testID="explore-map" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Explore connections.</Text>
      <Text style={s.small}>Fictional adult example · Follow a connection in either direction.</Text>
      <View testID={'explore-detail-' + current.id} style={s.card}>
        <Text style={s.tag}>{current.type}</Text>
        <Text accessibilityRole="header" style={s.heading}>{current.title}</Text>
        <Text selectable style={s.body}>{current.text}</Text>
        {current.points.map(point => <Text key={point} style={s.small}>{point}</Text>)}
      </View>
      {current.sources?.map(sourceId => <Source key={sourceId} sourceId={sourceId}/>)}
      <Text accessibilityRole="header" style={s.heading}>Where could I go next?</Text>
      {M.related(current.id).map(link => <Pressable key={link.id} testID={'explore-link-' + link.id} accessibilityRole="button"
        accessibilityLabel={'Explore ' + link.target.label + '. ' + link.why} onPress={() => visit(link.target.id)} style={({pressed}) => [s.link, pressed && s.pressed]}>
        <Text style={s.relation}>{M.node(link.from).label} → {M.node(link.to).label}</Text>
        <Text style={s.linkTitle}>{link.label}</Text>
        <Text style={s.small}>{link.why}</Text>
        <Text style={s.destination}>Explore: {link.target.label}</Text>
      </Pressable>)}
      <Button id="explore-all-toggle" label={allParts ? 'Hide all parts' : 'See all 7 parts'} onPress={() => setAllParts(value => !value)}/>
      {allParts && <View testID="explore-all-parts" style={s.parts}>{M.NODES.map(item => <View key={item.id} style={s.part}>
        <Button id={'explore-node-' + item.id} label={item.label} selected={item.id === current.id} onPress={() => visit(item.id)}/>
      </View>)}</View>}
      <Text style={s.small}>Visited parts: {exploration.visited.map(id => M.node(id).label).join(' · ')}</Text>
      <Button id="explore-reflect" label="My optional reflection" primary onPress={() => update({view: 'reflection'})}/>
      <Button id="explore-trail" label="Follow a Knowledge Trail" onPress={onOpenTrail}/>
      <Button id="explore-together" label="Try the six learning principles" onPress={onLearnTogether}/>
      {current.id === 'choices' && <Button id="explore-support" label="Find support options" onPress={onSupport}/>}
      <Button id="explore-map-about" label="How these connections work" onPress={() => update({view: 'about'})}/>
    </View>}
    {!exploration.paused && exploration.view !== 'intro' && <Button id="explore-pause" label="Pause here" onPress={() => update({paused: true})}/>}
    {!!status && <Text testID="explore-status" accessibilityLiveRegion="polite" style={s.notice}>{status}</Text>}
    <Text style={s.small}>{M.META.privacy}</Text>
  </View>;
}
const s = StyleSheet.create({
  root: {gap: 18, paddingBottom: 22}, section: {gap: 18}, eyebrow: {fontSize: 13, lineHeight: 21, color: P.gold},
  title: {fontFamily: 'ESSHeading', fontSize: 32, lineHeight: 42, color: P.text}, lead: {fontSize: 18, lineHeight: 28, color: P.muted},
  heading: {fontSize: 23, lineHeight: 32, color: P.text, fontWeight: '600'}, body: {fontSize: 17, lineHeight: 28, color: P.text},
  small: {fontSize: 14, lineHeight: 23, color: P.muted}, label: {fontSize: 16, lineHeight: 25, color: P.gold, fontWeight: '600'},
  card: {backgroundColor: P.panel, borderWidth: 1, borderColor: P.line, borderRadius: 20, padding: 20, gap: 17},
  button: {minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: P.line, paddingHorizontal: 16, paddingVertical: 13, justifyContent: 'center'},
  primary: {backgroundColor: P.gold, borderColor: P.gold}, buttonText: {fontSize: 16, lineHeight: 25, color: P.text, textAlign: 'center', fontWeight: '600'}, dark: {color: P.bg}, pressed: {opacity: .78},
  source: {backgroundColor: P.panel2, borderRadius: 18, padding: 18, gap: 12}, url: {fontSize: 14, lineHeight: 23, color: P.gold, flexShrink: 1}, tag: {fontSize: 14, lineHeight: 23, color: P.green},
  link: {borderWidth: 1, borderColor: P.line, borderRadius: 18, padding: 18, gap: 9, backgroundColor: P.panel},
  relation: {fontSize: 13, lineHeight: 21, color: P.gold}, linkTitle: {fontSize: 19, lineHeight: 27, color: P.text, fontWeight: '600'}, destination: {fontSize: 15, lineHeight: 24, color: P.green},
  parts: {flexDirection: 'row', flexWrap: 'wrap', gap: 10}, part: {flexBasis: '45%', flexGrow: 1},
  field: {gap: 10}, input: {backgroundColor: P.bg, borderWidth: 1, borderColor: P.line, borderRadius: 14, minHeight: 120, padding: 14, color: P.text, fontSize: 17, lineHeight: 28},
  notice: {fontSize: 15, lineHeight: 24, color: P.gold},
});


// UNIFIED_THEME_V4
Object.assign(s,presentationStyles(s));
