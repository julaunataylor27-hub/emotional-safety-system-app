import React, {useEffect, useState} from 'react';
import {View, Image, Pressable, StyleSheet, Linking, BackHandler} from 'react-native';
import {AppText as Text} from './AppPreferences';
import {P} from './PresentationTheme';
const H = require('./timPictureTrail.json');

const BUNDLED = {
  server: require('../assets/learning/first-web-server.webp'),
  browser: require('../assets/learning/worldwideweb-browser.png'),
  firstwebsite: require('../assets/learning/first-website-emulator.png'),
  reunion2009: require('../assets/learning/web-reunion-2009.webp'),
  portrait: require('../assets/learning/tim-berners-lee-2014.jpg'),
};

function Button({id, label, onPress, primary, disabled, expanded, selected}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{...(expanded === undefined ? {} : {expanded}), ...(selected === undefined ? {} : {selected}), disabled: !!disabled}}
    disabled={disabled} onPress={onPress}
    style={({pressed}) => [s.button, (primary || selected) && s.primary, disabled && s.disabled, pressed && s.pressed]}>
    <Text style={[s.buttonText, (primary || selected) && s.dark]}>{label}</Text>
  </Pressable>;
}

function Picture({point}) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return <View style={s.section}>
    {!failed ? <View style={[s.imageFrame, {aspectRatio: point.media.width / point.media.height}, point.id === 'book' && s.book]}><Image key={attempt} testID="picture-trail-image" source={BUNDLED[point.id] || {uri: point.media.url}}
      accessibilityLabel={point.caption} resizeMode="contain"
      onError={() => setFailed(true)} style={s.image}/></View>
      : <View testID="picture-trail-image-error" style={s.note} accessibilityLiveRegion="polite">
        <Text style={s.body}>This archive image could not load. You can retry or use its image source below. The caption and decision trail are still available.</Text>
        <Button id="picture-trail-image-retry" label="Retry image" onPress={() => {setFailed(false); setAttempt(value => value + 1);}}/>
      </View>}
    <Text style={s.small}>{point.caption}</Text>
    <Text style={s.credit}>{point.credit}</Text>
    {point.media.kind === 'archive' && <Text style={s.credit}>Archive image · internet connection needed. Text and captions remain available offline.</Text>}
  </View>;
}

