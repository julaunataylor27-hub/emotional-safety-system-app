from pathlib import Path

p=Path('App.js')
s=p.read_text()

# Full visual + journey expansion applied after premium design.
# Keeps the existing safety engine untouched.

s=s.replace('StyleSheet, StatusBar, Platform, Linking, Animated\n}', 'StyleSheet, StatusBar, Platform, Linking, Animated, Share\n}', 1)

anchor="function JourneyTile({icon,title,subtitle,onPress,accent='#486239'}){"
if 'function StageProgress' not in s:
    helpers=r'''function StageProgress({stage,total=7}){
  return <View style={styles.stageProgressWrap}>
    <View style={styles.stageProgressTop}><Text style={styles.stageProgressLabel}>YOUR JOURNEY</Text><Text style={styles.stageProgressCount}>{stage}/{total}</Text></View>
    <View style={styles.stageProgressRow}>{Array.from({length:total}).map((_,i)=><React.Fragment key={i}>
      <View style={[styles.stageProgressDot,i<stage&&styles.stageProgressDotDone,i===stage-1&&styles.stageProgressDotCurrent]}><Text style={styles.stageProgressDotText}>{i+1}</Text></View>
      {i<total-1&&<View style={[styles.stageProgressLine,i<stage-1&&styles.stageProgressLineDone]}/>} 
    </React.Fragment>)}</View>
  </View>;
}

function ScenicBanner({title,subtitle,quote}){
  return <View style={styles.scenicBanner}>
    <GoldDotTrail side="left"/><GoldDotTrail side="right"/>
    <View style={styles.scenicSun}/><View style={styles.scenicHillA}/><View style={styles.scenicHillB}/>
    <View style={styles.scenicTree}><PremiumTreeLogo size={86}/></View>
    <View style={styles.scenicCopy}><Text style={styles.scenicTitle}>{title}</Text>{subtitle?<Text style={styles.scenicSubtitle}>{subtitle}</Text>:null}</View>
    {quote?<View style={styles.scenicQuote}><Text style={styles.scenicQuoteText}>{quote}</Text></View>:null}
  </View>;
}

function TechFeatureCard({icon,title,body,status='WORKING',accent='#D7A62F',onPress}){
  return <Pressable onPress={onPress} disabled={!onPress} style={({pressed})=>[styles.techCard,{borderColor:accent},pressed&&{opacity:.82}]}>
    <View style={[styles.techIcon,{borderColor:accent,shadowColor:accent}]}><Text style={styles.techIconText}>{icon}</Text></View>
    <View style={{flex:1}}><View style={styles.techTitleRow}><Text style={styles.techTitle}>{title}</Text><Text style={[styles.techStatus,{color:accent}]}>{status}</Text></View><Text style={styles.techBody}>{body}</Text></View>
    {onPress?<Text style={styles.techArrow}>›</Text>:null}
  </Pressable>;
}

'''
    if anchor not in s: raise SystemExit('Full Humanity patch: JourneyTile anchor missing')
    s=s.replace(anchor,helpers+anchor,1)

state_anchor="  const [legacyWorld,setLegacyWorld]=useState('');"
if 'projectSelections' not in s:
    extra=r'''
  const [projectSelections,setProjectSelections]=useState([]);
  const [sharingSelections,setSharingSelections]=useState([]);'''
    if state_anchor not in s: raise SystemExit('Full Humanity patch: legacy state anchor missing')
    s=s.replace(state_anchor,state_anchor+extra,1)

old="  const journeyScreens=['journey','foundation','values','identity','story','legacy'];"
new="  const journeyScreens=['journey','foundation','values','identity','story','projects','sharing','legacy','tech'];"
if old in s: s=s.replace(old,new,1)
elif new not in s: raise SystemExit('Full Humanity patch: journeyScreens anchor missing')

