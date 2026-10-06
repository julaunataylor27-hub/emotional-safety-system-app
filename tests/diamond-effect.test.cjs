const {test}=require('node:test');
const assert=require('node:assert/strict');
const {reviewStructuralSafety}=require('../src/structuralReview');
const {emptyDiamond,compareChoice,buildDiamondPlan,cornerAtPoint,triangleCornerAtPoint,analyseOptions,reflectTriangle}=require('../src/diamondEffect');
const {PAIR_FEELINGS,emptyFeelingPair,feelingPairKey,analyseFeelingPair}=require('../src/feelingPair');

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
  draft.choices[1]={text:'Keep a factual note while clarifying unknowns.',checks:Array(5).fill('Unsure')};
  draft.reviewKey=analyseOptions(draft).key;
  draft.chosen=0;draft.nextStep='Write down what I observed.';draft.purpose='Act with care.';
  assert.deepEqual(compareChoice(draft.choices[0]),{supported:4,unsure:1,needsAttention:0,safetyGap:false,safetyUnclear:false});
  const result={structuralSafety:{level:'critical',summary:'A reported concern still needs safeguarding advice.'}};
  assert.throws(()=>buildDiamondPlan(draft,result),/protective support step/);
  draft.supportStep='Contact an appropriate safeguarding service.';
  const plan=buildDiamondPlan(draft,result);
  assert.ok(plan.includes('SAFEGUARDING STILL APPLIES'));
  assert.ok(plan.includes('My worth is not a score'));
  draft.choices[0].checks[0]='No';
  draft.reviewKey=analyseOptions(draft).key;
  assert.throws(()=>buildDiamondPlan(draft,result),/harm or boundary/);
  draft.choices[0].checks[0]='Unsure';
  draft.reviewKey=analyseOptions(draft).key;
  assert.ok(buildDiamondPlan(draft,result).includes('Safety or boundaries remain uncertain'));
});
test('both options can be analysed and kept undecided; edits require a fresh review',()=>{
  const draft=emptyDiamond();draft.nextStep='Pause and ask what information is missing.';
  assert.ok(buildDiamondPlan(draft,{}).includes('I AM STILL UNDECIDED'));
  draft.choices[0].text='One possible action.';
  assert.throws(()=>analyseOptions(draft),/Write both options/);
  draft.choices[1].text='Another possible action.';
  draft.choices[0].checks=Array(5).fill('Yes');draft.choices[0].checks[0]='No';
  draft.choices[1].checks=Array(5).fill('No');
  assert.throws(()=>buildDiamondPlan(draft,{}),/Analyse both options first/);
  const report=analyseOptions(draft);
  assert.equal(report.options[0].supported,4);assert.equal(report.options[0].safetyGap,true);
  assert.equal(report.options[0].attention[0],'Avoids exposing anyone to harm or pressure');
  draft.reviewKey=report.key;
  const plan=buildDiamondPlan(draft,{});
  assert.ok(plan.includes('One possible action.'));assert.ok(plan.includes('Another possible action.'));
  assert.ok(plan.includes('I AM STILL UNDECIDED'));assert.ok(plan.includes('Harm or boundary checks need attention'));
  draft.choices[1].text='A revised action.';
  assert.throws(()=>buildDiamondPlan(draft,{}),/Analyse both options first/);
  draft.reviewKey=analyseOptions(draft).key;draft.choices[1].checks[2]='Yes';
  assert.throws(()=>buildDiamondPlan(draft,{}),/Analyse both options first/);
});
test('explanations use evidence checks and are never adopted as verified facts or ranked as truth',()=>{
  const draft=emptyDiamond();draft.comparisonType='explanations';draft.nextStep='Ask an appropriate service how to clarify this.';
  draft.choices=[{text:'One unconfirmed explanation.',checks:['No','No','Yes','Unsure','Yes']},{text:'A different unconfirmed explanation.',checks:Array(5).fill('Yes')}];
  const report=analyseOptions(draft);draft.reviewKey=report.key;draft.chosen=1;
  assert.equal(report.options[0].safetyGap,false);assert.ok(report.options[0].attention[0].includes('directly observed'));
  const plan=buildDiamondPlan(draft,{});
  assert.ok(plan.includes('EXPLANATIONS REMAIN UNCONFIRMED'));assert.ok(plan.includes('Neither explanation is adopted as a fact'));
  assert.ok(plan.includes('not a probability'));assert.ok(!plan.includes('MY NEXT STEP TO CONSIDER'));
  draft.comparisonType='actions';assert.throws(()=>buildDiamondPlan(draft,{}),/Analyse both options first/);
});
test('triangle phrases expose their reported basis and unknowns without clearing safeguards',()=>{
  const draft=emptyDiamond();
  assert.equal(reflectTriangle(draft.triangle).phrase,'Pattern unclear');
  assert.equal(reflectTriangle({care:'Yes'}).unknowns.length,3);
  draft.triangle={...draft.triangle,care:'Yes',pressure:'Yes',freedom:'No'};
  assert.equal(reflectTriangle(draft.triangle).phrase,'Care under pressure');
  draft.triangle.repeated='Yes';
  const reflection=reflectTriangle(draft.triangle);
  assert.equal(reflection.phrase,'Possible coercive caretaking');assert.equal(reflection.basis.length,4);
  assert.equal(triangleCornerAtPoint(140,40,280),'care');assert.equal(triangleCornerAtPoint(36,210,280),'pressure');
  assert.equal(triangleCornerAtPoint(244,210,280),'freedom');
  draft.triangle.pressure='No';draft.triangle.freedom='Yes';
  assert.equal(reflectTriangle(draft.triangle).phrase,'Reported care with choice');
  draft.nextStep='Pause and clarify.';
  const result={structuralSafety:{level:'critical',summary:'A reported safeguarding concern remains.'}};
  assert.throws(()=>buildDiamondPlan(draft,result),/protective support step/);
  draft.supportStep='Ask for qualified safeguarding advice.';
  assert.ok(buildDiamondPlan(draft,result).includes('SAFEGUARDING STILL APPLIES'));
  assert.equal(result.structuralSafety.level,'critical');
});
const paired=(first,second,changes={})=>({...emptyDiamond().triangle,
  feelingPair:[{feeling:first,who:'Me',source:'My own feeling'},{feeling:second,who:'Me',source:'My own feeling'}],
  pairScope:'One person, same situation',...changes});
