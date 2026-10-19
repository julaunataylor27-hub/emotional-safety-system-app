// Public reading only. Never accepts an assessment, family tree or private notes.
const CONTENT = require('./lawRightsKinship.json');
const META = CONTENT.meta;
const SOURCES = CONTENT.sources;
const TOPICS = CONTENT.topics;
const SECTIONS = [
  {id: 'all', label: 'All topics'},
  {id: 'law', label: 'Rights & law'},
  {id: 'kinship', label: 'Kinship & culture'},
  {id: 'parliament', label: 'Parliament & change'},
];
const SCOPES = [
  {id: 'all', label: 'All areas'},
  {id: 'AU', label: 'Australia-wide'},
  {id: 'WA', label: 'Western Australia'},
  {id: 'community', label: 'Community context'},
];
const ALIASES = {
  marriage: 'LGBT LGBTQ LGBTQIA lesbian gay bisexual trans transgender nonbinary marriage wedding',
  threepartners: 'polyamory polyamorous throuple triad two women one man three people partners de facto',
  consent: 'yes no pause stop signature consent form sexual agreement',
  ages: 'age consent teacher coach authority child young person',
  violence: 'coercive control emotional safety domestic family violence restraining order abuse',
  images: 'online sexting photos intimate images privacy',
  equality: 'LGBT LGBTQ LGBTQIA discrimination racism disability gender equality rights',
  systems: 'Aboriginal First Nations two societies two systems law lore kinship kindship',
  noongar: 'Noongar Nyungar Nyoongar Whadjuk moort family kinship kindship totem',
  permissions: 'Elder Elders community permission cultural authority sacred restricted knowledge ethics',
  haveyoursay: 'parliament parlimant petition legislation legalisation legalization proposal reform advocacy',
};
const words = value => typeof value === 'string' ? value.toLowerCase().trim().split(/\s+/).filter(Boolean) : [];
const publicText = topic => JSON.stringify([topic, ALIASES[topic.id] || '', ...topic.sources.map(id => SOURCES[id])]).toLowerCase();
function filterTopics({section = 'all', scope = 'all', query = ''} = {}) {
  if (!SECTIONS.some(item => item.id === section) || !SCOPES.some(item => item.id === scope) || typeof query !== 'string') return [];
  const terms = words(query);
  return TOPICS.filter(topic => (section === 'all' || topic.section === section)
    && (scope === 'all' || topic.scope.includes(scope))
    && terms.every(term => publicText(topic).includes(term)));
}
function matchesSearch(query) {
  if (typeof query !== 'string') return false;
  const terms = words(query);
  const entries = [META.title + ' ' + META.lead, ...TOPICS.map(topic => [topic.title, topic.summary, ALIASES[topic.id] || ''].join(' '))];
  return entries.some(entry => terms.every(term => entry.toLowerCase().includes(term)));
}
function topicById(id) { return TOPICS.find(topic => topic.id === id) || null; }
function sourceUrl(id) {
  const source = Object.prototype.hasOwnProperty.call(SOURCES, id) ? SOURCES[id] : null;
  if (!source || typeof source.url !== 'string') return null;
  try {
    const url = new URL(source.url);
    return url.protocol === 'https:' && !url.username && !url.password ? source.url : null;
  } catch { return null; }
}
module.exports = {META, SOURCES, TOPICS, SECTIONS, SCOPES, filterTopics, matchesSearch, topicById, sourceUrl};
