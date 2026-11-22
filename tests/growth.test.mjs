import test from 'node:test';import assert from 'node:assert/strict';
import {getGameBank,selectSession} from '../assets/catalog.js';
import {emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,progressSummary,getAchievements,saveReflection,dailyPlan,markReview,localDay} from '../assets/growth-engine.js';
const today='2026-11-23';
const iso=n=>`2026-11-23T12:${String(n).padStart(2,'0')}:00.000Z`;
function playRound(history,game,idx,correct=3,age='11-14',replay=false){const seen=history.seen.filter(id=>id.startsWith(`${game}:${age}:`)||(game==='pattern-quest'&&id.startsWith(`${age}:`)));const items=selectSession(getGameBank(game,age),replay?[]:seen,idx).items;const id=`${game}-${idx}`;
 items.forEach((item,i)=>{history=recordAttempt(history,{scenarioId:item.id,gameId:game,kind:item.kind,ageBand:age,correct:item.mode==='scored'?i<correct:null,at:iso(idx*10+i),day:today,sessionId:id,replay})});
 history=recordSession(history,{id,gameId:game,ageBand:age,attempted:items.length,correct:game==='creative-studio'||game==='perspective-explorer'?null:correct,completedAt:iso(idx*10+9),day:today,replay,formatVersion:2,kinds:items.map(x=>x.kind),scenarioIds:items.map(x=>x.id)});return history;
}
test('Legacy Pattern Quest saved attempts migrate to the logical game',()=>{
 const h=normalizeHistory({attempts:[{scenarioId:'11-14:add:0',kind:'add',ageBand:'11-14',correct:true,sessionId:'old',at:iso(0),day:today}],seen:['11-14:add:0']});
 assert.equal(h.attempts[0].gameId,'pattern-quest');assert.equal(h.seen.length,1);
});
test('Distinct games and categories are independently counted',()=>{
 let h=emptyHistory();h=playRound(h,'pattern-quest',0,3);h=playRound(h,'number-market',0,4);
 assert.equal(progressSummary(h,'11-14','pattern-quest').attempts,5);
 assert.equal(progressSummary(h,'11-14','number-market').correct,4);
 assert.equal(progressSummary(h,'11-14','shape-builder').attempts,0);
});
test('Two fresh comparable template rounds are explicitly descriptive',()=>{
 let h=playRound(emptyHistory(),'number-market',0,2);h=playRound(h,'number-market',1,4);
 assert.deepEqual(progressSummary(h,'11-14','number-market').comparison,{prior:2,current:4,delta:2});
 const duplicated=recordAttempt(h,h.attempts[0]);assert.equal(duplicated.attempts.length,10);
});
test('Replay excluded from progress comparison',()=>{
 let h=playRound(emptyHistory(),'number-market',0,2);h=playRound(h,'number-market',1,4);h=playRound(h,'number-market',2,5,'11-14',true);
 assert.equal(progressSummary(h,'11-14','number-market').rounds,2);
 assert.equal(progressSummary(h,'11-14','number-market').comparison.current,4);
});
test('Reflective rounds have no numeric score or comparison',()=>{
 let h=playRound(emptyHistory(),'creative-studio',0,0);h=playRound(h,'creative-studio',1,0);
 const s=progressSummary(h,'11-14','creative-studio');assert.equal(s.correct,null);assert.equal(s.comparison,null);
 assert.ok(getAchievements(h,today).some(x=>x.title==='Thoughtful Explorer'));
});
test('Actual activity awards never appear before participation',()=>{
 assert.deepEqual(getAchievements(emptyHistory(),today),[]);
 let h=playRound(emptyHistory(),'strategy-island',0,3);const a=getAchievements(h,today);
 assert.ok(a.some(x=>x.title==='Round Complete'));assert.ok(a.some(x=>x.title==='New Explorer'));
});
test('Daily reflection remains voluntary; review and activities drive checklist',()=>{
 let h=emptyHistory();assert.deepEqual(dailyPlan(h,'11-14','number-market',20,'en',today).map(x=>x.done),[false,false,false]);
 h=playRound(h,'number-market',0,3);h=markReview(h,today);h=saveReflection(h,today,'tried');
 assert.deepEqual(dailyPlan(h,'11-14','number-market',15,'en',today).map(x=>x.done),[true,true,true]);
 assert.throws(()=>saveReflection(h,today,'not-allowed'));
});
test('Merged history deduplicates sessions and attempts',()=>{
 const h=playRound(emptyHistory(),'pattern-quest',0,2);const merged=mergeHistory(h,h);
 assert.equal(merged.attempts.length,5);assert.equal(merged.sessions.length,1);
});