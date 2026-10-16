const META = Object.freeze({
  title: 'Learning together',
  status: 'Practice draft',
  origin: 'Six ideas shared by Julauna Taylor: encouragement, pace, timing, knowledge, conversation and peace.',
  scope: 'An app-created practice based on personal experience. It invites people to learn together while keeping their own choices and room to disagree. The garden example is fictional. The six parts are not attributed to Yagan, Tim Berners-Lee or a whole cultural community.',
  privacy: 'Choices and notes stay in this app session. Restarting the app clears them. Preview and share a copy if you want to keep your writing.',
});

const STEPS = [
  {id: 'encouragement', label: 'Encouragement', meaning: 'Support to ask questions, try and keep learning.',
    context: 'One adult knows about gardening. Another is learning.', prompt: 'How could you invite them to take part?',
    options: [
      {label: 'Invite their questions', plan: 'Ask what they would like to learn.'},
      {label: 'Offer a small shared task', plan: 'Ask whether they would like to try a small step together.'},
    ]},
  {id: 'pace', label: 'Pace', meaning: 'Room to learn without being rushed.',
    context: 'You want to choose a way of learning that suits you both.', prompt: 'Which approach would you like to try?',
    options: [
      {label: 'One step at a time', plan: 'Learn one step at a time, checking the pace together.'},
      {label: 'See the whole task first', plan: 'Start with an overview, then choose a part to practise.'},
    ]},
  {id: 'timing', label: 'Timing', meaning: 'Recognising when to speak, act, listen or wait.',
    context: 'Both people have a say in when to begin.', prompt: 'What timing would suit the conversation?',
    options: [
      {label: 'Check if now suits', plan: 'Begin now only if both people are ready.'},
      {label: 'Choose another time', plan: 'Choose another time that suits both people.'},
    ]},
  {id: 'knowledge', label: 'Knowledge', meaning: 'Share what you know and check what remains uncertain.',
    context: 'You hear conflicting advice about when to plant.', prompt: 'How would you check what is known?',
    options: [
      {label: 'Compare local guidance', plan: 'Compare relevant sources and keep uncertainties visible.'},
      {label: 'Ask, then check', plan: 'Learn from an experienced grower and check how the advice applies locally.'},
    ]},
  {id: 'conversation', label: 'Conversation', meaning: 'Listen, question and check that you understand each other.',
    context: 'You have shared an explanation about planting.', prompt: 'How could you check that you understand each other?',
    options: [
      {label: 'Ask what needs explaining', plan: 'Ask what makes sense and what needs explaining.'},
      {label: 'Explain in our own words', plan: 'With agreement, take turns explaining what you understood.'},
    ]},
  {id: 'peace', label: 'Peace', meaning: 'Space to think and disagree without threats or pressure.',
    context: 'You disagree about where the garden should go.', prompt: 'What could you try while respecting both people?',
    options: [
      {label: 'Pause and listen', plan: 'Allow a pause and hear each person without pressure to agree.'},
      {label: 'Explore both ideas', plan: 'Compare both ideas and keep the choice open.'},
    ]},
];

function createPractice() {
  return {view: 'intro', index: 0, paused: false, answers: {}, topic: '', reflection: '', unknowns: '', nextStep: ''};
}

function updateAnswer(practice, stepId, choice) {
  const step = STEPS.find(item => item.id === stepId);
  if (!step || (choice !== null && (!Number.isInteger(choice) || !step.options[choice]))) return practice;
  return {...practice, answers: {...practice.answers, [stepId]: choice}};
}

function selectedApproach(practice, step) {
  const choice = practice?.answers?.[step.id];
  return Number.isInteger(choice) && step.options[choice] ? step.options[choice].plan : 'Left open — no approach chosen.';
}

function written(value) { return typeof value === 'string' && value.trim() ? value.trim() : 'Not recorded'; }

function practiceText(practice) {
  return [
    'Learning together · My practice plan',
    'Educational draft · Proposed choices, not measured outcomes.',
    META.origin,
    'Practice example: two adults learning to start a shared garden. Fictional.',
    '', 'My possible topic (my own words)', written(practice.topic), '',
    ...STEPS.flatMap((step, index) => [(index + 1) + '. ' + step.label, selectedApproach(practice, step), '']),
    'What became clearer? (my own reflection)', written(practice.reflection), '',
    'What still needs checking?', written(practice.unknowns), '',
    'My possible next step (optional)', written(practice.nextStep), '',
    'Personal notes are unverified. A selection does not establish that learning, peace or safety improved.',
  ].join('\n');
}

function matchesSearch(query) {
  if (typeof query !== 'string') return false;
  const value = query.trim().toLowerCase();
  return !value || 'learning together learn together encouragement pace timing knowledge conversation peace shared garden'.includes(value);
}

module.exports = {META, STEPS, createPractice, updateAnswer, selectedApproach, practiceText, matchesSearch};
