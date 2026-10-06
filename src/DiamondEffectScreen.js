import React, {useRef,useState} from 'react';
import {View,Text,TextInput,Pressable,PanResponder,StyleSheet,Share,Linking} from 'react-native';
import {CORNERS,CHOICE_CHECKS,cornerAtPoint,compareChoice,needsProtectiveSupport,buildDiamondPlan} from './diamondEffect';
import journeyPdfService from './journeyPdfService';

const keys=Object.keys(CORNERS);
function Button({children,onPress,selected=false,disabled=false}) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected,disabled}} disabled={disabled} onPress={onPress} style={[styles.button,selected&&styles.selected,disabled&&{opacity:.5}]}><Text style={[styles.buttonText,selected&&{color:'#152919'}]}>{children}</Text></Pressable>;
}
function Field({label,value,onChangeText}) {
  return <View><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} multiline value={value} onChangeText={onChangeText} placeholder="Write in your own words…" placeholderTextColor="#879890" textAlignVertical="top" style={styles.input}/></View>;
}
export default function DiamondEffectScreen({result,draft,onChange,onBack,onReview,onSupport}) {
  const [corner,setCorner]=useState('truth');
  const [size,setSize]=useState(280);
  const [point,setPoint]=useState({x:140,y:140});
  const [notice,setNotice]=useState('');
  const [planVisible,setPlanVisible]=useState(false);
  const [busy,setBusy]=useState(false);
  const busyRef=useRef(false);
  const drag=useRef({size:280,point:{x:140,y:140},start:{x:140,y:140},corner:'truth'});
  drag.current.size=size; drag.current.point=point; drag.current.corner=corner;
  const selectCorner=key=>{
    setCorner(key);
    const half=drag.current.size/2, edge=44, far=drag.current.size-edge;
    setPoint({truth:{x:half,y:edge},values:{x:edge,y:half},beliefs:{x:far,y:half},faith:{x:half,y:far}}[key]);
  };
  const responder=useRef(null);
  if(!responder.current) responder.current=PanResponder.create({
    onStartShouldSetPanResponder:()=>true,
    onMoveShouldSetPanResponder:()=>true,
    onPanResponderGrant:()=>{drag.current.start={...drag.current.point};},
    onPanResponderMove:(_,gesture)=>{
      const bound=value=>Math.max(22,Math.min(drag.current.size-22,value));
      const next={x:bound(drag.current.start.x+gesture.dx),y:bound(drag.current.start.y+gesture.dy)};
      drag.current.point=next; setPoint(next);
    },
    onPanResponderRelease:()=>setCorner(cornerAtPoint(drag.current.point.x,drag.current.point.y,drag.current.size)),
    onPanResponderTerminationRequest:()=>false,
    onShouldBlockNativeResponder:()=>true
  });
  const update=(key,value)=>onChange({...draft,[key]:value});
  const updateChoice=(index,changes)=>onChange({...draft,choices:draft.choices.map((choice,i)=>i===index?{...choice,...changes}:choice)});
  const protective=needsProtectiveSupport(result);
  let plan='',planError='';
  try {plan=buildDiamondPlan(draft,result);} catch(error) {planError=error.message;}
  const build=()=>{setPlanVisible(true);setNotice(planError||'Your next-step plan is ready. Read it before saving or sharing.');};
  const exportPlan=async action=>{
    if(busyRef.current||!plan) return;
    busyRef.current=true;setBusy(true);setNotice('');
    try {
      if(action==='share') {
        await Share.share({title:'My Diamond Next Step',message:plan});
        setNotice('Your plan is ready in the sharing menu. Choose where to keep or share it.');
      } else {
        const document=await journeyPdfService.createPlan(plan);
        const outcome=await journeyPdfService.save(document);
        setNotice(outcome.saved?'Your Diamond plan was saved to the folder you chose.':outcome.cancelled?'Saving cancelled. Your plan is still here.':'Choose Save to Files in the sharing menu to keep your plan.');
      }
    } catch {setNotice('Your plan could not be exported. Your words are still here; try again or press and hold the plan to copy it.');}
    finally {busyRef.current=false;setBusy(false);}
  };
  return <View>
    <Button onPress={onBack}>‹ Back to my assessment</Button>
    <Text style={styles.title}>My Diamond Effect</Text>
    <Text style={styles.lead}>Pause. Reflect. Choose one manageable next step. You can examine a choice without judging your worth.</Text>
    <View style={[styles.card,protective&&styles.priority]}>
      <Text style={styles.heading}>{protective?'Protective support comes first':'Safety facts stay separate from reflection'}</Text>
      <Text style={styles.body}>{result.structuralSafety?.summary||result.level}</Text>
      <Text style={styles.body}>Moving the diamond changes the reflection prompt. It does not clear a safety concern.</Text>
      <Button onPress={onReview}>Review key safety facts</Button>
      <Button onPress={onSupport}>Find support</Button>
      {result.structuralSafety?.immediate&&<Button onPress={()=>Linking.openURL('tel:000')}>Call emergency 000</Button>}
      {result.structuralSafety?.childConcern&&<>
        <Button onPress={()=>Linking.openURL('tel:1800273889')}>WA Child Protection · 1800 273 889</Button>
        <Button onPress={()=>Linking.openURL(result.structuralSafety.sourceUrl)}>Read WA child safety guidance</Button>
      </>}
    </View>
    <View style={styles.card}>
      <Text style={styles.heading}>Truth · Values · Beliefs · Faith</Text>
      <Text style={styles.body}>Drag the gold point toward a corner, or tap a word below.</Text>
      <View testID="diamond-canvas" accessibilityRole="adjustable" accessibilityLabel="Diamond reflection corner" accessibilityValue={{text:CORNERS[corner].title}} accessibilityActions={[{name:'increment',label:'Next corner'},{name:'decrement',label:'Previous corner'}]} onAccessibilityAction={event=>{
        const direction=event.nativeEvent.actionName==='decrement'?-1:1;
        selectCorner(keys[(keys.indexOf(drag.current.corner)+direction+keys.length)%keys.length]);
      }} onLayout={event=>{
        const width=event.nativeEvent.layout.width;
        if(width>0&&width!==drag.current.size){setSize(width);setPoint({x:width/2,y:width/2});}
      }} style={{width:'100%',height:size}} {...responder.current.panHandlers}>
        <View pointerEvents="none" style={[styles.diamond,{width:size*.52,height:size*.52,left:size*.24,top:size*.24}]}/>
        <Text pointerEvents="none" style={[styles.corner,{top:6,left:size/2-40}]}>Truth</Text>
        <Text pointerEvents="none" style={[styles.corner,{top:size/2-10,left:0}]}>Values</Text>
        <Text pointerEvents="none" style={[styles.corner,{top:size/2-10,right:0}]}>Beliefs</Text>
        <Text pointerEvents="none" style={[styles.corner,{bottom:6,left:size/2-40}]}>Faith</Text>
        <View pointerEvents="none" style={[styles.point,{left:point.x-11,top:point.y-11}]}/>
      </View>
      <View style={styles.wrap}>{keys.map(key=><Button key={key} selected={corner===key} onPress={()=>selectCorner(key)}>{CORNERS[key].title}</Button>)}</View>
      <Text accessibilityLiveRegion="polite" style={styles.heading}>{CORNERS[corner].title}</Text>
      <Text style={styles.body}>{CORNERS[corner].prompt}</Text>
      <Field label={corner==='truth'?'My observations':CORNERS[corner].title+' reflection'} value={draft[corner]} onChangeText={value=>update(corner,value)}/>
      {corner==='truth'&&<Field label="What I still do not know" value={draft.unknowns} onChangeText={value=>update('unknowns',value)}/>}
    </View>
    <Text style={styles.heading}>Compare two choices</Text>
    <Text style={styles.body}>The calculation counts your own checks. More supported checks can help you reflect; they do not predict an outcome or prove safety.</Text>
    {draft.choices.map((choice,index)=>{
      const compared=compareChoice(choice);
      return <View key={index} style={styles.card}>
        <Field label={`Option ${index+1}`} value={choice.text} onChangeText={value=>updateChoice(index,{text:value})}/>
        {CHOICE_CHECKS.map((label,checkIndex)=><View key={label}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.wrap}>{['Yes','No','Unsure'].map(value=><Pressable key={value} accessibilityRole="radio" accessibilityLabel={`Option ${index+1}, check ${checkIndex+1}, ${value}`} accessibilityState={{checked:choice.checks[checkIndex]===value}} onPress={()=>updateChoice(index,{checks:choice.checks.map((old,i)=>i===checkIndex?value:old)})} style={[styles.choice,choice.checks[checkIndex]===value&&styles.selected]}><Text style={[styles.buttonText,choice.checks[checkIndex]===value&&{color:'#152919'}]}>{value}</Text></Pressable>)}</View>
        </View>)}
        <Text accessibilityLiveRegion="polite" style={styles.body}>{compared.supported} of 5 checks supported · {compared.unsure} unsure · {compared.needsAttention} need attention</Text>
        {compared.safetyGap&&<Text style={styles.body}>A harm or boundary check needs attention. Revise this option before using it in a plan.</Text>}
        {compared.safetyUnclear&&!compared.safetyGap&&<Text style={styles.body}>Safety or boundaries are still uncertain. Pause and clarify them before acting.</Text>}
        <Button selected={draft.chosen===index} disabled={!choice.text.trim()||compared.safetyGap} onPress={()=>update('chosen',index)}>Use option {index+1} in my plan</Button>
      </View>;
    })}
    <View style={styles.card}>
      <Text style={styles.heading}>Leave with a purpose</Text>
      <Field label="My purpose" value={draft.purpose} onChangeText={value=>update('purpose',value)}/>
      <Field label="One manageable next step" value={draft.nextStep} onChangeText={value=>update('nextStep',value)}/>
      <Field label="My protective support step" value={draft.supportStep} onChangeText={value=>update('supportStep',value)}/>
      {protective&&<Text style={styles.body}>Include a protective support step while this assessment has a safeguarding concern. Your reflection cannot remove that concern.</Text>}
      <Button onPress={build}>Build my next-step plan</Button>
      <Text accessibilityLiveRegion="polite" style={styles.body}>{busy?'Preparing your plan…':notice}</Text>
    </View>
    {planVisible&&plan&&<View style={styles.card}>
      <Text style={styles.heading}>My next-step plan</Text>
      <Text selectable style={styles.body}>{plan}</Text>
      <Button disabled={busy} onPress={()=>exportPlan('pdf')}>Save my plan as PDF</Button>
      <Button disabled={busy} onPress={()=>exportPlan('share')}>Share my plan as text</Button>
    </View>}
    <Text style={styles.body}>These reflections stay in this app session. Save your PDF or copy your plan before closing the app. Your assessment writing is not added to GitHub or shared automatically.</Text>
  </View>;
}

