import test from 'node:test';
import assert from 'node:assert/strict';
import {M12_GAMES,getAgeAdaptiveBank} from '../assets/age-adaptive.js';
import {AGE_BANDS,GAMES,getGameBank,evaluate} from '../assets/catalog.js';
import {auditContent} from '../tools/content-quality.mjs';
import {emptyHistory,recordSession,progressSummary,normalizeHistory} from '../assets/growth-engine.js';
import {readFileSync} from 'node:fs';

const scoreKinds=new Set(['logic-maze','number-market','story-sequencer','rotation-master','gear-explorer','mission-scheduler']);
const directions={N:[0,1],S:[0,-1],E:[1,0],W:[-1,0]};
const arrows=['↑','→','↓','←'];
const turn=(a,op)=>{let i=arrows.indexOf(a);if(op==='CW')return arrows[(i+1)%4];if(op==='CCW')return arrows[(i+3)%4];if(op==='HALF')return arrows[(i+2)%4];if(op==='MIRROR')return a==='→'?'←':a==='←'?'→':a;throw Error(op)};
function independentMarket(rule){const v=rule.values;switch(rule.op){
 case 'sum':return v.reduce((a,b)=>a+b,0);
 case 'minus':return v[0]-v[1];
 case 'divide':return v[0]/v[1];
 case 'ceil':return Math.ceil(v[0]/v[1]);
 case 'min':return Math.min(...v);
 case 'absdiff':return Math.abs(v[0]-v[1]);
 case 'percent':return rule.base*rule.percent/100;
 case 'percent2':return rule.base*rule.pct1*rule.pct2/10000;
 default:throw Error('unknown market rule');
}}
const signature=p=>[p.question,p.context,(p.sequence||[]).join(','),[...p.choices].sort().join(','),p.answer||''].join('~');

test('M12-A: eight representative banks, exactly one per category, all 640 items are version 2 and pending review',()=>{
 assert.equal(M12_GAMES.length,8);
 assert.equal(new Set(M12_GAMES.map(id=>GAMES.find(g=>g.id===id).category)).size,8);
 let n=0;
 for(const game of M12_GAMES)for(const age of AGE_BANDS){
  const bank=getGameBank(game,age.id);n+=bank.length;
  assert.equal(bank.length,20);
  assert.equal(new Set(bank.map(p=>p.kind)).size,5);
  assert.equal(new Set(bank.map(p=>p.id)).size,20);
  assert.equal(new Set(bank.map(signature)).size,20,`${game} ${age.id}`);
  assert.ok(bank.every(p=>p.contentVersion===2&&p.reviewed===false&&p.educationalReviewStatus==='pending'&&p.translationReviewStatus==='pending'));
  assert.ok(bank.every(p=>p.id.startsWith(`${game}:${age.id}:m12:`)));
  for(const p of bank){
   assert.ok(p.question.length>20&&p.questionHi.length>20,p.id);
   assert.equal(p.mode==='scored',scoreKinds.has(game),p.id);
   assert.equal(evaluate(p,p.mode==='scored'?p.answer:p.choices[0]).correct,p.mode==='scored'?true:null,p.id);
  }
 }
 assert.equal(n,640);
});
test('M12-A: each age band has materially different task complexity, not merely relabeled IDs',()=>{
 for(const game of M12_GAMES){
  const banks=AGE_BANDS.map(a=>getGameBank(game,a.id));
  for(let j=0;j<20;j++) assert.equal(new Set(banks.map(b=>signature(b[j]))).size,4,`${game} challenge ${j} not age-differentiated`);
 }
});
test('M12-A: reference verification of all 400 scored items in 5 redesigned banks and 80 order items',()=>{
 let count=0;
 for(const game of M12_GAMES)for(const age of AGE_BANDS)for(const p of getAgeAdaptiveBank(game,age.id)){
  if(!p.reference)continue;
  const r=p.reference;
  if(r.kind==='maze'){
   const pos=[...r.start];for(const [d,n] of r.moves){pos[0]+=directions[d][0]*n;pos[1]+=directions[d][1]*n};assert.equal(Number(p.answer),pos[r.axis],p.id);
  } else if(r.kind==='market'){
   assert.equal(Number(p.answer),independentMarket(r.rule),p.id);
  } else if(r.kind==='rotation'){
   assert.equal(p.answer,r.ops.reduce(turn,r.start),p.id);
  } else if(r.kind==='gears'){
   const dir=Math.abs(r.source-r.to)%2? (r.initial==='clockwise'?'counterclockwise':'clockwise'):r.initial;
   assert.equal(p.answer,dir,p.id);
   assert.ok(r.source>0&&r.source<=r.total&&r.to>0&&r.to<=r.total,p.id);
  }else if(r.kind==='order'){
   assert.equal(p.answer,r.correctSteps.join('|'),p.id);
  }else throw Error('Unknown reference check: '+r.kind);
  count++;
 }
 assert.equal(count,480); // 6 scored games × 4 ages × 20 challenges
});
test('M12-A: reduced age-identical game banks without overclaiming educational validation',()=>{
 const {counts,errors}=auditContent();assert.deepEqual(errors,[]);
 assert.equal(counts.ageIdenticalGames,0); // 21 in M11, 14 in M12-A, zero in M12-B
 assert.equal(counts.items,3200);assert.equal(counts.missingHumanReview,3200);
 assert.equal(counts.englishHindiNumericMismatch,0);
});
const round=(id,version,date)=>({id,gameId:'number-market',ageBand:'11-14',attempted:5,correct:3,completedAt:`${date}T12:00:00.000Z`,day:date,replay:false,formatVersion:2,contentVersion:version,kinds:['total','change','share','discount','compare'],scenarioIds:[0,1,2,3,4].map(i=>`n:${id}:${i}`)});
test('M12-A: old records survive migration but scores across different content versions never compare',()=>{
 const old=round('legacy',1,'2026-11-19'),updated=round('fresh',2,'2026-11-20');
 let h=recordSession(emptyHistory(),old);h=recordSession(h,updated);
 assert.equal(h.sessions.length,2);assert.equal(progressSummary(h,'11-14','number-market').comparison,null);
 h=recordSession(h,round('fresh2',2,'2026-11-21'));
 assert.deepEqual(progressSummary(h,'11-14','number-market').comparison,{prior:3,current:3,delta:0});
 assert.equal(normalizeHistory(h).sessions.length,3);
});
test('M12-A: new scenario IDs and current-bank filtering prevent old completed content blocking the fresh pool',()=>{
 const old='number-market:11-14:total:0',newIds=new Set(getGameBank('number-market','11-14').map(p=>p.id));
 assert.equal(newIds.has(old),false);
 const app=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
 assert.match(app,/const currentIds=new Set\(bank\(\)\.map\(p=>p\.id\)\)/);
 assert.match(app,/contentVersion:ST\.items\[0\]\?\.contentVersion/);
});