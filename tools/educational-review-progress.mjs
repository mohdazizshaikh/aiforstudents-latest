/** M81: local-only aggregate educational review progress. No personal evidence or approvals. */
import {readFileSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildReviewRows} from './build-review-packet.mjs';
import {reviewBatchIndex,validateReviewBatch} from './review-batches.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const flags=()=>({humanApprovalAuthenticated:false,rubricApproved:false,publicReleaseApproved:false});
export function summarizeEducationalReviewBatches(inputs,rows=buildReviewRows()){
 const index=reviewBatchIndex(rows),expected=new Map(index.batches.map(b=>[b.id,b]));
 const fail=error=>({valid:false,errors:[error],...flags()});
 if(!Array.isArray(inputs)||inputs.length>expected.size)return fail('Invalid batch collection');
 const submitted=new Map();
 for(const data of inputs){
  if(!data||!expected.has(data.batchId)||submitted.has(data.batchId))return fail('Unknown or duplicate batch');
  const result=validateReviewBatch(data,rows);
  if(!result.valid)return fail('Invalid or stale batch: '+data.batchId);
  const pending=data.rubric.records.reduce((n,r)=>n+r.criteria.filter(c=>c.decision==='pending').length,0);
  submitted.set(data.batchId,{pending,readyForIndependentAudit:result.readyForIndependentAudit,needsRevision:result.needsRevision});
 }
 const batches=index.batches.map(b=>{
  const r=submitted.get(b.id);
  return {batchId:b.id,phase:b.phase,records:b.count,criteria:b.criteriaCount,status:r?'STRUCTURALLY_VALID':'NOT_SUBMITTED',
   pendingCriteria:r?r.pending:null,readyForIndependentAudit:r?r.readyForIndependentAudit:null,needsRevision:r?r.needsRevision:null};
 });
 const totals=group=>group.reduce((a,b)=>{
  a.totalRecords+=b.records;a.totalCriteria+=b.criteria;
  if(b.status==='NOT_SUBMITTED'){a.unsubmittedRecords+=b.records;a.unsubmittedCriteria+=b.criteria;return a}
  a.submittedRecords+=b.records;a.submittedCriteria+=b.criteria;a.pendingCriteria+=b.pendingCriteria;a.decidedCriteria+=b.criteria-b.pendingCriteria;
  a.readyForIndependentAudit+=b.readyForIndependentAudit;a.needsRevision+=b.needsRevision;return a;
 },{totalRecords:0,totalCriteria:0,submittedRecords:0,submittedCriteria:0,unsubmittedRecords:0,unsubmittedCriteria:0,pendingCriteria:0,decidedCriteria:0,readyForIndependentAudit:0,needsRevision:0});
 return {schema:'aifs-m81-educational-review-progress-v1',valid:true,errors:[],snapshotSha256:index.snapshotSha256,
  submittedBatches:submitted.size,totalBatches:expected.size,allBatchesSubmitted:submitted.size===expected.size,
  ...totals(batches),byPhase:{pilot:totals(batches.filter(b=>b.phase==='pilot')),standard:totals(batches.filter(b=>b.phase==='standard'))},batches,...flags()};
}
function load(name){
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(name))throw Error('Invalid local batch directory');
 const target=path.join(ROOT,'review-evidence',name,'rubric.json');
 if(statSync(target).size>4*1024*1024)throw Error('Worksheet too large');
 return JSON.parse(readFileSync(target,'utf8'));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,...names]=process.argv.slice(2),rows=buildReviewRows();
  if(!['--summary','--require-all'].includes(action)||names.length>reviewBatchIndex(rows).batches.length||new Set(names).size!==names.length)throw Error('Invalid arguments');
  const r=summarizeEducationalReviewBatches(names.map(load),rows);console.log(JSON.stringify(r,null,2));
  if(!r.valid||(action==='--require-all'&&!r.allBatchesSubmitted))process.exitCode=1;
 }catch{console.error('Unable to read local batch collection or invalid arguments');process.exitCode=1}
}
