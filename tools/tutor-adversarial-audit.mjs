/** M57 maintainer-only deterministic negative-test runner.
 * No provider, child input, network, real tutor response or approval. */
import {buildReviewRows} from './build-review-packet.mjs';
import {approvedSourceHint,APPROVED_SOURCE_REGISTRY} from './approved-source-retrieval.mjs';
import {syntheticTutorFixture,verifySyntheticTutorContract,checkDisabledTutorResponse} from './tutor-response-contract.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const supported=['en','hi'];
const sha=/^[a-f0-9]{64}$/;
export function auditDisabledTutorBoundary(rows=buildReviewRows()){
 if(APPROVED_SOURCE_REGISTRY.length!==0)throw Error('Registry change requires independent review');
 const errors=[],counts={canonicalPilotDenials:0,malformedRequestDenials:0,syntheticResponseRejections:0,syntheticPositiveControls:0};
 const deny=(request,candidate,reason,key)=>{
  const retrieval=approvedSourceHint(request),response=checkDisabledTutorResponse(request,candidate);
  if(retrieval.kind!=='unavailable'||retrieval.reason!==reason||retrieval.passage!==null||retrieval.citation!==null||retrieval.remoteEnabled!==false||
   response.accepted!==false||response.reason!==reason||response.answer!==null||response.citation!==null||response.remoteEnabled!==false||response.humanApprovalAuthenticated!==false||response.publicReleaseApproved!==false)errors.push(key+' failed closed-boundary assertion');
 };
 const pilot=rows.filter(r=>r.priority==='pilot-first'),seen=new Set();
 for(const r of pilot){
  const id=r.content_id.includes(':')?r.content_id:r.queue+':'+r.content_id;
  if(typeof r.content_sha256!=='string'||!sha.test(r.content_sha256)||!/^[a-z0-9][a-z0-9:-]{0,79}$/.test(id)||seen.has(r.queue+'|'+r.content_id)){errors.push('Invalid or duplicate canonical pilot record');continue}
  seen.add(r.queue+'|'+r.content_id);
  for(const language of supported){
   deny({id,versionHash:r.content_sha256,language},null,'NO_AUTHENTICATED_APPROVED_SOURCE','canonical-pilot');counts.canonicalPilotDenials++;
  }
 }
 if(!pilot.length)errors.push('Empty pilot inventory');
 for(const language of supported){
  const {request,candidate}=syntheticTutorFixture(language);
  const good=verifySyntheticTutorContract(request,candidate);
  if(good.contractMatches!==true||good.syntheticOnly!==true||good.remoteEnabled!==false||good.publicReleaseApproved!==false)errors.push('Synthetic positive control failed');
  deny(request,candidate,'NO_AUTHENTICATED_APPROVED_SOURCE','synthetic-positive');counts.syntheticPositiveControls++;
  const invalidRequests=[null,[],{},'synthetic free text',{...request,studentId:'synthetic'},{...request,history:[]},{...request,role:'admin'},{...request,approved:true},{...request,id:'https://example.invalid'},{...request,id:'../synthetic'},{...request,id:'x'.repeat(81)},{...request,versionHash:'0'.repeat(63)},{...request,versionHash:'A'.repeat(64)},{...request,language:'unknown'},{id:request.id,language}];
  for(const r of invalidRequests){deny(r,candidate,'INVALID_REQUEST','malformed-request');if(verifySyntheticTutorContract(r,candidate).contractMatches!==false)errors.push('Malformed synthetic request accepted');counts.malformedRequestDenials++}
  const invalidResponses=[null,[],{},'synthetic answer',{...candidate,approved:true},{...candidate,toolCall:'synthetic'},{...candidate,studentHistory:[]},{...candidate,role:'admin'},{...candidate,id:'synthetic:other'},{...candidate,versionHash:'0'.repeat(64)},{...candidate,language:language==='en'?'hi':'en'},{...candidate,passageId:'forged'},{...candidate,passageSha256:'0'.repeat(64)},{...candidate,excerpt:'Synthetic unsupported statement.'},{...candidate,excerpt:candidate.excerpt+' extra'},{...candidate,excerpt:'x'.repeat(201)},{...candidate,excerpt:123},{...candidate,excerpt:candidate.excerpt+'\u200b'},{...candidate,excerpt:candidate.excerpt+'\n'},{...candidate,excerpt:candidate.excerpt.normalize('NFC')+'!'}];
  for(const x of invalidResponses){
   const check=verifySyntheticTutorContract(request,x);
   if(check.contractMatches!==false||check.syntheticOnly!==true||check.remoteEnabled!==false||check.humanApprovalAuthenticated!==false||check.publicReleaseApproved!==false)errors.push('Invalid synthetic response accepted');
   deny(request,x,'NO_AUTHENTICATED_APPROVED_SOURCE','synthetic-response');counts.syntheticResponseRejections++;
  }
 }
 return {valid:errors.length===0,errors,counts,pilotRecords:pilot.length,totalCases:Object.values(counts).reduce((a,b)=>a+b,0),independentRedTeamCompleted:false,semanticAccuracyValidated:false,providerTested:false,generativeTutorEnabled:false,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const r=auditDisabledTutorBoundary();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}catch(e){console.error(e.message);process.exitCode=1}
}
