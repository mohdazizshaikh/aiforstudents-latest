import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {teacherLabOptions,teacherLabPlan,TEACHER_LAB_SUBJECTS} from '../assets/teacher-cards-engine.js';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
test('M42 teacher subject filter exposes each advanced draft exactly once in either language',()=>{
 for(const lang of ['en','hi']){
  const all=TEACHER_LAB_SUBJECTS.flatMap(subject=>teacherLabOptions(subject,lang));
  assert.equal(all.length,ADVANCED_IDS.length);assert.equal(new Set(all.map(m=>m.id)).size,ADVANCED_IDS.length);
  for(const m of all){assert.equal(m.subject,ADVANCED_MODELS[m.id].subject);assert.equal(m.caveat,ADVANCED_MODELS[m.id].caveat[lang==='hi'?1:0]);assert.equal(m.href,'?advanced='+m.id+'#advanced-labs');assert.equal(m.humanReviewed,false);assert.equal(m.gradeVerified,false);assert.equal(m.publicReleaseApproved,false);assert.equal(teacherLabPlan(m.subject,m.id,lang).storesStudentData,false);}
 }
});
test('M42 fails closed for unknown subject, model and mismatched subject',()=>{
 for(const args of [['biology','quadratic'],['maths','https://example.org'],['fake','plant-parts'],['maths','quadratic','xx']])assert.throws(()=>teacherLabPlan(...args));
 const app=readFileSync(new URL('../assets/classroom-app.js',import.meta.url),'utf8');
 assert.match(app,/S.labId=null/);assert.match(app,/aifs-history-cleared/);assert.doesNotMatch(app,/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});
