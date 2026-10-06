import React from 'react';
import {View,Text,TextInput,Pressable,StyleSheet} from 'react-native';
import {FEELINGS,BEHAVIOURS,MAX_PEOPLE,emptyPerson,toggleObservation} from './observedResponses';

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
      <Text style={styles.label}>What I saw or heard (optional)</Text>
      <TextInput accessibilityLabel={`Person ${index+1} observation note`} multiline maxLength={1000} textAlignVertical="top" value={person.details} onChangeText={value=>update(index,{details:value})} placeholder="Describe words or actions. Keep interpretations and unknowns separate." placeholderTextColor="#95A9B0" style={[styles.input,{minHeight:100}]}/>
      <Text style={styles.body}>Notes are shown with your results. Only the selected safety facts and behaviour labels enter the additional checks.</Text>
      {people.length>1&&<Pressable accessibilityRole="button" accessibilityLabel={`Remove person ${index+1}`} onPress={()=>onChange(people.filter((_,i)=>i!==index))} style={styles.pill}><Text style={styles.pillText}>Remove person {index+1}</Text></Pressable>}
    </View>)}
    {people.length<MAX_PEOPLE&&<Pressable accessibilityRole="button" onPress={()=>onChange([...people,emptyPerson()])} style={styles.pill}><Text style={styles.pillText}>+ Add another person</Text></Pressable>}
    <Text style={styles.body}>This record stays in this app session. Copy your observations before closing. Nothing here is shared automatically.</Text>
  </View>;
}
export function ObservedResponsesReadout({people}) {
  return <View>{people.map((person,index)=><View key={index} style={styles.card}>
    <Text style={styles.heading}>{person.name.trim()||`Person ${index+1}`}</Text>
    <Text style={styles.body}>Seemed: {person.feelings.join(', ')}</Text>
    <Text style={styles.body}>Observed behaviours: {person.behaviours.join(', ')}</Text>
    <Text style={styles.label}>Recorded observation</Text>
    <Text selectable style={styles.body}>{person.details.trim()||'No observation note entered.'}</Text>
  </View>)}</View>;
}
const styles=StyleSheet.create({
  heading:{fontSize:20,fontWeight:'800',color:'#FFE29A',marginVertical:12},body:{fontSize:15,lineHeight:23,color:'#CFDDE2',marginVertical:7},
  card:{borderWidth:1,borderColor:'#94783D',borderRadius:18,padding:14,marginVertical:12,backgroundColor:'#0A1C24'},
  label:{fontSize:16,fontWeight:'700',color:'#FFF5DE',marginTop:15,marginBottom:10},input:{borderWidth:1,borderColor:'#476271',borderRadius:12,padding:12,fontSize:16,color:'#F5F5E8',backgroundColor:'#081A22'},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:8},pill:{borderWidth:1,borderColor:'#476271',borderRadius:15,paddingHorizontal:15,paddingVertical:13,minHeight:48,backgroundColor:'#102C3C',marginVertical:3},
  selected:{borderColor:'#E4AD38',backgroundColor:'#1A4056'},pillText:{fontSize:15,fontWeight:'700',color:'#E1EAE8'}
});
