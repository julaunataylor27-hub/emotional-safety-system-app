"""Add offline Safe Curiosity Lab after existing v1.8.1 learning patches."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// SAFE_CURIOSITY_V190'
if marker in source:
    print('Safe Curiosity Lab already connected.')
    raise SystemExit(0)
if '// INDEPENDENCE_COMMITMENT_V181' not in source:
    raise SystemExit('Apply Independence & commitment before Safe Curiosity Lab.')


def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit('Safe Curiosity Lab: expected one anchor: ' + old[:95])
    source = source.replace(old, new, 1)


source = marker + "\nimport SafeCuriosityScreen from './src/SafeCuriosityScreen';\nimport {matchesSearch as matchesCuriositySearch} from './src/safeCuriosity.cjs';\n" + source
anchor = "      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route = "      {screen==='safeCuriosity'&&<SafeCuriosityScreen onBack={()=>go('learn')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>}"
replace_once(anchor, anchor + '\n' + route)
entry = '<MenuRow title="Safe Curiosity Lab" subtitle="Try private, age-appropriate learning and safety examples · Prototype" onPress={()=>go(\'safeCuriosity\')}/>'
for title in ['Learning Centre', 'More']:
    anchor = '        <BackTitle title="' + title + '" onBack={()=>go(\'home\')} />'
    replace_once(anchor, anchor + '\n        ' + ('{matchesCuriositySearch(learningQuery)&&' + entry + '}' if title == 'Learning Centre' else entry))
replace_once('&&!matchesBalanceSearch(learningQuery)', '&&!matchesBalanceSearch(learningQuery)&&!matchesCuriositySearch(learningQuery)')
path.write_text(source)
print('Safe Curiosity Lab connected in Learn and More without changing assessments or saved answers.')
