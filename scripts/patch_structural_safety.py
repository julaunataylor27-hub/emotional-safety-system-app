from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# --- State: clarify whose age is selected and observed emotion separately ---
state_needle = "  const [jurisdiction,setJurisdiction]=useState('Western Australia');"
state_insert = """  const [jurisdiction,setJurisdiction]=useState('Western Australia');
  const [ageFor,setAgeFor]=useState('Unsure');
  const [observedFeeling,setObservedFeeling]=useState('Unknown');"""
if state_needle in s and 'const [ageFor,setAgeFor]' not in s:
    s = s.replace(state_needle, state_insert, 1)

# Pass the new fields to the engine.
s = s.replace(
    "analyse({age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction})",
    "analyse({age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling})",
    1
)

# Extend analyse() signature.
s = s.replace(
    "function analyse({age,text,relationship,feeling,intent='Something that happened to me',bothAdults='Unsure',familyRelation='Unsure',sexualConduct='Unsure',jurisdiction='Western Australia'}) {",
    "function analyse({age,text,relationship,feeling,intent='Something that happened to me',bothAdults='Unsure',familyRelation='Unsure',sexualConduct='Unsure',jurisdiction='Western Australia',ageFor='Unsure',observedFeeling='Unknown'}) {",
    1
)

# Add input-mode and fact/conflict extraction after closeFamily is calculated.
fact_needle = "  const closeFamily = parentChild || siblings;"
fact_insert = r'''  const closeFamily = parentChild || siblings;
  const observedMode = intent === 'Something I witnessed / was told';
  const patternMode = intent === 'A relationship pattern';
  const inferredParentChild = parentWords && childWords;
  const inferredFamily = inferredParentChild || siblingWords;
  const inferredRelationship = inferredParentChild ? 'Parent ↔ child' : siblingWords ? 'Siblings' : null;
  const relationshipConflict = inferredFamily && relationship !== 'Family';
  const inputConflicts = relationshipConflict ? [
    `The words entered suggest ${inferredRelationship || 'a family relationship'}, but the selected relationship is “${relationship}”. For safety, the family relationship is used for structural checks.`
  ] : [];
  const effectiveFeeling = observedMode ? observedFeeling : feeling;
  const selectedChildAge = age === '10–12' || age === '13–15';
  const ageLikelyBelongsToChild = selectedChildAge && inferredParentChild && (ageFor === 'Child involved' || ageFor === 'Unsure');'''
if fact_needle in s and 'const observedMode' not in s:
    s = s.replace(fact_needle, fact_insert, 1)

# Broaden sex-language detection slightly.
s = s.replace(
    "const sexLanguage = has(t,['have sex','had sex','sex with','sexual relationship','sexual contact']);",
    "const sexLanguage = has(t,['have sex','has sex','having sex','had sex','sex with','sexual relationship','sexual contact']);",
    1
)

# Use observed emotion rather than the user's own feeling in witness mode.
s = s.replace("feeling === 'Scared'", "effectiveFeeling === 'Scared'")
s = s.replace("feeling === 'Worried'", "effectiveFeeling === 'Worried'")
s = s.replace("feeling === 'Confused'", "effectiveFeeling === 'Confused'")
s = s.replace("['Confused','Worried','Scared'].includes(feeling)", "['Confused','Worried','Scared'].includes(effectiveFeeling)")