export default function TimPictureTrail({onBack, onScrollTop, onStartOwn}) {
  const [index, setIndex] = useState(0);
  const [picker, setPicker] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(true);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [error, setError] = useState(null);
  const point = H.points[index];
  function move(position) {
    setIndex(Math.max(0, Math.min(H.points.length - 1, position)));
    setPicker(false); setDecisionOpen(true); setError(null); onScrollTop?.();
  }
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (picker) setPicker(false);
      else if (index > 0) move(index - 1);
      else onBack();
      return true;
    });
    return () => handler.remove();
  }, [picker, index, onBack, onScrollTop]);
  async function open(url) {
    setError(null);
    try { await Linking.openURL(url); } catch { setError(url); }
  }
  return <View testID="tim-picture-trail" style={s.section}>
    <Text style={s.eyebrow}>Knowledge Trail · Picture history</Text>
    <Text accessibilityRole="header" style={s.title}>Tim’s work, in order.</Text>
    <Text style={s.small}>Explore the pictures, the evidence and the questions connecting each step.</Text>
    <Button id="picture-trail-choose" label={'Choose a milestone. Current: ' + point.label} expanded={picker} onPress={() => setPicker(value => !value)}/>
    {picker && <View testID="picture-trail-options" style={s.section}>
      {H.points.map((item, position) => <Button key={item.id} id={'picture-trail-option-' + item.id}
        label={item.label} selected={position === index} onPress={() => move(position)}/>)}
    </View>}
    <Text accessibilityLiveRegion="polite" style={s.eyebrow}>{index + 1} / {H.points.length} · {point.date}</Text>
    <Text accessibilityRole="header" style={s.heading}>{point.title}</Text>
    <Picture key={point.id} point={point}/>
    <View style={s.links}>
      <Button id="picture-trail-image-source" label="Image source" onPress={() => open(point.imageSource)}/>
      {!!point.terms && <Button id="picture-trail-image-terms" label="Reuse terms" onPress={() => open(point.terms)}/>}
    </View>
    <View style={s.divider}>
      <Button id="picture-trail-decisions-toggle" label="Follow the decision trail" expanded={decisionOpen} onPress={() => setDecisionOpen(value => !value)}/>
      {decisionOpen && <View testID="picture-trail-decisions" style={s.section}>
        <Text style={s.credit}>{H.framework}</Text>
        {[
          ['Question · our prompt', point.decision.question],
          ['Recorded action', point.fact],
          ['What the evidence establishes', point.decision.change],
          ['Next connection · our interpretation', point.decision.next],
        ].map(([label, value]) => <View key={label} style={s.field}><Text style={s.label}>{label}</Text><Text selectable style={s.body}>{value}</Text></View>)}
      </View>}
    </View>
    <Button id="picture-trail-record" label="Follow the historical record" onPress={() => open(point.record)}/>
    {!!error && <View testID="picture-trail-link-error" style={s.note} accessibilityLiveRegion="polite">
      <Text style={s.small}>The website could not open. Copy the address or try again.</Text>
      <Text selectable style={s.url}>{error}</Text>
      <Button id="picture-trail-link-retry" label="Try link again" onPress={() => open(error)}/>
    </View>}
    <View style={s.field}><Text style={s.label}>Keep wondering</Text><Text style={s.body}>{point.question}</Text></View>
    <View style={s.links}>
      <Button id="picture-trail-previous" label="Previous picture" disabled={index === 0} onPress={() => move(index - 1)}/>
      {index < H.points.length - 1 && <Button id="picture-trail-next" label="Next picture" primary onPress={() => move(index + 1)}/>}
    </View>
    {index === H.points.length - 1 && <Button id="picture-trail-own" label="Start my own trail" primary onPress={onStartOwn}/>}
    <View style={s.divider}>
      <Button id="picture-trail-background-toggle" label="Earlier background · Before these pictures" expanded={backgroundOpen} onPress={() => setBackgroundOpen(value => !value)}/>
      {backgroundOpen && <View testID="picture-trail-background" style={s.section}>
        <Text style={s.small}>His biography records that he built a computer while at Oxford, graduating in 1976. At CERN in 1980, he developed ENQUIRE to keep track of connected information. Photographs of those exact activities have not been verified for this trail.</Text>
        <Button id="picture-trail-biography" label="His biography" onPress={() => open('https://www.w3.org/People/Berners-Lee/Longer.html')}/>
        <Button id="picture-trail-enquire" label="October 1980 manual" onPress={() => open('https://www.w3.org/People/Berners-Lee/EnquireManual.htm')}/>
      </View>}
    </View>
    <Text style={s.credit}>Research preview · Educational use · Checked {H.checked}. Selected milestones, rather than a complete record of his life or the Web’s development. Inclusion implies no endorsement. Curiosity questions are our prompts.</Text>
  </View>;
}

const s = StyleSheet.create({
  section: {gap: 16}, field: {gap: 6}, eyebrow: {fontSize: 13, lineHeight: 21, color: P.gold},
  title: {fontFamily: 'ESSHeading', fontSize: 31, lineHeight: 41, color: P.text},
  heading: {fontSize: 23, lineHeight: 32, fontWeight: '600', color: P.text},
  body: {fontSize: 17, lineHeight: 28, color: P.text}, small: {fontSize: 14, lineHeight: 23, color: P.muted},
  credit: {fontSize: 13, lineHeight: 21, color: P.muted}, label: {fontSize: 14, lineHeight: 23, fontWeight: '600', color: P.gold},
  imageFrame: {width: '100%', borderRadius: 12, overflow: 'hidden'}, image: {width: '100%', height: '100%'}, book: {maxWidth: 290, alignSelf: 'center'},
  button: {minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: P.line, paddingHorizontal: 14, paddingVertical: 12, justifyContent: 'center'},
  buttonText: {fontSize: 16, lineHeight: 25, color: P.text, textAlign: 'center', fontWeight: '600'},
  primary: {backgroundColor: P.gold, borderColor: P.gold}, dark: {color: P.bg}, disabled: {opacity: .45}, pressed: {opacity: .78},
  links: {gap: 10}, divider: {borderTopWidth: 1, borderTopColor: P.line, paddingTop: 18, gap: 16},
  note: {borderLeftWidth: 2, borderLeftColor: P.gold, paddingLeft: 14, gap: 10}, url: {fontSize: 14, lineHeight: 23, color: P.gold},
});
