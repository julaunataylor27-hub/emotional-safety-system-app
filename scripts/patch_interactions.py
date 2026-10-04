from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# --- Upgrade the local safety engine ---
new_analyse = r'''function analyse({age,text,relationship,feeling}) {
  const child = age === '10–12' || age === '13–15';
  const youngChild = age === '10–12';

  const explicitBoundary = has(text,[
    'said no','said stop','not comfortable','leave me alone','ignored','wouldn’t stop',"wouldn't stop",
    'kept going','crossed my boundary','punished me for saying no','punished for saying no'
  ]);
  const respectedBoundary = has(text,[
    'stopped when i said no','stopped when i said stop','respected my boundary','asked and stopped'
  ]);

  const directPressure = has(text,[
    'kept asking','pressured','pressure','guilt-tripped','guilt tripped','guilted me','threatened me','threat',
    'forced','made me',"wouldn't take no",'begged','coerce','coerc','punished me','punished for saying no'
  ]);
  const manipulation = has(text,[
    'manipulated me','manipulate me','manipulation','emotionally manipulated','emotional manipulation',
    'gaslight','gaslit','used my feelings against me','played with my emotions'
  ]);
  const emotionalAbuse = has(text,[
    'emotionally abused','emotional abuse','verbally abused','verbal abuse','degraded me','humiliated me'
  ]);
  const jealousyControl = has(text,[
    'controlling who i see','controlled who i see','wouldn’t let me see',"wouldn't let me see",
    'isolated me','tried to isolate me','possessive','jealous and controlling'
  ]);
  const relationshipThreat = has(text,[
    'threatened to leave','leave me unless','break up with me unless','dump me unless','take the kids unless'
  ]);

  const secrecy = has(text,['secret',"don't tell",'dont tell','keep this between','hide it','nobody can know']);
  const dependencyStrong = has(text,["can't leave",'cant leave','depend on them','financially dependent','nowhere else','housing','only person i have','need them to survive']);
  const authorityPower = relationship === 'Authority / older person' || has(text,['teacher','coach','boss','manager','carer','doctor','counsellor','older adult','parent']);

  const pressure = directPressure || manipulation || emotionalAbuse || relationshipThreat;
  const boundary = explicitBoundary || (!respectedBoundary && (manipulation || emotionalAbuse));
  const powerControl = authorityPower || jealousyControl || manipulation || emotionalAbuse;
  const choiceReduced = has(text,['no choice','had to',"couldn't say no",'couldnt say no','afraid to say no','scared to refuse']) || directPressure || manipulation || relationshipThreat || feeling === 'Scared';

  const score = {
    choice: choiceReduced ? (directPressure ? 84 : 62) : 20,
    boundary: respectedBoundary ? 12 : explicitBoundary ? 90 : (manipulation || emotionalAbuse) ? 52 : 22,
    pressure: directPressure ? 92 : (manipulation && emotionalAbuse) ? 82 : manipulation ? 76 : emotionalAbuse ? 68 : relationshipThreat ? 74 : 18,
    power: authorityPower ? 68 : jealousyControl ? 78 : (manipulation || emotionalAbuse) ? 55 : 22,
    dependency: dependencyStrong ? 78 : relationshipThreat ? 46 : 18,
    secrecy: secrecy ? 94 : 14
  };

  const critical = !respectedBoundary && explicitBoundary && (directPressure || secrecy || authorityPower);
  const childConcern = child && !respectedBoundary && (explicitBoundary || directPressure || secrecy || authorityPower || manipulation || emotionalAbuse);
  const high = critical || childConcern || (directPressure && secrecy);
  const elevated = !high && (boundary || pressure || powerControl || dependencyStrong || choiceReduced || ['Confused','Worried','Scared'].includes(feeling));

  const level = high ? 'Safeguarding Concern Identified' : elevated ? 'Safety Concerns Detected' : 'No Major Red Flags Detected';
  const factors=[];
  if(youngChild) factors.push('Child-safety mode is active for age 10–12.');
  else if(child) factors.push('Safeguarding mode is active because a person under 16 is involved.');

  if(respectedBoundary) factors.push('The description indicates a boundary was respected.');
  else if(explicitBoundary) factors.push('An explicit boundary or refusal may have been ignored or punished.');
  else if(manipulation || emotionalAbuse) factors.push('Manipulation or emotional abuse can strain boundaries even when no specific boundary was described.');

  if(directPressure) factors.push('Direct pressure, persistence, guilt, threats or punishment language was detected.');
  else if(manipulation && emotionalAbuse) factors.push('Emotional abuse + manipulation strongly increases the Pressure signal.');
  else if(manipulation) factors.push('Manipulation language increases Pressure and can reduce free Choice.');
  else if(emotionalAbuse) factors.push('Emotional abuse language raises concern about pressure and emotional safety.');

  if(authorityPower) factors.push('A structural power or authority difference may be present.');
  else if(jealousyControl) factors.push('Controlling or isolating behaviour increases the Power/Control signal.');
  else if(manipulation || emotionalAbuse) factors.push('Manipulation or emotional abuse can create an interpersonal power imbalance; more context is still needed.');

  if(dependencyStrong) factors.push('Strong dependency may make it harder to disagree, leave or seek help.');
  else if(relationshipThreat) factors.push('A threat to end or withdraw the relationship may create dependency pressure.');

  if(secrecy) factors.push('Secrecy language was detected.');
  if(choiceReduced) factors.push('Choice may have been reduced by pressure, manipulation, fear or lack of options.');
  if(!factors.length) factors.push('No strong keyword-based safety signal was detected. Context still matters.');

  const emotion = high ? 'The pattern may leave someone feeling confused, frightened, ashamed, responsible for another person, or unsure of their own judgement.'
    : elevated ? 'The situation may create uncertainty, stress, self-doubt or pressure. Manipulation and emotional abuse can make it harder to trust your own judgement or feel free to choose.'
    : 'The description does not show strong warning signs in this prototype, but feelings and context still matter.';

  const steps = high ? [
    'Ensure immediate safety.',
    'Talk to a trusted adult or support service.',
    'Consider professional safeguarding support.',
    'Learn more about healthy boundaries.',
    'Keep factual notes separate from interpretations.'
  ] : elevated ? [
    'Slow the situation down.',
    'Make room for clear choice and boundaries.',
    'Notice whether guilt, fear, jealousy or manipulation is affecting decisions.',
    'Talk with a trusted support person.',
    'Seek professional support if concerns continue.'
  ] : [
    'Keep communication clear.',
    'Continue respecting boundaries.',
    'Stay open to how the person feels.',
    'Use the Learning Centre to build safety knowledge.'
  ];
  if(child) steps.unshift('Use child-focused safeguarding support rather than asking the child to solve the situation alone.');

  return {child, high, elevated, level, score, factors, emotion, steps};
}'''

