import React, {useMemo, useState} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import {EXAMPLES, assessEvidence} from './evidenceTruthEngine.cjs';

const C = {
  bg:'#071815', panel:'#102923', border:'#8A6A36', gold:'#EABE71',
  light:'#FFF3DC', muted:'#C9C5B8', green:'#77C5A4',
  amber:'#E6C083', red:'#F1AB9F'
};
const FIRST_EXAMPLE = EXAMPLES[1];
function Choice({label,onPress,active}) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected:!!active}}
    accessibilityLabel={label} onPress={onPress}
    style={[s.choice,active&&s.active]}>
    <Text style={[s.choiceText,active&&{color:'#161B15'}]}>{label}</Text>
  </Pressable>;
}
function Panel({title,children}) {
  return <View style={s.panel}><Text style={s.heading}>{title}</Text>{children}</View>;
}
function Line({title,body}) {
  return <View style={s.line}><Text style={s.label}>{title}</Text><Text selectable style={s.body}>{body}</Text></View>;
}
export default function EvidenceTruthScreen({onBack,onSupport}) {
  const [text,setText] = useState(FIRST_EXAMPLE.text);
  const [exampleId,setExampleId] = useState(FIRST_EXAMPLE.id);
  const [feeling,setFeeling] = useState('Not specified');
  const result = useMemo(()=>assessEvidence({text,feeling,exampleId}),[text,feeling,exampleId]);
  const levelColor = result.kind==='danger'||result.kind==='coercion'?C.red:
    result.kind==='pressure'?C.amber:result.kind==='healthy'?C.green:C.muted;

  return <View>
    <Pressable accessibilityRole="button" accessibilityLabel="Back to home"
      onPress={onBack} style={s.back}><Text style={s.backText}>‹  Back</Text></Pressable>
    <View style={s.hero}>
      <Text style={s.eyebrow}>EMOTIONAL SAFETY SYSTEM  ·  TEST LAB</Text>
      <Text style={s.symbol}>✦  ◉  ✦</Text>
      <Text style={s.heroTitle}>Evidence &amp; Truth{'\n'}Engine</Text>
      <Text style={s.heroSub}>Version 1.2  |  Protection × Emotional Safety × Truth × Choice</Text>
      <Text style={s.heroNote}>A guided reflection, not a verdict. Your decisions remain yours.</Text>
    </View>
    <Panel title="1 · Choose a fictional example">
      <Text style={s.body}>Explore how different descriptions change the system’s response.</Text>
      <View style={s.wrap}>
        {EXAMPLES.map(item=><Choice key={item.id} label={item.title}
          active={exampleId===item.id}
          onPress={()=>{setText(item.text);setExampleId(item.id);setFeeling('Not specified');}}/>)}
      </View>
      <Text style={s.label}>What was said or done?</Text>
      <TextInput accessibilityLabel="Describe the situation" multiline
        maxLength={2500} textAlignVertical="top" value={text}
        onChangeText={v=>{setText(v);setExampleId('');}}
        placeholder="Write only what you feel comfortable sharing. Avoid names and addresses."
        placeholderTextColor="#A4A198" style={s.input}/>
      <Text style={s.mini}>Changing the text switches to an unverified custom example.</Text>
      <Text style={s.label}>How did the person describe feeling? (optional)</Text>
      <View style={s.wrap}>
        {['Not specified','Okay','Overwhelmed','Confused','Worried','Scared'].map(item=>
          <Choice key={item} label={item} active={feeling===item} onPress={()=>setFeeling(item)}/>)}
      </View>
    </Panel>
    <Panel title="2 · System interpretation">
      <View style={s.levelRow}>
        <View style={[s.dot,{backgroundColor:levelColor}]}/>
        <Text style={[s.finding,{color:levelColor}]}>{result.title}</Text>
      </View>
      <Text style={s.mini}>{result.tier} · {result.proof}</Text>
      <Line title="Protection" body={result.protection}/>
      <Line title="Emotional safety" body={result.emotionalSafety}/>
      <Line title="Truth and evidence" body={result.truth}/>
      <Line title="Freedom of choice" body={result.choice}/>
    </Panel>
    <Panel title="3 · Facts, feelings and uncertainty">
      <Line title="Reported words — not independently verified" body={result.reported}/>
      <Line title="Feelings — reported, not assumed" body={result.feelings}/>
      <Line title="Possible interpretation — not a diagnosis" body={result.interpretation}/>
      <Text style={s.label}>What we still do not know</Text>
      {result.unknowns.map((item,i)=><Text key={i} style={s.bullet}>• {item}</Text>)}
      <Text style={s.label}>Possible risks (not predictions)</Text>
      {result.risks.map((item,i)=><Text key={i} style={s.bullet}>• {item}</Text>)}
    </Panel>
    <Panel title="4 · Safe, self-directed next steps">
      {result.options.map((item,i)=><Text key={i} style={s.bullet}>{i+1}. {item}</Text>)}
      {result.urgent&&<View style={s.urgentBox}>
        <Text style={s.urgentText}>If this is happening now, move to safety if possible. In Australia call 000 for immediate danger.</Text>
      </View>}
      <Pressable accessibilityRole="button" accessibilityLabel="Open support resources"
        onPress={onSupport} style={s.support}>
        <Text style={s.supportText}>Find support resources  →</Text>
      </Pressable>
    </Panel>
    <View style={s.footer}>
      <Text style={s.footerText}>HOW IT WORKS: {result.method} This screen does not verify accusations, determine consent, diagnose anyone or give legal findings.</Text>
      <Text style={[s.footerText,{marginTop:7}]}>PRIVACY: This screen does not upload or automatically save your writing. Avoid identifying details on shared devices. Responses last only while this screen is open.</Text>
    </View>
  </View>;
}

