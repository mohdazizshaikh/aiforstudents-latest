import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkPlanTraceability} from '../tools/plan-evidence-check.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const plan=read('docs/MASTER_100_WORK_ITEMS.json'),ledger=read('docs/B2_ROLE_LEDGER.json');
test('M32 B2 role ledger preserves 10 unassigned roles, five real-world blocked gates and no public authorization',()=>{
 const result=checkPlanTraceability(plan,ledger);
 assert.equal(result.valid,true,result.problems.join('; '));
 assert.equal(result.total,100);
 assert.equal(result.reviewerIdentityVerified,false);
 assert.equal(result.publicReleaseApproved,false);
 assert.equal(ledger.roles.length,10);
 assert.equal(ledger.realWorldGates.length,5);
 assert.equal(result.verified,plan.items.filter(x=>x.status==='DONE_VERIFIED').length);
 assert.ok(result.traces.every(x=>x.source&&x.test));
});
test('M32 B2 traceability fails on falsely assigned staff, missing trace or unsigned gates',()=>{
 const l=structuredClone(ledger);l.roles[0].assignedPerson='fictional person';
 assert.equal(checkPlanTraceability(plan,l).valid,false);
 const changed=structuredClone(ledger);changed.realWorldGates[0].approved=true;
 assert.equal(checkPlanTraceability(plan,changed).valid,false);
 const p=structuredClone(plan);p.items.find(x=>x.status==='DONE_VERIFIED').evidence=[];
 assert.equal(checkPlanTraceability(p,ledger).valid,false);
});
test('M32 B2 change protocol explicitly protects human signoffs, source hashes and real devices',()=>{
 const d=readFileSync(new URL('../docs/B2_SCOPE_CHANGE_PROTOCOL.md',import.meta.url),'utf8');
 for(const term of ['content hashes','Hostinger','noindex','safeguarding','ROLLBACK','rollback','qualif','guardian'].filter(x=>x!=='ROLLBACK'))
  assert.ok(d.toLowerCase().includes(term.toLowerCase()),term);
 assert.match(d,/ZIP build alone is not deployment/);
});
