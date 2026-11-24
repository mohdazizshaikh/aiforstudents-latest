import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {reviewBatchIndex,makeReviewBatch} from '../tools/review-batches.mjs';
import {summarizeEducationalReviewBatches} from '../tools/educational-review-progress.mjs';
const rows=buildReviewRows(),index=reviewBatchIndex(rows);
const batch=id=>makeReviewBatch(id,rows);
const summarize=inputs=>summarizeEducationalReviewBatches(inputs,rows);
test('M81 all 3340 records and 20040 criteria are reconciled across 34 batches',()=>{
 const empty=summarize([]);
 assert.equal(empty.totalRecords,3340);assert.equal(empty.totalCriteria,20040);assert.equal(empty.totalBatches,34);
 assert.equal(empty.unsubmittedCriteria,20040);assert.equal(empty.pendingCriteria,0);
 assert.equal(empty.byPhase.pilot.totalRecords,76);assert.equal(empty.byPhase.standard.totalRecords,3264);
 assert.ok(empty.batches.every(b=>b.pendingCriteria===null));
 const all=index.batches.map(b=>batch(b.id));
 for(const selected of [all.slice(0,1),all.slice(1,8),all]){
  const r=summarize(selected);
  assert.equal(r.valid,true);assert.equal(r.submittedRecords+r.unsubmittedRecords,3340);
  assert.equal(r.submittedCriteria+r.unsubmittedCriteria,20040);
  assert.equal(r.pendingCriteria,r.submittedCriteria);assert.equal(r.decidedCriteria,0);
  assert.equal(r.allBatchesSubmitted,selected.length===34);
  assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
 }
 assert.deepEqual(summarize([all[0],all[2]]),summarize([all[2],all[0]]));
});
test('M81 synthetic decisions and revisions remain private and unapproved',()=>{
 const b=batch('pilot-001');
 for(const c of b.rubric.records[0].criteria)Object.assign(c,{decision:'pass',reviewerRef:'fixture-'+c.role,reviewDate:'2026-11-24',evidenceRef:'fixture-evidence',rationale:'Synthetic private rationale only.'});
 Object.assign(b.rubric.records[1].criteria[0],{decision:'revise',reviewerRef:'fixture-subject',reviewDate:'2026-11-24',evidenceRef:'fixture-evidence',rationale:'Synthetic private revision case.'});
 const r=summarize([b]);
 assert.equal(r.valid,true);assert.equal(r.pendingCriteria,449);assert.equal(r.decidedCriteria,7);
 assert.equal(r.readyForIndependentAudit,1);assert.equal(r.needsRevision,1);
 assert.equal(r.rubricApproved,false);assert.equal(r.humanApprovalAuthenticated,false);
 assert.doesNotMatch(JSON.stringify(r),/fixture-|private rationale|private revision/);
});
test('M81 fails closed on invalid batches and non-string reviewer/evidence references',()=>{
 const b=batch('pilot-001');
 assert.equal(summarize([b,b]).valid,false);assert.equal(summarize(null).valid,false);
 for(const mutate of [
  x=>x.snapshotSha256='0'.repeat(64),x=>x.rubric.records.pop(),x=>x.publicReleaseApproved=true,x=>x.batchId='unknown',
  x=>x.rubric.rubricApproved=true,
  x=>Object.assign(x.rubric.records[0].criteria[0],{decision:'pass',reviewerRef:12345,reviewDate:'2026-11-24',evidenceRef:'fixture-evidence',rationale:'Synthetic invalid reference.'}),
  x=>Object.assign(x.rubric.records[0].criteria[0],{decision:'pass',reviewerRef:'fixture-subject',reviewDate:'2026-11-24',evidenceRef:['fixture-evidence'],rationale:'Synthetic invalid reference.'})
 ]){
  const data=batch('pilot-001');mutate(data);const r=summarize([data]);assert.equal(r.valid,false);assert.equal(r.publicReleaseApproved,false);
 }
});
