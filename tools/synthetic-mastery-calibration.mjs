/** M60 synthetic-only calibration of the disabled M34 mastery hypothesis.
 * Fixed artificial tasks and outcomes; no student input, actual assessment or activation. */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const contract=JSON.parse(readFileSync(new URL('../docs/M34_B2_DESIGN_CONTRACT.json',import.meta.url),'utf8')).mastery;
const pool=Object.freeze([
 {id:'mock-a1',context:'a'},{id:'mock-a2',context:'a'},{id:'mock-a3',context:'a'},{id:'mock-a4',context:'a'},{id:'mock-a5',context:'a'},
 {id:'mock-b1',context:'b'},{id:'mock-b2',context:'b'},{id:'mock-b3',context:'b'},{id:'mock-b4',context:'b'},{id:'mock-b5',context:'b'}
].map(Object.freeze));
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const flags={syntheticOnly:true,masteryValidated:false,masteryEnabled:false,humanApprovalAuthenticated:false,publicReleaseApproved:false};
const abstain=reason=>({valid:true,candidate:'UNKNOWN',reason,...flags});
/** Only fixed fictional task IDs, two fictional sessions, binary outcome. Repeated task attempts do
 * not inflate evidence; conflicting repeat observations conservatively cause abstention. */
export function syntheticCandidate(events){
 if(contract.enabled!==false||contract.validated!==false||contract.highStakesUse!==false)throw Error('Disabled contract changed; review required');
 if(!Array.isArray(events)||events.length>40)return {...abstain('INVALID_SYNTHETIC_INPUT'),valid:false};
 // Validate the entire input before interpreting repeat conflicts; malformed trailing
 // records cannot be masked by an earlier valid conflict.
 for(const e of events){
  if(!exact(e,['taskId','session','correct'])||!pool.some(t=>t.id===e.taskId)||!['mock-s1','mock-s2'].includes(e.session)||typeof e.correct!=='boolean')return {...abstain('INVALID_SYNTHETIC_INPUT'),valid:false};
 }
 const unique=new Map();
 for(const e of events){
  const old=unique.get(e.taskId);
  if(old&&(old.session!==e.session||old.correct!==e.correct))return abstain('REPEAT_TASK_NOT_INDEPENDENT');
  unique.set(e.taskId,e);
 }
 const distinct=[...unique.values()],contexts=new Set(distinct.map(e=>pool.find(t=>t.id===e.taskId).context)),sessions=new Set(distinct.map(e=>e.session));
 if(distinct.length<contract.minimumDistinctTasks||contexts.size<contract.minimumContexts||sessions.size<contract.minimumSessions)return abstain('INSUFFICIENT_DISTINCT_EVIDENCE');
 // Conservative synthetic interpretation: each context must be represented in both fictional sessions.
 // This is an additional provisional policy, not an empirical threshold or proof of temporal separation.
 const perContext=[...contexts].map(context=>{
  const rows=distinct.filter(e=>pool.find(t=>t.id===e.taskId).context===context);
  return {context,total:rows.length,correct:rows.filter(e=>e.correct).length,sessions:new Set(rows.map(e=>e.session)).size};
 });
 if(perContext.some(x=>x.sessions<contract.minimumSessions))return abstain('INSUFFICIENT_CONTEXT_SESSION_COVERAGE');
 const positive=perContext.every(x=>100*x.correct>=contract.candidateThresholdPercent*x.total);
 return {valid:true,candidate:positive?'SYNTHETIC_POSITIVE':'SYNTHETIC_NEGATIVE',reason:'HYPOTHESIS_ONLY',...flags};
}
const full=()=>pool.map((t,i)=>({taskId:t.id,session:i%2?'mock-s2':'mock-s1',correct:true}));
const miss=(...ids)=>full().map(e=>ids.includes(e.taskId)?{...e,correct:false}:e);
/** Fixed invented transfer outcomes; not observations or a population estimate. No caller input. */
export function runSyntheticCalibration(){
 const cases=[
  ['mock-true-positive',miss('mock-a1','mock-b1'),true],
  ['mock-false-positive',full(),false],
  ['mock-true-negative',miss('mock-a1','mock-a2'),false],
  ['mock-false-negative',miss('mock-b1','mock-b2'),true],
  ['mock-abstain-few',full().slice(0,2),true],
  ['mock-abstain-single-session',full().map(e=>({...e,session:'mock-s1'})),false],
  ['mock-abstain-context-session',full().map(e=>({...e,session:e.taskId.startsWith('mock-a')?'mock-s1':'mock-s2'})),true],
  ['mock-abstain-repeat',[full()[0],{...full()[0],session:'mock-s2'},...full().slice(1)],false]
 ];
 const counts={truePositive:0,falsePositive:0,trueNegative:0,falseNegative:0,abstentions:0};
 const results=cases.map(([id,events,transfer])=>{
  const r=syntheticCandidate(events);
  if(!r.valid)throw Error('Invalid fixed fixture');
  if(r.candidate==='UNKNOWN')counts.abstentions++;
  else if(r.candidate==='SYNTHETIC_POSITIVE')counts[transfer?'truePositive':'falsePositive']++;
  else counts[transfer?'falseNegative':'trueNegative']++;
  return {fixture:id,candidate:r.candidate,fictionalTransferOutcome:transfer,reason:r.reason};
 });
 const classified=cases.length-counts.abstentions;
 const ratio=(n,d)=>d?n/d:null;
 return {totalFixtures:cases.length,classified,counts,fixtureRates:{
  falsePositiveRate:ratio(counts.falsePositive,counts.falsePositive+counts.trueNegative),
  falseNegativeRate:ratio(counts.falseNegative,counts.falseNegative+counts.truePositive),
  abstentionRate:ratio(counts.abstentions,cases.length)
 },results,empiricalAccuracy:null,confidenceInterval:null,independentStudyCompleted:false,...flags};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==2){console.error('Fixed synthetic fixtures only; no input accepted');process.exitCode=1}
 else console.log(JSON.stringify(runSyntheticCalibration(),null,2));
}
