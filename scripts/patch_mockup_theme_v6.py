"""Final mockup-theme pass.

Runs after all legacy feature patches. The approved mockup is the source of truth:
- compact Learning Centre rows
- five-tab bottom nav supplied by PresentationChrome
- no legacy oversized learning cards
This patch is intentionally visual/navigation-only.
"""
from pathlib import Path

p=Path("App.js")
s=p.read_text(encoding="utf-8")
marker="// MOCKUP_THEME_FINAL_V6"
if marker in s:
    print("Mockup theme already applied.")
    raise SystemExit(0)

start=s.find("      {screen==='learn'&&<>")
end=s.find("      {screen==='support'",start)
if start<0 or end<0:
    raise SystemExit("Mockup theme: Learning Centre block anchors missing")

learn="""      {screen==='learn'&&<>
        <BackTitle title="Learning Centre" onBack={()=>go('home')} />
        <Text style={styles.mockupLead}>Choose a trail. Each one opens a focused learning path without changing your personal writing.</Text>
        <TextInput accessibilityLabel="Search learning topics" value={learningQuery} onChangeText={setLearningQuery}
          placeholder="Search learning topics…" placeholderTextColor={P.muted} style={styles.searchBox}/>
        {!!learningQuery.trim()&&!LEARNING_TOPICS.some(([,title,sub])=>(title+' '+sub).toLowerCase().includes(learningQuery.trim().toLowerCase()))&&
          <Text style={styles.body}>No matching topics. Try another word.</Text>}
        <View style={styles.mockupList}>
          {matchesTwoFlamesSearch(learningQuery)&&<MenuRow title="Two Flames — Healing Without Control" subtitle="Two sparks, shared light, mutual choice and room to heal" onPress={()=>go('twoFlames')} accent={P.gold}/>}
          {matchesAncientAnimalsSearch(learningQuery)&&<MenuRow title="Ancient Australian Animals & Evidence" subtitle="Six prehistoric creatures, fossil images and the Yamuti account" onPress={()=>go('ancientAnimals')} accent={P.gold}/>}
          {matchesCuriositySearch(learningQuery)&&<MenuRow title="Safe Curiosity Lab" subtitle="Try private, age-appropriate learning and safety examples · Prototype" onPress={()=>go('safeCuriosity')} accent={P.gold}/>}
          {matchesBalanceSearch(learningQuery)&&<MenuRow title="Independence & commitment" subtitle="Make room for yourself, choose a commitment and plan a check-in" onPress={()=>go('independenceCommitment')} accent={P.gold}/>}
          {matchesLawSearch(learningQuery)&&<MenuRow title="Law, Rights & Kinship" subtitle="Australian and WA law, cultural responsibilities and Parliament" onPress={()=>go('lawRightsKinship')} accent={P.gold}/>}
          {matchesExploreSearch(learningQuery)&&<MenuRow title="Explore connections" subtitle="Link a question with experiences, sources, unknowns and choices" onPress={()=>go('exploreConnections')} accent={P.gold}/>}
          {matchesTogetherSearch(learningQuery)&&<MenuRow title="Learning together" subtitle="Try encouragement, pace, timing, knowledge, conversation and peace" onPress={()=>go('learningTogether')} accent={P.gold}/>}
          {matchesTrailSearch(learningQuery)&&<MenuRow title="Knowledge Trail" subtitle="Follow a question with Tim Berners-Lee, or explore your own" onPress={()=>go('knowledgeTrail')} accent={P.gold}/>}
          {matchesInquirySearch(learningQuery)&&<MenuRow title="Compare & stay curious" subtitle="Explore cultural accounts, their sources and unanswered questions" onPress={()=>go('culturalInquiry')} accent={P.gold}/>}
          {matchesCulturalSearch(learningQuery)&&<MenuRow title="Living connections" subtitle="An educational cultural research draft, with original sources" onPress={()=>go('livingConnections')} accent={P.gold}/>}
          {LEARNING_TOPICS.filter(([,title,sub])=>(title+' '+sub).toLowerCase().includes(learningQuery.trim().toLowerCase())).map(([icon,title,sub])=>
            <MenuRow key={title} icon={icon} title={title} subtitle={sub} onPress={()=>{}} accent={P.gold}/>)}
        </View>
      </>}

"""
s=s[:start]+learn+s[end:]

export_anchor="export default function App(){return <SafeAreaProvider><PreferencesProvider><CoreApp/></PreferencesProvider></SafeAreaProvider>;}"
if export_anchor not in s:
    raise SystemExit("Mockup theme: final App export anchor missing")

overrides="""// MOCKUP_THEME_FINAL_V6
Object.assign(styles,{
  scroll:{padding:16,paddingBottom:92,width:'100%',maxWidth:720,alignSelf:'center'},
  backTitle:{minHeight:46,marginBottom:12},
  backBtn:{width:44,height:44,borderRadius:22,borderColor:P.line,backgroundColor:P.panel},
  screenTitle:{fontSize:23,lineHeight:30,color:P.text,fontWeight:'700'},
  mockupLead:{fontSize:14,lineHeight:21,color:P.muted,marginBottom:12},
  mockupList:{gap:8},
  searchBox:{backgroundColor:P.panel,color:P.text,borderWidth:1,borderColor:P.line,borderRadius:15,minHeight:50,paddingHorizontal:14,paddingVertical:10,fontSize:15,marginBottom:12},
  menuRow:{minHeight:72,backgroundColor:P.panel,borderColor:P.line,borderWidth:1,borderRadius:17,paddingHorizontal:13,paddingVertical:11,marginBottom:0,gap:12},
  menuIcon:{width:46,height:46,borderRadius:23,backgroundColor:P.panel2,borderColor:P.gold,borderWidth:1},
  menuTitle:{fontSize:16,lineHeight:22,color:P.text,fontWeight:'700'},
  menuSub:{fontSize:12.5,lineHeight:18,color:P.muted,marginTop:3},
  chev:{color:P.gold,fontSize:23}
});
"""
s=s.replace(export_anchor,overrides+"\n"+export_anchor,1)

p.write_text(s,encoding="utf-8")
print("Approved mockup theme applied last: compact Learning Centre and shared five-tab shell retained.")
