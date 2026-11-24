import test from 'node:test';
import assert from 'node:assert/strict';
import {advancedExtension,advancedExtensionIds,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const specs=[
 ["right-triangle-ratio","similar-triangles",(s,lang)=>[5*s.a,5*s.b,(3*s.a)*(4*s.a)/2,(3*s.b)*(4*s.b)/2]],
 ["integral-area","interval-area",(s,lang)=>[s.l+s.w,s.w*(s.a*s.l+s.a*(s.l+s.w))/2]],
 ["capacitor-charge","charge-compare",(s,lang)=>[s.a*s.v,s.b*s.v,s.b*s.v-s.a*s.v]],
 ["magnetic-flux","surface-compare",(s,lang)=>[s.b*s.a1,s.b*s.a2,s.b*s.a2-s.b*s.a1]],
 ["material-state","state-account",(s,lang)=>[s.s+s.l,s.l-s.s]],
 ["dynamic-balance","net-over-steps",(s,lang)=>[s.f*s.n,s.r*s.n,s.f*s.n-s.r*s.n]],
 ["gas-exchange","symbolic-transfer",(s,lang)=>[s.a,s.t<=s.a?s.a-s.t:lang==='hi'?'संभव नहीं':'Not possible',s.t<=s.a?(lang==='hi'?'हाँ':'Yes'):(lang==='hi'?'नहीं':'No')]],
 ["plant-parts","leaf-diagram",(s,lang)=>[2*s.a+3*s.b,s.a+s.b]],
];
function* domain(fields,i=0,state={}){
 if(i===fields.length){yield state;return}
 const f=fields[i];for(let v=f.min;v<=f.max;v+=f.step)yield* domain(fields,i+1,{...state,[f.id]:v});
}
test('M73 exhaustive eight new activities in both languages',()=>{
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
 assert.equal(count,1438);
});
test('M73 eight existing review records include both languages',()=>{
 const rows=buildReviewRows();assert.equal(rows.length,3340);
 for(const [id,mode] of specs){const row=rows.find(r=>r.content_id==='advanced:'+id);const def=advancedExtension(id,mode);assert.ok(row.answer_or_guidance.includes(def.title[0]));assert.ok(row.answer_or_guidance.includes(def.title[1]));}
});
