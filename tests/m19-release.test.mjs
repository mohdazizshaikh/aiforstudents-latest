import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {releaseAudit,auditContentQueues,auditStatic} from '../tools/release-preflight.mjs';
import {verifyLive,validateOrigin,TARGETS} from '../tools/check-live-staging.mjs';
const root=new URL('../',import.meta.url);
const file=x=>fs.readFileSync(new URL(x,root),'utf8');
test('M19 offline staging release preflight checks 24 pages and is ready for private testing',()=>{
 const r=releaseAudit();assert.equal(r.mode,'staging');assert.equal(r.htmlPages,24);assert.deepEqual(r.failures,[]);assert.equal(r.ready,true);
});
test('M19 human review gate blocks all public release until genuinely signed off',()=>{
 const r=releaseAudit(undefined,'public');assert.equal(r.ready,false);assert.ok(r.failures.some(x=>x.includes('human signoff')));assert.ok(r.failures.some(x=>x.includes('child-safety/legal')));
});
test('M19 review inventory is counted without inventing approvals',()=>{
 const x=auditContentQueues();assert.equal(x.total,3292);assert.equal(x.pending,3292);assert.deepEqual(Object.fromEntries(Object.entries(x.counts).map(([k,v])=>[k,v.total])),{game:3200,study:32,studio:4,experiment:4,classroom:10,digital:32,maths:3,science:7});
});
test('M19 GitHub checkout archived game review queue is counted without pretending approvals',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'aifs-m19-'));try{
  fs.mkdirSync(path.join(tmp,'docs'));
  const rawPath=new URL('CONTENT_REVIEW_QUEUE.jsonl',root),archivePath=new URL('docs/CONTENT_REVIEW_QUEUE.jsonl.gz',root);
  const game=fs.existsSync(rawPath)?fs.readFileSync(rawPath):gunzipSync(fs.readFileSync(archivePath));
  fs.writeFileSync(path.join(tmp,'docs','CONTENT_REVIEW_QUEUE.jsonl.gz'),gzipSync(game));
  for(const f of ['LAB_CONTENT_REVIEW_QUEUE.jsonl','STUDIO_CONTENT_REVIEW_QUEUE.jsonl','EXPERIMENT_CONTENT_REVIEW_QUEUE.jsonl','CLASSROOM_CONTENT_REVIEW_QUEUE.jsonl','DIGITAL_CONTENT_REVIEW_QUEUE.jsonl','MATHS_CONTENT_REVIEW_QUEUE.jsonl','SCIENCE_CONTENT_REVIEW_QUEUE.jsonl'])fs.copyFileSync(new URL(f,root),path.join(tmp,f));
  const r=auditContentQueues(tmp);assert.deepEqual(r.problems,[]);assert.equal(r.total,3292);assert.equal(r.pending,3292);
 }finally{fs.rmSync(tmp,{recursive:true,force:true})}
});
test('M19 all pages and static assets compatible with self-only CSP',()=>{
 const audit=auditStatic();assert.deepEqual(audit.problems,[]);assert.equal(audit.pages,24);
 const ht=file('.htaccess');for(const header of ['X-Robots-Tag','Content-Security-Policy','Referrer-Policy','X-Content-Type-Options'])assert.ok(ht.includes(header));assert.doesNotMatch(ht,/unsafe-inline|unsafe-eval/);
});
test('M19 worksheets are no-inline, printed by external local script; no student data',()=>{
 const css=file('assets/worksheet-print.css'),js=file('assets/worksheet-print.js');assert.match(css,/@media print/);assert.match(css,/\.teacher-notes\{display:none!important/);assert.match(js,/window\.print/);assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(/);
 for(const topic of ['fractions','circuits']){const h=file(`teacher-kit/worksheets/${topic}/index.html`);assert.match(h,/worksheet-print\.css/);assert.match(h,/worksheet-print\.js/);assert.doesNotMatch(h,/onclick=|<style>|window\.print\(\)/);}
});
test('M19 live-host checker rejects insecure/malformed origins',()=>{
 assert.equal(validateOrigin('http://example.org'),null);assert.equal(validateOrigin('https://example.org/path'),null);assert.equal(validateOrigin('https://x:y@example.org'),null);assert.equal(validateOrigin('https://example.org:8443/'),null);assert.equal(validateOrigin('https://example.org/'),'https://example.org');
});
test('M19 live-host checker audits all endpoints and validates expected headers',async()=>{
 const headers=new Headers({'content-type':'text/html; charset=utf-8','x-robots-tag':'noindex, nofollow','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; script-src 'self'",'referrer-policy':'strict-origin-when-cross-origin'});
 const fetcher=async url=>{let h=new Headers(headers);if(url.endsWith('.js'))h.set('content-type','text/javascript');if(url.endsWith('.css'))h.set('content-type','text/css');return {status:200,headers:h,text:async()=>url.endsWith('service-worker.js')?'aifs-discovery-m32':'<meta name="robots" content="noindex,nofollow">'};};
 const r=await verifyLive('https://example.org',fetcher);assert.equal(r.checked,TARGETS.length);assert.equal(r.passed,true);
});
test('M19 live-host checker detects unsafe or stale staging server replies',async()=>{
 const fetcher=async()=>({status:200,headers:new Headers({'content-type':'text/html'}),text:async()=>'<html>missing robots</html>'});
 const r=await verifyLive('https://example.org',fetcher);assert.equal(r.passed,false);assert.ok(r.results[0].problems.some(x=>x.includes('noindex')));assert.ok(r.results[0].problems.some(x=>x.includes('CSP')));assert.ok(r.results.at(-1).problems.some(x=>x.includes('service-worker')));
});