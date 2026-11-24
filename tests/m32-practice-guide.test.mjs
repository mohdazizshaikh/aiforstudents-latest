import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 GUIDED_TOPIC_IDS,PRACTICE_SUBJECTS,PRACTICE_DIFFICULTIES,REFERENCE_STATUS,
 guidedHint,practiceTopic,recommendPractice,optionalReviewDay,fractionStage,FRACTION_FIVE_STAGES
} from '../assets/practice-engine.js';
import {studioCheck,STUDIO_LESSONS} from '../assets/studio-engine.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('M32 offline hint selector uses only original source-backed drafts, no unauthorised AI/chat review claims',()=>{
 assert.equal(GUIDED_TOPIC_IDS.length,52);
 assert.equal(new Set(GUIDED_TOPIC_IDS).size,52);
 for(const id of GUIDED_TOPIC_IDS){
  const model=practiceTopic(id,'hi');
  assert.equal(model.id,id);assert.ok(model.title.length>4);
  for(const lang of ['en','hi']){
   const hint=guidedHint(id,lang);
   assert.equal(hint.kind,'draft-hint');assert.ok(hint.text.length>5);
   assert.equal(hint.reviewStatus,REFERENCE_STATUS);assert.equal(hint.allowRemoteChat,false);
   assert.ok(['assets/science-engine.js','assets/studio-engine.js','assets/experiment-engine.js','assets/advanced-lab-engine.js'].includes(hint.source));
   assert.match(hint.attribution,/draft|मसौदा/);
  }
 }
 assert.equal(practiceTopic('missing'),null);
 assert.deepEqual(guidedHint('not-in-catalog','en').kind,'unknown');
 assert.match(guidedHint('not-in-catalog','en').text,/not invent/);
 assert.equal(guidedHint('','hi','sensitive').kind,'adult-guidance');
 assert.match(guidedHint('','en','sensitive').text,/trusted adult/);
 assert.throws(()=>guidedHint('science:motion','xx'),/language/);
 assert.throws(()=>guidedHint('science:motion','en','wrong-risk'),/safety/);
});
test('M32 explainable practice choices are always optional, user-controlled and non-inferential',()=>{
 for(const subject of PRACTICE_SUBJECTS)for(const difficulty of PRACTICE_DIFFICULTIES)for(const lang of ['en','hi']){
  const p=recommendPractice({subject,difficulty,lang});
  assert.ok(p.href.startsWith('#'));assert.match(p.reason,/practice|model|अभ्यास|मॉडल|सुरक्षा/);
  assert.equal(p.declinable,true);assert.equal(p.isMasteryPrediction,false);
  assert.equal(p.persists,false);assert.equal(p.reviewStatus,REFERENCE_STATUS);
 }
 for(const x of [{subject:'unknown',difficulty:'gentle',lang:'en'},{subject:'maths',difficulty:'IQ99',lang:'hi'},{subject:'biology',difficulty:'standard',lang:'xx'}])
  assert.throws(()=>recommendPractice(x));
});
test('M32 opt-in paper review dates have no streak, punishment or notification and work through leap days',()=>{
 assert.equal(optionalReviewDay('2028-02-28',1).day,'2028-02-29');
 assert.equal(optionalReviewDay('2028-02-28',3).day,'2028-03-02');
 assert.equal(optionalReviewDay('2026-12-30',7).day,'2027-01-06');
 for(const days of [1,3,7]){const x=optionalReviewDay('2026-11-24',days);assert.equal(x.optional,true);assert.equal(x.stored,false);assert.equal(x.notification,false);assert.equal(x.penalty,false);assert.equal(x.streak,false)}
 for(const [day,gap] of [['2026-02-30',1],['invalid',1],['2026-11-24',0],['2026-11-24',2],['2026-11-24',100]])assert.throws(()=>optionalReviewDay(day,gap));
});
test('M32 reusable five-stage fraction shell matches original Studio 2/4 equivalence and bilingual content',()=>{
 assert.deepEqual(FRACTION_FIVE_STAGES,['learn','try','play','understand','grow']);
 for(const stage of FRACTION_FIVE_STAGES){
  for(let shaded=0;shaded<=4;shaded++){
   const r=fractionStage(stage,shaded,'en');
   assert.equal(r.correct,studioCheck('fractions','try',shaded));
   assert.equal(r.correct,shaded===2);assert.equal(r.completionIsMastery,false);
   assert.equal(r.reviewStatus,REFERENCE_STATUS);
   assert.ok(r.text.length>9);assert.ok(fractionStage(stage,shaded,'hi').text.length>8);
  }
 }
 assert.equal(fractionStage('learn',2,'en').text,STUDIO_LESSONS.fractions.concept[0]);
 assert.throws(()=>fractionStage('unknown',0));assert.throws(()=>fractionStage('try',5));assert.throws(()=>fractionStage('try',2,'unknown'));
});
test('M32 local guidance interface has accessible fixed selectors, no text chat, child profile or network',()=>{
 const html=read('index.html'),app=read('assets/practice-app.js'),sw=read('service-worker.js');
 for(const id of ['local-learning-guide','local-guide-subject','local-guide-difficulty','local-guide-language','local-guide-topic','local-guide-sensitive','local-guide-fraction-count','local-guide-fraction-feedback'])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(html,/href="#local-learning-guide"/);
 assert.match(html,/role="status"/);
 assert.match(app,/aifs-history-cleared/);
 assert.doesNotMatch(app,/fetch\(|localStorage|sessionStorage|openai\.com|token|navigator\.geolocation|XMLHttpRequest/);
 assert.match(sw,/aifs-discovery-m33/);
 assert.ok(sw.includes('./assets/practice-engine.js')&&sw.includes('./assets/practice-app.js'));
 assert.ok(!html.includes('type="text"')||!html.includes('id="chat-input"'));
});
