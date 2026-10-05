from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# Premium Humanity Philosophy visual system:
# dark forest, luminous gold, colourful values and stronger hierarchy.
# No safety-analysis logic is changed in this patch.

anchor = "function JourneyTile({icon,title,subtitle,onPress,accent='#486239'}){"
if "function PremiumTreeLogo" not in s:
    tree_component = r'''function PremiumTreeLogo({size=54}){
  const leaf=(left,top,w,h,color)=><View style={{position:'absolute',left:left*size,top:top*size,width:w*size,height:h*size,borderRadius:999,backgroundColor:color}}/>;
  return <View style={[styles.premiumTreeLogo,{width:size,height:size,borderRadius:size/2}]}>
    <View style={[styles.premiumTreeGlow,{borderRadius:size/2}]}/>
    {leaf(.18,.23,.24,.22,'#5F9E3F')}
    {leaf(.34,.11,.28,.24,'#8EBB42')}
    {leaf(.54,.18,.26,.23,'#D0A82D')}
    {leaf(.27,.38,.30,.24,'#6FAE45')}
    {leaf(.51,.39,.28,.23,'#E48128')}
    <View style={{position:'absolute',left:size*.46,top:size*.42,width:size*.09,height:size*.34,borderRadius:size*.04,backgroundColor:'#F0C05A',transform:[{rotate:'3deg'}]}}/>
    <View style={{position:'absolute',left:size*.28,top:size*.64,width:size*.44,height:size*.055,borderRadius:size*.03,backgroundColor:'#F0C05A'}}/>
    <View style={{position:'absolute',left:size*.36,top:size*.55,width:size*.1,height:size*.22,borderRadius:size*.04,backgroundColor:'#F0C05A',transform:[{rotate:'-34deg'}]}}/>
    <View style={{position:'absolute',left:size*.54,top:size*.55,width:size*.1,height:size*.22,borderRadius:size*.04,backgroundColor:'#F0C05A',transform:[{rotate:'34deg'}]}}/>
  </View>;
}

function GoldDotTrail({side='left'}){
  const dots=Array.from({length:15});
  return <View pointerEvents="none" style={[styles.goldTrail,side==='right'?styles.goldTrailRight:styles.goldTrailLeft]}>
    {dots.map((_,i)=><View key={i} style={[styles.goldTrailDot,{
      width:4+(i%3)*2,height:4+(i%3)*2,borderRadius:6,
      backgroundColor:i%4===0?'#F1C95A':i%4===1?'#D89526':'#A85A1E',
      opacity:.55+(i%3)*.15,
      transform:[{translateX:(i%5)*7},{translateY:i*7}]
    }]}/>)}
  </View>;
}

'''
    if anchor not in s:
        raise SystemExit('Premium design: JourneyTile anchor not found')
    s = s.replace(anchor, tree_component + anchor, 1)

s = s.replace(
    "style={[styles.journeyTileIcon,{backgroundColor:accent}]}",
    "style={[styles.journeyTileIcon,{borderColor:accent,shadowColor:accent}]}",
    1
)

old_header = '''  const Header=()=> <View style={styles.humanityHeader}>
    <View style={styles.humanityHeaderLogo}><Text style={styles.humanityHeaderTree}>🌳</Text></View>
    <View style={{flex:1}}><Text style={styles.humanityHeaderTitle}>EMOTIONAL SAFETY SYSTEM</Text><Text style={styles.humanityHeaderSub}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text></View>
  </View>;'''
new_header = '''  const Header=()=> <View style={styles.humanityHeader}>
    <PremiumTreeLogo size={48}/>
    <View style={{flex:1}}><Text style={styles.humanityHeaderTitle}>EMOTIONAL SAFETY SYSTEM</Text><Text style={styles.humanityHeaderSub}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text></View>
    <Text style={styles.headerBell}>♢</Text>
  </View>;'''
if old_header in s:
    s=s.replace(old_header,new_header,1)
else:
    raise SystemExit('Premium design: Humanity header not found')

s = s.replace(
    '<View style={styles.humanityMiniTree}><Text style={{fontSize:24}}>🌳</Text></View>',
    '<PremiumTreeLogo size={44}/>',
    1
)

