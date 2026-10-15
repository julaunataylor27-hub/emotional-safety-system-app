import {AppText as Text,useAppPreferences} from './AppPreferences';
import {P} from './PresentationTheme';
import React, { useState } from 'react';
import { View, Image, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import GoldenTreeIcon from './GoldenTreeIcons';
import ValueMeaningSheet from './ValueMeaningSheet';
const { VALUE_MEANINGS } = require('./valueMeanings.cjs');

const HERO = require('../assets/graphics/presentation-tree-v2.webp');
const EMBLEM = require('../assets/graphics/golden-tree-emblem-v1.png');
const COLORS = { background:P.bg, gold:P.gold, ivory:P.text, muted:P.muted, rule:P.line };
const NAV = [['home','Home'],['journey','Journey'],['learn','Learn'],['support','Support'],['more','More']];
const FONT_ASSETS = { ESSHeading:require('../assets/fonts/Marcellus-Regular.ttf'), ESSBody:require('../assets/fonts/DM-Sans.ttf') };

function HomeContent({ onNavigate, onValuePress }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const {preferences,t}=useAppPreferences();
  const insets = useSafeAreaInsets();
  const { width, fontScale } = useWindowDimensions();
  const [fontsLoaded] = useFonts(FONT_ASSETS);
  const contentWidth = Math.min(width - insets.left - insets.right, 640);
  const largeText = fontScale > 1.25 || preferences.readingSize==='large' || preferences.language!=='en' || contentWidth < 360;
  const columns = largeText ? 2 : 4;
  const headingFont = fontsLoaded ? 'ESSHeading' : Platform.select({ios:'Georgia',android:'serif',default:'serif'});
  const bodyFont = fontsLoaded ? 'ESSBody' : undefined;
  const heading = { fontFamily:headingFont };
  const body = { fontFamily:bodyFont };
  const navigate = route => onNavigate(route);

  return <><View testID="golden-tree-home-screen" accessibilityElementsHidden={!!selectedValue} importantForAccessibility={selectedValue?'no-hide-descendants':'auto'} style={[styles.screen,{paddingTop:insets.top,paddingLeft:insets.left,paddingRight:insets.right}]}>
    <StatusBar style="light" />
    <View style={styles.header}>
      <Image source={EMBLEM} style={styles.emblem} resizeMode="contain" accessible={false}/>
      <Text style={[styles.brand,heading]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>Emotional Safety System</Text>
      <Pressable testID="home-open-menu" accessibilityRole="button" accessibilityLabel="Open menu" accessibilityHint="Open the app menu and tools" onPress={()=>navigate('more')} hitSlop={4} style={({pressed})=>[styles.menu,pressed&&styles.pressed]}>
        <GoldenTreeIcon name="Menu" size={26}/>
      </Pressable>
    </View>
    <ScrollView testID="golden-tree-home-scroll" style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={[styles.hero,{height:contentWidth*0.58}]}>
        <Image testID="golden-tree-home-artwork" source={HERO} style={styles.heroImage} resizeMode="cover" accessibilityLabel="Eucalyptus tree at dawn; illustrative artwork" accessible />
        <Svg pointerEvents="none" style={styles.heroFade} width="100%" height={60} viewBox="0 0 100 60" preserveAspectRatio="none" accessible={false}>
          <Defs><LinearGradient id="golden-home-fade" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={COLORS.background} stopOpacity="0"/><Stop offset="1" stopColor={COLORS.background} stopOpacity="1"/></LinearGradient></Defs>
          <Rect width="100" height="60" fill="url(#golden-home-fade)"/>
        </Svg>
      </View>
      <View style={styles.introduction}>
        <Text style={[styles.eyebrow,body]}>{t('eyebrow')}</Text>
        <Text accessibilityRole="header" style={[styles.slogan,heading]}>{t('slogan')}</Text>
        <Text style={[styles.question,body]}>{t('question')}</Text>
      </View>
      <View testID="home-values-grid" style={styles.values}>
        {VALUE_MEANINGS.map(value=><Pressable key={value.name} testID={'home-value-'+value.name.toLowerCase()} accessibilityRole="button" accessibilityLabel={'Explore '+value.name} accessibilityHint="Read the meaning, a Noongar cultural reflection and a question for you" onPress={()=>setSelectedValue(value)} style={({pressed})=>[styles.value,{width:(100/columns)+'%'},pressed&&styles.pressed]}>
          <View style={styles.valueCircle}><GoldenTreeIcon name={value.name} size={35}/><View testID={'home-value-info-'+value.name.toLowerCase()} pointerEvents="none" accessible={false} style={styles.infoBadge}><Text accessible={false} style={[styles.infoText,body]}>i</Text></View></View>
          <Text style={[styles.valueLabel,body,largeText&&styles.largeValueLabel]}>{t(value.name.toLowerCase())}</Text>
        </Pressable>)}
      </View>
      <Text style={[styles.privacy,body]}>{t('privacy')}</Text>
      {preferences.language!=='en'&&<Text style={[styles.scope,body]}>{t('scope')}</Text>}
      <View style={styles.actions}>
        <Pressable testID="home-start-journey" accessibilityRole="button" accessibilityLabel="Start my journey" onPress={()=>navigate('journey')} style={({pressed})=>[styles.primary,pressed&&styles.pressed]}>
          <Text style={[styles.primaryLabel,heading]}>{t('start')}</Text><GoldenTreeIcon name="Arrow" color="#08261B" size={24}/>
        </Pressable>
        {[['vision','Globe',t('vision'),'home-vision'],['assessment','Compass',t('explore'),'home-explore-situation'],['lifeJourney','Life',t('lifeJourney'),'home-life-journey'],['support','Lifebuoy',t('findSupport'),'home-find-support'],['settings','Settings',t('settings'),'home-settings']].map(([route,icon,label,id])=><Pressable key={route} testID={id} accessibilityRole="button" accessibilityLabel={label} onPress={()=>navigate(route)} style={({pressed})=>[styles.link,pressed&&styles.pressed]}>
          <GoldenTreeIcon name={icon} size={27}/><Text style={[styles.linkLabel,body]}>{label}</Text><GoldenTreeIcon name="Chevron" size={17}/>
        </Pressable>)}
      </View>
    </ScrollView>
    <View style={[styles.nav,{paddingBottom:Math.max(8,insets.bottom)}]}>
      <View style={styles.navContent}>{NAV.map(([route,label])=><Pressable key={route} testID={'home-nav-'+route} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{selected:route==='home'}} onPress={()=>navigate(route)} style={({pressed})=>[styles.navItem,pressed&&styles.pressed]}>
        <GoldenTreeIcon name={label} size={26} color={route==='home'?COLORS.gold:COLORS.ivory} filled={route==='home'}/>
        <Text style={[styles.navLabel,body,{color:route==='home'?COLORS.gold:COLORS.ivory}]}>{t(route)}</Text>
        {route==='home'&&<View style={styles.activeTab}/>} 
      </Pressable>)}</View>
    </View>
  </View>
    {selectedValue&&<ValueMeaningSheet key={selectedValue.name} value={selectedValue} heading={heading} body={body} bottomInset={insets.bottom} onClose={()=>setSelectedValue(null)} onReflect={value=>{setSelectedValue(null);onValuePress(value);}}/>}
  </>;
}

export default function GoldenTreeHome(props) {
  return <SafeAreaProvider initialMetrics={initialWindowMetrics}><HomeContent {...props}/></SafeAreaProvider>;
}

const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.background},
  header:{width:'100%',maxWidth:640,alignSelf:'center',minHeight:72,paddingHorizontal:18,flexDirection:'row',alignItems:'center',gap:9},
  emblem:{width:44,height:44},brand:{flex:1,color:COLORS.ivory,fontSize:19,letterSpacing:0},menu:{width:42,minHeight:44,alignItems:'center',justifyContent:'center'},
  scroll:{flex:1},content:{width:'100%',maxWidth:640,alignSelf:'center',paddingBottom:6},
  hero:{overflow:'hidden',width:'100%'},heroImage:{width:'100%',height:'100%'},heroFade:{position:'absolute',left:0,right:0,bottom:0},
  introduction:{paddingHorizontal:20,alignItems:'center',marginTop:-3},slogan:{color:COLORS.ivory,fontSize:34,lineHeight:41,textAlign:'center'},
  question:{color:COLORS.ivory,fontSize:16,lineHeight:25,textAlign:'center',marginTop:12,marginBottom:14},
  values:{paddingHorizontal:13,flexDirection:'row',flexWrap:'wrap',marginBottom:9},value:{alignItems:'center',paddingHorizontal:2,paddingTop:3,paddingBottom:11,minHeight:84},
  eyebrow:{fontSize:13,lineHeight:21,color:COLORS.gold,textAlign:'center',marginBottom:10},privacy:{fontSize:13,lineHeight:21,color:COLORS.muted,textAlign:'center',marginBottom:18,paddingHorizontal:20},scope:{fontSize:13,lineHeight:21,color:COLORS.muted,paddingHorizontal:22,marginBottom:18},
  valueCircle:{width:64,height:64,borderRadius:32,borderWidth:1.15,borderColor:COLORS.gold,alignItems:'center',justifyContent:'center'},
  infoBadge:{position:'absolute',top:-3,right:-4,width:20,height:20,borderRadius:10,backgroundColor:COLORS.gold,borderWidth:2,borderColor:COLORS.background,alignItems:'center',justifyContent:'center'},infoText:{fontSize:12,lineHeight:15,fontWeight:'700',color:COLORS.background},
  valueLabel:{color:COLORS.ivory,fontSize:13,lineHeight:20,textAlign:'center',marginTop:6},largeValueLabel:{fontSize:14,lineHeight:20},
  actions:{paddingHorizontal:22},primary:{backgroundColor:COLORS.gold,overflow:'hidden',borderRadius:17,minHeight:58,borderWidth:1.15,borderColor:'#FFEA9F',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,paddingHorizontal:14,paddingVertical:8,marginBottom:13},
  primaryLabel:{color:'#09291D',fontSize:23,lineHeight:31},link:{minHeight:62,borderTopWidth:1,borderTopColor:COLORS.rule,flexDirection:'row',alignItems:'center',gap:16,paddingHorizontal:10,paddingVertical:9},linkLabel:{flex:1,color:COLORS.ivory,fontSize:16,lineHeight:23},
  nav:{backgroundColor:COLORS.background,borderTopWidth:1,borderTopColor:COLORS.rule,paddingTop:7},navContent:{width:'100%',maxWidth:640,alignSelf:'center',flexDirection:'row'},navItem:{flex:1,minHeight:49,alignItems:'center',justifyContent:'center',gap:4,paddingBottom:3},navLabel:{fontSize:12,lineHeight:18,textAlign:'center'},activeTab:{position:'absolute',bottom:0,width:28,height:2,borderRadius:1,backgroundColor:COLORS.gold},pressed:{opacity:0.72}
});
