"""Connect the five approved standalone graphics to the real app."""
from pathlib import Path
import re

p = Path("App.js")
s = p.read_text()

# Replace old embedded Base64/data-URI asset imports with normal static files.
imports = {
    "RIDERS_CREST": "./assets/graphics/riders-crest-v1.webp",
    "AUSTRALIA_CODE_ART": "./assets/graphics/australia-code-art-v1.webp",
    "KNOWLEDGE_JUSTICE": "./assets/graphics/knowledge-justice-v1.webp",
    "humanityHero": "./assets/graphics/humanity-hero-v1.webp",
}
old_paths = {
    "RIDERS_CREST": "./assets/riders_crest",
    "AUSTRALIA_CODE_ART": "./assets/australia_code_art",
    "KNOWLEDGE_JUSTICE": "./assets/knowledge_justice",
    "humanityHero": "./assets/humanity_hero",
}

for name, new_path in imports.items():
    new_import = f"import {name} from '{new_path}';"
    if new_import in s:
        continue
    old_import = f"import {name} from '{old_paths[name]}';"
    if old_import not in s:
        raise SystemExit(f"Approved graphics: import for {name} missing")
    s = s.replace(old_import, new_import, 1)

primary_import = "import PRIMARY_RIDERS from './assets/graphics/primary-riders-v1.webp';"
if primary_import not in s:
    anchor = "import KNOWLEDGE_JUSTICE from './assets/graphics/knowledge-justice-v1.webp';"
    if anchor not in s:
        raise SystemExit("Approved graphics: knowledge import anchor missing")
    s = s.replace(anchor, anchor + "\n" + primary_import, 1)

# Old generated assets were strings and used source={{uri:...}}.
# Static Metro assets must use source={ASSET}.
for name in ["RIDERS_CREST", "AUSTRALIA_CODE_ART", "KNOWLEDGE_JUSTICE", "PRIMARY_RIDERS", "humanityHero"]:
    s = s.replace("source={{uri:" + name + "}}", "source={" + name + "}")

# Give Graphic 4 a dedicated identity surface while Graphic 3 remains Learning Centre art.
about_patterns = [
    "source={KNOWLEDGE_JUSTICE} style={styles.aboutBrandHero}",
    "source={{uri:KNOWLEDGE_JUSTICE}} style={styles.aboutBrandHero}",
]
if "source={PRIMARY_RIDERS} style={styles.aboutBrandHero}" not in s:
    changed = False
    for old in about_patterns:
        if old in s:
            s = s.replace(old, "source={PRIMARY_RIDERS} style={styles.aboutBrandHero}", 1)
            changed = True
            break
    if not changed:
        raise SystemExit("Approved graphics: About identity hero not found")

# Add stable IDs by modifying the first occurrence of each actual source.
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
        raise SystemExit(f"Approved graphics: no rendered source found for {name}")
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
print("PASS: all five approved standalone graphics are connected to the app.")
