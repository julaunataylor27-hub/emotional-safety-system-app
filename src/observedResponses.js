const FEELINGS = ['Unknown','Distressed','Confused','Scared','Worried','Sad','Angry','Overwhelmed','Withdrawn','Calm','Happy / cheerful','Excited','Affectionate','Embarrassed','Numb / detached','Other / mixed'];
const BEHAVIOURS = ['Unknown','Asleep','Unresponsive','Crying','Smiling / laughing','Quiet / not speaking','Pulled away','Moved closer','Said no / stop','Asked for help','Other'];
const MAX_PEOPLE = 4;
const emptyPerson = () => ({name:'',feelings:['Unknown'],behaviours:['Unknown'],when:'',details:'',interpretation:'',unknowns:''});
function normaliseSelection(values, options) {
  const selected = [...new Set((Array.isArray(values)?values:[]).filter(value=>options.includes(value)&&value!=='Unknown'))];
  return selected.length ? selected : ['Unknown'];
}
function toggleObservation(values,value,options) {
  if(value==='Unknown') return ['Unknown'];
  if(!options.includes(value)) return normaliseSelection(values,options);
  const selected=normaliseSelection(values,options).filter(item=>item!=='Unknown');
  return normaliseSelection(selected.includes(value)?selected.filter(item=>item!==value):[...selected,value],options);
}
function normalisePeople(people,legacyFeeling='Unknown') {
  const entries=Array.isArray(people)&&people.length ? people.slice(0,MAX_PEOPLE) : [{...emptyPerson(),feelings:[legacyFeeling]}];
  return entries.map(person=>({
    name:typeof person?.name==='string'?person.name.slice(0,80):'',
    feelings:normaliseSelection(person?.feelings,FEELINGS),
    behaviours:normaliseSelection(person?.behaviours,BEHAVIOURS),
    when:typeof person?.when==='string'?person.when.slice(0,120):'',
    details:typeof person?.details==='string'?person.details.slice(0,1000):'',
    interpretation:typeof person?.interpretation==='string'?person.interpretation.slice(0,1000):'',
    unknowns:typeof person?.unknowns==='string'?person.unknowns.slice(0,1000):''
  }));
}
function hasCapacityObservation(people) {
  return normalisePeople(people).some(person=>person.behaviours.some(value=>['Asleep','Unresponsive'].includes(value)));
}
function observationSummary(people) {
  const entries=normalisePeople(people);
  const labels=[...new Set(entries.flatMap(person=>person.feelings).filter(value=>value!=='Unknown'))];
  return labels.length ? labels.join(', ') : 'Unknown';
}
function observationReview(people) {
  const entries=normalisePeople(people);
  const appearanceCount=entries.reduce((sum,person)=>sum+person.feelings.filter(value=>value!=='Unknown').length,0);
  const behaviourCount=entries.reduce((sum,person)=>sum+person.behaviours.filter(value=>value!=='Unknown').length,0);
  return {score:null,label:appearanceCount?'Observed responses recorded — not an emotion score':'Not enough emotional information to score',
    equation:'Selections record how each person seemed and what you noticed. They cannot establish inner feelings, enjoyment, consent or what happened. There is no validated calculation of those things from appearance. Child-safety and capacity checks are evaluated separately.',
    components:[`Input type: Something I witnessed / was told`,`Observed emotional response: ${observationSummary(entries)}`,
      `Recorded selections: ${appearanceCount} appearance labels; ${behaviourCount} behaviour labels. These counts are not a risk score.`,
      ...entries.map((person,index)=>`${person.name.trim()||`Person ${index+1}`} — seemed: ${person.feelings.join(', ')}; behaviours: ${person.behaviours.join(', ')}.`),
      'Structural safety is not reduced by a calm or happy appearance, or by missing emotional information.']};
}
module.exports={FEELINGS,BEHAVIOURS,MAX_PEOPLE,emptyPerson,normaliseSelection,toggleObservation,normalisePeople,hasCapacityObservation,observationSummary,observationReview};
