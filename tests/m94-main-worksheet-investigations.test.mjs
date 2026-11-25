import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,ADVANCED_MODELS,advancedExtensionIds} from '../assets/advanced-lab-engine.js';
import {SCIENCE_MODELS} from '../assets/science-engine.js';
import {miniControlLabels} from '../assets/mini-snapshots.js';
import {BASIC_PRINT_IDS,mainWorksheetControls,mainWorksheetInvestigation,printableAnyLabActivity,printableLabPack} from '../assets/teacher-cards-engine.js';
const ids=[...ADVANCED_IDS,...BASIC_PRINT_IDS];
for(const id of ids)test('M94 source-bound paper investigation '+id,()=>{
 for(const lang of ['en','hi']){
  const i=lang==='hi'?1:0,expected=ADVANCED_IDS.includes(id)?ADVANCED_MODELS[id].fields.map(f=>f.label[i]):id.startsWith('science/')?SCIENCE_MODELS[id.slice(8)].fields.map(f=>f.label[i]):miniControlLabels(id,lang);
  const labels=mainWorksheetControls(id,lang),a=printableAnyLabActivity(id,'main',lang);
  assert.deepEqual(labels,expected);assert.ok(labels.length>0);
  assert.equal(a.steps.length,3);assert.equal(a.steps[1],mainWorksheetInvestigation(id,lang));
  assert.ok(a.steps[1].includes(labels.join('; ')));assert.ok(a.steps[1].includes(lang==='hi'?'केवल कंप्यूटर मॉडल':'computer model'));
  assert.ok(a.steps[1].includes(lang==='hi'?'कागज़':'On paper'));
  assert.equal(a.humanReviewed,false);assert.equal(a.publicReleaseApproved,false);assert.equal(a.hasStudentNames,false);
  assert.deepEqual(printableLabPack([id+':main'],lang).items[0].steps,a.steps);
  for(const forbidden of ['initial','target','answer','teacherGuidance','score'])assert.ok(!Object.hasOwn(a,forbidden));
 }
});
test('M94 all 60 main models covered; 49 supplemental worksheets keep prior observation wording',()=>{
 assert.equal(ids.length,60);let count=0;
 for(const id of ADVANCED_IDS)for(const mode of advancedExtensionIds(id)){
  count++;
  assert.equal(printableAnyLabActivity(id,mode,'en').steps[1],'With a teacher, inspect the computer-only model and compare the displayed values with your prediction.');
  assert.equal(printableAnyLabActivity(id,mode,'hi').steps[1],'शिक्षक के साथ केवल कंप्यूटर मॉडल देखें और दिखाए गए मान अपने अनुमान से मिलाएँ।');
 }
 assert.equal(count,49);for(const id of [null,'unknown','ratio-algebra:equation'])assert.throws(()=>mainWorksheetControls(id));assert.throws(()=>mainWorksheetInvestigation(ids[0],'xx'));
});
