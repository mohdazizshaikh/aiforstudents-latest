import test from 'node:test';
import assert from 'node:assert/strict';
import {readMaharashtraCandidates,bindMaharashtraCandidates} from '../tools/maharashtra-candidates.mjs';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const base=readMaharashtraCandidates(),rows=buildReviewRows(),check=x=>bindMaharashtraCandidates(x,rows);
test('M61 ten source-linked Maharashtra VI proposals bind to canonical content, never approve chapters',()=>{
 const r=check(base);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.proposals.length,10);assert.equal(r.proposals.filter(p=>p.sourceId==='maths').length,2);
 assert.equal(r.proposals.filter(p=>p.sourceId==='science').length,8);assert.equal(r.verifiedChapters,0);assert.equal(r.currentSessionApplicabilityVerified,false);
 assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.rightsPermissionAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
 assert.ok(r.proposals.every(p=>/^[a-f0-9]{64}$/.test(p.reviewRef.sha256)));
});
test('M61 rejects changed source edition, unsupported anchors, wrong subject, duplicated or unbound records, fabricated approvals',()=>{
 for(const mutate of [x=>x.sources.maths.reprint=2026,x=>x.sources.science.inspection='PDF_TEXT_AND_SCREENSHOT',x=>x.currentSessionApplicabilityVerified=true,x=>x.rightsPermissionAuthenticated=true,x=>x.proposals[0].anchor='06.71.99',x=>x.proposals[0].subject='physics',x=>x.proposals.push(x.proposals[0]),x=>x.proposals[0].status='VERIFIED']){
  const x=structuredClone(base);mutate(x);assert.equal(check(x).valid,false)
 }
 assert.equal(bindMaharashtraCandidates(base,rows.filter(r=>r.content_id!==base.proposals[0].modelId)).valid,false);
});
