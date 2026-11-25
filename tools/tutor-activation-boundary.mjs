/** M123 immutable activation barrier: configuration or caller assertions cannot authorize production. */
import {readFileSync} from 'node:fs';
import {APPROVED_SOURCE_REGISTRY} from './approved-source-retrieval.mjs';
const c=JSON.parse(readFileSync(new URL('../docs/M34_B2_DESIGN_CONTRACT.json',import.meta.url),'utf8'));
export function tutorActivationStatus(){
 if(c.generativeTutorEnabled!==false||c.optionalPilot.enabled!==false||c.optionalPilot.approvedBudgetInr!==0||c.core.apiBudgetInr!==0||APPROVED_SOURCE_REGISTRY.length!==0||c.approvedSourceIds.length!==0||Object.values(c.approval).some(x=>x!==false))throw Error('Activation contract changed; independent review required');
 return {schema:'aifs-m123-activation-v1',enabled:false,approvedBudgetInr:0,approvedSources:0,missingGates:['authenticated-reviewed-source','independent-educator-review','legal-and-safeguarding-review','provider-contract-and-privacy-review','school-authorization','approved-cost-and-operator-policy','restricted-host-validation'],externalProviderRequestsAllowed:0,publicReleaseApproved:false};
}
/** No input accepts endpoint, key, identity, text, price or self-reported approval. */
export function authorizeExternalInference(){return {allowed:false,reason:'NO_AUTHENTICATED_ACTIVATION',...tutorActivationStatus()}}
