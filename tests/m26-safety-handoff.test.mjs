import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
 SCHEMA,SAFETY_GATES,makeSafetyTemplate,validateSafetyHandoff,saveSafetyTemplate,checkSafetyFile
} from '../tools/safety-handoff.mjs';

test('M26 safeguarding template defines 6 distinct human-led gates, all pending',()=>{
 const data=makeSafetyTemplate();
 assert.equal(data.schema,SCHEMA);
 assert.equal(data.gates.length,6);
 assert.equal(new Set(data.gates.map(x=>x.id)).size,6);
 assert.equal(SAFETY_GATES.length,6);
 assert.ok(data.gates.every(g=>g.status==='pending'));
 const result=validateSafetyHandoff(data);
 assert.equal(result.schemaValid,true);
 assert.equal(result.documentedForHumanVerification,0);
 assert.equal(result.remainingWithoutEvidence,6);
 assert.equal(result.humanReviewAuthenticated,false);
 assert.equal(result.publicReleaseApproved,false);
});
test('M26 missing/duplicate/unknown gates and invented release approvals fail closed',()=>{
 const x=makeSafetyTemplate();
 x.gates.pop();assert.match(validateSafetyHandoff(x).errors.join(' '),/Missing required gate/);
 const y=makeSafetyTemplate();y.gates.push({...y.gates[0]});
 assert.match(validateSafetyHandoff(y).errors.join(' '),/duplicate gate/);
 const z=makeSafetyTemplate();z.gates[0].id='fake';
 assert.match(validateSafetyHandoff(z).errors.join(' '),/unknown gate id/);
 const forged=makeSafetyTemplate();forged.publicReleaseApproved=true;
 assert.match(validateSafetyHandoff(forged).errors.join(' '),/prohibited/);
});
test('M26 pending gate cannot masquerade as review; evidence fields must be meaningful',()=>{
 const x=makeSafetyTemplate();x.gates[0].ownerRef='lead-01';
 assert.match(validateSafetyHandoff(x).errors.join(' '),/pending record/);
 x.gates[0].status='evidence-attached';
 x.gates[0].reviewDate='2026-02-30';
 x.gates[0].evidenceRef='risk-1';
 x.gates[0].notes='Short';
 assert.match(validateSafetyHandoff(x).errors.join(' '),/invalid reviewDate/);
 assert.match(validateSafetyHandoff(x).errors.join(' '),/20–2000/);
});
test('M26 even complete-looking operator refs do not authenticate humans or authorize public launch',()=>{
 const data=makeSafetyTemplate();
 for(const g of data.gates){
  g.status='evidence-attached';g.ownerRef='internal-role-01';
  g.reviewDate='2026-11-23';g.evidenceRef='safe-evidence-01';
  g.notes='Draft evidence placeholder only, not independently authenticated or actual approval.';
 }
 const r=validateSafetyHandoff(data);
 assert.equal(r.schemaValid,true);
 assert.equal(r.documentedForHumanVerification,6);
 assert.equal(r.remainingWithoutEvidence,0);
 assert.equal(r.humanReviewAuthenticated,false);
 assert.equal(r.publicReleaseApproved,false);
});
test('M26 rejects email from notes and invalid opaque evidence reference',()=>{
 const x=makeSafetyTemplate();
 Object.assign(x.gates[0],{status:'evidence-attached',ownerRef:'ops-01',
  reviewDate:'2026-11-23',evidenceRef:'https://example.com/?secret=123',
  notes:'Please contact a.child@example.org regarding the sensitive information.'});
 const r=validateSafetyHandoff(x);
 assert.equal(r.schemaValid,false);
 assert.match(r.errors.join(' '),/internal opaque reference/);
 assert.match(r.errors.join(' '),/personal email/);
});
test('M26 local template check is read-only and cannot overwrite an existing handoff',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'aifs-safety-'));
 try{
  const file=path.join(dir,'safety.json');
  const report=saveSafetyTemplate(file);
  assert.equal(report.allPending,true);
  assert.equal(checkSafetyFile(file).schemaValid,true);
  const snapshot=readFileSync(file,'utf8');
  assert.throws(()=>saveSafetyTemplate(file),/Refusing to overwrite/);
  assert.equal(readFileSync(file,'utf8'),snapshot);
 }finally{rmSync(dir,{recursive:true,force:true})}
});
