"""Connect the independence and commitment reflection after public law learning."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// INDEPENDENCE_COMMITMENT_V181'
if marker in source:
    print('Independence & commitment is already connected.')
    raise SystemExit(0)
if '// LAW_RIGHTS_KINSHIP_V180' not in source:
    raise SystemExit('Apply Law, Rights & Kinship before Independence & commitment.')


def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit('Independence & commitment: expected one anchor: ' + old[:90])
    source = source.replace(old, new, 1)


source = marker + "\nimport IndependenceCommitmentScreen from './src/IndependenceCommitmentScreen';\nimport {createReflection as createBalanceReflection, matchesSearch as matchesBalanceSearch} from './src/independenceCommitment.cjs';\n" + source
replace_once("  const [learningPractice,setLearningPractice]=useState(createPractice);", "  const [learningPractice,setLearningPractice]=useState(createPractice);\n  const [balanceReflection,setBalanceReflection]=useState(createBalanceReflection);")
anchor = "      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route = "      {screen==='independenceCommitment'&&<IndependenceCommitmentScreen reflection={balanceReflection} onChange={setBalanceReflection} onBack={()=>go('learn')} onSupport={()=>go('support')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>}"
replace_once(anchor, anchor + '\n' + route)
entry = '<MenuRow title="Independence & commitment" subtitle="Make room for yourself, choose a commitment and plan a check-in" onPress={()=>go(\'independenceCommitment\')}/>'
for title in ['Learning Centre', 'More']:
    anchor = '        <BackTitle title="' + title + '" onBack={()=>go(\'home\')} />'
    replace_once(anchor, anchor + '\n        ' + ('{matchesBalanceSearch(learningQuery)&&' + entry + '}' if title == 'Learning Centre' else entry))
replace_once('&&!matchesLawSearch(learningQuery)', '&&!matchesLawSearch(learningQuery)&&!matchesBalanceSearch(learningQuery)')
path.write_text(source)
print('Independence & commitment connected to Learn, public search and More; writing stays in the app session.')
