"""Apply the approved Home after legacy visual patches without changing saved answers."""
from pathlib import Path

app=Path('App.js')
source=app.read_text()
import_line="import GoldenTreeHome from './src/GoldenTreeHome';"
route="  if(screen==='home') return <GoldenTreeHome onNavigate={go} onValuePress={()=>go('values')}/>;"
anchor="  return <SafeAreaView style={styles.safe}>"
if import_line not in source:
    source=import_line+'\n'+source
if route not in source:
    if source.count(anchor)!=1:
        raise SystemExit('Golden Home: expected exactly one App return anchor')
    source=source.replace(anchor,route+'\n\n'+anchor,1)
if source.index(route)>source.index(anchor):
    raise SystemExit('Golden Home must render before the legacy Home')
app.write_text(source)
print('Approved golden-tree Home connected to Journey, Values, assessment, Learn, Support and More.')
