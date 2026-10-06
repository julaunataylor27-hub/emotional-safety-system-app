"""Connect summary preview, native sharing and device-local journey memory."""
import re
from pathlib import Path

p = Path('App.js')
s = p.read_text()
if "from './src/useJourneyMemory'" in s:
    print('Journey memory already connected.')
    raise SystemExit(0)

# Earlier design patches change the import order; match the actual named import.
match = re.search(r"import\s*\{([^}]+)\}\s*from 'react-native';", s, re.S)
if not match:
    raise SystemExit('Journey memory: React Native import missing')
names = match.group(1).rstrip()
for name in ['Share', 'Alert']:
    if name not in [item.strip() for item in names.split(',')]:
        names += ', ' + name
s = s[:match.start()] + "import {" + names + "\n} from 'react-native';" + s[match.end():]
s = "import useJourneyMemory from './src/useJourneyMemory';\nimport {buildJourneySummary, hasJourneyContent} from './src/journeyMemory';\n" + s

keys = ['foundationMessage', 'foundationWhy', 'foundationHope', 'philosophyValues',
        'valuesReflection', 'philosophyName', 'philosophyMotto', 'philosophyVision',
        'bookTitle', 'storyNotes', 'legacyFeeling', 'legacyWorld', 'projectSelections', 'sharingSelections']
anchor = "  const [foundationMessage,setFoundationMessage]=useState('');"
if anchor not in s:
    raise SystemExit('Journey memory: state anchor missing')
s = s.replace(anchor, "  const {answers:journeyAnswers, ready:memoryReady, status:memoryStatus, update:updateJourney, retry:retryMemory, clear:clearMemory}=useJourneyMemory();\n" + anchor, 1)
for key in keys:
    setter = 'set' + key[0].upper() + key[1:]
    pattern = r'  const \[' + key + ',' + setter + r'\]=useState\([^\n]+\);'
    replacement = "  const " + key + "=journeyAnswers." + key + ";\n  const " + setter + "=value=>updateJourney('" + key + "',value);"
    s, count = re.subn(pattern, replacement, s, count=1)
    if count != 1:
        raise SystemExit('Journey memory: missing state ' + key)

start = s.index('  const exportJourney=')
end = s.index('\n', start)
s = s[:start] + r'''  const summaryText=buildJourneySummary(journeyAnswers);
  const exportJourney=()=>{
    if(!memoryReady) { Alert.alert('Journey loading','Please wait for your saved answers to load.'); return; }
    if(!hasJourneyContent(journeyAnswers)) { Alert.alert('Start with your words','Write one reflection or choose a project before creating your summary.'); return; }
    go('summary');
  };
  const shareJourney=async()=>{
    try { await Share.share({title:'My Humanity Philosophy',message:summaryText}); }
    catch { Alert.alert('Sharing unavailable','Your summary is still here. Try again, or press and hold the summary text to copy it.'); }
  };
  const forgetJourney=()=>Alert.alert('Clear saved journey?','This removes your journey answers from this device. Copy or share anything you want to keep first.',[
    {text:'Keep my writing',style:'cancel'},
    {text:'Clear journey',style:'destructive',onPress:async()=>{
      try { await clearMemory(); go('journey'); }
      catch { Alert.alert('Could not clear journey','Your writing has been kept. Please try again.'); }
    }}
  ]);''' + s[end:]

s = s.replace("'legacy','tech'];", "'legacy','tech','summary'];", 1)
# Block journey editing until loading succeeds, including after a read failure.
for screen in ['journey','foundation','values','identity','story','projects','sharing','legacy','tech']:
    s = s.replace("{screen==='" + screen + "'&&", "{screen==='" + screen + "'&&memoryReady&&")

scroll = '<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">'
if scroll not in s:
    raise SystemExit('Journey memory: scroll anchor missing')
s = s.replace(scroll, scroll + r'''
      {journeyScreens.includes(screen)&&<Card>
        <Text style={styles.cardTitle}>My Journey Memory</Text>
        <Text accessibilityLiveRegion="polite" style={styles.body}>{memoryStatus==='loading'?'Loading your saved journey…':memoryStatus==='load-error'?'Your saved journey could not be opened. Your existing writing has not been replaced.':memoryStatus==='save-error'?'Your latest changes could not be saved. Keep the app open and try again.':memoryStatus==='saving'?'Saving your writing…':'Your journey answers are saved on this device.'}</Text>
        {(memoryStatus==='load-error'||memoryStatus==='save-error')&&<PrimaryButton onPress={retryMemory}>TRY AGAIN</PrimaryButton>}
      </Card>}
      {screen==='summary'&&memoryReady&&<View style={styles.humanityPage}>
        <HumanityScreenHeader title="My Summary" step="READ • KEEP • SHARE" onBack={()=>go('legacy')}/>
        <Text style={styles.stageLead}>These are your own answers, gathered together. Read them before choosing what to share.</Text>
        <Card><Text selectable style={styles.body}>{summaryText}</Text></Card>
        <PrimaryButton onPress={shareJourney} color="#D9A72E">SHARE MY SUMMARY →</PrimaryButton>
        <PrimaryButton onPress={()=>go('journey')} color="#6E9B3F">EDIT MY JOURNEY →</PrimaryButton>
        <Text style={styles.stageLead}>Journey memory stays on this device. It is not uploaded to GitHub or an AI service. Clearing app data or uninstalling can remove it. Journal entries still last only for this session.</Text>
        <PrimaryButton onPress={forgetJourney} color="#8B2215" darkText={false}>CLEAR SAVED JOURNEY</PrimaryButton>
      </View>}
''', 1)
s = s.replace('Share your current Humanity Philosophy summary from this prototype.', 'Read your saved journey summary, then choose whether to share it.')
p.write_text(s)
print('Journey summary preview, native sharing, autosave and restore connected.')
