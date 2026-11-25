import test from 'node:test';
import assert from 'node:assert/strict';
import {labPackKeys,teacherPackPreparation,teacherMainControlGuide,teacherMainObservationGuide,teacherSupplementControlGuide,worksheetReturnLaunch,printableLabPack} from '../assets/teacher-cards-engine.js';
const keys=labPackKeys();
for(const key of keys)test('M102 exact pack rehearsal '+key,()=>{
 const [id,mode]=key.split(':');
 for(const lang of ['en','hi']){
  const before=printableLabPack([key],lang),data=teacherPackPreparation([key],lang),item=data.items[0],source=mode==='main'?teacherMainControlGuide(id,lang):teacherSupplementControlGuide(id,mode,lang);
  assert.equal(data.language,lang);assert.equal(data.teacherOnly,true);assert.equal(data.localOnly,true);assert.equal(data.storesStudentData,false);assert.equal(data.humanReviewed,false);assert.equal(data.publicReleaseApproved,false);
  assert.deepEqual(item,{key,position:1,title:source.title,caveat:source.caveat,controls:source.controls,observationLabels:mode==='main'?teacherMainObservationGuide(id,lang).labels:source.quantityLabels,href:worksheetReturnLaunch(key,lang).href});
  assert.deepEqual(Object.keys(item).sort(),['key','position','title','caveat','controls','observationLabels','href'].sort());
  assert.ok(item.observationLabels.length>0);assert.equal(new URL(item.href,'https://fixture.invalid/').searchParams.get('lang'),lang);
  item.controls[0].settings='mock';item.observationLabels[0]='mock';
  assert.notEqual(teacherPackPreparation([key],lang).items[0].controls[0].settings,'mock');
  assert.deepEqual(printableLabPack([key],lang),before);assert.equal(Object.hasOwn(before.items[0],'observationLabels'),false);
 }
});
test('M102 inventory, mixed ordering, limits, empty pack and rejected inputs',()=>{
 assert.equal(keys.length,109);const mixed=['maths/rectangle:main','ratio-algebra:equation','science/motion:main','cell-doubling:rounds','studio/circuit-path:main','mass-balance:missing'];
 for(const lang of ['en','hi']){
  for(const list of [mixed,[...mixed].reverse(),mixed.slice(2),[]]){
   const data=teacherPackPreparation(list,lang);assert.deepEqual(data.items.map(x=>x.key),list);assert.deepEqual(data.items.map(x=>x.position),list.map((_,i)=>i+1));
  }
 }
 for(const list of [null,['unknown:main'],[keys[0],keys[0]],keys.slice(0,7)])assert.throws(()=>teacherPackPreparation(list));
 assert.throws(()=>teacherPackPreparation([],'xx'));
});
