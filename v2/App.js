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
 const [change,setChange]=useState('');
 const [tag,setTag]=useState('Reflection');
 const [entries,setEntries]=useState([
  {when:'Today',text:'Feeling clearer about my next step.',change:'I know what I want to ask for.',tag:'Choice',icon:'◒'},
  {when:'3 days ago',text:'Setting boundaries felt hard but good.',change:'I noticed I can pause before answering.',tag:'Boundary',icon:'◉'},
  {when:'1 week ago',text:'Noticing patterns and what I need.',change:'Some things are still uncertain.',tag:'Uncertainty',icon:'▤'}
 ]);
 const tags=['Reflection','Boundary','Uncertainty','Choice'];
 const save=()=>{
  const v=entry.trim();
  if(!v)return;
  setEntries([{when:'Just now',text:v,change:change.trim()||'No follow-up added yet.',tag,icon:'✎'},...entries]);
  setEntry('');
  setChange('');
  setTag('Reflection');
 };
 return <>
  <CinematicHero image={ART.journal} kicker="YOUR SPACE" title="Journal" body="Your thoughts, your pace. Reflect privately and notice what changes over time." height={285}/>
  <View style={s.journalComposer}>
   <Text style={s.composerTitle}>What’s on your mind?</Text>
   <Text style={s.composerHint}>Write it as you experienced it. You can leave anything blank.</Text>
   <TextInput value={entry} onChangeText={setEntry} multiline placeholder="Write in your own words…" placeholderTextColor={T.muted} style={s.journalInput}/>
   <Text style={s.composerLabel}>What changed, if anything?</Text>
   <TextInput value={change} onChangeText={setChange} multiline placeholder="A thought, feeling, boundary, choice or unanswered question…" placeholderTextColor={T.muted} style={s.changeInput}/>
   <Text style={s.composerLabel}>Optional context</Text>
   <View style={s.tagRow}>{tags.map(x=><Pressable key={x} onPress={()=>setTag(x)} style={[s.tagChip,tag===x&&s.tagChipOn]}><Text style={[s.tagChipText,tag===x&&s.tagChipTextOn]}>{x}</Text></Pressable>)}</View>
   <Pressable onPress={save} style={({pressed})=>[s.journalButton,pressed&&s.pressed]}><Text style={s.journalButtonText}>Save reflection</Text><Text style={s.journalButtonText}>→</Text></Pressable>
  </View>
  <View style={s.sectionHeader}><View><Text style={s.sectionEyebrow}>YOUR JOURNEY</Text><Text style={s.sectionHeading}>Recent entries</Text></View><Text style={s.sectionLink}>See all</Text></View>
  <View style={s.stack}>{entries.map((item,i)=><JournalEntryCard key={i} item={item} accent={i===0?T.eucalyptus:T.sand}/>)}</View>
 </>;
}

