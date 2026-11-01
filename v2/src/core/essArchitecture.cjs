'use strict';

const ARCHITECTURE_VERSION = 'ess-architecture-v2';
const CORE_VERSION = 'ess-core-v2';

const RULES = Object.freeze({
  danger: ['SAFETY-URGENT-001'],
  coercion: ['SAFETY-COERCION-001','CHOICE-PRESERVE-001'],
  pressure: ['BOUNDARY-PRESSURE-001','CHOICE-PRESERVE-001'],
  healthy: ['BOUNDARY-RESPECT-001','CHOICE-PRESERVE-001'],
  insufficient: ['UNCERTAINTY-PRESERVE-001','CHOICE-PRESERVE-001']
});

function rulesFor(classification) {
  return RULES[classification] || RULES.insufficient;
}

function buildDecisionRecord(result) {
  const classification = result?.safety?.classification || 'insufficient';
  return {
    architecture_version: ARCHITECTURE_VERSION,
    core_version: CORE_VERSION,
    decision_type: 'deterministic_pathway_selection',
    classification,
    pathway: result?.next_pathway || 'truth_and_evidence',
    rule_ids: rulesFor(classification),
    verified_event: false,
    user_control_preserved: result?.choice?.user_remains_in_control === true,
    uncertainty_count: Array.isArray(result?.uncertainty?.unknowns) ? result.uncertainty.unknowns.length : 0
  };
}

function buildResearchSnapshot(result) {
  return {
    architecture_version: ARCHITECTURE_VERSION,
    emotion_count: result?.emotion?.reported_or_detected?.length || 0,
    reported_information_count: result?.evidence?.reported_observations?.length || 0,
    interpretation_count: result?.interpretation?.possible_interpretations?.length || 0,
    uncertainty_count: result?.uncertainty?.unknowns?.length || 0,
    choice_count: result?.choice?.options?.length || 0,
    urgent_route: result?.safety?.urgent === true,
    user_control_preserved: result?.choice?.user_remains_in_control === true
  };
}

module.exports = {
  ARCHITECTURE_VERSION,
  CORE_VERSION,
  rulesFor,
  buildDecisionRecord,
  buildResearchSnapshot
};
