"""Connect the optional linked-information exercise after Learning together."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// EXPLORE_CONNECTIONS_V176'
if marker in source:
    print('Explore connections is already connected.')
    raise SystemExit(0)
if '// LEARNING_TOGETHER_V175' not in source:
    raise SystemExit('Apply Learning together before Explore connections.')


def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit('Explore connections: expected one anchor: ' + old[:90])
    source = source.replace(old, new, 1)


source = marker + "\nimport ExploreConnectionsScreen from './src/ExploreConnectionsScreen';\nimport {createExploration, matchesSearch as matchesExploreSearch} from './src/exploreConnections.cjs';\n" + source
replace_once('  const [learningPractice,setLearningPractice]=useState(createPractice);', '  const [learningPractice,setLearningPractice]=useState(createPractice);\n  const [exploration,setExploration]=useState(createExploration);')
replace_once('<KnowledgeTrailScreen onLearnTogether=', '<KnowledgeTrailScreen onExploreConnections={()=>go(\'exploreConnections\')} onLearnTogether=')
replace_once('<LearningTogetherScreen practice=', '<LearningTogetherScreen onExploreConnections={()=>go(\'exploreConnections\')} practice=')
anchor = "      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route = "      {screen==='exploreConnections'&&<ExploreConnectionsScreen exploration={exploration} onChange={setExploration} onBack={()=>go('learn')} onOpenTrail={()=>go('knowledgeTrail')} onLearnTogether={()=>go('learningTogether')} onSupport={()=>go('support')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>}"
replace_once(anchor, anchor + '\n' + route)
entry = '<MenuRow title="Explore connections" subtitle="Link a question with experiences, sources, unknowns and choices" onPress={()=>go(\'exploreConnections\')}/>'
for title in ['Learning Centre', 'More']:
    anchor = '        <BackTitle title="' + title + '" onBack={()=>go(\'home\')} />'
    replace_once(anchor, anchor + '\n        ' + ('{matchesExploreSearch(learningQuery)&&' + entry + '}' if title == 'Learning Centre' else entry))
replace_once('&&!matchesTogetherSearch(learningQuery)', '&&!matchesTogetherSearch(learningQuery)&&!matchesExploreSearch(learningQuery)')
path.write_text(source)
print('Explore connections connected to Learn, public search, More, Knowledge Trail and Learning together.')
