import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {makeReviewSnapshot,compareReviewSnapshots,validateReviewSnapshot,supplementalReviewWorklist} from '../tools/review-change-workbench.mjs';
const rows=buildReviewRows(),supplements=supplementalReviewWorklist(rows),snapshot=makeReviewSnapshot(rows,supplements);
test('M68 complete canonical review inventory plus thirty separate supplemental behavior indicators',()=>{
 assert.equal(rows.length,3340);assert.equal(snapshot.entries.length,3370);
 assert.equal(supplements.activityCount,30);assert.equal(supplements.bilingualCombinations,10108);
 for(const a of supplements.activities){
  assert.match(a.behaviorSha256,/^[a-f0-9]{64}$/);
  assert.equal(a.canonicalContentSha256,rows.find(r=>r.queue==='advanced'&&r.content_id===a.reviewId).content_sha256);
  assert.equal(a.reviewStatus,'PENDING_HUMAN_REVIEW');assert.equal(a.computedOutputsAreNotExpertApproved,true);
  assert.ok(a.examples.length>=2);assert.ok(a.examples.every(e=>e.english.length&&e.hindi.length));
 }
 assert.equal(supplements.humanApprovalGranted,false);
 assert.deepEqual(makeReviewSnapshot(rows,supplementalReviewWorklist(rows)),snapshot);
 assert.deepEqual(compareReviewSnapshots(snapshot,snapshot).counts,{added:0,removed:0,changed:0,unchanged:3370});
});
test('M68 deterministic change detection without inferring human approval',()=>{
 const before={schema:snapshot.schema,entries:[{queue:'advanced',id:'a',sha256:'a'.repeat(64)},{queue:'advanced',id:'b',sha256:'b'.repeat(64)},{queue:'advanced',id:'d',sha256:'d'.repeat(64)}]};
 const after={schema:snapshot.schema,entries:[{queue:'advanced',id:'c',sha256:'c'.repeat(64)},{queue:'advanced',id:'a',sha256:'e'.repeat(64)},{queue:'advanced',id:'d',sha256:'d'.repeat(64)}]};
 const report=compareReviewSnapshots(before,after);
 assert.deepEqual(report.counts,{added:1,removed:1,changed:1,unchanged:1});
 assert.equal(report.changed[0].id,'a');assert.equal(report.removed[0].id,'b');assert.equal(report.added[0].id,'c');
 assert.equal(report.humanApprovalGranted,false);assert.equal(report.publicReleaseApproved,false);
 const modified=structuredClone(supplements);modified.activities[0].behaviorSha256='0'.repeat(64);
 const diff=compareReviewSnapshots(snapshot,makeReviewSnapshot(rows,modified));
 assert.equal(diff.counts.changed,1);assert.equal(diff.changed[0].queue,'supplement-behavior');
});
test('M68 invalid snapshots rejected, including invented approval and duplicate keys',()=>{
 assert.throws(()=>validateReviewSnapshot({...snapshot,approved:true}));
 const row=snapshot.entries[0];
 assert.throws(()=>validateReviewSnapshot({schema:snapshot.schema,entries:[row,row]}));
 assert.throws(()=>validateReviewSnapshot({schema:snapshot.schema,entries:[{...row,sha256:'fake'}]}));
 assert.throws(()=>validateReviewSnapshot({schema:snapshot.schema,entries:[{...row,student:'x'}]}));
});
