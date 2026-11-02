import React,{useMemo,useState} from 'react';
import {ScrollView,View,Text,TextInput,Pressable,StyleSheet,ImageBackground,Image,Linking,Alert} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import {House,BookOpen,NotebookPen,HeartHandshake,Menu,ShieldCheck,Info,Settings,MessageCircle,HelpCircle,Compass,Scale,Leaf,LockKeyhole} from 'lucide-react-native';
import {T} from './src/theme';
import {V} from './src/visual2027';
import {processSituation} from './src/core/essCore.cjs';
import {SERVICES,getSupportAction} from './src/data/supportResources.cjs';

// ESS_V2_2027_FULL_APP_VISUAL_CONTRACT: new offline photography, not old imagery.
const ART={
 home:require('./assets/scenes/home-coast.jpg'),
 journal:require('./assets/scenes/journal-banksia.jpg'),
 learn:require('./assets/scenes/learn-coast.jpg'),
 support:require('./assets/scenes/support-gorge.jpg'),
 more:require('./assets/scenes/more-stars.jpg'),
 culture:require('./assets/scenes/culture-flora.jpg'),
 evidence:require('./assets/scenes/history-country.jpg'),
 emotional:require('./assets/scenes/emotions-flower.jpg'),
 rights:require('./assets/scenes/rights-parliament.jpg'),
 everyday:require('./assets/scenes/everyday-landscape.jpg')
};
const ICONS={home:House,journal:NotebookPen,learn:BookOpen,support:HeartHandshake,more:Menu,
 understand:Compass,evidence:ShieldCheck,info:Info,settings:Settings,feedback:MessageCircle,
 help:HelpCircle,rights:Scale,culture:Leaf,privacy:LockKeyhole};
function AppIcon({name,size=22,color=T.sand}){
 const Icon=ICONS[name]||ShieldCheck;
 return <Icon size={size} color={color} strokeWidth={1.85}/>;
}

const TABS=[
 ['home','Home','⌂'],
 ['journal','Journal','✎'],
 ['learn','Learn','▤'],
 ['support','Support','♡'],
 ['more','More','•••']
];

const LEARN_TRAILS=[
 {
  id:'culture-country',title:'Culture & Country',subtitle:'Connection, belonging and stronger futures',icon:'⌁',image:ART.culture,
  helps:'Understand how identity, place, relationships and cultural context can shape how people experience safety and belonging.',
  ideas:['Context matters before conclusions.','Different communities can hold different knowledge systems and responsibilities.','Respectful learning means checking whose knowledge is being shared and how.'],
  unknown:'Some cultural knowledge is local, community-held or not appropriate to generalise.',
  sourceStatus:'Use community-approved and authoritative sources before publishing cultural claims.',
  related:'History & Truth'
 },
 {
  id:'history-truth',title:'History & Truth',subtitle:'Context, perspectives and evidence',icon:'≋',image:ART.evidence,
  helps:'Understand the difference between a claim, a source, an interpretation and something that remains uncertain.',
  ideas:['A reported account is not automatically independently verified.','Sources can disagree or have different perspectives.','Uncertainty should stay visible until stronger evidence is available.'],
  unknown:'A missing source does not prove a claim false, and one source does not always settle a contested question.',
  sourceStatus:'Attach primary or authoritative sources to specific historical claims before publication.',
  related:'Everyday Tools'
 },
 {
  id:'emotional-wellbeing',title:'Emotional Wellbeing',subtitle:'Feelings, relationships and mental health',icon:'◇',image:ART.emotional,
  helps:'Understand feelings as useful information without treating them as proof of another person’s intent.',
  ideas:['Feelings are real even when the cause is uncertain.','A pause can create room for choice.','Boundaries and support can be considered without diagnosing another person.'],
  unknown:'ESS cannot know another person’s intent from one person’s account alone.',
  sourceStatus:'Health and wellbeing material should use current, reputable clinical or public-health sources.',
  related:'Everyday Tools'
 },
 {
  id:'rights-systems',title:'Rights & Systems',subtitle:'Law, services and what to expect',icon:'§',image:ART.rights,
  helps:'Understand where rights, services, responsibilities and formal systems may matter.',
  ideas:['Legal information and personal interpretation are different things.','Jurisdiction matters.','A service pathway should explain limits and what a person can expect next.'],
  unknown:'Laws, service eligibility and procedures can change over time.',
  sourceStatus:'Verify current law and service information from official Australian or state sources before publication.',
  related:'Everyday Tools'
 },
 {
  id:'everyday-tools',title:'Everyday Tools',subtitle:'Practical guidance for real life',icon:'✦',image:ART.everyday,
  helps:'Turn understanding into small practical actions while preserving choice.',
  ideas:['Separate what happened from what you think it means.','Name what is still unknown.','Compare options before committing to one.','You can leave a decision open.'],
  unknown:'No tool works for every situation; context and safety still matter.',
  sourceStatus:'Keep tools transparent, testable and clearly separated from professional advice.',
  related:'Emotional Wellbeing'
 }
];

