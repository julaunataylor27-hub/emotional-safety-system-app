import React,{useRef,useState} from 'react';
import {View,Text,TextInput,Pressable,PanResponder,StyleSheet,Linking} from 'react-native';
import {TRIANGLE_PROMPTS,TRIANGLE_QUESTIONS,triangleCornerAtPoint,reflectTriangle} from './diamondEffect';
import {PAIR_FEELINGS,PAIR_SOURCES,PAIR_SCOPES,emptyFeelingPair,feelingPairKey,analyseFeelingPair} from './feelingPair';

const keys=Object.keys(TRIANGLE_PROMPTS),colours={care:'#F5A8BA',pressure:'#FFBD32',freedom:'#78C4E3'};
const changes={choice:{title:'More room to choose',text:'A possible aim: allow time, a genuine no and an alternative without pressure. This is not a promise of safety or an instruction to confront someone.'},
  boundaries:{title:'Clearer boundaries',text:'A possible aim: name one boundary you can safely keep. If setting it could expose someone to harm, seek appropriate support first.'},
  support:{title:'Appropriate support',text:'A possible aim: ask a qualified support service to help clarify the concern and a safer next step. You do not have to resolve the whole situation alone.'}};
function Line({from,to,colour}) {
  const length=Math.hypot(to.x-from.x,to.y-from.y),angle=Math.atan2(to.y-from.y,to.x-from.x)*180/Math.PI;
  return <View pointerEvents="none" style={{position:'absolute',height:2,width:length,left:(from.x+to.x-length)/2,top:(from.y+to.y)/2,backgroundColor:colour,transform:[{rotate:angle+'deg'}]}}/>;
}
export default function ReflectionTriangle({value,onChange,protective}) {
  const [width,setWidth]=useState(280),[focus,setFocus]=useState('care'),[point,setPoint]=useState({x:140,y:100});
  const [change,setChange]=useState(null),[linkError,setLinkError]=useState(false);
  const [picker,setPicker]=useState(null),[pairNotice,setPairNotice]=useState('');
  const drag=useRef({width:280,point:{x:140,y:100},start:{x:140,y:100},focus:'care'});
  drag.current.width=width;drag.current.point=point;drag.current.focus=focus;
  const vertices={care:{x:width/2,y:40},pressure:{x:36,y:210},freedom:{x:width-36,y:210}};
  const select=key=>{setFocus(key);setPoint(vertices[key]);};
  const responder=useRef(null);
  if(!responder.current) responder.current=PanResponder.create({
    onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,
    onPanResponderGrant:()=>{drag.current.start={...drag.current.point};},
    onPanResponderMove:(_,gesture)=>{
      const next={x:Math.max(20,Math.min(drag.current.width-20,drag.current.start.x+gesture.dx)),y:Math.max(25,Math.min(225,drag.current.start.y+gesture.dy))};
      drag.current.point=next;setPoint(next);
    },
    onPanResponderRelease:()=>setFocus(triangleCornerAtPoint(drag.current.point.x,drag.current.point.y,drag.current.width)),
    onPanResponderTerminationRequest:()=>false,onShouldBlockNativeResponder:()=>true
  });
  const reflection=reflectTriangle(value);
  const pair=value.feelingPair||emptyFeelingPair();
  const reviewed=!!value.pairReviewKey&&value.pairReviewKey===feelingPairKey(value);
  let finding=null;
  if(reviewed)finding=analyseFeelingPair(value,reflection);
  const update=(key,next)=>{setPairNotice('');onChange({...value,[key]:next,pairReviewKey:null});};
  const updateFeeling=(index,changes)=>update('feelingPair',pair.map((item,i)=>i===index?{...item,...changes}:item));
  const findWord=()=>{
    try{const next=analyseFeelingPair(value,reflection);onChange({...value,pairReviewKey:next.key});setPairNotice('Read why this word could fit, and the questions about what caused the feelings.');}
    catch(error){setPairNotice(error.message);}
  };
  const centre=finding?.centre||(pair.every(item=>item.feeling!=='Unknown')?'Explore this pair':'Choose two feelings');
  const openReference=async url=>{try{await Linking.openURL(url);setLinkError(false);}catch{setLinkError(url);}};
  return <View style={styles.card}>
    <Text style={styles.heading}>Two feelings · find a middle word</Text>
    <Text style={styles.body}>Bring two feelings together, then explore a word for their meaning and possible dynamic. They can belong to one person in the same situation or to two different people.</Text>
    {pair.map((item,index)=><View key={index} style={[styles.feelingCard,{borderColor:index===0?colours.care:colours.freedom}]}>
      <Text style={styles.label}>Feeling {index+1}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Choose Feeling ${index+1}`} accessibilityState={{expanded:picker===index}} onPress={()=>setPicker(picker===index?null:index)} style={styles.button}><Text style={styles.buttonText}>{item.feeling==='Unknown'?'Choose a feeling':item.feeling} ▾</Text></Pressable>
      {picker===index&&<View style={styles.wrap}>{PAIR_FEELINGS.map(feeling=><Pressable accessibilityRole="radio" accessibilityLabel={`Feeling ${index+1}, ${feeling}`} accessibilityState={{checked:item.feeling===feeling}} key={feeling} onPress={()=>{updateFeeling(index,{feeling});setPicker(null);}} style={[styles.button,item.feeling===feeling&&styles.selected]}><Text style={[styles.buttonText,item.feeling===feeling&&{color:'#102b23'}]}>{feeling}</Text></Pressable>)}</View>}
      <Text style={styles.label}>Whose feeling? (optional)</Text><TextInput accessibilityLabel={`Feeling ${index+1} belongs to`} maxLength={80} value={item.who} onChangeText={who=>updateFeeling(index,{who})} placeholder="For example: me or person affected" placeholderTextColor="#879890" style={styles.shortInput}/>
      <Text style={styles.label}>How is this feeling known?</Text><View style={styles.wrap}>{PAIR_SOURCES.map(source=><Pressable accessibilityRole="radio" accessibilityLabel={`Feeling ${index+1} source, ${source}`} accessibilityState={{checked:item.source===source}} key={source} onPress={()=>updateFeeling(index,{source})} style={[styles.button,item.source===source&&styles.selected]}><Text style={[styles.buttonText,item.source===source&&{color:'#102b23'}]}>{source}</Text></Pressable>)}</View>
    </View>)}
    <Text style={styles.label}>How do these two feelings relate?</Text><View style={styles.wrap}>{PAIR_SCOPES.map(scope=><Pressable accessibilityRole="radio" accessibilityLabel={`Feeling pair scope, ${scope}`} accessibilityState={{checked:(value.pairScope||'Unsure')===scope}} key={scope} onPress={()=>update('pairScope',scope)} style={[styles.button,value.pairScope===scope&&styles.selected]}><Text style={[styles.buttonText,value.pairScope===scope&&{color:'#102b23'}]}>{scope}</Text></Pressable>)}</View>
    <Text style={styles.equation}>{pair[0].feeling} × {pair[1].feeling} → {centre}</Text>
    <Text style={styles.body}>Here, × means “consider together”. This explores vocabulary and context; it does not multiply emotions into a factual cause.</Text>
    <Pressable accessibilityRole="button" onPress={findWord} style={styles.button}><Text style={styles.buttonText}>Find a possible middle word</Text></Pressable>
    <Text accessibilityLiveRegion="polite" style={styles.body}>{pairNotice}</Text>
    <Text style={styles.heading}>Love, pain and choice</Text>
    <Text style={styles.body}>Care, pressure and freedom give the pair context. Drag the light or tap a corner to change the question. Its position is not a score.</Text>
    <View testID="reflection-triangle" accessibilityRole="adjustable" accessibilityLabel="Triangle reflection focus" accessibilityValue={{text:TRIANGLE_PROMPTS[focus].title}} accessibilityActions={[{name:'increment',label:'Next corner'},{name:'decrement',label:'Previous corner'}]} onAccessibilityAction={event=>{
      const direction=event.nativeEvent.actionName==='decrement'?-1:1;
      select(keys[(keys.indexOf(drag.current.focus)+direction+keys.length)%keys.length]);
    }} onLayout={event=>{const next=event.nativeEvent.layout.width;if(next>0&&next!==width){setWidth(next);setPoint({x:next/2,y:100});}}} style={{width:'100%',height:250}} {...responder.current.panHandlers}>
      <Line from={vertices.care} to={vertices.pressure} colour={colours.care}/>
      <Line from={vertices.pressure} to={vertices.freedom} colour={colours.pressure}/>
      <Line from={vertices.freedom} to={vertices.care} colour={colours.freedom}/>
      {keys.map(key=><View pointerEvents="none" key={key} style={[styles.node,{left:vertices[key].x-12,top:vertices[key].y-12,borderColor:colours[key],backgroundColor:focus===key?colours[key]:'#102b23'}]}/>)}
      <Text pointerEvents="none" style={[styles.vertex,{top:0,left:width/2-70,color:colours.care}]}>Care / connection</Text>
      <Text pointerEvents="none" style={[styles.vertex,{bottom:0,left:0,width:110,color:colours.pressure}]}>Pressure / pain</Text>
      <Text pointerEvents="none" style={[styles.vertex,{bottom:0,right:0,width:110,color:colours.freedom}]}>Choice / boundaries</Text>
      <View pointerEvents="none" style={[styles.centre,{left:width/2-80}]}><Text style={styles.caption}>WORD TO EXPLORE</Text><Text style={styles.pattern}>{centre}</Text></View>
      <View pointerEvents="none" style={[styles.light,{left:point.x-10,top:point.y-10}]}/>
    </View>
    <View style={styles.wrap}>{keys.map(key=><Pressable accessibilityRole="button" accessibilityState={{selected:focus===key}} key={key} onPress={()=>select(key)} style={[styles.button,{borderColor:colours[key]}]}><Text style={styles.buttonText}>{TRIANGLE_PROMPTS[key].title}</Text></Pressable>)}</View>
    <Text accessibilityLiveRegion="polite" style={styles.label}>{TRIANGLE_PROMPTS[focus].prompt}</Text>
    {finding&&<View testID="feeling-pair-result" style={styles.change}>
      <Text accessibilityLiveRegion="polite" style={styles.heading}>A possible middle word · {finding.centre}</Text>
      <Text style={styles.label}>Meaning of the feeling pair · {finding.word}</Text><Text style={styles.body}>{finding.meaning}</Text>
      <Text style={styles.label}>Why this word could fit</Text>{finding.basis.map(item=><Text key={item} style={styles.body}>• {item}</Text>)}
      {finding.contextWord&&<><Text style={styles.body}>The reported dynamic to explore is {finding.contextWord}. It is based on the behaviour checks, shown below. The feeling pair does not establish that dynamic.</Text></>}
      <Text style={styles.label}>Questions about the possible why</Text>{finding.questions.map(item=><Text key={item} style={styles.body}>• {item}</Text>)}
      <Text style={styles.body}>{finding.causeLimit}</Text>
      <Text style={styles.label}>What remains unconfirmed</Text>{finding.unknowns.length?finding.unknowns.map(item=><Text key={item} style={styles.body}>• {item}</Text>):<Text style={styles.body}>No additional missing details were identified by this form. The selected feelings and their causes are still not independently verified.</Text>}
      <Text style={styles.body}>{finding.explanation}</Text>
      {finding.sourceUrl&&<Pressable accessibilityRole="link" onPress={()=>openReference(finding.sourceUrl)} style={styles.button}><Text style={styles.buttonText}>Read the meaning of ambivalence · APA Dictionary</Text></Pressable>}
    </View>}
    {Object.entries(TRIANGLE_QUESTIONS).map(([key,question])=><View key={key}>
      <Text style={styles.label}>{question.question}</Text>
      <View style={styles.wrap}>{['Yes','No','Unsure'].map(answer=><Pressable accessibilityRole="radio" accessibilityLabel={`Triangle ${key}, ${answer}`} accessibilityState={{checked:value[key]===answer}} key={answer} onPress={()=>update(key,answer)} style={[styles.button,value[key]===answer&&styles.selected]}><Text style={[styles.buttonText,value[key]===answer&&{color:'#102b23'}]}>{answer}</Text></Pressable>)}</View>
    </View>)}
    <Text style={styles.body}>For the possible why, record what happened just before each feeling: specific words, actions or changes. Keep a cause you suspect separate from what you observed.</Text>
    {[['evidence','Specific behaviour behind these answers'],['unknowns','What remains uncertain in this pattern'],['impact','Emotional impact in this situation']].map(([key,label])=><View key={key}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} multiline textAlignVertical="top" value={value[key]} onChangeText={text=>update(key,text)} placeholder="Keep observations and interpretations distinct…" placeholderTextColor="#879890" style={styles.input}/></View>)}
    <Pressable accessibilityRole="button" onPress={findWord} style={styles.button}><Text style={styles.buttonText}>Update the middle word with this context</Text></Pressable>
    <Text style={styles.label}>Separate behaviour and choice review</Text>
    <Text accessibilityLiveRegion="polite" style={styles.heading}>{reflection.phrase}</Text>
    <Text style={styles.equation}>{reflection.equation}</Text>
    <Text style={styles.body}>This is a symbolic reflection, not a validated emotional equation. “Coercive caretaking” is a short app reflection phrase for reported care, pressure, restricted choice and repetition; it is not a diagnosis or proof of coercive control.</Text>
    <Text style={styles.label}>Why this phrase appears</Text>
    {reflection.basis.map(item=><Text key={item} style={styles.body}>• {item}</Text>)}
    {!!reflection.unknowns.length&&<Text style={styles.body}>Still unclear: {reflection.unknowns.join(', ')}. Missing context stays unknown.</Text>}
    <Text style={styles.body}>Feelings and appearances cannot establish motives, consent or safety. {protective?'Your existing safeguarding concern still applies.':'This reflection does not confirm that a situation is safe.'}</Text>
    <Text style={styles.label}>Explore a change</Text>
    <View style={styles.wrap}>{Object.entries(changes).map(([key,item])=><Pressable key={key} accessibilityRole="button" accessibilityState={{selected:change===key}} onPress={()=>setChange(key)} style={styles.button}><Text style={styles.buttonText}>{item.title}</Text></Pressable>)}</View>
    {change&&<View style={styles.change}><Text style={styles.equation}>Care + choice + boundaries + support → a direction to explore</Text><Text style={styles.body}>{changes[change].text}</Text><Text style={styles.body}>This explores an aim. It does not change the reported situation or remove a safety concern. Write a practical action in your next-step plan below.</Text></View>}
    <Pressable accessibilityRole="link" onPress={()=>openReference('https://1800respect.org.au/coercive-control')} style={styles.button}><Text style={styles.buttonText}>Read 1800RESPECT guidance on coercive control</Text></Pressable>
    {linkError&&<Text selectable style={styles.body}>The page could not open. Copy this address to your browser: {linkError}</Text>}
  </View>;
}
const styles=StyleSheet.create({
  card:{backgroundColor:'#071b16',borderWidth:1,borderColor:'#967239',borderRadius:20,padding:18,marginBottom:18},
  heading:{fontSize:19,fontWeight:'800',color:'#FFE29A',marginVertical:9},body:{fontSize:15,lineHeight:23,color:'#D5E0D6',marginVertical:6},
  label:{fontSize:15,fontWeight:'700',color:'#FFF7E3',marginTop:15,marginBottom:8},wrap:{flexDirection:'row',flexWrap:'wrap',gap:8},
  button:{borderWidth:1,borderColor:'#b28a3d',borderRadius:12,padding:12,marginVertical:5,backgroundColor:'#123127',minHeight:46},buttonText:{color:'#FFE29A',fontWeight:'700',fontSize:14,textAlign:'center'},selected:{backgroundColor:'#FFBD32'},
  input:{borderWidth:1,borderColor:'#5b796a',borderRadius:12,minHeight:90,padding:12,color:'#FFF7E3',fontSize:16,backgroundColor:'#07141c'},
  shortInput:{borderWidth:1,borderColor:'#5b796a',borderRadius:12,minHeight:48,padding:12,color:'#FFF7E3',fontSize:16,backgroundColor:'#07141c'},feelingCard:{borderWidth:1,borderRadius:15,padding:12,marginTop:12,backgroundColor:'#0a231c'},
  node:{position:'absolute',width:24,height:24,borderRadius:12,borderWidth:2},vertex:{position:'absolute',width:140,textAlign:'center',fontSize:12,fontWeight:'700'},
  centre:{position:'absolute',top:105,width:160,padding:10,borderRadius:16,backgroundColor:'#0f2922',borderWidth:1,borderColor:'#597b69'},caption:{fontSize:10,color:'#A4BFB0',textAlign:'center'},pattern:{fontSize:15,lineHeight:20,fontWeight:'800',textAlign:'center',color:'#FFF3D2',marginTop:5},
  light:{position:'absolute',width:20,height:20,borderRadius:10,backgroundColor:'#FFF0AD',borderWidth:3,borderColor:'#FFBD32'},equation:{fontSize:16,lineHeight:24,color:'#FFE29A',fontWeight:'700',marginVertical:8},change:{padding:12,borderRadius:12,borderWidth:1,borderColor:'#597b69',marginVertical:8}
});
