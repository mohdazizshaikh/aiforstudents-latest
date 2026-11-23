/** M26 — Local-only child-safeguarding operational evidence handoff.
 * This validates *structure*, not people, law, permissions, safety outcomes or public launch.
 * It never changes canonical review queues, hosting, child data or release status.
 */
import {readFileSync,writeFileSync,mkdirSync,existsSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const SCHEMA='m26-safety-handoff-v1';
export const SAFETY_GATES=Object.freeze([
  {id:'accountable-safeguarding',label:'Appoint safeguarding lead, deputy and supervised escalation coverage'},
  {id:'incident-response-drill',label:'Verify report, triage, response, evidence minimization and containment drill'},
  {id:'india-privacy-legal',label:'Receive India-relevant independent child/privacy/legal assessment'},
  {id:'shared-device-data-flow',label:'Audit production/staging logs, retention, opt-in history, reset and shared-device risks'},
  {id:'school-pilot-permissions',label:'Verify ethical school permissions, guardian process and teacher escalation'},
  {id:'independent-go-no-go',label:'Record accountable independent human go/no-go decision with unresolved gates'}
]);
const REF=/^[A-Za-z][A-Za-z0-9_.:-]{2,63}$/;
function validDate(s){
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const d=new Date(s+'T00:00:00Z');return Number.isFinite(d.valueOf())&&d.toISOString().slice(0,10)===s;
}
const str=s=>typeof s==='string'?s.trim():'';
export function makeSafetyTemplate(){
 return {
  schema:SCHEMA,notes:'Draft internal operations checklist only; not evidence of real appointments or legal review.',
  gates:SAFETY_GATES.map(g=>({id:g.id,status:'pending',
   ownerRef:'',reviewDate:'',evidenceRef:'',notes:''}))
 };
}
export function validateSafetyHandoff(data){
 const errors=[],expected=SAFETY_GATES.map(x=>x.id);
 if(!data||typeof data!=='object'||Array.isArray(data)||data.schema!==SCHEMA||!Array.isArray(data.gates))
  return {schemaValid:false,totalRequired:expected.length,documentedForHumanVerification:0,
   errors:['Invalid safety handoff schema'],humanReviewAuthenticated:false,publicReleaseApproved:false};
 if('publicReleaseApproved' in data||'approvedForChildLaunch' in data||'releaseAuthorized' in data)
  errors.push('Release-approval fields are prohibited in draft evidence');
 const found=new Set();let documented=0;
 for(const [i,g] of data.gates.entries()){
  const key='gates['+i+']';
  if(!g||typeof g!=='object'||Array.isArray(g)){errors.push(key+': item must be object');continue}
  if(!expected.includes(g.id)){errors.push(key+': unknown gate id');continue}
  if(found.has(g.id)){errors.push(key+': duplicate gate id '+g.id);continue}
  found.add(g.id);
  if('publicReleaseApproved' in g||'approval' in g)errors.push(key+': prohibited release approval field');
  if(!['pending','evidence-attached'].includes(g.status)){errors.push(key+': unknown status');continue}
  if(g.status==='pending'){
   if([g.ownerRef,g.reviewDate,g.evidenceRef,g.notes].some(x=>str(x).length))
    errors.push(key+': pending record cannot carry an implied review; choose evidence-attached or clear fields');
   continue;
  }
  const errBefore=errors.length;
  if(!REF.test(str(g.ownerRef)))errors.push(key+': use an opaque ownerRef, not a name or contact detail');
  if(!validDate(g.reviewDate))errors.push(key+': invalid reviewDate');
  if(!REF.test(str(g.evidenceRef)))errors.push(key+': evidenceRef must be an internal opaque reference');
  if(str(g.notes).length<20||str(g.notes).length>2000)errors.push(key+': notes require 20–2000 characters');
  if(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(str(g.notes)))
   errors.push(key+': do not store personal email addresses in this draft');
  if(errors.length===errBefore)documented++;
 }
 for(const id of expected)if(!found.has(id))errors.push('Missing required gate '+id);
 return {
  schemaValid:errors.length===0,totalRequired:expected.length,
  documentedForHumanVerification:documented,
  remainingWithoutEvidence:expected.length-documented,
  errors:errors.slice(0,100),totalErrors:errors.length,
  humanReviewAuthenticated:false,publicReleaseApproved:false,
  note:'Valid structure cannot authenticate operators, certify legal/privacy review or approve child-facing release.'
 };
}
export function saveSafetyTemplate(file){
 if(existsSync(file))throw Error('Refusing to overwrite private safety handoff: '+file);
 mkdirSync(path.dirname(file),{recursive:true});
 writeFileSync(file,JSON.stringify(makeSafetyTemplate(),null,2)+'\n','utf8');
 return {schema:SCHEMA,requiredGates:SAFETY_GATES.length,allPending:true,publicReleaseApproved:false};
}
export function checkSafetyFile(file){
 if(statSync(file).size>1024*1024)throw Error('Safety handoff file exceeds 1 MiB');
 return validateSafetyHandoff(JSON.parse(readFileSync(file,'utf8')));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);
 try{
  if(args.length===2&&args[0]==='--template'){
   console.log(JSON.stringify(saveSafetyTemplate(path.resolve(args[1])),null,2));
  }else if(args.length===2&&args[0]==='--check'){
   const result=checkSafetyFile(path.resolve(args[1]));
   console.log(JSON.stringify(result,null,2));
   if(!result.schemaValid)process.exitCode=1;
  }else{
   console.error('Usage: node tools/safety-handoff.mjs --template <local-file> | --check <local-file>');
   process.exitCode=2;
  }
 }catch(e){console.error(e.message);process.exitCode=2}
}
