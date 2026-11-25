/** Fixed fictional metadata-only state machine; no real permission or resource copying. */
import {createHash} from 'node:crypto';
const fixture=Object.freeze({id:'synthetic:resource',version:createHash('sha256').update('fictional metadata v1').digest('hex'),source:'https://example.invalid/synthetic',rights:'SYNTHETIC_PERMISSION',provenance:'SYNTHETIC_ONLY'});
const flags=()=>({syntheticOnly:true,realApprovedCount:0,mayRedistribute:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
export const resourceFixture=()=>({...fixture});
export function createIngestionBoundary(){
 let state='EMPTY';
 const status=()=>({state,...flags()});
 function apply(input){
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==2||!Object.hasOwn(input,'action')||!Object.hasOwn(input,'metadata'))return {accepted:false,reason:'INVALID_REQUEST',...status()};
  const m=input.metadata;
  if(!m||typeof m!=='object'||Array.isArray(m)||Object.keys(m).length!==Object.keys(fixture).length||Object.keys(fixture).some(k=>!Object.hasOwn(m,k)||m[k]!==fixture[k]))return {accepted:false,reason:'UNAUTHENTICATED_OR_STALE_METADATA',...status()};
  if(input.action==='stage'&&state==='EMPTY'){state='SYNTHETIC_STAGED';return {accepted:true,...status()}}
  if(input.action==='revoke'&&state==='SYNTHETIC_STAGED'){state='SYNTHETIC_REVOKED';return {accepted:true,...status()}}
  return {accepted:false,reason:'INVALID_TRANSITION',...status()};
 }
 return {status,apply};
}
