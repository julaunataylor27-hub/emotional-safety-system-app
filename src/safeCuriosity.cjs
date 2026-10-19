/* Safe Curiosity Lab: deliberately narrow, offline demonstration rules.
 * Never logs, persists, uploads, searches the web, or diagnoses people.
 * This is NOT a general-purpose safety classifier or parental control.
 */
const AGE_GROUPS = Object.freeze([
  {id: '6-9', label: '6–9 years'},
  {id: '10-12', label: '10–12 years'},
  {id: '13-17', label: '13–17 years'},
]);

const EXAMPLES = Object.freeze([
  {id: 'privacy', label: 'Private pictures', question: 'Why would someone ask me to keep private pictures a secret?'},
  {id: 'pressure', label: 'Being pressured', question: 'Someone keeps threatening me when I say no.'},
  {id: 'puberty', label: 'Growing up', question: 'What happens during puberty?'},
  {id: 'internet', label: 'How the web works', question: 'Why do websites recommend videos?'},
  {id: 'feelings', label: 'Big feelings', question: 'I feel overwhelmed at school.'},
]);

const SAFE_EDUCATION = Object.freeze({
  privacy: 'Your body and private pictures belong to you. You never owe anyone a private picture. If someone asks you to hide pictures or messages, tell a trusted adult who can help you stay safe.',
  pressure: 'Your no matters. Threats, pressure and requests for secrecy are reasons to get help. You can stop a conversation, leave it if possible, and speak with a trusted adult.',
  pubertyYoung: 'Growing up can change bodies, feelings and friendships. Bodies develop at different times. A trusted adult or health professional can help answer your questions without shame.',
  pubertyOlder: 'Puberty includes physical and emotional changes, and people develop at different rates. Learning about body boundaries, consent, respect and reliable health information can help.',
  feelings: 'Strong feelings happen to many people. You can take a pause, describe what you notice, and talk with someone who listens. Feelings alone do not prove why something happened.',
  web: 'Websites may suggest videos based on what people watch or click. You can choose to stop watching, adjust recommendations and ask an adult for help with safety settings.',
  general: 'That is a worthwhile question. This small prototype cannot reliably assess it yet. You can explore it with a trusted adult, teacher, librarian or a reliable educational source.',
  urgent: 'You deserve immediate, real-world support. If someone is in immediate danger in Australia, call 000. Otherwise, tell a trusted adult now, or contact Kids Helpline on 1800 55 1800.',
});

function normalise(value) {
  return typeof value === 'string' ? value.toLowerCase().normalize('NFKC').replace(/[’‘]/g, "'").trim() : '';
}

function reviewQuestion(question, ageGroup = '10-12') {
  const text = normalise(question).slice(0, 500);
  if (!text) return null;
  const group = AGE_GROUPS.some(item => item.id === ageGroup) ? ageGroup : '10-12';
  const younger = group !== '13-17';
  let id = 'general';
  // Priority matters: an urgent disclosure must not become a generic puberty lesson.
  if (/\b(suicid(?:e|al)|kill myself|hurt myself|self[ -]?harm|want to die|someone is hurting me|being abused|unsafe at home)\b/.test(text)) id = 'urgent';
  else if (/\b(private|naked|nude|secret|hidden)\b/.test(text) && /\b(picture|pictures|photo|photos|image|images|video|videos|message|messages|send|share)\b/.test(text)
    || /\b(send (me |them |someone )?(nudes|naked photos|private pictures)|asking for nudes|secret pictures)\b/.test(text)) id = 'privacy';
  else if (/\b(threat|threats|threaten|threatening|blackmail|pressur|force|forced|coerc|scare|scared|won't stop|wouldn't stop|said no|say no)\w*\b/.test(text)) id = 'pressure';
  else if (/\b(puberty|periods?|menstruat\w*|body changes|grow(?:ing)? up|sex|consent|kissing|pregnan\w*)\b/.test(text)) id = 'puberty';
  else if (/\b(overwhelmed|sad|anxious|anxiety|lonely|upset|bully|bullied|feelings?|emotions?)\b/.test(text)) id = 'feelings';
  else if (/\b(internet|website|websites|video|videos|algorithm|recommend|online|search|world wide web)\w*\b/.test(text)) id = 'web';

  const entries = {
    urgent: {title: 'Find real-world help', reason: 'Possible words about danger or self-harm', guidance: SAFE_EDUCATION.urgent, next: 'Talk to a trusted adult now; use emergency help if danger is immediate.', status: 'Seek support'},
    privacy: {title: 'Private pictures & boundaries', reason: 'Words about private pictures and secrecy', guidance: SAFE_EDUCATION.privacy, next: 'Learn about privacy and talk to a trusted adult if this is happening.', status: 'Safety guidance'},
    pressure: {title: 'Respecting a no', reason: 'Words that may describe pressure, threats or refusal', guidance: SAFE_EDUCATION.pressure, next: 'Practise a safe boundary and seek trusted help if someone is pressuring you.', status: 'Safety guidance'},
    puberty: {title: 'Growing up with knowledge', reason: 'A question about development, relationships or consent', guidance: younger ? SAFE_EDUCATION.pubertyYoung : SAFE_EDUCATION.pubertyOlder, next: 'Find an age-appropriate educational book or trusted health resource.', status: 'Learning'},
    feelings: {title: 'Understanding feelings', reason: 'Words describing feelings or bullying', guidance: SAFE_EDUCATION.feelings, next: 'Name a feeling and choose someone safe to talk with.', status: 'Learning'},
    web: {title: 'Understanding the internet', reason: 'Words about websites, videos or recommendations', guidance: SAFE_EDUCATION.web, next: 'Explore how recommendations work and practise online safety settings.', status: 'Learning'},
    general: {title: 'Keep asking good questions', reason: 'No example rule matched clearly', guidance: SAFE_EDUCATION.general, next: 'Explore a trusted educational source with someone you trust.', status: 'Unknown / needs review'},
  };
  return {id, ...entries[id], ageGroup: group, limitation: 'Example keyword rules only: the result may be wrong or incomplete. No website, image or video was checked. No one’s emotions or intentions were inferred.'};
}

function matchesSearch(query) {
  if (typeof query !== 'string') return false;
  if (!query.trim()) return true;
  const allowed = 'safe curiosity lab curious online children child internet education chip prototype learning websites questions age appropriate privacy digital device protect safety';
  return query.toLowerCase().trim().split(/\s+/).every(term => allowed.split(' ').some(word => word.startsWith(term)));
}

module.exports = {AGE_GROUPS, EXAMPLES, reviewQuestion, matchesSearch};