helper_anchor="  const togglePhilosophyValue=(v)=>setPhilosophyValues(old=>old.includes(v)?old.filter(x=>x!==v):[...old,v]);"
if 'toggleProject' not in s:
    extra=r'''
  const toggleProject=(v)=>setProjectSelections(old=>old.includes(v)?old.filter(x=>x!==v):[...old,v]);
  const toggleSharing=(v)=>setSharingSelections(old=>old.includes(v)?old.filter(x=>x!==v):[...old,v]);
  const journeyProgress=[
    !!(foundationMessage||foundationWhy||foundationHope),
    philosophyValues.length>0&&!!valuesReflection,
    !!(philosophyName||philosophyMotto||philosophyVision),
    !!(bookTitle||storyNotes),
    projectSelections.length>0,
    sharingSelections.length>0,
    !!(legacyFeeling||legacyWorld)
  ].filter(Boolean).length;
  const exportJourney=()=>Share.share({title:'My Humanity Philosophy',message:`MY HUMANITY PHILOSOPHY\n\n${philosophyName}\n${philosophyMotto}\n\nFOUNDATION\n${foundationMessage}\n${foundationWhy}\n${foundationHope}\n\nVALUES\n${philosophyValues.join(', ')}\n${valuesReflection}\n\nVISION\n${philosophyVision}\n\nBOOK / STORY\n${bookTitle}\n${storyNotes}\n\nPROJECTS\n${projectSelections.join(', ')}\n\nSHARING\n${sharingSelections.join(', ')}\n\nLEGACY\n${legacyFeeling}\n${legacyWorld}`});'''
    if helper_anchor not in s: raise SystemExit('Full Humanity patch: value helper anchor missing')
    s=s.replace(helper_anchor,helper_anchor+extra,1)

def replace_between(text,start,end,replacement):
    i=text.find(start)
    if i<0: raise SystemExit('Full Humanity patch missing start: '+start)
    j=text.find(end,i)
    if j<0: raise SystemExit('Full Humanity patch missing end: '+end)
    return text[:i]+replacement+'\n\n'+text[j:]

home=r'''      {screen==='home'&&<View style={styles.humanityPage}>
        <View style={styles.cinemaHero}>
          <GoldDotTrail side="left"/><GoldDotTrail side="right"/>
          <View style={styles.cinemaSky}/><View style={styles.cinemaSun}/><View style={styles.cinemaMountainOne}/><View style={styles.cinemaMountainTwo}/><View style={styles.cinemaRiver}/>
          <View style={styles.cinemaTree}><PremiumTreeLogo size={126}/></View>
          <View style={styles.cinemaHeroText}>
            <Text style={styles.cinemaEyebrow}>THE</Text><Text style={styles.cinemaTitle}>HUMANITY{`\n`}PHILOSOPHY</Text>
            <Text style={styles.cinemaScript}>Grow Yourself.{`\n`}Grow Humanity.</Text>
            <Text style={styles.cinemaBody}>A practical philosophy for a kinder, more understanding world. Build a better you. Help build a better humanity.</Text>
          </View>
        </View>
        <View style={styles.cinemaEquation}><Text style={styles.cinemaSectionTitle}>THE PHILOSOPHY EQUATION</Text><HumanityEquation compact/></View>
        <Pressable onPress={()=>go('journey')} style={styles.cinemaStart}><Text style={styles.cinemaStartText}>START JOURNEY  →</Text></Pressable>
        <View style={styles.homeQuickGrid}>
          <Pressable onPress={()=>go('assessment')} style={styles.homeQuickCard}><Text style={styles.homeQuickIcon}>🛡</Text><Text style={styles.homeQuickTitle}>SAFETY CHECK</Text><Text style={styles.homeQuickText}>Choice • boundaries • coercion</Text></Pressable>
          <Pressable onPress={()=>go('tech')} style={styles.homeQuickCard}><Text style={styles.homeQuickIcon}>✦</Text><Text style={styles.homeQuickTitle}>TECH LAB</Text><Text style={styles.homeQuickText}>Progress • export • future AI</Text></Pressable>
        </View>
      </View>}'''

journey=r'''      {screen==='journey'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Humanity Journey" step="BEGIN HERE" onBack={()=>go('home')}/>
        <ScenicBanner title="GROW YOURSELF.\nGROW HUMANITY." subtitle="Turn your values into something you can live, explain, create and pass forward." quote="A brighter humanity begins with your journey."/>
        <StageProgress stage={journeyProgress}/>
        <Text style={styles.humanitySectionLabel}>YOUR 7-STAGE PATHWAY</Text>
        <JourneyTile icon="🌱" title="Stage 1 — My Foundation" subtitle="My purpose, message and why it matters" onPress={()=>go('foundation')} accent="#77B84B"/>
        <JourneyTile icon="❤️" title="Stage 2 — My Values" subtitle="What I believe and how I choose" onPress={()=>go('values')} accent="#E05043"/>
        <JourneyTile icon="◉" title="Stage 3 — My Identity" subtitle="Who I am, my direction and my story" onPress={()=>go('identity')} accent="#49A8D8"/>
        <JourneyTile icon="📖" title="Stage 4 — My Book / My Story" subtitle="Write, plan and turn ideas into a resource" onPress={()=>go('story')} accent="#E3A43D"/>
        <JourneyTile icon="🎨" title="Stage 5 — Creative Projects" subtitle="Turn the philosophy into real-world creations" onPress={()=>go('projects')} accent="#C9653E"/>
        <JourneyTile icon="🌏" title="Stage 6 — Sharing My Message" subtitle="Choose who I want to reach" onPress={()=>go('sharing')} accent="#42A2B7"/>
        <JourneyTile icon="🌳" title="Stage 7 — My Legacy" subtitle="What I want future generations to inherit" onPress={()=>go('legacy')} accent="#77A84A"/>
        <Text style={styles.humanitySectionLabel}>ADVANCED TOOLS</Text>
        <JourneyTile icon="✦" title="Technology Lab" subtitle="Progress, export, offline core tools and future AI features" onPress={()=>go('tech')} accent="#D7A62F"/>
      </View>}'''

