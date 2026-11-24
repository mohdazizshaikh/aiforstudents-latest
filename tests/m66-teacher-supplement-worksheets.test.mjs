import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,advancedExtension,advancedExtensionIds} from '../assets/advanced-lab-engine.js';
import {teacherSupplementOptions,printableSupplementActivity} from '../assets/teacher-cards-engine.js';
test('M66/M70 thirty bilingual source-derived worksheets, no hint, answers or learner fields',()=>{
 let count=0;
 for(const id of ADVANCED_IDS)for(const lang of ['en','hi']){
  const i=lang==='hi'?1:0;
  const options=teacherSupplementOptions(id,lang);
  assert.deepEqual(options.map(x=>x.mode),advancedExtensionIds(id));
  for(const option of options){
   const m=advancedExtension(id,option.mode),r=printableSupplementActivity(id,option.mode,lang);
   assert.equal(r.title,m.title[i]);assert.equal(r.prompt,m.prompt[i]);assert.equal(r.caveat,m.caveat[i]);assert.equal(r.steps.length,3);
   assert.equal(r.humanReviewed,false);assert.equal(r.publicReleaseApproved,false);assert.equal(r.hasStudentNames,false);assert.equal(r.localOnly,true);
   assert.equal(r.rightsStatus,'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED');
   assert.deepEqual(Object.keys(r).sort(),['id','subject','language','title','prompt','caveat','steps','sourceFile','rightsStatus','humanReviewed','publicReleaseApproved','localOnly','hasStudentNames','mode'].sort());
   assert.ok(!JSON.stringify(r).includes(m.hint[i]));
   count++;
  }
 }
 assert.equal(count,60);
});
test('M66 rejects mismatched or unknown model/activity and unsupported language',()=>{
 assert.throws(()=>teacherSupplementOptions('invalid'));
 assert.throws(()=>teacherSupplementOptions('coordinate','invalid'));
 assert.throws(()=>printableSupplementActivity('coordinate','ratio'));
 assert.throws(()=>printableSupplementActivity('counting','linear'));
 assert.throws(()=>printableSupplementActivity('ratio-algebra','__proto__'));
 assert.throws(()=>printableSupplementActivity('ratio-algebra','ratio','invalid'));
});
