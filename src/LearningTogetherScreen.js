import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, BackHandler, Share, Alert} from 'react-native';
import {AppText as Text, AppInput as TextInput} from './AppPreferences';
import {P} from './PresentationTheme';
const M = require('./learningTogether.cjs');

function Button({id, label, onPress, primary, selected}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={selected === undefined ? {} : {selected}}
    onPress={onPress} style={({pressed}) => [s.button, (primary || selected) && s.primary, pressed && s.pressed]}>
    <Text style={[s.buttonText, (primary || selected) && s.dark]}>{label}</Text>
  </Pressable>;
}

export default function LearningTogetherScreen({practice, onChange, onBack, onOpenTrail, onScrollTop, onExploreConnections}) {
  const [about, setAbout] = useState(false);
  const [status, setStatus] = useState('');
  const step = M.STEPS[practice.index];
  function update(patch, scroll = false) {
    onChange(previous => ({...previous, ...patch}));
    setStatus('');
    if (scroll) onScrollTop?.();
  }
  function back() {
    if (practice.paused) update({paused: false}, true);
    else if (practice.view === 'preview') update({view: 'summary'}, true);
    else if (practice.view === 'summary') update({view: 'exercise', index: 5}, true);
    else if (practice.view === 'exercise' && practice.index > 0) update({index: practice.index - 1}, true);
    else if (practice.view === 'exercise') update({view: 'intro'}, true);
    else onBack();
  }
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {back(); return true;});
    return () => handler.remove();
  }, [practice.view, practice.index, practice.paused, onBack, onScrollTop]);
  function choose(choice) {
    onChange(previous => M.updateAnswer(previous, step.id, choice));
    setStatus('');
  }
  function clear() {
    Alert.alert('Clear this learning practice?', 'Only this practice plan and its session notes will be cleared.', [
      {text: 'Keep my practice', style: 'cancel'},
      {text: 'Clear practice', style: 'destructive', onPress: () => {onChange(M.createPractice()); setStatus(''); onScrollTop?.();}},
    ]);
  }
  async function share() {
    setStatus('');
    try { await Share.share({title: 'My learning together plan', message: M.practiceText(practice)}); }
    catch {setStatus('Share options could not open. Your plan is still here. Select and copy the preview or try again.');}
  }
  function field(key, label, placeholder) {
    return <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput testID={'together-input-' + key} accessibilityLabel={label} value={practice[key]}
        onChangeText={value => update({[key]: value})} placeholder={placeholder} placeholderTextColor={P.muted}
        multiline maxLength={1500} textAlignVertical="top" style={s.input}/>
    </View>;
  }

  return <View testID="learning-together-screen" style={s.root}>
    <Button id="together-back" label={practice.view === 'intro' && !practice.paused ? 'Back to Learn' : 'Back'} onPress={back}/>
    <Text style={s.eyebrow}>{M.META.status} · {M.META.title}</Text>
    {practice.paused ? <View testID="together-paused" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Room to pause.</Text>
      <Text style={s.body}>There is no time limit. Your choices remain here during this app session.</Text>
      <Button id="together-resume" label="Continue when ready" primary onPress={() => update({paused: false}, true)}/>
      <Button id="together-pause-leave" label="Return to Learn" onPress={onBack}/>
    </View> : practice.view === 'intro' ? <View testID="together-intro" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Make room to learn together.</Text>
      <Text style={s.lead}>Encouragement, pace, timing, knowledge, conversation and peace.</Text>
      <View style={s.card}>
        <Text accessibilityRole="header" style={s.heading}>Start with a shared garden.</Text>
        <Text style={s.body}>Two adults want to start a garden. One is experienced; the other is learning. Explore an approach for each of the six parts.</Text>
        <Text style={s.small}>Fictional practice · You can change a choice, leave it open or pause.</Text>
        <Button id="together-start" label={Object.values(practice.answers).some(Number.isInteger) ? 'Continue my practice' : 'Try the garden example'} primary onPress={() => update({view: 'exercise'}, true)}/>
      </View>
      {field('topic', 'My possible topic (optional)', 'Where might I try learning with someone?')}
      {!!onExploreConnections && <Button id="together-explore-connections" label="Explore connected ideas" onPress={onExploreConnections}/>}
      <Button id="together-open-trail" label="Explore a question in Knowledge Trail" onPress={onOpenTrail}/>
      <Button id="together-about" label={about ? 'Hide practice details' : 'About this practice'} onPress={() => setAbout(value => !value)}/>
      {about && <View testID="together-about-details" style={s.card}><Text style={s.body}>{M.META.origin}</Text><Text style={s.small}>{M.META.scope}</Text></View>}
    </View> : practice.view === 'exercise' ? <View testID={'together-step-' + step.id} style={s.section}>
      <Text accessibilityLiveRegion="polite" style={s.small}>Part {practice.index + 1} of 6 · Fictional shared garden</Text>
      <Text accessibilityRole="header" style={s.title}>{step.label}</Text>
      <Text style={s.lead}>{step.meaning}</Text>
      <View style={s.card}>
        <Text style={s.body}>{step.context}</Text>
        <Text accessibilityRole="header" style={s.heading}>{step.prompt}</Text>
        {step.options.map((option, index) => <Button key={option.label} id={'together-option-' + index}
          label={option.label} selected={practice.answers[step.id] === index} onPress={() => choose(index)}/>)}
        <Button id="together-leave-open" label="Leave this open" selected={practice.answers[step.id] === null} onPress={() => choose(null)}/>
        <Text testID="together-selected" accessibilityLiveRegion="polite" style={s.small}>{M.selectedApproach(practice, step)}</Text>
      </View>
      <View style={s.actions}>
        <Button id="together-next" label={practice.index === 5 ? 'Review my practice plan' : 'Next part'} primary onPress={() => update(practice.index === 5 ? {view: 'summary'} : {index: practice.index + 1}, true)}/>
        <Button id="together-pause" label="Pause here" onPress={() => update({paused: true}, true)}/>
      </View>
    </View> : practice.view === 'summary' ? <View testID="together-summary" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>My practice plan.</Text>
      <Text style={s.small}>Proposed choices from a fictional example · These are not measured outcomes.</Text>
      {M.STEPS.map((item, index) => <View key={item.id} style={s.card}>
        <Text style={s.heading}>{item.label}</Text><Text selectable style={s.body}>{M.selectedApproach(practice, item)}</Text>
        <Button id={'together-edit-' + item.id} label={'Change ' + item.label.toLowerCase()} onPress={() => update({view: 'exercise', index}, true)}/>
      </View>)}
      {field('topic', 'My possible topic (optional)', 'Where might I try learning with someone?')}
      {field('reflection', 'What became clearer? (my own reflection)', 'What did I notice or understand?')}
      {field('unknowns', 'What still needs checking?', 'What remains uncertain or needs another perspective?')}
      {field('nextStep', 'My possible next step (optional)', 'What would I like to explore, if anything?')}
      <Button id="together-preview" label="Preview a copy of my plan" primary onPress={() => update({view: 'preview'}, true)}/>
      <Button id="together-summary-trail" label="Explore a question in Knowledge Trail" onPress={onOpenTrail}/>
      <Button id="together-clear" label="Clear this practice" onPress={clear}/>
    </View> : <View testID="together-preview" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Preview my copy.</Text>
      <View style={s.card}><Text testID="together-preview-text" selectable style={s.body}>{M.practiceText(practice)}</Text></View>
      <Button id="together-share" label="Open share options" primary onPress={share}/>
      <Button id="together-edit-plan" label="Return to my plan" onPress={() => update({view: 'summary'}, true)}/>
    </View>}
    {!!status && <Text testID="together-status" accessibilityLiveRegion="polite" style={s.notice}>{status}</Text>}
    <Text style={s.small}>{M.META.privacy}</Text>
    <Text style={s.credit}>Personal experience framework · Julauna Taylor</Text>
  </View>;
}

