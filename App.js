import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, TextInput, Pressable,
  StyleSheet, StatusBar, Platform, Linking, Animated
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const C = {
  bg:'#06131B', panel:'#0E2533', panel2:'#143244', line:'#294B5E',
  text:'#FFF8ED', muted:'#A9BBC6', cream:'#FFE2AF', ochre:'#D97D24',
  rust:'#8A2E1B', gold:'#F1B650', green:'#37C978', yellow:'#F5B94C',
  red:'#FF5454', blue:'#3E9CFF', purple:'#6C49FF', cyan:'#1CBCEB', white:'#FFFFFF'
};

const signalNames = {
  choice:'Choice', boundary:'Boundaries', pressure:'Pressure',
  power:'Power', dependency:'Dependency', secrecy:'Secrecy'
};

const signalIcons = {
  choice:'✋', boundary:'🛡', pressure:'👥', power:'⚖', dependency:'🔗', secrecy:'◉'
};

function has(text, words){
  const t=(text||'').toLowerCase();
  return words.some(w => t.includes(w));
}

function analyse({age,text,relationship,feeling}) {
  const child = age === '10–12' || age === '13–15';
  const youngChild = age === '10–12';
  const boundary = has(text,['said no','said stop','not comfortable','leave me alone','ignored','wouldn’t stop',"wouldn't stop",'kept going','crossed my boundary']);
  const respectedBoundary = has(text,['stopped when i said no','stopped when i said stop','respected my boundary','asked and stopped']);
  const pressure = has(text,['kept asking','pressured','pressure','guilt','threat','forced','made me',"wouldn't take no",'begged','coerce','coerc']);
  const secrecy = has(text,['secret',"don't tell",'dont tell','keep this between','hide it','nobody can know']);
  const dependency = has(text,["can't leave",'cant leave','depend','nowhere else','money','housing','only person','need them']);
  const power = relationship === 'Authority / older person' || has(text,['teacher','coach','boss','manager','carer','doctor','counsellor','older adult','parent']);
  const choiceReduced = has(text,['no choice','had to',"couldn't say no",'couldnt say no','afraid to say no','scared to refuse']) || pressure || feeling === 'Scared';

  const score = {
    choice: choiceReduced ? 88 : 20,
    boundary: respectedBoundary ? 12 : boundary ? 90 : 22,
    pressure: pressure ? 92 : 18,
    power: power ? 68 : 22,
    dependency: dependency ? 72 : 18,
    secrecy: secrecy ? 94 : 14
  };

  const critical = !respectedBoundary && boundary && (pressure || secrecy || power);
  const childConcern = child && !respectedBoundary && (boundary || pressure || secrecy || power);
  const high = critical || childConcern || (pressure && secrecy);
  const elevated = !high && ((!respectedBoundary && boundary) || pressure || secrecy || power || dependency || choiceReduced || ['Confused','Worried','Scared'].includes(feeling));

  const level = high ? 'Safeguarding Concern Identified' : elevated ? 'Safety Concerns Detected' : 'No Major Red Flags Detected';
  const factors=[];
  if(youngChild) factors.push('Child-safety mode is active for age 10–12.');
  else if(child) factors.push('Safeguarding mode is active because a person under 16 is involved.');
  if(respectedBoundary) factors.push('The description indicates a boundary was respected.');
  else if(boundary) factors.push('A boundary may have been expressed or crossed.');
  if(pressure) factors.push('Pressure or persistence language was detected.');
  if(power) factors.push('A power or authority difference may be present.');
  if(dependency) factors.push('Dependency may make free decision-making harder.');
  if(secrecy) factors.push('Secrecy language was detected.');
  if(choiceReduced) factors.push('Choice may have been reduced by fear, pressure or lack of options.');
  if(!factors.length) factors.push('No strong keyword-based safety signal was detected. Context still matters.');

  const emotion = high ? 'The pattern may leave someone feeling confused, frightened, ashamed, responsible for another person, or unsure of their own judgement.'
    : elevated ? 'The situation may create uncertainty, stress, self-doubt or pressure. Slowing things down can help restore choice.'
    : 'The description does not show strong warning signs in this prototype, but feelings and context still matter.';

  const steps = high ? [
    'Ensure immediate safety.',
    'Talk to a trusted adult or support service.',
    'Consider professional safeguarding support.',
    'Learn more about healthy boundaries.',
    'Keep factual notes separate from interpretations.'
  ] : elevated ? [
    'Slow the situation down.',
    'Make room for clear choice and boundaries.',
    'Talk with a trusted support person.',
    'Review the six safety signals.',
    'Seek professional support if concerns continue.'
  ] : [
    'Keep communication clear.',
    'Continue respecting boundaries.',
    'Stay open to how the person feels.',
    'Use the Learning Centre to build safety knowledge.'
  ];
  if(child) steps.unshift('Use child-focused safeguarding support rather than asking the child to solve the situation alone.');

  return {child, high, elevated, level, score, factors, emotion, steps};
}

