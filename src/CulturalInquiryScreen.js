import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, Linking, BackHandler, useWindowDimensions} from 'react-native';
import {AppText as Text, useAppPreferences} from './AppPreferences';
import GoldenTreeIcon from './GoldenTreeIcons';
import {P} from './PresentationTheme';
const M = require('./culturalInquiry.cjs');

function Button({id, label, onPress, selected, tab = false, children, style}) {
  return <Pressable testID={id} accessibilityRole={tab ? 'tab' : 'button'} accessibilityLabel={label}
    accessibilityState={selected === undefined ? {} : {selected}}
    onPress={onPress} style={({pressed}) => [s.button, selected && s.selected, style, pressed && s.pressed]}>
    <Text style={[s.buttonText, selected && s.selectedText]}>{children || label}</Text>
  </Pressable>;
}

function Source({id, sourceId}) {
  const source = M.SOURCES[sourceId];
  const [failed, setFailed] = useState(false);
  async function open() {
    setFailed(false);
    try { await Linking.openURL(source.url); } catch { setFailed(true); }
  }
  return <View style={s.source}>
    <Text style={s.meta}>{source.label}</Text>
    <Text style={s.small}>{source.date} · {source.locator}</Text>
    <Text style={s.small}>{source.scope}</Text>
    <Pressable testID={id} accessibilityRole="link" accessibilityLabel={'Read source: ' + source.label + ', opens an external website'}
      onPress={open} style={({pressed}) => [s.sourceButton, pressed && s.pressed]}>
      <Text style={s.link}>Read source{source.url.endsWith('.pdf') ? ' · PDF' : ''}</Text>
      <GoldenTreeIcon name="Arrow" size={18} color={P.gold}/>
    </Pressable>
    {failed && <View testID={id + '-error'} accessibilityLiveRegion="polite" style={s.linkError}>
      <Text style={s.small}>The website could not open. Select and copy the address, or tap Read source to retry.</Text>
      <Text selectable style={s.link}>{source.url}</Text>
    </View>}
  </View>;
}

function Account({groupId, topic, wide}) {
  const group = M.GROUPS.find(item => item.id === groupId);
  const account = topic.accounts[groupId];
  const sources = [...new Set(account.facts.map(id => M.FACTS[id].source))];
  return <View testID={'inquiry-account-' + groupId} style={[s.account, wide && s.accountWide]}>
    <Text accessibilityRole="header" style={s.accountTitle}>{group.label}</Text>
    <Text style={s.small}>{group.scope}</Text>
    {account.facts.length > 0 ? <View style={s.claims}>
      <Text style={s.eyebrow}>WHAT THE SOURCES DESCRIBE</Text>
      {account.facts.map(id => <View key={id} testID={'inquiry-fact-' + id} style={s.fact}>
        <Text style={s.tag}>{M.SOURCES[M.FACTS[id].source].kind}</Text>
        <Text selectable style={s.body}>{M.FACTS[id].text}</Text>
      </View>)}
    </View> : <Text style={s.tag}>Open research question</Text>}
    <View style={s.openQuestion}>
      <Text style={s.meta}>What remains open</Text>
      <Text selectable style={s.body}>{account.unknown}</Text>
    </View>
    {sources.map(sourceId => <Source key={sourceId} sourceId={sourceId} id={'inquiry-source-' + groupId + '-' + sourceId}/>)}
  </View>;
}

