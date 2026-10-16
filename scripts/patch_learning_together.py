"""Connect the six-part learning practice after the Knowledge Trail patch."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// LEARNING_TOGETHER_V175'
if marker in source:
    print('Learning together is already connected.')
    raise SystemExit(0)
if '// KNOWLEDGE_TRAIL_V174' not in source:
    raise SystemExit('Apply Knowledge Trail before Learning together.')


def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit('Learning together: expected one anchor: ' + old[:90])
    source = source.replace(old, new, 1)


source = marker + "\nimport LearningTogetherScreen from './src/LearningTogetherScreen';\nimport {createPractice, matchesSearch as matchesTogetherSearch} from './src/learningTogether.cjs';\n" + source
replace_once("  const [knowledgeTrail,setKnowledgeTrail]=useState(createTrail);", "  const [knowledgeTrail,setKnowledgeTrail]=useState(createTrail);\n  const [learningPractice,setLearningPractice]=useState(createPractice);")
replace_once("<KnowledgeTrailScreen trail={knowledgeTrail}", "<KnowledgeTrailScreen onLearnTogether={()=>go('learningTogether')} trail={knowledgeTrail}")
anchor = "      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route = "      {screen==='learningTogether'&&<LearningTogetherScreen practice={learningPractice} onChange={setLearningPractice} onBack={()=>go('learn')} onOpenTrail={()=>go('knowledgeTrail')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>}"
replace_once(anchor, anchor + '\n' + route)
entry = '<MenuRow title="Learning together" subtitle="Try encouragement, pace, timing, knowledge, conversation and peace" onPress={()=>go(\'learningTogether\')}/>'
for title in ['Learning Centre', 'More']:
    anchor = '        <BackTitle title="' + title + '" onBack={()=>go(\'home\')} />'
    replace_once(anchor, anchor + '\n        ' + ('{matchesTogetherSearch(learningQuery)&&' + entry + '}' if title == 'Learning Centre' else entry))
replace_once('&&!matchesTrailSearch(learningQuery)', '&&!matchesTrailSearch(learningQuery)&&!matchesTogetherSearch(learningQuery)')
path.write_text(source)
print('Learning together connected to Learn, public search, More and Knowledge Trail; practice stays in the app session.')
