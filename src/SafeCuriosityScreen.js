import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, BackHandler, Linking} from 'react-native';
import {AppText as Text, AppInput as TextInput} from './AppPreferences';
import {P,presentationStyles} from './PresentationTheme';
import NightForestScene from './NightForestScene';
import GoldenTreeIcon from './GoldenTreeIcons';
const Lab = require('./safeCuriosity.cjs');
const Knowledge = require('./safeCuriosityKnowledge.cjs');

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
  const [knowledgeView, setKnowledgeView] = useState(false);
  const [openSections, setOpenSections] = useState({0: true});
  const [followup, setFollowup] = useState(-1);
  const [quizChoice, setQuizChoice] = useState(null);
  const [failedSource, setFailedSource] = useState(null);
  const trail = result ? Knowledge.getKnowledge(result, ageGroup) : null;

  function resetTrail() {
    setKnowledgeView(false);
    setResult(null);
    setOpenSections({0: true});
    setFollowup(-1);
    setQuizChoice(null);
    setFailedSource(null);
  }

  async function openSource(source) {
    setFailedSource(null);
    try {await Linking.openURL(source.url);}
    catch {setFailedSource(source.url);}
  }

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {if (knowledgeView) {setKnowledgeView(false); onScrollTop?.();} else onBack(); return true;});
    return () => handler.remove();
  }, [onBack, onScrollTop, knowledgeView]);

  function review() {
    resetTrail();
    setResult(Lab.reviewQuestion(question, ageGroup));
  }
  function chooseExample(sample) {
    setQuestion(sample.question);
    resetTrail();
  }
  function clear() {
    setQuestion('');
    resetTrail();
  }

  return <View testID="safe-curiosity-screen" style={s.root}>
    <Button id="safe-curiosity-back" label={knowledgeView ? "Back to Safe Curiosity" : "Back to Learn"} onPress={()=>{if(knowledgeView){setKnowledgeView(false);onScrollTop?.();}else onBack();}}/>
    <View style={s.scenicHero} testID="safe-curiosity-night-banner">
      <NightForestScene scene="emotionalSafety" height={205}/>
      <View style={s.heroOverlay}>
       <Text style={s.heroEmblem}>✦</Text>
       <Text accessibilityRole="header" style={s.heroHeading}>{knowledgeView ? "Explore the knowledge" : "Safe Curiosity Lab"}</Text>
       <Text style={s.heroPill}>Proof of Concept</Text>
       <Text style={s.heroDescription}>{knowledgeView ? "Step-by-step learning to understand and stay safe online." : "A safe space to explore questions with age-appropriate knowledge and supportive answers."}</Text>
      </View>
    </View>
    {!knowledgeView && <>
    <View style={s.notice} testID="safe-curiosity-scope">
      <Text style={s.heading}>This is a demonstration, not an internet filter.</Text>
      <Text style={s.body}>It checks only a question you choose to enter, using a few transparent rules stored inside the app. It does not scan your phone, look at videos, connect to websites, or claim to read anyone's emotions.</Text>
    </View>

    <Text style={s.heading}>Select age range</Text>
    <Text style={s.small}>This changes the wording of some learning guidance. No birthday, account or identity is needed.</Text>
    <View style={s.choices}>
      {Lab.AGE_GROUPS.map(group => <Button key={group.id} id={'safe-curiosity-age-' + group.id} label={group.label} selected={ageGroup === group.id}
        onPress={() => {setAgeGroup(group.id); resetTrail();}}/>)}
    </View>

    <Text style={s.heading}>Try an example question</Text>
    <Text style={s.small}>Try a ready-made example. Avoid entering real children's names, addresses, images or identifying details.</Text>
    {Lab.EXAMPLES.map(sample => <Button key={sample.id} id={'safe-curiosity-example-' + sample.id}
      label={sample.label + ' · ' + sample.question} onPress={() => chooseExample(sample)}/>)}
    <Text style={s.fieldLabel}>Or ask your own question</Text>
    <TextInput testID="safe-curiosity-question" accessibilityLabel="Question to explore"
      value={question} onChangeText={value => {setQuestion(value); resetTrail();}}
      multiline maxLength={500} textAlignVertical="top" placeholder="For example: Why do websites recommend videos?"
      placeholderTextColor={P.muted} style={s.input}/>
    <Text style={s.small}>Your question stays in this screen's temporary memory. The lab does not upload it or save it to device storage. Navigating away from this lab or clearing the field removes this lab's copy.</Text>
    <Button id="safe-curiosity-review" label="⌕  Explore safely" primary disabled={!question.trim()} onPress={review}/>
    <Button id="safe-curiosity-clear" label="Clear question and result" onPress={clear}/>
    </>}

    {result && <View testID="safe-curiosity-result" accessibilityLiveRegion="polite" style={s.result}>
      {!knowledgeView && <>
      <Text style={s.eyebrow}>{result.status.toUpperCase()} · DEMONSTRATION</Text>
      <Text accessibilityRole="header" style={s.resultHeading}>{result.title}</Text>
      <Text style={s.fieldLabel}>Why this example was selected</Text>
      <Text testID="safe-curiosity-reason" style={s.body}>{result.reason}</Text>
      <Text style={s.fieldLabel}>Age-appropriate learning or support</Text>
      <Text testID="safe-curiosity-guidance" style={s.body}>{result.guidance}</Text>
      <Text style={s.fieldLabel}>One possible next step</Text>
      <Text style={s.body}>{result.next}</Text>
      <Text style={s.small}>{result.limitation}</Text>
      <Button id="safe-curiosity-open-knowledge" label="Explore the knowledge →" primary onPress={()=>{setKnowledgeView(true);onScrollTop?.();}}/>
      </>}
      {trail && <View testID="safe-curiosity-knowledge-trail" style={s.knowledge}>
        <View style={s.knowledgeTitle}><GoldenTreeIcon name="Knowledge" color={P.gold} size={30}/><Text accessibilityRole="header" style={s.title}>Explore the knowledge</Text></View>
        <Text style={s.body}>{trail.intro}</Text>
        <Text style={s.small}>Read the facts below, open another question, then check what you learned. Every source link is optional.</Text>
        {trail.sections.map((item, index) => <View key={item.title} style={s.lessonCard}>
          <Pressable testID={'safe-curiosity-lesson-'+index} accessibilityRole="button"
            accessibilityLabel={item.title} accessibilityState={{expanded: !!openSections[index]}}
            onPress={() => setOpenSections(old => ({...old, [index]: !old[index]}))}
            style={({pressed}) => [s.lessonPress, pressed && s.pressed]}>
            <Text style={s.lessonTitle}>{index + 1}. {item.title} {openSections[index] ? '−' : '+'}</Text>
          </Pressable>
          {!!openSections[index] && <Text testID={'safe-curiosity-lesson-body-'+index} style={s.body}>{item.body}</Text>}
        </View>)}
        {trail.followups.length > 0 && <View style={s.lessonCard}>
          <Text accessibilityRole="header" style={s.heading}>What else would you like to know?</Text>
          {trail.followups.map((item,index) => <View key={item.question}>
            <Button id={'safe-curiosity-followup-'+index} label={item.question}
              selected={followup === index} onPress={() => setFollowup(followup === index ? -1 : index)}/>
            {followup === index && <Text testID="safe-curiosity-followup-answer" style={s.body}>{item.answer}</Text>}
          </View>)}
        </View>}
        {trail.quiz && <View style={s.lessonCard} testID="safe-curiosity-knowledge-check">
          <Text accessibilityRole="header" style={s.heading}>Check what you've learned</Text>
          <Text style={s.body}>{trail.quiz.question}</Text>
          {trail.quiz.choices.map((option,index) => <Button key={option} id={'safe-curiosity-quiz-'+index}
            label={option} selected={quizChoice === index} onPress={() => setQuizChoice(index)}/>)}
          {quizChoice !== null && <View testID="safe-curiosity-quiz-feedback" accessibilityLiveRegion="polite">
            <Text style={s.feedback}>{quizChoice === trail.quiz.correct ? 'That matches the learning!' : 'Try another answer or review the explanation.'}</Text>
            <Text style={s.body}>{trail.quiz.explanation}</Text>
          </View>}
        </View>}
        <View style={s.lessonCard}>
          <Text accessibilityRole="header" style={s.heading}>Check the original sources</Text>
          {trail.sources.length === 0
            ? <Text style={s.body}>This general research method does not verify the topic you entered. Ask a trusted educator or librarian where to start.</Text>
            : trail.sources.map((source,index) => <View key={source.url} style={s.source}>
              <Text style={s.body}>{source.title}</Text>
              <Text style={s.small}>{source.author} · External website</Text>
              <Button id={'safe-curiosity-source-'+index} label={'Read original source: ' + source.title} onPress={() => openSource(source)}/>
              {failedSource === source.url && <Text selectable style={s.small}>Could not open that website. Copy this address to try in a browser: {source.url}</Text>}
            </View>)}
          <Text style={s.small}>Sources were reviewed for this draft on 19 October 2026. Their content may change. Opening a source leaves the app and follows that website's privacy policy.</Text>
          <Text style={s.small}>{trail.review}</Text>
        </View>
      </View>}
    </View>}

    {!knowledgeView && <View style={s.notice}>
      <Text style={s.heading}>How this could grow into your chip idea</Text>
      <Text style={s.body}>1. Test these learning and safeguarding examples with adults and child-safety experts.</Text>
      <Text style={s.body}>2. Build an opt-in, privacy-preserving browser prototype that checks permitted website content.</Text>
      <Text style={s.body}>3. Investigate on-device AI on existing phone chips. A purpose-built hardware chip comes much later, if justified.</Text>
      <Text style={s.small}>Real protection would require extensive accuracy, safeguarding, accessibility and cultural reviews, plus support from browsers and operating systems.</Text>
    </View>}
    <Text style={s.footer}>Educational research prototype only · Not proof that harmful internet content is blocked, not a diagnosis and not an emergency service.</Text>
  </View>;
}

