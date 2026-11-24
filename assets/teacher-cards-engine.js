/** M32 private classroom paper cards: source-derived, anonymous, not approved lessons. */
import {CLASSROOM_IDS,CLASSROOM_LESSONS,CLASSROOM_ROLES,classroomStep,classroomText} from './classroom-engine.js';
export const ROTATION_ROLES=CLASSROOM_ROLES;
export function rotateAnonymousRole(index,steps=1){
 if(!Number.isInteger(index)||index<0||index>=ROTATION_ROLES.length||!Number.isInteger(steps)||steps<0)throw Error('Invalid anonymous role index');
 return (index+steps)%ROTATION_ROLES.length;
}
export function printableClassroomCard(lessonId,index,lang='en'){
 if(!CLASSROOM_IDS.includes(lessonId)||!['en','hi'].includes(lang))throw Error('Unknown teacher card');
 const lesson=CLASSROOM_LESSONS[lessonId],step=classroomStep(lessonId,index),local=p=>classroomText(p,lang);
 return {lesson:local(lesson.title),stepIndex:index,stage:local(step.title),question:local(step.prompt),
  action:local(step.action),teacherGuidance:local(step.answer),teacherSpeech:local(step.teacher),
  subjectLessonId:lessonId,sourceFile:'assets/classroom-engine.js',
  humanReviewed:false,hasStudentNames:false,quizScore:null,
  worksheetMode:'learner-only',approval:'PENDING',localOnly:true};
}

/** Local prototype organizer: only fixed source lesson IDs, never pupils, answers or scores. */
export function validateLessonQueue(queue){
 if(!Array.isArray(queue)||queue.length>CLASSROOM_IDS.length||new Set(queue).size!==queue.length||queue.some(x=>!CLASSROOM_IDS.includes(x)))throw Error('Invalid draft lesson queue');
 return [...queue]
}
export function updateLessonQueue(queue,action,lessonId){
 const q=validateLessonQueue(queue);
 if(action==='clear')return [];
 if(!CLASSROOM_IDS.includes(lessonId))throw Error('Unknown draft lesson');
 const i=q.indexOf(lessonId);
 if(action==='add'){if(i===-1)q.push(lessonId)}
 else if(action==='remove'){if(i!==-1)q.splice(i,1)}
 else if(action==='up'){if(i>0)[q[i-1],q[i]]=[q[i],q[i-1]]}
 else if(action==='down'){if(i>=0&&i<q.length-1)[q[i],q[i+1]]=[q[i+1],q[i]]}
 else throw Error('Unknown queue action');
 return q
}
export function teacherFlow(queue,lessonId,stepIndex){
 const q=validateLessonQueue(queue),lesson=CLASSROOM_LESSONS[lessonId];
 if(!lesson||!Number.isInteger(stepIndex)||stepIndex<0||stepIndex>=lesson.steps.length)throw Error('Invalid lesson flow');
 return {queued:q.length,currentStep:stepIndex+1,steps:lesson.steps.length,individualResultsEnabled:false,
  attendanceEnabled:false,groupResponseMetricsEnabled:false,profileCreated:false,stored:false,approved:false}
}
/** Learner printable projection strips all teacher-only guidance and user data. */
export function draftAssignmentPack(lessonId,lang='en'){
 if(!CLASSROOM_IDS.includes(lessonId)||!['en','hi'].includes(lang))throw Error('Unknown draft pack');
 return {lessonId,lang,reviewStatus:'PENDING',rightsStatus:'NOT_VERIFIED_FOR_PUBLIC_DISTRIBUTION',localOnly:true,
  cards:CLASSROOM_LESSONS[lessonId].steps.map((_,i)=>{
   const {lesson,stage,question,action}=printableClassroomCard(lessonId,i,lang);
   return {lesson,stage,question,action}
  })
 }
}
