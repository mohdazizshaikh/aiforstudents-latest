import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 SCIENCE_IDS,SCIENCE_STAGES,SCIENCE_MODELS,SCIENCE_VERSION,
 scienceText,scienceModel,scienceValidateState,scienceEvaluate,scienceExplain,
 scienceChoiceCheck,auditSciencePairs
} from '../assets/science-engine.js';
import {auditContentQueues} from '../tools/release-preflight.mjs';
import {buildReviewRows,buildSummary,resolvePilotContent} from '../tools/build-review-packet.mjs';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('M31 seven distinct Physics/Chemistry/Biology draft models and full bilingual five-stage shell',()=>{
 assert.equal(SCIENCE_VERSION,1);
 assert.equal(SCIENCE_IDS.length,7);
 assert.deepEqual(SCIENCE_STAGES,['learn','try','play','understand','grow']);
 assert.deepEqual(auditSciencePairs(),[]);
 for(const id of SCIENCE_IDS){
  const m=scienceModel(id);
  assert.ok(['Physics','Chemistry','Biology'].includes(m.subject));
  assert.match(m.caveat[0],/model|diagram|experiment|example|microscope|complex|classroom|teaching/i);
  assert.equal(scienceEvaluate(id,m.target).correct,true,id);
  assert.equal(scienceEvaluate(id,m.initial).correct,false,id+' unexpectedly starts at target');
  for(let i=0;i<3;i++)assert.equal(scienceChoiceCheck(id,i),i===m.play.answer,id+' answer index '+i);
  assert.throws(()=>scienceChoiceCheck(id,3),/Invalid/);
  assert.throws(()=>scienceChoiceCheck(id,'0'),/Invalid/);
  assert.ok(scienceExplain(id,m.target,'hi').length>10);
 }
 assert.deepEqual(SCIENCE_IDS.map(id=>SCIENCE_MODELS[id].play.answer),[0,1,2,1,2,1,2]);
 assert.throws(()=>scienceModel('unapproved-model'));
 assert.throws(()=>scienceText(['English','']));
 const modified=structuredClone(SCIENCE_MODELS);
 modified.motion.prompt[1]='';
 assert.match(auditSciencePairs(modified).join(' '),/motion:prompt/);
});
test('M31 motion model uses metres and seconds; all 220 bounded states have exact reference speed',()=>{
 for(let d=0;d<=100;d+=10)for(let s=1;s<=20;s++){
  const r=scienceEvaluate('motion',{distance:d,seconds:s});
  assert.equal(r.metrics.speedMetresPerSecond,d/s);
  assert.equal(r.correct,d===60&&s===10);
  assert.match(r.english,/m\/s/);
  assert.match(r.hindi,/m\/s/);
 }
 for(const bad of [{distance:-10,seconds:5},{distance:20,seconds:0},{distance:5,seconds:2},{distance:10,seconds:20.5},{distance:20,seconds:'5'},{distance:NaN,seconds:1},{distance:20,seconds:5,secret:'child'}])
  assert.throws(()=>scienceEvaluate('motion',bad));
});
test('M31 reflection is law from normal with independently entered angles, not false auto-correction',()=>{
 for(let incident=0;incident<=90;incident+=5)for(let reflected=0;reflected<=90;reflected+=5){
  const r=scienceEvaluate('reflection',{incident,reflected});
  assert.equal(r.metrics.equal,incident===reflected);
  assert.equal(r.correct,incident===35&&reflected===35);
  assert.match(r.english,/normal/);
 }
 assert.throws(()=>scienceEvaluate('reflection',{incident:-5,reflected:5}));
 assert.throws(()=>scienceEvaluate('reflection',{incident:35,reflected:36}));
});
test('M31 energy accounting conserves 100J in every permitted model setting',()=>{
 for(let useful=0;useful<=100;useful+=10){
  const r=scienceEvaluate('energy',{useful});
  assert.equal(r.metrics.inputJ,100);
  assert.equal(r.metrics.usefulJ+r.metrics.thermalJ,100);
  assert.equal(r.correct,useful===70);
  assert.match(r.english,/ideal two-pathway/);
 }
 assert.throws(()=>scienceEvaluate('energy',{useful:75}));
 assert.throws(()=>scienceEvaluate('energy',{useful:110}));
});
test('M31 matter/change/cell/food-chain choices are bounded and explain limitations, not real experiments',()=>{
 const matter=SCIENCE_MODELS.matter.fields[0].options.map(x=>x.value);
 assert.deepEqual(matter,['solid','liquid','gas']);
 for(const state of matter)assert.ok(scienceExplain('matter',{state},'en').length>25);
 for(const example of ['melting','burning','dissolving']){
  for(const kind of ['physical','chemical']){
   const r=scienceEvaluate('changes',{example,kind});
   assert.equal(r.metrics.correctClassification,kind===(example==='burning'?'chemical':'physical'));
  }
 }
 const cell=SCIENCE_MODELS.cells.fields[0].options.map(x=>x.value);
 assert.deepEqual(cell,['leaf','animal','bacterium']);
 for(const x of cell)assert.ok(scienceExplain('cells',{cell:x},'hi').length>15);
 const chains=SCIENCE_MODELS['food-chain'].fields[0].options.map(x=>x.value);
 assert.equal(chains.length,3);
 assert.equal(scienceEvaluate('food-chain',{chain:'grass-grasshopper-frog-snake'}).correct,true);
 assert.equal(scienceEvaluate('food-chain',{chain:'snake-grasshopper-grass'}).correct,false);
 for(const [id,bad] of [['matter',{state:'plasma'}],['changes',{example:'melting',kind:'safe'}],['cells',{cell:'person'}],['food-chain',{chain:'no'}]])
  assert.throws(()=>scienceValidateState(id,bad));
});
test('M31 science B1 app is bilingual, button/keyboard-only, no session persistence and PWA-precache-ready',()=>{
 const html=read('index.html'),app=read('assets/science-app.js'),sw=read('service-worker.js');
 for(const needle of ['id="science-lab"','id="science-feedback"','id="science-next"','id="science-prev"','id="science-quiz"','href="#science-lab"','assets/science-app.js'])assert.ok(html.includes(needle),needle);
 for(const n of ['aifs-history-cleared','aria-label','aria-live','SCIENCE_STAGES','scienceEvaluate'])assert.ok(app.includes(n)||html.includes(n),n);
 assert.doesNotMatch(app,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|navigator\.geolocation|crypto\.randomUUID/);
 assert.match(sw,/aifs-discovery-m33/);
 assert.ok(sw.includes('./assets/science-engine.js'));
 assert.ok(sw.includes('./assets/science-app.js'));
 assert.match(html,/UNREVIEWED drafts/);
});
test('M31 seven new SHA-256 bound pending review records never self-approve child release',()=>{
 const audit=auditContentQueues();assert.equal(audit.total,3316);assert.equal(audit.pending,3316);
 assert.equal(audit.counts.science.total,7);assert.equal(audit.counts.science.pending,7);
 const rows=buildReviewRows(),summary=buildSummary(undefined,rows);
 assert.equal(rows.length,3316);assert.equal(summary.pendingHumanReviewRecords,3316);
 const science=rows.filter(x=>x.queue==='science');
 assert.equal(science.length,7);
 for(const row of science){
  assert.equal(row.content_source,'assets/science-engine.js');
  assert.match(row.content_id,/^science:/);
  assert.match(row.content_sha256,/^[a-f0-9]{64}$/);
  assert.ok(row.context_hindi.length>50);
  assert.ok(row.explanation_hindi.length>10);
  assert.match(row.answer_or_guidance,/State-dependent target/);
  assert.equal(row.human_decision,'NO DECISION RECORDED BY THIS EXPORT');
 }
 assert.throws(()=>resolvePilotContent('science',{id:'science:motion',contentVersion:999}),/version/);
 assert.throws(()=>resolvePilotContent('science',{id:'science:unknown',contentVersion:1}),/Unknown Science/);
 assert.equal(summary.publicReleaseApproved,false);
});
