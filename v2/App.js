import React,{useMemo,useState} from 'react';
import {SafeAreaView,ScrollView,View,Text,TextInput,Pressable,StyleSheet,ImageBackground} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {T} from './src/theme';
import {processSituation} from './src/core/essCore.cjs';

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
  <View style={s.header}>
   <View style={s.logo}><Text style={s.logoText}>ESS</Text></View>
   <View style={s.brandWrap}>
    <Text style={s.brand}>Emotional Safety System</Text>
    <Text style={s.brandSub}>Australian Humanity</Text>
   </View>
   <Text style={s.headerAction}>⌕</Text>
   <Text style={s.headerAction}>◯</Text>
  </View>
  <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
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

function ScreenHero({image,kicker,title,body,children,height=300}){
 return <ImageBackground source={image} resizeMode="cover" style={[s.screenHero,{height}]} imageStyle={s.heroImage}>
  <View style={s.heroShade}/>
  <View style={s.screenHeroCopy}>
   {!!kicker&&<Text style={s.eyebrow}>{kicker}</Text>}
   <Text style={s.screenHeroTitle}>{title}</Text>
   {!!body&&<Text style={s.screenHeroBody}>{body}</Text>}
   {children}
  </View>
 </ImageBackground>;
}

function ActionRow({title,subtitle,icon='›',accent=T.sand,onPress,tone='default'}){
 const toneStyle=tone==='danger'?s.rowDanger:tone==='green'?s.rowGreen:tone==='ochre'?s.rowOchre:null;
 return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress}
  style={({pressed})=>[s.row,toneStyle,pressed&&s.pressed]}>
  <View style={[s.rowIcon,{borderColor:accent}]}><Text style={[s.rowIconText,{color:accent}]}>{icon}</Text></View>
  <View style={s.rowCopy}><Text style={s.rowTitle}>{title}</Text><Text style={s.rowSub}>{subtitle}</Text></View>
  <Text style={s.chev}>›</Text>
 </Pressable>;
}

function Home({openCore,setScreen}){
 return <>
  <ScreenHero image={ART.home} kicker="Good evening," title="You’re in the right place."
   body="A calm space to understand what’s happening, keep your choices and explore your next steps." height={390}>
   <Pressable onPress={openCore} style={({pressed})=>[s.primary,pressed&&s.pressed]}><Text style={s.primaryText}>Start a reflection</Text><Text style={s.primaryArrow}>→</Text></Pressable>
  </ScreenHero>

  <View style={s.homeGrid}>
   <Pressable style={s.homeTile} onPress={openCore}><Text style={[s.tileIcon,{color:T.eucalyptus}]}>◒</Text><Text style={s.tileTitle}>Understand</Text><Text style={s.tileSub}>your situation</Text></Pressable>
   <Pressable style={s.homeTile} onPress={()=>setScreen('learn')}><Text style={[s.tileIcon,{color:T.ochre}]}>▤</Text><Text style={s.tileTitle}>Learn</Text><Text style={s.tileSub}>and explore</Text></Pressable>
   <Pressable style={s.homeTile} onPress={()=>setScreen('support')}><Text style={[s.tileIcon,{color:T.clay}]}>◉</Text><Text style={s.tileTitle}>Find support</Text><Text style={s.tileSub}>when needed</Text></Pressable>
   <Pressable style={s.homeTile} onPress={()=>setScreen('more')}><Text style={[s.tileIcon,{color:T.eucalyptus}]}>◇</Text><Text style={s.tileTitle}>How ESS</Text><Text style={s.tileSub}>reached this</Text></Pressable>
  </View>
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
  <ScreenHero image={ART.journal} title="Journal" body="Your thoughts, your pace. A private space to reflect, track your journey and see your progress." height={270}/>
  <View style={s.card}>
   <TextInput value={entry} onChangeText={setEntry} placeholder="Write a short reflection..." placeholderTextColor={T.muted} style={s.journalInput}/>
   <Pressable onPress={save} style={({pressed})=>[s.journalButton,pressed&&s.pressed]}><Text style={s.journalButtonText}>＋  New entry</Text></Pressable>
  </View>
  <View style={s.sectionHeader}><Text style={s.sectionTitle}>Recent entries</Text><Text style={s.sectionLink}>See all</Text></View>
  <View style={s.stack}>{entries.map(([when,text,icon],i)=><ActionRow key={i} title={when} subtitle={text} icon={icon} accent={i===0?T.eucalyptus:T.sand}/>)}</View>
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
  <ScreenHero image={ART.learn} title="Learn" body="Explore topics at your own pace. Grounded in evidence, culture, real context and trustworthy sources." height={250}/>
  <TextInput value={query} onChangeText={setQuery} placeholder="⌕  Search learning topics..." placeholderTextColor={T.muted} style={s.search}/>
  <View style={s.stack}>{filtered.map(([title,subtitle,icon,image],i)=><Pressable key={title} style={({pressed})=>[s.learnRow,pressed&&s.pressed]}>
    <ImageBackground source={image} resizeMode="cover" style={s.learnThumb} imageStyle={s.learnThumbImage}><View style={s.thumbShade}/></ImageBackground>
    <View style={s.rowCopy}><Text style={s.rowTitle}>{title}</Text><Text style={s.rowSub}>{subtitle}</Text></View><Text style={s.chev}>›</Text>
   </Pressable>)}</View>
 </>;
}

