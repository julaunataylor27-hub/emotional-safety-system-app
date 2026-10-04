from pathlib import Path

p = Path('App.js')
s = p.read_text()

age_block = """          <Text style={styles.label}>Age range <Text style={styles.labelSoft}>(optional)</Text></Text>\n          <View style={styles.wrap}>{['10–12','13–15','16+','Unsure'].map(x=><SmallPill key={x} active={age===x} onPress={()=>setAge(x)}>{x}</SmallPill>)}</View>"""
if age_block in s:
    s = s.replace(age_block, """          {intent!=='A question / hypothetical'&&<>\n            <Text style={styles.label}>Age range <Text style={styles.labelSoft}>(optional)</Text></Text>\n            <View style={styles.wrap}>{['10–12','13–15','16+','Unsure'].map(x=><SmallPill key={x} active={age===x} onPress={()=>setAge(x)}>{x}</SmallPill>)}</View>\n          </>}""", 1)

s = s.replace(
    "<Text style={styles.label}>Who was involved? <Text style={styles.labelSoft}>(optional)</Text></Text>",
    "<Text style={styles.label}>{intent==='A question / hypothetical'?'What relationship is the question about?':'Who was involved?'} <Text style={styles.labelSoft}>(optional)</Text></Text>",
    1
)

feeling_block = """          <Text style={styles.label}>How did you feel? <Text style={styles.labelSoft}>(optional)</Text></Text>\n          <View style={styles.wrap}>{[['Sad','☹'],['Confused','◉'],['Worried','◌'],['Scared','!'],['Okay','✓']].map(([x,icon])=><Pressable key={x} onPress={()=>setFeeling(x)} style={[styles.feel,feeling===x&&styles.feelOn]}><Text style={styles.feelIcon}>{icon}</Text><Text style={styles.feelText}>{x}</Text></Pressable>)}</View>"""
if feeling_block in s:
    s = s.replace(feeling_block, """          {intent!=='A question / hypothetical'&&<>\n            <Text style={styles.label}>How did you feel? <Text style={styles.labelSoft}>(optional)</Text></Text>\n            <View style={styles.wrap}>{[['Sad','☹'],['Confused','◉'],['Worried','◌'],['Scared','!'],['Okay','✓']].map(([x,icon])=><Pressable key={x} onPress={()=>setFeeling(x)} style={[styles.feel,feeling===x&&styles.feelOn]}><Text style={styles.feelIcon}>{icon}</Text><Text style={styles.feelText}>{x}</Text></Pressable>)}</View>\n          </>}""", 1)

required = [
    "intent!=='A question / hypothetical'",
    "What relationship is the question about?",
]
missing = [x for x in required if x not in s]
if missing:
    raise SystemExit('Question UI cleanup failed: ' + ', '.join(missing))

p.write_text(s)
