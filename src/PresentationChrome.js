import React from 'react';
import {View,Image,Pressable,StyleSheet,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppText as Text,useAppPreferences} from './AppPreferences';
import GoldenTreeIcon from './GoldenTreeIcons';
import NightForestScene from './NightForestScene';
import {P,cleanLabel} from './PresentationTheme';
import UnifiedAppNavigation from './UnifiedAppNavigation';

export function AppHeader({onNavigate}){
 const {t}=useAppPreferences();
 return <View style={s.header}>
  <Image source={require('../assets/graphics/golden-tree-emblem-v1.png')} style={s.emblem} accessible={false}/>
  <View style={s.brandCopy}><Text style={s.brand}>Emotional Safety System</Text><Text style={s.brandSub}>Grow Yourself. Grow Humanity.</Text></View>
  <Pressable testID="app-settings" accessibilityRole="button" accessibilityLabel={t('settings')} onPress={()=>onNavigate('settings')} style={s.headerButton}><GoldenTreeIcon name="Settings" size={25} color={P.gold}/></Pressable>
 </View>;
}
export function AppBottomNav({screen,onNavigate}){
 return <UnifiedAppNavigation active={screen} onNavigate={onNavigate} testIDPrefix="app-nav"/>;
}
export function ScenicBannerV2({title,subtitle,quote}){
 const growth=/root|legacy|grow|tomorrow/i.test(title);
 return <View style={s.banner}>
  <NightForestScene height={148} accessibilityLabel="Moonlit golden tree beside a lake; decorative illustration"/>
  <View style={s.bannerCopy}><Text accessibilityRole="header" style={s.bannerTitle}>{cleanLabel(title)}</Text>{!!subtitle&&<Text style={s.bannerBody}>{subtitle}</Text>}{!!quote&&<Text style={s.quote}>{quote}</Text>}</View>
 </View>;
}
export function MeaningIcon({title='',name,size=26,color=P.gold}){
 const icon=name||(/foundation|growth|legacy|project|creative/i.test(title)?'Growth':/value|love|emotion|relationship/i.test(title)?'Love':/identity|human|family|sharing|child/i.test(title)?'Humanity':/book|story|learn|knowledge|research/i.test(title)?'Knowledge':/support|emergency|help|crisis/i.test(title)?'Lifebuoy':/settings|preference|language/i.test(title)?'Settings':/journey|path|life/i.test(title)?'Journey':/tech|evidence|truth|how|flow|power/i.test(title)?'Understanding':'Compass');
 return <GoldenTreeIcon name={icon} size={size} color={color}/>;
}
export function TranslationNotice(){const {preferences,t}=useAppPreferences();return preferences.language==='en'?null:<View style={s.notice}><Text style={s.noticeText}>{t('scope')}</Text></View>;}
const s=StyleSheet.create({
 header:{width:'100%',maxWidth:720,alignSelf:'center',minHeight:76,paddingHorizontal:20,paddingVertical:10,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:P.line,backgroundColor:'#193D32'},emblem:{width:44,height:44},brandCopy:{flex:1},brand:{fontSize:18,lineHeight:25,color:P.text,fontFamily:'ESSHeading'},brandSub:{fontSize:13,lineHeight:20,color:P.muted,marginTop:2},headerButton:{width:46,minHeight:46,alignItems:'center',justifyContent:'center',borderRadius:23,borderWidth:1,borderColor:P.line},
 nav:{flexDirection:'row',backgroundColor:'#061E20',borderTopWidth:1,borderTopColor:P.line,paddingTop:10,paddingHorizontal:7},navItem:{flex:1,minHeight:58,alignItems:'center',justifyContent:'center',gap:5,paddingBottom:6},navLabel:{fontSize:12,lineHeight:18,textAlign:'center'},active:{width:22,height:2,backgroundColor:P.gold,borderRadius:2,position:'absolute',bottom:0},
 banner:{backgroundColor:P.panel,borderWidth:1,borderColor:P.line,borderRadius:22,overflow:'hidden',marginBottom:20},bannerImage:{width:'100%',height:154},bannerCopy:{padding:20,paddingTop:8},bannerTitle:{fontSize:26,lineHeight:36,color:P.text,fontFamily:'ESSHeading'},bannerBody:{fontSize:16,lineHeight:25,color:P.muted,marginTop:10},quote:{fontSize:14,lineHeight:23,color:P.gold,marginTop:14},notice:{backgroundColor:P.panel2,padding:14,borderRadius:12,marginBottom:16,borderLeftWidth:2,borderLeftColor:P.gold},noticeText:{fontSize:13,lineHeight:21,color:P.muted},
});
