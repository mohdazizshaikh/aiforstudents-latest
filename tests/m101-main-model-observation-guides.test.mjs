import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_IDS,ADVANCED_MODELS,calculateAdvanced,advancedResultRows} from '../assets/advanced-lab-engine.js';
import {BASIC_PRINT_IDS,teacherMainObservationGuide,printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
const basic={"science/motion":[["Ideal constant speed (m/s)","आदर्श समान चाल (m/s)"]],"science/reflection":[["Incident angle from normal","अभिलंब से आपतन कोण"],["Selected reflected angle from normal","अभिलंब से चुना परावर्तन कोण"],["Angle equality","कोणों की समानता"]],"science/energy":[["Input energy (J)","आगत ऊर्जा (J)"],["Useful energy (J)","उपयोगी ऊर्जा (J)"],["Thermal energy (J)","ऊष्मीय ऊर्जा (J)"]],"science/matter":[["Particle arrangement","कणों की व्यवस्था"],["Particle motion","कणों की गति"]],"science/changes":[["Example classification","उदाहरण का वर्गीकरण"],["Selected classification","चुना वर्गीकरण"]],"science/cells":[["Cell structures","कोशिका की संरचनाएँ"]],"science/food-chain":[["Selected food chain order","चुनी खाद्य शृंखला का क्रम"]],"maths/number-line":[["Position on number line","संख्या रेखा पर स्थिति"]],"maths/rectangle":[["Area (square units)","क्षेत्रफल (वर्ग इकाई)"],["Perimeter (units)","परिमाप (इकाई)"]],"maths/data-table":[["Group A count","समूह A की संख्या"],["Group B count","समूह B की संख्या"],["Difference A − B","अंतर A − B"]],"studio/fractions":[["Shaded equal parts","रंगे बराबर हिस्से"],["Total equal parts","कुल बराबर हिस्से"]],"studio/circuit-path":[["Model bulb state","मॉडल बल्ब की स्थिति"],["Path continuity","परिपथ पथ की निरंतरता"]]};
const ids=[...ADVANCED_IDS,...BASIC_PRINT_IDS];
for(const id of ids)test('M101 main observation labels '+id,()=>{
 for(const lang of ['en','hi']){
  const a=printableAnyLabActivity(id,'main',lang),g=teacherMainObservationGuide(id,lang),i=lang==='hi'?1:0;
  const expected=ADVANCED_IDS.includes(id)?advancedResultRows(calculateAdvanced(id,ADVANCED_MODELS[id].initial),lang).map(r=>r.label):basic[id].map(pair=>pair[i]);
  assert.deepEqual(g.labels,expected);assert.equal(g.id,id);
  assert.equal(g.source,ADVANCED_IDS.includes(id)?'CANONICAL_CALCULATION_LABELS':'DRAFT_DISPLAY_DESCRIPTIONS');
  assert.equal(g.teacherOnly,true);assert.equal(g.humanReviewed,false);assert.equal(g.publicReleaseApproved,false);assert.equal(g.storesStudentData,false);
  assert.deepEqual(Object.keys(g).sort(),['id','labels','source','teacherOnly','humanReviewed','publicReleaseApproved','storesStudentData'].sort());
  assert.equal(Object.hasOwn(a,'labels'),false);assert.ok(g.labels.length>0);
  g.labels[0]='mutated';assert.deepEqual(teacherMainObservationGuide(id,lang).labels,expected);
  assert.deepEqual(printableAnyLabActivity(id,'main',lang),a);
 }
});
test('M101 exact main inventory and invalid selectors',()=>{
 assert.equal(ids.length,60);assert.equal(new Set(ids).size,60);assert.deepEqual(Object.keys(basic).sort(),[...BASIC_PRINT_IDS].sort());
 for(const id of [null,'unknown','ratio-algebra:equation'])assert.throws(()=>teacherMainObservationGuide(id));assert.throws(()=>teacherMainObservationGuide(ids[0],'xx'));
});