const s=StyleSheet.create({
  back:{alignSelf:'flex-start',paddingHorizontal:12,paddingVertical:9,borderColor:C.border,borderWidth:1,borderRadius:12,marginBottom:10},
  backText:{color:C.light,fontSize:15,fontWeight:'800'},
  hero:{backgroundColor:'#19241C',borderColor:C.gold,borderWidth:1,borderRadius:19,padding:19,marginBottom:14,alignItems:'center'},
  eyebrow:{color:C.gold,fontSize:10,fontWeight:'900',letterSpacing:1.2,textAlign:'center'},
  symbol:{color:C.gold,fontSize:23,marginTop:8},
  heroTitle:{color:C.light,fontSize:26,fontWeight:'900',textAlign:'center',lineHeight:32,marginTop:6},
  heroSub:{color:C.gold,fontSize:12,lineHeight:18,textAlign:'center',marginTop:7},
  heroNote:{color:C.muted,fontSize:12,textAlign:'center',marginTop:9,lineHeight:18},
  panel:{backgroundColor:C.panel,borderColor:C.border,borderWidth:1,borderRadius:17,padding:15,marginBottom:13},
  heading:{color:C.gold,fontSize:18,fontWeight:'900',marginBottom:9},
  label:{color:C.light,fontWeight:'800',fontSize:13,marginTop:12,marginBottom:6},
  line:{borderTopWidth:1,borderTopColor:'#4E4935',paddingTop:6,marginTop:9},
  body:{color:C.light,fontSize:13,lineHeight:20},
  mini:{color:C.muted,fontSize:11,lineHeight:17,marginTop:6},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9},
  choice:{borderColor:'#84683D',borderWidth:1,backgroundColor:'#1C3029',borderRadius:12,paddingVertical:10,paddingHorizontal:11,minHeight:41,justifyContent:'center'},
  active:{backgroundColor:C.gold,borderColor:C.gold},
  choiceText:{color:C.light,fontSize:12,fontWeight:'800'},
  input:{backgroundColor:C.bg,borderColor:'#7A6A4F',borderWidth:1,borderRadius:12,padding:12,color:C.light,fontSize:14,minHeight:125,lineHeight:20},
  levelRow:{flexDirection:'row',alignItems:'center',gap:9,marginTop:4},
  dot:{width:12,height:12,borderRadius:6},
  finding:{fontSize:17,fontWeight:'900',flex:1},
  bullet:{color:C.light,fontSize:13,lineHeight:20,marginVertical:3},
  urgentBox:{backgroundColor:'#4A2424',borderColor:C.red,borderWidth:1,borderRadius:12,padding:12,marginVertical:10},
  urgentText:{color:'#FFE0DB',fontSize:13,lineHeight:19,fontWeight:'700'},
  support:{backgroundColor:C.gold,borderRadius:13,padding:14,alignItems:'center',marginTop:13,minHeight:48,justifyContent:'center'},
  supportText:{color:'#192018',fontSize:14,fontWeight:'900'},
  footer:{borderColor:'#6A5636',borderWidth:1,borderRadius:12,padding:12,marginBottom:15},
  footerText:{color:C.muted,fontSize:11,lineHeight:17}
});
