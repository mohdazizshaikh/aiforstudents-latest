import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,modelAdvanced,calculateAdvanced,advancedResultRows} from '../assets/advanced-lab-engine.js';
import {SNAPSHOT_LIMIT,snapshotState,restoreSnapshot,snapshotRows} from '../assets/advanced-snapshots.js';
const alt=(f,v)=>f.options?f.options.find(o=>o.value!==v).value:v===f.min?f.min+f.step:f.min;
test('M82 all 48 models in both languages use source calculations and fixed control labels',()=>{
 for(const id of ADVANCED_IDS){
  const m=modelAdvanced(id),a=Object.freeze({...m.initial}),f=m.fields[0],b={...a,[f.id]:alt(f,a[f.id])};
  const states=snapshotState(id,snapshotState(id,[],a),b);
  assert.equal(states.length,2);assert.deepEqual(restoreSnapshot(id,states,0),a);
  for(const lang of ['en','hi']){
   const rows=snapshotRows(id,states,lang);assert.equal(rows.length,2);
   for(const [i,r] of rows.entries()){
    assert.deepEqual(r.results,advancedResultRows(calculateAdvanced(id,states[i]),lang));
    assert.equal(r.controls.length,m.fields.length);assert.equal(r.persists,false);assert.equal(r.masteryPrediction,false);assert.equal(r.publicReleaseApproved,false);
   }
  }
  const restored=restoreSnapshot(id,states,0);restored[f.id]=b[f.id];assert.deepEqual(states[0],a);
  assert.equal(snapshotState(id,states,a).length,2);
 }
});
test('M82 bounded state collection rejects invalid data without altering caller state',()=>{
 const id='counting',m=modelAdvanced(id),a={...m.initial},b={...a,a:alt(m.fields[0],a.a)},c={...a,b:alt(m.fields[1],a.b)},d={...b,b:c.b};
 let states=[];for(const s of [a,b,c])states=snapshotState(id,states,s);
 assert.equal(states.length,SNAPSHOT_LIMIT);assert.deepEqual(snapshotState(id,states,d),states);
 assert.throws(()=>snapshotRows(id,[a,a]));assert.throws(()=>snapshotRows(id,[a,b,c,d]));
 assert.throws(()=>snapshotState(id,[],{...a,student:'synthetic'}));assert.throws(()=>restoreSnapshot(id,states,3));
 assert.throws(()=>snapshotRows(id,states,'xx'));assert.throws(()=>snapshotState('unknown',[],{}));
});
