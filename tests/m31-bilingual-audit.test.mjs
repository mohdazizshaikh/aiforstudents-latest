import test from 'node:test';
import assert from 'node:assert/strict';
import {auditBilingualLearning} from '../tools/audit-bilingual-learning.mjs';
import {STUDIO_LESSONS} from '../assets/studio-engine.js';
import {DIGITAL_TOPICS} from '../assets/digital-engine.js';
import {SCIENCE_MODELS} from '../assets/science-engine.js';
test('M31 structural bilingual audit covers 3,200 game drafts and all later learner teaching tracks',()=>{
 const r=auditBilingualLearning();
 assert.equal(r.valid,true,r.errors.join('; '));
 assert.deepEqual(r.counts,{gameTasks:3200,study:32,studio:2,experiments:2,maths:3,science:7,advanced:24,classroomSteps:10,digital:32});
 assert.equal(r.educationalReviewPassed,false);
 assert.equal(r.translationQualityVerified,false);
 assert.equal(r.publicReleaseApproved,false);
});
test('M31 bilingual audit fails closed when Hindi disappears from older Studio and Digital content',()=>{
 const studio=structuredClone(STUDIO_LESSONS);studio.fractions.concept[1]='';
 const r=auditBilingualLearning({studioLessons:studio});
 assert.equal(r.valid,false);assert.match(r.errors.join('; '),/fractions.concept.hi/);
 const digital=structuredClone(DIGITAL_TOPICS);digital[0].intro.hi='';
 const e=auditBilingualLearning({digitalTopics:digital});
 assert.equal(e.valid,false);assert.match(e.errors.join('; '),/ai.intro.hi/);
});
test('M31 bilingual audit fails closed on missing Science content or smaller original game source',()=>{
 const science=structuredClone(SCIENCE_MODELS);science.cells.title[1]='';
 assert.match(auditBilingualLearning({science}).errors.join('; '),/Science cells:title/);
 const g=auditBilingualLearning({gameAudit:{counts:{items:0},errors:[]}});
 assert.equal(g.valid,false);assert.match(g.errors.join('; '),/game record coverage/);
});
