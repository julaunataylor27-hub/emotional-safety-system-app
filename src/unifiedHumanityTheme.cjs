'use strict';

/**
 * Unified Humanity — approved visual design contract (preparation only).
 *
 * This file intentionally does NOT change any running screen, user's data,
 * safety logic, source attribution, support number or navigation route.
 * Integration must use one theme provider on EVERY screen before a theme
 * selector can be exposed in Settings.
 */
const THEME_ID = 'unified-humanity';

const colors = {
  canvas: '#F9F3E8',
  surface: '#FFF9EF',
  card: '#EAD9BE',
  forest: '#193D32',
  eucalyptus: '#57744D',
  ochre: '#C6812A',
  gold: '#ECB65F',
  terracotta: '#A74634',
  teal: '#336C73',
  brown: '#25221D',
  body: '#25221D',
  muted: '#4C4940',
  border: '#B9A688',
  white: '#FFFFFF',
};

const typography = {
  headingFamily: 'ESSHeading',  // bundled Marcellus
  bodyFamily: 'ESSBody',        // bundled DM Sans
  heading: {fontSize: 28, lineHeight: 36},
  sectionTitle: {fontSize: 23, lineHeight: 31},
  body: {fontSize: 16, lineHeight: 25},
  caption: {fontSize: 14, lineHeight: 21},
  button: {fontSize: 16, lineHeight: 24},
};

const geometry = {
  minTouchTarget: 48,
  cardRadius: 18,
  buttonRadius: 15,
  sheetRadius: 22,
  pageHorizontalPadding: 16,
  cardPadding: 16,
  cardGap: 12,
  navHeight: 58,
};

const components = {
  screen: {backgroundColor: colors.canvas, textColor: colors.body},
  header: {backgroundColor: colors.forest, textColor: colors.white, subtitleColor: '#F9F3E8'},
  navigation: {backgroundColor: colors.forest, textColor: '#F9F3E8', activeColor: colors.gold},
  card: {backgroundColor: colors.surface, borderColor: colors.border, titleColor: colors.brown},
  primaryButton: {backgroundColor: colors.gold, textColor: colors.brown},
  secondaryButton: {backgroundColor: colors.surface, textColor: colors.forest, borderColor: colors.forest},
  urgentButton: {backgroundColor: colors.terracotta, textColor: colors.white},
  modal: {backgroundColor: colors.surface, textColor: colors.brown},
  input: {backgroundColor: colors.white, textColor: colors.brown, borderColor: colors.border},
  selected: {backgroundColor: colors.forest, textColor: colors.white},
};

const nav = [
  {route: 'home', label: 'Home', icon: 'Home'},
  {route: 'journey', label: 'Journey', icon: 'Journey'},
  {route: 'learn', label: 'Learn', icon: 'Knowledge'},
  {route: 'evidence', label: 'Evidence', icon: 'Knowledge'},
  {route: 'support', label: 'Support', icon: 'Humanity'},
  {route: 'more', label: 'More', icon: 'More'},
];

const values = [
  {id: 'knowledge', label: 'Knowledge', caption: 'Learn and question', icon: 'Knowledge'},
  {id: 'understanding', label: 'Understanding', caption: 'Discover meaning', icon: 'Understanding'},
  {id: 'love', label: 'Love', caption: 'Care and connection', icon: 'Love'},
  {id: 'kindness', label: 'Kindness', caption: 'Compassion in action', icon: 'Kindness'},
  {id: 'patience', label: 'Patience', caption: 'Room to grow', icon: 'Patience'},
  {id: 'growth', label: 'Growth', caption: 'Learn from experience', icon: 'Growth'},
  {id: 'humanity', label: 'Humanity', caption: 'Shared responsibility', icon: 'Humanity'},
  {id: 'life', label: 'Life', caption: 'Living with purpose', icon: 'Life'},
];

const screens = {
  home: {
    heading: 'Knowledge Creates Choice',
    subtitle: 'Culture, evidence and emotional safety to support stronger individuals, families and communities.',
    primaryAction: {label: 'Explore the System', route: 'assessment'},
    hero: 'Sunrise, Country, river and eucalyptus landscape',
  },
  journey: {
    heading: 'My Humanity Journey',
    subtitle: 'Grow yourself. Grow humanity.',
    primaryAction: {label: 'Start my journey', route: 'journey'},
    hero: 'Sunrise over winding river, eucalyptus trees and reflective path',
  },
  learn: {
    heading: 'Learn Together',
    subtitle: 'Ideas. Perspectives. Real Change.',
    primaryAction: {label: 'Explore learning', route: 'learn'},
    hero: 'Warm landscape and structured educational reading cards',
  },
  evidence: {
    heading: 'Evidence & Truth',
    subtitle: 'Understand the facts. Explore your options.',
    primaryAction: {label: 'Open Evidence & Truth Lab', route: 'evidence'},
    hero: 'Quiet, minimal backdrop prioritising readable evidence and uncertainty',
  },
  support: {
    heading: 'You Are Not Alone',
    subtitle: 'Support. Connection. Hope.',
    primaryAction: {label: 'I Need Support Now', route: 'support'},
    hero: 'Warm community scene with uncluttered emergency support pathway',
  },
  more: {
    heading: 'Settings & More',
    subtitle: 'Your app. Your preferences.',
    primaryAction: {label: 'Language & reading', route: 'settings'},
    hero: 'Simple cream reading surface with clear sections',
  },
};

const screenFamilies = {
  // Existing screen routes retain their established behaviour and destinations.
  home: 'home',
  journey: 'journey', foundation: 'journey', values: 'journey',
  identity: 'journey', story: 'journey', projects: 'journey',
  sharing: 'journey', legacy: 'journey', tech: 'journey',
  summary: 'journey', journal: 'journey', lifeJourney: 'journey',
  learn: 'learn', safeCuriosity: 'learn', livingConnections: 'learn',
  culturalInquiry: 'learn', knowledgeTrail: 'learn',
  learningTogether: 'learn', exploreConnections: 'learn',
  lawRightsKinship: 'learn', independenceCommitment: 'learn',
  evidence: 'evidence', assessment: 'evidence', analysis: 'evidence',
  results: 'evidence', explanation: 'evidence', next: 'evidence',
  diamond: 'evidence',
  support: 'support', supportDirectory: 'support',
  more: 'more', settings: 'more', about: 'more', flow: 'more', vision: 'more',
};

/** Unknown routes use shared surfaces; they must never silently navigate elsewhere. */
function screenFamily(route) {
  return Object.prototype.hasOwnProperty.call(screenFamilies, route)
    ? screenFamilies[route] : 'shared';
}

/** Prefer readable labels to microscopic text or forced single-line truncation. */
function valueGridColumns(widthDp, fontScale = 1, readingSize = 'standard') {
  return widthDp < 420 || fontScale > 1.1 || readingSize === 'large' ? 2 : 4;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object') return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

const design = deepFreeze({
  id: THEME_ID,
  status: 'design-foundation-not-activated',
  title: 'Emotional Safety System',
  tagline: 'Grow Yourself. Grow Humanity.',
  colors, typography, geometry, components, nav, values, screens, screenFamilies,
});

module.exports = {THEME_ID, design, screenFamily, valueGridColumns};
