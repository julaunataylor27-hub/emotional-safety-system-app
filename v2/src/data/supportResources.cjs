'use strict';
// Australian national services checked against official providers on 2 November 2026.
// Keep contact details reviewed before each public release.
// No automatic calls, messages, referrals, uploads or location sharing.
const SERVICES=Object.freeze({
 emergency:Object.freeze({id:'emergency',name:'Triple Zero — emergency services',phone:'000',website:'https://www.acma.gov.au/emergency-calls',description:'If there is immediate danger or urgent medical help is needed in Australia.'}),
 lifeline:Object.freeze({id:'lifeline',name:'Lifeline',phone:'13 11 14',website:'https://www.lifeline.org.au/',description:'24/7 crisis support and someone to speak to.'}),
 yarn:Object.freeze({id:'yarn',name:'13YARN',phone:'13 92 76',website:'https://www.13yarn.org.au/',description:'24/7 Aboriginal and Torres Strait Islander crisis support.'}),
 respect:Object.freeze({id:'respect',name:'1800RESPECT',phone:'1800 737 732',website:'https://www.1800respect.org.au/',description:'24/7 domestic, family and sexual violence counselling and information.'})
});
const ACTION_GUIDES=Object.freeze({
 'Talk it through':{steps:['You can speak to someone you trust, or use a confidential support service.','You can explain only what you are comfortable sharing.'],services:['lifeline','yarn']},
 'Understand my options':{steps:['Name what is happening and what is still uncertain.','Consider a small next step, leaving it open, or talking it through.','You do not need to make a decision in ESS.']},
 'Learn more first':{steps:['You can explore the Learn section before deciding anything.'],destination:'learn'},
 'Pause before responding':{steps:['If it is safe, put your phone down or take a moment away from the conversation.','You may decide later whether or when to respond.','If you feel unsafe or someone is threatening you, use a support service instead of managing this alone.'],services:['respect']},
 'Talk to someone':{steps:['A trusted person or support worker can help you look at options without deciding for you.'],services:['lifeline','yarn','respect']},
 'Understand boundary options':{steps:['You may choose not to answer immediately.','Consider what contact feels safe and what support you would prefer.','A boundary does not guarantee another person will respect it; prioritise safety.'],services:['respect']},
 'Talk to a trusted support':{steps:['If your choices are being restricted or you feel threatened, consider speaking with a specialist service.','You do not have to confront anyone or collect proof to ask for help.'],services:['respect','yarn']},
 'Make a safer pause plan':{steps:['Where could you go or who could you contact if you need help?','Avoid telling someone your plan if doing so would place you at greater risk.','A specialist service can help you make an individual safety plan.'],services:['respect']},
 'Review support services':{steps:['Choose the support that fits your situation.','Opening a provider website leaves ESS. No provider is contacted automatically.'],services:['respect','yarn','lifeline']},
 'Move toward safety':{steps:['If it is safe to do so, move away from immediate danger.','Seek a safer place and contact emergency services if needed.','Do not delay seeking help to complete a reflection.'],services:['emergency']},
 'Contact emergency help':{steps:['In Australia, Triple Zero (000) connects you to police, fire or ambulance.','Press the call option below only if you want to open your phone dialler. No call is placed by ESS itself.'],services:['emergency']},
 'Do not gather extra evidence':{steps:['You do not need to prove an emergency to seek safety.','Avoid taking photographs, arguing, or staying in danger for a record.','A person or emergency service can help with immediate next steps.'],services:['emergency','respect']}
});
function getSupportAction(title){return ACTION_GUIDES[title]||null;}
module.exports={SERVICES,ACTION_GUIDES,getSupportAction};
