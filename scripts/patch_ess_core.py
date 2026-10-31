"""Reconnect ESS Core after all legacy Android App.js patching."""
from pathlib import Path

path = Path("App.js")
source = path.read_text(encoding="utf-8")

import_line = "import EssCoreScreen from './src/EssCoreScreen';"
route = "      {screen==='esscore'&&<EssCoreScreen onBack={()=>go('home')} onSupport={()=>go('support')}/>}"

if import_line not in source:
    anchor = "import EvidenceTruthScreen from './src/EvidenceTruthScreen';"
    if source.count(anchor) != 1:
        raise SystemExit("ESS Core integration: EvidenceTruthScreen import anchor missing")
    source = source.replace(anchor, anchor + "\n" + import_line, 1)

if route not in source:
    anchor = "      {screen==='evidence'&&<EvidenceTruthScreen onBack={()=>go('home')} onSupport={()=>go('support')}/>}"
    if source.count(anchor) != 1:
        raise SystemExit("ESS Core integration: EvidenceTruthScreen route anchor missing")
    source = source.replace(anchor, anchor + "\n" + route, 1)

home_start = "      {screen==='home'&&"
home_end_candidates = [
    "      {screen==='journey'&&",
    "      {screen==='lifeJourney'&&",
    "      {screen==='assessment'&&"
]
start = source.find(home_start)
if start < 0:
    raise SystemExit("ESS Core integration: Home block missing")

end = -1
for marker in home_end_candidates:
    pos = source.find(marker, start + len(home_start))
    if pos >= 0 and (end < 0 or pos < end):
        end = pos
if end < 0:
    raise SystemExit("ESS Core integration: Home boundary missing")

home = source[start:end]
if "go('esscore')" not in home:
    marker = "      </View>}"
    pos = home.rfind(marker)
    if pos < 0:
        marker = "      </>}"
        pos = home.rfind(marker)
    if pos < 0:
        raise SystemExit("ESS Core integration: final Home closing element missing")

    if "JourneyTile" in home:
        tile = (
            '        <JourneyTile icon="⚙" title="ESS CORE PROTOTYPE" '
            'subtitle="Separate emotion, evidence, uncertainty, safety and choice" '
            'onPress={()=>go(\'esscore\')} accent="#58C7E8"/>\n'
        )
    else:
        tile = (
            '        <MenuRow icon="⚙" title="ESS Core Prototype" '
            'subtitle="Separate emotion, evidence, uncertainty, safety and choice" '
            'onPress={()=>go(\'esscore\')} accent={C.cyan}/>\n'
        )
    home = home[:pos] + tile + home[pos:]
    source = source[:start] + home + source[end:]

if source.count(import_line) != 1:
    raise SystemExit("ESS Core integration: import must appear exactly once")
if source.count(route) != 1:
    raise SystemExit("ESS Core integration: route must appear exactly once")

final_home = source[start:source.find(end and source[end:end+1] or "", start) if False else len(source)]
if "go('esscore')" not in source[start:end + 12000]:
    raise SystemExit("ESS Core integration: Home link not connected")

path.write_text(source, encoding="utf-8")
print("ESS Core prototype connected to final Android Home")
