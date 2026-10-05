from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# Add reusable Humanity Philosophy UI components before the main App component.
anchor = "export default function App(){"
if "function JourneyTile" not in s:
    components = r'''function JourneyTile({icon,title,subtitle,onPress,accent='#486239'}){
  return <Pressable onPress={onPress} style={({pressed})=>[styles.journeyTile,pressed&&{opacity:.82}]}>
    <View style={[styles.journeyTileIcon,{backgroundColor:accent}]}><Text style={styles.journeyTileIconText}>{icon}</Text></View>
    <View style={{flex:1}}><Text style={styles.journeyTileTitle}>{title}</Text><Text style={styles.journeyTileSub}>{subtitle}</Text></View>
    <Text style={styles.journeyTileArrow}>›</Text>
  </Pressable>;
}

function HumanityEquation({compact=false}){
  return <View style={[styles.humanityEquation,compact&&styles.humanityEquationCompact]}>
    <View style={styles.equationLine}>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>📖</Text><Text style={[styles.eqLabel,{color:'#486239'}]}>KNOWLEDGE</Text></View>
      <Text style={styles.eqOp}>×</Text>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>🧠</Text><Text style={[styles.eqLabel,{color:'#315F79'}]}>UNDERSTANDING</Text></View>
    </View>
    <Text style={styles.eqPlus}>＋</Text>
    <View style={styles.equationLine}>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>❤️</Text><Text style={[styles.eqLabel,{color:'#B94233'}]}>LOVE</Text></View>
      <Text style={styles.eqOp}>×</Text>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>🤲</Text><Text style={[styles.eqLabel,{color:'#B86A2D'}]}>KINDNESS</Text></View>
      <Text style={styles.eqOp}>×</Text>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>⏳</Text><Text style={[styles.eqLabel,{color:'#A47C1B'}]}>PATIENCE</Text></View>
    </View>
    <Text style={styles.eqEquals}>=</Text>
    <View style={styles.equationLine}>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>🌱</Text><Text style={[styles.eqLabel,{color:'#55733D'}]}>GROWTH</Text></View>
      <Text style={styles.eqOp}>×</Text>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>👥</Text><Text style={[styles.eqLabel,{color:'#684A42'}]}>HUMANITY</Text></View>
      <Text style={styles.eqOp}>=</Text>
      <View style={styles.eqUnit}><Text style={styles.eqIcon}>☀️</Text><Text style={[styles.eqLabel,{color:'#B88413'}]}>LIFE</Text></View>
    </View>
  </View>;
}

function HumanityScreenHeader({title,onBack,step}){
  return <View style={styles.humanityScreenHeader}>
    <Pressable onPress={onBack} style={styles.humanityBack}><Text style={styles.humanityBackText}>‹</Text></Pressable>
    <View style={{flex:1}}><Text style={styles.humanityScreenTitle}>{title}</Text>{step?<Text style={styles.humanityScreenStep}>{step}</Text>:null}</View>
    <View style={styles.humanityMiniTree}><Text style={{fontSize:24}}>🌳</Text></View>
  </View>;
}

'''
    s = s.replace(anchor, components + anchor, 1)

# Add journey state. These are private session-only prototype fields, like the existing journal.
state_anchor = "  const [journalText,setJournalText]=useState('');"
if "foundationMessage" not in s:
    state_block = r'''  const [foundationMessage,setFoundationMessage]=useState('');
  const [foundationWhy,setFoundationWhy]=useState('');
  const [foundationHope,setFoundationHope]=useState('');
  const [philosophyValues,setPhilosophyValues]=useState(['Knowledge','Understanding','Love','Kindness','Patience']);
  const [valuesReflection,setValuesReflection]=useState('');
  const [philosophyName,setPhilosophyName]=useState('The Humanity Philosophy');
  const [philosophyMotto,setPhilosophyMotto]=useState('Grow yourself. Grow humanity.');
  const [philosophyVision,setPhilosophyVision]=useState('');
  const [bookTitle,setBookTitle]=useState('');
  const [storyNotes,setStoryNotes]=useState('');
  const [legacyFeeling,setLegacyFeeling]=useState('');
  const [legacyWorld,setLegacyWorld]=useState('');'''
    if state_anchor not in s:
        raise SystemExit('Humanity patch: journal state anchor not found')
    s = s.replace(state_anchor, state_anchor + "\n" + state_block, 1)

