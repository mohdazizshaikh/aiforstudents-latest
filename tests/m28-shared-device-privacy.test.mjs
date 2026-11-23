import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');

test('M28 clear history issues only a minimal same-origin control message, no learner payload',()=>{
 const source=read('assets/app.js');
 assert.match(source,/new BroadcastChannel\('aifs-discovery-privacy-reset-v1'\)/);
 assert.match(source,/privacyClearChannel\?\.postMessage\(\{type:'clear-history'\}\)/);
 const messages=[...source.matchAll(/privacyClearChannel\?\.postMessage\(([^)]*)\)/g)].map(x=>x[1]);
 assert.deepEqual(messages,["{type:'clear-history'}"],'Never broadcast learner data or extra keys');
 assert.match(source,/privacyClearChannel\?\.addEventListener\('message'/);
 assert.match(source,/event\.data\?\.type==='clear-history'/);
 assert.match(source,/clearAllHistory\(false\)/);
});
test('M28 clearing peer tab history removes both local and session stores and clears in-memory bridges',()=>{
 const source=read('assets/app.js');
 const func=source.slice(source.indexOf('function clearAllHistory('),source.indexOf("$('clear-progress').addEventListener"));
 assert.match(func,/remove\(safeStorage\('localStorage'\),key\)/);
 assert.match(func,/remove\(safeStorage\('sessionStorage'\),key\)/);
 assert.match(func,/ST\.history=emptyHistory\(\)/);
 assert.match(func,/aifs-history-cleared/);
 assert.match(func,/aifs-team-reset/);
 assert.match(func,/ST\.playing=false/);
 assert.match(func,/if\(notifyPeers\)/);
 const fallback=source.slice(source.indexOf("window.addEventListener('storage'"));
 assert.match(fallback,/event\.newValue===null/);
});
test('M28 offline worker cache version advances and retains local-only static asset list',()=>{
 const sw=read('service-worker.js');
 assert.match(sw,/aifs-discovery-m28-2026-11-23/);
 assert.match(sw,/keys\.filter\(k=>/);
 assert.match(sw,/self\.location\.origin/);
 assert.doesNotMatch(sw,/fetch\([^)]*analytics|tracker|remote/);
});
test('M28 privacy disclosure warns shared-device browser tabs are not a guarantee across other devices',()=>{
 const html=read('privacy/index.html');
 assert.match(html,/other open tabs/i);
 assert.match(html,/does not reach different browser profiles or devices/i);
 assert.match(html,/noindex,nofollow/);
});
