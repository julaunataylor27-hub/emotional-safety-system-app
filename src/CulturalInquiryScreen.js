import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, Linking, BackHandler, useWindowDimensions} from 'react-native';
import {AppText as Text, useAppPreferences} from './AppPreferences';
import GoldenTreeIcon from './GoldenTreeIcons';
import {P} from './PresentationTheme';
const M = require('./culturalInquiry.cjs');

function Button({id, label, onPress, selected, expanded, tab = false, children, style, textStyle}) {
  return <Pressable testID={id} accessibilityRole={tab ? 'tab' : 'button'} accessibilityLabel={label}
    accessibilityState={{...(selected === undefined ? {} : {selected}), ...(expanded === undefined ? {} : {expanded})}}
    onPress={onPress} style={({pressed}) => [s.button, selected && s.selected, style, pressed && s.pressed]}>
    <Text style={[s.buttonText, selected && s.selectedText, textStyle]}>{children || label}</Text>
  </Pressable>;
}

function Source({id, sourceId}) {
  const source = M.SOURCES[sourceId];
  const [failed, setFailed] = useState(false);
  const [details, setDetails] = useState(false);
  async function open() {
    setFailed(false);
    try { await Linking.openURL(source.url); } catch { setFailed(true); }
  }
  return <View style={s.source}>
    <Text style={s.sourceName}>{source.label}</Text>
    <Text style={s.small}>{source.date}</Text>
    <Pressable testID={id} accessibilityRole="link" accessibilityLabel={'Read source: ' + source.label + ', opens an external website'}
      onPress={open} style={({pressed}) => [s.sourceButton, pressed && s.pressed]}>
      <Text style={s.sourceLink}>Read the source{source.url.endsWith('.pdf') ? ' · PDF' : ''}</Text>
      <GoldenTreeIcon name="Arrow" size={20} color={P.bg}/>
    </Pressable>
    <Button id={id + '-details-toggle'} label={(details ? 'Hide' : 'Show') + ' source details for ' + source.label}
      expanded={details} onPress={() => setDetails(value => !value)} style={s.detailButton}>
      {details ? 'Hide source details −' : 'Source details +'}
    </Button>
    {details && <View testID={id + '-details'} style={s.sourceDetails}>
      <Text style={s.small}>{source.kind}</Text>
      <Text style={s.small}>{source.locator}</Text>
      <Text style={s.small}>{source.scope}</Text>
    </View>}
    {failed && <View testID={id + '-error'} accessibilityLiveRegion="polite" style={s.linkError}>
      <Text style={s.small}>The website could not open. Select and copy the address, or tap Read the source to retry.</Text>
      <Text selectable style={s.link}>{source.url}</Text>
    </View>}
  </View>;
}

function Account({groupId, topic, wide}) {
  const group = M.GROUPS.find(item => item.id === groupId);
  const account = topic.accounts[groupId];
  const [expanded, setExpanded] = useState(false);
  const sources = [...new Set(account.facts.map(id => M.FACTS[id].source))];
  const firstFact = account.facts[0];
  return <View testID={'inquiry-account-' + groupId} style={[s.account, wide && s.accountWide]}>
    <Text accessibilityRole="header" style={s.accountTitle}>{group.label}</Text>
    <Text style={s.small}>{group.scope}</Text>
    {firstFact ? <View style={s.claims}>
      <Text style={s.meta}>What the sources describe</Text>
      {expanded ? account.facts.map(id => <View key={id} testID={'inquiry-fact-' + id} style={s.fact}>
        <Text style={s.tag}>{M.SOURCES[M.FACTS[id].source].kind}</Text>
        <Text selectable style={s.body}>{M.FACTS[id].text}</Text>
      </View>) : <View testID={'inquiry-preview-' + groupId} style={s.fact}>
        <Text style={s.tag}>{M.SOURCES[M.FACTS[firstFact].source].kind}</Text>
        <Text selectable style={s.body}>{M.PREVIEWS[firstFact]}</Text>
        <Text style={s.small}>Short summary · full account below</Text>
      </View>}
      <Button id={'inquiry-expand-' + groupId} label={(expanded ? 'Close' : 'Read') + ' full ' + group.label + ' account'}
        expanded={expanded} onPress={() => setExpanded(value => !value)}>
        {expanded ? 'Show short summary −' : 'Read full account +'}
      </Button>
    </View> : <Text style={s.tag}>Open research question</Text>}
    <View style={s.openQuestion}>
      <Text style={s.meta}>What we still don’t know</Text>
      <Text selectable style={s.body}>{account.unknown}</Text>
    </View>
    {sources.map(sourceId => <Source key={sourceId} sourceId={sourceId} id={'inquiry-source-' + groupId + '-' + sourceId}/>)}
  </View>;
}

