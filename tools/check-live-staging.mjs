/** M22 read-only HTTPS staging smoke; does not deploy, collect student data or approve launch.
 * Usage: node tools/check-live-staging.mjs https://authorized-private-staging.example [--full [--integrity]]
 * STAGING_AUTH_HEADER is optional; supplied locally through environment, NEVER in reports.
 */
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

export const TARGETS=[
 '/','/smart-learning-studio/','/virtual-experiment-lab/','/teacher-kit/','/ai-digital-skills/',
 '/teacher-kit/worksheets/fractions/','/teacher-kit/worksheets/circuits/','/assets/app.js',
 '/assets/styles.css','/assets/worksheet-print.css','/assets/worksheet-print.js','/service-worker.js'
];
// Static source is the only authority for paths; do not crawl a staging site or follow redirects.
function staticPages(){
 const siteDirs=['games','privacy','for-parents','methodology','accessibility','future-explorer',
  'grow-together','study-lab','smart-learning-studio','virtual-experiment-lab','teacher-kit',
  'ai-digital-skills','hi'];
 const routes=['/'];
 const scan=(dir,rel)=>{
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   if(entry.isDirectory())scan(path.join(dir,entry.name),rel+entry.name+'/');
   else if(entry.isFile()&&entry.name==='index.html')routes.push('/'+rel);
  }
 };
 for(const dir of siteDirs)scan(path.join(ROOT,dir),dir+'/');
 return routes;
}
function swPaths(){
 const text=readFileSync(path.join(ROOT,'service-worker.js'),'utf8');
 const match=text.match(/\bconst FILES\s*=\s*\[([\s\S]*?)\];/);
 if(!match)throw Error('Cannot derive service worker asset manifest');
 return [...match[1].matchAll(/'\.\/([^']*)'/g)].map(x=>'/'+x[1]);
}
function pathAllowed(p){
 if(typeof p!=='string'||!p.startsWith('/')||p.includes('\\')||/[?#\x00-\x1f]/.test(p))return false;
 if(p.includes('//')||p.split('/').some(x=>x==='.'||x==='..'))return false;
 return !/%(?:2e|2f|5c)/i.test(p);
}
export const FULL_TARGETS=Object.freeze([...new Set([...TARGETS,...staticPages(),...swPaths(),'/robots.txt'])].sort());
/** Sensitive source-only paths must NOT be readable at a web origin.
 * These probes never read/log response bodies. 401/403/404/410 are inaccessible.
 * Redirect/network failures are inconclusive and fail strict integrity closed.
 */
export const FORBIDDEN_PUBLIC_PATHS=Object.freeze([
 '/.htaccess','/RELEASE_MANIFEST.json','/CONTENT_REVIEW_QUEUE.jsonl',
 '/LAB_CONTENT_REVIEW_QUEUE.jsonl','/docs/CONTENT_REVIEW_QUEUE.jsonl.gz',
 '/review-evidence/pilot-first.json','/safety-handoff/operations.json'
]);
if(FORBIDDEN_PUBLIC_PATHS.some(x=>!pathAllowed(x)))throw Error('Invalid forbidden source path');

if(!FULL_TARGETS.every(pathAllowed))throw Error('Invalid path from static source');
const MAX_STATIC_BYTES=2*1024*1024;
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
function sourceFile(target){
 if(!pathAllowed(target))throw Error('Invalid source path');
 const rel=target==='/'?'index.html':target.endsWith('/')?target.slice(1)+'index.html':target.slice(1);
 const full=path.resolve(ROOT,rel);
 if(!full.startsWith(ROOT+path.sep)||!existsSync(full))throw Error('Missing expected local staging asset: '+target);
 return full;
}
/** Source release bytes are the authority, never content returned from a remote site.
 * Hashes cover every M22 full-manifest path, including all 23 guide/worksheet HTML pages.
 */
export function staticIntegrityManifest(targets=FULL_TARGETS){
 if(!Array.isArray(targets)||!targets.length||targets.some(x=>!pathAllowed(x)))throw Error('Unsafe or empty integrity target list');
 return targets.map(target=>{
  const bytes=readFileSync(sourceFile(target));
  if(bytes.length>MAX_STATIC_BYTES)throw Error('Local static asset exceeds per-target integrity limit: '+target);
  return {path:target,sha256:sha256(bytes),bytes:bytes.length};
 });
}

export function validateOrigin(s){
 try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password&&u.pathname==='/'&&!u.search&&!u.hash&&!u.port?u.origin:null}
 catch{return null}
}
function typeProblem(target,contentType){
 if(target==='/'||target.endsWith('/'))return !/text\/html/i.test(contentType)?'Expected HTML content-type':null;
 if(target.endsWith('.js'))return !/(?:javascript|ecmascript)/i.test(contentType)?'Expected JavaScript content-type':null;
 if(target.endsWith('.css'))return !/text\/css/i.test(contentType)?'Expected CSS content-type':null;
 if(target.endsWith('.svg'))return !/image\/svg\+xml/i.test(contentType)?'Expected SVG content-type':null;
 if(target.endsWith('.webmanifest'))return !/(?:application\/(?:manifest\+json|json))/i.test(contentType)?'Expected webmanifest JSON content-type':null;
 if(target.endsWith('.txt'))return !/text\/plain/i.test(contentType)?'Expected text/plain content-type':null;
 return null;
}
export async function verifyLive(origin,fetcher=fetch,authHeader='',targets=TARGETS,integrity=false){
 const safe=validateOrigin(origin);
 if(!safe)throw Error('Use a verified HTTPS origin without path, port, query, fragments or embedded credentials');
 if(!Array.isArray(targets)||!targets.length||targets.some(x=>!pathAllowed(x)))throw Error('Unsafe or empty static target list');
 const expected=integrity?new Map(staticIntegrityManifest(targets).map(x=>[x.path,x])):null;
 const out=[];
 for(const target of targets){
  const problems=[];let response,body='',servedBytes=null;
  try{
   response=await fetcher(safe+target,{redirect:'error',headers:authHeader?{Authorization:authHeader}:{},signal:AbortSignal.timeout(12000)});
   // No credentials, page contents or user records are stored in the audit report.
   if(integrity){
    if(typeof response.arrayBuffer!=='function')throw Error('Binary response body required');
    const reportedLength=Number(response.headers.get('content-length'));
    if(Number.isFinite(reportedLength)&&reportedLength>MAX_STATIC_BYTES)throw Error('Remote asset too large');
    servedBytes=Buffer.from(await response.arrayBuffer());
    if(servedBytes.length>MAX_STATIC_BYTES)throw Error('Remote asset too large');
    body=servedBytes.toString('utf8');
   }else{
    body=await response.text();
   }
  }catch{
   out.push({path:target,status:'network-error',problems:['Request failed or redirected; check access controls and HTTPS']});continue;
  }
  if(response.status!==200)problems.push('Expected HTTP 200');
  const h=response.headers,ct=h.get('content-type')||'';
  const mime=typeProblem(target,ct);if(mime)problems.push(mime);
  if((target==='/'||target.endsWith('/'))&&!body.includes('noindex,nofollow'))problems.push('Missing staging noindex in page');
  if(!/noindex/i.test(h.get('x-robots-tag')||''))problems.push('Missing X-Robots-Tag noindex header');
  if(!h.get('x-content-type-options')?.includes('nosniff'))problems.push('Missing nosniff header');
  if(!h.get('content-security-policy')?.includes("script-src 'self'"))problems.push('Missing strict self-only CSP');
  if(!h.get('referrer-policy'))problems.push('Missing Referrer-Policy');
  if(target==='/service-worker.js'&&!body.includes('aifs-discovery-m31'))problems.push('Old service-worker version');
  if(integrity){
   const csp=h.get('content-security-policy')||'';
   for(const directive of ["default-src 'self'","script-src 'self'","object-src 'none'","frame-ancestors 'none'"]){
    if(!csp.includes(directive))problems.push('Missing strict CSP directive: '+directive);
   }
   if(/'unsafe-inline'|'unsafe-eval'/i.test(csp))problems.push('Unsafe inline/eval CSP exception');
   if((h.get('x-frame-options')||'').trim().toUpperCase()!=='DENY')problems.push('Missing X-Frame-Options DENY');
   const permissions=h.get('permissions-policy')||'';
   for(const restriction of ['camera=()','microphone=()','geolocation=()']){
    if(!permissions.includes(restriction))problems.push('Missing Permissions-Policy restriction '+restriction);
   }
   if(!expected.has(target)||sha256(servedBytes)!==expected.get(target).sha256)
    problems.push('Served bytes do not match current checked-out static source');
  }
  out.push({path:target,status:response.status,problems});
 }
 const exposureChecks=[];
 if(integrity){
  for(const target of FORBIDDEN_PUBLIC_PATHS){
   let status='network-error',problems=[];
   try{
    const res=await fetcher(safe+target,{redirect:'error',headers:authHeader?{Authorization:authHeader}:{},signal:AbortSignal.timeout(12000)});
    status=res.status;
    if(![401,403,404,410].includes(res.status))problems.push('Sensitive source-only URL may be exposed or response is not safely inaccessible');
    // Do not consume or log bodies, even when the server incorrectly returns 200.
    if(typeof res.body?.cancel==='function')await res.body.cancel();
   }catch{
    problems.push('Cannot confirm source-only URL is blocked; verify real server access rules');
   }
   exposureChecks.push({path:target,status,problems});
  }
 }
 return {origin:safe,mode:'read-only',scope:targets===FULL_TARGETS?'full':'core',
  integrity,checked:out.length,exposureChecked:exposureChecks.length,
  passed:out.every(x=>x.problems.length===0)&&exposureChecks.every(x=>x.problems.length===0),
  results:out,exposureChecks,
  approval:'NOT A PUBLIC LAUNCH APPROVAL'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);
 const full=args.includes('--full'), integrity=args.includes('--integrity');
 const origins=args.filter(x=>x!=='--full'&&x!=='--integrity');
 const origin=origins[0];
 if(!origin||origins.length!==1||args.length!==(1+Number(full)+Number(integrity))||(integrity&&!full)){
  console.error('Usage: node tools/check-live-staging.mjs https://your-private-staging.example [--full [--integrity]]');process.exitCode=2;
 }else{
  try{
   const result=await verifyLive(origin,fetch,process.env.STAGING_AUTH_HEADER||'',full?FULL_TARGETS:TARGETS,integrity);
   console.log(JSON.stringify(result,null,2));
   if(!result.passed)process.exitCode=1;
  }catch(err){console.error(err.message);process.exitCode=2}
 }
}
