from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# Add state for intent routing and legal-question details.
state_needle = "  const [journalText,setJournalText]=useState('');"
state_insert = """  const [journalText,setJournalText]=useState('');
  const [intent,setIntent]=useState('Something that happened to me');
  const [bothAdults,setBothAdults]=useState('Unsure');
  const [familyRelation,setFamilyRelation]=useState('Unsure');
  const [sexualConduct,setSexualConduct]=useState('Unsure');
  const [jurisdiction,setJurisdiction]=useState('Western Australia');"""
if state_needle in s and "const [intent,setIntent]" not in s:
    s = s.replace(state_needle, state_insert, 1)

# Route support-only intent directly to support and pass legal-question fields into analysis.
s = s.replace(
    "      const r=analyse({age,text:scenario,relationship,feeling});",
    "      const r=analyse({age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction});",
    1
)
s = s.replace(
    "  const startAnalysis=()=>go('analysis');",
    "  const startAnalysis=()=>{ if(intent==='I just need support') go('support'); else go('analysis'); };",
    1
)

new_analyse = r'''function analyse({age,text,relationship,feeling,intent='Something that happened to me',bothAdults='Unsure',familyRelation='Unsure',sexualConduct='Unsure',jurisdiction='Western Australia'}) {
  const t=(text||'').toLowerCase();
  const child = age === '10–12' || age === '13–15';
  const youngChild = age === '10–12';

  // --- Intent router: a question is not treated like a personal incident ---
  const looksLikeQuestion = /\?/.test(text||'') || has(t,[
    'is it okay','is this okay','is it legal','is this legal','can a ','can someone','what if',
    'even if it is consensual','even if consensual','does consent','if it is consensual','if consensual'
  ]);
  const questionMode = intent === 'A question / hypothetical' || looksLikeQuestion;
  const resolvedIntent = questionMode ? 'Question / hypothetical' : intent;

  // --- Relationship and conduct classification for legal/safety routing ---
  const parentWords = has(t,['mum','mom','mother','dad','father','parent']);
  const childWords = has(t,['son','daughter','child']);
  const siblingWords = has(t,['brother','sister','sibling']);
  const parentChild = familyRelation === 'Parent ↔ child' || (parentWords && childWords);
  const siblings = familyRelation === 'Siblings' || siblingWords;
  const closeFamily = parentChild || siblings;
  const consentStated = has(t,['consensual','consent','agreed','willing']);
  const penetrationText = has(t,['sexual penetration','penetrat','intercourse']);
  const sexLanguage = has(t,['have sex','had sex','sex with','sexual relationship','sexual contact']);
  const penetrationSelected = sexualConduct === 'Sexual penetration / intercourse';
  const otherSexualSelected = sexualConduct === 'Other sexual contact';
  const likelyPenetration = penetrationSelected || penetrationText;
  const sexualContext = likelyPenetration || otherSexualSelected || sexLanguage;

  // --- WA legal information layer (not a court finding) ---
  // WA Criminal Code s 329: if both people are adults, sexual penetration between people who know
  // they are lineal relatives is criminalised; consent does not make it lawful. "Lineal relative"
  // in the section includes ancestor/descendant and brother/sister relationships.
  let legalContext = {
    jurisdiction,
    status:'No specific WA legal rule triggered by the information entered',
    level:'info',
    title:'Legal information check',
    summary:'The app did not identify enough facts to apply its limited Western Australian legal-information rules. This is not legal advice.',
    source:'WA Criminal Code s 329',
    checked:'5 Oct 2026',
    needsMore:false
  };

  if(questionMode && jurisdiction === 'Western Australia' && closeFamily && sexualContext){
    if(bothAdults === 'Yes' && likelyPenetration){
      legalContext = {
        jurisdiction,
        status:'WA legal rule triggered',
        level:'critical',
        title:'Close-family sexual penetration — consent does not make it lawful in WA',
        summary:'For adults who know they are lineal relatives, WA Criminal Code s 329(7)–(8) criminalises sexual penetration, including where the adult being penetrated consents. The Emotional Safety System therefore must not return a “low concern / okay because consensual” answer for this question.',
        source:'WA Criminal Code s 329(7)–(8)',
        checked:'5 Oct 2026',
        needsMore:false
      };
    } else if(bothAdults === 'No'){
      legalContext = {
        jurisdiction,
        status:'Safeguarding and legal review required',
        level:'critical',
        title:'A person under 18 may be involved',
        summary:'The exact legal position depends on the ages, relationship and conduct. The app should not rely on consent wording or an emotional score. It routes this to safeguarding and professional legal review instead of making a legal finding.',
        source:'WA Criminal Code — sexual offences; s 329 close-family provisions',
        checked:'5 Oct 2026',
        needsMore:true
      };
    } else {
      legalContext = {
        jurisdiction,
        status:'More detail needed for WA legal check',
        level:'warning',
        title:'The question raises a close-family sexual-law issue',
        summary:'To apply the WA rule accurately, the app needs to know whether both people are 18 or older and whether “sex” means sexual penetration/intercourse. Until those facts are answered, it should not label the situation low concern or lawful.',
        source:'WA Criminal Code s 329',
        checked:'5 Oct 2026',
        needsMore:true
      };
    }
  }

  // --- Observable event/context signals ---
  const capacityAbsent = has(t,['asleep','sleeping','unconscious','passed out','blacked out','sedated','incapacitated']);
  const sexualContact = sexualContext || has(t,['touched me sexually','sexual assault']);
  const force = has(t,['forced','held me down','restrained','wouldn\'t let me leave','would not let me leave']);
  const manipulation = has(t,['manipulat','emotionally abused','emotional abuse','gaslight','guilt trip','guilt-tripped','punished me','silent treatment','made me feel guilty']);
  const threatControl = has(t,['threatened','threat','control','controlled','blackmail','if you leave','if you loved me','made me afraid']);
  const repetition = has(t,['keeps happening','kept happening','again and again','repeated','every time','always does this']);
  const boundaryWords = has(t,['said no','said stop','not comfortable','leave me alone','ignored','wouldn’t stop',"wouldn't stop",'kept going','crossed my boundary','without asking','without permission']);
  const respectedBoundary = has(t,['stopped when i said no','stopped when i said stop','respected my boundary','asked and stopped']);
  const pressureWords = has(t,['kept asking','pressured','pressure','guilt','threat','forced','made me',"wouldn't take no",'begged','coerce','coerc','manipulat','emotionally abused','emotional abuse']);
  const secrecy = has(t,['secret',"don't tell",'dont tell','keep this between','hide it','nobody can know','keep quiet']);
  const dependency = has(t,["can't leave",'cant leave','depend','nowhere else','money','housing','only person','need them','financially dependent','rely on them']);
  const authorityPower = relationship === 'Authority / older person' || has(t,['teacher','coach','boss','manager','carer','doctor','counsellor','older adult']);
  const familyContext = relationship === 'Family' || closeFamily;

  const criticalCapacityViolation = capacityAbsent && sexualContact;
  const boundary = !respectedBoundary && (boundaryWords || force || criticalCapacityViolation);
  const pressure = pressureWords || manipulation || force || threatControl || criticalCapacityViolation;
  const power = authorityPower || threatControl || manipulation || (familyContext && sexualContact);
  const choiceReduced = criticalCapacityViolation || force || manipulation || threatControl ||
    has(t,['no choice','had to',"couldn't say no",'couldnt say no','afraid to say no','scared to refuse']) || feeling === 'Scared';

  // Question-mode scores describe scenario context only. They are never used to decide legality.
  let score = {
    choice: criticalCapacityViolation ? 100 : choiceReduced ? 78 : 20,
    boundary: criticalCapacityViolation ? 100 : respectedBoundary ? 12 : boundary ? 82 : manipulation ? 52 : 22,
    pressure: criticalCapacityViolation ? 88 : force ? 95 : threatControl ? 88 : manipulation ? 78 : pressure ? 72 : 18,
    power: authorityPower ? 82 : (familyContext && sexualContact) ? 72 : (manipulation || threatControl) ? 62 : 22,
    dependency: dependency ? 76 : familyContext ? 32 : 18,
    secrecy: secrecy ? 92 : 14
  };
  if(questionMode && closeFamily && sexualContext){
    score = {
      choice: consentStated ? 20 : 45,
      boundary: 72,
      pressure: pressure ? 72 : 18,
      power: parentChild ? 78 : 62,
      dependency: dependency ? 76 : 38,
      secrecy: secrecy ? 92 : 14
    };
  }

  // --- Emotional reality layer ---
  const fearDistress = feeling === 'Scared' || has(t,['afraid','fear','terrified','panic','unsafe']) ? 85 : feeling === 'Worried' ? 65 : manipulation ? 55 : 20;
  const confusion = feeling === 'Confused' || has(t,['confused','don’t understand',"don't understand",'unsure what happened','mixed up']) ? 80 : 20;
  const shameSelfDoubt = has(t,['ashamed','shame','guilty','my fault','blamed myself','self doubt','doubted myself']) ? 78 : manipulation ? 55 : 18;
  const attachmentConflict = (familyContext || relationship === 'Partner / peer') && has(t,['love','still love','care about','loyal','family','son','daughter','mum','mom','dad','partner']) ? 68 : (familyContext ? 52 : 20);
  const agencyLoss = criticalCapacityViolation ? 100 : choiceReduced ? 82 : manipulation ? 66 : 20;
  const isolationDependence = dependency || has(t,['isolated','alone','no one to tell','nowhere to go']) ? 75 : 20;
  const repetitionLoad = repetition ? 78 : 18;
  const protectiveSupport = has(t,['trusted person','support','helped me','safe place','counsellor','reported','told someone']) ? 55 : 10;

  const signalRisk = Math.round((score.choice + score.boundary + score.pressure + score.power + score.dependency + score.secrecy) / 6);
  const emotionalLoad = Math.round(agencyLoss*0.24 + fearDistress*0.18 + confusion*0.14 + attachmentConflict*0.14 + shameSelfDoubt*0.12 + isolationDependence*0.10 + repetitionLoad*0.08);
  const contextRisk = Math.round((criticalCapacityViolation ? 100 : 0)*0.45 + (authorityPower ? 85 : familyContext ? 60 : 25)*0.25 + (sexualContact ? 70 : 20)*0.15 + (repetition ? 75 : 20)*0.15);

  let realityScore = Math.round(signalRisk*0.55 + emotionalLoad*0.30 + contextRisk*0.15 - protectiveSupport*0.08);
  if(criticalCapacityViolation) realityScore = Math.max(realityScore, 92);
  realityScore = Math.max(0, Math.min(100, realityScore));

  const emotionalReality = questionMode ? {
    score:null,
    label:'Not scored for a general question',
    equation:'Emotional Reality is only scored when the input describes a lived or observed situation. A legal or hypothetical question is routed through factual and legal checks first.',
    components:[`Input type: ${resolvedIntent}`,'Legal/safeguarding rules are evaluated before emotional interpretation.']
  } : {
    score:realityScore,
    label:criticalCapacityViolation ? 'Critical safety reality' : realityScore >= 75 ? 'High emotional-safety concern' : realityScore >= 50 ? 'Elevated emotional-safety concern' : realityScore >= 30 ? 'Mixed / needs context' : 'Lower concern in this prototype',
    equation:'Emotional Reality = Safety Signals × 55% + Emotional Impact × 30% + Context × 15% − Protective Factors. Critical capacity rules override the weighted score.',
    components:[`Safety signals: ${signalRisk}/100`,`Emotional impact: ${emotionalLoad}/100`,`Context: ${contextRisk}/100`,`Protective support: ${protectiveSupport}/100`,criticalCapacityViolation ? 'Critical override: asleep/unconscious + sexual contact means capacity to consent was absent.' : null].filter(Boolean)
  };

  const legalCritical = questionMode && legalContext.level === 'critical';
  const legalNeedsMore = questionMode && legalContext.needsMore;
  const critical = legalCritical || criticalCapacityViolation || (!respectedBoundary && boundary && (pressure || secrecy || power));
  const childConcern = child && !questionMode && (sexualContact || boundary || pressure || secrecy || power);
  const high = critical || childConcern || (!questionMode && ((pressure && secrecy) || realityScore >= 75));
  const elevated = !high && (legalNeedsMore || (!questionMode && (realityScore >= 40 || boundary || pressure || power || dependency || choiceReduced || ['Confused','Worried','Scared'].includes(feeling))));

  const level = questionMode ? (legalCritical ? 'WA Legal Rule Triggered' : legalNeedsMore ? 'More Detail Needed for Legal Check' : 'Question Analysed') : high ? 'Safeguarding Concern Identified' : elevated ? 'Safety Concerns Detected' : 'No Major Red Flags Detected';
  const factors=[];
  factors.push(`Input type: ${resolvedIntent}.`);
  if(questionMode) factors.push('Question mode: legal and factual rules are checked before emotional interpretation.');
  if(youngChild && !questionMode) factors.push('Child-safety mode is active for age 10–12.');
  else if(child && !questionMode) factors.push('Safeguarding mode is active because a person under 16 is involved.');
  if(criticalCapacityViolation) factors.push('Sexual contact while asleep or unconscious means capacity to actively choose or respond was absent; this triggers a critical safety override.');
  if(questionMode && closeFamily && sexualContext) factors.push('Close-family sexual context detected. The WA legal-information layer was activated.');
  if(manipulation) factors.push('Manipulation or emotional-abuse language increased Pressure, reduced Choice and raised the Power/Control context.');
  if(threatControl) factors.push('Threat or control language raised Pressure and Power/Control.');
  if(force) factors.push('Force or restraint language triggered a high concern signal.');
  if(dependency) factors.push('Dependency may make free decision-making harder.');
  if(secrecy) factors.push('Secrecy language was detected.');
  if(repetition) factors.push('A repeated pattern increases emotional and contextual load.');
  if(factors.length <= 2) factors.push('No additional strong safety signal was detected from the words entered. Context can still matter.');

  const emotion = questionMode ? 'Because this is a question/hypothetical, the app does not invent an emotional state for the people involved. It explains legal and safety context first.' : criticalCapacityViolation ? 'A person can experience shock, confusion, fear, numbness, betrayal or attachment conflict after a situation where capacity was absent. Emotional reactions vary and do not determine whether the event was safe.' : high ? 'The pattern may leave someone feeling confused, frightened, ashamed, responsible for another person, or unsure of their own judgement.' : elevated ? 'The situation may create uncertainty, stress, self-doubt or pressure. Slowing things down can help restore choice.' : 'The description does not show strong warning signs in this prototype, but feelings and context still matter.';

  const steps = questionMode ? (legalContext.needsMore ? [
    'Answer the missing legal-detail questions: exact adult status and type of sexual conduct.',
    'Read the WA legal-information card before interpreting the six safety signals.',
    'Use an appropriate legal or safeguarding professional for advice about a real case.',
    'Do not use the Emotional Reality score to decide whether conduct is lawful.'
  ] : legalContext.level === 'critical' ? [
    'Treat the WA legal rule as an override: consent wording does not make the described adult close-family sexual penetration lawful.',
    'Use the legal source link to verify the current legislation.',
    'For a real situation, seek qualified legal or safeguarding advice rather than relying on this prototype.',
    'Use the emotional-safety layer only to understand impact and context, not legality.'
  ] : [
    'Review the legal and factual context shown above.',
    'Add more facts if the question depends on age, relationship, capacity or conduct.',
    'Use professional advice for a real legal or safeguarding decision.'
  ]) : high ? [
    'Prioritise immediate safety.','Talk with a trusted support person or appropriate professional service.','Keep factual observations separate from interpretations.','Use the Learning Centre to understand capacity, boundaries and power.','Seek urgent help if there is immediate danger.'
  ] : elevated ? [
    'Slow the situation down.','Make room for clear choice and boundaries.','Talk with a trusted support person.','Review the six safety signals and emotional-reality factors.','Seek professional support if concerns continue.'
  ] : ['Keep communication clear.','Continue respecting boundaries.','Stay open to how the person feels.','Use the Learning Centre to build safety knowledge.'];
  if(child && !questionMode) steps.unshift('Use child-focused safeguarding support rather than asking the child to solve the situation alone.');

  return {child,high,elevated,level,score,factors,emotion,steps,emotionalReality,questionMode,resolvedIntent,legalContext,closeFamily,parentChild,consentStated};
}'''