function Support(){
 return <>
  <ScreenHero image={ART.support} title="Support" body="You’re not alone. Find trusted services, information and guidance — at your pace." height={250}/>
  <View style={s.stack}>
   <ActionRow title="I feel unsafe right now" subtitle="Get urgent help and safety guidance" icon="!" accent="#FFE3D7" tone="danger"/>
   <ActionRow title="Talk to someone" subtitle="Trusted services and support options" icon="◉" accent="#F0C58D" tone="ochre"/>
   <ActionRow title="Understand my options" subtitle="Information, rights and next steps" icon="◇" accent="#D8E8D7" tone="green"/>
   <ActionRow title="Explore support topics" subtitle="Relationships, family, community + more" icon="⌁" accent={T.sand}/>
  </View>
 </>;
}

function More({openCore}){
 return <>
  <ScreenHero image={ART.more} title="More" body="Everything else, when you need it." height={250}/>
  <View style={s.stack}>
   <ActionRow title="How ESS reached this" subtitle="Rules, versions and transparency" icon="◇" accent={T.eucalyptus} onPress={openCore}/>
   <ActionRow title="About ESS" subtitle="Purpose, limits and principles" icon="i" accent="#7BB0C3"/>
   <ActionRow title="Settings" subtitle="Privacy, accessibility and preferences" icon="⚙" accent={T.sand}/>
   <ActionRow title="Research & development" subtitle="Testing, sources and improvements" icon="▤" accent={T.ochre}/>
   <ActionRow title="Help" subtitle="FAQs and app guidance" icon="?" accent={T.sand}/>
   <ActionRow title="Share feedback" subtitle="Help us make ESS stronger" icon="…" accent={T.eucalyptus}/>
  </View>
 </>;
}

