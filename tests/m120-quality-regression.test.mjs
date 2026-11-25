import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {auditQuality} from '../tools/quality-regression.mjs';
import {FORBIDDEN_PUBLIC_PATHS} from '../tools/check-live-staging.mjs';
import {ANONYMOUS_TARGETS} from '../tools/restricted-staging-audit.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('ENG-037 and 038 actual source budget and static privacy boundary',()=>{
 const r=auditQuality();assert.equal(r.valid,true,r.issues.join('; '));assert.ok(r.uniquePrecacheBytes>0);assert.ok(r.uniquePrecacheGzipBytes<r.uniquePrecacheBytes);assert.equal(r.guides.length,3);assert.equal(r.physicalDeviceVerified,false);assert.equal(r.realNetworkVerified,false);
 for(const p of ['/v1/health','/v1/chat','/v1/students','/v1/aggregate-rehearsal','/tools/pilot-backend.mjs'])assert.ok(FORBIDDEN_PUBLIC_PATHS.includes(p)&&ANONYMOUS_TARGETS.includes(p));
 console.log('M120 source budgets',JSON.stringify(r));
});
function worker(fail){
 const events={},old='aifs-discovery-previous',current=read('service-worker.js').match(/const CACHE='([^']+)'/)[1],keys=new Set([old,'unrelated-cache']);
 let skipped=false,claimed=false;
 const caches={open:async key=>{keys.add(key);return {addAll:async files=>{assert.ok(files.length>70);if(fail)throw Error('missing response')},match:async()=>null}},delete:async k=>keys.delete(k),keys:async()=>[...keys]};
 const self={registration:{scope:'https://fixture.invalid/'},location:{origin:'https://fixture.invalid'},addEventListener:(t,f)=>events[t]=f,skipWaiting:async()=>{skipped=true},clients:{claim:async()=>{claimed=true}}};
 runInNewContext(read('service-worker.js'),{self,caches,URL,fetch:()=>{throw Error('unexpected network')}});
 const fire=t=>{let task;events[t]({waitUntil:p=>{task=p}});return task};
 return {fire,keys,old,current,skipped:()=>skipped,claimed:()=>claimed,events};
}
test('ENG-038 worker lifecycle failure preserves previous cache, removes failed candidate',async()=>{
 const w=worker(true);await assert.rejects(w.fire('install'),/missing response/);assert.equal(w.skipped(),false);assert.ok(w.keys.has(w.old));assert.equal(w.keys.has(w.current),false);assert.ok(w.keys.has('unrelated-cache'));
});
test('ENG-038 successful worker install and activate removes only old project caches, never private API',async()=>{
 const w=worker(false);await w.fire('install');assert.ok(w.keys.has(w.old));assert.equal(w.skipped(),true);await w.fire('activate');
 assert.equal(w.claimed(),true);assert.ok(w.keys.has(w.current));assert.equal(w.keys.has(w.old),false);assert.ok(w.keys.has('unrelated-cache'));
 for(const url of ['https://fixture.invalid/v1/health','https://fixture.invalid/tools/pilot-backend.mjs','https://other.invalid/assets/app.js']){let intercepted=false;w.events.fetch({request:{method:'GET',url,mode:'navigate'},respondWith:()=>{intercepted=true}});assert.equal(intercepted,false)}
});
test('ENG-039 dynamic guide controls have explicit label targets and result text regions',()=>{
 const h=read('virtual-experiment-lab/index.html'),study=read('study-lab/index.html'),teacher=read('teacher-kit/index.html');
 for(const [html,ids] of [[h,['primary-lang','primary-model','compare-lang','compare-model','compare-variable','compare-prediction','cc-lang','cc-board','cc-grade','cc-subject','cc-edition']],[study,['workspace-lang','workspace-choice','workspace-queue','concept-lang','concept-goal']],[teacher,['workspace-lang','workspace-choice','workspace-queue']]])for(const id of ids){assert.ok(html.includes('for="'+id+'"'),id);assert.ok(html.includes('id="'+id+'"'),id)}
 assert.match(h,/id="primary-results" aria-live="polite"/);assert.match(h,/id="compare-results" aria-live="polite"/);assert.match(h,/id="primary-visual" aria-hidden="true"/);
});
test('ENG-040 deterministic static ZIP and exact historical rollback in temporary directory',{skip:!existsSync(new URL('../.git',import.meta.url))},()=>{
 const r=JSON.parse(execFileSync('python3',[new URL('../tools/rehearse-static-rollback.py',import.meta.url).pathname],{encoding:'utf8',timeout:30000}));
 assert.equal(r.valid,true);for(const k of ['reproducible','archiveExact','candidateVerified','rollbackVerified','localTemporaryOnly'])assert.equal(r[k],true);
 assert.equal(r.liveHostingVerified,false);assert.equal(r.publicReleaseApproved,false);console.log('M120 static rollback',JSON.stringify(r));
});