pattern = re.compile(r"function analyse\(\{age,text,relationship,feeling[^}]*\}\) \{.*?\n\}\n\nfunction Card", re.S)
if not pattern.search(s):
    raise SystemExit('analyse() function not found for intent/legal patch')
s = pattern.sub(new_analyse + "\n\nfunction Card", s, count=1)

# Add intent router before the text field in the assessment screen.
assessment_needle = """        <Card>\n          <Text style={styles.label}>Describe what happened{`\\n`}<Text style={styles.labelSoft}>(in your own words)</Text></Text>"""
assessment_insert = r'''        <Card>
          <Text style={styles.label}>What are you trying to understand?</Text>
          <View style={styles.grid2}>{[
            ['Something that happened to me','◉'],['Something I witnessed / was told','👁'],['A question / hypothetical','?'],['A relationship pattern','↻'],['I just need support','♥']
          ].map(([x,icon])=><Pressable key={x} onPress={()=>setIntent(x)} style={[styles.selectCard,intent===x&&styles.selectCardOn]}><Text style={styles.selectIcon}>{icon}</Text><Text style={styles.selectText}>{x}</Text></Pressable>)}</View>

          <Text style={styles.label}>{intent==='A question / hypothetical'?'Ask your question':'Describe what happened'}{`\n`}<Text style={styles.labelSoft}>(in your own words)</Text></Text>'''
