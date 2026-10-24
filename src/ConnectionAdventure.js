import React, {useState} from 'react';
import {View, Pressable, ImageBackground, StyleSheet} from 'react-native';
import {AppText as Text} from './AppPreferences';
import {P} from './PresentationTheme';
import GoldenTreeIcon from './GoldenTreeIcons';

// Eight approved Australian Humanity landscape assets; no network or tracking.
const TRAIL = [
  {id:'spark',number:'01',title:'Find the spark',question:'What has caught your attention?',
   description:'Start with a situation or a question. You do not have to know the answer yet.',
   route:'assessment',action:'Explore a situation',
   image:require('../assets/graphics/australian-humanity/home-hero.webp')},
  {id:'clues',number:'02',title:'Follow the clues',question:'What did you actually notice?',
   description:'Separate what happened from feelings, assumptions and details still missing.',
   route:'evidence',action:'Open Evidence & Truth',
   image:require('../assets/graphics/australian-humanity/evidence-truth-card.webp')},
  {id:'sources',number:'03',title:'Trace the sources',question:'Where did this information come from?',
   description:'Follow records, dates and public sources. A question can remain unanswered.',
   route:'knowledgeTrail',action:'Open Knowledge Trail',
   image:require('../assets/graphics/australian-humanity/knowledge-card.webp')},
  {id:'paths',number:'04',title:'Discover other paths',question:'What else could explain this?',
   description:'Explore connected ideas and perspectives without deciding anyone’s intentions.',
   route:'exploreConnections',action:'Explore connections',
   image:require('../assets/graphics/australian-humanity/culture-humanity-bg.webp')},
  {id:'meaning',number:'05',title:'Find your meaning',question:'What matters to you along the way?',
   description:'Reflect on values, boundaries, belonging and choices at your own pace.',
   route:'journey',action:'Open My Humanity Journey',
   image:require('../assets/graphics/australian-humanity/emotional-safety-card.webp')},
  {id:'next',number:'06',title:'Choose a connection',question:'What safe next step feels possible?',
   description:'Find support, learn more, or pause. You always decide whether to continue.',
   route:'support',action:'Find support and next steps',
   image:require('../assets/graphics/australian-humanity/support-services-card.webp')}
];

const ACTIVE = {
  assessment:0,analysis:0,results:0,
  evidence:1,knowledgeTrail:2,
  exploreConnections:3,learn:3,learningTogether:3,culturalInquiry:3,
  journey:4,foundation:4,values:4,identity:4,story:4,projects:4,sharing:4,legacy:4,tech:4,summary:4,
  support:5
};

export function ConnectionTrailCompass({screen,onNavigate}) {
  const current = ACTIVE[screen];
  if(screen==='connectionTrail'||screen==='home') return null;
  return <Pressable testID="connection-trail-compass" accessibilityRole="button"
    accessibilityLabel="Open the connection adventure trail"
    onPress={()=>onNavigate('connectionTrail')}
    style={({pressed})=>[s.compass,pressed&&s.pressed]}>
    <View style={s.compassMark}><GoldenTreeIcon name="Compass" size={23} color={P.gold}/></View>
    <View style={s.compassCopy}>
      <Text style={s.compassEyebrow}>THE CONNECTION TRAIL</Text>
      <Text style={s.compassTitle}>{current===undefined?'Follow your own path':'Clue '+TRAIL[current].number+' · '+TRAIL[current].title}</Text>
      <View style={s.compassDots}>
        {TRAIL.map((stage,index)=><View key={stage.id} style={[s.compassDot,index===current&&s.compassDotCurrent]}/>)}
      </View>
    </View>
    <Text style={s.compassArrow}>›</Text>
  </Pressable>;
}

