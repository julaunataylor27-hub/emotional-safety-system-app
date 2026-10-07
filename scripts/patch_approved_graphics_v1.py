"""Connect the five approved standalone graphics to the final rendered app."""
from pathlib import Path

p = Path("App.js")
s = p.read_text()

# Replace legacy embedded/data-URI imports with normal static image assets.
imports = {
    "RIDERS_CREST": ("./assets/riders_crest", "./assets/graphics/riders-crest-v1.webp"),
    "AUSTRALIA_CODE_ART": ("./assets/australia_code_art", "./assets/graphics/australia-code-art-v1.webp"),
    "KNOWLEDGE_JUSTICE": ("./assets/knowledge_justice", "./assets/graphics/knowledge-justice-v1.webp"),
    "humanityHero": ("./assets/humanity_hero", "./assets/graphics/humanity-hero-v1.webp"),
}
for name, (old_path, new_path) in imports.items():
    new_import = f"import {name} from '{new_path}';"
    if new_import not in s:
        old_import = f"import {name} from '{old_path}';"
        if old_import not in s:
            raise SystemExit(f"Approved graphics: import for {name} missing")
        s = s.replace(old_import, new_import, 1)

primary_import = "import PRIMARY_RIDERS from './assets/graphics/primary-riders-v1.webp';"
if primary_import not in s:
    anchor = "import KNOWLEDGE_JUSTICE from './assets/graphics/knowledge-justice-v1.webp';"
    if anchor not in s:
        raise SystemExit("Approved graphics: knowledge import anchor missing")
    s = s.replace(anchor, anchor + "\n" + primary_import, 1)

# Static Metro assets use source={ASSET}; legacy generated art used URI strings.
for name in ["RIDERS_CREST", "AUSTRALIA_CODE_ART", "KNOWLEDGE_JUSTICE", "PRIMARY_RIDERS", "humanityHero"]:
    s = s.replace("source={{uri:" + name + "}}", "source={" + name + "}")

# Later Humanity design patches replace the earlier brand header. Put the approved
# crest into the final header while preserving its text and diamond control.
final_header = '''  const Header=()=> <View style={styles.humanityHeader}>
    <PremiumTreeLogo size={48}/>
    <View style={{flex:1}}><Text style={styles.humanityHeaderTitle}>EMOTIONAL SAFETY SYSTEM</Text><Text style={styles.humanityHeaderSub}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text></View>
    <Text style={styles.headerBell}>♢</Text>
  </View>;'''
approved_header = '''  const Header=()=> <View style={styles.humanityHeader}>
    <View style={styles.brandCrestShell}><Image source={RIDERS_CREST} style={styles.brandCrestImage}/></View>
    <View style={{flex:1}}><Text style={styles.humanityHeaderTitle}>EMOTIONAL SAFETY SYSTEM</Text><Text style={styles.humanityHeaderSub}>PEOPLE • CULTURE • TRUTH • SAFETY • FUTURE</Text></View>
    <Text style={styles.headerBell}>♢</Text>
  </View>;'''
if "source={RIDERS_CREST}" not in s:
    if final_header not in s:
        raise SystemExit("Approved graphics: final Humanity header not found")
    s = s.replace(final_header, approved_header, 1)

# Graphic 1: final Home cinematic background. The Humanity graphic remains on
# journey/scenic surfaces below.
home_humanity = 'source={humanityHero} resizeMode="cover" style={StyleSheet.absoluteFillObject}'
home_australia = 'source={AUSTRALIA_CODE_ART} resizeMode="cover" style={StyleSheet.absoluteFillObject}'
if home_australia not in s:
    if home_humanity not in s:
        raise SystemExit("Approved graphics: final Home cinematic background not found")
    s = s.replace(home_humanity, home_australia, 1)

# Graphic 4: About/project identity. Graphic 3 stays on Learning Centre.
about_knowledge = "source={KNOWLEDGE_JUSTICE} style={styles.aboutBrandHero}"
about_riders = "source={PRIMARY_RIDERS} style={styles.aboutBrandHero}"
if about_riders not in s:
    if about_knowledge not in s:
        raise SystemExit("Approved graphics: About identity hero not found")
    s = s.replace(about_knowledge, about_riders, 1)

# Tag a real rendered surface for each approved graphic. This is deliberately
# done after all routing so each source can be verified independently.
markers = [
    ("RIDERS_CREST", "approved-riders-crest"),
    ("AUSTRALIA_CODE_ART", "approved-australia-code-art"),
    ("KNOWLEDGE_JUSTICE", "approved-knowledge-justice"),
    ("PRIMARY_RIDERS", "approved-primary-riders"),
    ("humanityHero", "approved-humanity-hero"),
]
for name, test_id in markers:
    marker = f'testID="{test_id}"'
    if marker in s:
        continue
    source = f"source={{{name}}}"
    if source not in s:
        raise SystemExit(f"Approved graphics: no final rendered source found for {name}")
    s = s.replace(source, marker + " " + source, 1)

required = [
    "./assets/graphics/australia-code-art-v1.webp",
    "./assets/graphics/humanity-hero-v1.webp",
    "./assets/graphics/knowledge-justice-v1.webp",
    "./assets/graphics/primary-riders-v1.webp",
    "./assets/graphics/riders-crest-v1.webp",
    'testID="approved-australia-code-art"',
    'testID="approved-humanity-hero"',
    'testID="approved-knowledge-justice"',
    'testID="approved-primary-riders"',
    'testID="approved-riders-crest"',
]
missing = [item for item in required if item not in s]
if missing:
    raise SystemExit("Approved graphics connection failed; missing: " + ", ".join(missing))

p.write_text(s)
print("PASS: all five approved graphics are connected to final rendered app surfaces.")
