import test from 'node:test';
import assert from 'node:assert/strict';
import {labPackKeys,activityWorksheet,resolveActivityWorksheet,worksheetReturnLaunch,teacherActivityLaunch,mainModelWorksheet,printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
const keys=labPackKeys();
for(const key of keys)test('M93 bilingual worksheet round trip '+key,()=>{
 const [id,mode]=key.split(':');
 for(const lang of ['en','hi']){
  const a=activityWorksheet(key,lang),source=printableAnyLabActivity(id,mode,lang);
  assert.equal(a.title,source.title);assert.equal(a.subject,source.subject);assert.equal(a.mode,mode);assert.equal(a.key,key);
  const u=new URL(a.href,'https://fixture.invalid/');assert.equal(u.pathname,'/teacher-kit/cards/');
  assert.deepEqual(resolveActivityWorksheet(u.search),a);assert.equal(a.storesStudentData,false);assert.equal(a.publicReleaseApproved,false);
  if(mode==='main')assert.equal(a.href,mainModelWorksheet(id,lang).href);
  else assert.equal(u.searchParams.get('extension'),mode);
  const back=worksheetReturnLaunch(key,lang),legacy=teacherActivityLaunch(key,lang);
  const b=new URL(back.href,'https://fixture.invalid/');assert.equal(b.searchParams.get('lang'),lang);assert.equal(b.origin,'https://fixture.invalid');assert.equal(b.pathname,'/');b.searchParams.delete('lang');
  const l=new URL(legacy.href,'https://fixture.invalid/');assert.deepEqual([...b.searchParams],[...l.searchParams]);assert.equal(b.hash,l.hash);assert.equal(back.storesStudentData,false);
 }
});
test('M93 inventory, unique routes and invalid selectors',()=>{
 assert.equal(keys.length,109);assert.equal(keys.filter(k=>!k.endsWith(':main')).length,49);
 assert.equal(new Set(keys.map(k=>activityWorksheet(k).href)).size,109);
 for(const q of ['?worksheet=ratio-algebra&extension=main&language=en','?worksheet=ratio-algebra&extension=unknown&language=en','?worksheet=maths%2Frectangle&extension=equation&language=en','?worksheet=ratio-algebra&extension=equation&language=en&student=mock','?worksheet=ratio-algebra&extension=equation&extension=ratio&language=en','?worksheet=ratio-algebra&extension=equation&language=xx'])assert.equal(resolveActivityWorksheet(q),null);
 assert.throws(()=>worksheetReturnLaunch('unknown:main'));assert.throws(()=>activityWorksheet('ratio-algebra:equation','xx'));
});
