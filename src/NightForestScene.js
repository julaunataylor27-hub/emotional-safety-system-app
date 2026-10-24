import React from 'react';
import {Image,View,StyleSheet} from 'react-native';
import {SCENES} from './theme/AustralianHumanityTheme';

// Compatibility adapter: existing callers keep their props/test IDs while the
// old illustrated tree is replaced by the approved photographic Country theme.
export default function NightForestScene({
  height=260,style,testID,accessibilityLabel,fade=true,scene='journey'
}) {
  const artwork=SCENES[scene]||SCENES.journey;
  return <View accessible testID={testID}
    accessibilityLabel={accessibilityLabel||'Illustrated Australian landscape beneath the night sky'}
    style={[s.wrap,{height},style]}>
    <Image source={artwork} resizeMode="cover" accessible={false}
      style={s.artwork}/>
    {fade&&<View pointerEvents="none" style={s.readability}/>}
  </View>;
}
const s=StyleSheet.create({
  wrap:{overflow:'hidden',width:'100%',backgroundColor:'#081A27'},
  artwork:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  readability:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(5,15,25,0.24)'}
});