function JournalEntryCard({item,accent}){
 return <View style={s.journalEntry}>
  <View style={[s.featureIcon,{borderColor:accent}]}><Text style={[s.featureIconText,{color:accent}]}>{item.icon}</Text></View>
  <View style={s.featureCopy}>
   <View style={s.entryTop}><Text style={s.featureTitle}>{item.when}</Text><View style={s.entryTag}><Text style={s.entryTagText}>{item.tag}</Text></View></View>
   <Text style={s.featureSub}>{item.text}</Text>
   <View style={s.changedLine}><Text style={s.changedLabel}>WHAT CHANGED</Text><Text style={s.changedText}>{item.change}</Text></View>
  </View>
  <Text style={s.featureArrow}>›</Text>
 </View>
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
 const [step,setStep]=useState(0);
 const [selectedNext,setSelectedNext]=useState('');
 const [confirmedFeelings,setConfirmedFeelings]=useState([]);
 const [otherFeeling,setOtherFeeling]=useState('');
 const [showTechnical,setShowTechnical]=useState(false);
 const result=useMemo(()=>processSituation({text,feeling:'Not specified'}),[text]);

 const stages=[
  {id:'situation',title:"What's happening?"},
  {id:'feeling',title:'What are you feeling?'},
  {id:'known',title:'What do we actually know?'},
  {id:'interpretation',title:'What might be interpretation?'},
  {id:'uncertainty',title:'What is still uncertain?'},
  {id:'context',title:'What context needs attention?'},
  {id:'choice',title:'What choices are still yours?'},
  {id:'next',title:'What feels like the next step?'}
 ];
 const stage=stages[step];

 const stageBody=()=>{
  if(stage.id==='situation') return <View style={s.corePanel}><Text style={s.fieldLabel}>IN YOUR OWN WORDS</Text><TextInput multiline value={text} onChangeText={setText} maxLength={2500} style={s.coreInput} placeholder="Write what happened…" placeholderTextColor={T.muted}/><Text style={s.coreHint}>Start with your experience. You do not need to prove anything here.</Text></View>;
  if(stage.id==='feeling') return <FeelingStage detected={result.emotion.reported_or_detected} selected={confirmedFeelings} onToggle={x=>setConfirmedFeelings(v=>v.includes(x)?v.filter(y=>y!==x):[...v,x])} other={otherFeeling} onOther={setOtherFeeling}/>;
  if(stage.id==='known') return <KnownStage items={result.evidence.reported_observations}/>;
  if(stage.id==='interpretation') return <CoreList label="POSSIBLE INTERPRETATION" items={result.interpretation.possible_interpretations} empty="No obvious interpretation language identified." note="Interpretations can matter without being treated as fact." />;
  if(stage.id==='uncertainty') return <CoreList label="UNKNOWNS" items={result.uncertainty.unknowns} empty="No additional unknowns identified." note="ESS keeps uncertainty visible instead of filling gaps." />;
  if(stage.id==='context') return <View style={s.corePanel}><Text style={s.fieldLabel}>CONTEXT CHECK</Text><Text style={s.contextTitle}>{result.safety.title}</Text><Text style={s.stageNote}>This is a routing signal based on the words provided. It is not verification, diagnosis or a legal finding.</Text>{result.safety.risks?.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>)}</View>;
  if(stage.id==='choice') return <View style={s.corePanel}><Text style={s.fieldLabel}>OPTIONS REMAIN YOURS</Text>{result.choice.options.map((x,i)=><View key={i} style={s.choiceCard}><Text style={s.choiceNumber}>{i+1}</Text><Text style={s.choiceText}>{x}</Text></View>)}<Text style={s.stageNote}>ESS can surface options. It does not choose for you.</Text></View>;
  return <View style={s.corePanel}><Text style={s.fieldLabel}>YOU DECIDE</Text><Text style={s.nextLead}>Choose one if it fits, or leave the decision open for now.</Text>{result.choice.options.map((x,i)=><Pressable key={i} onPress={()=>setSelectedNext(x)} style={[s.nextOption,selectedNext===x&&s.nextOptionOn]}><View style={[s.nextRadio,selectedNext===x&&s.nextRadioOn]}/><Text style={[s.nextOptionText,selectedNext===x&&s.nextOptionTextOn]}>{x}</Text></Pressable>)}<Pressable onPress={()=>setSelectedNext('Not ready yet')} style={[s.nextOption,selectedNext==='Not ready yet'&&s.nextOptionOn]}><View style={[s.nextRadio,selectedNext==='Not ready yet'&&s.nextRadioOn]}/><Text style={[s.nextOptionText,selectedNext==='Not ready yet'&&s.nextOptionTextOn]}>I’m not ready to choose yet.</Text></Pressable><Text style={s.stageNote}>Suggested pathway: {result.next_pathway.replaceAll('_',' → ')}. You can still choose differently.</Text></View>;
 };

 const goBack=()=>step===0?onBack():setStep(v=>v-1);
 return <>
  <View style={s.coreHeader}><Pressable onPress={goBack} style={s.back}><Text style={s.backText}>‹</Text></Pressable><View style={s.rowCopy}><Text style={s.sectionEyebrow}>ESS CORE · STEP {step+1} OF 8</Text><Text style={s.coreTitle}>{stage.title}</Text></View></View>
  <View style={s.progressTrack}><View style={[s.progressFill,{width:`${((step+1)/8)*100}%`}]}/></View>
  <Text style={s.coreLead}>One step at a time. ESS keeps feelings, reported information, interpretation, uncertainty and choice separate.</Text>
  {stageBody()}
  <View style={s.coreNavRow}>
   <Pressable onPress={goBack} style={s.coreBackButton}><Text style={s.coreBackButtonText}>{step===0?'Exit':'Back'}</Text></Pressable>
   {step<7?<Pressable onPress={()=>setStep(v=>v+1)} style={s.coreNextButton}><Text style={s.coreNextText}>Continue</Text><Text style={s.coreNextText}>→</Text></Pressable>:<Pressable onPress={()=>setShowTechnical(v=>!v)} style={s.coreNextButton}><Text style={s.coreNextText}>{showTechnical?'Hide details':'How ESS reached this'}</Text><Text style={s.coreNextText}>{showTechnical?'↑':'↓'}</Text></Pressable>}
  </View>
  {step===7&&showTechnical&&<View style={[s.corePanel,s.techCard]}><Text style={s.techKicker}>RIGOROUS LAYER</Text><Text style={s.body}>Pathway: {result.next_pathway.replaceAll('_',' → ')}</Text><Text style={s.body}>Rules: {result.decision_record.rule_ids.join(' · ')}</Text><Text style={s.body}>Verified event: no</Text><Text style={s.body}>User control preserved: {result.decision_record.user_control_preserved?'yes':'no'}</Text><Text style={s.body}>Backbone stages: {result.backbone?.length||8}</Text></View>}
 </>;
}


