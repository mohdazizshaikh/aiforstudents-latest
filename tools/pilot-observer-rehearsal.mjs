/** M53 local-only synthetic rehearsal checklist; real child observations remain prohibited.
 * Fixed answers only. No participant records, free text, data submission or activation path. */
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {CLASSROOM_IDS} from '../assets/classroom-engine.js';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m53-adult-only-rehearsal-v1';
const answer=['yes','no','not assessed'];
export const OBSERVER_CHECKS=Object.freeze([
 'reviewed-lesson-version-confirmed','setup-possible','instructions-understandable',
 'keyboard-or-paper-alternative','group-reasoning-supported','offline-fallback-usable','accessibility-or-safety-concern'
]);
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function makeRehearsalTemplate(lessonId){
 if(!CLASSROOM_IDS.includes(lessonId))throw Error('Unknown prototype lesson');
 return {schema,lessonId,mode:'ADULT_ONLY_SYNTHETIC_REHEARSAL',authorizedChildPilot:false,
  publicReleaseApproved:false,answers:Object.fromEntries(OBSERVER_CHECKS.map(id=>[id,'not assessed'])),followUp:'not assessed'};
}
export function checkRehearsal(data){
 const errors=[];
 const invalid=()=>({valid:false,errors,checksAssessed:0,rehearsalOutcome:'STOP',authorizedChildPilot:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!exact(data,['schema','lessonId','mode','authorizedChildPilot','publicReleaseApproved','answers','followUp'])||
 data.schema!==schema||!CLASSROOM_IDS.includes(data.lessonId)||data.mode!=='ADULT_ONLY_SYNTHETIC_REHEARSAL'||data.authorizedChildPilot!==false||data.publicReleaseApproved!==false||
 !exact(data.answers,OBSERVER_CHECKS)||!['revise','retest','stop','not assessed'].includes(data.followUp)){
  errors.push('Unexpected or approving rehearsal structure');return invalid();
 }
 if(OBSERVER_CHECKS.some(id=>!answer.includes(data.answers[id]))){errors.push('Fixed answers only');return invalid()}
 const concern=data.answers['accessibility-or-safety-concern'];
 const assessed=OBSERVER_CHECKS.filter(id=>data.answers[id]!=='not assessed').length;
 const stop=concern==='yes'||data.followUp==='stop';
 if(concern==='yes'&&data.followUp!=='stop'){errors.push('A safety or accessibility concern requires stop and approved escalation');return invalid()}
 const needsRevision=OBSERVER_CHECKS.some(id=>id!=='accessibility-or-safety-concern'&&data.answers[id]==='no');
 if(needsRevision&&!stop&&!['revise','retest'].includes(data.followUp)){errors.push('Observed defect requires revise, retest or stop');return invalid()}
 return {valid:true,errors,checksAssessed:assessed,
  rehearsalOutcome:stop?'STOP':needsRevision?'REVISE_OR_RETEST':assessed===OBSERVER_CHECKS.length?'ADULT_REHEARSAL_CHECKLIST_FILLED':'INCOMPLETE',
  authorizedChildPilot:false,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
const output=name=>{
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 return path.join(ROOT,'review-evidence',name);
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,name,lesson,...extra]=process.argv.slice(2);
  if(extra.length||!['--template','--check'].includes(action)||action==='--check'&&lesson!==undefined)throw Error('Use --template <filename> <lessonId> or --check <filename>');
  const file=output(name);
  if(action==='--template'){
   const data=makeRehearsalTemplate(lesson);mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(data,null,2)+'\n',{encoding:'utf8',flag:'wx'});
   console.log(JSON.stringify({checks:OBSERVER_CHECKS.length,allNotAssessed:true,authorizedChildPilot:false}));
  }else{
   if(statSync(file).size>65536)throw Error('Rehearsal file too large');
   const r=checkRehearsal(JSON.parse(readFileSync(file,'utf8')));console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1;
  }
 }catch(e){console.error(e.message);process.exitCode=1}
}
