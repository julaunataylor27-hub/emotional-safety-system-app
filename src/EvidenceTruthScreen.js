// FULL_NEW_THEME_V5
import {AppText as Text,AppInput as TextInput} from './AppPreferences';
import {P} from './PresentationTheme';
import {SCENES} from './theme/AustralianHumanityTheme';
import GoldenTreeIcon from './GoldenTreeIcons';
import React,{useMemo,useState} from 'react';
import {View,Pressable,StyleSheet,Image} from 'react-native';
import {EXAMPLES,assessEvidence} from './evidenceTruthEngine.cjs';

const FIRST_EXAMPLE=EXAMPLES[1];

function Chip({label,onPress,active}){
 return <Pressable accessibilityRole="button" accessibilityState={{selected:!!active}} accessibilityLabel={label}
  onPress={onPress} style={[s.chip,active&&s.chipOn]}>
  <Text style={[s.chipText,active&&s.chipTextOn]}>{label}</Text>
 </Pressable>;
}
function Insight({icon,title,body,accent=P.gold}){
 return <View style={s.insight}>
  <View style={[s.insightIcon,{borderColor:accent}]}><GoldenTreeIcon name={icon} size={22} color={accent}/></View>
  <View style={{flex:1}}><Text style={s.insightTitle}>{title}</Text><Text selectable style={s.insightBody}>{body}</Text></View>
 </View>;
}

