import test from 'node:test';
import assert from 'node:assert/strict';
import {labPackKeys,LAB_PACK_LIMIT,editLabPack,printableLabPack} from '../assets/teacher-cards-engine.js';
test('M67/M70 all 62 known activities in both languages, source-derived learner-only payload',()=>{
 const keys=labPackKeys();assert.equal(keys.length,62);assert.equal(new Set(keys).size,62);
 for(const key of keys)for(const lang of ['en','hi']){
  const p=printableLabPack([key],lang),a=p.items[0];
  assert.equal(a.key,key);assert.equal(a.position,1);assert.equal(a.steps.length,3);
  assert.ok(a.title&&a.prompt&&a.caveat);assert.equal(p.humanReviewed,false);assert.equal(p.publicReleaseApproved,false);assert.equal(p.hasStudentNames,false);
  for(const field of ['hint','answer','teacherGuidance','student','score','initial','target'])assert.ok(!Object.hasOwn(a,field));
 }
});
test('M67 bounded nonmutating pack operations, duplicate and boundary handling',()=>{
 const keys=labPackKeys(),initial=keys.slice(0,LAB_PACK_LIMIT);
 assert.deepEqual(editLabPack(initial,{type:'add',key:keys[6]}),initial);
 assert.deepEqual(editLabPack(initial,{type:'add',key:keys[0]}),initial);
 assert.deepEqual(editLabPack(initial,{type:'up',key:keys[0]}),initial);
 assert.deepEqual(editLabPack(initial,{type:'down',key:keys[5]}),initial);
 assert.deepEqual(editLabPack(initial,{type:'up',key:keys[1]}),[keys[1],keys[0],...keys.slice(2,6)]);
 assert.deepEqual(editLabPack(initial,{type:'remove',key:keys[1]}),[keys[0],...keys.slice(2,6)]);
 assert.deepEqual(editLabPack(initial,{type:'clear'}),[]);
 assert.deepEqual(initial,keys.slice(0,6));
 assert.throws(()=>printableLabPack([...initial,keys[6]]));assert.throws(()=>printableLabPack([keys[0],keys[0]]));assert.throws(()=>printableLabPack(['fake:main']));
 assert.throws(()=>printableLabPack(initial,'xx'));assert.throws(()=>editLabPack(initial,{type:'add',key:keys[0],student:'x'}));
});
