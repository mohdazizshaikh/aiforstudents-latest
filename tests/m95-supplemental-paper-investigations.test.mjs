import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,advancedExtensionIds,advancedExtension} from '../assets/advanced-lab-engine.js';
import {supplementalWorksheetControls,supplementalWorksheetInvestigation,supplementalWorksheetComparison,printableAnyLabActivity,printableLabPack} from '../assets/teacher-cards-engine.js';
const keys=ADVANCED_IDS.flatMap(id=>advancedExtensionIds(id).map(mode=>[id,mode]));
for(const [id,mode] of keys){
 test('M95 exact supplemental investigation '+id+':'+mode,()=>{
  for(const lang of ['en','hi']){
   const i=lang==='hi'?1:0,m=advancedExtension(id,mode),labels=m.fields.map(f=>f.label[i]),a=printableAnyLabActivity(id,mode,lang);
   assert.deepEqual(supplementalWorksheetControls(id,mode,lang),labels);assert.equal(a.steps.length,3);
   assert.equal(a.steps[1],supplementalWorksheetInvestigation(id,mode,lang));assert.ok(a.steps[1].includes(labels.join('; ')));
   assert.equal(a.caveat,m.caveat[i]);assert.equal(a.humanReviewed,false);assert.equal(a.publicReleaseApproved,false);assert.equal(a.hasStudentNames,false);
   assert.deepEqual(printableLabPack([id+':'+mode],lang).items[0].steps,a.steps);
  }
 });
 test('M95 blank paper comparison '+id+':'+mode,()=>{
  for(const lang of ['en','hi']){
   const a=printableAnyLabActivity(id,mode,lang),table=a.comparison;
   assert.deepEqual(table,supplementalWorksheetComparison(id,mode,lang));
   assert.equal(table.columns.length,3);assert.equal(table.rows.length,2);assert.deepEqual(table.rows.map(r=>r.label),['A','B']);
   assert.ok(table.rows.every(r=>r.cells.length===2&&r.cells.every(x=>x==='')));
   assert.deepEqual(printableLabPack([id+':'+mode],lang).items[0].comparison,table);
   table.rows[0].cells[0]='mock';assert.equal(supplementalWorksheetComparison(id,mode,lang).rows[0].cells[0],'');
  }
 });
}
test('M95 exact supplemental inventory, M96 main tables, invalid supplemental selectors rejected',()=>{
 assert.equal(keys.length,49);
 for(const id of ADVANCED_IDS)assert.equal(Object.hasOwn(printableAnyLabActivity(id,'main'),'comparison'),true);
 for(const fn of [supplementalWorksheetControls,supplementalWorksheetInvestigation,supplementalWorksheetComparison]){
  assert.throws(()=>fn('unknown','ratio'));assert.throws(()=>fn('ratio-algebra','unknown'));assert.throws(()=>fn('ratio-algebra','ratio','xx'));
 }
});
