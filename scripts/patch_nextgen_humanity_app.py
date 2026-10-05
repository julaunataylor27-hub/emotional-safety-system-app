from pathlib import Path
import re

p=Path('App.js')
s=p.read_text()

# Next-generation Humanity Philosophy UI: seven-stage journey + cinematic nature art + tech lab.
# Keeps the existing safety/coercion analysis logic unchanged.

# Image support + generated nature artwork.
s=s.replace('StyleSheet, StatusBar, Platform, Linking, Animated\n} from \'react-native\';',
            'StyleSheet, StatusBar, Platform, Linking, Animated, ImageBackground\n} from \'react-native\';',1)
if "import humanityHero from './assets/humanity_hero';" not in s:
    s=s.replace("import { StatusBar as ExpoStatusBar } from 'expo-status-bar';",
                "import { StatusBar as ExpoStatusBar } from 'expo-status-bar';\nimport humanityHero from './assets/humanity_hero';",1)

# Reusable progress + technology cards.
anchor='export default function App(){'
if 'function StageProgress' not in s:
    helpers=r'''function StageProgress({stage=1,total=7}){
  return <View style={styles.stageProgressWrap}>
    <View style={styles.stageProgressRow}>
      {Array.from({length:total}).map((_,i)=><View key={i} style={[styles.stageProgressDot,i<stage&&styles.stageProgressDotOn]}/>) }
      <Text style={styles.stageProgressText}>{stage}/{total}</Text>
    </View>
  </View>;
}

function TechFeature({icon,title,subtitle,onPress,accent='#E9B53F'}){
  return <Pressable onPress={onPress} style={({pressed})=>[styles.techFeature,pressed&&{opacity:.78}]}>
    <View style={[styles.techFeatureIcon,{borderColor:accent,shadowColor:accent}]}><Text style={styles.techFeatureIconText}>{icon}</Text></View>
    <View style={{flex:1}}><Text style={styles.techFeatureTitle}>{title}</Text><Text style={styles.techFeatureSub}>{subtitle}</Text></View>
    <Text style={styles.techFeatureArrow}>›</Text>
  </Pressable>;
}

'''
    if anchor not in s:
        raise SystemExit('Nextgen patch: App anchor not found')
    s=s.replace(anchor,helpers+anchor,1)

# Extra state for stages 5-6.
state_anchor="  const [legacyWorld,setLegacyWorld]=useState('');"
if 'projectIdeas' not in s:
    extra=r'''\n  const [projectIdeas,setProjectIdeas]=useState(['Logo','Website / App']);
  const [projectNotes,setProjectNotes]=useState('');
  const [sharingWith,setSharingWith]=useState(['Family','Community Groups']);
  const [sharingNotes,setSharingNotes]=useState('');'''
    if state_anchor not in s:
        raise SystemExit('Nextgen patch: state anchor not found')
    s=s.replace(state_anchor,state_anchor+extra,1)

# Journey nav recognises all seven stages + tech lab.
s=s.replace("const journeyScreens=['journey','foundation','values','identity','story','legacy'];",
            "const journeyScreens=['journey','foundation','values','identity','story','projects','sharing','legacy','tech'];",1)

# Make the home hero a true cinematic background rather than a flat illustration.
hero_re=re.compile(r'''          <View style=\{styles\.premiumHeroSky\}>.*?          </View>\n          <HumanityEquation compact/>''',re.S)
hero_new=r'''          <ImageBackground source={{uri:humanityHero}} resizeMode="cover" style={styles.nextGenHero} imageStyle={styles.nextGenHeroImage}>
            <View style={styles.nextGenHeroShade}/>
            <GoldDotTrail side="left"/><GoldDotTrail side="right"/>
            <View style={styles.nextGenHeroCopy}>
              <Text style={styles.humanityHeroEyebrow}>THE</Text>
              <Text style={styles.humanityHeroTitle}>HUMANITY{`\n`}PHILOSOPHY</Text>
              <Text style={styles.humanityHeroScript}>Grow Yourself.{`\n`}Grow Humanity.</Text>
              <Text style={styles.humanityHeroBody}>A practical philosophy for a kinder, more understanding world. Build a better you. Help build a better humanity.</Text>
            </View>
          </ImageBackground>
          <HumanityEquation compact/>'''
s,n=hero_re.subn(hero_new,s,count=1)
if n==0:
    raise SystemExit('Nextgen patch: premium hero not found')