function Core({onBack}){
 const [text,setText]=useState("He hasn't replied for 6 hours. I feel rejected and I think he doesn't care.");
 const [showTechnical,setShowTechnical]=useState(false);
 const result=useMemo(()=>processSituation({text,feeling:'Not specified'}),[text]);
 return <>
  <View style={s.coreTop}><Pressable onPress={onBack} style={s.back}><Text style={s.backText}>‹</Text></Pressable><View><Text style={s.eyebrow}>ESS CORE</Text><Text style={s.coreTitle}>Understand this moment</Text></View></View>
  <Text style={s.coreLead}>Write naturally. ESS separates the parts without deciding what another person meant or what you should believe.</Text>
  <View style={s.card}><Text style={s.fieldLabel}>What is happening?</Text><TextInput multiline value={text} onChangeText={setText} maxLength={2500} style={s.coreInput} placeholderTextColor={T.muted}/></View>
  <Result title="What you may be feeling" items={result.emotion.reported_or_detected}/>
  <Result title="What appears reported" items={result.evidence.reported_observations}/>
  <Result title="Possible interpretation" items={result.interpretation.possible_interpretations}/>
  <Result title="What is still uncertain" items={result.uncertainty.unknowns}/>
  <Result title="Choices remain yours" items={result.choice.options}/>
  <Pressable onPress={()=>setShowTechnical(v=>!v)} style={s.secondary}><Text style={s.secondaryText}>{showTechnical?'Hide technical details':'How ESS reached this'}</Text></Pressable>
  {showTechnical&&<View style={[s.card,s.techCard]}><Text style={s.techKicker}>RIGOROUS LAYER</Text><Text style={s.body}>Pathway: {result.next_pathway.replaceAll('_',' → ')}</Text><Text style={s.body}>Rules: {result.decision_record.rule_ids.join(' · ')}</Text><Text style={s.body}>Verified event: no</Text><Text style={s.body}>User control preserved: {result.decision_record.user_control_preserved?'yes':'no'}</Text></View>}
 </>;
}

