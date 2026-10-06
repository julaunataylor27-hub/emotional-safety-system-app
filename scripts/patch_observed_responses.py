"""Allow several observed responses per person without inferring emotion or consent."""
from pathlib import Path

p=Path('App.js')
s=p.read_text()
if "from './src/ObservedResponsesForm'" in s:
    print('Multiple observed responses already connected.')
    raise SystemExit(0)

def replace_once(old,new):
    global s
    if s.count(old)!=1:
        raise SystemExit('Observed responses: expected one anchor: '+old[:100])
    s=s.replace(old,new,1)

replace_once("observedFeeling='Unknown',childSafety", "observedFeeling='Unknown',observedPeople=[],childSafety")
replace_once("  const effectiveFeeling = observedMode ? observedFeeling : feeling;", "  const effectiveFeeling = observedMode ? 'Unknown' : feeling;")
replace_once("  const [observedFeeling,setObservedFeeling]=useState('Unknown');", "  const [observedPeople,setObservedPeople]=useState(()=>[emptyPerson()]);\n  const observedFeeling=observationSummary(observedPeople);")
replace_once('      const r=analyse({age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling,childSafety,sexualSafety,immediateSafety});', '      const r=analyse({age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling,observedPeople,childSafety,sexualSafety,immediateSafety});')
replace_once('      setResult({...r,assessmentInput:{age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling,childSafety,sexualSafety,immediateSafety}});', '      setResult({...r,assessmentInput:{age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling,observedPeople:normalisePeople(observedPeople),childSafety,sexualSafety,immediateSafety}});')
replace_once('  const structuralSafety=reviewStructuralSafety({age,text,relationship,familyRelation,sexualConduct,ageFor,childSafety,sexualSafety,immediateSafety});', '  const structuralSafety=reviewStructuralSafety({age,text,relationship,familyRelation,sexualConduct,ageFor,childSafety,sexualSafety,immediateSafety,observedPeople:observedMode?normalisePeople(observedPeople,observedFeeling):[]});')
replace_once("  const capacityAbsent = has(t,['asleep','sleeping','unconscious','passed out','blacked out','sedated','incapacitated']);", "  const capacityAbsent = has(t,['asleep','sleeping','unconscious','passed out','blacked out','sedated','incapacitated']) || (observedMode && hasCapacityObservation(observedPeople));")
replace_once("  const sexualContact = sexualContext || has(t,['touched me sexually','sexual assault']);", "  const sexualContact = structuralSafety.sexualConcern || sexualContext || has(t,['touched me sexually','sexual assault']);")
replace_once('Sexual contact while asleep or unconscious means capacity to actively choose or respond was absent; this triggers a critical safety override.', 'Reported sleep or unresponsiveness together with a sexual concern raises a critical capacity concern. Confirm whose state was observed and whether contact occurred at that time; this is not a finding of fact.')
replace_once('Critical override: asleep/unconscious + sexual contact means capacity to consent was absent.', 'Critical capacity concern: reported sleep/unresponsiveness with a sexual concern needs review; it is not a finding of fact.')
start=s.index("  if(observedMode && observedFeeling === 'Unknown'){")
end=s.index('  const legalCritical =',start)
s=s[:start]+'''  if(observedMode){
    emotionalReality=observationReview(normalisePeople(observedPeople,observedFeeling));
  }

'''+s[end:]
replace_once('Emotional Reality is only scored when the input describes a lived or observed situation. A legal or hypothetical question is routed through factual and legal checks first.', 'A legal or hypothetical question is routed through factual and legal checks first. Observed appearances are recorded separately without an emotional score.')
start=s.index("          {intent==='Something I witnessed / was told'&&<>")
end=s.index('          <View style={styles.infoBox}><Text style={styles.infoText}>Privacy-first prototype:',start)
s=s[:start]+'''          {intent==='Something I witnessed / was told'&&<ObservedResponsesForm people={observedPeople} onChange={setObservedPeople}/>}
'''+s[end:]
start=s.index('          <Text style={styles.cardTitle}>Emotion details</Text>')
position=s.index('          <Text style={styles.body}>{result.emotion}</Text>',start)
readout="          {result.assessmentInput?.intent==='Something I witnessed / was told'&&<ObservedResponsesReadout people={result.assessmentInput.observedPeople}/> }\n"
s=s[:position]+readout+s[position:]
replace_once("          <Text selectable style={styles.body}>{result.assessmentInput?.text?.trim()||'No description entered.'}</Text>", "          <Text selectable style={styles.body}>{result.assessmentInput?.text?.trim()||'No description entered.'}</Text>\n"+readout.rstrip())
s="import ObservedResponsesForm, {ObservedResponsesReadout} from './src/ObservedResponsesForm';\nimport {emptyPerson,normalisePeople,hasCapacityObservation,observationSummary,observationReview} from './src/observedResponses';\n"+s
p.write_text(s)
print('Multiple per-person observed feelings, behaviours and result snapshots connected.')