home_sky_re = re.compile(
    r'''          <View style=\{styles\.humanityHeroSky\}>.*?          </View>\n          <HumanityEquation compact/>''',
    re.S
)
home_sky_new = r'''          <View style={styles.premiumHeroSky}>
            <GoldDotTrail side="left"/><GoldDotTrail side="right"/>
            <Text style={styles.premiumLeafLeft}>☘</Text><Text style={styles.premiumLeafRight}>☘</Text>
            <View style={styles.premiumSunGlow}/>
            <View style={styles.premiumHeroTree}><PremiumTreeLogo size={118}/></View>
            <View style={styles.premiumHeroCopy}>
              <Text style={styles.humanityHeroEyebrow}>THE</Text>
              <Text style={styles.humanityHeroTitle}>HUMANITY{`\n`}PHILOSOPHY</Text>
              <Text style={styles.humanityHeroScript}>Grow Yourself.{`\n`}Grow Humanity.</Text>
              <Text style={styles.humanityHeroBody}>A practical philosophy for a kinder, more understanding world. Build a better you. Help build a better humanity.</Text>
            </View>
            <View style={styles.premiumRiver}>
              <View style={styles.premiumRiverLine}/><View style={[styles.premiumRiverLine,{width:'70%',opacity:.55}]}/><View style={[styles.premiumRiverLine,{width:'45%',opacity:.35}]}/>
            </View>
          </View>
          <HumanityEquation compact/>'''
s, n = home_sky_re.subn(home_sky_new,s,count=1)
if n == 0:
    raise SystemExit('Premium design: Home hero block not found')

journey_welcome_re = re.compile(
    r'''        <View style=\{styles\.journeyWelcome\}>.*?        </View>\n        <HumanityEquation/>''',
    re.S
)
journey_welcome_new = r'''        <View style={styles.journeyWelcome}>
          <GoldDotTrail side="left"/><GoldDotTrail side="right"/>
          <Text style={styles.premiumLeafLeft}>☘</Text><Text style={styles.premiumLeafRight}>☘</Text>
          <PremiumTreeLogo size={94}/>
          <Text style={styles.journeyWelcomeTitle}>GROW YOURSELF.{`\n`}GROW HUMANITY.</Text>
          <View style={styles.goldRule}/>
          <Text style={styles.journeyWelcomeText}>This pathway turns your philosophy into something you can live, explain, write and pass forward. There are no perfect answers — the point is to make your values conscious and usable.</Text>
        </View>
        <HumanityEquation/>'''
s, n = journey_welcome_re.subn(journey_welcome_new,s,count=1)
if n == 0:
    raise SystemExit('Premium design: Journey welcome block not found')

s=s.replace("backgroundColor:'#FFF9EB'", "backgroundColor:'#10281B'")
s=s.replace('placeholderTextColor="#9B9587"', 'placeholderTextColor="#8FA596"')

