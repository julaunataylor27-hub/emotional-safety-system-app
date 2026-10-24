import {AppText as Text,AppInput as TextInput} from './AppPreferences';
import {presentationStyles,P} from './PresentationTheme';
import NightForestScene from './NightForestScene';
import GoldenTreeIcon from './GoldenTreeIcons';
import React, {useMemo, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {EXAMPLES, assessEvidence} from './evidenceTruthEngine.cjs';

const C = {bg:P.bg,panel:P.panel,border:P.line,gold:P.gold,light:P.text,muted:P.muted,green:P.green,amber:P.amber,red:P.red};
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
    <View style={s.hero} testID="evidence-night-forest-banner">
      <NightForestScene height={218} scene="evidence"/>
      <View style={s.heroOverlay}>
       <GoldenTreeIcon name="Knowledge" size={39} color={P.gold}/>
       <Text style={s.heroTitle}>Evidence &amp; Truth</Text>
       <Text style={s.heroSub}>Separate facts, feelings, interpretations and uncertainty.</Text>
       <Text style={s.heroNote}>A guided reflection, not a verdict. Your decisions remain yours.</Text>
      </View>
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
  hero:{backgroundColor:'#0B2427',borderColor:C.gold,borderWidth:1,borderRadius:21,marginBottom:15,overflow:'hidden'},
  heroOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,padding:17,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(2,20,21,.21)'},
  eyebrow:{color:C.gold,fontSize:10,fontWeight:'900',letterSpacing:1.2,textAlign:'center'},
  symbol:{color:C.gold,fontSize:23,marginTop:8},
  heroTitle:{color:C.light,fontSize:31,fontFamily:'ESSHeading',textAlign:'center',lineHeight:42,marginTop:6,textShadowColor:'#03151D',textShadowRadius:6},
  heroSub:{color:C.text||C.light,fontSize:15,lineHeight:22,textAlign:'center',marginTop:7,textShadowColor:'#03151D',textShadowRadius:6},
  heroNote:{color:C.muted,fontSize:12,textAlign:'center',marginTop:9,lineHeight:18},
  panel:{backgroundColor:C.panel,borderColor:C.border,borderWidth:1,borderRadius:19,padding:17,marginBottom:14},
  heading:{color:C.gold,fontSize:20,fontFamily:'ESSHeading',marginBottom:11},
  label:{color:C.light,fontWeight:'800',fontSize:13,marginTop:12,marginBottom:6},
  line:{borderTopWidth:1,borderTopColor:'#4E4935',paddingTop:6,marginTop:9},
  body:{color:C.light,fontSize:13,lineHeight:20},
  mini:{color:C.muted,fontSize:11,lineHeight:17,marginTop:6},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9},
  choice:{borderColor:'#84683D',borderWidth:1,backgroundColor:'#1C3029',borderRadius:12,paddingVertical:10,paddingHorizontal:11,minHeight:41,justifyContent:'center'},
  active:{backgroundColor:C.gold,borderColor:C.gold},
  choiceText:{color:C.light,fontSize:12,fontWeight:'800'},
  input:{backgroundColor:C.bg,borderColor:C.border,borderWidth:1,borderRadius:15,padding:14,color:C.light,fontSize:16,minHeight:125,lineHeight:25},
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

Object.assign(s,presentationStyles(s,false));
