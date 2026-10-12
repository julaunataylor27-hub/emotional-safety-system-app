/*
 * Emotional Safety System · Evidence & Truth Engine v1.2
 * Educational, deterministic, on-device text prompts — NOT AI, diagnosis,
 * legal findings, a safety certification, or verification of a person's account.
 * Never export, upload, or store the input automatically.
 */
'use strict';

const EXAMPLES = Object.freeze([
  {
    id: 'healthy',
    title: 'Healthy communication',
    text: 'I said I need space. They said: I understand you need space. We can talk when you are ready. They stopped asking and gave me space.'
  },
  {
    id: 'pressure',
    title: 'Repeated emotional pressure',
    text: 'I said I need space but they keep asking me to explain my feelings right now, even after I asked them to stop.'
  },
  {
    id: 'coercion',
    title: 'Threat of retaliation',
    text: "If you don't explain your feelings right now, I'll spread lies about you and make sure your friends turn against you."
  },
  {
    id: 'danger',
    title: 'Immediate physical danger',
    text: 'I asked for space and tried to leave. The other person blocked the exit and threatened to hurt me.'
  }
]);

const contains = (text, pattern) => pattern.test(text);
function assessEvidence(input) {
  const text = String((input && input.text) || '').trim().slice(0, 2500);
  const feeling = String((input && input.feeling) || '').trim();
  const sample = EXAMPLES.find(x => x.id === (input && input.exampleId));
  if (!text) return {
    kind:'insufficient', title:'More information needed', tier:'Unknown',
    reported:'No description supplied.',
    feelings:'No feeling selected.',
    protection:'Not enough information to assess protections or threats.',
    emotionalSafety:'Not enough information to describe emotional impact.',
    truth:'There is no account to examine.',
    choice:'There is no information about freedom of choice.',
    interpretation:'No interpretation is possible without a description.',
    unknowns:['What was said or done?', 'Were boundaries expressed?', 'Is anybody in immediate danger?'],
    risks:['Unknown; no absence-of-risk claim can be made.'],
    options:['Use a fictional example, or describe only what you feel comfortable sharing.'],
    urgent:false, proof:'Not independently verified', method:'Local rules, no remote AI'
  };

  const t = text.toLowerCase().replace(/[’‘]/g, "'");
  const threatened = contains(t, /\b(threaten(?:ed|s)? (?:to )?(?:hurt|kill|hit)|(?:blocked?|blocking) (?:the )?(?:exit|door)|(?:prevented?|preventing) (?:me |them )?from leaving|physically restrain(?:ed|s|ing)?|weapon)\b/);
  const retaliation = contains(t, /\b(blackmail|threaten(?:ed|s)? to (?:expose|share|spread)|spread lies|ruin your life|turn against you)\b/) ||
      contains(t, /\bif you (?:don't|do not|won't)[^.!?]{0,110}(?:i'll|i will|they'll|they will)[^.!?]{0,110}(?:tell|spread|ruin|punish|expose|share)\b/);
  const boundary = contains(t, /\b(need (?:some )?space|asked for space|said no|asked (?:them|him|her) to stop|asked to stop)\b/);
  const pressure = contains(t, /\b(keeps? (?:asking|pressuring|demanding)|kept (?:asking|pressuring|demanding)|won't stop asking|wouldn't stop asking|pressur(?:e|ed|es|ing)|demand(?:s|ed|ing)? (?:an explanation|answers)|refus(?:ed|es|ing) to give me space)\b/);
  const respected = contains(t, /\b(respect(?:ed|s)? (?:my |the )?boundar(?:y|ies)|gave me space|stopped asking|accepted (?:my )?request|we can talk when (?:you|i) (?:are|am) ready|take your time)\b/);

  // Named examples fix the intended reading of deliberately constructed fixtures.
  // For a real-life account these are only tentative language matches, not findings.
  let kind;
  if (sample && text === sample.text) {
    kind = sample.id;
  } else if (threatened) {
    kind = 'danger';
  } else if (retaliation) {
    kind = 'coercion';
  } else if (pressure && (boundary || contains(t, /stop|no|refus/))) {
    kind = 'pressure';
  } else if (respected && !pressure && !retaliation && !threatened) {
    kind = 'healthy';
  } else {
    kind = 'insufficient';
  }

  const universal = {
    reported: 'The person reports: "' + text + '". This is their account, not a verified event.',
    feelings: feeling && feeling !== 'Not specified'
      ? 'Self-selected feeling: ' + feeling + '. This is a personal report, not evidence of another person’s intent.'
      : 'Not stated. Do not infer what the person felt.',
    proof: 'Self-reported; no independent corroboration supplied.',
    truth: 'Only the words provided have been assessed. The app has not checked recordings, witnesses, motives or external evidence.',
    method: 'Transparent, keyword-based local rules; not an AI determination.',
    unknowns: [
      'Exact words, timing, frequency and the wider context.',
      'What each person intended and what they did next.',
      'Whether other evidence or immediate safety concerns exist.'
    ]
  };
  const categories = {
    healthy: {
      title:'Boundary appears respected',tier:'Lower concern',
      protection:'The account describes space being allowed, which may support a boundary.',
      emotionalSafety:'Respecting a request for time can support emotional safety; the actual impact is unknown.',
      choice:'The account suggests the person could decide when to resume the discussion.',
      interpretation:'Respect for the stated boundary is indicated in this description. It does not prove the whole relationship is safe.',
      risks:['The full relationship and context have not been assessed.'],
      options:['Take the time you need.', 'Return to the conversation voluntarily when ready.'],
      urgent:false
    },
    pressure: {
      title:'Possible boundary concern',tier:'Review',
      protection:'Repeated requests despite asking for space can undermine a reasonable boundary.',
      emotionalSafety:'Repeated questioning may increase distress or emotional exhaustion. The actual effect is unknown.',
      choice:'Pressure may make it harder to decide freely when to discuss feelings.',
      interpretation:'The account indicates a possible boundary being disregarded. It does not establish deliberate manipulation or abuse.',
      risks:['Ongoing conflict or emotional strain.', 'Disclosure given under pressure.'],
      options:['Restate the need for space if safe.', 'Choose whether and when to respond.', 'Seek trusted support if pressure continues.'],
      urgent:false
    },
    coercion: {
      title:'Threatened retaliation',tier:'Serious concern',
      protection:'A threat of retaliation is described and may affect emotional and social safety.',
      emotionalSafety:'A threat may create fear or pressure; feelings must be reported, not assumed.',
      choice:'Threatening consequences for not talking can restrict free choice.',
      interpretation:'The quoted behaviour contains coercive pressure. Intent, follow-through and any legal consequences require further evidence.',
      risks:['Escalating intimidation or retaliation.', 'Loss of social support.'],
      options:['Prioritise safety over confronting the person.', 'Record exact messages only where safe and lawful.', 'Consider speaking to a trusted support service.'],
      urgent:false
    },
    danger: {
      title:'Possible immediate danger',tier:'Urgent safety response',
      protection:'The account describes a possible physical threat or obstruction of leaving.',
      emotionalSafety:'Threats and restraint can affect safety and wellbeing; feelings are not presumed.',
      choice:'Preventing someone from leaving or threatening harm can seriously restrict choice.',
      interpretation:'Potential immediate danger is described. A keyword match cannot confirm events or judge how serious the danger is right now.',
      risks:['Physical injury or escalating threats.', 'Reduced ability to leave safely.'],
      options:['If danger is current, move to safety if possible and call 000 in Australia.', 'Do not put yourself at greater risk to gather evidence.', 'Seek trusted help when safe.'],
      urgent:true
    },
    insufficient: {
      title:'Insufficient information',tier:'Unknown',
      protection:'There is not enough context to assess the boundary or protection.',
      emotionalSafety:'No reliable conclusion about emotional safety can be drawn.',
      choice:'There is not enough evidence to say whether choice was restricted.',
      interpretation:'The system cannot reliably classify this description. No danger signal detected by a keyword rule is not proof of safety.',
      risks:['Important context may be missing or missed by the local rules.'],
      options:['Record what was directly observed, including exact words if known.', 'Separate your interpretation from what you know.', 'Seek support if you are worried or unsafe.'],
      urgent:false
    }
  };
  return {kind, ...universal, ...categories[kind]};
}

module.exports = { EXAMPLES, assessEvidence };
