import test from 'node:test';
import assert from 'node:assert/strict';
import {FIXTURE_IDS,modelFixture,makeFixtureWorklist,validateFixtureWorklist} from '../tools/main-model-fixture-worklist.mjs';
for(const id of FIXTURE_IDS)test('M97 independent reference handoff '+id,()=>{
 const f=modelFixture(id);assert.equal(f.id,id);assert.match(f.fixtureSha256,/^[a-f0-9]{64}$/);
 assert.equal(f.cases.length,2);const [a,b]=f.cases;
 assert.equal(Object.keys(a.state).filter(k=>a.state[k]!==b.state[k]).length,1);
 for(const c of f.cases){assert.ok(c.englishControls.length&&c.hindiControls.length);assert.equal(c.referenceRef,'');assert.equal(c.reviewerRef,'');assert.equal(c.decision,'pending');assert.equal(c.referenceStatus,'PENDING_INDEPENDENT_REFERENCE');assert.ok(!Object.hasOwn(c,'results')&&!Object.hasOwn(c,'explanation')&&!Object.hasOwn(c,'expectedAnswer'))}
 assert.deepEqual(modelFixture(id),f);
});
test('M97 exact inventory, pending references, stale and fabricated decisions rejected',()=>{
 const sheet=makeFixtureWorklist(),r=validateFixtureWorklist(sheet);assert.equal(FIXTURE_IDS.length,60);assert.equal(new Set(FIXTURE_IDS).size,60);assert.equal(r.valid,true);assert.equal(r.pendingCases,120);assert.equal(r.readyForIndependentAudit,0);
 const d=structuredClone(sheet);for(const c of d.models[0].cases)Object.assign(c,{decision:'match',referenceRef:'mock-ref',reviewerRef:'mock-reviewer'});
 const v=validateFixtureWorklist(d);assert.equal(v.valid,true);assert.equal(v.readyForIndependentAudit,1);assert.equal(v.independentReferencesAuthenticated,false);assert.equal(v.publicReleaseApproved,false);assert.doesNotMatch(JSON.stringify(v),/mock-ref|mock-reviewer/);
 for(const edit of [d=>d.models.pop(),d=>d.models[0]=d.models[1],d=>d.inventorySha256='0'.repeat(64),d=>d.models[0].cases[0].state={},d=>d.models[0].cases[0].referenceRef='mock',d=>d.models[0].cases[0].decision='match',d=>d.publicReleaseApproved=true]){const copy=structuredClone(sheet);edit(copy);assert.equal(validateFixtureWorklist(copy).valid,false)}
 assert.throws(()=>modelFixture('unknown'));
});
