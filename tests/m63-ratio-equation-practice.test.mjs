import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_MODELS,evaluateRatioExtension,ratioExtension} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
test('M63 exhaustive positive ratio scaling and bounded integer equation substitution, both languages',()=>{
 for(const lang of ['en','hi']){
  for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let k=1;k<=5;k++){
   const r=evaluateRatioExtension('ratio',{a,b,k},lang);assert.equal(r.rows[0].value,a+':'+b);assert.equal(r.rows[1].value,a*k+':'+b*k);assert.equal(r.rows[2].value,lang==='en'?'Yes':'हाँ');assert.equal(r.humanReviewed,false);
  }
  for(let a=1;a<=5;a++)for(let b=0;b<=6;b++)for(let x=0;x<=12;x++){
   const r=evaluateRatioExtension('equation',{a,b,x},lang);assert.equal(r.rows[0].value,String(a*x+b));assert.equal(r.rows[1].value,'12');assert.equal(r.rows[2].value,a*x+b===12?(lang==='en'?'Yes':'हाँ'):(lang==='en'?'No':'नहीं'));assert.equal(r.masteryPrediction,false);assert.equal(r.persists,false);
  }
 }
});
test('M63 exact controls, no identity fields or unsupported modes, and supplemental drafts bound to canonical review record',()=>{
 for(const [mode,state] of [['ratio',{a:0,b:2,k:1}],['ratio',{a:1,b:2,k:1.5}],['equation',{a:1,b:0,x:13}],['equation',{a:1,b:0,x:2,student:'synthetic'}],['unknown',{}]])assert.throws(()=>evaluateRatioExtension(mode,state));
 assert.throws(()=>evaluateRatioExtension('ratio',ratioExtension('ratio').initial,'xx'));
 assert.ok(ADVANCED_MODELS['ratio-algebra'].extensions.equation);
 const r=buildReviewRows().find(x=>x.content_id==='advanced:ratio-algebra');assert.ok(r.answer_or_guidance.includes('Equivalent ratios'));assert.ok(r.answer_or_guidance.includes('Check a linear equation'));
});
