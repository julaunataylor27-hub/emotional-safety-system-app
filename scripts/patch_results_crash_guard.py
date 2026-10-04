from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# Locate analyse() and guarantee its final return object contains every field
# that the Results screen expects. This is deliberately independent of field order.
section = re.search(r"(function analyse\(.*?\)\s*\{)(.*?)(\n\}\n\nfunction Card)", s, re.S)
if not section:
    raise SystemExit('Results crash guard: analyse() block not found')

body = section.group(2)
returns = list(re.finditer(r"return\s+\{([^{}]*)\};", body, re.S))
if not returns:
    raise SystemExit('Results crash guard: analyse() return object not found')

target = returns[-1]
fields_text = target.group(1)
fields = [x.strip() for x in fields_text.replace('\n',' ').split(',') if x.strip()]
for required_field in ['signalDisplay','structuralSafety','inputConflicts']:
    if required_field not in fields:
        fields.append(required_field)

new_return = 'return {' + ', '.join(fields) + '};'
body = body[:target.start()] + new_return + body[target.end():]
s = s[:section.start(2)] + body + s[section.end(2):]

# Fail safely in rendering instead of closing the app if an optional value is absent.
s = s.replace("result.inputConflicts.length>0", "(result.inputConflicts||[]).length>0")
s = s.replace("result.inputConflicts.map((x,i)=>", "(result.inputConflicts||[]).map((x,i)=>")
s = s.replace("Object.entries(result.signalDisplay).map", "Object.entries(result.signalDisplay||{}).map")
s = s.replace("result.structuralSafety.reasons.map((x,i)=>", "(result.structuralSafety?.reasons||[]).map((x,i)=>")
s = s.replace("result.structuralSafety.source?<Text", "result.structuralSafety?.source?<Text")
s = s.replace("{result.structuralSafety.source}</Text>", "{result.structuralSafety?.source}</Text>")
s = s.replace("result.structuralSafety.level==='critical'", "result.structuralSafety?.level==='critical'")
s = s.replace("result.structuralSafety.level==='warning'", "result.structuralSafety?.level==='warning'")
s = s.replace("{result.structuralSafety.title}", "{result.structuralSafety?.title||'Structural safety check'}")
s = s.replace("{result.structuralSafety.summary}", "{result.structuralSafety?.summary||'Structural safety information was not available for this result.'}")

# Validate the actual analyse() return shape after patching.
check_section = re.search(r"function analyse\(.*?\)\s*\{(.*?)\n\}\n\nfunction Card", s, re.S)
check_returns = list(re.finditer(r"return\s+\{([^{}]*)\};", check_section.group(1), re.S)) if check_section else []
if not check_returns:
    raise SystemExit('Results crash guard: patched return object missing')
returned = check_returns[-1].group(1)
required_markers = [
    'signalDisplay', 'structuralSafety', 'inputConflicts', 'emotionalReality', 'legalContext',
    'let signalDisplay =', 'const structuralSafety =', 'const inputConflicts =',
    'Object.entries(result.signalDisplay||{}).map', '(result.inputConflicts||[]).length>0'
]
missing = [x for x in required_markers if x not in (returned if x in ['signalDisplay','structuralSafety','inputConflicts','emotionalReality','legalContext'] else s)]
if missing:
    raise SystemExit('Results crash guard failed; missing: ' + ', '.join(missing))

p.write_text(s)
print('Results crash fixed: result shape and renderer validated.')
