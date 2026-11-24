import test from 'node:test';
import assert from 'node:assert/strict';
import {readSecondaryCandidates,bindSecondaryCandidates} from '../tools/cbse-secondary-candidates.mjs';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const data=readSecondaryCandidates(),rows=buildReviewRows();
test('M51 eleven class IX/X candidates bind current canonical content; shared concept may occur in both grades',()=>{
 const r=bindSecondaryCandidates(data,rows);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.proposals.length,11);
 assert.deepEqual(r.proposals.filter(x=>x.modelId==='advanced:arithmetic-sequence').map(x=>x.grade),[9,10]);
 for(const p of r.proposals){assert.equal(p.reviewRef.sha256,rows.find(x=>x.queue==='advanced'&&x.content_id===p.modelId).content_sha256);assert.equal(p.status,'PROPOSED_UNVERIFIED');assert.match(p.sourceUrl,/^https:\/\/cbseacademic\.nic\.in\//)}
 assert.equal(r.verifiedChapters,0);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
});
test('M51 rejects approving, unsupported, duplicate, wrong-course and out-of-bounds source proposals',()=>{
 for(const mutate of [x=>x.publicReleaseApproved=true,x=>x.proposals[0].status='APPROVED',x=>x.proposals[0].pdfPage=99,x=>x.proposals.push(x.proposals[0]),x=>x.proposals[0].sourceId='9-science',x=>x.proposals[0].modelId='advanced:fake',x=>x.sources['9-maths'].url='https://example.org/fake.pdf']){
  const x=structuredClone(data);mutate(x);assert.equal(bindSecondaryCandidates(x,rows).valid,false)
 }
 assert.equal(bindSecondaryCandidates(data,rows.filter(x=>x.content_id!=='advanced:coordinate')).valid,false);
});
