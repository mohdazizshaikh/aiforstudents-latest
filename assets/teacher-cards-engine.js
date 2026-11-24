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

/** M37 source-derived print pack, not a licensed/approved curriculum release. Learner payload omits answer keys. */
export function printableAssignmentPack(lessonId,lang='en'){
 if(!CLASSROOM_IDS.includes(lessonId)||!['en','hi'].includes(lang))throw Error('Unknown assignment pack');
 const lesson=CLASSROOM_LESSONS[lessonId];
 const cards=lesson.steps.map((_,index)=>{
  const {stepIndex,stage,question,action}=printableClassroomCard(lessonId,index,lang);
  return {stepIndex,stage,question,action};
 });
 return {lesson:classroomText(lesson.title,lang),lessonId,language:lang,cards,
  sourceFile:'assets/classroom-engine.js',rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED',
  humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}
