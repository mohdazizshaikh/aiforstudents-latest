import test from 'node:test';
import assert from 'node:assert/strict';
import {makeMappingWorksheet,validateMappingWorksheet,combinedMappingCandidates} from '../tools/cbse-mapping-review.mjs';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {readCbseCandidates} from '../tools/cbse-syllabus-candidates.mjs';
import {readSecondaryCandidates} from '../tools/cbse-secondary-candidates.mjs';
const rows=buildReviewRows(),senior=readCbseCandidates(),secondary=readSecondaryCandidates(),base=makeMappingWorksheet(rows,senior,secondary);
const check=x=>validateMappingWorksheet(x,rows,senior,secondary);
test('M52 combined 22 proposals, 110 pending checks and zero verified chapters',()=>{
 assert.equal(base.records.length,22);assert.equal(base.records.reduce((n,x)=>n+x.checks.length,0),110);
 assert.equal(new Set(base.records.map(x=>x.mappingId)).size,22);
 const r=check(base);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.readyForIndependentAudit,0);assert.equal(r.verifiedChapters,0);
 assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
 assert.ok(combinedMappingCandidates(rows,senior,secondary).every(p=>/^[a-f0-9]{64}$/.test(p.mappingSha256)));
});
test('M52 structural synthetic evidence never approves a chapter',()=>{
 const x=structuredClone(base);
 for(const v of x.records[0].checks)Object.assign(v,{decision:'pass',reviewerRef:'synthetic-reviewer',evidenceRef:'synthetic-evidence',note:'Synthetic test only, not an approval.'});
 const r=check(x);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.readyForIndependentAudit,1);assert.equal(r.verifiedChapters,0);
 x.records[0].checks[0].decision='revise';const rr=check(x);assert.equal(rr.valid,true);assert.equal(rr.readyForIndependentAudit,0);assert.equal(rr.needsRevision,1);
});
test('M52 fail closed on stale content or source anchors, missing and duplicate rows, fake approval and malformed review',()=>{
 for(const mutate of [x=>x.records.pop(),x=>x.records.push(x.records[0]),x=>x.humanApprovalAuthenticated=true,x=>x.records[0].mapping.pdfPage++,x=>x.records[0].mappingSha256='0'.repeat(64),x=>x.records[0].checks[0].reviewerRef='not-blank',x=>x.records[0].checks[0].decision='approved',x=>x.records[0].checks.pop()]){
  const x=structuredClone(base);mutate(x);assert.equal(check(x).valid,false)
 }
 const id=base.records[0].mapping.modelId;
 const changed=rows.map(r=>r.content_id===id?{...r,content_sha256:'a'.repeat(64)}:r);
 assert.equal(validateMappingWorksheet(base,changed,senior,secondary).valid,false);
 const changedSource=structuredClone(senior);changedSource.proposals[0].pdfPage++;
 assert.equal(validateMappingWorksheet(base,rows,changedSource,secondary).valid,false);
});
