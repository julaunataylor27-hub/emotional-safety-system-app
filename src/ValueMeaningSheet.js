import {AppText as Text} from './AppPreferences';
import {presentationStyles} from './PresentationTheme';
import React, { useState } from 'react';
import {View, ScrollView, Pressable, Modal, StyleSheet, Linking, Alert, useWindowDimensions} from 'react-native';
import GoldenTreeIcon from './GoldenTreeIcons';
const { CULTURAL_NOTE, SOURCES } = require('./valueMeanings.cjs');

export default function ValueMeaningSheet({ value, onClose, onReflect, heading, body, bottomInset=0 }) {
  const [showSources, setShowSources] = useState(false);
  const { height } = useWindowDimensions();
  const openSource = async url => {
    try { await Linking.openURL(url); }
    catch { Alert.alert('Source could not open', 'You can still read the definition and cultural reflection offline. Try the source again when a browser and internet connection are available.'); }
  };

  return <Modal testID="value-meaning-modal" visible transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <Pressable testID="value-meaning-backdrop" style={StyleSheet.absoluteFillObject} onPress={onClose} accessible={false}/>
      <View testID="value-meaning-sheet" accessibilityViewIsModal onAccessibilityEscape={onClose} style={[styles.sheet,{maxHeight:height*0.9,paddingBottom:Math.max(16,bottomInset)}]}>
        <View style={styles.handle} accessible={false}/>
        <View style={styles.header}>
          <GoldenTreeIcon name={value.name} size={36}/>
          <Text accessibilityRole="header" style={[styles.title,heading]}>{value.name}</Text>
          <Pressable testID="value-meaning-close" accessibilityRole="button" accessibilityLabel={'Close '+value.name+' meaning'} onPress={onClose} style={styles.close}>
            <Text style={[styles.closeText,body]} accessible={false}>×</Text>
          </Pressable>
        </View>
        <ScrollView testID="value-meaning-scroll" style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator>
          <Text accessibilityRole="header" style={[styles.label,body]}>Meaning</Text>
          <Text testID="value-meaning-definition" style={[styles.definition,body]}>{value.definition}</Text>
          <View style={styles.culture}>
            <Text accessibilityRole="header" style={[styles.label,body]}>A Noongar connection</Text>
            <Text testID="value-meaning-culture" style={[styles.paragraph,body]}>{value.culture}</Text>
          </View>
          <Text accessibilityRole="header" style={[styles.label,body]}>A question for you</Text>
          <Text testID="value-meaning-reflection" style={[styles.paragraph,body]}>{value.reflection}</Text>
          <Text style={[styles.note,body]}>{CULTURAL_NOTE}</Text>
          <Pressable testID="value-meaning-sources-toggle" accessibilityRole="button" accessibilityLabel="Sources and cultural context" accessibilityState={{expanded:showSources}} onPress={()=>setShowSources(!showSources)} style={styles.sourcesToggle}>
            <Text style={[styles.sourceHeading,body]}>Sources & cultural context {showSources?'−':'+'}</Text>
          </Pressable>
          {showSources&&<View testID="value-meaning-sources">
            <Text style={[styles.note,body]}>The cultural connections are app-authored reflections on these public resources, not quotations or claims of endorsement. Source websites open in your browser.</Text>
            {value.sources.map(id=><Pressable key={id} testID={'value-source-'+id} accessibilityRole="link" accessibilityLabel={SOURCES[id].title+', opens in browser'} onPress={()=>openSource(SOURCES[id].url)} style={styles.sourceLink}>
              <Text style={[styles.sourceText,body]}>{SOURCES[id].title} ↗</Text>
            </Pressable>)}
          </View>}
          <Pressable testID="value-meaning-reflect" accessibilityRole="button" accessibilityLabel={'Reflect on '+value.name} onPress={()=>onReflect(value.name)} style={({pressed})=>[styles.reflect,pressed&&styles.pressed]}>
            <Text style={[styles.reflectText,body]}>Reflect on {value.name} →</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  </Modal>;
}

const styles=StyleSheet.create({
  overlay:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(0,12,9,0.72)'},
  sheet:{width:'100%',maxWidth:640,alignSelf:'center',backgroundColor:'#002219',borderWidth:1,borderColor:'#AD9559',borderTopLeftRadius:26,borderTopRightRadius:26,paddingHorizontal:22},
  handle:{width:36,height:4,borderRadius:2,backgroundColor:'#AD9559',alignSelf:'center',marginTop:10,marginBottom:12},
  header:{flexDirection:'row',alignItems:'center',gap:12,paddingBottom:12,borderBottomWidth:1,borderBottomColor:'#294B3C'},
  title:{flex:1,color:'#FFF6DD',fontSize:29},close:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center'},closeText:{color:'#F4D17C',fontSize:32},
  scroll:{flexShrink:1},content:{paddingTop:20,paddingBottom:8},label:{color:'#F4D17C',fontSize:13,lineHeight:20,letterSpacing:0.5,marginBottom:6},
  definition:{color:'#FFF6DD',fontSize:19,lineHeight:28,marginBottom:20},
  culture:{backgroundColor:'#0A3026',padding:16,borderLeftWidth:2,borderLeftColor:'#F4D17C',borderRadius:8,marginBottom:20},
  paragraph:{color:'#FFF6DD',fontSize:16,lineHeight:25},note:{color:'#C4D3C9',fontSize:13,lineHeight:20,marginTop:16},
  sourcesToggle:{minHeight:44,justifyContent:'center',marginTop:8},sourceHeading:{color:'#F4D17C',fontSize:14,lineHeight:22},
  sourceLink:{minHeight:44,justifyContent:'center',paddingVertical:9},sourceText:{color:'#F4D17C',fontSize:14,lineHeight:22,textDecorationLine:'underline'},
  reflect:{backgroundColor:'#F4D17C',borderRadius:26,minHeight:52,alignItems:'center',justifyContent:'center',paddingVertical:12,paddingHorizontal:16,marginTop:20},reflectText:{color:'#08261B',fontSize:16,lineHeight:23,textAlign:'center'},pressed:{opacity:0.72},
});