foundation=r'''      {screen==='foundation'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Stage 1 — My Foundation" step="BUILD YOUR ROOTS" onBack={()=>go('journey')}/><StageProgress stage={1}/>
        <ScenicBanner title="STRONG ROOTS CREATE\nSTRONGER TOMORROWS." subtitle="Your foundation is the message underneath everything else." quote="Start with what matters most."/>
        <View style={styles.promptCard}><Text style={styles.promptNumber}>01</Text><View style={{flex:1}}><Text style={styles.journeyQuestion}>What is the one message I want people to remember?</Text><TextInput multiline value={foundationMessage} onChangeText={setFoundationMessage} placeholder="Write your thoughts…" placeholderTextColor="#829587" style={styles.journeyInput}/></View></View>
        <View style={styles.promptCard}><Text style={styles.promptNumber}>02</Text><View style={{flex:1}}><Text style={styles.journeyQuestion}>Why does this philosophy matter to me?</Text><TextInput multiline value={foundationWhy} onChangeText={setFoundationWhy} placeholder="What truth or experience sits underneath it?" placeholderTextColor="#829587" style={styles.journeyInput}/></View></View>
        <View style={styles.promptCard}><Text style={styles.promptNumber}>03</Text><View style={{flex:1}}><Text style={styles.journeyQuestion}>How do I hope it changes people's lives?</Text><TextInput multiline value={foundationHope} onChangeText={setFoundationHope} placeholder="What could become kinder, safer or stronger?" placeholderTextColor="#829587" style={styles.journeyInput}/></View></View>
        <PrimaryButton onPress={()=>go('values')} color="#D9A72E">NEXT: MY VALUES  →</PrimaryButton>
      </View>}'''

values=r'''      {screen==='values'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Stage 2 — My Values" step="WHAT MATTERS MOST TO ME?" onBack={()=>go('journey')}/><StageProgress stage={2}/>
        <Text style={styles.stageLead}>Tap the values that belong in your philosophy.</Text>
        <View style={styles.valueGrid}>{[['Knowledge','📖','#75B843'],['Understanding','🧠','#37A9DC'],['Love','❤️','#E44C43'],['Kindness','🤲','#E89B34'],['Patience','⏳','#D7A62F'],['Growth','🌱','#68B447'],['Humanity','👥','#A764D6'],['Life','☀️','#F0B632']].map(([v,ic,c])=><Pressable key={v} onPress={()=>togglePhilosophyValue(v)} style={[styles.valueCard,philosophyValues.includes(v)&&{borderColor:c,shadowColor:c,shadowOpacity:.45,shadowRadius:8}]}><Text style={styles.valueIcon}>{ic}</Text><Text style={[styles.valueName,philosophyValues.includes(v)&&{color:c}]}>{v}</Text><Text style={styles.valueMeaning}>{v==='Knowledge'?'What do I need to learn?':v==='Understanding'?'How do I understand before judging?':v==='Love'?'How do I care deeply?':v==='Kindness'?'How do I treat others?':v==='Patience'?'How do I make room for time?':v==='Growth'?'How do I keep becoming?':v==='Humanity'?'How are we connected?':'What makes life meaningful?'}</Text></Pressable>)}</View>
        <View style={styles.quoteCard}><Text style={styles.quoteCardText}>“Your values are the compass that guides your choices.”</Text></View>
        <Text style={styles.journeyQuestion}>What do these values look like when I actually live them?</Text><TextInput multiline value={valuesReflection} onChangeText={setValuesReflection} placeholder="Example: Understanding means I ask before I judge…" placeholderTextColor="#829587" style={styles.journeyInput}/>
        <View style={styles.twoButtons}><Pressable onPress={()=>go('foundation')} style={styles.secondaryGold}><Text style={styles.secondaryGoldText}>← BACK</Text></Pressable><Pressable onPress={()=>go('identity')} style={styles.primaryGold}><Text style={styles.primaryGoldText}>NEXT →</Text></Pressable></View>
      </View>}'''

