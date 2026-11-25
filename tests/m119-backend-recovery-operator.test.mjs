import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rehearseDatabaseRecovery} from '../tools/synthetic-db-recovery.mjs';
import {createOperatorRehearsal,OPERATOR_ROLES} from '../tools/adult-operator-rehearsal.mjs';
import {syntheticAggregateReport} from '../tools/teacher-aggregate-rehearsal.mjs';
import {startPilotBackend} from '../tools/pilot-backend.mjs';
test('ENG-006 conditional hosting decision keeps static core and explicitly requires account verification',()=>{
 const d=readFileSync(new URL('../docs/M119_PRODUCTION_ARCHITECTURE_DECISION.md',import.meta.url),'utf8');
 assert.match(d,/No actual account inspection/);assert.match(d,/PHP \+ MySQL/);assert.match(d,/Loopback-only/);assert.match(d,/No actual production storage selected as an approved deployment/);
});
test('ENG-007 actual synthetic SQLite migration rollback and byte-identical backup restore',()=>{
 const r=rehearseDatabaseRecovery();assert.equal(r.valid,true);assert.equal(r.fixtureRows,2);assert.equal(r.migratedVersion,2);assert.equal(r.pending,2);assert.equal(r.links,2);
 for(const k of ['failureAtomic','rollbackPreserved','restorePreserved','byteIdentical'])assert.equal(r[k],true);
 assert.ok(r.backupBytes>0);assert.equal(r.productionMigrationTested,false);assert.equal(r.storesStudentData,false);
});
test('ENG-008 role scope, tamper, expiry, revoke, capacity and close',()=>{
 let time=1000;const a=createOperatorRehearsal({now:()=>time});
 const r=a.issue('reader',100),t=a.issue('teacher',200),v=a.issue('reviewer',300),auth=s=>'Bearer '+s.token;
 assert.deepEqual(OPERATOR_ROLES,['reader','teacher','reviewer']);
 assert.equal(a.authorize(auth(r),'GET','/v1/catalog').allowed,true);assert.equal(a.authorize(auth(r),'PUT','/v1/plan').allowed,false);
 assert.equal(a.authorize(auth(t),'GET','/v1/aggregate-rehearsal').allowed,true);assert.equal(a.authorize(auth(t),'PUT','/v1/resource-rehearsal').allowed,false);
 assert.equal(a.authorize(auth(v),'PUT','/v1/resource-rehearsal').allowed,true);assert.equal(a.authorize(auth(v),'GET','/v1/plan').allowed,false);
 assert.equal(a.authorize('Bearer '+r.id+'.'+'0'.repeat(64),'GET','/v1/catalog').authenticated,false);
 time=1100;assert.equal(a.authorize(auth(r),'GET','/v1/catalog').authenticated,false);
 assert.equal(a.revoke(t.id),true);assert.equal(a.authorize(auth(t),'GET','/v1/plan').authenticated,false);
 assert.throws(()=>a.issue('student'));assert.throws(()=>a.issue('reader',300001));
 for(let i=0;i<11;i++)a.issue('reader');assert.throws(()=>a.issue('reader'));a.close();assert.equal(a.authorize(auth(v),'GET','/v1/health').authenticated,false);assert.throws(()=>a.issue('reader'));
});
test('ENG-036 fixed invented aggregate suppresses small groups and small components, no totals',()=>{
 const r=syntheticAggregateReport();assert.equal(r.minimumCount,5);assert.equal(r.groups.length,4);
 assert.deepEqual(r.groups.filter(x=>x.status==='SUPPRESSED').map(x=>x.key),['fictional-a','fictional-b','fictional-c']);
 for(const g of r.groups.filter(x=>x.status==='SUPPRESSED'))assert.deepEqual([g.visits,g.explored,g.skipped],[null,null,null]);
 assert.deepEqual(r.groups.at(-1),{key:'fictional-d',status:'SYNTHETIC_VISIBLE',visits:12,explored:6,skipped:6});
 assert.equal(Object.hasOwn(r,'total'),false);assert.equal(r.realAnalyticsEnabled,false);assert.equal(r.publicReleaseApproved,false);
});
test('M119 actual authenticated HTTP role enforcement, default-deny and aggregate no filters',async()=>{
 let time=1000;const op=createOperatorRehearsal({now:()=>time});
 const reader=op.issue('reader',100),teacher=op.issue('teacher',200),reviewer=op.issue('reviewer',300);
 const app=await startPilotBackend({operatorAccess:op});
 try{
 const call=(s,path,opts={})=>fetch(app.url+path,{...opts,headers:{Authorization:'Bearer '+s.token,...opts.headers}});
 assert.equal((await call(reader,'/v1/catalog')).status,200);
 assert.equal((await call(reader,'/v1/plan')).status,403);
 assert.equal((await call(teacher,'/v1/plan')).status,200);
 assert.equal((await call(teacher,'/v1/aggregate-rehearsal')).status,200);
 assert.equal((await call(teacher,'/v1/aggregate-rehearsal?group=fictional-a')).status,400);
 assert.equal((await call(teacher,'/v1/resource-rehearsal')).status,403);
 assert.equal((await call(reviewer,'/v1/resource-rehearsal')).status,200);
 assert.equal((await call(reviewer,'/v1/aggregate-rehearsal')).status,403);
 assert.equal((await call(teacher,'/v1/students')).status,403);
 assert.equal((await call(reader,'/v1/health',{headers:{Origin:'https://example.invalid'}})).status,403);
 assert.equal((await fetch(app.url+'/v1/aggregate-rehearsal')).status,401);
 time=1100;assert.equal((await call(reader,'/v1/catalog')).status,401);
 op.revoke(teacher.id);assert.equal((await call(teacher,'/v1/plan')).status,401);
 assert.equal((await call(app,'/v1/health')).status,200);
 }finally{await app.close()}
 assert.equal(op.authorize('Bearer '+reviewer.token,'GET','/v1/health').authenticated,false);
});
