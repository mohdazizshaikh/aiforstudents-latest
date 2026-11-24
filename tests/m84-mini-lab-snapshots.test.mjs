import test from 'node:test';
import assert from 'node:assert/strict';
import {MINI_SNAPSHOT_IDS,captureMiniSnapshot,restoreMiniSnapshot,miniSnapshotRows} from '../assets/mini-snapshots.js';
const fixtures={
 'maths/number-line':[{position:0},{position:-3},{position:10},{position:-10}],
 'maths/rectangle':[{width:2,height:2},{width:4,height:3},{width:12,height:12},{width:1,height:1}],
 'maths/data-table':[{a:1,b:1},{a:4,b:2},{a:0,b:10},{a:10,b:0}],
 'studio/fractions':[{count:0},{count:2},{count:4},{count:1}],
 'studio/circuit-path':[{closed:false},{closed:true}]
};
test('M84 five foundational models have bounded localized source-derived snapshots',()=>{
 assert.deepEqual(MINI_SNAPSHOT_IDS,Object.keys(fixtures));
 for(const [id,values] of Object.entries(fixtures)){
  let states=[];for(const s of values)states=captureMiniSnapshot(id,states,Object.freeze(s));
  assert.equal(states.length,Math.min(3,values.length));
  assert.deepEqual(restoreMiniSnapshot(id,states,0),values[0]);
  assert.deepEqual(captureMiniSnapshot(id,states,values[0]),states);
  for(const lang of ['en','hi'])for(const r of miniSnapshotRows(id,states,lang)){
   assert.ok(r.controls.length&&r.explanation);assert.equal(r.persists,false);assert.equal(r.recordsAttempt,false);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);
  }
  const copy=restoreMiniSnapshot(id,states,0);const key=Object.keys(copy)[0];copy[key]=999;assert.deepEqual(states[0],values[0]);
  assert.throws(()=>miniSnapshotRows(id,[values[0],values[0]]));assert.throws(()=>captureMiniSnapshot(id,[],{...values[0],student:'synthetic'}));
 }
 assert.match(miniSnapshotRows('maths/rectangle',[{width:4,height:3}])[0].explanation,/12 square units; perimeter: 14/);
 assert.match(miniSnapshotRows('maths/data-table',[{a:0,b:10}])[0].explanation,/-10/);
 assert.throws(()=>captureMiniSnapshot('studio/fractions',[],{count:5}));assert.throws(()=>captureMiniSnapshot('studio/circuit-path',[],{closed:'true'}));
 assert.throws(()=>miniSnapshotRows('maths/number-line',[{position:11}]));assert.throws(()=>miniSnapshotRows('unknown',[]));assert.throws(()=>miniSnapshotRows('studio/fractions',[],'xx'));
});
