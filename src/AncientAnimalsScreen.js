import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, Linking, BackHandler} from 'react-native';
import Svg, {Rect, Path, Circle, Ellipse, G, Line} from 'react-native-svg';
import {AppText as Text} from './AppPreferences';
import {P} from './PresentationTheme';
const M=require('./ancientAnimals.cjs');

// Purpose-made learning silhouettes: no museum photo or cultural artwork is copied.
function AnimalArtwork({id}) {
 const ochre='#DDB777', dark='#183C36', sand='#F2D69C', plant='#78A897';
 return <View style={s.artBox}>
  <Svg viewBox="0 0 340 170" width="100%" height={172} accessibilityLabel={'Original simplified '+id+' animal silhouette, not a photograph'}>
   <Rect x="0" y="0" width="340" height="170" fill="#183A35"/>
   <Circle cx="273" cy="39" r="25" fill="#D1B47B" opacity=".8"/>
   <Path d="M0 135 Q60 111 126 132 Q220 108 340 129 L340 170 L0 170 Z" fill="#305447"/>
   <Path d="M0 153 Q85 137 162 151 Q260 137 340 149 L340 170 L0 170 Z" fill="#44684E"/>
   <G fill={ochre}>
    {id==='thylacoleo' && <>
      <Path d="M67 91 Q82 65 157 69 Q201 69 236 83 L248 99 L240 119 L228 120 L221 102 L192 101 L188 143 L174 143 L167 108 L114 110 L107 141 L91 141 L91 109 Q62 105 67 91 Z"/>
      <Path d="M224 78 L245 70 L265 76 L274 91 L263 104 L242 102 L229 92 Z"/>
      <Path d="M244 71 L243 57 L257 68 L266 61 L270 79 Z"/>
      <Path d="M70 83 Q39 65 29 83 Q24 91 35 98" fill="none" stroke={sand} strokeWidth="9" strokeLinecap="round"/>
      <Circle cx="259" cy="85" r="3.5" fill={dark}/>
    </>}
    {id==='diprotodon' && <>
      <Path d="M47 85 Q56 52 112 48 L199 51 Q245 56 256 96 L244 128 L226 131 L217 110 L197 117 L192 143 L173 143 L161 116 L117 116 L108 144 L89 144 L86 115 L68 120 L58 140 L40 138 L45 107 Z"/>
      <Path d="M231 75 Q267 56 284 78 L298 99 L286 117 L259 112 L242 98 Z"/>
      <Path d="M261 68 L248 52 L255 77 M276 69 L286 54 L283 82" fill="none" stroke={sand} strokeWidth="10" strokeLinecap="round"/>
      <Path d="M292 106 L302 112 L298 120" fill="none" stroke={sand} strokeWidth="5" strokeLinecap="round"/>
      <Circle cx="280" cy="91" r="3" fill={dark}/>
    </>}
    {id==='procoptodon' && <>
      <Path d="M183 38 Q211 32 221 50 L214 69 L221 87 Q226 113 203 122 L187 123 L178 102 L153 90 L158 67 Z"/>
      <Path d="M187 46 L189 23 L198 44 L204 21 L212 45" />
      <Path d="M190 108 Q163 129 150 143 L127 143 Q128 134 152 118 L166 95 Z"/>
      <Path d="M209 109 Q222 130 232 144 L257 144 L259 151 L222 151 Q208 141 191 122 Z"/>
      <Path d="M170 87 Q149 95 135 101 L132 94 L160 75" />
      <Path d="M172 107 Q119 118 69 148 Q106 140 150 121" fill="none" stroke={sand} strokeWidth="11" strokeLinecap="round"/>
      <Circle cx="208" cy="51" r="3" fill={dark}/>
    </>}
    {id==='genyornis' && <>
      <Path d="M93 70 Q128 40 174 57 Q205 71 202 107 Q198 123 170 125 L131 120 Q91 111 93 70 Z"/>
      <Path d="M176 72 Q194 57 194 28 Q194 11 208 14 Q222 18 216 35 L207 78 Z"/>
      <Path d="M215 24 L237 31 L213 36 Z" fill={sand}/>
      <Path d="M124 116 L121 148 L107 152 L131 152 L137 117 Z"/>
      <Path d="M168 114 L171 147 L158 152 L183 152 L180 116 Z"/>
      <Path d="M105 80 Q122 70 139 90 L129 107 Q114 97 105 80 Z" fill={plant}/>
      <Circle cx="208" cy="25" r="3.2" fill={dark}/>
    </>}
    {id==='varanus' && <>
      <Path d="M99 101 Q135 78 207 93 L238 85 L275 96 L290 108 L277 116 L241 109 Q211 117 177 116 L121 119 Z"/>
      <Path d="M102 100 Q64 103 20 136 Q59 118 108 117 Z"/>
      <Path d="M139 110 L123 142 L141 143 L160 118 L196 113 L218 143 L237 143 L218 108 Z"/>
      <Path d="M277 107 L306 110 L295 118 L274 115 Z" fill={sand}/>
      <Circle cx="265" cy="100" r="3.5" fill={dark}/>
    </>}
    {id==='quinkana' && <>
      <Path d="M93 105 Q137 86 214 95 L251 88 L287 100 L312 107 L307 117 L260 119 L232 109 L191 119 L138 119 Z"/>
      <Path d="M97 106 Q60 101 26 81 Q42 102 67 113 L100 117 Z"/>
      <Path d="M119 112 L108 140 L123 142 L144 118 L210 112 L231 142 L250 142 L231 106 Z"/>
      <Path d="M280 115 L305 126 L312 121 L304 114" fill={sand}/>
      <Circle cx="278" cy="101" r="3" fill={dark}/>
      <Path d="M262 116 l7 6 l7 -6 l7 6 l7 -7" stroke={dark} strokeWidth="1.5" fill="none"/>
    </>}
   </G>
   <Line x1="15" y1="152" x2="322" y2="152" stroke={sand} strokeOpacity=".3" strokeWidth="1"/>
  </Svg>
  <Text style={s.artCaption}>Original conceptual illustration · Not a specimen photo</Text>
 </View>;
}

