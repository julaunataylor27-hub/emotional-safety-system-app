import React,{useEffect,useState} from 'react';
import {View,Pressable,ScrollView,Modal,StyleSheet,Linking,BackHandler,useWindowDimensions} from 'react-native';
import {AppText as Text} from './AppPreferences';
import {P} from './PresentationTheme';
import GoldenTreeIcon from './GoldenTreeIcons';
const M=require('./culturalConnections.cjs');

function Button({id,label,onPress,selected,expanded,children,style}){
 return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
  accessibilityState={{...(selected===undefined?{}:{selected}),...(expanded===undefined?{}:{expanded})}}
  onPress={onPress} style={({pressed})=>[s.button,selected&&s.selected,style,pressed&&s.pressed]}>
  <Text style={[s.buttonText,selected&&s.selectedText]}>{children||label}</Text>
 </Pressable>;
}

function SourceLink({id,source}){
 const [failed,setFailed]=useState(false);
 const [label,url]=source;
 async function open(){
  setFailed(false);
  try{await Linking.openURL(url);}catch{setFailed(true);}
 }
 return <View style={s.source}>
  <Pressable testID={id} accessibilityRole="link" accessibilityLabel={label+', opens an external source'}
   onPress={open} style={({pressed})=>[s.sourceButton,pressed&&s.pressed]}>
   <View style={s.sourceCopy}><Text style={s.sourceLabel}>Read original source{url.toLowerCase().endsWith('.pdf')?' · PDF':''}</Text><Text style={s.sourceTitle}>{label}</Text></View>
   <GoldenTreeIcon name="Arrow" size={20} color={P.gold}/>
  </Pressable>
  {failed&&<View testID={id+'-error'} accessibilityLiveRegion="polite" style={s.linkError}>
   <Text style={s.small}>The website could not open. You can select and copy this address, or tap the link to try again.</Text>
   <Text selectable style={s.url}>{url}</Text>
  </View>}
 </View>;
}

function ChoiceSheet({title,onClose,children}){
 const {height}=useWindowDimensions();
 return <Modal transparent visible animationType="none" onRequestClose={onClose}>
  <View style={s.overlay}>
   <View accessibilityViewIsModal onAccessibilityEscape={onClose} style={[s.sheet,{maxHeight:height*0.85}]}>
    <Text accessibilityRole="header" style={s.heading}>{title}</Text>
    <Button label={'Close '+title.toLowerCase()} onPress={onClose}>Close</Button>
    <ScrollView style={s.choiceScroll} contentContainerStyle={s.options} keyboardShouldPersistTaps="handled">{children}</ScrollView>
   </View>
  </View>
 </Modal>;
}

