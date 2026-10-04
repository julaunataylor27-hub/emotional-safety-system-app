from pathlib import Path

p = Path('App.js')
s = p.read_text()

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
            selectedTopic.title.includes('Pressure') ? 'Pressure can include repeated asking, guilt, threats, urgency or emotional leverage. The key question is whether the person still has a real and safe option to say no.' :
            selectedTopic.title.includes('Power') ? 'Age, authority, money, housing, caregiving or social status can affect how freely someone can disagree or leave. Greater power creates greater responsibility to protect choice.' :
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
          <Text style={styles.bullet}>• Pressure, secrecy and power differences deserve careful attention.</Text>
          <Text style={styles.bullet}>• For children, safeguarding comes before scoring or interpretation.</Text>
        </Card>
        <PrimaryButton onPress={()=>go(selectedTopic.back||'learn')}>←  Back</PrimaryButton>
      </>}

'''
if marker in s and "screen==='topic'" not in s:
    s = s.replace(marker, topic_screen + marker)

p.write_text(s)