if assessment_needle in s and "What are you trying to understand?" not in s:
    s = s.replace(assessment_needle, assessment_insert, 1)

# Add close-family/legal detail questions after relationship selector.
relationship_block = """          <View style={styles.grid2}>{[\n            ['Me / self','◉'],['Partner / peer','♥'],['Family','👥'],['Authority / older person','♟']\n          ].map(([x,icon])=><Pressable key={x} onPress={()=>setRelationship(x)} style={[styles.selectCard,relationship===x&&styles.selectCardOn]}><Text style={styles.selectIcon}>{icon}</Text><Text style={styles.selectText}>{x}</Text></Pressable>)}</View>"""
extra_questions = relationship_block + r'''

          {relationship==='Family'&&<>
            <Text style={styles.label}>Family relationship detail</Text>
            <View style={styles.wrap}>{['Parent ↔ child','Siblings','Other family','Unsure'].map(x=><SmallPill key={x} active={familyRelation===x} onPress={()=>setFamilyRelation(x)}>{x}</SmallPill>)}</View>
          </>}

          {intent==='A question / hypothetical'&&<>
            <View style={[styles.infoBox,{borderColor:C.gold}]}><Text style={styles.infoText}>Legal-information mode: this prototype currently checks selected Western Australian rules only. It gives legal information, not a court finding or legal advice.</Text></View>
            <Text style={styles.label}>Are both people 18 or older?</Text>
            <View style={styles.wrap}>{['Yes','No','Unsure'].map(x=><SmallPill key={x} active={bothAdults===x} onPress={()=>setBothAdults(x)}>{x}</SmallPill>)}</View>
            <Text style={styles.label}>What type of sexual conduct is the question about?</Text>
            <View style={styles.wrap}>{['Sexual penetration / intercourse','Other sexual contact','Unsure'].map(x=><SmallPill key={x} active={sexualConduct===x} onPress={()=>setSexualConduct(x)}>{x}</SmallPill>)}</View>
            <Text style={styles.label}>Legal jurisdiction</Text>
            <SmallPill active={jurisdiction==='Western Australia'} onPress={()=>setJurisdiction('Western Australia')}>Western Australia</SmallPill>
          </>}'''
