import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,advancedExtensionIds,advancedExtension,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
import {teacherSupplementControlGuide,printableSupplementActivity} from '../assets/teacher-cards-engine.js';
const keys=ADVANCED_IDS.flatMap(id=>advancedExtensionIds(id).map(mode=>[id,mode]));
for(const [id,mode] of keys){
 test('M100 supplemental teacher control guide '+id+':'+mode,()=>{
  const m=advancedExtension(id,mode);
  for(const lang of ['en','hi']){
   const g=teacherSupplementControlGuide(id,mode,lang),a=printableSupplementActivity(id,mode,lang),i=lang==='hi'?1:0;
   assert.equal(g.title,a.title);assert.equal(g.caveat,a.caveat);assert.equal(g.id,id);assert.equal(g.mode,mode);
   assert.deepEqual(g.controls,m.fields.map(f=>({label:f.label[i],kind:'range',settings:(lang==='hi'?f.min+' से '+f.max+'; कदम 1':f.min+' to '+f.max+'; step 1')+(f.unit?' ('+f.unit+')':'')})));
   assert.equal(g.teacherOnly,true);assert.equal(g.humanReviewed,false);assert.equal(g.publicReleaseApproved,false);assert.equal(g.storesStudentData,false);
   assert.equal(Object.hasOwn(a,'controls'),false);
  }
 });
 test('M100 supplemental calculated quantity labels '+id+':'+mode,()=>{
  const m=advancedExtension(id,mode);
  for(const lang of ['en','hi']){
   const g=teacherSupplementControlGuide(id,mode,lang),r=evaluateAdvancedExtension(id,mode,m.initial,lang);
   assert.deepEqual(g.quantityLabels,r.rows.map(row=>row.label));
   assert.deepEqual(Object.keys(g).sort(),['id','mode','title','caveat','controls','quantityLabels','teacherOnly','humanReviewed','publicReleaseApproved','storesStudentData'].sort());
   assert.ok(g.quantityLabels.every(x=>typeof x==='string'&&x.length>0));
   assert.equal(Object.hasOwn(printableSupplementActivity(id,mode,lang),'quantityLabels'),false);
  }
 });
}
test('M100 all 49 supplemental guides and invalid selectors',()=>{
 assert.equal(keys.length,49);
 for(const args of [['unknown','ratio','en'],['ratio-algebra','main','en'],['ratio-algebra','equation','xx'],['maths/rectangle','equation','en']])assert.throws(()=>teacherSupplementControlGuide(...args));
});
