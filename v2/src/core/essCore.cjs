/*
 * Emotional Safety System · ESS Core Prototype v1
 *
 * Purpose:
 * - Keep the user's own words separate from interpretation.
 * - Reuse the existing deterministic Evidence & Truth Engine.
 * - Return a structured pathway that future AI can feed into.
 *
 * This prototype is educational decision support, not diagnosis,
 * legal advice, verification of events, or a substitute for emergency care.
 */
'use strict';

const { assessEvidence } = require('./evidenceTruthEngine.cjs');
const { CORE_VERSION, buildDecisionRecord, buildResearchSnapshot } = require('./essArchitecture.cjs');

const EMOTION_PATTERNS = Object.freeze([
  ['anxious', /\b(anxious|anxiety|nervous|worried|worry|uneasy|panicked|panic)\b/i],
  ['scared', /\b(scared|afraid|frightened|fearful|terrified)\b/i],
  ['rejected', /\b(rejected|ignored|unwanted|left out|abandoned)\b/i],
  ['sad', /\b(sad|upset|hurt|heartbroken|down)\b/i],
  ['angry', /\b(angry|mad|furious|frustrated|annoyed)\b/i],
  ['confused', /\b(confused|unsure|uncertain|mixed up|don't understand|do not understand)\b/i],
  ['overwhelmed', /\b(overwhelmed|too much|can't cope|cannot cope|exhausted)\b/i],
  ['calm', /\b(calm|okay|fine|safe|settled|relaxed)\b/i]
]);

const INTERPRETATION_PATTERNS = Object.freeze([
  /\b(i think|i reckon|i assume|i feel like|it means|must mean|probably|obviously)\b/i,
  /\b(he|she|they) (?:doesn't|does not|don't|do not|hates?|cares?|wants?|thinks?)\b/i,
  /\b(i'm|i am) (?:getting|going to be) (?:fired|dumped|left|rejected)\b/i
]);

const splitSentences = text => String(text || '')
  .split(/(?<=[.!?])\s+|\n+/)
  .map(x => x.trim())
  .filter(Boolean);

function detectEmotions(text, selectedFeeling) {
  const out = [];
  const explicit = String(selectedFeeling || '').trim();
  if (explicit && explicit !== 'Not specified') out.push(explicit.toLowerCase());
  for (const [label, pattern] of EMOTION_PATTERNS) {
    if (pattern.test(text) && !out.includes(label)) out.push(label);
  }
  return out.slice(0, 5);
}

function separateStatements(text) {
  const sentences = splitSentences(text);
  const interpretations = [];
  const reported = [];

  for (const sentence of sentences) {
    if (INTERPRETATION_PATTERNS.some(p => p.test(sentence))) interpretations.push(sentence);
    else reported.push(sentence);
  }

  return { reported, interpretations };
}

function buildUnknowns(text, evidenceResult) {
  const unknowns = new Set(evidenceResult.unknowns || []);
  const lower = text.toLowerCase();

  if (/hasn['’]?t replied|has not replied|no reply|didn['’]?t reply|did not reply/.test(lower)) {
    unknowns.add('Why the other person has not replied.');
  }
  if (/looked angry|seemed angry|appeared angry/.test(lower)) {
    unknowns.add('Why the other person appeared angry.');
  }
  if (/i think|i reckon|i assume|probably|must mean/.test(lower)) {
    unknowns.add('Whether the interpretation matches what actually happened.');
  }

  return [...unknowns].slice(0, 6);
}

function pathwayFor(kind) {
  switch (kind) {
    case 'danger': return 'urgent_safety';
    case 'coercion': return 'safety_and_support';
    case 'pressure': return 'boundaries_and_choice';
    case 'healthy': return 'reflection_and_choice';
    default: return 'truth_and_evidence';
  }
}

function recommendationsFor(kind, unknowns = []) {
  const recs = [];
  if (unknowns.length) {
    recs.push({
      destination: 'learn',
      trail: 'History & Truth',
      reason: 'There are still unanswered questions. Learning can add context without forcing a conclusion.'
    });
  }
  if (kind === 'pressure' || kind === 'coercion' || kind === 'danger') {
    recs.push({
      destination: 'support',
      trail: 'Support options',
      reason: 'The wording suggests a boundary, pressure or safety context where support options may be useful.'
    });
  }
  recs.push({
    destination: 'journal',
    trail: 'Reflection history',
    reason: 'Saving the reflection can help you notice what changes over time.'
  });
  return recs;
}

function choicesFor(kind) {
  switch (kind) {
    case 'danger':
      return [
        'Move toward safety if possible.',
        'Contact emergency help if danger is happening now.',
        'Do not take extra risk just to gather evidence.'
      ];
    case 'coercion':
      return [
        'Pause before responding if that is safer.',
        'Talk with a trusted person or support service.',
        'Choose whether and when to continue the conversation.'
      ];
    case 'pressure':
      return [
        'Restate a boundary if it feels safe to do so.',
        'Take time before replying.',
        'Ask for support if the pressure continues.'
      ];
    default:
      return [
        'Pause and check what is known.',
        'Ask a calm clarifying question if you want to.',
        'Wait for more information.',
        'Take space and decide later.'
      ];
  }
}

const CORE_BACKBONE = Object.freeze([
  {id:'situation',number:1,title:"What's happening?",purpose:'Capture the person’s own words without interpretation.'},
  {id:'feeling',number:2,title:'What are you feeling?',purpose:'Surface self-reported feelings or language cues without treating them as proof.'},
  {id:'known',number:3,title:'What do we actually know?',purpose:'Keep reported observations separate from assumptions and verification.'},
  {id:'interpretation',number:4,title:'What might be interpretation?',purpose:'Name possible interpretations without presenting them as fact.'},
  {id:'uncertainty',number:5,title:'What is still uncertain?',purpose:'Preserve unknowns instead of filling gaps.'},
  {id:'safety',number:6,title:'Is there pressure, a boundary issue or danger?',purpose:'Route safety context without overriding the person’s agency.'},
  {id:'choice',number:7,title:'What choices are still yours?',purpose:'Keep multiple options visible and preserve choice.'},
  {id:'next',number:8,title:'What feels like the next step?',purpose:'Let the person choose what to do next.'}
]);

function processSituation(input = {}) {
  const text = String(input.text || '').trim().slice(0, 2500);
  const selectedFeeling = String(input.feeling || 'Not specified');
  const evidence = assessEvidence({ text, feeling: selectedFeeling });
  const statements = separateStatements(text);
  const emotions = detectEmotions(text, selectedFeeling);
  const unknowns = buildUnknowns(text, evidence);

  const output = {
    version: CORE_VERSION,
    input: {
      reported_text: text,
      independently_verified: false
    },
    emotion: {
      reported_or_detected: emotions,
      note: 'Emotions are self-reported or language cues only; they are not proof of another person’s intent.'
    },
    evidence: {
      reported_observations: statements.reported,
      verification_status: evidence.proof,
      truth_note: evidence.truth
    },
    interpretation: {
      possible_interpretations: statements.interpretations,
      note: 'Interpretations are kept separate from observed or reported events.'
    },
    uncertainty: {
      unknowns
    },
    safety: {
      classification: evidence.kind,
      title: evidence.title,
      tier: evidence.tier,
      urgent: evidence.urgent,
      risks: evidence.risks
    },
    choice: {
      options: choicesFor(evidence.kind),
      user_remains_in_control: true
    },
    backbone: CORE_BACKBONE,
    recommendations: recommendationsFor(evidence.kind, unknowns),
    next_pathway: pathwayFor(evidence.kind),
    transparency: {
      method: 'Deterministic local rules using the existing ESS Evidence & Truth Engine. No remote AI is used in this prototype.',
      limits: [
        'Does not verify events.',
        'Does not diagnose people.',
        'Does not determine legal responsibility.',
        'May miss context or misunderstand wording.'
      ]
    }
  };

  output.decision_record = buildDecisionRecord(output);
  output.research_snapshot = buildResearchSnapshot(output);
  return output;
}

module.exports = { processSituation, detectEmotions, separateStatements, pathwayFor, recommendationsFor, CORE_BACKBONE };
