/** M85 full canonical corpus denial rehearsal. Not a provider or semantic evaluation. */
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {buildReviewRows} from './build-review-packet.mjs';
import {APPROVED_SOURCE_REGISTRY,approvedSourceHint} from './approved-source-retrieval.mjs';
import {checkDisabledTutorResponse} from './tutor-response-contract.mjs';
import {auditDisabledTutorBoundary} from './tutor-adversarial-audit.mjs';
const sha=s=>createHash('sha256').update(s,'utf8').digest('hex');
const key=r=>JSON.stringify([r.queue,r.content_id]);
const refs=r=>JSON.stringify([r.queue,r.content_id,r.content_version,r.content_sha256,r.priority]);
const safe=/^[a-z0-9][a-z0-9:-]{0,79}$/;
const digest=/^[a-f0-9]{64}$/;
const flags=()=>({generativeTutorEnabled:false,remoteEnabled:false,providerTested:false,semanticAccuracyValidated:false,independentRedTeamCompleted:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
export function auditFullDisabledTutorCorpus(rows=buildReviewRows()){
 const fail=error=>({valid:false,errors:[error],...flags()});
 if(APPROVED_SOURCE_REGISTRY.length!==0)return fail('Registry changed; independent review required');
 const canonical=buildReviewRows(),expected=new Map(canonical.map(r=>[key(r),refs(r)]));
 if(!Array.isArray(rows)||rows.length!==expected.size)return fail('Incomplete canonical corpus');
 const seen=new Set(),requests=new Set(),byQueue=Object.create(null);
 let nativeIds=0,aliasIds=0,exactDenials=0,staleDenials=0,extraFieldDenials=0;
 function denied(req,reason){
  const a=approvedSourceHint(req),b=checkDisabledTutorResponse(req,null);
  return a.kind==='unavailable'&&a.reason===reason&&a.passage===null&&a.citation===null&&a.remoteEnabled===false&&
   b.accepted===false&&b.reason===reason&&b.answer===null&&b.citation===null&&b.remoteEnabled===false&&b.humanApprovalAuthenticated===false&&b.publicReleaseApproved===false;
 }
 for(const r of rows){
  if(!r||typeof r.queue!=='string'||typeof r.content_id!=='string'||typeof r.content_sha256!=='string'||!digest.test(r.content_sha256)||seen.has(key(r))||expected.get(key(r))!==refs(r))return fail('Invalid, duplicate or stale canonical record');
  seen.add(key(r));
  // Always namespace by queue. If the canonical name cannot meet the existing contract,
  // use a deterministic test-only alias, never a registry entry or source approval.
  const native=r.queue+':'+r.content_id;
  const id=safe.test(native)?native:'audit:'+sha(key(r));
  if(requests.has(id))return fail('Request ID collision');
  requests.add(id);
  if(id===native)nativeIds++;else aliasIds++;
  const q=byQueue[r.queue]??={records:0,exactDenials:0,staleDenials:0,extraFieldDenials:0};
  q.records++;
  for(const language of ['en','hi']){
   const request={id,versionHash:r.content_sha256,language};
   const stale={...request,versionHash:(request.versionHash[0]==='0'?'1':'0')+request.versionHash.slice(1)};
   if(!denied(request,'NO_AUTHENTICATED_APPROVED_SOURCE'))return fail('Exact request did not deny');
   if(!denied(stale,'NO_AUTHENTICATED_APPROVED_SOURCE'))return fail('Stale request did not deny');
   if(!denied({...request,history:[]},'INVALID_REQUEST'))return fail('Unexpected field did not deny');
   exactDenials++;staleDenials++;extraFieldDenials++;q.exactDenials++;q.staleDenials++;q.extraFieldDenials++;
  }
 }
 const pilotAudit=auditDisabledTutorBoundary(rows);
 if(!pilotAudit.valid)return fail('Pilot boundary regression');
 return {schema:'aifs-m85-disabled-tutor-corpus-v1',valid:true,errors:[],canonicalRecords:seen.size,nativeIds,aliasIds,exactDenials,staleDenials,extraFieldDenials,
  corpusCases:exactDenials+staleDenials+extraFieldDenials,pilotRegressionCases:pilotAudit.totalCases,byQueue,...flags()};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{if(process.argv.length!==2)throw Error('Fixed canonical corpus only');const r=auditFullDisabledTutorCorpus();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}catch{console.error('Full disabled-tutor audit failed');process.exitCode=1}
}
