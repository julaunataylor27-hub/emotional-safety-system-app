const PAIR_FEELINGS=['Unknown','Love','Care','Fear','Hurt','Anger','Resentment','Protectiveness','Guilt','Shame','Hope','Trust','Longing','Grief','Sadness','Relief','Joy','Confusion','Loneliness'];
const PAIR_SOURCES=['My own feeling','They told me','My impression','Unsure'];
const PAIR_SCOPES=['One person, same situation','Two people','Unsure'];
const AMBIVALENT_PAIRS=[['Love','Anger'],['Love','Resentment'],['Hope','Fear'],['Trust','Fear'],['Relief','Sadness']];
const pairMatches=(pair,labels)=>pair.length===2&&labels.every(label=>pair.includes(label));
function emptyFeelingPair(){return [{feeling:'Unknown',who:'',source:'Unsure'},{feeling:'Unknown',who:'',source:'Unsure'}];}
function normalisePair(triangle={}){
  return [0,1].map(index=>{
    const item=triangle.feelingPair?.[index]||{};
    return {feeling:PAIR_FEELINGS.includes(item.feeling)?item.feeling:'Unknown',who:typeof item.who==='string'?item.who.trim():'',source:PAIR_SOURCES.includes(item.source)?item.source:'Unsure'};
  });
}
function feelingPairKey(triangle={}){
  return JSON.stringify([normalisePair(triangle),triangle.pairScope||'Unsure',triangle.care,triangle.pressure,triangle.freedom,triangle.repeated,triangle.evidence||'',triangle.unknowns||'',triangle.impact||'']);
}
function analyseFeelingPair(triangle={},context={}){
  const pair=normalisePair(triangle),labels=pair.map(item=>item.feeling),scope=PAIR_SCOPES.includes(triangle.pairScope)?triangle.pairScope:'Unsure';
  if(labels.includes('Unknown'))throw Error('Choose Feeling 1 and Feeling 2 first. Unknown is welcome when you cannot tell; a meaning cannot be supplied for a missing feeling.');
  const direct=pair.every(item=>['My own feeling','They told me'].includes(item.source));
  const conflict=scope==='Two people'&&pair.every(item=>item.source==='My own feeling')||scope==='One person, same situation'&&pair.some(item=>item.source==='My own feeling')&&pair.some(item=>item.source==='They told me');
  const observed=pair.some(item=>item.source==='My impression');
  const unknowns=[];
  if(scope==='Unsure')unknowns.push('Whether these feelings belong to one person in the same situation or to two people.');
  pair.forEach((item,index)=>{if(item.source==='Unsure')unknowns.push(`How Feeling ${index+1} is known.`);});
  if(observed)unknowns.push('What the person actually feels: an appearance is an impression, not a report of their inner state.');
  if(conflict)unknowns.push('The selected feeling sources conflict with the number of people. Review who feels what.');
  if(!triangle.evidence?.trim())unknowns.push('The specific action, event or words that came before these feelings.');
  if(triangle.unknowns?.trim())unknowns.push('Your recorded uncertainty: '+triangle.unknowns.trim());
  let word='Mixed feelings',meaning='Two feeling words have been recorded together. This phrase describes their coexistence, without deciding what caused them.';
  let questions=['What happened immediately before each feeling?','What did each person say they needed, and what remains unconfirmed?'];
  let sourceUrl=null;
  if(labels[0]===labels[1]){
    word=scope==='Two people'?'Similar feelings':'A repeated feeling';
    meaning='Both inputs name '+labels[0]+'. The same word can have different causes for different people.';
    questions=['Are the two feelings responses to the same event?','What does this feeling mean to each person in their own words?'];
  }else if(pairMatches(labels,['Love','Fear'])||pairMatches(labels,['Care','Fear'])){
    word=scope==='One person, same situation'?'Conflicted care':'Care meets fear';
    meaning='Connection and fear have both been named. This can be a useful phrase for exploring what feels caring and what feels frightening.';
    questions=['Is the fear linked to a specific threat, uncertainty, separation or something else?','Which behaviour supports that explanation, and which parts are still assumptions?'];
  }else if(pairMatches(labels,['Love','Hurt'])||pairMatches(labels,['Care','Hurt'])){
    word='Painful connection';meaning='Care or love and hurt are both named. The phrase describes that contrast; it does not establish who caused the hurt.';
    questions=['What words or actions felt hurtful?','Could the hurt relate to a loss, an unmet need, a boundary or something else? What supports each possibility?'];
  }else if(pairMatches(labels,['Care','Resentment'])||pairMatches(labels,['Protectiveness','Resentment'])){
    word='Strained care';meaning='Care or protectiveness and resentment are both named. This phrase invites a closer look at responsibility, hurt and boundaries.';
    questions=['Does responsibility feel uneven, or is there a specific unresolved hurt?','Is support freely offered and accepted, or does anyone feel pressured?'];
  }else if(pairMatches(labels,['Love','Resentment'])){
    word='Strained connection';meaning='Love and resentment are both named. They may point to different needs or responses to an event, rather than one settled explanation.';
    questions=['What is the resentment attached to?','What would respectful care and a clear boundary look like in this situation?'];
  }else if(pairMatches(labels,['Love','Anger'])){
    word='Care meets anger';meaning='Love and anger have both been named. The phrase can help explore the difference between connection and a response to something upsetting.';
    questions=['What event or boundary is the anger about?','Are these feelings in one person, or different people responding differently?'];
  }else if(pairMatches(labels,['Hope','Fear'])){
    word='Guarded hope';meaning='Hope and fear have both been named. The phrase can help explore wanting an outcome while feeling uncertain or afraid.';
    questions=['What outcome is hoped for, and what specific concern is feared?','Which information would help clarify that concern?'];
  }else if(pairMatches(labels,['Trust','Fear'])){
    word='Trust meets fear';meaning='Trust and fear are both named. These words alone cannot establish whether trust is warranted or what caused the fear.';
    questions=['Is the fear about this person, a specific action or another part of the situation?','What is known firsthand about boundaries and freedom to say no?'];
  }else if(pairMatches(labels,['Love','Grief'])){
    word='Love through grief';meaning='Love and grief have both been named. This phrase can help explore what mattered and what feels lost.';
    questions=['What loss or change is being described?','What support would help with this feeling without requiring a decision about the whole relationship?'];
  }else if(pairMatches(labels,['Anger','Hurt'])){
    word='Hurt and anger';meaning='Hurt and anger have both been named. Their combination can be explored without judging the person who feels them.';
    questions=['What happened before the hurt and anger?','What safe boundary or support could help before acting on either feeling?'];
  }else if(pairMatches(labels,['Guilt','Fear'])||pairMatches(labels,['Guilt','Shame'])){
    word='Self-judgment to explore';meaning='Guilt and fear or shame have both been named. Feeling guilty or ashamed does not establish that someone has done something wrong.';
    questions=['What responsibility is actually yours, and what are you assuming?','What would a kind, factual description of the situation say?'];
  }
  if(direct&&!conflict&&scope==='One person, same situation'&&AMBIVALENT_PAIRS.some(item=>pairMatches(labels,item))){
    word='Ambivalence';meaning='Conflicting feelings are being described in one person about the same situation. Ambivalence is a word for feelings pulling in different directions.';
    sourceUrl='https://dictionary.apa.org/ambivalence';
  }
  if(observed){word='Mixed impressions';meaning='The inputs include an impression of how someone seemed. These words can organise observations, while the person’s actual feelings and motives remain unconfirmed.';}
  if(conflict){word='Check who feels what';meaning='The selected sources and number of people conflict. Clarify that detail before interpreting the pair.';}
  const contextSupported=['Yes','No'].includes(triangle.care)&&triangle.pressure==='Yes'&&triangle.freedom==='No';
  const contextWord=contextSupported&&context.phrase?context.phrase:null;
  const centre=contextWord&&!conflict?contextWord:word;
  const basis=pair.map((item,index)=>`Feeling ${index+1}: ${item.feeling}; whose: ${item.who||'not recorded'}; source: ${item.source}.`);
  basis.push('Relationship between feelings: '+scope+'.');
  if(contextWord)basis.push('The dynamic phrase comes from the separate reported pressure and restricted-choice answers, not from multiplying the feelings.');
  return {key:feelingPairKey(triangle),pair,scope,word,centre,meaning,basis,questions,unknowns,sourceUrl,contextWord,
    equation:`${labels[0]} × ${labels[1]} → ${centre}`,
    explanation:'The × symbol means “consider together”. This is a vocabulary aid, not numerical multiplication, a validated emotional equation or a discovery of another person’s motives.',
    causeLimit:'The reason a word fits is different from the cause of someone’s behaviour. Feelings alone cannot establish that cause. Use the questions and reported observations to investigate possibilities.'};
}
module.exports={PAIR_FEELINGS,PAIR_SOURCES,PAIR_SCOPES,emptyFeelingPair,feelingPairKey,analyseFeelingPair};
