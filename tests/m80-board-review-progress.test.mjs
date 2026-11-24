import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBoardReviewBatch,boardReviewBatchIndex} from '../tools/board-review-batches.mjs';
import {summarizeBoardReviewBatches} from '../tools/board-review-progress.mjs';
const all=()=>boardReviewBatchIndex().batches.map(x=>makeBoardReviewBatch(x.id));
test('M80 no submissions are unknown rather than falsely reviewed or pending',()=>{
 const r=summarizeBoardReviewBatches([]);
 assert.equal(r.valid,true);assert.equal(r.totalChecks,180);assert.equal(r.unsubmittedChecks,180);
 assert.equal(r.pendingChecks,0);assert.equal(r.allBatchesSubmitted,false);
 assert.ok(r.batches.every(b=>b.pending===null&&b.status==='NOT_SUBMITTED'));
});
test('M80 all partial and complete batch combinations reconcile exactly',()=>{
 const inputs=all();
 for(let mask=0;mask<8;mask++){
  const selected=inputs.filter((_,i)=>mask&(1<<i)),r=summarizeBoardReviewBatches(selected);
  assert.equal(r.valid,true);assert.equal(r.submittedBatches,selected.length);
  assert.equal(r.submittedChecks+r.unsubmittedChecks,180);
  assert.equal(r.pendingChecks,r.submittedChecks);assert.equal(r.decidedChecks,0);
  assert.equal(r.allBatchesSubmitted,selected.length===3);assert.equal(r.verifiedChapters,0);
  assert.equal(r.publicReleaseApproved,false);assert.equal(r.humanApprovalAuthenticated,false);
  assert.deepEqual(summarizeBoardReviewBatches([...selected].reverse()),r);
 }
});
test('M80 synthetic decisions are counted without disclosing notes or evidence refs',()=>{
 const data=all();
 for(const c of data[0].records[0].checks)Object.assign(c,{decision:'pass',reviewerRef:'fixture-reviewer',evidenceRef:'fixture-evidence',note:'Synthetic confidential note'});
 Object.assign(data[2].records[0].checks[0],{decision:'reject',reviewerRef:'fixture-reviewer',evidenceRef:'fixture-evidence',note:'Synthetic confidential note'});
 const r=summarizeBoardReviewBatches(data);
 assert.equal(r.valid,true);assert.equal(r.decidedChecks,6);assert.equal(r.pendingChecks,174);
 assert.equal(r.readyForIndependentAudit,1);assert.equal(r.needsRevision,1);
 assert.equal(r.verifiedChapters,0);assert.equal(r.publicReleaseApproved,false);
 assert.doesNotMatch(JSON.stringify(r),/fixture-reviewer|fixture-evidence|confidential note/);
});
test('M80 fails closed on duplicates, missing records, stale hashes and approval claims',()=>{
 const data=all();
 assert.equal(summarizeBoardReviewBatches([data[0],data[0]]).valid,false);
 assert.equal(summarizeBoardReviewBatches(null).valid,false);
 for(const mutate of [x=>x.batchId='unknown',x=>x.records.pop(),x=>x.snapshotSha256='0'.repeat(64),x=>x.humanApprovalAuthenticated=true,x=>x.publicReleaseApproved=true]){
  const b=makeBoardReviewBatch('cbse-001');mutate(b);
  const r=summarizeBoardReviewBatches([b]);assert.equal(r.valid,false);assert.equal(r.publicReleaseApproved,false);
 }
});