function FeelingStage({detected,selected,onToggle,other,onOther}){
 const options=[...new Set([...(detected||[]),'calm','confused','angry','sad','scared','overwhelmed'])].slice(0,8);
 return <View style={s.corePanel}>
  <Text style={s.fieldLabel}>CHECK WHAT FITS</Text>
  <Text style={s.nextLead}>ESS noticed some feeling words. Keep, remove or add what feels right to you.</Text>
  <View style={s.feelingWrap}>{options.map(x=><Pressable key={x} onPress={()=>onToggle(x)} style={[s.feelingChip,selected.includes(x)&&s.feelingChipOn]}><Text style={[s.feelingChipText,selected.includes(x)&&s.feelingChipTextOn]}>{x}</Text></Pressable>)}</View>
  <Text style={s.composerLabel}>Something else?</Text>
  <TextInput value={other} onChangeText={onOther} placeholder="Add your own word…" placeholderTextColor={T.muted} style={s.feelingInput}/>
  <Text style={s.stageNote}>You are the final authority on what you feel. ESS suggestions are only cues from language.</Text>
 </View>;
}

function KnownStage({items}){
 return <View style={s.corePanel}>
  <Text style={s.fieldLabel}>REPORTED INFORMATION</Text>
  <View style={s.truthBadges}><View style={s.truthBadge}><Text style={s.truthBadgeText}>REPORTED</Text></View><View style={[s.truthBadge,s.truthBadgeMuted]}><Text style={s.truthBadgeMutedText}>NOT INDEPENDENTLY VERIFIED</Text></View></View>
  {items?.length?items.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>):<Text style={s.muted}>No clear reported observations yet.</Text>}
  <Text style={s.stageNote}>This step protects the difference between what was said or observed and what has been independently verified.</Text>
 </View>;
}

