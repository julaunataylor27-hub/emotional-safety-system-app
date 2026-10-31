import React, {useMemo, useState} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import {processSituation} from './essCore.cjs';

const C = {
  bg:'#06131B', panel:'#0E2533', line:'#294B5E',
  text:'#FFF8ED', muted:'#A9BBC6', gold:'#F1B650',
  green:'#37C978', amber:'#F5B94C', red:'#FF5454', blue:'#3E9CFF'
};

function Section({title,children}) {
  return <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    {children}
  </View>;
}

function BulletList({items,empty='None identified'}) {
  if (!items || !items.length) return <Text style={s.muted}>{empty}</Text>;
  return items.map((item,i)=><Text key={i} style={s.body}>• {item}</Text>);
}

export default function EssCoreScreen({onBack,onSupport}) {
  const [text,setText] = useState("He hasn't replied for 6 hours. I feel rejected and I think he doesn't care.");
  const [feeling,setFeeling] = useState('Not specified');
  const result = useMemo(()=>processSituation({text,feeling}),[text,feeling]);

  const safetyColor = result.safety.urgent ? C.red :
    result.safety.classification === 'coercion' ? C.red :
    result.safety.classification === 'pressure' ? C.amber : C.green;

  return <View>
    <Pressable accessibilityRole="button" onPress={onBack} style={s.back}>
      <Text style={s.backText}>‹  Back</Text>
    </Pressable>

    <View style={s.hero}>
      <Text style={s.eyebrow}>WORKING PROTOTYPE</Text>
      <Text style={s.title}>ESS Core</Text>
      <Text style={s.subtitle}>See the system separate emotion, evidence, interpretation, uncertainty, safety and choice.</Text>
      <Text style={s.note}>Local prototype only — no remote AI is used on this screen.</Text>
    </View>

    <Section title="1 · Share what is happening">
      <TextInput
        accessibilityLabel="Describe the situation for ESS Core"
        multiline
        maxLength={2500}
        textAlignVertical="top"
        value={text}
        onChangeText={setText}
        placeholder="Describe only what you feel comfortable sharing. Avoid names and addresses."
        placeholderTextColor="#748A96"
        style={s.input}
      />
      <Text style={s.label}>Optional feeling</Text>
      <View style={s.wrap}>
        {['Not specified','Okay','Overwhelmed','Confused','Worried','Scared'].map(item=>
          <Pressable key={item} onPress={()=>setFeeling(item)}
            style={[s.pill,feeling===item&&s.pillOn]}>
            <Text style={[s.pillText,feeling===item&&s.pillTextOn]}>{item}</Text>
          </Pressable>
        )}
      </View>
    </Section>

    <Section title="2 · Emotion">
      <BulletList items={result.emotion.reported_or_detected} empty="No emotion label detected."/>
      <Text style={s.muted}>{result.emotion.note}</Text>
    </Section>

    <Section title="3 · Evidence / reported information">
      <BulletList items={result.evidence.reported_observations} empty="No separate reported observation identified."/>
      <Text style={s.muted}>{result.evidence.verification_status}</Text>
    </Section>

    <Section title="4 · Interpretation">
      <BulletList items={result.interpretation.possible_interpretations} empty="No interpretation phrase identified."/>
      <Text style={s.muted}>{result.interpretation.note}</Text>
    </Section>

    <Section title="5 · Uncertainty">
      <BulletList items={result.uncertainty.unknowns}/>
    </Section>

    <Section title="6 · Safety route">
      <View style={s.statusRow}>
        <View style={[s.dot,{backgroundColor:safetyColor}]}/>
        <View style={{flex:1}}>
          <Text style={[s.statusTitle,{color:safetyColor}]}>{result.safety.title}</Text>
          <Text style={s.muted}>{result.safety.tier} · {result.safety.classification}</Text>
        </View>
      </View>
      <BulletList items={result.safety.risks}/>
      {result.safety.urgent && <View style={s.urgent}>
        <Text style={s.urgentText}>If immediate danger is happening now, move toward safety if possible and contact emergency help.</Text>
      </View>}
    </Section>

    <Section title="7 · Choices remain yours">
      <BulletList items={result.choice.options}/>
      <Text style={s.choiceNote}>User remains in control: {result.choice.user_remains_in_control ? 'YES' : 'NO'}</Text>
    </Section>

    <Section title="8 · Next pathway">
      <View style={s.pathway}>
        <Text style={s.pathwayText}>{result.next_pathway.replaceAll('_',' → ')}</Text>
      </View>
      <Text style={s.muted}>{result.transparency.method}</Text>
    </Section>

    <Pressable accessibilityRole="button" onPress={onSupport} style={s.support}>
      <Text style={s.supportText}>Open support resources  →</Text>
    </Pressable>

    <View style={s.footer}>
      <Text style={s.footerText}>Prototype limits: {result.transparency.limits.join(' ')}</Text>
    </View>
  </View>;
}

