import React,{useMemo,useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,TextInput,Pressable,StyleSheet,ImageBackground} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {T} from './src/theme';
import {processSituation} from './src/core/essCore.cjs';

const HOME_HERO=require('../assets/graphics/australian-humanity/home-hero.webp');

const TABS=[
  ['home','Home','⌂'],
  ['journal','Journal','✎'],
  ['learn','Learn','▤'],
  ['support','Support','♡'],
  ['more','More','•••']
];

function Button({label,onPress,primary=false}){
 return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
  style={({pressed})=>[s.button,primary&&s.buttonPrimary,pressed&&s.pressed]}>
  <Text style={[s.buttonText,primary&&s.buttonPrimaryText]}>{label}</Text>
 </Pressable>;
}

function Shell({screen,setScreen,children}){
 return <SafeAreaView style={s.safe}>
  <StatusBar style="light"/>
  <View style={s.header}>
   <View style={s.mark}><Text style={s.markText}>ESS</Text></View>
   <View style={s.brandWrap}>
    <Text style={s.brand}>Emotional Safety System</Text>
    <Text style={s.brandSub}>Australian Humanity</Text>
   </View>
   <View style={s.headerDot}/>
  </View>
  <ScrollView contentContainerStyle={s.content}>{children}</ScrollView>
  <View style={s.nav}>
   {TABS.map(([id,label,icon])=><Pressable key={id} accessibilityRole="tab" accessibilityState={{selected:screen===id}}
    onPress={()=>setScreen(id)} style={({pressed})=>[s.navItem,pressed&&s.pressed]}>
    <Text style={[s.navIcon,screen===id&&s.navTextOn]}>{icon}</Text>
    <Text style={[s.navText,screen===id&&s.navTextOn]}>{label}</Text>
    {screen===id&&<View style={s.navLine}/>}
   </Pressable>)}
  </View>
 </SafeAreaView>;
}

function HomeRow({title,subtitle,icon='›',accent=T.sand,onPress}){
 return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title}
  style={({pressed})=>[s.row,pressed&&s.pressed]}>
  <View style={[s.rowIcon,{borderColor:accent}]}><Text style={[s.rowIconText,{color:accent}]}>{icon}</Text></View>
  <View style={s.rowCopy}><Text style={s.rowTitle}>{title}</Text><Text style={s.rowSub}>{subtitle}</Text></View>
  <Text style={s.chevron}>›</Text>
 </Pressable>;
}

function Home({openCore,setScreen}){
 return <>
  <ImageBackground source={HOME_HERO} resizeMode="cover" style={s.hero} imageStyle={s.heroImage}>
   <View style={s.heroShade}/>
   <View style={s.heroContent}>
    <Text style={s.eyebrow}>EMOTIONAL SAFETY SYSTEM · V2</Text>
    <Text style={s.heroTitle}>Understand what’s happening. Keep your choices.</Text>
    <Text style={s.heroText}>A calm place to separate feelings, what appears known, what remains uncertain, and what you want to do next.</Text>
    <View style={s.heroMetaRow}>
     <Text style={s.heroMeta}>You stay in control</Text>
     <View style={s.heroMetaDot}/>
     <Text style={s.heroMeta}>No judgement</Text>
    </View>
    <Button label="Open ESS Core" onPress={openCore} primary/>
   </View>
  </ImageBackground>

  <Text style={s.sectionLabel}>EXPLORE</Text>
  <View style={s.stack}>
   <HomeRow title="Evidence & Truth" subtitle="Separate what appears known from what is assumed" icon="≋" accent={T.eucalyptus} onPress={openCore}/>
   <HomeRow title="Journal" subtitle="Reflect in your own words, without scores" icon="✎" onPress={()=>setScreen('journal')}/>
   <HomeRow title="Learning Trails" subtitle="Culture · history · emotional safety · research" icon="✦" onPress={()=>setScreen('learn')}/>
   <HomeRow title="Support" subtitle="Trusted information and human help when you want it" icon="+" accent={T.eucalyptus} onPress={()=>setScreen('support')}/>
  </View>

  <View style={s.statement}>
   <Text style={s.statementKicker}>DESIGN PRINCIPLE</Text>
   <Text style={s.statementText}>Human on the surface. Rigorous underneath.</Text>
  </View>
 </>;
}

