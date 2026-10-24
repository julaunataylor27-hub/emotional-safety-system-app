import {AppText as Text,AppInput as TextInput} from './AppPreferences';
import {presentationStyles} from './PresentationTheme';
import React, {useRef,useState} from 'react';
import {View, Image, Pressable, ScrollView, StyleSheet, Linking, Share, Alert} from 'react-native';
import M from './lifeJourney.cjs';
import useLifeJourneyNotes from './useLifeJourneyNotes';
import journeyPdfService from './journeyPdfService';

const C={bg:'#071815',panel:'#102923',border:'#7E7048',gold:'#F4D17C',light:'#FFF6DD',muted:'#D1D8CC'};
const TYPE_LABELS={family:'Family oral history',source:'Source lead',culture:'Cultural guidance',personal:'Personal interpretation'};
function Button({label,onPress,selected=false,disabled=false,id}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{selected,disabled}} disabled={disabled} onPress={onPress}
    style={[s.button,selected&&s.selected,disabled&&s.disabled]}>
    <Text style={[s.buttonText,selected&&{color:C.bg}]}>{label}</Text>
  </Pressable>;
}
function Card({title,label,children}) {
  return <View style={s.card}>{label&&<Text style={s.tag}>{label}</Text>}
    <Text accessibilityRole="header" style={s.heading}>{title}</Text>{children}</View>;
}
function Body({children}) {return <Text selectable style={s.body}>{children}</Text>;}