# Add a structural layer after sexualContext exists, before legal context.
struct_needle = "  const sexualContext = likelyPenetration || otherSexualSelected || sexLanguage;"
struct_insert = r'''  const sexualContext = likelyPenetration || otherSexualSelected || sexLanguage;

  // --- Structural Safety layer ---
  // This layer answers: are there facts that are concerning regardless of a person's reported emotion?
  const parentChildChildSexual = inferredParentChild && selectedChildAge && sexualContext;
  const structuralCritical = parentChildChildSexual;
  const structuralSafety = structuralCritical ? {
    level:'critical',
    title:'Critical structural safeguarding concern',
    summary:'The description indicates sexual conduct involving a parent and a child in the selected 10–15 age range. Consent wording does not remove the child-safeguarding concern. In Western Australia, Criminal Code s 329 contains offences involving sexual penetration and other sexual conduct with a child known to be a lineal relative or de facto child. The app does not determine guilt or the exact offence.',
    reasons:[
      'Parent ↔ child relationship detected from the words entered.',
      `Child age range detected: ${age}.`,
      ageLikelyBelongsToChild ? 'The selected child age was interpreted as referring to the son/daughter because the text identifies a parent-child relationship.' : 'The selected age needs confirmation about whose age it is.',
      'Sexual conduct was described.'
    ],
    source:'WA Criminal Code s 329 — relatives and the like, sexual offences'
  } : inferredParentChild && sexualContext ? {
    level:'warning',
    title:'Parent/child structural safety check',
    summary:'A parent-child sexual context was detected. The app needs clear ages and conduct details before making a more specific legal-information statement, but it should not treat missing pressure or secrecy information as proof of safety.',
    reasons:['Parent ↔ child relationship detected.','Sexual context detected.','Age or conduct detail still needs clarification.'],
    source:'WA Criminal Code s 329'
  } : {
    level:'info',
    title:'No structural override triggered',
    summary:'No critical structural rule was triggered by the facts currently entered. Unknown information remains unknown rather than being treated as low concern.',
    reasons:[],
    source:null
  };'''
if struct_needle in s and 'const structuralSafety' not in s:
    s = s.replace(struct_needle, struct_insert, 1)

# Structural critical must feed the existing high/safeguarding override.
s = s.replace(
    "const critical = legalCritical || criticalCapacityViolation ||",
    "const critical = structuralCritical || legalCritical || criticalCapacityViolation ||",
    1
)

# Make emotionalReality mutable so witness mode can suppress a fake score.
s = s.replace("  const emotionalReality = questionMode ? {", "  let emotionalReality = questionMode ? {", 1)

# Insert witness-mode emotional suppression before legalCritical is calculated.
emotion_override_needle = "  const legalCritical = questionMode && legalContext.level === 'critical';"
emotion_override = r'''  if(observedMode && observedFeeling === 'Unknown'){
    emotionalReality = {
      score:null,
      label:'Not enough emotional information to score',
      equation:'The app will not invent an internal emotional state from an observation. Structural safety and legal/safeguarding rules are evaluated separately and can still be critical.',
      components:['Input type: Something I witnessed / was told','Observed emotional response: Unknown','Structural safety is not reduced because emotional information is missing.']
    };
  }

  const legalCritical = questionMode && legalContext.level === 'critical';'''
if emotion_override_needle in s and 'Observed emotional response: Unknown' not in s:
    s = s.replace(emotion_override_needle, emotion_override, 1)

# Add signal-display states: Unknown is different from Low.
# Insert immediately after score/question-mode score construction and before Emotional Reality layer.
signal_needle = "  // --- Emotional reality layer ---"
signal_insert = r'''  // --- Display states for the six signals ---
  // Missing evidence is Unknown, not Low. Low requires affirmative protective information.
  const explicitChoiceSafe = consentStated && bothAdults !== 'No' && !choiceReduced && !structuralCritical;
  const explicitNoPressure = has(t,['no pressure','was not pressured','wasn\'t pressured','without pressure']);
  const explicitNoSecrecy = has(t,['not a secret','no secrecy','openly discussed']);
  const peerContext = relationship === 'Partner / peer' && !inferredFamily && !authorityPower;

  let signalDisplay = {
    choice: structuralCritical ? {value:100,status:'Critical'} : choiceReduced ? {value:score.choice,status:'High Risk'} : explicitChoiceSafe ? {value:20,status:'Low'} : {value:null,status:'Unknown'},
    boundary: structuralCritical ? {value:100,status:'Critical'} : boundary ? {value:score.boundary,status:'High Risk'} : respectedBoundary ? {value:12,status:'Low'} : {value:null,status:'Unknown'},
    pressure: pressure ? {value:score.pressure,status:score.pressure>=70?'High Risk':'Moderate'} : explicitNoPressure ? {value:15,status:'Low'} : {value:null,status:'Unknown'},
    power: structuralCritical ? {value:100,status:'Critical'} : power ? {value:score.power,status:score.power>=70?'High Risk':'Moderate'} : peerContext ? {value:20,status:'Low'} : {value:null,status:'Unknown'},
    dependency: structuralCritical ? {value:82,status:'High Risk'} : dependency ? {value:score.dependency,status:'High Risk'} : {value:null,status:'Unknown'},
    secrecy: secrecy ? {value:score.secrecy,status:'High Risk'} : explicitNoSecrecy ? {value:14,status:'Low'} : {value:null,status:'Unknown'}
  };

  // --- Emotional reality layer ---'''