identity=r'''      {screen==='identity'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Stage 3 — My Identity" step="WHO AM I BECOMING?" onBack={()=>go('journey')}/><StageProgress stage={3}/>
        <ScenicBanner title="NAME WHAT YOU STAND FOR." subtitle="Identity is where your values become a direction." quote="Your story can grow without losing its roots."/>
        <Text style={styles.journeyQuestion}>Name of my philosophy</Text><TextInput value={philosophyName} onChangeText={setPhilosophyName} placeholder="The Humanity Philosophy" placeholderTextColor="#829587" style={styles.journeyInputSingle}/>
        <Text style={styles.journeyQuestion}>My motto</Text><TextInput value={philosophyMotto} onChangeText={setPhilosophyMotto} placeholder="Grow yourself. Grow humanity." placeholderTextColor="#829587" style={styles.journeyInputSingle}/>
        <Text style={styles.journeyQuestion}>My logo idea / symbol</Text><View style={styles.identityLogoCard}><PremiumTreeLogo size={88}/><Text style={styles.identityLogoText}>ROOTS • GROWTH • HUMANITY • FUTURE</Text></View>
        <Text style={styles.journeyQuestion}>My vision</Text><TextInput multiline value={philosophyVision} onChangeText={setPhilosophyVision} placeholder="What kind of person and world do I want this philosophy to help create?" placeholderTextColor="#829587" style={styles.journeyInput}/>
        <PrimaryButton onPress={()=>go('story')} color="#D9A72E">NEXT: MY BOOK / STORY  →</PrimaryButton>
      </View>}'''

story_projects_sharing=r'''      {screen==='story'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Stage 4 — My Book / My Story" step="TURN IDEAS INTO A RESOURCE" onBack={()=>go('journey')}/><StageProgress stage={4}/>
        <ScenicBanner title="YOUR STORY CAN BECOME\nA GUIDE FOR SOMEONE ELSE." subtitle="Plan the message, chapters and examples you want to leave behind." quote="Write what you wish someone had explained to you."/>
        <Text style={styles.journeyQuestion}>Book title</Text><TextInput value={bookTitle} onChangeText={setBookTitle} placeholder="My Story. My Way." placeholderTextColor="#829587" style={styles.journeyInputSingle}/>
        <View style={styles.chapterCard}><Text style={styles.chapterTitle}>CHAPTER IDEAS</Text>{['Why I wrote this','Knowledge','Understanding','Love','Kindness','Patience','Growth','Humanity','Living the Philosophy','Final Message'].map(x=><Text key={x} style={styles.chapterLine}>□  {x}</Text>)}</View>
        <Text style={styles.journeyQuestion}>Notes / ideas</Text><TextInput multiline value={storyNotes} onChangeText={setStoryNotes} placeholder="Write scenes, lessons, examples or chapter notes…" placeholderTextColor="#829587" style={styles.journeyInput}/>
        <PrimaryButton onPress={()=>go('projects')} color="#D9A72E">NEXT: CREATIVE PROJECTS  →</PrimaryButton>
      </View>}

      {screen==='projects'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Stage 5 — Creative Projects" step="BRING YOUR MESSAGE TO LIFE" onBack={()=>go('journey')}/><StageProgress stage={5}/>
        <Text style={styles.stageLead}>Choose the ways you could turn the philosophy into something people can see, read, watch or use.</Text>
        <View style={styles.projectGrid}>{[['Logo','✺'],['Posters','▣'],["Children's Book",'📚'],['Website / App','◎'],['Short Video','▶'],['Social Media','▥'],['Community Presentation','👥'],['School Resource','🎓']].map(([v,ic])=><Pressable key={v} onPress={()=>toggleProject(v)} style={[styles.projectCard,projectSelections.includes(v)&&styles.projectCardOn]}><Text style={styles.projectIcon}>{ic}</Text><Text style={styles.projectTitle}>{v}</Text><Text style={styles.projectCheck}>{projectSelections.includes(v)?'✓':'+'}</Text></Pressable>)}</View>
        <View style={styles.quoteCard}><Text style={styles.quoteCardText}>Create for the eyes, ears and learning styles of different people.</Text></View>
        <PrimaryButton onPress={()=>go('sharing')} color="#D9A72E">NEXT: SHARING MY MESSAGE  →</PrimaryButton>
      </View>}

      {screen==='sharing'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Stage 6 — Sharing My Message" step="WHO DO I WANT TO REACH?" onBack={()=>go('journey')}/><StageProgress stage={6}/>
        <ScenicBanner title="A MESSAGE GROWS\nWHEN IT CAN BE SHARED." subtitle="Choose audiences that fit the purpose and keep the message respectful." quote="Local roots can grow into wider change."/>
        <View style={styles.shareList}>{['Family','Friends','Schools','Community Groups','Libraries','Local Members of Parliament','Australian Parliament','Online'].map(v=><Pressable key={v} onPress={()=>toggleSharing(v)} style={[styles.shareRow,sharingSelections.includes(v)&&styles.shareRowOn]}><Text style={styles.shareBox}>{sharingSelections.includes(v)?'✓':'□'}</Text><Text style={styles.shareText}>{v}</Text></Pressable>)}</View>
        <PrimaryButton onPress={()=>go('legacy')} color="#D9A72E">NEXT: MY LEGACY  →</PrimaryButton>
      </View>}'''

