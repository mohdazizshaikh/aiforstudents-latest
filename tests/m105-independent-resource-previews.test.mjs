import test from 'node:test';
import assert from 'node:assert/strict';
import {labPackKeys,teacherResourcePreview,teacherPackDemoLaunch,worksheetReturnLaunch,teacherActivityLaunch,printableLabPack} from '../assets/teacher-cards-engine.js';
const keys=labPackKeys();
for(const key of keys)test('M105 independent discovery preview '+key,()=>{
 for(const lang of ['en','hi']){
  const source=worksheetReturnLaunch(key,lang),legacy=teacherActivityLaunch(key,lang),preview=teacherResourcePreview(key,lang),selected=teacherPackDemoLaunch([key],key,lang);
  assert.deepEqual(preview,{key,title:source.title,language:lang,href:'../../'+source.href,target:'_blank',rel:'noopener noreferrer',localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false});
  assert.equal(preview.href,selected.href);assert.equal(preview.target,selected.target);assert.equal(preview.rel,selected.rel);
  const url=new URL(preview.href,'https://fixture.invalid/teacher-kit/cards/');
  assert.equal(url.origin,'https://fixture.invalid');assert.equal(url.pathname,'/');assert.equal(url.searchParams.get('lang'),lang);
  url.searchParams.delete('lang');const previous=new URL(legacy.href,'https://fixture.invalid/');
  assert.deepEqual([...url.searchParams],[...previous.searchParams]);assert.equal(url.hash,previous.hash);
  const before=printableLabPack([],lang);preview.href='mock';assert.notEqual(teacherResourcePreview(key,lang).href,'mock');assert.deepEqual(printableLabPack([],lang),before);
 }
});
test('M105 exact inventory and invalid preview selectors',()=>{
 assert.equal(keys.length,109);
 for(const key of [null,'unknown:main','https://evil.invalid','ratio-algebra:main&student=mock','ratio-algebra:equation:extra'])assert.throws(()=>teacherResourcePreview(key));
 assert.throws(()=>teacherResourcePreview(keys[0],'xx'));
});