export default function CulturalConnectionsScreen({onBack,onExplore}){
 const [viewId,setViewId]=useState('songlines'),[itemIndex,setItemIndex]=useState(null);
 const [choosing,setChoosing]=useState(false),[wordsVisible,setWordsVisible]=useState(false);
 const [wordIndex,setWordIndex]=useState(0),[choosingWord,setChoosingWord]=useState(false),[sourcesVisible,setSourcesVisible]=useState(false);
 const {width}=useWindowDimensions();
 useEffect(()=>{const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{onBack();return true;});return()=>subscription.remove();},[onBack]);
 const view=M.views[viewId],selected=itemIndex===null?null:view.nodes[itemIndex];
 const source=selected?selected.source:view.source;
 const word=M.words[wordIndex];
 function chooseView(id){setViewId(id);setItemIndex(null);setChoosing(false);}
 return <View testID="cultural-connections-screen" style={s.root}>
  <Button id="connections-back" label="Back to Learn" onPress={onBack} style={s.back}/>
  <View style={s.hero}>
   <GoldenTreeIcon name="Knowledge" size={38} color={P.gold}/>
   <Text accessibilityRole="header" style={s.title}>{M.META.title}</Text>
   <Text style={s.lead}>{M.META.purpose}</Text>
   <View testID="connections-draft-status" style={s.draft}>
    <Text style={s.draftTitle}>{M.META.status}</Text><Text style={s.small}>{M.META.date}</Text>
    <Text style={s.small}>{M.META.review}</Text>
   </View>
   <Text style={s.body}>{M.META.scope}</Text>
   <Text style={s.small}>Some historical sources contain names of deceased people and accounts of colonial harm.</Text>
   {!!onExplore&&<Button id="connections-explore-inquiry" label="Compare & stay curious" onPress={onExplore}>Compare accounts and follow a question</Button>}
  </View>

  <Text accessibilityRole="header" style={s.section}>Explore a connection</Text>
  <Button id="connections-choose-view" label="Choose a connection" expanded={choosing} onPress={()=>setChoosing(!choosing)}>
   {M.VIEW_OPTIONS.find(([id])=>id===viewId)[1]+'  '+(choosing?'−':'+')}
  </Button>
  {choosing&&<ChoiceSheet title="Connection choices" onClose={()=>setChoosing(false)}><View testID="connections-view-options">
   {M.VIEW_OPTIONS.map(([id,label])=><Button key={id} id={'connections-view-'+id} label={label} selected={id===viewId} onPress={()=>chooseView(id)}>
    {label+'\n'+(M.views[id].type==='comparison'?'Comparison of distinct accounts':'Documented connection in the cited source')}
   </Button>)}
  </View></ChoiceSheet>}

  <View testID="connections-diagram" accessibilityLabel="Schematic connection diagram" style={s.diagram}>
   <Text style={s.hub} accessibilityRole="header">{view.hub}</Text><Text style={s.scope}>{view.scope}</Text>
   <Text style={s.legend}>{view.type==='comparison'?'Comparison of public accounts · not a descent link':'Documented connection · see the source for its scope'}</Text>
   <View style={s.branches}>
    {view.nodes.map((item,index)=><View key={viewId+'-'+index} style={[s.node,width>=600&&s.wideNode]}>
     <View style={s.branch} accessible={false}/>
     <Button id={'connections-node-'+index} label={item.label} selected={itemIndex===index} onPress={()=>setItemIndex(index)}>{item.label}</Button>
    </View>)}
   </View>
  </View>
  <View testID="connections-detail" accessibilityLiveRegion="polite" style={s.card}>
   <Text style={s.evidence}>{M.evidenceLabel(source,itemIndex===null&&view.type==='comparison')}</Text>
   <Text accessibilityRole="header" style={s.heading}>{selected?selected.label:view.title}</Text>
   <Text selectable style={s.body}>{selected?selected.detail:view.detail}</Text>
   <SourceLink key={source} id="connections-detail-source" source={M.sources[source]}/>
  </View>

  <Button id="connections-words-toggle" label="20 public words and concepts" expanded={wordsVisible} onPress={()=>setWordsVisible(!wordsVisible)}/>
  {wordsVisible&&<View testID="connections-word-guide" style={s.card}>
   <Text style={s.small}>Brief source orientations. Local meanings and use protocols apply. Cultural review is pending.</Text>
   <Button id="connections-choose-word" label="Choose a word or concept" expanded={choosingWord} onPress={()=>setChoosingWord(!choosingWord)}>{word[0]+'  '+(choosingWord?'−':'+')}</Button>
   {choosingWord&&<ChoiceSheet title="Word and concept choices" onClose={()=>setChoosingWord(false)}>{M.words.map((entry,index)=><Button key={entry[0]} id={'connections-word-'+index} label={entry[0]+' · '+entry[1]} selected={wordIndex===index} onPress={()=>{setWordIndex(index);setChoosingWord(false);}}/>)}</ChoiceSheet>}
   <View testID="connections-word-detail" accessibilityLiveRegion="polite">
    <Text accessibilityRole="header" style={s.heading}>{word[0]}</Text><Text style={s.evidence}>{word[1]}</Text><Text selectable style={s.body}>{word[2]}</Text>
    <SourceLink key={word[3]} id="connections-word-source" source={M.sources[word[3]]}/>
   </View>
  </View>}

  <Button id="connections-sources-toggle" label="Sources and further reading" expanded={sourcesVisible} onPress={()=>setSourcesVisible(!sourcesVisible)}/>
  {sourcesVisible&&<View testID="connections-source-directory">
   <Text accessibilityRole="header" style={s.section}>{Object.keys(M.sources).length} research sources</Text>
   <Text style={s.small}>Websites and PDFs open in your browser only when you tap a link.</Text>
   {Object.entries(M.sources).map(([id,reference])=><SourceLink key={id} id={'connections-source-'+id} source={reference}/>)}
   <Text accessibilityRole="header" style={s.section}>Language, family history and review guidance</Text>
   {M.READING_LINKS.map(([id,label,url])=><SourceLink key={id} id={'connections-resource-'+id} source={[label,url]}/>)}
  </View>}
  <View style={s.footer}><Text style={s.small}>{M.META.limits}</Text><Text style={s.small}>{M.META.review}</Text></View>
  <Button id="connections-finish" label="Return to Learn" onPress={onBack}/>
 </View>;
}

