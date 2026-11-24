import test from 'node:test';
import assert from 'node:assert/strict';
import {BASIC_PRINT_IDS,TEACHER_LAB_SUBJECTS,teacherPrintableOptions,teacherAnyLabPlan,teacherDemoAgenda,teacherAgendaRows,printableDemoAgenda,DEMO_AGENDA_LIMIT} from '../assets/teacher-cards-engine.js';
test('M76 all 60 source-bound bilingual demonstration choices',()=>{
 for(const lang of ['en','hi']){
  const all=TEACHER_LAB_SUBJECTS.flatMap(s=>teacherPrintableOptions(s,lang));assert.equal(all.length,60);
  for(const x of all){
   const r=teacherAnyLabPlan(x.subject,x.id,lang),[row]=teacherAgendaRows([x.id],lang);
   assert.equal(r.title,x.title);assert.equal(r.caveat,x.caveat);assert.equal(row.href,r.href);assert.equal(row.position,1);assert.ok(row.prompt&&row.hint);
   assert.equal(r.humanReviewed,false);assert.equal(r.storesStudentData,false);assert.equal(r.publicReleaseApproved,false);
   if(BASIC_PRINT_IDS.includes(x.id)){
    const kind=x.id.split('/')[0];assert.equal(r.href,'?demo='+encodeURIComponent(x.id)+'#'+({science:'science-lab',maths:'math-workshop',studio:'smart-studio'}[kind]));
   }else assert.equal(r.href,'?advanced='+x.id+'#advanced-labs');
   const paper=printableDemoAgenda([x.id],lang);assert.equal(paper.items[0].title,r.title);assert.equal(Object.hasOwn(paper.items[0],'hint'),false);assert.equal(paper.hasStudentNames,false);
  }
 }
});
test('M76 mixed agenda remains bounded, transient and rejects arbitrary data',()=>{
 const ids=['maths/rectangle','ratio-algebra','science/cells','studio/circuit-path'];
 let agenda=[];for(const id of ids)agenda=teacherDemoAgenda(agenda,{type:'add',id});assert.deepEqual(agenda,ids);
 assert.deepEqual(teacherDemoAgenda(agenda,{type:'up',id:ids[3]}),[ids[0],ids[1],ids[3],ids[2]]);
 assert.deepEqual(teacherDemoAgenda(agenda,{type:'clear'}),[]);
 const full=BASIC_PRINT_IDS.slice(0,DEMO_AGENDA_LIMIT);assert.deepEqual(teacherDemoAgenda(full,{type:'add',id:'ratio-algebra'}),full);
 assert.throws(()=>teacherDemoAgenda(agenda,{type:'add',id:'science/unknown'}));
 assert.throws(()=>teacherDemoAgenda(agenda,{type:'add',id:ids[0],student:'fake'}));
 assert.throws(()=>teacherAnyLabPlan('biology','maths/rectangle'));
 assert.throws(()=>teacherAnyLabPlan('maths','maths/rectangle','xx'));
});
