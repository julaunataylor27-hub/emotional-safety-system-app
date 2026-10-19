/* Curated offline knowledge trails for the Safe Curiosity Lab.
 * Sources were reviewed on 19 October 2026. Source links open only by user action.
 * This is editorial learning content, not machine-generated research or a web scanner.
 */
const REFERENCES = Object.freeze({
  privacyParent: {title:'Sending nudes and sexting — guidance for parents', author:'eSafety Commissioner', url:'https://www.esafety.gov.au/parents/issues-and-advice/sending-nudes-sexting'},
  privacyTeen: {title:'Being pressured to send nudes', author:'eSafety Commissioner', url:'https://www.esafety.gov.au/young-people/being-pressured-to-send-nudes'},
  privacyConsent: {title:'Consent for sharing photos and videos', author:'eSafety Commissioner', url:'https://www.esafety.gov.au/young-people/consent-sharing-photos-videos'},
  pressured: {title:'Bullying online', author:'eSafety Commissioner', url:'https://www.esafety.gov.au/young-people/cyberbullying'},
  puberty: {title:'Physical changes in puberty', author:'Raising Children Network', url:'https://raisingchildren.net.au/teens/development/puberty-sexual-development/physical-changes-in-puberty'},
  pubertyHelp: {title:'Puberty: helping children handle changes', author:'Raising Children Network', url:'https://raisingchildren.net.au/pre-teens/development/puberty-sexual-development/puberty-helping-your-child'},
  feelings: {title:'Pressures from social media', author:'eSafety Commissioner', url:'https://www.esafety.gov.au/young-people/pressures-from-social-media'},
  recommendations: {title:'Echo chambers and your feed', author:'eSafety Commissioner', url:'https://www.esafety.gov.au/young-people/echo-chambers-and-your-feed'},
  online: {title:'I need help: something happened online', author:'eSafety Commissioner', url:'https://www.esafety.gov.au/young-people/i-need-help'},
});

