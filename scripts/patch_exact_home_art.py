from pathlib import Path

p = Path('App.js')
s = p.read_text()

# Keep the riders identity as the small crest, but use the user's Australia/code
# artwork as the large Home hero on the real app.
s = s.replace(
    "import PRIMARY_RIDERS from './assets/primary_riders';\nimport KNOWLEDGE_JUSTICE from './assets/knowledge_justice';",
    "import RIDERS_CREST from './assets/riders_crest';\nimport AUSTRALIA_CODE_ART from './assets/australia_code_art';\nimport KNOWLEDGE_JUSTICE from './assets/knowledge_justice';",
    1
)

s = s.replace(
    "<Image source={{uri:PRIMARY_RIDERS}} style={styles.brandCrestImage}/>",
    "<Image source={{uri:RIDERS_CREST}} style={styles.brandCrestImage}/>",
    1
)

s = s.replace(
    "<ImageBackground source={{uri:PRIMARY_RIDERS}} style={styles.brandHero} imageStyle={styles.brandHeroImage}>",
    "<ImageBackground source={{uri:AUSTRALIA_CODE_ART}} style={styles.brandHero} imageStyle={styles.brandHeroImage}>",
    1
)

# Show the whole circular artwork instead of cropping it like the old horse image.
s = s.replace(
    "brandHeroImage:{borderRadius:20,resizeMode:'cover'},",
    "brandHeroImage:{borderRadius:20,resizeMode:'contain',backgroundColor:'#000'},",
    1
)

# Keep the artwork clear while preserving readable gold/white overlay text.
s = s.replace(
    "brandHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.36)'},",
    "brandHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.18)'},",
    1
)

required = [
    "RIDERS_CREST", "AUSTRALIA_CODE_ART",
    "source={{uri:RIDERS_CREST}}", "source={{uri:AUSTRALIA_CODE_ART}}",
    "resizeMode:'contain'"
]
missing = [x for x in required if x not in s]
if missing:
    raise SystemExit('Exact home-art patch failed; missing: ' + ', '.join(missing))

p.write_text(s)
print('Exact Home artwork applied: riders crest preserved, Australia/code art used as hero.')
