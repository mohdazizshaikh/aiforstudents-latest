/** M32 B2 structural traceability: source + test refs, no authentication of humans. */
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {auditWorkPlan} from './workplan-status.mjs';
export function checkPlanTraceability(tracker,ledger){
 const problems=[];
 const audit=auditWorkPlan(tracker);
 if(!audit.valid)problems.push(...audit.errors);
 if(ledger?.schema!=='aifs-role-ledger-m32-v1'||ledger.publicReleaseApproved!==false)problems.push('Invalid unapproved role ledger');
 const streams=new Set(tracker.items.map(x=>x.stream)),owners=ledger?.roles||[];
 if(owners.length!==10||new Set(owners.map(x=>x.stream)).size!==10)problems.push('Ten unique owner roles required');
 for(const x of owners){
  if(!streams.has(x.stream)||x.assignedPerson!==null||x.assignedReviewer!==null||x.reviewerApproval!==false||x.assignmentState!=='UNASSIGNED')problems.push('Owner role falsely assigned '+x.stream);
  if(!tracker.items.some(t=>t.stream===x.stream&&t.ownerRole===x.role))problems.push('Unknown owner role '+x.stream);
 }
 if((ledger?.realWorldGates||[]).length!==5)problems.push('Real-world gate list missing');
 for(const g of ledger?.realWorldGates||[]){
  if(g.status!=='BLOCKED_EXTERNAL'||g.approved!==false||g.authenticatedSigner!==null||g.evidenceUrl!==null)problems.push('External gate prematurely approved '+g.name);
 }
 const traces=tracker.items.filter(x=>x.status==='DONE_VERIFIED').map(x=>({id:x.id,
  source:x.evidence.find(e=>e.kind==='source')?.path||null,test:x.evidence.find(e=>e.kind==='test')?.path||null}));
 for(const t of traces)if(!t.source||!t.test)problems.push('Incomplete trace '+t.id);
 return {valid:problems.length===0,problems,traces,verified:traces.length,total:100,engineeringOnly:true,
  reviewerIdentityVerified:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const p=JSON.parse(readFileSync(new URL('../docs/MASTER_100_WORK_ITEMS.json',import.meta.url),'utf8'));
 const l=JSON.parse(readFileSync(new URL('../docs/B2_ROLE_LEDGER.json',import.meta.url),'utf8'));
 const r=checkPlanTraceability(p,l);
 console.log(JSON.stringify({valid:r.valid,problems:r.problems,verified:r.verified,total:r.total,reviewerIdentityVerified:false,publicReleaseApproved:false},null,2));
 if(!r.valid)process.exitCode=1;
}
