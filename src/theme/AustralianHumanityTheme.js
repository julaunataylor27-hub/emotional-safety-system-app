// Australian Humanity theme foundation — visual-only design values.
// Cultural imagery is illustrative; this does not claim to represent any nation's restricted knowledge.
export const HUMANITY = Object.freeze({
  colours: Object.freeze({
    bg:'#050A0F',
    panel:'#0B1720',
    panel2:'#132431',
    line:'#2F414B',
    text:'#F7F3E8',
    muted:'#AEBBC0',
    gold:'#DDAE45',
    green:'#2AA79A',
    red:'#C95A54',
    amber:'#C98B35',
    teal:'#188E8B',
    glow:'#F4C65B',
    ink:'#0A1015'
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
