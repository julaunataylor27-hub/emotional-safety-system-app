"""Add comparison and guided questions after the existing learning patches."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// CULTURAL_INQUIRY_V172'
if marker in source:
    print('Cultural comparison and curiosity are already connected.')
    raise SystemExit(0)
if '// LIVING_CONNECTIONS_V171' not in source:
    raise SystemExit('Apply Living connections before cultural inquiry.')


def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit('Cultural inquiry: expected one anchor: ' + old[:100])
    source = source.replace(old, new, 1)


source = marker + "\nimport CulturalInquiryScreen from './src/CulturalInquiryScreen';\nimport {matchesSearch as matchesInquirySearch} from './src/culturalInquiry.cjs';\n" + source
replace_once("  const [learningQuery,setLearningQuery]=useState('');",
             "  const [learningQuery,setLearningQuery]=useState('');\n  const culturalScroll=useRef(null);")
replace_once('<ScrollView key={screen} testID="app-page-scroll"',
             '<ScrollView key={screen} ref={culturalScroll} testID="app-page-scroll"')
old_route = "      {screen==='livingConnections'&&<CulturalConnectionsScreen onBack={()=>go('learn')}/>}"
new_route = "      {screen==='livingConnections'&&<CulturalConnectionsScreen onBack={()=>go('learn')} onExplore={()=>go('culturalInquiry')}/>}\n      {screen==='culturalInquiry'&&<CulturalInquiryScreen onBack={()=>go('learn')} onConnections={()=>go('livingConnections')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>}"
replace_once(old_route, new_route)
entry = '<MenuRow title="Compare & stay curious" subtitle="Explore cultural accounts, their sources and unanswered questions" onPress={()=>go(\'culturalInquiry\')}/>'
replace_once('        <BackTitle title="Learning Centre" onBack={()=>go(\'home\')} />',
             '        <BackTitle title="Learning Centre" onBack={()=>go(\'home\')} />\n        {matchesInquirySearch(learningQuery)&&' + entry + '}')
replace_once('        <BackTitle title="More" onBack={()=>go(\'home\')} />',
             '        <BackTitle title="More" onBack={()=>go(\'home\')} />\n        ' + entry)
replace_once('&&!matchesCulturalSearch(learningQuery)',
             '&&!matchesCulturalSearch(learningQuery)&&!matchesInquirySearch(learningQuery)')
path.write_text(source)
print('Cultural comparison and guided curiosity connected to Learn, search, More and Living connections.')
