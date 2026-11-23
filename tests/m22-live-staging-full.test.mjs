import test from 'node:test';
import assert from 'node:assert/strict';
import {TARGETS,FULL_TARGETS,verifyLive,validateOrigin} from '../tools/check-live-staging.mjs';

const headersFor=target=>new Headers({
 'content-type':target.endsWith('.css')?'text/css':target.endsWith('.js')?'application/javascript':
  target.endsWith('.svg')?'image/svg+xml':target.endsWith('.webmanifest')?'application/manifest+json':'text/html; charset=utf-8',
 'x-robots-tag':'noindex, nofollow',
 'x-content-type-options':'nosniff',
 'content-security-policy':"default-src 'self'; script-src 'self'",
 'referrer-policy':'strict-origin-when-cross-origin'
});
test('M22 full HTTPS audit derives static allowlisted targets, not external crawler paths',()=>{
 assert.equal(TARGETS.length,12);
 assert.ok(FULL_TARGETS.length>40);
 assert.equal(new Set(FULL_TARGETS).size,FULL_TARGETS.length);
 for(const p of TARGETS)assert.ok(FULL_TARGETS.includes(p),p);
 for(const p of ['/','/manifest.webmanifest','/assets/favicon.svg','/games/number-market/','/hi/','/service-worker.js']){
  assert.ok(FULL_TARGETS.includes(p),p);
 }
 assert.ok(FULL_TARGETS.every(p=>p.startsWith('/')&&!p.includes('..')&&!p.includes('://')));
});
test('M22 full audit validates static HTML, CSS, SVG, manifest and service worker without fetching external URLs',async()=>{
 const calls=[];
 const fetcher=async(url,options)=>{
  calls.push({url,options});
  const target=new URL(url).pathname;
  const body=target==='/service-worker.js'?'aifs-discovery-m19':
   target.endsWith('/')?'<meta name="robots" content="noindex,nofollow">':'static';
  return {status:200,headers:headersFor(target),text:async()=>body};
 };
 const result=await verifyLive('https://staging.example',fetcher,'',FULL_TARGETS);
 assert.equal(result.scope,'full');
 assert.equal(result.checked,FULL_TARGETS.length);
 assert.equal(result.passed,true);
 assert.equal(calls.length,FULL_TARGETS.length);
 assert.ok(calls.every(x=>x.url.startsWith('https://staging.example/')&&x.options.redirect==='error'));
 assert.match(result.approval,/NOT A PUBLIC LAUNCH APPROVAL/);
});
test('M22 audit fails on incorrect CSS type or insecure headers, never grants approval',async()=>{
 const fetcher=async()=>({status:200,headers:new Headers({'content-type':'text/html'}),text:async()=>'<meta name="robots" content="noindex,nofollow">'});
 const result=await verifyLive('https://staging.example',fetcher,'',['/assets/styles.css']);
 assert.equal(result.passed,false);
 assert.ok(result.results[0].problems.some(x=>x.includes('CSS content-type')));
 assert.ok(result.results[0].problems.some(x=>x.includes('CSP')));
 assert.equal(result.approval,'NOT A PUBLIC LAUNCH APPROVAL');
});
test('M22 origin and target validation fail safely, and auth header is absent from reports',async()=>{
 assert.equal(validateOrigin('not a url'),null);
 assert.equal(validateOrigin('https://example.org/path'),null);
 await assert.rejects(()=>verifyLive('https://example.org',fetch,'',['/../admin']),/Unsafe or empty/);
 await assert.rejects(()=>verifyLive('https://example.org',fetch,'',['//evil.example/']),/Unsafe or empty/);
 let received='';
 const fetcher=async(_url,opts)=>{received=opts.headers.Authorization;return {status:200,headers:headersFor('/'),text:async()=>'<meta name="robots" content="noindex,nofollow">'}};
 const result=await verifyLive('https://example.org',fetcher,'Bearer test-secret',['/']);
 assert.equal(received,'Bearer test-secret');
 assert.ok(!JSON.stringify(result).includes('test-secret'));
});
