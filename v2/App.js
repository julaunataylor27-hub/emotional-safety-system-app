import React,{useMemo,useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,TextInput,Pressable,StyleSheet,ImageBackground} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {T} from './src/theme';
import {processSituation} from './src/core/essCore.cjs';

// ADVERT_DESIGN_LOCKED: the approved 2027 advertising frame is the visual source of truth.
// The app must feel cinematic and premium on the surface while ESS Core remains rigorous underneath.
const ART={
 home:require('../assets/graphics/australian-humanity/home-hero.webp'),
 journal:require('../assets/graphics/australian-humanity/my-journey-bg.webp'),
 learn:require('../assets/graphics/australian-humanity/knowledge-card.webp'),
 support:require('../assets/graphics/australian-humanity/support-services-card.webp'),
 more:require('../assets/graphics/australian-humanity/culture-humanity-bg.webp'),
 evidence:require('../assets/graphics/australian-humanity/evidence-truth-card.webp'),
 emotional:require('../assets/graphics/australian-humanity/emotional-safety-card.webp')
};

const TABS=[
 ['home','Home','⌂'],
 ['journal','Journal','✎'],
 ['learn','Learn','▤'],
 ['support','Support','♡'],
 ['more','More','•••']
];

function Shell({screen,onTab,children}){
 return <SafeAreaView style={s.safe}>
  <StatusBar style="light"/>
  <View style={s.topBar}>
   <View style={s.wordmark}>
    <View style={s.mark}><Text style={s.markText}>ESS</Text></View>
    <View style={s.brandCopy}>
     <Text style={s.brand}>Emotional Safety System</Text>
     <Text style={s.brandSub}>AUSTRALIAN HUMANITY</Text>
    </View>
   </View>
   <View style={s.topActions}><Text style={s.action}>⌕</Text><Text style={s.action}>○</Text></View>
  </View>
  <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>
  <View style={s.nav}>
   {TABS.map(([id,label,icon])=><Pressable key={id} accessibilityRole="tab" accessibilityState={{selected:screen===id}}
    onPress={()=>onTab(id)} style={({pressed})=>[s.navItem,pressed&&s.pressed]}>
    <Text style={[s.navIcon,screen===id&&s.navOn]}>{icon}</Text>
    <Text style={[s.navText,screen===id&&s.navOn]}>{label}</Text>
    {screen===id&&<View style={s.navLine}/>}
   </Pressable>)}
  </View>
 </SafeAreaView>;
}

function CinematicHero({image,kicker,title,body,children,height=330,align='bottom'}){
 return <ImageBackground source={image} resizeMode="cover" style={[s.hero,{height}]} imageStyle={s.heroImage}>
  <View style={s.heroVignette}/>
  <View style={[s.heroCopy,align==='center'&&s.heroCenter]}>
   {!!kicker&&<Text style={s.kicker}>{kicker}</Text>}
   <Text style={s.heroTitle}>{title}</Text>
   {!!body&&<Text style={s.heroBody}>{body}</Text>}
   {children}
  </View>
 </ImageBackground>;
}

function Pill({children}){return <View style={s.pill}><Text style={s.pillText}>{children}</Text></View>}

function FeatureCard({title,subtitle,icon,accent,onPress,image}){
 const body=<>
   <View style={[s.featureIcon,{borderColor:accent}]}><Text style={[s.featureIconText,{color:accent}]}>{icon}</Text></View>
   <View style={s.featureCopy}><Text style={s.featureTitle}>{title}</Text><Text style={s.featureSub}>{subtitle}</Text></View>
   <Text style={s.featureArrow}>›</Text>
  </>;
 return <Pressable onPress={onPress} style={({pressed})=>[s.featureCard,pressed&&s.pressed]}>
  {image?<ImageBackground source={image} resizeMode="cover" style={s.featureImage} imageStyle={s.featureImageRadius}><View style={s.cardShade}/>{body}</ImageBackground>:body}
 </Pressable>
}

