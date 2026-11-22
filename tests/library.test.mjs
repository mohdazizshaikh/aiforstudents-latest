import test from 'node:test';import assert from 'node:assert/strict';
import {GAMES,AGE_BANDS,getGameBank,selectSession,evaluate,recommendedGame} from '../assets/catalog.js';
const scored=GAMES.filter(g=>g.mode==='scored'),reflective=GAMES.filter(g=>g.mode==='reflection');
const categories=new Set(GAMES.map(g=>g.category));
test('40 games across exactly eight categories, five games/category with Hindi labels',()=>{
 assert.equal(GAMES.length,40);assert.equal(categories.size,8);assert.equal(new Set(GAMES.map(g=>g.id)).size,40);
 for(const c of categories)assert.equal(GAMES.filter(g=>g.category===c).length,5,c);
 for(const g of GAMES){assert.ok(g.en.length>4);assert.ok(g.hi.length>2);assert.ok(g.description.length>10)}
});
test('Every game and age band has 20 unique IDs, five task families and translated prompts',()=>{
 let total=0;
 for(const g of GAMES)for(const age of AGE_BANDS){const bank=getGameBank(g.id,age.id);total+=bank.length;
  assert.equal(bank.length,20,`${g.id}/${age.id}`);assert.equal(new Set(bank.map(p=>p.id)).size,20);
  assert.equal(new Set(bank.map(p=>p.kind)).size,5,`${g.id}/${age.id}`);
  for(const p of bank){assert.equal(p.gameId,g.id);assert.equal(p.ageBand,age.id);assert.ok(p.questionHi?.length>5,p.id);assert.ok(p.question?.length>5,p.id);
   if(p.interaction==='number'){assert.equal(p.choices.length,0);assert.ok(/^\d+$/.test(p.answer),p.id)}
   else {assert.ok(p.choices.length>=2,p.id);assert.equal(new Set(p.choices).size,p.choices.length,p.id)}
   if(g.mode==='scored'){
     if(p.interaction==='order'){assert.equal(p.answer.split('|').length,p.choices.length);assert.equal(new Set(p.answer.split('|')).size,p.choices.length)}
     else if(p.interaction==='multi'){const selected=p.answer.split('|');assert.ok(selected.length>=2&&selected.length<=3,p.id);assert.ok(selected.every(c=>p.choices.includes(c)))}
     else if(p.interaction!=='number')assert.ok(p.choices.includes(p.answer),p.id);
     assert.equal(evaluate(p,p.answer).correct,true,p.id);
     if(p.interaction==='choice'||!p.interaction){for(const c of p.choices.filter(c=>c!==p.answer))assert.equal(evaluate(p,c).correct,false,p.id)}
   }else {assert.equal(p.answer,null,p.id);assert.equal(evaluate(p,p.choices[0]).correct,null,p.id)}
  }
 }
 assert.equal(total,3200);
});
test('20 fresh variants per game/age band, exactly 4 sessions then explicitly exhausted',()=>{
 for(const g of GAMES)for(const age of AGE_BANDS){let seen=[];const bank=getGameBank(g.id,age.id);
  for(let n=0;n<4;n++){const s=selectSession(bank,seen,n);assert.equal(s.items.length,5,`${g.id}/${age.id}/${n}`);assert.equal(new Set(s.items.map(p=>p.kind)).size,5);assert.ok(s.items.every(p=>!seen.includes(p.id)),g.id);seen.push(...s.items.map(p=>p.id))}
  assert.equal(new Set(seen).size,20);assert.equal(selectSession(bank,seen,4).exhausted,true);
 }
});
test('Reflective games never return ability scores',()=>{
 assert.equal(reflective.length,12);assert.equal(scored.length,28);
 for(const g of reflective)for(const a of AGE_BANDS){const bank=getGameBank(g.id,a.id);for(const p of bank)assert.equal(evaluate(p,p.choices[0]).correct,null)}
});
test('Input types include multiple selection, numeric entry, sequence ordering, choice and reflection',()=>{
 const interactions=new Set();for(const g of GAMES){const bank=getGameBank(g.id,'11-14');for(const p of bank)interactions.add(p.interaction||'choice')}
 assert.deepEqual([...interactions].sort(),['choice','multi','number','order','reflection'].sort());
});
test('Numeric and multi-select selections are checked, not blindly accepted',()=>{
 const num=getGameBank('math-explorer','11-14')[0];assert.equal(evaluate(num,String(Number(num.answer)+1)).correct,false);
 const mult=getGameBank('budget-challenge','11-14')[0];assert.equal(evaluate(mult,mult.answer.split('|')[0]).correct,false);
 assert.throws(()=>evaluate(mult,'not-a-choice'));
 const order=getGameBank('story-sequencer','11-14')[0];assert.equal(evaluate(order,order.answer.split('|').reverse().join('|')).correct,false);
});
test('Budget keys genuinely match the individually affordable options',()=>{
 for(const a of AGE_BANDS)for(const p of getGameBank('budget-challenge',a.id)){const budget=Number(p.question.match(/Budget ₹(\d+)/)[1]);const affordable=p.choices.filter(x=>Number(x.match(/₹(\d+)/)[1])<=budget).sort().join('|');assert.equal(p.answer,affordable,p.id)}
});
test('External gears agree with alternating direction across N-1 meshes',()=>{
 for(const a of AGE_BANDS)for(const p of getGameBank('gear-explorer',a.id)){
  const m=p.question.match(/has (\d+) external gears.*Gear (\d+) turns (clockwise|counterclockwise).*gear (\d+) turn/);
  assert.ok(m,p.id);const count=Number(m[1]),givenIndex=Number(m[2]),askedIndex=Number(m[4]),dir=m[3];assert.ok(givenIndex>=1&&givenIndex<=count&&askedIndex>=1&&askedIndex<=count);
  const diff=Math.abs(givenIndex-askedIndex);const target=diff%2===0?dir:(dir==='clockwise'?'counterclockwise':'clockwise');assert.equal(p.answer,target,p.id)
 }
});
test('Recommended next game remains usable with a 40-game catalog',()=>{
 const history={attempts:Array.from({length:5},()=>({gameId:'pattern-quest',ageBand:'11-14'}))};assert.equal(recommendedGame(history,'11-14'),'number-market');
});

test('Each game has 20 materially distinguishable displayed challenge states per age band',()=>{
 for(const g of GAMES)for(const age of AGE_BANDS){const bank=getGameBank(g.id,age.id);const signatures=bank.map(p=>[p.question,p.context||'',(p.sequence||[]).join(','),p.choices.slice().sort().join(','),p.answer??''].join('~'));assert.equal(new Set(signatures).size,20,`${g.id}/${age.id} has repeated visible tasks`)}
});