import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS,calculateAdvanced,evaluateAdvanced,auditAdvancedPairs,advancedResultRows,validateAdvancedState} from '../assets/advanced-lab-engine.js';
import {auditContentQueues} from '../tools/release-preflight.mjs';
import {buildReviewRows,resolvePilotContent} from '../tools/build-review-packet.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('M36 thirty-two distinct draft labs have bilingual controls and bounded valid states',()=>{
 assert.equal(ADVANCED_IDS.length,32);assert.equal(new Set(ADVANCED_IDS).size,32);
 assert.deepEqual(auditAdvancedPairs(),[]);
 for(const id of ADVANCED_IDS){
  const m=ADVANCED_MODELS[id],r=evaluateAdvanced(id,m.target,'hi');
  assert.equal(r.correct,true,id);assert.equal(evaluateAdvanced(id,m.initial).correct,false,id);
  assert.equal(r.publicReleaseApproved,false);assert.match(r.draftStatus,/PENDING/);
  assert.ok(r.explanation.length>30);assert.ok(advancedResultRows(r.metrics,'hi').length>0);
  assert.throws(()=>validateAdvancedState(id,{...m.initial,personal:'never'}));
  const f=m.fields[0];assert.throws(()=>validateAdvancedState(id,{...m.initial,[f.id]:f.options?'unknown':f.min-1}));
 }
 assert.throws(()=>calculateAdvanced('missing',{}));assert.throws(()=>evaluateAdvanced('coordinate',{x:2},'xx'));
 const copy=structuredClone(ADVANCED_MODELS);copy.sound.hint[1]='';assert.match(auditAdvancedPairs(copy).join(' '),/sound/);
});
test('M33 maths: 100 multiplication states, all reflection/rotation/translation coordinate states and linear function',()=>{
 for(let groups=1;groups<=10;groups++)for(let each=1;each<=10;each++)assert.equal(calculateAdvanced('ratio-algebra',{groups,each}).total,groups*each);
 for(let x=-5;x<=5;x++){
  assert.deepEqual(calculateAdvanced('coordinate',{x}),{x,y:2*x+1});
  for(let y=-5;y<=5;y++){
   for(const [transform,a,b] of [['reflect',-x,y],['rotate',-y,x],['translate',x+2,y-1]]){
    const r=calculateAdvanced('symmetry',{x,y,transform});assert.equal(r.transformedX,a);assert.equal(r.transformedY,b);
   }
  }
 }
});
test('M33 probability sampling is bounded, seeded and has no undefined numeric division on empty bag',()=>{
 for(let red=0;red<=10;red++)for(let blue=0;blue<=10;blue++){
  const state={red,blue,seed:4,draws:50},r=calculateAdvanced('probability',state);
  assert.deepEqual(r,calculateAdvanced('probability',state));
  if(red+blue===0){assert.equal(r.probabilityRed,null);assert.equal(r.sampleProportion,null);assert.equal(r.sampleSize,0);continue}
  assert.equal(r.probabilityRed,red/(red+blue));assert.equal(r.sampleSize,50);
  assert.ok(r.sampleRed>=0&&r.sampleRed<=50);
  if(red===0)assert.equal(r.sampleRed,0);if(blue===0)assert.equal(r.sampleRed,50);
 }
 assert.ok(new Set([1,2,3,4,5,6,7,8,9,10].map(seed=>calculateAdvanced('probability',{red:3,blue:2,seed,draws:100}).sampleRed)).size>1);
 assert.equal(evaluateAdvanced('probability',{red:3,blue:2,seed:8,draws:100}).correct,true);
 assert.match(evaluateAdvanced('probability',{red:0,blue:0,seed:1,draws:10},'hi').explanation,/खाली थैली/);
});
test('M33 Physics: exact ideal heat, independent silent frequency/amplitude, pole interactions and speed equality',()=>{
 for(let joules=100;joules<=500;joules+=100)for(let mass=1;mass<=5;mass++)assert.equal(calculateAdvanced('temperature',{joules,mass}).idealDeltaC,joules/(mass*100));
 for(let period=1;period<=10;period++)for(let amplitude=1;amplitude<=5;amplitude++){const r=calculateAdvanced('sound',{period,amplitude});assert.equal(r.frequencyHz,1000/period);assert.equal(r.relativeAmplitude,amplitude)}
 for(const a of ['N','S'])for(const b of ['N','S'])assert.equal(calculateAdvanced('magnetism',{a,b}).interaction,a===b?'repel':'attract');
 for(let aTime=1;aTime<=10;aTime++)for(let bTime=1;bTime<=10;bTime++)for(let aDistance=10;aDistance<=50;aDistance+=10)for(let bDistance=10;bDistance<=50;bDistance+=10){
  const r=calculateAdvanced('measurement',{aTime,bTime,aDistance,bDistance});
  assert.equal(r.speedA,aDistance/aTime);assert.equal(r.speedB,bDistance/bTime);assert.equal(r.equalSpeed,aDistance*bTime===bDistance*aTime);
 }
});
test('M33 chemistry: IUPAC 2022 first-20 symbol/group/period reference and symbolic closed-system mass totals',()=>{
 const symbols='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca'.split(' ');
 const groups=[1,18,1,2,13,14,15,16,17,18,1,2,13,14,15,16,17,18,1,2];
 for(let atomic=1;atomic<=20;atomic++){
  const r=calculateAdvanced('periodic',{atomic});
  assert.deepEqual(r,{atomicNumber:atomic,symbol:symbols[atomic-1],group:groups[atomic-1],period:atomic<=2?1:atomic<=10?2:atomic<=18?3:4});
 }
 for(let a=1;a<=10;a++)for(let b=1;b<=10;b++)for(let c=1;c<=10;c++)for(let d=1;d<=10;d++){
  const r=calculateAdvanced('mass-balance',{a,b,c,d});assert.equal(r.totalG,a+b);assert.equal(r.productTotalG,c+d);assert.equal(r.balanced,a+b===c+d)
 }
 assert.match(read('docs/M33_EXPANDED_LABS_QA.md'),/IUPAC_Periodic_Table-04May22_CRA.pdf/);
});
test('M33 Biology: simplified interactions and abstract Mendelian grid, never personal genetic profiling',()=>{
 const expected={'flower-bee':'pollination example','frog-insect':'predation example','fungus-leaf':'decomposition example'};
 for(const [pair,outcome] of Object.entries(expected))assert.equal(calculateAdvanced('ecosystem',{pair}).interaction,outcome);
 for(const one of ['AA','Aa','aa'])for(const two of ['AA','Aa','aa']){
  const r=calculateAdvanced('heredity',{one,two});assert.equal(Object.values(r.genotypeGrid).reduce((a,b)=>a+b,0),4);
 }
 assert.deepEqual(calculateAdvanced('heredity',{one:'Aa',two:'Aa'}).genotypeGrid,{AA:1,Aa:2,aa:1});
 assert.deepEqual(calculateAdvanced('heredity',{one:'AA',two:'aa'}).genotypeGrid,{AA:0,Aa:4,aa:0});
 assert.match(ADVANCED_MODELS.heredity.caveat[0],/not human genetic diagnosis/);
 assert.match(evaluateAdvanced('ecosystem',{pair:'flower-bee'},'en').explanation,/Grass → grasshopper → frog/);
});
test('M36 review packet includes thirty-two pending versioned draft records and complete controls',()=>{
 const q=auditContentQueues();assert.equal(q.total,3324);assert.equal(q.pending,3324);assert.equal(q.counts.advanced.pending,32);
 const r=buildReviewRows().filter(x=>x.queue==='advanced');assert.equal(r.length,32);
 for(const x of r){assert.match(x.content_sha256,/^[a-f0-9]{64}$/);assert.ok(x.hindi_draft.length>10);assert.ok(x.context_hindi.length>20);assert.match(x.answer_or_guidance,/state-dependent/);assert.equal(x.human_decision,'NO DECISION RECORDED BY THIS EXPORT')}
 assert.throws(()=>resolvePilotContent('advanced',{id:'advanced:sound',contentVersion:999}),/version/);
});
test('M33 offline visual table and button controls have no input persistence, network or audio playback',()=>{
 const html=read('index.html'),app=read('assets/advanced-lab-app.js'),sw=read('service-worker.js');
 for(const id of ['advanced-labs','advanced-topic','advanced-values','advanced-visual','advanced-feedback','advanced-controls'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(app,/aria-pressed/);assert.match(app,/aifs-history-cleared/);
 assert.doesNotMatch(app,/localStorage|sessionStorage|fetch\(|AudioContext|XMLHttpRequest|innerHTML/);
 for(const path of ['./assets/advanced-lab-engine.js','./assets/advanced-lab-app.js','./assets/teacher-cards-engine.js'])assert.ok(sw.includes(path));
});
