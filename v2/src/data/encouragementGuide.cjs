'use strict';
// Gentle, choice-first educational guidance. Not a therapy programme,
// resilience score, safety assessment, or claim that suffering is necessary.
const ENCOURAGEMENT_LESSON=Object.freeze({
 id:'encouragement-stamina',
 title:'Encouragement & Emotional Stamina',
 subtitle:'Notice effort, take safe steps and build hope',
 helps:'Understand how realistic encouragement, supportive people, rest and small manageable steps can contribute to resilience — without forcing positivity.',
 ideas:[
  'Encouragement can help someone notice effort, hope and their own capacity to choose. It works best when it is believable and respects how they actually feel.',
  'Emotional stamina is not how much harm someone can tolerate. Pausing, seeking safety or setting a boundary can be signs of strength.',
  'Confidence and coping skills can grow through manageable practice, supportive relationships, recovery and knowing when to seek help.',
  'A positive outcome may be learning something, asking for help, taking a safe step, or choosing not to act yet. Feeling better is not a requirement.'
 ],
 unknown:'ESS cannot measure resilience, promise that encouragement will work for everyone, or know how another person is coping. Some situations need safety, practical assistance or professional support rather than another exercise.',
 sourceStatus:'Educational synthesis of public health and psychology guidance. The encouragement choices and wording are original ESS design, not a clinically validated programme.',
 related:'Emotional Wellbeing',
 scope:'General resilience education; use by choice, never as crisis or abuse treatment',
 reviewStatus:'Editorial and safeguarding review pending; material is not individual mental-health advice.',
 sources:[
  {title:'Building resilience',url:'https://www.healthdirect.gov.au/healthy-living/emotional-wellbeing/resilience',author:'healthdirect Australia',checked:'2 November 2026',role:'Healthy coping habits, support and developing resilience'},
  {title:'Building your resilience',url:'https://www.apa.org/topics/resilience/building-your-resilience',author:'American Psychological Association',checked:'2 November 2026',role:'Connections, wellbeing, small goals and learning from experience'},
  {title:'Psychological first aid: Guide for field workers',url:'https://www.who.int/publications/i/item/9789241548205',author:'World Health Organization',checked:'2 November 2026',role:'Respecting a person’s dignity, culture and agency when offering support'}
 ]
});
const ENCOURAGEMENT_CHOICES=Object.freeze([
 {id:'notice',title:'Notice an effort I made',message:'You can acknowledge something you managed, even if it feels small. You do not have to pretend the experience was easy or that you feel better now.',action:'journal',actionLabel:'Reflect in my Journal',note:'Only save a note if you choose; this app keeps Journal entries for the current session.'},
 {id:'pause',title:'Give myself a safe pause',message:'Resting or saying “not now” can be a useful decision. You do not have to push through discomfort to prove your strength.',action:'learn',actionLabel:'Return to learning',note:'Your choice to pause is enough. Nothing is measured or recorded here.'},
 {id:'step',title:'Consider one manageable step',message:'A small step can help you build confidence over time. It should fit your situation and be safe; it is okay to change your mind.',action:'core',actionLabel:'Explore my next step in ESS',note:'ESS opens a blank reflection; it will not copy what you read into the Journal.'},
 {id:'connection',title:'Reach out for encouragement',message:'Support from someone you trust can help you feel less alone. Asking for help is a choice and can be a sign of strength.',action:'support',actionLabel:'Explore support options',note:'ESS does not contact anyone for you.'}
]);
function encouragementChoice(id){return ENCOURAGEMENT_CHOICES.find(x=>x.id===id)||null;}
module.exports={ENCOURAGEMENT_LESSON,ENCOURAGEMENT_CHOICES,encouragementChoice};