export default function ConnectionAdventure({onNavigate}) {
  const [focused,setFocused]=useState(0);
  const stage=TRAIL[focused];
  return <View testID="connection-adventure-screen" style={s.root}>
    <View style={s.hero}>
      <ImageBackground source={require('../assets/graphics/australian-humanity/home-hero.webp')}
        imageStyle={s.heroArt} style={s.heroArtBox} accessible={false}>
        <View style={s.heroTint}/>
        <View style={s.heroContent}>
          <View style={s.heroEyebrow}><GoldenTreeIcon name="Compass" size={23} color={P.gold}/>
            <Text style={s.goldOverline}>A JOURNEY OF DISCOVERY</Text></View>
          <Text accessibilityRole="header" style={s.heroTitle}>The Connection Trail</Text>
          <Text style={s.heroSubtitle}>Find a clue. Follow a question. Discover where knowledge and humanity connect.</Text>
          <Text style={s.heroNotice}>An open learning adventure — not a test, verdict, or investigation of another person. Choose any trail, pause or return whenever you like.</Text>
        </View>
      </ImageBackground>
    </View>

    <View style={s.map}>
      <Text style={s.label}>CHOOSE YOUR NEXT CLUE</Text>
      <Text style={s.mapIntro}>Six places to explore. No locked stages and no right or wrong route.</Text>
      <View style={s.stages}>
        {TRAIL.map((item,index)=><Pressable key={item.id}
           testID={'connection-clue-'+item.id}
           accessibilityRole="button"
           accessibilityLabel={'Clue '+item.number+': '+item.title}
           accessibilityState={{selected:focused===index}}
           onPress={()=>setFocused(index)}
           style={({pressed})=>[s.stageCircle,focused===index&&s.stageActive,pressed&&s.pressed]}>
          <Text style={[s.stageNumber,focused===index&&s.stageNumberActive]}>{item.number}</Text>
        </Pressable>)}
      </View>
      <View style={s.breadcrumb}>
        <Text style={s.breadcrumbText}>CURIOSITY</Text>
        <View style={s.breadcrumbLine}/>
        <Text style={s.breadcrumbText}>CONNECTION</Text>
      </View>
    </View>

    <View testID="connection-selected-clue" style={s.chapter}>
      <ImageBackground source={stage.image} style={s.chapterImage} imageStyle={s.chapterArt} accessible={false}>
        <View style={s.chapterShade}/>
        <View style={s.chapterTop}>
          <Text style={s.chapterNumber}>CLUE {stage.number} / 06</Text>
          <Text accessibilityRole="header" style={s.chapterTitle}>{stage.title}</Text>
        </View>
      </ImageBackground>
      <View style={s.chapterBody}>
        <Text style={s.chapterQuestion}>{stage.question}</Text>
        <Text style={s.description}>{stage.description}</Text>
        <Pressable testID="connection-open-clue" accessibilityRole="button"
          accessibilityLabel={stage.action} onPress={()=>onNavigate(stage.route)}
          style={({pressed})=>[s.action,pressed&&s.pressed]}>
          <Text style={s.actionText}>{stage.action}</Text>
          <GoldenTreeIcon name="Arrow" size={20} color={P.bg}/>
        </Pressable>
        <View style={s.chapterTools}>
          <Pressable testID="connection-previous" accessibilityRole="button"
            accessibilityLabel="Previous clue" onPress={()=>setFocused(v=>(v+TRAIL.length-1)%TRAIL.length)}
            style={s.smallAction}><Text style={s.smallActionText}>‹ Previous clue</Text></Pressable>
          <Pressable testID="connection-next" accessibilityRole="button"
            accessibilityLabel="Next clue" onPress={()=>setFocused(v=>(v+1)%TRAIL.length)}
            style={s.smallAction}><Text style={s.smallActionText}>Next clue ›</Text></Pressable>
        </View>
      </View>
    </View>

    <View style={s.endNote}>
      <GoldenTreeIcon name="Love" size={23} color={P.gold}/>
      <View style={{flex:1}}>
        <Text style={s.endTitle}>Connection is a choice, not a destination.</Text>
        <Text style={s.endBody}>You can find insight, a source, support, or simply a better question. Nothing here claims to prove what someone else feels or intends.</Text>
      </View>
    </View>
    <Pressable testID="connection-return-home" accessibilityRole="button"
      accessibilityLabel="Return to Home" onPress={()=>onNavigate('home')}
      style={s.homeButton}><Text style={s.homeText}>Return to Home</Text></Pressable>
  </View>;
}