export default function EvidenceTruthScreen({onBack,onSupport}){
 const [text,setText]=useState(FIRST_EXAMPLE.text);
 const [exampleId,setExampleId]=useState(FIRST_EXAMPLE.id);
 const [feeling,setFeeling]=useState('Not specified');
 const result=useMemo(()=>assessEvidence({text,feeling,exampleId}),[text,feeling,exampleId]);
 const levelColor=result.kind==='danger'||result.kind==='coercion'?P.red:result.kind==='pressure'?P.amber:result.kind==='healthy'?P.green:P.muted;

 return <View>
  <View style={s.topLine}>
   <Pressable accessibilityRole="button" accessibilityLabel="Back to home" onPress={onBack} style={s.back}>
    <GoldenTreeIcon name="Back" size={19} color={P.text}/><Text style={s.backText}>Back</Text>
   </Pressable>
   <View style={s.pageMark}><GoldenTreeIcon name="Knowledge" size={20} color={P.gold}/><Text style={s.pageMarkText}>EVIDENCE & TRUTH</Text></View>
  </View>

  <View style={s.intro} testID="evidence-night-forest-banner">
   <Image source={SCENES.evidence} resizeMode="cover" style={s.introArt} accessible={false}/>
   <View style={s.introShade}/>
   <View style={s.introCopy}>
    <Text style={s.kicker}>SORT WHAT’S KNOWN FROM WHAT’S ASSUMED</Text>
    <Text style={s.title}>Evidence & Truth</Text>
    <Text style={s.lead}>A guided reflection that keeps feelings, reports, interpretations and uncertainty separate.</Text>
    <View style={s.controlPill}><Text style={s.controlPillText}>Your decisions remain yours.</Text></View>
   </View>
  </View>

  <View style={s.card}>
   <Text style={s.step}>STEP 1</Text>
   <Text style={s.heading}>Try a fictional example</Text>
   <Text style={s.body}>Choose one, then change the wording to see how the system responds.</Text>
   <View style={s.wrap}>{EXAMPLES.map(item=><Chip key={item.id} label={item.title} active={exampleId===item.id}
    onPress={()=>{setText(item.text);setExampleId(item.id);setFeeling('Not specified');}}/>)}</View>
   <Text style={s.label}>What was said or done?</Text>
   <TextInput accessibilityLabel="Describe the situation" multiline maxLength={2500} textAlignVertical="top" value={text}
    onChangeText={v=>{setText(v);setExampleId('');}}
    placeholder="Write only what you feel comfortable sharing. Avoid names and addresses."
    placeholderTextColor={P.muted} style={s.input}/>
   <Text style={s.note}>Changing the text switches to an unverified custom example.</Text>
   <Text style={s.label}>Optional feeling</Text>
   <View style={s.wrap}>{['Not specified','Okay','Overwhelmed','Confused','Worried','Scared'].map(item=>
    <Chip key={item} label={item} active={feeling===item} onPress={()=>setFeeling(item)}/>)}</View>
  </View>

  <View style={s.resultHeader}>
   <View style={[s.statusDot,{backgroundColor:levelColor}]}/>
   <View style={{flex:1}}><Text style={s.resultKicker}>ESS REFLECTION</Text><Text style={[s.resultTitle,{color:levelColor}]}>{result.title}</Text></View>
   <Text style={s.resultTier}>{result.tier}</Text>
  </View>

  <View style={s.insights}>
   <Insight icon="Humanity" title="Protection" body={result.protection} accent={P.green}/>
   <Insight icon="Love" title="Emotional safety" body={result.emotionalSafety} accent={P.red}/>
   <Insight icon="Knowledge" title="Truth & evidence" body={result.truth} accent={P.teal}/>
   <Insight icon="Journey" title="Freedom of choice" body={result.choice} accent={P.gold}/>
  </View>

  <View style={s.card}>
   <Text style={s.step}>STEP 2</Text><Text style={s.heading}>Separate what is known</Text>
   <View style={s.factBox}><Text style={s.factLabel}>REPORTED — NOT INDEPENDENTLY VERIFIED</Text><Text style={s.factText}>{result.reported}</Text></View>
   <View style={s.factBox}><Text style={s.factLabel}>FEELING — REPORTED, NOT ASSUMED</Text><Text style={s.factText}>{result.feelings}</Text></View>
   <View style={s.interpretBox}><Text style={s.factLabel}>POSSIBLE INTERPRETATION</Text><Text style={s.factText}>{result.interpretation}</Text></View>
   <Text style={s.listTitle}>Still uncertain</Text>
   {result.unknowns.map((item,i)=><Text key={i} style={s.bullet}>• {item}</Text>)}
   <Text style={s.listTitle}>Possible risks — not predictions</Text>
   {result.risks.map((item,i)=><Text key={i} style={s.bullet}>• {item}</Text>)}
  </View>

  <View style={s.card}>
   <Text style={s.step}>STEP 3</Text><Text style={s.heading}>Choose your next step</Text>
   {result.options.map((item,i)=><View key={i} style={s.optionRow}><View style={s.optionNum}><Text style={s.optionNumText}>{i+1}</Text></View><Text style={s.optionText}>{item}</Text></View>)}
   {result.urgent&&<View style={s.urgent}><Text style={s.urgentText}>If this is happening now, move to safety if possible. In Australia call 000 for immediate danger.</Text></View>}
   <Pressable accessibilityRole="button" accessibilityLabel="Open support resources" onPress={onSupport} style={s.support}>
    <Text style={s.supportText}>Open support resources</Text><GoldenTreeIcon name="Arrow" size={20} color={P.bg}/>
   </Pressable>
  </View>

  <View style={s.transparency}>
   <Text style={s.transparencyTitle}>How this screen works</Text>
   <Text style={s.transparencyText}>{result.method} It does not verify accusations, determine consent, diagnose anyone or give legal findings.</Text>
   <Text style={s.transparencyText}>Privacy: this screen does not upload or automatically save your writing. Avoid identifying details on shared devices.</Text>
  </View>
 </View>;
}

