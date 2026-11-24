import test from 'node:test';
import assert from 'node:assert/strict';
import {syntheticCandidate} from '../tools/synthetic-mastery-calibration.mjs';
import {auditSyntheticMasteryGrid} from '../tools/synthetic-mastery-grid.mjs';
test('M86 all 59049 fictional evidence patterns match independent disabled-rule oracle',()=>{
 const r=auditSyntheticMasteryGrid();assert.equal(r.valid,true,r.errors.join('; '));
 assert.equal(r.gridCases,59049);assert.equal(Object.values(r.counts).reduce((a,b)=>a+b,0),59049);
 assert.equal(r.byDistinct.length,11);
 for(const b of r.byDistinct){
  if(b.distinct<4)assert.equal(b.SYNTHETIC_POSITIVE+b.SYNTHETIC_NEGATIVE,0);
 }
 assert.equal(r.byDistinct[0].UNKNOWN,1);
 assert.equal(r.byDistinct[10].UNKNOWN,0);
 assert.equal(r.byDistinct[10].SYNTHETIC_POSITIVE,36);
 assert.equal(r.permutationCases,609);
 assert.equal(r.repeatCases,608);assert.equal(r.conflictCases,1216);assert.equal(r.malformedCases,2432);
 for(const k of ['masteryValidated','masteryEnabled','independentStudyCompleted','humanApprovalAuthenticated','publicReleaseApproved'])assert.equal(r[k],false);
 assert.equal(r.empiricalAccuracy,null);
});
test('M86 malformed trailing input cannot be hidden by a preceding contradictory repeat',()=>{
 const e={taskId:'mock-a1',session:'mock-s1',correct:true},c={...e,correct:false},bad={...e,studentId:'synthetic'};
 for(const input of [[e,c,bad],[bad,e,c],[e,bad,c]]){const r=syntheticCandidate(input);assert.equal(r.valid,false);assert.equal(r.reason,'INVALID_SYNTHETIC_INPUT');assert.equal(r.candidate,'UNKNOWN');}
 assert.equal(syntheticCandidate([e,c]).reason,'REPEAT_TASK_NOT_INDEPENDENT');
});
