import test from 'node:test';
import assert from 'node:assert/strict';
import {createTutorSandbox,tutorSandboxFixtures,retrieveSandboxSource,SANDBOX_LIMITS} from '../tools/tutor-sandbox.mjs';
import {evaluateTutorSandbox} from '../tools/tutor-sandbox-evaluation.mjs';
import {APPROVED_SOURCE_REGISTRY,approvedSourceHint} from '../tools/approved-source-retrieval.mjs';
import {checkDisabledTutorResponse,syntheticTutorFixture} from '../tools/tutor-response-contract.mjs';
import {startPilotBackend} from '../tools/pilot-backend.mjs';
const payload=(language='en',scenario='match')=>({request:syntheticTutorFixture(language).request,scenario});
test('ENG-022 authenticated loopback-only adult rehearsal route, exact fixed IDs, no chat or learner service',async()=>{
 const app=await startPilotBackend();try{
  const url=app.url+'/v1/tutor-rehearsal',headers={Authorization:'Bearer '+app.token};
  assert.equal((await fetch(url)).status,401);
  const call=()=>fetch(url,{headers});const meta=await (await call()).json();assert.equal(meta.fixtures.length,4);assert.equal(meta.generativeTutorEnabled,false);assert.equal(meta.quota.remaining,20);
  const put=data=>fetch(url,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(data)});
  const ok=await put(payload('hi'));assert.equal(ok.status,200);const r=await ok.json();assert.equal(r.status,'synthetic-match');assert.equal(r.citation.language,'hi');assert.equal(r.publicReleaseApproved,false);assert.equal(ok.headers.get('cache-control'),'no-store');
  assert.equal((await put({request:payload().request,scenario:'match',question:'not accepted'})).status,400);
  assert.equal((await put(payload('en','wrong-citation'))).status,422);
  assert.equal((await fetch(app.url+'/v1/chat',{headers})).status,404);
  assert.equal((await fetch(url,{headers:{...headers,Origin:'https://example.invalid'}})).status,403);
  assert.equal((await (await call()).json()).quota.used,2);
 }finally{await app.close()}
});
test('ENG-023 fixed synthetic retrieval, stale/missing/revoked denial and real registry remains empty',()=>{
 for(const language of ['en','hi']){
  const {request,candidate}=syntheticTutorFixture(language);
  assert.deepEqual(retrieveSandboxSource(request).candidate,candidate);
  assert.equal(retrieveSandboxSource({...request,versionHash:'0'.repeat(64)}).reason,'SOURCE_VERSION_MISMATCH');
  assert.equal(retrieveSandboxSource({...request,id:'synthetic:missing'}).reason,'SOURCE_NOT_IN_SYNTHETIC_ALLOWLIST');
  const {state,...revoked}=tutorSandboxFixtures().fixtures.find(x=>x.language===language&&x.state==='SYNTHETIC_REVOKED');
  assert.equal(retrieveSandboxSource(revoked).reason,'SOURCE_REVOKED');
  assert.equal(retrieveSandboxSource({...request,approved:true}).reason,'INVALID_REQUEST');
  assert.equal(approvedSourceHint(request).passage,null);assert.equal(checkDisabledTutorResponse(request,candidate).accepted,false);
 }
 assert.equal(APPROVED_SOURCE_REGISTRY.length,0);
});
test('ENG-024 mock provider adapter verifies exact bilingual excerpt and rejects malformed or unsupported output',async()=>{
 const s=createTutorSandbox();for(const lang of ['en','hi']){
  const r=await s.rehearse(payload(lang));assert.equal(r.excerpt,syntheticTutorFixture(lang).candidate.excerpt);assert.equal(r.remoteEnabled,false);
  for(const [scenario,reason] of [['wrong-citation','CITATION_MISMATCH'],['extra-claim','EXCERPT_MISMATCH'],['extra-field','INVALID_RESPONSE_SCHEMA'],['oversized','OUTPUT_BUDGET'],['unavailable','MOCK_UNAVAILABLE']]){
   const bad=await s.rehearse(payload(lang,scenario));assert.equal(bad.reason,reason);assert.equal(bad.excerpt,null);assert.equal(bad.citation,null);
  }
 }
 assert.equal(s.status().used,12);
});
test('ENG-025 cooperative timeout, concurrency, quota, invalid inputs and no transcript retention',async()=>{
 const s=createTutorSandbox({maxRequests:2,timeoutMs:10});
 assert.equal((await s.rehearse({request:{...payload().request,history:[]},scenario:'match'})).reason,'INVALID_REQUEST');assert.equal(s.status().used,0);
 const p=s.rehearse(payload('en','timeout'));assert.equal((await s.rehearse(payload())).reason,'BUSY');assert.equal((await p).reason,'TIMEOUT');
 assert.equal((await s.rehearse(payload())).status,'synthetic-match');assert.equal((await s.rehearse(payload())).reason,'QUOTA_EXHAUSTED');
 assert.equal(s.status().remaining,0);assert.equal(s.status().storesStudentData,false);assert.equal(Object.hasOwn(s.status(),'history'),false);
 assert.equal(createTutorSandbox().status().remaining,SANDBOX_LIMITS.requestsPerInstance);assert.throws(()=>createTutorSandbox({maxRequests:21}));
});
test('ENG-026 bilingual integration evaluation covers 28 expected cases without any approval',async()=>{
 const r=await evaluateTutorSandbox();assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.totalCases,28);assert.equal(r.passed,28);
 assert.equal(r.results.filter(x=>x.language==='en').length,14);assert.equal(r.results.filter(x=>x.language==='hi').length,14);
 assert.equal(r.providerTested,false);assert.equal(r.semanticAccuracyValidated,false);assert.equal(r.independentRedTeamCompleted,false);assert.equal(r.humanReviewStatus,'PENDING');assert.equal(r.publicReleaseApproved,false);
});
