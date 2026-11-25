import test from 'node:test';import assert from 'node:assert/strict';
import {PROTOTYPE_KEYS} from '../assets/extended-lab-catalog.js';
import {prototypeReviewInventory,makePrototypeReviewWorklist,validatePrototypeReviewWorklist,computedPrototypeReference,REVIEW_CRITERIA} from '../tools/prototype-review-worklist.mjs';
import {FORBIDDEN_PUBLIC_PATHS} from '../tools/check-live-staging.mjs';
const reviewed={decision:'pass',reviewerRef:'fixture-reviewer',evidenceRef:'fixture-reference',reviewDate:'2026-01-01'};
test('16 exact source-bound draft models, 128 review criteria and 32 blinded reference cases',()=>{
 const i=prototypeReviewInventory(),w=makePrototypeReviewWorklist(),r=validatePrototypeReviewWorklist(w);
 assert.deepEqual(i.map(x=>x.key),PROTOTYPE_KEYS);assert.equal(i.length,16);assert.equal(REVIEW_CRITERIA.length,8);
 assert.equal(new Set(i.map(x=>x.contentSha256)).size,16);
 for(const m of i){assert.equal(m.officialChapter,null);assert.equal(m.publicReleaseApproved,false);assert.match(m.contentSha256,/^[a-f0-9]{64}$/);assert.equal(m.sources.length,9);for(const s of m.sources)assert.match(s.sha256,/^[a-f0-9]{64}$/)}
 assert.equal(r.valid,true);assert.equal(r.pendingCriteria,128);assert.equal(r.pendingCases,32);assert.equal(r.readyForIndependentAudit,0);
 assert.doesNotMatch(JSON.stringify(w),/"english"|"hindi"|"outputs"|"worksheets"|"answer"/);
 assert.deepEqual(w,makePrototypeReviewWorklist());
});
test('All 32 reference cases have separate computed outputs, not independent answers',()=>{
 for(const key of PROTOTYPE_KEYS){
 const r=computedPrototypeReference(key);assert.equal(r.computedOutputsAreNotIndependentReferences,true);assert.equal(r.independentReferencesAuthenticated,false);assert.equal(r.cases.length,2);assert.equal(r.worksheets.length,2);
 assert.equal(r.contentSha256,prototypeReviewInventory().find(x=>x.key===key).contentSha256);
 const [a,b]=r.cases;assert.equal(Object.keys(a.state).filter(k=>a.state[k]!==b.state[k]).length,1);
 for(const c of r.cases){assert.deepEqual(c.english.rows.map(x=>x.value),c.hindi.rows.map(x=>x.value).map((v,i)=>typeof c.english.rows[i].value==='number'?v:c.english.rows[i].value));assert.equal(c.english.publicReleaseApproved,false);assert.equal(c.hindi.publicReleaseApproved,false)}
 }
 assert.throws(()=>computedPrototypeReference('unknown'));
});
test('Submitted positive decisions are only ready for independent audit, never authenticated',()=>{
 const w=makePrototypeReviewWorklist();for(const r of w.records)for(const c of [...r.criteria,...r.cases])Object.assign(c,reviewed);
 const s=validatePrototypeReviewWorklist(w);assert.equal(s.valid,true);assert.equal(s.readyForIndependentAudit,16);assert.equal(s.criteriaDecided,128);assert.equal(s.casesDecided,32);
 for(const k of ['humanApprovalAuthenticated','rightsAuthenticated','independentReferencesAuthenticated','publicReleaseApproved'])assert.equal(s[k],false);
 w.records[0].cases[0].decision='revise';const t=validatePrototypeReviewWorklist(w);assert.equal(t.readyForIndependentAudit,15);assert.equal(t.needsRevision,1);
});
test('Reject stale, tampered, duplicate, malformed, personal free-text and caller approval submissions',()=>{
 const mutations=[w=>w.inventorySha256='0'.repeat(64),w=>w.records[0].contentSha256='0'.repeat(64),w=>w.records[1]=w.records[0],w=>w.records[0].criteria[1]=w.records[0].criteria[0],w=>w.records[0].cases[0].state.extra=1,w=>w.publicReleaseApproved=true,w=>w.records[0].criteria[0].reviewerRef='some name',w=>Object.assign(w.records[0].criteria[0],{...reviewed,reviewDate:'2026-02-31'}),w=>w.records[0].cases[0].student='x',w=>w.records.pop()];
 for(const change of mutations){const w=makePrototypeReviewWorklist();change(w);const r=validatePrototypeReviewWorklist(w);assert.equal(r.valid,false);assert.equal(r.publicReleaseApproved,false)}
});
test('Review workbench and evidence forbidden on hosted static site',()=>{
 for(const p of ['/tools/prototype-review-worklist.mjs','/review-evidence/m124-ci-prototypes.json'])assert.ok(FORBIDDEN_PUBLIC_PATHS.includes(p));
});
