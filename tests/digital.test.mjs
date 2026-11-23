import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DIGITAL_TOPICS,DIGITAL_AGES,DIGITAL_TASKS,DIGITAL_VERSION,digitalTask,digitalText,digitalGrade,digitalSummary,isValidDigitalAttempt} from '../assets/digital-engine.js';
import {emptyHistory,normalizeHistory,mergeHistory,recordDigitalAttempt,getAchievements} from '../assets/growth-engine.js';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const make=(topicId='ai',ageBand='11-14',taskIndex=0,choice=digitalTask(topicId,ageBand,taskIndex).answer)=>({id:`digital:${topicId}:${ageBand}:${taskIndex}:123456:abc123`,topicId,ageBand,taskIndex,choice,correct:digitalTask(topicId,ageBand,taskIndex).answer===choice,version:DIGITAL_VERSION,at:'2026-11-23T12:00:00.000Z',day:'2026-11-23'});
test('M18 exactly four topics, four age bands, 32 substantive original localized challenges',()=>{
 assert.deepEqual(DIGITAL_TOPICS.map(x=>x.id),['ai','algorithms','evidence','privacy']);assert.equal(DIGITAL_VERSION,'m18-v1');
 const ids=new Set();for(const item of DIGITAL_TOPICS){for(const lang of ['en','hi']){assert.ok(digitalText(item.title,lang).length>3);assert.ok(digitalText(item.intro,lang).length>24);assert.ok(digitalText(item.mission,lang).length>20)}
 for(const age of DIGITAL_AGES){const bank=DIGITAL_TASKS[item.id][age];assert.equal(bank.length,2);for(let i=0;i<2;i++){const task=digitalTask(item.id,age,i);assert.ok(!ids.has(task.id));ids.add(task.id);assert.equal(task.options.length,3);assert.ok(Number.isInteger(task.answer)&&task.answer>=0&&task.answer<3);for(const lang of ['en','hi']){assert.ok(digitalText(task.question,lang).length>12);assert.ok(digitalText(task.explanation,lang).length>18);assert.equal(task.options.filter(x=>x[lang].length>0).length,3)}}}}
 assert.equal(ids.size,32);
});
test('M18 response grading matches authored answer key across all 32 tasks',()=>{
 for(const topic of DIGITAL_TOPICS)for(const age of DIGITAL_AGES)for(let i=0;i<2;i++)for(let choice=0;choice<3;choice++){const task=digitalTask(topic.id,age,i),result=digitalGrade(topic.id,age,i,choice);assert.equal(result.correct,choice===task.answer);assert.equal(result.explanation,task.explanation)}
});
test('M18 all ages have substantively different question content, not only age labels',()=>{
 for(const topic of DIGITAL_TOPICS){const signature=DIGITAL_AGES.map(age=>DIGITAL_TASKS[topic.id][age].map(x=>x.question.en).join('|'));assert.equal(new Set(signature).size,4)}
});
test('M18 deterministic reference checks for the two numerical algorithm examples',()=>{
 assert.equal(digitalTask('algorithms','11-14',0).answer,0);assert.match(digitalTask('algorithms','11-14',0).explanation.en,/14 ÷ 2 = 7/);
 assert.equal(digitalTask('algorithms','11-14',1).answer,2);assert.match(digitalTask('algorithms','11-14',1).explanation.en,/1 → 3 → 5 → 7/);
 assert.equal(digitalTask('algorithms','15-17',1).answer,1);assert.match(digitalTask('algorithms','15-17',1).explanation.en,/three operations/);
});
test('M18 rejects invalid topics, question indices and response choices',()=>{
 assert.throws(()=>digitalTask('missing','11-14',0),RangeError);assert.throws(()=>digitalTask('ai','0-2',0),RangeError);assert.throws(()=>digitalTask('ai','11-14',2),RangeError);assert.throws(()=>digitalTask('ai','11-14',1.2),RangeError);assert.throws(()=>digitalGrade('ai','11-14',0,-1),RangeError);assert.throws(()=>digitalGrade('ai','11-14',0,3),RangeError);
});
test('M18 versioned attempts are normalized, deduped, merged and can be cleared',()=>{
 const a=make();assert.ok(isValidDigitalAttempt(a));let h=recordDigitalAttempt(emptyHistory(),a);assert.equal(h.digitalAttempts.length,1);h=recordDigitalAttempt(h,a);assert.equal(h.digitalAttempts.length,1);assert.equal(mergeHistory(h,h).digitalAttempts.length,1);assert.equal(digitalSummary(h.digitalAttempts,'11-14').topics,1);assert.equal(digitalSummary(h.digitalAttempts,'6-10').tries,0);assert.equal(emptyHistory().digitalAttempts.length,0);assert.deepEqual(normalizeHistory({digitalAttempts:[{...a,correct:false}]}).digitalAttempts,[]);
});
test('M18 invalid and mismatched attempts cannot enter the private history',()=>{
 const a=make();assert.throws(()=>recordDigitalAttempt(emptyHistory(),{...a,ageBand:'12-20'}));assert.throws(()=>recordDigitalAttempt(emptyHistory(),{...a,choice:9}));assert.throws(()=>recordDigitalAttempt(emptyHistory(),{...a,correct:false}));assert.throws(()=>recordDigitalAttempt(emptyHistory(),{...a,version:'old'}));
});
test('M18 Pride badge arises from recorded activity, not age or assumed aptitude',()=>{
 assert.ok(!getAchievements(emptyHistory(),'2026-11-23').some(x=>x.title==='Digital Safety Explorer'));
 const h=recordDigitalAttempt(emptyHistory(),make());const badges=getAchievements(h,'2026-11-23');const badge=badges.find(x=>x.title==='Digital Safety Explorer');assert.ok(badge);assert.match(badge.detail,/practice, not a test of intelligence/);
});
test('M18 linked main UI, privacy-safe events and static precache are present',()=>{
 const html=read('../index.html'),script=read('../assets/digital-app.js'),app=read('../assets/app.js'),sw=read('../service-worker.js'),config=read('../tools/configure-domain.mjs');
 for(const id of ['digital-skills','digital-title','digital-topics','digital-choices','digital-question','digital-feedback','digital-retry','digital-next'])assert.ok(html.includes(`id="${id}"`),id);
 assert.match(html,/assets\/digital-app\.js/);assert.match(app,/AIFS_DIGITAL_BRIDGE/);assert.match(app,/recordDigitalAttempt/);assert.match(app,/aifs-history-cleared/);assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|navigator\.sendBeacon|WebSocket|localStorage|sessionStorage/);
 for(const x of ['./assets/digital-engine.js','./assets/digital-app.js','./ai-digital-skills/'])assert.ok(sw.includes(x));assert.match(sw,/aifs-discovery-m28/);assert.match(config,/ai-digital-skills/);
 const guide=read('../ai-digital-skills/index.html');assert.match(guide,/noindex,nofollow/);assert.match(guide,/32\/32 tasks await/);
});