function Shell({screen,onTab,children}){
 return <SafeAreaView style={s.safe} edges={['top','bottom']}>
  <StatusBar style="light" backgroundColor="#0D0B09"/>
  <ImageBackground source={ART[screen]||ART.home} resizeMode="cover" style={StyleSheet.absoluteFillObject} accessible={false}><View style={s.appSceneShade}/></ImageBackground>
  <View style={s.topBar}>
   <View style={s.wordmark}>
    <View style={s.mark}><Text style={s.markText}>ESS</Text></View>
    <View style={s.brandCopy}>
     <Text style={s.brand}>Emotional Safety System</Text>
     <Text style={s.brandSub}>AUSTRALIAN HUMANITY</Text>
    </View>
   </View>
  </View>
  <ScrollView key={screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>
  <View style={s.nav}>
   {TABS.map(([id,label,icon])=><Pressable key={id} accessibilityRole="tab" accessibilityState={{selected:screen===id}}
    accessibilityLabel={`${label} tab`} accessibilityHint={`Open ${label}`} onPress={()=>onTab(id)} style={({pressed})=>[s.navItem,pressed&&s.pressed]}>
    <AppIcon name={id} size={21} color={screen===id?'#E4BA84':'#CABAA6'}/>
    <Text style={[s.navText,screen===id&&s.navOn]}>{label}</Text>
    {screen===id&&<View style={s.navLine}/>}
   </Pressable>)}
  </View>
 </SafeAreaView>;
}

function CinematicHero({image,kicker,title,body,children,height=330,align='bottom'}){
 // The active tab already renders its scene; no duplicated image banners.
 return <View style={[s.hero,{minHeight:height}]}>
  <View style={[s.heroCopy,align==='center'&&s.heroCenter]}>
   {!!kicker&&<Text style={s.kicker}>{kicker}</Text>}
   <Text style={s.heroTitle}>{title}</Text>
   {!!body&&<Text style={s.heroBody}>{body}</Text>}
   {children}
  </View>
 </View>;
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
   <Pressable accessibilityRole="button" accessibilityLabel="Start a reflection" accessibilityHint="Open the ESS Core guided reflection" onPress={openCore} style={({pressed})=>[s.primary,pressed&&s.pressed]}>
    <Text style={s.primaryText}>Start a reflection</Text><Text style={s.primaryArrow}>→</Text>
   </Pressable>
  </CinematicHero>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>EXPLORE</Text><Text style={s.sectionHeading}>What do you need right now?</Text></View>
  <View style={s.homeGrid}>
   <Pressable accessibilityRole="button" accessibilityLabel="Understand your situation" onPress={openCore} style={s.homeTile}><Text style={[s.tileGlyph,{color:T.eucalyptus}]}>◒</Text><Text style={s.tileTitle}>Understand</Text><Text style={s.tileSub}>your situation</Text></Pressable>
   <Pressable accessibilityRole="button" accessibilityLabel="Learn and explore" onPress={()=>setScreen('learn')} style={s.homeTile}><Text style={[s.tileGlyph,{color:T.ochre}]}>▤</Text><Text style={s.tileTitle}>Learn</Text><Text style={s.tileSub}>and explore</Text></Pressable>
   <Pressable accessibilityRole="button" accessibilityLabel="Find support when needed" onPress={()=>setScreen('support')} style={s.homeTile}><Text style={[s.tileGlyph,{color:T.clay}]}>◉</Text><Text style={s.tileTitle}>Find support</Text><Text style={s.tileSub}>when needed</Text></Pressable>
   <Pressable accessibilityRole="button" accessibilityLabel="How ESS reached this" onPress={()=>setScreen('more')} style={s.homeTile}><Text style={[s.tileGlyph,{color:T.eucalyptus}]}>◇</Text><Text style={s.tileTitle}>How ESS</Text><Text style={s.tileSub}>reached this</Text></Pressable>
  </View>
  <View style={s.signature}><View style={s.signatureLine}/><Text style={s.signatureText}>Human on the surface. Rigorous underneath.</Text><View style={s.signatureLine}/></View>
 </>;
}

function Journal({entries,setEntries}){
 const [entry,setEntry]=useState('');
 const [change,setChange]=useState('');
 const [tag,setTag]=useState('Reflection');
 const [filter,setFilter]=useState('All');
 const [historyOpen,setHistoryOpen]=useState(false);
 const tags=['Reflection','Boundary','Uncertainty','Choice'];
 const filters=['All',...tags];
 const save=()=>{
  const v=entry.trim();
  if(!v)return;
  setEntries([{when:'Just now',text:v,change:change.trim()||'No follow-up added yet.',tag,icon:'✎'},...entries]);
  setEntry('');
  setChange('');
  setTag('Reflection');
 };
 const visible=filter==='All'?entries:entries.filter(x=>x.tag===filter);
 const counts=tags.reduce((acc,x)=>({...acc,[x]:entries.filter(e=>e.tag===x).length}),{});
 const recentChanges=entries.slice(0,3).map(x=>x.change).filter(Boolean);
 return <>
  <CinematicHero image={ART.journal} kicker="YOUR SPACE" title="Journal" body="Your thoughts, your pace. Reflect and notice what changes over time." height={285}/>
  <View style={s.learnPurpose}><Text style={s.fieldLabel}>PROTOTYPE PRIVACY NOTE</Text><Text style={s.learnPurposeText}>Entries are kept only while this app session stays open. They are not yet stored securely across restarts. Avoid sensitive details until protected saving is built and tested.</Text></View>
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

  <View style={s.historyPanel}>
   <View style={s.sectionHeader}><View><Text style={s.sectionEyebrow}>YOUR JOURNEY</Text><Text style={s.sectionHeading}>What has been showing up?</Text></View><Pressable onPress={()=>setHistoryOpen(v=>!v)}><Text style={s.sectionLink}>{historyOpen?'Hide':'View'}</Text></Pressable></View>
   <Text style={s.historyIntro}>This is a neutral reflection of your saved tags — not a score, diagnosis or judgement.</Text>
   <View style={s.historyCounts}>{tags.map(x=><View key={x} style={s.historyCountCard}><Text style={s.historyCountNumber}>{counts[x]}</Text><Text style={s.historyCountLabel}>{x}</Text></View>)}</View>
   {historyOpen&&<View style={s.historyChanges}><Text style={s.fieldLabel}>RECENT “WHAT CHANGED” NOTES</Text>{recentChanges.length?recentChanges.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>):<Text style={s.muted}>No change notes saved yet.</Text>}</View>}
  </View>

  <View style={s.sectionHeader}><View><Text style={s.sectionEyebrow}>REFLECTION HISTORY</Text><Text style={s.sectionHeading}>Recent entries</Text></View><Text style={s.sectionLink}>{visible.length} shown</Text></View>
  <View style={s.filterRow}>{filters.map(x=><Pressable key={x} accessibilityRole="button" accessibilityState={{selected:filter===x}} accessibilityLabel={`${x} journal filter`} onPress={()=>setFilter(x)} style={[s.filterChip,filter===x&&s.filterChipOn]}><Text style={[s.filterChipText,filter===x&&s.filterChipTextOn]}>{x}</Text></Pressable>)}</View>
  <View style={s.stack}>{visible.length?visible.map((item,i)=><JournalEntryCard key={i} item={item} accent={i===0?T.eucalyptus:T.sand}/>):<View style={s.emptyState}><Text style={s.emptyTitle}>Nothing saved here yet.</Text><Text style={s.emptyText}>You can change the filter or add a new reflection whenever you want.</Text></View>}</View>
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

function Learn({initialTrail,onConsumeInitialTrail}){
 const [query,setQuery]=useState('');
 const [selectedTrail,setSelectedTrail]=useState(null);
 React.useEffect(()=>{
  if(initialTrail){
   const match=LEARN_TRAILS.find(x=>x.title===initialTrail||x.id===initialTrail);
   if(match)setSelectedTrail(match);
   onConsumeInitialTrail?.();
  }
 },[initialTrail]);
 const filtered=LEARN_TRAILS.filter(x=>(x.title+' '+x.subtitle+' '+x.helps).toLowerCase().includes(query.toLowerCase()));
 if(selectedTrail) return <LearnTrail trail={selectedTrail} onBack={()=>setSelectedTrail(null)} onRelated={title=>{const next=LEARN_TRAILS.find(x=>x.title===title);if(next)setSelectedTrail(next);}}/>;
 return <>
  <CinematicHero image={ART.learn} kicker="KNOWLEDGE TRAILS" title="Learn" body="Explore culture, history, wellbeing, rights and practical tools at your own pace." height={270}/>
  <TextInput value={query} onChangeText={setQuery} placeholder="⌕  Search learning topics…" placeholderTextColor={T.muted} style={s.search}/>
  <View style={s.learnPurpose}><Text style={s.fieldLabel}>WHAT IS THIS HELPING ME DO?</Text><Text style={s.learnPurposeText}>Find context or knowledge that helps you understand something better — without forcing a conclusion.</Text></View>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>EXPLORE</Text><Text style={s.sectionHeading}>Learning paths</Text></View>
  <View style={s.stack}>{filtered.map(trail=><Pressable key={trail.id} accessibilityRole="button" accessibilityLabel={`${trail.title} learning trail`} onPress={()=>setSelectedTrail(trail)} style={({pressed})=>[s.learnTrailCard,pressed&&s.pressed]}>
   <ImageBackground source={trail.image} resizeMode="cover" style={s.learnTrailImage} imageStyle={s.learnTrailImageRadius}><View style={s.cardShade}/><View style={s.learnTrailContent}><Text style={s.learnTrailIcon}>{trail.icon}</Text><View style={s.rowCopy}><Text style={s.learnTrailTitle}>{trail.title}</Text><Text style={s.learnTrailSub}>{trail.subtitle}</Text><Text style={s.learnTrailHelp}>{trail.helps}</Text></View><Text style={s.featureArrow}>›</Text></View></ImageBackground>
  </Pressable>)}</View>
 </>;
}

function LearnTrail({trail,onBack,onRelated}){
 return <>
  <View style={s.coreHeader}><Pressable onPress={onBack} style={s.back}><Text style={s.backText}>‹</Text></Pressable><View style={s.rowCopy}><Text style={s.sectionEyebrow}>LEARN TRAIL</Text><Text style={s.coreTitle}>{trail.title}</Text></View></View>
  <ImageBackground source={trail.image} resizeMode="cover" style={s.learnDetailHero} imageStyle={s.heroImage}><View style={s.heroVignette}/><View style={s.learnDetailCopy}><Text style={s.kicker}>WHAT THIS HELPS YOU UNDERSTAND</Text><Text style={s.learnDetailTitle}>{trail.helps}</Text></View></ImageBackground>
  <View style={s.learnSection}><Text style={s.fieldLabel}>KEY IDEAS</Text>{trail.ideas.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>)}</View>
  <View style={s.learnSection}><Text style={s.fieldLabel}>WHAT IS STILL UNCERTAIN?</Text><Text style={s.learnBody}>{trail.unknown}</Text></View>
  <View style={s.learnSection}><Text style={s.fieldLabel}>SOURCE STATUS</Text><View style={s.sourceBadge}><Text style={s.sourceBadgeText}>SOURCE DISCIPLINE ON</Text></View><Text style={s.learnBody}>{trail.sourceStatus}</Text></View>
  <Pressable onPress={()=>onRelated(trail.related)} style={s.crossLinkButton}><View><Text style={s.crossLinkEyebrow}>RELATED TRAIL</Text><Text style={s.crossLinkTitle}>{trail.related}</Text><Text style={s.crossLinkSub}>Keep following the knowledge path if it helps.</Text></View><Text style={s.crossLinkArrow}>→</Text></Pressable>
  <View style={s.signature}><View style={s.signatureLine}/><Text style={s.signatureText}>Learn for context · not forced conclusions</Text><View style={s.signatureLine}/></View>
 </>;
}

