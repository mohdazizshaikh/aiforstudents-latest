/** M78: partition the full M62 review worksheet without splitting mappings.
 * Local maintainer evidence only; no chapter, human or release approval. */
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync,readFileSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeBoardReviewWorksheet,validateBoardReviewWorksheet} from './multiboard-mapping-review.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m78-board-review-batch-v1';
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const ref=r=>[r.mappingId,r.mappingSha256,r.checks.map(c=>c.id)];
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const flags=()=>({verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false});
function plan(worksheet){
 const batches=[],snapshotSha256=hash(worksheet.records.map(ref));
 for(const board of ['CBSE','Maharashtra']){
  const records=worksheet.records.filter(r=>r.mapping.board===board);
  if(!records.length)continue;
  const checks=records[0].checks.length;
  if(!checks||checks>100||records.some(r=>r.checks.length!==checks))throw Error('Unexpected board check schema');
  const count=Math.ceil(records.length/Math.floor(100/checks));
  const size=Math.floor(records.length/count),extra=records.length%count;
  let offset=0;
  for(let i=0;i<count;i++){
   const n=size+(i<extra?1:0),members=records.slice(offset,offset+n);offset+=n;
   batches.push({id:board.toLowerCase()+'-'+String(i+1).padStart(3,'0'),board,mappings:n,checks:n*checks,batchSha256:hash(members.map(ref)),members});
  }
 }
 if(batches.reduce((n,b)=>n+b.mappings,0)!==worksheet.records.length)throw Error('Unknown board in inventory');
 return {snapshotSha256,batches};
}
export function boardReviewBatchIndex(){
 const worksheet=makeBoardReviewWorksheet(),p=plan(worksheet);
 return {schema,snapshotSha256:p.snapshotSha256,mappings:worksheet.records.length,checks:worksheet.records.reduce((n,r)=>n+r.checks.length,0),batches:p.batches.map(({members,...meta})=>({...meta,mappingIds:members.map(r=>r.mappingId)})),...flags()};
}
export function makeBoardReviewBatch(id){
 const worksheet=makeBoardReviewWorksheet(),p=plan(worksheet),b=p.batches.find(x=>x.id===id);
 if(!b)throw Error('Unknown board review batch');
 return {schema,batchId:b.id,snapshotSha256:p.snapshotSha256,batchSha256:b.batchSha256,records:b.members,...flags()};
}
export function validateBoardReviewBatch(data){
 const fail=message=>({valid:false,errors:[message],...flags()});
 if(!exact(data,['schema','batchId','snapshotSha256','batchSha256','records','verifiedChapters','humanApprovalAuthenticated','publicReleaseApproved'])||data.schema!==schema||data.verifiedChapters!==0||data.humanApprovalAuthenticated!==false||data.publicReleaseApproved!==false||!Array.isArray(data.records))return fail('Invalid or approving batch');
 const worksheet=makeBoardReviewWorksheet(),p=plan(worksheet),b=p.batches.find(x=>x.id===data.batchId);
 if(!b||data.snapshotSha256!==p.snapshotSha256||data.batchSha256!==b.batchSha256)return fail('Unknown or stale batch; regenerate');
 const ids=new Set(b.members.map(r=>r.mappingId)),actual=new Map();
 for(const r of data.records){
  if(!r||!ids.has(r.mappingId)||actual.has(r.mappingId))return fail('Unexpected or duplicate mapping');
  actual.set(r.mappingId,r);
 }
 if(actual.size!==ids.size)return fail('Missing batch mapping');
 // Delegate all source/fingerprint/check/decision validation to the full existing validator.
 const full={...worksheet,records:worksheet.records.map(r=>actual.get(r.mappingId)??r)};
 const result=validateBoardReviewWorksheet(full);
 if(!result.valid)return {...result,...flags()};
 const pending=data.records.reduce((n,r)=>n+r.checks.filter(c=>c.decision==='pending').length,0);
 const readyForIndependentAudit=data.records.filter(r=>r.checks.every(c=>c.decision==='pass')).length;
 const needsRevision=data.records.filter(r=>r.checks.some(c=>c.decision==='revise'||c.decision==='reject')).length;
 return {valid:true,errors:[],batchId:b.id,mappings:b.mappings,checks:b.checks,pending,readyForIndependentAudit,needsRevision,...flags()};
}
const file=name=>{
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 return path.join(ROOT,'review-evidence',name);
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,id,name,...extra]=process.argv.slice(2);
  if(extra.length)throw Error('Unexpected arguments');
  if(action==='--index'&&id===undefined)console.log(JSON.stringify(boardReviewBatchIndex(),null,2));
  else if(action==='--template'&&id&&name){
   const data=makeBoardReviewBatch(id),target=file(name);mkdirSync(path.dirname(target),{recursive:true});
   writeFileSync(target,JSON.stringify(data,null,2)+'\n',{encoding:'utf8',flag:'wx'});
   console.log(JSON.stringify(validateBoardReviewBatch(data),null,2));
  }else if(action==='--check'&&id&&name===undefined){
   const target=file(id);if(statSync(target).size>4*1024*1024)throw Error('Worksheet too large');
   const r=validateBoardReviewBatch(JSON.parse(readFileSync(target,'utf8')));console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1;
  }else throw Error('Use --index | --template <batch-id> <new.json> | --check <file.json>');
 }catch(e){console.error(e.message);process.exitCode=1}
}
