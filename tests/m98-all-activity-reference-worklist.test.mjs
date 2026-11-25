import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {FIXTURE_IDS,modelFixture} from '../tools/main-model-fixture-worklist.mjs';
import {SUPPLEMENTAL_FIXTURE_KEYS,ACTIVITY_FIXTURE_KEYS,activityFixture,computedActivityFixture,makeActivityFixtureWorklist,validateActivityFixtureWorklist} from '../tools/all-activity-fixture-worklist.mjs';
import {labPackKeys,printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
import {advancedExtension,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
for(const key of SUPPLEMENTAL_FIXTURE_KEYS)test('M98 supplemental reference fixture '+key,()=>{
 const [id,mode]=key.split(':'),m=advancedExtension(id,mode),f=activityFixture(key),c=computedActivityFixture(key);
 assert.equal(f.id,key);assert.equal(f.cases.length,2);assert.deepEqual(f.cases[0].state,m.initial);
 assert.equal(Object.keys(m.initial).filter(k=>f.cases[0].state[k]!==f.cases[1].state[k]).length,1);
 for(const [i,r] of f.cases.entries()){
  assert.equal(r.referenceRef,'');assert.equal(r.reviewerRef,'');assert.equal(r.decision,'pending');assert.ok(!Object.hasOwn(r,'results')&&!Object.hasOwn(r,'explanation'));
  for(const [lang,field] of [['en','english'],['hi','hindi']])assert.deepEqual(c.cases[i][field].results,evaluateAdvancedExtension(id,mode,r.state,lang).rows);
 }
 const actual=['english','hindi'].map(l=>c.cases.map(x=>x[l])),en=printableAnyLabActivity(id,mode,'en'),hi=printableAnyLabActivity(id,mode,'hi');
 assert.equal(f.fixtureSha256,hash([key,f.cases.map(x=>x.state),actual,en.caveat,hi.caveat]));
 assert.equal(c.computedOutputsAreNotIndependentReferences,true);assert.equal(c.publicReleaseApproved,false);
});
for(const id of FIXTURE_IDS)test('M98 main-model operator reference compatibility '+id,()=>{
 const key=id+':main',f=activityFixture(key),c=computedActivityFixture(key),old=modelFixture(id);
 assert.deepEqual(f,{...old,id:key});assert.equal(c.fixtureSha256,old.fixtureSha256);
 assert.deepEqual(c.cases.map(x=>x.state),f.cases.map(x=>x.state));assert.equal(c.independentReferencesAuthenticated,false);
});
test('M98 exact combined inventory, pending cases, invalid or stale decisions fail closed',()=>{
 const d=makeActivityFixtureWorklist();assert.equal(ACTIVITY_FIXTURE_KEYS.length,109);assert.equal(SUPPLEMENTAL_FIXTURE_KEYS.length,49);
 assert.deepEqual([...ACTIVITY_FIXTURE_KEYS].sort(),labPackKeys().sort());
 const r=validateActivityFixtureWorklist(d);assert.equal(r.valid,true);assert.equal(r.pendingCases,218);assert.equal(r.readyForIndependentAudit,0);
 const submitted=structuredClone(d);for(const c of submitted.models.at(-1).cases)Object.assign(c,{decision:'match',reviewerRef:'mock-reviewer',referenceRef:'mock-reference'});
 const v=validateActivityFixtureWorklist(submitted);assert.equal(v.valid,true);assert.equal(v.documentedCases,2);assert.equal(v.readyForIndependentAudit,1);assert.equal(v.publicReleaseApproved,false);assert.doesNotMatch(JSON.stringify(v),/mock-reviewer|mock-reference/);
 for(const edit of [x=>x.models.pop(),x=>x.models[0]=x.models[1],x=>x.models.at(-1).cases[0].state={},x=>x.models.at(-1).cases[0].referenceRef='mock',x=>x.inventorySha256='0'.repeat(64),x=>x.independentReferencesAuthenticated=true]){const copy=structuredClone(d);edit(copy);assert.equal(validateActivityFixtureWorklist(copy).valid,false)}
 assert.throws(()=>computedActivityFixture('ratio-algebra:unknown'));
});
