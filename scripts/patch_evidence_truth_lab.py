"""Re-connect the Evidence & Truth Lab AFTER legacy Home redesigns.

The Android workflow rebuilds App.js through several legacy patch scripts. Those
scripts replace the original Home, so an early Home menu edit disappears.
This final integration is intentionally minimal and fails loudly if the screen
or Home cannot be found, rather than silently building an inaccessible tool.
"""
from pathlib import Path

path = Path("App.js")
source = path.read_text(encoding="utf-8")
screen = "{screen==='evidence'&&<EvidenceTruthScreen"
if source.count(screen) != 1:
    raise SystemExit("Evidence integration: EvidenceTruthScreen must be present exactly once")

home_start = "      {screen==='home'&&"
home_end = "      {screen==='journey'&&"
start = source.find(home_start)
end = source.find(home_end, start)
if start < 0 or end < 0:
    raise SystemExit("Evidence integration: final Home or Journey boundary missing")

home = source[start:end]
if "go('evidence')" not in home:
    # Home is a single outer <View>; append one tile immediately before its
    # closing </View>}, keeping every existing cinematic graphic untouched.
    marker = "      </View>}"
    pos = home.rfind(marker)
    if pos < 0:
        raise SystemExit("Evidence integration: final Home closing element missing")
    tile = (
        '        <JourneyTile icon="✦" title="EVIDENCE & TRUTH LAB" '
        'subtitle="Explore protection, emotional safety, evidence, uncertainty and choice" '
        'onPress={()=>go(\'evidence\')} accent="#B88A32"/>\n'
    )
    home = home[:pos] + tile + home[pos:]
    source = source[:start] + home + source[end:]

# Keep screen accessible through Home even if another patch replaces "More".
updated_home = source[source.find(home_start):source.find(home_end, source.find(home_start))]
if "go('evidence')" not in updated_home:
    raise SystemExit("Evidence integration: Home link not connected")
if source.count(screen) != 1:
    raise SystemExit("Evidence integration: screen disappeared during patching")

path.write_text(source, encoding="utf-8")
print("Evidence & Truth v1.2 connected to final Android Home")
