'use strict';

// A public, non-identifying learning metaphor, not a relationship score or assessment.
const TITLE = 'Two Flames — Healing Without Control';
const QUOTE = 'Two flames can share their warmth without one burning itself out for the other.';
const PRINCIPLES = Object.freeze([
  {
    id: 'mine',
    title: 'My flame',
    subtitle: 'I can care for my own wellbeing.',
    explanation: 'I can choose my pace, keep my identity, ask for space and decide what support feels right for me.'
  },
  {
    id: 'theirs',
    title: 'Their flame',
    subtitle: 'The other person owns their healing.',
    explanation: 'I can offer kindness and listen without assuming their feelings, directing their recovery or requiring them to respond.'
  },
  {
    id: 'shared',
    title: 'Our shared light',
    subtitle: 'We encourage, not control.',
    explanation: 'Laughter, affection, culture, faith, friendship or quiet company may be shared freely. Neither person owes closeness, disclosure or commitment.'
  }
]);
const REFLECTIONS = Object.freeze([
  {
    id: 'joy',
    label: 'Share joy',
    question: 'How can we enjoy a light moment?',
    example: 'Choose something playful or peaceful that both people want. Joy can be shared without becoming a promise.'
  },
  {
    id: 'space',
    label: 'Give space',
    question: 'How can we respect different healing paces?',
    example: 'Ask what kind of contact feels comfortable. Time apart is allowed; speak openly about needs rather than guessing.'
  },
  {
    id: 'choice',
    label: 'Protect choice',
    question: 'How do we keep closeness freely chosen?',
    example: 'Check in, accept a no or a change of mind, and avoid guilt or pressure. A yes today is never a standing obligation.'
  },
  {
    id: 'honesty',
    label: 'Stay honest',
    question: 'What if our feelings or boundaries change?',
    example: 'Make room for a respectful conversation. Either person may ask for a different arrangement or end it.'
  }
]);
const LIMITS = 'A reflection for supportive adult connections, not a relationship test, promise, therapy or proof that a situation is safe. If you feel pressured, afraid or controlled, seek trusted support.';
function findReflection(id) {
  return REFLECTIONS.find(item => item.id === id) || null;
}
module.exports = {TITLE, QUOTE, PRINCIPLES, REFLECTIONS, LIMITS, findReflection};