# Journey overview also gets a cinematic nature scene.
welcome_re=re.compile(r'''        <View style=\{styles\.journeyWelcome\}>.*?        </View>\n        <HumanityEquation/>''',re.S)
welcome_new=r'''        <ImageBackground source={{uri:humanityHero}} resizeMode="cover" style={styles.nextGenJourneyHero} imageStyle={styles.nextGenJourneyHeroImage}>
          <View style={styles.nextGenJourneyShade}/>
          <GoldDotTrail side="left"/><GoldDotTrail side="right"/>
          <PremiumTreeLogo size={86}/>
          <Text style={styles.journeyWelcomeTitle}>GROW YOURSELF.{`\n`}GROW HUMANITY.</Text>
          <View style={styles.goldRule}/>
          <Text style={styles.journeyWelcomeText}>This pathway turns your philosophy into something you can live, explain, create and pass forward. The goal is conscious values, safer choices and a legacy you can use.</Text>
        </ImageBackground>
        <HumanityEquation/>'''
s,n=welcome_re.subn(welcome_new,s,count=1)
if n==0:
    raise SystemExit('Nextgen patch: journey welcome not found')

# Upgrade Home journey map to seven real stages.
home_old='''          <JourneyTile icon="▤" title="5. MY BOOK / MY STORY" subtitle="Turn my philosophy into a story, book or message" onPress={()=>go('story')} accent="#70547C"/>\n          <JourneyTile icon="🌳" title="6. MY LEGACY" subtitle="A kinder, more connected future for generations" onPress={()=>go('legacy')} accent="#55733D"/>'''
home_new='''          <JourneyTile icon="▤" title="5. MY BOOK / MY STORY" subtitle="Turn my philosophy into a story, book or message" onPress={()=>go('story')} accent="#70547C"/>\n          <JourneyTile icon="🎨" title="6. CREATIVE PROJECTS" subtitle="Logo, posters, website, children's book and media" onPress={()=>go('projects')} accent="#C86F2C"/>\n          <JourneyTile icon="🌍" title="7. SHARING & LEGACY" subtitle="Choose who to share with and what future you want to leave" onPress={()=>go('sharing')} accent="#2F86A6"/>'''
if home_old not in s:
    raise SystemExit('Nextgen patch: Home stage list anchor not found')
s=s.replace(home_old,home_new,1)

journey_old='''        <JourneyTile icon="▤" title="My Book / My Story" subtitle="Shape the message into chapters or a story" onPress={()=>go('story')} accent="#70547C"/>\n        <JourneyTile icon="🌳" title="My Legacy" subtitle="What should future generations inherit?" onPress={()=>go('legacy')} accent="#55733D"/>'''
journey_new='''        <JourneyTile icon="▤" title="Stage 4 — My Book / My Story" subtitle="Shape the message into chapters or a story" onPress={()=>go('story')} accent="#70547C"/>\n        <JourneyTile icon="🎨" title="Stage 5 — Creative Projects" subtitle="Turn the message into things people can see and use" onPress={()=>go('projects')} accent="#C86F2C"/>\n        <JourneyTile icon="🌍" title="Stage 6 — Sharing My Message" subtitle="Decide who you want to reach and how" onPress={()=>go('sharing')} accent="#2F86A6"/>\n        <JourneyTile icon="🌳" title="Stage 7 — My Legacy" subtitle="What should future generations inherit?" onPress={()=>go('legacy')} accent="#55733D"/>'''
if journey_old not in s:
    raise SystemExit('Nextgen patch: Journey stage list anchor not found')
s=s.replace(journey_old,journey_new,1)

# Progress indicator on existing stages.
headers=[
("<HumanityScreenHeader title=\"My Foundation\" step=\"STAGE 1\" onBack={()=>go('journey')}/>","<HumanityScreenHeader title=\"My Foundation\" step=\"STAGE 1\" onBack={()=>go('journey')}/><StageProgress stage={1}/>"),
("<HumanityScreenHeader title=\"My Values\" step=\"STAGE 2\" onBack={()=>go('journey')}/>","<HumanityScreenHeader title=\"My Values\" step=\"STAGE 2\" onBack={()=>go('journey')}/><StageProgress stage={2}/>"),
("<HumanityScreenHeader title=\"My Identity\" step=\"STAGE 3\" onBack={()=>go('journey')}/>","<HumanityScreenHeader title=\"My Identity\" step=\"STAGE 3\" onBack={()=>go('journey')}/><StageProgress stage={3}/>"),
("<HumanityScreenHeader title=\"My Book / My Story\" step=\"STAGE 4\" onBack={()=>go('journey')}/>","<HumanityScreenHeader title=\"My Book / My Story\" step=\"STAGE 4\" onBack={()=>go('journey')}/><StageProgress stage={4}/>"),
]
for a,b in headers:
    if a not in s: raise SystemExit('Nextgen patch: missing stage header '+a[:40])
    s=s.replace(a,b,1)