function Support({initialMode,onConsumeInitialMode,onNavigate}){
 const MODES={
  calm:{
   id:'calm',label:'CALM SUPPORT',title:'You can slow this down.',body:'Use support for information, perspective or a human conversation — even when nothing urgent is happening.',
   tone:'neutral',
   actions:[
    ['Talk it through','Find a trusted person or service to talk with.','◉'],
    ['Understand my options','Look at possible next steps without committing.','◇'],
    ['Learn more first','Go back to knowledge and context if that feels more useful.','▤']
   ]
  },
  boundary:{
   id:'boundary',label:'BOUNDARY / PRESSURE',title:'Your boundaries still matter.',body:'If something feels pressuring, ESS can help you slow the situation down and look at support without deciding for you.',
   tone:'ochre',
   actions:[
    ['Pause before responding','Create room before making another decision.','Ⅱ'],
    ['Talk to someone','Use a trusted person or service for perspective.','◉'],
    ['Understand boundary options','Review practical boundary-focused choices.','◇']
   ]
  },
  coercion:{
   id:'coercion',label:'STRONGER SUPPORT',title:'You deserve room to choose freely.',body:'If the situation includes coercive pressure or restricted choice, support options can become more visible while your control stays central.',
   tone:'green',
   actions:[
    ['Talk to a trusted support','Bring in another person if you want to.','◉'],
    ['Make a safer pause plan','Think about how to create distance or time.','◇'],
    ['Review support services','See formal help options without being forced to use them.','⌁']
   ]
  },
  urgent:{
   id:'urgent',label:'URGENT SAFETY',title:'Immediate safety comes first.',body:'If there may be immediate danger, ESS prioritises getting toward safety and trusted emergency help rather than collecting more information.',
   tone:'danger',
   actions:[
    ['Move toward safety','Go somewhere safer if that is possible.','!'],
    ['Contact emergency help','Use local emergency services if danger is happening now.','☎'],
    ['Do not gather extra evidence','Your safety matters more than proving what happened.','◇']
   ]
  }
 };
 const [mode,setMode]=useState('calm');
 const [selectedAction,setSelectedAction]=useState(null);
 const selectedGuide=getSupportAction(selectedAction);
 const openExternal=url=>Linking.openURL(url).catch(()=>Alert.alert('Could not open this option','You can use the displayed number or website directly.'));
 React.useEffect(()=>{
  if(initialMode&&MODES[initialMode]){setMode(initialMode);setSelectedAction(null);}
  onConsumeInitialMode?.();
 },[initialMode]);
 const current=MODES[mode];
 return <>
  <CinematicHero image={ART.support} kicker="SUPPORT" title="You don’t have to figure it out alone." body="Find trusted services, clear information and practical next steps — at your pace." height={300}/>
  <View style={s.learnPurpose}><Text style={s.fieldLabel}>WHAT IS THIS HELPING ME DO?</Text><Text style={s.learnPurposeText}>Understand your options, reach human help if you want it, and keep control of what happens next.</Text></View>
  <View style={s.supportModeTabs}>
   {Object.values(MODES).map(x=><Pressable key={x.id} accessibilityRole="button" accessibilityState={{selected:mode===x.id}} accessibilityLabel={`${x.id} support mode`} onPress={()=>{setMode(x.id);setSelectedAction(null);}} style={[s.supportModeTab,mode===x.id&&s.supportModeTabOn]}><Text style={[s.supportModeTabText,mode===x.id&&s.supportModeTabTextOn]}>{x.id==='calm'?'Calm':x.id==='boundary'?'Boundary':x.id==='coercion'?'Coercion':'Urgent'}</Text></Pressable>)}
  </View>
  <View style={[s.supportModePanel,current.tone==='danger'?s.supportDanger:current.tone==='ochre'?s.supportOchre:current.tone==='green'?s.supportGreen:s.supportNeutral]}>
   <Text style={s.fieldLabel}>{current.label}</Text>
   <Text style={s.supportModeTitle}>{current.title}</Text>
   <Text style={s.supportModeBody}>{current.body}</Text>
  </View>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>CHOOSE WHAT FITS</Text><Text style={s.sectionHeading}>Support options</Text></View>
  <View style={s.stack}>
   {current.actions.map(([title,subtitle,icon])=><SupportCard key={title} title={title} subtitle={subtitle} icon={icon} tone={current.tone} selected={selectedAction===title} onPress={()=>setSelectedAction(title)}/>)}
  </View>
  {selectedGuide&&<View style={s.learnSection}>
   <View style={s.sectionHeader}><View style={s.rowCopy}><Text style={s.fieldLabel}>YOUR NEXT STEP · OPTIONAL</Text><Text style={s.supportModeTitle}>{selectedAction}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close support step" onPress={()=>setSelectedAction(null)} style={s.accessibleTap}><Text style={s.sectionLink}>Close</Text></Pressable></View>
   {selectedGuide.steps.map((item,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{item}</Text></View>)}
   {selectedGuide.destination==='learn'&&<Pressable accessibilityRole="button" accessibilityLabel="Open learning trails" onPress={()=>onNavigate?.('learn')} style={s.secondary}><Text style={s.secondaryText}>Open Learn</Text><Text style={s.secondaryArrow}>→</Text></Pressable>}
   {!!selectedGuide.services?.length&&<>
    <Text style={[s.fieldLabel,{marginTop:12}]}>VERIFIED AUSTRALIAN SUPPORT OPTIONS</Text>
    {selectedGuide.services.map(id=>{
     const item=SERVICES[id];
     return <View key={id} style={s.resultCard}>
      <Text style={s.supportTitle}>{item.name}</Text>
      <Text style={s.supportSub}>{item.description}</Text>
      <Text style={[s.supportSub,{marginTop:7}]}>Phone: {item.phone}</Text>
      <View style={{flexDirection:'row',gap:8,flexWrap:'wrap',marginTop:10}}>
       <Pressable accessibilityRole="button" accessibilityLabel={`Open phone dialler for ${item.name}`} onPress={()=>openExternal('tel:'+item.phone.replace(/\s/g,''))} style={s.reviewButton}><Text style={s.reviewButtonText}>Open dialler</Text></Pressable>
       <Pressable accessibilityRole="link" accessibilityLabel={`Open official website for ${item.name}`} onPress={()=>openExternal(item.website)} style={s.reviewButton}><Text style={s.reviewButtonText}>Official website</Text></Pressable>
      </View>
     </View>;
    })}
    <Text style={s.stageNote}>These links open outside ESS only when you choose them. The app does not place calls, refer you or send your reflection automatically.</Text>
   </>}
  </View>}
  <View style={s.supportReminder}><Text style={s.supportReminderTitle}>You can stop here.</Text><Text style={s.supportReminderText}>Support is available, not compulsory. You can return Home, Learn more first, or leave the decision open.</Text></View>
 </>;
}

function SupportCard({title,subtitle,icon,tone,selected,onPress}){
 const style=tone==='danger'?s.supportDanger:tone==='ochre'?s.supportOchre:tone==='green'?s.supportGreen:s.supportNeutral;
 return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{selected}} onPress={onPress} style={({pressed})=>[s.supportCard,style,selected&&{borderColor:T.sand},pressed&&s.pressed]}>
  <View style={s.supportIcon}><Text style={s.supportIconText}>{icon}</Text></View>
  <View style={s.rowCopy}><Text style={s.supportTitle}>{title}</Text><Text style={s.supportSub}>{subtitle}</Text></View>
  <Text style={s.supportArrow}>›</Text>
 </Pressable>
}

