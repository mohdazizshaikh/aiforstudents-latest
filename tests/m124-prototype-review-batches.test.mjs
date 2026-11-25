import test from 'node:test';import assert from 'node:assert/strict';
import {makeSubjectReviewBatch,validateSubjectReviewBatch,reconcileSubjectReviewBatches,REVIEW_SUBJECTS} from '../tools/prototype-review-batches.mjs';
import {makePrototypeReviewWorklist} from '../tools/prototype-review-worklist.mjs';
const complete={decision:'pass',reviewerRef:'fixture-reviewer',evidenceRef:'fixture-reference',reviewDate:'2026-01-01'};
test('Four subject batches partition exact inventory without changing historical scope',()=>{
 const batches=REVIEW_SUBJECTS.map(makeSubjectReviewBatch),all=batches.flatMap(b=>b.records.map(x=>x.key)),full=makePrototypeReviewWorklist();
 assert.equal(all.length,16);assert.equal(new Set(all).size,16);assert.deepEqual(all.sort(),full.records.map(x=>x.key).sort());
 for(const b of batches)assert.equal(validateSubjectReviewBatch(b).valid,true);
 const r=reconcileSubjectReviewBatches(batches);assert.equal(r.valid,true);assert.equal(r.allSubjectsSubmitted,true);assert.equal(r.pendingCriteria,128);assert.equal(r.pendingCases,32);assert.equal(r.publicReleaseApproved,false);
});
test('Partial subject submissions keep missing models pending; positive labels never authorize release',()=>{
 const b=makeSubjectReviewBatch('physics');for(const r of b.records)for(const c of [...r.criteria,...r.cases])Object.assign(c,complete);
 const r=reconcileSubjectReviewBatches([b]);assert.equal(r.valid,true);assert.equal(r.allSubjectsSubmitted,false);assert.deepEqual(r.missingSubjects,['maths','chemistry','biology']);
 assert.equal(r.readyForIndependentAudit,b.records.length);assert.equal(r.pendingCriteria,128-b.records.length*8);assert.equal(r.pendingCases,32-b.records.length*2);
 assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.rightsAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
});
test('Reject duplicate, stale, foreign, missing, malformed and asserted approval batches',()=>{
 const a=makeSubjectReviewBatch('maths'),b=makeSubjectReviewBatch('physics');
 assert.equal(reconcileSubjectReviewBatches([a,a]).valid,false);
 for(const change of [x=>x.batchSha256='0'.repeat(64),x=>x.inventorySha256='0'.repeat(64),x=>x.records[0]=b.records[0],x=>x.records.pop(),x=>x.records[0].cases[0].state.extra=1,x=>x.humanApprovalAuthenticated=true]){
 const x=structuredClone(a);change(x);assert.equal(validateSubjectReviewBatch(x).valid,false);assert.equal(reconcileSubjectReviewBatches([x]).valid,false)}
 assert.equal(reconcileSubjectReviewBatches([]).pendingCriteria,128);
});
