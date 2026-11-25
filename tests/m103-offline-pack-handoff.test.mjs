import test from 'node:test';
import assert from 'node:assert/strict';
import {labPackKeys,teacherPackHandoff,resolveTeacherPackHandoff,PACK_HANDOFF_MAX,PACK_HANDOFF_PREFIX,printableLabPack} from '../assets/teacher-cards-engine.js';
const keys=labPackKeys();
for(const key of keys)test('M103 exact fixed pack recipe '+key,()=>{
 for(const lang of ['en','hi']){
  const input=[key],p=teacherPackHandoff(input,lang);
  assert.equal(p.fragment,PACK_HANDOFF_PREFIX+lang+':'+encodeURIComponent(key));assert.equal(p.href,'./'+p.fragment);
  const url=new URL(p.href,'https://fixture.invalid/teacher-kit/cards/');
  assert.equal(url.origin,'https://fixture.invalid');assert.equal(url.pathname,'/teacher-kit/cards/');assert.equal(url.search,'');
  assert.deepEqual(resolveTeacherPackHandoff(url.hash),p);assert.equal(p.storesStudentData,false);assert.equal(p.publicReleaseApproved,false);
  assert.deepEqual(printableLabPack(resolveTeacherPackHandoff(url.hash).keys,lang),printableLabPack(input,lang));
  input[0]='mock';assert.deepEqual(p.keys,[key]);p.keys[0]='mock';assert.deepEqual(resolveTeacherPackHandoff(url.hash).keys,[key]);
 }
});
test('M103 exact inventory, order, size and rejection',()=>{
 assert.equal(keys.length,109);
 const mixed=['maths/rectangle:main','ratio-algebra:equation','science/motion:main','cell-doubling:rounds','studio/circuit-path:main','mass-balance:missing'];
 for(const lang of ['en','hi'])for(const list of [mixed,[...mixed].reverse()]){
  const p=teacherPackHandoff(list,lang);assert.deepEqual(resolveTeacherPackHandoff(p.fragment).keys,list);assert.ok(p.fragment.length<=PACK_HANDOFF_MAX);
 }
 for(const x of [null,'','#lab-pack-output','#pack-v2:en:ratio-algebra%3Amain','#pack-v1:xx:ratio-algebra%3Amain','#pack-v1:en:unknown%3Amain','#pack-v1:en:ratio-algebra%3Amain,ratio-algebra%3Amain','#pack-v1:en:ratio-algebra%3Amain,','#pack-v1:en:%ZZ','#pack-v1:en:ratio-algebra:main','#pack-v1:en:ratio-algebra%3Amain?student=mock','#pack-v1:en:'+keys.slice(0,7).map(encodeURIComponent).join(','),'x'.repeat(513)])assert.equal(resolveTeacherPackHandoff(x),null);
 for(const list of [[],null,[keys[0],keys[0]],keys.slice(0,7),['unknown:main']])assert.throws(()=>teacherPackHandoff(list));assert.throws(()=>teacherPackHandoff([keys[0]],'xx'));
});
