from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# Add image primitives and embedded brand art.
s = s.replace(
    "StyleSheet, StatusBar, Platform, Linking, Animated",
    "StyleSheet, StatusBar, Platform, Linking, Animated, Image, ImageBackground",
    1
)
if "./assets/primary_riders" not in s:
    s = s.replace(
        "import { StatusBar as ExpoStatusBar } from 'expo-status-bar';",
        "import { StatusBar as ExpoStatusBar } from 'expo-status-bar';\nimport PRIMARY_RIDERS from './assets/primary_riders';\nimport KNOWLEDGE_JUSTICE from './assets/knowledge_justice';",
        1
    )

# Lock the approved brand palette: deep black/navy + ochre/gold + red + white.
color_re = re.compile(r"const C = \{.*?\n\};", re.S)
brand_colors = """const C = {
  bg:'#020609', panel:'#07141C', panel2:'#0B1E2B', line:'#5C4218',
  text:'#FFF7E3', muted:'#C1B49B', cream:'#FFE29A', ochre:'#F4A900',
  rust:'#8B2215', gold:'#FFBD32', green:'#2CCB70', yellow:'#F2B51D',
  red:'#F04432', blue:'#D59A25', purple:'#7B47C8', cyan:'#D9A32B', white:'#FFFFFF'
};"""
s = color_re.sub(brand_colors, s, count=1)

# Gold is the default primary action colour.
s = s.replace("function PrimaryButton({children,onPress,color=C.cream", "function PrimaryButton({children,onPress,color=C.gold", 1)

# Add a reusable dotwork-inspired brand band. This is an original interface motif,
# not a copy of a specific artwork or community-owned design.
orn_end = """function Stepper({active}){"""
if "function BrandBand" not in s and orn_end in s:
    brand_band = r'''function BrandBand({compact=false}){
  const cols=['#D62B1F','#F4B400','#FFFFFF','#E97817','#D62B1F','#FFFFFF','#F4B400','#D62B1F','#FFFFFF','#E97817','#F4B400'];
  return <View style={[styles.brandBand,compact&&styles.brandBandCompact]}>
    {cols.map((c,i)=><View key={i} style={[styles.brandBandDot,{backgroundColor:c,transform:[{translateY:(i%3-1)*3}]}]} />)}
  </View>;
}

function Stepper({active}){'''
    s = s.replace(orn_end, brand_band, 1)

# Premium header with the riders crest.
header_re = re.compile(r"  const Header=\(\)=> <View style=\{styles\.header\}>.*?</View>;", re.S)
header_new = r'''  const Header=()=> <View style={styles.header}>
    <View style={styles.brandCrestShell}><Image source={{uri:PRIMARY_RIDERS}} style={styles.brandCrestImage}/></View>
    <View style={{flex:1}}><Text style={styles.headerTitle}>EMOTIONAL SAFETY SYSTEM</Text><Text style={styles.headerSub}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text></View>
  </View>;'''
s = header_re.sub(header_new, s, count=1)

# Replace the old abstract home hero with the approved riders identity.
home_hero_re = re.compile(r"        <View style=\{styles\.hero\}>.*?</View>\n        <Ornament/>", re.S)
home_hero = r'''        <ImageBackground source={{uri:PRIMARY_RIDERS}} style={styles.brandHero} imageStyle={styles.brandHeroImage}>
          <View style={styles.brandHeroShade}/>
          <View style={styles.brandHeroTop}>
            <Text style={styles.brandHeroKicker}>EMOTIONAL SAFETY SYSTEM</Text>
            <Text style={styles.brandTechCode}>0101 • TRUTH • SAFETY • CHOICE • 1100</Text>
          </View>
          <View style={styles.brandHeroCopy}>
            <Text style={styles.brandHeroTitle}>STRONGER{`\n`}SAFER TOGETHER</Text>
            <Text style={styles.brandHeroText}>Culturally grounded tools for real safety, real people and stronger communities.</Text>
            <PrimaryButton style={styles.heroButton} onPress={()=>go('assessment')}>START YOUR JOURNEY  →</PrimaryButton>
          </View>
        </ImageBackground>
        <BrandBand/>'''
s, n = home_hero_re.subn(home_hero, s, count=1)
if n == 0:
    raise SystemExit('Brand patch: home hero not found')

# The home screen already has New Assessment below the hero. Rename it as the secondary route.
s = s.replace("＋  New Assessment", "＋  New Assessment / Question", 1)

# Add cultural-tech artwork to the Learning Centre without changing interactive topic logic.
learn_needle = """        <BackTitle title=\"Learning Centre\" onBack={()=>go('home')} />"""
learn_hero = r'''        <BackTitle title="Learning Centre" onBack={()=>go('home')} />
        <ImageBackground source={{uri:KNOWLEDGE_JUSTICE}} style={styles.learningHero} imageStyle={styles.learningHeroImage}>
          <View style={styles.learningHeroShade}/>
          <Text style={styles.learningHeroKicker}>KNOWLEDGE • HUMANITY • JUSTICE • TECHNOLOGY</Text>
          <Text style={styles.learningHeroTitle}>KNOWLEDGE{`\n`}CREATES SAFETY</Text>
          <Text style={styles.learningHeroText}>Learn the patterns, strengthen choice and connect cultural knowledge with practical safety tools.</Text>
        </ImageBackground>
        <BrandBand compact/>'''
