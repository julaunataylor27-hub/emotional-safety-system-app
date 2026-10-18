"""Connect the sourced Australia-wide directory after the existing app patches."""
from pathlib import Path

p=Path('App.js')
s=p.read_text()
if '// AUSTRALIA_SUPPORT_DIRECTORY_V177' in s:
    print('Australia support directory already connected.')
    raise SystemExit(0)
start=s.index("      {screen==='support'&&preferences.country==='AU'&&<>")
end=s.index("      {screen==='journal'&&<>",start)
old=s[start:end]
# Preserve the pre-existing national First Nations crisis resource unchanged.
legacy=next(line.strip() for line in old.splitlines() if 'title="13YARN"' in line)
new="""      {screen==='support'&&preferences.country==='AU'&&<>
        <BackTitle title="Support Resources" onBack={()=>go('home')} />
        <SupportDirectoryScreen filters={supportFilters} onChange={setSupportFilters} onBack={()=>go('home')}
          existingNationalResource={LEGACY_RESOURCE}/>
      </>}

""".replace('LEGACY_RESOURCE',legacy)
s=s[:start]+new+s[end:]
state="  const [supportRegion,setSupportRegion]=useState('wa');"
if state not in s:raise SystemExit('Missing support state anchor')
s=s.replace(state,'  const [supportFilters,setSupportFilters]=useState({...DEFAULT_SUPPORT_FILTERS});',1)
s="// AUSTRALIA_SUPPORT_DIRECTORY_V177\nimport SupportDirectoryScreen from './src/SupportDirectoryScreen';\nimport {DEFAULT_FILTERS as DEFAULT_SUPPORT_FILTERS} from './src/supportDirectory.cjs';\n"+s
p.write_text(s)
print('National and all eight state/territory support sections connected.')