function More({openCore}){
 const [detail,setDetail]=useState('');
 const details={
  'About ESS':{
   description:'ESS helps a person reflect on feelings, reported experiences, possible interpretations, uncertainty and next steps. It does not independently determine what happened, diagnose anyone or replace professional advice.',
   points:['Feelings are meaningful but do not prove another person’s intentions.','Evidence and interpretation should be kept separate.','The person can disagree, leave questions open or choose not to proceed.']
  },
  'Settings':{
   description:'This is still a development prototype. Account features, protected journal storage and reliable preferences are not available yet.',
   points:['Journal entries are session-only; closing the app may clear them.','Do not enter private or identifying details until protected storage is tested.','No theme setting is offered until it can update every screen consistently.']
  },
  'Research & development':{
   description:'The ESS Core keeps transparent rule and version records so behaviour can be tested. Its effectiveness has not been independently validated.',
   points:['Claims and educational sources require review before release.','Safety routing is not a substitute for an emergency assessment.','The project remains under development and professional review is needed.']
  },
  'Help':{
   description:'To begin, open Start a reflection on Home. Learn explores context, Support presents options, and Journal records notes for this session.',
   points:['You can go back, pause or leave a decision open.','If there is immediate danger in Australia, call 000 rather than waiting for ESS.','Support resources are opened only when you choose.']
  },
  'Share feedback':{
   description:'Sending feedback is not connected in this prototype. ESS will not collect or transmit a feedback message from this screen.',
   points:['A reviewed consent and feedback process is needed before this feature can be activated.','For now, record feedback outside the app without including sensitive personal details.']
  }
 };
 const items=[
  ['About ESS','Purpose, limits and principles','i',T.eucalyptus],
  ['Settings','Privacy, accessibility and preferences','⚙',T.sand],
  ['Research & development','Testing, sources and improvements','▤',T.ochre],
  ['Help','FAQs and app guidance','?',T.sand],
  ['Share feedback','Feedback channel not connected yet','…',T.eucalyptus]
 ];
 return <>
  <CinematicHero image={ART.more} kicker="MORE" title="The system behind the calm." body="Understand ESS, adjust your expectations and see how the system is being developed." height={280}/>
  <View style={s.sectionIntro}><Text style={s.sectionEyebrow}>ESS</Text><Text style={s.sectionHeading}>Explore the system</Text></View>
  <View style={s.stack}>
   <FeatureCard title="How ESS reached this" subtitle="Rules, versions and transparency" icon="◇" accent={T.eucalyptus} onPress={openCore}/>
   {items.map(([title,subtitle,icon,accent])=><FeatureCard key={title} title={title} subtitle={subtitle} icon={icon} accent={accent} onPress={()=>setDetail(title)}/>)}
  </View>
  {!!detail&&<View style={[s.learnSection,{marginTop:12}]}>
   <View style={s.sectionHeader}><View style={s.rowCopy}><Text style={s.fieldLabel}>ABOUT THIS SECTION</Text><Text style={s.supportModeTitle}>{detail}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close More details" onPress={()=>setDetail('')} style={s.accessibleTap}><Text style={s.sectionLink}>Close</Text></Pressable></View>
   <Text style={s.learnBody}>{details[detail].description}</Text>
   {details[detail].points.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>)}
  </View>}
 </>;
}