const LESSONS = Object.freeze({
  privacy: {
    intro:'Privacy means having some control over information about yourself, including who sees pictures and messages.',
    sections:[
      {title:'What is a private image?',body:'Some photos reveal things about a person that they would not want shared widely. Before sharing any picture of someone, ask whether they want it shared and respect their answer. Children should not be asked to send intimate pictures.'},
      {title:'Why would somebody ask for secrecy?',body:'A person might have many reasons to ask for privacy. But a request to hide pictures or messages from trusted adults, especially alongside pressure or threats, can be a warning sign. A message alone cannot establish the sender’s intentions.'},
      {title:'How can a picture spread?',body:'Once a picture is sent, another person may save, copy, forward or capture it. Changing your mind later may not remove all copies. This is why asking first and respecting privacy matters.'},
      {title:'What can help?',body:'Do not send a picture you feel pressured to share. If it is safe, stop replying and get support from a trusted adult. If intimate material involving a child has been shared, seek specialist advice rather than copying or forwarding it.'},
    ],
    followups:[
      {question:'Does agreeing to take a photo mean agreeing to share it?',answer:'No. Permission to take a photo and permission to publish or forward it are different choices. Consent must be freely given and can be withdrawn.'},
      {question:'Is keeping a surprise the same as keeping an unsafe secret?',answer:'Not necessarily. A birthday surprise usually has a harmless ending. A secret that makes someone frightened, isolated or unable to ask for help deserves attention from a trusted adult.'},
    ],
    quiz:{question:'Someone asks you to keep a worrying photo request secret. What is a safer first step?',choices:['Send it to keep the person happy','Speak with a trusted adult','Post the conversation publicly'],correct:1,explanation:'Choosing help protects privacy without spreading more personal material.'},
    sources:['privacyParent','privacyTeen','privacyConsent'],
  },
  pressure: {
    intro:'Pressure is when someone pushes another person to agree, even when that person is uncomfortable or has said no.',
    sections:[
      {title:'What does pressure look like?',body:'It can include repeated requests, guilt, threats, teasing, offering rewards or saying that refusal will end a friendship. A disagreement alone does not prove coercion. The context and freedom to refuse matter.'},
      {title:'Why might someone use it?',body:'People may want attention, control, agreement or a particular outcome. Their motives cannot be known from one sentence. We can recognise behaviour without guessing what someone feels inside.'},
      {title:'What happens when boundaries are ignored?',body:'People can become worried about saying no. Their choices can feel less free. Respectful relationships make room for an honest no without punishment or threats.'},
      {title:'What choices can help?',body:'Say no or stop responding if safe. Save relevant non-intimate messages if needed for reporting, block or report unwanted contact, and tell a trusted adult. If threats are happening, getting support is more important than confronting someone.'},
    ],
    followups:[
      {question:'Can someone be kind and still pressure me?',answer:'Yes. Friendly words and pressure can happen together. Pay attention to whether you are free to refuse and whether the other person respects your answer.'},
      {question:'Do I have to explain why I said no?',answer:'You can explain when you want to, but a boundary does not require a long defence. Seek trusted support if refusal is not being respected.'},
    ],
    quiz:{question:'What shows respect for a boundary?',choices:['Continuing to ask until someone agrees','Stopping when someone says no','Threatening to exclude someone'],correct:1,explanation:'Respect means making room for a freely chosen answer.'},
    sources:['pressured','privacyConsent'],
  },
  puberty: {
    intro:'Puberty is a normal stage of growing up when hormones help the body and brain develop in new ways.',
    sections:[
      {title:'What begins the changes?',body:'Signals from the brain affect hormones, which guide growth and development. People do not all begin at the same age and there is no single timetable for everyone.'},
      {title:'What changes might someone notice?',body:'People can grow taller, have changes in skin, hair and sweat, and experience new feelings. Some people develop breasts and start periods; some experience voice changes. Bodies vary and people deserve respect.'},
      {title:'Why can feelings change too?',body:'Growth, new experiences, sleep changes and developing social relationships can all affect mood. A feeling is real, but it does not always tell us exactly why it happened.'},
      {title:'How can we learn safely?',body:'Ask clear questions, use an age-appropriate health resource, and speak with a trusted adult, school nurse or health professional. Privacy, body autonomy and consent are important at every age.'},
    ],
    followups:[
      {question:'Does everyone start puberty at the same age?',answer:'No. There is a range of normal development. A GP can help if someone is worried about very early or late changes.'},
      {question:'What is a hormone?',answer:'A hormone is a chemical messenger made by the body. Hormones travel through the blood and help coordinate changes such as growth.'},
    ],
    quiz:{question:'Which statement about puberty is supported by evidence?',choices:['Every person develops on the same schedule','Bodies develop at different times','There is no reliable way to learn about puberty'],correct:1,explanation:'Development varies. Reliable information and trusted healthcare are available.'},
    sources:['puberty','pubertyHelp'],
  },
  feelings: {
    intro:'Feelings are experiences that can help us notice what matters or what is happening in our bodies and lives.',
    sections:[
      {title:'What does overwhelmed mean?',body:'A person may describe feeling overwhelmed when many demands or strong feelings happen at once. It can be hard to concentrate or decide what to do next.'},
      {title:'Why might it happen?',body:'Schoolwork, friendship difficulties, noise, lack of sleep, online messages or uncertainty can contribute. There is rarely one explanation that applies to everyone.'},
      {title:'What happens in the body?',body:'Someone may notice faster breathing, tense muscles or difficulty focusing. These experiences do not reveal the full cause, and they are not proof of another person’s intentions.'},
      {title:'What could help next?',body:'Try a short pause, move to a calmer place if possible, name one concern and ask someone trustworthy for help. If someone feels unsafe or unable to cope, speak with a qualified support person.'},
    ],
    followups:[
      {question:'Is an emotion the same as a fact?',answer:'A feeling tells us about our experience. It does not automatically prove the cause. We can separate what happened, what we felt and what we are still unsure about.'},
      {question:'Why can scrolling make stress worse?',answer:'Repeated notifications, comparisons and endlessly recommended content can make it hard to switch off. It may help to change settings or take a break.'},
    ],
    quiz:{question:'Someone feels overwhelmed. What is one useful response?',choices:['Tell them their feelings are wrong','Give space and offer trusted support','Assume you know why they feel that way'],correct:1,explanation:'Listening and offering choices support emotional safety without pretending to know the cause.'},
    sources:['feelings','pressured'],
  },
  web: {
    intro:'Recommendation systems use information about online activity to choose which videos, articles or posts to show next.',
    sections:[
      {title:'What is an algorithm?',body:'An algorithm is a set of instructions. For example, it can sort videos using signals such as watch time, clicks, searches and interests. Different websites use different rules.'},
      {title:'Why do I see similar videos?',body:'A platform may predict that you want more of what you watched or clicked. Sometimes a single viewing can influence what is suggested. The suggestions are not a complete picture of the world.'},
      {title:'How can recommendations shape curiosity?',body:'Repeated content can narrow what you encounter, sometimes called an echo chamber. Some feeds promote material that keeps people watching rather than material that is best for learning.'},
      {title:'How can I take control?',body:'Pause before tapping, use “not interested” controls where offered, look for more than one reliable source, change notification settings and ask a trusted adult for help if content is disturbing.'},
    ],
    followups:[
      {question:'Does a website know exactly what I feel?',answer:'No. A website may infer interests from clicks or watch time, but that does not mean it knows your thoughts, emotions or reasons for watching.'},
      {question:'How do I check whether a video is true?',answer:'Find who created it, when it was made, what evidence is shown and whether a trustworthy independent source supports the same claim.'},
    ],
    quiz:{question:'A platform keeps suggesting one kind of video. What is true?',choices:['The suggestions prove every video is true','The algorithm may be responding to viewing activity','The website can read your thoughts'],correct:1,explanation:'Recommendations are predictions based on signals, not evidence that content is factual.'},
    sources:['recommendations','feelings'],
  },
  general: {
    intro:'This prototype does not have a reliable explanation for every subject. Instead of inventing facts, it can teach a research method.',
    sections:[
      {title:'Start with a clear question',body:'Write down what you want to know. If the topic is big, break it into smaller questions: What? How? Why? When?'},
      {title:'Find the source',body:'For health topics start with a trusted health service; for online safety use eSafety; for history look for archives, museums or scholarly work. A source should show who created it.'},
      {title:'Check the evidence',body:'Compare two independent reliable explanations. Note where they agree, where they differ and what is still unknown.'},
      {title:'Stay curious',body:'A question deserves exploration. It does not need to be marked dangerous just because a small program has not encountered it before.'},
    ],
    followups:[
      {question:'What makes a source trustworthy?',answer:'A named author or institution, clear evidence, appropriate expertise, a date, and a way to check original information all help.'},
      {question:'What should I do when sources disagree?',answer:'Compare their evidence, dates, methods and claims. Sometimes the best answer is that more research is needed.'},
    ],
    quiz:{question:'The lab cannot classify a question. What should it do?',choices:['Invent an answer','Say what it does not know and help find reliable sources','Call the question harmful'],correct:1,explanation:'Honest uncertainty is better than guessing.'},
    sources:[],
  },
  urgent: {
    intro:'This small prototype noticed words that might relate to someone feeling unsafe. It cannot determine the situation or provide emergency assessment.',
    sections:[
      {title:'Safety comes first',body:'If anyone is in immediate danger in Australia, call 000. If a child is worried about harm, it is important to talk to a trusted adult or qualified service as soon as possible.'},
      {title:'Asking for help is allowed',body:'An adult, teacher, school counsellor, medical professional or child protection service can help someone work out safer next steps. If one adult does not listen, another trusted adult may be able to help.'},
      {title:'Privacy and support',body:'Do not share identifying details or private images into a public learning tool. Specialist services can explain how to make a report safely.'},
    ],
    followups:[],
    quiz:null,
    sources:['online'],
  },
});