if relationship_block in s and "Family relationship detail" not in s:
    s = s.replace(relationship_block, extra_questions, 1)

# Make the action label reflect intent.
s = s.replace(
    "<PrimaryButton onPress={startAnalysis}>Analyse My Situation  →</PrimaryButton>",
    "<PrimaryButton onPress={startAnalysis}>{intent==='I just need support'?'Open Support  →':intent==='A question / hypothetical'?'Check My Question  →':'Analyse My Situation  →'}</PrimaryButton>",
    1
)

# Replace result alert text so question mode is explicit.
old_alert = "<View style={{flex:1}}><Text style={styles.alertTitle}>{result.level}</Text><Text style={styles.alertText}>{result.child?'Safeguarding mode is active. This app does not calculate sexual consent for a child.':'This prototype highlights observable safety signals and does not determine guilt or diagnose people.'}</Text></View>"
new_alert = "<View style={{flex:1}}><Text style={styles.alertTitle}>{result.level}</Text><Text style={styles.alertText}>{result.questionMode?'Question mode is active. Legal and factual checks come before emotional scoring.':result.child?'Safeguarding mode is active. This app does not calculate sexual consent for a child.':'This prototype highlights observable safety signals and does not determine guilt or diagnose people.'}</Text></View>"
if old_alert in s:
    s = s.replace(old_alert,new_alert,1)

