/** M89: one individually fingerprinted rights-review work item per fixed printable activity.
 * Local structural evidence only. No authenticated permission or public approval.
 */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,lstatSync,openSync,closeSync,constants} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {teacherResourceChoices,printableAnyLabActivity,labPackKeys} from '../assets/teacher-cards-engine.js';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m89-teacher-rights-v1';
export const RIGHTS_CHECKS=Object.freeze(['authorship','redistribution','attribution']);
const exact=(o,keys)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const opaque=x=>typeof x==='string'&&/^[A-Za-z0-9._-]{3,80}$/.test(x);
const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const flags=()=>({rightsAuthenticated:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
export function teacherRightsInventory(){
 const choices=teacherResourceChoices('all','all','en'),keys=labPackKeys();
 if(choices.length!==keys.length||new Set(choices.map(x=>x.key)).size!==keys.length||keys.some(k=>!choices.some(x=>x.key===k)))throw Error('Printable inventory mismatch');
 return choices.map(x=>{
  const en=printableAnyLabActivity(x.id,x.mode,'en'),hi=printableAnyLabActivity(x.id,x.mode,'hi');
  if(en.sourceFile!==hi.sourceFile||en.subject!==hi.subject||en.humanReviewed!==false||hi.humanReviewed!==false||en.publicReleaseApproved!==false||hi.publicReleaseApproved!==false)throw Error('Unexpected source state');
  return {key:x.key,subject:x.subject,kind:x.kind,sourceFile:en.sourceFile,englishSha256:hash(en),hindiSha256:hash(hi),contentSha256:hash([x.key,en,hi]),rightsStatus:'PENDING',...flags()};
 }).sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);
}
export function makeTeacherRightsWorksheet(){
 const inventory=teacherRightsInventory();
 return {schema,inventorySha256:hash(inventory),...flags(),records:inventory.map(r=>({key:r.key,contentSha256:r.contentSha256,criteria:RIGHTS_CHECKS.map(id=>({id,decision:'pending',reviewerRef:'',evidenceRef:'',reviewDate:''}))}))};
}
export function validateTeacherRightsWorksheet(data){
 const expected=makeTeacherRightsWorksheet(),byKey=new Map(expected.records.map(r=>[r.key,r]));
 const invalid=error=>({valid:false,errors:[error],readyForIndependentAudit:0,...flags()});
 if(!exact(data,['schema','inventorySha256','rightsAuthenticated','humanApprovalAuthenticated','publicReleaseApproved','records'])||data.schema!==schema||data.inventorySha256!==expected.inventorySha256||data.rightsAuthenticated!==false||data.humanApprovalAuthenticated!==false||data.publicReleaseApproved!==false||!Array.isArray(data.records)||data.records.length!==byKey.size)return invalid('Invalid or stale worksheet');
 const seen=new Set();let decided=0,ready=0,revision=0;
 for(const r of data.records){
  if(!exact(r,['key','contentSha256','criteria'])||!byKey.has(r.key)||seen.has(r.key)||r.contentSha256!==byKey.get(r.key).contentSha256||!Array.isArray(r.criteria)||r.criteria.length!==RIGHTS_CHECKS.length)return invalid('Invalid, duplicate or stale resource record');
  seen.add(r.key);const ids=new Set();let allPass=true,needsRevision=false;
  for(const c of r.criteria){
   if(!exact(c,['id','decision','reviewerRef','evidenceRef','reviewDate'])||!RIGHTS_CHECKS.includes(c.id)||ids.has(c.id)||!['pending','pass','revise','reject'].includes(c.decision))return invalid('Invalid or duplicate criterion');
   ids.add(c.id);
   if(c.decision==='pending'){if([c.reviewerRef,c.evidenceRef,c.reviewDate].some(v=>v!==''))return invalid('Pending evidence must be blank');allPass=false;continue}
   if(!opaque(c.reviewerRef)||!opaque(c.evidenceRef)||!date(c.reviewDate))return invalid('Invalid opaque evidence reference or date');
   decided++;if(c.decision!=='pass'){allPass=false;needsRevision=true}
  }
  if(allPass)ready++;if(needsRevision)revision++;
 }
 return {valid:true,errors:[],totalResources:byKey.size,totalCriteria:byKey.size*RIGHTS_CHECKS.length,decidedCriteria:decided,pendingCriteria:byKey.size*RIGHTS_CHECKS.length-decided,readyForIndependentAudit:ready,needsRevision:revision,...flags()};
}
function file(name){
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 const dir=path.join(ROOT,'review-evidence');mkdirSync(dir,{recursive:true});
 if(!lstatSync(dir).isDirectory()||lstatSync(dir).isSymbolicLink())throw Error('Invalid local evidence directory');
 return path.join(dir,name);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,name,...extra]=process.argv.slice(2);if(extra.length)throw Error('Unexpected arguments');
  if(action==='--index'&&name===undefined){const records=teacherRightsInventory();console.log(JSON.stringify({records,totalResources:records.length,...flags()},null,2))}
  else if(action==='--template'){const target=file(name),data=makeTeacherRightsWorksheet();writeFileSync(target,JSON.stringify(data,null,2)+'\n',{encoding:'utf8',flag:'wx',mode:0o600});console.log(JSON.stringify(validateTeacherRightsWorksheet(data)))}
  else if(action==='--check'){const target=file(name);if(!lstatSync(target).isFile()||lstatSync(target).isSymbolicLink()||lstatSync(target).size>1024*1024)throw Error('Invalid local evidence file');const fd=openSync(target,constants.O_RDONLY|constants.O_NOFOLLOW);let data;try{data=JSON.parse(readFileSync(fd,'utf8'))}finally{closeSync(fd)}const r=validateTeacherRightsWorksheet(data);console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}
  else throw Error('Use --index or --template|--check <filename>');
 }catch{console.error('Teacher rights worklist failed; check local arguments and file');process.exitCode=1}
}