const s=StyleSheet.create({
  back:{alignSelf:'flex-start',paddingHorizontal:12,paddingVertical:9,borderColor:C.line,borderWidth:1,borderRadius:12,marginBottom:10},
  backText:{color:C.text,fontSize:15,fontWeight:'800'},
  hero:{backgroundColor:'#0A2230',borderColor:C.gold,borderWidth:1,borderRadius:20,padding:20,marginBottom:14},
  eyebrow:{color:C.gold,fontSize:11,fontWeight:'900',letterSpacing:1.4,textAlign:'center'},
  title:{color:C.text,fontSize:34,fontWeight:'900',textAlign:'center',marginTop:5},
  subtitle:{color:C.text,fontSize:15,lineHeight:22,textAlign:'center',marginTop:8},
  note:{color:C.muted,fontSize:12,lineHeight:18,textAlign:'center',marginTop:9},
  section:{backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:18,padding:16,marginBottom:13},
  sectionTitle:{color:C.gold,fontSize:18,fontWeight:'900',marginBottom:10},
  input:{backgroundColor:C.bg,borderColor:C.line,borderWidth:1,borderRadius:14,padding:14,color:C.text,fontSize:16,minHeight:125,lineHeight:24},
  label:{color:C.text,fontWeight:'800',fontSize:13,marginTop:12,marginBottom:6},
  wrap:{flexDirection:'row',flexWrap:'wrap',gap:7},
  pill:{borderColor:C.line,borderWidth:1,borderRadius:999,paddingHorizontal:11,paddingVertical:9,backgroundColor:'#102A38'},
  pillOn:{backgroundColor:C.gold,borderColor:C.gold},
  pillText:{color:C.text,fontSize:12,fontWeight:'800'},
  pillTextOn:{color:'#172019'},
  body:{color:C.text,fontSize:13,lineHeight:20,marginVertical:2},
  muted:{color:C.muted,fontSize:11.5,lineHeight:18,marginTop:7},
  statusRow:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:6},
  dot:{width:13,height:13,borderRadius:7},
  statusTitle:{fontSize:16,fontWeight:'900'},
  urgent:{backgroundColor:'#4A2424',borderColor:C.red,borderWidth:1,borderRadius:12,padding:12,marginTop:10},
  urgentText:{color:'#FFE0DB',fontSize:13,lineHeight:19,fontWeight:'700'},
  choiceNote:{color:C.green,fontSize:12,fontWeight:'900',marginTop:10},
  pathway:{backgroundColor:'#102E40',borderColor:C.blue,borderWidth:1,borderRadius:12,padding:12,marginBottom:8},
  pathwayText:{color:C.text,fontSize:14,fontWeight:'900',textAlign:'center'},
  support:{backgroundColor:C.gold,borderRadius:13,padding:14,alignItems:'center',marginBottom:13,minHeight:48,justifyContent:'center'},
  supportText:{color:'#192018',fontSize:14,fontWeight:'900'},
  footer:{borderColor:C.line,borderWidth:1,borderRadius:12,padding:12,marginBottom:15},
  footerText:{color:C.muted,fontSize:11,lineHeight:17}
});
