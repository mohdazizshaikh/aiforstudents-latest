import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditWorkPlan,formatWorkPlanDashboard} from '../tools/workplan-status.mjs';
const load=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const manifest=JSON.parse(load('docs/MASTER_100_WORK_ITEMS.json'));

test('M30 B1 dashboard derives 46 evidence-backed engineering/design tasks, not approvals',()=>{
 const result=auditWorkPlan(manifest);
 assert.equal(result.valid,true,JSON.stringify(result.errors));
 assert.equal(result.byBatch.B1.verified,46);
 assert.equal(result.byBatch.B1.total,50);
 assert.equal(result.byBatch.B1.blockedExternal,4);
 assert.equal(result.byBatch.B2.verified,24);
 assert.equal(result.humanApprovalAuthenticated,false);
 assert.equal(result.publicReleaseApproved,false);
 assert.equal(formatWorkPlanDashboard(manifest),load('docs/B1_PROGRESS_DASHBOARD.md'));
});
test('M30 B1 verified tasks have source and test evidence and valid completed dependencies',()=>{
 const byId=new Map(manifest.items.map(x=>[x.id,x]));
 for(const task of manifest.items.filter(x=>x.status==='DONE_VERIFIED')){
  assert.ok(task.evidence.find(x=>x.kind==='source'));
  assert.ok(task.evidence.find(x=>x.kind==='test'));
  assert.notEqual(task.execution,'HUMAN_GATE');
  for(const dep of task.dependsOn)assert.equal(byId.get(dep).status,'DONE_VERIFIED');
 }
 assert.equal(manifest.items.length,100);
 assert.equal(manifest.currentPendingContentRecords,3340);
 assert.equal(manifest.existingUnreviewedContentRecords,3282);
});
test('M30 workplan validator rejects fake signoff, absent evidence, wrong count or bad dependencies',()=>{
 const fake=structuredClone(manifest),human=fake.items.find(x=>x.id==='FP-013');
 human.status='DONE_VERIFIED';human.evidence=[{kind:'source',path:'docs/B1_FOUNDATION_CONTRACTS.md'},{kind:'test',path:'tests/m30-b1-workplan.test.mjs'}];
 assert.equal(auditWorkPlan(fake).valid,false);
 assert.match(auditWorkPlan(fake).errors.join(' '),/human gate/);
 const missing=structuredClone(manifest),fp=missing.items.find(x=>x.id==='FP-033');
 fp.evidence=[];
 assert.equal(auditWorkPlan(missing).valid,false);
 const broken=structuredClone(manifest);broken.items.find(x=>x.id==='FP-031').status='NOT_STARTED';
 broken.items.find(x=>x.id==='FP-031').evidence=[];
 assert.match(auditWorkPlan(broken).errors.join(' '),/dependency/);
});
test('M30 dashboard and status remain source-backed without learner info or live-host claims',()=>{
 const dashboard=load('docs/B1_PROGRESS_DASHBOARD.md');
 assert.match(dashboard,/46 \| 50 \| 4/);
 assert.match(dashboard,/3,340 pending subject\/Hindi reviews/);
 assert.match(dashboard,/NOT AUTHENTICATED/);
 assert.match(dashboard,/publicReleaseApproved: false/);
 assert.doesNotMatch(dashboard,/@gmail\.com|api[_-]?key|Bearer /);
});

test('M64 generated dashboard exposes every unfinished B2 item and outstanding dependency without granting approval',()=>{
 const output=formatWorkPlanDashboard(manifest);
 const open=manifest.items.filter(x=>x.batch==='B2'&&x.status!=='DONE_VERIFIED');
 const rows=output.split('\n').filter(x=>/^\| FP-\d{3} \|/.test(x));
 assert.equal(rows.length,26);
 for(const task of open){
  const row=rows.find(x=>x.startsWith('| '+task.id+' |'));
  assert.ok(row,task.id);assert.ok(row.includes(task.status));
  for(const dep of task.dependsOn.filter(id=>manifest.items.find(x=>x.id===id).status!=='DONE_VERIFIED'))assert.ok(row.includes(dep));
 }
 assert.match(output,/\| BLOCKED_EXTERNAL \| 25 \|/);
 assert.match(output,/\| REVIEW_PENDING \| 2 \|/);
 assert.match(output,/\| CODE_COMPLETE_TESTED \| 2 \|/);
 assert.match(output,/\| IN_PROGRESS \| 1 \|/);
});
