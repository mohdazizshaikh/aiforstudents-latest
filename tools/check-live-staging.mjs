/** M22 read-only HTTPS staging smoke; does not deploy, collect student data or approve launch.
 * Usage: node tools/check-live-staging.mjs https://authorized-private-staging.example [--full]
 * STAGING_AUTH_HEADER is optional; supplied locally through environment, NEVER in reports.
 */
import {readFileSync,readdirSync} from 'node:fs';
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
export const FULL_TARGETS=Object.freeze([...new Set([...TARGETS,...staticPages(),...swPaths()])].sort());
if(!FULL_TARGETS.every(pathAllowed))throw Error('Invalid path from static source');
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
 return null;
}
export async function verifyLive(origin,fetcher=fetch,authHeader='',targets=TARGETS){
 const safe=validateOrigin(origin);
 if(!safe)throw Error('Use a verified HTTPS origin without path, port, query, fragments or embedded credentials');
 if(!Array.isArray(targets)||!targets.length||targets.some(x=>!pathAllowed(x)))throw Error('Unsafe or empty static target list');
 const out=[];
 for(const target of targets){
  const problems=[];let response,body='';
  try{
   response=await fetcher(safe+target,{redirect:'error',headers:authHeader?{Authorization:authHeader}:{},signal:AbortSignal.timeout(12000)});
   // No persistence, cookies or personal information. Only inspect returned static text.
   body=await response.text();
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
  if(target==='/service-worker.js'&&!body.includes('aifs-discovery-m19'))problems.push('Old service-worker version');
  out.push({path:target,status:response.status,problems});
 }
 return {origin:safe,mode:'read-only',scope:targets===FULL_TARGETS?'full':'core',
  checked:out.length,passed:out.every(x=>x.problems.length===0),results:out,
  approval:'NOT A PUBLIC LAUNCH APPROVAL'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);
 const full=args.includes('--full'), origins=args.filter(x=>x!=='--full');
 const origin=origins[0];
 if(!origin||origins.length!==1||args.some(x=>x!=='--full'&&x!==origin)){
  console.error('Usage: node tools/check-live-staging.mjs https://your-private-staging.example [--full]');process.exitCode=2;
 }else{
  try{
   const result=await verifyLive(origin,fetch,process.env.STAGING_AUTH_HEADER||'',full?FULL_TARGETS:TARGETS);
   console.log(JSON.stringify(result,null,2));
   if(!result.passed)process.exitCode=1;
  }catch(err){console.error(err.message);process.exitCode=2}
 }
}
