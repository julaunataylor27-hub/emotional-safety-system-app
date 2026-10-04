from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# Add a dedicated coercion layer before the six-signal display logic.
marker = "  // --- Display states for the six signals ---"
coercion_block = r'''  // --- Coercion layer ---
  // Coercion is treated as a cross-cutting safety pattern, not a simple seventh score.
  // The app flags indicators; it does not make a legal finding or decide guilt.
  const coercionForce = force || has(t,['held me down','restrained me','physically made me','would not let me leave',"wouldn't let me leave"]);
  const coercionThreat = threatControl || has(t,['threatened me','intimidated','intimidation','blackmailed','blackmail','made me afraid to refuse']);
  const coercionPersistence = has(t,['kept asking','wouldn\'t take no',"wouldn't take no",'would not take no','wore me down','until i said yes','kept pushing','kept pressuring','begged until']);
  const coercionDeceit = has(t,['deceived me','deceit','tricked me','lied to me about','fraudulent','fraud','pretended so i would']);
  const coercionEmotionalLeverage = manipulation || has(t,['if you loved me','made me feel guilty','guilt tripped','guilt-tripped','silent treatment','punished me for saying no','threatened to leave me']);
  const coercionRefusalIgnored = boundaryWords && (pressureWords || coercionPersistence || coercionThreat || coercionForce);
  const coercionPowerPattern = (authorityPower || power || dependency) && (pressureWords || coercionPersistence || coercionThreat || coercionEmotionalLeverage);
  const abstractCoercionQuestion = questionMode && has(t,['what is coercion','define coercion','what does coercion mean']) &&
    !(coercionForce || coercionThreat || coercionPersistence || coercionDeceit || coercionEmotionalLeverage || coercionRefusalIgnored || coercionPowerPattern);

  const coercionIndicators = [];
  if(coercionForce) coercionIndicators.push('Force, restraint, or blocked freedom of movement was described.');
  if(coercionThreat) coercionIndicators.push('Threat, intimidation, fear, or blackmail language was detected.');
  if(coercionPersistence) coercionIndicators.push('Repeated pressure or persistence after reluctance/refusal was described.');
  if(coercionDeceit) coercionIndicators.push('Deceit or trickery that may affect free choice was described.');
  if(coercionEmotionalLeverage) coercionIndicators.push('Emotional leverage, guilt, punishment, or manipulation was described.');
  if(coercionRefusalIgnored) coercionIndicators.push('A boundary/refusal appears to have been combined with pressure or force.');
  if(coercionPowerPattern) coercionIndicators.push('Power or dependency may be combining with pressure in a way that reduces free choice.');

  let coercionLevel = 'unknown';
  if(abstractCoercionQuestion) coercionLevel = 'info';
  else if(sexualContact && (coercionForce || coercionThreat || criticalCapacityViolation)) coercionLevel = 'critical';
  else if(coercionForce || coercionThreat || coercionRefusalIgnored || coercionPowerPattern) coercionLevel = 'high';
  else if(coercionPersistence || coercionDeceit || coercionEmotionalLeverage) coercionLevel = 'moderate';

  const coercionCheck = {
    level: coercionLevel,
    title: coercionLevel === 'critical' ? 'Critical coercion / consent concern' :
      coercionLevel === 'high' ? 'Strong coercion indicators detected' :
      coercionLevel === 'moderate' ? 'Possible coercion indicators detected' :
      coercionLevel === 'info' ? 'Coercion information question' :
      structuralCritical ? 'Coercion not determined — structural safeguarding still applies' :
      'Not enough information to determine coercion',
    summary: coercionLevel === 'critical' ?
      'The description includes sexual contact together with force, threat, intimidation, or absent capacity. This is treated as a critical safety concern. The app does not decide the offence or guilt.' :
      coercionLevel === 'high' ?
      'Several features can reduce a person’s freedom to choose, including threats, repeated pressure after refusal, power imbalance, dependency, or manipulation. The app flags these as coercion indicators rather than treating stated consent as the whole answer.' :
      coercionLevel === 'moderate' ?
      'Some pressure, manipulation, persistence, or deceit may be present. More context is needed before making a stronger safety interpretation.' :
      coercionLevel === 'info' ?
      'Coercion means pressure or control that can interfere with free choice. This app looks for force, threats, intimidation, deceit, repeated pressure, emotional leverage, power and dependency.' :
      structuralCritical ?
      'No specific coercion indicator was established from the words entered, but the structural safeguarding concern stands independently. The app does not need to prove coercion before applying child-safety or capacity rules.' :
      'The description does not contain enough information to say whether coercion was present. Missing information is not treated as proof that the situation was freely chosen.',
    indicators: coercionIndicators,
    legalNote: sexualContext ?
      'WA legal context: Criminal Code s 319 defines consent as freely and voluntarily given and states that consent is not freely and voluntarily given if obtained by force, threat, intimidation, deceit or fraudulent means. Failure to physically resist does not by itself amount to consent.' :
      'Coercion can also occur outside sexual situations. In those contexts this is a safety interpretation, not a legal conclusion.',
    source: sexualContext ? 'WA Criminal Code s 319 — consent definition (legal information only)' : null,
    checked: sexualContext ? '5 Oct 2026' : null
  };

'''
if marker in s and 'const coercionCheck =' not in s:
    s = s.replace(marker, coercion_block + marker, 1)

