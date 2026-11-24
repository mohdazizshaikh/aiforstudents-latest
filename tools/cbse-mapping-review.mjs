/** M52: combined CBSE mapping review worksheet, local maintainer use only. */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bindCbseCandidates,readCbseCandidates} from './cbse-syllabus-candidates.mjs';
import {bindSecondaryCandidates,readSecondaryCandidates} from './cbse-secondary-candidates.mjs';
import {buildReviewRows} from './build-review-packet.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m52-cbse-mapping-review-v1';
const sha=s=>createHash('sha256').update(s,'utf8').digest('hex');
const canonical=x=>Array.isArray(x)?'['+x.map(canonical).join(',')+']':x!==null&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const opaque=x=>typeof x==='string'&&/^[A-Za-z0-9._-]{3,80}$/.test(x);
const checks=Object.freeze(['syllabus-anchor','textbook-edition','learning-outcome-fit','grade-suitability','rights']);
const fresh=()=>({decision:'pending',reviewerRef:'',evidenceRef:'',note:''});
export function combinedMappingCandidates(rows=buildReviewRows(),senior=readCbseCandidates(),secondary=readSecondaryCandidates()){
 const results=[bindCbseCandidates(senior,rows),bindSecondaryCandidates(secondary,rows)];
 if(results.some(r=>!r.valid))throw Error('Invalid source candidate manifest');
 const proposals=results.flatMap(r=>r.proposals).map(p=>{
  const {modelId,subject,grade,sourceUrl,pdfPage,syllabusRef,limitation,reviewRef}=p;
  const mapping={modelId,subject,grade,sourceUrl,pdfPage,syllabusRef,limitation,reviewRef,board:'CBSE',academicSession:'2026-27'};
  const mappingId=grade+'|'+modelId;
  return {mappingId,mappingSha256:sha(canonical(mapping)),mapping};
 }).sort((a,b)=>a.mappingId<b.mappingId?-1:a.mappingId>b.mappingId?1:0);
 if(new Set(proposals.map(p=>p.mappingId)).size!==proposals.length)throw Error('Duplicate grade/model mapping');
 return proposals;
}
export function makeMappingWorksheet(rows=buildReviewRows(),senior=readCbseCandidates(),secondary=readSecondaryCandidates()){
 const records=combinedMappingCandidates(rows,senior,secondary).map(p=>({...p,checks:checks.map(id=>({id,...fresh()}))}));
 return {schema,humanApprovalAuthenticated:false,publicReleaseApproved:false,records};
}
export function validateMappingWorksheet(data,rows=buildReviewRows(),senior=readCbseCandidates(),secondary=readSecondaryCandidates()){
 const errors=[],seen=new Set();let filled=0,revision=0;
 const reject=()=>({valid:false,errors,mappingsChecked:seen.size,readyForIndependentAudit:0,needsRevision:0,verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!exact(data,['schema','humanApprovalAuthenticated','publicReleaseApproved','records'])||data.schema!==schema||data.humanApprovalAuthenticated!==false||data.publicReleaseApproved!==false||!Array.isArray(data.records)){errors.push('Invalid or approving worksheet');return reject()}
 let expected;try{expected=combinedMappingCandidates(rows,senior,secondary)}catch(e){errors.push(e.message);return reject()}
 const lookup=new Map(expected.map(p=>[p.mappingId,p]));
 for(const r of data.records){
  if(!exact(r,['mappingId','mappingSha256','mapping','checks'])||typeof r.mappingId!=='string'||seen.has(r.mappingId)||!lookup.has(r.mappingId)){errors.push('Unknown or duplicate mapping');continue}
  seen.add(r.mappingId);
  const p=lookup.get(r.mappingId);
  if(r.mappingSha256!==p.mappingSha256||canonical(r.mapping)!==canonical(p.mapping)){errors.push('Stale or edited source/content mapping '+r.mappingId);continue}
  if(!Array.isArray(r.checks)||r.checks.length!==checks.length){errors.push('Incomplete checks '+r.mappingId);continue}
  const ids=new Set();let ready=true,revise=false,before=errors.length;
  for(const v of r.checks){
   if(!exact(v,['id','decision','reviewerRef','evidenceRef','note'])||!checks.includes(v.id)||ids.has(v.id)||!['pending','pass','revise','reject'].includes(v.decision)){errors.push('Invalid check '+r.mappingId);ready=false;continue}
   ids.add(v.id);
   if(v.decision==='pending'){if([v.reviewerRef,v.evidenceRef,v.note].some(x=>x!==''))errors.push('Pending check must be blank '+r.mappingId);ready=false;continue}
   if(!opaque(v.reviewerRef)||!opaque(v.evidenceRef)||typeof v.note!=='string'||v.note.trim().length<12||v.note.length>1000)errors.push('Missing evidence '+r.mappingId);
   if(v.decision!=='pass'){ready=false;revise=true}
  }
  if(revise)revision++;
  if(ready&&ids.size===checks.length&&errors.length===before)filled++;
 }
 for(const p of expected)if(!seen.has(p.mappingId))errors.push('Missing mapping '+p.mappingId);
 if(errors.length)return reject();
 return {valid:true,errors,mappingsChecked:seen.size,readyForIndependentAudit:filled,needsRevision:revision,verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
function output(name){
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 return path.join(ROOT,'review-evidence',name);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,name,...extra]=process.argv.slice(2);
  if(extra.length||!['--template','--check'].includes(action))throw Error('Use --template <filename> or --check <filename>');
  const file=output(name);
  if(action==='--template'){
   const x=makeMappingWorksheet();mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(x,null,2)+'\n',{encoding:'utf8',flag:'wx'});
   console.log(JSON.stringify({mappings:x.records.length,checklistCells:x.records.length*checks.length,allPending:true,publicReleaseApproved:false}));
  }else{
   if(statSync(file).size>4*1024*1024)throw Error('Worksheet too large');
   const r=validateMappingWorksheet(JSON.parse(readFileSync(file,'utf8')));console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1;
  }
 }catch(e){console.error(e.message);process.exitCode=1}
}
