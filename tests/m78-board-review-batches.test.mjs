import test from 'node:test';
import assert from 'node:assert/strict';
import {boardReviewBatchIndex,makeBoardReviewBatch,validateBoardReviewBatch} from '../tools/board-review-batches.mjs';
import {makeBoardReviewWorksheet} from '../tools/multiboard-mapping-review.mjs';
test('M78 exact inventory partitions 180 checks in three whole-mapping batches',()=>{
 const i=boardReviewBatchIndex(),w=makeBoardReviewWorksheet();
 assert.equal(i.mappings,32);assert.equal(i.checks,180);
 assert.deepEqual(i.batches.map(b=>[b.id,b.mappings,b.checks]),[['cbse-001',11,55],['cbse-002',11,55],['maharashtra-001',10,70]]);
 const ids=i.batches.flatMap(b=>b.mappingIds);
 assert.equal(new Set(ids).size,32);assert.deepEqual(ids.sort(),w.records.map(r=>r.mappingId).sort());
 assert.deepEqual(boardReviewBatchIndex(),i);
 for(const b of i.batches){
  const data=makeBoardReviewBatch(b.id),r=validateBoardReviewBatch(data);
  assert.equal(r.valid,true);assert.equal(r.pending,b.checks);assert.equal(r.readyForIndependentAudit,0);
  assert.equal(r.verifiedChapters,0);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
  assert.ok(data.records.every(r=>r.mapping.board===b.board));
 }
});
test('M78 rejects stale, duplicate, incomplete, foreign, altered and approving data',()=>{
 const fresh=()=>makeBoardReviewBatch('cbse-001');
 const mutations=[
  x=>x.snapshotSha256='0'.repeat(64),x=>x.batchSha256='0'.repeat(64),
  x=>x.records.pop(),x=>x.records.push(x.records[0]),
  x=>x.records[0]=makeBoardReviewBatch('maharashtra-001').records[0],
  x=>x.records[0].mappingSha256='0'.repeat(64),
  x=>x.records[0].checks.pop(),x=>x.records[0].checks[0].decision='pass',
  x=>x.records[0].checks[0].note='Unexpected pending evidence',
  x=>x.publicReleaseApproved=true,x=>x.humanApprovalAuthenticated=true,x=>x.verifiedChapters=1,
  x=>x.extra=true
 ];
 for(const mutate of mutations){const x=fresh();mutate(x);assert.equal(validateBoardReviewBatch(x).valid,false);}
 assert.throws(()=>makeBoardReviewBatch('unknown'));
});
test('M78 counts structurally complete synthetic evidence without approving it',()=>{
 const data=makeBoardReviewBatch('cbse-001');
 for(const c of data.records[0].checks)Object.assign(c,{decision:'pass',reviewerRef:'fixture-reviewer',evidenceRef:'fixture-evidence',note:'Synthetic test evidence only'});
 Object.assign(data.records[1].checks[0],{decision:'revise',reviewerRef:'fixture-reviewer',evidenceRef:'fixture-evidence',note:'Synthetic revision case'});
 const r=validateBoardReviewBatch(data);
 assert.equal(r.valid,true);assert.equal(r.pending,49);assert.equal(r.readyForIndependentAudit,1);assert.equal(r.needsRevision,1);
 assert.equal(r.verifiedChapters,0);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
});
