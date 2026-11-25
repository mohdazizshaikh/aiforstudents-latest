import test from 'node:test';import assert from 'node:assert/strict';
import {releaseAudit,auditContentQueues} from '../tools/release-preflight.mjs';
import {PROTOTYPE_KEYS} from '../assets/extended-lab-catalog.js';
import {labPackKeys} from '../assets/teacher-cards-engine.js';
import {REVIEW_CRITERIA} from '../tools/prototype-review-worklist.mjs';
test('M124 canonical and standalone review scopes separately counted in staging and public preflight',()=>{
 const legacy=auditContentQueues(),staging=releaseAudit(),pub=releaseAudit(undefined,'public');
 assert.equal(staging.ready,true,staging.failures.join('; '));assert.equal(staging.reviewRecords,legacy.total);assert.equal(staging.pendingReviews,legacy.pending);assert.equal(legacy.total,3340);assert.equal(labPackKeys().length,109);
 assert.deepEqual(staging.prototypeReview,{models:PROTOTYPE_KEYS.length,pendingCriteria:PROTOTYPE_KEYS.length*REVIEW_CRITERIA.length,pendingReferenceCases:PROTOTYPE_KEYS.length*2,authenticatedApprovals:0,publicReleaseApproved:false});
 assert.deepEqual(pub.prototypeReview,staging.prototypeReview);assert.equal(pub.ready,false);assert.ok(pub.failures.some(x=>x.includes('standalone draft models lack authenticated independent approval')));
});