# Add helpers after the normal go() helper.
go_anchor = "  const go=s=>setScreen(s);"
if "togglePhilosophyValue" not in s:
    helper = r'''
  const journeyScreens=['journey','foundation','values','identity','story','legacy'];
  const togglePhilosophyValue=(v)=>setPhilosophyValues(old=>old.includes(v)?old.filter(x=>x!==v):[...old,v]);'''
    s = s.replace(go_anchor, go_anchor + helper, 1)

# Humanity Philosophy header. The tree represents personal roots, growth and shared humanity.
header_re = re.compile(r"  const Header=\(\)=> <View style=\{styles\.[^}]+\}>.*?</View>;", re.S)
header_new = r'''  const Header=()=> <View style={styles.humanityHeader}>
    <View style={styles.humanityHeaderLogo}><Text style={styles.humanityHeaderTree}>🌳</Text></View>
    <View style={{flex:1}}><Text style={styles.humanityHeaderTitle}>EMOTIONAL SAFETY SYSTEM</Text><Text style={styles.humanityHeaderSub}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text></View>
  </View>;'''
s, n = header_re.subn(header_new, s, count=1)
if n == 0:
    raise SystemExit('Humanity patch: Header not found')

# Five-tab navigation with Journey as a first-class part of the system.
nav_re = re.compile(r"  const BottomNav=\(\)=> <View style=\{styles\.nav\}>.*?</View>;", re.S)
nav_new = r'''  const BottomNav=()=> <View style={styles.humanityNav}>
    {[
      ['home','⌂','Home'],['journey','◈','Journey'],['learn','▤','Learn'],['support','♡','Support'],['more','☰','More']
    ].map(([k,i,l])=>{
      const active=screen===k || (k==='journey'&&journeyScreens.includes(screen));
      return <Pressable key={k} onPress={()=>go(k)} style={styles.humanityNavItem}>
        <Text style={[styles.humanityNavIcon,active&&styles.humanityNavActive]}>{i}</Text><Text style={[styles.humanityNavText,active&&styles.humanityNavActive]}>{l}</Text>
      </Pressable>;
    })}
  </View>;'''
s, n = nav_re.subn(nav_new, s, count=1)
if n == 0:
    raise SystemExit('Humanity patch: BottomNav not found')