function Result({title,items}){return <View style={s.card}><Text style={s.resultLabel}>{title}</Text>{items?.length?items.map((x,i)=><Text key={i} style={s.body}>• {x}</Text>):<Text style={s.muted}>Nothing identified yet.</Text>}</View>}

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

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:T.bg},content:{padding:14,paddingBottom:24,maxWidth:720,width:'100%',alignSelf:'center'},
 header:{minHeight:70,paddingHorizontal:15,paddingVertical:10,flexDirection:'row',alignItems:'center',gap:10,backgroundColor:T.bg,borderBottomWidth:1,borderBottomColor:T.border},
 logo:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:T.sand,backgroundColor:T.surface,alignItems:'center',justifyContent:'center'},logoText:{color:T.sand,fontSize:11,fontWeight:'900',letterSpacing:1},
 brandWrap:{flex:1},brand:{color:T.text,fontSize:15.5,fontWeight:'700'},brandSub:{color:T.muted,fontSize:10.5,marginTop:1},headerAction:{color:T.text,fontSize:22,paddingHorizontal:2},
 nav:{flexDirection:'row',backgroundColor:T.bg,borderTopWidth:1,borderTopColor:T.border,paddingHorizontal:4,paddingTop:4,paddingBottom:5},navItem:{flex:1,minHeight:58,alignItems:'center',justifyContent:'center',gap:3},navIcon:{color:T.muted,fontSize:16},navText:{color:T.muted,fontSize:10},navOn:{color:T.sand,fontWeight:'700'},navLine:{position:'absolute',bottom:0,width:22,height:2,borderRadius:2,backgroundColor:T.sand},
 screenHero:{borderRadius:25,overflow:'hidden',borderWidth:1,borderColor:T.border,marginBottom:14,justifyContent:'flex-end'},heroImage:{borderRadius:25},heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(9,6,3,.48)'},screenHeroCopy:{padding:18,justifyContent:'flex-end'},eyebrow:{color:T.sand,fontSize:10,fontWeight:'800',letterSpacing:1.4},screenHeroTitle:{color:T.text,fontSize:30,lineHeight:37,fontWeight:'700',marginTop:5},screenHeroBody:{color:'#F0E2CF',fontSize:14,lineHeight:21,marginTop:5},
 primary:{minHeight:48,borderRadius:15,backgroundColor:T.sand,marginTop:14,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},primaryText:{color:T.bg,fontSize:14,fontWeight:'800'},primaryArrow:{color:T.bg,fontSize:18},
 homeGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},homeTile:{width:'48.8%',minHeight:112,borderRadius:17,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,padding:13,justifyContent:'flex-end'},tileIcon:{fontSize:22,marginBottom:8},tileTitle:{color:T.text,fontSize:14,fontWeight:'700'},tileSub:{color:T.muted,fontSize:11.5,lineHeight:16,marginTop:2},
 stack:{gap:8},row:{minHeight:76,borderRadius:17,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,padding:12,flexDirection:'row',alignItems:'center',gap:11},rowDanger:{backgroundColor:'#7A2E22',borderColor:'#B75A45'},rowGreen:{backgroundColor:'#1F3A2C',borderColor:'#54765F'},rowOchre:{backgroundColor:'#4B331B',borderColor:'#826036'},
 rowIcon:{width:45,height:45,borderRadius:23,borderWidth:1,backgroundColor:'rgba(0,0,0,.12)',alignItems:'center',justifyContent:'center'},rowIconText:{fontSize:17,fontWeight:'700'},rowCopy:{flex:1,minWidth:0},rowTitle:{color:T.text,fontSize:14.5,fontWeight:'700'},rowSub:{color:'#D5C7B6',fontSize:11.5,lineHeight:16,marginTop:2},chev:{color:T.sand,fontSize:22},
 card:{borderRadius:17,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,padding:14,marginBottom:10},journalInput:{borderWidth:1,borderColor:T.border,borderRadius:13,backgroundColor:T.bg,color:T.text,minHeight:52,paddingHorizontal:12,fontSize:15},journalButton:{minHeight:48,borderRadius:13,backgroundColor:T.eucalyptus,alignItems:'center',justifyContent:'center',marginTop:9},journalButtonText:{color:'#081008',fontWeight:'800',fontSize:14},
 sectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:11},sectionTitle:{color:T.text,fontSize:15,fontWeight:'700'},sectionLink:{color:T.sand,fontSize:12},
 search:{minHeight:48,borderRadius:14,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,color:T.text,paddingHorizontal:13,fontSize:15,marginBottom:10},
 learnRow:{minHeight:76,borderRadius:17,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,overflow:'hidden',flexDirection:'row',alignItems:'center'},learnThumb:{width:94,height:'100%',minHeight:76},learnThumbImage:{borderTopLeftRadius:16,borderBottomLeftRadius:16},thumbShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(7,4,2,.10)'},
 coreTop:{flexDirection:'row',alignItems:'center',gap:11,marginTop:4,marginBottom:9},back:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,alignItems:'center',justifyContent:'center'},backText:{color:T.sand,fontSize:31,lineHeight:32},coreTitle:{color:T.text,fontSize:25,fontWeight:'700',marginTop:3},coreLead:{color:T.muted,fontSize:14,lineHeight:21,marginBottom:13},fieldLabel:{color:T.text,fontSize:13,fontWeight:'700',marginBottom:7},coreInput:{minHeight:140,borderRadius:14,borderWidth:1,borderColor:T.border,backgroundColor:T.bg,padding:12,color:T.text,fontSize:16,lineHeight:23},
 resultLabel:{color:T.sand,fontSize:10,fontWeight:'800',letterSpacing:1.1,textTransform:'uppercase',marginBottom:6},body:{color:T.text,fontSize:13,lineHeight:20,marginVertical:2},muted:{color:T.muted,fontSize:12},secondary:{minHeight:46,borderRadius:14,borderWidth:1,borderColor:T.border,backgroundColor:T.surface,alignItems:'center',justifyContent:'center',marginTop:2,marginBottom:10},secondaryText:{color:T.text,fontWeight:'700'},techCard:{borderColor:T.eucalyptus,backgroundColor:T.surface2},techKicker:{color:T.eucalyptus,fontSize:10,fontWeight:'800',letterSpacing:1.1,marginBottom:7},
 pressed:{opacity:.72}
});
