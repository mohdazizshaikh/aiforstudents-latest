/** M114 deterministic bilingual integration evaluation; NOT semantic/provider or human review. */
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createTutorSandbox,tutorSandboxFixtures,MOCK_SCENARIOS} from './tutor-sandbox.mjs';
import {checkDisabledTutorResponse} from './tutor-response-contract.mjs';
const expected={match:'SYNTHETIC_EXACT_MATCH','wrong-citation':'CITATION_MISMATCH','extra-claim':'EXCERPT_MISMATCH','extra-field':'INVALID_RESPONSE_SCHEMA',oversized:'OUTPUT_BUDGET',unavailable:'MOCK_UNAVAILABLE',timeout:'TIMEOUT'};
export async function evaluateTutorSandbox(){
 const results=[],errors=[];
 const run=async(language,caseId,sandbox,payload,want)=>{
  const r=await sandbox.rehearse(payload);
  const pass=r.reason===want&&r.syntheticOnly===true&&r.remoteEnabled===false&&r.generativeTutorEnabled===false&&r.humanApprovalAuthenticated===false&&r.publicReleaseApproved===false&&
   (want==='SYNTHETIC_EXACT_MATCH'?r.status==='synthetic-match'&&typeof r.excerpt==='string'&&!!r.citation:r.status==='unavailable'&&r.excerpt===null&&r.citation===null);
  if(!pass)errors.push(language+':'+caseId);
  results.push({language,caseId,expected:want,observed:r.reason,pass});
 };
 for(const language of ['en','hi']){
  const fixtures=tutorSandboxFixtures().fixtures.filter(x=>x.language===language);
  const req=state=>{const {state:ignored,...r}=fixtures.find(x=>x.state===state);return r};
  const request=req('SYNTHETIC_ACTIVE'),revoked=req('SYNTHETIC_REVOKED');
  const s=createTutorSandbox({timeoutMs:10});
  for(const scenario of MOCK_SCENARIOS)await run(language,scenario,s,{request,scenario},expected[scenario]);
  await run(language,'revoked',s,{request:revoked,scenario:'match'},'SOURCE_REVOKED');
  await run(language,'stale',s,{request:{...request,versionHash:'0'.repeat(64)},scenario:'match'},'SOURCE_VERSION_MISMATCH');
  await run(language,'missing',s,{request:{...request,id:'synthetic:missing'},scenario:'match'},'SOURCE_NOT_IN_SYNTHETIC_ALLOWLIST');
  await run(language,'extra-input',s,{request:{...request,studentId:'synthetic'},scenario:'match'},'INVALID_REQUEST');
  const q=createTutorSandbox({maxRequests:1,timeoutMs:10});
  await run(language,'quota-positive',q,{request,scenario:'match'},'SYNTHETIC_EXACT_MATCH');
  await run(language,'quota-denial',q,{request,scenario:'match'},'QUOTA_EXHAUSTED');
  const c=createTutorSandbox({timeoutMs:10});
  const active=c.rehearse({request,scenario:'timeout'});
  await run(language,'concurrent',c,{request,scenario:'match'},'BUSY');
  await active;
  const disabled=checkDisabledTutorResponse(request,null);
  if(disabled.accepted!==false||disabled.answer!==null)errors.push(language+':real-gate');
 }
 return {schema:'aifs-m114-tutor-sandbox-evaluation-v1',valid:errors.length===0,totalCases:results.length,passed:results.filter(x=>x.pass).length,errors,results,providerTested:false,semanticAccuracyValidated:false,independentRedTeamCompleted:false,humanReviewStatus:'PENDING',generativeTutorEnabled:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{if(process.argv.length!==2)throw Error('Fixed evaluation only');const r=await evaluateTutorSandbox();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}catch{console.error('Synthetic tutor evaluation failed');process.exitCode=1}
}
