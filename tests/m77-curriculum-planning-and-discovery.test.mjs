import test from 'node:test';
import assert from 'node:assert/strict';
import {curriculumPlanningReport} from '../tools/curriculum-planning-workbench.mjs';
import {TEACHER_LAB_SUBJECTS,TEACHER_ACTIVITY_KINDS,teacherActivityChoices,labPackKeys,printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
test('M77 inventory has exactly 96 planning cells, 32 proposals, 180 pending checks and no approval',()=>{
 const r=curriculumPlanningReport();
 assert.equal(r.planningCells,96);assert.equal(r.withProposals+r.withoutProposals,96);assert.equal(r.proposalCount,32);assert.equal(r.pendingChecks,180);assert.equal(r.mainModels,60);assert.equal(r.printableActivities,109);
 assert.equal(r.cells.reduce((n,x)=>n+x.proposalCount,0),32);assert.equal(r.cells.reduce((n,x)=>n+x.pendingChecks,0),180);
 assert.equal(new Set(r.cells.map(x=>[x.board,x.grade,x.subject].join('|'))).size,96);
 assert.equal(r.proposals.filter(x=>x.board==='CBSE').length,22);assert.equal(r.proposals.filter(x=>x.board==='Maharashtra').length,10);
 assert.ok(r.proposals.every(x=>x.verified===false&&x.reviewStatus==='PENDING'&&/^[a-f0-9]{64}$/.test(x.mappingSha256)&&/^[a-f0-9]{64}$/.test(x.reviewRef.sha256)));
 assert.ok(r.cells.every(x=>x.verifiedChapters===0));assert.ok(r.models.every(x=>x.gradeVerified===false));
 assert.equal(r.verifiedChapters,0);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
 assert.equal(r.reviewPriority.reduce((n,x)=>n+x.pendingChecks,0),180);
 assert.deepEqual(curriculumPlanningReport(),r);
});
test('M77 bilingual fixed type discovery covers every activity and rejects invalid filters',()=>{
 for(const lang of ['en','hi']){
  const all=TEACHER_LAB_SUBJECTS.flatMap(s=>teacherActivityChoices(s,'all',lang));
  assert.equal(all.length,109);assert.deepEqual(all.map(x=>x.key).sort(),labPackKeys().sort());
  for(const [kind,count] of [['basic',12],['advanced',48],['supplement',49]]){
   const found=TEACHER_LAB_SUBJECTS.flatMap(s=>teacherActivityChoices(s,kind,lang));assert.equal(found.length,count);
   assert.ok(found.every(x=>x.kind===kind&&x.humanReviewed===false&&x.gradeVerified===false&&x.publicReleaseApproved===false));
   for(const x of found)assert.equal(x.title,printableAnyLabActivity(x.id,x.mode,lang).title);
  }
 }
 assert.equal(TEACHER_ACTIVITY_KINDS.length,4);
 assert.throws(()=>teacherActivityChoices('unknown'));assert.throws(()=>teacherActivityChoices('maths','fake'));assert.throws(()=>teacherActivityChoices('maths','all','xx'));
});
