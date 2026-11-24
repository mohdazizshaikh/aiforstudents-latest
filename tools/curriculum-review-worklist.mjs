/** M39 local curriculum candidate worklist. No textbook retrieval, network or approval.
 * Records are bound to the M36 discovery catalog and canonical review-content fingerprints.
 * Keep completed candidate worklists in the ignored review-evidence directory.
 */
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {buildReviewRows} from './build-review-packet.mjs';
import {validateDiscovery} from './curriculum-discovery.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const catalog=()=>JSON.parse(readFileSync(new URL('../docs/M36_DRAFT_CURRICULUM_DISCOVERY.json',import.meta.url),'utf8'));
const schema='aifs-m39-curriculum-worklist-v1';
const hash=/^[a-f0-9]{64}$/;
const fields=['board','bookTitle','edition','chapterId','outcomeRef','sourceUrl','rightsEvidenceRef'];
const blank=()=>Object.fromEntries(fields.map(k=>[k,'']));
function matchingRows(id,rows){
 const [family,name]=id.split(':');
 const queue=family==='workshop'?'maths':family;
 const matched=rows.filter(r=>r.queue===queue&&(family==='experiment'?r.content_id.startsWith(name+':'):r.content_id===id));
 if(matched.length!==(family==='experiment'?2:1))throw Error('Missing or duplicate review source '+id);
 return matched.map(r=>{
  if(!hash.test(r.content_sha256)||!r.content_version)throw Error('Invalid review source fingerprint '+id);
  return {queue:r.queue,id:r.content_id,version:r.content_version,sha256:r.content_sha256};
 }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
}
export function makeCurriculumWorklist(discovery=catalog(),rows=buildReviewRows()){
 const audit=validateDiscovery(discovery);
 if(!audit.valid)throw Error('Invalid discovery catalog: '+audit.errors.join('; '));
 const slots=discovery.grades.flatMap(g=>g.topics.map(t=>({
  slotId:'g'+g.grade+':'+t.subject,grade:g.grade,subjectLens:t.subject,english:t.en,hindi:t.hi,
  coverage:t.coverage,models:t.modelIds.map(id=>({id,reviewRefs:matchingRows(id,rows)})),
  candidateStatus:'UNMAPPED',candidate:blank()
 })));
 return {schema,scope:'DRAFT_CANDIDATES_ONLY',curriculumVerified:false,publicReleaseApproved:false,slots};
}
function publicHttps(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&
 u.hostname.includes('.')&&!/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(u.hostname)&&
 !u.hostname.endsWith('.local')&&u.pathname!=='/'&&value.length<=500}catch{return false}
}
export function validateCurriculumWorklist(data,discovery=catalog(),rows=buildReviewRows()){
 const expected=makeCurriculumWorklist(discovery,rows);
 const errors=[],seen=new Set();let proposed=0,gaps=0;
 if(!data||data.schema!==schema||data.scope!=='DRAFT_CANDIDATES_ONLY'||data.curriculumVerified!==false||data.publicReleaseApproved!==false||!Array.isArray(data.slots)||
 Object.keys(data).some(k=>!Object.hasOwn(expected,k)))return {valid:false,errors:['Invalid candidate worklist'],verifiedChapters:0,publicReleaseApproved:false};
 const byId=new Map(expected.slots.map(x=>[x.slotId,x]));
 for(const s of data.slots){
  if(!s||typeof s!=='object'||!byId.has(s.slotId)||seen.has(s.slotId)){errors.push('Unknown or duplicate slot');continue;}
  seen.add(s.slotId);const e=byId.get(s.slotId);
  for(const k of Object.keys(e).filter(k=>!['candidateStatus','candidate'].includes(k)))if(JSON.stringify(s[k])!==JSON.stringify(e[k]))errors.push('Stale or altered '+s.slotId+' '+k);
  if(Object.keys(s).some(k=>!Object.hasOwn(e,k)))errors.push('Unexpected slot field '+s.slotId);
  if(s.coverage==='GAP')gaps++;
  const f=s.candidate;
  if(!f||typeof f!=='object'||Array.isArray(f)||Object.keys(f).length!==fields.length||fields.some(k=>typeof f[k]!=='string'||f[k].length>500)){errors.push('Invalid candidate fields '+s.slotId);continue;}
  if(s.candidateStatus==='UNMAPPED'){if(fields.some(k=>f[k]!==''))errors.push('Pending slot must be blank '+s.slotId)}
  else if(s.candidateStatus==='PROPOSED_UNVERIFIED'){
   const before=errors.length;
   if(fields.some(k=>!f[k].trim()))errors.push('Incomplete candidate '+s.slotId);
   if(!publicHttps(f.sourceUrl))errors.push('Use public HTTPS chapter reference without query, fragment or credentials '+s.slotId);
   if(!/^[a-zA-Z0-9._-]{3,80}$/.test(f.rightsEvidenceRef))errors.push('Use opaque rights reference '+s.slotId);
   if(errors.length===before)proposed++;
  }else errors.push('Unrecognized candidate status '+s.slotId);
 }
 for(const id of byId.keys())if(!seen.has(id))errors.push('Missing slot '+id);
 const unique=new Set(expected.slots.flatMap(s=>s.models.map(m=>m.id)));
 const refs=new Set(expected.slots.flatMap(s=>s.models.flatMap(m=>m.reviewRefs.map(r=>r.queue+':'+r.id))));
 return {valid:errors.length===0,errors,slots:seen.size,gaps,uniqueModels:unique.size,uniqueReviewRecords:refs.size,
  proposedCandidates:proposed,verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
const localPath=name=>{
 if(typeof name!=='string'||!/^[a-zA-Z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename in review-evidence/');
 return path.join(ROOT,'review-evidence',name);
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,name,...extra]=process.argv.slice(2);if(extra.length||!['--template','--check'].includes(action))throw Error('Use --template or --check plus a local JSON filename');
  const file=localPath(name);
  if(action==='--template'){
   const data=makeCurriculumWorklist();mkdirSync(path.dirname(file),{recursive:true});
   writeFileSync(file,JSON.stringify(data,null,2)+'\n',{encoding:'utf8',flag:'wx'});
   console.log(JSON.stringify({slots:data.slots.length,output:'review-evidence/'+name,verifiedChapters:0,publicReleaseApproved:false},null,2));
  }else{
   if(statSync(file).size>2*1024*1024)throw Error('Worklist too large');
   const result=validateCurriculumWorklist(JSON.parse(readFileSync(file,'utf8')));
   console.log(JSON.stringify(result,null,2));if(!result.valid)process.exitCode=1;
  }
 }catch(e){console.error(e.message);process.exitCode=1}
}
