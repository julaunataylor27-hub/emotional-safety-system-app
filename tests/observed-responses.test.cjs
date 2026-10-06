const {test}=require('node:test');
const assert=require('node:assert/strict');
const {FEELINGS,BEHAVIOURS,emptyPerson,toggleObservation,normalisePeople,observationReview}=require('../src/observedResponses');
const {reviewStructuralSafety}=require('../src/structuralReview');

test('multi-selection toggles independently and Unknown is exclusive within each group',()=>{
  let selected=toggleObservation(['Unknown'],'Scared',FEELINGS);
  selected=toggleObservation(selected,'Confused',FEELINGS);
  assert.deepEqual(selected,['Scared','Confused']);
  assert.deepEqual(toggleObservation(selected,'Scared',FEELINGS),['Confused']);
  assert.deepEqual(toggleObservation(['Confused'],'Confused',FEELINGS),['Unknown']);
  assert.deepEqual(toggleObservation(selected,'Unknown',FEELINGS),['Unknown']);
  assert.deepEqual(toggleObservation(['Unknown'],'unlisted',FEELINGS),['Unknown']);
  assert.deepEqual(toggleObservation(['Asleep'],'Pulled away',BEHAVIOURS),['Asleep','Pulled away']);
});
test('each person retains separate appearances, behaviours and an independent assessment snapshot',()=>{
  const people=[{...emptyPerson(),name:'Observer A',feelings:['Calm','Happy / cheerful'],behaviours:['Smiling / laughing']},
    {...emptyPerson(),name:'Observer B',behaviours:['Asleep'],details:'A generic observation note.'}];
  const snapshot=normalisePeople(people);
  people[0].feelings.push('Scared');people[1].details='A later edit.';
  assert.deepEqual(snapshot[0].feelings,['Calm','Happy / cheerful']);
  assert.equal(snapshot[1].details,'A generic observation note.');
  const review=observationReview(snapshot);
  assert.equal(review.score,null);
  assert.ok(review.components.some(line=>line.includes('2 appearance labels; 2 behaviour labels')));
  assert.ok(review.components.some(line=>line.includes('Observer B — seemed: Unknown; behaviours: Asleep')));
  assert.ok(review.equation.includes('cannot establish'));
});
test('calm or happy appearances never cancel child safeguarding, and sleep requires a sexual concern for capacity triage',()=>{
  const neutral={age:'18+',text:'',childSafety:'No',sexualSafety:'No',immediateSafety:'No',familyRelation:'Unsure'};
  const people=[{...emptyPerson(),feelings:['Calm','Happy / cheerful'],behaviours:['Asleep']}];
  assert.equal(reviewStructuralSafety({...neutral,observedPeople:people}).level,'info');
  const capacity=reviewStructuralSafety({...neutral,sexualSafety:'Yes',observedPeople:people});
  assert.equal(capacity.level,'critical');assert.equal(capacity.capacityConcern,true);assert.equal(capacity.childConcern,false);
  assert.ok(capacity.title.includes('capacity'));
  const child=reviewStructuralSafety({...neutral,age:'10–12',childSafety:'Yes',sexualSafety:'Yes',observedPeople:people});
  assert.equal(child.level,'critical');assert.ok(child.title.includes('child-safety'));
  assert.equal(reviewStructuralSafety({...neutral,childSafety:'Yes',sexualSafety:'Yes',observedPeople:[emptyPerson()]}).level,'critical');
});
