"""Make explanation tabs interactive using the existing assessment result cards."""
from pathlib import Path

p = Path('App.js')
s = p.read_text()
marker = 'const [explanationTab,setExplanationTab]'
if marker in s:
    print('Explanation tabs already connected.')
    raise SystemExit(0)

def replace_once(old, new):
    global s
    if s.count(old) != 1:
        raise SystemExit('Explanation tabs: expected one anchor: ' + old[:80])
    s = s.replace(old, new, 1)

replace_once('  const [result,setResult]=useState(null);', "  const [result,setResult]=useState(null);\n  const [explanationTab,setExplanationTab]=useState('overview');")
replace_once('      setResult(r);', '      setResult({...r,assessmentInput:{age,text:scenario,relationship,feeling,intent,bothAdults,familyRelation,sexualConduct,jurisdiction,ageFor,observedFeeling}});')
replace_once("  const startAnalysis=()=>{ if(intent==='I just need support') go('support'); else go('analysis'); };", "  const startAnalysis=()=>{ if(intent==='I just need support') go('support'); else {setExplanationTab('overview');go('analysis');} };")

# Reuse the result cards verbatim; this patch does not change the safety engine.
results_start = s.index("      {screen==='results'&&result&&<>")
explanation_start = s.index("      {screen==='explanation'&&result&&<>", results_start)
next_start = s.index("      {screen==='next'&&result&&<>", explanation_start)
results = s[results_start:explanation_start]
old = s[explanation_start:next_start]
context_start = results.index('        {result.questionMode&&<Card')
coercion_start = results.index('        <Card style={{borderColor:result.coercionCheck')
signals_start = results.index("        <Card>\n          <Text style={styles.cardTitle}>{result.questionMode?'Six Safety Signals")
reality_start = results.index('        <Card>\n          <Text style={styles.cardTitle}>Emotional Reality')
context_cards = results[context_start:coercion_start]
coercion_card = results[coercion_start:signals_start]
signals_card = results[signals_start:reality_start]
tab_start = old.index('        <View style={styles.tabRow}>')
overview_start = old.index('\n', tab_start) + 1
footer_start = old.index('        <View style={styles.infoBox}><Text style={styles.infoText}>AI + EI concept layer:')
overview = old[overview_start:footer_start]
equation_start = overview.index('        <Card>\n          <Text style={styles.cardEyebrow}>EMOTIONAL REALITY EQUATION')
equation_card = overview[equation_start:]
footer = old[footer_start:]

tabs = r'''        <View style={styles.tabRow}>
          {['overview','signals','emotion','context'].map(tab=><Pressable key={tab} accessibilityRole="tab" accessibilityState={{selected:explanationTab===tab}} onPress={()=>setExplanationTab(tab)} style={[styles.tab,explanationTab===tab&&styles.tabOn]}>
            <Text style={explanationTab===tab?styles.tabTextOn:styles.tabText}>{tab[0].toUpperCase()+tab.slice(1)}</Text>
          </Pressable>)}
        </View>
'''
emotion_details = r'''        <Card>
          <Text style={styles.cardTitle}>Emotion details</Text>
          <Text style={styles.body}>{result.questionMode?'No personal feeling is assumed for a question or hypothetical.':result.assessmentInput?.intent==='Something I witnessed / was told'?`Observed response selected: ${result.assessmentInput.observedFeeling}`:`Feeling selected: ${result.assessmentInput?.feeling||'Not provided'}`}</Text>
          <Text style={styles.body}>{result.emotion}</Text>
          <Text style={styles.cardEyebrow}>{result.emotionalReality.label.toUpperCase()}</Text>
        </Card>
'''
context_details = r'''        <Card>
          <Text style={styles.cardTitle}>Assessment context</Text>
          <Text style={styles.body}>These are the form settings used when you ran this assessment. Review them if anything needs changing.</Text>
          {[
            ['Input type',result.resolvedIntent],
            ['Relationship setting',result.assessmentInput?.relationship],
            ['Family relationship setting',result.assessmentInput?.familyRelation],
            ['Age range setting',result.assessmentInput?.age],
            ['Whose age setting',result.assessmentInput?.ageFor],
            ['Both people 18 or older setting',result.assessmentInput?.bothAdults],
            ['Sexual conduct setting',result.assessmentInput?.sexualConduct],
            ['Jurisdiction',result.assessmentInput?.jurisdiction]
          ].map(([label,value])=><Text key={label} style={styles.bullet}>• {label}: {value||'Not provided'}</Text>)}
          <Text style={styles.label}>Your description</Text>
          <Text selectable style={styles.body}>{result.assessmentInput?.text?.trim()||'No description entered.'}</Text>
          <PrimaryButton onPress={()=>go('assessment')}>Review My Answers →</PrimaryButton>
        </Card>
'''
body = old[:tab_start] + tabs
body += "        {explanationTab==='overview'&&<>\n" + overview + '        </>}\n'
body += "        {explanationTab==='signals'&&<>\n" + signals_card + coercion_card + '        </>}\n'
body += "        {explanationTab==='emotion'&&<>\n" + emotion_details + equation_card + '        </>}\n'
body += "        {explanationTab==='context'&&<>\n" + context_details + context_cards + '        </>}\n'
body += footer
s = s[:explanation_start] + body + s[next_start:]
p.write_text(s)
print('Explanation Overview, Signals, Emotion and Context tabs connected.')
