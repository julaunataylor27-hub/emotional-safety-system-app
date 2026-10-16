// An app-created learning framework illustrated with attributed public accounts.
// Reading a source never verifies a claim or completes a safety assessment.
const META = {
  title: 'Knowledge Trail',
  status: 'Learning prototype',
  checked: '16 October 2026',
  scope: 'These five steps are our learning aid, illustrated with Tim Berners-Lee’s public accounts. This is not his own named method or an endorsement by him.',
  privacy: 'Your writing stays in this app session. Leaving this screen keeps it; closing or restarting the app clears it. Share a copy only when you choose.',
};

const SOURCES = {
  questions: {label: 'Tim Berners-Lee · Answers for young people', url: 'https://www.w3.org/People/Berners-Lee/Kids.html', kind: 'First-person recollection', date: 'Undated page', locator: 'What made you think of the WWW?; What did you do when you were a child?', scope: 'His recollections of childhood and the information-sharing problem at CERN.'},
  proposal: {label: 'Information Management: A Proposal', url: 'https://www.w3.org/History/1989/proposal.html', kind: 'Original project proposal', date: 'March 1989; redistributed May 1990', locator: 'Losing Information at CERN; Linked information systems', scope: 'A proposed solution to information loss at CERN, rather than a record of every later result.'},
  history: {label: 'Tim Berners-Lee · A very short personal history', url: 'https://www.w3.org/People/Berners-Lee/ShortHistory.html', kind: 'First-person retrospective', date: '7 May 1998', locator: 'Opening account, the first programs and the dream behind the Web', scope: 'His later explanation of development and aspirations; it does not reveal every private thought.'},
  photo: {label: 'Portrait credit · Paul Clarke, 2014', url: 'https://commons.wikimedia.org/wiki/File:Sir_Tim_Berners-Lee.jpg', kind: 'Photograph · CC BY-SA 4.0', date: '24 September 2014', locator: 'Original photograph, reproduced without image edits', scope: 'Paul Clarke. Licence: https://creativecommons.org/licenses/by-sa/4.0/ . Inclusion does not imply endorsement.'},
};

const STEPS = [
  {id: 'question', label: 'Question', prompt: 'What am I trying to understand?', hint: 'Start with something you want to explore. You can change your question later.',
    tim: {title: 'Why was information so hard to find?', label: 'Our starting question', text: 'Berners-Lee recalls information scattered across different computers at CERN. Access often required different logins and programs.', sources: ['questions'], prompt: 'Which practical difficulty would you want to understand first?'}},
  {id: 'sources', label: 'Sources', prompt: 'Where does the information come from?', hint: 'Record a title, author, date and where you found it. A source is a starting point to examine.',
    tim: {title: 'Go back to his own accounts', label: 'Three primary sources', text: 'Compare his recollections with the original 1989 proposal. Notice the purpose and date of each account.', sources: ['questions', 'proposal', 'history'], prompt: 'What can a proposal show that a later recollection cannot?'}},
  {id: 'evidence', label: 'Evidence', prompt: 'What is supported, and what remains uncertain?', hint: 'Separate what the source actually says from your interpretation. Keep missing or conflicting information visible.',
    tim: {title: 'Keep the claim beside its evidence', label: 'What the documents say', text: 'The proposal describes information being lost as people move on, and recommends linked notes. His 1998 history reports building the first browser-editor and server in 1990.', sources: ['proposal', 'history'], unknown: 'These accounts do not establish a complete algorithm in his mind from the beginning, or every influence on his thinking.', prompt: 'Which part is a proposed idea, and which part is a later account of something built?'}},
  {id: 'connections', label: 'Connections', prompt: 'How does this relate to other things?', hint: 'Write a possible connection. Explain your reasoning and what would help check it.',
    tim: {title: 'Connect ideas without losing their origins', label: 'His account and our interpretation', text: 'Berners-Lee describes bringing existing hypertext ideas together with internet technology. He hoped a shared information space could help people cooperate.', sources: ['questions', 'history'], interpretation: 'Our learning connection: a practical problem can generate questions, experiments and a wider purpose. This is our reading of his accounts.', prompt: 'How could a small experiment help you explore your own question?'}},
  {id: 'choice', label: 'Choice', prompt: 'What could I decide or explore next?', hint: 'You can seek another source, try a small experiment, ask for guidance, pause or change your mind.',
    tim: {title: 'Choose where your curiosity goes next', label: 'Your next step', text: 'His history describes developing working programs and publishing specifications for discussion and adoption. Our prototype invites you to choose your own next question.', sources: ['history'], prompt: 'Would you like to read an original source, test a small idea or begin your own trail?'}},
];

function createTrail() {
  return {question: '', sources: '', sourceUrl: '', evidence: '', unknowns: '', connections: '', choice: ''};
}

function externalUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

function trailText(trail) {
  const value = key => typeof trail?.[key] === 'string' && trail[key].trim() ? trail[key].trim() : 'Not recorded';
  return ['MY KNOWLEDGE TRAIL', 'Emotional Safety System · Learning prototype',
    'My notes and interpretations are unverified. Reading a source does not establish that a claim is true.',
    ...STEPS.map(step => step.label + '\n' + value(step.id)),
    'Source website\n' + value('sourceUrl'), 'Uncertainty / missing information\n' + value('unknowns'),
    'My next step is optional and can change.'].join('\n\n');
}

const searchText = 'knowledge trail curiosity curious question sources evidence connections choice tim berners-lee berners lee world wide web internet prototype learning'.toLowerCase();
function matchesSearch(query) {
  return typeof query === 'string' && searchText.includes(query.trim().toLowerCase());
}

module.exports = {META, SOURCES, STEPS, createTrail, externalUrl, trailText, matchesSearch};