if signal_needle in s and 'let signalDisplay' not in s:
    s = s.replace(signal_needle, signal_insert, 1)

# Ensure return object includes new layers.
s = re.sub(
    r"return \{child, high, elevated, level, score, factors, emotion, steps, emotionalReality, questionMode, resolvedIntent, legalContext\};",
    "return {child, high, elevated, level, score, signalDisplay, factors, emotion, steps, emotionalReality, questionMode, resolvedIntent, legalContext, structuralSafety, inputConflicts};",
    s,
    count=1
)

# Upgrade SignalRow to support Unknown/Critical labels.
signal_func = re.compile(r"function SignalRow\(\{kind,value\}\)\{.*?\n\}", re.S)
signal_func_replacement = r'''function SignalRow({kind,value,status}){
  const unknown = status === 'Unknown' || value === null || value === undefined;
  const color = unknown ? '#8196A3' : status === 'Critical' ? C.red : value>=70 ? C.red : value>=45 ? C.yellow : C.green;
  const label = status || (value>=70?'High Risk':value>=45?'Moderate':'Low');
  const width = unknown ? '0%' : `${Math.max(5,value)}%`;
  return <View style={styles.signalRow}>
    <View style={[styles.signalIcon,{backgroundColor:color}]}><Text style={styles.signalIconText}>{signalIcons[kind]}</Text></View>
    <Text style={styles.signalName}>{signalNames[kind]}</Text>
    <View style={styles.meter}><View style={[styles.meterFill,{width,backgroundColor:color}]} /></View>
    <View style={[styles.riskPill,{borderColor:color}]}><Text style={[styles.riskText,{color}]}>{label}</Text></View>
  </View>;
}'''
if signal_func.search(s) and 'const unknown = status' not in s:
    s = signal_func.sub(signal_func_replacement, s, count=1)

# Results: structural safety + conflict cards and use signalDisplay rather than raw numeric score.
results_map = "{Object.entries(result.score).map(([k,v])=><SignalRow key={k} kind={k} value={v}/>)}"
results_map_new = "{Object.entries(result.signalDisplay).map(([k,v])=><SignalRow key={k} kind={k} value={v.value} status={v.status}/>)}"
s = s.replace(results_map, results_map_new, 1)

signals_card_needle = "        <Card>\n          <Text style={styles.cardTitle}>{result.questionMode?'Six Safety Signals — context only':'Six Safety Signals'}</Text>"
structural_cards = r'''        {result.inputConflicts.length>0&&<Card style={{borderColor:C.yellow}}>
          <Text style={styles.cardEyebrow}>⚠  INPUT CONFLICT DETECTED</Text>
          {result.inputConflicts.map((x,i)=><Text key={i} style={styles.bullet}>• {x}</Text>)}
          <Text style={styles.body}>The app used the safer inferred relationship for structural checks. Go back and correct the selection if needed.</Text>
          <PrimaryButton color={C.yellow} onPress={()=>go('assessment')}>Review My Answers  →</PrimaryButton>
        </Card>}
        <Card style={{borderColor:result.structuralSafety.level==='critical'?C.red:result.structuralSafety.level==='warning'?C.yellow:C.line}}>
          <Text style={styles.cardEyebrow}>STRUCTURAL SAFETY</Text>
          <Text style={styles.cardTitle}>{result.structuralSafety.title}</Text>
          <Text style={styles.body}>{result.structuralSafety.summary}</Text>
          {result.structuralSafety.reasons.map((x,i)=><Text key={i} style={styles.bullet}>• {x}</Text>)}
          {result.structuralSafety.source?<Text style={styles.bullet}>• Source framework: {result.structuralSafety.source}</Text>:null}
        </Card>
        <Card>
          <Text style={styles.cardTitle}>{result.questionMode?'Six Safety Signals — context only':'Six Safety Signals'}</Text>'''
