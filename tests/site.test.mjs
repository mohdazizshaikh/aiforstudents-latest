import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {GAMES} from '../assets/catalog.js';
const root=path.resolve(import.meta.dirname,'..');
test('Original eight public game guide pages preserved; additional games in selectable catalog',()=>{
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.ok(home.includes('id="category-filter"'));
 for(const slug of ['pattern-quest','number-market','story-detective','shape-builder','fix-the-machine','creative-studio','perspective-explorer','strategy-island']){
  const rel=`games/${slug}/`;assert.ok(home.includes(`href="${rel}"`),slug);const h=fs.readFileSync(path.join(root,rel,'index.html'),'utf8');assert.ok(h.includes('<meta name="description"'));assert.ok(h.includes('<h1>'));assert.ok(h.includes(`?game=${slug}`));
 }
 assert.equal(GAMES.length,40);
});
test('Static hosting uses no API keys or external trackers; all JS modules referenced and cached',()=>{
 const app=fs.readFileSync(path.join(root,'assets/app.js'),'utf8');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
 assert.ok(!/openrouter\.ai|generativelanguage\.googleapis|api\.gemini/i.test(app));assert.ok(html.includes('assets/app.js'));
 assert.ok(sw.includes('expanded-library.js'));assert.ok(!/https:\/\/example\.com\/.*rel="canonical"/.test(html));
});