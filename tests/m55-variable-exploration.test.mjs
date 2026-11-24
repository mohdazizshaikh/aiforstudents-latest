import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS,advancedVariableComparison,calculateAdvanced,advancedResultRows} from '../assets/advanced-lab-engine.js';
const alternative=(f,v)=>f.options?f.options.find(o=>o.value!==v).value:v===f.min?f.min+f.step:f.min;
test('M55 every advanced model and control supports bilingual one-control exploration',()=>{
 for(const id of ADVANCED_IDS)for(const lang of ['en','hi']){
  const m=ADVANCED_MODELS[id],before=Object.freeze({...m.initial});
  const unchanged=advancedVariableComparison(id,before,before,lang);assert.equal(unchanged.mode,'UNCHANGED');assert.deepEqual(unchanged.comparisons,[]);
  for(const f of m.fields){
   const after={...before,[f.id]:alternative(f,before[f.id])},r=advancedVariableComparison(id,before,after,lang);
   assert.equal(r.mode,'ONE_CONTROL',id+':'+f.id);assert.equal(r.changedControls.length,1);assert.equal(r.changedControls[0].id,f.id);
   const a=advancedResultRows(calculateAdvanced(id,before),lang),b=advancedResultRows(calculateAdvanced(id,after),lang);
   if(a.length===b.length&&a.every((x,i)=>x.label===b[i].label))assert.deepEqual(r.comparisons,a.map((x,i)=>({label:x.label,before:x.value,after:b[i].value,changed:x.value!==b[i].value})));
   assert.equal(r.persists,false);assert.equal(r.usesLearnerHistory,false);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);
  }
 }
});
test('M55 multiple changed controls never show single-control comparison; invalid states fail closed',()=>{
 const m=ADVANCED_MODELS.counting,before={...m.initial},after={...before};
 for(const f of m.fields)after[f.id]=alternative(f,before[f.id]);
 const r=advancedVariableComparison('counting',before,after);assert.equal(r.mode,'MULTIPLE_CONTROLS');assert.deepEqual(r.comparisons,[]);
 assert.throws(()=>advancedVariableComparison('counting',before,{...after,student:'synthetic'}));assert.throws(()=>advancedVariableComparison('unknown',{},{}));assert.throws(()=>advancedVariableComparison('counting',before,after,'xx'));
 const app=readFileSync(new URL('../assets/advanced-lab-app.js',import.meta.url),'utf8');assert.match(app,/variableBaseline=null;render\(\)/);assert.doesNotMatch(app,/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});
