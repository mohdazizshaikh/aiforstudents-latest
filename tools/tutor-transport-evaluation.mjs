import {fileURLToPath} from 'node:url';import {createTransportRehearsal,transportCatalog,WIRE_CASES} from './tutor-transport-rehearsal.mjs';
import {tutorActivationStatus} from './tutor-activation-boundary.mjs';
const expected={match:'SYNTHETIC_EXACT_MATCH','wrong-citation':'CITATION_MISMATCH','extra-claim':'EXCERPT_MISMATCH','extra-field':'INVALID_RESPONSE_SCHEMA','invalid-json':'INVALID_JSON','duplicate-key':'NONCANONICAL_JSON','wrong-mime':'RESPONSE_MIME',redirect:'HTTP_STATUS','http-error':'HTTP_STATUS','oversized-header':'RESPONSE_LIMIT','oversized-stream':'RESPONSE_LIMIT',truncated:'TRANSPORT_FAILURE',timeout:'TIMEOUT','wrong-language':'REQUEST_BINDING_MISMATCH'};
export async function evaluateTransport(){
 const results=[];
 for(const request of transportCatalog().requests){
  const t=createTransportRehearsal();
  try{for(const scenario of WIRE_CASES){
   const r=await t.rehearse({request,scenario}),want=expected[scenario],passed=r.reason===want&&r.remoteEnabled===false&&r.publicReleaseApproved===false&&(scenario==='match'?r.status==='synthetic-match'&&r.citation!==null:r.excerpt===null&&r.citation===null);
   results.push({language:request.language,scenario,expected:want,observed:r.reason,passed});
  }}finally{t.close()}
 }
 return {schema:'aifs-m123-transport-evaluation-v1',valid:results.every(x=>x.passed),cases:results.length,passed:results.filter(x=>x.passed).length,results,activation:tutorActivationStatus(),externalProviderTested:false,semanticAccuracyValidated:false,independentReviewCompleted:false};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){if(process.argv.length!==2)throw Error('Fixed evaluation only');const r=await evaluateTransport();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}
