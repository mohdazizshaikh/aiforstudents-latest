import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GUIDED_TOPIC_IDS,practiceTopic,guidedHint,nextPracticeChoice,NEXT_PRACTICE_CHOICES} from '../assets/practice-engine.js';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
test('M38 all 16 advanced draft hints are exact bilingual source references, never remote or approved',()=>{
 for(const id of ADVANCED_IDS)for(const [lang,i] of [['en',0],['hi',1]]){
  const key='advanced:'+id,m=ADVANCED_MODELS[id],r=guidedHint(key,lang);
  assert.equal(r.text,m.hint[i]);assert.equal(r.source,'assets/advanced-lab-engine.js');assert.equal(r.contentId,key);assert.equal(r.allowRemoteChat,false);
  assert.equal(practiceTopic(key,lang).subject,m.subject.toLowerCase());
 }
 assert.equal(GUIDED_TOPIC_IDS.length,28);
});
test('M38 168 choice combinations are explicit, subject bounded, transient and never mastery predictions',()=>{
 for(const id of GUIDED_TOPIC_IDS)for(const choice of NEXT_PRACTICE_CHOICES)for(const lang of ['en','hi']){
  const x=nextPracticeChoice({id,choice,lang});
  assert.equal(practiceTopic(x.topicId,lang).subject,practiceTopic(id,lang).subject);
  assert.equal(x.usesHistory,false);assert.equal(x.persists,false);assert.equal(x.declinable,true);assert.equal(x.isMasteryPrediction,false);
  assert.equal(x.reviewStatus,'UNREVIEWED_ORIGINAL_DRAFT');
  if(choice==='different')assert.notEqual(x.topicId,id);else assert.equal(x.topicId,id);
  assert.match(x.href,/^(#|\?advanced=)/);
 }
});
test('M38 unknown and extra personal/profile fields rejected, reset clears transient choices',()=>{
 const valid={id:'advanced:quadratic',choice:'repeat',lang:'en'};
 for(const x of [null,{}, {...valid,id:'https://example.org'},{...valid,choice:'mastered'},{...valid,lang:'xx'},{...valid,score:99},{...valid,history:[]}])assert.throws(()=>nextPracticeChoice(x));
 assert.equal(nextPracticeChoice(valid).href,'?advanced=quadratic#advanced-labs');
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 assert.match(read('assets/advanced-lab-app.js'),/ADVANCED_IDS.includes\(selected\)/);
 assert.match(read('assets/practice-app.js'),/state.nextChoice=null/);
 assert.doesNotMatch(read('assets/practice-app.js'),/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});
