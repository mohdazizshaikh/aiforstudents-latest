import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS,ADVANCED_GUIDED_STAGES,advancedGuidedStage} from '../assets/advanced-lab-engine.js';
test('M58 all 480 bilingual model/stage combinations preserve exact source references and optional status',()=>{
 assert.equal(ADVANCED_IDS.length,48);assert.equal(ADVANCED_GUIDED_STAGES.length,5);
 for(const id of ADVANCED_IDS)for(const lang of ['en','hi'])for(const [index,stage] of ADVANCED_GUIDED_STAGES.entries()){
  const r=advancedGuidedStage(id,stage,lang),m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  assert.equal(r.id,id);assert.equal(r.index,index);assert.equal(r.total,5);assert.equal(r.sourcePrompt,m.prompt[i]);assert.equal(r.caveat,m.caveat[i]);
  assert.equal(r.sourceHint,stage==='explain'?m.hint[i]:null);assert.ok(r.label&&r.instruction);
  assert.equal(r.optional,true);assert.equal(r.storesResponses,false);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);
 }
});
test('M58 invalid stages fail closed and shared-device reset discards transient guided stage',()=>{
 for(const args of [['unknown','predict','en'],['counting','mastered','en'],['counting','predict','xx']])assert.throws(()=>advancedGuidedStage(...args));
 const app=readFileSync(new URL('../assets/advanced-lab-app.js',import.meta.url),'utf8');assert.match(app,/variableBaseline=null;guidedIndex=null;render\(\)/);assert.doesNotMatch(app,/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});
