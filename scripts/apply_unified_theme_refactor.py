"""Full-app unified theme source refactor.

Converts every styled product screen to the shared PresentationTheme layer.
This changes source files themselves; it is not a runtime visual patch.
"""
from pathlib import Path
import re

TARGETS = {
    "src/AncientAnimalsScreen.js":"s",
    "src/AustralianHumanityOverview.js":"s",
    "src/ConnectionAdventure.js":"s",
    "src/CulturalConnectionsScreen.js":"s",
    "src/CulturalInquiryScreen.js":"s",
    "src/EssCoreScreen.js":"s",
    "src/ExploreConnectionsScreen.js":"s",
    "src/GoldenTreeHome.js":"s",
    "src/IndependenceCommitmentScreen.js":"s",
    "src/KnowledgeTrailScreen.js":"s",
    "src/LawRightsKinshipScreen.js":"s",
    "src/LearningTogetherScreen.js":"s",
    "src/SafeCuriosityScreen.js":"s",
    "src/SupportDirectoryScreen.js":"styles",
    "src/TimPictureTrail.js":"s",
    "src/TwoFlamesScreen.js":"s",
}

MARKER = "// UNIFIED_THEME_V4"

def add_theme_import(source):
    pat = re.compile(r"import\s*\{([^}]*)\}\s*from\s*['\"]\.\/PresentationTheme['\"];")
    m = pat.search(source)
    if m:
        names=[x.strip() for x in m.group(1).split(",") if x.strip()]
        if "presentationStyles" not in names:
            names.append("presentationStyles")
        replacement="import {"+",".join(names)+"} from './PresentationTheme';"
        return source[:m.start()]+replacement+source[m.end():]
    return "import {presentationStyles} from './PresentationTheme';\n"+source

changed=[]
for filename,varname in TARGETS.items():
    path=Path(filename)
    source=path.read_text(encoding="utf-8")
    if MARKER in source:
        continue
    if "StyleSheet.create" not in source:
        raise SystemExit(f"{filename}: expected StyleSheet.create")
    source=add_theme_import(source)
    source += f"\n\n{MARKER}\nObject.assign({varname},presentationStyles({varname}));\n"
    path.write_text(source,encoding="utf-8")
    changed.append(filename)

print(f"Unified theme applied to {len(changed)} source screens")
for item in changed:
    print(" -",item)

# Trigger unified source conversion.
