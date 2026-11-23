import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {buildReviewRows,resolvePilotContent,buildSummary,packetCsv} from '../tools/build-review-packet.mjs';

test('M21 studio review packet includes actual source questions, bilingual explanations and answer key',()=>{
 const rows=buildReviewRows();
 const s=rows.find(r=>r.queue==='studio'&&r.content_id==='fractions:play');
 assert.ok(s);
 assert.match(s.english_draft,/Which fraction is equal to 1\/2/);
 assert.match(s.hindi_draft,/भिन्न/);
 assert.match(s.answer_or_guidance,/2\/4/);
 assert.match(s.explanation_english,/same whole/);
 assert.equal(s.content_source,'assets/studio-engine.js');
 assert.match(s.content_sha256,/^[a-f0-9]{64}$/);
});
test('M21 experiment reviewer can read actual Hindi/English prompts and source hints, no fabricated static answer',()=>{
 const rows=buildReviewRows();
 const e=rows.find(r=>r.queue==='experiment'&&r.content_id==='series-circuit:interrupt');
 assert.ok(e);
 assert.match(e.english_draft,/open exactly ONE/);
 assert.match(e.hindi_draft,/स्विच/);
 assert.match(e.hints_english,/series switches/);
 assert.equal(e.content_source,'assets/experiment-engine.js');
 assert.match(e.answer_or_guidance,/State-dependent validation/);
 assert.match(e.content_sha256,/^[a-f0-9]{64}$/);
 assert.equal(buildSummary(undefined,rows).packetVersion,'m21-review-worklist-v2');
 assert.ok(packetCsv([e]).includes(e.content_sha256));
});
test('M21 pilot metadata with wrong source version or unknown item fails closed',()=>{
 assert.throws(()=>resolvePilotContent('studio',{journeyId:'fractions',stageId:'try',contentVersion:999}),/version mismatch/);
 assert.throws(()=>resolvePilotContent('experiment',{experimentId:'fractions-lab',taskId:'compare',contentVersion:999}),/version mismatch/);
 assert.throws(()=>resolvePilotContent('studio',{journeyId:'fractions',stageId:'NOT_A_TASK',contentVersion:1}),/unknown exercise/);
 assert.throws(()=>resolvePilotContent('experiment',{experimentId:'fake',taskId:'compare',contentVersion:1}),/unknown task/);
});
test('M21 content digest changes for actual question edits, but never implies a human approval',()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'aifs-m21-'));
 try{
  const base={
   'CONTENT_REVIEW_QUEUE.jsonl':[{id:'g1',question_en:'What is 2 + 2?',question_hi:'२ + २ क्या है?',answer_for_reviewer:4,review_status:'UNREVIEWED',approved_for_child_launch:false}],
   'LAB_CONTENT_REVIEW_QUEUE.jsonl':[{id:'study1',questionEn:'What is 3 + 3?',questionHi:'३ + ३ क्या है?',subjectExpertReview:'pending'}],
   'STUDIO_CONTENT_REVIEW_QUEUE.jsonl':[{journeyId:'fractions',stageId:'try',contentVersion:1,englishHumanReview:'pending'}],
   'EXPERIMENT_CONTENT_REVIEW_QUEUE.jsonl':[{experimentId:'fractions-lab',taskId:'compare',contentVersion:1,educationalReview:'pending'}],
   'CLASSROOM_CONTENT_REVIEW_QUEUE.jsonl':[{id:'class1',question:{en:'Question',hi:'सवाल'},educationalReview:'PENDING'}],
   'DIGITAL_CONTENT_REVIEW_QUEUE.jsonl':[{id:'digital1',question:{en:'Safe?',hi:'सुरक्षित?'},educationReview:'pending'}],
   'MATHS_CONTENT_REVIEW_QUEUE.jsonl':[{id:'workshop:number-line',contentVersion:1,englishHumanReview:'pending',hindiHumanReview:'pending'}],
   'SCIENCE_CONTENT_REVIEW_QUEUE.jsonl':[{id:'science:motion',contentVersion:1,englishHumanReview:'pending',hindiHumanReview:'pending'}]
  };
  const save=()=>{for(const [name,items] of Object.entries(base))writeFileSync(path.join(root,name),items.map(JSON.stringify).join('\n')+'\n')};
  save();const first=buildReviewRows(root);
  assert.equal(first.length,8);
  const original=first.find(x=>x.content_id==='g1').content_sha256;
  base['CONTENT_REVIEW_QUEUE.jsonl'][0].review_status='PENDING';
  save();const statusChanged=buildReviewRows(root);
  assert.equal(statusChanged.find(x=>x.content_id==='g1').content_sha256,original);
  base['CONTENT_REVIEW_QUEUE.jsonl'][0].question_en='What is 2 + 3?';
  save();const textChanged=buildReviewRows(root);
  assert.notEqual(textChanged.find(x=>x.content_id==='g1').content_sha256,original);
  assert.equal(buildSummary(root,textChanged).publicReleaseApproved,false);
  assert.equal(textChanged.find(x=>x.content_id==='g1').human_decision,'NO DECISION RECORDED BY THIS EXPORT');
 }finally{rmSync(root,{recursive:true,force:true})}
});
