from pathlib import Path

p=Path('App.js')
s=p.read_text()

# Compatibility/polish layer for the full Humanity experience when it runs
# after the next-gen visual patch. Keeps analysis/safeguarding logic untouched.

head=s.split("from 'react-native';",1)[0]
if 'Share' not in head:
    s=s.replace('Animated, ImageBackground\n} from \'react-native\';','Animated, ImageBackground, Share\n} from \'react-native\';',1)
    s=s.replace('Animated\n} from \'react-native\';','Animated, Share\n} from \'react-native\';',1)

anchor="function JourneyTile({icon,title,subtitle,onPress,accent='#486239'}){"
if 'function ScenicBanner' not in s:
    block=r'''function ScenicBanner({title,subtitle,quote}){
  return <ImageBackground source={{uri:humanityHero}} resizeMode="cover" style={styles.scenicBanner} imageStyle={styles.scenicBannerImage}>
    <View style={styles.scenicShade}/><GoldDotTrail side="left"/><GoldDotTrail side="right"/>
    <View style={styles.scenicTree}><PremiumTreeLogo size={86}/></View>
    <View style={styles.scenicCopy}><Text style={styles.scenicTitle}>{title}</Text>{subtitle?<Text style={styles.scenicSubtitle}>{subtitle}</Text>:null}</View>
    {quote?<View style={styles.scenicQuote}><Text style={styles.scenicQuoteText}>{quote}</Text></View>:null}
  </ImageBackground>;
}

function TechFeatureCard({icon,title,body,status='WORKING',accent='#D7A62F',onPress}){
  return <Pressable onPress={onPress} disabled={!onPress} style={({pressed})=>[styles.techCard,{borderColor:accent},pressed&&{opacity:.82}]}>
    <View style={[styles.techIcon,{borderColor:accent,shadowColor:accent}]}><Text style={styles.techIconText}>{icon}</Text></View>
    <View style={{flex:1}}><View style={styles.techTitleRow}><Text style={styles.techTitle}>{title}</Text><Text style={[styles.techStatus,{color:accent}]}>{status}</Text></View><Text style={styles.techBody}>{body}</Text></View>
    {onPress?<Text style={styles.techArrow}>›</Text>:null}
  </Pressable>;
}

'''
    if anchor not in s: raise SystemExit('Full Humanity fix: JourneyTile anchor missing')
    s=s.replace(anchor,block+anchor,1)

# Put the generated nature artwork directly behind the coded Home hero.
hero_anchor='<View style={styles.cinemaHero}>\n          <GoldDotTrail side="left"/><GoldDotTrail side="right"/>'
if hero_anchor in s:
    hero_new='<View style={styles.cinemaHero}>\n          <ImageBackground source={{uri:humanityHero}} resizeMode="cover" style={StyleSheet.absoluteFillObject} imageStyle={styles.cinemaHeroImage}><View style={styles.cinemaShade}/></ImageBackground>\n          <GoldDotTrail side="left"/><GoldDotTrail side="right"/>'
    s=s.replace(hero_anchor,hero_new,1)

style_marker='\n});'
extra=r''',
  cinemaHeroImage:{borderRadius:22},
  cinemaShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,13,8,.48)'},
  scenicBannerImage:{borderRadius:20},
  scenicShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(2,16,10,.50)'}
'''
idx=s.rfind(style_marker)
if idx<0: raise SystemExit('Full Humanity fix: stylesheet end missing')
s=s[:idx]+extra+s[idx:]

required=['function ScenicBanner','function TechFeatureCard','Share','humanityHero','cinemaShade']
missing=[x for x in required if x not in s]
if missing: raise SystemExit('Full Humanity fix failed: '+', '.join(missing))

p.write_text(s)
print('Full Humanity compatibility and cinematic image polish applied.')