function Card({children,style}){ return <View style={[styles.card,style]}>{children}</View>; }

function PrimaryButton({children,onPress,color=C.cream,darkText=true,style}){
  return <Pressable onPress={onPress} style={({pressed})=>[styles.primary,{backgroundColor:color},style,pressed&&{opacity:.8}]}>
    <Text style={[styles.primaryText,!darkText&&{color:C.white}]}>{children}</Text>
  </Pressable>;
}

function SmallPill({children,active,onPress}){
  return <Pressable onPress={onPress} style={[styles.pill,active&&styles.pillActive]}>
    <Text style={[styles.pillText,active&&styles.pillTextActive]}>{children}</Text>
  </Pressable>;
}

function Ornament(){
  return <View style={styles.ornamentWrap}>
    <View style={styles.ringOuter}><View style={styles.ringMid}><View style={styles.ringInner}><Text style={styles.ringSymbol}>◉</Text></View></View></View>
    <View style={styles.dotRow}>{Array.from({length:9}).map((_,i)=><View key={i} style={[styles.dot,{opacity:i%2?0.55:1}]} />)}</View>
  </View>;
}

function Stepper({active}){
  return <View style={styles.stepper}>
    {[['1','Describe'],['2','Analyse'],['3','Results']].map(([n,t],i)=><React.Fragment key={n}>
      <View style={styles.stepItem}><View style={[styles.stepCircle,i<=active&&styles.stepCircleOn]}><Text style={styles.stepNum}>{n}</Text></View><Text style={styles.stepLabel}>{t}</Text></View>
      {i<2&&<View style={[styles.stepLine,i<active&&{backgroundColor:C.blue}]} />}
    </React.Fragment>)}
  </View>;
}

function SignalRow({kind,value}){
  const color=value>=70?C.red:value>=45?C.yellow:C.green;
  const label=value>=70?'High Risk':value>=45?'Moderate':'Low';
  return <View style={styles.signalRow}>
    <View style={[styles.signalIcon,{backgroundColor:color}]}><Text style={styles.signalIconText}>{signalIcons[kind]}</Text></View>
    <Text style={styles.signalName}>{signalNames[kind]}</Text>
    <View style={styles.meter}><View style={[styles.meterFill,{width:`${value}%`,backgroundColor:color}]} /></View>
    <View style={[styles.riskPill,{borderColor:color}]}><Text style={[styles.riskText,{color}]}>{label}</Text></View>
  </View>;
}

function BackTitle({title,onBack}){
  return <View style={styles.backTitle}><Pressable onPress={onBack} style={styles.backBtn}><Text style={styles.backArrow}>‹</Text></Pressable><Text style={styles.screenTitle}>{title}</Text></View>;
}

function MenuRow({icon,title,subtitle,onPress,accent=C.cream}){
  return <Pressable onPress={onPress} style={({pressed})=>[styles.menuRow,pressed&&{opacity:.78}]}>
    <View style={[styles.menuIcon,{borderColor:accent}]}><Text style={styles.menuIconText}>{icon}</Text></View>
    <View style={{flex:1}}><Text style={styles.menuTitle}>{title}</Text>{subtitle?<Text style={styles.menuSub}>{subtitle}</Text>:null}</View>
    <Text style={styles.chev}>›</Text>
  </Pressable>;
}

