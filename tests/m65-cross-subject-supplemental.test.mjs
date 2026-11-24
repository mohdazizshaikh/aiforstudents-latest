import test from 'node:test';
import assert from 'node:assert/strict';
import {advancedExtensionIds,advancedExtension,evaluateAdvancedExtension,evaluateRatioExtension,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
const val=r=>r.rows.map(x=>x.value);
test('M65 exhaustive four-subject model calculations in both languages',()=>{
 let count=0;
 for(const lang of ['en','hi']){
  const yes=lang==='en'?'Yes':'हाँ',no=lang==='en'?'No':'नहीं';
  for(let m=-3;m<=3;m++)for(let b=-3;b<=3;b++)for(let x=-5;x<=5;x++){assert.deepEqual(val(evaluateAdvancedExtension('coordinate','linear',{m,b,x},lang)),[m*x+b,b,m].map(String));count++}
  for(let right=0;right<=8;right++)for(let left=0;left<=8;left++){const r=val(evaluateAdvancedExtension('force-motion','net',{right,left},lang));assert.equal(r[0],String(right-left));assert.equal(r[1],lang==='en'?(right===left?'Zero net force':right>left?'Right':'Left'):(right===left?'शून्य परिणामी बल':right>left?'दाईं ओर':'बाईं ओर'));count++}
  for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=0;c<=12;c++){assert.deepEqual(val(evaluateAdvancedExtension('mass-balance','missing',{a,b,c},lang)),[String(a+b),a+b>=c?String(a+b-c):lang==='en'?'Not possible':'संभव नहीं',a+b>=c?yes:no]);count++}
  for(let start=1;start<=4;start++)for(let a=0;a<=5;a++)for(let b=0;b<=5;b++){assert.deepEqual(val(evaluateAdvancedExtension('cell-doubling','rounds',{start,a,b},lang)),[start*2**a,start*2**b,start*(2**b-2**a)].map(String));count++}
 }
 assert.equal(count,2464);
});
test('M65 extension definitions are bounded, bilingual and included in existing review records',()=>{
 const rows=buildReviewRows();
 const ids=['coordinate','force-motion','mass-balance','cell-doubling'];
 for(const id of ids){
  const modes=advancedExtensionIds(id);assert.equal(modes.length,1);
  const mode=modes[0],m=advancedExtension(id,mode);
  for(const lang of ['en','hi']){
   const r=evaluateAdvancedExtension(id,mode,m.initial,lang);
   assert.equal(r.reviewId,'advanced:'+id);assert.equal(r.humanReviewed,false);assert.equal(r.publicReleaseApproved,false);assert.equal(r.persists,false);assert.equal(r.masteryPrediction,false);
   assert.ok(r.title&&r.prompt&&r.hint&&r.caveat);
  }
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...m.initial,student:'synthetic'}));
  assert.throws(()=>evaluateAdvancedExtension(id,mode,{...m.initial,[m.fields[0].id]:m.fields[0].min-1}));
  assert.throws(()=>evaluateAdvancedExtension(id,'unknown',m.initial));
  assert.throws(()=>evaluateAdvancedExtension(id,mode,m.initial,'invalid'));
  assert.ok(rows.find(x=>x.content_id==='advanced:'+id).answer_or_guidance.includes(m.title[0]));
 }
 assert.deepEqual(advancedExtensionIds('counting'),['group-total']);
 assert.throws(()=>advancedExtensionIds('unknown-model'));
 assert.deepEqual(advancedExtensionIds('ratio-algebra'),['ratio','equation']);
 assert.deepEqual(evaluateAdvancedExtension('ratio-algebra','ratio',{a:2,b:3,k:2}),evaluateRatioExtension('ratio',{a:2,b:3,k:2}));
});
