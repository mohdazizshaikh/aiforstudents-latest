import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {SCIENCE_MODELS} from '../assets/science-engine.js';
import {BASIC_PRINT_IDS,teacherMainControlGuide,mainWorksheetControls,printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
const ids=[...ADVANCED_IDS,...BASIC_PRINT_IDS];
const miniExpected={
 'maths/number-line':['-10 to 10; step 1'],
 'maths/rectangle':['1 to 12; step 1','1 to 12; step 1'],
 'maths/data-table':['0 to 10; step 1','0 to 10; step 1'],
 'studio/fractions':['0 to 4; step 1'],
 'studio/circuit-path':['Open; Closed']
};
for(const id of ids)test('M99 teacher preparation controls '+id,()=>{
 for(const lang of ['en','hi']){
  const i=lang==='hi'?1:0,g=teacherMainControlGuide(id,lang),a=printableAnyLabActivity(id,'main',lang);
  assert.equal(g.title,a.title);assert.equal(g.caveat,a.caveat);assert.deepEqual(g.controls.map(c=>c.label),mainWorksheetControls(id,lang));
  assert.equal(g.teacherOnly,true);assert.equal(g.humanReviewed,false);assert.equal(g.publicReleaseApproved,false);assert.equal(g.storesStudentData,false);
  const f=ADVANCED_IDS.includes(id)?ADVANCED_MODELS[id].fields:id.startsWith('science/')?SCIENCE_MODELS[id.slice(8)].fields:null;
  if(f)for(const [j,x] of f.entries()){
   assert.equal(g.controls[j].kind,x.options?'choice':'range');
   assert.equal(g.controls[j].settings,x.options?x.options.map(o=>o.label[i]).join('; '):(lang==='en'?x.min+' to '+x.max+'; step '+x.step:x.min+' से '+x.max+'; कदम '+x.step)+(x.unit?' ('+x.unit+')':''));
  }
  else if(lang==='en')assert.deepEqual(g.controls.map(c=>c.settings),miniExpected[id]);
  for(const c of g.controls)assert.deepEqual(Object.keys(c).sort(),['kind','label','settings']);
  assert.ok(!Object.hasOwn(a,'teacherOnly')&&!Object.hasOwn(a,'controls'));assert.equal(a.steps.length,3);
 }
});
test('M99 exact inventory, guide does not mutate worksheet or accept unknown models',()=>{
 assert.equal(ids.length,60);assert.equal(new Set(ids).size,60);
 const before=printableAnyLabActivity(ids[0],'main');const guide=teacherMainControlGuide(ids[0]);guide.controls[0].settings='mock';
 assert.deepEqual(printableAnyLabActivity(ids[0],'main'),before);assert.notEqual(teacherMainControlGuide(ids[0]).controls[0].settings,'mock');
 for(const id of [null,'unknown','ratio-algebra:equation'])assert.throws(()=>teacherMainControlGuide(id));assert.throws(()=>teacherMainControlGuide(ids[0],'xx'));
});
