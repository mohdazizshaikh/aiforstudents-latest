/** M120 source-level budget and privacy guard. Not actual transfer latency, device or legal proof. */
import {readFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {auditOfflineDependencies} from './audit-offline-dependencies.mjs';
import {FULL_TARGETS,FORBIDDEN_PUBLIC_PATHS,staticIntegrityManifest} from './check-live-staging.mjs';
const ROOT=new URL('../',import.meta.url);
const budget=Object.freeze({uniquePrecacheBytes:1400000,uniquePrecacheGzipBytes:400000,maxAssetBytes:180000,guideDependencyGzipBytes:180000});
const paths=['assets/workspace-app.js','assets/workspace-engine.js','assets/concept-pathways.js','assets/concept-pathways-app.js','assets/primary-maths-lab.js','assets/primary-maths-app.js','assets/comparison-lab-engine.js','assets/comparison-lab-app.js','assets/curriculum-catalog.js','assets/curriculum-catalog-app.js','assets/extended-lab-catalog.js','assets/prototype-worksheet-engine.js','assets/prototype-worksheet-app.js','assets/visual-lab-engine.js','assets/visual-lab-app.js','assets/activity-explorer-engine.js','assets/activity-explorer-app.js'];
const resolve=p=>p==='/'?'index.html':p.endsWith('/')?p.slice(1)+'index.html':p.slice(1);
export function auditQuality(){
 const issues=[],sw=readFileSync(new URL('service-worker.js',ROOT),'utf8'),m=sw.match(/\bconst FILES\s*=\s*\[([\s\S]*?)\];/);
 if(!m)throw Error('Missing manifest');
 const entries=[...m[1].matchAll(/'\.\/([^']*)'/g)].map(x=>'/'+x[1]),unique=[...new Set(entries.map(resolve))];
 const measurements=unique.map(p=>{const b=readFileSync(new URL(p,ROOT));return {path:p,bytes:b.length,gzipBytes:gzipSync(b,{level:9}).length}});
 const sum=(a,k)=>a.reduce((n,x)=>n+x[k],0),total=sum(measurements,'bytes'),gzip=sum(measurements,'gzipBytes'),max=Math.max(...measurements.map(x=>x.bytes));
 for(const [name,actual] of [['uniquePrecacheBytes',total],['uniquePrecacheGzipBytes',gzip],['maxAssetBytes',max]])if(actual>budget[name])issues.push(name+' exceeds budget');
 const guides=['study-lab/index.html','teacher-kit/index.html','virtual-experiment-lab/index.html'].map(p=>{
  const seen=new Set();
  function walk(file){
   if(seen.has(file))return;seen.add(file);const s=readFileSync(new URL(file,ROOT),'utf8');
   const refs=file.endsWith('.html')?[...s.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)=["']([^"']+\.(?:js|css))["']/g)].map(x=>x[1]):[...s.matchAll(/\bfrom\s*['"](\.[^'"]+)['"]/g)].map(x=>x[1]);
   for(const ref of refs){const u=new URL(ref,new URL(file,ROOT));if(!u.href.startsWith(ROOT.href)){issues.push('Nonlocal dependency '+file);continue}walk(u.href.slice(ROOT.href.length))}
  }
  walk(p);const bytes=[...seen].map(f=>gzipSync(readFileSync(new URL(f,ROOT)),{level:9}).length).reduce((a,b)=>a+b,0);if(bytes>budget.guideDependencyGzipBytes)issues.push('Guide budget exceeded '+p);
  return {path:p,files:seen.size,estimatedGzipBytes:bytes};
 });
 for(const p of paths){const s=readFileSync(new URL(p,ROOT),'utf8');if(/\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|WebSocket|sendBeacon)\b/.test(s))issues.push('Unexpected persistence or transport '+p);}
 const offline=auditOfflineDependencies();issues.push(...offline.issues);
 const manifest=staticIntegrityManifest(FULL_TARGETS);
 for(const x of manifest)if(x.path.startsWith('/tools/')||x.path.startsWith('/docs/')||x.path.startsWith('/v1/'))issues.push('Private path in static manifest '+x.path);
 for(const x of ['/v1/health','/v1/plan','/v1/chat','/v1/students','/tools/pilot-backend.mjs','/tools/adult-operator-rehearsal.mjs'])if(!FORBIDDEN_PUBLIC_PATHS.includes(x))issues.push('Missing negative probe '+x);
 return {valid:!issues.length,issues,budget,precacheEntries:entries.length,uniquePrecacheFiles:unique.length,uniquePrecacheBytes:total,uniquePrecacheGzipBytes:gzip,maxAssetBytes:max,guides,physicalDeviceVerified:false,realNetworkVerified:false,publicReleaseApproved:false};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const r=auditQuality();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}
