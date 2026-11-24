/** M86 exhaustive fixed fictional evidence grid. Never an empirical study or learner classifier. */
import {syntheticCandidate} from './synthetic-mastery-calibration.mjs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const TASKS=Object.freeze(['a','b'].flatMap(c=>Array.from({length:5},(_,i)=>Object.freeze({taskId:'mock-'+c+(i+1),context:c,session:i%2?'mock-s2':'mock-s1'}))));
const flags=()=>({syntheticOnly:true,masteryValidated:false,masteryEnabled:false,independentStudyCompleted:false,humanApprovalAuthenticated:false,publicReleaseApproved:false,empiricalAccuracy:null});
const fail=error=>({valid:false,errors:[error],...flags()});
// Independent finite-grid oracle: absent=0, incorrect=1, correct=2.
// Fixed sessions alternate within each of two fictional contexts.
function oracle(digits){
 const a=digits.slice(0,5),b=digits.slice(5);
 const counts=g=>({n:g.filter(x=>x!==0).length,correct:g.filter(x=>x===2).length,both:g.some((x,i)=>x!==0&&i%2===0)&&g.some((x,i)=>x!==0&&i%2===1)});
 const x=counts(a),y=counts(b);
 if(x.n+y.n<3||!x.n||!y.n)return 'UNKNOWN';
 if(!x.both||!y.both)return 'UNKNOWN';
 return 5*x.correct>=4*x.n&&5*y.correct>=4*y.n?'SYNTHETIC_POSITIVE':'SYNTHETIC_NEGATIVE';
}
const clean=r=>r.valid===true&&r.syntheticOnly===true&&r.masteryValidated===false&&r.masteryEnabled===false&&r.humanApprovalAuthenticated===false&&r.publicReleaseApproved===false;
export function auditSyntheticMasteryGrid(){
 const counts={UNKNOWN:0,SYNTHETIC_POSITIVE:0,SYNTHETIC_NEGATIVE:0},byDistinct=Array.from({length:11},(_,distinct)=>({distinct,UNKNOWN:0,SYNTHETIC_POSITIVE:0,SYNTHETIC_NEGATIVE:0}));
 let repeatCases=0,conflictCases=0,malformedCases=0,permutationCases=0;
 for(let n=0;n<3**TASKS.length;n++){
  let v=n;const digits=TASKS.map(()=>{const d=v%3;v=Math.floor(v/3);return d});
  const events=TASKS.flatMap((t,i)=>digits[i]?[{taskId:t.taskId,session:t.session,correct:digits[i]===2}]:[]);
  const want=oracle(digits),actual=syntheticCandidate(events);
  if(!clean(actual)||actual.candidate!==want)return fail('Fixed synthetic grid mismatch');
  counts[want]++;byDistinct[events.length][want]++;
  // Every 97th grid point exercises ordering invariance and repeat handling.
  if(n%97===0){
   const reversed=syntheticCandidate([...events].reverse());
   if(!clean(reversed)||reversed.candidate!==want)return fail('Permutation changed decision');
   permutationCases++;
   if(events.length){
    const e=events[0],repeat=syntheticCandidate([...events,{...e}]);
    if(!clean(repeat)||repeat.candidate!==want)return fail('Duplicate inflated evidence');
    repeatCases++;
    for(const conflicting of [{...e,correct:!e.correct},{...e,session:e.session==='mock-s1'?'mock-s2':'mock-s1'}]){
     const r=syntheticCandidate([...events,conflicting]);
     if(!clean(r)||r.candidate!=='UNKNOWN'||r.reason!=='REPEAT_TASK_NOT_INDEPENDENT')return fail('Contradictory evidence classified');
     conflictCases++;
     const malformed={...e,studentId:'fixture-only'};
     for(const input of [[...events,conflicting,malformed],[malformed,...events,conflicting]]){
      const bad=syntheticCandidate(input);
      if(bad.valid!==false||bad.candidate!=='UNKNOWN'||bad.reason!=='INVALID_SYNTHETIC_INPUT'||bad.masteryEnabled!==false)return fail('Malformed input masked by conflict');
      malformedCases++;
     }
    }
   }
  }
 }
 return {schema:'aifs-m86-synthetic-mastery-grid-v1',valid:true,errors:[],gridCases:3**TASKS.length,counts,byDistinct,repeatCases,conflictCases,malformedCases,permutationCases,...flags()};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{if(process.argv.length!==2)throw Error('Fixed synthetic cases only');const r=auditSyntheticMasteryGrid();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}catch{console.error('Synthetic audit failed');process.exitCode=1}
}
