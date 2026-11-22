import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STUDIO_LESSONS,STUDIO_IDS,STUDIO_VERSION,studioCheck,studioExercise,isValidStudioAttempt,studioSummary} from '../assets/studio-engine.js';
import {emptyHistory,normalizeHistory,mergeHistory,recordStudioAttempt,getAchievements} from '../assets/growth-engine.js';
const at='2026-11-23T09:00:00.000Z',day='2026-11-23';
const entry=(journeyId,stageId,response,n=1)=>({id:`test:${journeyId}:${stageId}:${n}`,journeyId,stageId,ageBand:'11-14',version:STUDIO_VERSION,response,correct:studioCheck(journeyId,stageId,response),at,day});
test('M15 has two original bilingual lessons with distinct accessible exercise mechanics',()=>{
 assert.deepEqual(STUDIO_IDS,['fractions','circuit-path']);
 for(const id of STUDIO_IDS){const l=STUDIO_LESSONS[id];assert.ok(l.concept[0].length>50&&l.concept[1].length>30);assert.ok(l.mission[0]&&l.mission[1]);assert.equal(l.stages.length,2);assert.deepEqual(l.stages.map(s=>s.id),['try','play']);assert.ok(l.source.url.startsWith('https://'))}
 assert.notEqual(studioExercise('fractions','try').type,studioExercise('circuit-path','try').type);
});
test('Fraction exercises check exact equal pieces and distinct choices',()=>{
 assert.equal(studioCheck('fractions','try',2),true);
 for(const v of [0,1,3,4])assert.equal(studioCheck('fractions','try',v),false);
 assert.equal(studioCheck('fractions','play',0),true);
 assert.equal(studioCheck('fractions','play',1),false);
 assert.equal(studioCheck('fractions','play',2),false);
 assert.equal(studioCheck('fractions','try',2.5),false);
 assert.throws(()=>studioExercise('fractions','exploit'));
});
test('Switch model handles open/closed truth table and rejects strings',()=>{
 assert.equal(studioCheck('circuit-path','try',false),false);
 assert.equal(studioCheck('circuit-path','try',true),true);
 assert.equal(studioCheck('circuit-path','try','true'),false);
 assert.equal(studioCheck('circuit-path','play',0),true);
 assert.equal(studioCheck('circuit-path','play',1),false);
});
test('History rejects forged correct answer, preserves old M14 history and deduplicates',()=>{
 const record=entry('fractions','try',2);assert.ok(isValidStudioAttempt(record));assert.equal(isValidStudioAttempt({...record,correct:false}),false);
 assert.equal(isValidStudioAttempt({...record,ageBand:'3-5'}),false);
 assert.equal(isValidStudioAttempt({...record,journeyId:'anything'}),false);
 let h=normalizeHistory({labAttempts:[]});assert.deepEqual(h.studioAttempts,[]);
 h=recordStudioAttempt(h,record);h=recordStudioAttempt(h,record);assert.equal(h.studioAttempts.length,1);
 assert.equal(mergeHistory(h,h).studioAttempts.length,1);
 assert.throws(()=>recordStudioAttempt(h,{...record,correct:false}));
});
test('Only a recorded Try and Play count as a completed practice journey',()=>{
 let h=emptyHistory();assert.equal(studioSummary(h.studioAttempts,'11-14').completed,0);
 h=recordStudioAttempt(h,entry('fractions','try',2));assert.equal(studioSummary(h.studioAttempts,'11-14').completed,0);
 h=recordStudioAttempt(h,entry('fractions','play',0));assert.equal(studioSummary(h.studioAttempts,'11-14').completed,1);
 assert.equal(studioSummary(h.studioAttempts,'15-17').completed,0);
 assert.ok(getAchievements(h,day).some(x=>x.title==='Smart Studio Practice'));
 assert.deepEqual(getAchievements(emptyHistory(),day),[]);
});
test('M15 frontend, cache and external guide are linked without third-party copying',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const sw=fs.readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
 const app=fs.readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 const guide=fs.readFileSync(new URL('../smart-learning-studio/index.html',import.meta.url),'utf8');
 for(const s of ['id="smart-studio"','id="studio-progress"','assets/studio-app.js','href="smart-learning-studio/"'])assert.ok(html.includes(s),s);
 assert.ok(sw.includes('studio-engine.js')&&sw.includes('studio-app.js')&&sw.includes('smart-learning-studio/'));
 assert.ok(app.includes('AIFS_STUDIO_BRIDGE'));
 assert.ok(guide.includes('noindex,nofollow'));
 assert.ok(guide.includes('not yet expert-reviewed'));
});