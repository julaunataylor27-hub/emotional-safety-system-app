import React from 'react';
import {View,Text,TextInput,Pressable,StyleSheet} from 'react-native';
import {FEELINGS,BEHAVIOURS,MAX_PEOPLE,emptyPerson,toggleObservation} from './observedResponses';
import WaSupportCard from './WaSupportCard';

export default function ObservedResponsesForm({people,onChange}) {
  const update=(index,changes)=>onChange(people.map((person,i)=>i===index?{...person,...changes}:person));
  const choices=(index,field,options)=><View style={styles.wrap}>{options.map(value=><Pressable key={value} accessibilityRole="checkbox" accessibilityLabel={`Person ${index+1}, ${field}, ${value}`} accessibilityState={{checked:people[index][field].includes(value)}} onPress={()=>update(index,{[field]:toggleObservation(people[index][field],value,options)})} style={[styles.pill,people[index][field].includes(value)&&styles.selected]}><Text style={styles.pillText}>{value}</Text></Pressable>)}</View>;
  return <View>
    <Text style={styles.heading}>How did each person seem? (optional)</Text>
    <Text style={styles.body}>Choose all that apply for each person. These are your impressions, not verified feelings. Use Unknown when you cannot tell. Choosing Unknown clears that group of labels.</Text>
    {people.map((person,index)=><View key={index} style={styles.card}>
      <Text style={styles.heading}>Person {index+1}</Text>
      <Text style={styles.label}>Who is this? (optional)</Text>
      <TextInput accessibilityLabel={`Person ${index+1} label`} maxLength={80} value={person.name} onChangeText={value=>update(index,{name:value})} placeholder="For example: person affected" placeholderTextColor="#95A9B0" style={styles.input}/>
      <Text style={styles.label}>How they seemed · select multiple</Text>
      {choices(index,'feelings',FEELINGS)}
      <Text style={styles.label}>What I noticed · select multiple</Text>
      {choices(index,'behaviours',BEHAVIOURS)}
      <Text style={styles.body}>Being asleep or unresponsive is a capacity detail, not a feeling. Smiling, excitement or affection cannot establish consent.</Text>
      <Text style={styles.label}>When was this? (optional)</Text>
      <TextInput accessibilityLabel={`Person ${index+1} observation time`} maxLength={120} value={person.when||''} onChangeText={value=>update(index,{when:value})} placeholder="Date and time; write approximately if unsure" placeholderTextColor="#95A9B0" style={styles.input}/>
      <Text style={styles.label}>What I directly saw or heard (optional)</Text>
      <TextInput accessibilityLabel={`Person ${index+1} observation note`} multiline maxLength={1000} textAlignVertical="top" value={person.details} onChangeText={value=>update(index,{details:value})} placeholder="Describe words or actions. Keep interpretations and unknowns separate." placeholderTextColor="#95A9B0" style={[styles.input,{minHeight:100}]}/>
      <Text style={styles.body}>Record words and actions as you remember them. Use quotation marks only when you remember the exact words.</Text>
      <Text style={styles.label}>My interpretation (not confirmed)</Text>
      <TextInput accessibilityLabel={`Person ${index+1} interpretation note`} multiline maxLength={1000} textAlignVertical="top" value={person.interpretation||''} onChangeText={value=>update(index,{interpretation:value})} placeholder="What you think it might mean. Motives and family history may remain unknown." placeholderTextColor="#95A9B0" style={[styles.input,{minHeight:100}]}/>
      <Text style={styles.label}>What I still do not know</Text>
      <TextInput accessibilityLabel={`Person ${index+1} unknowns note`} multiline maxLength={1000} textAlignVertical="top" value={person.unknowns||''} onChangeText={value=>update(index,{unknowns:value})} placeholder="Details you cannot confirm or need help clarifying" placeholderTextColor="#95A9B0" style={[styles.input,{minHeight:100}]}/>
      <Text style={styles.body}>These notes are shown with your results. Interpretations are not treated as verified facts. Use the safety questions and main description for concerns you want the app to check.</Text>
      {people.length>1&&<Pressable accessibilityRole="button" accessibilityLabel={`Remove person ${index+1}`} onPress={()=>onChange(people.filter((_,i)=>i!==index))} style={styles.pill}><Text style={styles.pillText}>Remove person {index+1}</Text></Pressable>}
    </View>)}
    {people.length<MAX_PEOPLE&&<Pressable accessibilityRole="button" onPress={()=>onChange([...people,emptyPerson()])} style={styles.pill}><Text style={styles.pillText}>+ Add another person</Text></Pressable>}
    <View style={styles.card}>
      <Text style={styles.heading}>One manageable next step</Text>
      <Text style={styles.body}>Keep one dated record of your observations and uncertainties. You can ask for safeguarding advice without having to determine someone’s intentions or family history yourself. If you have already contacted a service and remain concerned, ask what additional firsthand information they need.</Text>
    </View>
    <WaSupportCard/>
    <Text style={styles.body}>This record stays in this app session. Copy your observations before closing. Nothing here is shared automatically.</Text>
  </View>;
}
export function ObservedResponsesReadout({people}) {
  return <View>{people.map((person,index)=><View key={index} style={styles.card}>
    <Text style={styles.heading}>{person.name.trim()||`Person ${index+1}`}</Text>
    <Text style={styles.body}>Seemed: {person.feelings.join(', ')}</Text>
    <Text style={styles.body}>Observed behaviours: {person.behaviours.join(', ')}</Text>
    <Text style={styles.label}>Recorded date / time</Text>
    <Text selectable style={styles.body}>{person.when?.trim()||'Not recorded.'}</Text>
    <Text style={styles.label}>Direct observation</Text>
    <Text selectable style={styles.body}>{person.details.trim()||'No observation note entered.'}</Text>
    <Text style={styles.label}>Interpretation · not confirmed</Text>
    <Text selectable style={styles.body}>{person.interpretation?.trim()||'No interpretation entered.'}</Text>
    <Text style={styles.label}>Still unknown</Text>
    <Text selectable style={styles.body}>{person.unknowns?.trim()||'No unknowns entered.'}</Text>
  </View>)}</View>;
}
const styles=StyleSheet.create({
  heading:{fontSize:20,fontWeight:'800',color:'#FFE29A',marginVertical:12},body:{fontSize:15,lineHeight:23,color:'#CFDDE2',marginVertical:7},
  card:{borderWidth:1,borderColor:'#94783D',borderRadius:18,padding:14,marginVertical:12,backgroundColor:'#0A1C24'},
  label:{fontSize:16,fontWeight:'700',color:'#FFF5DE',marginTop:15,marginBottom:10},input:{borderWidth:1,borderColor:'#476271',borderRadius:12,padding:12,fontSize:16,color:'#F5F5E8',backgroundColor:'#081A22'},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:8},pill:{borderWidth:1,borderColor:'#476271',borderRadius:15,paddingHorizontal:15,paddingVertical:13,minHeight:48,backgroundColor:'#102C3C',marginVertical:3},
  selected:{borderColor:'#E4AD38',backgroundColor:'#1A4056'},pillText:{fontSize:15,fontWeight:'700',color:'#E1EAE8'}
});
