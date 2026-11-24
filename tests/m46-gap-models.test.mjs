import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateAdvanced,evaluateAdvanced,advancedExampleFeedback,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
test('M46 exhaustive bounded arithmetic, motion and dynamic rates',()=>{
 for(let base=1;base<=8;base++)for(let height=1;height<=6;height++)assert.equal(calculateAdvanced('triangle-area',{base,height}).areaUnits,base*height/2);
 for(let start=0;start<=8;start++)for(let end=0;end<=8;end++)assert.equal(calculateAdvanced('position-change',{start,end}).signedChange,end-start);
 for(let out=1;out<=6;out++)for(let back=0;back<=6;back++){const r=calculateAdvanced('path-distance',{out,back});assert.equal(r.pathLength,out+back);assert.equal(r.signedChange,out-back);}
 for(let forward=1;forward<=6;forward++)for(let reverse=1;reverse<=6;reverse++){const r=calculateAdvanced('dynamic-balance',{forward,reverse});assert.equal(r.netRate,forward-reverse);assert.equal(r.equalRates,forward===reverse);}
 for(const triangle of ['3-4-5','5-12-13']){const r=calculateAdvanced('right-triangle-ratio',{triangle});assert.ok(Math.abs(r.sine**2+r.cosine**2-1)<1e-12);assert.equal(r.opposite**2+r.adjacent**2,r.hypotenuse**2);}
});
test('M46 fixed labelled material, habitat and feeding examples',()=>{
 assert.equal(calculateAdvanced('material-property',{example:'glass'}).transparent,true);assert.equal(calculateAdvanced('material-property',{example:'wood'}).transparent,false);
 assert.equal(calculateAdvanced('habitat-match',{animal:'fish'}).habitat,'freshwater pond example');assert.equal(calculateAdvanced('habitat-match',{animal:'camel'}).habitat,'arid habitat example');
 for(const link of ['grass-rabbit','grass-insect','insect-frog'])assert.equal(calculateAdvanced('food-web-links',{link}).foodLink,link);
});
test('M46 new models reuse bilingual example feedback without approval or learner tracking',()=>{
 for(const id of ["triangle-area","right-triangle-ratio","position-change","path-distance","material-property","dynamic-balance","habitat-match","food-web-links"]){const m=ADVANCED_MODELS[id];for(const lang of ['en','hi']){assert.equal(evaluateAdvanced(id,m.target,lang).correct,true);assert.equal(evaluateAdvanced(id,m.initial,lang).correct,false);const r=advancedExampleFeedback(id,m.target,lang);assert.equal(r.exampleMatches,true);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);}assert.throws(()=>calculateAdvanced(id,{...m.initial,extra:1}));}
});
