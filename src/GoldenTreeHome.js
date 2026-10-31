// FULL_NEW_THEME_V5
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

const NAV=[['home','Home'],['journey','Journey'],['learn','Learn'],['evidence','Evidence'],['support','Support'],['more','More']];
const NAV_ICONS={home:'Home',journey:'Journey',learn:'Knowledge',evidence:'Knowledge',support:'Humanity',more:'More'};

function ToolRow({id,icon,title,subtitle,onPress,accent=P.gold}){
 return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={title} onPress={onPress}
  style={({pressed})=>[s.toolRow,pressed&&s.pressed]}>
   <View style={[s.toolIcon,{borderColor:accent}]}><GoldenTreeIcon name={icon} size={27} color={accent}/></View>
   <View style={s.toolCopy}><Text style={s.toolTitle}>{title}</Text><Text style={s.toolSub}>{subtitle}</Text></View>
   <GoldenTreeIcon name="Chevron" size={18} color={P.gold}/>
 </Pressable>;
}

function HomeContent({onNavigate,onValuePress}){
 const [selectedValue,setSelectedValue]=useState(null);
 const {preferences,t}=useAppPreferences();
 const insets=useSafeAreaInsets();
 const {width,fontScale}=useWindowDimensions();
 const compact=width<370||fontScale>1.2||preferences.readingSize==='large';
 const columns=(preferences.readingSize==='large'||fontScale>1.45)?2:4;
 const navigate=route=>onNavigate(route);

 return <>
  <View testID="golden-tree-home-screen" accessibilityElementsHidden={!!selectedValue}
   importantForAccessibility={selectedValue?'no-hide-descendants':'auto'}
   style={[s.screen,{paddingTop:insets.top,paddingLeft:insets.left,paddingRight:insets.right}]}>
   <StatusBar style="light"/>
   <ScrollView testID="golden-tree-home-scroll" style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <View style={s.topBar}>
      <View style={s.brandIcon}><GoldenTreeIcon name="Globe" size={27} color={P.gold}/></View>
      <View style={s.brandCopy}><Text style={s.brand}>Emotional Safety System</Text><Text style={s.brandSub}>Australian Humanity</Text></View>
      <Pressable testID="home-open-menu" accessibilityRole="button" accessibilityLabel="Open menu"
       onPress={()=>navigate('more')} style={s.settingsButton}><GoldenTreeIcon name="Settings" size={24} color={P.gold}/></Pressable>
    </View>

    <Pressable testID="home-ess-core" accessibilityRole="button" accessibilityLabel="Open ESS Core Prototype"
      onPress={()=>navigate('esscore')} style={({pressed})=>[s.featured,pressed&&s.pressed]}>
      <Image testID="golden-tree-home-artwork" accessibilityLabel="Illustrated Australian river landscape under stars at dusk"
       source={SCENES.home} resizeMode="cover" style={s.featuredArt}/>
      <View pointerEvents="none" style={s.featuredShade}/>
      <View style={s.featuredContent}>
        <View style={s.featuredBadge}><GoldenTreeIcon name="Understanding" size={24} color={P.gold}/><Text style={s.featuredBadgeText}>ESS CORE PROTOTYPE</Text></View>
        <Text style={s.featuredTitle}>Understand. Reflect. Choose.</Text>
        <Text style={s.featuredText}>A calm space to separate feelings, what appears known, what is uncertain, and the choices that remain yours.</Text>
        <View style={s.benefitRow}><Text style={s.benefit}>✓ You stay in control</Text><Text style={s.benefit}>✓ No judgement</Text></View>
        <View style={s.goldAction}><Text style={s.goldActionText}>Open ESS Core</Text><GoldenTreeIcon name="Arrow" size={20} color={P.bg}/></View>
      </View>
    </Pressable>

    <Pressable testID="home-explore-situation" accessibilityRole="button" accessibilityLabel="Explore the system with a new assessment"
      onPress={()=>navigate('assessment')} style={({pressed})=>[s.secondaryAction,pressed&&s.pressed]}>
      <View><Text style={s.secondaryTitle}>Explore a situation</Text><Text style={s.secondarySub}>Use the guided assessment pathway</Text></View>
      <GoldenTreeIcon name="Arrow" size={21} color={P.gold}/>
    </Pressable>

    <Text style={s.sectionKicker}>EXPLORE</Text>
    <View style={s.toolList}>
      <ToolRow id="home-evidence-truth" icon="Knowledge" title="Evidence & Truth" subtitle="Separate what is known from what is assumed" onPress={()=>navigate('evidence')} accent={P.teal}/>
      <ToolRow id="home-open-knowledge" icon="Knowledge" title="Learning Trails" subtitle="Culture · Country · History · Science" onPress={()=>navigate('learn')}/>
      <ToolRow id="home-safe-curiosity" icon="Love" title="Emotional Safety" subtitle="Feelings · boundaries · choice · reflection" onPress={()=>navigate('safeCuriosity')} accent={P.red}/>
      <ToolRow id="home-find-support" icon="Lifebuoy" title="Safety & Support" subtitle="Services · legal information · help" onPress={()=>navigate('support')} accent={P.green}/>
      <ToolRow id="home-start-journey" icon="Journey" title="Start my journey" subtitle="Build your reflections across the seven stages" onPress={()=>navigate('journey')} accent={P.teal}/>
      <ToolRow id="home-connection-adventure" icon="Compass" title="Connection Trail" subtitle="Six optional clues for curiosity, sources, perspectives and values" onPress={()=>navigate('connectionTrail')} accent={P.gold}/>
      <ToolRow id="home-life-journey" icon="Life" title={t('lifeJourney')} subtitle="Explore records, context and personal learning" onPress={()=>navigate('lifeJourney')} accent={P.gold}/>
    </View>

    <Pressable testID="home-presentation-overview" accessibilityRole="button" accessibilityLabel="Open Australian Humanity prototype overview"
      onPress={()=>navigate('presentationWalkthrough')} style={({pressed})=>[s.overviewCard,pressed&&s.pressed]}>
      <View style={s.overviewIcon}><GoldenTreeIcon name="Globe" size={28} color={P.gold}/></View>
      <View style={s.toolCopy}><Text style={s.overviewKicker}>COMPLETE SYSTEM OVERVIEW</Text><Text style={s.toolTitle}>Australian Humanity</Text><Text style={s.toolSub}>Purpose · Process · Working prototype · Future</Text></View>
      <GoldenTreeIcon name="Chevron" size={18} color={P.gold}/>
    </Pressable>

    <Text style={s.sectionKicker}>VALUES & KNOWLEDGE</Text>
    <View testID="home-values-grid" style={s.values}>
      {VALUE_MEANINGS.map(value=><Pressable key={value.name} testID={'home-value-'+value.name.toLowerCase()}
       accessibilityRole="button" accessibilityLabel={'Explore '+value.name}
       accessibilityHint="Read the meaning, cultural reflection and a question for you"
       onPress={()=>setSelectedValue(value)}
       style={({pressed})=>[s.value,{width:(100/columns)+'%'},pressed&&s.pressed]}>
        <View style={s.valueCircle}><GoldenTreeIcon name={value.name} size={29} color={P.gold}/>
         <View testID={'home-value-info-'+value.name.toLowerCase()} pointerEvents="none" accessible={false} style={s.infoBadge}><Text style={s.infoText}>i</Text></View>
        </View>
        <Text numberOfLines={2} style={s.valueLabel}>{t(value.name.toLowerCase())}</Text>
      </Pressable>)}
    </View>

    <ToolRow id="home-vision" icon="Globe" title={t('vision')} subtitle="Purpose and future direction" onPress={()=>navigate('vision')}/>
    <ToolRow id="home-settings" icon="Settings" title={t('settings')} subtitle="Language · reading · motion preferences" onPress={()=>navigate('settings')}/>
    <Pressable testID="home-more" accessibilityRole="button" accessibilityLabel="More tools and settings"
      onPress={()=>navigate('more')} style={({pressed})=>[s.moreButton,pressed&&s.pressed]}>
      <Text style={s.moreText}>More tools and settings</Text><GoldenTreeIcon name="Arrow" size={18} color={P.gold}/>
    </Pressable>

    <Text style={s.privacy}>{t('privacy')}</Text>
    {preferences.language!=='en'&&<Text style={s.privacy}>{t('scope')}</Text>}
   </ScrollView>

   <View style={[s.bottomShell,{paddingBottom:Math.max(8,insets.bottom)}]}>
    <View style={s.navContent}>{NAV.map(([route,label])=><Pressable key={route} testID={'home-nav-'+route} accessibilityRole="tab"
     accessibilityLabel={label} accessibilityState={{selected:route==='home'}} onPress={()=>navigate(route)}
     style={({pressed})=>[s.navItem,pressed&&s.pressed]}>
      <GoldenTreeIcon name={NAV_ICONS[route]} size={24} color={route==='home'?P.gold:P.muted} filled={route==='home'}/>
      <Text style={[s.navLabel,{color:route==='home'?P.gold:P.muted}]}>{route==='evidence'?'Evidence':t(route)}</Text>
      {route==='home'&&<View style={s.activeTab}/>}
    </Pressable>)}</View>
    <Pressable testID="home-support-now" accessibilityRole="button" accessibilityLabel="I need support now"
     onPress={()=>navigate('support')} style={({pressed})=>[s.supportNow,pressed&&s.pressed]}>
      <GoldenTreeIcon name="Lifebuoy" size={19} color="#FFF"/>
      <Text style={s.supportNowText}>I NEED SUPPORT NOW</Text>
    </Pressable>
   </View>
  </View>

  {selectedValue&&<ValueMeaningSheet key={selectedValue.name} value={selectedValue} bottomInset={insets.bottom}
   onClose={()=>setSelectedValue(null)} onReflect={value=>{setSelectedValue(null);onValuePress(value);}}/>}
 </>;
}

