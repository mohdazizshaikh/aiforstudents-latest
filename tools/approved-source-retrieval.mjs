/** M35 maintainer-only contract prototype. No browser integration, network, model or user input storage.
 * A caller-supplied review label is NOT authentication. The current trusted registry is permanently empty.
 */
export const APPROVED_SOURCE_REGISTRY=Object.freeze([]);
const safeId=/^[a-z0-9][a-z0-9:-]{0,79}$/;
const sha=/^[a-f0-9]{64}$/;
const response=reason=>Object.freeze({kind:'unavailable',reason,passage:null,citation:null,remoteEnabled:false});
export function approvedSourceHint(request){
 if(!request||typeof request!=='object'||Array.isArray(request))return response('INVALID_REQUEST');
 const keys=Object.keys(request);
 if(keys.length!==3||!['id','versionHash','language'].every(k=>Object.hasOwn(request,k)))return response('INVALID_REQUEST');
 const {id,versionHash,language}=request;
 if(typeof id!=='string'||!safeId.test(id)||typeof versionHash!=='string'||!sha.test(versionHash)||!['en','hi'].includes(language))return response('INVALID_REQUEST');
 // No approved review evidence is authenticated; even apparently valid IDs fail closed.
 return response('NO_AUTHENTICATED_APPROVED_SOURCE');
}
