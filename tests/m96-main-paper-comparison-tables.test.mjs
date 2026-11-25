import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS} from '../assets/advanced-lab-engine.js';
import {BASIC_PRINT_IDS,mainWorksheetComparison,mainWorksheetInvestigation,printableAnyLabActivity,printableLabPack,labPackKeys} from '../assets/teacher-cards-engine.js';
const ids=[...ADVANCED_IDS,...BASIC_PRINT_IDS];
for(const id of ids)test('M96 main model paper comparison '+id,()=>{
 for(const lang of ['en','hi']){
  const a=printableAnyLabActivity(id,'main',lang),t=a.comparison;
  assert.deepEqual(t,mainWorksheetComparison(id,lang));
  assert.deepEqual(Object.keys(t).sort(),['caption','columns','rows']);
  assert.equal(t.columns.length,3);assert.deepEqual(t.rows,[{label:'A',cells:['','']},{label:'B',cells:['','']}]);
  assert.equal(a.steps.length,3);assert.equal(a.steps[1],mainWorksheetInvestigation(id,lang));
  assert.ok(a.steps[1].includes(lang==='hi'?'तालिका खाली रखें':'leave the table blank'));
  assert.equal(a.humanReviewed,false);assert.equal(a.publicReleaseApproved,false);assert.equal(a.hasStudentNames,false);
  assert.deepEqual(printableLabPack([id+':main'],lang).items[0].comparison,t);
  t.rows[0].cells[0]='mock';assert.equal(mainWorksheetComparison(id,lang).rows[0].cells[0],'');
 }
});
test('M96 exact 60 main and 49 supplemental activities share blank paper format',()=>{
 assert.equal(ids.length,60);assert.equal(labPackKeys().length,109);
 for(const key of labPackKeys())for(const lang of ['en','hi']){
  const [id,mode]=key.split(':');
  assert.deepEqual(printableAnyLabActivity(id,mode,lang).comparison,mainWorksheetComparison(ids[0],lang));
 }
 assert.throws(()=>mainWorksheetComparison('unknown'));assert.throws(()=>mainWorksheetComparison('ratio-algebra:equation'));assert.throws(()=>mainWorksheetComparison(ids[0],'xx'));
});
