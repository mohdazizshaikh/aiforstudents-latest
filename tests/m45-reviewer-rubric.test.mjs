import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {RUBRIC,makeRubricWorklist,validateRubricWorklist} from '../tools/reviewer-rubric.mjs';
const rows=buildReviewRows(),base=makeRubricWorklist(rows),check=x=>validateRubricWorklist(x,rows);
test('M45 six draft review criteria on every pilot and full-inventory record, all pending',()=>{
 assert.equal(RUBRIC.length,6);assert.equal(base.records.length,60);
 const r=check(base);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.criteriaChecked,360);assert.equal(r.readyForIndependentAudit,0);
 const all=makeRubricWorklist(rows,'all');assert.equal(all.records.length,3324);assert.equal(validateRubricWorklist(all,rows).criteriaChecked,19944);
 assert.equal(r.rubricApproved,false);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
});
test('M45 structurally filled synthetic evidence can only become audit-ready, never approved',()=>{
 const x=structuredClone(base);
 for(const v of x.records[0].criteria)Object.assign(v,{decision:'pass',reviewerRef:'synthetic-'+v.role,reviewDate:'2026-11-24',evidenceRef:'test-only-'+v.id,rationale:'Synthetic structural test only.'});
 const r=check(x);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.readyForIndependentAudit,1);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
 x.records[0].criteria[0].decision='revise';const revised=check(x);assert.equal(revised.valid,true);assert.equal(revised.readyForIndependentAudit,0);assert.equal(revised.needsRevision,1);
});
test('M45 stale, duplicate, fabricated approval, invalid dates, waived required criteria and same reviewer rejected',()=>{
 for(const mutate of [x=>x.records.pop(),x=>x.records.push(x.records[0]),x=>x.publicReleaseApproved=true,x=>x.rubricApproved=true,x=>x.records[0].content_sha256='0'.repeat(64),x=>x.records[0].criteria.pop(),x=>x.records[0].criteria[0].reviewerRef='not-blank',x=>x.records[0].criteria[0].decision='approve']){
  const x=structuredClone(base);mutate(x);assert.equal(check(x).valid,false);
 }
 const x=structuredClone(base);for(const v of x.records[0].criteria)Object.assign(v,{decision:'pass',reviewerRef:'same-person',reviewDate:'2026-11-24',evidenceRef:'test-only',rationale:'Synthetic structural test only.'});
 assert.equal(check(x).valid,false);
 x.records[0].criteria[1].reviewerRef='other-person';assert.equal(check(x).valid,true);
 x.records[0].criteria[0].decision='not-applicable';assert.equal(check(x).valid,false);
 x.records[0].criteria[0].decision='pass';x.records[0].criteria[0].reviewDate='2026-02-30';assert.equal(check(x).valid,false);
});