export default function LifeJourneyScreen({onBack,pdfService=journeyPdfService}) {
  const [index,setIndex]=useState(1);
  const [tab,setTab]=useState('record');
  const [sourcesVisible,setSourcesVisible]=useState(false);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');
  const busyRef=useRef(false),pdfCache=useRef(null);
  const memory=useLifeJourneyNotes();
  const stage=M.stages[index],note=M.getNote(memory.notes,stage);
  const editable=memory.ready&&!busy;
  const snapshot=JSON.stringify(memory.notes);
  function chooseChapter(next) {setIndex(next);setNotice('');}
  function update(change) {setNotice('');memory.update(stage,change);}
  function toggleFeeling(feeling) {
    if (!editable) return;
    update({feelings:note.feelings.includes(feeling)?note.feelings.filter(value=>value!==feeling):[...note.feelings,feeling]});
  }
  async function openSource(url) {
    try {await Linking.openURL(url);}
    catch {Alert.alert('Source could not open','The records remain available offline in this screen. Copy this URL to open it later:\n\n'+url);}
  }
  function clearChapter() {
    Alert.alert('Clear this chapter’s notes?','This clears your notes and selected possibilities for this chapter only.',[
      {text:'Cancel',style:'cancel'},
      {text:'Clear notes',style:'destructive',onPress:()=>{setNotice('');memory.clearChapter(stage);}}
    ]);
  }
  async function exportReflection(action) {
    if (!memory.ready||busyRef.current) return;
    busyRef.current=true;setBusy(true);setNotice('');
    try {
      if (action==='text') {
        await Share.share({title:'Yagan Life Journey - My Reflections',message:M.exportText(memory.notes)});
        setNotice('The text sharing menu opened. Choose where to keep or share your reflection.');
      } else {
        let document=pdfCache.current?.snapshot===snapshot?pdfCache.current.document:null;
        if (!document) {
          document=await pdfService.createLifeJourney(memory.notes);
          pdfCache.current={snapshot,document};
        }
        if (action==='open') {
          await pdfService.open(document);setNotice('PDF reader opened. Use Save PDF to My Files to keep a copy.');
        } else if (action==='share') {
          await pdfService.share(document);setNotice('The PDF sharing menu opened. Choose a destination to keep or share the PDF.');
        } else {
          const result=await pdfService.save(document);
          setNotice(result.saved?'Your Life Journey PDF was saved to the folder you chose.':result.cancelled?'Saving cancelled. Your writing is still here. Try Open My PDF or Share PDF.':'Choose Save to Files in the sharing menu to keep the PDF.');
        }
      }
    } catch {
      setNotice(action==='open'?'Could not open a PDF reader. Try Save PDF to My Files or Share PDF. Your writing is still here.':
        action==='text'?'Could not open text sharing. Try a PDF control instead. Your writing is still here.':
        'Could not export the PDF. Your writing is still here. Try again, or use Share reflection text.');
    } finally {busyRef.current=false;setBusy(false);}
  }

  return <View testID="life-journey-screen" style={s.root}>
    <Button label="Back to Home" onPress={onBack} id="life-journey-back"/>
    <View style={s.hero}>
      <Image testID="life-journey-scenic-artwork" accessible={false} resizeMode="cover" source={require('../assets/graphics/australian-humanity/my-journey-bg.webp')} style={s.journeyArt}/>
      <Text style={s.eyebrow}>EMOTIONAL SAFETY SYSTEM · HISTORICAL REFLECTION</Text>
      <Text accessibilityRole="header" style={s.title}>Yagan · Life Journey</Text>
      <Text style={s.lead}>Country, kinship and responsibility.</Text>
      <Body>Follow the records. Explore what may have mattered. Leave room for what we do not know.</Body>
      <Text style={s.mini}>Research prototype 0.1 · Possible meanings and feelings remain interpretations. This does not recreate Yagan’s mind.</Text>
    </View>
    <Text style={s.label}>Choose a life chapter</Text>
    <Text style={s.mini}>Some events overlap. Childhood has gaps in the material examined.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={s.chapterRow} keyboardShouldPersistTaps="handled">
      {M.stages.map((item,i)=><Pressable key={item.id} testID={'life-chapter-'+item.id}
        accessibilityRole="button" accessibilityLabel={'Choose chapter '+item.short}
        accessibilityState={{selected:index===i}} onPress={()=>chooseChapter(i)}
        style={[s.chapter,index===i&&s.selected]}>
        <Text style={[s.chapterNumber,index===i&&{color:C.bg}]}>{i+1} / {M.stages.length}</Text>
        <Text style={[s.chapterLabel,index===i&&{color:C.bg}]}>{item.short}</Text>
        <Text style={[s.chapterPeriod,index===i&&{color:'#30452E'}]}>{item.period}</Text>
      </Pressable>)}
    </ScrollView>
    <Text accessibilityRole="header" accessibilityLiveRegion="polite" testID="life-chapter-title" style={s.stageTitle}>{stage.title}</Text>
    <Text style={s.mini}>{stage.period}</Text><Body>{stage.summary}</Body>
    <View style={s.wrap}>
      {[['record','The record'],['meaning','Possible meaning'],['signals','Six signals']].map(([key,label])=>
        <Button key={key} label={label} selected={tab===key} onPress={()=>setTab(key)} id={'life-tab-'+key}/>)}
    </View>

    {tab==='record'&&<>
      <Card title="What the record says" label="SOURCE RECORD"><Body>{stage.record}</Body>
        <View style={s.wrap}>{stage.sources.map(id=><Button key={id} label={'Read source '+id} onPress={()=>openSource(M.sources.find(source=>source.id===id).links[0][1])}/>)}</View>
      </Card>
      <Card title="Cultural context" label="CONTEXT"><Body>{stage.culture}</Body>
        <View style={s.lenses}>{M.lenses.map(lens=><View key={lens.title} style={s.lens}><Text style={s.label}>{lens.title}</Text><Text style={s.mini}>{lens.meaning}</Text></View>)}</View>
        <Text style={s.mini}>Noongar framework: Collard, Harben &amp; van den Berg (2004).</Text>
      </Card>
      <Card title="What remains open" label="UNKNOWN"><Body>{stage.unknown}</Body></Card>
    </>}
    {tab==='meaning'&&<>
      <Card title="What may have mattered?" label="INTERPRETATION"><Body>{stage.meaning}</Body>
        <Text style={s.label}>Possible feelings to explore</Text>
        <Text style={s.mini}>A selection records your interpretation, not a confirmed feeling.</Text>
        {stage.feelings.length?<View style={s.wrap}>{stage.feelings.map(feeling=><Button key={feeling} id={'life-feeling-'+feeling.toLowerCase().replace(/\s/g,'-')}
          label={feeling} selected={note.feelings.includes(feeling)} disabled={!editable} onPress={()=>toggleFeeling(feeling)}/>)}</View>:
          <Body>No feelings are assigned in this chapter. The evidence does not support doing so.</Body>}
      </Card>
      {stage.readings.map((reading,i)=><Card key={i} title={'Possible reading '+(i+1)} label="KEEP BOTH OPEN"><Body>{reading}</Body></Card>)}
      <Card title="Questions for life lessons" label="OUR LEARNING TODAY">
        <Text style={s.mini}>These are questions for us, not claims about lessons Yagan personally learned.</Text>
        {M.lessonQuestions(stage).map(question=><Text key={question} selectable style={s.bullet}>• {question}</Text>)}
      </Card>
      <Card title="Evidence limit" label="UNKNOWN"><Body>{stage.limits}</Body></Card>
    </>}
    {tab==='signals'&&<Card title="Six reflection signals" label="QUESTIONS, NOT SCORES">
      {Object.entries(stage.signals).map(([label,body])=><View key={label} style={s.signal}><Text style={s.label}>{label}</Text><Body>{body}</Body></View>)}
    </Card>}
    <View style={s.wrap}>
      <Button label="Previous chapter" disabled={index===0} onPress={()=>chooseChapter(index-1)} id="life-previous"/>
      <Button label="Next chapter" disabled={index===M.stages.length-1} onPress={()=>chooseChapter(index+1)} id="life-next"/>
    </View>

    <Card title="Your reflection" label="YOUR NOTES">
      <Text style={s.label}>My interpretation or question</Text>
      <TextInput testID="life-reflection" accessibilityLabel="Life Journey interpretation or question" multiline maxLength={12000}
        editable={editable} value={note.reflection} onChangeText={reflection=>update({reflection})}
        placeholder="Write a possibility or a question…" placeholderTextColor="#899B8C" textAlignVertical="top" style={s.input}/>
      <Text style={s.label}>Additional knowledge - checking needed</Text>
      <View style={s.wrap}>{Object.entries(TYPE_LABELS).map(([type,label])=><Button key={type} label={label}
        selected={note.type===type} disabled={!editable} onPress={()=>update({type})}/>)}</View>
      <TextInput testID="life-additional-note" accessibilityLabel="Additional Life Journey knowledge, unverified" multiline maxLength={12000}
        editable={editable} value={note.additional} onChangeText={additional=>update({additional})}
        placeholder="Add only what you are comfortable keeping on this device…" placeholderTextColor="#899B8C" textAlignVertical="top" style={s.input}/>
      <Text style={s.mini}>This note stays labelled as unverified in this tool.</Text>
      <Text testID="life-memory-status" accessibilityLiveRegion="polite" style={s.status}>
        {memory.status==='loading'?'Loading saved Life Journey notes…':memory.status==='saving'?'Saving on this device…':
          memory.status==='load-error'?'Saved notes could not load. Retry loading before writing so they are not replaced.':
          memory.status==='save-error'?'Device autosave failed. Your current writing remains here. Retry saving or export it.':
          'Notes saved only on this device.'}
      </Text>
      {(memory.status==='load-error'||memory.status==='save-error')&&<Button label={memory.ready?'Retry saving Life Journey notes':'Retry loading Life Journey notes'} onPress={memory.retry}/>}
      <Button label="Clear this chapter’s notes" disabled={!editable} onPress={clearChapter} id="life-clear-chapter"/>
      <Text style={s.mini}>Device storage is unencrypted. Clearing app data or uninstalling can erase saved notes. Nothing is sent to an AI service or uploaded automatically.</Text>
    </Card>
    <Card title="Keep a copy" label="EXPORT CURRENT REFLECTIONS">
      <Body>The PDF includes all seven chapters, evidence, questions, sources and your current notes. Edited writing creates an updated PDF.</Body>
      <View style={s.wrap}>
        <Button label="Open My Life Journey PDF" disabled={!editable} onPress={()=>exportReflection('open')} id="life-pdf-open"/>
        <Button label="Save Life Journey PDF to My Files" disabled={!editable} onPress={()=>exportReflection('save')} id="life-pdf-save"/>
        <Button label="Share Life Journey PDF" disabled={!editable} onPress={()=>exportReflection('share')} id="life-pdf-share"/>
        <Button label="Share reflection text" disabled={!editable} onPress={()=>exportReflection('text')} id="life-text-share"/>
      </View>
      {busy&&<Text style={s.status}>Preparing your reflection…</Text>}
      {!!notice&&<Text testID="life-export-notice" accessibilityLiveRegion="polite" selectable style={s.status}>{notice}</Text>}
    </Card>
    <Button label={sourcesVisible?'Hide sources and original letters':'Sources and original letters'} onPress={()=>setSourcesVisible(value=>!value)} id="life-sources"/>
    {sourcesVisible&&M.sources.map(source=><Card key={source.id} title={'['+source.id+'] '+source.title} label={source.type.toUpperCase()}>
      <Body>{source.detail}</Body>
      {source.links.map(([label,url])=><View key={url} style={s.sourceLink}>
        <Button label={label} onPress={()=>openSource(url)}/><Text selectable style={s.url}>{url}</Text>
      </View>)}
    </Card>)}
    <View style={s.footer}><Text style={s.heading}>Curiosity with humility</Text>
      <Body>Family histories and relevant Noongar knowledge can deepen or correct this reading. The unknowns remain visible.</Body>
      <Text style={s.mini}>Emotional Safety System · Julauna Taylor · Sources reviewed 14 October 2026.</Text>
    </View>
  </View>;
}

