/** Manual read-only HTTPS staging smoke. Never crawls children, sends accounts, or changes hosting.
 * Usage: node tools/check-live-staging.mjs https://private-staging.yourdomain.example
 * Optional STAGING_AUTH_HEADER env holds a pre-approved Authorization header (not logged).
 * This is not an accessibility, legal or educator approval. */
import path from 'node:path';import {fileURLToPath} from 'node:url';
export const TARGETS=['/','/smart-learning-studio/','/virtual-experiment-lab/','/teacher-kit/','/ai-digital-skills/','/teacher-kit/worksheets/fractions/','/teacher-kit/worksheets/circuits/','/assets/app.js','/assets/styles.css','/assets/worksheet-print.css','/assets/worksheet-print.js','/service-worker.js'];
export function validateOrigin(s){const u=new URL(s);if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/'||u.search||u.hash||u.port)return null;return u.origin;}
export async function verifyLive(origin,fetcher=fetch,authHeader=''){
 const safe=validateOrigin(origin);if(!safe)throw Error('Use a verified HTTPS origin without path, port, query, fragments or embedded credentials');
 const out=[];
 for(const target of TARGETS){let problems=[],response,body='';
  try{response=await fetcher(safe+target,{redirect:'error',headers:authHeader?{Authorization:authHeader}:{},signal:AbortSignal.timeout(12000)});body=await response.text();}catch(err){out.push({path:target,status:'network-error',problems:['Request failed or redirected; check access controls and HTTPS']});continue}
  if(response.status!==200)problems.push('Expected HTTP 200');
  const h=response.headers,ct=h.get('content-type')||'';
  if(/\/$/.test(target)&&!ct.includes('text/html'))problems.push('Expected HTML content-type');
  if(/\.(?:js)$/.test(target)&&!/(?:javascript|ecmascript)/.test(ct))problems.push('Expected JavaScript content-type');
  if(target==='/service-worker.js'&&/html/i.test(ct))problems.push('Service worker served as HTML');
  if((target==='/'||target.endsWith('/'))&&!body.includes('noindex,nofollow'))problems.push('Missing staging noindex in page');
  if(!/noindex/i.test(h.get('x-robots-tag')||''))problems.push('Missing X-Robots-Tag noindex header');
  if(!h.get('x-content-type-options')?.includes('nosniff'))problems.push('Missing nosniff header');
  if(!h.get('content-security-policy')?.includes("script-src 'self'"))problems.push('Missing strict self-only CSP');
  if(!h.get('referrer-policy'))problems.push('Missing Referrer-Policy');
  if(target==='/service-worker.js'&&!body.includes('aifs-discovery-m19'))problems.push('Old service-worker version');
  out.push({path:target,status:response.status,problems});
 }
 return {origin:safe,mode:'read-only',checked:out.length,passed:out.every(x=>x.problems.length===0),results:out,approval:'NOT A PUBLIC LAUNCH APPROVAL'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const origin=process.argv[2];if(!origin){console.error('Usage: node tools/check-live-staging.mjs https://your-private-staging.example');process.exitCode=2;}
 else try{const result=await verifyLive(origin,fetch,process.env.STAGING_AUTH_HEADER||'');console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=1;}catch(err){console.error(err.message);process.exitCode=2;}
}