legacy_tech=r'''      {screen==='legacy'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Stage 7 — My Legacy" step="WHAT DO I WANT TO LEAVE BEHIND?" onBack={()=>go('journey')}/><StageProgress stage={7}/>
        <ScenicBanner title="LEAVE SOMETHING\nTHAT HELPS LIFE GROW." subtitle="Legacy is not perfection. It is what your choices make easier for the people who come after you." quote="One small act of kindness today can create a better world tomorrow."/>
        <Text style={styles.journeyQuestion}>How do I want people to feel after reading or using my philosophy?</Text><TextInput multiline value={legacyFeeling} onChangeText={setLegacyFeeling} placeholder="Write your thoughts…" placeholderTextColor="#829587" style={styles.journeyInput}/>
        <Text style={styles.journeyQuestion}>What kind of world do I hope future generations inherit?</Text><TextInput multiline value={legacyWorld} onChangeText={setLegacyWorld} placeholder="Describe the future you want to help create…" placeholderTextColor="#829587" style={styles.journeyInput}/>
        <View style={styles.legacySummary}><PremiumTreeLogo size={70}/><View style={{flex:1}}><Text style={styles.legacySummaryTitle}>MY PHILOSOPHY</Text><Text style={styles.legacySummaryText}>(Knowledge × Understanding) + (Love × Kindness × Patience) = Growth × Humanity = Life</Text></View></View>
        <Pressable onPress={exportJourney} style={styles.cinemaStart}><Text style={styles.cinemaStartText}>CREATE & SHARE MY SUMMARY  →</Text></Pressable>
        <PrimaryButton onPress={()=>go('tech')} color="#6E9B3F">EXPLORE THE TECHNOLOGY LAB  →</PrimaryButton>
      </View>}

      {screen==='tech'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Technology Lab" step="WHAT THE SYSTEM CAN GROW INTO" onBack={()=>go('journey')}/>
        <View style={styles.techHero}><Text style={styles.techHeroIcon}>✦</Text><View style={{flex:1}}><Text style={styles.techHeroTitle}>HUMANITY + TECHNOLOGY</Text><Text style={styles.techHeroText}>Technology should support human judgement, not replace it. This prototype separates working tools from future features.</Text></View></View>
        <View style={styles.progressCard}><Text style={styles.progressBig}>{Math.round(journeyProgress/7*100)}%</Text><View style={{flex:1}}><Text style={styles.progressTitle}>Journey progress</Text><View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${Math.round(journeyProgress/7*100)}%`}]}/></View><Text style={styles.progressSmall}>{journeyProgress} of 7 stages have meaningful input.</Text></View></View>
        <TechFeatureCard icon="🧠" title="Guided AI" body="Future pilot: explain patterns, ask reflective questions and point to verified resources with strict safeguarding limits." status="FUTURE PILOT" accent="#57AADD"/>
        <TechFeatureCard icon="💛" title="Emotion & Pattern Check" body="Use the existing safety assessment to reflect on choice, boundaries, coercion, dependency, truth and safety." onPress={()=>go('assessment')} accent="#E0A43A"/>
        <TechFeatureCard icon="✎" title="Private Journal" body="Write reflections inside the app. A production version can add encrypted on-device storage and optional backup." onPress={()=>go('journal')} accent="#9B73D0"/>
        <TechFeatureCard icon="🌿" title="Culture & Knowledge" body="Learning Centre pathways can combine evidence, cultural knowledge, stories and local resources." onPress={()=>go('learn')} accent="#6FAE50"/>
        <TechFeatureCard icon="⌁" title="Offline Core Journey" body="The guided journey and core safety information can be packaged in the app so basic use does not depend on internet access." accent="#5FAE87"/>
        <TechFeatureCard icon="▥" title="Create & Export" body="Share your current Humanity Philosophy summary from this prototype." onPress={exportJourney} accent="#D7A62F"/>
        <TechFeatureCard icon="👥" title="Community Hub" body="Future pilot: moderated community and organisation spaces with privacy, age-safety and governance controls." status="FUTURE PILOT" accent="#D26B4C"/>
      </View>}'''

