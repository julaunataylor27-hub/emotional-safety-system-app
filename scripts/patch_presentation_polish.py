"""Final, idempotent presentation layer. Apply after all functional patches."""
from pathlib import Path
import re
p=Path('App.js');s=p.read_text()
if '// PRESENTATION_POLISH_V170' in s:
    print('Presentation polish already connected.');raise SystemExit(0)
def replace(old,new,count=1):
    global s
    if old not in s: raise SystemExit('Presentation patch anchor missing: '+old[:100])
    s=s.replace(old,new,count)
def function(name,new):
    global s
    pattern=r'function '+name+r'\([^\n]*\).*?\n}\n'
    s,n=re.subn(pattern,lambda _:new+'\n',s,count=1,flags=re.S)
    if n!=1:raise SystemExit('Missing helper '+name)
imports="""// PRESENTATION_POLISH_V170
import {PreferencesProvider,useAppPreferences,AppText as Text,AppInput as TextInput} from './src/AppPreferences';
import {P,presentationStyles,cleanLabel} from './src/PresentationTheme';
import {AppHeader,AppBottomNav,ScenicBannerV2,MeaningIcon,TranslationNotice} from './src/PresentationChrome';
import PreferencesScreen,{InternationalSupportNotice} from './src/PreferencesScreen';
import PresentationOverview from './src/PresentationOverview';
import GoldenTreeIcon from './src/GoldenTreeIcons';
import useGraphicsMotion from './src/useGraphicsMotion';
import {SafeAreaProvider} from 'react-native-safe-area-context';
"""
s=re.sub(r'(import\s*\{[^}]*?)\bTextInput\s*,?',lambda m:m[1],s,count=1,flags=re.S)
# Only remove the native Text token in its import, not rendered text.
s=re.sub(r'(import\s*\{[^}]*?)\bText\s*,?',lambda m:m[1],s,count=1,flags=re.S)
s=imports+s
s=re.sub(r'const C = \{.*?\n};',"const C = {bg:P.bg,panel:P.panel,panel2:P.panel2,line:P.line,text:P.text,muted:P.muted,cream:P.gold,ochre:P.gold,rust:'#7D3534',gold:P.gold,green:P.green,yellow:P.amber,red:P.red,blue:P.gold,purple:'#C1B9E4',cyan:P.gold,white:P.text};",s,count=1,flags=re.S)
function('BrandBand','function BrandBand(){ return null; }')
function('GoldDotTrail','function GoldDotTrail(){ return null; }')
function('PremiumTreeLogo',"function PremiumTreeLogo({size=54}){return <Image source={require('./assets/graphics/golden-tree-emblem-v1.png')} style={{width:size,height:size}} resizeMode=\"contain\" accessible={false}/>;}")
function('ScenicBanner','function ScenicBanner(props){return <ScenicBannerV2 {...props}/>;}')
# Keep the data and callbacks of existing controls; improve their presentation.
replace('<Text style={styles.menuIconText}>{icon}</Text>','<MeaningIcon title={title}/>')
replace('<Text style={styles.journeyTileIconText}>{icon}</Text>','<MeaningIcon title={title}/>')
replace('<Text style={styles.journeyTileTitle}>{title}</Text>','<Text style={styles.journeyTileTitle}>{cleanLabel(title)}</Text>')
replace('<Text style={styles.techIconText}>{icon}</Text>','<MeaningIcon title={title}/>')
replace('<Text style={[styles.techStatus,{color:accent}]}>{status}</Text>','<Text style={[styles.techStatus,{color:P.gold}]}>{status===\'WORKING\'?\'Available\':cleanLabel(status)}</Text>')
replace('<Text style={styles.techFeatureIconText}>{icon}</Text>','<MeaningIcon title={title}/>')
replace('<Text style={styles.primaryText,', '<Text style={styles.primaryText,') if False else None
function('PrimaryButton',"""function PrimaryButton({children,onPress,color=C.gold,darkText=true,style}){
  const destructive=color==='#8B2215';
  return <Pressable accessibilityRole="button" onPress={onPress} style={({pressed})=>[styles.primary,{backgroundColor:destructive?'#7D3534':P.gold},style,pressed&&{opacity:.8}]}>
    <Text style={[styles.primaryText,{color:destructive?P.text:P.bg}]}>{cleanLabel(children)}</Text>
  </Pressable>;
}""")
function('HumanityEquation',"""function HumanityEquation(){
 const rows=[['Knowledge','Understanding'],['Love','Kindness','Patience'],['Growth','Humanity','Life']];
 return <View style={{gap:18,paddingVertical:12}}>{rows.map((row,index)=><View key={index} style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:16}}>{row.map(name=><View key={name} style={{alignItems:'center',gap:7,minWidth:90}}><GoldenTreeIcon name={name} size={30}/><Text style={{fontSize:14,color:P.text}}>{name}</Text></View>)}</View>)}<Text style={{fontSize:13,lineHeight:21,color:P.muted,textAlign:'center'}}>A reflection framework, not a numerical score.</Text></View>;
}""")
replace('export default function App(){',"function CoreApp(){\n  const {preferences}=useAppPreferences();\n  const appMotion=useGraphicsMotion();\n  const [learningQuery,setLearningQuery]=useState('');")
replace("  const go=s=>setScreen(s);","  const go=s=>setScreen(s);\n  useEffect(()=>{if(preferences.country!=='AU')setJurisdiction('Unsure');},[preferences.country]);")
replace('const loop=Animated.loop(Animated.timing(spin,{toValue:1,duration:1700,useNativeDriver:true}));','const loop=appMotion.reduceMotion?{start(){},stop(){}}:Animated.loop(Animated.timing(spin,{toValue:1,duration:1700,useNativeDriver:true}));')
a=s.index('  const Header=()=>');b=s.index("  if(screen==='home')",a)
s=s[:a]+"  const Header=()=> <AppHeader onNavigate={go}/>;\n  const BottomNav=()=> <AppBottomNav screen={screen} onNavigate={go}/>;\n\n"+s[b:]
replace('<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">','<ScrollView key={screen} testID="app-page-scroll" contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">\n      <TranslationNotice/>\n      {screen===\'settings\'&&<PreferencesScreen onBack={()=>go(\'more\')}/>}\n      {screen===\'vision\'&&<PresentationOverview onNavigate={go}/>}')
replace("{journeyScreens.includes(screen)&&<Card>\n        <Text style={styles.cardTitle}>My Journey Memory</Text>","{journeyScreens.includes(screen)&&<View style={styles.memoryNotice}>")
replace("      </Card>}\n      {screen==='summary'", "      </View>}\n      {screen==='summary'")
replace("{screen==='support'&&<>","{screen==='support'&&preferences.country!=='AU'&&<InternationalSupportNotice onPreferences={()=>go('settings')}/>}\n      {screen==='support'&&preferences.country==='AU'&&<>")
replace('<SmallPill active={jurisdiction===\'Western Australia\'} onPress={()=>setJurisdiction(\'Western Australia\')}>Western Australia</SmallPill>',"<View style={styles.wrap}>{['Western Australia','Elsewhere','Unsure'].map(place=><SmallPill key={place} active={jurisdiction===place} onPress={()=>setJurisdiction(place)}>{place}</SmallPill>)}</View>")
replace("Your journey answers are saved on this device.","Saved on this device.")
replace('because a person under 16 is involved.','because a person under 18 is involved.')
replace('A safe, culturally respectful prototype designed to help people understand situations, recognise safety signals and find support.','An early reflection and learning prototype that helps people explore reported experiences, consider their choices and find relevant support.')
replace("else if(t==='Evidence & Research')go('learn')","else if(t==='Evidence & Research')go('evidence')")
replace('title="Complete Flow — All Connected"','title="How the system works"')
replace("'Comparing with evidence'","'Separating reports from interpretations'")
replace('source={humanityHero} resizeMode="cover"','source={humanityHero} resizeMode="cover"') if False else None
# New art replaces only visible surfaces; the original locked assets remain intact.
replace("import KNOWLEDGE_JUSTICE from './assets/graphics/knowledge-justice-v1.webp';","import KNOWLEDGE_JUSTICE from './assets/graphics/presentation-path-v2.webp';")
replace("import PRIMARY_RIDERS from './assets/graphics/primary-riders-v1.webp';","import PRIMARY_RIDERS from './assets/graphics/presentation-tree-v2.webp';")
replace('<Text style={styles.valueIcon}>{ic}</Text>','<GoldenTreeIcon name={v} size={32}/>')
replace('<Text style={styles.projectIcon}>{ic}</Text>','<MeaningIcon title={v} size={30}/>')
replace('<Text style={styles.techHeroIcon}>✦</Text>','<GoldenTreeIcon name="Understanding" size={40}/>')
replace('<Text style={styles.flowIcon}>{icon}</Text>','<MeaningIcon title={t} size={30}/>')
replace('<Text style={styles.aboutIcon}>{icon}</Text>','<MeaningIcon title={t} size={30}/>')
replace('<Text style={styles.brain}>◉</Text>','<GoldenTreeIcon name="Understanding" size={50}/>')
# Learning search is real, local and deliberately does not search private writing.
replace('<TextInput editable={false} placeholder="Search topics..." placeholderTextColor="#6D8290" style={styles.searchBox}/>',"<TextInput accessibilityLabel=\"Search learning topics\" value={learningQuery} onChangeText={setLearningQuery} placeholder=\"Search learning topics…\" placeholderTextColor={P.muted} style={styles.searchBox}/>\n        {!!learningQuery.trim()&&!LEARNING_TOPICS.some(([,title,sub])=>(title+' '+sub).toLowerCase().includes(learningQuery.trim().toLowerCase()))&&<Text style={styles.body}>No matching topics. Try another word.</Text>}")
pattern=r"\{(\[\s*\['✋','Understanding Choice & Consent'.*?\])\.map\(\(\[icon,title,sub\]\)"
m=re.search(pattern,s,re.S)
if not m:raise SystemExit('Learning topics anchor missing')
topics=m[1]
s=s[:m.start()]+'{LEARNING_TOPICS.filter(([,title,sub])=>(title+\' \'+sub).toLowerCase().includes(learningQuery.trim().toLowerCase())).map(([icon,title,sub])'+s[m.end():]
s=s.replace('const signalNames = {','const LEARNING_TOPICS='+topics+';\n\nconst signalNames = {',1)
replace("      {screen==='more'&&<>\n        <MenuRow icon=\"◉\" title=\"Yagan Life Journey\" subtitle=\"Explore records, cultural context and possible meanings\" onPress={()=>go('lifeJourney')} accent={C.gold}/>\n        <BackTitle title=\"More\" onBack={()=>go('home')} />", "      {screen==='more'&&<>\n        <BackTitle title=\"More\" onBack={()=>go('home')} />\n        <MenuRow title=\"Our Purpose & Vision\" subtitle=\"An introduction for presentations and new audiences\" onPress={()=>go('vision')}/>\n        <MenuRow title=\"Language & Reading Preferences\" subtitle=\"Language, country, larger text and reduced motion\" onPress={()=>go('settings')}/>\n        <MenuRow title=\"Yagan Life Journey\" subtitle=\"Explore records, cultural context and possible meanings\" onPress={()=>go('lifeJourney')} accent={C.gold}/>")
s+="""\nObject.assign(styles,presentationStyles(styles));
Object.assign(styles,{memoryNotice:{borderLeftWidth:2,borderLeftColor:P.line,paddingLeft:12,marginBottom:18},searchBox:{backgroundColor:P.panel2,color:P.text,borderWidth:1,borderColor:P.line,borderRadius:14,minHeight:54,padding:14,fontSize:16,marginBottom:18},valueGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},valueCard:{width:'48%',minHeight:160,padding:16,borderWidth:1,borderColor:P.line,borderRadius:18,backgroundColor:P.panel,alignItems:'center'},valueMeaning:{fontSize:13,lineHeight:21,color:P.muted,textAlign:'center',marginTop:8},techTitleRow:{flexDirection:'row',flexWrap:'wrap',gap:8},flowSub:{fontSize:14,lineHeight:22,color:P.muted},humanityHeader:{backgroundColor:P.bg}});
export default function App(){return <SafeAreaProvider><PreferencesProvider><CoreApp/></PreferencesProvider></SafeAreaProvider>;}
"""
p.write_text(s)
print('Presentation design, real learning search, overview and preference routes connected.')
