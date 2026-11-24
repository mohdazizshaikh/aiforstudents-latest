import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,modelAdvanced,advancedExtensionIds,advancedExtension,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
import {SCIENCE_IDS,scienceModel} from '../assets/science-engine.js';
import {snapshotState,removeSnapshot,restoreSnapshot} from '../assets/advanced-snapshots.js';
import {captureScienceSnapshot,removeScienceSnapshot,restoreScienceSnapshot} from '../assets/science-snapshots.js';
import {MINI_SNAPSHOT_IDS,captureMiniSnapshot,removeMiniSnapshot,restoreMiniSnapshot} from '../assets/mini-snapshots.js';
import {captureExtensionSnapshot,removeExtensionSnapshot,restoreExtensionSnapshot,extensionSnapshotRows} from '../assets/extension-snapshots.js';
const checkRemoval=(id,initial,capture,remove,restore)=>{
 const list=capture(id,[],initial);
 assert.deepEqual(remove(id,list,0),[]);
 assert.deepEqual(restore(id,list,0),initial);
 assert.equal(list.length,1);assert.throws(()=>remove(id,list,-1));assert.throws(()=>remove(id,list,1));assert.throws(()=>remove(id,list,'0'));
};
for(const id of ADVANCED_IDS)test('M91 main selective deletion '+id,()=>checkRemoval(id,modelAdvanced(id).initial,snapshotState,removeSnapshot,restoreSnapshot));
for(const id of SCIENCE_IDS)test('M91 science selective deletion '+id,()=>checkRemoval(id,scienceModel(id).initial,captureScienceSnapshot,removeScienceSnapshot,restoreScienceSnapshot));
const mini={'maths/number-line':{position:0},'maths/rectangle':{width:2,height:2},'maths/data-table':{a:1,b:1},'studio/fractions':{count:0},'studio/circuit-path':{closed:false}};
for(const id of MINI_SNAPSHOT_IDS)test('M91 mini selective deletion '+id,()=>checkRemoval(id,mini[id],captureMiniSnapshot,removeMiniSnapshot,restoreMiniSnapshot));
const keys=ADVANCED_IDS.flatMap(id=>advancedExtensionIds(id).map(mode=>id+':'+mode));
for(const key of keys){
 test('M91 supplemental snapshots '+key,()=>{
  const [id,mode]=key.split(':'),m=advancedExtension(id,mode),initial=m.initial;
  const candidates=[initial,...m.fields.flatMap(f=>[f.min,f.max].map(v=>({...initial,[f.id]:v})))];
  let states=[];for(const s of candidates)states=captureExtensionSnapshot(key,states,s);
  assert.ok(states.length>=2&&states.length<=3);
  assert.deepEqual(captureExtensionSnapshot(key,states,initial),states);
  for(const lang of ['en','hi'])for(const r of extensionSnapshotRows(key,states,lang)){
   assert.deepEqual(r.results,evaluateAdvancedExtension(id,mode,states[r.index],lang).rows);
   assert.equal(r.persists,false);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);
  }
  const copy=restoreExtensionSnapshot(key,states,0);copy[m.fields[0].id]=999;assert.deepEqual(states[0],initial);
  assert.throws(()=>captureExtensionSnapshot(key,[],{...initial,studentId:'mock'}));
  assert.throws(()=>captureExtensionSnapshot(key,[],{...initial,[m.fields[0].id]:m.fields[0].max+1}));
 });
 test('M91 supplemental selective deletion '+key,()=>{
  const [id,mode]=key.split(':'),m=advancedExtension(id,mode);
  checkRemoval(key,m.initial,captureExtensionSnapshot,removeExtensionSnapshot,restoreExtensionSnapshot);
  const f=m.fields.find(f=>f.min!==m.initial[f.id]||f.max!==m.initial[f.id]);
  const next={...m.initial,[f.id]:f.min===m.initial[f.id]?f.max:f.min};
  const list=captureExtensionSnapshot(key,captureExtensionSnapshot(key,[],m.initial),next);
  assert.deepEqual(removeExtensionSnapshot(key,list,0),[next]);assert.deepEqual(removeExtensionSnapshot(key,list,1),[m.initial]);assert.equal(list.length,2);
 });
}
test('M91 exact inventory and invalid supplemental route',()=>{
 assert.equal(ADVANCED_IDS.length+SCIENCE_IDS.length+MINI_SNAPSHOT_IDS.length,60);assert.equal(keys.length,49);
 assert.throws(()=>extensionSnapshotRows('unknown:unknown',[]));assert.throws(()=>extensionSnapshotRows(keys[0],[],'xx'));
});
