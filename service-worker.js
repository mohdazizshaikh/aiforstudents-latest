/* Only static public application assets are cached, never user history. */
const CACHE='aifs-discovery-m33-2026-11-24-m40-r1';
const FILES=['./','./index.html','./assets/styles.css','./assets/worksheet-print.css','./assets/worksheet-print.js','./assets/app.js','./assets/catalog.js','./assets/expanded-library.js','./assets/age-adaptive.js','./assets/age-adaptive-b.js','./assets/future-engine.js','./assets/lab-engine.js','./assets/lab-app.js','./assets/studio-engine.js','./assets/studio-app.js','./assets/experiment-engine.js','./assets/experiment-app.js','./assets/science-engine.js','./assets/science-app.js','./assets/advanced-lab-engine.js','./assets/advanced-lab-app.js','./assets/teacher-cards-engine.js','./assets/practice-engine.js','./assets/practice-app.js','./teacher-kit/cards/','./teacher-kit/cards/cards.js','./teacher-kit/cards/cards.css','./assets/classroom-engine.js','./assets/classroom-app.js','./assets/digital-engine.js','./assets/digital-app.js','./assets/future-app.js','./assets/pattern-engine.js','./assets/growth-engine.js','./assets/team-engine.js','./assets/team-app.js','./assets/favicon.svg','./manifest.webmanifest','./grow-together/','./future-explorer/','./study-lab/','./smart-learning-studio/','./virtual-experiment-lab/','./teacher-kit/','./ai-digital-skills/','./teacher-kit/worksheets/fractions/','./teacher-kit/worksheets/circuits/','./privacy/','./for-parents/','./methodology/','./accessibility/','./hi/','./games/creative-studio/','./games/fix-the-machine/','./games/number-market/','./games/pattern-quest/','./games/perspective-explorer/','./games/shape-builder/','./games/story-detective/','./games/strategy-island/'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('aifs-discovery-')||k.startsWith('aifs-pattern-quest-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const allowed=new Set(FILES.map(file=>new URL(file,self.registration.scope).href));
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 const nav=req.mode==='navigate';
 const bare=new URL(url.href);if(nav){bare.search='';bare.hash='';}
 let key=nav?bare.href:url.href;
 if(nav&&!allowed.has(key)&&key.endsWith('/index.html'))key=key.slice(0,-'index.html'.length);
 if(!allowed.has(key))return;
 e.respondWith(caches.open(CACHE).then(cache=>cache.match(key)).then(response=>response||fetch(req)))
});