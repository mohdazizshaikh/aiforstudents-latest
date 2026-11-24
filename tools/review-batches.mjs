/** M54: deterministic 50–100-record review batches. Maintainer-only, no human approval. */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildReviewRows,packetCsv} from './build-review-packet.mjs';
import {makeRubricWorklist,validateRubricWorklist,RUBRIC} from './reviewer-rubric.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m54-review-batch-v1';
const sha=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const key=r=>r.queue+'|'+r.content_id;
const compare=(a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0;
const ref=r=>[r.queue,r.content_id,r.content_version,r.content_sha256];
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function planReviewBatches(rows=buildReviewRows()){
 if(!Array.isArray(rows)||!rows.length||new Set(rows.map(key)).size!==rows.length||rows.some(r=>typeof r.queue!=='string'||typeof r.content_id!=='string'||typeof r.content_version!=='string'||!r.content_version.trim()||!(/^[a-f0-9]{64}$/.test(r.content_sha256))))throw Error('Invalid canonical review inventory');
 const pilot=rows.filter(r=>r.priority==='pilot-first').sort(compare),remaining=rows.filter(r=>r.priority!=='pilot-first').sort(compare);
 const ordered=[...pilot,...remaining],snapshotSha256=sha(ordered.map(ref));
 const batches=[];
 function partition(group,phase){
  if(!group.length)return;
  const n=Math.ceil(group.length/100),base=Math.floor(group.length/n),extra=group.length%n;
  let start=0;for(let i=0;i<n;i++){
   const size=base+(i<extra?1:0),members=group.slice(start,start+size);start+=size;
   const id=phase+'-'+String(i+1).padStart(3,'0');
   batches.push({id,phase,count:members.length,criteriaCount:members.length*RUBRIC.length,batchSha256:sha(members.map(ref)),members});
  }
 }
 partition(pilot,'pilot');partition(remaining,'standard');
 return {snapshotSha256,totalRecords:ordered.length,pilotRecords:pilot.length,batches,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
export function reviewBatchIndex(rows=buildReviewRows()){
 const p=planReviewBatches(rows);
 return {...p,batches:p.batches.map(({members,...meta})=>meta)};
}
export function makeReviewBatch(id,rows=buildReviewRows()){
 const p=planReviewBatches(rows),b=p.batches.find(x=>x.id===id);
 if(!b)throw Error('Unknown review batch');
 return {schema,batchId:b.id,snapshotSha256:p.snapshotSha256,batchSha256:b.batchSha256,rubric:makeRubricWorklist(b.members,'all'),humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
export function validateReviewBatch(data,rows=buildReviewRows()){
 const fail=errors=>({valid:false,errors,readyForIndependentAudit:0,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!exact(data,['schema','batchId','snapshotSha256','batchSha256','rubric','humanApprovalAuthenticated','publicReleaseApproved'])||data.schema!==schema||data.humanApprovalAuthenticated!==false||data.publicReleaseApproved!==false)return fail(['Invalid or approving batch']);
 let p;try{p=planReviewBatches(rows)}catch(e){return fail([e.message])}
 const b=p.batches.find(x=>x.id===data.batchId);
 if(!b||p.snapshotSha256!==data.snapshotSha256||b.batchSha256!==data.batchSha256||data.rubric?.scope!=='all')return fail(['Unknown or stale batch; regenerate from current inventory']);
 const r=validateRubricWorklist(data.rubric,b.members);
 return {...r,batchId:b.id,batchRecordCount:b.count,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
const filename=name=>{
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(name))throw Error('Use a simple directory name under review-evidence/');
 return path.join(ROOT,'review-evidence',name);
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,id,name,...extra]=process.argv.slice(2);
  if(extra.length)throw Error('Unexpected arguments');
  const rows=buildReviewRows();
  if(action==='--index'&&id===undefined)console.log(JSON.stringify(reviewBatchIndex(rows),null,2));
  else if(action==='--template'&&id&&name){
   const p=planReviewBatches(rows),b=p.batches.find(x=>x.id===id);if(!b)throw Error('Unknown review batch');
   const dir=filename(name);mkdirSync(path.dirname(dir),{recursive:true});mkdirSync(dir);
   writeFileSync(path.join(dir,'rubric.json'),JSON.stringify(makeReviewBatch(id,rows),null,2)+'\n',{encoding:'utf8',flag:'wx'});
   writeFileSync(path.join(dir,'review-packet.csv'),packetCsv(b.members),{encoding:'utf8',flag:'wx'});
   console.log(JSON.stringify({batchId:id,records:b.count,criteria:b.criteriaCount,allPending:true,publicReleaseApproved:false}));
  }else if(action==='--check'&&id&&name===undefined){
   const file=path.join(filename(id),'rubric.json');if(statSync(file).size>4*1024*1024)throw Error('Worksheet too large');
   const r=validateReviewBatch(JSON.parse(readFileSync(file,'utf8')),rows);console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1;
  }else throw Error('Use --index | --template <batch-id> <new-directory> | --check <directory>');
 }catch(e){console.error(e.message);process.exitCode=1}
}
