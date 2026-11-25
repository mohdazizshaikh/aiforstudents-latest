import test from 'node:test';
import assert from 'node:assert/strict';
import {BASIC_PRINT_IDS,teacherPrintableOptions,teacherPrintableSupplementOptions,printableBasicLabActivity,printableAnyLabActivity,printableLabPack,labPackKeys,TEACHER_LAB_SUBJECTS,editLabPack} from '../assets/teacher-cards-engine.js';
import {SCIENCE_MODELS} from '../assets/science-engine.js';
import {WORKSHOP_CONTENT} from '../assets/experiment-engine.js';
import {STUDIO_LESSONS} from '../assets/studio-engine.js';
test('M75 twelve basic source-derived worksheets in two languages without answer or learner fields',()=>{
 assert.equal(BASIC_PRINT_IDS.length,12);assert.equal(new Set(BASIC_PRINT_IDS).size,12);
 for(const id of BASIC_PRINT_IDS)for(const lang of ['en','hi']){
  const [kind,key]=id.split('/'),i=lang==='hi'?1:0,m=kind==='science'?SCIENCE_MODELS[key]:kind==='maths'?WORKSHOP_CONTENT[key]:STUDIO_LESSONS[key];
  const r=printableBasicLabActivity(id,lang);
  assert.equal(r.title,m.title[i]);assert.equal(r.prompt,(kind==='studio'?m.stages.find(s=>s.id==='try').question:m.prompt)[i]);
  assert.ok(r.caveat);assert.equal(r.steps.length,3);assert.equal(r.hasStudentNames,false);assert.equal(r.humanReviewed,false);assert.equal(r.publicReleaseApproved,false);assert.equal(r.localOnly,true);
  assert.deepEqual(Object.keys(r).sort(),['id','subject','language','title','prompt','caveat','steps','sourceFile','rightsStatus','humanReviewed','publicReleaseApproved','localOnly','hasStudentNames','comparison'].sort());
  assert.deepEqual(teacherPrintableSupplementOptions(id,lang),[]);
  assert.deepEqual(printableAnyLabActivity(id,'main',lang),r);
  assert.throws(()=>printableAnyLabActivity(id,'invalid',lang));
 }
});
test('M75 60 model choices and 109 print activities, mixed pack privacy and invalid keys',()=>{
 for(const lang of ['en','hi']){
  const all=TEACHER_LAB_SUBJECTS.flatMap(s=>teacherPrintableOptions(s,lang));
  assert.equal(all.length,60);assert.equal(new Set(all.map(x=>x.id)).size,60);
  const keys=['maths/rectangle:main','cell-doubling:rounds','science/motion:main','studio/circuit-path:main'];
  const pack=printableLabPack(keys,lang);
  assert.deepEqual(pack.items.map(x=>x.key),keys);
  assert.ok(pack.items.every(x=>x.humanReviewed===false&&x.hasStudentNames===false));
  assert.deepEqual(editLabPack(keys,{type:'up',key:keys[1]}),[keys[1],keys[0],...keys.slice(2)]);
 }
 assert.equal(labPackKeys().length,109);assert.equal(new Set(labPackKeys()).size,109);
 assert.throws(()=>printableLabPack(['science/motion:ratio']));
 assert.throws(()=>printableBasicLabActivity('science/no'));
 assert.throws(()=>printableBasicLabActivity('science/motion','xx'));
});
