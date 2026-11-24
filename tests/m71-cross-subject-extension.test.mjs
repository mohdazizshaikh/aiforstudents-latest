import test from 'node:test';
import assert from 'node:assert/strict';
import {advancedExtension,advancedExtensionIds,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const specs=[
 ["place-value","regroup",s=>[s.t*10+s.o,Math.floor((s.t*10+s.o)/10),(s.t*10+s.o)%10]],
 ["triangle-area","area-compare",s=>[s.b*s.h1/2,s.b*s.h2/2,(s.b*s.h2-s.b*s.h1)/2]],
 ["length-compare","unit-conversion",s=>[s.cm*10,s.mm,s.cm*10-s.mm]],
 ["path-distance","three-legs",s=>[s.a+s.b+s.c,s.a+s.c-s.b]],
 ["mass-fraction","three-components",s=>[s.a+s.b+s.c,...[s.a,s.b,s.c].map(v=>Number((v*100/(s.a+s.b+s.c)).toFixed(2)))]],
 ["bond-pair-count","bond-symbols",s=>[s.s+2*s.d,2*s.s+4*s.d]],
 ["food-web-links","energy-account",s=>[10*s.energy,s.energy*s.share,10*s.energy-s.energy*s.share]],
 ["habitat-match","survey-count",s=>[s.p+s.d,s.p-s.d]],
];
function* domain(fields,i=0,state={}){
 if(i===fields.length){yield state;return}
 const f=fields[i];for(let v=f.min;v<=f.max;v+=f.step)yield* domain(fields,i+1,{...state,[f.id]:v});
}
test('M71 exhaustive eight new activities in both languages',()=>{
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
 assert.equal(count,1812);
});
test('M71 eight existing review records include new definitions',()=>{
 const rows=buildReviewRows();assert.equal(rows.length,3340);
 for(const [id,mode] of specs){const row=rows.find(r=>r.content_id==='advanced:'+id);const def=advancedExtension(id,mode);assert.ok(row.answer_or_guidance.includes(def.title[0]));assert.ok(row.answer_or_guidance.includes(def.title[1]));}
});
