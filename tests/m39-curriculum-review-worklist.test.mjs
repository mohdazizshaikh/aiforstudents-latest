import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeCurriculumWorklist,validateCurriculumWorklist} from '../tools/curriculum-review-worklist.mjs';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const catalog=JSON.parse(readFileSync(new URL('../docs/M36_DRAFT_CURRICULUM_DISCOVERY.json',import.meta.url),'utf8'));
const rows=buildReviewRows(),base=makeCurriculumWorklist(catalog,rows);
const check=x=>validateCurriculumWorklist(x,catalog,rows);
test('M39 48 unverified class/subject slots resolve all 36 models to 38 exact canonical review records',()=>{
 const r=check(base);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.slots,48);
 assert.equal(r.uniqueModels,36);assert.equal(r.uniqueReviewRecords,38);assert.ok(r.gaps>0);
 assert.equal(r.proposedCandidates,0);assert.equal(r.verifiedChapters,0);assert.equal(r.publicReleaseApproved,false);
 for(const s of base.slots)for(const m of s.models)for(const ref of m.reviewRefs){
  const row=rows.find(r=>r.queue===ref.queue&&r.content_id===ref.id);
  assert.ok(row);assert.equal(ref.sha256,row.content_sha256);assert.equal(ref.version,row.content_version);
 }
});
test('M39 candidate proposals never grant human or chapter approval',()=>{
 const data=structuredClone(base),s=data.slots[0];
 s.candidateStatus='PROPOSED_UNVERIFIED';
 s.candidate={board:'SYNTHETIC TEST ONLY',bookTitle:'Example',edition:'Example edition',chapterId:'example-chapter',outcomeRef:'example-outcome',sourceUrl:'https://example.org/example-chapter',rightsEvidenceRef:'test-only'};
 const r=check(data);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.proposedCandidates,1);
 assert.equal(r.verifiedChapters,0);assert.equal(r.humanApprovalAuthenticated,false);
 for(const url of ['http://example.org/chapter','https://name:password@example.org/chapter','https://example.org/chapter?private=secret','https://localhost/chapter','https://example.org/']){
  const x=structuredClone(data);x.slots[0].candidate.sourceUrl=url;assert.equal(check(x).valid,false);
 }
});
test('M39 fails closed on missing slots, altered hashes, changed draft source, and fabricated signoffs',()=>{
 for(const mutate of [x=>x.slots.pop(),x=>x.slots.push(x.slots[0]),x=>x.curriculumVerified=true,x=>x.publicReleaseApproved=true,x=>x.slots[0].candidateStatus='APPROVED',x=>x.slots[0].candidate.board='not blank',x=>x.slots.find(s=>s.models.length).models[0].reviewRefs[0].sha256='0'.repeat(64)]){
  const x=structuredClone(base);mutate(x);assert.equal(check(x).valid,false);
 }
 const first=base.slots.find(s=>s.models.length).models[0].reviewRefs[0];
 const changed=rows.map(r=>r.queue===first.queue&&r.content_id===first.id?{...r,content_sha256:'a'.repeat(64)}:r);
 assert.equal(validateCurriculumWorklist(base,catalog,changed).valid,false);
 assert.throws(()=>makeCurriculumWorklist(catalog,rows.filter(r=>!(r.queue===first.queue&&r.content_id===first.id))),/Missing/);
});