const s=StyleSheet.create({
 topLine:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:14},
 back:{minHeight:44,paddingHorizontal:12,borderRadius:14,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,flexDirection:'row',alignItems:'center',gap:7},
 backText:{color:P.text,fontSize:13,fontWeight:'700'},pageMark:{flexDirection:'row',alignItems:'center',gap:7},
 pageMarkText:{color:P.gold,fontSize:10.5,fontWeight:'800',letterSpacing:1},
 intro:{height:260,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:P.line,marginBottom:16,backgroundColor:P.panel},
 introArt:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},introShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,6,9,.55)'},
 introCopy:{flex:1,padding:20,justifyContent:'flex-end'},kicker:{color:P.gold,fontSize:10,fontWeight:'800',letterSpacing:1.15},
 title:{color:P.text,fontSize:32,lineHeight:39,fontWeight:'700',marginTop:5},lead:{color:'#EEE8DD',fontSize:15,lineHeight:23,marginTop:7},
 controlPill:{alignSelf:'flex-start',marginTop:12,paddingHorizontal:11,paddingVertical:7,borderRadius:999,backgroundColor:'rgba(10,16,21,.78)',borderWidth:1,borderColor:'rgba(221,174,69,.55)'},
 controlPillText:{color:P.gold,fontSize:11,fontWeight:'700'},
 card:{backgroundColor:P.panel,borderWidth:1,borderColor:P.line,borderRadius:20,padding:17,marginBottom:14},
 step:{color:P.gold,fontSize:10.5,fontWeight:'800',letterSpacing:1.25},heading:{color:P.text,fontSize:20,lineHeight:27,fontWeight:'700',marginTop:4},
 body:{color:P.muted,fontSize:14,lineHeight:21,marginTop:7},wrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:12},
 chip:{minHeight:42,borderRadius:999,borderWidth:1,borderColor:P.line,backgroundColor:P.panel2,paddingHorizontal:12,paddingVertical:9,justifyContent:'center'},
 chipOn:{backgroundColor:P.gold,borderColor:P.gold},chipText:{color:P.text,fontSize:12.5,fontWeight:'700'},chipTextOn:{color:P.bg},
 label:{color:P.text,fontSize:13,fontWeight:'700',marginTop:15,marginBottom:7},input:{minHeight:126,borderRadius:16,borderWidth:1,borderColor:P.line,backgroundColor:'#050A0F',padding:14,color:P.text,fontSize:16,lineHeight:24},
 note:{color:P.muted,fontSize:11.5,lineHeight:18,marginTop:6},
 resultHeader:{minHeight:80,borderRadius:18,borderWidth:1,borderColor:P.line,backgroundColor:'#071118',padding:15,flexDirection:'row',alignItems:'center',gap:11,marginBottom:10},
 statusDot:{width:12,height:12,borderRadius:6},resultKicker:{color:P.muted,fontSize:10,fontWeight:'800',letterSpacing:1},resultTitle:{fontSize:17,lineHeight:23,fontWeight:'800',marginTop:2},
 resultTier:{color:P.muted,fontSize:11.5},insights:{gap:9,marginBottom:14},insight:{minHeight:96,borderRadius:18,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,padding:14,flexDirection:'row',gap:12},
 insightIcon:{width:44,height:44,borderRadius:22,borderWidth:1,backgroundColor:P.panel2,alignItems:'center',justifyContent:'center'},insightTitle:{color:P.text,fontSize:15,fontWeight:'800'},insightBody:{color:P.muted,fontSize:13,lineHeight:20,marginTop:4},
 factBox:{borderRadius:15,backgroundColor:'#08141C',borderWidth:1,borderColor:P.line,padding:13,marginTop:10},interpretBox:{borderRadius:15,backgroundColor:'rgba(201,139,53,.12)',borderWidth:1,borderColor:P.amber,padding:13,marginTop:10},
 factLabel:{color:P.gold,fontSize:9.5,fontWeight:'800',letterSpacing:.8},factText:{color:P.text,fontSize:13,lineHeight:20,marginTop:5},
 listTitle:{color:P.text,fontSize:13.5,fontWeight:'800',marginTop:16,marginBottom:5},bullet:{color:P.muted,fontSize:13,lineHeight:20,marginVertical:2},
 optionRow:{minHeight:64,borderRadius:15,backgroundColor:P.panel2,borderWidth:1,borderColor:P.line,padding:12,marginTop:9,flexDirection:'row',alignItems:'center',gap:11},
 optionNum:{width:30,height:30,borderRadius:15,backgroundColor:'rgba(221,174,69,.14)',alignItems:'center',justifyContent:'center'},optionNumText:{color:P.gold,fontSize:12,fontWeight:'800'},optionText:{flex:1,color:P.text,fontSize:13.5,lineHeight:20},
 urgent:{borderRadius:15,backgroundColor:'rgba(201,90,84,.15)',borderWidth:1,borderColor:P.red,padding:13,marginTop:11},urgentText:{color:'#F6D5D2',fontSize:13,lineHeight:20,fontWeight:'700'},
 support:{minHeight:52,borderRadius:15,backgroundColor:P.gold,marginTop:13,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 supportText:{color:P.bg,fontSize:14,fontWeight:'800'},transparency:{borderRadius:16,borderWidth:1,borderColor:P.line,backgroundColor:'#050A0F',padding:14,marginBottom:12},
 transparencyTitle:{color:P.gold,fontSize:12.5,fontWeight:'800'},transparencyText:{color:P.muted,fontSize:11.5,lineHeight:18,marginTop:6}
});
