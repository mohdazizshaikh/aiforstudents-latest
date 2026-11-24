import test from 'node:test';
import assert from 'node:assert/strict';
import {advancedExtension,advancedExtensionIds,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const specs=[
 ["symmetry","axis-reflections",s=>[s.x,-s.y,-s.x,s.y]],
 ["vector-components","vector-addition",s=>[s.a+s.c,s.b+s.d,(s.a+s.c)**2+(s.b+s.d)**2]],
 ["temperature","energy-required",s=>[100*s.c,s.m*(100*s.c)*s.t]],
 ["measurement","average-speed",s=>[s.a+s.b,s.u+s.v,Number(((s.a+s.b)/(s.u+s.v)).toFixed(3))]],
 ["periodic","neutral-counts",s=>[s.z,s.z,s.z+s.n]],
 ["alkane-count","formula-compare",s=>[2*s.a+2,2*s.b+2,2*s.b-2*s.a]],
 ["heredity","grid-counts",s=>[4*s.a+4*s.b,s.a,s.a+s.a,s.a+4*s.b]],
 ["plant-process","oxygen-account",s=>[6*s.p,6*s.r,6*s.p-6*s.r]],
];
function* domain(fields,i=0,state={}){
 if(i===fields.length){yield state;return}
 const f=fields[i];for(let v=f.min;v<=f.max;v+=f.step)yield* domain(fields,i+1,{...state,[f.id]:v});
}
test('M72 exhaustive eight new activities in both languages',()=>{
 let count=0;
 for(const [id,mode,expected] of specs){
  const model=advancedExtension(id,mode);assert.deepEqual(advancedExtensionIds(id),[mode]);
  for(const state of domain(model.fields))for(const lang of ['en','hi']){
   const result=evaluateAdvancedExtension(id,mode,state,lang);
   assert.deepEqual(result.rows.map(r=>r.value),expected(state).map(String));
   assert.equal(result.humanReviewed,false);assert.equal(result.publicReleaseApproved,false);assert.equal(result.persists,false);assert.equal(result.masteryPrediction,false);count++;
  }
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...model.initial,[model.fields[0].id]:model.fields[0].max+1}));
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...model.initial,student:'synthetic'}));
 }
 assert.equal(count,2878);
});
test('M72 eight existing review records include both languages',()=>{
 const rows=buildReviewRows();assert.equal(rows.length,3340);
 for(const [id,mode] of specs){const row=rows.find(r=>r.content_id==='advanced:'+id);const def=advancedExtension(id,mode);assert.ok(row.answer_or_guidance.includes(def.title[0]));assert.ok(row.answer_or_guidance.includes(def.title[1]));}
});
