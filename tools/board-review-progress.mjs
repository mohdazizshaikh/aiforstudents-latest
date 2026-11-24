/** M80: aggregate structural review progress without publishing evidence or approval. */
import {readFileSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {boardReviewBatchIndex,validateBoardReviewBatch} from './board-review-batches.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const flags=()=>({verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false});
export function summarizeBoardReviewBatches(inputs){
 const index=boardReviewBatchIndex(),expected=new Map(index.batches.map(b=>[b.id,b]));
 const fail=error=>({valid:false,errors:[error],...flags()});
 if(!Array.isArray(inputs)||inputs.length>expected.size)return fail('Invalid batch collection');
 const valid=new Map();
 for(const data of inputs){
  if(!data||!expected.has(data.batchId)||valid.has(data.batchId))return fail('Unexpected or duplicate batch');
  const r=validateBoardReviewBatch(data);
  if(!r.valid)return fail('Invalid or stale batch: '+data.batchId);
  valid.set(data.batchId,r);
 }
 const batches=index.batches.map(b=>{
  const r=valid.get(b.id);
  return {batchId:b.id,board:b.board,mappings:b.mappings,checks:b.checks,status:r?'STRUCTURALLY_VALID':'NOT_SUBMITTED',
   pending:r?r.pending:null,readyForIndependentAudit:r?r.readyForIndependentAudit:null,needsRevision:r?r.needsRevision:null};
 });
 const totals=batches.reduce((a,b)=>{
  if(b.status==='NOT_SUBMITTED'){a.unsubmittedChecks+=b.checks;return a}
  a.submittedChecks+=b.checks;a.pendingChecks+=b.pending;a.decidedChecks+=b.checks-b.pending;
  a.readyForIndependentAudit+=b.readyForIndependentAudit;a.needsRevision+=b.needsRevision;return a;
 },{submittedChecks:0,unsubmittedChecks:0,pendingChecks:0,decidedChecks:0,readyForIndependentAudit:0,needsRevision:0});
 return {schema:'aifs-m80-board-review-progress-v1',valid:true,errors:[],snapshotSha256:index.snapshotSha256,
  totalMappings:index.mappings,totalChecks:index.checks,submittedBatches:valid.size,totalBatches:expected.size,
  allBatchesSubmitted:valid.size===expected.size,...totals,batches,...flags()};
}
function load(name){
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use simple JSON filenames under review-evidence/');
 const target=path.join(ROOT,'review-evidence',name);
 if(statSync(target).size>4*1024*1024)throw Error('Worksheet too large');
 return JSON.parse(readFileSync(target,'utf8'));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,...names]=process.argv.slice(2);
  if(!['--summary','--require-all'].includes(action)||names.length>boardReviewBatchIndex().batches.length||new Set(names).size!==names.length)throw Error('Use --summary or --require-all [batch-file.json ...]');
  const r=summarizeBoardReviewBatches(names.map(load));console.log(JSON.stringify(r,null,2));
  if(!r.valid||(action==='--require-all'&&!r.allBatchesSubmitted))process.exitCode=1;
 }catch{console.error('Unable to read batch collection or invalid arguments');process.exitCode=1}
}