s, count = re.subn(r"function analyse\(\{age,text,relationship,feeling\}\) \{.*?\n\}\n\nfunction Card", new_analyse + "\n\nfunction Card", s, count=1, flags=re.S)
if count != 1:
    raise SystemExit('Could not replace analyse() safely')

# --- Keep the previously added interactive Learning/About pages ---
s = s.replace(
    "  const [journalText,setJournalText]=useState('');\n  const spin=useRef(new Animated.Value(0)).current;",
    "  const [journalText,setJournalText]=useState('');\n  const [selectedTopic,setSelectedTopic]=useState(null);\n  const spin=useRef(new Animated.Value(0)).current;"
)

s = s.replace(
    "  const startAnalysis=()=>go('analysis');",
    "  const startAnalysis=()=>go('analysis');\n  const openTopic=(title,sub,back='learn')=>{setSelectedTopic({title,sub,back});go('topic');};"
)

s = s.replace(
    "onPress={()=>{}} accent={C.gold}",
    "onPress={()=>openTopic(title,sub,'learn')} accent={C.gold}"
)

s = s.replace(
    "onPress={t==='How It Works'?()=>go('flow'):undefined}",
    "onPress={()=>{if(t==='How It Works')go('flow');else if(t==='Evidence & Research')go('learn');else openTopic(t,s,'about');}}"
)

