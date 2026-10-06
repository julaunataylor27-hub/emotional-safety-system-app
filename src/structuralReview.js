const WA_CHILD_GUIDANCE = 'https://www.wa.gov.au/organisation/department-of-communities/concerns-the-safety-or-wellbeing-of-child-or-young-person';

const {hasCapacityObservation} = require('./observedResponses');

function reviewStructuralSafety(input) {
  const text = (input.text || '').toLowerCase();
  const parentWord = /\b(mum|mom|mother|dad|father|parent|caregiver|carer)\b/.test(text);
  const childWord = /\b(son|daughter|child|children|boy|girl|kid|teenager)\b/.test(text);
  const parentChild = input.familyRelation === 'Parent ↔ child' || (parentWord && childWord);
  const ageInWords = /\b([1-9]|1[0-7])\s*[- ]?\s*(?:years?|yrs?)\s*[- ]?\s*old\b/.test(text);
  const childAgeSelected = ['10–12','13–15','16–17'].includes(input.age);
  const childKnown = input.childSafety === 'Yes' || childAgeSelected || ageInWords;
  const sexualWords = /\b(sex|sexual|sexually|intercourse|penetration)\b/.test(text);
  const onlyEducation = /\bsexual (education|health education)\b/.test(text);
  const deniedContact = /\b(no|not|without) sexual (contact|conduct|activity)\b/.test(text) || /\bno sex\b/.test(text);
  const sexualSelected = ['Sexual penetration / intercourse','Other sexual contact'].includes(input.sexualConduct);
  const sexualConcern = input.sexualSafety === 'Yes' || sexualSelected || (sexualWords && !onlyEducation && !deniedContact);
  const possibleChildConcern = sexualConcern && (childKnown || parentChild || childWord);
  const immediate = input.immediateSafety === 'Yes';
  const capacityReported = hasCapacityObservation(input.observedPeople);
  const capacityConcern = sexualConcern && capacityReported;
  const reasons = [];
  if (immediate) reasons.push('You selected an immediate danger concern.');
  if (capacityReported) reasons.push('You recorded someone as asleep or unresponsive. Confirm whose state this was and whether sexual contact occurred at that time.');
  if (input.childSafety === 'Yes') reasons.push('You reported that a person under 18 is involved.');
  else if (childAgeSelected) reasons.push('The selected age range is under 18.');
  else if (ageInWords) reasons.push('The wording includes an age under 18; confirm whose age this is.');
  if (parentChild) reasons.push(input.familyRelation === 'Parent ↔ child' ? 'You selected a parent-child relationship.' : 'The wording suggests a possible parent-child or caregiver relationship.');
  if (sexualConcern) reasons.push(input.sexualSafety === 'Yes' ? 'You reported a sexual contact or sexual-boundary concern.' : sexualSelected ? 'You selected a type of sexual contact.' : 'The wording suggests a sexual concern; this is a cue to clarify, not proof of what occurred.');
  const missing = [];
  if (!childKnown && input.childSafety !== 'No') missing.push('Whether anyone involved is under 18.');
  if (!sexualConcern && input.sexualSafety !== 'No') missing.push('Whether there is sexual contact or a sexual-boundary concern.');
  if (input.immediateSafety !== 'Yes' && input.immediateSafety !== 'No') missing.push('Whether anyone is in immediate danger now.');
  if (parentChild && !childKnown && input.age === '16+') missing.push('The 16+ setting does not distinguish a 16–17-year-old from an adult.');
  if (input.childSafety === 'No' && childKnown) missing.push('Your under-18 answer conflicts with an age setting or wording. Review the ages.');
  if (input.sexualSafety === 'No' && sexualConcern) missing.push('Your sexual-concern answer conflicts with a contact setting or wording. Review what was observed and what is uncertain.');
  const level = immediate || (childKnown && sexualConcern) || capacityConcern ? 'critical' : possibleChildConcern ? 'warning' : 'info';
  return {
    level, immediate, childConcern:possibleChildConcern, parentChild, childKnown, sexualConcern, capacityConcern,
    title:immediate ? 'Immediate safety needs attention' : childKnown && sexualConcern ? 'Priority child-safety concern to review' : capacityConcern ? 'Priority capacity / consent concern to review' : level === 'warning' ? 'Safeguarding details need clarification' : missing.length ? 'Key safety facts are still unclear' : 'Limited check: no specific structural trigger identified',
    summary:immediate ? 'If anyone is in immediate danger, prioritise emergency support. Reflection can wait until safety is addressed.' : childKnown && sexualConcern ? 'The reported information raises a possible child-safety concern involving sexual contact or sexual boundaries. Seek safeguarding advice. This flags a concern for review; it does not establish what happened or anyone’s guilt.' : capacityConcern ? 'A sexual concern was reported together with someone being asleep or unresponsive. This raises a capacity concern to review, even if someone appeared calm or happy. Confirm the observations and seek appropriate support; this check does not establish exactly what happened.' : level === 'warning' ? 'A possible family or child sexual-safety concern needs clearer ages and observations. Missing information does not make the concern safe or unimportant.' : 'This limited rule check cannot confirm that a situation is safe. Review the details below and seek advice if you remain concerned.',
    reasons, missing,
    source:possibleChildConcern ? 'WA Department of Communities — child safety guidance' : null,
    sourceUrl:possibleChildConcern ? WA_CHILD_GUIDANCE : null,
    checked:'7 Oct 2026'
  };
}

module.exports = {WA_CHILD_GUIDANCE, reviewStructuralSafety};
