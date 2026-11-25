import test from 'node:test';import assert from 'node:assert/strict';
import {exploreActivities,EXPLORER_SUBJECTS,EXPLORER_KINDS,EXPLORER_PAGE_SIZE} from '../assets/activity-explorer-engine.js';
import {workspaceChoices} from '../assets/workspace-engine.js';
import {readFileSync} from 'node:fs';
test('50 bilingual subject/type combinations cover exact source catalog without omissions or duplicates',()=>{
 for(const language of ['en','hi'])for(const subject of EXPLORER_SUBJECTS)for(const kind of EXPLORER_KINDS){
  const expected=workspaceChoices('teacher',language).filter(x=>(subject==='all'||x.subject===subject)&&(kind==='all'||x.kind===kind)),first=exploreActivities({language,subject,kind}),items=[];
  assert.equal(first.total,expected.length);assert.equal(first.catalogTotal,workspaceChoices('teacher',language).length);
  for(let page=1;page<=first.pages;page++){const r=exploreActivities({language,subject,kind,page});assert.ok(r.items.length<=EXPLORER_PAGE_SIZE);items.push(...r.items)}
  assert.deepEqual(items.map(x=>x.key),expected.map(x=>x.key));assert.equal(new Set(items.map(x=>x.key)).size,items.length);
  for(const x of items){const e=expected.find(y=>y.key===x.key);assert.equal(x.href,e.href);assert.equal(x.worksheetHref,e.worksheetHref);assert.equal(x.title,e.title);assert.equal(x.gradeVerified,false);assert.equal(x.publicReleaseApproved,false)}
 }
});
test('Invalid filters rejected and empty or excessive page handled safely',()=>{
 for(const q of [{language:'xx'},{subject:'unknown'},{kind:'unknown'},{page:0},{page:1.2},{page:'2'}])assert.throws(()=>exploreActivities(q));
 const r=exploreActivities({page:999});assert.equal(r.page,r.pages);assert.ok(r.items.length>0);
});
test('Native labels, offline cache, memory-only filters and ordinary print isolation',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),html=read('study-lab/index.html'),app=read('assets/activity-explorer-app.js');
 for(const id of ['ae-lang','ae-subject','ae-kind']){assert.ok(html.includes('for="'+id+'"'));assert.ok(html.includes('id="'+id+'"'))}
 assert.match(app,/aifs-history-cleared/);assert.doesNotMatch(app,/\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest)\b/);assert.match(read('service-worker.js'),/activity-explorer-app\.js/);assert.match(read('assets/styles.css'),/@media print\{#activity-explorer\{display:none/);
});
