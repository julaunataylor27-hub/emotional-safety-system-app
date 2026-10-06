import React, {useState} from 'react';
import {View,Text,Pressable,Linking,StyleSheet} from 'react-native';

const CHILD_GUIDANCE='https://www.wa.gov.au/organisation/department-of-communities/concerns-the-safety-or-wellbeing-of-child-or-young-person';
const CRISIS_GUIDANCE='https://www.wa.gov.au/service/community-services/community-support/crisis-care';
export default function WaSupportCard() {
  const [notice,setNotice]=useState('');
  const open=async url=>{
    setNotice('');
    try {await Linking.openURL(url);}
    catch {setNotice('Could not open this link. You can dial the displayed number manually or copy a guidance link below.');}
  };
  const button=(label,url)=><Pressable accessibilityRole="button" accessibilityLabel={label} onPress={()=>open(url)} style={styles.button}><Text style={styles.buttonText}>{label}</Text></Pressable>;
  return <View style={styles.card}>
    <Text style={styles.title}>WA support choices</Text>
    <Text style={styles.body}>Tap a number to open your phone’s dialler. You decide whether to call. Your writing is not sent with these links.</Text>
    <Text style={styles.heading}>Child Protection · Central Intake</Text>
    <Text style={styles.body}>For concerns about a child’s wellbeing.</Text>
    {button('Child Protection · 1800 273 889','tel:1800273889')}
    <Text style={styles.heading}>Crisis Care · after hours</Text>
    <Text style={styles.body}>After-hours child-safety concerns and information or referrals for people experiencing crisis.</Text>
    {button('Crisis Care · 1800 199 008','tel:1800199008')}
    <Text style={styles.heading}>Life-threatening emergency</Text>
    {button('Emergency · 000','tel:000')}
    {button('Read WA child safety guidance',CHILD_GUIDANCE)}
    {button('Read WA Crisis Care guidance',CRISIS_GUIDANCE)}
    <Text selectable style={styles.source}>{CHILD_GUIDANCE}</Text>
    <Text selectable style={styles.source}>{CRISIS_GUIDANCE}</Text>
    <Text style={styles.source}>WA Government guidance checked 7 October 2026.</Text>
    {!!notice&&<Text accessibilityLiveRegion="polite" style={styles.body}>{notice}</Text>}
  </View>;
}
const styles=StyleSheet.create({
  card:{borderWidth:1,borderColor:'#94783D',borderRadius:18,padding:16,marginVertical:16,backgroundColor:'#0A1C24'},
  title:{fontSize:21,fontWeight:'800',color:'#FFE29A',marginBottom:8},heading:{fontSize:17,fontWeight:'700',color:'#FFF5DE',marginTop:15},
  body:{fontSize:15,lineHeight:23,color:'#CFDDE2',marginVertical:8},source:{fontSize:12,lineHeight:18,color:'#A9BEC5',marginTop:10},
  button:{borderWidth:1,borderColor:'#E4AD38',borderRadius:13,padding:13,minHeight:48,marginVertical:6,backgroundColor:'#173D4D'},buttonText:{fontSize:16,fontWeight:'700',color:'#FFF5DE',textAlign:'center'}
});
