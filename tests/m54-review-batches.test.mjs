import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {planReviewBatches,reviewBatchIndex,makeReviewBatch,validateReviewBatch} from '../tools/review-batches.mjs';
const rows=buildReviewRows(),p=planReviewBatches(rows);
test('M54 partitions all 3340 records exactly once into 34 balanced 50–100-record batches, pilot first',()=>{
 assert.equal(p.totalRecords,3340);assert.equal(p.pilotRecords,76);assert.equal(p.batches.length,34);
 assert.equal(p.batches[0].id,'pilot-001');assert.equal(p.batches[0].count,76);
 assert.ok(p.batches.every(b=>b.count>=50&&b.count<=100));
 assert.equal(p.batches.reduce((n,b)=>n+b.criteriaCount,0),20040);
 const key=r=>r.queue+'|'+r.content_id,all=p.batches.flatMap(b=>b.members.map(key));
 assert.equal(new Set(all).size,3340);assert.deepEqual([...all].sort(),rows.map(key).sort());
 assert.deepEqual(reviewBatchIndex([...rows].reverse()),reviewBatchIndex(rows));
 assert.equal(p.publicReleaseApproved,false);
});
test('M54 every batch rubric validates pending only; structural evidence cannot approve content',()=>{
 for(const b of p.batches){const r=validateReviewBatch(makeReviewBatch(b.id,rows),rows);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.readyForIndependentAudit,0);assert.equal(r.batchRecordCount,b.count)}
 const x=makeReviewBatch('pilot-001',rows);
 for(const v of x.rubric.records[0].criteria)Object.assign(v,{decision:'pass',reviewerRef:'synthetic-'+v.role,reviewDate:'2026-11-24',evidenceRef:'test-only-'+v.id,rationale:'Synthetic structural test only.'});
 const r=validateReviewBatch(x,rows);assert.equal(r.valid,true);assert.equal(r.readyForIndependentAudit,1);assert.equal(r.publicReleaseApproved,false);assert.equal(r.humanApprovalAuthenticated,false);
});
test('M54 rejects missing, duplicated, moved or stale records and approving fields',()=>{
 for(const mutate of [x=>x.batchId='standard-001',x=>x.batchSha256='0'.repeat(64),x=>x.publicReleaseApproved=true,x=>x.rubric.records.pop(),x=>x.rubric.records.push(x.rubric.records[0]),x=>x.rubric.scope='pilot-first']){
  const x=makeReviewBatch('pilot-001',rows);mutate(x);assert.equal(validateReviewBatch(x,rows).valid,false);
 }
 const x=makeReviewBatch('pilot-001',rows),changed=rows.map((r,i)=>i===0?{...r,content_sha256:'a'.repeat(64)}:r);
 assert.equal(validateReviewBatch(x,changed).valid,false);assert.throws(()=>planReviewBatches([...rows,rows[0]]));assert.throws(()=>makeReviewBatch('unknown',rows));
});
