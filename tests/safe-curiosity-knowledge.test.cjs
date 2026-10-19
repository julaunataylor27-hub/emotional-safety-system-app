const {test} = require('node:test');
const assert = require('node:assert/strict');
const Lab = require('../src/safeCuriosity.cjs');
const K = require('../src/safeCuriosityKnowledge.cjs');

test('all five fictional questions open a four-part knowledge lesson', () => {
  for(const sample of Lab.EXAMPLES) {
    const result=Lab.reviewQuestion(sample.question,'13-17');
    const k=K.getKnowledge(result,'13-17');
    assert.ok(k.intro.length>35,sample.id);
    assert.ok(k.sections.length >= 4,sample.id);
    assert.ok(k.sections.every(s=>s.title && s.body.length>=60),sample.id);
    assert.ok(k.followups.length>=2,sample.id);
    assert.ok(k.quiz && k.quiz.choices.length===3,sample.id);
    assert.ok(k.sources.length>=1,sample.id);
  }
});

test('under-13 source selection avoids the more explicit young-people nude guidance', () => {
  for(const age of ['6-9','10-12']){
    const k=K.getKnowledge('privacy',age);
    assert.ok(k.sources.some(s=>s.url.includes('/parents/')),age);
    assert.ok(!k.sources.some(s=>s.url.includes('/young-people/being-pressured-to-send-nudes')),age);
  }
  const teen=K.getKnowledge('privacy','13-17');
  assert.ok(teen.sources.some(s=>s.url.includes('/young-people/being-pressured-to-send-nudes')));
  assert.notEqual(K.getKnowledge('puberty','6-9').sections[1].body,K.getKnowledge('puberty','13-17').sections[1].body);
});

test('urgent questions show a support route, no quiz or follow-up activities', () => {
  const result=Lab.reviewQuestion('I want to hurt myself');
  assert.equal(result.id,'urgent');
  const knowledge=K.getKnowledge(result,'10-12');
  assert.equal(knowledge.quiz,null);
  assert.deepEqual(knowledge.followups,[]);
  assert.match(knowledge.sections[0].body,/000/);
});

test('unknown questions teach research rather than inventing a factual answer', () => {
  const k=K.getKnowledge(Lab.reviewQuestion('Why does a neutron star rotate?'),'10-12');
  assert.match(k.intro,/does not have a reliable explanation/);
  assert.deepEqual(k.sources,[]);
  assert.match(k.sections[2].body,/Compare two independent/);
});

test('all example knowledge checks have exactly one valid correct index',()=>{
  for(const [id,lesson] of Object.entries(K.LESSONS)){
    if(id==='urgent') continue;
    const quiz=lesson.quiz;
    assert.ok(Number.isInteger(quiz.correct));
    assert.ok(quiz.correct>=0 && quiz.correct<quiz.choices.length);
    assert.equal(new Set(quiz.choices).size,quiz.choices.length);
  }
});

test('knowledge content contains no personal question and only named source links',()=>{
  const sensitive='My phone number 0400000000. Why do websites recommend videos?';
  const result=Lab.reviewQuestion(sensitive,'10-12');
  const trail=K.getKnowledge(result,'10-12');
  assert.equal(JSON.stringify(trail).includes('0400000000'),false);
  for(const source of Object.values(K.REFERENCES)){
    const url=new URL(source.url);
    assert.equal(url.protocol,'https:');
    assert.ok(['www.esafety.gov.au','raisingchildren.net.au'].includes(url.hostname));
  }
});
