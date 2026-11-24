import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,ADVANCED_MODELS,ADVANCED_SUBJECT_FILTERS,advancedSubjectOptions} from '../assets/advanced-lab-engine.js';
test('M56 four subject filters partition all 48 models with exact bilingual source titles',()=>{
 for(const lang of ['en','hi']){
  const all=advancedSubjectOptions('all',lang),parts=ADVANCED_SUBJECT_FILTERS.slice(1).flatMap(s=>advancedSubjectOptions(s,lang));
  assert.equal(all.length,48);assert.equal(new Set(parts.map(x=>x.id)).size,48);
  assert.deepEqual(parts.map(x=>x.id).sort(),[...ADVANCED_IDS].sort());
  for(const subject of ADVANCED_SUBJECT_FILTERS.slice(1))for(const r of advancedSubjectOptions(subject,lang)){
   assert.equal(r.subject,subject);assert.equal(r.subject,ADVANCED_MODELS[r.id].subject);assert.equal(r.title,ADVANCED_MODELS[r.id].title[lang==='hi'?1:0]);assert.equal(r.gradeVerified,false);assert.equal(r.humanReviewed,false);
  }
 }
 assert.throws(()=>advancedSubjectOptions('grade-6'));assert.throws(()=>advancedSubjectOptions('all','xx'));
});
