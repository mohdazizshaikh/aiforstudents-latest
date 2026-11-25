import test from 'node:test';
import assert from 'node:assert/strict';
import {labPackKeys,teacherPackDemoLaunch,worksheetReturnLaunch,printableLabPack} from '../assets/teacher-cards-engine.js';
const keys=labPackKeys();
for(const key of keys)test('M104 isolated selected pack demo '+key,()=>{
 for(const lang of ['en','hi']){
  const selected=[key],before=printableLabPack(selected,lang),launch=teacherPackDemoLaunch(selected,key,lang),source=worksheetReturnLaunch(key,lang);
  assert.deepEqual(launch,{key,title:source.title,language:lang,href:'../../'+source.href,target:'_blank',rel:'noopener noreferrer',preservesOriginalPack:true,localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false});
  const url=new URL(launch.href,'https://fixture.invalid/teacher-kit/cards/');
  assert.equal(url.origin,'https://fixture.invalid');assert.equal(url.pathname,'/');assert.equal(url.searchParams.get('lang'),lang);
  assert.equal(url.hash,new URL(source.href,'https://fixture.invalid/').hash);assert.ok(!url.hash.includes('pack-v1'));
  assert.deepEqual([...url.searchParams], [...new URL(source.href,'https://fixture.invalid/').searchParams]);
  assert.deepEqual(selected,[key]);assert.deepEqual(printableLabPack(selected,lang),before);
 }
});
test('M104 selected-only launch, six-item bounds and rejection',()=>{
 assert.equal(keys.length,109);
 const mixed=['maths/rectangle:main','ratio-algebra:equation','science/motion:main','cell-doubling:rounds','studio/circuit-path:main','mass-balance:missing'];
 for(const key of mixed)assert.equal(teacherPackDemoLaunch(mixed,key,'hi').key,key);
 for(const [list,key,lang] of [[[],keys[0],'en'],[[keys[0]],keys[1],'en'],[[keys[0],keys[0]],keys[0],'en'],[keys.slice(0,7),keys[0],'en'],[[keys[0]],keys[0],'xx'],[[keys[0]],'https://evil.invalid','en'],[null,keys[0],'en']])assert.throws(()=>teacherPackDemoLaunch(list,key,lang));
});
