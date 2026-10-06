const {test}=require('node:test');
const assert=require('node:assert/strict');
const {reviewStructuralSafety}=require('../src/structuralReview');
const {emptyDiamond,compareChoice,buildDiamondPlan,cornerAtPoint}=require('../src/diamondEffect');

const input=changes=>({age:'16+',text:'',familyRelation:'Unsure',sexualConduct:'Unsure',childSafety:'Unsure',sexualSafety:'Unsure',immediateSafety:'Unsure',...changes});
test('selected parent-child details and standalone sexual wording no longer fall through the structural check',()=>{
  const result=reviewStructuralSafety(input({familyRelation:'Parent ↔ child',age:'10–12',text:'I am concerned about something sexual.'}));
  assert.equal(result.level,'critical');
  assert.ok(result.reasons.includes('You selected a parent-child relationship.'));
  assert.ok(result.sourceUrl.startsWith('https://www.wa.gov.au/'));
  assert.ok(result.summary.includes('possible child-safety concern'));
  const ambiguous=reviewStructuralSafety(input({text:'A mother and her son may be in a sexual situation.'}));
  assert.equal(ambiguous.level,'warning');
  assert.ok(ambiguous.missing.some(item=>item.includes('under 18')));
  assert.ok(ambiguous.missing.some(item=>item.includes('16+')));
});
test('unknowns, benign education and word boundaries cannot establish abuse or safety',()=>{
  const unknown=reviewStructuralSafety(input({text:'A person attended a meeting with their mother.'}));
  assert.equal(unknown.parentChild,false,'person is not son');
  assert.equal(unknown.level,'info');
  assert.equal(unknown.missing.length,3);
  assert.ok(unknown.summary.includes('cannot confirm'));
  assert.equal(reviewStructuralSafety(input({age:'13–15',text:'A child attended sexual education.'})).level,'info');
  assert.equal(reviewStructuralSafety(input({age:'13–15',text:'No sexual contact occurred.'})).level,'info');
});
test('explicit reported facts, age cues and input conflicts remain visible',()=>{
  assert.equal(reviewStructuralSafety(input({childSafety:'Yes',sexualSafety:'Yes'})).level,'critical');
  assert.equal(reviewStructuralSafety(input({immediateSafety:'Yes'})).immediate,true);
  const conflict=reviewStructuralSafety(input({childSafety:'No',sexualSafety:'No',text:'A 12-year-old was involved in a sexual concern.'}));
  assert.equal(conflict.level,'critical');
  assert.equal(conflict.missing.filter(item=>item.includes('conflicts')).length,2);
});
test('diamond movement selects prompts and does not change assessment facts',()=>{
  assert.equal(cornerAtPoint(140,30,280),'truth');assert.equal(cornerAtPoint(30,140,280),'values');
  assert.equal(cornerAtPoint(250,140,280),'beliefs');assert.equal(cornerAtPoint(140,250,280),'faith');
});
test('comparison counts self-reported checks; safety gaps and active safeguards cannot be averaged away',()=>{
  const draft=emptyDiamond();
  draft.choices[0]={text:'Pause and ask for safeguarding advice.',checks:['Yes','Yes','Yes','Unsure','Yes']};
  draft.chosen=0;draft.nextStep='Write down what I observed.';draft.purpose='Act with care.';
  assert.deepEqual(compareChoice(draft.choices[0]),{supported:4,unsure:1,needsAttention:0,safetyGap:false,safetyUnclear:false});
  const result={structuralSafety:{level:'critical',summary:'A reported concern still needs safeguarding advice.'}};
  assert.throws(()=>buildDiamondPlan(draft,result),/protective support step/);
  draft.supportStep='Contact an appropriate safeguarding service.';
  const plan=buildDiamondPlan(draft,result);
  assert.ok(plan.includes('SAFEGUARDING STILL APPLIES'));
  assert.ok(plan.includes('My worth is not a score'));
  draft.choices[0].checks[0]='No';
  assert.throws(()=>buildDiamondPlan(draft,result),/harm or boundary/);
  draft.choices[0].checks[0]='Unsure';
  assert.ok(buildDiamondPlan(draft,result).includes('Safety or boundaries remain uncertain'));
});
