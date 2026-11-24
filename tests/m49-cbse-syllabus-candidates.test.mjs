import test from 'node:test';
import assert from 'node:assert/strict';
import {readCbseCandidates,bindCbseCandidates} from '../tools/cbse-syllabus-candidates.mjs';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const data=readCbseCandidates(),rows=buildReviewRows();
test('M49 eleven source-linked CBSE 2026–27 proposals resolve current canonical fingerprints, not approved chapters',()=>{
 const r=bindCbseCandidates(data,rows);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.proposals.length,11);
 for(const p of r.proposals){assert.match(p.sourceUrl,/^https:\/\/cbseacademic\.nic\.in\//);assert.equal(p.reviewRef.sha256,rows.find(x=>x.queue==='advanced'&&x.content_id===p.modelId).content_sha256);assert.equal(p.status,'PROPOSED_UNVERIFIED')}
 for(const key of ['textbookEditionVerified','rightsPermissionAuthenticated','humanApprovalAuthenticated','publicReleaseApproved'])assert.equal(r[key],false);assert.equal(r.verifiedChapters,0);
 assert.equal(r.proposals.find(p=>p.modelId==='advanced:alkane-count').grade,11);assert.equal(r.proposals.find(p=>p.modelId==='advanced:dynamic-balance').grade,11);assert.equal(r.proposals.find(p=>p.modelId==='advanced:vector-components').grade,12);
});
test('M49 rejects invented model, wrong subject, duplicate, approval, unknown source and missing fingerprint',()=>{
 for(const mutate of [x=>x.proposals[0].modelId='advanced:fake',x=>x.proposals[0].subject='biology',x=>x.proposals.push(x.proposals[0]),x=>x.humanApprovalAuthenticated=true,x=>x.proposals[0].status='APPROVED',x=>x.sources.maths.url='https://example.org/fake.pdf',x=>x.proposals[0].pdfPage=0]){
  const x=structuredClone(data);mutate(x);assert.equal(bindCbseCandidates(x,rows).valid,false)
 }
 assert.equal(bindCbseCandidates(data,rows.filter(x=>x.content_id!=='advanced:integral-area')).valid,false);
});
