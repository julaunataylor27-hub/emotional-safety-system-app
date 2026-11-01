import React,{useMemo,useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,TextInput,Pressable,StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {T} from './src/theme';
import {processSituation} from './src/core/essCore.cjs';

const TABS=[
  ['home','Home'],
  ['journal','Journal'],
  ['learn','Learn'],
  ['support','Support'],
  ['more','More']
];

function Button({label,onPress,primary=false}){
 return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
  style={[s.button,primary&&s.buttonPrimary]}>
  <Text style={[s.buttonText,primary&&s.buttonPrimaryText]}>{label}</Text>
 </Pressable>;
}

function Shell({screen,setScreen,children}){
 return <SafeAreaView style={s.safe}>
  <StatusBar style="light"/>
  <View style={s.header}>
   <View style={s.mark}><Text style={s.markText}>ESS</Text></View>
   <View style={{flex:1}}>
    <Text style={s.brand}>Emotional Safety System</Text>
    <Text style={s.brandSub}>v2 clean rebuild</Text>
   </View>
  </View>
  <ScrollView contentContainerStyle={s.content}>{children}</ScrollView>
  <View style={s.nav}>
   {TABS.map(([id,label])=><Pressable key={id} accessibilityRole="tab" accessibilityState={{selected:screen===id}}
    onPress={()=>setScreen(id)} style={s.navItem}>
    <Text style={[s.navText,screen===id&&s.navTextOn]}>{label}</Text>
    {screen===id&&<View style={s.navLine}/>}
   </Pressable>)}
  </View>
 </SafeAreaView>;
}

function Home({openCore,setScreen}){
 return <>
  <View style={s.hero}>
   <Text style={s.eyebrow}>NEW APP · CLEAN FOUNDATION</Text>
   <Text style={s.heroTitle}>Human on the surface. Rigorous underneath.</Text>
   <Text style={s.heroText}>ESS v2 starts fresh. The working logic stays; the old layouts and patch chain do not.</Text>
  </View>
  <View style={s.card}>
   <Text style={s.cardTitle}>ESS Core</Text>
   <Text style={s.body}>Separate emotion, reported information, interpretation, uncertainty, safety and choice.</Text>
   <Button label="Open ESS Core" onPress={openCore} primary/>
  </View>
  <View style={s.grid}>
   <Pressable style={s.tile} onPress={()=>setScreen('journal')}><Text style={s.tileTitle}>Journal</Text><Text style={s.tileSub}>Reflection and progress</Text></Pressable>
   <Pressable style={s.tile} onPress={()=>setScreen('learn')}><Text style={s.tileTitle}>Learn</Text><Text style={s.tileSub}>Knowledge trails</Text></Pressable>
   <Pressable style={s.tile} onPress={()=>setScreen('support')}><Text style={s.tileTitle}>Support</Text><Text style={s.tileSub}>Safety and services</Text></Pressable>
   <Pressable style={s.tile} onPress={()=>setScreen('more')}><Text style={s.tileTitle}>More</Text><Text style={s.tileSub}>About and settings</Text></Pressable>
  </View>
 </>;
}

function Core({onBack}){
 const [text,setText]=useState("He hasn't replied for 6 hours. I feel rejected and I think he doesn't care.");
 const result=useMemo(()=>processSituation({text,feeling:'Not specified'}),[text]);
 return <>
  <Button label="Back" onPress={onBack}/>
  <Text style={s.pageTitle}>ESS Core</Text>
  <Text style={s.pageLead}>Say what is happening in your own words. ESS separates the parts without deciding for you.</Text>
  <View style={s.card}>
   <Text style={s.label}>What is happening?</Text>
   <TextInput multiline value={text} onChangeText={setText} maxLength={2500}
    placeholder="Write only what you feel comfortable sharing." placeholderTextColor={T.muted}
    style={s.input} textAlignVertical="top"/>
  </View>
  <Result title="What you may be feeling" items={result.emotion.reported_or_detected}/>
  <Result title="What appears reported" items={result.evidence.reported_observations}/>
  <Result title="Possible interpretation" items={result.interpretation.possible_interpretations}/>
  <Result title="What is still uncertain" items={result.uncertainty.unknowns}/>
  <Result title="Choices remain yours" items={result.choice.options}/>
  <View style={s.card}>
   <Text style={s.cardTitle}>Next pathway</Text>
   <Text style={s.pathway}>{result.next_pathway.replaceAll('_',' → ')}</Text>
   <Text style={s.meta}>Architecture {result.decision_record.architecture_version} · Core {result.decision_record.core_version}</Text>
  </View>
 </>;
}

function Result({title,items}){
 return <View style={s.card}>
  <Text style={s.cardTitle}>{title}</Text>
  {items?.length?items.map((x,i)=><Text key={i} style={s.body}>• {x}</Text>):<Text style={s.meta}>Nothing identified yet.</Text>}
 </View>;
}

function Placeholder({title,body}){
 return <><Text style={s.pageTitle}>{title}</Text><View style={s.card}><Text style={s.body}>{body}</Text></View></>;
}

function AppRoot(){
 const [screen,setScreen]=useState('home');
 const [coreOpen,setCoreOpen]=useState(false);
 return <Shell screen={screen} setScreen={id=>{setCoreOpen(false);setScreen(id);}}>
  {coreOpen?<Core onBack={()=>setCoreOpen(false)}/>:
   screen==='home'?<Home openCore={()=>setCoreOpen(true)} setScreen={setScreen}/>:
   screen==='journal'?<Placeholder title="Journal" body="Fresh journal design will be built here without importing the v1 layout."/>:
   screen==='learn'?<Placeholder title="Learn" body="The verified learning content will be migrated here behind a brand-new v2 layout."/>:
   screen==='support'?<Placeholder title="Support" body="Support resources will be migrated here with a clean safety-first interface."/>:
   <Placeholder title="More" body="About, settings, research transparency and future tools will live here."/>}
 </Shell>;
}

export default function App(){return <SafeAreaProvider><AppRoot/></SafeAreaProvider>;}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:T.bg},header:{minHeight:72,paddingHorizontal:18,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:T.border},
 mark:{width:46,height:46,borderRadius:23,borderWidth:1,borderColor:T.gold,alignItems:'center',justifyContent:'center',backgroundColor:T.surface},
 markText:{color:T.gold,fontWeight:'900',fontSize:12},brand:{color:T.text,fontSize:18,fontWeight:'700'},brandSub:{color:T.muted,fontSize:12,marginTop:2},
 content:{padding:18,paddingBottom:28,maxWidth:720,width:'100%',alignSelf:'center'},hero:{paddingVertical:22,marginBottom:14},
 eyebrow:{color:T.gold,fontSize:10,fontWeight:'800',letterSpacing:1.2},heroTitle:{color:T.text,fontSize:31,lineHeight:39,fontWeight:'700',marginTop:8},
 heroText:{color:T.muted,fontSize:15,lineHeight:23,marginTop:10},card:{backgroundColor:T.surface,borderRadius:T.radius,borderWidth:1,borderColor:T.border,padding:16,marginBottom:12},
 cardTitle:{color:T.text,fontSize:17,fontWeight:'700',marginBottom:8},body:{color:T.text,fontSize:13.5,lineHeight:21,marginVertical:2},
 meta:{color:T.muted,fontSize:11.5,lineHeight:18,marginTop:6},button:{minHeight:46,borderRadius:14,borderWidth:1,borderColor:T.border,paddingHorizontal:15,alignItems:'center',justifyContent:'center',marginTop:10},
 buttonPrimary:{backgroundColor:T.gold,borderColor:T.gold},buttonText:{color:T.text,fontWeight:'700'},buttonPrimaryText:{color:T.bg},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:10},tile:{width:'48%',minHeight:100,borderRadius:T.radius,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,padding:14,justifyContent:'flex-end'},
 tileTitle:{color:T.text,fontSize:16,fontWeight:'700'},tileSub:{color:T.muted,fontSize:12,lineHeight:17,marginTop:4},
 pageTitle:{color:T.text,fontSize:27,fontWeight:'700',marginTop:16},pageLead:{color:T.muted,fontSize:14,lineHeight:21,marginTop:7,marginBottom:14},
 label:{color:T.text,fontSize:13,fontWeight:'700',marginBottom:8},input:{minHeight:130,borderRadius:14,borderWidth:1,borderColor:T.border,backgroundColor:T.bg,padding:13,color:T.text,fontSize:15,lineHeight:22},
 pathway:{color:T.gold,fontSize:15,fontWeight:'700'},nav:{flexDirection:'row',borderTopWidth:1,borderTopColor:T.border,backgroundColor:T.bg,paddingHorizontal:6,paddingBottom:6},
 navItem:{flex:1,minHeight:56,alignItems:'center',justifyContent:'center'},navText:{color:T.muted,fontSize:11},navTextOn:{color:T.gold,fontWeight:'700'},navLine:{position:'absolute',bottom:0,width:22,height:2,borderRadius:2,backgroundColor:T.gold}
});
