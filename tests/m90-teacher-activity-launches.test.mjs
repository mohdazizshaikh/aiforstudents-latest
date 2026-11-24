import test from 'node:test';
import assert from 'node:assert/strict';
import {labPackKeys,teacherActivityLaunch,teacherPackLaunches,printableAnyLabActivity,BASIC_PRINT_IDS,LAB_PACK_LIMIT} from '../assets/teacher-cards-engine.js';
import {ADVANCED_IDS,advancedExtensionIds} from '../assets/advanced-lab-engine.js';
const keys=labPackKeys();
for(const key of keys)test('M90 fixed demonstration route '+key,()=>{
 const [id,mode]=key.split(':');
 for(const lang of ['en','hi']){
  const route=teacherActivityLaunch(key,lang),a=printableAnyLabActivity(id,mode,lang);
  assert.equal(route.title,a.title);assert.equal(route.subject,a.subject);assert.equal(route.key,key);
  assert.equal(route.humanReviewed,false);assert.equal(route.gradeVerified,false);assert.equal(route.publicReleaseApproved,false);assert.equal(route.storesStudentData,false);
  const u=new URL(route.href,'https://fixture.invalid/');
  assert.equal(u.origin,'https://fixture.invalid');assert.equal(u.pathname,'/');
  if(BASIC_PRINT_IDS.includes(id)){assert.equal(u.searchParams.get('demo'),id);assert.equal([...u.searchParams].length,1);assert.equal(u.hash,({science:'#science-lab',maths:'#math-workshop',studio:'#smart-studio'})[id.split('/')[0]]);}
  else{assert.ok(ADVANCED_IDS.includes(id));assert.equal(u.searchParams.get('advanced'),id);
   if(mode==='main'){assert.equal(u.hash,'#advanced-labs');assert.equal([...u.searchParams].length,1);}
   else{assert.ok(advancedExtensionIds(id).includes(mode));assert.equal(u.searchParams.get('extension'),mode);assert.equal(u.hash,'#advanced-ratio-extension');assert.equal([...u.searchParams].length,2);}
  }
 }
});
test('M90 all 109 resources have distinct fixed routes and pack order is preserved',()=>{
 assert.equal(keys.length,109);assert.equal(new Set(keys.map(k=>teacherActivityLaunch(k).href)).size,109);
 assert.deepEqual(teacherPackLaunches(keys.slice(0,LAB_PACK_LIMIT),'hi').map(x=>x.key),keys.slice(0,LAB_PACK_LIMIT));
 for(const k of [null,{},'https://evil.invalid','ratio-algebra:unknown','ratio-algebra:main&extension=equation'])assert.throws(()=>teacherActivityLaunch(k));
 assert.throws(()=>teacherActivityLaunch(keys[0],'xx'));assert.throws(()=>teacherPackLaunches([keys[0],keys[0]]));assert.throws(()=>teacherPackLaunches(keys.slice(0,7)));
});
