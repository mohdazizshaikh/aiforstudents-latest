import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PROTOTYPE_KEYS,prototypeChoices} from '../assets/extended-lab-catalog.js';
import {prototypeWorksheet,prototypePack,parseWorksheetLaunch,PROTOTYPE_PACK_LIMIT} from '../assets/prototype-worksheet-engine.js';
import {workspaceAction,workspaceView,createWorkspace} from '../assets/workspace-engine.js';
test('16 original worksheets in both languages; model-specific three paper prompts, no keys or approval',()=>{
 const en=new Set(),hi=new Set();
 for(const k of PROTOTYPE_KEYS){const a=prototypeWorksheet(k),b=prototypeWorksheet(k,'hi');
 assert.notEqual(a.title,b.title);assert.equal(a.steps.length,3);assert.equal(b.steps.length,3);
 assert.ok(a.steps.every(x=>x.length>15));assert.ok(b.steps.every(x=>x.length>15));assert.match(b.steps.join(' '),/[\u0900-\u097f]/);
 for(const x of [a,b]){assert.equal(x.humanReviewed,false);assert.equal(x.publicReleaseApproved,false);assert.equal(x.rightsStatus,'PENDING_INDEPENDENT_REVIEW');assert.equal(x.storesStudentData,false);assert.equal(Object.hasOwn(x,'answers'),false)}
 en.add(a.steps.join('|'));hi.add(b.steps.join('|'))}
 assert.equal(en.size,16);assert.equal(hi.size,16);
});
test('Pack bounded, ordered, duplicate rejection and independent fresh copy',()=>{
 const keys=PROTOTYPE_KEYS.slice(0,PROTOTYPE_PACK_LIMIT),r=prototypePack({language:'hi',keys});
 assert.deepEqual(r.sheets.map(x=>x.key),keys);assert.equal(r.sheets.length,6);assert.equal(r.licensedForPublicDistribution,false);
 r.sheets[0].steps[0]='changed';assert.notEqual(prototypeWorksheet(keys[0],'hi').steps[0],'changed');
 for(const v of [{language:'en',keys:[]},{language:'en',keys:PROTOTYPE_KEYS.slice(0,7)},{language:'en',keys:[keys[0],keys[0]]},{language:'en',keys:['unknown']},{language:'xx',keys:[keys[0]]},{language:'en',keys:[keys[0]],student:'not allowed'}])assert.throws(()=>prototypePack(v));
});
test('All 32 exact local worksheet launches and teacher workflow',()=>{
 for(const lang of ['en','hi'])for(const x of prototypeChoices(lang)){
 const u=new URL(x.worksheetHref,'https://fixture.invalid/teacher-kit/');
 assert.equal(u.origin,'https://fixture.invalid');assert.equal(u.pathname,'/teacher-kit/');assert.equal(u.hash,'#prototype-pack');
 assert.deepEqual(parseWorksheetLaunch(u.search),{key:x.key,lang});
 let s=workspaceAction(createWorkspace('teacher'),{type:'add',key:x.key});s=workspaceAction(s,{type:'start'});
 assert.equal(workspaceView(s,lang).current.worksheetHref,x.worksheetHref);
 }
 for(const q of ['','?prototype=unknown&lang=en','?prototype=prototype:polygon-sides&lang=en&lang=hi','?prototype=prototype:polygon-sides&lang=en&student=x'])assert.equal(parseWorksheetLaunch(q),null);
});
test('Static worksheet print isolation and offline dependencies',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 const app=read('assets/prototype-worksheet-app.js'),css=read('assets/styles.css'),sw=read('service-worker.js');
 assert.doesNotMatch(app,/\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest)\b/);assert.match(app,/aifs-history-cleared/);
 assert.match(css,/body\.prototype-pack-print #prototype-pack/);assert.match(css,/body\.prototype-pack-print #pp-controls/);
 assert.match(sw,/prototype-worksheet-engine\.js/);assert.match(sw,/prototype-worksheet-app\.js/);
});