export default function GoldenTreeHome(props){
 return <SafeAreaProvider initialMetrics={initialWindowMetrics}><HomeContent {...props}/></SafeAreaProvider>;
}

const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:P.bg},scroll:{flex:1},content:{paddingHorizontal:18,paddingTop:10,paddingBottom:26,maxWidth:660,width:'100%',alignSelf:'center'},
 topBar:{minHeight:72,flexDirection:'row',alignItems:'center',gap:12,marginBottom:16},
 brandIcon:{width:48,height:48,borderRadius:24,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,alignItems:'center',justifyContent:'center'},
 brandCopy:{flex:1},brand:{color:P.text,fontSize:20,lineHeight:26,fontWeight:'700'},brandSub:{color:P.muted,fontSize:13,lineHeight:19,marginTop:2},
 settingsButton:{width:48,height:48,borderRadius:24,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,alignItems:'center',justifyContent:'center'},
 featured:{height:360,borderRadius:26,overflow:'hidden',borderWidth:1,borderColor:P.gold,backgroundColor:P.panel,marginBottom:14},
 featuredArt:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},featuredShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,7,10,0.58)'},
 featuredContent:{flex:1,padding:20,justifyContent:'flex-end'},featuredBadge:{flexDirection:'row',alignItems:'center',gap:9,marginBottom:10},
 featuredBadgeText:{color:P.gold,fontSize:11,fontWeight:'800',letterSpacing:1.2},featuredTitle:{color:P.text,fontSize:31,lineHeight:38,fontWeight:'700'},
 featuredText:{color:'#EEE8DD',fontSize:15,lineHeight:23,marginTop:9},benefitRow:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:12},
 benefit:{color:P.muted,fontSize:12,lineHeight:18},goldAction:{marginTop:16,minHeight:50,borderRadius:15,backgroundColor:P.gold,paddingHorizontal:17,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 goldActionText:{color:P.bg,fontSize:15,fontWeight:'800'},
 secondaryAction:{minHeight:76,borderRadius:18,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:24},
 secondaryTitle:{color:P.text,fontSize:16,fontWeight:'700'},secondarySub:{color:P.muted,fontSize:12,lineHeight:18,marginTop:4},
 sectionKicker:{color:P.gold,fontSize:11,fontWeight:'800',letterSpacing:1.4,marginBottom:10,marginTop:4},
 toolList:{gap:9,marginBottom:18},toolRow:{minHeight:78,borderRadius:18,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,padding:14,flexDirection:'row',alignItems:'center',gap:13},
 toolIcon:{width:48,height:48,borderRadius:24,borderWidth:1,backgroundColor:P.panel2,alignItems:'center',justifyContent:'center'},toolCopy:{flex:1},
 toolTitle:{color:P.text,fontSize:16,lineHeight:22,fontWeight:'700'},toolSub:{color:P.muted,fontSize:12.5,lineHeight:18,marginTop:3},
 overviewCard:{minHeight:94,borderRadius:20,borderWidth:1,borderColor:P.gold,backgroundColor:P.panel,padding:15,flexDirection:'row',alignItems:'center',gap:13,marginBottom:24},
 overviewIcon:{width:52,height:52,borderRadius:26,borderWidth:1,borderColor:P.gold,backgroundColor:P.panel2,alignItems:'center',justifyContent:'center'},
 overviewKicker:{color:P.gold,fontSize:10.5,fontWeight:'800',letterSpacing:.8,marginBottom:3},
 values:{flexDirection:'row',flexWrap:'wrap',marginBottom:14},value:{alignItems:'center',paddingHorizontal:3,paddingVertical:8,minHeight:92},
 valueCircle:{width:58,height:58,borderRadius:29,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,alignItems:'center',justifyContent:'center'},
 infoBadge:{position:'absolute',top:-3,right:-3,width:18,height:18,borderRadius:9,backgroundColor:P.gold,alignItems:'center',justifyContent:'center'},
 infoText:{color:P.bg,fontSize:11,fontWeight:'800'},valueLabel:{color:P.text,fontSize:12,lineHeight:17,textAlign:'center',marginTop:6},
 moreButton:{minHeight:54,marginTop:10,borderRadius:16,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 moreText:{color:P.text,fontSize:14,fontWeight:'700'},privacy:{color:P.muted,fontSize:11.5,lineHeight:18,textAlign:'center',marginTop:14},
 bottomShell:{borderTopWidth:1,borderTopColor:P.line,backgroundColor:'#03070B',paddingTop:6,paddingHorizontal:8},
 navContent:{flexDirection:'row',maxWidth:660,width:'100%',alignSelf:'center'},navItem:{flex:1,minHeight:54,alignItems:'center',justifyContent:'center',gap:3},
 navLabel:{fontSize:10.5,lineHeight:15},activeTab:{position:'absolute',bottom:0,width:24,height:2,borderRadius:2,backgroundColor:P.gold},
 supportNow:{minHeight:46,borderRadius:24,backgroundColor:P.red,marginTop:7,marginBottom:2,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},
 supportNowText:{color:'#FFF',fontSize:13,fontWeight:'800',letterSpacing:.5},pressed:{opacity:.72}
});