if learn_needle in s:
    s = s.replace(learn_needle, learn_hero, 1)

# Add a strong branded About hero while keeping all safety/legal limits below it.
about_needle = """        <BackTitle title=\"About the Emotional Safety System\" onBack={()=>go('home')} />\n        <Ornament/>"""
about_hero = r'''        <BackTitle title="About the Emotional Safety System" onBack={()=>go('home')} />
        <ImageBackground source={{uri:KNOWLEDGE_JUSTICE}} style={styles.aboutBrandHero} imageStyle={styles.learningHeroImage}>
          <View style={styles.learningHeroShade}/>
          <Text style={styles.learningHeroKicker}>LOCAL KNOWLEDGE • GLOBAL POSSIBILITY</Text>
          <Text style={styles.aboutBrandTitle}>PEOPLE • CULTURE • TRUTH{`\n`}SAFETY • FUTURE</Text>
        </ImageBackground>
        <BrandBand compact/>'''
if about_needle in s:
    s = s.replace(about_needle, about_hero, 1)

# Put a branded hierarchy banner on Results so the decision order is always visible.
results_needle = """        <Stepper active={2}/>"""
results_insert = r'''        <Stepper active={2}/>
        <View style={styles.systemOrderBox}>
          <Text style={styles.systemOrderTitle}>HOW THIS RESULT IS BUILT</Text>
          <Text style={styles.systemOrderText}>Structural Safeguarding  →  Coercion / Grooming  →  Six Safety Signals  →  Emotional Reality</Text>
        </View>
        <BrandBand compact/>'''
if results_needle in s:
    s = s.replace(results_needle, results_insert, 1)

# Analysis screen gets a cultural-tech identity without changing the analysis engine.
analysis_needle = """        <Stepper active={1}/>"""
analysis_insert = r'''        <Stepper active={1}/>
        <View style={styles.analysisBrandStrip}><Text style={styles.analysisBrandText}>TRUTH • CONTEXT • SAFETY • CHOICE</Text></View>
        <BrandBand compact/>'''
# only first analysis stepper occurrence after analysis screen; using first global active=1 is safe here
if analysis_needle in s:
    s = s.replace(analysis_needle, analysis_insert, 1)

# Update connected-flow language to match the approved hierarchy.
s = s.replace("['⚙','Emotional Safety Engine','Transparent rules and critical overrides']", "['⚙','Structural Safeguarding','Critical rules and legal/safety checks']")
s = s.replace("['◉','AI + EI Concept Layer','Language understanding + emotional explanation']", "['◉','Coercion / Grooming Layer','Pressure, secrecy, power, dependency and choice']")
s = s.replace("['▥','Six Safety Signals','Choice • Boundaries • Pressure • Power • Dependency • Secrecy']", "['▥','Six Safety Signals','Choice • Boundaries • Pressure • Power • Dependency • Secrecy']")