# Story flows to Creative Projects, not straight to Legacy.
s=s.replace("<PrimaryButton onPress={()=>go('legacy')} color=\"#C59A2A\">NEXT: MY LEGACY  →</PrimaryButton>",
            "<PrimaryButton onPress={()=>go('projects')} color=\"#C59A2A\">NEXT: CREATIVE PROJECTS  →</PrimaryButton>",1)

# Insert Stage 5 and 6 before legacy.
legacy_anchor="      {screen==='legacy'&&<View style={styles.humanityPage}>"
if "screen==='projects'" not in s:
    block=r'''      {screen==='projects'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Creative Projects" step="STAGE 5" onBack={()=>go('journey')}/><StageProgress stage={5}/>
        <ImageBackground source={{uri:humanityHero}} resizeMode="cover" style={styles.stageImageBanner} imageStyle={styles.stageImageBannerImg}>
          <View style={styles.stageImageShade}/><Text style={styles.stageImageTitle}>TURN IDEAS INTO SOMETHING REAL.</Text><Text style={styles.stageImageText}>Choose the formats that could carry your message into the world.</Text>
        </ImageBackground>
        <View style={styles.projectGrid}>{['Logo','Posters',"Children's Book",'Website / App','Short Video','Social Media','Community Presentation','School Resource'].map((x,i)=>{
          const icons=['✦','▣','📖','◎','▶','▤','👥','🎓']; const on=projectIdeas.includes(x);
          return <Pressable key={x} onPress={()=>setProjectIdeas(v=>on?v.filter(z=>z!==x):[...v,x])} style={[styles.projectCard,on&&styles.projectCardOn]}><Text style={styles.projectCardIcon}>{icons[i]}</Text><Text style={styles.projectCardText}>{x}</Text><Text style={styles.projectCardCheck}>{on?'✓':'+'}</Text></Pressable>
        })}</View>
        <Text style={styles.journeyQuestion}>Other ideas</Text>
        <TextInput multiline value={projectNotes} onChangeText={setProjectNotes} placeholder="What else could you create?" placeholderTextColor="#8FA596" style={styles.journeyInput}/>
        <PrimaryButton onPress={()=>go('sharing')} color="#C59A2A">NEXT: SHARE MY MESSAGE  →</PrimaryButton>
      </View>}

      {screen==='sharing'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Sharing My Message" step="STAGE 6" onBack={()=>go('journey')}/><StageProgress stage={6}/>
        <View style={styles.stageIntro}><Text style={styles.stageIcon}>🌍</Text><Text style={styles.stageIntroTitle}>Who do I want this to reach?</Text><Text style={styles.stageIntroText}>Sharing is a choice. Pick the audiences that fit your purpose and keep control over what you share.</Text></View>
        <View style={styles.shareList}>{['Family','Friends','Schools','Community Groups','Libraries','Local Members of Parliament','Australian Parliament','Online'].map(x=>{
          const on=sharingWith.includes(x); return <Pressable key={x} onPress={()=>setSharingWith(v=>on?v.filter(z=>z!==x):[...v,x])} style={[styles.shareRow,on&&styles.shareRowOn]}><View style={[styles.shareCheck,on&&styles.shareCheckOn]}><Text style={styles.shareCheckText}>{on?'✓':''}</Text></View><Text style={styles.shareText}>{x}</Text></Pressable>
        })}</View>
        <Text style={styles.journeyQuestion}>Anything I want to remember about sharing safely?</Text>
        <TextInput multiline value={sharingNotes} onChangeText={setSharingNotes} placeholder="Boundaries, privacy, who I trust, what stays private…" placeholderTextColor="#8FA596" style={styles.journeyInput}/>
        <PrimaryButton onPress={()=>go('legacy')} color="#C59A2A">NEXT: MY LEGACY  →</PrimaryButton>
      </View>}

'''
    if legacy_anchor not in s: raise SystemExit('Nextgen patch: legacy anchor missing')
    s=s.replace(legacy_anchor,block+legacy_anchor,1)

# Legacy becomes stage 7 and shows final progress.
s=s.replace('<HumanityScreenHeader title="My Legacy" step="STAGE 5" onBack={()=>go(\'journey\')}/>',
            '<HumanityScreenHeader title="My Legacy" step="STAGE 7" onBack={()=>go(\'journey\')}/><StageProgress stage={7}/>',1)