function CoreList({label,items,empty,note}){
 return <View style={s.corePanel}><Text style={s.fieldLabel}>{label}</Text>{items?.length?items.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>):<Text style={s.muted}>{empty}</Text>}<Text style={s.stageNote}>{note}</Text></View>;
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
 journalComposer:{borderRadius:18,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',padding:13,marginBottom:12},composerTitle:{color:T.text,fontFamily:SERIF,fontSize:18,fontWeight:'700',marginBottom:3},composerHint:{color:T.muted,fontSize:10.5,lineHeight:15,marginBottom:9},composerLabel:{color:T.sand,fontSize:8.5,fontWeight:'900',letterSpacing:1.2,marginTop:11,marginBottom:6},journalInput:{borderWidth:1,borderColor:'#3A3025',borderRadius:13,backgroundColor:'#0D0B08',color:T.text,minHeight:86,padding:12,fontSize:14,textAlignVertical:'top'},changeInput:{borderWidth:1,borderColor:'#3A3025',borderRadius:13,backgroundColor:'#0D0B08',color:T.text,minHeight:66,padding:12,fontSize:13.5,textAlignVertical:'top'},tagRow:{flexDirection:'row',flexWrap:'wrap',gap:6},tagChip:{paddingHorizontal:10,paddingVertical:7,borderRadius:999,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08'},tagChipOn:{borderColor:T.eucalyptus,backgroundColor:'#18231A'},tagChipText:{color:T.muted,fontSize:10.5,fontWeight:'700'},tagChipTextOn:{color:'#DDE8DC'},journalButton:{minHeight:47,borderRadius:13,backgroundColor:T.eucalyptus,alignItems:'center',justifyContent:'space-between',flexDirection:'row',paddingHorizontal:14,marginTop:12},journalButtonText:{color:'#091109',fontWeight:'900',fontSize:13},
 sectionHeader:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginVertical:10},sectionLink:{color:T.sand,fontSize:11,fontWeight:'700'},journalEntry:{minHeight:98,borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',flexDirection:'row',alignItems:'flex-start'},entryTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:12},entryTag:{paddingHorizontal:7,paddingVertical:3,borderRadius:999,borderWidth:1,borderColor:'rgba(120,146,126,.7)',backgroundColor:'rgba(33,52,38,.7)'},entryTagText:{color:'#D7E4D6',fontSize:8.5,fontWeight:'800'},changedLine:{marginTop:8,paddingTop:7,borderTopWidth:1,borderTopColor:'#2E281F'},changedLabel:{color:T.sand,fontSize:7.5,fontWeight:'900',letterSpacing:1.2},changedText:{color:'#DCCFBE',fontSize:10,lineHeight:14,marginTop:2},
 stack:{gap:8},featureCard:{minHeight:78,borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',overflow:'hidden',flexDirection:'row',alignItems:'center'},
 featureImage:{minHeight:86,padding:12,flexDirection:'row',alignItems:'center',gap:11,justifyContent:'center'},featureImageRadius:{borderRadius:15},cardShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(8,5,3,.56)'},
 featureIcon:{width:42,height:42,borderRadius:21,borderWidth:1,backgroundColor:'rgba(8,6,4,.58)',alignItems:'center',justifyContent:'center',margin:12},featureImageRadius:{borderRadius:15},
 featureIconText:{fontSize:16,fontWeight:'800'},featureCopy:{flex:1,minWidth:0},featureTitle:{color:T.text,fontFamily:SERIF,fontSize:15,fontWeight:'700'},featureSub:{color:'#D4C6B5',fontSize:10.5,lineHeight:15,marginTop:2},featureArrow:{color:T.sand,fontSize:22,marginRight:12},
 search:{minHeight:48,borderRadius:14,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',color:T.text,paddingHorizontal:13,fontSize:14,marginBottom:12},
 supportCard:{minHeight:80,borderRadius:17,borderWidth:1,padding:12,flexDirection:'row',alignItems:'center',gap:11},supportDanger:{backgroundColor:'#6E2D24',borderColor:'#A65040'},supportOchre:{backgroundColor:'#4A321B',borderColor:'#805C32'},supportGreen:{backgroundColor:'#20372A',borderColor:'#4E6F58'},supportNeutral:{backgroundColor:'#15120D',borderColor:'#3A3025'},
 supportIcon:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'rgba(255,247,236,.55)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.12)'},supportIconText:{color:'#FFF7EC',fontSize:17,fontWeight:'900'},rowCopy:{flex:1,minWidth:0},supportTitle:{color:'#FFF7EC',fontFamily:SERIF,fontSize:15,fontWeight:'700'},supportSub:{color:'#E0D1C0',fontSize:10.5,lineHeight:15,marginTop:2},supportArrow:{color:'#F4E2CD',fontSize:22},
 coreHeader:{flexDirection:'row',alignItems:'center',gap:10,marginTop:4,marginBottom:10},back:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',alignItems:'center',justifyContent:'center'},backText:{color:T.sand,fontSize:29,lineHeight:31},coreTitle:{color:T.text,fontFamily:SERIF,fontSize:25,fontWeight:'700',marginTop:2},coreLead:{color:T.muted,fontSize:12.5,lineHeight:19,marginBottom:10},progressTrack:{height:4,borderRadius:999,backgroundColor:'#2A241C',overflow:'hidden',marginBottom:12},progressFill:{height:4,borderRadius:999,backgroundColor:T.sand},
 corePanel:{borderRadius:17,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',padding:13,marginBottom:9},fieldLabel:{color:T.sand,fontSize:9,fontWeight:'900',letterSpacing:1.6,marginBottom:7},coreInput:{minHeight:135,borderRadius:13,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08',padding:12,color:T.text,fontSize:15,lineHeight:22,textAlignVertical:'top'},
 resultCard:{borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',padding:13,marginBottom:8},resultLabel:{color:T.sand,fontSize:9,fontWeight:'900',letterSpacing:1.4,textTransform:'uppercase',marginBottom:6},body:{color:T.text,fontSize:12.5,lineHeight:19,marginVertical:1.5},muted:{color:T.muted,fontSize:11.5},coreHint:{color:T.muted,fontSize:10.5,lineHeight:15,marginTop:8},feelingWrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:7},feelingChip:{paddingHorizontal:11,paddingVertical:8,borderRadius:999,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08'},feelingChipOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},feelingChipText:{color:T.muted,fontSize:11,fontWeight:'700',textTransform:'capitalize'},feelingChipTextOn:{color:'#E4EEE2'},feelingInput:{minHeight:46,borderRadius:13,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08',color:T.text,paddingHorizontal:12,fontSize:14},truthBadges:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:9},truthBadge:{paddingHorizontal:8,paddingVertical:5,borderRadius:999,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#17221A'},truthBadgeText:{color:'#DDE8DC',fontSize:8,fontWeight:'900',letterSpacing:1},truthBadgeMuted:{borderColor:'#5A5147',backgroundColor:'#17130F'},truthBadgeMutedText:{color:'#B5A99B',fontSize:8,fontWeight:'900',letterSpacing:.7},stageItem:{flexDirection:'row',gap:8,alignItems:'flex-start',marginVertical:4},stageBullet:{color:T.sand,fontSize:16,lineHeight:19},stageText:{color:T.text,fontSize:13,lineHeight:19,flex:1},stageNote:{color:T.muted,fontSize:10.5,lineHeight:15,marginTop:10,paddingTop:9,borderTopWidth:1,borderTopColor:'#2E281F'},contextTitle:{color:T.text,fontFamily:SERIF,fontSize:19,fontWeight:'700',marginBottom:4},choiceCard:{flexDirection:'row',alignItems:'flex-start',gap:10,borderWidth:1,borderColor:'#342C22',borderRadius:13,padding:10,marginTop:7,backgroundColor:'#0D0B08'},choiceNumber:{width:24,height:24,borderRadius:12,borderWidth:1,borderColor:T.sand,color:T.sand,textAlign:'center',lineHeight:22,fontSize:10,fontWeight:'900'},choiceText:{color:T.text,fontSize:12.5,lineHeight:18,flex:1},nextLead:{color:T.muted,fontSize:11.5,lineHeight:17,marginBottom:7},nextOption:{minHeight:48,borderWidth:1,borderColor:'#3A3025',borderRadius:13,padding:10,flexDirection:'row',alignItems:'center',gap:9,marginTop:7,backgroundColor:'#0D0B08'},nextOptionOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},nextRadio:{width:18,height:18,borderRadius:9,borderWidth:1,borderColor:'#6F6253'},nextRadioOn:{borderWidth:5,borderColor:T.eucalyptus,backgroundColor:'#F1E9DA'},nextOptionText:{color:'#D8CBBA',fontSize:12.5,lineHeight:18,flex:1},nextOptionTextOn:{color:T.text,fontWeight:'700'},coreNavRow:{flexDirection:'row',gap:8,marginTop:2,marginBottom:10},coreBackButton:{minHeight:47,minWidth:88,borderRadius:14,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',alignItems:'center',justifyContent:'center',paddingHorizontal:14},coreBackButtonText:{color:T.muted,fontWeight:'800',fontSize:12},coreNextButton:{minHeight:47,borderRadius:14,backgroundColor:T.sand,flex:1,alignItems:'center',justifyContent:'space-between',flexDirection:'row',paddingHorizontal:14},coreNextText:{color:'#15100A',fontWeight:'900',fontSize:12.5},
 secondary:{minHeight:46,borderRadius:14,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#111711',alignItems:'center',justifyContent:'space-between',flexDirection:'row',paddingHorizontal:14,marginTop:2,marginBottom:10},secondaryText:{color:T.text,fontWeight:'800',fontSize:12.5},secondaryArrow:{color:T.eucalyptus,fontSize:15},techCard:{borderColor:T.eucalyptus,backgroundColor:'#111711'},techKicker:{color:T.eucalyptus,fontSize:9,fontWeight:'900',letterSpacing:1.5,marginBottom:7},
 pressed:{opacity:.72}
});