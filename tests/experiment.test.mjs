import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {EXPERIMENT_VERSION,EXPERIMENTS,EXPERIMENT_IDS,relation,bulbLit,evaluateExperiment,isValidExperimentAttempt,experimentSummary} from '../assets/experiment-engine.js';
import {emptyHistory,recordExperimentAttempt,mergeHistory,normalizeHistory,getAchievements} from '../assets/growth-engine.js';
const now='2026-11-23T10:00:00.000Z';const day='2026-11-23';
const mk=(experimentId,taskId,response,n=1)=>({id:`experiment:${n}`,experimentId,taskId,response,correct:evaluateExperiment(experimentId,taskId,response).correct,ageBand:'11-14',version:EXPERIMENT_VERSION,at:now,day});
const f=(n,d)=>({n,d});
test('M16 has two original Hindi/English experiments, two distinct challenge mechanics each',()=>{assert.deepEqual(EXPERIMENT_IDS,['fractions-lab','series-circuit']);for(const id of EXPERIMENT_IDS){const x=EXPERIMENTS[id];for(const k of ['overview','title','mission'])assert.ok(x[k][0].length>20&&x[k][1].length>10);assert.equal(x.tasks.length,2);assert.ok(x.source.startsWith('https://'));}});
test('Cross-multiplication reference covers proper, equivalent, zero and full fractions',()=>{
 for(let a=2;a<=8;a++)for(let b=0;b<=a;b++)for(let c=2;c<=8;c++)for(let d=0;d<=c;d++){
 const lhs=b*c,rhs=d*a,expected=lhs<rhs?'lt':lhs>rhs?'gt':'eq';assert.equal(relation(f(b,a),f(d,c)),expected)
 }
 assert.throws(()=>relation(f(9,8),f(1,2)));assert.throws(()=>relation(f(1,1),f(1,2)));
});
test('Comparison validates current strip state; wrong claim stays wrong',()=>{
 const base={a:f(1,2),b:f(2,3)};
 assert.equal(evaluateExperiment('fractions-lab','compare',{...base,choice:'lt'}).correct,true);
 assert.equal(evaluateExperiment('fractions-lab','compare',{...base,choice:'gt'}).correct,false);
 assert.equal(evaluateExperiment('fractions-lab','compare',{...base,choice:'eq'}).correct,false);
 assert.throws(()=>evaluateExperiment('fractions-lab','compare',{...base,choice:'true'}));
});
test('Equivalence requires proper positive ratio and two different denominators',()=>{
 assert.equal(evaluateExperiment('fractions-lab','equivalence',{a:f(1,2),b:f(2,4)}).correct,true);
 assert.equal(evaluateExperiment('fractions-lab','equivalence',{a:f(2,4),b:f(3,6)}).correct,true);
 for(const v of [{a:f(0,2),b:f(0,4)},{a:f(1,2),b:f(1,2)},{a:f(2,2),b:f(4,4)},{a:f(1,2),b:f(2,3)}])assert.equal(evaluateExperiment('fractions-lab','equivalence',v).correct,false);
});
test('Two series switches follow complete truth table; off task requires exactly one open',()=>{
 for(const a of [false,true])for(const b of [false,true]){
 const response={a,b};assert.equal(bulbLit(response),a&&b);
 assert.equal(evaluateExperiment('series-circuit','light',response).correct,a&&b);
 assert.equal(evaluateExperiment('series-circuit','interrupt',response).correct,a!==b);
 }
 assert.throws(()=>bulbLit({a:'false',b:true}));
});
test('Forged history rejected, deduplicated and merged without dropping M15 attempts',()=>{
 const valid=mk('fractions-lab','equivalence',{a:f(1,2),b:f(2,4)});
 assert.ok(isValidExperimentAttempt(valid));assert.equal(isValidExperimentAttempt({...valid,correct:false}),false);
 assert.equal(isValidExperimentAttempt({...valid,version:99}),false);
 assert.equal(isValidExperimentAttempt({...valid,ageBand:'5-7'}),false);
 assert.equal(isValidExperimentAttempt({...valid,response:{a:f(999,2),b:f(2,4)}}),false);
 let h=emptyHistory();assert.equal(experimentSummary(h.experimentAttempts,'11-14').attempts,0);
 h=recordExperimentAttempt(h,valid);h=recordExperimentAttempt(h,valid);assert.equal(h.experimentAttempts.length,1);
 assert.equal(mergeHistory(h,h).experimentAttempts.length,1);
 assert.equal(experimentSummary(h.experimentAttempts,'11-14').explored,0);
 assert.equal(experimentSummary(h.experimentAttempts,'18+').attempts,0);
 assert.throws(()=>recordExperimentAttempt(h,{...valid,correct:false}));
 const bad=normalizeHistory({experimentAttempts:[{...valid,correct:false},valid],studioAttempts:[],labAttempts:[]});assert.equal(bad.experimentAttempts.length,1);
 assert.ok(getAchievements(h,day).some(x=>x.title==='Virtual Lab Explorer'));
 assert.equal(getAchievements(emptyHistory(),day).some(x=>x.title==='Virtual Lab Explorer'),false);
});
test('Four distinct task IDs count as two explored experiments only when recorded',()=>{
 let h=emptyHistory();const f1={a:f(1,2),b:f(2,3),choice:'lt'};
 for(const [id,task,response,i] of [['fractions-lab','compare',f1,1],['fractions-lab','equivalence',{a:f(1,2),b:f(2,4)},2],['series-circuit','light',{a:true,b:true},3]])h=recordExperimentAttempt(h,mk(id,task,response,i));
 assert.equal(experimentSummary(h.experimentAttempts,'11-14').explored,1);
 h=recordExperimentAttempt(h,mk('series-circuit','interrupt',{a:true,b:false},4));assert.equal(experimentSummary(h.experimentAttempts,'11-14').explored,2);
});
test('M16 links, static guide, cache, privacy reset, and accessible controls present',()=>{
 const root=new URL('../',import.meta.url);const read=p=>fs.readFileSync(new URL(p,root),'utf8');const html=read('index.html'),sw=read('service-worker.js'),app=read('assets/app.js'),ui=read('assets/experiment-app.js'),guide=read('virtual-experiment-lab/index.html');
 for(const text of ['id="experiment-lab"','id="experiment-feedback"','assets/experiment-app.js','href="virtual-experiment-lab/"'])assert.ok(html.includes(text));
 for(const text of ['experiment-engine.js','experiment-app.js','virtual-experiment-lab/','aifs-discovery-m33'])assert.ok(sw.includes(text));
 assert.match(app,/AIFS_EXPERIMENT_BRIDGE/);assert.match(app,/recordExperimentAttempt/);
 assert.match(guide,/noindex,nofollow/);assert.match(guide,/not expert-reviewed/);
 for(const text of ['aria-label','aria-pressed','role\x27,\x27img','aifs-history-cleared'])assert.ok(ui.includes(text),text);
});