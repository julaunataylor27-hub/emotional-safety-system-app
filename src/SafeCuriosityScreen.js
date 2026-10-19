import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, BackHandler} from 'react-native';
import {AppText as Text, AppInput as TextInput} from './AppPreferences';
import {P} from './PresentationTheme';
const Lab = require('./safeCuriosity.cjs');

function Button({id, label, onPress, primary, selected, disabled}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{selected: !!selected, disabled: !!disabled}} disabled={!!disabled}
    onPress={onPress} style={({pressed}) => [s.button, (primary || selected) && s.primary, disabled && s.disabled, pressed && s.pressed]}>
    <Text style={[s.buttonLabel, (primary || selected) && s.dark]}>{label}</Text>
  </Pressable>;
}

export default function SafeCuriosityScreen({onBack, onScrollTop}) {
  const [ageGroup, setAgeGroup] = useState('10-12');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {onBack(); return true;});
    return () => handler.remove();
  }, [onBack]);

  function review() {
    setResult(Lab.reviewQuestion(question, ageGroup));
    onScrollTop?.();
  }
  function chooseExample(sample) {
    setQuestion(sample.question);
    setResult(null);
  }
  function clear() {
    setQuestion('');
    setResult(null);
  }

  return <View testID="safe-curiosity-screen" style={s.root}>
    <Button id="safe-curiosity-back" label="Back to Learn" onPress={onBack}/>
    <Text style={s.eyebrow}>EMOTIONAL SAFETY SYSTEM · PROOF OF CONCEPT</Text>
    <Text accessibilityRole="header" style={s.title}>Safe Curiosity Lab</Text>
    <Text style={s.lead}>Protect curiosity. Turn questions into knowledge, boundaries and choice.</Text>
    <View style={s.notice} testID="safe-curiosity-scope">
      <Text style={s.heading}>This is a demonstration, not an internet filter.</Text>
      <Text style={s.body}>It checks only a question you choose to enter, using a few transparent rules stored inside the app. It does not scan your phone, look at videos, connect to websites, or claim to read anyone's emotions.</Text>
    </View>

    <Text style={s.heading}>1. Choose an example age range</Text>
    <Text style={s.small}>This only changes the wording of learning guidance. No birthday, account or identity is needed.</Text>
    <View style={s.choices}>
      {Lab.AGE_GROUPS.map(group => <Button key={group.id} id={'safe-curiosity-age-' + group.id} label={group.label} selected={ageGroup === group.id}
        onPress={() => {setAgeGroup(group.id); setResult(null);}}/>)}
    </View>

    <Text style={s.heading}>2. Explore a fictional question</Text>
    <Text style={s.small}>Try a ready-made example. Avoid entering real children's names, addresses, images or identifying details.</Text>
    {Lab.EXAMPLES.map(sample => <Button key={sample.id} id={'safe-curiosity-example-' + sample.id}
      label={sample.label + ' · ' + sample.question} onPress={() => chooseExample(sample)}/>)}
    <Text style={s.fieldLabel}>Question to explore (optional)</Text>
    <TextInput testID="safe-curiosity-question" accessibilityLabel="Question to explore"
      value={question} onChangeText={value => {setQuestion(value); setResult(null);}}
      multiline maxLength={500} textAlignVertical="top" placeholder="For example: Why do websites recommend videos?"
      placeholderTextColor={P.muted} style={s.input}/>
    <Text style={s.small}>Your question stays in this screen's temporary memory. The lab does not upload it or save it to device storage. Leaving the app or clearing the field removes this lab's copy.</Text>
    <Button id="safe-curiosity-review" label="Explore safely" primary disabled={!question.trim()} onPress={review}/>
    <Button id="safe-curiosity-clear" label="Clear question and result" onPress={clear}/>

    {result && <View testID="safe-curiosity-result" accessibilityLiveRegion="polite" style={s.result}>
      <Text style={s.eyebrow}>{result.status.toUpperCase()} · DEMONSTRATION</Text>
      <Text accessibilityRole="header" style={s.heading}>{result.title}</Text>
      <Text style={s.fieldLabel}>Why this example was selected</Text>
      <Text testID="safe-curiosity-reason" style={s.body}>{result.reason}</Text>
      <Text style={s.fieldLabel}>Age-appropriate learning or support</Text>
      <Text testID="safe-curiosity-guidance" style={s.body}>{result.guidance}</Text>
      <Text style={s.fieldLabel}>One possible next step</Text>
      <Text style={s.body}>{result.next}</Text>
      <Text style={s.small}>{result.limitation}</Text>
    </View>}

    <View style={s.notice}>
      <Text style={s.heading}>How this could grow into your chip idea</Text>
      <Text style={s.body}>1. Test these learning and safeguarding examples with adults and child-safety experts.</Text>
      <Text style={s.body}>2. Build an opt-in, privacy-preserving browser prototype that checks permitted website content.</Text>
      <Text style={s.body}>3. Investigate on-device AI on existing phone chips. A purpose-built hardware chip comes much later, if justified.</Text>
      <Text style={s.small}>Real protection would require extensive accuracy, safeguarding, accessibility and cultural reviews, plus support from browsers and operating systems.</Text>
    </View>
    <Text style={s.footer}>Educational research prototype only · Not proof that harmful internet content is blocked, not a diagnosis and not an emergency service.</Text>
  </View>;
}

const s = StyleSheet.create({
  root: {paddingBottom: 36},
  eyebrow: {fontSize: 13, lineHeight: 21, color: P.gold, marginTop: 13, marginBottom: 8, letterSpacing: 0.3},
  title: {fontSize: 29, lineHeight: 38, color: P.text, marginBottom: 10},
  heading: {fontSize: 20, lineHeight: 29, color: P.text, marginTop: 16, marginBottom: 9},
  lead: {fontSize: 17, lineHeight: 27, color: P.muted, marginBottom: 18},
  body: {fontSize: 16, lineHeight: 25, color: P.text, marginBottom: 10},
  small: {fontSize: 13, lineHeight: 21, color: P.muted, marginBottom: 12},
  notice: {padding: 18, backgroundColor: P.panel, borderRadius: 18, borderColor: P.line, borderWidth: 1, marginVertical: 13},
  choices: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16},
  button: {backgroundColor: P.panel2, borderWidth: 1, borderColor: P.line, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, minHeight: 50, justifyContent: 'center', marginBottom: 10},
  buttonLabel: {color: P.text, fontSize: 15, lineHeight: 23},
  primary: {backgroundColor: P.gold, borderColor: P.gold},
  dark: {color: P.bg, fontWeight: '700'},
  pressed: {opacity: 0.75}, disabled: {opacity: 0.4},
  fieldLabel: {fontSize: 14, lineHeight: 22, fontWeight: '700', color: P.gold, marginTop: 12, marginBottom: 8},
  input: {backgroundColor: P.panel, color: P.text, borderColor: P.line, borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 16, lineHeight: 24, minHeight: 110, marginBottom: 8},
  result: {borderWidth: 2, borderColor: P.gold, borderRadius: 18, backgroundColor: P.panel, padding: 18, marginVertical: 18},
  footer: {fontSize: 13, lineHeight: 21, color: P.muted, marginTop: 16},
});
