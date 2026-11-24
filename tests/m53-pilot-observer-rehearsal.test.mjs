import test from 'node:test';
import assert from 'node:assert/strict';
import {makeRehearsalTemplate,checkRehearsal,OBSERVER_CHECKS} from '../tools/pilot-observer-rehearsal.mjs';
test('M53 both original lesson rehearsals start blank and cannot authorize child pilot',()=>{
 for(const id of ['fractions','circuits']){
  const t=makeRehearsalTemplate(id),r=checkRehearsal(t);
  assert.equal(r.valid,true);assert.equal(r.checksAssessed,0);assert.equal(r.rehearsalOutcome,'INCOMPLETE');assert.equal(r.authorizedChildPilot,false);
  for(const k of OBSERVER_CHECKS)t.answers[k]=k==='accessibility-or-safety-concern'?'no':'yes';
  t.followUp='retest';const full=checkRehearsal(t);
  assert.equal(full.rehearsalOutcome,'ADULT_REHEARSAL_CHECKLIST_FILLED');assert.equal(full.humanApprovalAuthenticated,false);assert.equal(full.publicReleaseApproved,false);
 }
});
test('M53 concern stops; other defects require explicit revise or retest',()=>{
 const t=makeRehearsalTemplate('fractions');
 t.answers['accessibility-or-safety-concern']='yes';assert.equal(checkRehearsal(t).valid,false);
 t.followUp='stop';assert.equal(checkRehearsal(t).rehearsalOutcome,'STOP');
 t.answers['accessibility-or-safety-concern']='no';t.answers['setup-possible']='no';t.followUp='not assessed';assert.equal(checkRehearsal(t).valid,false);
 t.followUp='revise';assert.equal(checkRehearsal(t).rehearsalOutcome,'REVISE_OR_RETEST');
});
test('M53 rejects child observations, identifiers, narrative, scores and fabricated approvals',()=>{
 for(const mutate of [x=>x.authorizedChildPilot=true,x=>x.mode='REAL_CHILD_PILOT',x=>x.publicReleaseApproved=true,x=>x.studentName='synthetic',x=>x.answers.notes='synthetic',x=>x.answers['setup-possible']='free text',x=>delete x.answers['setup-possible'],x=>x.followUp='approved']){
  const t=makeRehearsalTemplate('circuits');mutate(t);assert.equal(checkRehearsal(t).valid,false)
 }
 assert.throws(()=>makeRehearsalTemplate('unknown'));
});
