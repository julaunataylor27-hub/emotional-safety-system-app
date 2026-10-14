import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import GoldenTreeIcon from './GoldenTreeIcons';

const HERO = require('../assets/graphics/golden-tree-home-v1.png');
const EMBLEM = require('../assets/graphics/golden-tree-emblem-v1.png');
const COLORS = { background:'#002219', gold:'#F4D17C', ivory:'#FFF6DD', muted:'#DCE6D9', rule:'#294B3C' };
const VALUES = ['Knowledge','Understanding','Love','Kindness','Patience','Growth','Humanity','Life'];
const NAV = [['home','Home'],['journey','Journey'],['learn','Learn'],['support','Support'],['more','More']];
const FONT_ASSETS = { ESSHeading:require('../assets/fonts/Marcellus-Regular.ttf'), ESSBody:require('../assets/fonts/DM-Sans.ttf') };

function HomeContent({ onNavigate, onValuePress }) {
  const insets = useSafeAreaInsets();
  const { width, fontScale } = useWindowDimensions();
  const [fontsLoaded] = useFonts(FONT_ASSETS);
  const contentWidth = Math.min(width - insets.left - insets.right, 640);
  const largeText = fontScale > 1.25 || contentWidth < 340;
  const columns = largeText ? 2 : 4;
  const headingFont = fontsLoaded ? 'ESSHeading' : Platform.select({ios:'Georgia',android:'serif',default:'serif'});
  const bodyFont = fontsLoaded ? 'ESSBody' : undefined;
  const heading = { fontFamily:headingFont };
  const body = { fontFamily:bodyFont };
  const navigate = route => onNavigate(route);

  return <View testID="golden-tree-home-screen" style={[styles.screen,{paddingTop:insets.top,paddingLeft:insets.left,paddingRight:insets.right}]}>
    <StatusBar style="light" />
    <View style={styles.header}>
      <Image source={EMBLEM} style={styles.emblem} resizeMode="contain" accessible={false}/>
      <Text style={[styles.brand,heading]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>Emotional Safety System</Text>
      <Pressable testID="home-open-menu" accessibilityRole="button" accessibilityLabel="Open menu" accessibilityHint="Open the app menu and tools" onPress={()=>navigate('more')} hitSlop={4} style={({pressed})=>[styles.menu,pressed&&styles.pressed]}>
        <GoldenTreeIcon name="Menu" size={26}/>
      </Pressable>
    </View>
    <ScrollView testID="golden-tree-home-scroll" style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={[styles.hero,{height:contentWidth*0.745}]}>
        <Image testID="golden-tree-home-artwork" source={HERO} style={styles.heroImage} resizeMode="cover" accessibilityLabel="Golden tree at sunset" accessible />
        <Svg pointerEvents="none" style={styles.heroFade} width="100%" height={60} viewBox="0 0 100 60" preserveAspectRatio="none" accessible={false}>
          <Defs><LinearGradient id="golden-home-fade" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={COLORS.background} stopOpacity="0"/><Stop offset="1" stopColor={COLORS.background} stopOpacity="1"/></LinearGradient></Defs>
          <Rect width="100" height="60" fill="url(#golden-home-fade)"/>
        </Svg>
      </View>
      <View style={styles.introduction}>
        <Text accessibilityRole="header" style={[styles.slogan,heading]}>Grow yourself.{`\n`}Grow humanity.</Text>
        <Text style={[styles.question,body]}>What would you like to understand today?</Text>
      </View>
      <View testID="home-values-grid" style={styles.values}>
        {VALUES.map(value=><Pressable key={value} testID={'home-value-'+value.toLowerCase()} accessibilityRole="button" accessibilityLabel={'Explore '+value} accessibilityHint="Open My Values in your journey" onPress={()=>onValuePress(value)} style={({pressed})=>[styles.value,{width:(100/columns)+'%'},pressed&&styles.pressed]}>
          <View style={styles.valueCircle}><GoldenTreeIcon name={value} size={35}/></View>
          <Text style={[styles.valueLabel,body,largeText&&styles.largeValueLabel]}>{value}</Text>
        </Pressable>)}
      </View>
      <View style={styles.actions}>
        <Pressable testID="home-start-journey" accessibilityRole="button" accessibilityLabel="Start my journey" onPress={()=>navigate('journey')} style={({pressed})=>[styles.primary,pressed&&styles.pressed]}>
          <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject} width="100%" height="100%" accessible={false}>
            <Defs><LinearGradient id="golden-home-button" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFE28C"/><Stop offset="0.45" stopColor="#F4C442"/><Stop offset="1" stopColor="#DB9D23"/></LinearGradient></Defs>
            <Rect width="100%" height="100%" rx="27" fill="url(#golden-home-button)"/>
          </Svg>
          <Text style={[styles.primaryLabel,heading]}>Start my journey</Text><GoldenTreeIcon name="Arrow" color="#08261B" size={24}/>
        </Pressable>
        {[['assessment','Compass','Explore a situation','home-explore-situation'],['lifeJourney','Life',"Yagan's Life Journey",'home-life-journey'],['support','Lifebuoy','Find support','home-find-support']].map(([route,icon,label,id])=><Pressable key={route} testID={id} accessibilityRole="button" accessibilityLabel={label} onPress={()=>navigate(route)} style={({pressed})=>[styles.link,pressed&&styles.pressed]}>
          <GoldenTreeIcon name={icon} size={27}/><Text style={[styles.linkLabel,body]}>{label}</Text><GoldenTreeIcon name="Chevron" size={17}/>
        </Pressable>)}
      </View>
    </ScrollView>
    <View style={[styles.nav,{paddingBottom:Math.max(8,insets.bottom)}]}>
      <View style={styles.navContent}>{NAV.map(([route,label])=><Pressable key={route} testID={'home-nav-'+route} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{selected:route==='home'}} onPress={()=>navigate(route)} style={({pressed})=>[styles.navItem,pressed&&styles.pressed]}>
        <GoldenTreeIcon name={label} size={26} color={route==='home'?COLORS.gold:COLORS.ivory} filled={route==='home'}/>
        <Text style={[styles.navLabel,body,{color:route==='home'?COLORS.gold:COLORS.ivory}]}>{label}</Text>
        {route==='home'&&<View style={styles.activeTab}/>} 
      </Pressable>)}</View>
    </View>
  </View>;
}

