/** Deterministic build checks: staging-safe and deliberately conservative public gate.
 * No network, no analytics, no external libraries. */
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const REVIEW_FILES={game:'CONTENT_REVIEW_QUEUE.jsonl',study:'LAB_CONTENT_REVIEW_QUEUE.jsonl',studio:'STUDIO_CONTENT_REVIEW_QUEUE.jsonl',experiment:'EXPERIMENT_CONTENT_REVIEW_QUEUE.jsonl',classroom:'CLASSROOM_CONTENT_REVIEW_QUEUE.jsonl',digital:'DIGITAL_CONTENT_REVIEW_QUEUE.jsonl',maths:'MATHS_CONTENT_REVIEW_QUEUE.jsonl',science:'SCIENCE_CONTENT_REVIEW_QUEUE.jsonl'};
const scan=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?scan(path.join(dir,x.name)):[path.join(dir,x.name)]);
function isPending(item){
 if(item.approved_for_child_launch===false)return true;
 const flags=Object.entries(item).filter(([key])=>/review|approved/i.test(key));
 return flags.length===0||flags.some(([key,val])=>/notes|reviewer_?notes|language\b/i.test(key)&&typeof val!=='boolean'&& !/status|subject|hindi|human/i.test(key)?false: val===false||val===null||typeof val==='string'&&/unreviewed|pending|not.?approved|unverified|draft/i.test(val));
}
export function auditContentQueues(root=projectRoot){
 const counts={},problems=[];
 for(const [kind,relative] of Object.entries(REVIEW_FILES)){
  const full=path.join(root,relative);
  const archived=kind==='game'?path.join(root,'docs/CONTENT_REVIEW_QUEUE.jsonl.gz'):null;
  if(!existsSync(full)&&!(archived&&existsSync(archived))){problems.push(`Missing ${relative} or reviewed source archive`);continue;}
  // GitHub tracks the previously exported 3,200-record queue as gzip to keep checkout small;
  // offline source ZIP also includes the raw JSONL. Never silently skip missing records.
  const text=existsSync(full)?readFileSync(full,'utf8'):gunzipSync(readFileSync(archived)).toString('utf8');
  const records=text.split('\n').filter(Boolean);let pending=0;
  records.forEach((line,i)=>{try{const x=JSON.parse(line);if(isPending(x))pending++;}catch{problems.push(`${relative}:${i+1} invalid JSON`)}});
  counts[kind]={total:records.length,pending};
 }
 return {counts,total:Object.values(counts).reduce((s,x)=>s+x.total,0),pending:Object.values(counts).reduce((s,x)=>s+x.pending,0),problems};
}
const normalize=(base,ref)=>{try{const u=new URL(ref,'https://staging.example/'+base);return u.origin==='https://staging.example'?decodeURIComponent(u.pathname).replace(/^\//,''):null}catch{return null}};
export function auditStatic(root=projectRoot){
 const problems=[], pages=scan(root).filter(x=>x.endsWith('.html'));
 const ht=readFileSync(path.join(root,'.htaccess'),'utf8');
 for(const name of ['X-Robots-Tag','Content-Security-Policy','X-Content-Type-Options','Referrer-Policy','X-Frame-Options','Permissions-Policy'])if(!ht.includes(name))problems.push(`Missing staging HTTP header: ${name}`);
 if(/'unsafe-inline'|'unsafe-eval'/i.test(ht))problems.push('CSP contains unsafe-inline or unsafe-eval');
 for(const page of pages){const relative=path.relative(root,page).replaceAll('\\','/'),html=readFileSync(page,'utf8');
  if(!html.includes('noindex,nofollow'))problems.push(`${relative}: missing noindex,nofollow`);
  if(/<script(?![^>]*\bsrc=)[^>]*>/i.test(html))problems.push(`${relative}: inline script`);
  if(/<style[\s>]/i.test(html)||/\sstyle\s*=/i.test(html))problems.push(`${relative}: inline styles`);
  if(/\son(?:click|load|error|input|submit|change|keyup|keydown|focus)\s*=/i.test(html))problems.push(`${relative}: inline event handler`);
  for(const [,tag,ref] of html.matchAll(/<(script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi)){
   if(tag.toLowerCase()==='link'&&!/\.css(?:$|[?#])/.test(ref))continue;
   if(ref.startsWith('http:')||ref.startsWith('https:')){problems.push(`${relative}: remote executable asset`);continue}
   const dest=normalize(relative.split('/').slice(0,-1).join('/')+'/',ref);
   if(dest&&!existsSync(path.join(root,dest)))problems.push(`${relative}: broken local asset ${ref}`);
  }
  for(const [,ref] of html.matchAll(/<a\b[^>]*?href=["']([^"']+)["'][^>]*target=["']_blank["'][^>]*>/gi)){
   const tag=html.match(new RegExp('<a\\b[^>]*?href=["\\\']'+ref.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'["\\\'][^>]*target=["\\\']_blank["\\\'][^>]*>','i'))?.[0]||'';
   if(!/rel=["'][^"']*noopener/.test(tag))problems.push(`${relative}: target blank without noopener`);
  }
 }
 const sw=readFileSync(path.join(root,'service-worker.js'),'utf8');if(!sw.includes("'./assets/worksheet-print.css'")||!sw.includes("'./assets/worksheet-print.js'"))problems.push('Worksheet assets not precached');
 return {pages:pages.length,problems};
}
export function releaseAudit(root=projectRoot,mode='staging'){
 if(!['staging','public'].includes(mode))throw Error('mode must be staging or public');
 const staticAudit=auditStatic(root),review=auditContentQueues(root);
 const failures=[...staticAudit.problems,...review.problems];
 if(mode==='public'){
  if(review.pending)failures.push(`${review.pending} educational records lack human signoff`);
  // Human/real-host approval must never be inferred from tests alone. A separate human
  // approval process is required, so this deterministic checker cannot approve public launch.
  failures.push('Public release requires human child-safety/legal, accessibility, and live-host approvals; not present in build');
 }
 return {mode,ready:failures.length===0,htmlPages:staticAudit.pages,reviewRecords:review.total,pendingReviews:review.pending,counts:review.counts,failures};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const mode=process.argv.includes('--public')?'public':'staging';const r=releaseAudit(projectRoot,mode);
 console.log(JSON.stringify(r,null,2));if(!r.ready)process.exitCode=1;
}