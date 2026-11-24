import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const c=JSON.parse(read('docs/M34_B2_DESIGN_CONTRACT.json'));
const doc=read('docs/M34_B2_DESIGN_AND_ACCEPTANCE.md');
test('M34 FP-066/067 tutor design is disabled, zero approved spend, no approved sources or child identifiers',()=>{
 assert.equal(c.publicReleaseApproved,false);assert.equal(c.generativeTutorEnabled,false);
 assert.deepEqual(c.approvedSourceIds,[]);assert.equal(c.core.apiBudgetInr,0);assert.equal(c.core.offline,true);
 assert.equal(c.optionalPilot.enabled,false);assert.equal(c.optionalPilot.approvedBudgetInr,0);
 assert.equal(c.optionalPilot.sendChildIdentifiers,false);assert.equal(c.optionalPilot.storeTranscripts,false);
 const p=c.optionalPilot;assert.equal(p.requestsPerDay*p.days*p.inputTokensPerRequest,320000);
 assert.equal(p.requestsPerDay*p.days*p.outputTokensPerRequest,100000);
 assert.ok(p.localRetrievalTargetMs<p.remoteTimeoutMs);
 assert.match(doc,/No vendor selected/);assert.match(doc,/kill switch/);assert.match(doc,/fallback/);
 assert.ok(Object.values(c.approval).every(v=>v===false));
});
test('M34 FP-076 mastery thresholds are only a disabled unvalidated hypothesis',()=>{
 const m=c.mastery;assert.equal(m.enabled,false);assert.equal(m.validated,false);assert.equal(m.highStakesUse,false);
 assert.ok(m.minimumDistinctTasks>=3&&m.minimumContexts>=2&&m.minimumSessions>=2);
 assert.equal(m.candidateThresholdPercent,80);assert.match(doc,/not validated thresholds/);
 assert.match(doc,/held-out transfer/);
});
test('M34 FP-077/078 no minor identifiers, aggregate joins or durable teacher queue',()=>{
 const a=c.aggregate;assert.equal(a.enabled,false);assert.equal(a.individualScores,false);assert.equal(a.crossSessionJoins,false);
 assert.ok(a.minimumGroupSize>=10&&a.minimumCellCount>=5);assert.equal(a.suppressComplementaryCells,true);
 assert.deepEqual(c.sharedDevice,{queuePersistence:'memory-only',identityInference:false,clearAll:true});
 assert.match(doc,/Browser history and OS backups are outside site guarantees/);
});
test('M34 FP-089 blank observer design requires authorization and forbids identifiable data',()=>{
 assert.equal(c.observer.enabled,false);assert.equal(c.observer.authorizedPilot,false);assert.equal(c.observer.allowIdentifiableData,false);
 assert.match(doc,/stop unless yes/);assert.match(doc,/No results or participant recruitment exist/);
});
