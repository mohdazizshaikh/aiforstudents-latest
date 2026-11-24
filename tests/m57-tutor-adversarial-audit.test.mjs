import test from 'node:test';
import assert from 'node:assert/strict';
import {auditDisabledTutorBoundary} from '../tools/tutor-adversarial-audit.mjs';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
test('M57 224 deterministic disabled-tutor contract cases across both languages and all 76 pilot-first records',()=>{
 const r=auditDisabledTutorBoundary();assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.pilotRecords,76);
 assert.deepEqual(r.counts,{canonicalPilotDenials:152,malformedRequestDenials:30,syntheticResponseRejections:40,syntheticPositiveControls:2});assert.equal(r.totalCases,224);
 for(const k of ['independentRedTeamCompleted','semanticAccuracyValidated','providerTested','generativeTutorEnabled','humanApprovalAuthenticated','publicReleaseApproved'])assert.equal(r[k],false);
});
test('M57 missing, duplicate and malformed pilot inventory cannot pass as fully tested',()=>{
 const rows=buildReviewRows(),pilot=rows.filter(r=>r.priority==='pilot-first');
 assert.equal(auditDisabledTutorBoundary([]).valid,false);
 assert.equal(auditDisabledTutorBoundary([...pilot,pilot[0]]).valid,false);
 assert.equal(auditDisabledTutorBoundary([{...pilot[0],content_sha256:'bad'}]).valid,false);
});
