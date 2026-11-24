import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SCIENCE_IDS,scienceModel,scienceExplain} from '../assets/science-engine.js';
import {SCIENCE_SNAPSHOT_LIMIT,captureScienceSnapshot,restoreScienceSnapshot,scienceSnapshotRows} from '../assets/science-snapshots.js';
test('M83 seven science models in two languages preserve source explanations and independent copies',()=>{
 for(const id of SCIENCE_IDS){
  const m=scienceModel(id),a=Object.freeze({...m.initial}),f=m.fields[0],b={...a,[f.id]:f.options?f.options.find(o=>o.value!==a[f.id]).value:a[f.id]===f.min?f.min+f.step:f.min};
  const states=captureScienceSnapshot(id,captureScienceSnapshot(id,[],a),b);
  assert.equal(states.length,2);assert.deepEqual(restoreScienceSnapshot(id,states,0),a);
  for(const lang of ['en','hi'])for(const [i,r] of scienceSnapshotRows(id,states,lang).entries()){
   assert.equal(r.explanation,scienceExplain(id,states[i],lang));assert.equal(r.controls.length,m.fields.length);
   assert.equal(r.persists,false);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);
  }
  restoreScienceSnapshot(id,states,0)[f.id]=b[f.id];assert.deepEqual(states[0],a);
  assert.equal(captureScienceSnapshot(id,states,a).length,2);
 }
});
test('M83 invalid, duplicate and excessive snapshot collections fail closed',()=>{
 const id='motion',a={...scienceModel(id).initial},f=scienceModel(id).fields[0],b={...a,[f.id]:f.min},c={...a,[f.id]:f.max},d={...a,[f.id]:f.min+f.step};
 const distinct=[a,b,c,d].filter((x,i,arr)=>arr.findIndex(y=>y[f.id]===x[f.id])===i);
 assert.equal(SCIENCE_SNAPSHOT_LIMIT,3);
 const states=distinct.slice(0,3);assert.equal(states.length,3);assert.equal(captureScienceSnapshot(id,states,d).length,3);
 assert.throws(()=>scienceSnapshotRows(id,[a,a]));assert.throws(()=>captureScienceSnapshot(id,[],{...a,name:'synthetic'}));
 assert.throws(()=>restoreScienceSnapshot(id,states,-1));assert.throws(()=>scienceSnapshotRows(id,states,'xx'));
 assert.throws(()=>captureScienceSnapshot('unknown',[],{}));
});
test('M83 shared-device studio reset clears both controls and hidden feedback',()=>{
 const app=readFileSync(new URL('../assets/studio-app.js',import.meta.url),'utf8');
 assert.match(app,/aifs-history-cleared',\(\)=>\{state\.journey='fractions';state\.count=0;state\.closed=false;state\.feedback=null;state\.stage='learn';\$\('studio-controls'\)\.replaceChildren\(\);\$\('studio-feedback'\)\.textContent='';render\(\)/);
});
