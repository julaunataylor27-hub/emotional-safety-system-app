import React, {useState} from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
const M = require('./twoFlames.cjs');

// Matches the existing night-and-gold palette. No network calls or storage.
const C = {
  bg:'#06131B', panel:'#0E2533', panel2:'#143244', line:'#294B5E',
  text:'#FFF8ED', muted:'#A9BBC6', gold:'#F1B650', green:'#37C978'
};

export default function TwoFlamesScreen({onSupport}) {
  const [selected, setSelected] = useState(null);
  const active = M.findReflection(selected);

  return <View testID="two-flames-screen" style={s.root}>
    <View style={s.hero}>
      <Image testID="two-flames-landscape" accessible={false} resizeMode="cover" source={require("../assets/graphics/australian-humanity/two-flames-bg.webp")} style={s.heroArt}/>
      <Text style={s.kicker}>EMOTIONAL SAFETY · SHARED LIGHT</Text>
      <View style={s.flames} accessible accessibilityLabel="Two separate flames with shared light between them">
        <View style={s.flameColumn}><View style={s.flameRing}><Text style={s.flame}>🔥</Text></View><Text style={s.flameCaption}>MY SPARK</Text></View>
        <View style={s.centerSymbol}><Text style={s.star}>✦</Text><Text style={s.connection}>CHOICE</Text></View>
        <View style={s.flameColumn}><View style={s.flameRing}><Text style={s.flame}>🔥</Text></View><Text style={s.flameCaption}>THEIR SPARK</Text></View>
      </View>
      <Text accessibilityRole="header" style={s.title}>{M.TITLE}</Text>
      <Text style={s.quote}>{M.QUOTE}</Text>
      <Text style={s.lead}>Two people can help one another rediscover joy while remaining free to heal at their own pace.</Text>
    </View>

    <Text accessibilityRole="header" style={s.sectionTitle}>Three parts of shared light</Text>
    {M.PRINCIPLES.map((item, index) => <View key={item.id} style={s.card} testID={'two-flames-principle-' + item.id}>
      <Text style={s.number}>0{index + 1} · {item.title}</Text>
      <Text style={s.cardTitle}>{item.subtitle}</Text>
      <Text style={s.body}>{item.explanation}</Text>
    </View>)}

    <Text accessibilityRole="header" style={s.sectionTitle}>Explore a gentle next step</Text>
    <Text style={s.intro}>Choose a reflection. Nothing you select is stored or shared.</Text>
    <View style={s.choices}>
      {M.REFLECTIONS.map(item => <Pressable key={item.id} testID={'two-flames-choice-' + item.id}
        accessibilityRole="button" accessibilityLabel={item.label}
        accessibilityState={{selected: selected === item.id}}
        onPress={() => setSelected(current => current === item.id ? null : item.id)}
        style={({pressed}) => [s.choice, selected === item.id && s.choiceSelected, pressed && s.pressed]}>
        <Text style={[s.choiceText, selected === item.id && s.choiceTextSelected]}>{item.label}</Text>
      </Pressable>)}
    </View>
    {active && <View testID="two-flames-reflection" accessibilityLiveRegion="polite" style={s.reflection}>
      <Text style={s.cardTitle}>{active.question}</Text>
      <Text style={s.body}>{active.example}</Text>
    </View>}

    <View style={s.note}>
      <Text style={s.noteTitle}>Your freedom matters</Text>
      <Text style={s.noteText}>{M.LIMITS}</Text>
      <Pressable testID="two-flames-support" accessibilityRole="button"
        accessibilityLabel="Open support resources" onPress={onSupport} style={s.support}>
        <Text style={s.supportText}>Find support resources  →</Text>
      </Pressable>
    </View>
  </View>;
}
const s = StyleSheet.create({
  root:{paddingBottom:22},
  hero:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:22,padding:20,marginBottom:24,alignItems:'center'},
  heroArt:{width:'100%',height:200,borderRadius:16,marginBottom:16},
  kicker:{fontSize:12,color:C.gold,fontWeight:'700',letterSpacing:1.0,textAlign:'center'},
  flames:{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:24,marginBottom:16,width:'100%'},
  flameColumn:{alignItems:'center',flex:1},
  flameRing:{width:88,height:88,borderRadius:44,borderWidth:2,borderColor:C.gold,backgroundColor:'#34301D',justifyContent:'center',alignItems:'center'},
  flame:{fontSize:44},
  flameCaption:{fontSize:12,fontWeight:'800',letterSpacing:0.4,color:C.gold,marginTop:9},
  centerSymbol:{alignItems:'center',width:62},
  star:{fontSize:32,color:C.gold},
  connection:{fontSize:10,color:C.muted,fontWeight:'700',marginTop:5},
  title:{fontSize:26,lineHeight:34,fontWeight:'800',color:C.text,textAlign:'center',marginBottom:10},
  quote:{fontSize:17,lineHeight:26,color:C.gold,textAlign:'center',fontStyle:'italic',marginBottom:12},
  lead:{fontSize:15,lineHeight:24,color:C.text,textAlign:'center'},
  sectionTitle:{fontSize:21,lineHeight:29,fontWeight:'800',color:C.text,marginBottom:13},
  card:{backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:17,padding:17,marginBottom:12},
  number:{fontSize:13,fontWeight:'800',color:C.gold,marginBottom:5},
  cardTitle:{fontSize:17,fontWeight:'800',lineHeight:25,color:C.text,marginBottom:7},
  body:{fontSize:15,lineHeight:24,color:C.text},
  intro:{fontSize:15,lineHeight:24,color:C.muted,marginBottom:13},
  choices:{flexDirection:'row',flexWrap:'wrap',gap:9,marginBottom:13},
  choice:{minHeight:50,minWidth:'46%',flexGrow:1,padding:12,borderRadius:12,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,alignItems:'center',justifyContent:'center'},
  choiceSelected:{backgroundColor:C.gold,borderColor:C.gold},
  choiceText:{fontSize:15,fontWeight:'700',color:C.text},
  choiceTextSelected:{color:C.bg},
  reflection:{backgroundColor:C.panel2,borderWidth:1,borderColor:C.gold,borderRadius:16,padding:18,marginBottom:18},
  note:{backgroundColor:C.panel,borderRadius:17,borderColor:C.line,borderWidth:1,padding:18,marginTop:8},
  noteTitle:{fontSize:17,fontWeight:'800',color:C.green,marginBottom:6},
  noteText:{fontSize:14,lineHeight:22,color:C.muted},
  support:{backgroundColor:C.gold,borderRadius:13,minHeight:50,padding:13,alignItems:'center',justifyContent:'center',marginTop:14},
  supportText:{fontSize:15,fontWeight:'800',color:C.bg},
  pressed:{opacity:0.78}
});
