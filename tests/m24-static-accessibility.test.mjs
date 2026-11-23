import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {auditStaticAccessibility} from '../tools/audit-static-accessibility.mjs';

const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
test('M24 all 24 static HTML pages have one main landmark, skip destination, HTML lang and unique IDs',()=>{
 const r=auditStaticAccessibility();
 assert.equal(r.htmlPages,24);
 assert.deepEqual(r.problems,[]);
 assert.equal(r.structuralOnly,true);
 assert.match(r.approval,/No WCAG/);
});
test('M24 keyboard skip navigation exists in all 8 game guides and original builder',()=>{
 for(const slug of ['pattern-quest','number-market','story-detective','shape-builder','fix-the-machine','creative-studio','perspective-explorer','strategy-island']){
  const h=read('games/'+slug+'/index.html');
  assert.match(h,/<a class="skip" href="#content">Skip to main content<\/a>/);
  assert.match(h,/<main id="content" tabindex="-1" class="wrap">/);
  assert.match(h,/noindex,nofollow/);
 }
 const gen=read('tests/build_guides.py');
 assert.ok(gen.includes('id="content" tabindex="-1"'));
 assert.ok(gen.includes('class="skip"'));
 assert.ok(gen.includes('noindex,nofollow'));
});
test('M24 worksheets gain main landmark and skip navigation without exposing teacher notes in print',()=>{
 const css=read('assets/worksheet-print.css');
 assert.match(css,/\.skip:focus/);
 assert.match(css,/\.no-print,\.teacher-notes\{display:none!important/);
 for(const topic of ['fractions','circuits']){
  const h=read('teacher-kit/worksheets/'+topic+'/index.html');
  assert.match(h,/<a class="skip no-print" href="#content">/);
  assert.match(h,/<main id="content" tabindex="-1">/);
  assert.match(h,/<\/main><script type="module"/);
  assert.doesNotMatch(h,/<script(?![^>]*\bsrc=)[^>]*>/i);
 }
});
test('M24 audit rejects missing skip target, duplicated IDs, absent lang and missing image alt',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'aifs-m24-'));
 try{
  const h='<!doctype html><html><body><a class="skip" href="#missing">Skip</a><main id="same"><img src="x.svg"></main><footer id="same">Footer</footer></body></html>';
  writeFileSync(path.join(dir,'index.html'),h,'utf8');
  const r=auditStaticAccessibility(dir);
  assert.equal(r.htmlPages,1);
  assert.match(r.problems.join('\n'),/HTML lang/);
  assert.match(r.problems.join('\n'),/duplicate id same/);
  assert.match(r.problems.join('\n'),/skip link target missing/);
  assert.match(r.problems.join('\n'),/image without alt/);
 }finally{rmSync(dir,{force:true,recursive:true})}
});
test('M24 main practice skip section supports focus target in dynamic learner app',()=>{
 const html=read('index.html');
 assert.match(html,/<a class="skip" href="#practice"/);
 assert.match(html,/id="practice" tabindex="-1"/);
});
