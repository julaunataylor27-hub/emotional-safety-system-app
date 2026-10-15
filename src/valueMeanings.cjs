// App-authored definitions and reflections, grounded in public Noongar material.
// These English headings are Julauna Taylor's framework, not a traditional list.
const SOURCES = {
  knowledge: { title:'Noongar Boodjar Language Cultural Aboriginal Corporation — Protocols', url:'https://noongarboodjar.com.au/protocols/' },
  lore: { title:'South West Aboriginal Land & Sea Council — Noongar Lore', url:'https://juddh37.sg-host.com/noongar-lore/' },
  family: { title:'South West Aboriginal Land & Sea Council — Family', url:'https://juddh37.sg-host.com/family/' },
  country: { title:'South West Aboriginal Land & Sea Council — Connection to Country', url:'https://juddh37.sg-host.com/connection-to-country/' },
  education: { title:'South West Aboriginal Land & Sea Council — Education', url:'https://juddh37.sg-host.com/education/' },
};

const CULTURAL_NOTE = 'Aboriginal peoples have diverse cultures and experiences. These reflections draw on public Noongar sources; they do not describe everyone’s feelings. The eight values belong to Julauna Taylor’s app framework, rather than a traditional cultural list.';

const VALUE_MEANINGS = [
  {
    name:'Knowledge',
    definition:'What we learn through experience, observation, teaching and evidence.',
    culture:'Noongar knowledge is valued and may belong to an individual or a community. Elders pass knowledge between generations. Learning can connect people to family, Country and identity; sharing it respects the knowledge holders and their permissions.',
    reflection:'What have my family, Elders or life experiences taught me — and what do I still want to learn?',
    sources:['knowledge','lore','country'],
  },
  {
    name:'Understanding',
    definition:'Making sense of what we learn by listening, asking questions and considering context.',
    culture:'Public Noongar accounts connect understanding Country with family relationships, knowledge and responsibilities. This app invites listening to people’s own accounts and learning where their knowledge comes from, rather than assuming one story describes every Aboriginal person.',
    reflection:'What might I understand differently if I listened before deciding?',
    sources:['country','education'],
  },
  {
    name:'Love',
    definition:'Care and connection expressed with respect for another person’s wellbeing and choices.',
    culture:'SWALSC describes family as central to Noongar culture, with close connections across extended kin. In this app, love is a reflection on that belonging and practical care, alongside people’s connection to Country. It is not limited to romantic relationships.',
    reflection:'What helps me feel cared for while remaining free to be myself?',
    sources:['family','country'],
  },
  {
    name:'Kindness',
    definition:'Showing care through actions that respect another person’s needs and dignity.',
    culture:'Noongar lore includes sharing, reciprocity and responsibilities to family and community. This app connects kindness with giving and receiving care, while respecting people’s limits. This is an app reflection, not a claim that every person expresses care in the same way.',
    reflection:'What small act of care could I offer today without ignoring my own needs?',
    sources:['lore','family'],
  },
  {
    name:'Patience',
    definition:'Giving learning, feelings and decisions time, without pressure to rush.',
    culture:'Public Noongar accounts describe learning from Elders and observing seasonal changes when caring for Country. This app connects those examples with taking time to listen and notice. This is a reflection on patience, not a traditional definition of the word.',
    reflection:'What needs time today, and what boundary would help me take that time safely?',
    sources:['lore','country'],
  },
  {
    name:'Growth',
    definition:'Developing skills, awareness and ways of living that support wellbeing.',
    culture:'SWALSC describes knowledge being passed to younger generations, who take on responsibilities as future custodians. This app connects growth with learning who we are and what we can contribute, while maintaining connections to family, culture and Country.',
    reflection:'What am I learning, and what do I want to carry forward?',
    sources:['lore','family'],
  },
  {
    name:'Humanity',
    definition:'Recognising every person’s dignity, feelings and right to make choices.',
    culture:'Noongar family accounts describe reciprocal relationships between generations. Aboriginal peoples also belong to many distinct Nations and communities. This app connects humanity with recognising people as individuals, respecting their voice and valuing connection without erasing difference.',
    reflection:'How can I respect both my own dignity and another person’s voice?',
    sources:['family','education'],
  },
  {
    name:'Life',
    definition:'Our living experience: body, feelings, relationships and the world we share.',
    culture:'In public Noongar accounts, Country carries physical and spiritual meaning, alongside responsibilities to care for land and future generations. This app connects life with belonging within relationships and caring for the living world, rather than seeing wellbeing as only an individual matter.',
    reflection:'What helps me feel connected to life, and what can I care for today?',
    sources:['country'],
  },
];

module.exports = { VALUE_MEANINGS, CULTURAL_NOTE, SOURCES };
