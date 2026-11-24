import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,advancedExtension,advancedExtensionIds,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const specs=[
 ["counting","group-total",(s,lang)=>[s.a+s.b,s.b-s.a]],
 ["probability","two-draws",(s,lang)=>[s.r+s.b,s.r+'/'+(s.r+s.b),s.r*s.r+'/'+((s.r+s.b)*(s.r+s.b))]],
 ["square-slope","symmetric-secant",(s,lang)=>[s.x-s.h,s.x+s.h,2*s.x,2*s.x]],
 ["magnetism","pole-pairs",(s,lang)=>[s.same,s.opposite,s.same+s.opposite]],
 ["thin-lens","lens-distance-compare",(s,lang)=>[s.f*s.a,s.f*s.b,Number((s.f*s.a/(s.a-1)).toFixed(3)),Number((s.f*s.b/(s.b-1)).toFixed(3))]],
 ["position-change","signed-positions",(s,lang)=>[s.e-s.s,Math.max(s.e,s.s)-Math.min(s.e,s.s)]],
 ["shadow-ray","ray-account",(s,lang)=>[s.n,s.b<=s.n?s.n-s.b:lang==='hi'?'संभव नहीं':'Not possible']],
 ["material-objects","material-groups",(s,lang)=>[s.p+s.w,s.w-s.p]],
 ["material-property","property-groups",(s,lang)=>[s.t+s.o,s.t-s.o]],
 ["ecosystem","interaction-examples",(s,lang)=>[s.p+s.r+s.d,s.p-s.r]],
 ["living-examples","living-groups",(s,lang)=>[s.p+s.s,s.p,s.s]],
];
function* domain(fields,i=0,state={}){
 if(i===fields.length){yield state;return}
 const f=fields[i];for(let v=f.min;v<=f.max;v+=f.step)yield* domain(fields,i+1,{...state,[f.id]:v});
}
test('M74 exhaustive eleven new activities in both languages',()=>{
 let count=0;
 for(const [id,mode,expected] of specs){
  const model=advancedExtension(id,mode);assert.deepEqual(advancedExtensionIds(id),[mode]);
  for(const state of domain(model.fields))for(const lang of ['en','hi']){
   const result=evaluateAdvancedExtension(id,mode,state,lang);
   assert.deepEqual(result.rows.map(r=>r.value),expected(state,lang).map(String));
   assert.equal(result.humanReviewed,false);assert.equal(result.publicReleaseApproved,false);assert.equal(result.persists,false);assert.equal(result.masteryPrediction,false);count++;
  }
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...model.initial,[model.fields[0].id]:model.fields[0].max+1}));
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...model.initial,student:'synthetic'}));
 }
 assert.equal(count,1410);
});
test('M74 every advanced draft model has a supplement; eleven changed review records include both languages',()=>{
 assert.equal(ADVANCED_IDS.length,48);
 assert.ok(ADVANCED_IDS.every(id=>advancedExtensionIds(id).length>=1));
 assert.equal(ADVANCED_IDS.reduce((n,id)=>n+advancedExtensionIds(id).length,0),49);
 const rows=buildReviewRows();assert.equal(rows.length,3340);
 for(const [id,mode] of specs){const row=rows.find(r=>r.content_id==='advanced:'+id);const def=advancedExtension(id,mode);assert.ok(row.answer_or_guidance.includes(def.title[0]));assert.ok(row.answer_or_guidance.includes(def.title[1]));}
});
