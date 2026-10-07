"""Connect the five approved standalone graphics to the real app."""
from pathlib import Path

p = Path("App.js")
s = p.read_text()

replacements = {
    "import RIDERS_CREST from './assets/riders_crest';":
        "import RIDERS_CREST from './assets/graphics/riders-crest-v1.webp';",
    "import AUSTRALIA_CODE_ART from './assets/australia_code_art';":
        "import AUSTRALIA_CODE_ART from './assets/graphics/australia-code-art-v1.webp';",
    "import KNOWLEDGE_JUSTICE from './assets/knowledge_justice';":
        "import KNOWLEDGE_JUSTICE from './assets/graphics/knowledge-justice-v1.webp';",
    "import humanityHero from './assets/humanity_hero';":
        "import humanityHero from './assets/graphics/humanity-hero-v1.webp';",
}
for old, new in replacements.items():
    if old not in s and new not in s:
        raise SystemExit("Approved graphics: expected import missing: " + old)
    s = s.replace(old, new)

if "import PRIMARY_RIDERS from './assets/graphics/primary-riders-v1.webp';" not in s:
    anchor = "import KNOWLEDGE_JUSTICE from './assets/graphics/knowledge-justice-v1.webp';"
    if anchor not in s:
        raise SystemExit("Approved graphics: knowledge import anchor missing")
    s = s.replace(
        anchor,
        anchor + "\nimport PRIMARY_RIDERS from './assets/graphics/primary-riders-v1.webp';",
        1,
    )

# React Native static assets are imported objects, not data-URI strings.
for name in ["RIDERS_CREST", "AUSTRALIA_CODE_ART", "KNOWLEDGE_JUSTICE", "PRIMARY_RIDERS", "humanityHero"]:
    s = s.replace("source={{uri:" + name + "}}", "source={" + name + "}")

# Graphic 4 gets its own identity placement. Keep Graphic 3 on Learning Centre.
about_old = '<ImageBackground source={KNOWLEDGE_JUSTICE} style={styles.aboutBrandHero}'
about_new = '<ImageBackground source={PRIMARY_RIDERS} style={styles.aboutBrandHero}'
if about_old in s:
    s = s.replace(about_old, about_new, 1)
elif about_new not in s:
    raise SystemExit("Approved graphics: About hero anchor missing")

# Give the major surfaces stable IDs for smoke/UI verification.
ids = {
    '<Image source={RIDERS_CREST} style={styles.brandCrestImage}/>':
        '<Image testID="approved-riders-crest" source={RIDERS_CREST} style={styles.brandCrestImage}/>',
    '<ImageBackground source={AUSTRALIA_CODE_ART} style={styles.brandHero}':
        '<ImageBackground testID="approved-australia-code-art" source={AUSTRALIA_CODE_ART} style={styles.brandHero}',
    '<ImageBackground source={KNOWLEDGE_JUSTICE} style={styles.learningHero}':
        '<ImageBackground testID="approved-knowledge-justice" source={KNOWLEDGE_JUSTICE} style={styles.learningHero}',
    '<ImageBackground source={PRIMARY_RIDERS} style={styles.aboutBrandHero}':
        '<ImageBackground testID="approved-primary-riders" source={PRIMARY_RIDERS} style={styles.aboutBrandHero}',
}
for old, new in ids.items():
    if old in s:
        s = s.replace(old, new, 1)
    elif new not in s:
        raise SystemExit("Approved graphics: visual anchor missing: " + old)

# There are several Humanity Hero surfaces; tag the first Home cinematic one.
humanity_anchor = '<ImageBackground source={humanityHero} resizeMode="cover" style={StyleSheet.absoluteFillObject}'
humanity_tagged = '<ImageBackground testID="approved-humanity-hero" source={humanityHero} resizeMode="cover" style={StyleSheet.absoluteFillObject}'
if humanity_anchor in s:
    s = s.replace(humanity_anchor, humanity_tagged, 1)
elif humanity_tagged not in s:
    raise SystemExit("Approved graphics: Humanity hero anchor missing")

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
print("PASS: all five approved standalone graphics are connected to the app.")
