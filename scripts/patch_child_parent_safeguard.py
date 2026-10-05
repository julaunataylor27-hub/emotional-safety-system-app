from pathlib import Path

p = Path('App.js')
s = p.read_text()

# Strengthen parent-child inference. First-person phrases like "my mum" or "my son"
# must still resolve to a parent-child relationship even when both role words are not present.
s = s.replace(
    "  const parentChild = familyRelation === 'Parent ↔ child' || (parentWords && childWords);",
    "  const parentChild = familyRelation === 'Parent ↔ child' || (parentWords && childWords) || has(t,['my mum','my mom','my mother','my dad','my father','my son','my daughter','my child']);",
    1
)
s = s.replace(
    "  const inferredParentChild = parentWords && childWords;",
    "  const inferredParentChild = (parentWords && childWords) || has(t,['my mum','my mom','my mother','my dad','my father','my son','my daughter','my child']);",
    1
)

# Make a selected child age + parent-child sexual context a hard structural safeguard.
# This rule is intentionally independent of reported emotion, arousal, apparent agreement,
# or whether pressure words were explicitly used.
s = s.replace(
    "  const parentChildChildSexual = inferredParentChild && selectedChildAge && sexualContext;",
    "  const parentChildChildSexual = inferredParentChild && selectedChildAge && sexualContext && (ageFor === 'Child involved' || ageFor === 'Person affected' || ageFor === 'Unsure');",
    1
)

# Add an explicit secrecy + parent/caregiver + child sexual-context indicator to the coercion layer.
needle = "  const coercionPowerPattern = (authorityPower || power || dependency) && (pressureWords || coercionPersistence || coercionThreat || coercionEmotionalLeverage);"
insert = """  const coercionPowerPattern = (authorityPower || power || dependency) && (pressureWords || coercionPersistence || coercionThreat || coercionEmotionalLeverage);\n  const coercionChildSecrecy = structuralCritical && secrecy;"""
if needle in s and 'const coercionChildSecrecy' not in s:
    s = s.replace(needle, insert, 1)

indicator_needle = "  if(coercionPowerPattern) coercionIndicators.push('Power or dependency may be combining with pressure in a way that reduces free choice.');"
indicator_insert = """  if(coercionPowerPattern) coercionIndicators.push('Power or dependency may be combining with pressure in a way that reduces free choice.');\n  if(coercionChildSecrecy) coercionIndicators.push('A parent/caregiver sexual context involving a child was combined with secrecy. This is a strong safeguarding and grooming-risk indicator.');"""
if indicator_needle in s and 'grooming-risk indicator' not in s:
    s = s.replace(indicator_needle, indicator_insert, 1)

# Promote this pattern to a strong coercion/grooming indicator without claiming a legal finding.
s = s.replace(
    "  else if(coercionForce || coercionThreat || coercionRefusalIgnored || coercionPowerPattern) coercionLevel = 'high';",
    "  else if(coercionForce || coercionThreat || coercionRefusalIgnored || coercionPowerPattern || coercionChildSecrecy) coercionLevel = 'high';",
    1
)

# Use more precise result wording for child-secrecy cases.
s = s.replace(
    "      coercionLevel === 'high' ? 'Strong coercion indicators detected' :",
    "      coercionLevel === 'high' ? (coercionChildSecrecy ? 'Strong coercion / grooming indicators detected' : 'Strong coercion indicators detected') :",
    1
)

high_summary = "      'Several features can reduce a person’s freedom to choose, including threats, repeated pressure after refusal, power imbalance, dependency, or manipulation. The app flags these as coercion indicators rather than treating stated consent as the whole answer.' :"
replacement = """      (coercionChildSecrecy ?\n      'A child-parent/caregiver sexual context combined with secrecy is a strong safeguarding pattern and can be consistent with grooming or coercive dynamics. The app flags the pattern for safeguarding review; it does not determine intent, guilt, or a specific offence.' :\n      'Several features can reduce a person’s freedom to choose, including threats, repeated pressure after refusal, power imbalance, dependency, or manipulation. The app flags these as coercion indicators rather than treating stated consent as the whole answer.') :"""
if high_summary in s:
    s = s.replace(high_summary, replacement, 1)

# Update visible heading so the user understands this is broader than force-only coercion.
s = s.replace(
    '<Text style={styles.cardEyebrow}>COERCION CHECK</Text>',
    '<Text style={styles.cardEyebrow}>COERCION / GROOMING INDICATORS</Text>',
    1
)

required = [
    "has(t,['my mum','my mom','my mother','my dad','my father','my son','my daughter','my child'])",
    'const coercionChildSecrecy = structuralCritical && secrecy;',
    'Strong coercion / grooming indicators detected',
    'COERCION / GROOMING INDICATORS'
]
missing = [x for x in required if x not in s]
if missing:
    raise SystemExit('Child-parent safeguard patch failed; missing: ' + ', '.join(missing))

p.write_text(s)
print('Child-parent structural safeguard and secrecy/grooming indicators strengthened.')
