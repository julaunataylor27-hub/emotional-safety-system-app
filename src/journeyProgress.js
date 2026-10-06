const {defaultAnswers, hasCustomValues} = require('./journeyMemory');

function getJourneyProgress(answers) {
  const defaults = defaultAnswers();
  const written = (...keys) => keys.some(key => answers[key].trim() !== '' && answers[key].trim() !== defaults[key].trim());
  const selected = key => answers[key].some(value => value.trim() !== '');
  const stages = [
    {key:'foundation', title:'My Foundation', hasInput:written('foundationMessage','foundationWhy','foundationHope')},
    {key:'values', title:'My Values', hasInput:written('valuesReflection') || hasCustomValues(answers)},
    {key:'identity', title:'My Identity', hasInput:written('philosophyName','philosophyMotto','philosophyVision')},
    {key:'story', title:'My Book / My Story', hasInput:written('bookTitle','storyNotes')},
    {key:'projects', title:'Creative Projects', hasInput:selected('projectSelections')},
    {key:'sharing', title:'Sharing My Message', hasInput:selected('sharingSelections')},
    {key:'legacy', title:'My Legacy', hasInput:written('legacyFeeling','legacyWorld')}
  ];
  const count = stages.filter(stage => stage.hasInput).length;
  return {stages, count, percent:Math.round(count / stages.length * 100)};
}

module.exports = {getJourneyProgress};
