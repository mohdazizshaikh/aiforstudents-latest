import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('M35 restoring a persisted page drops only known tab session keys and reloads current preference',()=>{
 const app=read('assets/app.js'),start=app.indexOf("window.addEventListener('pageshow'"),end=app.indexOf('window.AIFS_ACTIVITY={solo:false,team:false}',start);
 assert.ok(start>=0&&end>start);const code=app.slice(start,end);
 assert.match(code,/if\(!event.persisted\)return/);
 assert.match(code,/\[SESSION_KEY,OLD_SESSION,V1_SESSION\]/);
 assert.match(code,/remove\(safeStorage\('sessionStorage'\),key\)/);
 assert.match(code,/location.reload\(\)/);
 assert.doesNotMatch(code,/localStorage|postMessage|fetch\(/);
});
test('M35 CI requires immutable Git history verification and restore browser regression',()=>{
 const ci=read('.github/workflows/ci.yml'),py=read('tests/browser_m25_ci.py');
 assert.match(ci,/fetch-depth: 0/);assert.match(ci,/node tools\/verify-evidence-snapshot.mjs --require-git/);
 assert.match(py,/PageTransitionEvent\('pageshow', \{persisted: true\}\)/);
 assert.match(py,/Restore kept stale session storage/);
});
