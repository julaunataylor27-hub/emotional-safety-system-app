import {AppText as Text,useAppPreferences} from './AppPreferences';
import {P} from './PresentationTheme';
import {SCENES} from './theme/AustralianHumanityTheme';
import React, {useState} from 'react';
import {View, ScrollView, Pressable, Image, StyleSheet, Platform, useWindowDimensions} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useFonts} from 'expo-font';
import {SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics} from 'react-native-safe-area-context';
import GoldenTreeIcon from './GoldenTreeIcons';
import NightForestScene from './NightForestScene';
import ValueMeaningSheet from './ValueMeaningSheet';
const {VALUE_MEANINGS}=require('./valueMeanings.cjs');

const COLORS={background:P.bg,gold:P.gold,ivory:P.text,muted:P.muted,rule:P.line};
const NAV=[['home','Home'],['journey','Journey'],['learn','Learn'],['evidence','Evidence'],['support','Services'],['more','More']];
const NAV_ICONS={home:'Home',journey:'Journey',learn:'Knowledge',evidence:'Knowledge',support:'Humanity',more:'More'};
const FONTS={ESSHeading:require('../assets/fonts/Marcellus-Regular.ttf'),ESSBody:require('../assets/fonts/DM-Sans.ttf')};
// User-approved realistic Australian Humanity scenery (24 October 2026). Keep labels and controls native.
const HOME_SCENE=SCENES.home;
const CULTURE_SCENE=SCENES.culture;
const FEATURES=[
 {route:'learn',icon:'Knowledge',name:'Knowledge',description:'Culture, history, laws and real information.',id:'home-open-knowledge',image:SCENES.knowledge},
 {route:'safeCuriosity',icon:'Love',name:'Emotional Safety',description:'Feelings, boundaries and practical safety tools.',id:'home-safe-curiosity',image:SCENES.emotionalSafety},
 {route:'evidence',icon:'Knowledge',name:'Evidence & Truth',description:'Research, records and factual information.',id:'home-evidence-truth',image:SCENES.evidence},
 {route:'support',icon:'Humanity',name:'Support & Services',description:'Find help, legal rights and community services.',id:'home-find-support',image:SCENES.support}
];
function HomeContent({onNavigate,onValuePress}){
 const [selectedValue,setSelectedValue]=useState(null);
 const {preferences,t}=useAppPreferences();
 const insets=useSafeAreaInsets();
 const {width,fontScale}=useWindowDimensions();
 const [fontsLoaded]=useFonts(FONTS);
 const contentWidth=Math.min(width-insets.left-insets.right,640);
 const largeText=fontScale>1.25||preferences.readingSize==='large'||preferences.language!=='en'||contentWidth<360;
 const columns=largeText?2:4;
 const singleColumnCards=contentWidth<355||fontScale>1.2||preferences.readingSize==='large'||preferences.language!=='en';
 const heading={fontFamily:fontsLoaded?'ESSHeading':Platform.select({ios:'Georgia',android:'serif',default:'serif'})};
 const body={fontFamily:fontsLoaded?'ESSBody':undefined};
 const navigate=route=>onNavigate(route);
 return <><View testID="golden-tree-home-screen" accessibilityElementsHidden={!!selectedValue}
   importantForAccessibility={selectedValue?'no-hide-descendants':'auto'}
   style={[s.screen,{paddingTop:insets.top,paddingLeft:insets.left,paddingRight:insets.right}]}>
   <StatusBar style="light"/>
   <ScrollView testID="golden-tree-home-scroll" style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

    <View style={[s.hero,{height:Math.max(490,contentWidth*1.35)*(largeText?1.25:1)}]}>
      <Image testID="golden-tree-home-artwork" accessibilityLabel="Illustrated Australian river landscape under stars at dusk" source={HOME_SCENE} resizeMode="cover" style={s.heroPhoto}/>
      <View pointerEvents="none" style={s.heroWash}/>
      <View style={s.heroText} pointerEvents="box-none">
        <View style={s.topRow}>
          <View style={s.brandCluster}>
            <View style={s.brandEmblem}><GoldenTreeIcon name="Globe" size={30} color={P.gold}/></View>
            <View style={s.brandCopy}>
              <Text style={[s.brandName,heading]}>EMOTIONAL{'\n'}SAFETY SYSTEM</Text>
              <Text style={[s.brandTag,body]}>KNOWLEDGE · CULTURE{'\n'}PEOPLE · CHOICE</Text>
            </View>
          </View>
          <Pressable testID="home-open-menu" accessibilityRole="button" accessibilityLabel="Open menu" onPress={()=>navigate('more')} style={s.profile}><GoldenTreeIcon name="Humanity" size={25} color={P.gold}/></Pressable>
        </View>
        <View style={{flex:1}}/>
        <Text accessibilityRole="header" style={[s.heroTitle,heading]}>Knowledge{'\n'}Creates Choice</Text>
        <Text style={[s.subtitle,body]}>Culture, evidence and emotional safety to support stronger individuals, families and communities.</Text>
        <Pressable testID="home-explore-situation" accessibilityRole="button" accessibilityLabel="Explore the system with a new assessment" onPress={()=>navigate('assessment')} style={({pressed})=>[s.exploreButton,pressed&&s.pressed]}>
          <View><Text style={[s.exploreLabel,body]}>EXPLORE THE SYSTEM</Text><Text style={{fontSize:10,color:"#392311",textAlign:"center",marginTop:1}}>Explore a situation</Text></View><GoldenTreeIcon name="Arrow" size={21} color="#180F09"/>
        </Pressable>
      </View>
    </View>
    <Pressable testID="home-presentation-overview" accessibilityRole="button"
      accessibilityLabel="Open Australian Humanity prototype overview"
      onPress={()=>navigate('presentationWalkthrough')}
      style={({pressed})=>[s.presentationTile,pressed&&s.pressed]}>
      <View style={s.presentationMark}><GoldenTreeIcon name="Globe" size={25} color={P.gold}/></View>
      <View style={s.presentationCopy}>
        <Text style={[s.presentationEyebrow,body]}>PRESENTATION · COMPLETE SYSTEM OVERVIEW</Text>
        <Text style={[s.presentationHeading,heading]}>Discover Australian Humanity</Text>
        <Text style={[s.presentationDetails,body]}>Purpose · Process · Working demonstration · Future</Text>
      </View>
      <GoldenTreeIcon name="Arrow" size={22} color={P.gold}/>
    </Pressable>
    <Pressable testID="home-connection-adventure" accessibilityRole="button"
      accessibilityLabel="Follow the Connection Trail adventure"
      onPress={()=>navigate('connectionTrail')}
      style={({pressed})=>[s.adventureLink,pressed&&s.pressed]}>
      <Image source={CULTURE_SCENE} accessible={false} resizeMode="cover" style={s.adventureArt}/>
      <View pointerEvents="none" style={s.adventureShade}/>
      <View style={s.adventureCopy}>
        <Text style={s.adventureKicker}>YOUR NEXT ADVENTURE · 6 OPEN CLUES</Text>
        <Text style={[s.adventureHeading,heading]}>Follow the Connection Trail</Text>
        <Text style={[s.adventureSub,body]}>Start with a question. Follow evidence, ideas and values. Discover your next connection.</Text>
        <View style={s.adventureArrow}><GoldenTreeIcon name="Compass" size={23} color={P.gold}/><Text style={s.adventureAction}>EXPLORE THE TRAIL  →</Text></View>
      </View>
    </Pressable>
    <Pressable testID="home-two-flames" accessibilityRole="button"
      accessibilityLabel="Two Flames: healing without control"
      onPress={()=>navigate('twoFlames')} style={({pressed})=>[s.moreLink,pressed&&{opacity:0.78}]}>
      <View style={{flex:1}}>
        <Text style={[s.moreLabel,body]}>🔥  Two Flames — Healing Without Control</Text>
        <Text style={[s.moreLabel,body,{fontSize:13,color:P.muted,marginTop:5}]}>Grow your spark. Share light. Keep your freedom.</Text>
      </View>
      <GoldenTreeIcon name="Arrow" size={20} color={P.gold}/>
    </Pressable>
    <View style={s.featureStack}>
      {FEATURES.map(item=><Pressable key={item.route} testID={item.id} accessibilityRole="button" accessibilityLabel={item.name} onPress={()=>navigate(item.route)}
        style={({pressed})=>[s.featureCard,singleColumnCards&&s.featureCardWide,pressed&&s.pressed]}>
        <Image accessible={false} source={item.image} resizeMode="cover" style={s.featurePhoto}/>
        <View pointerEvents="none" style={s.featureWash}/>
        <View style={s.featureContent}>
          <View style={s.featureIcon}><GoldenTreeIcon name={item.icon} size={25} color={P.gold}/></View>
          <Text style={[s.featureTitle,heading]}>{item.name}</Text>
          <Text style={[s.featureSub,body]}>{item.description}</Text>
          <View style={s.featureArrow}><GoldenTreeIcon name="Arrow" size={17} color={P.text}/></View>
        </View>
      </Pressable>)}
    </View>
    <Pressable testID="home-more" accessibilityRole="button" accessibilityLabel="More tools and settings" onPress={()=>navigate('more')}
      style={({pressed})=>[s.moreLink,pressed&&s.pressed]}>
      <Text style={[s.moreLabel,body]}>More tools, laws and cultural knowledge</Text><GoldenTreeIcon name="Arrow" size={20} color={P.gold}/>
    </Pressable>
    <View style={s.extras}>
      <Pressable testID="home-start-journey" accessibilityRole="button" accessibilityLabel="Start my journey"
        onPress={()=>navigate('journey')} style={({pressed})=>[s.primary,pressed&&s.pressed]}>
        <GoldenTreeIcon name="Journey" size={23} color={P.bg}/><Text style={[s.primaryLabel,body]}>{t('start')}</Text><GoldenTreeIcon name="Arrow" color={P.bg} size={23}/>
      </Pressable>
      <Text style={[s.sectionHeading,heading]}>Your knowledge grows here</Text>
      <Text style={[s.sectionSub,body]}>Explore the eight values. Each opens an explanation, a question and its public sources.</Text>
      <View testID="home-values-grid" style={s.values}>
        {VALUE_MEANINGS.map(value=><Pressable key={value.name} testID={'home-value-'+value.name.toLowerCase()}
          accessibilityRole="button" accessibilityLabel={'Explore '+value.name}
          accessibilityHint="Read the meaning, a Noongar cultural reflection and a question for you"
          onPress={()=>setSelectedValue(value)}
          style={({pressed})=>[s.value,{width:(100/columns)+'%'},pressed&&s.pressed]}>
          <View style={s.valueCircle}><GoldenTreeIcon name={value.name} size={33}/>
            <View testID={'home-value-info-'+value.name.toLowerCase()} pointerEvents="none" accessible={false} style={s.infoBadge}><Text style={s.infoText}>i</Text></View>
          </View>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} style={[s.valueLabel,body,largeText&&s.largeValueLabel]}>{t(value.name.toLowerCase())}</Text>
        </Pressable>)}
      </View>
      {[
        ['vision','Globe',t('vision'),'home-vision'],
        ['lifeJourney','Life',t('lifeJourney'),'home-life-journey'],
        ['settings','Settings',t('settings'),'home-settings']
      ].map(([route,icon,label,id])=><Pressable key={route} testID={id} accessibilityRole="button" accessibilityLabel={label}
        onPress={()=>navigate(route)} style={({pressed})=>[s.extraLink,pressed&&s.pressed]}>
        <GoldenTreeIcon name={icon} size={23}/><Text style={s.extraText}>{label}</Text><GoldenTreeIcon name="Chevron" size={17}/>
      </Pressable>)}
      <Text style={[s.privacy,body]}>{t('privacy')}</Text>
      {preferences.language!=='en'&&<Text style={[s.privacy,body]}>{t('scope')}</Text>}
    </View>
   </ScrollView>
   <View style={[s.nav,{paddingBottom:Math.max(8,insets.bottom)}]}>
    <View style={s.navContent}>{NAV.map(([route,label])=><Pressable key={route} testID={'home-nav-'+route} accessibilityRole="tab"
      accessibilityLabel={label} accessibilityState={{selected:route==='home'}} onPress={()=>navigate(route)}
      style={({pressed})=>[s.navItem,pressed&&s.pressed]}>
     <GoldenTreeIcon name={NAV_ICONS[route]} size={25} color={route==='home'?P.gold:P.muted} filled={route==='home'}/>
     <Text style={[s.navLabel,body,{color:route==='home'?P.gold:P.muted}]}>{route==='evidence'?'Evidence':t(route)}</Text>
     {route==='home'&&<View style={s.activeTab}/>}
    </Pressable>)}</View>
    <Pressable testID="home-support-now" accessibilityRole="button" accessibilityLabel="I need support now" onPress={()=>navigate('support')} style={({pressed})=>[s.supportNow,pressed&&s.pressed]}>
      <Text style={[s.supportNowText,body]}>⚠  I NEED SUPPORT NOW</Text>
    </Pressable>
   </View>
  </View>
  {selectedValue&&<ValueMeaningSheet key={selectedValue.name} value={selectedValue} heading={heading} body={body} bottomInset={insets.bottom}
    onClose={()=>setSelectedValue(null)} onReflect={value=>{setSelectedValue(null);onValuePress(value);}}/>}
 </>;
}
export default function GoldenTreeHome(props){
 return <SafeAreaProvider initialMetrics={initialWindowMetrics}><HomeContent {...props}/></SafeAreaProvider>;
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:COLORS.background},
 scroll:{flex:1},content:{width:'100%',maxWidth:640,alignSelf:'center',paddingBottom:26},
 hero:{overflow:'hidden',width:'100%',backgroundColor:'#081923'},
 heroText:{position:'absolute',top:0,left:0,right:0,bottom:0,paddingHorizontal:22,paddingTop:13,paddingBottom:17},
 topRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:5},
 brandEmblem:{width:43,height:43,borderWidth:1,borderColor:P.gold,borderRadius:22,backgroundColor:'#092924',alignItems:'center',justifyContent:'center'},
 profile:{width:44,minHeight:44,borderRadius:23,borderWidth:1,borderColor:P.gold,backgroundColor:'#0A2B27',alignItems:'center',justifyContent:'center'},
 heroTitle:{color:'#FFF2D3',fontSize:37,lineHeight:42,textShadowColor:'#031319',textShadowRadius:8},
 subtitle:{color:P.text,fontSize:15,lineHeight:22,marginTop:5,textShadowColor:'#041B21',textShadowRadius:6},
 quoteSpacer:{flex:1},
 heroQuote:{fontSize:17,lineHeight:24,color:'#FFE39D',textAlign:'right',alignSelf:'flex-end',textShadowColor:'#04191A',textShadowRadius:7},
 featureStack:{marginTop:-5,paddingHorizontal:15,gap:10},
 featureCard:{minHeight:84,backgroundColor:'#103B32',borderColor:'#857443',borderWidth:1.2,borderRadius:20,
  flexDirection:'row',alignItems:'center',paddingVertical:13,paddingHorizontal:13,gap:13},
 alternate:{backgroundColor:'#0A3134'},
 featureIcon:{width:51,height:51,borderRadius:27,borderWidth:1.3,borderColor:P.gold,alignItems:'center',justifyContent:'center'},
 featureCopy:{flex:1,gap:4},featureTitle:{fontSize:20,lineHeight:27,color:P.text},
 featureSub:{fontSize:13,lineHeight:19,color:P.muted},
 extras:{paddingHorizontal:18,marginTop:19},
 primary:{minHeight:57,borderRadius:18,backgroundColor:P.gold,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,padding:12},
 primaryLabel:{color:P.bg,fontSize:16,fontWeight:'700',flex:1,textAlign:'center'},
 sectionHeading:{fontSize:24,lineHeight:31,color:P.gold,textAlign:'center',marginTop:29},
 sectionSub:{color:P.muted,fontSize:14,lineHeight:23,textAlign:'center',marginTop:7,marginBottom:18},
 values:{flexDirection:'row',flexWrap:'wrap'},
 value:{alignItems:'center',paddingHorizontal:2,paddingTop:3,paddingBottom:12,minHeight:93},
 valueCircle:{width:62,height:62,borderRadius:32,borderWidth:1.2,borderColor:P.gold,backgroundColor:P.panel2,alignItems:'center',justifyContent:'center'},
 infoBadge:{position:'absolute',top:-3,right:-3,width:19,height:19,borderRadius:10,backgroundColor:P.gold,borderColor:P.bg,borderWidth:2,alignItems:'center',justifyContent:'center'},
 infoText:{fontSize:12,color:P.bg,fontWeight:'700',lineHeight:14},
 valueLabel:{color:P.text,fontSize:13,lineHeight:19,marginTop:6,textAlign:'center'},largeValueLabel:{fontSize:14,lineHeight:21},
 extraLink:{minHeight:60,flexDirection:'row',alignItems:'center',gap:13,borderTopWidth:1,borderColor:P.line,paddingHorizontal:9},
 extraText:{flex:1,color:P.text,fontSize:15,lineHeight:22},
 privacy:{fontSize:13,lineHeight:21,color:P.muted,textAlign:'center',marginTop:18},
 nav:{backgroundColor:'#041D1D',borderTopWidth:1,borderTopColor:P.line,paddingTop:7},
 navContent:{width:'100%',maxWidth:640,alignSelf:'center',flexDirection:'row'},
 navItem:{flex:1,minHeight:49,alignItems:'center',justifyContent:'center',gap:4,paddingBottom:4},
 navLabel:{fontSize:12,lineHeight:18,textAlign:'center'},
 activeTab:{position:'absolute',bottom:0,width:28,height:2,backgroundColor:P.gold,borderRadius:2},
 pressed:{opacity:.75}
});

