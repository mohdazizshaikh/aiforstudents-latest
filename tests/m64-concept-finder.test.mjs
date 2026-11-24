import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,ADVANCED_MODELS,ADVANCED_SUBJECT_FILTERS,findAdvancedConcepts} from '../assets/advanced-lab-engine.js';

test('M64 discovers every advanced concept by stable ID and both title languages',()=>{
 for(const id of ADVANCED_IDS)for(const lang of ['en','hi']){
  const model=ADVANCED_MODELS[id];
  assert.ok(findAdvancedConcepts(id,model.subject,lang).some(x=>x.id===id));
  for(const title of model.title)assert.ok(findAdvancedConcepts(title.slice(0,80),model.subject,lang).some(x=>x.id===id),id);
  const r=findAdvancedConcepts(id,model.subject,lang).find(x=>x.id===id);
  assert.equal(r.gradeVerified,false);assert.equal(r.humanReviewed,false);
 }
});
test('M64 respects subject, whitespace, case, Hindi normalization and no-match behavior',()=>{
 for(const subject of ADVANCED_SUBJECT_FILTERS)for(const lang of ['en','hi']){
  assert.deepEqual(findAdvancedConcepts('  ',subject,lang),[]);
  assert.deepEqual(findAdvancedConcepts('zzzznomatchzzzz',subject,lang),[]);
  for(const q of ['ratio','cell','अनुपात','ऊर्जा','a','क']){
   const rows=findAdvancedConcepts(q,subject,lang);
   assert.ok(rows.every(r=>subject==='all'||r.subject===subject));
   assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
  }
 }
 assert.deepEqual(findAdvancedConcepts(' RATIO   ALGEBRA '),findAdvancedConcepts('ratio algebra'));
 assert.deepEqual(findAdvancedConcepts('अनुपात'.normalize('NFD')),findAdvancedConcepts('अनुपात'));
 assert.deepEqual(findAdvancedConcepts('ratio-algebra','biology'),[]);
});
test('M64 rejects unsupported inputs and does not modify catalog',()=>{
 const before=JSON.stringify(ADVANCED_MODELS);
 for(const q of [null,42,{},'x'.repeat(81)])assert.throws(()=>findAdvancedConcepts(q));
 assert.throws(()=>findAdvancedConcepts('cell','invalid'));
 assert.throws(()=>findAdvancedConcepts('cell','all','invalid'));
 findAdvancedConcepts('cell');
 assert.equal(JSON.stringify(ADVANCED_MODELS),before);
});
