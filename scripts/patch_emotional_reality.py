from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

new_analyse = r'''function analyse({age,text,relationship,feeling}) {
  const t=(text||'').toLowerCase();
  const child = age === '10–12' || age === '13–15';
  const youngChild = age === '10–12';

  // --- Observable event/context signals ---
  const capacityAbsent = has(t,['asleep','sleeping','unconscious','passed out','blacked out','sedated','incapacitated']);
  const sexualContact = has(t,['sex with me','had sex','sexual contact','touched me sexually','sexual assault','penetrat']);
  const force = has(t,['forced','held me down','restrained','wouldn\'t let me leave','would not let me leave']);
  const manipulation = has(t,['manipulat','emotionally abused','emotional abuse','gaslight','guilt trip','guilt-tripped','punished me','silent treatment','made me feel guilty']);
  const threatControl = has(t,['threatened','threat','control','controlled','blackmail','if you leave','if you loved me','made me afraid']);
  const repetition = has(t,['keeps happening','kept happening','again and again','repeated','every time','always does this']);

  const boundaryWords = has(t,['said no','said stop','not comfortable','leave me alone','ignored','wouldn’t stop',"wouldn't stop",'kept going','crossed my boundary','without asking','without permission']);
  const respectedBoundary = has(t,['stopped when i said no','stopped when i said stop','respected my boundary','asked and stopped']);
  const pressureWords = has(t,['kept asking','pressured','pressure','guilt','threat','forced','made me',"wouldn't take no",'begged','coerce','coerc','manipulat','emotionally abused','emotional abuse']);
  const secrecy = has(t,['secret',"don't tell",'dont tell','keep this between','hide it','nobody can know','keep quiet']);
  const dependency = has(t,["can't leave",'cant leave','depend','nowhere else','money','housing','only person','need them','financially dependent','rely on them']);
  const authorityPower = relationship === 'Authority / older person' || has(t,['teacher','coach','boss','manager','carer','doctor','counsellor','older adult','parent']);
  const familyContext = relationship === 'Family';

  // Capacity is not an emotion. It is a critical condition for meaningful choice.
  const criticalCapacityViolation = capacityAbsent && sexualContact;

  const boundary = !respectedBoundary && (boundaryWords || force || criticalCapacityViolation);
  const pressure = pressureWords || manipulation || force || threatControl || criticalCapacityViolation;
  const power = authorityPower || threatControl || manipulation || (familyContext && sexualContact);
  const choiceReduced = criticalCapacityViolation || force || manipulation || threatControl ||
    has(t,['no choice','had to',"couldn't say no",'couldnt say no','afraid to say no','scared to refuse']) || feeling === 'Scared';

  // Risk scores for the six observable signals. Higher = more concern.
  const score = {
    choice: criticalCapacityViolation ? 100 : choiceReduced ? 78 : manipulation ? 62 : 20,
    boundary: criticalCapacityViolation ? 100 : respectedBoundary ? 12 : boundary ? 82 : manipulation ? 52 : 22,
    pressure: criticalCapacityViolation ? 88 : force ? 95 : threatControl ? 88 : manipulation ? 78 : pressure ? 72 : 18,
    power: authorityPower ? 82 : (familyContext && sexualContact) ? 72 : (manipulation || threatControl) ? 62 : 22,
    dependency: dependency ? 76 : familyContext ? 32 : 18,
    secrecy: secrecy ? 92 : 14
  };

  // --- Emotional reality layer ---
  const fearDistress = feeling === 'Scared' || has(t,['afraid','fear','terrified','panic','unsafe']) ? 85 :
    feeling === 'Worried' ? 65 : manipulation ? 55 : 20;
  const confusion = feeling === 'Confused' || has(t,['confused','don’t understand',"don't understand",'unsure what happened','mixed up']) ? 80 : 20;
  const shameSelfDoubt = has(t,['ashamed','shame','guilty','my fault','blamed myself','self doubt','doubted myself']) ? 78 : manipulation ? 55 : 18;
  const attachmentConflict = (familyContext || relationship === 'Partner / peer') && has(t,['love','still love','care about','loyal','family','son','daughter','mum','mom','dad','partner']) ? 68 : (familyContext ? 52 : 20);
  const agencyLoss = criticalCapacityViolation ? 100 : choiceReduced ? 82 : manipulation ? 66 : 20;
  const isolationDependence = dependency || has(t,['isolated','alone','no one to tell','nowhere to go']) ? 75 : 20;
  const repetitionLoad = repetition ? 78 : 18;
  const protectiveSupport = has(t,['trusted person','support','helped me','safe place','counsellor','reported','told someone']) ? 55 : 10;

  const signalRisk = Math.round((score.choice + score.boundary + score.pressure + score.power + score.dependency + score.secrecy) / 6);
  const emotionalLoad = Math.round(
    agencyLoss*0.24 + fearDistress*0.18 + confusion*0.14 + attachmentConflict*0.14 +
    shameSelfDoubt*0.12 + isolationDependence*0.10 + repetitionLoad*0.08
  );
  const contextRisk = Math.round(
    (criticalCapacityViolation ? 100 : 0)*0.45 +
    (authorityPower ? 85 : familyContext ? 60 : 25)*0.25 +
    (sexualContact ? 70 : 20)*0.15 +
    (repetition ? 75 : 20)*0.15
  );

  let realityScore = Math.round(signalRisk*0.55 + emotionalLoad*0.30 + contextRisk*0.15 - protectiveSupport*0.08);
  if(criticalCapacityViolation) realityScore = Math.max(realityScore, 92); // critical override
  realityScore = Math.max(0, Math.min(100, realityScore));

  const realityLabel = criticalCapacityViolation ? 'Critical safety reality' :
    realityScore >= 75 ? 'High emotional-safety concern' :
    realityScore >= 50 ? 'Elevated emotional-safety concern' :
    realityScore >= 30 ? 'Mixed / needs context' : 'Lower concern in this prototype';

  const emotionalReality = {
    score: realityScore,
    label: realityLabel,
    equation: 'Emotional Reality = Safety Signals × 55% + Emotional Impact × 30% + Context × 15% − Protective Factors. Critical capacity rules override the weighted score.',
    components: [
      `Safety signals: ${signalRisk}/100`,
      `Emotional impact: ${emotionalLoad}/100`,
      `Context: ${contextRisk}/100`,
      `Protective support: ${protectiveSupport}/100`,
      criticalCapacityViolation ? 'Critical override: asleep/unconscious + sexual contact means capacity to consent was absent.' : null
    ].filter(Boolean)
  };

  const critical = criticalCapacityViolation || (!respectedBoundary && boundary && (pressure || secrecy || power));
  const childConcern = child && (sexualContact || boundary || pressure || secrecy || power);
  const high = critical || childConcern || (pressure && secrecy) || realityScore >= 75;
  const elevated = !high && (realityScore >= 40 || boundary || pressure || power || dependency || choiceReduced || ['Confused','Worried','Scared'].includes(feeling));

  const level = high ? 'Safeguarding Concern Identified' : elevated ? 'Safety Concerns Detected' : 'No Major Red Flags Detected';
  const factors=[];
  if(youngChild) factors.push('Child-safety mode is active for age 10–12.');
  else if(child) factors.push('Safeguarding mode is active because a person under 16 is involved.');
  if(criticalCapacityViolation) factors.push('The description indicates sexual contact while someone was asleep or unconscious. Capacity to consent was absent, so this triggers a critical safety override.');
  if(respectedBoundary) factors.push('The description indicates a boundary was respected.');
  else if(boundary) factors.push('A boundary or capacity condition may have been violated.');
  if(manipulation) factors.push('Manipulation or emotional-abuse language increased Pressure, reduced Choice and raised the Power/Control context.');
  if(threatControl) factors.push('Threat or control language raised Pressure and Power/Control.');
  if(force) factors.push('Force or restraint language triggered a high concern signal.');
  if(dependency) factors.push('Dependency may make free decision-making harder.');
  if(secrecy) factors.push('Secrecy language was detected.');
  if(repetition) factors.push('A repeated pattern increases emotional and contextual load.');
  if(!factors.length) factors.push('No strong keyword-based safety signal was detected. Context still matters.');

  const emotion = criticalCapacityViolation ? 'A person can experience shock, confusion, fear, numbness, betrayal or attachment conflict after a situation where capacity was absent. Emotional reactions vary and do not determine whether the event was safe.' :
    high ? 'The pattern may leave someone feeling confused, frightened, ashamed, responsible for another person, or unsure of their own judgement.' :
    elevated ? 'The situation may create uncertainty, stress, self-doubt or pressure. Slowing things down can help restore choice.' :
    'The description does not show strong warning signs in this prototype, but feelings and context still matter.';

  const steps = high ? [
    'Prioritise immediate safety.',
    'Talk with a trusted support person or appropriate professional service.',
    'Keep factual observations separate from interpretations.',
    'Use the Learning Centre to understand capacity, boundaries and power.',
    'Seek urgent help if there is immediate danger.'
  ] : elevated ? [
    'Slow the situation down.',
    'Make room for clear choice and boundaries.',
    'Talk with a trusted support person.',
    'Review the six safety signals and emotional-reality factors.',
    'Seek professional support if concerns continue.'
  ] : [
    'Keep communication clear.',
    'Continue respecting boundaries.',
    'Stay open to how the person feels.',
    'Use the Learning Centre to build safety knowledge.'
  ];
  if(child) steps.unshift('Use child-focused safeguarding support rather than asking the child to solve the situation alone.');

  return {child, high, elevated, level, score, factors, emotion, steps, emotionalReality};
}'''

