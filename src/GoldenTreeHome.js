// MOCKUP_THEME_V6
import {AppText as Text,useAppPreferences} from './AppPreferences';
import {P} from './PresentationTheme';
import {SCENES} from './theme/AustralianHumanityTheme';
import React,{useState} from 'react';
import {View,ScrollView,Pressable,Image,StyleSheet,useWindowDimensions} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider,useSafeAreaInsets,initialWindowMetrics} from 'react-native-safe-area-context';
import GoldenTreeIcon from './GoldenTreeIcons';
import ValueMeaningSheet from './ValueMeaningSheet';
const {VALUE_MEANINGS}=require('./valueMeanings.cjs');

const NAV=[['home','Home'],['journal','Journal'],['learn','Learn'],['support','Support'],['more','More']];
const NAV_ICONS={home:'Home',journal:'Journey',learn:'Knowledge',support:'Humanity',more:'More'};

function Row({id,icon,title,subtitle,onPress,accent=P.gold}){
 return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={title} onPress={onPress}
  style={({pressed})=>[s.row,pressed&&s.pressed]}>
   <View style={[s.rowIcon,{borderColor:accent}]}><GoldenTreeIcon name={icon} size={24} color={accent}/></View>
   <View style={s.rowCopy}><Text style={s.rowTitle}>{title}</Text><Text style={s.rowSub}>{subtitle}</Text></View>
   <GoldenTreeIcon name="Chevron" size={18} color={P.gold}/>
 </Pressable>;
}

