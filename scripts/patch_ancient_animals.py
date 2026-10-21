"""Connect the dated, sourced ancient animals learning gallery after Safe Curiosity.
Keep build-time integrations fail-fast and idempotent; never modify assessments.
"""
from pathlib import Path

path=Path('App.js')
source=path.read_text()
marker='// ANCIENT_ANIMALS_V200'
if marker in source:
    print('Ancient animals learning gallery already connected.')
    raise SystemExit(0)
if '// SAFE_CURIOSITY_V190' not in source:
    raise SystemExit('Apply Safe Curiosity before the ancient animals module.')

def replace_once(old,new):
    global source
    if source.count(old)!=1:
        raise SystemExit('Ancient animals: expected exactly one anchor: '+old[:115])
    source=source.replace(old,new,1)

source=marker+"\nimport AncientAnimalsScreen from './src/AncientAnimalsScreen';\nimport {matchesSearch as matchesAncientAnimalsSearch} from './src/ancientAnimals.cjs';\n"+source
anchor="      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route="      {screen==='ancientAnimals'&&<AncientAnimalsScreen onBack={()=>go('learn')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>} "
replace_once(anchor,anchor+'\n'+route.rstrip())
entry='<MenuRow title="Ancient Australian Animals & Evidence" subtitle="Six prehistoric creatures, fossil images and the Yamuti account" onPress={()=>go(\'ancientAnimals\')}/>'
for title in ['Learning Centre','More']:
    anchor='        <BackTitle title="'+title+'" onBack={()=>go(\'home\')} />'
    replace_once(anchor,anchor+'\n        '+('{matchesAncientAnimalsSearch(learningQuery)&&'+entry+'}' if title=='Learning Centre' else entry))
replace_once('&&!matchesCuriositySearch(learningQuery)','&&!matchesCuriositySearch(learningQuery)&&!matchesAncientAnimalsSearch(learningQuery)')
path.write_text(source)
print('Ancient animals linked to Learn, public search and More; no changes to assessment logic.')
