/** M115 adult-only fixture interface, no caller-supplied observations or learner IDs. */
import {createHash} from 'node:crypto';
import {runSyntheticCalibration} from './synthetic-mastery-calibration.mjs';
import {auditSyntheticMasteryGrid} from './synthetic-mastery-grid.mjs';
const sha=s=>createHash('sha256').update(s,'utf8').digest('hex');
const REAL_REVIEWED_POOL=Object.freeze([]);
const POOL_VERSION=sha('M115 fixed synthetic calibration pool v1');
const flags=()=>({syntheticOnly:true,masteryEnabled:false,masteryValidated:false,independentStudyCompleted:false,humanApprovalAuthenticated:false,publicReleaseApproved:false,storesStudentData:false});
const scenarios=Object.freeze(['fixed-transfer','finite-grid']);
export function adaptiveEvidenceCatalog(){
 return {realReviewedPoolCount:REAL_REVIEWED_POOL.length,syntheticPoolVersion:POOL_VERSION,scenarios:[...scenarios],...flags()};
}
export function evaluateAdaptiveEvidence(request){
 if(REAL_REVIEWED_POOL.length!==0)throw Error('Independent review required');
 if(!request||typeof request!=='object'||Array.isArray(request)||Object.keys(request).length!==3||!['pool','version','scenario'].every(k=>Object.hasOwn(request,k)))return {status:'unavailable',reason:'INVALID_REQUEST',...flags()};
 if(request.pool==='reviewed')return {status:'unavailable',reason:'NO_AUTHENTICATED_REVIEWED_TASKS',...flags()};
 if(request.pool!=='synthetic'||request.version!==POOL_VERSION||!scenarios.includes(request.scenario))return {status:'unavailable',reason:'INVALID_FIXTURE_SELECTION',...flags()};
 if(request.scenario==='finite-grid'){
  const r=auditSyntheticMasteryGrid();
  if(!r.valid)throw Error('Finite-grid regression');
  return {status:'synthetic-evaluation',scenario:request.scenario,version:POOL_VERSION,gridCases:r.gridCases,counts:r.counts,empiricalAccuracy:null,confidenceInterval:null,...flags()};
 }
 const r=runSyntheticCalibration(),n=r.totalFixtures,c=r.counts,correct=c.truePositive+c.trueNegative,classified=r.classified;
 // Bounds over unresolved invented outcomes, NOT a statistical confidence interval.
 return {status:'synthetic-evaluation',scenario:request.scenario,version:POOL_VERSION,totalFixtures:n,classified,counts:c,fixtureRates:r.fixtureRates,
  coverage:classified/n,classifiedFixtureAgreement:classified?correct/classified:null,
  unresolvedOutcomeBounds:{lower:correct/n,upper:(correct+c.abstentions)/n},results:r.results,empiricalAccuracy:null,confidenceInterval:null,...flags()};
}
