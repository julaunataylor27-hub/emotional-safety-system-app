const {test}=require('node:test');
const assert=require('node:assert/strict');
const {emptyDiamond,buildDiamondPlan}=require('../src/diamondEffect');
const {reviewStructuralSafety}=require('../src/structuralReview');
const {buildLegalReview,legalReviewText,ENCOURAGEMENT}=require('../src/legalDecisionReview');
const reported=(changes={})=>{
  const assessmentInput={intent:'Something I witnessed / was told',age:'10–12',text:'A generic reported concern requires clarification.',familyRelation:'Parent ↔ child',childSafety:'Yes',sexualSafety:'Yes',immediateSafety:'No',...changes};
  return {assessmentInput,structuralSafety:reviewStructuralSafety(assessmentInput)};
};
test('legal guidance requires confirmed review location, while concerns remain visible',()=>{
  const draft=emptyDiamond(),result=reported();
  for(const location of ['Unsure','Elsewhere','invalid']) {
    draft.legal.jurisdiction=location;
    const report=buildLegalReview(draft,result);
    assert.equal(report.wa,false);assert.deepEqual(report.topics.map(item=>item.id),['records']);
    assert.ok(report.safetyNote.includes('child-safety concern'));
    assert.ok(!legalReviewText(report).includes('WA legal information selected'));
  }
  draft.legal.jurisdiction='Western Australia';
  const report=buildLegalReview(draft,result);
  assert.ok(report.topics.some(item=>item.id==='child'));assert.ok(report.topics.some(item=>item.id==='relatives'));
  assert.ok(report.topics.find(item=>item.id==='child').text.includes('under 13'));
  assert.ok(report.dateNote.includes('Earlier events may involve earlier laws'));
  assert.equal(result.structuralSafety.level,'critical');
});
test('feelings and interpretations alone do not produce sexual or child law findings',()=>{
  const draft=emptyDiamond();draft.legal.jurisdiction='Western Australia';
  draft.triangle.feelingPair=[{feeling:'Love',who:'A',source:'My impression'},{feeling:'Fear',who:'B',source:'My impression'}];
  draft.beliefs='A generic unconfirmed interpretation about sexual conduct involving a child.';
  const result=reported({age:'18+',familyRelation:'Unsure',childSafety:'No',sexualSafety:'No',text:'A generic question about boundaries.'});
  const report=buildLegalReview(draft,result);
  assert.ok(!report.topics.some(item=>['consent','child','relatives'].includes(item.id)));
  draft.triangle.pressure='Yes';
  const pressure=buildLegalReview(draft,result).topics.find(item=>item.id==='family');
  assert.ok(pressure.why.includes('confirm whether a family relationship'));
  assert.ok(pressure.text.includes('does not turn a triangle phrase into a proven offence'));
  assert.equal(result.structuralSafety.level,'info');
});
test('the accumulated record preserves observation, statement, interpretation and uncertainty sources',()=>{
  const draft=emptyDiamond();draft.truth='My generic direct observation.';draft.unknowns='Exact sequence not known.';
  draft.legal.statements='Person B told me a generic statement; the date is uncertain.';
  draft.beliefs='My interpretation remains unconfirmed.';draft.triangle.impact='I felt overwhelmed.';
  draft.comparisonType='explanations';draft.choices[0].text='An alternative possible explanation.';
  const result=reported({observedPeople:[{name:'Person B',when:'Date uncertain',details:'A separate direct note.',interpretation:'A separate interpretation.',unknowns:'Duration unknown.',feelings:['Calm'],behaviours:['Asleep']}]});
  const report=buildLegalReview(draft,result);
  assert.ok(report.sections[1].body.includes('A separate direct note.'));
  assert.ok(!report.sections[1].body.includes('A separate interpretation.'));
  assert.ok(report.sections[2].body.includes('Person B told me'));
  assert.ok(report.sections[3].body.includes('A separate interpretation.'));
  assert.ok(report.sections[3].body.includes('possible explanation'));
  assert.ok(report.sections[4].body.includes('appearance label'));
  assert.ok(report.sections[5].body.includes('Duration unknown.'));
  assert.ok(report.limit.includes('does not independently verify'));
});
test('a full plan ends with encouragement and retains safety requirements and current legal inputs',()=>{
  const draft=emptyDiamond(),result=reported();draft.nextStep='Ask for advice.';draft.legal.jurisdiction='Western Australia';
  assert.throws(()=>buildDiamondPlan(draft,result),/protective support step/);
  draft.supportStep='Ask a qualified safeguarding service.';draft.legal.question='What can I lawfully share?';
  draft.legal.boundary='Pause before confrontation.';draft.legal.checkIn='Ask for support tomorrow.';
  const plan=buildDiamondPlan(draft,result);
  assert.ok(plan.includes('SAFEGUARDING STILL APPLIES'));assert.ok(plan.includes('What can I lawfully share?'));
  assert.ok(plan.endsWith('ENCOURAGEMENT\n\n'+ENCOURAGEMENT));
  assert.ok(!ENCOURAGEMENT.includes('you are safe'));assert.ok(!ENCOURAGEMENT.includes('verified'));
  draft.legal.jurisdiction='Elsewhere';draft.legal.question='Ask my local adviser.';
  const changed=buildDiamondPlan(draft,result);
  assert.ok(!changed.includes('Under s 319'));assert.ok(!changed.includes('What can I lawfully share?'));
  assert.ok(changed.includes('Ask my local adviser.'));assert.equal(result.structuralSafety.level,'critical');
});
