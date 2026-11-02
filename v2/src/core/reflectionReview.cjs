'use strict';
// Pure, local interpretation of user-controlled review choices. This is NOT a safety
// classification, evidence verification or automatic journal storage.
function buildReflectionReview({
  selectedFeelings=[], otherFeeling='', interpretationChecks={},
  unknownChecks={}, choicePreview='', selectedNext=''
}={}) {
  const selections=[...selectedFeelings,String(otherFeeling||'').trim()]
    .map(x=>String(x||'').trim().slice(0,50)).filter(Boolean);
  const feelings=[...new Set(selections)].slice(0,8);
  const interpretations=Object.entries(interpretationChecks)
    .filter(([,value])=>value==='fits'||value==='no')
    .slice(0,15).map(([text,status])=>({text:text.slice(0,260),status:status==='fits'?'That fits':'Not what I meant'}));
  const uncertainties=Object.entries(unknownChecks)
    .filter(([,value])=>value==='open'||value==='known')
    .slice(0,15).map(([text,status])=>({text:text.slice(0,260),status:status==='known'?'You marked this answered (not independently verified)':'Still open'}));
  const focusedOption=String(choicePreview||'').slice(0,240);
  const nextStep=String(selectedNext||'').slice(0,240);
  return {
    feelings, interpretations, uncertainties,
    focused_option:focusedOption,
    next_step:nextStep,
    has_user_review:feelings.length>0||interpretations.length>0||uncertainties.length>0||!!focusedOption||!!nextStep,
    // A person's decision to leave something open is not a failure to complete.
    left_open:['Not ready yet','Leave it for now'].includes(nextStep)
  };
}
module.exports={buildReflectionReview};
