import test from 'node:test';
import assert from 'node:assert/strict';
import {teacherResourceChoices,teacherActivityChoices,TEACHER_LAB_SUBJECTS,labPackKeys,editLabPack,printableLabPack,LAB_PACK_LIMIT} from '../assets/teacher-cards-engine.js';
test('M79 all-subject filter enumerates exact canonical inventory in both languages',()=>{
 for(const lang of ['en','hi']){
  const all=teacherResourceChoices('all','all',lang);
  assert.equal(all.length,109);assert.deepEqual(all.map(x=>x.key).sort(),labPackKeys().sort());
  for(const [kind,count] of [['all',109],['basic',12],['advanced',48],['supplement',49]]){
   const choices=teacherResourceChoices('all',kind,lang);
   assert.equal(choices.length,count);
   assert.deepEqual(choices,TEACHER_LAB_SUBJECTS.flatMap(s=>teacherActivityChoices(s,kind,lang)));
   assert.ok(choices.every(x=>!x.gradeVerified&&!x.humanReviewed&&!x.publicReleaseApproved));
  }
  for(const s of TEACHER_LAB_SUBJECTS)assert.deepEqual(teacherResourceChoices(s,'all',lang),teacherActivityChoices(s,'all',lang));
 }
 assert.throws(()=>teacherResourceChoices('unknown'));assert.throws(()=>teacherResourceChoices('all','unknown'));assert.throws(()=>teacherResourceChoices('all','all','xx'));
});
test('M79 every discovered resource can feed learner-only bounded mixed packs',()=>{
 const all=teacherResourceChoices('all');
 for(const x of all)for(const lang of ['en','hi']){
  const keys=editLabPack([],{type:'add',key:x.key}),pack=printableLabPack(keys,lang);
  assert.equal(pack.items[0].key,x.key);assert.equal(pack.items[0].subject,x.subject);
  assert.equal(pack.hasStudentNames,false);assert.equal(pack.publicReleaseApproved,false);
  assert.ok(!Object.hasOwn(pack.items[0],'teacherGuidance'));
 }
 const mixed=TEACHER_LAB_SUBJECTS.map(s=>teacherResourceChoices(s)[0].key);
 let keys=[];for(const key of mixed)keys=editLabPack(keys,{type:'add',key});
 assert.deepEqual(keys,mixed);assert.deepEqual(editLabPack(keys,{type:'add',key:keys[0]}),keys);
 for(const x of all.slice(0,20))keys=editLabPack(keys,{type:'add',key:x.key});
 assert.equal(keys.length,LAB_PACK_LIMIT);assert.equal(new Set(keys).size,LAB_PACK_LIMIT);
 assert.deepEqual(editLabPack(keys,{type:'clear'}),[]);
});
