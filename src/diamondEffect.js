const {emptyFeelingPair,feelingPairKey,analyseFeelingPair}=require('./feelingPair');
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
const EXPLANATION_CHECKS = [
  'Has support in what I directly observed or was told',
  'Separates observations from assumptions about motives',
  'Considers another possible explanation',
  'Identifies missing or conflicting information',
  'Can be clarified with appropriate support, without confrontation'
];
const TRIANGLE_PROMPTS = {
  care:{title:'Care / connection',question:'Is care, affection or a caring responsibility part of this situation?',prompt:'Which actions or words suggest care? Affection alone cannot establish safety or consent.'},
  pressure:{title:'Pressure / pain',question:'Is pressure, control or fear being reported?',prompt:'Describe the specific behaviour. Emotional pain matters, but does not by itself establish coercion.'},
  freedom:{title:'Choice / boundaries',question:'Can the person freely say no or set boundaries?',prompt:'Whose choices and boundaries are involved? A reflection answer cannot establish legal capacity to consent.'}
};
const TRIANGLE_QUESTIONS = {...TRIANGLE_PROMPTS, repeated:{title:'Pattern over time',question:'Is there firsthand information about this happening repeatedly?'}};
function emptyDiamond() {
  return {truth:'',unknowns:'',values:'',beliefs:'',faith:'',purpose:'',nextStep:'',supportStep:'',
    choices:[{text:'',checks:Array(5).fill('Unsure')},{text:'',checks:Array(5).fill('Unsure')}],chosen:null,
    comparisonType:'actions',reviewKey:null,
    triangle:{care:'Unsure',pressure:'Unsure',freedom:'Unsure',repeated:'Unsure',evidence:'',unknowns:'',impact:'',
      feelingPair:emptyFeelingPair(),pairScope:'Unsure',pairReviewKey:null}};
}
function cornerAtPoint(x,y,size) {
  const dx=x-size/2, dy=y-size/2;
  if(Math.abs(dx)>Math.abs(dy)) return dx<0?'values':'beliefs';
  return dy<0?'truth':'faith';
}
function triangleCornerAtPoint(x,y,width,height=250) {
  const points={care:[width/2,40],pressure:[36,height-40],freedom:[width-36,height-40]};
  return Object.keys(points).reduce((best,key)=>Math.hypot(x-points[key][0],y-points[key][1])<Math.hypot(x-points[best][0],y-points[best][1])?key:best,'care');
}
function compareChoice(choice,type='actions') {
  return {supported:choice.checks.filter(value=>value==='Yes').length,
    unsure:choice.checks.filter(value=>value==='Unsure').length,
    needsAttention:choice.checks.filter(value=>value==='No').length,
    safetyGap:type==='actions'&&choice.checks.slice(0,2).includes('No'),
    safetyUnclear:type==='actions'&&choice.checks.slice(0,2).includes('Unsure')};
}
function comparisonKey(draft) {
  return JSON.stringify([draft.comparisonType||'actions',draft.choices.map(({text,checks})=>[text.trim(),checks])]);
}
function analyseOptions(draft) {
  if(draft.choices.length!==2||draft.choices.some(choice=>!choice.text.trim())) throw Error('Write both options before analysing them. You do not need to choose one.');
  const type=draft.comparisonType||'actions',labels=type==='explanations'?EXPLANATION_CHECKS:CHOICE_CHECKS;
  return {key:comparisonKey(draft),type,options:draft.choices.map((choice,index)=>({index,text:choice.text.trim(),...compareChoice(choice,type),
    attention:labels.filter((_,i)=>choice.checks[i]==='No'),unknowns:labels.filter((_,i)=>choice.checks[i]==='Unsure')}))};
}
function reflectTriangle(triangle={}) {
  const answers=Object.fromEntries(Object.keys(TRIANGLE_QUESTIONS).map(key=>[key,['Yes','No'].includes(triangle[key])?triangle[key]:'Unsure']));
  let phrase='Pattern unclear',equation='Care + pressure + choice + context → a question to explore';
  if(answers.pressure==='Yes'&&answers.freedom==='No') {
    phrase=answers.care==='Yes'?(answers.repeated==='Yes'?'Possible coercive caretaking':'Care under pressure'):'Possible pressure and control';
    equation=answers.care==='Yes'?'Reported care + pressure − free choice → care under pressure':'Reported pressure − free choice → a control concern to explore';
  } else if(answers.freedom==='No') {
    phrase='Boundaries need attention';equation='Reduced choice + unclear context → boundaries to clarify';
  } else if(answers.care==='Yes'&&answers.pressure==='No'&&answers.freedom==='Yes') {
    phrase='Reported care with choice';equation='Reported care + choice + boundaries → a reflection on agency';
  } else if(answers.pressure==='Yes') {
    phrase='Pressure to explore';equation='Reported pressure + context → a concern to clarify';
  }
  return {phrase,equation,answers,
    unknowns:Object.entries(answers).filter(([,value])=>value==='Unsure').map(([key])=>TRIANGLE_QUESTIONS[key].title),
    basis:Object.entries(answers).map(([key,value])=>`${TRIANGLE_QUESTIONS[key].question} ${value}`)};
}
function needsProtectiveSupport(result) {
  return !!(result && (['critical','warning'].includes(result.structuralSafety?.level) || result.high || ['critical','high'].includes(result.coercionCheck?.level)));
}
function buildDiamondPlan(draft,result) {
  if(!draft.nextStep.trim()) throw Error('Add one manageable next step. You can stay undecided about the options.');
  const hasOptions=draft.choices.some(choice=>choice.text.trim());
  const comparison=hasOptions?analyseOptions(draft):null;
  if(comparison&&draft.reviewKey!==comparison.key) throw Error('Analyse both options first. You can keep both open while building your plan.');
  const type=draft.comparisonType||'actions';
  const choice=type==='actions'&&Number.isInteger(draft.chosen)?draft.choices[draft.chosen]:null;
  const check=choice?compareChoice(choice):null;
  if(check?.safetyGap) throw Error('This option has a harm or boundary check marked No. Revise it or keep both options open before building your plan.');
  if(needsProtectiveSupport(result) && !draft.supportStep.trim()) throw Error('Include a protective support step while a safeguarding concern is active.');
  const text=value=>value.trim()||'Not written yet.';
  const triangle=reflectTriangle(draft.triangle);
  let pair=null;
  if(draft.triangle?.pairReviewKey===feelingPairKey(draft.triangle))pair=analyseFeelingPair(draft.triangle,triangle);
  const recordedPair=draft.triangle?.feelingPair?.some(item=>item.feeling!=='Unknown');
  const labels=type==='explanations'?EXPLANATION_CHECKS:CHOICE_CHECKS;
  return [
    'MY DIAMOND EFFECT — NEXT STEP',
    'My worth is not a score. I can pause, learn and choose one manageable step.',
    'TRUTH — my own observations\n'+text(draft.truth),
    'WHAT I DO NOT KNOW\n'+text(draft.unknowns),
    'VALUES\n'+text(draft.values), 'BELIEFS — interpretations to examine\n'+text(draft.beliefs),
    'FAITH / HOPE\n'+text(draft.faith), 'MY PURPOSE\n'+text(draft.purpose),
    ...(pair?[
      'TWO FEELINGS — A POSSIBLE MIDDLE WORD\n'+pair.equation,
      'FEELING WORD TO EXPLORE\n'+pair.word+'\n'+pair.meaning,
      ...pair.basis,
      'QUESTIONS ABOUT THE POSSIBLE WHY\n'+pair.questions.join('\n'),
      'WHAT REMAINS UNCONFIRMED\n'+(pair.unknowns.join('\n')||'No additional missing details were identified by this form. This does not verify the feelings or their causes.'),
      pair.explanation+'\n'+pair.causeLimit,
      pair.sourceUrl?'Word reference: '+pair.sourceUrl:null
    ].filter(Boolean):recordedPair?['FEELINGS RECORDED — PAIR NOT REVIEWED\n'+draft.triangle.feelingPair.map((item,index)=>`Feeling ${index+1}: ${item.feeling}; whose: ${item.who?.trim()||'not recorded'}; source: ${item.source}`).join('\n'),'Explore the pair again before adopting a middle word. Earlier wording is not carried into this plan.']:[]),
    'TRIANGLE REFLECTION — '+triangle.phrase+'\n'+triangle.equation,
    'Symbolic reflection only. This is not a validated emotional equation, diagnosis, proof of coercion or assessment of consent. “Coercive caretaking” is an app reflection phrase.',
    ...triangle.basis,
    'BEHAVIOUR BEHIND MY TRIANGLE ANSWERS\n'+text(draft.triangle?.evidence||''),
    'TRIANGLE UNKNOWNS\n'+text(draft.triangle?.unknowns||'')+(triangle.unknowns.length?'\nUnanswered areas: '+triangle.unknowns.join(', '):''),
    'REPORTED EMOTIONAL IMPACT\n'+text(draft.triangle?.impact||''),
    comparison?'BOTH OPTIONS REVIEWED — '+(type==='explanations'?'POSSIBLE EXPLANATIONS':'POSSIBLE NEXT STEPS'):null,
    ...(comparison?comparison.options.map(option=>`OPTION ${option.index+1}\n${option.text}\nMy checks: ${option.supported} of 5 supported; ${option.unsure} unsure; ${option.needsAttention} need attention.\n`+labels.map((label,i)=>`${label}: ${draft.choices[option.index].checks[i]}`).join('\n')):[]),
    'These counts reflect my own checks. They are not a probability, truth score, outcome prediction or confirmation of safety.',
    type==='explanations'?'EXPLANATIONS REMAIN UNCONFIRMED\nNeither explanation is adopted as a fact. My next step can focus on clarifying information and getting appropriate support.':
      choice?'MY NEXT STEP TO CONSIDER\nOption '+(draft.chosen+1)+': '+choice.text.trim():'I AM STILL UNDECIDED\nI can pause, revise the options or ask for support without choosing either.',
    comparison?.options.some(option=>option.safetyGap)?'Harm or boundary checks need attention in the comparison. Do not adopt those options unchanged.':null,
    check?.safetyUnclear?'Safety or boundaries remain uncertain: pause and clarify them before acting.':null,
    'ONE MANAGEABLE NEXT STEP\n'+draft.nextStep.trim(),
    'PROTECTIVE SUPPORT STEP\n'+text(draft.supportStep),
    needsProtectiveSupport(result)?'SAFEGUARDING STILL APPLIES\n'+(result.structuralSafety?.summary||result.level):null,
    'This reflection is a planning aid. It does not establish another person’s intentions, a diagnosis or a legal finding.'
  ].filter(Boolean).join('\n\n');
}
module.exports = {CORNERS,CHOICE_CHECKS,EXPLANATION_CHECKS,TRIANGLE_PROMPTS,TRIANGLE_QUESTIONS,emptyDiamond,cornerAtPoint,triangleCornerAtPoint,compareChoice,comparisonKey,analyseOptions,reflectTriangle,needsProtectiveSupport,buildDiamondPlan};
