import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, BackHandler, Linking, Share, Alert} from 'react-native';
import {AppText as Text, AppInput as TextInput} from './AppPreferences';
import {P} from './PresentationTheme';
const M = require('./independenceCommitment.cjs');

function Button({id, label, onPress, primary, selected, expanded}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{...(selected === undefined ? {} : {selected}), ...(expanded === undefined ? {} : {expanded})}}
    onPress={onPress} style={({pressed}) => [s.button, (primary || selected) && s.primary, pressed && s.pressed]}>
    <Text style={[s.buttonText, (primary || selected) && s.dark]}>{label}</Text>
  </Pressable>;
}

function Source({source}) {
  const [failed, setFailed] = useState(false);
  async function open() {
    setFailed(false);
    try {await Linking.openURL(source.url);} catch {setFailed(true);}
  }
  return <View style={s.card}>
    <Text style={s.label}>{source.author}</Text>
    <Text style={s.heading}>{source.title}</Text>
    <Text style={s.body}>{source.summary}</Text>
    <Text style={s.small}>Source checked {source.checked}</Text>
    <Pressable testID={'balance-source-' + source.id} accessibilityRole="link"
      accessibilityLabel={'Read original source: ' + source.title + ', opens an external website'}
      onPress={open} style={s.button}><Text style={s.buttonText}>Read original source</Text></Pressable>
    {failed && <View testID={'balance-source-error-' + source.id} accessibilityLiveRegion="polite" style={s.section}>
      <Text style={s.notice}>The website could not open. Select and copy its address, or tap the source again to retry.</Text>
      <Text selectable style={s.small}>{source.url}</Text>
    </View>}
  </View>;
}

