"""Connect the Journal tabs and shared seven-stage progress after memory/PDF patches."""
import re
from pathlib import Path

p = Path('App.js')
s = p.read_text()
if "from './src/journeyProgress'" in s:
    print('Journal progress already connected.')
    raise SystemExit(0)
if 'answers:journeyAnswers' not in s:
    raise SystemExit('Journal progress: apply journey memory first')

def replace_once(old, new):
    global s
    if s.count(old) != 1:
        raise SystemExit('Journal progress: expected one anchor: ' + old[:80])
    s = s.replace(old, new, 1)

replace_once("  const [journalText,setJournalText]=useState('');", "  const [journalText,setJournalText]=useState('');\n  const [journalTab,setJournalTab]=useState('entries');")
replace_once('  const go=s=>setScreen(s);', "  const go=s=>setScreen(s);\n  const openJournalProgress=()=>{setJournalTab('progress');go('journal');};")
s, count = re.subn(r'  const journeyProgress=\[.*?\]\s*\.filter\(Boolean\)\.length;', '  const writingProgress=getJourneyProgress(journeyAnswers);\n  const journeyProgress=writingProgress.count;', s, count=1, flags=re.S)
if count != 1:
    raise SystemExit('Journal progress: seven-stage progress anchor missing')

start = s.index("      {screen==='journal'&&<>")
end = s.index("      {screen==='about'", start)
s = s[:start] + r'''      {screen==='journal'&&<>
        <BackTitle title="My Journal" onBack={()=>go('home')} />
        <View style={styles.tabRow}>
          {['entries','progress'].map(tab=><Pressable key={tab} accessibilityRole="tab" accessibilityState={{selected:journalTab===tab}} onPress={()=>setJournalTab(tab)} style={[styles.tab,journalTab===tab&&styles.tabOn]}>
            <Text style={journalTab===tab?styles.tabTextOn:styles.tabText}>{tab==='entries'?'Entries':'Progress'}</Text>
          </Pressable>)}
        </View>
        {journalTab==='entries'?<>
          <Card>
            <Text style={styles.label}>New reflection</Text>
            <TextInput multiline value={journalText} onChangeText={setJournalText} style={styles.journalInput} placeholder="Write a short reflection or next step..." placeholderTextColor="#6D8290" textAlignVertical="top"/>
            <PrimaryButton onPress={addJournal}>＋ New Journal Entry</PrimaryButton>
          </Card>
          {journal.length===0?<Card><Text style={styles.centerMuted}>No entries yet. Journal notes in this prototype last only for this app session.</Text></Card>:journal.map(j=><Card key={j.id}><Text style={styles.journalDate}>▣  {j.date}</Text><Text selectable style={styles.body}>{j.text}</Text></Card>)}
        </>:<>
          <Card>
            <Text style={styles.cardTitle}>Journal activity</Text>
            <Text style={styles.body}>Journal entries this session: {journal.length}</Text>
            <Text style={styles.body}>{journal.length?`Latest reflection: ${journal[0].date}`:'Add a reflection in Entries to begin.'}</Text>
            <Text style={styles.body}>Journal notes last only for this app session. Copy any notes you want to keep before closing or updating the app.</Text>
          </Card>
          {!memoryReady?<Card>
            <Text style={styles.cardTitle}>My Journey Progress</Text>
            <Text accessibilityLiveRegion="polite" style={styles.body}>{memoryStatus==='load-error'?'Your saved journey could not be opened. Your existing writing has not been replaced.':'Loading your saved journey…'}</Text>
            {memoryStatus==='load-error'&&<PrimaryButton onPress={retryMemory}>TRY AGAIN</PrimaryButton>}
          </Card>:<>
            <Card>
              <Text style={styles.cardTitle}>My Journey Progress</Text>
              <Text style={styles.progressBig}>{writingProgress.percent}%</Text>
              <View accessibilityRole="progressbar" accessibilityValue={{min:0,max:7,now:journeyProgress,text:`${journeyProgress} of 7 stages have your input`}} style={styles.progressTrack}><View style={[styles.progressFill,{width:`${writingProgress.percent}%`}]} /></View>
              <Text style={styles.body}>{journeyProgress} of 7 stages have your input.</Text>
              <Text style={styles.body}>This tracks your writing and choices. It is not a wellbeing score. Tap a stage below to add or edit your answers.</Text>
              <Text accessibilityLiveRegion="polite" style={styles.body}>{memoryStatus==='save-error'?'Your latest changes could not be saved. Keep the app open and try again.':memoryStatus==='saving'?'Saving your writing…':'Your journey answers are saved on this device.'}</Text>
              {memoryStatus==='save-error'&&<PrimaryButton onPress={retryMemory}>TRY AGAIN</PrimaryButton>}
            </Card>
            {writingProgress.stages.map((stage,index)=><MenuRow key={stage.key} icon={String(index+1)} title={stage.title} subtitle={`${stage.hasInput?'Has answers':'Not started'} · Tap to open`} onPress={()=>go(stage.key)} accent={stage.hasInput?C.gold:C.blue}/>)}
            <PrimaryButton onPress={exportJourney}>VIEW MY SUMMARY →</PrimaryButton>
          </>}
        </>}
      </>}

''' + s[end:]

old = '<View style={styles.progressCard}><Text style={styles.progressBig}>{Math.round(journeyProgress/7*100)}%</Text><View style={{flex:1}}><Text style={styles.progressTitle}>Journey progress</Text><View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${Math.round(journeyProgress/7*100)}%`}]}/></View><Text style={styles.progressSmall}>{journeyProgress} of 7 stages have meaningful input.</Text></View></View>'
new = '<Pressable accessibilityRole="button" accessibilityLabel="Open journey progress" onPress={openJournalProgress} style={styles.progressCard}><Text style={styles.progressBig}>{writingProgress.percent}%</Text><View style={{flex:1}}><Text style={styles.progressTitle}>Journey progress →</Text><View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${writingProgress.percent}%`}]}/></View><Text style={styles.progressSmall}>{journeyProgress} of 7 stages have your input. Tap to view.</Text></View></Pressable>'
replace_once(old, new)
s = "import {getJourneyProgress} from './src/journeyProgress';\n" + s
p.write_text(s)
print('Journal tabs, activity, stage links and accurate journey progress connected.')
