"""Make Support Resources WA/National tabs interactive."""
from pathlib import Path

p = Path("App.js")
s = p.read_text()

state_anchor = "  const [journalText,setJournalText]=useState('');"
if "const [supportRegion,setSupportRegion]" not in s:
    if state_anchor not in s:
        raise SystemExit("Support tabs: state anchor missing")
    s = s.replace(
        state_anchor,
        state_anchor + "\n  const [supportRegion,setSupportRegion]=useState('wa');",
        1,
    )

old_tabs = '<View style={styles.tabRow}><View style={[styles.tab,styles.tabOn]}><Text style={styles.tabTextOn}>WA Services</Text></View><View style={styles.tab}><Text style={styles.tabText}>National</Text></View></View>'
new_tabs = '''<View style={styles.tabRow}>
          <Pressable accessibilityRole="tab" accessibilityState={{selected:supportRegion==='wa'}} onPress={()=>setSupportRegion('wa')} style={[styles.tab,supportRegion==='wa'&&styles.tabOn]}>
            <Text style={supportRegion==='wa'?styles.tabTextOn:styles.tabText}>WA Services</Text>
          </Pressable>
          <Pressable accessibilityRole="tab" accessibilityState={{selected:supportRegion==='national'}} onPress={()=>setSupportRegion('national')} style={[styles.tab,supportRegion==='national'&&styles.tabOn]}>
            <Text style={supportRegion==='national'?styles.tabTextOn:styles.tabText}>National</Text>
          </Pressable>
        </View>'''
if old_tabs in s:
    s = s.replace(old_tabs, new_tabs, 1)
elif 'accessibilityState={{selected:supportRegion' not in s:
    raise SystemExit("Support tabs: tab row anchor missing")

old_body = '''        <WaSupportCard/>
        <MenuRow icon="◉" title="Kids Helpline" subtitle="1800 55 1800 • support for children and young people" onPress={()=>Linking.openURL('tel:1800551800')} accent={C.blue}/>
        <MenuRow icon="♥" title="1800RESPECT" subtitle="1800 737 732 • domestic, family and sexual violence support" onPress={()=>Linking.openURL('tel:1800737732')} accent={C.purple}/>
        <MenuRow icon="☎" title="Lifeline" subtitle="13 11 14 • crisis support" onPress={()=>Linking.openURL('tel:131114')} accent={C.green}/>
        <MenuRow icon="●" title="13YARN" subtitle="13 92 76 • Aboriginal & Torres Strait Islander crisis support" onPress={()=>Linking.openURL('tel:139276')} accent={C.gold}/>
        <MenuRow icon="▣" title="eSafety Commissioner" subtitle="Online safety information and reporting" onPress={()=>Linking.openURL('https://www.esafety.gov.au/')} accent={C.cyan}/>
        <MenuRow icon="WA" title="WA Government Services" subtitle="Community, family, child safety and support information" onPress={()=>Linking.openURL('https://www.wa.gov.au/')} accent={C.ochre}/>
        <View style={[styles.infoBox,{borderColor:C.gold}]}><Text style={styles.infoText}>If someone is in immediate danger, call 000.</Text></View>'''
new_body = '''        {supportRegion==='wa'&&<WaSupportCard/>}
        {supportRegion==='national'&&<>
          <MenuRow icon="☎" title="Emergency — 000" subtitle="If someone is in immediate danger" onPress={()=>Linking.openURL('tel:000')} accent={C.red}/>
          <MenuRow icon="◉" title="Kids Helpline" subtitle="1800 55 1800 • support for children and young people" onPress={()=>Linking.openURL('tel:1800551800')} accent={C.blue}/>
          <MenuRow icon="♥" title="1800RESPECT" subtitle="1800 737 732 • domestic, family and sexual violence support" onPress={()=>Linking.openURL('tel:1800737732')} accent={C.purple}/>
          <MenuRow icon="☎" title="Lifeline" subtitle="13 11 14 • crisis support" onPress={()=>Linking.openURL('tel:131114')} accent={C.green}/>
          <MenuRow icon="●" title="13YARN" subtitle="13 92 76 • Aboriginal & Torres Strait Islander crisis support" onPress={()=>Linking.openURL('tel:139276')} accent={C.gold}/>
          <MenuRow icon="▣" title="eSafety Commissioner" subtitle="Online safety information and reporting" onPress={()=>Linking.openURL('https://www.esafety.gov.au/')} accent={C.cyan}/>
          <View style={[styles.infoBox,{borderColor:C.gold}]}><Text style={styles.infoText}>National services are shown here. If someone is in immediate danger, call 000.</Text></View>
        </>}'''
if old_body in s:
    s = s.replace(old_body, new_body, 1)
elif "{supportRegion==='national'&&<>" not in s:
    raise SystemExit("Support tabs: support body anchor missing")

p.write_text(s)
print("Interactive WA/National support tabs connected.")
