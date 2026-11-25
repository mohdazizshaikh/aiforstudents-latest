/** M124 subject-scoped, source-bound private review batches; never approval. */
import {createHash} from 'node:crypto';
import {mkdirSync,lstatSync,openSync,fstatSync,readFileSync,writeFileSync,closeSync,constants} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {prototypeReviewInventory,makePrototypeReviewWorklist,validatePrototypeReviewWorklist} from './prototype-review-worklist.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
export const REVIEW_SUBJECTS=Object.freeze(['maths','physics','chemistry','biology']);
const schema='aifs-m124-subject-review-v1';
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const flags=()=>({humanApprovalAuthenticated:false,rightsAuthenticated:false,independentReferencesAuthenticated:false,publicReleaseApproved:false});
const exact=(x,ks)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===ks.length&&ks.every(k=>Object.hasOwn(x,k));
function context(){
 const full=makePrototypeReviewWorklist(),inventory=prototypeReviewInventory();
 const groups=Object.fromEntries(REVIEW_SUBJECTS.map(s=>[s,inventory.filter(x=>x.subject===s).map(x=>x.key)]));
 const all=Object.values(groups).flat();
 if(all.length!==full.records.length||new Set(all).size!==all.length||full.records.some(x=>!all.includes(x.key)))throw Error('Subject inventory mismatch');
 return {full,groups};
}
function template(subject,c){
 if(!REVIEW_SUBJECTS.includes(subject))throw Error('Invalid review subject');
 const keys=c.groups[subject],records=c.full.records.filter(x=>keys.includes(x.key));
 return {schema,subject,inventorySha256:c.full.inventorySha256,batchSha256:hash([subject,c.full.inventorySha256,keys]),...flags(),records};
}
export function makeSubjectReviewBatch(subject){return template(subject,context())}
function validate(batch,c){
 const invalid=reason=>({valid:false,reason,...flags()});
 if(!exact(batch,['schema','subject','inventorySha256','batchSha256',...Object.keys(flags()),'records'])||batch.schema!==schema||!REVIEW_SUBJECTS.includes(batch.subject)||Object.keys(flags()).some(k=>batch[k]!==false))return invalid('INVALID_BATCH');
 const expected=template(batch.subject,c),keys=c.groups[batch.subject];
 if(batch.inventorySha256!==expected.inventorySha256||batch.batchSha256!==expected.batchSha256||!Array.isArray(batch.records)||batch.records.length!==keys.length||new Set(batch.records.map(x=>x?.key)).size!==keys.length||batch.records.some(x=>!keys.includes(x?.key)))return invalid('INVALID_OR_STALE_BATCH');
 const byKey=new Map(batch.records.map(x=>[x.key,x]));
 const r=validatePrototypeReviewWorklist({...c.full,records:c.full.records.map(x=>byKey.get(x.key)??x)});
 if(!r.valid)return invalid(r.reason);
 return {valid:true,subject:batch.subject,models:keys.length,totalCriteria:keys.length*8,criteriaDecided:r.criteriaDecided,pendingCriteria:keys.length*8-r.criteriaDecided,totalCases:keys.length*2,casesDecided:r.casesDecided,pendingCases:keys.length*2-r.casesDecided,readyForIndependentAudit:r.readyForIndependentAudit,needsRevision:r.needsRevision,...flags()};
}
export function validateSubjectReviewBatch(batch){return validate(batch,context())}
export function reconcileSubjectReviewBatches(batches){
 const c=context(),invalid=reason=>({valid:false,reason,...flags()});
 if(!Array.isArray(batches)||batches.length>REVIEW_SUBJECTS.length)return invalid('INVALID_BATCH_LIST');
 const seen=new Set(),records=new Map(),summaries=[];
 for(const b of batches){
  const result=validate(b,c);if(!result.valid)return invalid(result.reason);
  if(seen.has(b.subject))return invalid('DUPLICATE_SUBJECT');
  seen.add(b.subject);summaries.push(result);
  for(const r of b.records){if(records.has(r.key))return invalid('DUPLICATE_RECORD');records.set(r.key,r)}
 }
 const merged={...c.full,records:c.full.records.map(r=>records.get(r.key)??r)},report=validatePrototypeReviewWorklist(merged);
 if(!report.valid)return invalid(report.reason);
 return {...report,receivedSubjects:REVIEW_SUBJECTS.filter(s=>seen.has(s)),missingSubjects:REVIEW_SUBJECTS.filter(s=>!seen.has(s)),allSubjectsSubmitted:seen.size===REVIEW_SUBJECTS.length,subjectSummaries:summaries,...flags()};
}
function evidencePath(name){
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use simple JSON filename under review-evidence');
 const dir=path.join(ROOT,'review-evidence');mkdirSync(dir,{recursive:true,mode:0o700});const st=lstatSync(dir);
 if(!st.isDirectory()||st.isSymbolicLink())throw Error('Invalid evidence directory');
 return path.join(dir,name);
}
function read(name){const fd=openSync(evidencePath(name),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);try{const st=fstatSync(fd);if(!st.isFile()||st.size>1024*1024)throw Error('Invalid evidence file');return JSON.parse(readFileSync(fd,'utf8'))}finally{closeSync(fd)}}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{
 const [action,...args]=process.argv.slice(2);let r;
 if(action==='--summary'&&!args.length)r=reconcileSubjectReviewBatches([]);
 else if(action==='--template'&&args.length===2){const b=makeSubjectReviewBatch(args[0]);writeFileSync(evidencePath(args[1]),JSON.stringify(b,null,2)+'\n',{flag:'wx',mode:0o600});r=validateSubjectReviewBatch(b)}
 else if(action==='--check'&&args.length===1)r=validateSubjectReviewBatch(read(args[0]));
 else if(action==='--reconcile'&&args.length<=4)r=reconcileSubjectReviewBatches(args.map(read));
 else throw Error('Invalid command');
 console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1;
 }catch{console.error('Prototype subject review batches failed; check local inputs and current source version');process.exitCode=1}
}
