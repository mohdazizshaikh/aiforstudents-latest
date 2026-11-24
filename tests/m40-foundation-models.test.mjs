import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateAdvanced,evaluateAdvanced,ADVANCED_MODELS,advancedResultRows} from '../assets/advanced-lab-engine.js';
test('M40 foundational arithmetic and length comparison exhaust bounded states',()=>{
 for(let a=0;a<=9;a++)for(let b=0;b<=9;b++){const r=calculateAdvanced('counting',{a,b});assert.equal(r.absoluteDifference,Math.abs(a-b));assert.equal(r.comparison,a===b?'equal':a>b?'A greater':'B greater');assert.equal(calculateAdvanced('place-value',{tens:a,ones:b}).total,10*a+b);}
 for(let a=1;a<=10;a++)for(let b=1;b<=10;b++)assert.deepEqual(calculateAdvanced('length-compare',{a,b}),{lengthA:a,lengthB:b,lengthDifference:Math.abs(a-b)});
});
test('M40 symbolic state, light and life models use fixed bounded examples',()=>{
 for(const blocker of ['none','opaque'])assert.deepEqual(calculateAdvanced('shadow-ray',{blocker}),{blocked:blocker==='opaque',shadow:blocker==='opaque'});
 for(const [example,expected] of [['ice','solid'],['water','liquid']])assert.equal(calculateAdvanced('material-state',{example}).materialState,expected);
 for(const object of ['glass','wood','paper'])assert.equal(calculateAdvanced('material-objects',{object}).material,object);
 for(const [part,expected] of [['leaf','photosynthesis example'],['root','anchorage and absorption'],['stem','support and transport']])assert.equal(calculateAdvanced('plant-parts',{part}).plantFunction,expected);
 for(const example of ['stone','plant'])assert.equal(calculateAdvanced('living-examples',{example}).organism,example==='plant');
});
test('M40 all eight examples are bilingual, draft-only and fail closed on extra state',()=>{
 for(const id of ["counting","place-value","length-compare","shadow-ray","material-state","material-objects","plant-parts","living-examples"]){
  const m=ADVANCED_MODELS[id];for(const lang of ['en','hi']){const r=evaluateAdvanced(id,m.target,lang);assert.equal(r.correct,true);assert.equal(r.publicReleaseApproved,false);assert.ok(advancedResultRows(r.metrics,lang).length>0);}
  assert.equal(evaluateAdvanced(id,m.initial).correct,false);assert.throws(()=>calculateAdvanced(id,{...m.initial,unknown:1}));
 }
});
