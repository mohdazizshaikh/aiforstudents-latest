import test from 'node:test';import assert from 'node:assert/strict';
import {SOURCE_CANDIDATES,PROTOTYPE_LINKS,DISCOVERY_CONCEPTS} from '../assets/curriculum-catalog-data.js';
import {curriculumCatalog,BOARDS,SUBJECTS} from '../assets/curriculum-catalog.js';
import {prototypeChoices,resolvePrototypeLaunch,PROTOTYPE_KEYS} from '../assets/extended-lab-catalog.js';
import {curriculumPlanningReport} from '../tools/curriculum-planning-workbench.mjs';
import {createIngestionBoundary,resourceFixture} from '../tools/resource-ingestion-boundary.mjs';
import {createWorkspace,workspaceAction,workspaceView} from '../assets/workspace-engine.js';
import {conceptSuggestion,createConceptSession} from '../assets/concept-pathways.js';
import {startPilotBackend} from '../tools/pilot-backend.mjs';
test('ENG-019 versioned 32 source candidates match existing board/grade/model/anchor provenance',()=>{
 const r=curriculumPlanningReport();assert.equal(SOURCE_CANDIDATES.length,32);
 assert.equal(new Set(SOURCE_CANDIDATES.map(x=>[x.board,x.grade,x.modelId].join('|'))).size,32);
 for(const x of SOURCE_CANDIDATES){const y=r.proposals.find(y=>y.board===x.board&&y.grade===x.grade&&y.modelId===x.modelId);assert.ok(y);assert.equal(x.source,y.source);assert.equal(x.anchor,y.sourceAnchor);assert.ok(x.edition.includes('unverified'))}
});
test('ENG-020 all 96 cells bilingual, twelve exact prototype links per board, earlier concept navigation',()=>{
 let n=0;for(const board of BOARDS)for(let grade=1;grade<=12;grade++)for(const subject of SUBJECTS){
 const e=curriculumCatalog({board,grade,subject}),h=curriculumCatalog({board,grade,subject,lang:'hi'});
 assert.equal(e.verifiedChapters,0);assert.equal(e.publicReleaseApproved,false);assert.ok(e.concept&&h.concept);assert.equal(e.sources.length,h.sources.length);
 assert.equal(e.relatedDrafts.length,DISCOVERY_CONCEPTS.find(x=>x.grade===grade&&x.subject===subject).modelIds.length);
 assert.ok(e.sources.every(x=>x.chapter===null&&x.status==='PENDING'&&x.rightsAuthenticated===false));
 if(grade===1)assert.equal(e.earlierLinks.length,0);else assert.ok(e.earlierLinks.length);
 n+=e.prototypes.length}
 assert.equal(n,24);assert.equal(PROTOTYPE_LINKS.length,12);
});
test('ENG-021 metadata-only synthetic stage/revoke, stale and caller approval denied',()=>{
 const s=createIngestionBoundary(),m=resourceFixture();
 for(const bad of [{...m,rights:'CLAIMED_REAL'},{...m,approved:true},{...m,version:'0'.repeat(64)},{...m,source:'https://example.com'}])assert.equal(s.apply({action:'stage',metadata:bad}).accepted,false);
 assert.equal(s.apply({action:'revoke',metadata:m}).accepted,false);
 assert.equal(s.apply({action:'stage',metadata:m}).accepted,true);
 assert.equal(s.apply({action:'revoke',metadata:m}).state,'SYNTHETIC_REVOKED');
 assert.equal(s.apply({action:'stage',metadata:m}).accepted,false);assert.equal(s.status().mayRedistribute,false);assert.equal(s.status().realApprovedCount,0);
});
test('All twelve prototypes exact local launch, teacher rehearsal without worksheet and optional adaptive sequence',()=>{
 for(const lang of ['en','hi'])for(const x of prototypeChoices(lang)){
 const u=new URL(x.href,'https://fixture.invalid/teacher-kit/');assert.deepEqual(resolvePrototypeLaunch(u.search,[x.id]),{id:x.id,lang});
 assert.equal(x.worksheetHref,null);let s=workspaceAction(createWorkspace('teacher'),{type:'add',key:x.key});s=workspaceAction(s,{type:'start'});
 assert.equal(workspaceView(s,lang).current.href,x.href);assert.equal(conceptSuggestion(createConceptSession(x.key),lang).target.href,x.href)}
 assert.equal(PROTOTYPE_KEYS.length,12);assert.equal(resolvePrototypeLaunch('?model=unknown&lang=en',['polygon-sides']),null);
 assert.equal(resolvePrototypeLaunch('?model=polygon-sides&lang=en&lang=hi',['polygon-sides']),null);
});
test('Authenticated local catalog and resource rehearsal endpoints, no actual resource rights',async()=>{
 const app=await startPilotBackend();try{const headers={Authorization:'Bearer '+app.token},get=p=>fetch(app.url+p,{headers});
 assert.equal((await (await get('/v1/prototype-catalog?lang=hi')).json()).items.length,12);
 assert.equal((await (await get('/v1/chapter-catalog?board=CBSE&grade=9&subject=maths')).json()).verifiedChapters,0);
 assert.equal((await get('/v1/chapter-catalog?board=CBSE&grade=99&subject=maths')).status,400);
 assert.equal((await fetch(app.url+'/v1/resource-rehearsal')).status,401);
 const r=await (await get('/v1/resource-rehearsal')).json();assert.equal(r.status.realApprovedCount,0);
 const put=(action,metadata)=>fetch(app.url+'/v1/resource-rehearsal',{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({action,metadata})});
 assert.equal((await put('stage',r.fixture)).status,200);assert.equal((await put('revoke',r.fixture)).status,200);assert.equal((await put('stage',r.fixture)).status,422);
 }finally{await app.close()}
});