pattern = re.compile(r"function analyse\(\{age,text,relationship,feeling\}\) \{.*?\n\}\n\nfunction Card", re.S)
if not pattern.search(s):
    raise SystemExit('analyse() function not found')
s = pattern.sub(new_analyse + "\n\nfunction Card", s, count=1)

# Add an Emotional Reality card to the results screen, immediately before See Explanation.
needle = "        <PrimaryButton onPress={()=>go('explanation')}>See Explanation  →</PrimaryButton>"
card = r'''        <Card>
          <Text style={styles.cardTitle}>Emotional Reality</Text>
          <Text style={styles.cardEyebrow}>{result.emotionalReality.label.toUpperCase()}  •  {result.emotionalReality.score}/100</Text>
          <Text style={styles.body}>{result.emotionalReality.equation}</Text>
          <View style={{height:8}} />
          {result.emotionalReality.components.map((x,i)=><Text key={i} style={styles.bullet}>• {x}</Text>)}
        </Card>
        <PrimaryButton onPress={()=>go('explanation')}>See Explanation  →</PrimaryButton>'''
if needle in s and 'result.emotionalReality.label' not in s:
    s = s.replace(needle, card, 1)

# Make explanation explicitly describe the equation layer.
needle2 = "        <View style={styles.infoBox}><Text style={styles.infoText}>AI + EI concept layer: this prototype uses transparent local language rules plus emotional-safety explanations. It is not a diagnosis or professional assessment.</Text></View>"
replace2 = r'''        <Card>
          <Text style={styles.cardEyebrow}>EMOTIONAL REALITY EQUATION</Text>
          <Text style={styles.body}>{result.emotionalReality.equation}</Text>
          {result.emotionalReality.components.map((x,i)=><Text key={i} style={styles.bullet}>• {x}</Text>)}
        </Card>
        <View style={styles.infoBox}><Text style={styles.infoText}>AI + EI concept layer: this prototype uses transparent local language rules plus emotional-safety explanations. The equation is an interpretive safety model, not a diagnosis, legal finding or measure of a person's truthfulness.</Text></View>'''
if needle2 in s:
    s = s.replace(needle2, replace2, 1)

p.write_text(s)
