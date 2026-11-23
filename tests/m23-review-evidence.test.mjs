import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {
 EVIDENCE_SCHEMA,makeReviewTemplate,validateReviewEvidence,writeTemplate,checkFile
} from '../tools/review-evidence.mjs';

const exampleRow=Object.freeze({
 queue:'studio',content_id:'fraction:test',content_version:'1',
 content_sha256:'a'.repeat(64),priority:'pilot-first'
});
const review=(ref)=>({decision:'pass',reviewerRef:ref,reviewDate:'2026-11-23',rationale:'Checked against source and learner explanation.'});
test('M23 pilots start with exactly 21 review records; no human approvals',()=>{
 const rows=buildReviewRows();
 assert.equal(rows.length,3285);
 const data=makeReviewTemplate(rows);
 assert.equal(data.schema,EVIDENCE_SCHEMA);
 assert.equal(data.scope,'pilot-first');
 assert.equal(data.records.length,21);
 assert.deepEqual(Object.fromEntries(['studio','experiment','classroom','maths'].map(k=>[k,data.records.filter(x=>x.queue===k).length])),{studio:4,experiment:4,classroom:10,maths:3});
 const result=validateReviewEvidence(data,rows);
 assert.equal(result.schemaValid,true);
 assert.equal(result.recordsReadyForIndependentHumanAudit,0);
 assert.equal(result.publicReleaseApproved,false);
 assert.equal(result.humanApprovalAuthenticated,false);
 assert.ok(data.records.every(x=>x.subjectReview.decision==='pending'&&x.hindiReview.decision==='pending'));
});
test('M23 all-scope worklist can represent complete 3,285-record inventory',()=>{
 const rows=buildReviewRows();
 const data=makeReviewTemplate(rows,'all');
 assert.equal(data.records.length,3285);
 assert.equal(validateReviewEvidence(data,rows).expectedRecords,3285);
});
test('M23 stale fingerprints, stale versions, missing items and duplicates fail closed',()=>{
 const original=makeReviewTemplate([exampleRow]);
 const stale=structuredClone(original);stale.records[0].content_sha256='b'.repeat(64);
 assert.equal(validateReviewEvidence(stale,[exampleRow]).schemaValid,false);
 assert.match(validateReviewEvidence(stale,[exampleRow]).errors.join(' '),/stale or tampered/);
 const version=structuredClone(original);version.records[0].content_version='2';
 assert.match(validateReviewEvidence(version,[exampleRow]).errors.join(' '),/stale version/);
 const missing=structuredClone(original);missing.records=[];
 assert.match(validateReviewEvidence(missing,[exampleRow]).errors.join(' '),/Missing evidence record/);
 const repeated=structuredClone(original);repeated.records.push(structuredClone(repeated.records[0]));
 assert.match(validateReviewEvidence(repeated,[exampleRow]).errors.join(' '),/duplicate/);
});
test('M23 checks role independence, valid dates, rationale and release-approval fields',()=>{
 const rows=[exampleRow],data=makeReviewTemplate(rows);
 data.records[0].subjectReview=review('teacher-01');
 data.records[0].hindiReview=review('teacher-01');
 let r=validateReviewEvidence(data,rows);
 assert.equal(r.schemaValid,false);
 assert.match(r.errors.join(' '),/distinct reviewer/);
 data.records[0].hindiReview=review('language-02');
 data.records[0].subjectReview.reviewDate='2026-02-30';
 r=validateReviewEvidence(data,rows);assert.match(r.errors.join(' '),/valid YYYY-MM-DD/);
 data.records[0].subjectReview.reviewDate='2026-11-23';
 data.records[0].publicReleaseApproved=true;
 r=validateReviewEvidence(data,rows);assert.match(r.errors.join(' '),/prohibited release-approval/);
});
test('M23 complete-looking evidence is still unauthenticated and NOT public approval',()=>{
 const rows=[exampleRow],data=makeReviewTemplate(rows);
 const item=data.records[0];
 item.subjectReview=review('subject-r01');
 item.hindiReview=review('hindi-r02');
 item.curriculum={status:'verified',board:'example-board',classOrAge:'6',bookEdition:'2026',chapter:'topic-1',sourceUrl:'https://example.org/chapter/1',notes:'Requires external confirmation'};
 item.copyright={status:'original-draft',evidenceRef:'',notes:'Draft claimed original; independent verification needed.'};
 item.safeguarding={status:'assessed',reviewerRef:'safety-r03',reviewDate:'2026-11-23',notes:'Independent reviewer must check this entry.'};
 const r=validateReviewEvidence(data,rows);
 assert.equal(r.schemaValid,true);
 assert.equal(r.recordsReadyForIndependentHumanAudit,1);
 assert.equal(r.humanApprovalAuthenticated,false);
 assert.equal(r.publicReleaseApproved,false);
});
test('M23 local export/check uses no student data and keeps template as pending',()=>{
 const temp=mkdtempSync(path.join(os.tmpdir(),'aifs-m23-'));
 try{
  const f=path.join(temp,'pilot.json');
  const write=writeTemplate(f,'pilot-first',[exampleRow]);
  assert.equal(write.items,1);
  assert.equal(write.publicReleaseApproved,false);
  assert.equal(checkFile(f,[exampleRow]).schemaValid,true);
  assert.equal(JSON.parse(readFileSync(f,'utf8')).records[0].subjectReview.decision,'pending');
 }finally{rmSync(temp,{recursive:true,force:true})}
});
