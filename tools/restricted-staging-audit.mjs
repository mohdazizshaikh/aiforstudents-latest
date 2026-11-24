/** M87 authorized operator only: verify anonymous denial before authenticated byte integrity.
 * No deployment, no credentials in output, no response bodies for denial probes.
 */
import {FULL_TARGETS,FORBIDDEN_PUBLIC_PATHS,validateOrigin,verifyLive} from './check-live-staging.mjs';
import {REVIEW_FILES} from './release-preflight.mjs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const EXTRA_SOURCE_PATHS=Object.freeze([...new Set([...Object.values(REVIEW_FILES).map(x=>'/'+x),'/package.json','/tools/release-preflight.mjs','/docs/MASTER_100_WORK_ITEMS.json','/review-packet/change-snapshot.json','/review-evidence/physical-validation.json','/safety-handoff/operations.json'])].filter(x=>!FORBIDDEN_PUBLIC_PATHS.includes(x)).sort());
export const ANONYMOUS_TARGETS=Object.freeze([...new Set([...FULL_TARGETS,...FORBIDDEN_PUBLIC_PATHS,...EXTRA_SOURCE_PATHS])].sort());
const flags=()=>({deploymentPerformed:false,operatorAuthenticated:false,backupRollbackVerified:false,publicReleaseApproved:false});
const inaccessible=status=>[401,403,404,410].includes(status);
async function denialProbe(origin,target,fetcher,auth=''){
 let status='network-error',blocked=false;
 try{
  const r=await fetcher(origin+target,{method:'GET',redirect:'error',headers:auth?{Authorization:auth}:{},cache:'no-store',signal:AbortSignal.timeout(12000)});
  status=Number.isInteger(r.status)?r.status:'invalid-status';
  blocked=inaccessible(status)&&r.redirected!==true;
  if(typeof r.body?.cancel==='function')await r.body.cancel();
 }catch{blocked=false;status='network-error'}
 return {path:target,status,blocked};
}
export async function verifyRestrictedStaging(origin,fetcher=fetch,authHeader=''){
 const safe=validateOrigin(origin);
 if(!safe||typeof authHeader!=='string'||!authHeader.trim()||authHeader.length>8192||/[\r\n]/.test(authHeader))throw Error('Use authorized HTTPS origin and protected local STAGING_AUTH_HEADER');
 const anonymous=[];
 for(const target of ANONYMOUS_TARGETS)anonymous.push(await denialProbe(safe,target,fetcher));
 const anonymousPassed=anonymous.every(x=>x.blocked);
 // Stop before transmitting credentials if the anonymous restriction is not established.
 if(!anonymousPassed)return {schema:'aifs-m87-restricted-staging-v1',passed:false,anonymousPassed:false,anonymousChecked:anonymous.length,anonymous,authenticatedIntegrity:null,authenticatedSourceChecks:[],reason:'ANONYMOUS_DENIAL_FAILED',...flags()};
 const authenticatedIntegrity=await verifyLive(safe,fetcher,authHeader,FULL_TARGETS,true);
 const authenticatedSourceChecks=[];
 for(const target of EXTRA_SOURCE_PATHS)authenticatedSourceChecks.push(await denialProbe(safe,target,fetcher,authHeader));
 const passed=authenticatedIntegrity.passed&&authenticatedSourceChecks.every(x=>x.blocked);
 return {schema:'aifs-m87-restricted-staging-v1',passed,anonymousPassed:true,anonymousChecked:anonymous.length,anonymous,authenticatedIntegrity,authenticatedSourceChecks,reason:passed?'STRUCTURAL_HTTP_CHECKS_PASSED':'AUTHENTICATED_INTEGRITY_OR_SOURCE_DENIAL_FAILED',...flags()};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [origin,ack,...extra]=process.argv.slice(2);
  if(ack!=='--authorized-private-staging'||extra.length)throw Error('Explicit authorized staging acknowledgement required');
  const result=await verifyRestrictedStaging(origin,fetch,process.env.STAGING_AUTH_HEADER||'');
  console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=1;
 }catch{console.error('Usage: npm run staging:restricted -- https://AUTHORIZED-PRIVATE-STAGING --authorized-private-staging (protected local STAGING_AUTH_HEADER required)');process.exitCode=2}
}
