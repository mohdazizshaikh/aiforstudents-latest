import test from 'node:test';
import assert from 'node:assert/strict';
import {syntheticCandidate,runSyntheticCalibration} from '../tools/synthetic-mastery-calibration.mjs';
const full=()=>['a','b'].flatMap(c=>Array.from({length:5},(_,i)=>({taskId:'mock-'+c+(i+1),session:i%2?'mock-s2':'mock-s1',correct:true})));
test('M60 exact 80 percent boundary in each context, not average across contexts',()=>{
 const rows=full();rows[0].correct=false;rows[5].correct=false;
 assert.equal(syntheticCandidate(rows).candidate,'SYNTHETIC_POSITIVE');
 rows[1].correct=false;rows[5].correct=true;
 assert.equal(syntheticCandidate(rows).candidate,'SYNTHETIC_NEGATIVE');
 assert.equal(syntheticCandidate(rows).masteryValidated,false);
});
test('M60 missing distinct tasks, missing sessions, insufficient context coverage and repeated tasks abstain',()=>{
 const r=full();
 for(const rows of [[],r.slice(0,2),r.slice(0,5),r.map(x=>({...x,session:'mock-s1'})),r.map(x=>({...x,session:x.taskId.startsWith('mock-a')?'mock-s1':'mock-s2'})),[...r,{...r[0],session:'mock-s2'}],[...r,{...r[0],correct:false}]]){
  const x=syntheticCandidate(rows);assert.equal(x.valid,true);assert.equal(x.candidate,'UNKNOWN');
 }
 assert.equal(syntheticCandidate([...r,r[0],r[0]]).candidate,'SYNTHETIC_POSITIVE');
});
test('M60 only fictional task IDs and exact fields accepted; no actual learner input',()=>{
 for(const rows of [null,{},[...full(),{...full()[0],studentId:'synthetic'}],[{taskId:'advanced:counting',session:'mock-s1',correct:true}],[{...full()[0],session:'real-session'}],[{...full()[0],correct:1}],Array(41).fill(full()[0])]){
  const x=syntheticCandidate(rows);assert.equal(x.valid,false);assert.equal(x.candidate,'UNKNOWN');
 }
});
test('M60 fixed calibration confusion matrix and abstentions do not claim empirical efficacy',()=>{
 const r=runSyntheticCalibration();assert.equal(r.totalFixtures,8);assert.equal(r.classified,4);
 assert.deepEqual(r.counts,{truePositive:1,falsePositive:1,trueNegative:1,falseNegative:1,abstentions:4});
 assert.deepEqual(r.fixtureRates,{falsePositiveRate:0.5,falseNegativeRate:0.5,abstentionRate:0.5});
 assert.equal(r.empiricalAccuracy,null);assert.equal(r.confidenceInterval,null);
 for(const k of ['masteryValidated','masteryEnabled','humanApprovalAuthenticated','publicReleaseApproved','independentStudyCompleted'])assert.equal(r[k],false);
});
