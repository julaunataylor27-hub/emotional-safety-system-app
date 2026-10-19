import {AppText as Text,useAppPreferences} from './AppPreferences';
import {P} from './PresentationTheme';
import React, {useState} from 'react';
import {View, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useFonts} from 'expo-font';
import {SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics} from 'react-native-safe-area-context';
import GoldenTreeIcon from './GoldenTreeIcons';
import NightForestScene from './NightForestScene';
import ValueMeaningSheet from './ValueMeaningSheet';
const {VALUE_MEANINGS}=require('./valueMeanings.cjs');

const COLORS={background:P.bg,gold:P.gold,ivory:P.text,muted:P.muted,rule:P.line};
const NAV=[['home','Home'],['journey','Journey'],['learn','Learn'],['support','Support'],['more','More']];
const FONTS={ESSHeading:require('../assets/fonts/Marcellus-Regular.ttf'),ESSBody:require('../assets/fonts/DM-Sans.ttf')};
const FEATURES=[
 {route:'assessment',icon:'Compass',name:'Start Assessment',description:'Understand needs. Find the right path.',id:'home-explore-situation'},
 {route:'safeCuriosity',icon:'Understanding',name:'Safe Curiosity Lab',description:'Explore questions safely.',id:'home-safe-curiosity'},
 {route:'evidence',icon:'Knowledge',name:'Evidence & Truth',description:'Separate information, feelings and uncertainty.',id:'home-evidence-truth'},
 {route:'support',icon:'Humanity',name:'Support Resources',description:'Find help and guidance.',id:'home-find-support'},
 {route:'more',icon:'More',name:'More',description:'Settings, learning and more.',id:'home-more'},
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
 const heading={fontFamily:fontsLoaded?'ESSHeading':Platform.select({ios:'Georgia',android:'serif',default:'serif'})};
 const body={fontFamily:fontsLoaded?'ESSBody':undefined};
 const navigate=route=>onNavigate(route);
 return <><View testID="golden-tree-home-screen" accessibilityElementsHidden={!!selectedValue}
   importantForAccessibility={selectedValue?'no-hide-descendants':'auto'}
   style={[s.screen,{paddingTop:insets.top,paddingLeft:insets.left,paddingRight:insets.right}]}>
   <StatusBar style="light"/>
   <ScrollView testID="golden-tree-home-scroll" style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <View style={[s.hero,{height:Math.max(298,contentWidth*0.78)}]}>
      <NightForestScene testID="golden-tree-home-artwork" height={Math.max(298,contentWidth*.78)}
        accessibilityLabel="Moonlit golden tree beside water; illustrative artwork"/>
      <View style={s.heroText} pointerEvents="box-none">
        <View style={s.topRow}>
         <View style={s.brandEmblem}><GoldenTreeIcon name="Growth" size={30} color={P.gold}/></View>
         <Pressable testID="home-open-menu" accessibilityRole="button" accessibilityLabel="Open menu" accessibilityHint="Open the app menu and tools"
           onPress={()=>navigate('more')} style={s.profile}><GoldenTreeIcon name="Menu" size={24} color={P.gold}/></Pressable>
        </View>
        <Text accessibilityRole="header" style={[s.heroTitle,heading]}>Emotional{'\n'}Safety System</Text>
        <Text style={[s.subtitle,body]}>Protect curiosity. Build understanding.</Text>
        <View style={s.quoteSpacer}/>
        <Text style={[s.heroQuote,heading]}>Brighter questions{'\n'}build safer tomorrows.</Text>
      </View>
    </View>
    <View style={s.featureStack}>
      {FEATURES.map((item,index)=><Pressable key={item.route} testID={item.id}
        accessibilityRole="button" accessibilityLabel={item.name}
        onPress={()=>navigate(item.route)}
        style={({pressed})=>[s.featureCard,index%2===1&&s.alternate,pressed&&s.pressed]}>
        <View style={s.featureIcon}><GoldenTreeIcon name={item.icon} size={29} color={P.gold}/></View>
        <View style={s.featureCopy}><Text style={[s.featureTitle,heading]}>{item.name}</Text>
         <Text style={[s.featureSub,body]}>{item.description}</Text></View>
        <GoldenTreeIcon name="Chevron" size={19} color={P.gold}/>
      </Pressable>)}
    </View>
    <View style={s.extras}>
      <Pressable testID="home-start-journey" accessibilityRole="button" accessibilityLabel="Start my journey"
        onPress={()=>navigate('journey')} style={({pressed})=>[s.primary,pressed&&s.pressed]}>
        <GoldenTreeIcon name="Journey" size={23} color={P.bg}/><Text style={[s.primaryLabel,body]}>Start my journey</Text><GoldenTreeIcon name="Arrow" color={P.bg} size={23}/>
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
          <Text style={[s.valueLabel,body,largeText&&s.largeValueLabel]}>{t(value.name.toLowerCase())}</Text>
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
     <GoldenTreeIcon name={label} size={25} color={route==='home'?P.gold:P.muted} filled={route==='home'}/>
     <Text style={[s.navLabel,body,{color:route==='home'?P.gold:P.muted}]}>{t(route)}</Text>
     {route==='home'&&<View style={s.activeTab}/>}
    </Pressable>)}</View>
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