const s = StyleSheet.create({
  root: {paddingBottom: 36},
  scenicHero:{overflow:'hidden',borderRadius:20,borderColor:P.line,borderWidth:1,marginTop:10,marginBottom:20},
  heroOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,paddingHorizontal:17,paddingVertical:13,backgroundColor:'rgba(2,17,19,.22)',alignItems:'center'},
  heroEmblem:{fontSize:26,color:P.gold},
  heroHeading:{fontSize:29,lineHeight:36,fontFamily:'ESSHeading',color:'#FFF0CE',textShadowRadius:5,textShadowColor:'#031C20',textAlign:'center'},
  heroPill:{fontSize:13,lineHeight:20,color:P.gold,borderColor:P.gold,borderWidth:1,borderRadius:18,paddingHorizontal:13,paddingVertical:3,marginTop:5,overflow:'hidden',backgroundColor:'#183F35'},
  heroDescription:{fontSize:15,lineHeight:23,color:P.text,textAlign:'center',marginTop:10,textShadowColor:'#031C20',textShadowRadius:8},
  resultHeading:{fontSize:22,lineHeight:31,fontFamily:'ESSHeading',color:P.text,marginVertical:12},
  knowledgeTitle:{flexDirection:'row',gap:10,alignItems:'center',paddingTop:9,flexWrap:'wrap'},
  eyebrow: {fontSize: 13, lineHeight: 21, color: P.gold, marginTop: 13, marginBottom: 8, letterSpacing: 0.3},
  title: {fontSize: 25, lineHeight: 34, color: P.text, fontFamily: "ESSHeading", marginBottom: 10},
  heading: {fontSize: 21, lineHeight: 31, color: P.text, fontFamily:'ESSHeading', marginTop: 16, marginBottom: 9},
  lead: {fontSize: 17, lineHeight: 27, color: P.muted, marginBottom: 18},
  body: {fontSize: 16, lineHeight: 25, color: P.text, marginBottom: 10},
  small: {fontSize: 13, lineHeight: 21, color: P.muted, marginBottom: 12},
  notice: {padding: 18, backgroundColor: P.panel, borderRadius: 18, borderColor: P.line, borderWidth: 1, marginVertical: 13},
  choices: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16},
  button: {backgroundColor: '#113935', borderWidth: 1, borderColor: '#917B51', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, minHeight: 52, justifyContent: 'center', marginBottom: 10},
  buttonLabel: {color: P.text, fontSize: 15, lineHeight: 23},
  primary: {backgroundColor: P.gold, borderColor: '#FFE7AB'},
  dark: {color: P.bg, fontWeight: '700'},
  pressed: {opacity: 0.75}, disabled: {opacity: 0.4},
  fieldLabel: {fontSize: 14, lineHeight: 22, fontWeight: '700', color: P.gold, marginTop: 12, marginBottom: 8},
  input: {backgroundColor: P.panel, color: P.text, borderColor: P.line, borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 16, lineHeight: 24, minHeight: 110, marginBottom: 8},
  result: {borderWidth: 1.5, borderColor: P.gold, borderRadius: 20, backgroundColor: P.panel, padding: 18, marginVertical: 18},
  footer: {fontSize: 13, lineHeight: 21, color: P.muted, marginTop: 16},
  knowledge: {marginTop: 16, gap: 6},
  lessonCard: {backgroundColor: P.panel2, borderRadius: 14, borderWidth: 1, borderColor: P.line, padding: 14, marginVertical: 7},
  lessonPress: {minHeight: 46, justifyContent: 'center'},
  lessonTitle: {fontSize: 17, lineHeight: 26, color: P.gold, fontWeight: '700'},
  source: {borderTopColor: P.line, borderTopWidth: 1, paddingTop: 11, marginTop: 9},
  feedback: {fontSize: 16, lineHeight: 25, color: P.gold, marginBottom: 8},
});


// UNIFIED_THEME_V4
Object.assign(s,presentationStyles(s));