# Replace the Home screen and insert the guided Humanity Philosophy journey before Assessment.
home_re = re.compile(r"      \{screen==='home'&&<>.*?</>\}\n\n      \{screen==='assessment'&&<>", re.S)
new_home_and_journey = r'''      {screen==='home'&&<View style={styles.humanityPage}>
        <View style={styles.humanityHeroCard}>
          <View style={styles.humanityHeroSky}>
            <Text style={styles.humanityHeroEyebrow}>THE</Text>
            <Text style={styles.humanityHeroTitle}>HUMANITY{`\n`}PHILOSOPHY</Text>
            <Text style={styles.humanityHeroScript}>Grow Yourself. Grow Humanity.</Text>
            <Text style={styles.humanityHeroBody}>A practical philosophy for a kinder, more understanding world. Build a better you. Help build a better humanity.</Text>
            <View style={styles.humanityTreeWrap}><Text style={styles.humanityTree}>🌳</Text></View>
          </View>
          <HumanityEquation compact/>
          <Pressable onPress={()=>go('journey')} style={({pressed})=>[styles.startJourney,pressed&&{opacity:.82}]}><Text style={styles.startJourneyText}>START JOURNEY  →</Text></Pressable>
          <View style={styles.journeyDots}>{[0,1,2,3,4,5,6].map((x,i)=><View key={i} style={[styles.journeyDot,i===0&&styles.journeyDotOn]}/>)}</View>
        </View>

        <View style={styles.journeyGrid}>
          <JourneyTile icon="🧭" title="1. BEGIN MY JOURNEY" subtitle="A guided pathway through the Humanity Philosophy" onPress={()=>go('journey')} accent="#486239"/>
          <JourneyTile icon="🌿" title="2. MY FOUNDATION" subtitle="My purpose, message and why it matters" onPress={()=>go('foundation')} accent="#B86A2D"/>
          <JourneyTile icon="♡" title="3. MY VALUES" subtitle="Knowledge, understanding, love, kindness and more" onPress={()=>go('values')} accent="#C54C34"/>
          <JourneyTile icon="●" title="4. MY IDENTITY" subtitle="My philosophy, motto and personal vision" onPress={()=>go('identity')} accent="#315F79"/>
          <JourneyTile icon="▤" title="5. MY BOOK / MY STORY" subtitle="Turn my philosophy into a story, book or message" onPress={()=>go('story')} accent="#70547C"/>
          <JourneyTile icon="🌳" title="6. MY LEGACY" subtitle="A kinder, more connected future for generations" onPress={()=>go('legacy')} accent="#55733D"/>
        </View>

        <Text style={styles.humanitySectionLabel}>EMOTIONAL SAFETY TOOLS</Text>
        <JourneyTile icon="🛡" title="Safety Assessment / Question" subtitle="Choice, boundaries, coercion, safeguarding and emotional reality" onPress={()=>go('assessment')} accent="#B94233"/>
        <JourneyTile icon="🎓" title="Learning Centre" subtitle="Simple guides, examples and safety knowledge" onPress={()=>go('learn')} accent="#486239"/>
        <JourneyTile icon="👥" title="Support" subtitle="Community, help and trusted resources" onPress={()=>go('support')} accent="#A56627"/>
        <JourneyTile icon="✎" title="My Journal" subtitle="Private reflection during this session" onPress={()=>go('journal')} accent="#315F79"/>
        <JourneyTile icon="i" title="About the System" subtitle="How the safety engine and Humanity Philosophy connect" onPress={()=>go('about')} accent="#7C6A33"/>
      </View>}

      {screen==='journey'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Humanity Journey" step="BEGIN HERE" onBack={()=>go('home')}/>
        <View style={styles.journeyWelcome}>
          <Text style={styles.journeyWelcomeTree}>🌳</Text>
          <Text style={styles.journeyWelcomeTitle}>GROW YOURSELF.{`\n`}GROW HUMANITY.</Text>
          <Text style={styles.journeyWelcomeText}>This pathway turns your philosophy into something you can live, explain, write and pass forward. There are no perfect answers — the point is to make your values conscious and usable.</Text>
        </View>
        <HumanityEquation/>
        <Text style={styles.humanitySectionLabel}>YOUR PATHWAY</Text>
        <JourneyTile icon="🌿" title="My Foundation" subtitle="What message matters to me and why?" onPress={()=>go('foundation')} accent="#B86A2D"/>
        <JourneyTile icon="♡" title="My Values" subtitle="What do my values mean in real life?" onPress={()=>go('values')} accent="#C54C34"/>
        <JourneyTile icon="●" title="My Identity" subtitle="Name the philosophy, motto and vision" onPress={()=>go('identity')} accent="#315F79"/>
        <JourneyTile icon="▤" title="My Book / My Story" subtitle="Shape the message into chapters or a story" onPress={()=>go('story')} accent="#70547C"/>
        <JourneyTile icon="🌳" title="My Legacy" subtitle="What should future generations inherit?" onPress={()=>go('legacy')} accent="#55733D"/>
      </View>}

      {screen==='foundation'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Foundation" step="STAGE 1" onBack={()=>go('journey')}/>
        <View style={styles.stageIntro}><Text style={styles.stageIcon}>🌿</Text><Text style={styles.stageIntroTitle}>Start with what matters.</Text><Text style={styles.stageIntroText}>Your foundation is the reason underneath the philosophy — the message you want to carry even when life becomes complicated.</Text></View>
        <Text style={styles.journeyQuestion}>What is the one message I want people to remember?</Text>
        <TextInput multiline value={foundationMessage} onChangeText={setFoundationMessage} placeholder="Write it in your own words…" placeholderTextColor="#9B9587" style={styles.journeyInput}/>
        <Text style={styles.journeyQuestion}>Why does this philosophy matter to me?</Text>
        <TextInput multiline value={foundationWhy} onChangeText={setFoundationWhy} placeholder="What experience, truth or hope sits underneath it?" placeholderTextColor="#9B9587" style={styles.journeyInput}/>
        <Text style={styles.journeyQuestion}>How do I hope it changes people's lives?</Text>
        <TextInput multiline value={foundationHope} onChangeText={setFoundationHope} placeholder="What would become safer, kinder or stronger?" placeholderTextColor="#9B9587" style={styles.journeyInput}/>
        <PrimaryButton onPress={()=>go('values')} color="#C59A2A">NEXT: MY VALUES  →</PrimaryButton>
      </View>}

      {screen==='values'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Values" step="STAGE 2" onBack={()=>go('journey')}/>
        <Text style={styles.stageIntroTitle}>Choose the values you want to live.</Text>
        <Text style={styles.stageIntroText}>Tap the values that belong in your philosophy. You can change them as you grow.</Text>
        <View style={styles.valueGrid}>{[
          ['Knowledge','📖','#486239'],['Understanding','🧠','#315F79'],['Love','❤️','#B94233'],['Kindness','🤲','#B86A2D'],['Patience','⏳','#A47C1B'],['Growth','🌱','#55733D'],['Humanity','👥','#70547C'],['Life','☀️','#B88413']
        ].map(([v,ic,c])=><Pressable key={v} onPress={()=>togglePhilosophyValue(v)} style={[styles.valueCard,philosophyValues.includes(v)&&{borderColor:c,backgroundColor:'#FFF9EB'}]}><Text style={styles.valueIcon}>{ic}</Text><Text style={[styles.valueName,philosophyValues.includes(v)&&{color:c}]}>{v}</Text><Text style={styles.valueCheck}>{philosophyValues.includes(v)?'✓':'+'}</Text></Pressable>)}</View>
        <Text style={styles.journeyQuestion}>What do these values look like when I actually live them?</Text>
        <TextInput multiline value={valuesReflection} onChangeText={setValuesReflection} placeholder="Example: Understanding means I ask before I judge…" placeholderTextColor="#9B9587" style={styles.journeyInput}/>
        <HumanityEquation compact/>
        <PrimaryButton onPress={()=>go('identity')} color="#C59A2A">NEXT: MY IDENTITY  →</PrimaryButton>
      </View>}

      {screen==='identity'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Identity" step="STAGE 3" onBack={()=>go('journey')}/>
        <View style={styles.stageIntro}><Text style={styles.stageIcon}>●</Text><Text style={styles.stageIntroTitle}>Give the philosophy a voice.</Text><Text style={styles.stageIntroText}>Identity helps other people recognise the message and helps you remember what you stand for.</Text></View>
        <Text style={styles.journeyQuestion}>Name of my philosophy</Text>
        <TextInput value={philosophyName} onChangeText={setPhilosophyName} style={[styles.journeyInput,{minHeight:56}]}/>
        <Text style={styles.journeyQuestion}>My motto</Text>
        <TextInput value={philosophyMotto} onChangeText={setPhilosophyMotto} style={[styles.journeyInput,{minHeight:56}]}/>
        <Text style={styles.journeyQuestion}>My personal vision</Text>
        <TextInput multiline value={philosophyVision} onChangeText={setPhilosophyVision} placeholder="What kind of person do I want to keep becoming?" placeholderTextColor="#9B9587" style={styles.journeyInput}/>
        <View style={styles.identitySymbol}><Text style={{fontSize:76}}>🌳</Text><Text style={styles.identitySymbolText}>ROOTS = KNOWLEDGE{`\n`}BRANCHES = KINDNESS{`\n`}FRUIT = GROWTH</Text></View>
        <PrimaryButton onPress={()=>go('story')} color="#C59A2A">NEXT: MY STORY  →</PrimaryButton>
      </View>}

      {screen==='story'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Book / My Story" step="STAGE 4" onBack={()=>go('journey')}/>
        <View style={styles.stageIntro}><Text style={styles.stageIcon}>▤</Text><Text style={styles.stageIntroTitle}>Turn the philosophy into a story.</Text><Text style={styles.stageIntroText}>A story lets people understand not only the equation, but how you came to believe it.</Text></View>
        <Text style={styles.journeyQuestion}>Book or project title</Text>
        <TextInput value={bookTitle} onChangeText={setBookTitle} placeholder="A title that feels like you…" placeholderTextColor="#9B9587" style={[styles.journeyInput,{minHeight:56}]}/>
        <View style={styles.chapterCard}><Text style={styles.chapterTitle}>CHAPTER IDEAS</Text>{['Why I wrote this','Knowledge','Understanding','Love','Kindness','Patience','Growth','Humanity','Living the Philosophy','The message I leave behind'].map((x,i)=><Text key={x} style={styles.chapterLine}>{i+1}.  {x}</Text>)}</View>
        <Text style={styles.journeyQuestion}>Notes / memories / ideas</Text>
        <TextInput multiline value={storyNotes} onChangeText={setStoryNotes} placeholder="Capture thoughts here while they are fresh…" placeholderTextColor="#9B9587" style={[styles.journeyInput,{minHeight:150}]}/>
        <PrimaryButton onPress={()=>go('legacy')} color="#C59A2A">NEXT: MY LEGACY  →</PrimaryButton>
      </View>}

      {screen==='legacy'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Legacy" step="STAGE 5" onBack={()=>go('journey')}/>
        <View style={styles.legacyHero}><Text style={styles.legacyTree}>🌳</Text><Text style={styles.legacyTitle}>WHAT DO I WANT TO LEAVE GROWING?</Text><Text style={styles.legacyText}>Legacy is not about being remembered as important. It is about what becomes safer, wiser, kinder or stronger because you were here.</Text></View>
        <Text style={styles.journeyQuestion}>How do I want people to feel after meeting this philosophy?</Text>
        <TextInput multiline value={legacyFeeling} onChangeText={setLegacyFeeling} placeholder="Seen, understood, safer, hopeful…" placeholderTextColor="#9B9587" style={styles.journeyInput}/>
        <Text style={styles.journeyQuestion}>What kind of world do I hope future generations inherit?</Text>
        <TextInput multiline value={legacyWorld} onChangeText={setLegacyWorld} placeholder="Describe the world you want to help build…" placeholderTextColor="#9B9587" style={styles.journeyInput}/>
        <View style={styles.promiseCard}><Text style={styles.promiseTitle}>MY PERSONAL PROMISE</Text><Text style={styles.promiseLine}>📖 I will continue learning.</Text><Text style={styles.promiseLine}>🧠 I will seek understanding before judgement.</Text><Text style={styles.promiseLine}>❤️ I will choose love with action.</Text><Text style={styles.promiseLine}>🤲 I will practise kindness.</Text><Text style={styles.promiseLine}>⏳ I will give growth time.</Text><Text style={styles.promiseLine}>👥 I will do my best to help humanity grow.</Text></View>
        <HumanityEquation/>
        <PrimaryButton onPress={()=>go('home')} color="#486239" darkText={false}>RETURN HOME  →</PrimaryButton>
      </View>}

      {screen==='assessment'&&<>'''