const styles=StyleSheet.create({
  title:{fontSize:29,fontWeight:'900',color:'#FFE29A',marginVertical:15},lead:{fontSize:16,color:'#D5E0D6',lineHeight:25,marginBottom:18},
  card:{backgroundColor:'#071b16',borderWidth:1,borderColor:'#967239',borderRadius:20,padding:18,marginBottom:18},priority:{borderColor:'#FFBD32'},
  heading:{fontSize:19,fontWeight:'800',color:'#FFE29A',marginVertical:9},body:{fontSize:15,lineHeight:23,color:'#D5E0D6',marginVertical:6},
  label:{fontSize:15,fontWeight:'700',color:'#FFF7E3',marginTop:15,marginBottom:8},input:{borderWidth:1,borderColor:'#5b796a',borderRadius:12,minHeight:100,padding:12,color:'#FFF7E3',fontSize:16,backgroundColor:'#07141c'},
  button:{borderWidth:1,borderColor:'#b28a3d',borderRadius:12,padding:13,marginVertical:5,backgroundColor:'#123127',minHeight:46},buttonText:{color:'#FFE29A',fontWeight:'700',fontSize:14,textAlign:'center'},
  selected:{backgroundColor:'#FFBD32'},wrap:{flexDirection:'row',flexWrap:'wrap',gap:8},choice:{borderWidth:1,borderColor:'#b28a3d',borderRadius:10,paddingVertical:10,paddingHorizontal:16,minHeight:44},
  diamond:{position:'absolute',borderWidth:2,borderColor:'#D9A72D',transform:[{rotate:'45deg'}],backgroundColor:'#102c20'},corner:{position:'absolute',color:'#FFE29A',fontWeight:'800',width:80,textAlign:'center',fontSize:14},point:{position:'absolute',width:22,height:22,borderRadius:11,backgroundColor:'#FFCD4C',borderWidth:2,borderColor:'#fff1bf'}
});
