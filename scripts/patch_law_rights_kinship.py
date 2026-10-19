"""Connect public legal and cultural reading after the existing functional patches."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// LAW_RIGHTS_KINSHIP_V180'
if marker in source:
    print('Law, Rights & Kinship is already connected.')
    raise SystemExit(0)
if '// AUSTRALIA_SUPPORT_DIRECTORY_V177' not in source:
    raise SystemExit('Apply the support directory patch before Law, Rights & Kinship.')


def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit('Law, Rights & Kinship: expected one anchor: ' + old[:90])
    source = source.replace(old, new, 1)


source = marker + "\nimport LawRightsKinshipScreen from './src/LawRightsKinshipScreen';\nimport {matchesSearch as matchesLawSearch} from './src/lawRightsKinship.cjs';\n" + source
anchor = "      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route = "      {screen==='lawRightsKinship'&&<LawRightsKinshipScreen onBack={()=>go('learn')} onSupport={()=>go('support')} onLivingConnections={()=>go('livingConnections')} onKnowledgeTrail={()=>go('knowledgeTrail')} onScrollTop={()=>culturalScroll.current?.scrollTo?.({y:0,animated:false})}/>}"
replace_once(anchor, anchor + '\n' + route)
entry = '<MenuRow title="Law, Rights & Kinship" subtitle="Australian and WA law, cultural responsibilities and Parliament" onPress={()=>go(\'lawRightsKinship\')}/>'
for title in ['Learning Centre', 'More']:
    anchor = '        <BackTitle title="' + title + '" onBack={()=>go(\'home\')} />'
    replace_once(anchor, anchor + '\n        ' + ('{matchesLawSearch(learningQuery)&&' + entry + '}' if title == 'Learning Centre' else entry))
replace_once('&&!matchesExploreSearch(learningQuery)', '&&!matchesExploreSearch(learningQuery)&&!matchesLawSearch(learningQuery)')
path.write_text(source)
print('Law, Rights & Kinship connected to Learn, public learning search and More.')
