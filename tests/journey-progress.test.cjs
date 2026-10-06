const {test} = require('node:test');
const assert = require('node:assert/strict');
const {defaultAnswers, hasJourneyContent} = require('../src/journeyMemory');
const {getJourneyProgress} = require('../src/journeyProgress');

test('defaults and whitespace do not count as user input', () => {
  const answers = {...defaultAnswers(), foundationMessage:' \n ', philosophyName:' The Humanity Philosophy ',
    philosophyMotto:'Grow yourself. Grow humanity. ', projectSelections:[' '], valuesReflection:'\t'};
  assert.equal(getJourneyProgress(answers).percent,0);
  assert.equal(hasJourneyContent(answers),false);
});

test('one stage is 14 percent and all seven stages reach 100 percent', () => {
  const answers = {...defaultAnswers(),foundationMessage:'My own message'};
  assert.equal(getJourneyProgress(answers).count,1);
  assert.equal(getJourneyProgress(answers).percent,14);
  Object.assign(answers,{valuesReflection:'How I practise kindness',philosophyVision:'My vision',storyNotes:'My story',
    projectSelections:['Book'],sharingSelections:['Community'],legacyWorld:'A kinder world'});
  const progress = getJourneyProgress(answers);
  assert.equal(progress.count,7); assert.equal(progress.percent,100);
  assert.ok(progress.stages.every(stage=>stage.hasInput));
});

test('personal values choices count and can create a summary, while defaults in any order do not', () => {
  const answers = defaultAnswers();
  answers.philosophyValues.reverse();
  assert.equal(getJourneyProgress(answers).count,0);
  answers.philosophyValues=['Kindness'];
  assert.equal(getJourneyProgress(answers).stages.find(stage=>stage.key==='values').hasInput,true);
  assert.equal(hasJourneyContent(answers),true);
  answers.philosophyValues=[];
  assert.equal(getJourneyProgress(answers).count,0);
});