function Home({openCore,setScreen}){
 return <>
  <CinematicHero image={ART.home} kicker="GOOD EVENING" title="You’re in the right place."
   body="A calm place to understand what’s happening, keep your choices and decide what comes next." height={410}>
   <View style={s.heroMeta}><Pill>You stay in control</Pill><Pill>No judgement</Pill></View>
   <Pressable onPress={openCore} style={({pressed})=>[s.primary,pressed&&s.pressed]}>
    <Text style={s.primaryText}>Start a reflection</Text><Text style={s.primaryArrow}>→</Text>
   </Pressable>
  </CinematicHero>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>EXPLORE</Text><Text style={s.sectionHeading}>What do you need right now?</Text></View>
  <View style={s.homeGrid}>
   <Pressable style={s.homeTile} onPress={openCore}><Text style={[s.tileGlyph,{color:T.eucalyptus}]}>◒</Text><Text style={s.tileTitle}>Understand</Text><Text style={s.tileSub}>your situation</Text></Pressable>
   <Pressable style={s.homeTile} onPress={()=>setScreen('learn')}><Text style={[s.tileGlyph,{color:T.ochre}]}>▤</Text><Text style={s.tileTitle}>Learn</Text><Text style={s.tileSub}>and explore</Text></Pressable>
   <Pressable style={s.homeTile} onPress={()=>setScreen('support')}><Text style={[s.tileGlyph,{color:T.clay}]}>◉</Text><Text style={s.tileTitle}>Find support</Text><Text style={s.tileSub}>when needed</Text></Pressable>
   <Pressable style={s.homeTile} onPress={()=>setScreen('more')}><Text style={[s.tileGlyph,{color:T.eucalyptus}]}>◇</Text><Text style={s.tileTitle}>How ESS</Text><Text style={s.tileSub}>reached this</Text></Pressable>
  </View>
  <View style={s.signature}><View style={s.signatureLine}/><Text style={s.signatureText}>Human on the surface. Rigorous underneath.</Text><View style={s.signatureLine}/></View>
 </>;
}

function Journal(){
 const [entry,setEntry]=useState('');
 const [entries,setEntries]=useState([
  ['Today','Feeling clearer about my next step.','◒'],
  ['3 days ago','Setting boundaries felt hard but good.','◉'],
  ['1 week ago','Noticing patterns and what I need.','▤']
 ]);
 const save=()=>{const v=entry.trim();if(!v)return;setEntries([['Just now',v,'✎'],...entries]);setEntry('');};
 return <>
  <CinematicHero image={ART.journal} kicker="YOUR SPACE" title="Journal" body="Your thoughts, your pace. Reflect privately and notice what changes over time." height={285}/>
  <View style={s.journalComposer}>
   <Text style={s.composerTitle}>What’s on your mind?</Text>
   <TextInput value={entry} onChangeText={setEntry} multiline placeholder="Write in your own words…" placeholderTextColor={T.muted} style={s.journalInput}/>
   <Pressable onPress={save} style={({pressed})=>[s.journalButton,pressed&&s.pressed]}><Text style={s.journalButtonText}>＋  New entry</Text><Text style={s.journalButtonText}>→</Text></Pressable>
  </View>
  <View style={s.sectionHeader}><View><Text style={s.sectionEyebrow}>YOUR JOURNEY</Text><Text style={s.sectionHeading}>Recent entries</Text></View><Text style={s.sectionLink}>See all</Text></View>
  <View style={s.stack}>{entries.map(([when,text,icon],i)=><FeatureCard key={i} title={when} subtitle={text} icon={icon} accent={i===0?T.eucalyptus:T.sand}/>)}</View>
 </>;
}

