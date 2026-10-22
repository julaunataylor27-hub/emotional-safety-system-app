"""Final app-level route for the optional Connection Trail.
This patch adds navigation only, leaving the evidence engine, notes, PDFs and
safeguarding rules unchanged. Run after the existing feature patches.
"""
from pathlib import Path

p=Path("App.js")
s=p.read_text()
marker="// CONNECTION_ADVENTURE_V201"
if marker in s:
    print("Connection adventure already present.")
    raise SystemExit(0)
if "// ANCIENT_ANIMALS_V200" not in s:
    raise SystemExit("Connection adventure requires all previous learning patches.")

def replace_once(before, after):
    global s
    if s.count(before)!=1:
        raise SystemExit("Connection adventure anchor missing/ambiguous: "+before[:100])
    s=s.replace(before,after,1)

s=marker+"\nimport ConnectionAdventure,{ConnectionTrailCompass} from './src/ConnectionAdventure';\n"+s

# Compass follows the actual current screen. It is a shortcut, not a gate or score.
anchor="      <TranslationNotice/>"
replace_once(anchor,anchor+"\n      <ConnectionTrailCompass screen={screen} onNavigate={go}/>")

# Quest lives in the same navigation stack and gets the same shared chrome.
anchor="      {screen==='vision'&&<PresentationOverview onNavigate={go}/>} "
if anchor not in s:
    anchor=anchor.rstrip()
replace_once(anchor,anchor+"\n      {screen==='connectionTrail'&&<ConnectionAdventure onNavigate={go}/>}")

# Provide a route from the existing tools menu; all existing menu entries stay.
anchor='        <BackTitle title="More" onBack={()=>go(\'home\')} />'
replace_once(anchor,anchor+'\n        <MenuRow title="The Connection Trail" subtitle="Six open clues: curiosity, facts, sources, perspectives, values and support" onPress={()=>go(\'connectionTrail\')}/>')

p.write_text(s)
print("Connection Trail added to shared screens and More; no assessment changes.")
