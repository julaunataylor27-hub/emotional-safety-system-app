import React, { useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, TextInput, Pressable,
  StyleSheet, StatusBar, Platform
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const C = {
  bg:'#07131B', panel:'#102532', panel2:'#15303F', line:'#294857',
  text:'#F5F1E8', muted:'#A9BAC5', sand:'#F0D6A3', amber:'#D79A3A',
  green:'#42C47B', yellow:'#F2BC4F', red:'#FF6161', blue:'#4FA4FF'
};

const signalNames = {
  choice:'Choice', boundary:'Boundaries', pressure:'Pressure',
  power:'Power', dependency:'Dependency', secrecy:'Secrecy'
};

function has(text, words){ return words.some(w => text.toLowerCase().includes(w)); }

function analyse({age,text,relationship,feelings}) {
  const t=(text||'').toLowerCase();
  const child = age === '10–12' || age === '13–15';
  const youngChild = age === '10–12';

  const boundary = has(t,['said no','said stop','not comfortable','leave me alone','ignored','wouldn’t stop',"wouldn't stop",'kept going','crossed my boundary']);
  const respectedBoundary = has(t,['stopped when i said no','stopped when i said stop','respected my boundary','asked and stopped']);
  const pressure = has(t,['kept asking','pressured','pressure','guilt','threat','forced','made me',"wouldn't take no",'begged','coerce','coerc']);
  const secrecy = has(t,['secret',"don't tell",'dont tell','keep this between','hide it','nobody can know']);
  const dependency = has(t,["can't leave",'cant leave','depend','nowhere else','money','housing','only person','need them']);
  const power = relationship === 'Authority / older person' || has(t,['teacher','coach','boss','manager','carer','doctor','counsellor','older adult','parent']);
  const choiceReduced = has(t,['no choice','had to',"couldn't say no",'couldnt say no','afraid to say no','scared to refuse']) || pressure || feelings.includes('Scared');

  const score = {
    choice: choiceReduced ? 88 : 20,
    boundary: respectedBoundary ? 12 : boundary ? 90 : 22,
    pressure: pressure ? 92 : 18,
    power: power ? 70 : 22,
    dependency: dependency ? 74 : 18,
    secrecy: secrecy ? 94 : 14
  };

  const critical = !respectedBoundary && boundary && (pressure || secrecy || power);
  const childConcern = child && !respectedBoundary && (boundary || pressure || secrecy || power);
  const high = critical || childConcern || [pressure,secrecy].filter(Boolean).length === 2;
  const elevated = !high && ((!respectedBoundary && boundary) || pressure || secrecy || power || dependency || choiceReduced || feelings.some(f=>['Confused','Worried','Scared','Unsure'].includes(f)));

  const level = high ? 'HIGH SAFEGUARDING CONCERN' : elevated ? 'SAFETY CONCERNS DETECTED' : 'NO MAJOR RED FLAGS DETECTED';
  const factors = [];
  if (youngChild) factors.push('Child-safety mode is active for age 10–12.');
  else if (child) factors.push('Safeguarding mode is active because a person under 16 is involved.');
  if (respectedBoundary) factors.push('The description indicates a boundary was respected.');
  else if (boundary) factors.push('A boundary may have been expressed or crossed.');
  if (pressure) factors.push('Pressure or persistence language was detected.');
  if (power) factors.push('A power or authority difference may be present.');
  if (dependency) factors.push('Dependency may make free decision-making harder.');
  if (secrecy) factors.push('Secrecy language was detected.');
  if (choiceReduced) factors.push('Choice may have been reduced by fear, pressure or lack of options.');
  if (!factors.length) factors.push('No strong keyword-based safety signal was detected. Context still matters.');

  const steps = high ? [
    'Prioritise immediate safety.',
    'Talk with a trusted adult, safeguarding professional or appropriate support service.',
    'Record factual observations separately from interpretations.'
  ] : elevated ? [
    'Slow the situation down and make room for clear choice and boundaries.',
    'Talk with a trusted support person if uncertainty continues.',
    'Review the Learning section for the six safety signals.'
  ] : [
    'Keep communication clear and continue respecting boundaries.',
    'Use the Learning section to understand the six safety signals.'
  ];
  if (child) steps.unshift('Use child-focused safeguarding support rather than asking the child to solve the situation alone.');

  return {child, level, score, factors, steps, high, elevated};
}

function Button({children,onPress,secondary=false}) {
  return <Pressable onPress={onPress} style={({pressed})=>[
    styles.button, secondary?styles.buttonSecondary:styles.buttonPrimary,
    pressed && {opacity:.82}
  ]}><Text style={[styles.buttonText,secondary&&{color:C.text}]}>{children}</Text></Pressable>;
}

function Card({children,style}) {
  return <View style={[styles.card,style]}>{children}</View>;
}

function Pill({children,active,onPress}) {
  return <Pressable onPress={onPress} style={[styles.pill,active&&styles.pillActive]}>
    <Text style={[styles.pillText,active&&styles.pillTextActive]}>{children}</Text>
  </Pressable>;
}

function Meter({name,value}) {
  const color=value>=70?C.red:value>=45?C.yellow:C.green;
  const label=value>=70?'High':value>=45?'Moderate':'Low';
  return <View style={styles.signalRow}>
    <Text style={styles.signalName}>{name}</Text>
    <View style={styles.meter}><View style={[styles.meterFill,{width:`${value}%`,backgroundColor:color}]} /></View>
    <Text style={[styles.riskLabel,{color}]}>{label}</Text>
  </View>;
}

export default function App(){
  const [screen,setScreen]=useState('home');
  const [age,setAge]=useState('16+');
  const [relationship,setRelationship]=useState('Peer / friend / partner');
  const [scenario,setScenario]=useState('');
  const [feelings,setFeelings]=useState([]);
  const [result,setResult]=useState(null);

  const toggleFeeling=f=>setFeelings(x=>x.includes(f)?x.filter(v=>v!==f):[...x,f]);
  const run=()=>{
    const r=analyse({age,text:scenario,relationship,feelings});
    setResult(r); setScreen('results');
  };

  const Header=()=>(
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Emotional Safety System</Text>
        <Text style={styles.headerSub}>Understand • Support • Safety</Text>
      </View>
      <View style={styles.version}><Text style={styles.versionText}>APP V1</Text></View>
    </View>
  );

  const Nav=()=>(
    <View style={styles.nav}>
      {[
        ['home','Home'],['learn','Learn'],['support','Support'],['about','About']
      ].map(([k,l])=><Pressable key={k} onPress={()=>setScreen(k)} style={styles.navItem}>
        <Text style={[styles.navText,screen===k&&{color:C.sand}]}>{l}</Text>
      </Pressable>)}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <Header/>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {screen==='home' && <>
          <Card style={styles.hero}>
            <Text style={styles.eyebrow}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text>
            <Text style={styles.heroTitle}>Understand the safety signals without losing the human story.</Text>
            <Text style={styles.body}>A privacy-first prototype that turns plain language into six safety signals and supportive next steps.</Text>
            <Button onPress={()=>setScreen('assessment')}>Start new assessment</Button>
          </Card>
          <View style={styles.grid}>
            <Pressable style={styles.tile} onPress={()=>setScreen('learn')}><Text style={styles.tileTitle}>Learning Centre</Text><Text style={styles.tileBody}>Choice, boundaries, pressure, power, dependency and secrecy.</Text></Pressable>
            <Pressable style={styles.tile} onPress={()=>setScreen('support')}><Text style={styles.tileTitle}>Support</Text><Text style={styles.tileBody}>Australian support pathways and emergency guidance.</Text></Pressable>
            <Pressable style={styles.tile} onPress={()=>setScreen('about')}><Text style={styles.tileTitle}>About</Text><Text style={styles.tileBody}>How the safety engine works and where its limits are.</Text></Pressable>
            <Pressable style={styles.tile} onPress={()=>setScreen('assessment')}><Text style={styles.tileTitle}>Quick Check</Text><Text style={styles.tileBody}>Run a local, on-device assessment without an account.</Text></Pressable>
          </View>
        </>}

        {screen==='assessment' && <>
          <Text style={styles.screenTitle}>New Assessment</Text>
          <Card>
            <Text style={styles.label}>Age range</Text>
            <View style={styles.wrap}>
              {['16+','13–15','10–12','Unsure'].map(x=><Pill key={x} active={age===x} onPress={()=>setAge(x)}>{x}</Pill>)}
            </View>

            <Text style={styles.label}>Who was involved?</Text>
            <View style={styles.wrap}>
              {['Peer / friend / partner','Family','Authority / older person','Other / unsure'].map(x=><Pill key={x} active={relationship===x} onPress={()=>setRelationship(x)}>{x}</Pill>)}
            </View>

            <Text style={styles.label}>How did the person feel?</Text>
            <View style={styles.wrap}>
              {['Safe','Confused','Worried','Scared','Unsure'].map(x=><Pill key={x} active={feelings.includes(x)} onPress={()=>toggleFeeling(x)}>{x}</Pill>)}
            </View>

            <Text style={styles.label}>Describe what happened</Text>
            <TextInput
              multiline
              value={scenario}
              onChangeText={setScenario}
              placeholder="Use simple words. Avoid names, addresses or identifying details."
              placeholderTextColor="#718794"
              style={styles.input}
              maxLength={2500}
              textAlignVertical="top"
            />
            <View style={styles.notice}><Text style={styles.noticeText}>This prototype analyses text on the device. It does not need a login or remote AI service.</Text></View>
            <Button onPress={run}>Analyse situation</Button>
            <Button secondary onPress={()=>setScreen('home')}>Back</Button>
          </Card>
        </>}

        {screen==='results' && result && <>
          <Text style={styles.screenTitle}>Safety Analysis</Text>
          <View style={[styles.banner,{borderColor:result.high?C.red:result.elevated?C.yellow:C.blue}]}>
            <Text style={styles.bannerTitle}>{result.level}</Text>
            <Text style={styles.body}>{result.child ? 'Safeguarding mode is active. The app does not calculate sexual consent for a child.' : 'The app highlights observable safety signals; it does not diagnose people or determine guilt.'}</Text>
          </View>

          <Card>
            <Text style={styles.cardTitle}>Six Safety Signals</Text>
            {Object.entries(result.score).map(([k,v])=><Meter key={k} name={signalNames[k]} value={v}/>)}
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Why these signals appeared</Text>
            {result.factors.map((x,i)=><View key={i} style={styles.factor}><Text style={styles.factorText}>{x}</Text></View>)}
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Next steps</Text>
            {result.steps.map((x,i)=><Text key={i} style={styles.step}>{i+1}. {x}</Text>)}
            <Button onPress={()=>setScreen('support')}>Open support</Button>
            <Button secondary onPress={()=>setScreen('assessment')}>Run another assessment</Button>
          </Card>
          <Text style={styles.disclaimer}>Educational prototype only. It does not replace emergency, medical, legal, child-protection or professional advice.</Text>
        </>}

        {screen==='learn' && <>
          <Text style={styles.screenTitle}>Learning Centre</Text>
          {[
            ['Choice','Healthy decisions need room to choose without fear, manipulation or punishment.'],
            ['Boundaries','A boundary is a limit. Respect means noticing it, checking it and stopping when it is not clear.'],
            ['Pressure','Repeated asking, guilt, threats, urgency or emotional leverage can reduce free choice.'],
            ['Power','Age, authority, money, housing, status or caregiving roles can create an imbalance.'],
            ['Dependency','Strong emotional or practical reliance can make it harder to act freely or leave.'],
            ['Secrecy','Requests to hide concerning behaviour deserve attention, especially when paired with pressure or boundary violations.']
          ].map(([a,b])=><Card key={a}><Text style={styles.cardTitle}>{a}</Text><Text style={styles.body}>{b}</Text></Card>)}
        </>}

        {screen==='support' && <>
          <Text style={styles.screenTitle}>Support</Text>
          <Card style={{borderColor:'#7D3D3D'}}>
            <Text style={styles.cardTitle}>Immediate danger</Text>
            <Text style={styles.body}>In Australia, call 000 if someone is in immediate danger.</Text>
          </Card>
          {[
            ['Kids Helpline','Children and young people: kidshelpline.com.au'],
            ['1800RESPECT','Domestic, family and sexual violence support: 1800respect.org.au'],
            ['Lifeline','Crisis support: lifeline.org.au'],
            ['eSafety Commissioner','Online safety information and reporting: esafety.gov.au']
          ].map(([a,b])=><Card key={a}><Text style={styles.cardTitle}>{a}</Text><Text style={styles.body}>{b}</Text></Card>)}
        </>}

        {screen==='about' && <>
          <Text style={styles.screenTitle}>About the System</Text>
          <Card>
            <Text style={styles.cardTitle}>Core model</Text>
            <Text style={styles.formula}>Choice • Boundaries • Pressure • Power • Dependency • Secrecy</Text>
            <Text style={styles.body}>The app uses transparent rules and critical overrides rather than one overall “consent score”. Critical safeguarding indicators cannot be averaged away.</Text>
          </Card>
          <Card>
            <Text style={styles.cardTitle}>Privacy-first</Text>
            <Text style={styles.body}>This prototype does not require an account and does not send assessment narratives to an AI service. A future production version would need professional privacy, security, safeguarding, cultural and accessibility review.</Text>
          </Card>
        </>}

      </ScrollView>
      <Nav/>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg,paddingTop:Platform.OS==='android'?StatusBar.currentHeight||0:0},
  header:{paddingHorizontal:16,paddingVertical:13,borderBottomWidth:1,borderBottomColor:C.line,backgroundColor:'#091922',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  headerTitle:{color:C.text,fontWeight:'800',fontSize:16}, headerSub:{color:C.muted,fontSize:10,marginTop:2},
  version:{backgroundColor:'#163D55',borderColor:'#2E607B',borderWidth:1,borderRadius:20,paddingVertical:6,paddingHorizontal:9},
  versionText:{color:'#D6EFFF',fontSize:10,fontWeight:'800'},
  scroll:{padding:14,paddingBottom:105},
  card:{backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:18,padding:17,marginBottom:13},
  hero:{backgroundColor:'#14303E'}, eyebrow:{color:C.sand,fontSize:10,fontWeight:'800',letterSpacing:1},
  heroTitle:{color:C.text,fontWeight:'900',fontSize:30,lineHeight:33,marginVertical:12},
  body:{color:'#D4DEE3',fontSize:15,lineHeight:22},
  button:{borderRadius:13,paddingVertical:15,paddingHorizontal:16,marginTop:12,alignItems:'center'},
  buttonPrimary:{backgroundColor:C.sand},buttonSecondary:{backgroundColor:'#183A4B',borderColor:'#376278',borderWidth:1},
  buttonText:{color:'#21170D',fontWeight:'900',fontSize:15},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  tile:{width:'48%',minHeight:135,backgroundColor:'#102631',borderColor:C.line,borderWidth:1,borderRadius:16,padding:15},
  tileTitle:{color:C.text,fontWeight:'800',fontSize:16,marginBottom:8},tileBody:{color:C.muted,fontSize:13,lineHeight:18},
  screenTitle:{color:C.text,fontSize:28,fontWeight:'900',marginBottom:13},
  label:{color:C.text,fontWeight:'800',fontSize:14,marginTop:13,marginBottom:8},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:7},
  pill:{borderColor:'#345363',borderWidth:1,backgroundColor:'#102B38',borderRadius:999,paddingVertical:9,paddingHorizontal:12},
  pillActive:{backgroundColor:C.amber,borderColor:'#F0CA7F'},pillText:{color:'#D8E4EA',fontSize:13,fontWeight:'700'},pillTextActive:{color:'#17120C'},
  input:{minHeight:160,backgroundColor:'#091A23',borderColor:'#365564',borderWidth:1,borderRadius:13,padding:13,color:C.text,fontSize:15,lineHeight:21},
  notice:{marginTop:12,backgroundColor:'#0A202B',borderLeftColor:C.blue,borderLeftWidth:3,borderRadius:8,padding:11},
  noticeText:{color:'#B9C9D1',fontSize:12,lineHeight:17},
  banner:{backgroundColor:'#102532',borderWidth:1,borderRadius:17,padding:17,marginBottom:13},
  bannerTitle:{color:C.text,fontWeight:'900',fontSize:19,marginBottom:6},
  cardTitle:{color:C.text,fontWeight:'900',fontSize:18,marginBottom:8},
  signalRow:{flexDirection:'row',alignItems:'center',marginVertical:9,gap:8},
  signalName:{width:88,color:C.text,fontWeight:'700',fontSize:13},
  meter:{flex:1,height:10,backgroundColor:'#091A23',borderRadius:99,overflow:'hidden'},
  meterFill:{height:'100%',borderRadius:99},riskLabel:{width:66,textAlign:'right',fontSize:11,fontWeight:'900'},
  factor:{backgroundColor:'#0B202B',borderColor:'#274858',borderWidth:1,borderRadius:10,padding:11,marginTop:7},
  factorText:{color:'#D9E5EA',fontSize:13,lineHeight:18},
  step:{color:'#E5EDF0',fontSize:14,lineHeight:21,marginVertical:5},
  disclaimer:{color:C.muted,fontSize:11,lineHeight:16,paddingHorizontal:5},
  formula:{color:C.sand,fontWeight:'900',fontSize:15,textAlign:'center',backgroundColor:'#0B202B',borderColor:'#3A5E6C',borderWidth:1,borderRadius:13,padding:15,marginVertical:10},
  nav:{position:'absolute',bottom:0,left:0,right:0,height:68,backgroundColor:'#081720',borderTopColor:C.line,borderTopWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},
  navItem:{flex:1,alignItems:'center',paddingVertical:15},navText:{color:'#D1DDE2',fontSize:12,fontWeight:'800'}
});
