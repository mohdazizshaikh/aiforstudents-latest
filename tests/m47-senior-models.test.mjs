import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateAdvanced,evaluateAdvanced,advancedExampleFeedback,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
test('M47 bounded senior-secondary maths and physics relationships',()=>{
 for(let slope=1;slope<=4;slope++)for(let bound=1;bound<=5;bound++)assert.equal(calculateAdvanced('integral-area',{slope,bound}).integralArea,slope*bound**2/2);
 for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)assert.ok(Math.abs(calculateAdvanced('vector-components',{x,y}).vectorMagnitude**2-x*x-y*y)<1e-10);
 for(let field=1;field<=5;field++)for(let area=1;area<=5;area++)for(const orientation of ['parallel','perpendicular'])assert.equal(calculateAdvanced('magnetic-flux',{field,area,orientation}).fluxUnits,orientation==='parallel'?field*area:0);
 for(let cap=1;cap<=5;cap++)for(let volt=0;volt<=5;volt++)assert.equal(calculateAdvanced('capacitor-charge',{cap,volt}).chargeUnits,cap*volt);
});
test('M47 chemistry and biology symbolic relationships',()=>{
 for(let carbon=1;carbon<=6;carbon++){const r=calculateAdvanced('alkane-count',{carbon});assert.equal(r.hydrogenCount,2*carbon+2);assert.equal(r.alkaneFormula,'C'+carbon+'H'+(2*carbon+2));}
 for(let pairs=1;pairs<=3;pairs++)assert.equal(calculateAdvanced('bond-pair-count',{pairs}).sharedElectrons,2*pairs);
 for(const [base,complement] of Object.entries({A:'T',T:'A',C:'G',G:'C'}))assert.equal(calculateAdvanced('dna-complement',{base}).complementBase,complement);
 assert.equal(calculateAdvanced('gas-exchange',{gas:'o2'}).transferDirection,'alveolar air to blood');assert.equal(calculateAdvanced('gas-exchange',{gas:'co2'}).transferDirection,'blood to alveolar air');
});
test('M47 all eight source examples retain bounded bilingual feedback without mastery or launch claims',()=>{
 for(const id of ["integral-area","vector-components","magnetic-flux","capacitor-charge","alkane-count","bond-pair-count","dna-complement","gas-exchange"]){const m=ADVANCED_MODELS[id];for(const lang of ['en','hi']){assert.equal(evaluateAdvanced(id,m.target,lang).correct,true);assert.equal(evaluateAdvanced(id,m.initial,lang).correct,false);const r=advancedExampleFeedback(id,m.target,lang);assert.equal(r.exampleMatches,true);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);}assert.throws(()=>calculateAdvanced(id,{...m.initial,extra:1}));}
});
