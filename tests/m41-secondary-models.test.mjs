import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateAdvanced,evaluateAdvanced,ADVANCED_MODELS,advancedResultRows} from '../assets/advanced-lab-engine.js';
test('M41 sequence and slope formulas exhaust all allowed numerical states',()=>{
 for(let first=1;first<=5;first++)for(let diff=1;diff<=5;diff++)for(let n=1;n<=6;n++)assert.equal(calculateAdvanced('arithmetic-sequence',{first,diff,n}).nthTerm,Array.from({length:n},(_,i)=>first+i*diff).at(-1));
 for(let x=-2;x<=3;x++)for(let step=1;step<=4;step++){const r=calculateAdvanced('square-slope',{x,step}),h=step/4;assert.equal(r.secantSlope,((x+h)**2-x*x)/h);assert.equal(r.tangentSlope,2*x);}
});
test('M41 kinematics and thin-lens equations satisfy their model constraints',()=>{
 for(let accel=0;accel<=5;accel++)for(let seconds=1;seconds<=5;seconds++){const r=calculateAdvanced('constant-acceleration',{accel,seconds});assert.equal(r.finalSpeed,accel*seconds);assert.equal(r.displacement,r.finalSpeed*seconds/2);}
 for(let f=2;f<=5;f++)for(let multiple=2;multiple<=5;multiple++){const r=calculateAdvanced('thin-lens',{f,multiple});assert.ok(Math.abs(1/f-1/r.objectCm-1/r.imageCm)<1e-12);assert.equal(r.inverted,true);assert.equal(r.magnitude,r.imageCm/r.objectCm);}
});
test('M41 charge, mass fraction, symbolic doubling and process outputs',()=>{
 for(let protons=1;protons<=12;protons++)for(let electrons=1;electrons<=12;electrons++)assert.equal(calculateAdvanced('ion-charge',{protons,electrons}).netCharge,protons-electrons);
 for(let a=1;a<=9;a++)for(let b=1;b<=9;b++)assert.equal(calculateAdvanced('mass-fraction',{a,b}).massPercent,100*a/(a+b));
 for(let start=1;start<=3;start++)for(let rounds=0;rounds<=3;rounds++)assert.equal(calculateAdvanced('cell-doubling',{start,rounds}).finalCells,start*2**rounds);
 assert.equal(calculateAdvanced('plant-process',{process:'photosynthesis'}).outputs,calculateAdvanced('plant-process',{process:'respiration'}).inputs);
});
test('M41 eight bounded original draft models, two languages, no approval',()=>{
 for(const id of ["arithmetic-sequence","square-slope","constant-acceleration","thin-lens","ion-charge","mass-fraction","cell-doubling","plant-process"]){const m=ADVANCED_MODELS[id];for(const lang of ['en','hi']){const r=evaluateAdvanced(id,m.target,lang);assert.equal(r.correct,true);assert.equal(r.publicReleaseApproved,false);assert.ok(advancedResultRows(r.metrics,lang).length>0);}assert.equal(evaluateAdvanced(id,m.initial).correct,false);assert.throws(()=>calculateAdvanced(id,{...m.initial,unknown:1}));}
});