style_marker="\n});"
premium_styles=r''',
  premiumTreeLogo:{overflow:'hidden',backgroundColor:'#07170F',borderWidth:2,borderColor:'#E6B83E',alignItems:'center',justifyContent:'center',shadowColor:'#FFD75E',shadowOpacity:.8,shadowRadius:10,elevation:8},
  premiumTreeGlow:{...StyleSheet.absoluteFillObject,backgroundColor:'#0B2517',borderWidth:1,borderColor:'rgba(255,220,100,.3)'},
  goldTrail:{position:'absolute',width:90,height:160,zIndex:1},
  goldTrailLeft:{left:-12,top:2,transform:[{rotate:'-18deg'}]},
  goldTrailRight:{right:-10,top:-2,transform:[{scaleX:-1},{rotate:'-18deg'}]},
  goldTrailDot:{position:'absolute',left:0,top:0,shadowColor:'#FFBF39',shadowOpacity:.5,shadowRadius:3},
  headerBell:{fontSize:25,color:'#F2CC61',textShadowColor:'#F6BF3F',textShadowRadius:7,marginLeft:4},
  premiumHeroSky:{minHeight:350,padding:18,backgroundColor:'#062015',position:'relative',overflow:'hidden',borderBottomWidth:1,borderBottomColor:'#A9771F'},
  premiumSunGlow:{position:'absolute',right:32,top:70,width:155,height:155,borderRadius:90,backgroundColor:'#8B5B13',opacity:.28,shadowColor:'#FFBF35',shadowOpacity:.95,shadowRadius:28,elevation:3},
  premiumHeroTree:{position:'absolute',right:10,top:58,zIndex:2},
  premiumHeroCopy:{zIndex:3,maxWidth:'68%',paddingTop:18},
  premiumLeafLeft:{position:'absolute',left:-15,bottom:0,fontSize:98,color:'#2C6A35',opacity:.55,transform:[{rotate:'-22deg'}]},
  premiumLeafRight:{position:'absolute',right:-22,bottom:-5,fontSize:105,color:'#33743B',opacity:.5,transform:[{scaleX:-1},{rotate:'-18deg'}]},
  premiumRiver:{position:'absolute',right:20,bottom:22,width:'48%',gap:8,transform:[{rotate:'-12deg'}]},
  premiumRiverLine:{height:5,borderRadius:6,backgroundColor:'#DBA533',shadowColor:'#FFD75A',shadowOpacity:.75,shadowRadius:5},
  goldRule:{height:2,width:94,backgroundColor:'#E7B53E',borderRadius:2,marginVertical:9,shadowColor:'#FFD760',shadowOpacity:.8,shadowRadius:4},

  humanityHeader:{height:76,paddingHorizontal:14,borderBottomWidth:1,borderBottomColor:'#6F511B',backgroundColor:'#03140D',flexDirection:'row',alignItems:'center',gap:11},
  humanityHeaderLogo:{width:50,height:50,borderRadius:25,borderWidth:2,borderColor:'#D8A934',backgroundColor:'#061A11',alignItems:'center',justifyContent:'center'},
  humanityHeaderTitle:{color:'#FFF1C0',fontWeight:'900',fontSize:13,letterSpacing:.9},
  humanityHeaderSub:{color:'#E3C57C',fontSize:7.6,letterSpacing:1.05,marginTop:4,fontWeight:'800'},
  humanityNav:{position:'absolute',left:0,right:0,bottom:0,height:70,backgroundColor:'#04150E',borderTopWidth:1,borderTopColor:'#7E5A1C',flexDirection:'row',paddingBottom:Platform.OS==='ios'?10:4},
  humanityNavIcon:{fontSize:22,color:'#C9D0C8'},
  humanityNavText:{fontSize:9,color:'#C9D0C8',marginTop:2,fontWeight:'700'},
  humanityNavActive:{color:'#FFD95D',textShadowColor:'#E8B63D',textShadowRadius:7},
  humanityPage:{backgroundColor:'#03160F',marginHorizontal:-13,marginTop:-13,paddingHorizontal:13,paddingTop:13,paddingBottom:20},
  humanityHeroCard:{backgroundColor:'#061A11',borderWidth:1.4,borderColor:'#D1A336',borderRadius:23,overflow:'hidden',shadowColor:'#E7B039',shadowOpacity:.32,shadowRadius:15,elevation:6,marginBottom:13},
  humanityHeroSky:{backgroundColor:'#062015'},
  humanityHeroEyebrow:{fontSize:11,letterSpacing:5.5,fontWeight:'900',color:'#FFF4CC',textShadowColor:'#000',textShadowRadius:4},
  humanityHeroTitle:{fontSize:30,lineHeight:30,fontWeight:'900',color:'#FFF3CF',marginTop:5,maxWidth:'100%',textShadowColor:'#000',textShadowRadius:6},
  humanityHeroScript:{fontSize:20,lineHeight:24,color:'#FFD34E',fontStyle:'italic',marginTop:10,fontWeight:'700',textShadowColor:'#3C2400',textShadowRadius:5},
  humanityHeroBody:{fontSize:12.2,lineHeight:17.5,color:'#F4EBD2',maxWidth:'100%',marginTop:11,textShadowColor:'#000',textShadowRadius:3},
  humanityEquation:{backgroundColor:'#071B12',borderWidth:1,borderColor:'#B8892B',borderRadius:17,padding:12,marginVertical:10,alignItems:'center',overflow:'hidden'},
  humanityEquationCompact:{borderRadius:0,borderLeftWidth:0,borderRightWidth:0,marginVertical:0,borderColor:'#70531C'},
  equationLine:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,flexWrap:'wrap'},
  eqUnit:{alignItems:'center',minWidth:55},
  eqIcon:{fontSize:22,width:43,height:43,borderRadius:22,borderWidth:1.2,borderColor:'#D8A735',backgroundColor:'#0B2417',textAlign:'center',paddingTop:7,overflow:'hidden',textShadowColor:'#FFD355',textShadowRadius:7},
  eqLabel:{fontSize:7.3,fontWeight:'900',marginTop:4,color:'#F2E7C4'},
  eqOp:{fontSize:18,fontWeight:'900',color:'#F7D86D'},
  eqPlus:{fontSize:21,fontWeight:'900',color:'#F7D86D',marginVertical:1},
  eqEquals:{fontSize:20,fontWeight:'900',color:'#F7D86D',marginVertical:1},
  startJourney:{marginHorizontal:18,marginVertical:15,backgroundColor:'#B98218',borderWidth:1.5,borderColor:'#FFE071',borderRadius:30,paddingVertical:17,alignItems:'center',shadowColor:'#FFC33B',shadowOpacity:.8,shadowRadius:14,elevation:7},
  startJourneyText:{fontSize:16,fontWeight:'900',color:'#FFF7DE',letterSpacing:.9,textShadowColor:'#6B3D00',textShadowRadius:4},
  journeyDots:{flexDirection:'row',justifyContent:'center',gap:7,paddingBottom:13},
  journeyDot:{width:7,height:7,borderRadius:4,backgroundColor:'#584A2A'},
  journeyDotOn:{backgroundColor:'#FFD359',shadowColor:'#FFC843',shadowOpacity:.8,shadowRadius:4},

  journeyGrid:{gap:8},
  journeyTile:{minHeight:74,backgroundColor:'#081D14',borderWidth:1,borderColor:'#A77A27',borderRadius:15,padding:10,flexDirection:'row',alignItems:'center',gap:10,shadowColor:'#D8A331',shadowOpacity:.13,shadowRadius:5,elevation:2},
  journeyTileIcon:{width:51,height:51,borderRadius:26,alignItems:'center',justifyContent:'center',borderWidth:1.6,backgroundColor:'#0C2418',shadowOpacity:.58,shadowRadius:7,elevation:4},
  journeyTileIconText:{fontSize:24,color:'#FFF'},
  journeyTileTitle:{fontSize:13.5,fontWeight:'900',color:'#FFF2CB'},
  journeyTileSub:{fontSize:10.4,lineHeight:14,color:'#C6CEBF',marginTop:3},
  journeyTileArrow:{fontSize:31,color:'#F0CE64',fontWeight:'300'},
  humanitySectionLabel:{fontSize:9,fontWeight:'900',letterSpacing:2.2,color:'#E7BB48',marginTop:18,marginBottom:8},
  humanityScreenHeader:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:14,backgroundColor:'#03160F'},
  humanityBack:{width:43,height:43,borderRadius:22,borderWidth:1.3,borderColor:'#D2A43A',backgroundColor:'#071C12',alignItems:'center',justifyContent:'center',shadowColor:'#E7B43C',shadowOpacity:.25,shadowRadius:6},
  humanityBackText:{fontSize:35,lineHeight:34,color:'#FFE077'},
  humanityScreenTitle:{fontSize:23,fontWeight:'900',color:'#FFF1CA',textShadowColor:'#000',textShadowRadius:4},
  humanityScreenStep:{fontSize:8.5,fontWeight:'900',letterSpacing:2.3,color:'#E8BB41',marginTop:2},
  journeyWelcome:{backgroundColor:'#082117',borderRadius:19,borderWidth:1,borderColor:'#B9892C',padding:18,alignItems:'center',overflow:'hidden',shadowColor:'#DFA83A',shadowOpacity:.2,shadowRadius:8},
  journeyWelcomeTree:{fontSize:0},
  journeyWelcomeTitle:{fontSize:22,fontWeight:'900',color:'#FFF0C5',textAlign:'center',lineHeight:25,textShadowColor:'#000',textShadowRadius:4},
  journeyWelcomeText:{fontSize:12,lineHeight:18,color:'#E7E4D7',textAlign:'center',marginTop:7},
  stageIntro:{backgroundColor:'#082017',borderRadius:18,borderWidth:1,borderColor:'#A97B2A',padding:16,alignItems:'center',marginBottom:15},
  stageIcon:{fontSize:42,textShadowColor:'#E9B33F',textShadowRadius:6},
  stageIntroTitle:{fontSize:20,fontWeight:'900',color:'#FFF1CB',textAlign:'center',marginTop:4},
  stageIntroText:{fontSize:12,lineHeight:18,color:'#C8D0C4',textAlign:'center',marginTop:7,marginBottom:12},
  journeyQuestion:{fontSize:13,fontWeight:'900',color:'#F4D97E',marginTop:13,marginBottom:6},
  journeyInput:{minHeight:105,borderWidth:1,borderColor:'#8A6726',backgroundColor:'#071A12',borderRadius:14,padding:13,color:'#FFF6DC',fontSize:13,lineHeight:19,textAlignVertical:'top'},
  valueGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  valueCard:{width:'48%',minHeight:92,borderWidth:1,borderColor:'#705624',backgroundColor:'#081D14',borderRadius:15,padding:11,position:'relative'},
  valueIcon:{fontSize:29,textShadowColor:'#F4C650',textShadowRadius:5},
  valueName:{fontSize:12,fontWeight:'900',color:'#F4E8C9',marginTop:5},
  valueCheck:{position:'absolute',right:10,top:9,fontSize:17,color:'#E7BD4A',fontWeight:'900'},
  identitySymbol:{backgroundColor:'#082117',borderWidth:1,borderColor:'#B4872F',borderRadius:20,padding:18,alignItems:'center',marginVertical:15},
  identitySymbolText:{fontSize:10,lineHeight:16,letterSpacing:1.1,color:'#E7D7A7',fontWeight:'900',textAlign:'center'},
  chapterCard:{backgroundColor:'#081D14',borderWidth:1,borderColor:'#9F7528',borderRadius:18,padding:16,marginVertical:14},
  chapterTitle:{fontSize:11,fontWeight:'900',letterSpacing:1.5,color:'#E5B94B',marginBottom:9},
  chapterLine:{fontSize:12.5,color:'#E0E5DA',lineHeight:21},
  legacyHero:{backgroundColor:'#092219',borderRadius:20,borderWidth:1,borderColor:'#A67A2A',padding:18,alignItems:'center'},
  legacyTree:{fontSize:76,textShadowColor:'#E9B339',textShadowRadius:8},
  legacyTitle:{fontSize:18,lineHeight:21,fontWeight:'900',color:'#FFF0C9',textAlign:'center'},
  legacyText:{fontSize:12,lineHeight:18,color:'#CAD2C7',textAlign:'center',marginTop:7},
  promiseCard:{backgroundColor:'#081D14',borderWidth:1,borderColor:'#A2792A',borderRadius:18,padding:16,marginVertical:15},
  promiseTitle:{fontSize:11,fontWeight:'900',letterSpacing:1.5,color:'#E8BB43',marginBottom:9,textAlign:'center'},
  promiseLine:{fontSize:12,color:'#DEE5D9',lineHeight:21}
'''

idx=s.rfind(style_marker)
if idx==-1:
    raise SystemExit('Premium design: StyleSheet end not found')
s=s[:idx]+premium_styles+s[idx:]

s=s.replace("backgroundColor:'#F7F2E7'", "backgroundColor:'#03160F'")

required=[
  'PremiumTreeLogo','GoldDotTrail','premiumHeroSky','START JOURNEY',
  "backgroundColor:'#03160F'","color:'#FFF1CA'","backgroundColor:'#071B12'"
]
missing=[x for x in required if x not in s]
if missing:
    raise SystemExit('Premium Humanity design failed; missing: '+', '.join(missing))

p.write_text(s)
print('Premium Humanity visual system applied: dark forest, gold glow, richer equation, journey cards and tree identity.')