# A visible Tech Lab using only capabilities that are really connected to existing prototype screens.
tools_anchor='<Text style={styles.humanitySectionLabel}>EMOTIONAL SAFETY TOOLS</Text>'
if 'NEXT-GEN TECH LAB' not in s:
    tech_tile='''<Text style={styles.humanitySectionLabel}>NEXT-GEN TECH LAB</Text>\n        <JourneyTile icon="✦" title="Explore the Technology Layer" subtitle="AI guide concept, emotional analysis, journal, culture, progress and creation tools" onPress={()=>go('tech')} accent="#E7B53D"/>\n\n        '''
    s=s.replace(tools_anchor,tech_tile+tools_anchor,1)

assessment_anchor="      {screen==='assessment'&&<>"
if "screen==='tech'" not in s:
    tech_screen=r'''      {screen==='tech'&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="Technology Layer" step="PROTOTYPE LAB" onBack={()=>go('home')}/>
        <ImageBackground source={{uri:humanityHero}} resizeMode="cover" style={styles.techHero} imageStyle={styles.techHeroImg}>
          <View style={styles.techHeroShade}/><PremiumTreeLogo size={76}/><Text style={styles.techHeroTitle}>HUMANITY + TECHNOLOGY</Text><Text style={styles.techHeroText}>Technology should help people understand, reflect, create and find support — without replacing human judgement.</Text>
        </ImageBackground>
        <Text style={styles.humanitySectionLabel}>CONNECTED PROTOTYPE TOOLS</Text>
        <TechFeature icon="✦" title="AI Guide Concept" subtitle="A future conversational guide for reflection and learning" onPress={()=>go('learn')} accent="#E9B53F"/>
        <TechFeature icon="◉" title="Emotion & Safety Analysis" subtitle="Uses the existing assessment engine and safety signals" onPress={()=>go('assessment')} accent="#D95E4B"/>
        <TechFeature icon="▤" title="Personal Journal" subtitle="Private reflection space in this prototype session" onPress={()=>go('journal')} accent="#46A6C9"/>
        <TechFeature icon="◎" title="Cultural Knowledge" subtitle="Learning resources and culturally respectful context" onPress={()=>go('learn')} accent="#6EA84B"/>
        <TechFeature icon="⌁" title="Offline-first Design" subtitle="Core journey and learning can be packaged on-device" onPress={()=>go('journey')} accent="#72C26E"/>
        <TechFeature icon="▥" title="Progress Tracking" subtitle="Seven journey stages with visual progress" onPress={()=>go('journey')} accent="#D9A138"/>
        <TechFeature icon="✎" title="Create & Export" subtitle="Build your story and creative project plan" onPress={()=>go('story')} accent="#8D6BC4"/>
        <TechFeature icon="♡" title="Community & Support" subtitle="Routes back to real support information" onPress={()=>go('support')} accent="#D45B75"/>
        <View style={styles.techNotice}><Text style={styles.techNoticeTitle}>PROTOTYPE NOTE</Text><Text style={styles.techNoticeText}>These controls connect to working prototype sections. Live AI, cloud sync, secure accounts and automatic export would need a backend and privacy/security review before public release.</Text></View>
      </View>}

'''
    if assessment_anchor not in s: raise SystemExit('Nextgen patch: assessment anchor missing')
    s=s.replace(assessment_anchor,tech_screen+assessment_anchor,1)

