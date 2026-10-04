from pathlib import Path

p = Path('App.js')
s = p.read_text()

old_note = "WA legal context: Criminal Code s 319 defines consent as freely and voluntarily given and states that consent is not freely and voluntarily given if obtained by force, threat, intimidation, deceit or fraudulent means. Failure to physically resist does not by itself amount to consent."
new_note = "WA legal context: Criminal Code s 319 defines consent as freely and voluntarily given and states that consent is not freely and voluntarily given if obtained by force, threat, intimidation, deceit or fraudulent means. Failure to physically resist does not by itself amount to consent. Section 327 separately makes it an offence to compel another person to engage in sexual behaviour, and s 328 covers aggravated sexual coercion. This app flags possible legal review; it does not decide whether an offence occurred."

old_source = "WA Criminal Code s 319 — consent definition (legal information only)"
new_source = "WA Criminal Code ss 319, 327–328 — consent and sexual coercion (legal information only)"

if old_note not in s:
    raise SystemExit('Coercion legal patch: s 319 legal note marker not found')
if old_source not in s:
    raise SystemExit('Coercion legal patch: source marker not found')

s = s.replace(old_note, new_note, 1)
s = s.replace(old_source, new_source, 1)

if 'Section 327 separately makes it an offence to compel another person to engage in sexual behaviour' not in s:
    raise SystemExit('Coercion legal patch failed: s 327 wording missing')
if 'WA Criminal Code ss 319, 327–328' not in s:
    raise SystemExit('Coercion legal patch failed: source wording missing')

p.write_text(s)
print('WA coercion legal references added: ss 319, 327–328.')
