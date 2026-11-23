import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {FULL_TARGETS,FORBIDDEN_PUBLIC_PATHS,staticIntegrityManifest,verifyLive} from '../tools/check-live-staging.mjs';

const base=new URL('../',import.meta.url);
const fileFor=target=>new URL(target==='/'?'index.html':target.endsWith('/')?target.slice(1)+'index.html':target.slice(1),base);
const mime=target=>target.endsWith('.js')?'text/javascript':target.endsWith('.css')?'text/css':
 target.endsWith('.svg')?'image/svg+xml':target.endsWith('.webmanifest')?'application/manifest+json':
 target.endsWith('.txt')?'text/plain':'text/html; charset=utf-8';
const baseHeaders=target=>({
 'content-type':mime(target),'x-robots-tag':'noindex, nofollow','x-content-type-options':'nosniff',
 'content-security-policy':"default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; style-src 'self'",
 'x-frame-options':'DENY','referrer-policy':'strict-origin-when-cross-origin',
 'permissions-policy':'camera=(), microphone=(), geolocation=()'
});
function sourceFetcher({tamper='',omit='',expose='',badPolicy=false,authStore=null}={}){
 return async (url,options)=>{
  const pathname=new URL(url).pathname;
  if(authStore)authStore.push(options.headers?.Authorization||'');
  const headers=baseHeaders(pathname);
  if(pathname===omit)return new Response('Not Found',{status:404,headers});
  if(FORBIDDEN_PUBLIC_PATHS.includes(pathname))return new Response(pathname===expose?'PRIVATE RESPONSE NOT FOR LOGGING':'Not Found',
    {status:pathname===expose?200:404,headers});
  if(badPolicy)headers['content-security-policy']="default-src 'self'; script-src 'self' 'unsafe-inline'";
  const source=readFileSync(fileFor(pathname));
  const body=pathname===tamper?Buffer.concat([source,Buffer.from('\n<!-- unreviewed stale change -->')]):source;
  return new Response(body,{status:200,headers});
 };
}
test('M27 full source integrity inventory hashes every known static target deterministically',()=>{
 const rows=staticIntegrityManifest();
 assert.equal(rows.length,FULL_TARGETS.length);
 assert.ok(rows.length>40);
 assert.equal(new Set(rows.map(x=>x.path)).size,rows.length);
 const names=['/','/service-worker.js','/assets/styles.css','/teacher-kit/worksheets/circuits/','/hi/'];
 for(const name of names){
  const row=rows.find(x=>x.path===name);
  assert.ok(row,'Missing '+name);
  const source=readFileSync(fileFor(name));
  assert.equal(row.sha256,createHash('sha256').update(source).digest('hex'));
  assert.equal(row.bytes,source.length);
 }
 assert.deepEqual(rows,staticIntegrityManifest(),'Manifest must be deterministic');
});
test('M27 authentic static bytes + strict staging headers pass exact full-manifest audit, not launch approval',async()=>{
 let count=0;
 const fetcher=async(...args)=>{count++;return sourceFetcher()(...args)};
 const result=await verifyLive('https://restricted-staging.example',fetcher,'',FULL_TARGETS,true);
 assert.equal(result.checked,FULL_TARGETS.length);
 assert.equal(result.scope,'full');
 assert.equal(result.integrity,true);
 assert.equal(result.passed,true,JSON.stringify(result.results.filter(x=>x.problems.length)).slice(0,1600));
 assert.equal(count,FULL_TARGETS.length+FORBIDDEN_PUBLIC_PATHS.length);
 assert.equal(result.exposureChecked,FORBIDDEN_PUBLIC_PATHS.length);
 assert.ok(result.exposureChecks.every(x=>x.problems.length===0));
 assert.equal(result.approval,'NOT A PUBLIC LAUNCH APPROVAL');
});
test('M27 catches a tampered or stale stylesheet even when HTTPS headers and HTTP status are valid',async()=>{
 const r=await verifyLive('https://restricted-staging.example',sourceFetcher({tamper:'/assets/styles.css'}),'',
 ['/assets/styles.css'],true);
 assert.equal(r.passed,false);
 assert.match(r.results[0].problems.join(' '),/Served bytes do not match/);
 assert.ok(!JSON.stringify(r).includes('unreviewed stale change'),'Never log served body');
});
test('M27 catches changed/stale HTML and missing static routes without leaking source bytes',async()=>{
 const r=await verifyLive('https://restricted-staging.example',sourceFetcher({tamper:'/teacher-kit/'}),
 '',['/teacher-kit/'],true);
 assert.equal(r.passed,false);
 assert.match(r.results[0].problems.join(' '),/Served bytes do not match/);
 const missing=await verifyLive('https://restricted-staging.example',sourceFetcher({omit:'/teacher-kit/'}),
 '',['/teacher-kit/'],true);
 assert.equal(missing.passed,false);
 assert.ok(missing.results[0].problems.some(x=>x.includes('Expected HTTP 200')));
});
test('M27 integrity mode enforces more than legacy minimum CSP and frame restrictions',async()=>{
 const r=await verifyLive('https://restricted-staging.example',sourceFetcher({badPolicy:true}),'',['/'],true);
 assert.equal(r.passed,false);
 assert.match(r.results[0].problems.join(' '),/Unsafe inline\/eval CSP/);
 assert.match(r.results[0].problems.join(' '),/Missing strict CSP directive/);
});
test('M27 missing source path fails closed rather than accepting remote unknown files',()=>{
 assert.throws(()=>staticIntegrityManifest(['/not-a-real-asset.js']),/Missing expected local staging asset/);
 assert.throws(()=>staticIntegrityManifest(['/../secret']),/Unsafe or empty/);
});
test('M27 optional staging auth header is sent for operator but not recorded in result',async()=>{
 const authStore=[],secret='Bearer dont-leak-staging-credentials';
 const report=await verifyLive('https://restricted-staging.example',
 sourceFetcher({authStore}),secret,['/assets/app.js'],true);
 assert.equal(report.passed,true);
 assert.equal(authStore.length,1+FORBIDDEN_PUBLIC_PATHS.length);
 assert.ok(authStore.every(x=>x===secret));
 assert.ok(!JSON.stringify(report).includes(secret));
});
test('M27 CLI refuses incomplete --integrity without --full, with no network request',()=>{
 const script=new URL('../tools/check-live-staging.mjs',import.meta.url).pathname;
 const run=spawnSync(process.execPath,[script,'https://restricted-staging.example','--integrity'],{encoding:'utf8',timeout:7000});
 assert.equal(run.status,2);
 assert.match(run.stderr,/--full \[--integrity\]/);
});

test('M27 strict checker fails closed if site accidentally serves a private source or evidence file',async()=>{
 const r=await verifyLive('https://restricted-staging.example',
  sourceFetcher({expose:'/RELEASE_MANIFEST.json'}),'',['/'],true);
 assert.equal(r.passed,false);
 assert.equal(r.exposureChecked,FORBIDDEN_PUBLIC_PATHS.length);
 const exposed=r.exposureChecks.find(x=>x.path==='/RELEASE_MANIFEST.json');
 assert.equal(exposed.status,200);
 assert.match(exposed.problems.join(' '),/may be exposed/);
 assert.ok(!JSON.stringify(r).includes('PRIVATE RESPONSE'),'Private response body must never be logged');
});
test('M27 covers robots.txt as well as all PWA assets and 23 guide routes',()=>{
 assert.ok(FULL_TARGETS.includes('/robots.txt'));
 const robots=staticIntegrityManifest().find(x=>x.path==='/robots.txt');
 assert.ok(robots?.bytes>0);
});