export default function IndependenceCommitmentScreen({reflection, onChange, onBack, onSupport, onScrollTop}) {
  const [about, setAbout] = useState(false);
  const [status, setStatus] = useState('');
  const step = M.STEPS[reflection.index];
  function update(patch, scroll = false) {
    onChange(previous => ({...previous, ...patch}));
    setStatus('');
    setAbout(false);
    if (scroll) onScrollTop?.();
  }
  function back() {
    if (about) {setAbout(false); return;}
    if (reflection.paused) update({paused: false}, true);
    else if (reflection.view === 'preview') update({view: 'summary'}, true);
    else if (reflection.view === 'summary') update({view: 'form', index: 3}, true);
    else if (reflection.view === 'form' && reflection.index > 0) update({index: reflection.index - 1}, true);
    else if (reflection.view !== 'intro') update({view: 'intro'}, true);
    else onBack();
  }
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {back(); return true;});
    return () => handler.remove();
  }, [reflection.view, reflection.index, reflection.paused, about, onBack, onScrollTop]);

  function field(key, label, placeholder) {
    return <View style={s.section}>
      <Text style={s.label}>{label}</Text>
      <TextInput testID={'balance-input-' + key} accessibilityLabel={label} value={reflection[key]}
        onChangeText={value => update({[key]: value})} placeholder={placeholder} placeholderTextColor={P.muted}
        multiline maxLength={1500} textAlignVertical="top" style={s.input}/>
    </View>;
  }
  function clear() {
    Alert.alert('Clear this balance reflection?', 'Only this reflection and its session writing will be cleared.', [
      {text: 'Keep my reflection', style: 'cancel'},
      {text: 'Clear reflection', style: 'destructive', onPress: () => {
        onChange(M.createReflection()); setStatus(''); setAbout(false); onScrollTop?.();
      }},
    ]);
  }
  async function share() {
    setStatus('');
    try {
      const result = await Share.share({title: M.META.title, message: M.reflectionText(reflection)});
      if (result?.action === (Share.dismissedAction || 'dismissedAction')) setStatus('Share options closed. Your reflection is still here.');
    } catch {setStatus('Share options could not open. Your reflection is still here. Select and copy the preview or try again.');}
  }

  return <View testID="independence-commitment-screen" style={s.root}>
    <Button id="balance-back" label={reflection.view === 'intro' && !reflection.paused && !about ? 'Back to Learn' : 'Back'} onPress={back}/>
    <Text style={s.eyebrow}>{M.META.title} · Reflection</Text>
    {reflection.paused ? <View testID="balance-paused" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Room to pause.</Text>
      <Text style={s.body}>Take the time you need. Your writing remains here during this app session.</Text>
      <Button id="balance-resume" label="Continue when ready" primary onPress={() => update({paused: false}, true)}/>
      <Button id="balance-pause-leave" label="Return to Learn" onPress={onBack}/>
    </View> : reflection.view === 'intro' ? <View testID="balance-intro" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>{M.META.lead}</Text>
      <Text style={s.lead}>You can value your own space and choose to care for a connection or goal.</Text>
      <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Independence</Text>
        <Text style={s.body}>Room for your time, interests, identity, privacy and boundaries.</Text></View>
      <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Commitment</Text>
        <Text style={s.body}>Choose what you can realistically offer, follow through where possible and communicate when plans need to change.</Text></View>
      <Text style={s.body}>{M.META.scope}</Text>
      <Button id="balance-start" label="Start or continue my reflection" primary onPress={() => update({view: 'form'}, true)}/>
      <Button id="balance-example" label="See a fictional example" onPress={() => update({view: 'example'}, true)}/>
    </View> : reflection.view === 'example' ? <View testID="balance-example-view" style={s.section}>
      <Text style={s.eyebrow}>FICTIONAL EXAMPLE · TWO ADULTS</Text>
      <Text accessibilityRole="header" style={s.title}>Space and connection can coexist.</Text>
      <Text style={s.body}>Alex wants quiet time tonight. Jo would like to know when they might reconnect.</Text>
      <View style={s.card}>
        <Text style={s.heading}>One possible conversation</Text>
        <Text style={s.body}>“I would like an hour to myself. Would a check-in at seven work for you? We can say if either of us needs to change the plan.”</Text>
      </View>
      <Text style={s.body}>Alex names a need and makes an offer. Jo can accept, decline or suggest another time. Neither person has to guess the other’s feelings.</Text>
      <Text style={s.small}>An example to think about. It does not mean this approach suits every situation.</Text>
      <Button id="balance-example-start" label="Write my own reflection" primary onPress={() => update({view: 'form'}, true)}/>
    </View> : reflection.view === 'form' ? <View testID={'balance-step-' + step.id} style={s.section}>
      <Text accessibilityLiveRegion="polite" style={s.small}>Part {reflection.index + 1} of 4 · All answers are optional</Text>
      <Text accessibilityRole="header" style={s.title}>{step.label}</Text>
      <Text style={s.lead}>{step.meaning}</Text>
      <View style={s.card}>
        {step.id === 'choice' ? <>
          <Text style={s.heading}>{step.prompt}</Text>
          {M.CHOICES.map(item => <Button key={item.id} id={'balance-choice-' + item.id} label={item.label}
            selected={reflection.choice === item.id} onPress={() => update({choice: item.id})}/>)}
          <Text testID="balance-choice-notice" accessibilityLiveRegion="polite" style={s.notice}>{M.choiceNotice(reflection.choice)}</Text>
          {field('respect', 'How can I respect the other person’s choices?', 'For example: ask what works for them and give them room to answer.')}
          <Button id="balance-choice-support" label="Find support" onPress={onSupport}/>
        </> : field(step.id, step.prompt, step.placeholder)}
        {step.id === 'checkIn' && <>
          {field('changePlan', 'If plans change, what could I do?', 'For example: give an honest update when it is safe and possible.')}
          <Text style={s.small}>Writing a time here does not set a reminder.</Text>
        </>}
      </View>
      <Button id="balance-next" label={reflection.index === 3 ? 'Review my reflection' : 'Next part'} primary
        onPress={() => update(reflection.index === 3 ? {view: 'summary'} : {index: reflection.index + 1}, true)}/>
      <Button id="balance-pause" label="Pause here" onPress={() => update({paused: true}, true)}/>
    </View> : reflection.view === 'summary' ? <View testID="balance-summary" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>My space. My chosen care.</Text>
      <Text style={s.lead}>These are your proposed choices. You can revise them or leave them open.</Text>
      {M.STEPS.map((item, index) => <View key={item.id} style={s.card}>
        <Text style={s.heading}>{item.label}</Text>
        <Text selectable style={s.body}>{item.id === 'choice' ? M.choiceLabel(reflection.choice) : reflection[item.id].trim() || 'Left open'}</Text>
        {item.id === 'choice' && <>
          <Text style={s.notice}>{M.choiceNotice(reflection.choice)}</Text>
          <Text style={s.label}>Respect for the other person’s choices</Text>
          <Text selectable style={s.body}>{reflection.respect.trim() || 'Left open'}</Text>
        </>}
        {item.id === 'checkIn' && <><Text style={s.label}>If plans change</Text><Text selectable style={s.body}>{reflection.changePlan.trim() || 'Left open'}</Text></>}
        <Button id={'balance-edit-' + item.id} label={'Change ' + item.label.toLowerCase()} onPress={() => update({view: 'form', index}, true)}/>
      </View>)}
      <Text style={s.small}>This records your view only. Another person has not agreed by your writing this.</Text>
      <Button id="balance-preview" label="Preview a copy of my reflection" primary onPress={() => update({view: 'preview'}, true)}/>
      <Button id="balance-clear" label="Clear this reflection" onPress={clear}/>
    </View> : <View testID="balance-preview-view" style={s.section}>
      <Text accessibilityRole="header" style={s.title}>Preview my copy.</Text>
      <View style={s.card}><Text testID="balance-preview-text" selectable style={s.body}>{M.reflectionText(reflection)}</Text></View>
      <Button id="balance-share" label="Open share options" primary onPress={share}/>
      <Button id="balance-edit" label="Return to my reflection" onPress={() => update({view: 'summary'}, true)}/>
    </View>}
    {!!status && <Text testID="balance-status" accessibilityLiveRegion="polite" style={s.notice}>{status}</Text>}
    <View style={s.footer}>
      <Text style={s.small}>{M.META.privacy}</Text>
      <Button id="balance-about" label="About this reflection & sources" expanded={about} onPress={() => setAbout(value => !value)}/>
      {about && <View testID="balance-about-details" style={s.section}>
        <Text style={s.body}>These prompts were written for this app. Public guidance supports the themes; the reflection has not been evaluated as a safety tool.</Text>
        <Text style={s.small}>It does not score a relationship, establish another person’s consent or create an agreement for them. Each person keeps their own voice and choices.</Text>
        {M.SOURCES.map(source => <Source key={source.id} source={source}/>)}
      </View>}
      <Button id="balance-support" label="Explore support options" onPress={onSupport}/>
    </View>
  </View>;
}

