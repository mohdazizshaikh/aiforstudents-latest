import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {workspaceChoices,createWorkspace,workspaceAction,workspaceView,WORKSPACE_LIMIT} from '../assets/workspace-engine.js';
import {labPackKeys,worksheetReturnLaunch,activityWorksheet} from '../assets/teacher-cards-engine.js';
const act=(s,type,key)=>workspaceAction(s,key===undefined?{type}:{type,key});
const select=(role,keys)=>keys.reduce((s,key)=>act(s,'add',key),createWorkspace(role));
test('ENG-031 learner dashboard links exact module anchors in both languages',()=>{
 const root=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 for(const lang of ['en','hi']){
  const all=workspaceChoices('learner',lang),items=all.filter(x=>!x.kind);assert.equal(items.length,11);assert.equal(all.length,136);assert.equal(new Set(all.map(x=>x.key)).size,136);
  for(const x of items){const u=new URL(x.href,'https://fixture.invalid/study-lab/');assert.equal(u.origin,'https://fixture.invalid');assert.equal(u.pathname,'/');assert.equal(u.searchParams.get('lang'),lang);assert.ok(root.includes('id="'+u.hash.slice(1)+'"'));assert.equal(x.storesStudentData,false)}
 }
});
test('ENG-032 session plan bounded order, start, visit, skip, finish, reset',()=>{
 const keys=workspaceChoices('learner').map(x=>x.key),s=select('learner',keys);assert.equal(s.keys.length,WORKSPACE_LIMIT);
 assert.deepEqual(act(s,'add',keys[0]),s);const moved=act(s,'up',keys[1]);assert.equal(moved.keys[0],keys[1]);
 const removed=act(moved,'remove',keys[1]);assert.equal(removed.keys.length,5);
 let run=act(removed,'start');assert.throws(()=>act(run,'add',keys[1]));assert.throws(()=>act(run,'pause'));run=act(run,'skip');run=act(run,'visited');
 while(run.phase==='running')run=act(run,'visited');
 assert.equal(run.phase,'finished');assert.throws(()=>act(run,'visited'));assert.deepEqual(act(run,'clear'),createWorkspace('learner'));assert.equal(s.cursor,0);
});
test('ENG-033 explicit session summary only; skipped and visited separated; no score, no stored history',()=>{
 let s=act(select('learner',['games','science','digital']),'start');s=act(s,'visited');s=act(s,'skip');
 const en=workspaceView(s),hi=workspaceView(s,'hi');assert.deepEqual(en.summary,{planned:3,visited:1,skipped:1,remaining:1});assert.deepEqual(en.summary,hi.summary);
 assert.deepEqual(en.items.map(x=>x.status),['visited','skipped','current']);assert.equal(en.current.key,'digital');assert.notEqual(en.current.title,hi.current.title);assert.equal(en.storesStudentData,false);assert.equal(en.publicReleaseApproved,false);
});
test('ENG-034 teacher workspace exact 109 resources, bilingual local model and worksheet routes',()=>{
 for(const lang of ['en','hi']){
  const choices=workspaceChoices('teacher',lang);assert.equal(choices.length,125);assert.deepEqual(choices.filter(x=>x.kind!=='prototype').map(x=>x.key).sort(),labPackKeys().sort());
  for(const x of choices.filter(x=>x.kind!=='prototype')){assert.equal(x.href,'../'+worksheetReturnLaunch(x.key,lang).href);assert.equal(x.worksheetHref,'../'+activityWorksheet(x.key,lang).href);assert.equal(x.humanReviewed,false)}
 }
 assert.throws(()=>act(createWorkspace('teacher'),'add','games'));assert.deepEqual(act(createWorkspace('learner'),'add','ratio-algebra:equation').keys,['ratio-algebra:equation']);assert.throws(()=>workspaceChoices('teacher','xx'));
});
test('ENG-035 teacher lesson flow pause/resume/advance/reset; independent transient workspaces',()=>{
 const keys=['maths/rectangle:main','ratio-algebra:equation','studio/circuit-path:main'];let s=act(select('teacher',keys),'start');
 assert.equal(workspaceView(s).current.key,keys[0]);s=act(s,'pause');assert.equal(s.phase,'paused');assert.throws(()=>act(s,'next'));s=act(s,'resume');s=act(s,'next');assert.equal(workspaceView(s).current.key,keys[1]);assert.throws(()=>act(s,'skip'));s=act(act(s,'next'),'next');assert.equal(s.phase,'finished');assert.deepEqual(act(s,'clear'),createWorkspace('teacher'));assert.deepEqual(createWorkspace('teacher').keys,[]);
 for(const a of [{type:'start',name:'forbidden'},{type:'add',key:'unknown'},{type:'__proto__'}])assert.throws(()=>workspaceAction(createWorkspace('teacher'),a));
});
test('M113 static workspace sources have no storage or remote transport and integrate precache',()=>{
 const app=readFileSync(new URL('../assets/workspace-app.js',import.meta.url),'utf8'),engine=readFileSync(new URL('../assets/workspace-engine.js',import.meta.url),'utf8'),sw=readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
 assert.doesNotMatch(app+engine,/\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest)\b/);
 assert.match(app,/aifs-history-cleared/);assert.match(app,/aifs-discovery-privacy-reset-v1/);assert.match(sw,/workspace-engine\.js/);assert.match(sw,/workspace-app\.js/);
});
