import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppText as Text,useAppPreferences} from './AppPreferences';
import GoldenTreeIcon from './GoldenTreeIcons';
import NightForestScene from './NightForestScene';
import {P,cleanLabel} from './PresentationTheme';
import {sceneForTitle} from './theme/AustralianHumanityTheme';

export function AppHeader({onNavigate}){
 const {t}=useAppPreferences();
 return <View style={s.header}>
  <View style={s.logo}><GoldenTreeIcon name="Globe" size={25} color={P.gold}/></View>
  <View style={s.brandCopy}><Text style={s.brand}>Emotional Safety System</Text><Text style={s.brandSub}>Australian Humanity</Text></View>
  <Pressable testID="app-settings" accessibilityRole="button" accessibilityLabel={t('settings')}
   onPress={()=>onNavigate('settings')} style={s.iconButton}><GoldenTreeIcon name="Settings" size={23} color={P.gold}/></Pressable>
 </View>;
}

export function AppBottomNav({screen,onNavigate}){
 const {t}=useAppPreferences(),insets=useSafeAreaInsets();
 const active=['livingConnections','culturalInquiry','knowledgeTrail','learningTogether','exploreConnections','lawRightsKinship','independenceCommitment','safeCuriosity','ancientAnimals','twoFlames','connectionTrail'].includes(screen)?'learn':
  ['journey','foundation','values','identity','story','projects','sharing','legacy','tech','summary','lifeJourney'].includes(screen)?'journey':screen;
 const items=[['home','Home'],['journey','Journey'],['learn','Knowledge'],['support','Humanity'],['more','More']];
 return <View style={[s.navShell,{paddingBottom:Math.max(8,insets.bottom)}]}>
  <View style={s.nav}>{items.map(([route,icon])=>{
   const selected=route===active||(active==='evidence'&&route==='learn');
   return <Pressable key={route} testID={'app-nav-'+route} accessibilityRole="tab" accessibilityLabel={t(route)}
    accessibilityState={{selected}} onPress={()=>onNavigate(route)} style={s.navItem}>
    <View style={[s.navIconWrap,selected&&s.navIconOn]}><GoldenTreeIcon name={icon} size={23} color={selected?P.gold:P.muted} filled={selected}/></View>
    <Text style={[s.navLabel,{color:selected?P.gold:P.muted}]}>{route==='learn'?'Learn':t(route)}</Text>
    {selected&&<View style={s.active}/>}
   </Pressable>;
  })}</View>
 </View>;
}

export function ScenicBannerV2({title,subtitle,quote}){
 return <View style={s.banner}>
  <NightForestScene height={190} scene={sceneForTitle(title)} accessibilityLabel="Illustrated Australian Country landscape; decorative scene"/>
  <View style={s.bannerShade}/>
  <View style={s.bannerCopy}>
   <Text style={s.bannerKicker}>EMOTIONAL SAFETY SYSTEM</Text>
   <Text accessibilityRole="header" style={s.bannerTitle}>{cleanLabel(title)}</Text>
   {!!subtitle&&<Text style={s.bannerBody}>{subtitle}</Text>}
   {!!quote&&<Text style={s.quote}>{quote}</Text>}
  </View>
 </View>;
}

export function MeaningIcon({title='',name,size=26,color=P.gold}){
 const icon=name||(/foundation|growth|legacy|project|creative/i.test(title)?'Growth':/value|love|emotion|relationship/i.test(title)?'Love':/identity|human|family|sharing|child/i.test(title)?'Humanity':/book|story|learn|knowledge|research/i.test(title)?'Knowledge':/support|emergency|help|crisis/i.test(title)?'Lifebuoy':/settings|preference|language/i.test(title)?'Settings':/journey|path|life/i.test(title)?'Journey':/tech|evidence|truth|how|flow|power/i.test(title)?'Understanding':'Compass');
 return <GoldenTreeIcon name={icon} size={size} color={color}/>;
}
export function TranslationNotice(){const {preferences,t}=useAppPreferences();return preferences.language==='en'?null:<View style={s.notice}><Text style={s.noticeText}>{t('scope')}</Text></View>;}

const s=StyleSheet.create({
 header:{width:'100%',maxWidth:720,alignSelf:'center',minHeight:72,paddingHorizontal:18,paddingVertical:10,flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'#03070B',borderBottomWidth:1,borderBottomColor:P.line},
 logo:{width:46,height:46,borderRadius:23,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,alignItems:'center',justifyContent:'center'},
 brandCopy:{flex:1},brand:{color:P.text,fontSize:18,lineHeight:23,fontWeight:'700'},brandSub:{color:P.muted,fontSize:12,lineHeight:18,marginTop:2},
 iconButton:{width:46,height:46,borderRadius:23,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,alignItems:'center',justifyContent:'center'},
 navShell:{backgroundColor:'#03070B',borderTopWidth:1,borderTopColor:P.line,paddingTop:5,paddingHorizontal:8},
 nav:{flexDirection:'row',width:'100%',maxWidth:720,alignSelf:'center'},navItem:{flex:1,minHeight:58,alignItems:'center',justifyContent:'center',gap:2},
 navIconWrap:{width:34,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'},navIconOn:{backgroundColor:'rgba(221,174,69,0.10)'},
 navLabel:{fontSize:10.5,lineHeight:15},active:{position:'absolute',bottom:0,width:22,height:2,borderRadius:2,backgroundColor:P.gold},
 banner:{height:240,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:P.line,backgroundColor:P.panel,marginBottom:18},
 bannerShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,7,10,0.52)'},bannerCopy:{...StyleSheet.absoluteFillObject,padding:20,justifyContent:'flex-end'},
 bannerKicker:{color:P.gold,fontSize:10.5,fontWeight:'800',letterSpacing:1.2},bannerTitle:{color:P.text,fontSize:30,lineHeight:37,fontWeight:'700',marginTop:5},
 bannerBody:{color:'#EEE8DD',fontSize:15,lineHeight:23,marginTop:7},quote:{color:P.gold,fontSize:12.5,lineHeight:19,marginTop:9},
 notice:{backgroundColor:P.panel,padding:13,borderRadius:14,marginBottom:14,borderWidth:1,borderColor:P.line},noticeText:{fontSize:12.5,lineHeight:19,color:P.muted}
});