function HomeContent({onNavigate,onValuePress}){
 const [selectedValue,setSelectedValue]=useState(null);
 const {preferences,t}=useAppPreferences();
 const insets=useSafeAreaInsets();
 const {fontScale}=useWindowDimensions();
 const columns=(preferences.readingSize==='large'||fontScale>1.45)?2:4;
 const navigate=route=>onNavigate(route);

 return <>
  <View testID="golden-tree-home-screen" accessibilityElementsHidden={!!selectedValue}
   importantForAccessibility={selectedValue?'no-hide-descendants':'auto'}
   style={[s.screen,{paddingTop:insets.top,paddingLeft:insets.left,paddingRight:insets.right}]}>
   <StatusBar style="light"/>
   <Image testID="golden-tree-home-artwork" accessibilityLabel="Illustrated Australian river landscape under stars at dusk"
    source={SCENES.home} resizeMode="cover" style={s.backgroundArt}/>
   <View pointerEvents="none" style={s.backgroundShade}/>
   <ScrollView testID="golden-tree-home-scroll" style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <View style={s.topBar}>
      <View style={s.brandIcon}><GoldenTreeIcon name="Globe" size={25} color={P.gold}/></View>
      <View style={s.brandCopy}><Text style={s.brand}>Emotional Safety System</Text><Text style={s.brandSub}>Australian Humanity</Text></View>
      <Pressable testID="home-open-menu" accessibilityRole="button" accessibilityLabel="Open menu"
       onPress={()=>navigate('more')} style={s.settingsButton}><GoldenTreeIcon name="Settings" size={23} color={P.gold}/></Pressable>
    </View>

    <View style={s.introCard}>
      <Text style={s.introKicker}>A SAFE SPACE TO MAKE SENSE OF WHAT’S HAPPENING</Text>
      <Text style={s.introTitle}>Understand what you feel. Separate what you know. Keep your choices.</Text>
      <View style={s.introPoints}>
       <Text style={s.point}>○ You stay in control</Text>
       <Text style={s.point}>○ No judgement</Text>
       <Text style={s.point}>○ Clear next steps</Text>
       <Text style={s.point}>○ Privacy-first prototype</Text>
      </View>
    </View>

    <View style={s.list}>
      <Row id="home-ess-core" icon="Understanding" title="ESS Core Prototype" subtitle="Understand · Reflect · Choose" onPress={()=>navigate('esscore')} accent={P.gold}/>
      <Row id="home-evidence-truth" icon="Knowledge" title="Evidence & Truth Test Lab" subtitle="Sort what’s known from what’s assumed" onPress={()=>navigate('evidence')} accent={P.teal}/>
      <Row id="home-open-knowledge" icon="Knowledge" title="Learning Trails" subtitle="Culture · Country · History · Science" onPress={()=>navigate('learn')} accent={P.gold}/>
      <Row id="home-safe-curiosity" icon="Love" title="Emotional Safety" subtitle="Feelings · boundaries · choice · reflection" onPress={()=>navigate('safeCuriosity')} accent={P.red}/>
      <Row id="home-find-support" icon="Lifebuoy" title="Safety & Support" subtitle="Services · legal information · help" onPress={()=>navigate('support')} accent={P.green}/>
      <Row id="home-start-journey" icon="Journey" title={t('start')} subtitle="Your seven-stage reflection journey" onPress={()=>navigate('journey')} accent={P.teal}/>
      <Row id="home-connection-adventure" icon="Compass" title="Connection Trail" subtitle="Curiosity · sources · perspectives · values" onPress={()=>navigate('connectionTrail')} accent={P.gold}/>
      <Row id="home-life-journey" icon="Life" title={t('lifeJourney')} subtitle="Records · context · personal learning" onPress={()=>navigate('lifeJourney')} accent={P.gold}/>
      <Row id="home-settings" icon="Settings" title={t('settings')} subtitle="Language · reading · motion preferences" onPress={()=>navigate('settings')} accent={P.gold}/>
    </View>

    <Pressable testID="home-explore-situation" accessibilityRole="button" accessibilityLabel="Explore the system with a new assessment"
     onPress={()=>navigate('assessment')} style={({pressed})=>[s.primary,pressed&&s.pressed]}>
      <Text style={s.primaryText}>Explore a situation</Text><GoldenTreeIcon name="Arrow" size={20} color={P.bg}/>
    </Pressable>

    <Pressable testID="home-presentation-overview" accessibilityRole="button" accessibilityLabel="Open Australian Humanity prototype overview"
     onPress={()=>navigate('presentationWalkthrough')} style={({pressed})=>[s.secondary,pressed&&s.pressed]}>
      <GoldenTreeIcon name="Globe" size={22} color={P.gold}/><Text style={s.secondaryText}>Complete system overview</Text><GoldenTreeIcon name="Arrow" size={18} color={P.gold}/>
    </Pressable>

    <Text style={s.valuesTitle}>Values & knowledge</Text>
    <View testID="home-values-grid" style={s.values}>
      {VALUE_MEANINGS.map(value=><Pressable key={value.name} testID={'home-value-'+value.name.toLowerCase()}
       accessibilityRole="button" accessibilityLabel={'Explore '+value.name}
       accessibilityHint="Read the meaning, cultural reflection and a question for you"
       onPress={()=>setSelectedValue(value)}
       style={({pressed})=>[s.value,{width:(100/columns)+'%'},pressed&&s.pressed]}>
        <View style={s.valueCircle}><GoldenTreeIcon name={value.name} size={27} color={P.gold}/>
         <View testID={'home-value-info-'+value.name.toLowerCase()} pointerEvents="none" accessible={false} style={s.infoBadge}><Text style={s.infoText}>i</Text></View>
        </View>
        <Text numberOfLines={2} style={s.valueLabel}>{t(value.name.toLowerCase())}</Text>
      </Pressable>)}
    </View>

    <Pressable testID="home-vision" accessibilityRole="button" accessibilityLabel={t('vision')} onPress={()=>navigate('vision')} style={s.textLink}>
      <Text style={s.textLinkText}>{t('vision')}</Text><GoldenTreeIcon name="Arrow" size={17} color={P.gold}/>
    </Pressable>
    <Pressable testID="home-more" accessibilityRole="button" accessibilityLabel="More tools and settings" onPress={()=>navigate('more')} style={s.textLink}>
      <Text style={s.textLinkText}>More tools and settings</Text><GoldenTreeIcon name="Arrow" size={17} color={P.gold}/>
    </Pressable>

    <Text style={s.privacy}>{t('privacy')}</Text>
   </ScrollView>

   <View style={[s.bottomShell,{paddingBottom:Math.max(8,insets.bottom)}]}>
    <View style={s.navContent}>{NAV.map(([route,label])=><Pressable key={route} testID={'home-nav-'+route} accessibilityRole="tab"
     accessibilityLabel={label} accessibilityState={{selected:route==='home'}} onPress={()=>navigate(route)}
     style={({pressed})=>[s.navItem,pressed&&s.pressed]}>
      <GoldenTreeIcon name={NAV_ICONS[route]} size={23} color={route==='home'?P.gold:P.muted} filled={route==='home'}/>
      <Text style={[s.navLabel,{color:route==='home'?P.gold:P.muted}]}>{route==='journal'?'Journal':t(route)}</Text>
      {route==='home'&&<View style={s.activeTab}/>}
    </Pressable>)}</View>
   </View>
  </View>

  {selectedValue&&<ValueMeaningSheet key={selectedValue.name} value={selectedValue} bottomInset={insets.bottom}
   onClose={()=>setSelectedValue(null)} onReflect={value=>{setSelectedValue(null);onValuePress(value);}}/>}
 </>;
}
export default function GoldenTreeHome(props){return <SafeAreaProvider initialMetrics={initialWindowMetrics}><HomeContent {...props}/></SafeAreaProvider>;}

