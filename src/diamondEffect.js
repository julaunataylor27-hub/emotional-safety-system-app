const CORNERS = {
  truth:{title:'Truth', prompt:'What did you observe or experience firsthand? What remains unknown?'},
  values:{title:'Values', prompt:'What matters to you here? Which boundaries and responsibilities do you want to honour?'},
  beliefs:{title:'Beliefs', prompt:'What are you interpreting or assuming? What other explanation or information should you consider?'},
  faith:{title:'Faith / Hope', prompt:'What helps you keep going? This can be spiritual, cultural, personal or practical.'}
};
const CHOICE_CHECKS = [
  'Avoids exposing anyone to harm or pressure',
  'Respects my boundaries and other people’s boundaries',
  'Matches the values I want to live by',
  'Uses known information and acknowledges uncertainty',
  'Leaves room to pause or get appropriate support'
];
function emptyDiamond() {
  return {truth:'',unknowns:'',values:'',beliefs:'',faith:'',purpose:'',nextStep:'',supportStep:'',
    choices:[{text:'',checks:Array(5).fill('Unsure')},{text:'',checks:Array(5).fill('Unsure')}],chosen:null};
}
function cornerAtPoint(x,y,size) {
  const dx=x-size/2, dy=y-size/2;
  if(Math.abs(dx)>Math.abs(dy)) return dx<0?'values':'beliefs';
  return dy<0?'truth':'faith';
}
function compareChoice(choice) {
  return {supported:choice.checks.filter(value=>value==='Yes').length,
    unsure:choice.checks.filter(value=>value==='Unsure').length,
    needsAttention:choice.checks.filter(value=>value==='No').length,
    safetyGap:choice.checks.slice(0,2).includes('No'),
    safetyUnclear:choice.checks.slice(0,2).includes('Unsure')};
}
function needsProtectiveSupport(result) {
  return !!(result && (['critical','warning'].includes(result.structuralSafety?.level) || result.high || ['critical','high'].includes(result.coercionCheck?.level)));
}
function buildDiamondPlan(draft,result) {
  const choice=draft.choices[draft.chosen];
  if(!choice?.text.trim() || !draft.nextStep.trim()) throw Error('Choose a written option and add one next step.');
  const check=compareChoice(choice);
  if(check.safetyGap) throw Error('This option has a harm or boundary check marked No. Revise it or choose another option before building your plan.');
  if(needsProtectiveSupport(result) && !draft.supportStep.trim()) throw Error('Include a protective support step while a safeguarding concern is active.');
  const text=value=>value.trim()||'Not written yet.';
  return [
    'MY DIAMOND EFFECT — NEXT STEP',
    'My worth is not a score. I can pause, learn and choose one manageable step.',
    'TRUTH — my own observations\n'+text(draft.truth),
    'WHAT I DO NOT KNOW\n'+text(draft.unknowns),
    'VALUES\n'+text(draft.values), 'BELIEFS — interpretations to examine\n'+text(draft.beliefs),
    'FAITH / HOPE\n'+text(draft.faith), 'MY PURPOSE\n'+text(draft.purpose),
    'MY OPTION TO REVIEW\n'+choice.text.trim(),
    `My checks: ${check.supported} of 5 supported; ${check.unsure} unsure; ${check.needsAttention} need attention. These are my own answers, not a prediction or confirmation of safety.`,
    ...CHOICE_CHECKS.map((label,index)=>`${label}: ${choice.checks[index]}`),
    check.safetyUnclear?'Safety or boundaries remain uncertain: pause and clarify them before acting.':null,
    'ONE MANAGEABLE NEXT STEP\n'+draft.nextStep.trim(),
    'PROTECTIVE SUPPORT STEP\n'+text(draft.supportStep),
    needsProtectiveSupport(result)?'SAFEGUARDING STILL APPLIES\n'+(result.structuralSafety?.summary||result.level):null,
    'This reflection is a planning aid. It does not establish another person’s intentions, a diagnosis or a legal finding.'
  ].filter(Boolean).join('\n\n');
}
module.exports = {CORNERS,CHOICE_CHECKS,emptyDiamond,cornerAtPoint,compareChoice,needsProtectiveSupport,buildDiamondPlan};