function Core({onBack,onSaveJournal,onNavigate}){
 const [text,setText]=useState("He hasn't replied for 6 hours. I feel rejected and I think he doesn't care.");
 const [step,setStep]=useState(0);
 const [selectedNext,setSelectedNext]=useState('');
 const [confirmedFeelings,setConfirmedFeelings]=useState([]);
 const [otherFeeling,setOtherFeeling]=useState('');
 const [showTechnical,setShowTechnical]=useState(false);
 const [interpretationChecks,setInterpretationChecks]=useState({});
 const [unknownChecks,setUnknownChecks]=useState({});
 const [choicePreview,setChoicePreview]=useState('');
 const [savedToJournal,setSavedToJournal]=useState(false);
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
  if(stage.id==='interpretation') return <InterpretationStage items={result.interpretation.possible_interpretations} checks={interpretationChecks} onCheck={(item,value)=>setInterpretationChecks(v=>({...v,[item]:value}))}/>;
  if(stage.id==='uncertainty') return <UncertaintyStage items={result.uncertainty.unknowns} checks={unknownChecks} onCheck={(item,value)=>setUnknownChecks(v=>({...v,[item]:value}))} onLearn={()=>{const rec=result.recommendations?.find(x=>x.destination==='learn');onNavigate?.('learn',rec?.trail)}} recommendation={result.recommendations?.find(x=>x.destination==='learn')}/>;
  if(stage.id==='context') return <ContextStage result={result} onSupport={()=>onNavigate?.('support',result.safety.urgent?'urgent':result.safety.classification==='coercion'?'coercion':result.safety.classification==='pressure'?'boundary':'calm')} recommendation={result.recommendations?.find(x=>x.destination==='support')}/>;
  if(stage.id==='choice') return <ChoiceCompare options={result.choice.options} value={choicePreview} onChange={setChoicePreview}/>;
  return <FinishStage result={result} selectedNext={selectedNext} setSelectedNext={setSelectedNext} saved={savedToJournal} onSave={()=>{onSaveJournal?.({when:'Just now',text,change:selectedNext||'Decision left open.',tag:'Choice',icon:'◇'});setSavedToJournal(true);}} onNavigate={onNavigate} recommendations={result.recommendations||[]}/>;
 };

 const goBack=()=>step===0?onBack():setStep(v=>v-1);
 return <>
  <View style={s.coreHeader}><Pressable accessibilityRole="button" accessibilityLabel={step===0?"Exit ESS Core":"Go back one ESS Core step"} onPress={goBack} style={s.back}><Text style={s.backText}>‹</Text></Pressable><View style={s.rowCopy}><Text style={s.sectionEyebrow}>ESS CORE · STEP {step+1} OF 8</Text><Text style={s.coreTitle}>{stage.title}</Text></View></View>
  <View style={s.progressTrack}><View style={[s.progressFill,{width:`${((step+1)/8)*100}%`}]}/></View>
  <Text style={s.coreLead}>One step at a time. ESS keeps feelings, reported information, interpretation, uncertainty and choice separate.</Text>
  {stageBody()}
  <View style={s.coreNavRow}>
   <Pressable accessibilityRole="button" accessibilityLabel={step===0?"Exit ESS Core":"Back"} onPress={goBack} style={s.coreBackButton}><Text style={s.coreBackButtonText}>{step===0?'Exit':'Back'}</Text></Pressable>
   {step<7?<Pressable accessibilityRole="button" accessibilityLabel="Continue to next ESS Core step" onPress={()=>setStep(v=>v+1)} style={s.coreNextButton}><Text style={s.coreNextText}>Continue</Text><Text style={s.coreNextText}>→</Text></Pressable>:<Pressable onPress={()=>setShowTechnical(v=>!v)} style={s.coreNextButton}><Text style={s.coreNextText}>{showTechnical?'Hide details':'How ESS reached this'}</Text><Text style={s.coreNextText}>{showTechnical?'↑':'↓'}</Text></Pressable>}
  </View>
  {step===7&&showTechnical&&<View style={[s.corePanel,s.techCard]}><Text style={s.techKicker}>RIGOROUS LAYER</Text><Text style={s.body}>Pathway: {result.next_pathway.replaceAll('_',' → ')}</Text><Text style={s.body}>Rules: {result.decision_record.rule_ids.join(' · ')}</Text><Text style={s.body}>Verified event: no</Text><Text style={s.body}>User control preserved: {result.decision_record.user_control_preserved?'yes':'no'}</Text><Text style={s.body}>Backbone stages: {result.backbone?.length||8}</Text><Text style={s.body}>Core version: {result.decision_record.core_version}</Text><Text style={s.body}>Architecture version: {result.decision_record.architecture_version}</Text></View>}
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


function InterpretationStage({items,checks,onCheck}){
 return <View style={s.corePanel}>
  <Text style={s.fieldLabel}>POSSIBLE INTERPRETATION</Text>
  <Text style={s.nextLead}>ESS is separating possible meaning from what was directly reported. You decide whether each one reflects what you meant.</Text>
  {items?.length?items.map((x,i)=><View key={i} style={s.reviewCard}><Text style={s.reviewText}>{x}</Text><View style={s.reviewActions}><Pressable onPress={()=>onCheck(x,'fits')} style={[s.reviewButton,checks[x]==='fits'&&s.reviewButtonOn]}><Text style={[s.reviewButtonText,checks[x]==='fits'&&s.reviewButtonTextOn]}>That fits</Text></Pressable><Pressable onPress={()=>onCheck(x,'no')} style={[s.reviewButton,checks[x]==='no'&&s.reviewButtonNo]}><Text style={[s.reviewButtonText,checks[x]==='no'&&s.reviewButtonTextNo]}>Not what I meant</Text></Pressable></View></View>):<Text style={s.muted}>No obvious interpretation language identified.</Text>}
  <Text style={s.stageNote}>Neither answer changes what you experienced. This step only keeps meaning separate from observation.</Text>
 </View>;
}

function UncertaintyStage({items,checks,onCheck,onLearn,recommendation}){
 return <View style={s.corePanel}>
  <Text style={s.fieldLabel}>WHAT IS STILL OPEN?</Text>
  <Text style={s.nextLead}>Not knowing is allowed. You can deliberately leave a question open instead of forcing an answer.</Text>
  {items?.length?items.map((x,i)=><View key={i} style={s.reviewCard}><Text style={s.reviewText}>{x}</Text><View style={s.reviewActions}><Pressable onPress={()=>onCheck(x,'open')} style={[s.reviewButton,checks[x]==='open'&&s.reviewButtonOn]}><Text style={[s.reviewButtonText,checks[x]==='open'&&s.reviewButtonTextOn]}>Keep open</Text></Pressable><Pressable onPress={()=>onCheck(x,'known')} style={[s.reviewButton,checks[x]==='known'&&s.reviewButtonKnown]}><Text style={[s.reviewButtonText,checks[x]==='known'&&s.reviewButtonTextKnown]}>I know this now</Text></Pressable></View></View>):<Text style={s.muted}>No additional unknowns identified.</Text>}
  <Text style={s.stageNote}>ESS does not need every gap filled before you can make a choice.</Text>
  <Pressable onPress={onLearn} style={s.crossLinkButton}><View><Text style={s.crossLinkEyebrow}>OPTIONAL</Text><Text style={s.crossLinkTitle}>Explore a learning trail</Text><Text style={s.crossLinkSub}>{recommendation?.reason||'Look for context or knowledge without forcing an answer.'}</Text></View><Text style={s.crossLinkArrow}>→</Text></Pressable>
 </View>;
}

function ContextStage({result,onSupport,recommendation}){
 const kind=result.safety.classification;
 const label=result.safety.urgent?'Needs immediate attention':kind==='pressure'||kind==='coercion'?'Worth slowing down':'No urgent signal identified';
 const tone=result.safety.urgent?s.contextUrgent:kind==='pressure'||kind==='coercion'?s.contextWatch:s.contextCalm;
 return <View style={[s.corePanel,tone]}>
  <Text style={s.fieldLabel}>CONTEXT CHECK</Text>
  <View style={s.contextBadge}><Text style={s.contextBadgeText}>{label.toUpperCase()}</Text></View>
  <Text style={s.contextTitle}>{result.safety.title}</Text>
  {result.safety.risks?.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>)}
  <Text style={s.stageNote}>This is a routing signal from the words provided. It is not verification, diagnosis or a legal finding.</Text>
  {(result.safety.urgent||kind==='pressure'||kind==='coercion')&&<Pressable onPress={onSupport} style={s.crossLinkButton}><View><Text style={s.crossLinkEyebrow}>OPTIONAL</Text><Text style={s.crossLinkTitle}>View support options</Text><Text style={s.crossLinkSub}>{recommendation?.reason||'See trusted support without leaving your choices behind.'}</Text></View><Text style={s.crossLinkArrow}>→</Text></Pressable>}
 </View>;
}

function ChoiceCompare({options,value,onChange}){
 return <View style={s.corePanel}>
  <Text style={s.fieldLabel}>COMPARE YOUR OPTIONS</Text>
  <Text style={s.nextLead}>Tap an option to hold it in focus. You are not committing to it yet.</Text>
  {options.map((x,i)=><Pressable key={i} onPress={()=>onChange(x)} style={[s.choiceCard,value===x&&s.choiceCardOn]}><Text style={[s.choiceNumber,value===x&&s.choiceNumberOn]}>{i+1}</Text><View style={s.choiceCopy}><Text style={[s.choiceText,value===x&&s.choiceTextOn]}>{x}</Text><Text style={s.choiceHint}>{value===x?'In focus — you can still change your mind.':'Tap to compare this option.'}</Text></View></Pressable>)}
  <Text style={s.stageNote}>ESS can surface options. It does not rank them or choose for you.</Text>
 </View>;
}

