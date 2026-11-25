import test from 'node:test';import assert from 'node:assert/strict';
import {createTransportRehearsal,transportCatalog} from '../tools/tutor-transport-rehearsal.mjs';
import {evaluateTransport} from '../tools/tutor-transport-evaluation.mjs';
import {authorizeExternalInference,tutorActivationStatus} from '../tools/tutor-activation-boundary.mjs';
import {startPilotBackend} from '../tools/pilot-backend.mjs';
import {createOperatorRehearsal} from '../tools/adult-operator-rehearsal.mjs';
import {FORBIDDEN_PUBLIC_PATHS} from '../tools/check-live-staging.mjs';
const request=transportCatalog().requests[0];
test('28 actual loopback HTTP bilingual response scenarios, no external inference',async()=>{
 const r=await evaluateTransport();assert.equal(r.valid,true,JSON.stringify(r.results.filter(x=>!x.passed)));assert.equal(r.cases,28);assert.equal(r.passed,28);assert.equal(r.externalProviderTested,false);assert.equal(r.semanticAccuracyValidated,false);
});
test('Invalid source, stale version, extra prompt, endpoint and approval fields never reach wire',async()=>{
 const t=createTransportRehearsal();
 try{for(const input of [{request:{...request,id:'unknown'},scenario:'match'},{request:{...request,versionHash:'0'.repeat(64)},scenario:'match'},{request:{...request,prompt:'not allowed'},scenario:'match'},{request,scenario:'match',endpoint:'https://example.invalid'},{request,scenario:'match',approved:true}]){
 const r=await t.rehearse(input);assert.equal(r.status,'unavailable');assert.equal(r.excerpt,null);assert.equal(r.citation,null)}
 assert.equal(t.status().wireCalls,0);assert.equal(t.status().used,0);assert.equal(t.status().externalSpendInr,0);
 }finally{t.close()}
});
test('Quota reserved before HTTP, concurrent and closed requests denied, no retry',async()=>{
 const t=createTransportRehearsal({timeoutMs:150,maxRequests:1});
 const active=t.rehearse({request,scenario:'timeout'});assert.equal(t.status().used,1);
 assert.equal((await t.rehearse({request,scenario:'match'})).reason,'BUSY');
 assert.equal((await active).reason,'TIMEOUT');assert.equal(t.status().wireCalls,1);
 assert.equal((await t.rehearse({request,scenario:'match'})).reason,'QUOTA_EXHAUSTED');
 t.close();assert.equal((await t.rehearse({request,scenario:'match'})).reason,'CLOSED');
});
test('Activation gate remains zero budget and empty approved corpus, caller cannot override',()=>{
 const s=tutorActivationStatus(),r=authorizeExternalInference({approved:true,budget:1000,provider:'claimed'});
 assert.equal(s.enabled,false);assert.equal(s.approvedBudgetInr,0);assert.equal(s.approvedSources,0);assert.equal(s.externalProviderRequestsAllowed,0);assert.equal(r.allowed,false);assert.equal(r.publicReleaseApproved,false);
});
test('Developer-only HTTP route; other roles, public chat, remote source and unauthenticated access denied',async()=>{
 const op=createOperatorRehearsal(),teacher=op.issue('teacher'),app=await startPilotBackend({operatorAccess:op});
 try{
 const url=app.url+'/v1/tutor-transport-rehearsal',headers={Authorization:'Bearer '+app.token},put=(payload)=>fetch(url,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(payload)});
 assert.equal((await fetch(url)).status,401);assert.equal((await fetch(url,{headers:{Authorization:'Bearer '+teacher.token}})).status,403);
 assert.equal((await fetch(app.url+'/v1/chat',{headers})).status,404);
 const catalog=await (await fetch(url,{headers})).json();assert.equal(catalog.activation.enabled,false);
 assert.equal((await put({request,scenario:'match'})).status,200);
 assert.equal((await put({request,scenario:'redirect'})).status,422);
 assert.equal((await put({request:{...request,id:'unknown'},scenario:'match'})).status,422);
 assert.equal((await put({request,scenario:'match',prompt:'not allowed'})).status,400);
 assert.equal((await fetch(url,{headers:{...headers,Origin:'https://example.invalid'}})).status,403);
 assert.ok(FORBIDDEN_PUBLIC_PATHS.includes('/v1/tutor-transport-rehearsal'));
 }finally{await app.close()}
});
