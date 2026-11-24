import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {auditFullDisabledTutorCorpus} from '../tools/full-tutor-corpus-audit.mjs';
const rows=buildReviewRows();
test('M85 every canonical record in both languages denies exact, stale and extra-field requests',()=>{
 const r=auditFullDisabledTutorCorpus(rows);
 assert.equal(r.valid,true,r.errors.join('; '));
 assert.equal(r.canonicalRecords,3340);assert.equal(r.nativeIds+r.aliasIds,3340);
 assert.equal(r.exactDenials,6680);assert.equal(r.staleDenials,6680);assert.equal(r.extraFieldDenials,6680);assert.equal(r.corpusCases,20040);
 assert.equal(r.pilotRegressionCases,224);
 assert.equal(Object.values(r.byQueue).reduce((n,q)=>n+q.records,0),3340);
 for(const q of Object.values(r.byQueue)){assert.equal(q.exactDenials,q.records*2);assert.equal(q.staleDenials,q.exactDenials);assert.equal(q.extraFieldDenials,q.exactDenials);}
 for(const k of ['generativeTutorEnabled','remoteEnabled','providerTested','semanticAccuracyValidated','independentRedTeamCompleted','humanApprovalAuthenticated','publicReleaseApproved'])assert.equal(r[k],false);
 assert.deepEqual(auditFullDisabledTutorCorpus([...rows].reverse()),r);
});
test('M85 incomplete, duplicate, stale and substituted inventory fails closed',()=>{
 for(const x of [null,rows.slice(1),[rows[1],...rows.slice(1)],rows.map((r,i)=>i===0?{...r,content_sha256:'0'.repeat(64)}:r),rows.map((r,i)=>i===0?{...r,content_id:'synthetic-substitute'}:r)]){
  const r=auditFullDisabledTutorCorpus(x);assert.equal(r.valid,false);assert.equal(r.publicReleaseApproved,false);assert.equal(r.generativeTutorEnabled,false);
 }
});
