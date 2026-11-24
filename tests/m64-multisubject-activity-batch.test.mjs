import test from 'node:test';
import assert from 'node:assert/strict';
import {supplementalModes,supplementalActivity,evaluateSupplementalActivity} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const cases=[["triangle-area","parallelogram",s=>[s.b*s.h]],
["triangle-area","trapezium",s=>[(s.a+s.b)*s.h/2]],
["force-motion","momentum",s=>[s.m*s.v]],
["force-motion","opposing-forces",s=>[s.r-s.l]],
["atom-count","co2",s=>[s.n,2*s.n,3*s.n]],
["atom-count","nh3",s=>[s.n,3*s.n,4*s.n]],
["mass-fraction","complement-percent",s=>[100*s.a/(s.a+s.b),100*s.b/(s.a+s.b),100]],
["mass-fraction","three-components",s=>[s.a+s.b+s.c,100*s.a/(s.a+s.b+s.c)]],
["cell-scale","reverse-scale",s=>[1000*s.d/s.l]],
["cell-scale","compare-drawings",s=>[s.l*s.a/1000,s.l*s.b/1000]],
["cell-doubling","net-increase",s=>[s.n*2**s.r,s.n*(2**s.r-1)]],
["cell-doubling","two-intervals",s=>[s.n*2**s.a,s.n*2**(s.a+s.b)]]];
function* states(fields,i=0,state={}){
 if(i===fields.length){yield {...state};return}
 const f=fields[i];for(let v=f.min;v<=f.max;v+=f.step){state[f.id]=v;yield* states(fields,i+1,state)}
}
test('M64 twelve supplemental activities across six existing records, 4204 bilingual exhaustive cases',()=>{
 let count=0;for(const [id,mode,expected] of cases){
  assert.ok(supplementalModes(id).includes(mode));
  const m=supplementalActivity(id,mode);
  for(const s of states(m.fields))for(const lang of ['en','hi']){
   const r=evaluateSupplementalActivity(id,mode,s,lang);assert.deepEqual(r.rows.map(x=>Number(x.value)),expected(s).map(x=>Number(x.toFixed(4))),id+':'+mode);
   assert.equal(r.reviewId,'advanced:'+id);assert.equal(r.humanReviewed,false);assert.equal(r.persists,false);assert.equal(r.masteryPrediction,false);count++;
  }
 }assert.equal(count,4204);
});
test('M64 fixed formulas and bilingual definitions serialized in canonical review packets; invalid controls rejected',()=>{
 const rows=buildReviewRows();for(const [id,mode] of cases){
  const m=supplementalActivity(id,mode),row=rows.find(r=>r.content_id==='advanced:'+id);
  assert.ok(row.answer_or_guidance.includes(JSON.stringify(m)));
  assert.throws(()=>evaluateSupplementalActivity(id,mode,{...m.initial,student:'synthetic'}));
  assert.throws(()=>evaluateSupplementalActivity(id,mode,{...m.initial,[m.fields[0].id]:m.fields[0].max+1}));
 }
 assert.deepEqual(supplementalModes('counting'),[]);assert.throws(()=>supplementalActivity('counting','co2'));assert.throws(()=>evaluateSupplementalActivity('atom-count','co2',{n:1},'xx'));
});