export default function CulturalInquiryScreen({onBack, onConnections, onScrollTop}) {
  const [mode, setMode] = useState('compare');
  const [topicId, setTopicId] = useState('country');
  const [pair, setPair] = useState(['whadjuk', 'badimia']);
  const [questionId, setQuestionId] = useState(null);
  const [about, setAbout] = useState(false);
  const {width} = useWindowDimensions();
  const {preferences} = useAppPreferences();
  const topic = M.TOPICS.find(item => item.id === topicId);
  const question = M.QUESTIONS.find(item => item.id === questionId);
  const wide = width >= 760 && preferences.readingSize !== 'large';

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (mode === 'questions' && questionId) setQuestionId(null);
      else if (mode === 'questions') setMode('compare');
      else onBack();
      onScrollTop?.();
      return true;
    });
    return () => listener.remove();
  }, [mode, questionId, onBack, onScrollTop]);

  function switchMode(next) {
    setMode(next);
    onScrollTop?.();
  }
  function chooseQuestion(id) {
    setQuestionId(id);
    onScrollTop?.();
  }
  function selectGroup(slot, id) {
    setPair(current => current[1 - slot] === id ? [current[1], current[0]] : current.map((value, index) => index === slot ? id : value));
  }
  function exploreQuestion() {
    setTopicId(question.topic);
    setPair([...question.pair]);
    switchMode('compare');
  }
  const pairedQuestions = M.QUESTIONS.filter(item => item.topic === topicId);

  return <View testID="cultural-inquiry-screen" style={s.root}>
    <Button id="inquiry-back" label="Back to Learn" onPress={onBack} style={s.back}/>
    <View style={s.hero}>
      <Text accessibilityRole="header" style={s.title}>{M.META.title}</Text>
      <Text style={s.lead}>{M.META.lead}</Text>
      <Text style={s.tag}>Sources checked {M.META.checked}</Text>
    </View>
    <View style={s.draft}>
      <Pressable testID="inquiry-about-toggle" accessibilityRole="button" accessibilityState={{expanded: about}}
        accessibilityLabel="About this research draft" onPress={() => setAbout(value => !value)} style={s.draftButton}>
        <Text style={[s.small, s.draftSummary]}>{M.META.status} · Reviews pending</Text>
        <Text style={s.link}>{about ? 'Less −' : 'About +'}</Text>
      </Pressable>
      {about && <View testID="inquiry-about" style={s.claims}>
        <Text style={s.small}>{M.META.review}</Text>
        <Text style={s.small}>{M.META.scope}</Text><Text style={s.small}>{M.META.comparison}</Text>
        <Text style={s.small}>Some sources name deceased people or describe colonial harm. Summaries are in English. External sources open only when you tap a link.</Text>
      </View>}
    </View>
    <View accessibilityRole="tablist" accessibilityLabel="Learning exploration mode" style={s.tabs}>
      <Button id="inquiry-tab-compare" label="Compare accounts" tab selected={mode === 'compare'} onPress={() => switchMode('compare')} style={s.tab}/>
      <Button id="inquiry-tab-questions" label="Follow a question" tab selected={mode === 'questions'} onPress={() => switchMode('questions')} style={s.tab}/>
    </View>

    {mode === 'compare' ? <View testID="inquiry-compare" style={s.section}>
      <Text accessibilityRole="header" style={s.heading}>Choose what to explore</Text>
      <View style={s.choices}>{M.TOPICS.map(item => <Button key={item.id} id={'inquiry-topic-' + item.id} label={item.label}
        selected={topicId === item.id} onPress={() => setTopicId(item.id)} style={s.choice}/>)}</View>
      {pair.map((groupId, slot) => <View key={slot} style={s.selector}>
        <Text style={s.meta}>{slot === 0 ? 'First account' : 'Compare with'}</Text>
        <View style={s.choices}>{M.GROUPS.map(group => <Button key={group.id} id={'inquiry-pair-' + slot + '-' + group.id}
          label={(slot === 0 ? 'First account: ' : 'Second account: ') + group.label} selected={groupId === group.id}
          onPress={() => selectGroup(slot, group.id)} style={s.groupChoice}>{group.short}</Button>)}</View>
      </View>)}
      <View accessibilityLiveRegion="polite" style={s.comparisonLead}>
        <Text accessibilityRole="header" style={s.heading}>{topic.question}</Text>
        <Text style={s.small}>{M.META.scope}</Text>
      </View>
      <View style={[s.accounts, wide && s.accountsWide]}>{pair.map(groupId => <Account key={groupId + '-' + topic.id} groupId={groupId} topic={topic} wide={wide}/>)}</View>
      <View style={s.promptCard}>
        <Text style={s.meta}>A question to carry forward</Text>
        <Text style={s.body}>Which connections does each source support, and what would you still like to understand?</Text>
        {pairedQuestions.map(item => <Button key={item.id} id={'inquiry-follow-' + item.id} label={item.title}
          onPress={() => {setQuestionId(item.id); switchMode('questions');}}/>) }
      </View>
    </View> : <View testID="inquiry-questions" style={s.section}>
      {question ? <View testID={'inquiry-question-detail-' + question.id} style={s.section}>
        <Button id="inquiry-question-list" label="Back to questions" onPress={() => chooseQuestion(null)} style={s.back}/>
        <Text accessibilityRole="header" style={s.heading}>{question.title}</Text>
        <View style={s.promptCard}><Text style={s.meta}>Where to begin</Text><Text style={s.body}>{question.start}</Text></View>
        <View style={s.openQuestion}><Text style={s.meta}>What remains open</Text><Text style={s.body}>{question.open}</Text></View>
        <Text accessibilityRole="header" style={s.heading}>Keep exploring</Text>
        {question.prompts.map(prompt => <View key={prompt} style={s.prompt}><Text style={s.body}>{prompt}</Text></View>)}
        <Button id="inquiry-explore-question" label="Compare the relevant accounts" onPress={exploreQuestion} style={s.primary}/>
        <Text accessibilityRole="header" style={s.heading}>Starting sources</Text>
        {question.sources.map(sourceId => <Source key={sourceId} sourceId={sourceId} id={'inquiry-question-source-' + sourceId}/>)}
        <Button id="inquiry-another-question" label="Choose another question" onPress={() => chooseQuestion(null)}/>
      </View> : <View testID="inquiry-question-list" style={s.section}>
        <Text accessibilityRole="header" style={s.heading}>What are you curious about?</Text>
        <Text style={s.body}>Start anywhere. You can leave a question open and return to another source.</Text>
        {M.QUESTIONS.map((item, index) => <Button key={item.id} id={'inquiry-question-' + item.id} label={item.title}
          onPress={() => chooseQuestion(item.id)} style={s.questionButton}>
          {String(index + 1).padStart(2, '0') + '  ' + item.title}
        </Button>)}
      </View>}
    </View>}
    <View style={s.footer}>
      <Text style={s.small}>{M.META.comparison}</Text>
      <Text style={s.small}>Browsing these accounts does not assess you or write to your personal journey.</Text>
      <Button id="inquiry-connections" label="Explore Living connections" onPress={onConnections}/>
    </View>
  </View>;
}

