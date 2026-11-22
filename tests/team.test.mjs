import test from 'node:test';
import assert from 'node:assert/strict';
import {TEAM_MODES,TEAM_AGES,getTeamBank,pickTeamMissions,gradeRole,makeTeamResult} from '../assets/team-engine.js';
import {emptyHistory,normalizeHistory,recordTeamSession,teamSummary,getAchievements,mergeHistory} from '../assets/growth-engine.js';
const day='2026-11-23';
const buildSession=(mode,age,items,id='test-one')=>({id,mode,ageBand:age,day,completedAt:'2026-11-23T09:30:00.000Z',replay:false,...makeTeamResult(items,items.map(m=>({id:m.id,p1:m.p1.answer,p2:m.p2.answer,joint:m.joint.answer})))});
test('Three co-op modes work for all four age bands with 20 unique missions each',()=>{
 assert.equal(TEAM_MODES.length,3);
 for(const mode of TEAM_MODES)for(const age of TEAM_AGES){const bank=getTeamBank(mode.id,age);
  assert.equal(bank.length,20);assert.equal(new Set(bank.map(m=>m.id)).size,20);
  for(const mission of bank){assert.equal(mission.ageBand,age);assert.equal(mission.mode,mode.id);for(const role of ['p1','p2','joint']){
   const card=mission[role];assert.ok(card.en.length>15&&card.hi.length>10,mission.id);
   assert.equal(new Set(card.options).size,4);assert.ok(card.options.includes(card.answer));
   assert.equal(gradeRole(mission,role,card.answer),true);
   assert.equal(gradeRole(mission,role,card.options.find(v=>v!==card.answer)),false);
   if(card.optionsHi){assert.equal(card.optionsHi.length,card.options.length);assert.ok(card.optionsHi.every(x=>x.length>0));}
  }
  }
 }
});
test('Answer location varies rather than always first',()=>{
 for(const mode of TEAM_MODES){const positions=new Set(getTeamBank(mode.id,'11-14').map(m=>m.joint.options.indexOf(m.joint.answer)));
  assert.ok(positions.size>2,`${mode.id}: answer location predictable`);
 }
});
test('Fresh missions rotate without repeat and exhaust after seven rounds',()=>{
 for(const mode of TEAM_MODES)for(const age of TEAM_AGES){let seen=[];let count=0;for(let i=0;i<7;i++){
  const selection=pickTeamMissions(mode.id,age,seen,3,()=>0.25);const ids=selection.items.map(x=>x.id);
  assert.ok(ids.every(x=>!seen.includes(x)));seen.push(...ids);count+=ids.length;
  assert.equal(selection.exhausted,false);
 }
 assert.equal(count,20);assert.equal(new Set(seen).size,20);
 const replay=pickTeamMissions(mode.id,age,seen,3,()=>0.25);assert.equal(replay.exhausted,true);assert.equal(replay.items.length,3);
 }
});
test('Both role choices and the joint choice are required to finish',()=>{
 const missions=getTeamBank('number-bridge','11-14').slice(0,3);
 const records=missions.map(m=>({id:m.id,p1:m.p1.answer,p2:m.p2.answer,joint:m.joint.answer}));
 const good=makeTeamResult(missions,records);assert.deepEqual(good.roleActions,{p1:3,p2:3});assert.equal(good.solved,3);
 assert.throws(()=>makeTeamResult(missions,records.map(x=>({...x,p2:''}))));
 assert.throws(()=>makeTeamResult(missions,records.slice(0,2)));
 assert.throws(()=>gradeRole(missions[0],'joint','injected value'));
});
test('A wrong clue is not incorrectly counted as an individual aptitude score',()=>{
 const missions=getTeamBank('pattern-partners','11-14').slice(0,3);
 const records=missions.map(m=>({id:m.id,p1:m.p1.options.find(x=>x!==m.p1.answer),p2:m.p2.answer,joint:m.joint.answer}));
 const result=makeTeamResult(missions,records);assert.equal(result.solved,3);assert.deepEqual(result.roleActions,{p1:3,p2:3});
});
test('Co-op history is validated, idempotent, mergeable and independently summarized',()=>{
 const missions=getTeamBank('story-signals','11-14').slice(0,3);
 const entry=buildSession('story-signals','11-14',missions);
 let h=recordTeamSession(emptyHistory(),entry);h=recordTeamSession(h,entry);assert.equal(h.teamSessions.length,1);
 assert.deepEqual(teamSummary(h,'11-14'),{rounds:1,missions:3,solved:3});
 assert.equal(mergeHistory(h,h).teamSessions.length,1);
 assert.equal(normalizeHistory({teamSessions:[{...entry,solved:99}]}).teamSessions.length,0);
 assert.throws(()=>recordTeamSession(h,{...entry,roleActions:{p1:3,p2:0}}));
});
test('Team achievements only arise from completed recorded sessions',()=>{
 assert.equal(getAchievements(emptyHistory(),day).length,0);
 const bank=getTeamBank('number-bridge','11-14');const h=recordTeamSession(emptyHistory(),buildSession('number-bridge','11-14',bank.slice(0,2)));
 assert.ok(getAchievements(h,day).some(a=>a.title==='Team Adventure Complete'));
 assert.ok(getAchievements(h,day).some(a=>a.title==='We Solved It Together'));
 assert.ok(!getAchievements(h,'2026-11-24').some(a=>a.title==='We Solved It Together'));
});