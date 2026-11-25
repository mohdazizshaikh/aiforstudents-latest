import test from 'node:test';import assert from 'node:assert/strict';
import {workspaceChoices,workspaceAction,workspaceView,createWorkspace,WORKSPACE_LIMIT} from '../assets/workspace-engine.js';
test('All 125 exact activities available in learner plans alongside eleven module links',()=>{
 for(const lang of ['en','hi']){
  const learner=workspaceChoices('learner',lang),teacher=workspaceChoices('teacher',lang);
  assert.equal(learner.length,11+teacher.length);assert.deepEqual(learner.filter(x=>x.kind),teacher);
  for(const item of teacher){let s=workspaceAction(createWorkspace('learner'),{type:'add',key:item.key});s=workspaceAction(s,{type:'start'});const x=workspaceView(s,lang).current;assert.equal(x.href,item.href);assert.equal(x.worksheetHref,item.worksheetHref);assert.equal(x.publicReleaseApproved,false)}
 }
});
test('Mixed plan caps, duplicate protection, optional visits and no stored learner records',()=>{
 const keys=['games','prototype:velocity-graph','ratio-algebra:equation','science','prototype:matrix-transform','digital','prototype:particle-mixing'];
 let s=createWorkspace('learner');for(const key of keys)s=workspaceAction(s,{type:'add',key});
 assert.equal(s.keys.length,WORKSPACE_LIMIT);assert.deepEqual(s.keys,keys.slice(0,6));
 assert.deepEqual(workspaceAction(s,{type:'add',key:keys[1]}),s);assert.throws(()=>workspaceAction(s,{type:'add',key:'unknown'}));
 s=workspaceAction(s,{type:'start'});assert.throws(()=>workspaceAction(s,{type:'add',key:keys[6]}));s=workspaceAction(s,{type:'skip'});s=workspaceAction(s,{type:'visited'});const v=workspaceView(s,'hi');assert.equal(v.summary.skipped,1);assert.equal(v.summary.visited,1);assert.equal(v.storesStudentData,false);
 assert.deepEqual(workspaceAction(s,{type:'clear'}),createWorkspace('learner'));
});