const s=StyleSheet.create({
  root:{paddingBottom:22,gap:15},
  hero:{borderRadius:22,overflow:'hidden',borderWidth:1,borderColor:P.line},
  heroArtBox:{minHeight:280,justifyContent:'flex-end'},
  heroArt:{resizeMode:'cover'},
  heroTint:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(4,20,18,0.65)'},
  heroContent:{padding:21,gap:10},
  heroEyebrow:{flexDirection:'row',gap:10,alignItems:'center'},
  goldOverline:{fontSize:12,fontWeight:'800',letterSpacing:1.5,color:P.gold},
  heroTitle:{fontFamily:'ESSHeading',fontSize:33,lineHeight:44,color:P.text},
  heroSubtitle:{color:P.text,fontSize:17,lineHeight:27},
  heroNotice:{color:'#E6D9C4',fontSize:13,lineHeight:20,marginTop:7},
  map:{paddingVertical:12,paddingHorizontal:9,gap:12},
  label:{color:P.gold,fontWeight:'800',fontSize:12,letterSpacing:1.4},
  mapIntro:{color:P.muted,fontSize:14,lineHeight:23},
  stages:{flexDirection:'row',justifyContent:'space-between',gap:4,alignItems:'center'},
  stageCircle:{width:44,height:44,borderRadius:22,borderWidth:1.2,borderColor:P.line,backgroundColor:P.panel,alignItems:'center',justifyContent:'center'},
  stageActive:{backgroundColor:P.gold,borderColor:P.gold},
  stageNumber:{fontSize:14,fontWeight:'700',color:P.text},
  stageNumberActive:{color:P.bg},
  breadcrumb:{flexDirection:'row',alignItems:'center',gap:10},
  breadcrumbText:{fontSize:11,color:P.muted,letterSpacing:1},
  breadcrumbLine:{height:1,flex:1,backgroundColor:P.line},
  chapter:{backgroundColor:P.panel,borderRadius:20,borderWidth:1,borderColor:P.line,overflow:'hidden'},
  chapterImage:{height:225,justifyContent:'flex-end'},
  chapterArt:{resizeMode:'cover'},
  chapterShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.42)'},
  chapterTop:{padding:18,gap:8},
  chapterNumber:{color:P.gold,fontSize:13,fontWeight:'800',letterSpacing:1.3},
  chapterTitle:{color:P.text,fontFamily:'ESSHeading',fontSize:28,lineHeight:37},
  chapterBody:{padding:17,gap:14},
  chapterQuestion:{fontFamily:'ESSHeading',fontSize:22,lineHeight:31,color:P.text},
  description:{fontSize:16,lineHeight:25,color:P.muted},
  action:{minHeight:52,borderRadius:13,backgroundColor:P.gold,paddingHorizontal:16,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},
  actionText:{fontSize:15,fontWeight:'800',color:P.bg,flex:1},
  chapterTools:{flexDirection:'row',gap:10,justifyContent:'space-between'},
  smallAction:{flex:1,minHeight:46,justifyContent:'center',alignItems:'center',borderRadius:12,borderWidth:1,borderColor:P.line,backgroundColor:P.panel2,padding:9},
  smallActionText:{fontSize:13,color:P.text},
  endNote:{padding:17,flexDirection:'row',gap:13,backgroundColor:P.panel2,borderWidth:1,borderColor:P.line,borderRadius:17,alignItems:'flex-start'},
  endTitle:{fontSize:16,lineHeight:23,color:P.text,fontWeight:'700'},
  endBody:{color:P.muted,fontSize:13,lineHeight:21,marginTop:6},
  homeButton:{minHeight:47,alignItems:'center',justifyContent:'center',borderRadius:12,borderWidth:1,borderColor:P.line},
  homeText:{color:P.gold,fontSize:15,fontWeight:'700'},
  compass:{flexDirection:'row',alignItems:'center',gap:12,borderRadius:15,padding:11,marginBottom:15,borderWidth:1,borderColor:P.line,backgroundColor:P.panel},
  compassMark:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:P.gold,alignItems:'center',justifyContent:'center'},
  compassCopy:{flex:1,gap:3},
  compassEyebrow:{fontSize:10,fontWeight:'800',color:P.gold,letterSpacing:1.1},
  compassTitle:{fontSize:15,lineHeight:22,color:P.text},
  compassDots:{flexDirection:'row',gap:5,marginTop:3},
  compassDot:{width:12,height:3,borderRadius:3,backgroundColor:P.line},
  compassDotCurrent:{backgroundColor:P.gold,width:23},
  compassArrow:{fontSize:29,color:P.gold},
  pressed:{opacity:0.77}
});
