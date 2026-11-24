/** M31 structural English/Hindi coverage across all learner-facing draft modules.
 * Presence/shape only: not a translation-quality, NCERT/copyright or educator approval.
 */
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {auditContent} from './content-quality.mjs';
import {LAB_TOPICS,ALL_LAB_LESSONS} from '../assets/lab-engine.js';
import {STUDIO_IDS,STUDIO_LESSONS} from '../assets/studio-engine.js';
import {EXPERIMENT_IDS,EXPERIMENTS,WORKSHOP_MODES,WORKSHOP_CONTENT} from '../assets/experiment-engine.js';
import {SCIENCE_IDS,SCIENCE_MODELS,auditSciencePairs} from '../assets/science-engine.js';
import {ADVANCED_IDS,ADVANCED_MODELS,auditAdvancedPairs} from '../assets/advanced-lab-engine.js';
import {CLASSROOM_IDS,CLASSROOM_LESSONS,CLASSROOM_ROLES} from '../assets/classroom-engine.js';
import {DIGITAL_TOPICS,DIGITAL_TASKS,DIGITAL_AGES} from '../assets/digital-engine.js';

const has=x=>typeof x==='string'&&x.trim().length>0;
export function auditBilingualLearning({
 studyTopics=LAB_TOPICS,studyLessons=ALL_LAB_LESSONS,
 studioLessons=STUDIO_LESSONS,experiments=EXPERIMENTS,workshop=WORKSHOP_CONTENT,
 science=SCIENCE_MODELS,advanced=ADVANCED_MODELS,classroom=CLASSROOM_LESSONS,roles=CLASSROOM_ROLES,
 digitalTopics=DIGITAL_TOPICS,digitalTasks=DIGITAL_TASKS,gameAudit=auditContent()
}={}){
 const errors=[],count={gameTasks:gameAudit.counts?.items??0,study:0,studio:0,experiments:0,maths:0,science:0,advanced:0,classroomSteps:0,digital:0};
 const text=(value,where)=>{if(!has(value))errors.push(where+' missing text')};
 const pair=(value,where)=>{
  if(Array.isArray(value)&&value.length===2){text(value[0],where+'.en');text(value[1],where+'.hi')}
  else if(value&&!Array.isArray(value)&&typeof value==='object'){text(value.en,where+'.en');text(value.hi,where+'.hi')}
  else errors.push(where+' missing paired English/Hindi content');
 };
 if(gameAudit.errors?.length)errors.push('Game-bank bilingual/source audit failed: '+gameAudit.errors.length);
 if(gameAudit.counts?.items!==3200)errors.push('Unexpected original game record coverage');
 for(const x of studyTopics){text(x.en,'Study topic title en');text(x.hi,'Study topic title hi');pair(x.description,'Study topic description')}
 for(const x of studyLessons){
  count.study++;
  pair(x.title,'Study title '+x.id);pair(x.teach,'Study teaching '+x.id);
  text(x.question,'Study question EN '+x.id);text(x.questionHi,'Study question HI '+x.id);
  text(x.why,'Study feedback EN '+x.id);text(x.whyHi,'Study feedback HI '+x.id);
  if(!Array.isArray(x.options)||!Array.isArray(x.optionsHi)||x.options.length!==3||x.optionsHi.length!==3)errors.push('Study options missing '+x.id);
  else for(let i=0;i<3;i++){text(x.options[i],x.id+' EN choice '+i);text(x.optionsHi[i],x.id+' HI choice '+i)}
 }
 for(const id of STUDIO_IDS){
  const x=studioLessons[id];count.studio++;
  if(!x){errors.push('Missing Studio '+id);continue}
  for(const k of ['title','concept','mission'])pair(x[k],id+'.'+k);
  for(const s of x.stages||[]){
   for(const k of ['question','hint','explanation'])pair(s[k],id+'.'+s.id+'.'+k);
   for(const option of s.options||[])pair(option,id+'.'+s.id+'.option');
  }
 }
 for(const id of EXPERIMENT_IDS){
  const x=experiments[id];count.experiments++;
  if(!x){errors.push('Missing virtual experiment '+id);continue}
  for(const k of ['title','overview','mission'])pair(x[k],id+'.'+k);
  for(const s of x.tasks||[])for(const k of ['title','prompt','hint'])pair(s[k],id+'.'+s.id+'.'+k);
 }
 for(const id of WORKSHOP_MODES){
  const x=workshop[id];count.maths++;
  if(!x){errors.push('Missing maths workshop '+id);continue}
  for(const k of ['title','prompt','hint'])pair(x[k],id+'.'+k);
 }
 for(const id of SCIENCE_IDS)count.science++;
 errors.push(...auditSciencePairs(science).map(x=>'Science '+x));
 count.advanced=ADVANCED_IDS.length;
 errors.push(...auditAdvancedPairs(advanced).map(x=>'Advanced '+x));
 for(const r of roles)pair(r,'Classroom group role');
 for(const id of CLASSROOM_IDS){
  const x=classroom[id];if(!x){errors.push('Missing classroom plan '+id);continue}
  pair(x.title,id+'.title');pair(x.subtitle,id+'.subtitle');
  for(const s of x.steps||[]){count.classroomSteps++;for(const k of ['title','teacher','prompt','action','answer'])pair(s[k],id+'.'+k)}
 }
 for(const topic of digitalTopics){
  for(const k of ['title','intro','mission'])pair(topic[k],topic.id+'.'+k);
  for(const age of DIGITAL_AGES){
   for(const task of digitalTasks[topic.id]?.[age]||[]){
    count.digital++;pair(task.question,task.id+'.question');
    for(const option of task.options||[])pair(option,task.id+'.option');
    pair(task.explanation,task.id+'.explanation');
   }
   if((digitalTasks[topic.id]?.[age]||[]).length!==2)errors.push('Missing digital age tasks '+topic.id+'/'+age);
  }
 }
 if(count.study!==32||count.studio!==2||count.experiments!==2||count.maths!==3||count.science!==7||count.advanced!==24||count.classroomSteps!==10||count.digital!==32)errors.push('Unexpected learning source breadth: '+JSON.stringify(count));
 return {valid:errors.length===0,errors,counts:count,
  structuralOnly:true,educationalReviewPassed:false,translationQualityVerified:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=auditBilingualLearning();
 console.log(JSON.stringify(result,null,2));if(!result.valid)process.exitCode=1;
}
