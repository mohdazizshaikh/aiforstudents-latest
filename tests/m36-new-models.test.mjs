import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateAdvanced,evaluateAdvanced,ADVANCED_IDS,advancedResultRows} from '../assets/advanced-lab-engine.js';
test('M36 four added conceptual models exhaust bounded input states',()=>{
 for(let x=-5;x<=5;x++){const r=calculateAdvanced('quadratic',{x});assert.equal(r.y,x*x);assert.equal(r.oppositeSquare,r.y);}
 for(let mass=1;mass<=5;mass++)for(let accel=0;accel<=5;accel++)assert.equal(calculateAdvanced('force-motion',{mass,accel}).forceN,mass*accel);
 for(let molecules=1;molecules<=6;molecules++)assert.deepEqual(calculateAdvanced('atom-count',{molecules}),{molecules,hydrogen:2*molecules,oxygen:molecules,totalAtoms:3*molecules});
 for(let length=10;length<=50;length+=10)for(let magnification=50;magnification<=200;magnification+=50)assert.equal(calculateAdvanced('cell-scale',{length,magnification}).diagramMm,length*magnification/1000);
 assert.equal(ADVANCED_IDS.length,32);
});
test('M36 new example checks are draft, bilingual and reject out-of-bounds states',()=>{
 for(const [id,state] of [['quadratic',{x:-3}],['force-motion',{mass:3,accel:2}],['atom-count',{molecules:3}],['cell-scale',{length:20,magnification:100}]]){
  const r=evaluateAdvanced(id,state,'hi');assert.equal(r.correct,true);assert.equal(r.publicReleaseApproved,false);assert.match(r.explanation,/[\u0900-\u097f]/);
  assert.ok(advancedResultRows(r.metrics,'hi').some(x=>/[\u0900-\u097f]/.test(x.label)));
  assert.throws(()=>calculateAdvanced(id,{...state,extra:1}));
 }
});
