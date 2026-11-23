/**
 * M23 — Offline evidence-template generator and STRUCTURAL validator only.
 * It cannot authenticate reviewers, certify content, change review queues or authorize launch.
 * Never upload completed forms or private reviewer references to a public repository.
 */
import {readFileSync,writeFileSync,mkdirSync,statSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildReviewRows} from './build-review-packet.mjs';

export const EVIDENCE_SCHEMA='m23-review-evidence-v1';
export const REVIEW_SCOPES=Object.freeze(['pilot-first','all']);
const ROLES=Object.freeze(['subjectReview','hindiReview']);
const REVIEW_DECISIONS=new Set(['pending','pass','revise','reject']);
const REF=/^[a-z0-9._-]{3,48}$/i;
const key=(queue,id)=>queue+'\u0000'+id;
const text=v=>typeof v==='string'?v.trim():'';
function dayValid(d) {
 if(typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
 const parsed=new Date(d+'T00:00:00Z');
 return Number.isFinite(parsed.valueOf())&&parsed.toISOString().slice(0,10)===d;
}
const placeholderReview=()=>({decision:'pending',reviewerRef:'',reviewDate:'',rationale:''});
export function makeReviewTemplate(rows=buildReviewRows(),scope='pilot-first') {
 if(!REVIEW_SCOPES.includes(scope))throw Error('Invalid review scope');
 const chosen=scope==='all'?rows:rows.filter(row=>row.priority==='pilot-first');
 const records=chosen.map(row=>({
  queue:row.queue,content_id:row.content_id,content_version:row.content_version,
  content_sha256:row.content_sha256,
  subjectReview:placeholderReview(),hindiReview:placeholderReview(),
  curriculum:{status:'unverified',board:'',classOrAge:'',bookEdition:'',chapter:'',sourceUrl:'',notes:''},
  copyright:{status:'pending',evidenceRef:'',notes:''},
  safeguarding:{status:'pending',reviewerRef:'',reviewDate:'',notes:''}
 }));
 return {schema:EVIDENCE_SCHEMA,scope,origin:'offline reviewer worksheet; NOT proof of review',records};
}
function reviewIsFilled(review,errors,prefix) {
 if(!review||typeof review!=='object'||Array.isArray(review)){
  errors.push(prefix+': review entry must be object');return false;
 }
 if(!REVIEW_DECISIONS.has(review.decision)){
  errors.push(prefix+': invalid decision');return false;
 }
 if(review.decision==='pending'){
  if([review.reviewerRef,review.reviewDate,review.rationale].some(v=>text(v)))errors.push(prefix+': pending decision has populated evidence; finish or reset it');
  return false;
 }
 if(!REF.test(text(review.reviewerRef)))errors.push(prefix+': reviewerRef must be an opaque 3-48 character reference');
 if(!dayValid(review.reviewDate))errors.push(prefix+': reviewDate must be a valid YYYY-MM-DD');
 if(text(review.rationale).length<12)errors.push(prefix+': give a meaningful rationale (12+ chars)');
 return true;
}
function validateReferenceBlock(record,errors,prefix){
 const c=record.curriculum,p=record.copyright,s=record.safeguarding;
 if(!c||typeof c!=='object'||Array.isArray(c)||!['unverified','verified','not-applicable'].includes(c.status)){
  errors.push(prefix+': invalid curriculum block');
 }else if(c.status==='verified'){
  for(const k of ['board','classOrAge','bookEdition','chapter','sourceUrl'])if(!text(c[k]))errors.push(prefix+': curriculum '+k+' missing');
  if(text(c.sourceUrl)&&!/^https:\/\/[^\s/]+\//i.test(c.sourceUrl))errors.push(prefix+': curriculum sourceUrl must be full HTTPS URL');
 }else if(c.status==='not-applicable'&&text(c.notes).length<12)errors.push(prefix+': explain why curriculum is not applicable');
 if(!p||typeof p!=='object'||Array.isArray(p)||!['pending','original-draft','permission-evidence','link-only'].includes(p.status)){
  errors.push(prefix+': invalid copyright block');
 }else if(p.status==='permission-evidence'&&text(p.evidenceRef).length<8)errors.push(prefix+': copyright permission evidence reference missing');
 if(!s||typeof s!=='object'||Array.isArray(s)||!['pending','assessed'].includes(s.status)){
  errors.push(prefix+': invalid safeguarding block');
 }else if(s.status==='assessed'){
  if(!REF.test(text(s.reviewerRef)))errors.push(prefix+': safeguarding reviewerRef missing/invalid');
  if(!dayValid(s.reviewDate))errors.push(prefix+': safeguarding reviewDate invalid');
  if(text(s.notes).length<12)errors.push(prefix+': safeguarding evidence notes missing');
 }else if([s.reviewerRef,s.reviewDate,s.notes].some(v=>text(v)))errors.push(prefix+': pending safeguarding must not contain signoff details');
}
export function validateReviewEvidence(data,rows=buildReviewRows()) {
 const errors=[];
 if(!data||typeof data!=='object'||Array.isArray(data)||data.schema!==EVIDENCE_SCHEMA||!REVIEW_SCOPES.includes(data.scope)||!Array.isArray(data.records)){
  return {schemaValid:false,recordsChecked:0,expectedRecords:0,recordsReadyForIndependentHumanAudit:0,
   errors:['Invalid M23 evidence document'],humanApprovalAuthenticated:false,publicReleaseApproved:false};
 }
 if('publicReleaseApproved' in data||'humanApprovalAuthenticated' in data)errors.push('Prohibited top-level release-approval field');
 const expected=makeReviewTemplate(rows,data.scope).records;
 const byKey=new Map(expected.map(x=>[key(x.queue,x.content_id),x]));
 const seen=new Set();let reviewComplete=0;
 for(const [i,item] of data.records.entries()) {
  const prefix='records['+i+']';
  if(!item||typeof item!=='object'||Array.isArray(item)){
   errors.push(prefix+': expected object');continue;
  }
  if('publicReleaseApproved' in item||'approved_for_child_launch' in item)errors.push(prefix+': prohibited release-approval field');
  const k=key(item.queue,item.content_id);
  if(seen.has(k)){errors.push(prefix+': duplicate '+item.queue+'/'+item.content_id);continue}
  seen.add(k);
  const wanted=byKey.get(k);
  if(!wanted){errors.push(prefix+': unknown review item '+item.queue+'/'+item.content_id);continue}
  if(String(item.content_version)!==wanted.content_version)errors.push(prefix+': stale version '+item.content_id);
  if(item.content_sha256!==wanted.content_sha256)errors.push(prefix+': stale or tampered content digest '+item.content_id);
  const before=errors.length;
  const subject=reviewIsFilled(item.subjectReview,errors,prefix+'.subjectReview');
  const hindi=reviewIsFilled(item.hindiReview,errors,prefix+'.hindiReview');
  if(subject&&hindi&&text(item.subjectReview.reviewerRef).toLowerCase()===text(item.hindiReview.reviewerRef).toLowerCase())
   errors.push(prefix+': subject and Hindi review require distinct reviewer references');
  validateReferenceBlock(item,errors,prefix);
  if(errors.length===before&&subject&&hindi
    &&item.subjectReview.decision==='pass'&&item.hindiReview.decision==='pass'
    &&item.curriculum.status!=='unverified'&&item.copyright.status!=='pending'
    &&item.safeguarding.status==='assessed'&&item.content_sha256===wanted.content_sha256)
   reviewComplete++;
 }
 for(const k of byKey.keys())if(!seen.has(k))errors.push('Missing evidence record for '+k.replace('\u0000','/'));
 return {
  schemaValid:errors.length===0,
  recordsChecked:data.records.length,expectedRecords:expected.length,
  recordsReadyForIndependentHumanAudit:reviewComplete,
  errors:errors.slice(0,100),
  totalErrors:errors.length,
  humanApprovalAuthenticated:false,
  publicReleaseApproved:false,
  note:'Schema checks and source hashes do not authenticate reviewer identity or prove educational/legal approval.'
 };
}
export function writeTemplate(output,scope='pilot-first',rows=buildReviewRows()){
 const template=makeReviewTemplate(rows,scope);
 if(existsSync(output))throw Error('Refusing to overwrite existing reviewer evidence file: '+output);
 mkdirSync(path.dirname(output),{recursive:true});
 writeFileSync(output,JSON.stringify(template,null,2)+'\n','utf8');
 return {path:output,scope,items:template.records.length,allDecisions:'pending',publicReleaseApproved:false};
}
export function checkFile(file,rows=buildReviewRows()) {
 if(statSync(file).size>8*1024*1024)throw Error('Review evidence file too large');
 const data=JSON.parse(readFileSync(file,'utf8'));
 return validateReviewEvidence(data,rows);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);
 const usage='Usage: node tools/review-evidence.mjs --template <local-file> [--scope pilot-first|all] OR --check <local-file>';
 try{
  if(args[0]==='--template'&&args[1]&&args.length<=4&&(args.length===2||(args[2]==='--scope'&&REVIEW_SCOPES.includes(args[3])))){
   console.log(JSON.stringify(writeTemplate(path.resolve(args[1]),args[3]??'pilot-first'),null,2));
  }else if(args[0]==='--check'&&args.length===2){
   const result=checkFile(path.resolve(args[1]));
   console.log(JSON.stringify(result,null,2));
   if(!result.schemaValid)process.exitCode=1;
  }else{console.error(usage);process.exitCode=2}
 }catch(err){console.error(err.message);process.exitCode=2}
}
