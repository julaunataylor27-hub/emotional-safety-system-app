const META = {
  title: 'Explore connections', checked: '16 October 2026', status: 'Learning prototype',
  privacy: 'Optional reflections stay in this app session, including when you visit another screen. Restarting the app clears them. Preview a copy before choosing whether to share. External websites have their own privacy practices.',
  scope: 'An app-created exercise inspired by linked information in Tim Berners-Lee’s published Web proposal. It is not a collaboration or endorsement. Links explain relevance; browsing does not verify personal accounts, diagnose anyone or assess danger.',
};
const SOURCES = {
  respect: {
    title: 'Healthy Relationships', author: '1800RESPECT', date: 'Publication date not stated',
    url: 'https://1800respect.org.au/healthy-relationships',
    locator: 'Sections: Signs of a healthy relationship; Respect means',
    summary: 'The guidance describes being heard, making personal choices, being able to say no, handling disagreements respectfully and respecting privacy.',
    limit: 'General relationship guidance. It does not document this fictional event or establish a person’s intentions.',
  },
  proposal: {
    title: 'Information Management: A Proposal', author: 'Tim Berners-Lee · CERN', date: 'March 1989; May 1990',
    url: 'https://www.w3.org/History/1989/proposal.html',
    locator: 'Sections: Linked information systems; The problem with trees; Private links',
    summary: 'The proposal describes connected notes, meaningful types of links and private annotations. Our exercise applies that information design idea to a fictional learning example.',
    limit: 'A source for the linking approach. It provides no evidence that this app improves emotional safety.',
  },
};
const NODES = [
  {id: 'question', label: 'The question', type: 'Practice question', title: 'What could respect for a pause look like?',
    text: 'Start with two fictional adults, Jo and Alex. Jo asks for a break from a conversation. Explore what is described, what remains unknown and what choices might be available.',
    points: ['You can visit any part, change direction or leave a question open.', 'There is no required answer and no score.']},
  {id: 'experience', label: 'What happened', type: 'Fictional event', title: 'Jo asks for a break.',
    text: 'Jo says, “I need a break. I’m not ready to explain my feelings.” Alex asks three more times for an explanation. Jo says the repeated questions feel overwhelming.',
    points: ['These details were written for practice. They are not a report about real people.', 'The example gives no further history or information about what happens next.']},
  {id: 'feelings', label: 'Feelings', type: 'Fictional self-report', title: 'Make room for Jo’s own words.',
    text: 'Jo describes feeling overwhelmed. Alex’s feelings are not stated in the example.',
    points: ['Jo’s stated feeling can be recorded alongside the event.', 'We have not been told what either person intended.']},
  {id: 'knowledge', label: 'Boundaries & choice', type: 'General information', title: 'Explore respect, privacy and choice.',
    text: '1800RESPECT describes healthy relationships as allowing people to be heard, make their own choices and say no. Its guidance also includes respect for privacy.',
    points: ['A question to consider: what would give Jo room to choose when and whether to continue?', 'Applying this guidance to the example is our learning prompt.'], sources: ['respect']},
  {id: 'evidence', label: 'Read the source', type: 'Published source', title: 'Check what the source actually supports.',
    text: 'The 1800RESPECT page supports general learning about respect and choice. The scene about Jo and Alex is app-authored fiction.',
    points: ['Check the author, relevant section, date information and limits below.', 'A source about relationships cannot establish what happened in a separate personal situation.'], sources: ['respect']},
  {id: 'unknowns', label: 'What is unknown', type: 'Missing information', title: 'Leave space for what we do not know.',
    text: 'We do not know the wider history, Alex’s intentions, whether Jo can leave freely or how either person responds next.',
    points: ['An unanswered question can stay unanswered.', 'You do not have to confront someone or gather more information to complete this exercise.']},
  {id: 'choices', label: 'Possible next steps', type: 'Optional practice choices', title: 'Consider a choice that fits.',
    text: 'For the fictional example, possible choices include pausing the conversation, deciding later whether to return, or seeking support from someone trusted.',
    points: ['A conversation is optional. Any real next step needs to fit the person’s circumstances and safety.', 'You can also leave the next step open. No outcome is promised.']},
];
const LINKS = [
  {id: 'start', from: 'question', to: 'experience', label: 'Starts with', why: 'Read the specific scene before making an interpretation.'},
  {id: 'voice', from: 'question', to: 'feelings', label: 'Makes room for', why: 'Consider the feeling Jo actually names.'},
  {id: 'learn', from: 'question', to: 'knowledge', label: 'Explores', why: 'Use general information to develop a question about respect.'},
  {id: 'alongside', from: 'experience', to: 'feelings', label: 'Described alongside', why: 'The event and Jo’s reported feeling are recorded separately.'},
  {id: 'gaps', from: 'experience', to: 'unknowns', label: 'Leaves open', why: 'The short scene leaves important circumstances unstated.'},
  {id: 'reflect', from: 'feelings', to: 'knowledge', label: 'Prompts a question about', why: 'Explore what room for choice could look like without inferring intent.'},
  {id: 'source', from: 'knowledge', to: 'evidence', label: 'Is supported by', why: 'The source supports the general guidance shown here.'},
  {id: 'limits', from: 'evidence', to: 'unknowns', label: 'Has limits', why: 'Published guidance does not fill gaps in a particular event.'},
  {id: 'options', from: 'knowledge', to: 'choices', label: 'Informs reflection on', why: 'Consider optional next steps using the general guidance.'},
  {id: 'open', from: 'unknowns', to: 'choices', label: 'Keeps options open', why: 'Uncertainty can remain while a person considers their own next step.'},
  {id: 'return', from: 'choices', to: 'question', label: 'Can lead back to', why: 'A possible next step can raise another question.'},
];
const FIELDS = [
  {id: 'question', label: 'My question', placeholder: 'What am I curious about?'},
  {id: 'noticed', label: 'What I noticed or was told', placeholder: 'Keep events and the source of your information clear.'},
  {id: 'feeling', label: 'My feelings', placeholder: 'Describe your own feelings, if you want to.'},
  {id: 'unknowns', label: 'What remains uncertain', placeholder: 'What am I assuming? What have I not checked?'},
  {id: 'nextStep', label: 'My possible next step', placeholder: 'An optional choice, including leaving it open.'},
];
function node(id) { return NODES.find(item => item.id === id); }
function createExploration() {
  return {view: 'intro', nodeId: 'question', history: [], visited: [], paused: false,
    notes: Object.fromEntries(FIELDS.map(item => [item.id, '']))};
}
function visit(state, id) {
  if (!node(id)) return state;
  const history = state.view === 'map' && state.nodeId !== id ? [...state.history, state.nodeId] : state.history;
  return {...state, view: 'map', nodeId: id, paused: false, history,
    visited: state.visited.includes(id) ? state.visited : [...state.visited, id]};
}
function goBack(state) {
  if (state.paused) return {...state, paused: false};
  if (state.view === 'preview') return {...state, view: 'reflection'};
  if (state.view === 'reflection' || state.view === 'about') return {...state, view: state.visited.length ? 'map' : 'intro'};
  if (state.view === 'map' && state.history.length) return {...state, nodeId: state.history.at(-1), history: state.history.slice(0, -1)};
  if (state.view === 'map') return {...state, view: 'intro'};
  return null;
}
function related(id) {
  return LINKS.filter(link => link.from === id || link.to === id).map(link => ({...link, target: node(link.from === id ? link.to : link.from)}));
}
function updateNote(state, key, value) {
  if (!FIELDS.some(field => field.id === key) || typeof value !== 'string') return state;
  return {...state, notes: {...state.notes, [key]: value.slice(0, 1500)}};
}
function reflectionText(state) {
  return ['MY EXPLORE CONNECTIONS REFLECTION', 'Personal notes · unverified · optional choices',
    'The app example concerns fictional adults. My notes below are separate from that example.', '',
    ...FIELDS.flatMap(field => [field.label.toUpperCase(), state.notes[field.id].trim() || 'Left open', '']),
    'PUBLIC EXAMPLE PARTS VISITED', state.visited.map(id => node(id).label).join(' → ') || 'None yet', '',
    'GENERAL SOURCE', SOURCES.respect.author + ': ' + SOURCES.respect.title, SOURCES.respect.url,
    'This source does not verify my notes or establish anyone’s intentions.', '',
    'DESIGN INSPIRATION', SOURCES.proposal.author + ': ' + SOURCES.proposal.title, SOURCES.proposal.url,
    'App-created learning prototype. No diagnosis, safety assessment or measured outcome.'].join('\n');
}
function matchesSearch(query) {
  return typeof query === 'string' && ('explore connections linked information web tim berners lee curiosity question evidence feelings boundaries choice uncertainty'.includes(query.trim().toLowerCase()));
}
module.exports = {META, SOURCES, NODES, LINKS, FIELDS, node, createExploration, visit, goBack, related, updateNote, reflectionText, matchesSearch};
