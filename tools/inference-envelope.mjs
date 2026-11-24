/** M34 offline planning calculator; no provider, account, network, secret or runtime authorization. */
const integer=(v,k,min,max)=>{if(!Number.isSafeInteger(v)||v<min||v>max)throw RangeError('Invalid '+k);return v};
const decimal=(v,k)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1e9)throw RangeError('Invalid '+k);return v};
export function inferenceEnvelope(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Explicit budget assumptions required');
 const {currency,requestsPerDay,days,inputTokensPerRequest,outputTokensPerRequest,
  inputRatePerMillion,outputRatePerMillion,reservePercent,otherCosts,budgetLimit,timeoutMs}=input;
 if(typeof currency!=='string'||!(/^[A-Z]{3}$/.test(currency)))throw Error('Specify one currency code; no conversion performed');
 const requests=integer(requestsPerDay,'requests/day',0,1e6)*integer(days,'days',1,366);
 const inputTokens=requests*integer(inputTokensPerRequest,'input tokens',0,1e6);
 const outputTokens=requests*integer(outputTokensPerRequest,'output tokens',0,1e6);
 if(!Number.isSafeInteger(inputTokens)||!Number.isSafeInteger(outputTokens))throw Error('Unsafe token count');
 const inferenceCost=(inputTokens/1e6)*decimal(inputRatePerMillion,'input rate')+(outputTokens/1e6)*decimal(outputRatePerMillion,'output rate');
 const reserved=inferenceCost*(1+integer(reservePercent,'reserve percent',0,500)/100)+decimal(otherCosts,'other costs');
 const limit=decimal(budgetLimit,'budget limit');integer(timeoutMs,'timeout',1,120000);
 if(!Number.isFinite(reserved))throw Error('Unsafe cost');
 return {currency,requests,inputTokens,outputTokens,inferenceCost,worstCaseEstimate:reserved,budgetLimit:limit,
  overBudget:reserved>limit,timeoutMs,rateSource:'operator-supplied hypothetical assumptions',callsPerformed:0,
  providerSelected:false,networkEnabled:false,tutorEnabled:false,humanApproved:false,publicReleaseApproved:false};
}
