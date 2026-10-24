"""Link Two Flames after the last existing feature patch.

This does not alter the assessment engine or any safeguarding rules.
"""
from pathlib import Path

p = Path("App.js")
s = p.read_text()
marker = "// TWO_FLAMES_V1_20261024"
if marker in s:
    print("Two Flames already connected.")
    raise SystemExit(0)
if "// CONNECTION_ADVENTURE_V201" not in s:
    raise SystemExit("Two Flames must run after the Connection Adventure patch.")

def replace_once(before, after):
    global s
    if s.count(before) != 1:
        raise SystemExit("Two Flames anchor missing or ambiguous: " + before[:100])
    s = s.replace(before, after, 1)

s = marker + "\nimport TwoFlamesScreen from './src/TwoFlamesScreen';\nimport {matchesSearch as matchesTwoFlamesSearch} from './src/twoFlames.cjs';\n" + s

anchor = "      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
route = "      {screen==='twoFlames'&&<><BackTitle title=\"Two Flames\" onBack={()=>go('learn')}/><TwoFlamesScreen onSupport={()=>go('support')}/></>}"
replace_once(anchor, anchor + "\n" + route)

entry = '<MenuRow title="Two Flames — Healing Without Control" subtitle="Two sparks, shared light, mutual choice and room to heal" onPress={()=>go(\'twoFlames\')}/>'
for title in ['Learning Centre', 'More']:
    anchor = '        <BackTitle title="' + title + '" onBack={()=>go(\'home\')} />'
    linked = '{matchesTwoFlamesSearch(learningQuery)&&' + entry + '}' if title == 'Learning Centre' else entry
    replace_once(anchor, anchor + "\n        " + linked)

replace_once('&&!matchesAncientAnimalsSearch(learningQuery)',
             '&&!matchesAncientAnimalsSearch(learningQuery)&&!matchesTwoFlamesSearch(learningQuery)')
p.write_text(s)
print("Two Flames route, learning search, and More navigation connected.")
