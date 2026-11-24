import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {APPROVED_SOURCE_REGISTRY,approvedSourceHint} from '../tools/approved-source-retrieval.mjs';
import {validateEvidenceSnapshot} from '../tools/verify-evidence-snapshot.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const tracker=read('docs/MASTER_100_WORK_ITEMS.json'),snapshot=read('docs/M35_EVIDENCE_SNAPSHOT.json');
test('M35 exact-head evidence snapshot references every verified engineering task, never human approval',()=>{
 const r=validateEvidenceSnapshot(tracker,snapshot);
 assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.verifiedTaskReferences,68);
 assert.equal(r.gitObjectsChecked,false);assert.equal(r.humanApprovalAuthenticated,false);assert.equal(r.publicReleaseApproved,false);
});
test('M35 snapshot rejects missing, duplicate, unexpected and malformed evidence',()=>{
 for(const mutate of [s=>s.entries.pop(),s=>s.entries.push(s.entries[0]),s=>s.entries[0].evidence[0].blob='fake',s=>s.entries[0].evidence[0].path='other',s=>s.publicReleaseApproved=true]){
  const s=structuredClone(snapshot);mutate(s);assert.equal(validateEvidenceSnapshot(tracker,s).valid,false);
 }
 const r=validateEvidenceSnapshot(tracker,snapshot,{resolveBlob:()=> '0'.repeat(40)});assert.equal(r.valid,false);
 assert.equal(r.gitObjectsChecked,true);
});
test('M35 valid-looking source and version cannot turn on an unapproved tutor',()=>{
 assert.deepEqual(APPROVED_SOURCE_REGISTRY,[]);assert.ok(Object.isFrozen(APPROVED_SOURCE_REGISTRY));
 for(const language of ['en','hi']){
  const r=approvedSourceHint({id:'science:motion',versionHash:'a'.repeat(64),language});
  assert.equal(r.reason,'NO_AUTHENTICATED_APPROVED_SOURCE');assert.equal(r.passage,null);assert.equal(r.citation,null);assert.equal(r.remoteEnabled,false);
 }
});
test('M35 rejects free text, external URL, injected approval, unknown language and malformed version',()=>{
 const valid={id:'science:motion',versionHash:'a'.repeat(64),language:'en'};
 for(const x of [null,'question',{...valid,approved:true},{...valid,prompt:'anything'},{...valid,id:'https://example.org'},{...valid,language:'xx'},{...valid,versionHash:'123'}]){
  const r=approvedSourceHint(x);assert.equal(r.reason,'INVALID_REQUEST');assert.equal(r.passage,null);assert.equal(r.remoteEnabled,false);
 }
});
