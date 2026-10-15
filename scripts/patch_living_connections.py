"""Connect the native cultural learning draft after the presentation layer."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
marker = '// LIVING_CONNECTIONS_V171'
if marker in source:
    print('Living connections is already connected.')
    raise SystemExit(0)
if '// PRESENTATION_POLISH_V170' not in source:
    raise SystemExit('Apply the presentation layer before Living connections.')

def insert_after(anchor, addition):
    global source
    if source.count(anchor) != 1:
        raise SystemExit('Living connections: expected one anchor: ' + anchor[:90])
    source = source.replace(anchor, anchor + addition, 1)

source = marker + "\nimport CulturalConnectionsScreen from './src/CulturalConnectionsScreen';\nimport {matchesSearch as matchesCulturalSearch} from './src/culturalConnections.cjs';\n" + source
insert_after("      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}",
             "\n      {screen==='livingConnections'&&<CulturalConnectionsScreen onBack={()=>go('learn')}/>}")
entry = '<MenuRow title="Living connections" subtitle="An educational cultural research draft, with original sources" onPress={()=>go(\'livingConnections\')}/>'
insert_after('        <BackTitle title="Learning Centre" onBack={()=>go(\'home\')} />', '\n        ' + entry)
insert_after('        <BackTitle title="More" onBack={()=>go(\'home\')} />', '\n        ' + entry)
# Public learning search includes this entry without searching personal writing.
source = source.replace('\n        '+entry+'\n        <TextInput',
    "\n        {matchesCulturalSearch(learningQuery)&&"+entry+"}\n        <TextInput",1)
old = "!LEARNING_TOPICS.some(([,title,sub])=>(title+' '+sub).toLowerCase().includes(learningQuery.trim().toLowerCase()))"
new = old + "&&!matchesCulturalSearch(learningQuery)"
if source.count(old) != 1:
    raise SystemExit('Living connections: expected one public search empty-state anchor')
source = source.replace(old,new,1)
path.write_text(source)
print('Living connections connected to Learn, public topic search and More.')