function Learn(){
 const [query,setQuery]=useState('');
 const topics=[
  ['Culture & Country','Connection, belonging and stronger futures','⌁',ART.more],
  ['History & Truth','Context, perspectives and evidence','≋',ART.evidence],
  ['Emotional Wellbeing','Feelings, relationships and mental health','◇',ART.emotional],
  ['Rights & Systems','Law, services and what to expect','§',ART.support],
  ['Everyday Tools','Practical guidance for real life','✦',ART.home]
 ];
 const filtered=topics.filter(x=>(x[0]+' '+x[1]).toLowerCase().includes(query.toLowerCase()));
 return <>
  <CinematicHero image={ART.learn} kicker="KNOWLEDGE TRAILS" title="Learn" body="Explore culture, history, wellbeing, rights and practical tools at your own pace." height={270}/>
  <TextInput value={query} onChangeText={setQuery} placeholder="⌕  Search learning topics…" placeholderTextColor={T.muted} style={s.search}/>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>EXPLORE</Text><Text style={s.sectionHeading}>Learning paths</Text></View>
  <View style={s.stack}>{filtered.map(([title,subtitle,icon,image])=><FeatureCard key={title} title={title} subtitle={subtitle} icon={icon} accent={T.sand} image={image}/>)}</View>
 </>;
}

function Support(){
 return <>
  <CinematicHero image={ART.support} kicker="SUPPORT" title="You don’t have to figure it out alone." body="Find trusted services, clear information and practical next steps — when you want them." height={300}/>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>CHOOSE WHAT FITS</Text><Text style={s.sectionHeading}>Support options</Text></View>
  <View style={s.stack}>
   <SupportCard title="I feel unsafe right now" subtitle="Urgent safety information and immediate help" icon="!" tone="danger"/>
   <SupportCard title="Talk to someone" subtitle="Trusted services and human support" icon="◉" tone="ochre"/>
   <SupportCard title="Understand my options" subtitle="Information, rights and possible next steps" icon="◇" tone="green"/>
   <SupportCard title="Explore support topics" subtitle="Relationships, family, community and more" icon="⌁" tone="neutral"/>
  </View>
 </>;
}

function SupportCard({title,subtitle,icon,tone}){
 const style=tone==='danger'?s.supportDanger:tone==='ochre'?s.supportOchre:tone==='green'?s.supportGreen:s.supportNeutral;
 return <Pressable style={({pressed})=>[s.supportCard,style,pressed&&s.pressed]}>
  <View style={s.supportIcon}><Text style={s.supportIconText}>{icon}</Text></View>
  <View style={s.rowCopy}><Text style={s.supportTitle}>{title}</Text><Text style={s.supportSub}>{subtitle}</Text></View>
  <Text style={s.supportArrow}>›</Text>
 </Pressable>
}

function More({openCore}){
 return <>
  <CinematicHero image={ART.more} kicker="MORE" title="The system behind the calm." body="Understand ESS, adjust your experience and see how the system is being developed." height={280}/>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>ESS</Text><Text style={s.sectionHeading}>Explore the system</Text></View>
  <View style={s.stack}>
   <FeatureCard title="How ESS reached this" subtitle="Rules, versions and transparency" icon="◇" accent={T.eucalyptus} onPress={openCore}/>
   <FeatureCard title="About ESS" subtitle="Purpose, limits and principles" icon="i" accent="#8AA9AF"/>
   <FeatureCard title="Settings" subtitle="Privacy, accessibility and preferences" icon="⚙" accent={T.sand}/>
   <FeatureCard title="Research & development" subtitle="Testing, sources and improvements" icon="▤" accent={T.ochre}/>
   <FeatureCard title="Help" subtitle="FAQs and app guidance" icon="?" accent={T.sand}/>
   <FeatureCard title="Share feedback" subtitle="Help make ESS stronger" icon="…" accent={T.eucalyptus}/>
  </View>
 </>;
}

