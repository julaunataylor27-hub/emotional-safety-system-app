import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppText as Text, useAppPreferences} from './AppPreferences';
import GoldenTreeIcon from './GoldenTreeIcons';
const {design, screenFamily} = require('./unifiedHumanityTheme.cjs');

/**
 * One navigation component for the cinematic Home and reflective screens.
 * The selected tab and testID prefix are supplied by the parent, but the
 * order, fonts, contrast, icons and touch targets come from one design source.
 * Only presentation changes here; route handlers are supplied unchanged.
 */
export default function UnifiedAppNavigation({
  active = 'home', onNavigate, testIDPrefix = 'app-nav', includeSafeArea = true,
}) {
  const insets = useSafeAreaInsets();
  const {t} = useAppPreferences();
  const selected = screenFamily(active) === 'shared' ? active : screenFamily(active);
  const nav = design.components.navigation;
  return <View testID={testIDPrefix + '-container'} style={[
    s.nav, {backgroundColor:nav.backgroundColor,
      paddingBottom:includeSafeArea?Math.max(8,insets.bottom):5},
  ]}>
    {design.nav.map(item => {
      const current = selected === item.route;
      const label = item.route === 'evidence' ? item.label : t(item.route);
      const color = current ? nav.activeColor : nav.textColor;
      return <Pressable key={item.route} testID={testIDPrefix+'-'+item.route}
        accessibilityRole="tab" accessibilityLabel={label}
        accessibilityState={{selected:current}}
        onPress={() => onNavigate(item.route)}
        style={({pressed})=>[s.tab,pressed&&s.pressed]}>
        <GoldenTreeIcon name={item.icon} size={23} color={color} filled={current}/>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}
          style={[s.label,{color}]}>{label}</Text>
        {current&&<View style={[s.active,{backgroundColor:nav.activeColor}]}/>}
      </Pressable>;
    })}
  </View>;
}
const s = StyleSheet.create({
  nav:{width:'100%',maxWidth:640,alignSelf:'center',flexDirection:'row',
    borderTopWidth:1,borderTopColor:'#A4865D',paddingTop:9,paddingHorizontal:4},
  tab:{flex:1,minHeight:58,alignItems:'center',justifyContent:'center',gap:4,
    paddingHorizontal:1,paddingBottom:7},
  label:{fontSize:13,lineHeight:19,textAlign:'center',maxWidth:'100%'},
  active:{position:'absolute',bottom:0,width:27,height:2,borderRadius:2},
  pressed:{opacity:0.75},
});
