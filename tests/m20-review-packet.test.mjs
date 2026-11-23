import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,existsSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {buildReviewRows,buildSummary,csvCell,packetCsv,exportPacket} from '../tools/build-review-packet.mjs';

test('M20 exports the current six source review inventories, not fabricated approvals',()=>{
 const rows=buildReviewRows(),summary=buildSummary(undefined,rows);
 assert.equal(rows.length,3292);
 assert.equal(summary.totalRows,3292);
 assert.equal(summary.pendingHumanReviewRecords,3292);
 assert.deepEqual(Object.fromEntries(Object.entries(summary.byQueue).map(([kind,count])=>[kind,count.total])),{
  game:3200,study:32,studio:4,experiment:4,classroom:10,digital:32,maths:3,science:7
 });
 assert.equal(summary.publicReleaseApproved,false);
 assert.equal(summary.humanApprovalGrantedByTool,false);
 assert.equal(new Set(rows.map(x=>x.queue+':'+x.content_id)).size,3292);
 for(const row of rows){
  assert.ok(row.source_file);
  assert.ok(row.line>0);
  assert.ok(row.content_id);
  assert.equal(row.human_decision,'NO DECISION RECORDED BY THIS EXPORT');
 }
});
test('M20 exported CSV escapes spreadsheet formulas and keeps Hindi text and embedded quotes',()=>{
 assert.equal(csvCell('=HYPERLINK("https://x")'),'"\'=HYPERLINK(""https://x"")"');
 assert.equal(csvCell('  +SUM(1,2)'),'"\'  +SUM(1,2)"');
 assert.equal(csvCell('सवाल "उत्तर"'),'"सवाल ""उत्तर"""');
 const csv=packetCsv([{queue:'test',content_id:'x',english_draft:'@danger',hindi_draft:'हिन्दी'}]);
 assert.match(csv,/'@danger/);
 assert.match(csv,/हिन्दी/);
});
test('M20 can materialize reviewer packet without writing source approvals',()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'aifs-m20-'));
 try{
  const sources={
   'CONTENT_REVIEW_QUEUE.jsonl':[{id:'game1',question_en:'What?',question_hi:'क्या?',review_status:'UNREVIEWED',approved_for_child_launch:false}],
   'LAB_CONTENT_REVIEW_QUEUE.jsonl':[{id:'study1',questionEn:'2+2',questionHi:'२+२',subjectExpertReview:'pending'}],
   'STUDIO_CONTENT_REVIEW_QUEUE.jsonl':[{journeyId:'fractions',stageId:'try',contentVersion:1,englishHumanReview:'pending'}],
   'EXPERIMENT_CONTENT_REVIEW_QUEUE.jsonl':[{experimentId:'fractions-lab',taskId:'compare',contentVersion:1,educationalReview:'pending'}],
   'CLASSROOM_CONTENT_REVIEW_QUEUE.jsonl':[{id:'class1',question:{en:'Show one fourth',hi:'चौथाई दिखाएँ'},educationalReview:'PENDING',publicReleaseApproved:false}],
   'DIGITAL_CONTENT_REVIEW_QUEUE.jsonl':[{id:'digital1',question:{en:'Safe?',hi:'सुरक्षित?'},educationReview:'pending'}],
   'MATHS_CONTENT_REVIEW_QUEUE.jsonl':[{id:'workshop:number-line',contentVersion:1,englishHumanReview:'pending',hindiHumanReview:'pending'}],
   'SCIENCE_CONTENT_REVIEW_QUEUE.jsonl':[{id:'science:motion',contentVersion:1,englishHumanReview:'pending',hindiHumanReview:'pending'}]
  };
  for(const [name,records] of Object.entries(sources))writeFileSync(path.join(root,name),records.map(JSON.stringify).join('\n')+'\n');
  const destination=path.join(root,'generated');
  const summary=exportPacket(destination,root);
  assert.equal(summary.totalRows,8);
  assert.equal(summary.pendingHumanReviewRecords,8);
  const csv=readFileSync(path.join(destination,'review-packet.csv'),'utf8');
  assert.equal(csv.trim().split('\n').length,9);
  assert.match(csv,/चौथाई दिखाएँ/);
  assert.match(readFileSync(path.join(destination,'README.txt'),'utf8'),/NOT HUMAN APPROVAL/);
  assert.ok(existsSync(path.join(destination,'summary.json')));
  assert.match(readFileSync(path.join(root,'CONTENT_REVIEW_QUEUE.jsonl'),'utf8'),/UNREVIEWED/);
 }finally{rmSync(root,{recursive:true,force:true})}
});
test('M20 refuses duplicate content IDs instead of silently losing a row',()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'aifs-m20-bad-'));
 try{
  writeFileSync(path.join(root,'CONTENT_REVIEW_QUEUE.jsonl'),[
   JSON.stringify({id:'repeat'}),JSON.stringify({id:'repeat'})
  ].join('\n')+'\n');
  assert.throws(()=>buildReviewRows(root),/duplicate ID repeat/);
 }finally{rmSync(root,{recursive:true,force:true})}
});
