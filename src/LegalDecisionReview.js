import React, {useState} from 'react';
import {View,Text,Pressable,TextInput,StyleSheet,Linking} from 'react-native';
import {SOURCES,emptyLegalReview} from './legalDecisionReview';

function Button({label,onPress,selected=false,expanded}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{selected,...(expanded===undefined?{}:{expanded})}} onPress={onPress} style={[styles.button,selected&&styles.selected]}><Text style={[styles.buttonText,selected&&{color:'#152919'}]}>{label}</Text></Pressable>;
}
function Field({label,value,onChangeText}) {
  return <View><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} multiline value={value} onChangeText={onChangeText} placeholder="Optional · write in your own words…" placeholderTextColor="#879890" textAlignVertical="top" style={styles.input}/></View>;
}
export function LegalReviewFields({value,onChange}) {
  const legal={...emptyLegalReview(),...value};
  const change=(key,next)=>onChange({...legal,[key]:next});
  return <View style={styles.card}>
    <Text style={styles.title}>Know your rights · Leave with a purpose</Text>
    <Text style={styles.body}>Bring your observations, uncertainties and next step together. Select where the event happened to see the relevant information available in this app.</Text>
    <Text style={styles.label}>Where did the event happen?</Text>
    <View style={styles.wrap}>{['Western Australia','Elsewhere','Unsure'].map(item=><Button key={item} label={'Review jurisdiction · '+item} selected={legal.jurisdiction===item} onPress={()=>change('jurisdiction',item)}/>)}</View>
    <Text style={styles.body}>The assessment’s location setting is not confirmation of where an event happened. This review currently provides WA legal information; other locations need local advice.</Text>
    <Field label="Event date or time · mark uncertainty" value={legal.when} onChangeText={text=>change('when',text)}/>
    <Field label="Statements I was told · who said what and when" value={legal.statements} onChangeText={text=>change('statements',text)}/>
    <Field label="My question for a qualified adviser" value={legal.question} onChangeText={text=>change('question',text)}/>
    <Field label="A boundary I can honour" value={legal.boundary} onChangeText={text=>change('boundary',text)}/>
    <Field label="When I will review or ask for help" value={legal.checkIn} onChangeText={text=>change('checkIn',text)}/>
  </View>;
}
export default function LegalDecisionReview({report}) {
  const [expanded,setExpanded]=useState({});
  const [notice,setNotice]=useState('');
  const open=async url=>{
    setNotice('');
    try {await Linking.openURL(url);} catch {setNotice('Could not open this link. Copy the displayed URL or dial the displayed number manually.');}
  };
  const toggle=key=>setExpanded(old=>({...old,[key]:!old[key]}));
  return <View style={styles.card}>
    <Text style={styles.title}>My facts, rights and decision review</Text>
    <Text style={styles.body}>{report.locationNote}</Text>
    <Text style={styles.source}>{report.dateNote}</Text>
    <Text style={styles.body}>{report.limit}</Text>
    <View style={styles.priority}><Text style={styles.body}>{report.safetyNote}</Text></View>
    <Text style={styles.heading}>What I have recorded</Text>
    <Text style={styles.body}>Tap a category to read its source and limits. Nothing here is automatically certified as truth.</Text>
    {report.sections.map((section,index)=><View key={section.title}>
      <Button label={section.title} expanded={!!expanded[index]} onPress={()=>toggle(index)}/>
      {expanded[index]&&<Text selectable style={styles.body}>{section.body}</Text>}
    </View>)}
    <Text style={styles.heading}>Legal information to check</Text>
    {report.topics.map(topic=><View key={topic.id} style={styles.topic}>
      <Button label={topic.title} expanded={!!expanded[topic.id]} onPress={()=>toggle(topic.id)}/>
      <Text style={styles.source}>Why shown: {topic.why}</Text>
      {expanded[topic.id]&&<>
        <Text style={styles.body}>{topic.text}</Text>
        <Button label={'Read source · '+topic.source.title} onPress={()=>open(topic.source.url)}/>
        <Text selectable style={styles.source}>{topic.source.url}</Text>
        {topic.source.version&&<Text style={styles.source}>{topic.source.version}</Text>}
      </>}
    </View>)}
    <Text style={styles.heading}>Questions for qualified advice</Text>
    {report.questions.map((question,index)=><Text key={index} selectable style={styles.body}>{index+1}. {question}</Text>)}
    {report.wa&&<>
      <Button label="Legal Aid WA · 1300 650 579" onPress={()=>open('tel:1300650579')}/>
      <Button label="Read Legal Aid WA help options" onPress={()=>open(SOURCES.advice.url)}/>
      <Text selectable style={styles.source}>{SOURCES.advice.url}</Text>
      {report.child&&<><Button label="Ask WA Child Protection · 1800 273 889" onPress={()=>open('tel:1800273889')}/><Button label="Read child-safety support source" onPress={()=>open(SOURCES.child.url)}/><Text selectable style={styles.source}>{SOURCES.child.url}</Text></>}
    </>}
    <Text style={styles.source}>Links open only when you tap. Phone links open the dialler; you choose whether to call. Your writing is not sent with these links.</Text>
    {!!notice&&<Text accessibilityLiveRegion="polite" style={styles.body}>{notice}</Text>}
    <Text style={styles.heading}>My self-directed decision</Text>
    {report.decisions.map(item=><View key={item.title}><Text style={styles.label}>{item.title}</Text><Text selectable style={styles.body}>{item.body}</Text></View>)}
    <View style={styles.encouragement}><Text style={styles.heading}>Encouragement</Text><Text selectable style={styles.body}>{report.encouragement}</Text></View>
  </View>;
}
const styles=StyleSheet.create({
  card:{backgroundColor:'#071b16',borderWidth:1,borderColor:'#967239',borderRadius:20,padding:18,marginBottom:18},
  title:{fontSize:22,fontWeight:'900',color:'#FFE29A',marginVertical:10},heading:{fontSize:19,fontWeight:'800',color:'#FFE29A',marginTop:20,marginBottom:7},
  body:{fontSize:15,lineHeight:23,color:'#D5E0D6',marginVertical:7},source:{fontSize:12,lineHeight:19,color:'#A9BEC5',marginVertical:7},
  label:{fontSize:15,fontWeight:'700',color:'#FFF7E3',marginTop:15,marginBottom:8},input:{borderWidth:1,borderColor:'#5b796a',borderRadius:12,minHeight:82,padding:12,color:'#FFF7E3',fontSize:16,backgroundColor:'#07141c'},
  button:{borderWidth:1,borderColor:'#b28a3d',borderRadius:12,padding:13,marginVertical:5,backgroundColor:'#123127',minHeight:46},buttonText:{color:'#FFE29A',fontWeight:'700',fontSize:14,textAlign:'center'},selected:{backgroundColor:'#FFBD32'},wrap:{flexDirection:'row',flexWrap:'wrap',gap:8},
  priority:{borderLeftWidth:3,borderColor:'#FFBD32',paddingLeft:12,marginVertical:12},topic:{borderBottomWidth:1,borderBottomColor:'#365748',paddingBottom:12,marginTop:7},
  encouragement:{borderWidth:1,borderColor:'#70AC95',backgroundColor:'#123127',borderRadius:14,padding:14,marginTop:18}
});
