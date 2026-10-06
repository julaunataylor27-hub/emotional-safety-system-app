// Curated information, not a legal decision engine. No remote analysis or uploads.
const CHECKED = '7 October 2026';
const SOURCES = {
  criminal:{title:'WA Criminal Code · ss 319–322, 329',url:'https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_218_homepage.html',version:'19-aq0-01 · current compilation from 1 May 2026'},
  family:{title:'WA Restraining Orders Act · s 5A',url:'https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_822_homepage.html',version:'05-u0-01 · current compilation from 25 September 2025'},
  orders:{title:'Magistrates Court WA · restraining orders',url:'https://www.magistratescourt.wa.gov.au/r/restraining_orders.aspx'},
  privacy:{title:'WA Surveillance Devices Act · ss 5, 6, 9',url:'https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_2979_homepage.html',version:'02-g0-00 · current compilation from 5 April 2023'},
  records:{title:'eSafety Commissioner · collecting evidence safely',url:'https://www.esafety.gov.au/key-topics/domestic-family-violence/collecting-evidence-safely'},
  child:{title:'WA Department of Communities · child safety',url:'https://www.wa.gov.au/organisation/department-of-communities/concerns-the-safety-or-wellbeing-of-child-or-young-person'},
  advice:{title:'Legal Aid WA · get legal help',url:'https://www.legalaid.wa.gov.au/get-legal-help'}
};
const ENCOURAGEMENT = 'Your worth is not defined by this situation or by having every answer. You can acknowledge what you know, leave uncertainty open, and choose one careful step that honours your boundaries. Asking for support is a meaningful action. Small, informed choices can help you grow and contribute to a kinder future for the next generation.';
const LIMIT = 'This review organises what you entered; it does not independently verify events, discover motives or decide whether a law was broken. Feelings and reflection words are not legal findings. This is selected legal information, not legal advice or a complete list of laws. No score can guarantee safety or an outcome.';
const emptyLegalReview = () => ({jurisdiction:'Unsure',when:'',statements:'',question:'',boundary:'',checkIn:''});
const written = value => typeof value==='string'?value.trim():'';
const joined = values => values.filter(Boolean).join('\n\n') || 'Not recorded. This remains open; it is not evidence that nothing happened.';

