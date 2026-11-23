import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
test('M9 co-op renders in main page with standalone ES module and no remote player URLs',()=>{
 const html=read('../index.html');const js=read('../assets/team-app.js');
 assert.ok(html.includes('id="team-play"'));
 assert.ok(html.includes('assets/team-app.js'));
 assert.ok(html.includes('grow-together/'));
 assert.ok(js.includes('window.AIFS_TEAM_BRIDGE'));
 for(const banned of ['wss://','socket.io','navigator.contacts','getUserMedia','api.openai.com','generativelanguage.googleapis.com']){
  assert.ok(!html.includes(banned)&&!js.includes(banned),banned);
 }
});
test('Service worker caches M10 assets and public guide; private history never cached',()=>{
 const sw=read('../service-worker.js');
 assert.ok(sw.includes('aifs-discovery-m24'));
 for(const f of ['team-engine.js','team-app.js','grow-together/'])assert.ok(sw.includes(f),f);
 assert.ok(!sw.includes('sessionStorage')&&!sw.includes('localStorage'));
});
test('Co-op public SEO guide is crawlable educational HTML with no unverified career-fit claims',()=>{
 const html=read('../grow-together/index.html');
 assert.match(html,/<title>Grow Together:/);
 assert.match(html,/<meta name="description"/);
 assert.ok(html.includes('not a psychological assessment'));
 assert.ok(html.toLowerCase().includes('privacy')&&html.includes('free-text messaging'));
 const conf=read('../tools/configure-domain.mjs');assert.ok(conf.includes('grow-together/index.html'));
});