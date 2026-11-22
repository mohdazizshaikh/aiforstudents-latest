import test from 'node:test';
import assert from 'node:assert/strict';
import {auditContent} from '../tools/content-quality.mjs';
import {getGameBank,AGE_BANDS} from '../assets/catalog.js';
test('M11: 3200 items pass independent structural and representative mathematical circuit reference checks',()=>{
  const {counts,errors}=auditContent();
  assert.deepEqual(errors,[],errors.slice(0,8).join('\n'));
  assert.equal(counts.items,3200);
  assert.equal(counts.independentCircuitsChecked,80);
  assert.equal(counts.independentArithmeticChecked,400);
});
test('M11: age-band identity is honestly flagged rather than misrepresented as calibrated',()=>{
  const audit=auditContent();
  assert.equal(audit.counts.ageIdenticalGames,0);
  assert.equal(audit.counts.missingHumanReview,3200);
});
test('M11: Hindi word-builder translation uses pot for गमला rather than top for ऊपर',()=>{
  const b=getGameBank('word-builder','6-10');assert.ok(b.some(x=>(x.questionHi+x.explanationHi).includes('गमला')&&x.answer==='P|O|T'));
});
test('M11: circuit choices are credible educational misconceptions rather than impossible distractors',()=>{
  for(const age of AGE_BANDS)for(const p of getGameBank('circuit-logic',age.id)){
    assert.equal(p.choices.length,4);
    assert.ok(p.choices.every(x=>!x.includes('melt')&&!x.includes('disappears')));
  }
});