// Presentation access stays visible below the hero and above other optional trails.
Object.assign(s,{
 presentationTile:{marginHorizontal:12,marginTop:14,minHeight:110,padding:15,backgroundColor:P.panel,
  borderWidth:1.2,borderColor:P.gold,borderRadius:18,flexDirection:'row',alignItems:'center',gap:12},
 presentationMark:{width:47,height:47,borderRadius:24,borderWidth:1,borderColor:P.gold,
  backgroundColor:P.panel2,alignItems:'center',justifyContent:'center'},
 presentationCopy:{flex:1,gap:4},
 presentationEyebrow:{fontSize:11,lineHeight:18,color:P.gold,fontWeight:'800',letterSpacing:.6},
 presentationHeading:{fontSize:19,lineHeight:26,color:P.text},
 presentationDetails:{fontSize:12,lineHeight:18,color:P.muted}
});

/* Moonlit Riders cinematic design: native photographs, accessible text, working routes. */
Object.assign(s,{
 screen:{flex:1,backgroundColor:P.bg},
 content:{width:'100%',maxWidth:640,alignSelf:'center',paddingBottom:28,backgroundColor:P.bg},
 hero:{width:'100%',overflow:'hidden',backgroundColor:'#091A29',borderBottomColor:P.gold,borderBottomWidth:1},
 heroPhoto:{position:'absolute',left:0,top:0,width:'100%',height:'100%'},
 heroWash:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(2,8,12,0.29)'},
 heroText:{position:'absolute',top:0,left:0,right:0,bottom:0,padding:17,paddingBottom:24},
 topRow:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',gap:7},
 brandCluster:{flex:1,flexDirection:'row',alignItems:'center',gap:10},
 brandEmblem:{width:50,height:50,borderRadius:25,borderWidth:2,borderColor:P.gold,backgroundColor:'rgba(4,14,20,0.8)',alignItems:'center',justifyContent:'center'},
 brandCopy:{flex:1},brandName:{fontSize:19,lineHeight:22,letterSpacing:1.2,color:P.text,textShadowColor:'#000',textShadowRadius:9},
 brandTag:{fontSize:8.5,lineHeight:13,letterSpacing:.6,color:P.gold,textShadowColor:'#000',textShadowRadius:8},
 profile:{width:42,height:42,borderRadius:23,borderColor:P.gold,borderWidth:1,backgroundColor:'rgba(5,13,18,.7)',alignItems:'center',justifyContent:'center'},
 heroTitle:{fontSize:39,lineHeight:43,color:P.text,textShadowColor:'#000',textShadowRadius:11},
 subtitle:{fontSize:15,lineHeight:23,color:P.text,marginTop:10,marginBottom:19,textShadowColor:'#000',textShadowRadius:7,maxWidth:330},
 exploreButton:{minHeight:49,backgroundColor:P.gold,borderRadius:12,flexDirection:'row',gap:8,alignItems:'center',alignSelf:'flex-start',paddingHorizontal:17},
 exploreLabel:{fontWeight:'800',fontSize:13,letterSpacing:1.2,color:'#221207'},
 adventureLink:{minHeight:215,marginHorizontal:12,marginTop:14,overflow:'hidden',borderRadius:20,borderWidth:1.2,borderColor:P.gold,backgroundColor:P.panel,justifyContent:'flex-end'},
 adventureArt:{position:'absolute',top:0,bottom:0,left:0,right:0,width:'100%',height:'100%'},
 adventureShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,18,16,0.58)'},
 adventureCopy:{padding:17,gap:7},
 adventureKicker:{color:P.gold,fontSize:11,fontWeight:'800',letterSpacing:1},
 adventureHeading:{color:P.text,fontSize:27,lineHeight:35},
 adventureSub:{color:'#FAE6C7',fontSize:14,lineHeight:22},
 adventureArrow:{flexDirection:'row',alignItems:'center',gap:9,marginTop:5},
 adventureAction:{color:P.gold,fontSize:12,fontWeight:'800',letterSpacing:0.7},
 featureStack:{paddingHorizontal:11,marginTop:13,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:9},
 featureCard:{width:'48.6%',minHeight:224,overflow:'hidden',borderRadius:16,borderColor:P.gold,borderWidth:1.2,backgroundColor:P.panel,justifyContent:'flex-end'},
 featureCardWide:{width:'100%',minHeight:204},
 featurePhoto:{position:'absolute',left:0,top:0,width:'100%',height:'100%'},
 featureWash:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.22)'},
 featureContent:{padding:11,paddingRight:24,paddingBottom:15,minHeight:150,backgroundColor:'rgba(0,0,0,0.65)',justifyContent:'flex-end'},
 featureIcon:{width:42,height:42,borderRadius:22,borderWidth:1,borderColor:P.gold,backgroundColor:'rgba(0,0,0,.6)',alignItems:'center',justifyContent:'center',marginBottom:8},
 featureTitle:{fontSize:16.5,lineHeight:22,color:P.text},
 featureSub:{fontSize:12,lineHeight:18,color:'#F1E6DA',marginTop:5,paddingRight:3,flexShrink:1},
 featureArrow:{position:'absolute',right:6,bottom:9},
 moreLink:{minHeight:51,marginHorizontal:15,paddingHorizontal:7,borderBottomColor:'#5D4730',borderBottomWidth:1,flexDirection:'row',alignItems:'center',gap:7},
 moreLabel:{color:P.gold,flex:1,fontSize:13,lineHeight:19,flexShrink:1},
 extras:{paddingHorizontal:16,marginTop:17},
 primary:{minHeight:55,borderRadius:14,backgroundColor:P.gold,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,padding:12},
 sectionHeading:{fontSize:24,lineHeight:32,color:P.gold,textAlign:'center',marginTop:25},
 sectionSub:{color:P.muted,fontSize:14,lineHeight:22,textAlign:'center',marginTop:7,marginBottom:18},
 valueCircle:{width:62,height:62,borderRadius:32,borderWidth:1.2,borderColor:P.gold,backgroundColor:P.panel2,alignItems:'center',justifyContent:'center'},
 valueLabel:{color:P.text,fontSize:13,lineHeight:19,marginTop:6,textAlign:'center',alignSelf:'stretch',width:'100%',flexShrink:1},
 nav:{backgroundColor:P.bg,borderTopColor:P.line,borderTopWidth:1,paddingTop:6,paddingHorizontal:7},
 navContent:{width:'100%',maxWidth:640,alignSelf:'center',flexDirection:'row'},
 navItem:{flex:1,minHeight:49,alignItems:'center',justifyContent:'center',gap:3,paddingBottom:3},
 navLabel:{fontSize:10,lineHeight:15,textAlign:'center',flexShrink:1,width:'100%'},
 supportNow:{minHeight:45,backgroundColor:P.red,marginHorizontal:10,marginTop:6,marginBottom:2,borderWidth:1.3,borderColor:P.red,borderRadius:24,alignItems:'center',justifyContent:'center'},
 supportNowText:{fontSize:13,letterSpacing:.5,fontWeight:'800',color:'#FFF5ED',textAlign:'center',paddingHorizontal:8},
 pressed:{opacity:.76}
});
