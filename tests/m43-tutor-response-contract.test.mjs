import test from 'node:test';
import assert from 'node:assert/strict';
import {syntheticTutorFixture,verifySyntheticTutorContract,checkDisabledTutorResponse} from '../tools/tutor-response-contract.mjs';
test('M43 even a perfect synthetic response cannot activate approved-source tutor',()=>{
 for(const lang of ['en','hi']){
  const {request,candidate}=syntheticTutorFixture(lang);
  const match=verifySyntheticTutorContract(request,candidate);assert.equal(match.contractMatches,true);assert.equal(match.syntheticOnly,true);
  for(const value of [candidate,null,{},'answer',{...candidate,approved:true}]){
   const r=checkDisabledTutorResponse(request,value);assert.equal(r.accepted,false);assert.equal(r.answer,null);assert.equal(r.citation,null);assert.equal(r.reason,'NO_AUTHENTICATED_APPROVED_SOURCE');assert.equal(r.remoteEnabled,false);assert.equal(r.publicReleaseApproved,false);
  }
 }
});
test('M43 rejects malformed requests, stale sources, extra fields, forged citations and unsupported text in both languages',()=>{
 for(const lang of ['en','hi']){
  const {request,candidate}=syntheticTutorFixture(lang);
  for(const r of [null,'free text',{...request,childName:'synthetic'},{...request,language:'xx'},{...request,id:'https://example.org'},{...request,versionHash:'bad'}]){
   assert.equal(verifySyntheticTutorContract(r,candidate).contractMatches,false);assert.equal(checkDisabledTutorResponse(r,candidate).reason,'INVALID_REQUEST');
  }
  for(const r of [{...request,id:'science:motion'},{...request,versionHash:'0'.repeat(64)}])assert.equal(verifySyntheticTutorContract(r,candidate).reason,'SYNTHETIC_SOURCE_MISMATCH');
  for(const x of [null,[],{},'free text',{...candidate,approved:true},{...candidate,toolCall:'fake'},{...candidate,studentHistory:[]},{...candidate,id:'wrong'},{...candidate,versionHash:'0'.repeat(64)},{...candidate,language:lang==='en'?'hi':'en'},{...candidate,passageId:'forged'},{...candidate,passageSha256:'0'.repeat(64)},{...candidate,excerpt:candidate.excerpt+' additional unsupported claim'},{...candidate,excerpt:'x'.repeat(201)}]){
   const r=verifySyntheticTutorContract(request,x);assert.equal(r.contractMatches,false);assert.equal(r.syntheticOnly,true);assert.equal(r.remoteEnabled,false);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
  }
 }
 assert.throws(()=>syntheticTutorFixture('xx'));
});
