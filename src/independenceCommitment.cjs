const META = Object.freeze({
  title: 'Independence & commitment',
  lead: 'Room to be yourself. Care you freely choose.',
  scope: 'An app-created reflection for relationships, shared tasks or personal goals. Balance can look different for each person and can change over time.',
  privacy: 'Your writing stays in this app session. Restarting the app clears it. Preview and share a copy if you want to keep it.',
});

const STEPS = [
  {id: 'space', label: 'My space', meaning: 'What helps me keep a sense of myself?',
    prompt: 'What time, interests, privacy or boundaries do I need?',
    placeholder: 'For example: quiet time, seeing friends, or time for my own interests.'},
  {id: 'commitment', label: 'My chosen commitment', meaning: 'What do I want to give my time and care to?',
    prompt: 'What small commitment can I freely and realistically offer?',
    placeholder: 'For example: offer a check-in time that could work for us both.'},
  {id: 'choice', label: 'Room to choose', meaning: 'A commitment needs room for an honest answer.',
    prompt: 'Do I feel free to say no, ask for time or revise this plan?'},
  {id: 'checkIn', label: 'Check in & adapt', meaning: 'Be clear about what is possible and what may need to change.',
    prompt: 'When or how would I like to check in?',
    placeholder: 'For example: ask whether tomorrow afternoon would suit us both.'},
];

const CHOICES = [
  {id: 'yes', label: 'Yes, I feel free to choose'},
  {id: 'unsure', label: "I'm not sure"},
  {id: 'no', label: "No, I don't feel free"},
  {id: 'open', label: 'Leave this open'},
];

const SOURCES = [
  {id: 'wa', author: 'WA Department of Communities', title: 'Promoting respectful relationships',
    url: 'https://www.wa.gov.au/organisation/department-of-communities/promoting-respectful-relationships',
    checked: '19 October 2026',
    summary: 'Describes independence, respect for boundaries, communication and shared decision-making.'},
  {id: 'respect', author: '1800RESPECT', title: 'Signs of a healthy relationship',
    url: 'https://1800respect.org.au/signs-healthy-relationship', checked: '19 October 2026',
    summary: 'Describes freedom to keep interests, friendships and personal choices, alongside respectful communication.'},
];

function createReflection() {
  return {view: 'intro', index: 0, paused: false, space: '', commitment: '', choice: 'open', respect: '', checkIn: '', changePlan: ''};
}

function choiceLabel(value) {
  return CHOICES.find(item => item.id === value)?.label || CHOICES[3].label;
}

function choiceNotice(value) {
  if (value === 'no' || value === 'unsure') return 'You can pause before agreeing. Leave the commitment open, revise it or seek support. You do not have to share this reflection or negotiate if you feel unsafe.';
  if (value === 'yes') return 'This records your answer only. Each person chooses for themselves and can express a different view.';
  return 'No answer has been chosen. You can leave this open and come back to it.';
}

function written(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : 'Left open';
}

function reflectionText(reflection) {
  return [
    META.title + ' · My reflection',
    'My proposed choices — I can pause or revise them.', '',
    'My space', written(reflection.space), '',
    'My chosen commitment', written(reflection.commitment), '',
    'Do I feel free to say no, ask for time or revise this plan?', choiceLabel(reflection.choice),
    choiceNotice(reflection.choice), '',
    'How I can respect the other person’s choices', written(reflection.respect), '',
    'When or how I would like to check in', written(reflection.checkIn), '',
    'If plans change', written(reflection.changePlan), '',
    'This records my view only. Another person has not agreed by my writing this.',
    'A reflection is not a contract, proof of consent or a safety assessment. No reminder is scheduled.',
  ].join('\n');
}

function matchesSearch(query) {
  if (typeof query !== 'string') return false;
  const terms = query.trim().toLowerCase().split(/\s+/);
  const publicWords = 'independence independent commitment commitments balance freedom choice boundaries personal space privacy reconnect check in check-in reliability promise promises relationships time';
  return terms.every(term => publicWords.includes(term));
}

module.exports = {META, STEPS, CHOICES, SOURCES, createReflection, choiceLabel, choiceNotice, reflectionText, matchesSearch};
