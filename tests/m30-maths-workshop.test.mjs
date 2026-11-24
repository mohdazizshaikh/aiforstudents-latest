import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 WORKSHOP_MODES,WORKSHOP_CONTENT,WORKSHOP_DRAFT_REVIEW,workshopValues,evaluateWorkshop,
 bulbLit,evaluateExperiment
} from '../assets/experiment-engine.js';
import {auditContentQueues} from '../tools/release-preflight.mjs';
import {buildReviewRows,buildSummary} from '../tools/build-review-packet.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('M30 three original Maths Workshop mini-labs have paired bilingual drafts but no educational approval',()=>{
 assert.deepEqual(WORKSHOP_MODES,['number-line','rectangle','data-table']);
 assert.equal(WORKSHOP_DRAFT_REVIEW,'pending-subject-and-Hindi-review');
 for(const mode of WORKSHOP_MODES){
  const p=WORKSHOP_CONTENT[mode];for(const field of ['title','prompt','hint']){
   assert.equal(p[field].length,2);
   assert.ok(p[field][0].length>10);
   assert.ok(p[field][1].length>6);
  }
 }
 assert.match(read('index.html'),/Draft mathematics activities need qualified educator\/Hindi review/);
});
test('M30 number line accepts only bounded integer states; target left of zero is exactly -3',()=>{
 for(let n=-10;n<=10;n++){
  const x=evaluateWorkshop('number-line',{position:n});
  assert.equal(x.correct,n===-3);
  assert.equal(x.metrics.position,n);
  assert.match(x.explanation[0],/not proof of mastery/);
 }
 for(const v of [-11,11,0.2,NaN,null,'-3',Infinity])assert.throws(()=>evaluateWorkshop('number-line',{position:v}));
 assert.throws(()=>evaluateWorkshop('unknown',{position:0}));
});
test('M30 geometry exact area and perimeter for whole-unit rectangle 1 through 12',()=>{
 for(let w=1;w<=12;w++)for(let h=1;h<=12;h++){
  const x=evaluateWorkshop('rectangle',{width:w,height:h});
  assert.equal(x.metrics.area,w*h);
  assert.equal(x.metrics.perimeter,2*(w+h));
  assert.equal(x.correct,w===4&&h===3);
 }
 for(const bad of [{width:0,height:3},{width:13,height:1},{width:3.5,height:4},{width:'4',height:3},{width:4,height:null}])
  assert.throws(()=>evaluateWorkshop('rectangle',bad));
});
test('M30 data table comparison is arithmetic, not a learner scoring or talent ranking',()=>{
 for(let a=0;a<=10;a++)for(let b=0;b<=10;b++){
  const x=evaluateWorkshop('data-table',{a,b});
  assert.equal(x.metrics.difference,a-b);
  assert.equal(x.correct,a===4&&b===2);
 }
 assert.throws(()=>evaluateWorkshop('data-table',{a:11,b:2}));
 assert.throws(()=>workshopValues('data-table',{a:1,b:-1}));
});
test('M30 Maths review queue is integrated with original 3,282-record human review pipeline',()=>{
 const audit=auditContentQueues();
 assert.equal(audit.total,3332);
 assert.equal(audit.pending,3332);
 assert.equal(audit.counts.maths.total,3);
 assert.equal(audit.counts.maths.pending,3);
 const rows=buildReviewRows(),summary=buildSummary(undefined,rows);
 assert.equal(rows.length,3332);
 assert.equal(summary.pendingHumanReviewRecords,3332);
 const maths=rows.filter(x=>x.queue==='maths');
 assert.equal(maths.length,3);
 for(const row of maths){
  assert.match(row.content_id,/^workshop:/);
  assert.equal(row.human_decision,'NO DECISION RECORDED BY THIS EXPORT');
  assert.equal(row.content_sha256.length,64);
  assert.ok(row.hindi_draft.length>10);
  assert.ok(row.english_draft.length>10);
  assert.match(row.answer_or_guidance,/Target-state numeric check/);
 }
});
test('M30 workshop UI is accessible, no drag, no API, local-only and existing conceptual circuit safety remains intact',()=>{
 const html=read('index.html'),app=read('assets/experiment-app.js'),sw=read('service-worker.js');
 for(const text of ['id="math-workshop"','id="math-workshop-feedback"','id="math-workshop-controls"','id="math-workshop-tabs"'])
  assert.ok(html.includes(text),text);
 assert.match(html,/href="#math-workshop"/);
 assert.match(app,/aria-label/);
 assert.match(app,/workshopButton/);
 assert.match(app,/aifs-history-cleared/);
 assert.doesNotMatch(app,/navigator\.geolocation|openai\.com|api\.gemini|localStorage\.setItem/);
 assert.match(sw,/aifs-discovery-m33/);
 for(const a of [false,true])for(const b of [false,true]){
  assert.equal(bulbLit({a,b}),a&&b);
  assert.equal(evaluateExperiment('series-circuit','light',{a,b}).correct,a&&b);
 }
});