# Styles for cinematic visuals, stages, creative projects and tech lab.
style_marker='\n});'
styles=r''',
  nextGenHero:{minHeight:365,padding:18,justifyContent:'flex-end',overflow:'hidden'},
  nextGenHeroImage:{borderTopLeftRadius:22,borderTopRightRadius:22},
  nextGenHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,16,10,.42)'},
  nextGenHeroCopy:{maxWidth:'72%',zIndex:2,marginTop:30,marginBottom:14},
  nextGenJourneyHero:{minHeight:285,borderRadius:20,overflow:'hidden',padding:18,alignItems:'center',justifyContent:'center',marginBottom:10,borderWidth:1,borderColor:'#C89631'},
  nextGenJourneyHeroImage:{borderRadius:20},
  nextGenJourneyShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(1,16,9,.5)'},
  stageProgressWrap:{marginTop:-5,marginBottom:12},
  stageProgressRow:{flexDirection:'row',alignItems:'center',gap:6},
  stageProgressDot:{height:7,flex:1,borderRadius:5,backgroundColor:'#2B392E',borderWidth:1,borderColor:'#66541F'},
  stageProgressDotOn:{backgroundColor:'#F2BE3C',shadowColor:'#FFD15C',shadowOpacity:.55,shadowRadius:5},
  stageProgressText:{color:'#F5D77D',fontWeight:'900',fontSize:10,marginLeft:5},
  stageImageBanner:{minHeight:190,borderRadius:18,overflow:'hidden',padding:18,justifyContent:'flex-end',borderWidth:1,borderColor:'#9E7629',marginBottom:14},
  stageImageBannerImg:{borderRadius:18},
  stageImageShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(1,14,9,.48)'},
  stageImageTitle:{color:'#FFF2C5',fontSize:19,fontWeight:'900',zIndex:2,textShadowColor:'#000',textShadowRadius:5},
  stageImageText:{color:'#E9E5D7',fontSize:12,lineHeight:18,marginTop:5,zIndex:2},
  projectGrid:{flexDirection:'row',flexWrap:'wrap',gap:9,marginBottom:8},
  projectCard:{width:'48%',minHeight:95,backgroundColor:'#081D14',borderWidth:1,borderColor:'#654A20',borderRadius:14,padding:11,position:'relative'},
  projectCardOn:{borderColor:'#E1B13B',backgroundColor:'#102B1B',shadowColor:'#E6B23B',shadowOpacity:.25,shadowRadius:6},
  projectCardIcon:{fontSize:28,color:'#FFD463'},
  projectCardText:{fontSize:11.5,fontWeight:'900',color:'#F7ECCC',marginTop:7,maxWidth:'85%'},
  projectCardCheck:{position:'absolute',right:9,top:8,fontSize:16,color:'#F1C14D',fontWeight:'900'},
  shareList:{gap:8,marginVertical:6},
  shareRow:{minHeight:52,borderRadius:13,borderWidth:1,borderColor:'#59461F',backgroundColor:'#071C12',padding:10,flexDirection:'row',alignItems:'center',gap:10},
  shareRowOn:{borderColor:'#D7A632',backgroundColor:'#10281A'},
  shareCheck:{width:25,height:25,borderRadius:7,borderWidth:1.3,borderColor:'#95722A',alignItems:'center',justifyContent:'center'},
  shareCheckOn:{backgroundColor:'#C18A20',borderColor:'#F6D66A'},
  shareCheckText:{color:'#FFF6D8',fontWeight:'900'},
  shareText:{color:'#F0E6C9',fontWeight:'800',fontSize:12.5},
  techHero:{minHeight:245,borderRadius:20,overflow:'hidden',padding:18,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#C2922C'},
  techHeroImg:{borderRadius:20},
  techHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,18,10,.58)'},
  techHeroTitle:{color:'#FFE88E',fontSize:21,fontWeight:'900',marginTop:10,textAlign:'center',zIndex:2},
  techHeroText:{color:'#F0E8D5',fontSize:12,lineHeight:18,textAlign:'center',marginTop:7,zIndex:2},
  techFeature:{minHeight:72,borderRadius:15,borderWidth:1,borderColor:'#6F5521',backgroundColor:'#071D13',padding:10,flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
  techFeatureIcon:{width:48,height:48,borderRadius:24,borderWidth:1.5,backgroundColor:'#0A2618',alignItems:'center',justifyContent:'center',shadowOpacity:.4,shadowRadius:6},
  techFeatureIconText:{fontSize:22,color:'#FFF0B4'},
  techFeatureTitle:{fontSize:13,fontWeight:'900',color:'#FFF0C7'},
  techFeatureSub:{fontSize:10.4,lineHeight:14,color:'#BBC9BB',marginTop:3},
  techFeatureArrow:{fontSize:30,color:'#E8C558'},
  techNotice:{borderRadius:15,borderWidth:1,borderColor:'#3E6E57',backgroundColor:'#0A2118',padding:13,marginTop:5},
  techNoticeTitle:{fontSize:9,fontWeight:'900',letterSpacing:1.6,color:'#86D4B0'},
  techNoticeText:{fontSize:10.5,lineHeight:16,color:'#C9D8CE',marginTop:5}
'''
idx=s.rfind(style_marker)
if idx==-1: raise SystemExit('Nextgen patch: stylesheet end missing')
s=s[:idx]+styles+s[idx:]

required=['CREATIVE PROJECTS','Sharing My Message','Technology Layer','NEXT-GEN TECH LAB','StageProgress','humanityHero','stageProgressWrap']
missing=[x for x in required if x not in s]
if missing: raise SystemExit('Nextgen patch failed; missing: '+', '.join(missing))

p.write_text(s)
print('Next-generation Humanity Philosophy app applied: cinematic art, seven stages, creative projects, sharing, progress and tech lab.')
