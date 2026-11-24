import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS} from '../assets/advanced-lab-engine.js';
import {BASIC_PRINT_IDS,mainModelWorksheet,resolveMainWorksheet,printableAnyLabActivity,teacherActivityLaunch} from '../assets/teacher-cards-engine.js';
const ids=[...ADVANCED_IDS,...BASIC_PRINT_IDS];
for(const id of ids)test('M92 main model to exact printable worksheet '+id,()=>{
 for(const lang of ['en','hi']){
  const plan=mainModelWorksheet(id,lang),a=printableAnyLabActivity(id,'main',lang);
  assert.equal(plan.title,a.title);assert.equal(plan.subject,a.subject);assert.equal(plan.id,id);assert.equal(plan.language,lang);
  const url=new URL(plan.href,'https://fixture.invalid/');
  assert.equal(url.origin,'https://fixture.invalid');assert.equal(url.pathname,'/teacher-kit/cards/');
  assert.deepEqual([...url.searchParams.keys()],['worksheet','language']);
  assert.equal(url.hash,'#lab-activity');assert.deepEqual(resolveMainWorksheet(url.search),plan);
  assert.equal(plan.storesStudentData,false);assert.equal(plan.humanReviewed,false);assert.equal(plan.publicReleaseApproved,false);
  assert.equal(teacherActivityLaunch(id+':main',lang).id,id);
 }
});
test('M92 all 60 unique models and invalid URL selectors fail closed',()=>{
 assert.equal(ids.length,60);
 assert.equal(new Set(ids.map(id=>mainModelWorksheet(id).href)).size,60);
 for(const query of ['',null,'?worksheet=unknown&language=en','?worksheet='+ids[0]+'&language=xx','?worksheet='+ids[0]+'&language=en&studentId=mock','?worksheet='+ids[0]+'&worksheet='+ids[0]+'&language=en','?worksheet='+ids[0]+'&language=en&language=hi','?worksheet=https%3A%2F%2Fevil.invalid&language=en','x'.repeat(257)])assert.equal(resolveMainWorksheet(query),null);
 assert.throws(()=>mainModelWorksheet('ratio-algebra:equation'));assert.throws(()=>mainModelWorksheet(ids[0],'xx'));
});
