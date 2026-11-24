import test from 'node:test';
import assert from 'node:assert/strict';
import {PHYSICAL_SCENARIOS,makePhysicalWorksheet,checkPhysicalWorksheet} from '../tools/physical-validation-handoff.mjs';
const commit='a'.repeat(40),base=makePhysicalWorksheet(commit);
test('M59 twelve real-device scenarios start pending; no physical approval',()=>{
 const r=checkPhysicalWorksheet(base,commit);assert.equal(PHYSICAL_SCENARIOS.length,12);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.pendingScenarios,12);assert.equal(r.documentedForIndependentAudit,0);assert.equal(r.physicalEvidenceAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
});
test('M59 synthetic complete references are only structurally documented; failed/blocked require defects',()=>{
 const x=structuredClone(base);
 for(const s of x.scenarios)Object.assign(s,{result:'pass',operatorRef:'synthetic-operator',deviceRef:'synthetic-device',evidenceRef:'synthetic-evidence'});
 const r=checkPhysicalWorksheet(x,commit);assert.equal(r.valid,true);assert.equal(r.documentedForIndependentAudit,12);assert.equal(r.physicalEvidenceAuthenticated,false);
 x.scenarios[0].result='blocked';assert.equal(checkPhysicalWorksheet(x,commit).valid,false);
 x.scenarios[0].defectRef='synthetic-defect';assert.equal(checkPhysicalWorksheet(x,commit).failedScenarios,1);
});
test('M59 rejects stale, missing, duplicate, personal fields and fake approvals',()=>{
 for(const mutate of [x=>x.scenarios.pop(),x=>x.scenarios.push(x.scenarios[0]),x=>x.publicReleaseApproved=true,x=>x.physicalEvidenceAuthenticated=true,x=>x.scenarios[0].deviceRef='not-blank',x=>x.scenarios[0].studentName='synthetic',x=>x.scenarios[0].result='approved']){
  const x=structuredClone(base);mutate(x);assert.equal(checkPhysicalWorksheet(x,commit).valid,false)
 }
 assert.equal(checkPhysicalWorksheet(base,'b'.repeat(40)).valid,false);assert.throws(()=>makePhysicalWorksheet('latest'));
});