function getKnowledge(result, ageGroup) {
  const id = typeof result === 'string' ? result : result && result.id;
  const lesson = LESSONS[id] || LESSONS.general;
  const isYoung = ageGroup === '6-9';
  const isTeen = ageGroup === '13-17';
  const sections = lesson.sections.map(section => ({...section}));
  if(id === 'puberty' && isYoung) {
    sections[1].body = 'Growing bodies can get taller, produce more sweat and change in other ways at different times. Some changes happen later, and it is fine to ask a trusted adult or health professional questions.';
  }
  if(id === 'privacy' && isYoung) {
    sections[0].body = 'A private picture may show something a person wants to keep to themselves. Always ask before sharing pictures of someone else. It is not okay for someone to pressure a child to send private body pictures.';
    sections[2].body = 'A picture sent to one person might be copied or shown to other people. If someone asks you for a private picture, speak with a trusted grown-up who helps keep you safe.';
  }
  const sourceIds = id === 'privacy'
    ? (isTeen ? ['privacyTeen','privacyConsent'] : ['privacyParent'])
    : lesson.sources;
  return {
    title:id === 'urgent' ? 'Getting help' : id === 'general' ? 'How to research a new question' : 'Knowledge Trail',
    intro:lesson.intro,
    sections,
    followups:lesson.followups.map(item => ({...item})),
    quiz:lesson.quiz ? {...lesson.quiz, choices:[...lesson.quiz.choices]} : null,
    sources:sourceIds.map(key => ({...REFERENCES[key]})),
    review:'Curated educational summary with source links; not personalised advice. Human review for child development, accessibility and cultural appropriateness is still required.',
  };
}

module.exports = {REFERENCES, LESSONS, getKnowledge};