const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:'#020609'},backgroundArt:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%',opacity:.34},
 backgroundShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(1,5,8,.74)'},scroll:{flex:1},content:{paddingHorizontal:18,paddingTop:9,paddingBottom:28,maxWidth:660,width:'100%',alignSelf:'center'},
 topBar:{minHeight:68,flexDirection:'row',alignItems:'center',gap:12,marginBottom:12},brandIcon:{width:46,height:46,borderRadius:23,borderWidth:1,borderColor:P.line,backgroundColor:'rgba(5,12,17,.85)',alignItems:'center',justifyContent:'center'},
 brandCopy:{flex:1},brand:{color:P.text,fontSize:19,lineHeight:24,fontWeight:'700'},brandSub:{color:P.muted,fontSize:12,lineHeight:18,marginTop:1},
 settingsButton:{width:46,height:46,borderRadius:23,borderWidth:1,borderColor:P.line,backgroundColor:'rgba(5,12,17,.85)',alignItems:'center',justifyContent:'center'},
 introCard:{borderRadius:22,borderWidth:1,borderColor:P.line,backgroundColor:'rgba(7,17,24,.88)',padding:18,marginBottom:12},
 introKicker:{color:P.gold,fontSize:10,fontWeight:'800',letterSpacing:1.1},introTitle:{color:P.text,fontSize:22,lineHeight:29,fontWeight:'700',marginTop:7},
 introPoints:{marginTop:12,gap:5},point:{color:P.muted,fontSize:12.5,lineHeight:18},
 list:{gap:8},row:{minHeight:72,borderRadius:17,borderWidth:1,borderColor:P.line,backgroundColor:'rgba(8,20,28,.92)',padding:13,flexDirection:'row',alignItems:'center',gap:12},
 rowIcon:{width:46,height:46,borderRadius:23,borderWidth:1,backgroundColor:'rgba(7,17,24,.95)',alignItems:'center',justifyContent:'center'},rowCopy:{flex:1},
 rowTitle:{color:P.text,fontSize:15.5,lineHeight:21,fontWeight:'700'},rowSub:{color:P.muted,fontSize:12,lineHeight:17,marginTop:2},
 primary:{minHeight:52,borderRadius:15,backgroundColor:P.gold,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:14},
 primaryText:{color:P.bg,fontSize:14.5,fontWeight:'800'},secondary:{minHeight:52,borderRadius:15,borderWidth:1,borderColor:P.gold,backgroundColor:'rgba(7,17,24,.88)',paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:10,marginTop:9},
 secondaryText:{color:P.text,fontSize:13.5,fontWeight:'700',flex:1},valuesTitle:{color:P.gold,fontSize:11,fontWeight:'800',letterSpacing:1.2,marginTop:24,marginBottom:8},
 values:{flexDirection:'row',flexWrap:'wrap',marginBottom:10},value:{alignItems:'center',paddingHorizontal:2,paddingVertical:7,minHeight:86},
 valueCircle:{width:54,height:54,borderRadius:27,borderWidth:1,borderColor:P.line,backgroundColor:'rgba(8,20,28,.9)',alignItems:'center',justifyContent:'center'},
 infoBadge:{position:'absolute',top:-3,right:-3,width:17,height:17,borderRadius:9,backgroundColor:P.gold,alignItems:'center',justifyContent:'center'},infoText:{color:P.bg,fontSize:10.5,fontWeight:'800'},
 valueLabel:{color:P.text,fontSize:11.5,lineHeight:16,textAlign:'center',marginTop:5},textLink:{minHeight:48,borderTopWidth:1,borderTopColor:P.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 textLinkText:{color:P.text,fontSize:13.5,fontWeight:'700'},privacy:{color:P.muted,fontSize:11,lineHeight:17,textAlign:'center',marginTop:14},
 bottomShell:{borderTopWidth:1,borderTopColor:P.line,backgroundColor:'#020609',paddingTop:5,paddingHorizontal:8},navContent:{flexDirection:'row',maxWidth:660,width:'100%',alignSelf:'center'},
 navItem:{flex:1,minHeight:54,alignItems:'center',justifyContent:'center',gap:2},navLabel:{fontSize:10.5,lineHeight:15},activeTab:{position:'absolute',bottom:0,width:22,height:2,borderRadius:2,backgroundColor:P.gold},
 pressed:{opacity:.72}
});