const s = StyleSheet.create({
  root: {gap: 18, paddingBottom: 24}, section: {gap: 16},
  eyebrow: {fontSize: 13, lineHeight: 22, color: P.gold},
  title: {fontFamily: 'ESSHeading', fontSize: 31, lineHeight: 41, color: P.text},
  lead: {fontSize: 18, lineHeight: 29, color: P.muted},
  heading: {fontSize: 22, lineHeight: 31, color: P.text, fontWeight: '600'},
  body: {fontSize: 17, lineHeight: 28, color: P.text},
  small: {fontSize: 14, lineHeight: 24, color: P.muted},
  label: {fontSize: 16, lineHeight: 25, color: P.gold, fontWeight: '600'},
  notice: {fontSize: 15, lineHeight: 25, color: P.gold},
  card: {backgroundColor: P.panel, borderColor: P.line, borderWidth: 1, borderRadius: 20, padding: 19, gap: 16},
  button: {minHeight: 52, borderColor: P.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, justifyContent: 'center'},
  buttonText: {fontSize: 16, lineHeight: 25, textAlign: 'center', color: P.text, fontWeight: '600'},
  primary: {backgroundColor: P.gold, borderColor: P.gold}, dark: {color: P.bg}, pressed: {opacity: .78},
  input: {backgroundColor: P.bg, borderColor: P.line, borderWidth: 1, borderRadius: 14, minHeight: 125, padding: 15, fontSize: 17, lineHeight: 28, color: P.text},
  footer: {gap: 16, borderTopWidth: 1, borderTopColor: P.line, paddingTop: 20},
});
