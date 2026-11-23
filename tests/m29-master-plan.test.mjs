import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const file=(name)=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const tracker=JSON.parse(file('docs/MASTER_100_WORK_ITEMS.json'));
const plan=file('docs/MASTER_EXECUTION_PLAN.md');
const scope=file('docs/FULL_PRODUCT_SCOPE_AND_DONE.md');

test('M29 master plan contains exactly 100 unique NEW tasks, two real 50-item batches',()=>{
 assert.equal(tracker.schema,'aifs-full-product-100-work-v1');
 assert.equal(tracker.items.length,100);
 assert.equal(new Set(tracker.items.map(x=>x.id)).size,100);
 for(const [batch,n] of [['B1',50],['B2',50]]){
  assert.equal(tracker.items.filter(x=>x.batch===batch).length,n);
  assert.equal(tracker.batches.find(x=>x.id===batch).items,n);
 }
 assert.equal((plan.match(/FP-\d{3}/g)||[]).length,100);
});

test('M29 plan covers ten balanced workstreams with acceptance and valid dependencies',()=>{
 const streams=new Set(tracker.items.map(x=>x.stream));
 assert.equal(streams.size,10);
 const indexes=new Map(tracker.items.map((x,i)=>[x.id,i]));
 for(const stream of streams)assert.equal(tracker.items.filter(x=>x.stream===stream).length,10);
 for(const x of tracker.items){
  assert.match(x.id,/^FP-\d{3}$/);
  assert.ok(x.acceptance.length>=20,x.id+' must have useful acceptance proof');
  assert.ok(x.title.length>=15,x.id+' must have a precise work title');
  assert.ok(['ENGINEERING_OR_CONTENT','HUMAN_GATE'].includes(x.execution));
  assert.ok(['P0','P1','P2'].includes(x.priority));
  for(const dep of x.dependsOn){
   assert.ok(indexes.has(dep),x.id+' has invalid dependency '+dep);
   assert.ok(indexes.get(dep)<indexes.get(x.id),x.id+' has non-prior dependency '+dep);
  }
 }
});

test('M29 no planned work or historical code pilot is promoted to human/public approval',()=>{
 assert.equal(tracker.productStatus,'PARTIAL_WORKING_PROTOTYPE');
 assert.equal(tracker.publicReleaseApproved,false);
 assert.equal(tracker.existingUnreviewedContentRecords,3282);
 assert.equal(tracker.safeguardingHumanGatesPending,6);
 const done=tracker.items.filter(x=>x.status==='DONE_VERIFIED');
 assert.ok(done.every(x=>x.execution!=='HUMAN_GATE'&&x.evidence.length>=2));
 assert.ok(tracker.items.filter(x=>x.status!=='DONE_VERIFIED').every(x=>!x.evidence.length));
 assert.equal(done.filter(x=>x.batch==='B1').length,46);
 assert.equal(done.filter(x=>x.batch==='B2').length,2);
 assert.ok(tracker.items.some(x=>x.execution==='HUMAN_GATE'));
 assert.match(scope,/FULL PRODUCT NOT COMPLETE/);
 assert.match(scope,/PUBLIC LAUNCH NOT APPROVED/);
 assert.match(plan,/2\/50/);
});

test('M29 root and status docs display truthful planned product state prominently',()=>{
 for(const name of ['README.md','docs/PROJECT_STATUS.md','docs/ROADMAP.md','docs/IMPLEMENTATION_BACKLOG.md','docs/MILESTONE_TRACKER.md','RELEASE_GATES.md']){
  const doc=file(name);
  assert.match(doc.slice(0,1200),/M32/,name+' latest status not prominent');
  assert.match(doc,/M29/,name+' historical baseline missing');
  assert.match(doc,/MASTER_EXECUTION_PLAN\.md/,name+' master plan link missing');
 }
});