function buildLegalReview(draft={},result={}) {
  const input=result.assessmentInput||{}, safety=result.structuralSafety||{}, triangle=draft.triangle||{};
  const legal={...emptyLegalReview(),...draft.legal};
  const jurisdiction=['Western Australia','Elsewhere','Unsure'].includes(legal.jurisdiction)?legal.jurisdiction:'Unsure';
  const wa=jurisdiction==='Western Australia';
  const witness=input.intent==='Something I witnessed / was told';
  const people=witness&&Array.isArray(input.observedPeople)?input.observedPeople:[];
  const name=(person,index)=>written(person.name)||`Person ${index+1}`;
  const sexual=safety.sexualConcern===true||input.sexualSafety==='Yes'||['Sexual penetration / intercourse','Other sexual contact'].includes(input.sexualConduct);
  const child=safety.childConcern===true;
  const parentChild=safety.parentChild===true||input.familyRelation==='Parent ↔ child';
  const pressure=triangle.pressure==='Yes'||['high','critical'].includes(result.coercionCheck?.level);
  const sections=[
    {title:'My assessment account · self-reported, may contain interpretation',body:joined([written(input.text),input.intent?'Input type: '+input.intent:'',...Object.entries({Age:input.age,'Whose age':input.ageFor,Relationship:input.relationship,'Family detail':input.familyRelation,'Sexual-contact setting':input.sexualConduct,'Under-18 concern':input.childSafety,'Sexual-boundary concern':input.sexualSafety,'Immediate danger':input.immediateSafety}).map(([label,value])=>`Selected context · ${label}: ${written(value)||'not recorded'}. Confirm whose circumstances this describes.`)])},
    {title:'Direct observations · recorded by me, not independently verified',body:joined([written(draft.truth),...people.map((person,index)=>joined([name(person,index),written(person.when)?'Reported date / time: '+person.when:'Date / time not recorded.',written(person.details),person.behaviours?.length?'Selected behaviours: '+person.behaviours.join(', '):'']))])},
    {title:'Statements I was told · not independently verified',body:joined([written(legal.statements)])},
    {title:'Interpretations and possible explanations · unconfirmed',body:joined([written(draft.beliefs),...people.filter(person=>written(person.interpretation)).map(person=>(written(person.name)||'Unnamed person')+': '+person.interpretation),...(draft.comparisonType==='explanations'?(draft.choices||[]).map((choice,index)=>written(choice.text)?`Possible explanation ${index+1}: ${choice.text}`:''):[])])},
    {title:'Feelings and reported behaviour · not proof of consent or motives',body:joined([written(input.feeling)&&!witness&&!/question|hypothetical/i.test(input.intent||'')?'My selected feeling: '+input.feeling:'',...people.map((person,index)=>`${name(person,index)} seemed: ${(person.feelings||['Unknown']).join(', ')}. This is an appearance label.`),...(triangle.feelingPair||[]).map((item,index)=>`Feeling ${index+1}: ${item.feeling}; whose: ${written(item.who)||'not recorded'}; source: ${item.source}.`),written(triangle.evidence)?'Reported behaviour behind my triangle answers: '+triangle.evidence:'',written(triangle.impact)?'Reported emotional impact: '+triangle.impact:''])},
    {title:'Still unknown or conflicting · needs clarification',body:joined([written(draft.unknowns),written(triangle.unknowns),...people.filter(person=>written(person.unknowns)).map(person=>(written(person.name)||'Unnamed person')+': '+person.unknowns),...(safety.missing||[]),...['care','pressure','freedom','repeated'].filter(key=>!['Yes','No'].includes(triangle[key])).map(key=>`Triangle ${key}: unsure.`)])}
  ];
  const topics=[];
  const add=(id,title,why,text,source)=>topics.push({id,title,why,text,source:SOURCES[source]});
  if(wa&&sexual) {
    add('consent','Consent and capacity','A sexual contact or boundary concern was reported.',
      'WA Criminal Code s 319(2) requires consent to be freely and voluntarily given. Force, threats, intimidation, deceit or fraudulent means undermine it. Lack of physical resistance does not by itself mean consent. Appearance labels cannot establish consent; clarify capacity and what happened at the time.','criminal');
    if(child) add('child','Age and child protection','The assessment flagged a possible child sexual-safety concern; confirm exact ages and whose age was selected.',
      'Under s 319(2)(c), a child under 13 cannot consent to an act constituting an offence against them; s 320 addresses sexual offences against under-13s. Sections 321 and 322 address other ages and care, supervision or authority. Applicable offences and defences require legal advice; an age selection is not verified evidence.','criminal');
    if(parentChild) add('relatives','Family relationship and sexual conduct','A parent-child relationship was selected or flagged; confirm the relationship.',
      'Section 329 addresses specified sexual offences involving lineal relatives and de facto children. It has specific definitions and requirements. A claim of consent or affection does not settle whether conduct is lawful. Ask a lawyer which provisions apply to the reported facts.','criminal');
  }
  if(wa&&pressure) add('family','Pressure, control and family violence','Pressure or a control concern was reported; confirm whether a family relationship is involved.',
    'Restraining Orders Act s 5A includes violence or threats toward a family member, and behaviour or patterns that coerce, control or cause fear. Cumulative behaviour is considered in the whole relationship. This definition does not turn a triangle phrase into a proven offence.','family');
  if(wa) {
    add('orders','Protection options to ask about','An information route to explore if protection from ongoing behaviour is needed.',
      'The Magistrates Court explains restraining orders for family or personal violence, threats, harassment or intimidation where there is concern the behaviour will continue. Ask Legal Aid about eligibility, evidence, existing orders and safe steps for your circumstances. The app cannot decide whether an order will be granted.','orders');
    add('privacy','Recording and sharing responsibly','Relevant when considering collecting or sharing information.',
      'The Surveillance Devices Act restricts recording private conversations or activities and communicating some recordings, with exceptions. Being involved does not automatically make every secret recording or disclosure lawful. Ask for legal advice before secretly recording or sharing recordings; this app does not decide an exception applies.','privacy');
  }
  add('records','Keep a careful record, when safe','Information can be useful without every interpretation being confirmed.',
    'Keep dated observations separate from interpretations and record who said what. eSafety recommends retaining original digital material without editing, including dates, times and context. Collection can increase risk or distress; ask a support worker for help and use a device others cannot access. Do not put yourself at risk to gather information.','records');
  const questions=[
    'Which law and services apply where this happened, at the time it happened?',
    'What is firsthand, what was reported by someone else, and what remains an assumption?',
    'What information should I preserve, and what can I lawfully and safely record or share?',
    'Does my work or caring role create a reporting duty? Ask a qualified service about the role and facts.',
    'What protective action, advice or support is appropriate while details remain uncertain?',
    ...(child?['Whose age and relationship are involved, and what child-safety information needs urgent clarification?']:[]),
    ...(written(legal.question)?['My question: '+written(legal.question)]:[])
  ];
  const urgent=safety.immediate===true;
  const safeguarding=['critical','warning'].includes(safety.level)||result.high||['high','critical'].includes(result.coercionCheck?.level);
  const decisions=[
    {title:'My purpose and values',body:joined([written(draft.purpose),written(draft.values)])},
    {title:'My next step · my choice, not a prediction',body:joined([written(draft.nextStep)])},
    {title:'My protective support step',body:joined([written(draft.supportStep),safeguarding?'Safeguarding still applies: '+(safety.summary||result.level||'Seek appropriate protective advice.'):'This limited review cannot confirm safety.'])},
    {title:'A boundary I can honour',body:written(legal.boundary)||'I can pause before acting and ask what is safe and appropriate.'},
    {title:'When I will review or ask for help',body:written(legal.checkIn)||'Choose a manageable check-in time with an appropriate support person. This app does not send a reminder.'}
  ];
  return {jurisdiction,wa,checked:CHECKED,limit:LIMIT,sections,topics,questions,decisions,urgent,child,
    locationNote:wa?'WA legal information selected. Confirm the place, date, roles and facts with a qualified adviser.':jurisdiction==='Elsewhere'?'WA legal rules are not applied here. Ask a local qualified service about the law and emergency contacts for that location.':'Jurisdiction is unconfirmed. Choose where the event happened; WA legal rules are not applied until you select WA.',
    dateNote:'Reported event date / time: '+(written(legal.when)||'not recorded')+'. Sources were checked '+CHECKED+'. This is a fixed review date, not a live law feed. Earlier events may involve earlier laws; open the official version history and seek advice.',
    safetyNote:urgent?'Immediate danger was reported. Prioritise emergency assistance; reflection can wait. In Australia call 000.':child?'A possible child-safety concern remains. In WA, ask Child Protection what safeguarding action or additional firsthand information is needed. Do not wait for a feeling word or certainty before asking for advice.':'Uncertainty can remain while you seek appropriate support. The app does not determine guilt or guarantee safety.',
    encouragement:ENCOURAGEMENT};
}
function legalReviewText(report) {
  return ['KNOW YOUR RIGHTS · LEAVE WITH A PURPOSE',report.limit,report.locationNote,report.dateNote,report.safetyNote,
    'MY INFORMATION REVIEW',...report.sections.map(item=>item.title+'\n'+item.body),
    'LEGAL INFORMATION TO CHECK',...report.topics.map(item=>item.title+'\nWhy shown: '+item.why+'\n'+item.text+'\nSource: '+item.source.title+'\n'+item.source.url+(item.source.version?'\n'+item.source.version:'')),
    'QUESTIONS FOR QUALIFIED ADVICE',...report.questions,
    ...(report.wa?['Legal Aid WA Infoline: 1300 650 579\n'+SOURCES.advice.url]:[]),
    ...(report.wa&&report.child?['WA Child Protection · Central Intake: 1800 273 889\n'+SOURCES.child.url]:[]),
    'MY SELF-DIRECTED DECISION',...report.decisions.map(item=>item.title+'\n'+item.body),
    'ENCOURAGEMENT',report.encouragement].join('\n\n');
}
module.exports={CHECKED,SOURCES,ENCOURAGEMENT,LIMIT,emptyLegalReview,buildLegalReview,legalReviewText};
