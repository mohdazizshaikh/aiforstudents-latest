import test from 'node:test';
import assert from 'node:assert/strict';
import {auditConceptGraph,conceptChoices,conceptPath,createConceptSession,conceptSuggestion,conceptAction} from '../assets/concept-pathways.js';
import {labPackKeys,worksheetReturnLaunch} from '../assets/teacher-cards-engine.js';
import {adaptiveEvidenceCatalog,evaluateAdaptiveEvidence} from '../tools/adaptive-evidence-interface.mjs';
import {startPilotBackend} from '../tools/pilot-backend.mjs';
test('ENG-027 versioned draft acyclic concept graph and exact bilingual resource routes',()=>{
 const a=auditConceptGraph();assert.equal(a.valid,true);assert.equal(a.nodes,34);assert.ok(a.edges>25);
 const all=conceptChoices();assert.equal(new Set(all.map(x=>x.key)).size,34);
 for(const lang of ['en','hi'])for(const x of conceptChoices(lang)){
  const path=conceptPath(x.key);assert.equal(path.at(-1),x.key);assert.equal(new Set(path).size,path.length);
  for(const y of conceptSuggestion(createConceptSession(x.key),lang).sequence){assert.ok(labPackKeys().includes(y.key));assert.equal(y.href,'../'+worksheetReturnLaunch(y.key,lang).href);assert.equal(y.masteryValidated,false)}
 }
 assert.equal(auditConceptGraph({'counting:main':['place-value:main'],'place-value:main':['counting:main']}).reason,'CYCLE');
 assert.equal(auditConceptGraph({'counting:main':['unknown:main']}).reason,'INVALID_EDGE');
 assert.throws(()=>conceptPath('unknown:main'));
});
test('ENG-028 explicit optional recommendation sequence, skip, explored, language and reset',()=>{
 let s=createConceptSession('ratio-algebra:equation');
 assert.deepEqual(conceptPath(s.target),['counting:main','studio/fractions:main','ratio-algebra:main','maths/number-line:main','ratio-algebra:equation']);
 assert.equal(conceptSuggestion(s).next.key,'counting:main');assert.equal(conceptSuggestion(s,'hi').next.key,'counting:main');
 s=conceptAction(s,'skip');assert.equal(conceptSuggestion(s).skipped,1);assert.equal(conceptSuggestion(s).next.key,'studio/fractions:main');
 s=conceptAction(s,'explore');assert.equal(conceptSuggestion(s).explored,1);
 while(conceptSuggestion(s).next)s=conceptAction(s,'skip');
 assert.equal(conceptSuggestion(s).next,null);assert.equal(conceptSuggestion(s).masteryValidated,false);
 assert.deepEqual(conceptAction(s,'reset'),createConceptSession(s.target));assert.throws(()=>conceptAction(s,'explore'));
 assert.throws(()=>conceptSuggestion({target:s.target,explored:['unknown'],skipped:[]}));
});
test('ENG-029 real reviewed pool denied, only exact synthetic version and scenario accepted',()=>{
 const c=adaptiveEvidenceCatalog(),r={pool:'synthetic',version:c.syntheticPoolVersion,scenario:'fixed-transfer'};
 assert.equal(c.realReviewedPoolCount,0);assert.equal(evaluateAdaptiveEvidence({...r,pool:'reviewed'}).reason,'NO_AUTHENTICATED_REVIEWED_TASKS');
 assert.equal(evaluateAdaptiveEvidence({...r,version:'0'.repeat(64)}).reason,'INVALID_FIXTURE_SELECTION');
 assert.equal(evaluateAdaptiveEvidence({...r,studentId:'fiction'}).reason,'INVALID_REQUEST');
 assert.equal(evaluateAdaptiveEvidence(r).status,'synthetic-evaluation');
});
test('ENG-030 fixed held-out fixture and finite-grid reports with abstention bounds and no empirical accuracy',()=>{
 const version=adaptiveEvidenceCatalog().syntheticPoolVersion,r=evaluateAdaptiveEvidence({pool:'synthetic',version,scenario:'fixed-transfer'});
 assert.equal(r.totalFixtures,8);assert.equal(r.classified,4);assert.equal(r.coverage,.5);assert.equal(r.classifiedFixtureAgreement,.5);
 assert.deepEqual(r.unresolvedOutcomeBounds,{lower:.25,upper:.75});assert.equal(r.empiricalAccuracy,null);assert.equal(r.confidenceInterval,null);assert.equal(r.masteryValidated,false);
 const g=evaluateAdaptiveEvidence({pool:'synthetic',version,scenario:'finite-grid'});assert.equal(g.gridCases,59049);assert.equal(Object.values(g.counts).reduce((a,b)=>a+b,0),59049);assert.equal(g.empiricalAccuracy,null);
});
test('M115 authenticated adult-only GET interface denies learner inputs and real pool',async()=>{
 const app=await startPilotBackend();try{
  const url=app.url+'/v1/adaptive-rehearsal',headers={Authorization:'Bearer '+app.token};
  assert.equal((await fetch(url)).status,401);
  const c=await (await fetch(url,{headers})).json();assert.equal(c.realReviewedPoolCount,0);
  const query='?pool=synthetic&version='+c.syntheticPoolVersion+'&scenario=fixed-transfer';
  const r=await fetch(url+query,{headers});assert.equal(r.status,200);assert.equal((await r.json()).masteryEnabled,false);
  assert.equal((await fetch(url+query+'&studentId=fiction',{headers})).status,400);
  assert.equal((await fetch(url+query.replace('pool=synthetic','pool=reviewed'),{headers})).status,422);
  assert.equal((await fetch(url,{method:'PUT',headers})).status,405);
  assert.equal((await fetch(app.url+'/v1/mastery',{headers})).status,404);
 }finally{await app.close()}
});
