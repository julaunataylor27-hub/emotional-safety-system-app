from pathlib import Path
p=Path('App.js')
s=p.read_text()
needle=";\\n  const [projectIdeas"
if needle in s:
    s=s.replace(needle,";\n  const [projectIdeas",1)
if "\\n  const [projectIdeas" in s:
    raise SystemExit('Nextgen syntax fix failed: literal newline escape still present')
p.write_text(s)
print('Nextgen syntax fix passed.')
