"""Connect the Knowledge Trail after cultural inquiry and the presentation layer."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// KNOWLEDGE_TRAIL_V174'
if marker in source:
    print('Knowledge Trail is already connected.')
    raise SystemExit(0)
if '// CULTURAL_INQUIRY_V172' not in source:
    raise SystemExit('Apply cultural inquiry before Knowledge Trail.')


def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit('Knowledge Trail: expected one anchor: ' + old[:90])
    source = source.replace(old, new, 1)


source = marker + "\nimport KnowledgeTrailScreen from './src/KnowledgeTrailScreen';\nimport {createTrail, matchesSearch as matchesTrailSearch} from './src/knowledgeTrail.cjs';\n" + source
replace_once("  const [learningQuery,setLearningQuery]=useState('');", "  const [learningQuery,setLearningQuery]=useState('');\n  const [knowledgeTrail,setKnowledgeTrail]=useState(createTrail);")
anchor = "      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route = "      {screen==='knowledgeTrail'&&<KnowledgeTrailScreen trail={knowledgeTrail} onChange={setKnowledgeTrail} onBack={()=>go('learn')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>}"
replace_once(anchor, anchor + '\n' + route)
entry = '<MenuRow title="Knowledge Trail" subtitle="Follow a question with Tim Berners-Lee, or explore your own" onPress={()=>go(\'knowledgeTrail\')}/>'
for title in ['Learning Centre', 'More']:
    anchor = '        <BackTitle title="' + title + '" onBack={()=>go(\'home\')} />'
    replace_once(anchor, anchor + '\n        ' + ('{matchesTrailSearch(learningQuery)&&' + entry + '}' if title == 'Learning Centre' else entry))
replace_once('&&!matchesInquirySearch(learningQuery)', '&&!matchesInquirySearch(learningQuery)&&!matchesTrailSearch(learningQuery)')
path.write_text(source)
print('Knowledge Trail connected to Learn, public topic search and More; writing stays in the app session.')