test('paired feelings distinguish ambivalence in one person from different feelings in two people',()=>{
  const own=paired('Love','Anger',{evidence:'I received a generic upsetting message.'});
  const found=analyseFeelingPair(own);
  assert.equal(found.word,'Ambivalence');assert.ok(found.equation.startsWith('Love × Anger'));
  assert.equal(found.sourceUrl,'https://dictionary.apa.org/ambivalence');
  assert.equal(analyseFeelingPair(paired('Anger','Love')).word,found.word);
  const two=paired('Love','Anger',{pairScope:'Two people',feelingPair:[{feeling:'Love',who:'Me',source:'My own feeling'},{feeling:'Anger',who:'Person B',source:'They told me'}]});
  assert.equal(analyseFeelingPair(two).word,'Care meets anger');
  assert.equal(analyseFeelingPair(two).sourceUrl,null);
  assert.ok(analyseFeelingPair(two).causeLimit.includes('cannot establish that cause'));
  assert.ok(found.questions.length>=2);
});
test('impressions, missing feelings and conflicting sources cannot establish another person’s emotion or cause',()=>{
  assert.throws(()=>analyseFeelingPair(emptyDiamond().triangle),/Choose Feeling 1 and Feeling 2/);
  const malformed=paired('not-a-feeling','Anger');
  assert.throws(()=>analyseFeelingPair(malformed),/Choose Feeling 1 and Feeling 2/);
  const impression=paired('Love','Anger');impression.feelingPair[1].source='My impression';
  const report=analyseFeelingPair(impression);
  assert.equal(report.word,'Mixed impressions');assert.equal(report.sourceUrl,null);
  assert.ok(report.unknowns.some(item=>item.includes('actual')));
  const conflict=paired('Love','Anger',{pairScope:'Two people'});
  assert.equal(analyseFeelingPair(conflict).word,'Check who feels what');
  const same=paired('Love','Anger');same.feelingPair[1].source='They told me';
  assert.equal(analyseFeelingPair(same).word,'Check who feels what');
  const unspecified=paired('Love','Fear',{feelingPair:[{feeling:'Love',who:'',source:'Unsure'},{feeling:'Fear',who:'',source:'Unsure'}],pairScope:'Unsure'});
  assert.ok(analyseFeelingPair(unspecified).unknowns.length>=4);
});
test('every supported feeling pair stays descriptive and cannot infer coercion from feelings alone',()=>{
  for(const first of PAIR_FEELINGS.filter(item=>item!=='Unknown'))for(const second of PAIR_FEELINGS.filter(item=>item!=='Unknown')){
    const draft=paired(first,second,{pairScope:'Two people',feelingPair:[{feeling:first,who:'Me',source:'My own feeling'},{feeling:second,who:'Person B',source:'They told me'}]});
    const report=analyseFeelingPair(draft,reflectTriangle(draft));
    assert.ok(report.word);assert.equal(report.contextWord,null);
    assert.ok(!report.centre.includes('coercive'));assert.ok(report.explanation.includes('not numerical multiplication'));
    assert.ok(report.unknowns.some(item=>item.includes('specific action')));
  }
});
test('reported control remains separate from feelings, and stale pair wording is excluded from plans',()=>{
  const draft=emptyDiamond();draft.triangle=paired('Love','Anger',{care:'Yes',pressure:'Yes',freedom:'No',repeated:'Yes',evidence:'A generic reported restriction.',unknowns:'The duration remains uncertain.'});
  const finding=analyseFeelingPair(draft.triangle,reflectTriangle(draft.triangle));
  assert.equal(finding.word,'Ambivalence');assert.equal(finding.centre,'Possible coercive caretaking');
  assert.ok(finding.basis.some(item=>item.includes('not from multiplying')));
  draft.triangle.pairReviewKey=finding.key;draft.nextStep='Ask how to clarify a concern.';
  const result={structuralSafety:{level:'critical',summary:'An active safeguarding concern.'}};
  assert.throws(()=>buildDiamondPlan(draft,result),/protective support step/);
  draft.supportStep='Ask for qualified safeguarding advice.';
  const plan=buildDiamondPlan(draft,result);
  assert.ok(plan.includes('Ambivalence'));assert.ok(plan.includes('QUESTIONS ABOUT THE POSSIBLE WHY'));
  assert.ok(plan.includes('The duration remains uncertain.'));assert.ok(plan.includes('SAFEGUARDING STILL APPLIES'));
  draft.triangle.feelingPair[1].feeling='Joy';
  assert.notEqual(feelingPairKey(draft.triangle),finding.key);
  const changed=buildDiamondPlan(draft,result);
  assert.ok(changed.includes('PAIR NOT REVIEWED'));assert.ok(!changed.includes('Ambivalence'));
  assert.equal(result.structuralSafety.level,'critical');
  const fresh=emptyFeelingPair();fresh[0].who='A generic private label';assert.equal(emptyFeelingPair()[0].who,'');
});