# Insert legal-information card before six signals.
results_needle = """        <Card>\n          <Text style={styles.cardTitle}>Six Safety Signals</Text>"""
legal_card = r'''        {result.questionMode&&<Card style={{borderColor:result.legalContext.level==='critical'?C.red:result.legalContext.level==='warning'?C.yellow:C.blue}}>
          <Text style={styles.cardEyebrow}>⚖  LEGAL & SAFETY CONTEXT — {result.legalContext.jurisdiction.toUpperCase()}</Text>
          <Text style={styles.cardTitle}>{result.legalContext.title}</Text>
          <Text style={styles.body}>{result.legalContext.summary}</Text>
          <View style={{height:8}} />
          <Text style={styles.bullet}>• Source: {result.legalContext.source}</Text>
          <Text style={styles.bullet}>• Legal rule set checked: {result.legalContext.checked}</Text>
          <Text style={styles.bullet}>• This is legal information, not legal advice or a finding of guilt.</Text>
          <PrimaryButton color={C.blue} darkText={false} onPress={()=>Linking.openURL('https://www.legislation.wa.gov.au/')}>Open WA Legislation  →</PrimaryButton>
        </Card>}
        <Card>
          <Text style={styles.cardTitle}>{result.questionMode?'Six Safety Signals — context only':'Six Safety Signals'}</Text>'''
