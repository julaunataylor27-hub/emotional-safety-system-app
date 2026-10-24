"""Connect the presentation walkthrough after all existing safety and navigation patches.
The workflow runs this as the final feature patch; assessment and personal data are unchanged.
"""
from pathlib import Path
app=Path('App.js')
s=app.read_text()
marker='// AUSTRALIAN_HUMANITY_PRESENTATION_20261024'
if marker in s:
 print('Presentation overview already connected.')
 raise SystemExit(0)
if '// TWO_FLAMES_V1_20261024' not in s:
 raise SystemExit('Presentation overview must follow the existing Two Flames patch.')

def once(before,after):
 global s
 if s.count(before)!=1:
  raise SystemExit('Presentation overview anchor missing or ambiguous: '+before[:110])
 s=s.replace(before,after,1)

s=marker+"\nimport AustralianHumanityOverview from './src/AustralianHumanityOverview';\n"+s
anchor="      {screen==='vision'&&<PresentationOverview onNavigate={go}/>}"
once(anchor,anchor+"\n      {screen==='presentationWalkthrough'&&<AustralianHumanityOverview onNavigate={go} onBack={()=>go('home')}/>}")
anchor='        <BackTitle title="More" onBack={()=>go(\'home\')} />'
once(anchor,anchor+'\n        <MenuRow title="Australian Humanity — Presentation Overview" subtitle="Six sections: purpose, process, prototype, demonstration, safeguards and future" onPress={()=>go(\'presentationWalkthrough\')}/>')
app.write_text(s)
print('Australian Humanity six-part overview and routes ready for live demonstration.')
