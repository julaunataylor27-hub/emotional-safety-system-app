from pathlib import Path

s = Path('App.js').read_text()
required = [
    "const [intent,setIntent]",
    "What are you trying to understand?",
    "A question / hypothetical",
    "Family relationship detail",
    "Are both people 18 or older?",
    "Sexual penetration / intercourse",
    "LEGAL & SAFETY CONTEXT",
    "WA Legal Rule Triggered",
    "NOT SCORED FOR A GENERAL QUESTION",
    "result.questionMode",
    "WA Criminal Code s 329",
]
missing = [x for x in required if x not in s]
if missing:
    raise SystemExit('Patched app validation failed. Missing: ' + ', '.join(missing))
print('Patched app validation passed:', len(required), 'required markers found.')
