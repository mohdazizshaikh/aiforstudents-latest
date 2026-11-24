import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {printableLabActivity} from '../assets/teacher-cards-engine.js';
test('M50 each advanced model has a source-derived bilingual paper activity without solutions or learner records',()=>{
 for(const id of ADVANCED_IDS)for(const lang of ['en','hi']){
  const a=printableLabActivity(id,lang),m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  assert.equal(a.title,m.title[i]);assert.equal(a.prompt,m.prompt[i]);assert.equal(a.caveat,m.caveat[i]);assert.equal(a.steps.length,3);
  for(const key of ['humanReviewed','publicReleaseApproved','hasStudentNames'])assert.equal(a[key],false);
  assert.equal(a.localOnly,true);assert.equal(a.rightsStatus,'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED');
  for(const key of ['hint','target','initial','answer','teacherGuidance','score'])assert.ok(!Object.hasOwn(a,key));
 }
 for(const [id,lang] of [['unknown','en'],['dna-complement','xx'],['https://example.org','hi']])assert.throws(()=>printableLabActivity(id,lang));
});
test('M50 existing print route adds a bounded mode with no typed learner answers or persistence',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 const js=read('teacher-kit/cards/cards.js'),html=read('teacher-kit/cards/index.html'),css=read('teacher-kit/cards/cards.css');
 assert.match(html,/option value="lab"/);assert.match(html,/id="lab-activity" hidden/);
 assert.doesNotMatch(html,/<textarea|<input/);assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|innerHTML/);
 assert.match(css,/#lab-activity .assignment-page\{break-inside:avoid/);
});