export default function App(){
  const [screen,setScreen]=useState('home');
  const [age,setAge]=useState('16+');
  const [relationship,setRelationship]=useState('Partner / peer');
  const [feeling,setFeeling]=useState('Confused');
  const [scenario,setScenario]=useState('');
  const [result,setResult]=useState(null);
  const [analysisStep,setAnalysisStep]=useState(0);
  const [journal,setJournal]=useState([]);
  const [journalText,setJournalText]=useState('');
  const spin=useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    if(screen!=='analysis') return;
    setAnalysisStep(0);
    const loop=Animated.loop(Animated.timing(spin,{toValue:1,duration:1700,useNativeDriver:true}));
    loop.start();
    const timers=[450,850,1250,1650,2050,2450].map((ms,i)=>setTimeout(()=>setAnalysisStep(i+1),ms));
    const done=setTimeout(()=>{
      const r=analyse({age,text:scenario,relationship,feeling});
      setResult(r);
      loop.stop(); spin.setValue(0);
      setScreen('results');
    },2850);
    return ()=>{timers.forEach(clearTimeout);clearTimeout(done);loop.stop();};
  },[screen]);

  const go=s=>setScreen(s);
  const startAnalysis=()=>go('analysis');
  const addJournal=()=>{
    const text=journalText.trim() || (result ? `Safety reflection: ${result.level}` : 'New reflection');
    setJournal(j=>[{id:Date.now(),date:new Date().toLocaleDateString('en-AU'),text},...j]);
    setJournalText('');
  };

  const Header=()=> <View style={styles.header}>
    <View style={styles.brandDot}><Text style={styles.brandDotText}>◉</Text></View>
    <View style={{flex:1}}><Text style={styles.headerTitle}>EMOTIONAL SAFETY SYSTEM</Text><Text style={styles.headerSub}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text></View>
  </View>;

  const BottomNav=()=> <View style={styles.nav}>
    {[
      ['home','⌂','Home'],['learn','▤','Learn'],['support','♥','Support'],['more','☰','More']
    ].map(([k,i,l])=><Pressable key={k} onPress={()=>go(k)} style={styles.navItem}>
      <Text style={[styles.navIcon,screen===k&&{color:C.cream}]}>{i}</Text><Text style={[styles.navText,screen===k&&{color:C.cream}]}>{l}</Text>
    </Pressable>)}
  </View>;

  return <SafeAreaView style={styles.safe}>
    <ExpoStatusBar style="light" />
    <Header/>
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

      {screen==='home'&&<>
        <View style={styles.hero}>
          <View style={styles.sunGlow}><View style={styles.sun}><Text style={styles.sunText}>◉</Text></View></View>
          <View style={styles.horizon} />
          <Text style={styles.heroTitle}>Emotional{`\n`}Safety System</Text>
          <Text style={styles.heroSub}>People • Culture • Truth • Safety • Future</Text>
          <Text style={styles.heroTiny}>Support • Understand • Keep People Safe</Text>
        </View>
        <Ornament/>
        <PrimaryButton onPress={()=>go('assessment')}>＋  New Assessment</PrimaryButton>
        <View style={{height:10}} />
        <MenuRow icon="▤" title="Learning Centre" subtitle="Simple guides, examples and safety knowledge" onPress={()=>go('learn')} />
        <MenuRow icon="♥" title="Support Resources" subtitle="Trusted Australian and WA pathways" onPress={()=>go('support')} accent={C.green}/>
        <MenuRow icon="✎" title="My Journal" subtitle="Optional private reflection during this session" onPress={()=>go('journal')} accent={C.blue}/>
        <MenuRow icon="i" title="About the System" subtitle="Purpose, six signals, evidence and connected flow" onPress={()=>go('about')} accent={C.gold}/>
      </>}

      {screen==='assessment'&&<>
        <BackTitle title="New Assessment" onBack={()=>go('home')} />
        <Stepper active={0}/>
        <Card>
          <Text style={styles.label}>Describe what happened{`\n`}<Text style={styles.labelSoft}>(in your own words)</Text></Text>
          <TextInput multiline value={scenario} onChangeText={setScenario} maxLength={2500}
            placeholder="Use simple words. Avoid names, addresses or identifying details."
            placeholderTextColor="#6E8491" style={styles.input} textAlignVertical="top"/>

          <Text style={styles.label}>Age range <Text style={styles.labelSoft}>(optional)</Text></Text>
          <View style={styles.wrap}>{['10–12','13–15','16+','Unsure'].map(x=><SmallPill key={x} active={age===x} onPress={()=>setAge(x)}>{x}</SmallPill>)}</View>

          <Text style={styles.label}>Who was involved? <Text style={styles.labelSoft}>(optional)</Text></Text>
          <View style={styles.grid2}>{[
            ['Me / self','◉'],['Partner / peer','♥'],['Family','👥'],['Authority / older person','♟']
          ].map(([x,icon])=><Pressable key={x} onPress={()=>setRelationship(x)} style={[styles.selectCard,relationship===x&&styles.selectCardOn]}><Text style={styles.selectIcon}>{icon}</Text><Text style={styles.selectText}>{x}</Text></Pressable>)}</View>

          <Text style={styles.label}>How did you feel? <Text style={styles.labelSoft}>(optional)</Text></Text>
          <View style={styles.wrap}>{[['Sad','☹'],['Confused','◉'],['Worried','◌'],['Scared','!'],['Okay','✓']].map(([x,icon])=><Pressable key={x} onPress={()=>setFeeling(x)} style={[styles.feel,feeling===x&&styles.feelOn]}><Text style={styles.feelIcon}>{icon}</Text><Text style={styles.feelText}>{x}</Text></Pressable>)}</View>

          <View style={styles.infoBox}><Text style={styles.infoText}>Privacy-first prototype: your description is analysed on this device and is not sent to a remote AI service.</Text></View>
          <PrimaryButton onPress={startAnalysis}>Analyse My Situation  →</PrimaryButton>
        </Card>
      </>}

      {screen==='analysis'&&<>
        <BackTitle title="Analysing Your Situation" onBack={()=>go('assessment')} />
        <Stepper active={1}/>
        <View style={styles.analysisCenter}>
          <Animated.View style={[styles.analysisRing,{transform:[{rotate:spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']})}]}]}>
            <View style={styles.analysisRing2}><Text style={styles.brain}>◉</Text></View>
          </Animated.View>
        </View>
        <Card>
          {[
            'Reading and understanding','Checking for safety signals','Analysing language and context','Comparing with evidence','Applying safety rules','Preparing your results'
          ].map((x,i)=><View key={x} style={styles.checkRow}><View style={[styles.checkDot,i<analysisStep&&styles.checkOn]}><Text style={styles.checkText}>{i<analysisStep?'✓':'•'}</Text></View><Text style={styles.checkLabel}>{x}</Text></View>)}
        </Card>
        <Text style={styles.centerMuted}>This usually takes a few seconds.</Text>
      </>}

      {screen==='results'&&result&&<>
        <BackTitle title="Your Safety Analysis" onBack={()=>go('assessment')} />
        <Stepper active={2}/>
        <View style={[styles.alertBox,{backgroundColor:result.high?'#7B171C':result.elevated?'#5A3A12':'#123B35'}]}>
          <Text style={styles.alertIcon}>{result.high?'⚠':'✓'}</Text>
          <View style={{flex:1}}><Text style={styles.alertTitle}>{result.level}</Text><Text style={styles.alertText}>{result.child?'Safeguarding mode is active. This app does not calculate sexual consent for a child.':'This prototype highlights observable safety signals and does not determine guilt or diagnose people.'}</Text></View>
        </View>
        <Card>
          <Text style={styles.cardTitle}>Six Safety Signals</Text>
          {Object.entries(result.score).map(([k,v])=><SignalRow key={k} kind={k} value={v}/>)}
        </Card>
        <PrimaryButton onPress={()=>go('explanation')}>See Explanation  →</PrimaryButton>
      </>}

      {screen==='explanation'&&result&&<>
        <BackTitle title="What This Might Mean" onBack={()=>go('results')} />
        <View style={styles.tabRow}><View style={[styles.tab,styles.tabOn]}><Text style={styles.tabTextOn}>Overview</Text></View><View style={styles.tab}><Text style={styles.tabText}>Signals</Text></View><View style={styles.tab}><Text style={styles.tabText}>Emotion</Text></View><View style={styles.tab}><Text style={styles.tabText}>Context</Text></View></View>
        <Card><Text style={styles.cardEyebrow}>💡  PLAIN LANGUAGE EXPLANATION</Text><Text style={styles.body}>{result.high?'The system detected a combination of safety indicators that deserves careful attention. Pressure, ignored boundaries, secrecy or power differences can reduce a person’s ability to choose freely.':result.elevated?'Some warning signs or uncertainty were detected. These do not prove intent, but they can be useful prompts to slow down, check boundaries and seek support.':'The current description does not produce strong warning signals in this local rule set. That does not prove a situation is safe.'}</Text></Card>
        <Card><Text style={styles.cardEyebrow}>♥  EMOTIONAL IMPACT</Text><Text style={styles.body}>{result.emotion}</Text></Card>
        <Card><Text style={styles.cardEyebrow}>●  KEY THINGS DETECTED</Text>{result.factors.map((f,i)=><Text key={i} style={styles.bullet}>• {f}</Text>)}</Card>
        <View style={styles.infoBox}><Text style={styles.infoText}>AI + EI concept layer: this prototype uses transparent local language rules plus emotional-safety explanations. It is not a diagnosis or professional assessment.</Text></View>
        <PrimaryButton onPress={()=>go('next')}>Next Steps  →</PrimaryButton>
      </>}

      {screen==='next'&&result&&<>
        <BackTitle title="Recommended Next Steps" onBack={()=>go('explanation')} />
        {result.steps.map((s,i)=><View key={i} style={styles.nextCard}><View style={styles.nextNum}><Text style={styles.nextNumText}>{i+1}</Text></View><Text style={styles.nextText}>{s}</Text></View>)}
        <PrimaryButton color="#1EAE5F" darkText={false} onPress={()=>go('support')}>☎  Find Support Services</PrimaryButton>
        <PrimaryButton color={C.purple} darkText={false} onPress={()=>go('learn')}>▤  Learn More</PrimaryButton>
        <PrimaryButton color={C.cyan} darkText={false} onPress={()=>go('journal')}>🔗  Save to My Journal</PrimaryButton>
      </>}

      {screen==='learn'&&<>
        <BackTitle title="Learning Centre" onBack={()=>go('home')} />
        <TextInput editable={false} placeholder="Search topics..." placeholderTextColor="#6D8290" style={styles.searchBox}/>
        {[
          ['✋','Understanding Choice & Consent','Free choice needs clarity, space and the ability to say no.'],
          ['🛡','Healthy Boundaries','Boundaries help people understand what is and is not okay.'],
          ['👥','Recognising Pressure','Persistence, guilt, threats and emotional leverage can reduce choice.'],
          ['⚖','Power and Control','Age, authority, housing, money and caregiving can affect freedom.'],
          ['♥','Emotions and Wellbeing','Fear, confusion, shame and self-doubt can signal emotional strain.'],
          ['◉','Relationships','Safety grows through respect, honesty, repair and clear boundaries.'],
          ['♟','Child Development','Children need age-appropriate support and adults who carry safeguarding responsibility.'],
          ['🌿','Cultural Strength and Healing','Culture, identity, belonging and trusted community can be protective strengths.']
        ].map(([icon,title,sub])=><MenuRow key={title} icon={icon} title={title} subtitle={sub} onPress={()=>{}} accent={C.gold}/>) }
      </>}

      {screen==='support'&&<>
        <BackTitle title="Support Resources" onBack={()=>go('home')} />
        <View style={styles.tabRow}><View style={[styles.tab,styles.tabOn]}><Text style={styles.tabTextOn}>WA Services</Text></View><View style={styles.tab}><Text style={styles.tabText}>National</Text></View></View>
        <MenuRow icon="☎" title="Emergency — 000" subtitle="If someone is in immediate danger" onPress={()=>Linking.openURL('tel:000')} accent={C.red}/>
        <MenuRow icon="◉" title="Kids Helpline" subtitle="1800 55 1800 • support for children and young people" onPress={()=>Linking.openURL('tel:1800551800')} accent={C.blue}/>
        <MenuRow icon="♥" title="1800RESPECT" subtitle="1800 737 732 • domestic, family and sexual violence support" onPress={()=>Linking.openURL('tel:1800737732')} accent={C.purple}/>
        <MenuRow icon="☎" title="Lifeline" subtitle="13 11 14 • crisis support" onPress={()=>Linking.openURL('tel:131114')} accent={C.green}/>
        <MenuRow icon="●" title="13YARN" subtitle="13 92 76 • Aboriginal & Torres Strait Islander crisis support" onPress={()=>Linking.openURL('tel:139276')} accent={C.gold}/>
        <MenuRow icon="▣" title="eSafety Commissioner" subtitle="Online safety information and reporting" onPress={()=>Linking.openURL('https://www.esafety.gov.au/')} accent={C.cyan}/>
        <MenuRow icon="WA" title="WA Government Services" subtitle="Community, family, child safety and support information" onPress={()=>Linking.openURL('https://www.wa.gov.au/')} accent={C.ochre}/>
        <View style={[styles.infoBox,{borderColor:C.gold}]}><Text style={styles.infoText}>If someone is in immediate danger, call 000.</Text></View>
      </>}

      {screen==='journal'&&<>
        <BackTitle title="My Journal" onBack={()=>go('home')} />
        <View style={styles.tabRow}><View style={[styles.tab,styles.tabOn]}><Text style={styles.tabTextOn}>Entries</Text></View><View style={styles.tab}><Text style={styles.tabText}>Progress</Text></View></View>
        <Card>
          <Text style={styles.label}>New reflection</Text>
          <TextInput multiline value={journalText} onChangeText={setJournalText} style={styles.journalInput} placeholder="Write a short reflection or next step..." placeholderTextColor="#6D8290" textAlignVertical="top"/>
          <PrimaryButton onPress={addJournal}>＋ New Journal Entry</PrimaryButton>
        </Card>
        {journal.length===0?<Card><Text style={styles.centerMuted}>No entries yet. Journal notes in this prototype last only for this app session.</Text></Card>:journal.map(j=><Card key={j.id}><Text style={styles.journalDate}>▣  {j.date}</Text><Text style={styles.body}>{j.text}</Text></Card>)}
      </>}

      {screen==='about'&&<>
        <BackTitle title="About the Emotional Safety System" onBack={()=>go('home')} />
        <Ornament/>
        <Text style={styles.aboutLead}>A safe, culturally respectful prototype designed to help people understand situations, recognise safety signals and find support.</Text>
        <View style={styles.grid2}>
          {[
            ['◎','Our Purpose','Understand safety without losing the human story.'],
            ['⚙','How It Works','Words → signals → rules → explanation → support.'],
            ['▥','The Six Signals','Choice, Boundaries, Pressure, Power, Dependency, Secrecy.'],
            ['▤','Evidence & Research','Designed to be transparent and reviewable.']
          ].map(([icon,t,s])=><Pressable key={t} onPress={t==='How It Works'?()=>go('flow'):undefined} style={styles.aboutTile}><Text style={styles.aboutIcon}>{icon}</Text><Text style={styles.aboutTitle}>{t}</Text><Text style={styles.aboutText}>{s}</Text></Pressable>)}
        </View>
        <PrimaryButton onPress={()=>go('flow')}>See the Connected Flow  →</PrimaryButton>
        <Card><Text style={styles.cardTitle}>Important limits</Text><Text style={styles.body}>This prototype does not diagnose people, determine guilt, replace emergency care, provide legal findings or make child-protection decisions. Real deployment would require professional safeguarding, privacy, legal, cultural, accessibility and security review.</Text></Card>
      </>}

      {screen==='flow'&&<>
        <BackTitle title="Complete Flow — All Connected" onBack={()=>go('about')} />
        {[
          ['👤','Your Input','Phone or tablet'],['▣','App Interface','Assessment and navigation'],['⚙','Emotional Safety Engine','Transparent rules and critical overrides'],['◉','AI + EI Concept Layer','Language understanding + emotional explanation'],['▥','Six Safety Signals','Choice • Boundaries • Pressure • Power • Dependency • Secrecy'],['♥','Results & Support','Plain language, next steps and support pathways']
        ].map(([icon,t,s],i)=><React.Fragment key={t}><View style={styles.flowBox}><Text style={styles.flowIcon}>{icon}</Text><View><Text style={styles.flowTitle}>{t}</Text><Text style={styles.flowSub}>{s}</Text></View></View>{i<5&&<Text style={styles.flowArrow}>↓</Text>}</React.Fragment>)}
        <Card><Text style={styles.cardTitle}>Designed for Everyone</Text>{['Simple and easy to use','Culturally respectful design','Privacy-first prototype','Works on phone or tablet','Clear explanations','Accessible learning structure','Links to real support services'].map(x=><Text key={x} style={styles.good}>✓  {x}</Text>)}</Card>
      </>}

      {screen==='more'&&<>
        <BackTitle title="More" onBack={()=>go('home')} />
        <MenuRow icon="✎" title="My Journal" subtitle="Reflect and track your thoughts" onPress={()=>go('journal')} accent={C.blue}/>
        <MenuRow icon="i" title="About the System" subtitle="Purpose, model and limitations" onPress={()=>go('about')} accent={C.gold}/>
        <MenuRow icon="⚙" title="Connected Flow" subtitle="See how the whole system works together" onPress={()=>go('flow')} accent={C.cyan}/>
      </>}

    </ScrollView>
    <BottomNav/>
  </SafeAreaView>;
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg,paddingTop:Platform.OS==='android'?StatusBar.currentHeight||0:0},
  header:{height:63,paddingHorizontal:15,borderBottomWidth:1,borderBottomColor:'#2A4452',backgroundColor:'#081720',flexDirection:'row',alignItems:'center',gap:10},
  brandDot:{width:39,height:39,borderRadius:20,borderWidth:2,borderColor:C.gold,backgroundColor:'#4A241A',alignItems:'center',justifyContent:'center'},
  brandDotText:{color:C.cream,fontSize:20,fontWeight:'900'},headerTitle:{color:C.text,fontWeight:'900',fontSize:13,letterSpacing:.6},headerSub:{color:C.cream,fontSize:8,marginTop:3,letterSpacing:.65},
  scroll:{padding:13,paddingBottom:100},
  hero:{height:260,borderRadius:20,overflow:'hidden',backgroundColor:'#271016',borderWidth:1,borderColor:'#704023',padding:20,justifyContent:'flex-end',position:'relative'},
  horizon:{position:'absolute',left:0,right:0,bottom:0,height:100,backgroundColor:'#0A1717',opacity:.9},sunGlow:{position:'absolute',right:24,top:28,width:150,height:150,borderRadius:75,backgroundColor:'#7B301E',alignItems:'center',justifyContent:'center'},sun:{width:105,height:105,borderRadius:53,backgroundColor:'#D96E24',borderWidth:5,borderColor:'#F1B650',alignItems:'center',justifyContent:'center'},sunText:{fontSize:57,color:'#371715',fontWeight:'900'},
  heroTitle:{fontSize:36,lineHeight:37,color:C.text,fontWeight:'900',zIndex:2,textShadowColor:'#000',textShadowOffset:{width:0,height:2},textShadowRadius:5},heroSub:{zIndex:2,color:C.cream,fontSize:12,fontWeight:'800',marginTop:10},heroTiny:{zIndex:2,color:'#E8D9C8',fontSize:11,marginTop:5},
  ornamentWrap:{alignItems:'center',marginVertical:15},ringOuter:{width:86,height:86,borderRadius:43,borderWidth:4,borderColor:C.ochre,backgroundColor:'#341B19',alignItems:'center',justifyContent:'center'},ringMid:{width:65,height:65,borderRadius:33,borderWidth:4,borderColor:C.gold,alignItems:'center',justifyContent:'center'},ringInner:{width:42,height:42,borderRadius:21,borderWidth:3,borderColor:'#A8321D',alignItems:'center',justifyContent:'center'},ringSymbol:{color:C.cream,fontSize:23,fontWeight:'900'},dotRow:{flexDirection:'row',gap:7,marginTop:8},dot:{width:5,height:5,borderRadius:3,backgroundColor:C.gold},
  primary:{borderRadius:13,minHeight:53,paddingHorizontal:15,alignItems:'center',justifyContent:'center'},primaryText:{color:'#21170D',fontWeight:'900',fontSize:15},
  card:{backgroundColor:C.panel,borderRadius:17,borderWidth:1,borderColor:C.line,padding:16,marginBottom:12},
  menuRow:{minHeight:73,backgroundColor:'#0E2533',borderWidth:1,borderColor:C.line,borderRadius:15,padding:12,marginBottom:9,flexDirection:'row',alignItems:'center',gap:12},menuIcon:{width:42,height:42,borderRadius:12,borderWidth:1.5,alignItems:'center',justifyContent:'center',backgroundColor:'#102E3E'},menuIconText:{color:C.text,fontWeight:'900',fontSize:18},menuTitle:{color:C.text,fontWeight:'800',fontSize:15},menuSub:{color:C.muted,fontSize:11,lineHeight:16,marginTop:3},chev:{color:C.muted,fontSize:27},
  backTitle:{flexDirection:'row',alignItems:'center',marginBottom:12},backBtn:{width:42,height:42,borderRadius:12,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',marginRight:10},backArrow:{color:C.text,fontSize:32,lineHeight:32},screenTitle:{color:C.text,fontSize:24,fontWeight:'900',flex:1},
  stepper:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:13},stepItem:{alignItems:'center',width:66},stepCircle:{width:27,height:27,borderRadius:14,backgroundColor:'#203A49',alignItems:'center',justifyContent:'center'},stepCircleOn:{backgroundColor:C.blue},stepNum:{color:C.white,fontWeight:'900',fontSize:12},stepLabel:{color:C.muted,fontSize:9,marginTop:4},stepLine:{height:2,backgroundColor:'#294757',width:38,marginTop:-13},
  label:{color:C.text,fontWeight:'800',fontSize:14,marginTop:10,marginBottom:8},labelSoft:{color:C.muted,fontWeight:'500'},input:{minHeight:150,backgroundColor:'#0A1B25',borderColor:'#456270',borderWidth:1,borderRadius:13,padding:13,color:C.text,fontSize:14,lineHeight:20},wrap:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:3},pill:{paddingHorizontal:13,paddingVertical:9,borderRadius:10,borderWidth:1,borderColor:'#365566',backgroundColor:'#102A38'},pillActive:{backgroundColor:'#244A69',borderColor:C.blue},pillText:{color:'#CEDAE0',fontWeight:'700',fontSize:12},pillTextActive:{color:C.white},
  grid2:{flexDirection:'row',flexWrap:'wrap',gap:9},selectCard:{width:'48.5%',borderRadius:13,borderWidth:1,borderColor:'#315162',backgroundColor:'#102A38',padding:12,alignItems:'center'},selectCardOn:{borderColor:C.blue,backgroundColor:'#173C57'},selectIcon:{fontSize:23,color:C.cream,marginBottom:6},selectText:{fontSize:11,color:C.text,textAlign:'center',fontWeight:'700'},feel:{minWidth:62,alignItems:'center',padding:9,borderRadius:13,borderWidth:1,borderColor:'#315162',backgroundColor:'#102A38'},feelOn:{borderColor:C.gold,backgroundColor:'#4A3519'},feelIcon:{color:C.cream,fontWeight:'900',fontSize:21},feelText:{fontSize:10,color:C.text,marginTop:4},
  infoBox:{backgroundColor:'#102838',borderWidth:1,borderColor:'#2B75A3',borderRadius:12,padding:12,marginVertical:13},infoText:{color:'#C6D6DE',fontSize:11,lineHeight:17},
  analysisCenter:{alignItems:'center',paddingVertical:22},analysisRing:{width:164,height:164,borderRadius:82,borderWidth:13,borderColor:C.blue,borderTopColor:'#163D55',alignItems:'center',justifyContent:'center',shadowColor:C.blue,shadowOpacity:.6,shadowRadius:18,elevation:10},analysisRing2:{width:116,height:116,borderRadius:58,borderWidth:2,borderColor:'#245D82',alignItems:'center',justifyContent:'center',backgroundColor:'#071D2C'},brain:{fontSize:50,color:C.blue,fontWeight:'900'},checkRow:{flexDirection:'row',alignItems:'center',gap:10,marginVertical:8},checkDot:{width:24,height:24,borderRadius:12,backgroundColor:'#25404F',alignItems:'center',justifyContent:'center'},checkOn:{backgroundColor:C.green},checkText:{color:C.white,fontWeight:'900'},checkLabel:{color:C.text,fontSize:13},centerMuted:{color:C.muted,textAlign:'center',fontSize:12,lineHeight:18},
  alertBox:{borderRadius:15,padding:14,flexDirection:'row',gap:12,alignItems:'center',marginBottom:12},alertIcon:{fontSize:31,color:C.white},alertTitle:{color:C.white,fontWeight:'900',fontSize:16},alertText:{color:'#F4EAEA',fontSize:11,lineHeight:16,marginTop:3},cardTitle:{color:C.text,fontWeight:'900',fontSize:18,marginBottom:10},signalRow:{flexDirection:'row',alignItems:'center',gap:8,marginVertical:8},signalIcon:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center'},signalIconText:{fontSize:15,color:C.white},signalName:{width:74,color:C.text,fontWeight:'700',fontSize:12},meter:{flex:1,height:10,borderRadius:99,backgroundColor:'#17313F',overflow:'hidden'},meterFill:{height:'100%',borderRadius:99},riskPill:{minWidth:60,paddingVertical:5,paddingHorizontal:6,borderRadius:8,borderWidth:1,alignItems:'center'},riskText:{fontSize:9,fontWeight:'900'},
  tabRow:{flexDirection:'row',gap:6,marginBottom:12},tab:{flex:1,paddingVertical:10,borderRadius:9,backgroundColor:'#123047',alignItems:'center'},tabOn:{backgroundColor:'#E7F2FA'},tabText:{color:'#B7C7CF',fontSize:11,fontWeight:'800'},tabTextOn:{color:'#163248',fontSize:11,fontWeight:'900'},cardEyebrow:{color:C.text,fontSize:12,fontWeight:'900',marginBottom:9},body:{color:'#D5E0E5',fontSize:13,lineHeight:20},bullet:{color:'#D5E0E5',fontSize:12,lineHeight:19,marginVertical:2},
  nextCard:{minHeight:65,borderRadius:13,borderWidth:1,borderColor:'#285879',backgroundColor:'#0E2E44',marginBottom:8,flexDirection:'row',alignItems:'center',padding:10,gap:12},nextNum:{width:39,height:39,borderRadius:10,backgroundColor:'#BFDFFC',alignItems:'center',justifyContent:'center'},nextNumText:{fontSize:20,color:'#11314B',fontWeight:'900'},nextText:{color:C.text,fontSize:13,flex:1,fontWeight:'700'},searchBox:{height:46,backgroundColor:'#EEF5F8',borderRadius:10,paddingHorizontal:13,color:'#183448',marginBottom:12},
  journalInput:{minHeight:105,backgroundColor:'#0A1B25',borderRadius:12,borderWidth:1,borderColor:'#355463',padding:12,color:C.text,fontSize:13,lineHeight:19},journalDate:{color:C.cream,fontWeight:'900',marginBottom:8},aboutLead:{color:'#D8E2E6',fontSize:14,lineHeight:21,textAlign:'center',marginBottom:14},aboutTile:{width:'48.5%',minHeight:145,borderRadius:15,borderWidth:1,borderColor:C.line,backgroundColor:'#102A39',padding:14,alignItems:'center'},aboutIcon:{fontSize:28,color:C.cream},aboutTitle:{color:C.text,fontWeight:'900',fontSize:13,marginTop:8,textAlign:'center'},aboutText:{color:C.muted,fontSize:10,lineHeight:15,textAlign:'center',marginTop:5},
  flowBox:{backgroundColor:'#0E2938',borderWidth:1,borderColor:'#3C6173',borderRadius:14,padding:14,flexDirection:'row',alignItems:'center',gap:13},flowIcon:{fontSize:28},flowTitle:{color:C.text,fontWeight:'900',fontSize:14},flowSub:{color:C.muted,fontSize:10,marginTop:2},flowArrow:{textAlign:'center',color:C.cyan,fontSize:24,fontWeight:'900',marginVertical:3},good:{color:'#D8E8E0',fontSize:12,lineHeight:22},
  nav:{position:'absolute',bottom:0,left:0,right:0,height:70,backgroundColor:'#081720',borderTopWidth:1,borderTopColor:C.line,flexDirection:'row'},navItem:{flex:1,alignItems:'center',justifyContent:'center'},navIcon:{color:'#B8C7CF',fontSize:20,fontWeight:'900'},navText:{color:'#B8C7CF',fontSize:10,fontWeight:'800',marginTop:3}
});
