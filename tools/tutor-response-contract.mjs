/** M43 maintainer-only, deterministic response-contract prototype.
 * No learner input, remote inference, provider SDK, network, or activation path.
 * The synthetic verifier cannot approve real content or be used as a live tutor.
 */
import {createHash} from 'node:crypto';
import {APPROVED_SOURCE_REGISTRY,approvedSourceHint} from './approved-source-retrieval.mjs';
const sha=s=>createHash('sha256').update(s,'utf8').digest('hex');
const digest=/^[a-f0-9]{64}$/;
const languages=['en','hi'];
const exactKeys=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const denied=reason=>Object.freeze({accepted:false,reason,answer:null,citation:null,remoteEnabled:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
const requestKeys=['id','versionHash','language'];
const responseKeys=['id','versionHash','language','passageId','passageSha256','excerpt'];
const idPattern=/^[a-z0-9][a-z0-9:-]{0,79}$/;
function validRequest(r){
 return exactKeys(r,requestKeys)&&typeof r.id==='string'&&idPattern.test(r.id)&&typeof r.versionHash==='string'&&digest.test(r.versionHash)&&languages.includes(r.language);
}
/** Production-facing gate remains closed even for structurally perfect response candidates. */
export function checkDisabledTutorResponse(request,candidate){
 if(!validRequest(request))return denied('INVALID_REQUEST');
 const retrieval=approvedSourceHint(request);
 if(APPROVED_SOURCE_REGISTRY.length!==0||retrieval.remoteEnabled!==false)throw Error('Unexpected registry/activation state: independent review required');
 return denied('NO_AUTHENTICATED_APPROVED_SOURCE');
}
// Fixed non-educational, synthetic strings. No user-defined registry, trust flag or activation parameter.
const synthetic=Object.freeze({
 id:'synthetic:contract-only',versionHash:sha('M43 test version 1'),passages:Object.freeze({
 en:Object.freeze({id:'test-en',text:'Synthetic test token alpha.'}),
 hi:Object.freeze({id:'test-hi',text:'कृत्रिम परीक्षण टोकन अल्फ़ा।'})
 })
});
export function syntheticTutorFixture(language='en'){
 if(!languages.includes(language))throw Error('Unsupported test language');
 const p=synthetic.passages[language];
 const request={id:synthetic.id,versionHash:synthetic.versionHash,language};
 const candidate={...request,passageId:p.id,passageSha256:sha(p.text),excerpt:p.text};
 return {request,candidate};
}
/** Test-only schema and exact-excerpt checks; never returns text to a learner or asserts semantic correctness. */
export function verifySyntheticTutorContract(request,candidate){
 const result=(matches,reason)=>Object.freeze({syntheticOnly:true,contractMatches:matches,reason,remoteEnabled:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!validRequest(request))return result(false,'INVALID_REQUEST');
 if(request.id!==synthetic.id||request.versionHash!==synthetic.versionHash)return result(false,'SYNTHETIC_SOURCE_MISMATCH');
 if(!exactKeys(candidate,responseKeys))return result(false,'INVALID_RESPONSE_SCHEMA');
 for(const k of requestKeys)if(candidate[k]!==request[k])return result(false,'REQUEST_BINDING_MISMATCH');
 const passage=synthetic.passages[request.language];
 if(candidate.passageId!==passage.id||candidate.passageSha256!==sha(passage.text))return result(false,'CITATION_MISMATCH');
 if(typeof candidate.excerpt!=='string'||candidate.excerpt.length>200||candidate.excerpt!==passage.text)return result(false,'EXCERPT_MISMATCH');
 return result(true,'SYNTHETIC_EXACT_MATCH');
}
