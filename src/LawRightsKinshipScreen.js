import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, BackHandler, Linking} from 'react-native';
import {AppText as Text, AppInput as TextInput} from './AppPreferences';
import {P,presentationStyles} from './PresentationTheme';
const M = require('./lawRightsKinship.cjs');

function Button({id, label, onPress, selected, expanded, primary}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{...(selected === undefined ? {} : {selected}), ...(expanded === undefined ? {} : {expanded})}}
    onPress={onPress} style={({pressed}) => [s.button, (primary || selected) && s.primary, pressed && s.pressed]}>
    <Text style={[s.buttonText, (primary || selected) && s.dark]}>{label}</Text>
  </Pressable>;
}
function Source({id}) {
  const source = M.SOURCES[id];
  const [failed, setFailed] = useState(false);
  async function open() {
    setFailed(false);
    const url = M.sourceUrl(id);
    if (!url) {setFailed(true); return;}
    try {await Linking.openURL(url);} catch {setFailed(true);}
  }
  return <View testID={'law-source-card-' + id} style={s.source}>
    <Text style={s.label}>{source.author}</Text>
    <Text style={s.heading}>{source.title}</Text>
    <Text style={s.small}>{source.kind} · {source.date}</Text>
    <Text style={s.small}>Checked {source.checked} · {source.locator}</Text>
    <Text style={s.small}>{source.scope}</Text>
    <Pressable testID={'law-source-' + id} accessibilityRole="link"
      accessibilityLabel={'Read original source: ' + source.title + ', opens an external website'}
      onPress={open} style={s.button}><Text style={s.buttonText}>Read original source</Text></Pressable>
    {failed && <View testID={'law-source-error-' + id} accessibilityLiveRegion="polite" style={s.section}>
      <Text style={s.notice}>The website could not open. Select and copy its address, or tap the source again to retry.</Text>
      <Text selectable style={s.url}>{source.url}</Text>
    </View>}
  </View>;
}
export default function LawRightsKinshipScreen({onBack, onSupport, onLivingConnections, onKnowledgeTrail, onScrollTop}) {
  const [section, setSection] = useState('all');
  const [scope, setScope] = useState('all');
  const [query, setQuery] = useState('');
  const [topicId, setTopicId] = useState(null);
  const [about, setAbout] = useState(false);
  const topic = M.topicById(topicId);
  const topics = M.filterTopics({section, scope, query});
  function back() {
    if (topic) {setTopicId(null); onScrollTop?.();} else onBack();
  }
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {back(); return true;});
    return () => handler.remove();
  }, [topicId, onBack, onScrollTop]);
  function visit(id) {setTopicId(id); onScrollTop?.();}
  return <View testID="law-rights-kinship-screen" style={s.root}>
    <Button id="law-back" label={topic ? 'Back to topics' : 'Back to Learn'} onPress={back}/>
    <Text style={s.eyebrow}>{M.META.status} · checked {M.META.checked}</Text>
    <Text accessibilityRole="header" style={s.title}>{topic ? topic.title : M.META.title}</Text>
    {!topic ? <>
      <Text style={s.lead}>{M.META.lead}</Text>
      <View style={s.context}><Text style={s.body}>{M.META.framing}</Text></View>
      <Text style={s.small}>{M.META.scope}</Text>
      <Text style={s.notice}>{M.META.review}</Text>
      <Button id="law-about" label="Sources, dates & cultural care" expanded={about} onPress={() => setAbout(value => !value)}/>
      {about && <View testID="law-about-details" style={s.card}>
        <Text style={s.body}>{M.META.time}</Text>
        <Text style={s.body}>Current legal information, cultural accounts and proposals have different labels. Ethical guidance and historical descriptions are not new legislation. A public source does not establish community permission or endorse this app.</Text>
        <Text style={s.small}>{M.META.privacy}</Text>
      </View>}
      <TextInput testID="law-search" accessibilityLabel="Search law, rights and kinship topics" value={query} onChangeText={setQuery}
        placeholder="Search consent, kinship, marriage…" placeholderTextColor={P.muted} style={s.input} maxLength={150}/>
      <Text accessibilityRole="header" style={s.label}>What would you like to understand?</Text>
      <View style={s.wrap}>{M.SECTIONS.map(item => <Button key={item.id} id={'law-section-' + item.id} label={item.label}
        selected={section === item.id} onPress={() => setSection(item.id)}/>)}</View>
      <Text style={s.label}>Which area of information?</Text>
      <View style={s.wrap}>{M.SCOPES.map(item => <Button key={item.id} id={'law-scope-' + item.id} label={item.label}
        selected={scope === item.id} onPress={() => setScope(item.id)}/>)}</View>
      <Text style={s.small}>These filters organise public reading; they do not select the law for your situation. WA-specific cards do not explain the law in other states or territories.</Text>
      <Text accessibilityLiveRegion="polite" style={s.label}>{topics.length} {topics.length === 1 ? 'topic' : 'topics'}</Text>
      {!topics.length && <View testID="law-no-results" style={s.card}>
        <Text style={s.body}>No topics match these filters. Try another word or clear the filters.</Text>
        <Button id="law-reset" label="Show all topics" onPress={() => {setQuery(''); setSection('all'); setScope('all');}}/>
      </View>}
      {topics.map(item => <Pressable key={item.id} testID={'law-topic-' + item.id} accessibilityRole="button"
        accessibilityLabel={'Read ' + item.title + '. ' + item.jurisdiction} onPress={() => visit(item.id)} style={({pressed}) => [s.card, pressed && s.pressed]}>
        <Text style={s.tag}>{item.status}</Text><Text accessibilityRole="header" style={s.heading}>{item.title}</Text>
        <Text style={s.label}>{item.jurisdiction}</Text><Text style={s.body}>{item.summary}</Text>
        <Text style={s.linkText}>Read rights, limits & sources →</Text>
      </Pressable>)}
    </> : <View key={topic.id} testID={'law-detail-' + topic.id} style={s.section}>
      <Text style={s.tag}>{topic.status}</Text>
      <Text style={s.label}>{topic.jurisdiction}</Text>
      <Text style={s.lead}>{topic.summary}</Text>
      <View style={s.card}>
        <Text accessibilityRole="header" style={s.heading}>Choices and pathways</Text>
        {topic.can.map(item => <Text key={item} selectable style={s.body}>{item}</Text>)}
      </View>
      <View style={s.context}>
        <Text accessibilityRole="header" style={s.heading}>Limits to understand</Text>
        {topic.limits.map(item => <Text key={item} selectable style={s.body}>{item}</Text>)}
      </View>
      <View style={s.card}><Text style={s.label}>A question to take further</Text><Text selectable style={s.body}>{topic.question}</Text></View>
      <Text accessibilityRole="header" style={s.heading}>Read the sources in context</Text>
      {topic.sources.map(id => <Source key={topic.id + '-' + id} id={id}/>)}
      <Text style={s.small}>{M.META.time}</Text>
      <Text style={s.notice}>{M.META.review}</Text>
      {topic.section === 'kinship' && <Button id="law-cultural-learning" label="Explore Living connections" onPress={onLivingConnections}/>}
      {topic.section === 'parliament' && <Button id="law-knowledge-trail" label="Organise a question in Knowledge Trail" onPress={onKnowledgeTrail}/>}
      <Button id="law-detail-back" label="Back to topics" onPress={back}/>
    </View>}
    <View style={s.footer}>
      <Text style={s.small}>For a personal situation, ask a qualified local legal service. Aboriginal legal and family services are listed in Support. In immediate danger in Australia, call 000.</Text>
      <Button id="law-support" label="Find legal and other support" primary onPress={onSupport}/>
      <Text style={s.small}>{M.META.privacy}</Text>
    </View>
  </View>;
}
const s = StyleSheet.create({
  root: {gap: 18, paddingBottom: 24}, section: {gap: 18}, eyebrow: {fontSize: 13, lineHeight: 22, color: P.gold},
  title: {fontFamily: 'ESSHeading', fontSize: 31, lineHeight: 41, color: P.text}, lead: {fontSize: 18, lineHeight: 29, color: P.text},
  heading: {fontSize: 22, lineHeight: 31, color: P.text, fontWeight: '600'}, body: {fontSize: 17, lineHeight: 28, color: P.text},
  small: {fontSize: 14, lineHeight: 24, color: P.muted}, label: {fontSize: 15, lineHeight: 25, color: P.gold, fontWeight: '600'},
  card: {backgroundColor: P.panel, borderColor: P.line, borderWidth: 1, borderRadius: 18, padding: 19, gap: 13},
  context: {backgroundColor: P.panel2, borderLeftColor: P.gold, borderLeftWidth: 3, borderRadius: 12, padding: 19, gap: 15},
  button: {minHeight: 50, borderWidth: 1, borderColor: P.line, borderRadius: 14, paddingHorizontal: 15, paddingVertical: 12, justifyContent: 'center'},
  primary: {backgroundColor: P.gold, borderColor: P.gold}, dark: {color: P.bg}, buttonText: {fontSize: 16, lineHeight: 25, color: P.text, textAlign: 'center', fontWeight: '600'},
  wrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 9}, pressed: {opacity: .78},
  input: {minHeight: 54, backgroundColor: P.panel2, color: P.text, borderColor: P.line, borderWidth: 1, borderRadius: 14, padding: 15, fontSize: 17},
  tag: {fontSize: 13, lineHeight: 23, color: P.green}, linkText: {fontSize: 15, lineHeight: 25, color: P.gold},
  source: {backgroundColor: P.panel2, borderRadius: 18, padding: 18, gap: 12}, notice: {fontSize: 14, lineHeight: 24, color: P.gold},
  url: {fontSize: 14, lineHeight: 23, color: P.gold, flexShrink: 1}, footer: {gap: 15, borderTopWidth: 1, borderTopColor: P.line, paddingTop: 20},
});


// UNIFIED_THEME_V4
Object.assign(s,presentationStyles(s));
