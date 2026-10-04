from pathlib import Path
import re

p = Path('App.js')
s = p.read_text()

# Guarantee the analysis result actually returns every field the Results screen expects.
old_return = "return {child, high, elevated, level, score, factors, emotion, steps, emotionalReality, questionMode, resolvedIntent, legalContext};"
new_return = "return {child, high, elevated, level, score, signalDisplay, factors, emotion, steps, emotionalReality, questionMode, resolvedIntent, legalContext, structuralSafety, inputConflicts};"
if old_return in s:
    s = s.replace(old_return, new_return, 1)

# Broader fallback in case whitespace/field ordering changed slightly.
if new_return not in s:
    pattern = re.compile(r"return \{child,\s*high,\s*elevated,\s*level,\s*score,\s*factors,\s*emotion,\s*steps,\s*emotionalReality,\s*questionMode,\s*resolvedIntent,\s*legalContext\};")
    s, n = pattern.subn(new_return, s, count=1)

# Fail safely in rendering instead of crashing if an optional array/object is ever absent.
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

# Static assertions: never ship an APK if the result object and renderer are out of sync.
required = [
    new_return,
    "let signalDisplay =",
    "const structuralSafety =",
    "const inputConflicts =",
    "Object.entries(result.signalDisplay||{}).map",
    "(result.inputConflicts||[]).length>0",
]
missing = [x for x in required if x not in s]
if missing:
    raise SystemExit('Results crash guard failed; missing: ' + ', '.join(missing))

p.write_text(s)
print('Results crash guard applied and validated.')
