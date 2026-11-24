import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FULL_TARGETS,FORBIDDEN_PUBLIC_PATHS} from '../tools/check-live-staging.mjs';
import {ANONYMOUS_TARGETS,EXTRA_SOURCE_PATHS,verifyRestrictedStaging} from '../tools/restricted-staging-audit.mjs';
const secret='Bearer fixture-only';
const privatePaths=new Set([...FORBIDDEN_PUBLIC_PATHS,...EXTRA_SOURCE_PATHS]);
const origin='https://restricted.example';
const mime=p=>p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.webmanifest')?'application/manifest+json':p.endsWith('.txt')?'text/plain':'text/html';
const headers=p=>({'content-type':mime(p),'x-robots-tag':'noindex, nofollow','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'",'x-frame-options':'DENY','referrer-policy':'no-referrer','permissions-policy':'camera=(), microphone=(), geolocation=()'});
function fixture({publicPath='',publicStatus=200,privatePath='',tamper='',networkPath=''}={}){
 const calls=[];let cancelled=0;
 const fetcher=async(url,options)=>{
  const p=new URL(url).pathname,auth=options.headers.Authorization||'';
  calls.push({p,auth,redirect:options.redirect});
  if(p===networkPath&&!auth)throw Error('secret network diagnostic');
  if(!auth||privatePaths.has(p)){
   const status=!auth?(p===publicPath?publicStatus:401):(p===privatePath?200:404);
   return {status,body:{cancel:async()=>{cancelled++}},text:async()=>{throw Error('Never read private body')},arrayBuffer:async()=>{throw Error('Never read private body')}};
  }
  const file=new URL('../'+(p==='/'?'index.html':p.endsWith('/')?p.slice(1)+'index.html':p.slice(1)),import.meta.url);
  const body=readFileSync(file);
  return new Response(p===tamper?Buffer.concat([body,Buffer.from('stale')]):body,{status:200,headers:headers(p)});
 };
 return {fetcher,calls,cancelled:()=>cancelled};
}
test('M87 complete anonymous denial before authenticated static byte parity and source isolation',async()=>{
 const f=fixture(),r=await verifyRestrictedStaging(origin,f.fetcher,secret);
 assert.equal(r.passed,true);assert.equal(r.anonymousChecked,ANONYMOUS_TARGETS.length);
 assert.ok(FULL_TARGETS.every(p=>ANONYMOUS_TARGETS.includes(p)));
 assert.ok(ANONYMOUS_TARGETS.includes('/ADVANCED_CONTENT_REVIEW_QUEUE.jsonl'));
 assert.ok(r.authenticatedSourceChecks.every(x=>x.blocked));
 assert.equal(r.authenticatedIntegrity.checked,FULL_TARGETS.length);
 assert.ok(f.calls.slice(0,ANONYMOUS_TARGETS.length).every(x=>x.auth===''));
 assert.ok(f.calls.slice(ANONYMOUS_TARGETS.length).every(x=>x.auth===secret));
 assert.ok(f.calls.every(x=>x.redirect==='error'));
 assert.equal(f.cancelled(),ANONYMOUS_TARGETS.length+privatePaths.size);
 assert.doesNotMatch(JSON.stringify(r),/fixture-only|secret network diagnostic/);
 for(const k of ['deploymentPerformed','operatorAuthenticated','backupRollbackVerified','publicReleaseApproved'])assert.equal(r[k],false);
});
test('M87 anonymous public success, redirects, errors and ambiguous status stop before credentials',async()=>{
 for(const options of [{publicPath:'/'},{publicPath:'/assets/app.js',publicStatus:302},{publicPath:'/robots.txt',publicStatus:500},{networkPath:'/'}]){
  const f=fixture(options),r=await verifyRestrictedStaging(origin,f.fetcher,secret);
  assert.equal(r.passed,false);assert.equal(r.anonymousPassed,false);assert.equal(r.authenticatedIntegrity,null);
  assert.ok(f.calls.every(x=>x.auth===''));assert.equal(r.reason,'ANONYMOUS_DENIAL_FAILED');
 }
});
test('M87 authenticated private-file exposure and stale bytes are blocked',async()=>{
 for(const options of [{privatePath:'/package.json'},{tamper:'/assets/app.js'}]){
  const f=fixture(options),r=await verifyRestrictedStaging(origin,f.fetcher,secret);
  assert.equal(r.anonymousPassed,true);assert.equal(r.passed,false);assert.equal(r.publicReleaseApproved,false);
 }
});
test('M87 requires HTTPS and local nonempty credential without newline; no request for invalid input',async()=>{
 const f=fixture();
 for(const [o,a] of [['http://restricted.example',secret],[origin,''],[origin,'test\ninvalid'],[origin+'/path',secret]])await assert.rejects(()=>verifyRestrictedStaging(o,f.fetcher,a),/authorized HTTPS/);
 assert.equal(f.calls.length,0);
});