if results_needle in s and "LEGAL & SAFETY CONTEXT" not in s:
    s = s.replace(results_needle,legal_card,1)

# Replace Emotional Reality card added by prior patch so questions are not given fake emotional scores.
emotion_pattern = re.compile(r"        <Card>\n          <Text style=\{styles\.cardTitle\}>Emotional Reality</Text>\n          <Text style=\{styles\.cardEyebrow\}>\{result\.emotionalReality\.label\.toUpperCase\(\)\}  •  \{result\.emotionalReality\.score\}/100</Text>\n          <Text style=\{styles\.body\}>\{result\.emotionalReality\.equation\}</Text>\n          <View style=\{\{height:8\}\} />\n          \{result\.emotionalReality\.components\.map\(\(x,i\)=><Text key=\{i\} style=\{styles\.bullet\}>• \{x\}</Text>\)\}\n        </Card>")
emotion_replacement = r'''        <Card>
          <Text style={styles.cardTitle}>Emotional Reality</Text>
          {result.questionMode?<>
            <Text style={styles.cardEyebrow}>NOT SCORED FOR A GENERAL QUESTION</Text>
            <Text style={styles.body}>{result.emotionalReality.equation}</Text>
          </>:<>
            <Text style={styles.cardEyebrow}>{result.emotionalReality.label.toUpperCase()}  •  {result.emotionalReality.score}/100</Text>
            <Text style={styles.body}>{result.emotionalReality.equation}</Text>
          </>}
          <View style={{height:8}} />
          {result.emotionalReality.components.map((x,i)=><Text key={i} style={styles.bullet}>• {x}</Text>)}
        </Card>'''
s = emotion_pattern.sub(emotion_replacement,s,count=1)

# Question-mode explanation uses the legal context instead of a generic emotional-risk paragraph.
plain_old = "<Card><Text style={styles.cardEyebrow}>💡  PLAIN LANGUAGE EXPLANATION</Text><Text style={styles.body}>{result.high?'The system detected a combination of safety indicators that deserves careful attention. Pressure, ignored boundaries, secrecy or power differences can reduce a person’s ability to choose freely.':result.elevated?'Some warning signs or uncertainty were detected. These do not prove intent, but they can be useful prompts to slow down, check boundaries and seek support.':'The current description does not produce strong warning signals in this local rule set. That does not prove a situation is safe.'}</Text></Card>"
plain_new = "<Card><Text style={styles.cardEyebrow}>💡  PLAIN LANGUAGE EXPLANATION</Text><Text style={styles.body}>{result.questionMode?result.legalContext.summary:result.high?'The system detected a combination of safety indicators that deserves careful attention. Pressure, ignored boundaries, secrecy or power differences can reduce a person’s ability to choose freely.':result.elevated?'Some warning signs or uncertainty were detected. These do not prove intent, but they can be useful prompts to slow down, check boundaries and seek support.':'The current description does not produce strong warning signals in this local rule set. That does not prove a situation is safe.'}</Text></Card>"
if plain_old in s:
    s = s.replace(plain_old,plain_new,1)

p.write_text(s)
