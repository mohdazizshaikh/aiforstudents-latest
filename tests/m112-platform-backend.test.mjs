import test from 'node:test';
import assert from 'node:assert/strict';
import {request} from 'node:http';
import {createPilotStore} from '../tools/pilot-store.mjs';
import {startPilotBackend} from '../tools/pilot-backend.mjs';
import {labPackKeys,teacherResourceChoices} from '../assets/teacher-cards-engine.js';
import {curriculumPlanningReport} from '../tools/curriculum-planning-workbench.mjs';

test('ENG-001 SQLite schema v1 and exact source-backed inventory',()=>{
 const s=createPilotStore();try{
  assert.equal(s.version(),1);assert.equal(s.catalog().total,109);
  assert.deepEqual(s.catalog().items.map(x=>x.key),labPackKeys().sort());
  assert.equal(s.catalog().publicReleaseApproved,false);
  assert.equal(s.catalog().storesStudentData,false);
 }finally{s.close()}
});
test('ENG-002 bilingual catalog filtering matches existing source across all filters',()=>{
 const s=createPilotStore();try{
  for(const lang of ['en','hi'])for(const subject of ['all','maths','physics','chemistry','biology'])for(const kind of ['all','basic','advanced','supplement']){
   const actual=s.catalog({subject,kind,lang}),expected=teacherResourceChoices(subject,kind,lang).map(({key,subject,kind,title})=>({key,subject,kind,title,humanReviewed:false,gradeVerified:false})).sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);
   assert.deepEqual(actual.items,expected);assert.equal(actual.total,expected.length);
  }
  for(const x of [{subject:'maths OR 1=1'},{kind:'unknown'},{lang:'xx'}])assert.throws(()=>s.catalog(x));
 }finally{s.close()}
});
test('ENG-003 all 96 curriculum planning cells match source, zero verification claims',()=>{
 const s=createPilotStore();try{
  const source=curriculumPlanningReport();assert.equal(source.cells.length,96);
  for(const c of source.cells){
   const r=s.curriculum(c);assert.deepEqual(r.mappingIds,c.mappingIds);assert.equal(r.pendingChecks,c.pendingChecks);assert.equal(r.proposalCount,c.proposalCount);assert.equal(r.status,c.status);assert.equal(r.verifiedChapters,0);assert.equal(r.humanApprovalAuthenticated,false);
  }
  assert.throws(()=>s.curriculum({board:'CBSE',grade:0,subject:'maths'}));
  assert.throws(()=>s.curriculum({board:'unknown',grade:6,subject:'maths'}));
 }finally{s.close()}
});
test('ENG-004 bounded ordered rehearsal, atomic rejection, no persistent or cross-instance data',()=>{
 const s=createPilotStore(),other=createPilotStore();try{
  const keys=labPackKeys().slice(0,6);assert.deepEqual(s.getPlan().items,[]);
  const result=s.setPlan({language:'hi',keys});assert.equal(result.language,'hi');assert.deepEqual(result.items,keys.map((key,i)=>({key,position:i+1})));
  assert.deepEqual(other.getPlan().items,[]);
  for(const x of [{language:'hi',keys:[keys[0],keys[0]]},{language:'hi',keys:[...keys,labPackKeys()[6]]},{language:'en',keys:['unknown:main']},{language:'xx',keys:[]},{language:'en',keys:[],name:'not accepted'}]){assert.throws(()=>s.setPlan(x));assert.deepEqual(s.getPlan(),result)}
  assert.deepEqual(s.setPlan({language:'en',keys:[...keys].reverse()}).items.map(x=>x.key),[...keys].reverse());
  assert.deepEqual(s.clearPlan().items,[]);assert.equal(s.getPlan().language,'en');
 }finally{s.close();other.close()}
});
test('ENG-005 actual loopback HTTP transport, authorization, filters, bounded JSON and default-deny routes',async()=>{
 const app=await startPilotBackend();try{
  const auth={Authorization:'Bearer '+app.token};
  const call=(route,options={})=>fetch(app.url+route,{...options,headers:{...auth,...options.headers}});
  const health=await call('/v1/health');assert.equal(health.status,200);assert.equal(health.headers.get('cache-control'),'no-store');assert.equal(health.headers.get('access-control-allow-origin'),null);
  assert.equal((await health.json()).generativeTutorEnabled,false);
  assert.equal((await fetch(app.url+'/v1/health')).status,401);
  assert.equal((await call('/v1/health',{headers:{Authorization:'Bearer '+'0'.repeat(64)}})).status,401);
  assert.equal((await call('/v1/health',{headers:{Origin:'https://example.invalid'}})).status,403);
  assert.equal((await call('/v1/health',{headers:{'Sec-Fetch-Site':'same-origin'}})).status,403);
  const wrongHost=await new Promise((resolve,reject)=>{const r=request(app.url+'/v1/health',{headers:{...auth,Host:'example.invalid'}},res=>{res.resume();resolve(res.statusCode)});r.on('error',reject);r.end()});
  assert.equal(wrongHost,403);
  const catalog=await (await call('/v1/catalog?subject=maths&lang=hi')).json();assert.ok(catalog.total>0);assert.ok(catalog.items.every(x=>x.subject==='maths'&&x.humanReviewed===false));
  assert.equal((await call('/v1/catalog?lang=en&lang=hi')).status,400);
  assert.equal((await call('/v1/catalog?q=private')).status,400);
  assert.equal((await call('/v1/curriculum?board=CBSE&grade=06&subject=maths')).status,400);
  assert.equal((await (await call('/v1/curriculum?board=CBSE&grade=6&subject=maths')).json()).verifiedChapters,0);
  assert.equal((await call('/v1/curriculum')).status,400);
  const keys=labPackKeys().slice(0,2),put=data=>call('/v1/plan',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const accepted=await put({language:'hi',keys});assert.equal(accepted.status,200);assert.deepEqual((await accepted.json()).items.map(x=>x.key),keys);
  assert.equal((await put({language:'hi',keys,student:'invalid'})).status,400);
  assert.equal((await call('/v1/plan',{method:'PUT',headers:{'Content-Type':'application/json'},body:'x'.repeat(4097)})).status,413);
  assert.equal((await call('/v1/plan',{method:'PUT',headers:{'Content-Type':'text/plain'},body:'{}'})).status,400);
  assert.equal((await call('/v1/plan',{method:'PUT',headers:{'Content-Type':'application/json'},body:'{x'})).status,400);
  assert.deepEqual((await (await call('/v1/plan')).json()).items.map(x=>x.key),keys);
  assert.deepEqual((await (await call('/v1/plan',{method:'DELETE'})).json()).items,[]);
  for(const route of ['/v1/chat','/v1/students','/v1/mastery','/tools/pilot-store.mjs'])assert.equal((await call(route)).status,404);
  assert.equal((await call('/v1/plan',{method:'POST'})).status,405);
 }finally{await app.close()}
});