function FinishStage({result,selectedNext,setSelectedNext,saved,onSave,onNavigate,recommendations}){
 return <View style={s.corePanel}>
  <Text style={s.fieldLabel}>YOU DECIDE</Text>
  <Text style={s.nextLead}>Choose one if it fits, or leave the decision open for now.</Text>
  {result.choice.options.map((x,i)=><Pressable key={i} onPress={()=>setSelectedNext(x)} style={[s.nextOption,selectedNext===x&&s.nextOptionOn]}><View style={[s.nextRadio,selectedNext===x&&s.nextRadioOn]}/><Text style={[s.nextOptionText,selectedNext===x&&s.nextOptionTextOn]}>{x}</Text></Pressable>)}
  <Pressable onPress={()=>setSelectedNext('Not ready yet')} style={[s.nextOption,selectedNext==='Not ready yet'&&s.nextOptionOn]}><View style={[s.nextRadio,selectedNext==='Not ready yet'&&s.nextRadioOn]}/><Text style={[s.nextOptionText,selectedNext==='Not ready yet'&&s.nextOptionTextOn]}>I’m not ready to choose yet.</Text></Pressable>
  <View style={s.finishDivider}/>
  <Pressable onPress={onSave} disabled={saved} style={[s.saveJournalButton,saved&&s.saveJournalButtonDone]}><Text style={s.saveJournalText}>{saved?'Saved to Journal ✓':'Save this reflection to Journal'}</Text></Pressable>
  <Text style={s.finishHeading}>Where would you like to go next?</Text>
  <View style={s.destinationGrid}>
   <DestinationCard icon="✎" title="Journal" subtitle="Review what you saved" suggested={recommendations.some(x=>x.destination==='journal')} onPress={()=>onNavigate?.('journal')}/>
   <DestinationCard icon="▤" title="Learn" subtitle="Explore more context" suggested={recommendations.some(x=>x.destination==='learn')} onPress={()=>onNavigate?.('learn')}/>
   <DestinationCard icon="♡" title="Support" subtitle="See support options" suggested={recommendations.some(x=>x.destination==='support')} onPress={()=>onNavigate?.('support')}/>
   <DestinationCard icon="⌂" title="Home" subtitle="Return to the start" onPress={()=>onNavigate?.('home')}/>
  </View>
  <Pressable onPress={()=>setSelectedNext('Leave it for now')} style={[s.leaveOpenButton,selectedNext==='Leave it for now'&&s.leaveOpenButtonOn]}><Text style={s.leaveOpenText}>Leave it for now</Text></Pressable>
  <Text style={s.stageNote}>Suggested pathway: {result.next_pathway.replaceAll('_',' → ')}. Suggestions are optional; you decide what happens next.</Text>
 </View>;
}


function DestinationCard({icon,title,subtitle,suggested,onPress}){
 return <Pressable onPress={onPress} style={[s.destinationCard,suggested&&s.destinationCardSuggested]}>
  {suggested&&<View style={s.suggestedBadge}><Text style={s.suggestedBadgeText}>SUGGESTED</Text></View>}
  <Text style={s.destinationIcon}>{icon}</Text>
  <Text style={s.destinationTitle}>{title}</Text>
  <Text style={s.destinationSub}>{subtitle}</Text>
 </Pressable>;
}

function CoreList({label,items,empty,note}){
 return <View style={s.corePanel}><Text style={s.fieldLabel}>{label}</Text>{items?.length?items.map((x,i)=><View key={i} style={s.stageItem}><Text style={s.stageBullet}>•</Text><Text style={s.stageText}>{x}</Text></View>):<Text style={s.muted}>{empty}</Text>}<Text style={s.stageNote}>{note}</Text></View>;
}

function Result({title,items}){return <View style={s.resultCard}><Text style={s.resultLabel}>{title}</Text>{items?.length?items.map((x,i)=><Text key={i} style={s.body}>• {x}</Text>):<Text style={s.muted}>Nothing identified yet.</Text>}</View>}