const s = StyleSheet.create({
  root: {gap: 18, paddingBottom: 22}, section: {gap: 18}, actions: {gap: 10}, field: {gap: 10},
  eyebrow: {fontSize: 13, lineHeight: 21, color: P.gold}, title: {fontFamily: 'ESSHeading', fontSize: 32, lineHeight: 42, color: P.text},
  lead: {fontSize: 18, lineHeight: 28, color: P.muted}, heading: {fontSize: 22, lineHeight: 31, fontWeight: '600', color: P.text},
  body: {fontSize: 17, lineHeight: 28, color: P.text}, small: {fontSize: 14, lineHeight: 23, color: P.muted},
  label: {fontSize: 16, lineHeight: 25, fontWeight: '600', color: P.gold}, notice: {fontSize: 15, lineHeight: 24, color: P.gold},
  card: {backgroundColor: P.panel, borderWidth: 1, borderColor: P.line, borderRadius: 20, padding: 20, gap: 17},
  button: {minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: P.line, paddingHorizontal: 16, paddingVertical: 13, justifyContent: 'center'},
  primary: {backgroundColor: P.gold, borderColor: P.gold}, pressed: {opacity: .78}, dark: {color: P.bg},
  buttonText: {fontSize: 16, lineHeight: 25, color: P.text, textAlign: 'center', fontWeight: '600'},
  input: {backgroundColor: P.bg, borderWidth: 1, borderColor: P.line, borderRadius: 14, minHeight: 108, padding: 14, color: P.text, fontSize: 17, lineHeight: 28},
  credit: {fontSize: 13, lineHeight: 22, color: P.gold},
});
