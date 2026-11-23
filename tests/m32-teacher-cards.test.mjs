import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CLASSROOM_IDS,CLASSROOM_LESSONS,classroomStep,CLASSROOM_ROLES} from '../assets/classroom-engine.js';
import {rotateAnonymousRole,printableClassroomCard,ROTATION_ROLES} from '../assets/teacher-cards-engine.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('M32 teacher role rotation cycles without rosters, names or remembered student identifiers',()=>{
 assert.equal(ROTATION_ROLES.length,3);
 for(let i=0;i<ROTATION_ROLES.length;i++){
  assert.equal(rotateAnonymousRole(i,1),(i+1)%ROTATION_ROLES.length);
  assert.equal(rotateAnonymousRole(i,3),i);
  assert.equal(rotateAnonymousRole(i,6),i);
 }
 for(const v of [-1,3,NaN,null,'0'])assert.throws(()=>rotateAnonymousRole(v));
 assert.throws(()=>rotateAnonymousRole(0,-1));
 const src=read('assets/classroom-app.js');
 assert.match(src,/classroom-jump/);assert.match(src,/rotateAnonymousRole/);
 assert.match(src,/classroom-step-heading'\)\.focus/);
 assert.doesNotMatch(read('assets/teacher-cards-engine.js'),/fetch\(|localStorage|sessionStorage/);
});
test('M32 each of ten existing original classroom steps yields source-based bilingual cards',()=>{
 let count=0;
 for(const id of CLASSROOM_IDS)for(let i=0;i<CLASSROOM_LESSONS[id].steps.length;i++){
  count++;
  for(const lang of ['en','hi']){
   const c=printableClassroomCard(id,i,lang),step=classroomStep(id,i);
   assert.equal(c.question,step.prompt[lang]);
   assert.equal(c.teacherGuidance,step.answer[lang]);
   assert.equal(c.action,step.action[lang]);
   assert.equal(c.approval,'PENDING');assert.equal(c.hasStudentNames,false);
   assert.equal(c.worksheetMode,'learner-only');assert.equal(c.localOnly,true);
   assert.equal(c.humanReviewed,false);assert.equal(c.quizScore,null);
  }
 }
 assert.equal(count,10);
 assert.throws(()=>printableClassroomCard('fake',0,'en'));
 assert.throws(()=>printableClassroomCard('fractions',10,'en'));
 assert.throws(()=>printableClassroomCard('fractions',0,'xx'));
});
test('M32 dedicated A4 classroom print isolates teacher answer and includes keyboard language controls',()=>{
 const html=read('teacher-kit/cards/index.html'),css=read('teacher-kit/cards/cards.css'),js=read('teacher-kit/cards/cards.js');
 for(const id of ['card-language','card-lesson','card-step','card-print','learner-card','teacher-guidance','card-question','card-action','card-answer'])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(html,/noindex,nofollow/);
 assert.match(html,/assets\/worksheet-print\.css/);
 assert.match(html,/assets\/worksheet-print\.js/);
 assert.match(css,/@media print/);
 assert.match(css,/\.teacher-notes,#teacher-guidance\{display:none!important/);
 assert.match(js,/printableClassroomCard/);
 assert.doesNotMatch(html,/<style>|<script>.*eval/);
 assert.doesNotMatch(js,/fetch\(|localStorage|sessionStorage|password|contact|analytics/);
 const sw=read('service-worker.js');
 for(const p of ['./teacher-kit/cards/','./teacher-kit/cards/cards.js','./teacher-kit/cards/cards.css'])assert.ok(sw.includes(p),p);
});
