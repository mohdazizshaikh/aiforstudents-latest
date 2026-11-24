import test from 'node:test';
import assert from 'node:assert/strict';
import {searchTeacherResources,teacherResourceChoices,TEACHER_QUERY_LIMIT,TEACHER_LAB_SUBJECTS,editLabPack} from '../assets/teacher-cards-engine.js';
test('M88 all 109 fixed resource keys and bilingual titles are searchable in both display languages',()=>{
 const en=teacherResourceChoices('all','all','en'),hi=new Map(teacherResourceChoices('all','all','hi').map(x=>[x.key,x]));
 assert.equal(en.length,109);
 for(const r of en)for(const lang of ['en','hi']){
  const found=searchTeacherResources('all','all',lang,r.key);
  assert.ok(found.some(x=>x.key===r.key),r.key);
  for(const q of [r.title,hi.get(r.key).title].filter(q=>q.length<=TEACHER_QUERY_LIMIT&&!/[\p{Cc}\p{Cf}]/u.test(q))){
   assert.ok(searchTeacherResources('all','all',lang,q).some(x=>x.key===r.key),r.key+':'+lang);
  }
  assert.deepEqual(editLabPack([],{type:'add',key:r.key}),[r.key]);
 }
});
test('M88 respects existing scope, kind, normalization, empty query and invalid query boundaries',()=>{
 for(const s of ['all',...TEACHER_LAB_SUBJECTS])for(const kind of ['all','basic','advanced','supplement'])for(const lang of ['en','hi']){
  assert.deepEqual(searchTeacherResources(s,kind,lang,'  '),teacherResourceChoices(s,kind,lang));
  assert.ok(searchTeacherResources(s,kind,lang,'ratio').every(r=>s==='all'||r.subject===s));
 }
 assert.deepEqual(searchTeacherResources('all','all','en','zzzz-no-matching-resource'),[]);
 assert.deepEqual(searchTeacherResources('all','all','en','ＲＡＴＩＯ-ＡＬＧＥＢＲＡ:ＥＱＵＡＴＩＯＮ'),searchTeacherResources('all','all','en','ratio-algebra:equation'));
 for(const q of [null,{},'x'.repeat(81),'a\n','a\u200b'])assert.throws(()=>searchTeacherResources('all','all','en',q));
});
