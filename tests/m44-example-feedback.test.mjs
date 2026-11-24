import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS,evaluateAdvanced,advancedExampleFeedback} from '../assets/advanced-lab-engine.js';
test('M44 example comparison matches current model check for every authored initial and target state in both languages',()=>{
 for(const id of ADVANCED_IDS)for(const lang of ['en','hi'])for(const state of [ADVANCED_MODELS[id].initial,ADVANCED_MODELS[id].target]){
  const r=advancedExampleFeedback(id,state,lang),m=ADVANCED_MODELS[id];
  assert.equal(r.exampleMatches,evaluateAdvanced(id,state,lang).correct);
  assert.equal(r.fields.length,m.fields.length);assert.equal(r.masteryPrediction,false);assert.equal(r.usesHistory,false);assert.equal(r.persists,false);assert.equal(r.declinable,true);assert.equal(r.publicReleaseApproved,false);
  assert.equal(r.next.fieldId,r.fields.find(f=>f.kind==='compare')?.id??null);
  for(const f of r.fields){assert.ok(f.label&&f.current);if(f.kind==='explore')assert.equal(f.example,null);else assert.equal(f.kind==='matches',state[f.id]===m.target[f.id]);}
 }
});
test('M44 independently variable probability and sound controls are never counted against the authored example',()=>{
 for(const [id,keys] of [['probability',['seed','draws']],['sound',['amplitude']]]){
  const m=ADVANCED_MODELS[id],state={...m.target};for(const k of keys){const f=m.fields.find(x=>x.id===k);state[k]=f.min;}
  const r=advancedExampleFeedback(id,state);
  assert.equal(r.exampleMatches,true);assert.equal(r.next.fieldId,null);
  assert.deepEqual(r.fields.filter(f=>f.kind==='explore').map(f=>f.id).sort(),[...keys].sort());
 }
});
test('M44 malformed model state fails closed and changing values clears optional comparison',()=>{
 assert.throws(()=>advancedExampleFeedback('counting',{a:2,b:3,name:'synthetic'}));
 assert.throws(()=>advancedExampleFeedback('counting',{a:99,b:3}));
 assert.throws(()=>advancedExampleFeedback('unknown',{}));
 assert.throws(()=>advancedExampleFeedback('counting',{a:2,b:3},'xx'));
 const app=readFileSync(new URL('../assets/advanced-lab-app.js',import.meta.url),'utf8');
 assert.match(app,/feedback=null;comparisonOpen=false;render\(\)/);
 assert.match(app,/aifs-history-cleared/);assert.doesNotMatch(app,/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});
