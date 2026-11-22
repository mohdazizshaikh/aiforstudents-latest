import test from 'node:test';import assert from 'node:assert/strict';
import {M12B_GAMES,getAgeAdaptiveBBank} from '../assets/age-adaptive-b.js';
import {AGE_BANDS,getGameBank,evaluate,GAMES} from '../assets/catalog.js';
import {auditContent} from '../tools/content-quality.mjs';
const signature=p=>[p.question,p.context,p.sequence?.join('|'),[...p.choices].sort().join('|'),p.answer].join('~');
const arrows=['↑','→','↓','←'];
const vec=[[0,1],[1,0],[0,-1],[-1,0]];
const fns={V:([x,y])=>[-x,y],H:([x,y])=>[x,-y],CW:([x,y])=>[y,-x],CCW:([x,y])=>[-y,x],HALF:([x,y])=>[-x,-y]};
test('M12-B: all 14 previously identical games are now versioned, unreviewed and age differentiated',()=>{
 assert.equal(M12B_GAMES.length,14);assert.equal(new Set(M12B_GAMES).size,14);let total=0;
 for(const id of M12B_GAMES){const banks=AGE_BANDS.map(a=>getGameBank(id,a.id));for(const bank of banks){total+=bank.length;assert.equal(bank.length,20);assert.equal(new Set(bank.map(signature)).size,20,id);for(const p of bank){assert.equal(p.contentVersion,2);assert.equal(p.reviewed,false);assert.equal(p.educationalReviewStatus,'pending');assert.equal(p.translationReviewStatus,'pending');assert.ok(p.id.includes(':m12b:'));assert.equal(evaluate(p,p.mode==='scored'?p.answer:p.choices[0]).correct,p.mode==='scored'?true:null)}}for(let i=0;i<20;i++)assert.equal(new Set(banks.map(b=>signature(b[i]))).size,4,`${id} ${i}`)}
 assert.equal(total,1120);
});
test('M12-B: word builder age progression, alphabetic accuracy and no duplicate letters',()=>{
 const lengths=[];for(const age of AGE_BANDS){const bank=getAgeAdaptiveBBank('word-builder',age.id);lengths.push(bank.reduce((a,p)=>a+p.choices.length,0)/20);for(const p of bank){assert.equal(new Set(p.choices).size,p.choices.length);assert.equal(p.answer.split('|').length,p.choices.length);assert.equal([...p.answer.split('|')].sort().join(),[...p.choices].sort().join())}}assert.ok(lengths[0]<lengths[3]);
});
test('M12-B: synonym answer is unique and distinct from distractors',()=>{for(const age of AGE_BANDS)for(const p of getAgeAdaptiveBBank('meaning-hunter',age.id)){assert.equal(p.choices.length,4);assert.equal(new Set(p.choices).size,4);assert.equal(p.choices.filter(v=>v===p.answer).length,1);assert.equal(evaluate(p,p.answer).correct,true);for(const v of p.choices.filter(v=>v!==p.answer))assert.equal(evaluate(p,v).correct,false)}});
test('M12-B: reference checks for 80 mirror operations and 80 sequences',()=>{let checked=0;for(const age of AGE_BANDS){for(const p of getAgeAdaptiveBBank('mirror-puzzle',age.id)){const r=p.reference,point=r.ops.reduce((a,op)=>fns[op](a),vec[arrows.indexOf(r.start)]),answer=arrows[vec.findIndex(x=>x[0]===point[0]&&x[1]===point[1])];assert.equal(p.answer,answer,p.id);checked++}for(const p of getAgeAdaptiveBBank('cause-effect',age.id)){assert.equal(p.answer,p.reference.steps.join('|'),p.id);assert.equal(p.choices.length,p.reference.steps.length,p.id);checked++}}assert.equal(checked,160)});
test('M12-B: 40 categories remain, zero full age-identical banks, no invented expert review',()=>{const a=auditContent();assert.deepEqual(a.errors,[]);assert.equal(a.counts.ageIdenticalGames,0);assert.equal(a.counts.missingHumanReview,3200);assert.equal(GAMES.length,40)});