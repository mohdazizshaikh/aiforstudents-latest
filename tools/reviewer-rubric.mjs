/** M45 local draft rubric for independent review. Structural validation only. */
import {buildReviewRows} from './build-review-packet.mjs';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
export const RUBRIC=Object.freeze([
 ['accuracy','Verify facts, equations, answer keys and explanations against independent subject references.'],
 ['language','Review Hindi and English meaning, clarity, scientific terminology, and equivalence.'],
 ['age','Assess prerequisites and proposed age/grade suitability without assuming verified board mapping.'],
 ['safety','Check physical, emotional, privacy and child-safeguarding limitations; reject unsafe examples.'],
 ['accessibility','Inspect keyboard use, text alternatives, language, readable print and actual assistive device evidence.'],
 ['rights','Check original authorship, applicable permissions, attribution and allowed redistribution.']
].map(([id,criterion])=>Object.freeze({id,criterion})));
const schema='aifs-m45-draft-rubric-v1';
const statuses=['pending','pass','revise','reject','not-applicable'];
const roles={accuracy:'subject',language:'language',age:'subject',safety:'safety',accessibility:'accessibility',rights:'rights'};
const opaque=/^[A-Za-z0-9._-]{3,80}$/;
const key=r=>r.queue+'|'+r.content_id;
const keys=(x,w)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===w.length&&w.every(k=>Object.hasOwn(x,k));
function dateValid(x){
 if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;
 const t=new Date(x+'T00:00:00Z');return Number.isFinite(t.valueOf())&&t.toISOString().slice(0,10)===x;
}
export function makeRubricWorklist(rows=buildReviewRows(),scope='pilot-first'){
 if(!['pilot-first','all'].includes(scope))throw Error('Unknown scope');
 return {schema,scope,publicReleaseApproved:false,rubricApproved:false,records:rows.filter(r=>scope==='all'||r.priority==='pilot-first').map(r=>({
  queue:r.queue,content_id:r.content_id,content_version:r.content_version,content_sha256:r.content_sha256,
  criteria:RUBRIC.map(({id})=>({id,role:roles[id],decision:'pending',reviewerRef:'',reviewDate:'',evidenceRef:'',rationale:''}))
 }))};
}
export function validateRubricWorklist(data,rows=buildReviewRows()){
 const errors=[];let issueCount=0,complete=0,needsRevision=0,criteriaChecked=0;
 const err=s=>{issueCount++;if(errors.length<100)errors.push(s)};
 const deny=()=>({valid:false,errors,issueCount,criteriaChecked,readyForIndependentAudit:0,needsRevision:0,humanApprovalAuthenticated:false,rubricApproved:false,publicReleaseApproved:false});
 if(!keys(data,['schema','scope','publicReleaseApproved','rubricApproved','records'])||data.schema!==schema||!['pilot-first','all'].includes(data.scope)||data.publicReleaseApproved!==false||data.rubricApproved!==false||!Array.isArray(data.records)){err('Invalid draft rubric schema');return deny()}
 const expected=makeRubricWorklist(rows,data.scope).records,byKey=new Map(expected.map(r=>[key(r),r])),seen=new Set();
 for(const r of data.records){
  if(!keys(r,['queue','content_id','content_version','content_sha256','criteria'])){err('Invalid record');continue}
  const k=key(r),e=byKey.get(k);
  if(!e||seen.has(k)){err('Unknown or duplicate record');continue}
  seen.add(k);const before=issueCount;
  if(r.content_version!==e.content_version||r.content_sha256!==e.content_sha256)err('Stale content fingerprint '+k);
  if(!Array.isArray(r.criteria)||r.criteria.length!==RUBRIC.length){err('Incomplete criteria '+k);continue}
  const ids=new Set(),reviewers=new Map();let ready=true,revision=false;
  for(const v of r.criteria){
   criteriaChecked++;
   if(!keys(v,['id','role','decision','reviewerRef','reviewDate','evidenceRef','rationale'])||!Object.hasOwn(roles,v.id)||v.role!==roles[v.id]||ids.has(v.id)||!statuses.includes(v.decision)){err('Invalid or duplicate criterion '+k);ready=false;continue}
   ids.add(v.id);
   if(v.decision==='pending'){
    if([v.reviewerRef,v.reviewDate,v.evidenceRef,v.rationale].some(s=>s!==''))err('Pending must remain blank '+k);
    ready=false;continue;
   }
   if(typeof v.reviewerRef!=='string'||typeof v.evidenceRef!=='string'||!opaque.test(v.reviewerRef)||!opaque.test(v.evidenceRef)||!dateValid(v.reviewDate)||typeof v.rationale!=='string'||v.rationale.trim().length<12||v.rationale.length>1000)err('Invalid evidence '+k+' '+v.id);
   if(v.decision==='not-applicable'&&['accuracy','language','age','safety','rights'].includes(v.id))err('Required criterion cannot be waived '+k);
   if(v.decision==='revise'||v.decision==='reject'){ready=false;revision=true}
   if(v.id==='accuracy'||v.id==='language')reviewers.set(v.id,String(v.reviewerRef).toLowerCase());
  }
  if(reviewers.has('accuracy')&&reviewers.has('language')&&reviewers.get('accuracy')===reviewers.get('language'))err('Independent subject and language reviewer refs required '+k);
  if(revision)needsRevision++;
  if(ready&&issueCount===before&&ids.size===RUBRIC.length)complete++;
 }
 for(const k of byKey.keys())if(!seen.has(k))err('Missing record '+k);
 return {valid:issueCount===0,errors,issueCount,criteriaChecked,recordsChecked:seen.size,expectedRecords:expected.length,readyForIndependentAudit:issueCount===0?complete:0,needsRevision,humanApprovalAuthenticated:false,rubricApproved:false,publicReleaseApproved:false};
}
const output=name=>{
 if(typeof name!=='string'||!/^[a-zA-Z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 return path.join(ROOT,'review-evidence',name);
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,name,scope='pilot-first',...extra]=process.argv.slice(2);if(extra.length||!['--template','--check'].includes(action))throw Error('Use --template <filename> [pilot-first|all] or --check <filename>');
  const file=output(name);
  if(action==='--template'){
   const data=makeRubricWorklist(buildReviewRows(),scope);mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(data,null,2)+'\n',{encoding:'utf8',flag:'wx'});console.log(JSON.stringify({records:data.records.length,criteria:data.records.length*RUBRIC.length,allPending:true,publicReleaseApproved:false}));
  }else{
   if(statSync(file).size>20*1024*1024)throw Error('Rubric worksheet too large');
   const result=validateRubricWorklist(JSON.parse(readFileSync(file,'utf8')));console.log(JSON.stringify(result,null,2));if(!result.valid)process.exitCode=1;
  }
 }catch(e){console.error(e.message);process.exitCode=1}
}
