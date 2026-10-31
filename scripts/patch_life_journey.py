"""Connect native Life Journey after the legacy App rebuild and golden Home."""
from pathlib import Path

path = Path('App.js')
source = path.read_text()
import_line = "import LifeJourneyScreen from './src/LifeJourneyScreen';"
route = "      {screen==='lifeJourney'&&<LifeJourneyScreen onBack={()=>go('home')}/>}"
anchor = "      {screen==='evidence'&&<EvidenceTruthScreen onBack={()=>go('home')} onSupport={()=>go('support')}/>}"
if import_line not in source:
    source = import_line + '\n' + source
if route not in source:
    if source.count(anchor) != 1:
        raise SystemExit('Life Journey: expected one Evidence screen anchor')
    source = source.replace(anchor,anchor+'\n'+route,1)
menu = '        <MenuRow icon="◉" title="Yagan Life Journey" subtitle="Explore records, cultural context and possible meanings" onPress={()=>go(\'lifeJourney\')} accent={C.gold}/>'
marker = "      {screen==='more'&&<>"
if menu not in source:
    if source.count(marker)!=1:
        raise SystemExit('Life Journey: expected one More menu anchor')
    source=source.replace(marker,marker+'\n'+menu,1)
if source.count(route)!=1 or source.count(import_line)!=1:
    raise SystemExit('Life Journey: screen or import was duplicated')
home=Path('src/GoldenTreeHome.js').read_text()
if "home-life-journey" not in home or "lifeJourney" not in home:
    raise SystemExit('Life Journey: Home entry is missing')
path.write_text(source)
print('Yagan Life Journey connected to golden Home and More, with native notes and PDF controls.')
