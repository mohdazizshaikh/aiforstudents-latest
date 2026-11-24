import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {printableDemoAgenda} from '../assets/teacher-cards-engine.js';
test('M62 agenda paper sequence contains only ordered titles, prompts and caveats in both languages',()=>{
 for(const lang of ['en','hi'])for(let i=0;i<ADVANCED_IDS.length;i+=8){
  const ids=ADVANCED_IDS.slice(i,i+8).reverse(),r=printableDemoAgenda(ids,lang),l=lang==='hi'?1:0;
  assert.deepEqual(r.items.map(x=>x.id),ids);assert.equal(r.humanReviewed,false);assert.equal(r.hasStudentNames,false);
  for(const [j,x] of r.items.entries()){assert.deepEqual(Object.keys(x).sort(),['position','id','title','prompt','caveat'].sort());assert.equal(x.position,j+1);assert.equal(x.prompt,ADVANCED_MODELS[x.id].prompt[l]);assert.equal(x.caveat,ADVANCED_MODELS[x.id].caveat[l])}
 }
});
test('M62 rejects duplicate, unknown, oversized agenda and unsupported language',()=>{
 assert.throws(()=>printableDemoAgenda(['counting','counting']));assert.throws(()=>printableDemoAgenda(['unknown']));assert.throws(()=>printableDemoAgenda(ADVANCED_IDS.slice(0,9)));assert.throws(()=>printableDemoAgenda([],'xx'));
});
