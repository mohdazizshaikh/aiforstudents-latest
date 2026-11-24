import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inferenceEnvelope} from '../tools/inference-envelope.mjs';
import {updateLessonQueue,validateLessonQueue,teacherFlow,draftAssignmentPack} from '../assets/teacher-cards-engine.js';
import {CLASSROOM_IDS,CLASSROOM_LESSONS} from '../assets/classroom-engine.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const sample={currency:'INR',requestsPerDay:100,days:20,inputTokensPerRequest:500,outputTokensPerRequest:200,
 inputRatePerMillion:100,outputRatePerMillion:200,reservePercent:20,otherCosts:50,budgetLimit:300,timeoutMs:5000};
test('M34 hypothetical budget requires explicit currency/rates/limits and never enables AI or selects provider',()=>{
 const r=inferenceEnvelope(sample);assert.equal(r.requests,2000);assert.equal(r.inputTokens,1000000);assert.equal(r.outputTokens,400000);
 assert.equal(r.inferenceCost,180);assert.equal(r.worstCaseEstimate,266);
 assert.equal(r.overBudget,false);assert.equal(inferenceEnvelope({...sample,budgetLimit:265}).overBudget,true);
 for(const key of ['callsPerformed','providerSelected','networkEnabled','tutorEnabled','humanApproved','publicReleaseApproved'])
  assert.equal(r[key],key==='callsPerformed'?0:false);
 for(const change of [{currency:'unknown'},{inputRatePerMillion:-1},{outputRatePerMillion:NaN},{days:0},{requestsPerDay:1.5},{budgetLimit:-1},{timeoutMs:0},{reservePercent:501}])assert.throws(()=>inferenceEnvelope({...sample,...change}));
 const noRate={...sample};delete noRate.inputRatePerMillion;assert.throws(()=>inferenceEnvelope(noRate));
 assert.equal(inferenceEnvelope({...sample,requestsPerDay:0,otherCosts:0}).worstCaseEstimate,0)
});
test('M34 AI design is default-off, source-reviewed only after approval, no hidden provider or inference dependency',()=>{
 const d=read('docs/B2_AI_TUTOR_RISK_BUDGET.md');
 for(const x of ['no endpoint','no prompt retention','FP-068/069/070','operator-supplied','not a bill','no provider','No new paid dependency'])assert.ok(d.toLowerCase().includes(x.toLowerCase()),x);
 assert.doesNotMatch(read('tools/inference-envelope.mjs'),/\bfetch\s*\(|XMLHttpRequest|api\.openai\.com|process\.env/);
 const pkg=JSON.parse(read('package.json'));assert.deepEqual(pkg.dependencies??{},{});
 assert.match(d,/public\/child access OFF/);
});
test('M34 adaptive validation protocol and classroom view do not infer mastery or identify pupils',()=>{
 const d=read('docs/B2_ADAPTIVE_SESSION_CONTRACT.md');
 for(const x of ['three independent equivalent tasks','two occasions','pre/post/delayed','FP-080','Group response metrics are **disabled**','no small-cell reporting','not identify a child','backups','cannot be remotely deleted'])
  assert.ok(d.includes(x),x);
 const flow=teacherFlow(['fractions'],'fractions',2);
 assert.deepEqual(flow,{queued:1,currentStep:3,steps:5,individualResultsEnabled:false,attendanceEnabled:false,groupResponseMetricsEnabled:false,profileCreated:false,stored:false,approved:false});
 assert.throws(()=>teacherFlow(['fractions'],'circuits',100))
});
test('M34 local teacher organizer supports add, duplicate prevention, reorder, remove and clear with only known IDs',()=>{
 const first=updateLessonQueue([],'add','fractions');assert.deepEqual(first,['fractions']);
 assert.deepEqual(updateLessonQueue(first,'add','fractions'),first);
 const next=updateLessonQueue(first,'add','circuits');assert.deepEqual(next,['fractions','circuits']);assert.deepEqual(first,['fractions']);
 const swapped=updateLessonQueue(next,'up','circuits');assert.deepEqual(swapped,['circuits','fractions']);
 assert.deepEqual(updateLessonQueue(swapped,'down','circuits'),next);
 assert.deepEqual(updateLessonQueue(next,'remove','fractions'),['circuits']);assert.deepEqual(updateLessonQueue(next,'clear'),[]);
 for(const bad of [null,['fractions','fractions'],['real child'],[{name:'learner'}]])assert.throws(()=>validateLessonQueue(bad));
 assert.throws(()=>updateLessonQueue([],'add','unreviewed-external-id'));assert.throws(()=>updateLessonQueue([],'upload','fractions'));
});
test('M34 learner-only draft assignment packs expose only original source prompts, no answers, tracking, identity or rights approval',()=>{
 for(const id of CLASSROOM_IDS)for(const lang of ['en','hi']){
  const p=draftAssignmentPack(id,lang);
  assert.equal(p.reviewStatus,'PENDING');assert.equal(p.rightsStatus,'NOT_VERIFIED_FOR_PUBLIC_DISTRIBUTION');
  assert.equal(p.cards.length,5);assert.equal(p.localOnly,true);
  for(let i=0;i<p.cards.length;i++){
   const c=p.cards[i];assert.deepEqual(Object.keys(c),['lesson','stage','question','action']);
   assert.equal(c.question,CLASSROOM_LESSONS[id].steps[i].prompt[lang]);assert.equal(c.action,CLASSROOM_LESSONS[id].steps[i].action[lang])
  }
 }
 const html=read('teacher-kit/cards/index.html'),css=read('teacher-kit/cards/cards.css'),js=read('teacher-kit/cards/cards.js');
 assert.match(html,/id="card-pack-mode"/);assert.match(html,/id="learner-pack"/);assert.match(css,/#teacher-guidance\{display:none!important\}/);
 assert.match(js,/draftAssignmentPack/);assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(/);
});
test('M34 ethical observer template is blank, constrained and requires real external permissions',()=>{
 const x=JSON.parse(read('docs/B2_ETHICAL_OBSERVER_TEMPLATE.json'));
 assert.match(x.status,/BLOCKED_UNTIL_AUTHORIZED/);assert.equal(x.childDataCollected,false);assert.equal(x.publicReleaseApproved,false);
 assert.ok(x.fields.every(f=>['enum','boolean'].includes(f.type)));assert.ok(x.prohibited.includes('individual scores'));assert.ok(x.prohibited.includes('student names'));
 assert.doesNotMatch(JSON.stringify(x.fields),/studentId|email|address|score|freeText/i);
});
test('M34 explicit opt-in is checked before persistent write; peer opt-out does not clear other tab activity',()=>{
 const s=read('assets/app.js');
 assert.match(s,/function store\(explicitEnable=false\)/);
 assert.match(s,/ST\.remember&&!explicitEnable&&read\(persistent,KEY\)\?\.optIn!==true/);
 assert.match(s,/ST\.history=mergeHistory\(ST\.history,read\(s,SESSION_KEY\)\);store\(true\)/);
 assert.match(s,/event\.key===KEY&&event\.newValue===null&&ST\.remember/);
 const segment=s.slice(s.indexOf("if(event.key===KEY&&event.newValue===null&&ST.remember)"),s.indexOf("$('save-reflection').addEventListener"));
 assert.doesNotMatch(segment,/clearAllHistory\(/);
 assert.match(read('assets/classroom-app.js'),/S\.projector=false;S\.queue=\[\]/);
});