export default function CulturalInquiryScreen({onBack, onConnections, onScrollTop}) {
  const [mode, setMode] = useState('questions');
  const [topicId, setTopicId] = useState('country');
  const [pair, setPair] = useState(['whadjuk', 'badimia']);
  const [questionId, setQuestionId] = useState(null);
  const [about, setAbout] = useState(false);
  const [selector, setSelector] = useState(null);
  const {width} = useWindowDimensions();
  const {preferences} = useAppPreferences();
  const topic = M.TOPICS.find(item => item.id === topicId);
  const question = M.QUESTIONS.find(item => item.id === questionId);
  const wide = width >= 760 && preferences.readingSize !== 'large';

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selector !== null) setSelector(null);
      else if (mode === 'compare') setMode('questions');
      else if (questionId) setQuestionId(null);
      else onBack();
      onScrollTop?.();
      return true;
    });
    return () => listener.remove();
  }, [mode, questionId, selector, onBack, onScrollTop]);

  function switchMode(next) {
    setMode(next);
    setSelector(null);
    onScrollTop?.();
  }
  function chooseQuestion(id) {
    setQuestionId(id);
    onScrollTop?.();
  }
  function selectGroup(slot, id) {
    setPair(current => current[1 - slot] === id ? [current[1], current[0]] : current.map((value, index) => index === slot ? id : value));
    setSelector(null);
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
      <Text style={s.lead}>A question is a place to begin.</Text>
    </View>
    <View accessibilityRole="tablist" accessibilityLabel="Learning exploration mode" style={s.tabs}>
      <Button id="inquiry-tab-questions" label="Follow a question" tab selected={mode === 'questions'} onPress={() => switchMode('questions')} style={s.tab}/>
      <Button id="inquiry-tab-compare" label="Compare accounts" tab selected={mode === 'compare'} onPress={() => switchMode('compare')} style={s.tab}/>
    </View>
    <View style={s.draft}>
      <Pressable testID="inquiry-about-toggle" accessibilityRole="button" accessibilityState={{expanded: about}}
        accessibilityLabel="About this research draft" onPress={() => setAbout(value => !value)} style={s.draftButton}>
        <View style={s.draftSummary}>
          <Text style={s.small}>{M.META.status}</Text>
          <Text style={s.small}>Reviews pending</Text>
        </View>
        <Text style={s.link}>{about ? 'Less −' : 'About +'}</Text>
      </Pressable>
      {about && <View testID="inquiry-about" style={s.claims}>
        <Text style={s.small}>{M.META.review}</Text>
        <Text style={s.small}>{M.META.scope}</Text><Text style={s.small}>{M.META.comparison}</Text>
        <Text style={s.small}>Sources checked {M.META.checked}. This is not an approval date.</Text>
        <Text style={s.small}>Some sources name deceased people or describe colonial harm. Summaries are in English. External sources open only when you tap a link.</Text>
      </View>}
    </View>

    {mode === 'compare' ? <View testID="inquiry-compare" style={s.section}>
      <View style={s.controls}>
        <View style={s.selector}>
          <Text style={s.meta}>Explore a topic</Text>
          <Button id="inquiry-choose-topic" label={'Change topic: ' + topic.label} expanded={selector === 'topic'}
            onPress={() => setSelector(current => current === 'topic' ? null : 'topic')}>
            {topic.label + (selector === 'topic' ? ' −' : ' +')}
          </Button>
          {selector === 'topic' && <View testID="inquiry-topic-options" style={s.options}>
            {M.TOPICS.map(item => <Button key={item.id} id={'inquiry-topic-' + item.id} label={item.label}
              selected={topicId === item.id} onPress={() => {setTopicId(item.id); setSelector(null);}}/>)}
          </View>}
        </View>
        {pair.map((groupId, slot) => <View key={slot} style={s.selector}>
          <Text style={s.meta}>{slot === 0 ? 'First account' : 'Compare with'}</Text>
          <Button id={'inquiry-choose-pair-' + slot} label={'Change ' + (slot === 0 ? 'first' : 'second') + ' account: ' + M.GROUPS.find(group => group.id === groupId).label}
            expanded={selector === slot} onPress={() => setSelector(current => current === slot ? null : slot)}>
            {M.GROUPS.find(group => group.id === groupId).label + (selector === slot ? ' −' : ' +')}
          </Button>
          {selector === slot && <View testID={'inquiry-pair-options-' + slot} style={s.options}>
            {M.GROUPS.map(group => <Button key={group.id} id={'inquiry-pair-' + slot + '-' + group.id}
              label={(slot === 0 ? 'First account: ' : 'Second account: ') + group.label} selected={groupId === group.id}
              onPress={() => selectGroup(slot, group.id)}>{group.label}</Button>)}
          </View>}
        </View>)}
      </View>
      <View accessibilityLiveRegion="polite" style={s.comparisonLead}>
        <Text accessibilityRole="header" style={s.heading}>{topic.question}</Text>
        <Text style={s.small}>{M.META.scope}</Text>
      </View>
      <View style={[s.accounts, wide && s.accountsWide]}>{pair.map(groupId => <Account key={groupId + '-' + topic.id} groupId={groupId} topic={topic} wide={wide}/>)}</View>
      <View style={s.promptCard}>
        <Text style={s.meta}>Where does your curiosity go next?</Text>
        <Text style={s.body}>Which connections does each source support, and what would you still like to understand?</Text>
        {pairedQuestions.map(item => <Button key={item.id} id={'inquiry-follow-' + item.id} label={item.title}
          onPress={() => {setQuestionId(item.id); switchMode('questions');}}/>)}
      </View>
    </View> : <View testID="inquiry-questions" style={s.section}>
      {question ? <View testID={'inquiry-question-detail-' + question.id} style={s.section}>
        <Button id="inquiry-question-list" label="Back to questions" onPress={() => chooseQuestion(null)} style={s.back}/>
        <Text style={s.tag}>{M.TOPICS.find(item => item.id === question.topic).label}</Text>
        <Text accessibilityRole="header" style={s.heading}>{question.title}</Text>
        <View style={s.promptCard}><Text style={s.meta}>A place to start</Text><Text style={s.body}>{question.start}</Text></View>
        <View style={s.openQuestion}><Text style={s.meta}>What we still don’t know</Text><Text style={s.body}>{question.open}</Text></View>
        <Button id="inquiry-explore-question" label="Explore these two accounts" onPress={exploreQuestion} style={s.primary} textStyle={s.selectedText}/>
        <Text style={s.small}>{question.pair.map(id => M.GROUPS.find(group => group.id === id).label).join(' · ')}</Text>
        <Text accessibilityRole="header" style={s.heading}>Keep wondering</Text>
        {question.prompts.map(prompt => <View key={prompt} style={s.prompt}><Text style={s.body}>{prompt}</Text></View>)}
        <Text accessibilityRole="header" style={s.heading}>Go to the sources</Text>
        {question.sources.map(sourceId => <Source key={sourceId} sourceId={sourceId} id={'inquiry-question-source-' + sourceId}/>)}
        <Button id="inquiry-another-question" label="Choose another question" onPress={() => chooseQuestion(null)}/>
      </View> : <View testID="inquiry-question-list" style={s.section}>
        <Text accessibilityRole="header" style={s.heading}>What are you curious about?</Text>
        <Text style={s.body}>Choose one question. Follow it as far as you like.</Text>
        {M.QUESTIONS.map((item, index) => <Pressable key={item.id} testID={'inquiry-question-' + item.id}
          accessibilityRole="button" accessibilityLabel={item.title} onPress={() => chooseQuestion(item.id)}
          style={({pressed}) => [s.questionButton, pressed && s.pressed]}>
          <Text style={s.questionNumber}>{String(index + 1).padStart(2, '0')}</Text>
          <View style={s.questionCopy}>
            <Text style={s.questionTitle}>{item.title}</Text>
            <Text style={s.small}>{M.TOPICS.find(topic => topic.id === item.topic).label}</Text>
          </View>
          <GoldenTreeIcon name="Arrow" size={20} color={P.gold}/>
        </Pressable>)}
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
  hero: {gap: 10, marginTop: 20}, title: {fontFamily: 'ESSHeading', fontSize: 31, lineHeight: 41, color: P.text},
  lead: {fontSize: 18, lineHeight: 29, color: P.gold}, tag: {fontSize: 15, lineHeight: 24, color: P.gold},
  draft: {backgroundColor: P.panel2, borderLeftWidth: 2, borderLeftColor: P.gold, borderRadius: 14, padding: 12, marginBottom: 26},
  draftButton: {minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12}, draftSummary: {flex: 1},
  tabs: {flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 22, marginBottom: 16}, tab: {flexGrow: 1, flexBasis: 120, minWidth: 0},
  button: {minHeight: 52, borderWidth: 1, borderColor: P.line, borderRadius: 14, backgroundColor: P.panel, paddingVertical: 13, paddingHorizontal: 14, justifyContent: 'center'},
  buttonText: {fontSize: 17, lineHeight: 26, color: P.text}, selected: {backgroundColor: P.gold, borderColor: P.gold}, selectedText: {color: P.bg}, pressed: {opacity: 0.76},
  section: {gap: 18}, heading: {fontSize: 25, lineHeight: 35, color: P.text, fontWeight: '600'},
  controls: {gap: 18, padding: 16, borderRadius: 18, backgroundColor: P.panel2},
  selector: {gap: 9}, options: {gap: 9, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: P.gold}, comparisonLead: {gap: 12, marginTop: 8},
  accounts: {gap: 18}, accountsWide: {flexDirection: 'row', alignItems: 'flex-start'},
  account: {minWidth: 0, backgroundColor: P.panel, borderWidth: 1, borderColor: P.line, borderRadius: 20, padding: 18, gap: 16}, accountWide: {flex: 1},
  accountTitle: {fontFamily: 'ESSHeading', fontSize: 26, lineHeight: 36, color: P.gold},
  claims: {gap: 14}, fact: {gap: 10},
  body: {fontSize: 18, lineHeight: 29, color: P.text}, small: {fontSize: 15, lineHeight: 24, color: P.muted}, meta: {fontSize: 17, lineHeight: 27, color: P.gold, fontWeight: '600'},
  openQuestion: {padding: 16, borderLeftWidth: 2, borderLeftColor: P.gold, backgroundColor: P.bg, borderRadius: 12, gap: 10},
  source: {paddingTop: 16, borderTopWidth: 1, borderTopColor: P.line, gap: 10}, sourceName: {fontSize: 16, lineHeight: 25, color: P.text, fontWeight: '600'},
  sourceButton: {minHeight: 54, borderRadius: 12, padding: 14, backgroundColor: P.gold, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  sourceLink: {fontSize: 17, lineHeight: 26, color: P.bg, fontWeight: '600', flexShrink: 1},
  detailButton: {borderWidth: 0, paddingHorizontal: 0, backgroundColor: 'transparent'}, sourceDetails: {gap: 10},
  link: {fontSize: 16, lineHeight: 25, color: P.gold, flexShrink: 1}, linkError: {gap: 10},
  promptCard: {backgroundColor: P.panel2, borderWidth: 1, borderColor: P.line, borderRadius: 18, padding: 18, gap: 14},
  prompt: {padding: 18, borderRadius: 14, backgroundColor: P.panel}, primary: {borderColor: P.gold, backgroundColor: P.gold},
  questionButton: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 20, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, borderColor: P.line, backgroundColor: P.panel, minHeight: 108},
  questionNumber: {fontSize: 15, lineHeight: 24, color: P.gold}, questionCopy: {flex: 1, minWidth: 0, gap: 8}, questionTitle: {fontSize: 19, lineHeight: 29, color: P.text, fontWeight: '600'},
  footer: {gap: 14, marginTop: 28, paddingTop: 20, borderTopWidth: 1, borderTopColor: P.line},
});
