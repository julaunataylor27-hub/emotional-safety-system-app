// Public learning content. This module does not accept or infer personal ancestry.
const META = {
  title: 'Compare & stay curious',
  lead: 'Explore what sources say. Keep room for what is still unknown.',
  checked: '16 October 2026',
  status: 'Educational research draft',
  review: 'Cultural review, reuse permissions and legal review pending. No community endorsement claimed.',
  scope: 'Selected public accounts with different dates and purposes. A missing detail does not mean a community had no such practice.',
  comparison: 'The questions and comparisons are our learning aids. They do not establish shared ancestry, identical customs or one system for all Yamatji peoples.',
};

const SOURCES = {
  noongar: {
    label: 'Collard, Harben & van den Berg · Noongar interpretive history',
    url: 'https://www.derbalnara.org.au/NIDJABEELIARBOODJARNOONOOKURTNYININY.pdf',
    date: '2004',
    kind: 'Noongar-authored cultural research',
    locator: 'Printed pp. 14–15 and 42–43',
    scope: 'Whadjuk-focused research including other Noongar voices; inherited and contemporary knowledge.',
  },
  whadjuk: {
    label: 'Derbal Nara · Moieties and Totems',
    url: 'https://www.derbalnara.org.au/moort-totems',
    date: 'Undated public page',
    kind: 'Public Whadjuk cultural account',
    locator: 'Moieties and Totems section',
    scope: 'An account of traditional Whadjuk social divisions and responsibilities; not a description of every Noongar group.',
  },
  wajarri: {
    label: 'Hamlett · Wajarri Yamatji Part B judgment',
    url: 'https://casechat.au/cases/au/hamlett-on-behalf-of-the-wajarri-yamatji-people-part-b-v-state-of-western-australia',
    date: '23 April 2018',
    kind: 'Connection evidence recorded in a judgment',
    locator: '[2018] FCA 545, paragraphs 25–30 and 42–44',
    scope: 'Historical and contemporary connection evidence. This link is a hosted copy of the judgment.',
  },
  badimia: {
    label: 'Badimia Language Learning · Country, People and Culture',
    url: 'https://badimialanguage.com.au/badimia-country-people-and-culture/',
    date: 'Undated public page',
    kind: 'Badimia community language resource',
    locator: 'Country, People and Culture section',
    scope: 'The project’s public account of Country, language and responsibilities.',
  },
  speakers: {
    label: 'Badimia Language Learning · Acknowledgements',
    url: 'https://badimialanguage.com.au/acknowledgements/',
    date: 'Undated public page',
    kind: 'Named family and speaker contributions',
    locator: 'Acknowledgements section',
    scope: 'Contributors to this language project; not a complete list of Badimia knowledge holders.',
  },
  governance: {
    label: 'Wajarri Yamaji Aboriginal Corporation · 2023 rulebook',
    url: 'https://www.wajarri.com.au/wp-content/uploads/2023/02/WajarriYamaji_Rule-Book-2023.pdf',
    date: 'Registered 20 February 2023',
    kind: 'Contemporary corporate governance',
    locator: 'Rules 9 and 19; definition of Consensus',
    scope: 'This dated rulebook concerns corporation-related matters. It is not a general procedure for family or personal disputes.',
  },
};

const GROUPS = [
  {id: 'whadjuk', short: 'Whadjuk', label: 'Whadjuk Noongar', scope: 'Whadjuk-focused sources; keep other Noongar voices identified.'},
  {id: 'wajarri', short: 'Wajarri', label: 'Wajarri Yamatji', scope: 'Wajarri-specific accounts; not a substitute for other Yamatji peoples’ accounts.'},
  {id: 'badimia', short: 'Badimia', label: 'Badimia', scope: 'Badimia project accounts, using their own names and source wording.'},
];

