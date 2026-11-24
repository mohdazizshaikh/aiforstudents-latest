import test from 'node:test';
import assert from 'node:assert/strict';
import {teacherRightsInventory,makeTeacherRightsWorksheet,validateTeacherRightsWorksheet,RIGHTS_CHECKS} from '../tools/teacher-rights-worklist.mjs';
import {printableAnyLabActivity,labPackKeys} from '../assets/teacher-cards-engine.js';
const inventory=teacherRightsInventory(),sheet=makeTeacherRightsWorksheet();
for(const r of inventory)test('M89 rights handoff '+r.key,()=>{
 const item=sheet.records.find(x=>x.key===r.key),[id,mode]=r.key.split(':');
 assert.ok(item);assert.equal(item.contentSha256,r.contentSha256);assert.deepEqual(item.criteria.map(x=>x.id),RIGHTS_CHECKS);
 assert.ok(item.criteria.every(x=>x.decision==='pending'&&x.reviewerRef===''&&x.evidenceRef===''&&x.reviewDate===''));
 assert.match(r.englishSha256,/^[a-f0-9]{64}$/);assert.match(r.hindiSha256,/^[a-f0-9]{64}$/);
 assert.notEqual(r.englishSha256,r.hindiSha256);assert.equal(r.sourceFile,printableAnyLabActivity(id,mode,'en').sourceFile);
 assert.equal(r.rightsAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
});
test('M89 complete 109 distinct rights work items and 327 pending decisions',()=>{
 assert.equal(inventory.length,109);assert.deepEqual(inventory.map(x=>x.key).sort(),labPackKeys().sort());
 assert.equal(new Set(inventory.map(x=>x.contentSha256)).size,109);
 assert.deepEqual(teacherRightsInventory(),inventory);
 const r=validateTeacherRightsWorksheet(sheet);assert.equal(r.valid,true);assert.equal(r.pendingCriteria,327);assert.equal(r.readyForIndependentAudit,0);
});
test('M89 synthetic decisions structurally reconcile without human approval or reference leakage',()=>{
 const d=structuredClone(sheet);
 for(const c of d.records[0].criteria)Object.assign(c,{decision:'pass',reviewerRef:'mock-rights',evidenceRef:'mock-evidence',reviewDate:'2026-11-25'});
 Object.assign(d.records[1].criteria[0],{decision:'revise',reviewerRef:'mock-rights',evidenceRef:'mock-evidence',reviewDate:'2026-11-25'});
 const r=validateTeacherRightsWorksheet(d);assert.equal(r.valid,true);assert.equal(r.decidedCriteria,4);assert.equal(r.pendingCriteria,323);assert.equal(r.readyForIndependentAudit,1);assert.equal(r.needsRevision,1);assert.equal(r.rightsAuthenticated,false);assert.equal(r.publicReleaseApproved,false);assert.doesNotMatch(JSON.stringify(r),/mock-evidence|mock-rights/);
});
test('M89 stale duplicate omitted malformed or approval-claiming submissions fail closed',()=>{
 const edits=[d=>d.records.pop(),d=>d.records[0]=d.records[1],d=>d.records[0].contentSha256='0'.repeat(64),d=>d.inventorySha256='0'.repeat(64),d=>d.publicReleaseApproved=true,d=>d.rightsAuthenticated=true,d=>d.records[0].criteria[0].reviewerRef='mock',d=>d.records[0].criteria[0].decision='not-applicable',d=>d.records[0].criteria[0].id='redistribution',d=>d.records[0].criteria[0].studentId='mock',d=>Object.assign(d.records[0].criteria[0],{decision:'pass',reviewerRef:123,evidenceRef:'mock-ref',reviewDate:'2026-11-25'})];
 for(const edit of edits){const d=structuredClone(sheet);edit(d);const r=validateTeacherRightsWorksheet(d);assert.equal(r.valid,false);assert.equal(r.readyForIndependentAudit,0);assert.equal(r.publicReleaseApproved,false)}
});