export default function GoldenTreeHome(props) {
  return <SafeAreaProvider initialMetrics={initialWindowMetrics}><HomeContent {...props}/></SafeAreaProvider>;
}

const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.background},
  header:{width:'100%',maxWidth:640,alignSelf:'center',minHeight:58,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:9},
  emblem:{width:43,height:43},brand:{flex:1,color:COLORS.ivory,fontSize:19,letterSpacing:-0.35},menu:{width:42,minHeight:44,alignItems:'center',justifyContent:'center'},
  scroll:{flex:1},content:{width:'100%',maxWidth:640,alignSelf:'center',paddingBottom:6},
  hero:{overflow:'hidden',width:'100%'},heroImage:{width:'100%',height:'100%'},heroFade:{position:'absolute',left:0,right:0,bottom:0},
  introduction:{paddingHorizontal:20,alignItems:'center',marginTop:-3},slogan:{color:COLORS.ivory,fontSize:36,lineHeight:40,textAlign:'center'},
  question:{color:COLORS.ivory,fontSize:15,lineHeight:22,textAlign:'center',marginTop:12,marginBottom:14},
  values:{paddingHorizontal:13,flexDirection:'row',flexWrap:'wrap',marginBottom:9},value:{alignItems:'center',paddingHorizontal:2,paddingTop:3,paddingBottom:11,minHeight:84},
  valueCircle:{width:60,height:60,borderRadius:30,borderWidth:1.15,borderColor:COLORS.gold,alignItems:'center',justifyContent:'center'},
  valueLabel:{color:COLORS.ivory,fontSize:11.5,lineHeight:16,textAlign:'center',marginTop:6},largeValueLabel:{fontSize:14,lineHeight:20},
  actions:{paddingHorizontal:22},primary:{overflow:'hidden',borderRadius:28,minHeight:52,borderWidth:1.15,borderColor:'#FFEA9F',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,paddingHorizontal:14,paddingVertical:8,marginBottom:13},
  primaryLabel:{color:'#09291D',fontSize:23,lineHeight:29},link:{minHeight:48,borderTopWidth:1,borderTopColor:COLORS.rule,flexDirection:'row',alignItems:'center',gap:16,paddingHorizontal:10,paddingVertical:9},linkLabel:{flex:1,color:COLORS.ivory,fontSize:16,lineHeight:23},
  nav:{backgroundColor:COLORS.background,borderTopWidth:1,borderTopColor:COLORS.rule,paddingTop:7},navContent:{width:'100%',maxWidth:640,alignSelf:'center',flexDirection:'row'},navItem:{flex:1,minHeight:49,alignItems:'center',justifyContent:'center',gap:4,paddingBottom:3},navLabel:{fontSize:11,lineHeight:15,textAlign:'center'},activeTab:{position:'absolute',bottom:0,width:28,height:2,borderRadius:1,backgroundColor:COLORS.gold},pressed:{opacity:0.72}
});