s, n = home_re.subn(new_home_and_journey, s, count=1)
if n == 0:
    raise SystemExit('Humanity patch: Home/assessment boundary not found')

# Light cream page background complements the Humanity Philosophy while keeping risk colours intact.
s = s.replace("scroll:{padding:13,paddingBottom:100,backgroundColor:'#020609'}", "scroll:{padding:13,paddingBottom:100,backgroundColor:'#F7F2E7'}", 1)

# New Humanity Philosophy style system. Unique keys avoid disturbing safety-engine components.
style_marker = "\n});"
styles = r''',
  humanityHeader:{height:74,paddingHorizontal:14,borderBottomWidth:1,borderBottomColor:'#D8C9A7',backgroundColor:'#FBF8EF',flexDirection:'row',alignItems:'center',gap:11},
  humanityHeaderLogo:{width:50,height:50,borderRadius:25,borderWidth:2,borderColor:'#C59A2A',backgroundColor:'#FFFDF7',alignItems:'center',justifyContent:'center',shadowColor:'#A36D16',shadowOpacity:.18,shadowRadius:5,elevation:2},
  humanityHeaderTree:{fontSize:31},
  humanityHeaderTitle:{color:'#26351F',fontWeight:'900',fontSize:13,letterSpacing:.75},
  humanityHeaderSub:{color:'#6E583D',fontSize:7.7,letterSpacing:1.05,marginTop:4,fontWeight:'700'},
  humanityNav:{position:'absolute',left:0,right:0,bottom:0,height:70,backgroundColor:'#243B20',borderTopWidth:1,borderTopColor:'#516A44',flexDirection:'row',paddingBottom:Platform.OS==='ios'?10:4},
  humanityNavItem:{flex:1,alignItems:'center',justifyContent:'center'},
  humanityNavIcon:{fontSize:22,color:'#D7D7C9'},
  humanityNavText:{fontSize:9,color:'#D7D7C9',marginTop:2,fontWeight:'700'},
  humanityNavActive:{color:'#F5D46C'},
  humanityPage:{backgroundColor:'#F7F2E7',marginHorizontal:-13,marginTop:-13,paddingHorizontal:13,paddingTop:13,paddingBottom:15},
  humanityHeroCard:{backgroundColor:'#FFFDF7',borderWidth:1,borderColor:'#D9CCAE',borderRadius:24,overflow:'hidden',shadowColor:'#6E583D',shadowOpacity:.12,shadowRadius:12,elevation:3,marginBottom:13},
  humanityHeroSky:{minHeight:305,padding:19,backgroundColor:'#F7EED7',position:'relative',overflow:'hidden'},
  humanityHeroEyebrow:{fontSize:12,letterSpacing:6,fontWeight:'900',color:'#2F3E28'},
  humanityHeroTitle:{fontSize:37,lineHeight:36,fontWeight:'900',color:'#25341F',marginTop:5,maxWidth:'72%'},
  humanityHeroScript:{fontSize:20,color:'#A55524',fontStyle:'italic',marginTop:12,fontWeight:'600'},
  humanityHeroBody:{fontSize:12.5,lineHeight:18,color:'#4F4B40',maxWidth:'58%',marginTop:12},
  humanityTreeWrap:{position:'absolute',right:10,bottom:6,width:'45%',height:'72%',alignItems:'center',justifyContent:'center'},
  humanityTree:{fontSize:112,textShadowColor:'rgba(84,86,42,.15)',textShadowRadius:5},
  humanityEquation:{backgroundColor:'#FFFDF5',borderWidth:1,borderColor:'#DED2B7',borderRadius:18,padding:12,marginVertical:10,alignItems:'center'},
  humanityEquationCompact:{borderRadius:0,borderLeftWidth:0,borderRightWidth:0,marginVertical:0},
  equationLine:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,flexWrap:'wrap'},
  eqUnit:{alignItems:'center',minWidth:55},
  eqIcon:{fontSize:23},
  eqLabel:{fontSize:7.5,fontWeight:'900',marginTop:2},
  eqOp:{fontSize:17,fontWeight:'900',color:'#372F26'},
  eqPlus:{fontSize:20,fontWeight:'900',color:'#372F26',marginVertical:1},
  eqEquals:{fontSize:19,fontWeight:'900',color:'#372F26',marginVertical:1},
  startJourney:{marginHorizontal:18,marginVertical:15,backgroundColor:'#B58A22',borderWidth:1,borderColor:'#F5D984',borderRadius:28,paddingVertical:16,alignItems:'center',shadowColor:'#8A681A',shadowOpacity:.25,shadowRadius:8,elevation:3},
  startJourneyText:{fontSize:16,fontWeight:'900',color:'#FFFDF7',letterSpacing:.7},
  journeyDots:{flexDirection:'row',justifyContent:'center',gap:7,paddingBottom:13},
  journeyDot:{width:8,height:8,borderRadius:4,backgroundColor:'#C9BB96'},
  journeyDotOn:{backgroundColor:'#3C5A31'},
  journeyGrid:{gap:9},
  journeyTile:{minHeight:78,backgroundColor:'#FFFDF8',borderWidth:1,borderColor:'#DDD3BD',borderRadius:16,padding:10,flexDirection:'row',alignItems:'center',gap:10,shadowColor:'#66523D',shadowOpacity:.07,shadowRadius:4,elevation:1},
  journeyTileIcon:{width:51,height:51,borderRadius:26,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#F4EBD8'},
  journeyTileIconText:{fontSize:25,color:'#FFF'},
  journeyTileTitle:{fontSize:13.5,fontWeight:'900',color:'#302E27'},
  journeyTileSub:{fontSize:10.5,lineHeight:14,color:'#777064',marginTop:3},
  journeyTileArrow:{fontSize:31,color:'#4F4638',fontWeight:'300'},
  humanitySectionLabel:{fontSize:9,fontWeight:'900',letterSpacing:1.5,color:'#7E735F',marginTop:18,marginBottom:8},
  humanityScreenHeader:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:14},
  humanityBack:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:'#D5C7A7',backgroundColor:'#FFFDF8',alignItems:'center',justifyContent:'center'},
  humanityBackText:{fontSize:35,lineHeight:34,color:'#33442B'},
  humanityScreenTitle:{fontSize:23,fontWeight:'900',color:'#293A23'},
  humanityScreenStep:{fontSize:8.5,fontWeight:'900',letterSpacing:1.6,color:'#A66A2E',marginTop:2},
  humanityMiniTree:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'#D8C8A4',backgroundColor:'#FFFDF8',alignItems:'center',justifyContent:'center'},
  journeyWelcome:{backgroundColor:'#F2E8CF',borderRadius:20,borderWidth:1,borderColor:'#D9C9A5',padding:18,alignItems:'center'},
  journeyWelcomeTree:{fontSize:74},
  journeyWelcomeTitle:{fontSize:22,fontWeight:'900',color:'#30472B',textAlign:'center',lineHeight:25},
  journeyWelcomeText:{fontSize:12,lineHeight:18,color:'#625C50',textAlign:'center',marginTop:9},
  stageIntro:{backgroundColor:'#FFFDF8',borderRadius:18,borderWidth:1,borderColor:'#DED4BF',padding:16,alignItems:'center',marginBottom:15},
  stageIcon:{fontSize:42},
  stageIntroTitle:{fontSize:20,fontWeight:'900',color:'#30442A',textAlign:'center',marginTop:4},
  stageIntroText:{fontSize:12,lineHeight:18,color:'#6C655A',textAlign:'center',marginTop:7,marginBottom:12},
  journeyQuestion:{fontSize:13,fontWeight:'900',color:'#3B372F',marginTop:13,marginBottom:6},
  journeyInput:{minHeight:105,borderWidth:1,borderColor:'#D7CBB1',backgroundColor:'#FFFDF9',borderRadius:14,padding:13,color:'#302F2A',fontSize:13,lineHeight:19,textAlignVertical:'top'},
  valueGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  valueCard:{width:'48%',minHeight:92,borderWidth:1,borderColor:'#DDD3BD',backgroundColor:'#FFFDF8',borderRadius:15,padding:11,position:'relative'},
  valueIcon:{fontSize:29},
  valueName:{fontSize:12,fontWeight:'900',color:'#4C4941',marginTop:5},
  valueCheck:{position:'absolute',right:10,top:9,fontSize:17,color:'#897E69',fontWeight:'900'},
  identitySymbol:{backgroundColor:'#F2E8CF',borderWidth:1,borderColor:'#D8C6A1',borderRadius:20,padding:18,alignItems:'center',marginVertical:15},
  identitySymbolText:{fontSize:10,lineHeight:16,letterSpacing:1.1,color:'#4E5F40',fontWeight:'900',textAlign:'center'},
  chapterCard:{backgroundColor:'#FFFDF8',borderWidth:1,borderColor:'#DDD0B5',borderRadius:18,padding:16,marginVertical:14},
  chapterTitle:{fontSize:11,fontWeight:'900',letterSpacing:1.5,color:'#6A5034',marginBottom:9},
  chapterLine:{fontSize:12.5,color:'#4C4840',lineHeight:21},
  legacyHero:{backgroundColor:'#EEF0DF',borderRadius:20,borderWidth:1,borderColor:'#C8CBA7',padding:18,alignItems:'center'},
  legacyTree:{fontSize:76},
  legacyTitle:{fontSize:18,lineHeight:21,fontWeight:'900',color:'#30482C',textAlign:'center'},
  legacyText:{fontSize:12,lineHeight:18,color:'#5E6553',textAlign:'center',marginTop:7},
  promiseCard:{backgroundColor:'#FFF9E8',borderWidth:1,borderColor:'#DCCB9E',borderRadius:18,padding:16,marginVertical:15},
  promiseTitle:{fontSize:11,fontWeight:'900',letterSpacing:1.5,color:'#87651A',marginBottom:9,textAlign:'center'},
  promiseLine:{fontSize:12,color:'#4F4A3D',lineHeight:21}
'''
idx=s.rfind(style_marker)
if idx==-1:
    raise SystemExit('Humanity patch: StyleSheet end not found')
s=s[:idx]+styles+s[idx:]

# Required markers: fail the CI build rather than shipping a half-patched APK.
required=['START JOURNEY','My Humanity Journey','My Foundation','My Values','My Identity','My Book / My Story','My Legacy','HumanityEquation','humanityHeader','humanityNav']
missing=[x for x in required if x not in s]
if missing:
    raise SystemExit('Humanity Philosophy patch failed; missing: '+', '.join(missing))

p.write_text(s)
print('Humanity Philosophy experience applied: Home, Journey, Foundation, Values, Identity, Story and Legacy.')