const s=StyleSheet.create({
 root:{width:'100%'},back:{alignSelf:'flex-start',marginBottom:18},
 overlay:{flex:1,backgroundColor:'rgba(0,12,9,0.8)',justifyContent:'center',padding:18},sheet:{width:'100%',maxWidth:680,alignSelf:'center',backgroundColor:P.bg,borderWidth:1,borderColor:P.line,borderRadius:20,padding:18,gap:9},choiceScroll:{flexShrink:1},
 hero:{gap:13,marginBottom:22},title:{fontFamily:'ESSHeading',fontSize:30,lineHeight:39,color:P.text},lead:{fontSize:17,lineHeight:27,color:P.gold},
 draft:{padding:16,borderLeftWidth:2,borderLeftColor:P.gold,backgroundColor:P.panel2,gap:7,borderRadius:8},draftTitle:{fontSize:15,lineHeight:24,color:P.gold,fontWeight:'600'},
 body:{fontSize:16,lineHeight:26,color:P.text},small:{fontSize:13,lineHeight:22,color:P.muted},section:{fontSize:19,lineHeight:28,color:P.text,marginTop:12,marginBottom:12,fontWeight:'600'},
 button:{minHeight:50,paddingVertical:13,paddingHorizontal:16,borderRadius:14,borderWidth:1,borderColor:P.line,backgroundColor:P.panel,justifyContent:'center',marginVertical:5},buttonText:{fontSize:15,lineHeight:24,color:P.text},selected:{backgroundColor:P.gold,borderColor:P.gold},selectedText:{color:P.bg},pressed:{opacity:0.76},options:{gap:3,marginVertical:8},
 diagram:{marginTop:20,marginBottom:16},hub:{fontSize:21,lineHeight:30,color:P.gold,textAlign:'center',fontWeight:'600'},scope:{fontSize:13,lineHeight:22,color:P.muted,textAlign:'center',marginTop:4},legend:{fontSize:13,lineHeight:22,color:P.muted,marginTop:13,marginBottom:15},
 branches:{borderLeftWidth:1,borderLeftColor:P.line,marginLeft:7,flexDirection:'row',flexWrap:'wrap'},node:{width:'100%',paddingLeft:18,position:'relative'},wideNode:{width:'50%'},branch:{position:'absolute',left:0,top:30,width:18,height:1,backgroundColor:P.line},
 card:{padding:19,backgroundColor:P.panel,borderRadius:18,borderWidth:1,borderColor:P.line,marginBottom:18,gap:9},evidence:{fontSize:13,lineHeight:22,color:P.gold},heading:{fontSize:20,lineHeight:29,color:P.text,fontWeight:'600'},
 source:{marginVertical:5},sourceButton:{minHeight:54,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:P.line},sourceCopy:{flex:1,gap:4},sourceLabel:{fontSize:13,lineHeight:21,color:P.muted},sourceTitle:{fontSize:15,lineHeight:24,color:P.gold,textDecorationLine:'underline'},url:{fontSize:13,lineHeight:22,color:P.gold},linkError:{gap:8,paddingVertical:12},footer:{marginTop:19,marginBottom:16,gap:10},
});