function Core({onBack}){
 const [text,setText]=useState("He hasn't replied for 6 hours. I feel rejected and I think he doesn't care.");
 const [showTechnical,setShowTechnical]=useState(false);
 const result=useMemo(()=>processSituation({text,feeling:'Not specified'}),[text]);
 return <>
  <View style={s.pageTop}>
   <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={s.backButton}><Text style={s.backText}>‹</Text></Pressable>
   <View style={{flex:1}}><Text style={s.pageKicker}>ESS CORE</Text><Text style={s.pageTitle}>Understand this moment</Text></View>
  </View>
  <Text style={s.pageLead}>Write naturally. ESS separates the parts without deciding what another person meant or what you should believe.</Text>
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
  <Button label={showTechnical?'Hide technical details':'How ESS reached this'} onPress={()=>setShowTechnical(v=>!v)}/>
  {showTechnical&&<View style={[s.card,s.techCard]}>
   <Text style={s.techKicker}>RIGOROUS LAYER</Text>
   <Text style={s.body}>Pathway: {result.next_pathway.replaceAll('_',' → ')}</Text>
   <Text style={s.body}>Rules: {result.decision_record.rule_ids.join(' · ')}</Text>
   <Text style={s.body}>Verified event: no</Text>
   <Text style={s.body}>User control preserved: {result.decision_record.user_control_preserved?'yes':'no'}</Text>
   <Text style={s.meta}>Architecture {result.decision_record.architecture_version} · Core {result.decision_record.core_version}</Text>
  </View>}
 </>;
}

function Result({title,items}){
 return <View style={s.card}>
  <Text style={s.resultLabel}>{title}</Text>
  {items?.length?items.map((x,i)=><Text key={i} style={s.body}>• {x}</Text>):<Text style={s.meta}>Nothing identified yet.</Text>}
 </View>;
}

function Placeholder({kicker,title,body,rows=[]}){
 return <>
  <View style={s.pageTopNoBack}><Text style={s.pageKicker}>{kicker}</Text><Text style={s.pageTitle}>{title}</Text><Text style={s.pageLead}>{body}</Text></View>
  <View style={s.stack}>{rows.map((r,i)=><HomeRow key={i} {...r}/>)}</View>
 </>;
}

function AppRoot(){
 const [screen,setScreen]=useState('home');
 const [coreOpen,setCoreOpen]=useState(false);
 const navigate=id=>{setCoreOpen(false);setScreen(id);};
 return <Shell screen={screen} setScreen={navigate}>
  {coreOpen?<Core onBack={()=>setCoreOpen(false)}/>:
   screen==='home'?<Home openCore={()=>setCoreOpen(true)} setScreen={navigate}/>:
   screen==='journal'?<Placeholder kicker="JOURNAL" title="Your words stay yours." body="A calm reflection space without scores, pressure or forced meaning."
    rows={[{title:'New reflection',subtitle:'Write what matters now',icon:'✎'},{title:'Past reflections',subtitle:'Return to your own words when you choose',icon:'⌁',accent:T.eucalyptus}]}/>:
   screen==='learn'?<Placeholder kicker="LEARN" title="Follow curiosity, not clutter." body="Knowledge appears as clear trails instead of oversized stacked cards."
    rows={[{title:'Evidence & uncertainty',subtitle:'Facts · sources · interpretations · unknowns',icon:'≋',accent:T.eucalyptus},{title:'Culture & Country',subtitle:'History · community knowledge · context',icon:'⌁'},{title:'Emotional safety',subtitle:'Choice · boundaries · pressure · repair',icon:'◇'}]}/>:
   screen==='support'?<Placeholder kicker="SUPPORT" title="Help is available when you want it." body="Urgent styling appears only when a situation actually calls for it."
    rows={[{title:'Find support',subtitle:'Trusted services and human help',icon:'+',accent:T.eucalyptus},{title:'Understand your options',subtitle:'Information first · choice remains yours',icon:'i'}]}/>:
   <Placeholder kicker="MORE" title="Transparency lives here." body="Settings, system limits and research detail stay available without crowding the main experience."
    rows={[{title:'About ESS',subtitle:'Purpose · principles · limitations',icon:'i'},{title:'Research transparency',subtitle:'Rules · versions · testing · measures',icon:'◇',accent:T.eucalyptus},{title:'Preferences',subtitle:'Reading · motion · language · accessibility',icon:'⚙'}]}/>}
 </Shell>;
}

