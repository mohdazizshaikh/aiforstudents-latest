import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBoardReviewWorksheet,validateBoardReviewWorksheet} from '../tools/multiboard-mapping-review.mjs';
import {buildReviewRows} from '../tools/build-review-packet.mjs';
import {readMaharashtraCandidates} from '../tools/maharashtra-candidates.mjs';
const rows=buildReviewRows(),base=makeBoardReviewWorksheet(rows),check=x=>validateBoardReviewWorksheet(x,rows);
test('M62 32 board-specific candidates and 180 pending checks',()=>{
 const r=check(base);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.mappings,32);assert.equal(r.checks,180);assert.equal(r.pending,180);
 assert.equal(r.byBoard.CBSE.mappings,22);assert.equal(r.byBoard.CBSE.checks,110);assert.equal(r.byBoard.Maharashtra.mappings,10);assert.equal(r.byBoard.Maharashtra.checks,70);
 assert.equal(r.verifiedChapters,0);assert.equal(r.publicReleaseApproved,false);
});
test('M62 Maharashtra current-session applicability and medium checks cannot be skipped',()=>{
 const x=structuredClone(base),s=x.records.find(r=>r.mapping.board==='Maharashtra');
 for(const v of s.checks.filter(v=>v.id!=='current-session-applicability'))Object.assign(v,{decision:'pass',reviewerRef:'synthetic-reviewer',evidenceRef:'synthetic-evidence',note:'Synthetic contract fixture only.'});
 assert.equal(check(x).byBoard.Maharashtra.readyForIndependentAudit,0);
 Object.assign(s.checks.find(v=>v.id==='current-session-applicability'),{decision:'pass',reviewerRef:'synthetic-reviewer',evidenceRef:'synthetic-evidence',note:'Synthetic contract fixture only.'});
 const r=check(x);assert.equal(r.byBoard.Maharashtra.readyForIndependentAudit,1);assert.equal(r.verifiedChapters,0);assert.equal(r.humanApprovalAuthenticated,false);
 s.checks.find(v=>v.id==='medium-language-fit').decision='revise';
 assert.equal(check(x).byBoard.Maharashtra.needsRevision,1);
});
test('M62 rejects stale source/content fingerprints, missing checks, duplicates and fabricated approvals',()=>{
 for(const mutate of [x=>x.records.pop(),x=>x.records.push(x.records[0]),x=>x.publicReleaseApproved=true,x=>x.records[0].mapping.board='Other',x=>x.records[0].mappingSha256='0'.repeat(64),x=>x.records.find(r=>r.mapping.board==='Maharashtra').checks.pop(),x=>x.records[0].checks[0].decision='approved']){
  const x=structuredClone(base);mutate(x);assert.equal(check(x).valid,false)
 }
 const id=base.records[0].mapping.modelId;
 assert.equal(validateBoardReviewWorksheet(base,rows.map(r=>r.content_id===id?{...r,content_sha256:'a'.repeat(64)}:r)).valid,false);
 const source=readMaharashtraCandidates();source.sources.maths.reprint=2026;
 assert.equal(validateBoardReviewWorksheet(base,rows,source).valid,false);
});
