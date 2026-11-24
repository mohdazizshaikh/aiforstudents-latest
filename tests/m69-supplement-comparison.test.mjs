import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,advancedExtensionIds,advancedExtension,evaluateAdvancedExtension,compareAdvancedExtension} from '../assets/advanced-lab-engine.js';
test('M69/M70 twenty-two supplemental comparisons in both languages, unchanged, one and multiple controls',()=>{
 let count=0;
 for(const id of ADVANCED_IDS)for(const mode of advancedExtensionIds(id))for(const lang of ['en','hi']){
  const m=advancedExtension(id,mode),before={...m.initial},one={...before},many={...before};
  const change=f=>before[f.id]===f.max?f.min:f.max;
  one[m.fields[0].id]=change(m.fields[0]);
  for(const f of m.fields.slice(0,2))many[f.id]=change(f);
  for(const [after,status,n] of [[before,'UNCHANGED',0],[one,'ONE_CONTROL',1],[many,'MULTIPLE_CONTROLS',2]]){
   const r=compareAdvancedExtension(id,mode,before,after,lang),a=evaluateAdvancedExtension(id,mode,before,lang),b=evaluateAdvancedExtension(id,mode,after,lang);
   assert.equal(r.status,status);assert.equal(r.changes.length,n);assert.ok(r.guidance);
   assert.deepEqual(r.rows,a.rows.map((x,i)=>({label:x.label,before:x.value,after:b.rows[i].value,changed:x.value!==b.rows[i].value})));
   assert.equal(r.persists,false);assert.equal(r.usesLearnerHistory,false);assert.equal(r.masteryPrediction,false);assert.equal(r.humanReviewed,false);assert.equal(r.publicReleaseApproved,false);
   count++;
  }
  assert.deepEqual(before,m.initial);
  assert.throws(()=>compareAdvancedExtension(id,mode,before,{...before,student:'x'},lang));
 }
 assert.equal(count,132);
});
test('M69 comparison rejects unknown model, mode, invalid state and unsupported language',()=>{
 assert.throws(()=>compareAdvancedExtension('counting','ratio',{},{}));
 assert.throws(()=>compareAdvancedExtension('ratio-algebra','invalid',{},{}));
 assert.throws(()=>compareAdvancedExtension('coordinate','linear',{m:1,b:0,x:0},{m:1,b:0,x:100}));
 assert.throws(()=>compareAdvancedExtension('coordinate','linear',{m:1,b:0,x:0},{m:1,b:0,x:0},'xx'));
});
