import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {printableAssignmentPack,printableClassroomCard} from '../assets/teacher-cards-engine.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('M37 two bilingual five-step learner packs reuse exact existing questions and actions, omit teacher answers',()=>{
 for(const lesson of ['fractions','circuits'])for(const language of ['en','hi']){
  const p=printableAssignmentPack(lesson,language);
  assert.equal(p.cards.length,5);assert.equal(p.localOnly,true);assert.equal(p.humanReviewed,false);assert.equal(p.publicReleaseApproved,false);assert.equal(p.hasStudentNames,false);
  assert.equal(p.rightsStatus,'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED');
  for(let i=0;i<p.cards.length;i++){
   const c=p.cards[i],s=printableClassroomCard(lesson,i,language);
   assert.deepEqual(Object.keys(c),['stepIndex','stage','question','action']);
   assert.equal(c.question,s.question);assert.equal(c.action,s.action);assert.equal(c.stage,s.stage);assert.equal(c.stepIndex,i);
   assert.ok(!Object.hasOwn(c,'teacherGuidance'));assert.ok(!Object.hasOwn(c,'teacherSpeech'));
  }
 }
 assert.throws(()=>printableAssignmentPack('unknown'));assert.throws(()=>printableAssignmentPack('fractions','xx'));
});
test('M37 assignment controls are local and print-only, no data persistence or network',()=>{
 const html=read('teacher-kit/cards/index.html'),js=read('teacher-kit/cards/cards.js'),css=read('teacher-kit/cards/cards.css'),sw=read('service-worker.js');
 assert.match(html,/id="card-view"/);assert.match(html,/id="assignment-pack" hidden/);
 assert.match(js,/printableAssignmentPack\(lesson,l\)/);assert.match(js,/teacher-guidance'\)\.hidden=full/);
 assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|innerHTML/);
 assert.match(css,/\[hidden\]\{display:none!important\}/);assert.match(css,/break-inside:avoid/);
 assert.ok(sw.includes('./teacher-kit/cards/'));
});