if signals_card_needle in s and 'INPUT CONFLICT DETECTED' not in s:
    s = s.replace(signals_card_needle, structural_cards, 1)

# Emotional Reality result display: handle null score for witness/question mode.
s = s.replace(
    "<Text style={styles.cardEyebrow}>{result.emotionalReality.label.toUpperCase()}  •  {result.emotionalReality.score}/100</Text>",
    "<Text style={styles.cardEyebrow}>{result.emotionalReality.label.toUpperCase()}{result.emotionalReality.score===null?'':`  •  ${result.emotionalReality.score}/100`}</Text>",
    1
)

# Assessment: clarify whose age is selected for lived/observed/pattern inputs.
age_section = """            <Text style={styles.label}>Age range <Text style={styles.labelSoft}>(optional)</Text></Text>
            <View style={styles.wrap}>{['10–12','13–15','16+','Unsure'].map(x=><SmallPill key={x} active={age===x} onPress={()=>setAge(x)}>{x}</SmallPill>)}</View>"""
age_section_new = """            <Text style={styles.label}>Age range <Text style={styles.labelSoft}>(optional)</Text></Text>
            <View style={styles.wrap}>{['10–12','13–15','16+','Unsure'].map(x=><SmallPill key={x} active={age===x} onPress={()=>setAge(x)}>{x}</SmallPill>)}</View>
            {age!=='Unsure'&&<>
              <Text style={styles.label}>Whose age is this?</Text>
              <View style={styles.wrap}>{['Person affected','Other person','Child involved','Unsure'].map(x=><SmallPill key={x} active={ageFor===x} onPress={()=>setAgeFor(x)}>{x}</SmallPill>)}</View>
            </>}"""
if age_section in s and 'Whose age is this?' not in s:
    s = s.replace(age_section, age_section_new, 1)

# Witness mode: do not ask how the user felt; optionally capture only observed emotion.
feeling_marker = "{intent!=='A question / hypothetical'&&<>\n            <Text style={styles.label}>How did you feel?"
if feeling_marker in s:
    s = s.replace(feeling_marker, "{!['A question / hypothetical','Something I witnessed / was told'].includes(intent)&&<>\n            <Text style={styles.label}>How did you feel?", 1)

privacy_needle = "          <View style={styles.infoBox}><Text style={styles.infoText}>Privacy-first prototype: your description is analysed on this device and is not sent to a remote AI service.</Text></View>"
witness_ui = r'''          {intent==='Something I witnessed / was told'&&<>
            <Text style={styles.label}>Did you observe how the person seemed? <Text style={styles.labelSoft}>(optional)</Text></Text>
            <View style={styles.wrap}>{['Unknown','Distressed','Confused','Scared','Calm'].map(x=><SmallPill key={x} active={observedFeeling===x} onPress={()=>setObservedFeeling(x)}>{x}</SmallPill>)}</View>
            <View style={styles.infoBox}><Text style={styles.infoText}>If you do not know their emotional state, choose Unknown. The app will not invent one. Structural safeguarding rules still apply.</Text></View>
          </>}
          <View style={styles.infoBox}><Text style={styles.infoText}>Privacy-first prototype: your description is analysed on this device and is not sent to a remote AI service.</Text></View>'''
if privacy_needle in s and 'Did you observe how the person seemed?' not in s:
    s = s.replace(privacy_needle, witness_ui, 1)

# Validate markers inside this patch before writing.
required = [
    'Whose age is this?',
    'INPUT CONFLICT DETECTED',
    'STRUCTURAL SAFETY',
    "status:'Unknown'",
    'Not enough emotional information to score',
    'Critical structural safeguarding concern',
    'Did you observe how the person seemed?'
]
missing = [x for x in required if x not in s]
if missing:
    raise SystemExit('Structural safety patch failed: ' + ', '.join(missing))

p.write_text(s)