function AppRoot(){
 const [screen,setScreen]=useState('home');
 const [coreOpen,setCoreOpen]=useState(false);
 const [pendingLearnTrail,setPendingLearnTrail]=useState(null);
 const [pendingSupportMode,setPendingSupportMode]=useState(null);
 const [journalEntries,setJournalEntries]=useState([]);
 const go=(id,detail)=>{setCoreOpen(false);if(id==='learn'&&detail)setPendingLearnTrail(detail);if(id==='support'&&detail)setPendingSupportMode(detail);setScreen(id);};
 const saveCoreToJournal=item=>setJournalEntries(v=>[item,...v]);
 return <Shell screen={screen} onTab={go}>
  {coreOpen?<Core onBack={()=>setCoreOpen(false)} onSaveJournal={saveCoreToJournal} onNavigate={go}/>:
   screen==='home'?<Home openCore={()=>setCoreOpen(true)} setScreen={go}/>:
   screen==='journal'?<Journal entries={journalEntries} setEntries={setJournalEntries}/>:
   screen==='learn'?<Learn initialTrail={pendingLearnTrail} onConsumeInitialTrail={()=>setPendingLearnTrail(null)}/>:
   screen==='support'?<Support initialMode={pendingSupportMode} onConsumeInitialMode={()=>setPendingSupportMode(null)} onNavigate={go}/>:
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
 sectionHeader:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginVertical:10},sectionLink:{color:T.sand,fontSize:11,fontWeight:'700'},historyPanel:{borderRadius:17,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#11100D',padding:12,marginBottom:12},historyIntro:{color:T.muted,fontSize:10.5,lineHeight:15,marginBottom:9},historyCounts:{flexDirection:'row',flexWrap:'wrap',gap:7},historyCountCard:{width:'48.8%',minHeight:64,borderRadius:13,borderWidth:1,borderColor:'#332C23',backgroundColor:'#0D0B08',padding:10,justifyContent:'center'},historyCountNumber:{color:T.sand,fontFamily:SERIF,fontSize:19,fontWeight:'700'},historyCountLabel:{color:T.text,fontSize:9.5,fontWeight:'700',marginTop:2},historyChanges:{marginTop:10,paddingTop:10,borderTopWidth:1,borderTopColor:'#2E281F'},filterRow:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:10},filterChip:{paddingHorizontal:10,paddingVertical:7,borderRadius:999,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08'},filterChipOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},filterChipText:{color:T.muted,fontSize:9.5,fontWeight:'800'},filterChipTextOn:{color:'#DDE8DC'},emptyState:{borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#11100D',padding:14},emptyTitle:{color:T.text,fontFamily:SERIF,fontSize:15,fontWeight:'700'},emptyText:{color:T.muted,fontSize:10.5,lineHeight:15,marginTop:3},journalEntry:{minHeight:98,borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',flexDirection:'row',alignItems:'flex-start'},entryTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:12},entryTag:{paddingHorizontal:7,paddingVertical:3,borderRadius:999,borderWidth:1,borderColor:'rgba(120,146,126,.7)',backgroundColor:'rgba(33,52,38,.7)'},entryTagText:{color:'#D7E4D6',fontSize:8.5,fontWeight:'800'},changedLine:{marginTop:8,paddingTop:7,borderTopWidth:1,borderTopColor:'#2E281F'},changedLabel:{color:T.sand,fontSize:7.5,fontWeight:'900',letterSpacing:1.2},changedText:{color:'#DCCFBE',fontSize:10,lineHeight:14,marginTop:2},
 stack:{gap:8},featureCard:{minHeight:78,borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',overflow:'hidden',flexDirection:'row',alignItems:'center'},
 featureImage:{minHeight:86,padding:12,flexDirection:'row',alignItems:'center',gap:11,justifyContent:'center'},featureImageRadius:{borderRadius:15},cardShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(8,5,3,.56)'},
 featureIcon:{width:42,height:42,borderRadius:21,borderWidth:1,backgroundColor:'rgba(8,6,4,.58)',alignItems:'center',justifyContent:'center',margin:12},featureImageRadius:{borderRadius:15},
 featureIconText:{fontSize:16,fontWeight:'800'},featureCopy:{flex:1,minWidth:0},featureTitle:{color:T.text,fontFamily:SERIF,fontSize:15,fontWeight:'700'},featureSub:{color:'#D4C6B5',fontSize:10.5,lineHeight:15,marginTop:2},featureArrow:{color:T.sand,fontSize:22,marginRight:12},
 search:{minHeight:48,borderRadius:14,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',color:T.text,paddingHorizontal:13,fontSize:14,marginBottom:12},learnPurpose:{borderRadius:16,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#111811',padding:12,marginBottom:12},learnPurposeText:{color:'#DCE7DA',fontSize:12,lineHeight:18},learnTrailCard:{minHeight:116,borderRadius:17,borderWidth:1,borderColor:'#3A3025',overflow:'hidden',backgroundColor:'#15120D'},learnTrailImage:{minHeight:116,justifyContent:'center'},learnTrailImageRadius:{borderRadius:16},learnTrailContent:{minHeight:116,padding:12,flexDirection:'row',alignItems:'center',gap:10},learnTrailIcon:{color:T.sand,fontSize:21,width:28,textAlign:'center'},learnTrailTitle:{color:T.text,fontFamily:SERIF,fontSize:16,fontWeight:'700'},learnTrailSub:{color:'#D6C8B7',fontSize:10.5,lineHeight:15,marginTop:2},learnTrailHelp:{color:T.muted,fontSize:9.5,lineHeight:14,marginTop:5},learnDetailHero:{minHeight:250,borderRadius:22,overflow:'hidden',borderWidth:1,borderColor:'#3A3025',justifyContent:'flex-end',marginBottom:10},learnDetailCopy:{padding:17},learnDetailTitle:{color:T.text,fontFamily:SERIF,fontSize:21,lineHeight:27,fontWeight:'700',marginTop:5},learnSection:{borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',padding:13,marginBottom:9},learnBody:{color:T.text,fontSize:12.5,lineHeight:19},sourceBadge:{alignSelf:'flex-start',paddingHorizontal:8,paddingVertical:5,borderRadius:999,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#17221A',marginBottom:8},sourceBadgeText:{color:'#DDE8DC',fontSize:7.5,fontWeight:'900',letterSpacing:1},
 supportModeTabs:{flexDirection:'row',gap:6,marginBottom:10,flexWrap:'wrap'},supportModeTab:{paddingHorizontal:10,paddingVertical:8,borderRadius:999,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08'},supportModeTabOn:{borderColor:T.sand,backgroundColor:'#201A13'},supportModeTabText:{color:T.muted,fontSize:9.5,fontWeight:'800'},supportModeTabTextOn:{color:T.text},supportModePanel:{borderRadius:17,borderWidth:1,padding:13,marginBottom:10},supportModeTitle:{color:T.text,fontFamily:SERIF,fontSize:20,lineHeight:25,fontWeight:'700'},supportModeBody:{color:'#E0D1C0',fontSize:11.5,lineHeight:17,marginTop:5},supportReminder:{borderRadius:15,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#11100D',padding:12,marginTop:10},supportReminderTitle:{color:T.text,fontFamily:SERIF,fontSize:14,fontWeight:'700'},supportReminderText:{color:T.muted,fontSize:10.5,lineHeight:15,marginTop:3},supportCard:{minHeight:80,borderRadius:17,borderWidth:1,padding:12,flexDirection:'row',alignItems:'center',gap:11},supportDanger:{backgroundColor:'#6E2D24',borderColor:'#A65040'},supportOchre:{backgroundColor:'#4A321B',borderColor:'#805C32'},supportGreen:{backgroundColor:'#20372A',borderColor:'#4E6F58'},supportNeutral:{backgroundColor:'#15120D',borderColor:'#3A3025'},
 supportIcon:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'rgba(255,247,236,.55)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.12)'},supportIconText:{color:'#FFF7EC',fontSize:17,fontWeight:'900'},rowCopy:{flex:1,minWidth:0},supportTitle:{color:'#FFF7EC',fontFamily:SERIF,fontSize:15,fontWeight:'700'},supportSub:{color:'#E0D1C0',fontSize:10.5,lineHeight:15,marginTop:2},supportArrow:{color:'#F4E2CD',fontSize:22},
 coreHeader:{flexDirection:'row',alignItems:'center',gap:10,marginTop:4,marginBottom:10},back:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',alignItems:'center',justifyContent:'center'},backText:{color:T.sand,fontSize:29,lineHeight:31},coreTitle:{color:T.text,fontFamily:SERIF,fontSize:25,fontWeight:'700',marginTop:2},coreLead:{color:T.muted,fontSize:12.5,lineHeight:19,marginBottom:10},progressTrack:{height:4,borderRadius:999,backgroundColor:'#2A241C',overflow:'hidden',marginBottom:12},progressFill:{height:4,borderRadius:999,backgroundColor:T.sand},
 corePanel:{borderRadius:17,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#14110D',padding:13,marginBottom:9},fieldLabel:{color:T.sand,fontSize:9,fontWeight:'900',letterSpacing:1.6,marginBottom:7},coreInput:{minHeight:135,borderRadius:13,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08',padding:12,color:T.text,fontSize:15,lineHeight:22,textAlignVertical:'top'},
 resultCard:{borderRadius:16,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',padding:13,marginBottom:8},resultLabel:{color:T.sand,fontSize:9,fontWeight:'900',letterSpacing:1.4,textTransform:'uppercase',marginBottom:6},body:{color:T.text,fontSize:12.5,lineHeight:19,marginVertical:1.5},muted:{color:T.muted,fontSize:11.5},coreHint:{color:T.muted,fontSize:10.5,lineHeight:15,marginTop:8},feelingWrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:7},feelingChip:{paddingHorizontal:11,paddingVertical:8,borderRadius:999,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08'},feelingChipOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},feelingChipText:{color:T.muted,fontSize:11,fontWeight:'700',textTransform:'capitalize'},feelingChipTextOn:{color:'#E4EEE2'},feelingInput:{minHeight:46,borderRadius:13,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08',color:T.text,paddingHorizontal:12,fontSize:14},truthBadges:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:9},truthBadge:{paddingHorizontal:8,paddingVertical:5,borderRadius:999,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#17221A'},truthBadgeText:{color:'#DDE8DC',fontSize:8,fontWeight:'900',letterSpacing:1},truthBadgeMuted:{borderColor:'#5A5147',backgroundColor:'#17130F'},truthBadgeMutedText:{color:'#B5A99B',fontSize:8,fontWeight:'900',letterSpacing:.7},reviewCard:{borderWidth:1,borderColor:'#342C22',borderRadius:13,padding:10,marginTop:8,backgroundColor:'#0D0B08'},reviewText:{color:T.text,fontSize:12.5,lineHeight:18},reviewActions:{flexDirection:'row',gap:6,marginTop:9,flexWrap:'wrap'},reviewButton:{minHeight:36,paddingHorizontal:10,borderRadius:999,borderWidth:1,borderColor:'#4A4034',alignItems:'center',justifyContent:'center'},reviewButtonOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},reviewButtonNo:{borderColor:'#8A5A4A',backgroundColor:'#2A1712'},reviewButtonKnown:{borderColor:T.ochre,backgroundColor:'#2A2113'},reviewButtonText:{color:T.muted,fontSize:9.5,fontWeight:'800'},reviewButtonTextOn:{color:'#DDE8DC'},reviewButtonTextNo:{color:'#F0C8B9'},reviewButtonTextKnown:{color:'#F1D4A8'},contextBadge:{alignSelf:'flex-start',paddingHorizontal:8,paddingVertical:5,borderRadius:999,borderWidth:1,borderColor:'rgba(216,194,160,.4)',backgroundColor:'rgba(0,0,0,.12)',marginBottom:8},contextBadgeText:{color:T.sand,fontSize:8,fontWeight:'900',letterSpacing:1},contextCalm:{borderColor:T.eucalyptus,backgroundColor:'#111811'},contextWatch:{borderColor:T.ochre,backgroundColor:'#211A10'},contextUrgent:{borderColor:T.clay,backgroundColor:'#281511'},stageItem:{flexDirection:'row',gap:8,alignItems:'flex-start',marginVertical:4},stageBullet:{color:T.sand,fontSize:16,lineHeight:19},stageText:{color:T.text,fontSize:13,lineHeight:19,flex:1},stageNote:{color:T.muted,fontSize:10.5,lineHeight:15,marginTop:10,paddingTop:9,borderTopWidth:1,borderTopColor:'#2E281F'},contextTitle:{color:T.text,fontFamily:SERIF,fontSize:19,fontWeight:'700',marginBottom:4},choiceCard:{flexDirection:'row',alignItems:'flex-start',gap:10,borderWidth:1,borderColor:'#342C22',borderRadius:13,padding:10,marginTop:7,backgroundColor:'#0D0B08'},choiceCardOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},choiceNumber:{width:24,height:24,borderRadius:12,borderWidth:1,borderColor:T.sand,color:T.sand,textAlign:'center',lineHeight:22,fontSize:10,fontWeight:'900'},choiceNumberOn:{borderColor:T.eucalyptus,color:'#DDE8DC'},choiceCopy:{flex:1},choiceText:{color:T.text,fontSize:12.5,lineHeight:18},choiceTextOn:{fontWeight:'800'},choiceHint:{color:T.muted,fontSize:9.5,lineHeight:14,marginTop:3},nextLead:{color:T.muted,fontSize:11.5,lineHeight:17,marginBottom:7},nextOption:{minHeight:48,borderWidth:1,borderColor:'#3A3025',borderRadius:13,padding:10,flexDirection:'row',alignItems:'center',gap:9,marginTop:7,backgroundColor:'#0D0B08'},nextOptionOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},nextRadio:{width:18,height:18,borderRadius:9,borderWidth:1,borderColor:'#6F6253'},nextRadioOn:{borderWidth:5,borderColor:T.eucalyptus,backgroundColor:'#F1E9DA'},nextOptionText:{color:'#D8CBBA',fontSize:12.5,lineHeight:18,flex:1},nextOptionTextOn:{color:T.text,fontWeight:'700'},finishDivider:{height:1,backgroundColor:'#2E281F',marginVertical:12},saveJournalButton:{minHeight:46,borderRadius:13,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#17221A',alignItems:'center',justifyContent:'center',paddingHorizontal:12},saveJournalButtonDone:{opacity:.7},saveJournalText:{color:'#DDE8DC',fontSize:11.5,fontWeight:'900'},crossLinkButton:{marginTop:10,minHeight:62,borderRadius:14,borderWidth:1,borderColor:'#4B4338',backgroundColor:'#100E0A',padding:11,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},crossLinkEyebrow:{color:T.sand,fontSize:7.5,fontWeight:'900',letterSpacing:1.2},crossLinkTitle:{color:T.text,fontFamily:SERIF,fontSize:14,fontWeight:'700',marginTop:2},crossLinkSub:{color:T.muted,fontSize:9.5,lineHeight:14,marginTop:2,maxWidth:250},crossLinkArrow:{color:T.sand,fontSize:19},finishHeading:{color:T.text,fontFamily:SERIF,fontSize:17,fontWeight:'700',marginTop:14,marginBottom:7},destinationGrid:{flexDirection:'row',flexWrap:'wrap',gap:7},destinationCard:{width:'48.8%',minHeight:92,borderRadius:14,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#0D0B08',padding:10,justifyContent:'flex-end'},destinationCardSuggested:{borderColor:T.eucalyptus,backgroundColor:'#111811'},suggestedBadge:{position:'absolute',top:8,right:8,paddingHorizontal:6,paddingVertical:3,borderRadius:999,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#17221A'},suggestedBadgeText:{color:'#DDE8DC',fontSize:6.5,fontWeight:'900',letterSpacing:.8},destinationIcon:{color:T.sand,fontSize:17,marginBottom:6},destinationTitle:{color:T.text,fontFamily:SERIF,fontSize:13.5,fontWeight:'700'},destinationSub:{color:T.muted,fontSize:9.5,lineHeight:13,marginTop:2},leaveOpenButton:{minHeight:42,borderRadius:13,borderWidth:1,borderColor:'#4A4034',alignItems:'center',justifyContent:'center',marginTop:8},leaveOpenButtonOn:{borderColor:T.eucalyptus,backgroundColor:'#17221A'},leaveOpenText:{color:T.muted,fontSize:10.5,fontWeight:'800'},coreNavRow:{flexDirection:'row',gap:8,marginTop:2,marginBottom:10},coreBackButton:{minHeight:47,minWidth:88,borderRadius:14,borderWidth:1,borderColor:'#3A3025',backgroundColor:'#15120D',alignItems:'center',justifyContent:'center',paddingHorizontal:14},coreBackButtonText:{color:T.muted,fontWeight:'800',fontSize:12},coreNextButton:{minHeight:47,borderRadius:14,backgroundColor:T.sand,flex:1,alignItems:'center',justifyContent:'space-between',flexDirection:'row',paddingHorizontal:14},coreNextText:{color:'#15100A',fontWeight:'900',fontSize:12.5},
 secondary:{minHeight:46,borderRadius:14,borderWidth:1,borderColor:T.eucalyptus,backgroundColor:'#111711',alignItems:'center',justifyContent:'space-between',flexDirection:'row',paddingHorizontal:14,marginTop:2,marginBottom:10},secondaryText:{color:T.text,fontWeight:'800',fontSize:12.5},secondaryArrow:{color:T.eucalyptus,fontSize:15},techCard:{borderColor:T.eucalyptus,backgroundColor:'#111711'},techKicker:{color:T.eucalyptus,fontSize:9,fontWeight:'900',letterSpacing:1.5,marginBottom:7},
 pressed:{opacity:.72},accessibleTap:{minHeight:44,minWidth:44},
 ...V
});