s=replace_between(s,"      {screen==='home'&&","      {screen==='journey'&&",home)
s=replace_between(s,"      {screen==='journey'&&","      {screen==='foundation'&&",journey)
s=replace_between(s,"      {screen==='foundation'&&","      {screen==='values'&&",foundation)
s=replace_between(s,"      {screen==='values'&&","      {screen==='identity'&&",values)
s=replace_between(s,"      {screen==='identity'&&","      {screen==='story'&&",identity)
s=replace_between(s,"      {screen==='story'&&","      {screen==='legacy'&&",story_projects_sharing)
s=replace_between(s,"      {screen==='legacy'&&","      {screen==='assessment'&&",legacy_tech)

style_marker='\n});'
styles=r''',
  cinemaHero:{minHeight:390,borderRadius:24,overflow:'hidden',borderWidth:1.5,borderColor:'#D9A72E',backgroundColor:'#071910',position:'relative',shadowColor:'#E2AD36',shadowOpacity:.34,shadowRadius:16,elevation:7},
  cinemaSky:{...StyleSheet.absoluteFillObject,backgroundColor:'#0B281A',opacity:.96},
  cinemaSun:{position:'absolute',right:24,top:42,width:150,height:150,borderRadius:80,backgroundColor:'#A86513',opacity:.42,shadowColor:'#FFD45D',shadowOpacity:1,shadowRadius:32,elevation:2},
  cinemaMountainOne:{position:'absolute',right:-10,bottom:64,width:220,height:150,backgroundColor:'#183E25',transform:[{rotate:'18deg'}],opacity:.95},
  cinemaMountainTwo:{position:'absolute',left:-38,bottom:24,width:260,height:128,backgroundColor:'#102F20',transform:[{rotate:'-12deg'}],opacity:.98},
  cinemaRiver:{position:'absolute',right:38,bottom:-15,width:90,height:210,borderRadius:55,backgroundColor:'#D39828',opacity:.32,transform:[{rotate:'26deg'}],shadowColor:'#FFD55F',shadowOpacity:.8,shadowRadius:18},
  cinemaTree:{position:'absolute',right:16,top:72,zIndex:3},
  cinemaHeroText:{position:'absolute',left:22,top:55,width:'65%',zIndex:5},
  cinemaEyebrow:{color:'#FFF4D1',fontSize:12,fontWeight:'900',letterSpacing:5},
  cinemaTitle:{color:'#FFF3D2',fontSize:32,lineHeight:31,fontWeight:'900',marginTop:7,textShadowColor:'#000',textShadowRadius:8},
  cinemaScript:{color:'#FFD24D',fontSize:22,lineHeight:26,fontWeight:'700',fontStyle:'italic',marginTop:12,textShadowColor:'#3A2500',textShadowRadius:5},
  cinemaBody:{color:'#F2E7CD',fontSize:12.5,lineHeight:18,marginTop:12,maxWidth:'95%',textShadowColor:'#000',textShadowRadius:3},
  cinemaEquation:{marginTop:11,borderRadius:20,overflow:'hidden',borderWidth:1,borderColor:'#A77A27',backgroundColor:'#071B12'},
  cinemaSectionTitle:{color:'#F4D267',fontSize:10,fontWeight:'900',letterSpacing:1.8,textAlign:'center',paddingTop:12},
  cinemaStart:{marginVertical:14,marginHorizontal:8,borderRadius:32,paddingVertical:18,backgroundColor:'#C88E18',borderWidth:1.5,borderColor:'#FFE16C',alignItems:'center',shadowColor:'#FFC63D',shadowOpacity:.75,shadowRadius:14,elevation:7},
  cinemaStartText:{color:'#FFF7DC',fontWeight:'900',fontSize:16,letterSpacing:.8,textShadowColor:'#5A3500',textShadowRadius:4},
  homeQuickGrid:{flexDirection:'row',gap:9,marginBottom:8},
  homeQuickCard:{flex:1,minHeight:108,borderRadius:17,borderWidth:1,borderColor:'#8B6825',backgroundColor:'#081D14',padding:12,alignItems:'center',justifyContent:'center'},
  homeQuickIcon:{fontSize:28},homeQuickTitle:{fontSize:11,fontWeight:'900',color:'#F6D56B',marginTop:6},homeQuickText:{fontSize:9.5,lineHeight:13,color:'#BFC9BC',textAlign:'center',marginTop:3},
  scenicBanner:{minHeight:265,borderRadius:21,borderWidth:1.2,borderColor:'#A97A25',backgroundColor:'#082116',overflow:'hidden',position:'relative',marginBottom:12,padding:18,justifyContent:'flex-end'},
  scenicSun:{position:'absolute',right:38,top:24,width:112,height:112,borderRadius:60,backgroundColor:'#A86A18',opacity:.48,shadowColor:'#FFD260',shadowOpacity:.9,shadowRadius:28},
  scenicHillA:{position:'absolute',left:-32,bottom:36,width:245,height:120,backgroundColor:'#16452A',transform:[{rotate:'-8deg'}]},
  scenicHillB:{position:'absolute',right:-54,bottom:0,width:270,height:136,backgroundColor:'#0F3523',transform:[{rotate:'14deg'}]},
  scenicTree:{position:'absolute',right:18,top:32,zIndex:4},
  scenicCopy:{zIndex:5,width:'72%'},scenicTitle:{color:'#FFF1C9',fontSize:23,lineHeight:25,fontWeight:'900',textShadowColor:'#000',textShadowRadius:6},
  scenicSubtitle:{color:'#E9DDBE',fontSize:11.5,lineHeight:16.5,marginTop:8,textShadowColor:'#000',textShadowRadius:3},
  scenicQuote:{zIndex:6,marginTop:13,borderWidth:1,borderColor:'#936A21',backgroundColor:'rgba(5,19,13,.86)',borderRadius:12,padding:10},scenicQuoteText:{color:'#F0C75C',fontStyle:'italic',fontSize:11.5,lineHeight:16,textAlign:'center'},
  stageProgressWrap:{backgroundColor:'#071B12',borderWidth:1,borderColor:'#76561D',borderRadius:15,padding:11,marginBottom:12},stageProgressTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:9},stageProgressLabel:{color:'#E5B949',fontSize:8,fontWeight:'900',letterSpacing:1.8},stageProgressCount:{color:'#F9E6AA',fontSize:9,fontWeight:'900'},stageProgressRow:{flexDirection:'row',alignItems:'center',justifyContent:'center'},stageProgressDot:{width:23,height:23,borderRadius:12,borderWidth:1,borderColor:'#6C5A31',backgroundColor:'#102119',alignItems:'center',justifyContent:'center'},stageProgressDotDone:{backgroundColor:'#6B8F3D',borderColor:'#B6D267'},stageProgressDotCurrent:{backgroundColor:'#D09A28',borderColor:'#FFE077',shadowColor:'#FFD65B',shadowOpacity:.8,shadowRadius:6},stageProgressDotText:{fontSize:8,color:'#FFF4D0',fontWeight:'900'},stageProgressLine:{height:2,flex:1,backgroundColor:'#4C4026'},stageProgressLineDone:{backgroundColor:'#B98C2C'},
  promptCard:{flexDirection:'row',gap:10,borderWidth:1,borderColor:'#795C25',backgroundColor:'#081D14',borderRadius:16,padding:12,marginBottom:9},promptNumber:{fontSize:12,fontWeight:'900',color:'#F0C85C',paddingTop:4},
  stageLead:{color:'#D4DCCF',fontSize:12,lineHeight:18,marginBottom:12,textAlign:'center'},valueMeaning:{fontSize:8.5,lineHeight:12,color:'#AEB9AE',marginTop:4},quoteCard:{borderWidth:1,borderColor:'#86621F',backgroundColor:'#0A2117',borderRadius:15,padding:13,marginVertical:12},quoteCardText:{color:'#E8C75F',fontSize:11.5,fontStyle:'italic',textAlign:'center',lineHeight:16},
  twoButtons:{flexDirection:'row',gap:10,marginTop:14},secondaryGold:{flex:1,borderWidth:1,borderColor:'#D0A13A',borderRadius:24,paddingVertical:14,alignItems:'center',backgroundColor:'#081D14'},secondaryGoldText:{color:'#EAC65F',fontWeight:'900'},primaryGold:{flex:1,borderWidth:1,borderColor:'#FFE06A',borderRadius:24,paddingVertical:14,alignItems:'center',backgroundColor:'#C68D1B'},primaryGoldText:{color:'#FFF7DF',fontWeight:'900'},journeyInputSingle:{minHeight:52,borderWidth:1,borderColor:'#806126',backgroundColor:'#071C13',borderRadius:13,padding:13,color:'#F7ECD0',fontSize:13},identityLogoCard:{borderWidth:1,borderColor:'#7D5C20',backgroundColor:'#081E14',borderRadius:18,padding:15,alignItems:'center',gap:9},identityLogoText:{color:'#E2BF57',fontWeight:'900',fontSize:9,letterSpacing:1.4,textAlign:'center'},
  projectGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},projectCard:{width:'48%',minHeight:105,borderWidth:1,borderColor:'#785A25',backgroundColor:'#081E14',borderRadius:16,padding:12,alignItems:'center',justifyContent:'center',position:'relative'},projectCardOn:{borderColor:'#F0BF4E',backgroundColor:'#102B1B',shadowColor:'#FFC94E',shadowOpacity:.4,shadowRadius:8},projectIcon:{fontSize:30},projectTitle:{color:'#F0E4C7',fontSize:10.5,fontWeight:'900',marginTop:7,textAlign:'center'},projectCheck:{position:'absolute',top:7,right:9,color:'#F0C758',fontSize:16,fontWeight:'900'},
  shareList:{gap:8,marginBottom:14},shareRow:{flexDirection:'row',alignItems:'center',gap:11,borderWidth:1,borderColor:'#715625',backgroundColor:'#081D14',borderRadius:13,padding:12},shareRowOn:{borderColor:'#D5A531',backgroundColor:'#102719'},shareBox:{color:'#F0C658',fontSize:16,width:22,textAlign:'center'},shareText:{color:'#F1E6CB',fontSize:12,fontWeight:'700'},legacySummary:{flexDirection:'row',alignItems:'center',gap:13,borderWidth:1,borderColor:'#8A6723',backgroundColor:'#082016',borderRadius:18,padding:14,marginTop:13},legacySummaryTitle:{color:'#F0C85D',fontSize:10,fontWeight:'900',letterSpacing:1.5},legacySummaryText:{color:'#E6DDC7',fontSize:10.5,lineHeight:15,marginTop:4},
  techHero:{flexDirection:'row',gap:12,alignItems:'center',borderWidth:1,borderColor:'#9A7328',backgroundColor:'#082017',borderRadius:18,padding:15,marginBottom:12},techHeroIcon:{fontSize:40,color:'#F7CE58'},techHeroTitle:{color:'#F6D466',fontWeight:'900',fontSize:14},techHeroText:{color:'#C5D0C4',fontSize:10.5,lineHeight:15,marginTop:4},progressCard:{flexDirection:'row',alignItems:'center',gap:14,borderWidth:1,borderColor:'#7A5C22',backgroundColor:'#071C13',borderRadius:18,padding:15,marginBottom:12},progressBig:{fontSize:28,fontWeight:'900',color:'#FFD65A'},progressTitle:{color:'#F0E6CD',fontWeight:'900',fontSize:12},progressTrack:{height:8,backgroundColor:'#24382A',borderRadius:6,overflow:'hidden',marginTop:7},progressFill:{height:'100%',backgroundColor:'#CDA032'},progressSmall:{color:'#AEB9AE',fontSize:9,marginTop:5},techCard:{minHeight:86,flexDirection:'row',alignItems:'center',gap:11,borderWidth:1,backgroundColor:'#081D14',borderRadius:16,padding:11,marginBottom:8},techIcon:{width:48,height:48,borderRadius:24,borderWidth:1.3,alignItems:'center',justifyContent:'center',backgroundColor:'#0B2518',shadowOpacity:.4,shadowRadius:6},techIconText:{fontSize:24},techTitleRow:{flexDirection:'row',justifyContent:'space-between',gap:8},techTitle:{color:'#F5E7C8',fontWeight:'900',fontSize:12},techStatus:{fontSize:7.5,fontWeight:'900',letterSpacing:.7},techBody:{color:'#AEB9AE',fontSize:9.5,lineHeight:13.5,marginTop:4},techArrow:{color:'#F0CB62',fontSize:27}
'''
idx=s.rfind(style_marker)
if idx<0: raise SystemExit('Full Humanity patch: stylesheet end missing')
s=s[:idx]+styles+s[idx:]

required=['Stage 7 — My Legacy','Technology Lab','projectSelections','sharingSelections','CREATE & SHARE MY SUMMARY','FUTURE PILOT']
missing=[x for x in required if x not in s]
if missing: raise SystemExit('Full Humanity patch failed: '+', '.join(missing))

p.write_text(s)
print('Full seven-stage Humanity Philosophy experience and technology lab applied.')