const s=StyleSheet.create({
  root:{width:'100%',maxWidth:680,alignSelf:'center'},
  hero:{backgroundColor:'#182A22',borderColor:C.gold,borderWidth:1,borderRadius:18,padding:19,marginVertical:12},
  journeyArt:{width:'100%',height:185,borderRadius:12,marginBottom:15},
  eyebrow:{color:C.gold,fontSize:11,fontWeight:'700',lineHeight:17},title:{color:C.light,fontSize:29,lineHeight:36,fontWeight:'700',marginTop:12},
  lead:{color:C.gold,fontSize:17,lineHeight:25,marginTop:8,marginBottom:8},
  body:{color:C.light,fontSize:15,lineHeight:24},mini:{color:C.muted,fontSize:12,lineHeight:19,marginTop:7},
  tag:{color:C.gold,fontSize:10,fontWeight:'700',letterSpacing:.5,lineHeight:16,marginBottom:8},
  card:{backgroundColor:C.panel,borderWidth:1,borderColor:C.border,borderRadius:16,padding:16,marginVertical:9},
  heading:{color:C.gold,fontSize:19,lineHeight:26,fontWeight:'700',marginBottom:8},
  label:{color:C.light,fontSize:14,lineHeight:21,fontWeight:'700',marginTop:13,marginBottom:7},
  stageTitle:{color:C.light,fontSize:25,lineHeight:32,fontWeight:'700',marginTop:18},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:10,marginBottom:4},
  button:{backgroundColor:'#19382C',borderColor:C.border,borderWidth:1,borderRadius:11,paddingVertical:12,paddingHorizontal:13,minHeight:46,justifyContent:'center',alignSelf:'flex-start'},
  buttonText:{color:C.light,fontSize:13,lineHeight:20,fontWeight:'700'},selected:{backgroundColor:C.gold,borderColor:C.gold},disabled:{opacity:.5},
  chapterRow:{gap:9,paddingVertical:12},chapter:{width:166,minHeight:108,borderColor:C.border,borderWidth:1,borderRadius:13,padding:13,backgroundColor:C.panel},
  chapterNumber:{color:C.gold,fontSize:11,lineHeight:17},chapterLabel:{color:C.light,fontSize:14,lineHeight:21,fontWeight:'700',marginVertical:5},chapterPeriod:{color:C.muted,fontSize:11,lineHeight:17},
  lenses:{flexDirection:'row',flexWrap:'wrap',gap:17,marginTop:9},lens:{minWidth:95,flexGrow:1},
  bullet:{color:C.light,fontSize:15,lineHeight:24,marginTop:10},signal:{borderTopWidth:1,borderTopColor:'#4A604E',paddingTop:3,marginTop:7},
  input:{backgroundColor:C.bg,borderColor:'#809079',borderWidth:1,borderRadius:11,padding:12,color:C.light,minHeight:120,fontSize:16,lineHeight:24,marginTop:9},
  status:{color:C.gold,fontSize:13,lineHeight:21,marginTop:13,marginBottom:8},sourceLink:{marginTop:10},url:{color:C.muted,fontSize:11,lineHeight:18,marginTop:6},
  footer:{padding:15,borderTopWidth:1,borderTopColor:C.border,marginTop:22,marginBottom:20}
});

Object.assign(s,presentationStyles(s,false));
