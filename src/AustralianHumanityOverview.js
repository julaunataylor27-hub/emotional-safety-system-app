import React,{useState} from 'react';
import {View,Text,Image,Pressable,StyleSheet} from 'react-native';
import {P,presentationStyles} from './PresentationTheme';
import {SCENES} from './theme/AustralianHumanityTheme';

const PAGES=[
 ['Why it exists','Knowledge creates choice.','An educational prevention concept informed by lived experience, built to help people explore emotions, boundaries and respectful relationships.',SCENES.home],
 ['How it works','Notice. Question. Learn. Choose.','Explore a feeling, describe an experience, review six safety signals, separate observations from assumptions, and consider support.',SCENES.emotionalSafety],
 ['What has been built','From an idea to a working prototype.','Explore assessments, Evidence & Truth, guided learning trails, cultural inquiry, My Humanity Journey, Two Flames and support services.',SCENES.knowledge],
 ['Live demonstration','See how the sections connect.','Open the working modules below. Use a fictional example during presentations rather than someone’s private experience.',SCENES.evidence],
 ['Boundaries & safeguards','Human judgement stays central.','This is an educational prototype. It does not establish guilt, diagnose anyone, certify safety, or replace qualified professional and emergency services.',SCENES.support],
 ['Next steps','Stronger people. Stronger communities.','Seek Aboriginal community guidance, research partnerships, accessible design review and independent privacy, legal and safeguarding evaluation.',SCENES.culture]
];
const DESTINATIONS=[
 ['Explore a situation','assessment'],['Evidence & Truth','evidence'],
 ['My Humanity Journey','journey'],['Knowledge & Culture','learn'],
 ['Two Flames','twoFlames'],['Support Services','support']
];
export default function AustralianHumanityOverview({onNavigate,onBack}){
 const [step,setStep]=useState(0);
 const page=PAGES[step];
 return <View testID="humanity-presentation-overview" style={s.root}>
  <Pressable testID="overview-return-home" accessibilityRole="button" onPress={onBack} style={s.back}>
   <Text style={s.backText}>‹  HOME</Text>
  </Pressable>
  <Text style={s.eyebrow}>AUSTRALIAN HUMANITY · PROTOTYPE OVERVIEW</Text>
  <View style={s.hero}>
   <Image accessible={false} source={page[3]} resizeMode="cover" style={s.image}/>
   <View pointerEvents="none" style={s.overlay}/>
   <View style={s.heroCopy}>
    <Text style={s.counter}>{step+1} / {PAGES.length}</Text>
    <Text accessibilityRole="header" style={s.title}>{page[0]}</Text>
    <Text style={s.strap}>{page[1]}</Text>
   </View>
  </View>
  <View style={s.dots}>
   {PAGES.map((item,i)=><Pressable key={i} testID={'overview-step-'+i}
     accessibilityRole="button" accessibilityLabel={'Show '+item[0]}
     accessibilityState={{selected:i===step}} onPress={()=>setStep(i)}
     style={[s.dot,i===step&&s.dotSelected]}/>)}
  </View>
  <View style={s.card}><Text style={s.body}>{page[2]}</Text></View>
  {step===3&&<View style={s.options}>
   <Text style={s.subhead}>OPEN A WORKING SECTION</Text>
   {DESTINATIONS.map(([label,route])=><Pressable key={route}
     testID={'overview-open-'+route} accessibilityRole="button" accessibilityLabel={label}
     onPress={()=>onNavigate(route)} style={s.option}>
     <Text style={s.optionText}>{label}</Text><Text style={s.arrow}>›</Text>
   </Pressable>)}
  </View>}
  <View style={s.actions}>
   <Pressable testID="overview-previous" accessibilityRole="button"
     accessibilityState={{disabled:step===0}} disabled={step===0}
     onPress={()=>setStep(x=>Math.max(0,x-1))} style={[s.outline,step===0&&s.disabled]}>
      <Text style={s.outlineText}>‹ Previous</Text>
   </Pressable>
   <Pressable testID="overview-next" accessibilityRole="button"
     onPress={()=>step===PAGES.length-1?onBack():setStep(x=>x+1)} style={s.primary}>
    <Text style={s.primaryText}>{step===PAGES.length-1?'Finish':'Next ›'}</Text>
   </Pressable>
  </View>
  <Text style={s.note}>Educational prototype · Cultural collaboration is essential · Not a diagnostic or legal decision tool</Text>
 </View>;
}
const s=StyleSheet.create({
 root:{width:'100%',paddingBottom:20},back:{alignSelf:'flex-start',minHeight:48,justifyContent:'center'},
 backText:{color:P.gold,fontSize:16,fontWeight:'700'},eyebrow:{color:P.gold,fontSize:12,fontWeight:'800',letterSpacing:0.8,marginBottom:14},
 hero:{height:300,borderRadius:20,overflow:'hidden',borderWidth:1,borderColor:P.line,justifyContent:'flex-end'},
 image:{position:'absolute',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%'},
 overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,12,20,0.53)'},
 heroCopy:{padding:20},counter:{color:P.gold,fontSize:13,fontWeight:'800',letterSpacing:1},
 title:{color:P.text,fontSize:30,lineHeight:39,fontFamily:'ESSHeading',marginTop:10},
 strap:{color:P.text,fontSize:19,lineHeight:27,marginTop:8,fontWeight:'600'},
 dots:{flexDirection:'row',gap:8,marginVertical:18},dot:{flex:1,height:9,borderRadius:5,backgroundColor:P.line},
 dotSelected:{backgroundColor:P.gold},card:{backgroundColor:P.panel,borderWidth:1,borderColor:P.line,borderRadius:18,padding:20},
 body:{fontSize:17,lineHeight:27,color:P.text},options:{gap:9,marginTop:20},subhead:{fontSize:13,fontWeight:'800',color:P.gold,letterSpacing:0.7},
 option:{minHeight:52,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:P.line,borderRadius:14,backgroundColor:P.panel,paddingHorizontal:15},
 optionText:{flex:1,fontSize:16,color:P.text},arrow:{fontSize:27,color:P.gold},
 actions:{flexDirection:'row',gap:10,marginTop:20},
 outline:{flex:1,minHeight:54,borderWidth:1,borderColor:P.line,borderRadius:13,alignItems:'center',justifyContent:'center'},
 disabled:{opacity:0.4},outlineText:{fontSize:16,color:P.text,fontWeight:'700'},
 primary:{flex:1,minHeight:54,backgroundColor:P.gold,borderRadius:13,alignItems:'center',justifyContent:'center'},
 primaryText:{fontSize:16,fontWeight:'800',color:P.bg},note:{fontSize:13,lineHeight:21,textAlign:'center',color:P.muted,marginTop:18}
});


// UNIFIED_THEME_V4
Object.assign(s,presentationStyles(s));