# Let strong coercion indicators affect the existing safety signals without turning coercion into a single score.
emotion_marker = "  // --- Emotional reality layer ---"
coercion_adjust = r'''  if(coercionCheck.level === 'critical'){
    signalDisplay.choice = {value:100,status:'Critical'};
    signalDisplay.pressure = {value:100,status:'Critical'};
    if(coercionPowerPattern || authorityPower || dependency) signalDisplay.power = {value:90,status:'High Risk'};
  } else if(coercionCheck.level === 'high'){
    signalDisplay.choice = {value:Math.max(signalDisplay.choice?.value||0,82),status:'High Risk'};
    signalDisplay.pressure = {value:Math.max(signalDisplay.pressure?.value||0,88),status:'High Risk'};
    if(coercionPowerPattern) signalDisplay.power = {value:Math.max(signalDisplay.power?.value||0,78),status:'High Risk'};
  } else if(coercionCheck.level === 'moderate'){
    if(signalDisplay.choice?.status === 'Unknown') signalDisplay.choice = {value:55,status:'Moderate'};
    if(signalDisplay.pressure?.status === 'Unknown') signalDisplay.pressure = {value:58,status:'Moderate'};
  }

'''
if emotion_marker in s and 'if(coercionCheck.level ===' not in s:
    s = s.replace(emotion_marker, coercion_adjust + emotion_marker, 1)

# Ensure coercionCheck is returned from analyse().
section = re.search(r"(function analyse\(.*?\)\s*\{)(.*?)(\n\}\n\nfunction Card)", s, re.S)
if not section:
    raise SystemExit('Coercion patch: analyse() block not found')
body = section.group(2)
returns = list(re.finditer(r"return\s+\{([^{}]*)\};", body, re.S))
if not returns:
    raise SystemExit('Coercion patch: analyse() return object not found')
target = returns[-1]
fields = [x.strip() for x in target.group(1).replace('\n',' ').split(',') if x.strip()]
if 'coercionCheck' not in fields:
    fields.append('coercionCheck')
new_return = 'return {' + ', '.join(fields) + '};'
body = body[:target.start()] + new_return + body[target.end():]
s = s[:section.start(2)] + body + s[section.end(2):]

# Add a visible Coercion Check card before the six safety signals.
signals_card = "        <Card>\n          <Text style={styles.cardTitle}>{result.questionMode?'Six Safety Signals — context only':'Six Safety Signals'}</Text>"
coercion_card = r'''        <Card style={{borderColor:result.coercionCheck?.level==='critical'?C.red:result.coercionCheck?.level==='high'?C.red:result.coercionCheck?.level==='moderate'?C.yellow:C.line}}>
          <Text style={styles.cardEyebrow}>COERCION CHECK</Text>
          <Text style={styles.cardTitle}>{result.coercionCheck?.title||'Coercion check'}</Text>
          <Text style={styles.body}>{result.coercionCheck?.summary||'Coercion information was not available for this result.'}</Text>
          {(result.coercionCheck?.indicators||[]).map((x,i)=><Text key={i} style={styles.bullet}>• {x}</Text>)}
          {result.coercionCheck?.legalNote?<Text style={styles.bullet}>• {result.coercionCheck.legalNote}</Text>:null}
          {result.coercionCheck?.source?<Text style={styles.bullet}>• Source framework: {result.coercionCheck.source}{result.coercionCheck?.checked?` — checked ${result.coercionCheck.checked}`:''}</Text>:null}
          <Text style={styles.body}>This layer flags indicators only. It does not diagnose a person, determine guilt, or replace legal advice.</Text>
        </Card>
        <Card>
          <Text style={styles.cardTitle}>{result.questionMode?'Six Safety Signals — context only':'Six Safety Signals'}</Text>'''
if signals_card in s and 'COERCION CHECK' not in s:
    s = s.replace(signals_card, coercion_card, 1)

required = [
    'const coercionCheck =',
    'COERCION CHECK',
    'coercionCheck',
    'WA Criminal Code s 319',
    "if(coercionCheck.level === 'critical')"
]
missing = [x for x in required if x not in s]
if missing:
    raise SystemExit('Coercion patch failed; missing: ' + ', '.join(missing))

p.write_text(s)
print('Coercion layer added and validated.')