# Brand style overrides and new components. We append before the final StyleSheet close so
# existing keys remain stable and all safety logic patches continue to work.
style_marker = "\n});"
brand_styles = r''',
  brandCrestShell:{width:45,height:45,borderRadius:23,borderWidth:2,borderColor:'#FFBD32',overflow:'hidden',backgroundColor:'#000',shadowColor:'#FF9D00',shadowOpacity:.45,shadowRadius:8,elevation:5},
  brandCrestImage:{width:'100%',height:'100%'},
  brandBand:{height:26,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginVertical:10,overflow:'hidden'},
  brandBandCompact:{height:17,marginVertical:6},
  brandBandDot:{width:9,height:9,borderRadius:5,borderWidth:.7,borderColor:'#120B05'},
  brandHero:{minHeight:440,borderRadius:22,overflow:'hidden',borderWidth:2,borderColor:'#FFB31A',justifyContent:'space-between',padding:20,shadowColor:'#FF8A00',shadowOpacity:.35,shadowRadius:14,elevation:7},
  brandHeroImage:{borderRadius:20,resizeMode:'cover'},
  brandHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.36)'},
  brandHeroTop:{zIndex:2,alignItems:'center',paddingTop:8},
  brandHeroKicker:{color:'#FFD96B',fontWeight:'900',fontSize:12,letterSpacing:1.7,textAlign:'center'},
  brandTechCode:{color:'#FFF1C9',fontSize:9,letterSpacing:1.15,marginTop:7,textAlign:'center'},
  brandHeroCopy:{zIndex:2,backgroundColor:'rgba(0,0,0,.58)',borderWidth:1,borderColor:'rgba(255,189,50,.65)',borderRadius:18,padding:16},
  brandHeroTitle:{color:'#FFD66B',fontWeight:'900',fontSize:30,lineHeight:31,textAlign:'center',letterSpacing:.5,textShadowColor:'#000',textShadowRadius:6},
  brandHeroText:{color:'#FFF8E7',fontSize:13,lineHeight:19,textAlign:'center',marginTop:8,marginBottom:13},
  heroButton:{borderWidth:1,borderColor:'#FFF0B4',shadowColor:'#FFB000',shadowOpacity:.5,shadowRadius:8,elevation:4},
  learningHero:{height:290,borderRadius:20,overflow:'hidden',borderWidth:1.5,borderColor:'#FFBD32',justifyContent:'flex-end',padding:17,marginBottom:4},
  learningHeroImage:{borderRadius:19,resizeMode:'cover'},
  learningHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.42)'},
  learningHeroKicker:{zIndex:2,color:'#FFD66B',fontSize:9,fontWeight:'900',letterSpacing:1.15,textAlign:'center',marginBottom:6},
  learningHeroTitle:{zIndex:2,color:'#FFD66B',fontSize:26,lineHeight:27,fontWeight:'900',textAlign:'center',textShadowColor:'#000',textShadowRadius:5},
  learningHeroText:{zIndex:2,color:'#FFF8E7',fontSize:12,lineHeight:17,textAlign:'center',marginTop:8},
  aboutBrandHero:{height:245,borderRadius:20,overflow:'hidden',borderWidth:1.5,borderColor:'#FFBD32',justifyContent:'flex-end',padding:17},
  aboutBrandTitle:{zIndex:2,color:'#FFD66B',fontWeight:'900',fontSize:20,lineHeight:23,textAlign:'center',letterSpacing:.5},
  systemOrderBox:{backgroundColor:'#130C07',borderWidth:1,borderColor:'#A86E12',borderRadius:14,padding:12,marginBottom:2},
  systemOrderTitle:{color:'#FFBD32',fontWeight:'900',fontSize:10,letterSpacing:1.1,textAlign:'center'},
  systemOrderText:{color:'#FFF1CC',fontSize:10,lineHeight:15,textAlign:'center',marginTop:5,fontWeight:'700'},
  analysisBrandStrip:{backgroundColor:'#130C07',borderWidth:1,borderColor:'#7F5416',borderRadius:10,padding:8,alignItems:'center'},
  analysisBrandText:{color:'#FFD66B',fontWeight:'900',fontSize:9,letterSpacing:1.15}
'''
idx = s.rfind(style_marker)
if idx == -1:
    raise SystemExit('Brand patch: StyleSheet close not found')
s = s[:idx] + brand_styles + s[idx:]

# Existing style overrides for a premium black/gold interface.
replacements = {
    "header:{height:63,paddingHorizontal:15,borderBottomWidth:1,borderBottomColor:'#2A4452',backgroundColor:'#081720'": "header:{height:68,paddingHorizontal:14,borderBottomWidth:1,borderBottomColor:'#7B571A',backgroundColor:'#03080B'",
    "headerTitle:{color:C.text,fontWeight:'900',fontSize:13,letterSpacing:.6}": "headerTitle:{color:'#FFD66B',fontWeight:'900',fontSize:13,letterSpacing:.75}",
    "scroll:{padding:13,paddingBottom:100}": "scroll:{padding:13,paddingBottom:100,backgroundColor:'#020609'}",
    "card:{backgroundColor:C.panel,borderRadius:17,borderWidth:1,borderColor:C.line": "card:{backgroundColor:'#08141C',borderRadius:17,borderWidth:1,borderColor:'#5C4218'",
    "menuRow:{minHeight:73,backgroundColor:'#0E2533',borderWidth:1,borderColor:C.line": "menuRow:{minHeight:73,backgroundColor:'#08141C',borderWidth:1,borderColor:'#5C4218'",
    "screenTitle:{color:C.text,fontSize:24,fontWeight:'900',flex:1}": "screenTitle:{color:'#FFD66B',fontSize:24,fontWeight:'900',flex:1}",
    "stepCircleOn:{backgroundColor:C.blue}": "stepCircleOn:{backgroundColor:'#D99A18',borderWidth:1,borderColor:'#FFE08A'}",
    "nav:{": "nav:{backgroundColor:'#020609',borderTopColor:'#6B4A17',"
}
for old,new in replacements.items():
    if old in s:
        s = s.replace(old,new,1)

required = [
    "PRIMARY_RIDERS", "KNOWLEDGE_JUSTICE", "STRONGER", "KNOWLEDGE", "HOW THIS RESULT IS BUILT",
    "function BrandBand", "brandHero:", "learningHero:", "systemOrderBox:"
]
missing=[x for x in required if x not in s]
if missing:
    raise SystemExit('Brand redesign patch failed; missing: '+', '.join(missing))

p.write_text(s)
print('Brand redesign applied: riders identity, cultural-tech palette, knowledge art and results hierarchy.')
