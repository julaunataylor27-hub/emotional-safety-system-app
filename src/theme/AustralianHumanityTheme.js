// Australian Humanity theme foundation — visual-only design values.
// Cultural imagery is illustrative; this does not claim to represent any nation's restricted knowledge.
export const HUMANITY = Object.freeze({
  colours: Object.freeze({
    bg:'#060E18',
    panel:'#0B2633',
    panel2:'#123643',
    line:'#6D7465',
    text:'#FFF6E8',
    muted:'#D0D7D7',
    gold:'#F1B650',
    green:'#A9DBC1',
    red:'#F4A69A',
    amber:'#F1D28B'
  }),
  spacing: Object.freeze({xs:4,sm:8,md:16,lg:20,xl:28}),
  corners: Object.freeze({small:12,card:18,hero:22,pill:30}),
  typography: Object.freeze({heading:'ESSHeading',body:'ESSBody',bodySize:16,minBodyLineHeight:24}),
  minTouchTarget:48
});

// Require literal, bundled paths so Metro packages everything for offline use.
export const SCENES = Object.freeze({
  home:require('../../assets/graphics/australian-humanity/home-hero.webp'),
  journey:require('../../assets/graphics/australian-humanity/my-journey-bg.webp'),
  knowledge:require('../../assets/graphics/australian-humanity/knowledge-card.webp'),
  emotionalSafety:require('../../assets/graphics/australian-humanity/emotional-safety-card.webp'),
  evidence:require('../../assets/graphics/australian-humanity/evidence-truth-card.webp'),
  support:require('../../assets/graphics/australian-humanity/support-services-card.webp'),
  culture:require('../../assets/graphics/australian-humanity/culture-humanity-bg.webp'),
  twoFlames:require('../../assets/graphics/australian-humanity/two-flames-bg.webp')
});

export function sceneForTitle(value='') {
  const title=String(value).toLowerCase();
  if(/flames|shared light/.test(title))return 'twoFlames';
  if(/evidence|truth|record|law|justice|source/.test(title))return 'evidence';
  if(/support|service|help|resource/.test(title))return 'support';
  if(/culture|country|kinship|identity|belong/.test(title))return 'culture';
  if(/knowledge|learn|research|education/.test(title))return 'knowledge';
  if(/boundary|choice|emotion|safety|consent|feeling/.test(title))return 'emotionalSafety';
  return 'journey';
}
