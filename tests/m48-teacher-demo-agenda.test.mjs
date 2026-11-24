import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {teacherDemoAgenda,teacherAgendaRows,DEMO_AGENDA_LIMIT} from '../assets/teacher-cards-engine.js';
test('M48 bounded agenda adds, removes, reorders, clears and never mutates input',()=>{
 const original=Object.freeze(ADVANCED_IDS.slice(0,2)),id=ADVANCED_IDS[2];
 const q=teacherDemoAgenda(original,{type:'add',id});assert.deepEqual(q,[...original,id]);
 assert.deepEqual(teacherDemoAgenda(q,{type:'add',id}),q);
 assert.deepEqual(teacherDemoAgenda(q,{type:'up',id}),[q[0],id,q[1]]);
 assert.deepEqual(teacherDemoAgenda(q,{type:'down',id:q[0]}),[q[1],q[0],id]);
 assert.deepEqual(teacherDemoAgenda(q,{type:'remove',id}),[...original]);
 assert.deepEqual(teacherDemoAgenda(q,{type:'clear'}),[]);
 const full=ADVANCED_IDS.slice(0,DEMO_AGENDA_LIMIT);assert.deepEqual(teacherDemoAgenda(full,{type:'add',id:ADVANCED_IDS[DEMO_AGENDA_LIMIT]}),full);
 assert.equal(original.length,2);
});
test('M48 source-bound bilingual rows for all advanced models, no approval or personal data',()=>{
 for(const lang of ['en','hi'])for(const id of ADVANCED_IDS){
  const [r]=teacherAgendaRows([id],lang),m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  assert.equal(r.title,m.title[i]);assert.equal(r.prompt,m.prompt[i]);assert.equal(r.hint,m.hint[i]);assert.equal(r.caveat,m.caveat[i]);assert.equal(r.position,1);
  assert.equal(r.href,'?advanced='+id+'#advanced-labs');assert.equal(r.storesStudentData,false);assert.equal(r.publicReleaseApproved,false);assert.equal(r.humanReviewed,false);
 }
});
test('M48 rejects injected ids and extra fields, retains only transient state',()=>{
 for(const [q,a] of [[['unknown'],{type:'clear'}],[[ADVANCED_IDS[0],ADVANCED_IDS[0]],{type:'clear'}],[ADVANCED_IDS.slice(0,9),{type:'clear'}],[[],{type:'add',id:'https://example.org'}],[[],{type:'clear',student:'test'}],[[],{type:'add',id:ADVANCED_IDS[0],notes:'test'}],[[],{type:'other'}]])assert.throws(()=>teacherDemoAgenda(q,a));
 assert.throws(()=>teacherAgendaRows([],'xx'));
 const app=readFileSync(new URL('../assets/classroom-app.js',import.meta.url),'utf8');assert.match(app,/S.agenda=\[\]/);assert.doesNotMatch(app,/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});

test('M48 normal agenda launch uses only a fixed model ID and existing transient lab reset',()=>{
 const app=readFileSync(new URL('../assets/classroom-app.js',import.meta.url),'utf8'),lab=readFileSync(new URL('../assets/advanced-lab-app.js',import.meta.url),'utf8');
 assert.match(app,/new CustomEvent\('aifs-teacher-demo',\{detail:r.id\}\)/);assert.match(lab,/if\(!ADVANCED_IDS.includes\(event.detail\)\)return;id=event.detail;reset\(\)/);
});
