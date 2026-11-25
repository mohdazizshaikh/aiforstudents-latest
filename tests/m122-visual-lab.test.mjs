import test from 'node:test';import assert from 'node:assert/strict';
import {VISUAL_IDS,visualDefinition,visualInitial,evaluateVisual} from '../assets/visual-lab-engine.js';
import {prototypeChoices} from '../assets/extended-lab-catalog.js';
import {prototypeWorksheet} from '../assets/prototype-worksheet-engine.js';
import {conceptPath} from '../assets/concept-pathways.js';
const range=(lo,hi)=>Array.from({length:hi-lo+1},(_,i)=>lo+i);
test('Matrix transformation: all 625 integer matrices agree with independent shoelace calculation',()=>{
 for(const a of range(-2,2))for(const b of range(-2,2))for(const c of range(-2,2))for(const d of range(-2,2)){
 const r=evaluateVisual('matrix-transform',{a,b,c,d}),p=r.visual.points;
 assert.deepEqual(p,[[0,0],[2*a,2*c],[b,d]]);
 const twice=p.reduce((sum,[x,y],i)=>{const [u,v]=p[(i+1)%3];return sum+x*v-y*u},0);
 assert.equal(r.rows[2].value,Math.abs(twice)/2);
 }
});
test('Velocity-time graph: 140 signed trajectories match stepwise trapezoid sum',()=>{
 for(const v of range(-3,3))for(const a of range(-2,2))for(const t of range(1,4)){
 const r=evaluateVisual('velocity-graph',{v,a,t}),pts=r.visual.points;
 assert.equal(pts.length,t+1);let s=0;for(let i=1;i<pts.length;i++)s+=(pts[i-1][1]+pts[i][1])/2;
 assert.equal(r.rows[1].value,s);assert.equal(r.rows[0].value,pts.at(-1)[1]);
 }
});
test('Particle exchange conserves eight tokens per type and each step is a local swap',()=>{
 let before=null;for(const steps of range(0,16)){
 const r=evaluateVisual('particle-mixing',{steps}),cells=r.visual.cells;
 assert.equal(cells.filter(x=>x==='A').length,8);assert.equal(cells.filter(x=>x==='B').length,8);
 if(before){const change=cells.flatMap((x,i)=>x===before[i]?[]:[i]);assert.ok(change.length===0||change.length===2);
 if(change.length){const [a,b]=change;assert.equal(Math.abs(a%4-b%4)+Math.abs(Math.floor(a/4)-Math.floor(b/4)),1)}}
 before=cells;assert.ok(r.rows[2].value>=0&&r.rows[2].value<=24)
 }
});
test('Cell division stages preserve schematic DNA count and distinguish chromosome from cell count',()=>{
 const expected=[[2,4,1],[2,4,1],[4,4,1],[4,4,1],[4,4,2]];
 for(const stage of range(0,4)){const r=evaluateVisual('cell-division-stages',{stage});assert.deepEqual(r.rows.slice(1,4).map(x=>x.value),expected[stage])}
});
test('Four visual models strict controls, bilingual text, exact catalog/worksheet/graph links',()=>{
 assert.equal(VISUAL_IDS.length,4);
 for(const id of VISUAL_IDS){const initial=visualInitial(id),a=evaluateVisual(id,initial),b=evaluateVisual(id,initial,'hi'),d=visualDefinition(id);
 assert.notEqual(a.rows[0].label,b.rows[0].label);assert.equal(a.publicReleaseApproved,false);assert.equal(a.storesStudentData,false);
 for(const f of d.fields)assert.throws(()=>evaluateVisual(id,{...initial,[f.id]:999}));
 assert.throws(()=>evaluateVisual(id,{...initial,student:'x'}));assert.throws(()=>evaluateVisual(id,initial,'xx'));
 const k='prototype:'+id,x=prototypeChoices().find(x=>x.key===k);assert.ok(x.href.endsWith('#visual-lab'));assert.equal(prototypeWorksheet(k,'hi').steps.length,3);assert.equal(conceptPath(k).at(-1),k)
 }
});