marker = "      {screen==='support'&&<>"
topic_screen = r'''      {screen==='topic'&&selectedTopic&&<>
        <BackTitle title={selectedTopic.title} onBack={()=>go(selectedTopic.back||'learn')} />
        <Card>
          <Text style={styles.cardTitle}>{selectedTopic.title}</Text>
          <Text style={styles.body}>{selectedTopic.sub}</Text>
        </Card>
        <Card>
          <Text style={styles.cardEyebrow}>WHAT THIS MEANS</Text>
          <Text style={styles.body}>{
            selectedTopic.title.includes('Consent') ? 'Consent depends on free choice, understanding, and the ability to stop or change your mind. Pressure, fear, manipulation or punishment can reduce freedom to choose.' :
            selectedTopic.title.includes('Boundar') ? 'Boundaries are limits that protect a person’s body, privacy, emotions, time and values. Healthy relationships notice boundaries and respond safely when someone says no, stop, or I am not comfortable.' :
            selectedTopic.title.includes('Pressure') ? 'Pressure can include repeated asking, guilt, threats, urgency, manipulation or emotional leverage. The key question is whether the person still has a real and safe option to say no.' :
            selectedTopic.title.includes('Power') ? 'Age, authority, money, housing, caregiving, isolation or emotional control can affect how freely someone can disagree or leave.' :
            selectedTopic.title.includes('Emotions') ? 'Feelings such as fear, confusion, shame and self-doubt are not proof by themselves, but they can show emotional strain and can make it harder to think clearly or ask for help.' :
            selectedTopic.title.includes('Relationships') ? 'Healthy relationships allow honesty, independent feelings, clear boundaries and repair after mistakes. Respect means another person does not have to agree just to keep the peace.' :
            selectedTopic.title.includes('Child') ? 'Children are still developing judgement and emotional regulation. Adults carry the safeguarding responsibility and should use age-appropriate language, clear boundaries and appropriate support pathways.' :
            selectedTopic.title.includes('Cultural') ? 'Culture, identity, belonging, trusted community and Country can strengthen emotional safety. Cultural context should be respected without being used to excuse coercion, secrecy or harm.' :
            selectedTopic.title.includes('Purpose') ? 'The purpose of the Emotional Safety System is to make safety signals easier to understand while keeping human emotion, culture, choice and support at the centre.' :
            selectedTopic.title.includes('Six Signals') ? 'The six signals are Choice, Boundaries, Pressure, Power, Dependency and Secrecy. They are considered together, while critical safeguarding concerns are not averaged away.' :
            'This part of the system is designed to turn complex situations into clear, understandable safety information without making a diagnosis or legal finding.'
          }</Text>
        </Card>
        <Card>
          <Text style={styles.cardEyebrow}>KEY IDEAS</Text>
          <Text style={styles.bullet}>• Safety should increase choice, clarity and support.</Text>
          <Text style={styles.bullet}>• A person’s boundaries deserve respect.</Text>
          <Text style={styles.bullet}>• Pressure, manipulation, secrecy and power differences deserve careful attention.</Text>
          <Text style={styles.bullet}>• For children, safeguarding comes before scoring or interpretation.</Text>
        </Card>
        <PrimaryButton onPress={()=>go(selectedTopic.back||'learn')}>←  Back</PrimaryButton>
      </>}

'''
if marker in s and "screen==='topic'" not in s:
    s = s.replace(marker, topic_screen + marker)

# Build-time sanity checks for the exact bug reported by the user.
for required in [
    "emotionally abused", "manipulated me", "Manipulation language increases Pressure",
    "score = {", "pressure: directPressure ? 92"
]:
    if required not in s:
        raise SystemExit(f'Missing expected upgraded safety-engine content: {required}')

p.write_text(s)
