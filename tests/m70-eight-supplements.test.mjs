import test from 'node:test';
import assert from 'node:assert/strict';
import {advancedExtension,advancedExtensionIds,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const specs=[
 ['quadratic','shift',s=>[(s.x-s.h)**2,s.h,Math.abs(s.x-s.h)]],
 ['arithmetic-sequence','sum',s=>{const terms=Array.from({length:s.n},(_,i)=>s.a+i*s.d);return [terms.at(-1),terms.reduce((a,b)=>a+b,0)]}],
 ['constant-acceleration','initial-speed',s=>{const v=s.u+s.a*s.t;return [v,(v+s.u)*s.t/2]}],
 ['sound','period-compare',(s,lang)=>[Number((1000/s.a).toFixed(3)),Number((1000/s.b).toFixed(3)),s.a===s.b?(lang==='hi'?'समान':'Equal'):s.a<s.b?'A':'B']],
 ['atom-count','two-formulas',s=>[s.w+s.w,s.c,s.w+s.c+s.c,s.w*3+s.c*3]],
 ['ion-charge','mass-number',s=>[s.p,s.p+s.n]],
 ['cell-scale','reverse-scale',s=>[s.h*100,Number((s.mm*1000/(s.h*100)).toFixed(2))]],
 ['dna-complement','pair-count',s=>[s.at+s.gc,s.at,s.at,s.gc,s.gc,s.at+s.at+s.gc+s.gc]]
];
function* domain(fields,i=0,state={}){
 if(i===fields.length){yield state;return}
 const f=fields[i];for(let v=f.min;v<=f.max;v+=f.step)yield* domain(fields,i+1,{...state,[f.id]:v});
}
test('M70 exhaustive eight new activities in both languages',()=>{
 let count=0;
 for(const [id,mode,expected] of specs){
  const model=advancedExtension(id,mode);
  assert.deepEqual(advancedExtensionIds(id),[mode]);
  for(const state of domain(model.fields))for(const lang of ['en','hi']){
   const result=evaluateAdvancedExtension(id,mode,state,lang);
   assert.deepEqual(result.rows.map(r=>r.value),expected(state,lang).map(String));
   assert.equal(result.humanReviewed,false);assert.equal(result.publicReleaseApproved,false);assert.equal(result.persists,false);assert.equal(result.masteryPrediction,false);count++;
  }
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...model.initial,[model.fields[0].id]:model.fields[0].max+1}));
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...model.initial,student:'synthetic'}));
 }
 assert.equal(count,1684);
});
test('M70 all eight supplemental source definitions are attached to existing review rows',()=>{
 const rows=buildReviewRows();assert.equal(rows.length,3340);
 for(const [id,mode] of specs){
  const row=rows.find(r=>r.content_id==='advanced:'+id);
  const def=advancedExtension(id,mode);
  assert.ok(row.answer_or_guidance.includes(def.title[0]));
  assert.ok(row.answer_or_guidance.includes(def.title[1]));
 }
});