// Reuse attributed statements across views, rather than generating new cultural claims.
const FACTS = {
  trilogy: {source: 'noongar', text: 'The authors explain Noongar knowledge through boodjar (Country), moort (family or relations) and katitjin (knowledge). This is their attributed framework, not a system credited to Yagan personally.'},
  access: {source: 'noongar', text: 'The study describes family affiliations and kinship access to particular Country around the Swan and Canning rivers.'},
  elders: {source: 'noongar', text: 'Elders carry responsibilities for passing knowledge to successive generations.'},
  differing: {source: 'noongar', text: 'The authors keep their conclusions provisional and acknowledge different Noongar interpretations and stories.'},
  moieties: {source: 'whadjuk', text: 'The page describes two traditional Whadjuk divisions, Manitj and Wardung, inherited through the mother, with marriage across divisions and responsibilities to care for totems.'},
  waterholes: {source: 'wajarri', text: 'The judgment records families caring for particular bimarra associated with waterholes and ancestral beliefs, and recognised family authority over particular areas of Country.'},
  familyCountry: {source: 'wajarri', text: 'The connection evidence describes family landholding adapting through the pastoral era, alongside continued teaching and care for Country.'},
  barna: {source: 'badimia', text: 'The project connects Barna (Country) with language, stories, family visits to significant places and responsibilities to protect Country.'},
  resources: {source: 'badimia', text: 'Its account describes caring for Barna through words and actions, including taking only the food needed to protect animals and vegetation.'},
  speakers: {source: 'speakers', text: 'The project credits women and men, including Maggie Bell, Joe Benjamin, Clara George and Ollie George, alongside other family contributors to language recording and teaching.'},
  council: {source: 'governance', text: 'The rulebook provides for Elders’ guidance on Country, law, custom and language, preferably with a woman and man appointed by each Land Committee.'},
  disputes: {source: 'governance', text: 'For corporation-related disputes, it provides for informal good-faith discussion, written notice and possible referral to the Council of Elders. Its definition of consensus considers and reconciles differing views.'},
};

// Short editorial previews of the attributed statements above. The full wording,
// the same sources and the account's evidence gap remain available beside them.
const PREVIEWS = {
  trilogy: 'In this Noongar-authored framework, Country, family or relations, and knowledge are connected.',
  access: 'The study describes family and kinship connections to particular Country around the Swan and Canning rivers.',
  elders: 'Elders have responsibilities for passing knowledge to later generations.',
  differing: 'The researchers acknowledge different Noongar interpretations and keep their conclusions provisional.',
  moieties: 'This Whadjuk account describes Manitj and Wardung divisions, inherited through the mother, with marriage across divisions and care for totems.',
  waterholes: 'The judgment records family care for particular waterholes and recognised family authority over areas of Country.',
  familyCountry: 'The connection evidence describes family landholding changing through the pastoral era, with continued teaching and care for Country.',
  barna: 'The Badimia project connects Barna (Country), language, stories, family visits and responsibilities to protect Country.',
  resources: 'The account describes taking only the food needed to help protect animals and vegetation.',
  speakers: 'The language project credits women, men and family contributors for recording and teaching language.',
  council: 'The 2023 corporate rulebook provides for Elders’ guidance on Country, law, custom and language.',
  disputes: 'The 2023 rulebook describes discussion and possible Elders’ referral for corporation-related disputes.',
};

const TOPICS = [
  {id: 'country', label: 'Country & responsibilities', question: 'How do people describe their responsibilities to Country?', accounts: {
    whadjuk: {facts: ['trilogy', 'access'], unknown: 'This source does not establish Yagan’s personal wording or a framework he devised.'},
    wajarri: {facts: ['waterholes'], unknown: 'The judgment itself notes limits to reconstructing the full body of law at sovereignty. It is not a complete cultural account.'},
    badimia: {facts: ['barna', 'resources'], unknown: 'This account does not establish a three-part system shared by every Yamatji community.'},
  }},
  {id: 'kinship', label: 'Family & belonging', question: 'What kinds of relationships does each source actually describe?', accounts: {
    whadjuk: {facts: ['moieties'], unknown: 'A social division is not the same thing as a family’s landholding rights. This entry cannot assign anyone a division or totem.'},
    wajarri: {facts: ['familyCountry'], unknown: 'This landholding account does not provide a directly equivalent moiety or marriage chart. That gap does not establish its absence.'},
    badimia: {facts: ['barna'], unknown: 'The selected page does not set out detailed descent or marriage rules. Those questions need further appropriate sources.'},
  }},
  {id: 'teaching', label: 'Teaching & guidance', question: 'Who carries knowledge, and how is their contribution recognised?', accounts: {
    whadjuk: {facts: ['elders'], unknown: 'An individual’s authority to share a particular teaching needs its own context and appropriate guidance.'},
    wajarri: {facts: ['familyCountry', 'council'], unknown: 'The 2023 Council is a corporate governance example; it cannot establish the exact organisation of authority in the 1830s.'},
    badimia: {facts: ['speakers'], unknown: 'Acknowledging contributors does not authorise reuse of every recording, story or teaching.'},
  }},
  {id: 'disagreement', label: 'Different views & repair', question: 'What can these sources tell us about hearing different views?', accounts: {
    whadjuk: {facts: ['differing'], unknown: 'The researchers’ approach does not establish a traditional procedure for resolving personal disputes.'},
    wajarri: {facts: ['disputes'], unknown: 'Rule 19 explicitly excludes individual disputes outside corporate roles. It does not establish how families repair interpersonal harm.'},
    badimia: {facts: [], unknown: 'No detailed interpersonal dispute or repair procedure is established by the Badimia sources selected here. This is an open research question, not evidence that no such practices exist.'},
  }},
];