function Button({id,label,onPress,primary,selected}) {
 return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
  accessibilityState={selected===undefined?{}:{selected}} onPress={onPress}
  style={({pressed})=>[s.button,primary&&s.primary,selected&&s.selected,pressed&&{opacity:.78}]}>
  <Text style={[s.buttonText,(primary||selected)&&s.primaryText]}>{label}</Text>
 </Pressable>;
}

export default function AncientAnimalsScreen({onBack,onScrollTop}) {
 const [tab,setTab]=useState('animals'),[selected,setSelected]=useState(null),[error,setError]=useState(null);
 function goTab(next){setTab(next);setSelected(null);setError(null);onScrollTop?.();}
 function close(){if(selected){setSelected(null);onScrollTop?.();}else if(tab!=='animals')goTab('animals');else onBack();}
 useEffect(()=>{
  const sub=BackHandler.addEventListener('hardwareBackPress',()=>{close();return true;});
  return ()=>sub.remove();
 },[tab,selected,onBack,onScrollTop]);
 async function openSource(url){
  setError(null);
  try{await Linking.openURL(url);}catch{setError(url);}
 }
 function EvidenceLink({label,url,id}) {
  return <Button id={id} label={label} onPress={()=>openSource(url)}/>;
 }
 return <View testID="ancient-animals-screen" style={s.root}>
  <Button id="ancient-back" label={selected?'Back to animal gallery':tab==='animals'?'Back to Learn':'Back to animals'} onPress={close}/>
  <Text style={s.eyebrow}>{M.META.status}</Text>
  <Text accessibilityRole="header" style={s.title}>{M.META.title}</Text>
  <Text style={s.lead}>{M.META.lead}</Text>
  <View style={s.tabs}>
   {[
     ['animals','Animals & fossils'],['yamuti','The Yamuti account'],['evidence','How evidence works']
   ].map(([key,label])=><View key={key} style={s.tabItem}><Button id={'ancient-tab-'+key} label={label}
     selected={tab===key} onPress={()=>goTab(key)}/></View>)}
  </View>
  {tab==='animals'&&<View testID="ancient-animal-gallery" style={s.section}>
   <Text style={s.note}>{M.META.artwork}</Text>
   <Text style={s.note}>{M.META.scope}</Text>
   {M.ANIMALS.map(animal=><View key={animal.id} testID={'ancient-animal-'+animal.id} style={s.card}>
    <Text style={s.type}>{animal.type}</Text>
    <Text accessibilityRole="header" style={s.heading}>{animal.name}</Text>
    <Text style={s.latin}>{animal.scientific}</Text>
    <AnimalArtwork id={animal.id}/>
    <Text style={s.body}>{animal.summary}</Text>
    <Text style={s.small}>{animal.time}</Text>
    <Button id={'ancient-detail-'+animal.id} label={selected===animal.id?'Hide evidence details':'Explore fossil evidence'}
      selected={selected===animal.id} onPress={()=>{
       setSelected(value=>value===animal.id?null:animal.id);setError(null);
      }}/>
    {selected===animal.id&&<View testID={'ancient-detail-content-'+animal.id} style={s.detail}>
     <Text style={s.detailHeading}>What the fossils show</Text><Text style={s.body}>{animal.fossil}</Text>
     <Text style={s.detailHeading}>What is reconstructed</Text><Text style={s.body}>{animal.interpretation}</Text>
     <Text style={s.detailHeading}>A question to explore</Text><Text style={s.body}>{animal.question}</Text>
     <EvidenceLink id={'ancient-source-'+animal.id} label="Open museum images and source record" url={animal.source}/>
     {animal.id==='quinkana'&&<EvidenceLink id="ancient-quinkana-collection" label="See museum specimen photos, including a Quinkana tooth" url={M.SOURCES.evidence.url}/>}
    </View>}
   </View>)}
   <Text style={s.small}>{M.META.overlap}</Text>
  </View>}
  {tab==='yamuti'&&<View testID="ancient-yamuti" style={s.section}>
   <Text accessibilityRole="header" style={s.heading}>Yamuti — a living account shared by Jacinta Koolmatrie</Text>
   <Text style={s.body}>Jacinta Koolmatrie, an Adnyamathanha and Ngarrindjeri writer, shares her childhood memory of being taught about the Yamuti in an Australian Museum article.</Text>
   <Text style={s.body}>She reflects on whether the Yamuti and the enormous extinct marsupial Diprotodon could be connected. This is an invitation to consider knowledge across generations, not a scientific identification of the Yamuti as Diprotodon.</Text>
   <Text style={s.body}>Cultural knowledge belongs to the people and communities who hold it. This page links to Jacinta's words rather than reproducing her family's drawing or retelling the account as if it belonged to this app.</Text>
   <View style={s.detail}><Text style={s.detailHeading}>What is known, and what remains open?</Text>
    <Text style={s.body}>Fossils establish that Diprotodon existed. Jacinta's article establishes her attributed account of the Yamuti. The proposed connection is her possibility, not a settled fossil classification.</Text></View>
   <EvidenceLink id="ancient-source-yamuti" label="Read Jacinta Koolmatrie's original article" url={M.SOURCES.yamuti.url}/>
   <Text style={s.small}>Cultural review and permissions for any further adaptation are still pending. No endorsement is claimed.</Text>
  </View>}
  {tab==='evidence'&&<View testID="ancient-evidence-guide" style={s.section}>
   <Text accessibilityRole="header" style={s.heading}>How do we know?</Text>
   {[
    ['1 · Fossil evidence','Bones, teeth, footprints, caves and eggshells can be photographed, studied, compared and dated. Museums hold material that others can examine.'],
    ['2 · Scientific reconstruction','Artists and scientists use fossil anatomy and living relatives to estimate appearance. Fur, colour, movement and behaviour may remain uncertain.'],
    ['3 · First Nations knowledge','Living oral traditions are cultural knowledge with their own custodians and meanings. They should be attributed and not treated as an interchangeable fossil or museum category.'],
    ['4 · Time matters','Pangaea began breaking up roughly 200 million years ago. Australia later formed part of Gondwana. People and Australian megafauna lived vastly later, across parts of the Pleistocene.'],
    ['5 · Ancient landscapes','At lower sea levels, Australia and New Guinea formed the larger landmass Sahul. Boundaries then were different from modern national borders.']
   ].map(([heading,body])=><View key={heading} style={s.card}>
    <Text style={s.detailHeading}>{heading}</Text><Text style={s.body}>{body}</Text>
   </View>)}
   <Text style={s.small}>Evidence is not always a yes-or-no answer. Compare the date of each specimen and the method behind each claim.</Text>
   <EvidenceLink id="ancient-source-evidence" label="Browse museum fossil photos" url={M.SOURCES.evidence.url}/>
   <EvidenceLink id="ancient-source-pangaea" label="Pangaea and Gondwana source" url={M.SOURCES.pangaea.url}/>
   <EvidenceLink id="ancient-source-sahul" label="Ancient Sahul map source" url={M.SOURCES.country.url}/>
  </View>}
  {!!error&&<View testID="ancient-link-error" style={s.detail} accessibilityLiveRegion="polite">
   <Text style={s.small}>The external website could not open. Copy this address or try again.</Text>
   <Text selectable style={s.url}>{error}</Text>
   <Button id="ancient-link-retry" label="Try website again" onPress={()=>openSource(error)}/>
  </View>}
  <Text style={s.credit}>Curiosity and evidence learning · Emotional Safety System · Julauna Taylor</Text>
 </View>;
}
const s=StyleSheet.create({
 root:{width:'100%',gap:15,paddingBottom:28},
 eyebrow:{fontSize:13,lineHeight:20,color:P.gold},
 title:{fontFamily:'ESSHeading',fontSize:30,lineHeight:39,color:P.text},
 lead:{fontSize:17,lineHeight:28,color:P.muted},
 tabs:{flexDirection:'row',flexWrap:'wrap',gap:8},tabItem:{flexGrow:1,minWidth:130},
 section:{gap:15},
 card:{backgroundColor:P.panel,borderRadius:20,borderWidth:1,borderColor:P.line,padding:16,gap:12},
 heading:{fontSize:22,lineHeight:32,color:P.text,fontWeight:'600'},
 latin:{fontSize:15,lineHeight:24,fontStyle:'italic',color:P.muted},
 type:{fontSize:13,lineHeight:21,color:P.gold},
 body:{fontSize:16,lineHeight:27,color:P.text},
 small:{fontSize:14,lineHeight:23,color:P.muted},
 note:{fontSize:14,lineHeight:23,color:P.muted,borderLeftWidth:2,borderLeftColor:P.gold,paddingLeft:12},
 button:{minHeight:50,borderColor:P.line,borderWidth:1,borderRadius:14,backgroundColor:P.panel2,paddingHorizontal:14,paddingVertical:13,justifyContent:'center'},
 selected:{backgroundColor:P.gold,borderColor:P.gold},
 primary:{backgroundColor:P.gold,borderColor:P.gold},
 buttonText:{fontSize:15,lineHeight:23,color:P.text,textAlign:'center',fontWeight:'600'},
 primaryText:{color:P.bg},
 detail:{padding:14,backgroundColor:P.bg,borderRadius:13,gap:11,borderLeftWidth:2,borderLeftColor:P.gold},
 detailHeading:{fontSize:18,lineHeight:27,color:P.gold,fontWeight:'600'},
 artBox:{backgroundColor:'#183A35',borderRadius:14,overflow:'hidden'},
 artCaption:{fontSize:12,lineHeight:20,color:P.muted,paddingHorizontal:9,paddingBottom:8},
 url:{fontSize:13,lineHeight:22,color:P.gold},
 credit:{fontSize:13,lineHeight:21,color:P.muted},
});