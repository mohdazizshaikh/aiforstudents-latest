/** M114 adult developer-only synthetic orchestration. No provider SDK, real sources, or student input. */
import {createHash} from 'node:crypto';
import {APPROVED_SOURCE_REGISTRY,approvedSourceHint} from './approved-source-retrieval.mjs';
import {syntheticTutorFixture,verifySyntheticTutorContract,checkDisabledTutorResponse} from './tutor-response-contract.mjs';

const LANGS=['en','hi'];
const digest=/^[a-f0-9]{64}$/;
const sourceId=/^[a-z0-9][a-z0-9:-]{0,79}$/;
const sha=text=>createHash('sha256').update(text,'utf8').digest('hex');
const exact=(v,ks)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===ks.length&&ks.every(k=>Object.hasOwn(v,k));
const safeFlags=()=>({syntheticOnly:true,remoteEnabled:false,generativeTutorEnabled:false,storesStudentData:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
export const SANDBOX_LIMITS=Object.freeze({requestsPerInstance:20,inputBytes:800,outputBytes:250,timeoutMs:250});
export const MOCK_SCENARIOS=Object.freeze(['match','wrong-citation','extra-claim','extra-field','oversized','unavailable','timeout']);
const revokedId='synthetic:revoked-contract';
const revokedVersion=sha('M114 revoked test version 1');
const validRequest=r=>exact(r,['id','versionHash','language'])&&typeof r.id==='string'&&sourceId.test(r.id)&&typeof r.versionHash==='string'&&digest.test(r.versionHash)&&LANGS.includes(r.language);
const denial=reason=>({status:'unavailable',reason,excerpt:null,citation:null,...safeFlags()});
function productionGate(r){
 if(APPROVED_SOURCE_REGISTRY.length!==0)throw Error('Real registry changed: independent authorization required');
 const a=approvedSourceHint(r),b=checkDisabledTutorResponse(r,null);
 if(a.remoteEnabled!==false||a.passage!==null||b.accepted!==false||b.answer!==null||b.citation!==null||b.publicReleaseApproved!==false)throw Error('Real tutor boundary changed');
}
/** Only fixed, non-educational test excerpts. Never mutate the real empty registry. */
export function tutorSandboxFixtures(){
 return {fixtures:LANGS.flatMap(language=>[
  {...syntheticTutorFixture(language).request,state:'SYNTHETIC_ACTIVE'},
  {id:revokedId,versionHash:revokedVersion,language,state:'SYNTHETIC_REVOKED'}
 ]),scenarios:[...MOCK_SCENARIOS],limits:{...SANDBOX_LIMITS},...safeFlags()};
}
export function retrieveSandboxSource(request){
 productionGate(request);
 if(!validRequest(request))return denial('INVALID_REQUEST');
 if(request.id===revokedId)return denial(request.versionHash===revokedVersion?'SOURCE_REVOKED':'SOURCE_VERSION_MISMATCH');
 const f=syntheticTutorFixture(request.language);
 if(request.id!==f.request.id)return denial('SOURCE_NOT_IN_SYNTHETIC_ALLOWLIST');
 if(request.versionHash!==f.request.versionHash)return denial('SOURCE_VERSION_MISMATCH');
 // Bind input to a fixed excerpt, not any caller-supplied source.
 return {status:'synthetic-source',candidate:f.candidate,...safeFlags()};
}
export function createMockProvider(scenario){
 if(!MOCK_SCENARIOS.includes(scenario))throw Error('Unknown mock scenario');
 return Object.freeze({name:'fixed-local-mock',async generate({candidate,signal}){
  if(signal.aborted)throw Error('Cancelled');
  switch(scenario){
   case 'match':return {...candidate};
   case 'wrong-citation':return {...candidate,passageSha256:'0'.repeat(64)};
   case 'extra-claim':return {...candidate,excerpt:candidate.excerpt+' unsupported'};
   case 'extra-field':return {...candidate,toolCall:'forbidden'};
   case 'oversized':return {...candidate,excerpt:'x'.repeat(1000)};
   case 'unavailable':throw Error('Synthetic provider failure');
   case 'timeout':return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('Cancelled')),{once:true}));
  }
 }});
}
/** Cooperative cancellation and byte bounds for the fixed mock, NOT vendor tokenizer or live quota. */
async function runMock(candidate,scenario,timeoutMs){
 // Input budget applies to the complete serialized candidate. Output budget is excerpt bytes;
 // response metadata schema is independently exact-checked and globally capped.
 if(Buffer.byteLength(JSON.stringify(candidate),'utf8')>SANDBOX_LIMITS.inputBytes)return denial('INPUT_BUDGET');
 const abort=new AbortController();let timer;
 try{
  const expired=new Promise(resolve=>{timer=setTimeout(()=>{resolve({timedOut:true});abort.abort()},timeoutMs)});
  const work=Promise.resolve().then(()=>createMockProvider(scenario).generate({candidate:{...candidate},signal:abort.signal})).then(value=>({value}),()=>({providerError:true}));
  const result=await Promise.race([expired,work]);
  if(result.timedOut)return denial('TIMEOUT');
  if(result.providerError)return denial('MOCK_UNAVAILABLE');
  const x=result.value;
  if(!x||typeof x.excerpt!=='string'||Buffer.byteLength(x.excerpt,'utf8')>SANDBOX_LIMITS.outputBytes||Buffer.byteLength(JSON.stringify(x),'utf8')>SANDBOX_LIMITS.inputBytes)return denial('OUTPUT_BUDGET');
  return {status:'mock-output',candidate:x};
 }finally{clearTimeout(timer);abort.abort()}
}
/** Independent instance lifetime cap; no identifiers, dates, transcripts, or remote usage. */
export function createTutorSandbox({maxRequests=SANDBOX_LIMITS.requestsPerInstance,timeoutMs=SANDBOX_LIMITS.timeoutMs}={}){
 if(!Number.isInteger(maxRequests)||maxRequests<1||maxRequests>SANDBOX_LIMITS.requestsPerInstance||!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>SANDBOX_LIMITS.timeoutMs)throw Error('Invalid synthetic sandbox limits');
 let used=0,busy=false;
 const status=()=>({used,remaining:maxRequests-used,busy,...safeFlags()});
 async function rehearse(payload){
  if(!exact(payload,['request','scenario'])||!validRequest(payload.request)||!MOCK_SCENARIOS.includes(payload.scenario))return denial('INVALID_REQUEST');
  const source=retrieveSandboxSource(payload.request);
  if(source.status!=='synthetic-source')return source;
  if(busy)return denial('BUSY');
  if(used>=maxRequests)return denial('QUOTA_EXHAUSTED');
  used++;busy=true;
  try{
   const output=await runMock(source.candidate,payload.scenario,timeoutMs);
   if(output.status!=='mock-output')return output;
   const verified=verifySyntheticTutorContract(payload.request,output.candidate);
   if(!verified.contractMatches)return denial(verified.reason);
   const {id,versionHash,language,passageId,passageSha256,excerpt}=output.candidate;
   // Existing production gate MUST still deny this exact candidate.
   const disabled=checkDisabledTutorResponse(payload.request,output.candidate);
   if(disabled.accepted||disabled.answer!==null||disabled.remoteEnabled!==false)throw Error('Unexpected activation');
   return {status:'synthetic-match',reason:'SYNTHETIC_EXACT_MATCH',excerpt,citation:{id,versionHash,language,passageId,passageSha256},...safeFlags()};
  }finally{busy=false}
 }
 return {status,rehearse};
}