function Core({onBack}){
 const [text,setText]=useState("He hasn't replied for 6 hours. I feel rejected and I think he doesn't care.");
 const [showTechnical,setShowTechnical]=useState(false);
 const result=useMemo(()=>processSituation({text,feeling:'Not specified'}),[text]);
 return <>
  <View style={s.coreHeader}><Pressable onPress={onBack} style={s.back}><Text style={s.backText}>‹</Text></Pressable><View style={s.rowCopy}><Text style={s.sectionEyebrow}>ESS CORE</Text><Text style={s.coreTitle}>Understand this moment</Text></View></View>
  <Text style={s.coreLead}>Write naturally. ESS separates feelings, reported information, interpretation and uncertainty without deciding for you.</Text>
  <View style={s.corePanel}><Text style={s.fieldLabel}>WHAT IS HAPPENING?</Text><TextInput multiline value={text} onChangeText={setText} maxLength={2500} style={s.coreInput} placeholderTextColor={T.muted}/></View>
  <Result title="What you may be feeling" items={result.emotion.reported_or_detected}/>
  <Result title="What appears reported" items={result.evidence.reported_observations}/>
  <Result title="Possible interpretation" items={result.interpretation.possible_interpretations}/>
  <Result title="What is still uncertain" items={result.uncertainty.unknowns}/>
  <Result title="Choices remain yours" items={result.choice.options}/>
  <Pressable onPress={()=>setShowTechnical(v=>!v)} style={s.secondary}><Text style={s.secondaryText}>{showTechnical?'Hide technical details':'How ESS reached this'}</Text><Text style={s.secondaryArrow}>{showTechnical?'↑':'↓'}</Text></Pressable>
  {showTechnical&&<View style={[s.corePanel,s.techCard]}><Text style={s.techKicker}>RIGOROUS LAYER</Text><Text style={s.body}>Pathway: {result.next_pathway.replaceAll('_',' → ')}</Text><Text style={s.body}>Rules: {result.decision_record.rule_ids.join(' · ')}</Text><Text style={s.body}>Verified event: no</Text><Text style={s.body}>User control preserved: {result.decision_record.user_control_preserved?'yes':'no'}</Text></View>}
 </>;
}

function Result({title,items}){return <View style={s.resultCard}><Text style={s.resultLabel}>{title}</Text>{items?.length?items.map((x,i)=><Text key={i} style={s.body}>• {x}</Text>):<Text style={s.muted}>Nothing identified yet.</Text>}</View>}

function AppRoot(){
 const [screen,setScreen]=useState('home');
 const [coreOpen,setCoreOpen]=useState(false);
 const go=id=>{setCoreOpen(false);setScreen(id);};
 return <Shell screen={screen} onTab={go}>
  {coreOpen?<Core onBack={()=>setCoreOpen(false)}/>:
   screen==='home'?<Home openCore={()=>setCoreOpen(true)} setScreen={go}/>:
   screen==='journal'?<Journal/>:
   screen==='learn'?<Learn/>:
   screen==='support'?<Support/>:
   <More openCore={()=>setCoreOpen(true)}/>}
 </Shell>;
}

export default function App(){return <SafeAreaProvider><AppRoot/></SafeAreaProvider>;}