export default function App(){return <SafeAreaProvider><AppRoot/></SafeAreaProvider>;}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:T.bg},
 header:{minHeight:72,paddingHorizontal:18,paddingVertical:11,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:T.border,backgroundColor:T.bg},
 mark:{width:46,height:46,borderRadius:23,borderWidth:1,borderColor:T.sand,alignItems:'center',justifyContent:'center',backgroundColor:T.surface},
 markText:{color:T.sand,fontWeight:'900',fontSize:11,letterSpacing:1},brandWrap:{flex:1},brand:{color:T.text,fontSize:18,fontWeight:'700'},brandSub:{color:T.muted,fontSize:12,marginTop:2},
 headerDot:{width:8,height:8,borderRadius:4,backgroundColor:T.eucalyptus},
 content:{padding:16,paddingBottom:26,maxWidth:720,width:'100%',alignSelf:'center'},
 hero:{height:405,borderRadius:26,overflow:'hidden',borderWidth:1,borderColor:T.border,marginBottom:24,justifyContent:'flex-end'},
 heroImage:{borderRadius:26},heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(12,8,5,0.52)'},
 heroContent:{padding:20,justifyContent:'flex-end'},eyebrow:{color:T.sand,fontSize:10,fontWeight:'800',letterSpacing:1.4},
 heroTitle:{color:T.text,fontSize:31,lineHeight:38,fontWeight:'700',marginTop:7},heroText:{color:'#F0E2CF',fontSize:14.5,lineHeight:22,marginTop:9},
 heroMetaRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:12},heroMeta:{color:T.muted,fontSize:11.5},heroMetaDot:{width:4,height:4,borderRadius:2,backgroundColor:T.sand},
 sectionLabel:{color:T.sand,fontSize:10,fontWeight:'800',letterSpacing:1.4,marginBottom:9,marginLeft:2},stack:{gap:8},
 row:{minHeight:74,borderRadius:18,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,paddingHorizontal:13,paddingVertical:11,flexDirection:'row',alignItems:'center',gap:12},
 rowIcon:{width:46,height:46,borderRadius:23,borderWidth:1,backgroundColor:T.surface2,alignItems:'center',justifyContent:'center'},
 rowIconText:{fontSize:18,fontWeight:'700'},rowCopy:{flex:1,minWidth:0},rowTitle:{color:T.text,fontSize:15.5,fontWeight:'700'},rowSub:{color:T.muted,fontSize:12,lineHeight:17,marginTop:2},chevron:{color:T.sand,fontSize:23},
 statement:{marginTop:18,paddingVertical:16,borderTopWidth:1,borderBottomWidth:1,borderColor:T.border},
 statementKicker:{color:T.eucalyptus,fontSize:10,fontWeight:'800',letterSpacing:1.2},statementText:{color:T.text,fontSize:16,lineHeight:23,fontWeight:'700',marginTop:5},
 pageTop:{flexDirection:'row',alignItems:'center',gap:12,marginTop:4,marginBottom:8},pageTopNoBack:{marginTop:4,marginBottom:14},
 backButton:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,alignItems:'center',justifyContent:'center'},backText:{color:T.sand,fontSize:31,lineHeight:33},
 pageKicker:{color:T.sand,fontSize:10,fontWeight:'800',letterSpacing:1.4},pageTitle:{color:T.text,fontSize:27,lineHeight:34,fontWeight:'700',marginTop:4},pageLead:{color:T.muted,fontSize:14,lineHeight:21,marginTop:6,marginBottom:14},
 card:{backgroundColor:T.surface,borderRadius:T.radius,borderWidth:1,borderColor:T.border,padding:16,marginBottom:10},
 resultLabel:{color:T.sand,fontSize:10,fontWeight:'800',letterSpacing:1.1,textTransform:'uppercase',marginBottom:7},
 techCard:{borderColor:T.eucalyptus,backgroundColor:T.surface2},techKicker:{color:T.eucalyptus,fontSize:10,fontWeight:'800',letterSpacing:1.1,marginBottom:7},
 body:{color:T.text,fontSize:13.5,lineHeight:21,marginVertical:2},meta:{color:T.muted,fontSize:11.5,lineHeight:18,marginTop:6},
 button:{minHeight:48,borderRadius:15,borderWidth:1,borderColor:T.border,paddingHorizontal:15,alignItems:'center',justifyContent:'center',marginTop:10,backgroundColor:T.surface},
 buttonPrimary:{backgroundColor:T.sand,borderColor:T.sand},buttonText:{color:T.text,fontWeight:'700'},buttonPrimaryText:{color:T.bg},
 label:{color:T.text,fontSize:13,fontWeight:'700',marginBottom:8},input:{minHeight:140,borderRadius:15,borderWidth:1,borderColor:T.border,backgroundColor:T.bg,padding:13,color:T.text,fontSize:16,lineHeight:23},
 nav:{flexDirection:'row',borderTopWidth:1,borderTopColor:T.border,backgroundColor:T.bg,paddingHorizontal:5,paddingBottom:6,paddingTop:4},
 navItem:{flex:1,minHeight:58,alignItems:'center',justifyContent:'center',gap:3},navIcon:{color:T.muted,fontSize:16},navText:{color:T.muted,fontSize:10.5},navTextOn:{color:T.sand,fontWeight:'700'},navLine:{position:'absolute',bottom:0,width:22,height:2,borderRadius:2,backgroundColor:T.sand},
 pressed:{opacity:.72}
});