const s = StyleSheet.create({
  root: {width: '100%'}, back: {alignSelf: 'flex-start'},
  hero: {gap: 12, marginTop: 20, marginBottom: 22}, title: {fontFamily: 'ESSHeading', fontSize: 31, lineHeight: 41, color: P.text},
  lead: {fontSize: 18, lineHeight: 28, color: P.gold}, tag: {fontSize: 13, lineHeight: 21, color: P.gold},
  draft: {backgroundColor: P.panel2, borderLeftWidth: 2, borderLeftColor: P.gold, borderRadius: 14, padding: 12},
  draftButton: {minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12}, draftSummary: {flex: 1},
  tabs: {flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginVertical: 22}, tab: {flexGrow: 1, flexBasis: 140},
  button: {minHeight: 48, borderWidth: 1, borderColor: P.line, borderRadius: 14, backgroundColor: P.panel, paddingVertical: 12, paddingHorizontal: 14, justifyContent: 'center'},
  buttonText: {fontSize: 15, lineHeight: 23, color: P.text}, selected: {backgroundColor: P.gold, borderColor: P.gold}, selectedText: {color: P.bg}, pressed: {opacity: 0.76},
  section: {gap: 16}, heading: {fontSize: 22, lineHeight: 31, color: P.text, fontWeight: '600'},
  choices: {flexDirection: 'row', flexWrap: 'wrap', gap: 8}, choice: {flexGrow: 1, flexBasis: 145},
  selector: {gap: 8}, groupChoice: {flexGrow: 1, flexBasis: 80}, comparisonLead: {gap: 10, marginTop: 8},
  accounts: {gap: 14}, accountsWide: {flexDirection: 'row', alignItems: 'flex-start'},
  account: {minWidth: 0, backgroundColor: P.panel, borderWidth: 1, borderColor: P.line, borderRadius: 20, padding: 18, gap: 14}, accountWide: {flex: 1},
  accountTitle: {fontFamily: 'ESSHeading', fontSize: 25, lineHeight: 34, color: P.gold},
  claims: {gap: 12}, eyebrow: {fontSize: 12, lineHeight: 20, letterSpacing: 0.7, color: P.muted}, fact: {gap: 6},
  body: {fontSize: 16, lineHeight: 26, color: P.text}, small: {fontSize: 13, lineHeight: 22, color: P.muted}, meta: {fontSize: 15, lineHeight: 24, color: P.gold, fontWeight: '600'},
  openQuestion: {padding: 15, borderLeftWidth: 2, borderLeftColor: P.gold, backgroundColor: P.bg, borderRadius: 10, gap: 8},
  source: {paddingTop: 14, borderTopWidth: 1, borderTopColor: P.line, gap: 7}, sourceButton: {minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  link: {fontSize: 14, lineHeight: 23, color: P.gold, flexShrink: 1}, linkError: {gap: 8},
  promptCard: {backgroundColor: P.panel2, borderWidth: 1, borderColor: P.line, borderRadius: 18, padding: 18, gap: 12},
  prompt: {padding: 16, borderRadius: 14, backgroundColor: P.panel}, primary: {borderColor: P.gold},
  questionButton: {padding: 18, minHeight: 72}, footer: {gap: 12, marginTop: 24, paddingTop: 18, borderTopWidth: 1, borderTopColor: P.line},
});