const SERIF='serif';
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:T.bg},
 content:{paddingHorizontal:12,paddingTop:10,paddingBottom:22,maxWidth:720,width:'100%',alignSelf:'center'},
 topBar:{minHeight:62,paddingHorizontal:14,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#080705',borderBottomWidth:1,borderBottomColor:'#2B251D'},
 wordmark:{flexDirection:'row',alignItems:'center',gap:9,flex:1},mark:{width:38,height:38,borderRadius:19,borderWidth:1,borderColor:T.sand,alignItems:'center',justifyContent:'center',backgroundColor:'#15110C'},markText:{color:T.sand,fontSize:9,fontWeight:'900',letterSpacing:1},
 brandCopy:{flex:1},brand:{color:T.text,fontSize:14,fontWeight:'700'},brandSub:{color:T.sand,fontSize:8.5,letterSpacing:1.7,marginTop:2},topActions:{flexDirection:'row',gap:12},action:{color:T.text,fontSize:20},
 nav:{flexDirection:'row',backgroundColor:'#080705',borderTopWidth:1,borderTopColor:'#2B251D',paddingHorizontal:2,paddingTop:3,paddingBottom:5},
 navItem:{flex:1,minHeight:57,alignItems:'center',justifyContent:'center',gap:2},navIcon:{color:'#84786A',fontSize:16},navText:{color:'#84786A',fontSize:9.5,letterSpacing:.2},navOn:{color:T.sand,fontWeight:'800'},navLine:{position:'absolute',bottom:0,width:22,height:2,borderRadius:2,backgroundColor:T.sand},
 hero:{borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:'#3A3024',marginBottom:15,justifyContent:'flex-end',backgroundColor:T.surface},
 heroImage:{borderRadius:24},heroVignette:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(7,4,2,.45)'},
 heroCopy:{padding:19,paddingTop:54,justifyContent:'flex-end'},heroCenter:{justifyContent:'center'},kicker:{color:T.sand,fontSize:9,fontWeight:'800',letterSpacing:2.1,marginBottom:6},
 heroTitle:{color:'#FFF7EC',fontFamily:SERIF,fontSize:32,lineHeight:37,fontWeight:'700',maxWidth:520,textShadowColor:'rgba(0,0,0,.35)',textShadowOffset:{width:0,height:1},textShadowRadius:4},
 heroBody:{color:'#F3E4D1',fontSize:13,lineHeight:20,marginTop:8,maxWidth:560},
 heroMeta:{flexDirection:'row',gap:7,flexWrap:'wrap',marginTop:12},pill:{paddingHorizontal:9,paddingVertical:5,borderRadius:999,borderWidth:1,borderColor:'rgba(216,194,160,.45)',backgroundColor:'rgba(12,9,6,.34)'},pillText:{color:'#F5E7D7',fontSize:9.5},
 primary:{minHeight:50,borderRadius:14,backgroundColor:T.sand,marginTop:14,paddingHorizontal:15,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},primaryText:{color:'#15100A',fontSize:13.5,fontWeight:'900',letterSpacing:.2},primaryArrow:{color:'#15100A',fontSize:18,fontWeight:'700'},
 sectionIntro:{marginTop:3,marginBottom:9},sectionEyebrow:{color:T.sand,fontSize:8.5,fontWeight:'900',letterSpacing:1.8},sectionHeading:{color:T.text,fontFamily:SERIF,fontSize:21,lineHeight:26,fontWeight:'700',marginTop:2},
 homeGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},homeTile:{width:'48.8%',minHeight:108,borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',padding:12,justifyContent:'flex-end'},tileGlyph:{fontSize:21,marginBottom:10},tileTitle:{color:T.text,fontFamily:SERIF,fontSize:15,fontWeight:'700'},tileSub:{color:T.muted,fontSize:10.5,lineHeight:15,marginTop:1},
 signature:{flexDirection:'row',alignItems:'center',gap:9,marginVertical:17},signatureLine:{flex:1,height:1,backgroundColor:'#342B22'},signatureText:{color:'#8E8173',fontSize:8.5,letterSpacing:.7,textTransform:'uppercase'},
 journalComposer:{borderRadius:18,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',padding:13,marginBottom:12},composerTitle:{color:T.text,fontFamily:SERIF,fontSize:18,fontWeight:'700',marginBottom:8},journalInput:{borderWidth:1,borderColor:'#3A3025',borderRadius:13,backgroundColor:'#0D0B08',color:T.text,minHeight:86,padding:12,fontSize:14,textAlignVertical:'top'},journalButton:{minHeight:47,borderRadius:13,backgroundColor:T.eucalyptus,alignItems:'center',justifyContent:'space-between',flexDirection:'row',paddingHorizontal:14,marginTop:8},journalButtonText:{color:'#091109',fontWeight:'900',fontSize:13},
 sectionHeader:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginVertical:10},sectionLink:{color:T.sand,fontSize:11,fontWeight:'700'},
 stack:{gap:8},featureCard:{minHeight:78,borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',overflow:'hidden',flexDirection:'row',alignItems:'center'},
 featureImage:{minHeight:86,padding:12,flexDirection:'row',alignItems:'center',gap:11,justifyContent:'center'},featureImageRadius:{borderRadius:15},cardShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(8,5,3,.56)'},
 featureIcon:{width:42,height:42,borderRadius:21,borderWidth:1,backgroundColor:'rgba(8,6,4,.58)',alignItems:'center',justifyContent:'center',margin:12},featureImageRadius:{borderRadius:15},
 featureIconText:{fontSize:16,fontWeight:'800'},featureCopy:{flex:1,minWidth:0},featureTitle:{color:T.text,fontFamily:SERIF,fontSize:15,fontWeight:'700'},featureSub:{color:'#D4C6B5',fontSize:10.5,lineHeight:15,marginTop:2},featureArrow:{color:T.sand,fontSize:22,marginRight:12},
 search:{minHeight:48,borderRadius:14,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',color:T.text,paddingHorizontal:13,fontSize:14,marginBottom:12},
 supportCard:{minHeight:80,borderRadius:17,borderWidth:1,padding:12,flexDirection:'row',alignItems:'center',gap:11},supportDanger:{backgroundColor:'#6E2D24',borderColor:'#A65040'},supportOchre:{backgroundColor:'#4A321B',borderColor:'#805C32'},supportGreen:{backgroundColor:'#20372A',borderColor:'#4E6F58'},supportNeutral:{backgroundColor:'#15120D',borderColor:'#3A3025'},
 supportIcon:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'rgba(255,247,236,.55)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.12)'},supportIconText:{color:'#FFF7EC',fontSize:17,fontWeight:'900'},rowCopy:{flex:1,minWidth:0},supportTitle:{color:'#FFF7EC',fontFamily:SERIF,fontSize:15,fontWeight:'700'},supportSub:{color:'#E0D1C0',fontSize:10.5,lineHeight:15,marginTop:2},supportArrow:{color:'#F4E2CD',fontSize:22},
 coreHeader:{flexDirection:'row',alignItems:'center',gap:10,marginTop:4,marginBottom:10},back:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',alignItems:'center',justifyContent:'center'},backText:{color:T.sand,fontSize:29,lineHeight:31},coreTitle:{color:T.text,fontFamily:SERIF,fontSize:26,fontWeight:'700',marginTop:2},coreLead:{color:T.muted,fontSize:13,lineHeight:20,marginBottom:12},
 corePanel:{borderRadius:17,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',padding:13,marginBottom:9},fieldLabel:{color:T.sand,fontSize:9,fontWeight:'900',letterSpacing:1.6,marginBottom:7},coreInput:{minHeight:135,borderRadius:13,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08',padding:12,color:T.text,fontSize:15,lineHeight:22,textAlignVertical:'top'},
 resultCard:{borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',padding:13,marginBottom:8},resultLabel:{color:T.sand,fontSize:9,fontWeight:'900',letterSpacing:1.4,textTransform:'uppercase',marginBottom:6},body:{color:T.text,fontSize:12.5,lineHeight:19,marginVertical:1.5},muted:{color:T.muted,fontSize:11.5},
 secondary:{minHeight:46,borderRadius:14,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#111711',alignItems:'center',justifyContent:'space-between',flexDirection:'row',paddingHorizontal:14,marginTop:2,marginBottom:10},secondaryText:{color:T.text,fontWeight:'800',fontSize:12.5},secondaryArrow:{color:T.eucalyptus,fontSize:15},techCard:{borderColor:T.eucalyptus,backgroundColor:'#111711'},techKicker:{color:T.eucalyptus,fontSize:9,fontWeight:'900',letterSpacing:1.5,marginBottom:7},
 pressed:{opacity:.72}
});