test('draft export preserves incomplete and unreviewed options without adopting an action or clearing safeguarding',()=>{
  const {buildDiamondDraft}=require('../src/diamondEffect');
  const draft=emptyDiamond();draft.choices[0].text='A generic unfinished option.';
  draft.legal.question='What further information is needed?';
  const result={structuralSafety:{level:'critical',summary:'A reported concern needs safeguarding advice.'}};
  const partial=buildDiamondDraft(draft,result);
  for(const text of ['DRAFT — NOT A COMPLETED NEXT-STEP PLAN','A generic unfinished option.','Write both options','protective support step','SAFEGUARDING STILL APPLIES','ENCOURAGEMENT','What further information is needed?'])assert.ok(partial.includes(text),text);
  draft.choices[1].text='Another generic option.';draft.choices[0].checks=['No','Yes','Yes','Yes','Yes'];draft.chosen=0;
  draft.nextStep='A step to review.';
  const unreviewed=buildDiamondDraft(draft,result);
  assert.ok(unreviewed.includes('COMPARISON NOT REVIEWED'));
  assert.ok(unreviewed.includes('NO ACTION ADOPTED IN THIS DRAFT'));
  assert.ok(!unreviewed.includes('MY NEXT STEP TO CONSIDER'));
  assert.throws(()=>buildDiamondPlan(draft,result),/Analyse both/);
  draft.reviewKey=analyseOptions(draft).key;
  assert.throws(()=>buildDiamondPlan(draft,result),/harm or boundary/);
  assert.ok(buildDiamondDraft(draft,result).includes('harm or boundary check marked No'));
  assert.equal(result.structuralSafety.level,'critical');
});