const QUESTIONS = [
  {id: 'different-systems', title: 'Did these peoples organise life differently?', topic: 'country', pair: ['whadjuk', 'badimia'], sources: ['noongar', 'badimia'],
    start: 'Compare local accounts with their own names, dates and purposes attached.',
    open: 'These selected accounts cannot reconstruct every community’s complete historical system.',
    prompts: ['Which responsibilities are explicitly described?', 'Are we comparing the same kind of evidence and historical period?']},
  {id: 'care-for-place', title: 'Who has responsibilities for a place?', topic: 'country', pair: ['whadjuk', 'wajarri'], sources: ['noongar', 'wajarri'],
    start: 'Look for who a source identifies as caring for, accessing or making decisions about particular Country.',
    open: 'A broad regional description cannot establish a particular person’s authority.',
    prompts: ['What does the source say about family and place?', 'Whose account or guidance would deepen this explanation?']},
  {id: 'belonging', title: 'How do family relationships shape belonging?', topic: 'kinship', pair: ['whadjuk', 'wajarri'], sources: ['whadjuk', 'wajarri'],
    start: 'Distinguish social divisions, family relationships and landholding. These describe different things.',
    open: 'The sources here do not provide matching charts or establish any reader’s ancestry.',
    prompts: ['What relationship is actually being described?', 'What would we need before comparing the rules directly?']},
  {id: 'passing-knowledge', title: 'How is knowledge carried forward?', topic: 'teaching', pair: ['whadjuk', 'badimia'], sources: ['noongar', 'speakers'],
    start: 'Keep named contributors and the scope of their contribution visible.',
    open: 'Public attribution does not settle which knowledge is appropriate for an app to reproduce.',
    prompts: ['Whose voices are represented or missing?', 'How should knowledge holders be credited and involved?']},
  {id: 'hearing-difference', title: 'How are disagreements heard?', topic: 'disagreement', pair: ['wajarri', 'badimia'], sources: ['governance'],
    start: 'Begin with the documented corporate example, then notice the limits of its scope.',
    open: 'We still need appropriate local accounts of interpersonal repair. A corporate process cannot answer that question for everyone.',
    prompts: ['Who gets to explain a different view?', 'What does the source leave unanswered about repairing relationships?']},
  {id: 'triangle', title: 'Is there a traditional Yamatji triangle?', topic: 'country', pair: ['whadjuk', 'badimia'], sources: ['noongar', 'badimia'],
    start: 'Check the authorship and scope of every diagram or framework before giving it a cultural label.',
    open: 'A traditional teaching called the “Yamatji triangle” has not been verified in this research. Our three-way sketch remains an interpretation.',
    prompts: ['Is the shape part of the source or something we added?', 'Does the community recognise this wording and allow its public use?']},
];

const searchText = JSON.stringify({title: META.title, groups: GROUPS, topics: TOPICS, questions: QUESTIONS, terms: 'curiosity curious compare comparison cultural accounts Noongar Nyungar Yamatji Yamaji Badimaya'}).toLowerCase();
function matchesSearch(query) {
  return typeof query === 'string' && searchText.includes(query.trim().toLowerCase());
}

module.exports = {META, SOURCES, GROUPS, FACTS, PREVIEWS, TOPICS, QUESTIONS, matchesSearch};
