"""Add explicit structural fact checks and an interactive Diamond Effect planner."""
from pathlib import Path

p=Path('App.js')
s=p.read_text()
if "from './src/DiamondEffectScreen'" in s:
    print('Diamond Effect already connected.')
    raise SystemExit(0)

def replace_once(old,new):
    global s
    if s.count(old)!=1:
        raise SystemExit('Diamond Effect: expected one anchor: '+old[:100])
    s=s.replace(old,new,1)

replace_once("observedFeeling='Unknown'}) {", "observedFeeling='Unknown',childSafety='Unsure',sexualSafety='Unsure',immediateSafety='Unsure'}) {")
replace_once("  const child = age === '10–12' || age === '13–15';", "  const child = childSafety === 'Yes' || ['10–12','13–15','16–17'].includes(age);")
replace_once("  const selectedChildAge = age === '10–12' || age === '13–15';", "  const selectedChildAge = ['10–12','13–15','16–17'].includes(age);")
replace_once("  const parentWords = has(t,['mum','mom','mother','dad','father','parent']);", "  const parentWords = /\\b(mum|mom|mother|dad|father|parent)\\b/.test(t);")
replace_once("  const childWords = has(t,['son','daughter','child']);", "  const childWords = /\\b(son|daughter|child|children|boy|girl|kid|teenager)\\b/.test(t);")
replace_once("  const inferredParentChild = (parentWords && childWords) || has(t,['my mum','my mom','my mother','my dad','my father','my son','my daughter','my child']);", "  const inferredParentChild = familyRelation === 'Parent ↔ child' || (parentWords && childWords) || has(t,['my mum','my mom','my mother','my dad','my father','my son','my daughter','my child']);")
replace_once('  const coercionChildSecrecy = structuralCritical && secrecy;', '  const coercionChildSecrecy = parentChildChildSexual && secrecy;')
start=s.index('  // --- Structural Safety layer ---')
end=s.index('  // --- WA legal information layer',start)
s=s[:start]+'''  // --- Structural Safety layer ---
  const structuralSafety=reviewStructuralSafety({age,text,relationship,familyRelation,sexualConduct,ageFor,childSafety,sexualSafety,immediateSafety});
  const parentChildChildSexual=structuralSafety.childKnown&&structuralSafety.sexualConcern&&structuralSafety.parentChild;
  const structuralCritical=structuralSafety.level==='critical';

'''+s[end:]
replace_once("  const [observedFeeling,setObservedFeeling]=useState('Unknown');", "  const [observedFeeling,setObservedFeeling]=useState('Unknown');\n  const [childSafety,setChildSafety]=useState('Unsure');\n  const [sexualSafety,setSexualSafety]=useState('Unsure');\n  const [immediateSafety,setImmediateSafety]=useState('Unsure');\n  const [diamondDraft,setDiamondDraft]=useState(emptyDiamond);")
replace_once('      const r=analyse({age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling});', '      const r=analyse({age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling,childSafety,sexualSafety,immediateSafety});')
replace_once('      setResult({...r,assessmentInput:{age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling}});', '      setResult({...r,assessmentInput:{age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling,childSafety,sexualSafety,immediateSafety}});\n      setDiamondDraft(emptyDiamond());')
replace_once('  const level = questionMode ?', "  const level = immediateSafety==='Yes' ? 'Immediate safety concern' : questionMode ?")
replace_once("['10–12','13–15','16+','Unsure'].map", "['10–12','13–15','16–17','18+','16+','Unsure'].map")

anchor='          <PrimaryButton onPress={startAnalysis}>{intent==='
position=s.index(anchor)
questions=r'''          <Text style={styles.cardTitle}>Key safety facts</Text>
          <Text style={styles.body}>Answer only what you know. Unsure is a useful answer. These settings help the app review concerns without treating guesses as proof.</Text>
          {[
            ['Is anyone involved under 18?',childSafety,setChildSafety],
            ['Is there a sexual contact or sexual-boundary concern?',sexualSafety,setSexualSafety],
            ['Is anyone in immediate danger now?',immediateSafety,setImmediateSafety]
          ].map(([label,value,setValue])=><View key={label}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.wrap}>{['Yes','No','Unsure'].map(answer=><Pressable key={answer} accessibilityRole="radio" accessibilityLabel={`${label} ${answer}`} accessibilityState={{checked:value===answer}} onPress={()=>setValue(answer)} style={[styles.pill,value===answer&&styles.pillActive]}><Text style={[styles.pillText,value===answer&&styles.pillTextActive]}>{answer}</Text></Pressable>)}</View>
          </View>)}
'''
s=s[:position]+questions+s[position:]

anchor="          {result.structuralSafety?.source?<Text style={styles.bullet}>• Source framework: {result.structuralSafety?.source}</Text>:null}"
if s.count(anchor)!=2:
    raise SystemExit('Diamond Effect: expected structural cards in Results and Context')
s=s.replace(anchor,anchor+r'''
          <Text style={styles.body}>Why this result: the app used the reported settings and the wording cues listed above. It cannot establish what happened from text alone.</Text>
          {(result.structuralSafety?.missing||[]).map((item,index)=><Text key={index} style={styles.bullet}>• Needs clarification: {item}</Text>)}
          {result.structuralSafety?.sourceUrl&&<PrimaryButton onPress={()=>Linking.openURL(result.structuralSafety.sourceUrl)}>Read WA child safety guidance →</PrimaryButton>}
          <PrimaryButton onPress={()=>go('assessment')}>Review key safety facts →</PrimaryButton>
          <PrimaryButton onPress={()=>go('diamond')}>EXPLORE MY DIAMOND EFFECT ◇</PrimaryButton>''')
replace_once("            ['Jurisdiction',result.assessmentInput?.jurisdiction]", "            ['Jurisdiction',result.assessmentInput?.jurisdiction],\n            ['Under-18 concern setting',result.assessmentInput?.childSafety],\n            ['Sexual-boundary concern setting',result.assessmentInput?.sexualSafety],\n            ['Immediate danger setting',result.assessmentInput?.immediateSafety]")
next_anchor="      {screen==='next'&&result&&<>"
replace_once(next_anchor,'''      {screen==='diamond'&&result&&<DiamondEffectScreen result={result} draft={diamondDraft} onChange={setDiamondDraft} onBack={()=>{setExplanationTab('context');go('explanation');}} onReview={()=>go('assessment')} onSupport={()=>go('support')}/>}

'''+next_anchor)
replace_once('        <BackTitle title="Recommended Next Steps" onBack={()=>go(\'explanation\')} />', '        <BackTitle title="Recommended Next Steps" onBack={()=>go(\'explanation\')} />\n        <PrimaryButton onPress={()=>go(\'diamond\')}>EXPLORE MY DIAMOND EFFECT ◇</PrimaryButton>')
s="import DiamondEffectScreen from './src/DiamondEffectScreen';\nimport {emptyDiamond} from './src/diamondEffect';\nimport {reviewStructuralSafety} from './src/structuralReview';\n"+s
p.write_text(s)
print('Structural fact review and interactive Diamond Effect connected.')
