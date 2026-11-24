import test from 'node:test';
import assert from 'node:assert/strict';
import {pathwayChoices,pathwaySource,pathwayNext,PATHWAY_ACTIONS} from '../assets/practice-pathways.js';
import {TEACHER_LAB_SUBJECTS,labPackKeys,printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
import {advancedExtension} from '../assets/advanced-lab-engine.js';
import {guidedHint} from '../assets/practice-engine.js';
test('M78 source prompts, hints, cautions and exact links for all 109 activities in both languages',()=>{
 let count=0;
 for(const lang of ['en','hi'])for(const subject of TEACHER_LAB_SUBJECTS)for(const choice of pathwayChoices(subject,'all',lang)){
  const {key,id,mode}=choice,x=pathwaySource({key,lang,risk:'none'}),a=printableAnyLabActivity(id,mode,lang);
  assert.equal(x.kind,'draft-source');assert.equal(x.title,a.title);assert.equal(x.prompt,a.prompt);assert.equal(x.caveat,a.caveat);assert.equal(x.source,a.sourceFile);
  assert.equal(x.hint,mode==='main'?guidedHint(x.contentId,lang).text:advancedExtension(id,mode).hint[lang==='hi'?1:0]);
  assert.ok(x.hint);assert.equal(x.allowRemoteChat,false);assert.equal(x.usesHistory,false);assert.equal(x.isMasteryPrediction,false);assert.equal(x.persists,false);
  if(mode!=='main')assert.equal(x.href,'?advanced='+id+'&extension='+mode+'#advanced-labs');
  else if(id.includes('/'))assert.ok(x.href.startsWith('?demo='+encodeURIComponent(id)+'#'));
  else assert.equal(x.href,'?advanced='+id+'#advanced-labs');count++;
 }
 assert.equal(count,218);
});
test('M78 bounded user-selected actions remain in the same subject/type, never infer mastery',()=>{
 let count=0;
 for(const lang of ['en','hi'])for(const subject of TEACHER_LAB_SUBJECTS)for(const kind of ['all','basic','advanced','supplement']){
  const choices=pathwayChoices(subject,kind,lang);
  for(const c of choices)for(const action of PATHWAY_ACTIONS){
   const x=pathwayNext({key:c.key,action,kind,lang});assert.ok(choices.some(y=>y.key===x.key));
   if(action!=='different')assert.equal(x.key,c.key);
   if(action==='different'&&choices.length>1)assert.notEqual(x.key,c.key);
   assert.equal(x.declinable,true);assert.equal(x.usesHistory,false);assert.equal(x.persists,false);assert.equal(x.isMasteryPrediction,false);count++;
  }
 }
 assert.equal(count,1308);
});
test('M78 sensitive and unknown choices fail closed and reject personal data fields',()=>{
 for(const lang of ['en','hi']){
  const x=pathwaySource({key:labPackKeys()[0],lang,risk:'sensitive'});assert.equal(x.kind,'adult-guidance');assert.equal(x.source,null);assert.equal(Object.hasOwn(x,'href'),false);
  const u=pathwaySource({key:'unknown',lang,risk:'none'});assert.equal(u.kind,'unknown');assert.equal(u.source,null);
 }
 assert.throws(()=>pathwaySource({key:'x',lang:'en',risk:'none',student:'fake'}));
 assert.throws(()=>pathwayNext({key:'ratio-algebra:equation',action:'repeat',kind:'basic',lang:'en'}));
 assert.throws(()=>pathwayNext({key:'fake',action:'different',kind:'all',lang:'en'}));
});
