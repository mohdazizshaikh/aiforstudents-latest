import {ADVANCED_IDS,ADVANCED_MODELS} from './advanced-lab-engine.js';
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

/** Teacher-side discovery only. No learner records, grade approval or inferred difficulty. */
export const TEACHER_LAB_SUBJECTS=Object.freeze(['maths','physics','chemistry','biology']);
export function teacherLabOptions(subject,lang='en'){
 if(!TEACHER_LAB_SUBJECTS.includes(subject)||!['en','hi'].includes(lang))throw Error('Unknown teacher lab subject or language');
 return ADVANCED_IDS.filter(id=>ADVANCED_MODELS[id].subject===subject).map(id=>{
  const model=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  return {id,subject,title:model.title[i],caveat:model.caveat[i],href:'?advanced='+encodeURIComponent(id)+'#advanced-labs',humanReviewed:false,gradeVerified:false,publicReleaseApproved:false};
 });
}
export function teacherLabPlan(subject,id,lang='en'){
 const model=teacherLabOptions(subject,lang).find(x=>x.id===id);
 if(!model)throw Error('Unknown or mismatched teacher lab');
 return {...model,localOnly:true,storesStudentData:false,projectorReadyClaim:false};
}

/** M48 transient teacher demonstration agenda: fixed source IDs, no pupil data or free text. */
export const DEMO_AGENDA_LIMIT=8;
const validDemo=id=>typeof id==='string'&&ADVANCED_IDS.includes(id);
export function teacherDemoAgenda(agenda,action){
 if(!Array.isArray(agenda)||agenda.length>DEMO_AGENDA_LIMIT||new Set(agenda).size!==agenda.length||agenda.some(id=>!validDemo(id)))throw Error('Invalid demonstration agenda');
 if(!action||typeof action!=='object'||Array.isArray(action))throw Error('Invalid demonstration action');
 const type=action.type,keys=Object.keys(action),needsId=['add','remove','up','down'].includes(type);
 if(needsId?keys.length!==2||!Object.hasOwn(action,'id')||!validDemo(action.id):keys.length!==1||type!=='clear')throw Error('Unknown demonstration action');
 const next=[...agenda];if(type==='clear')return [];
 const i=next.indexOf(action.id);
 switch(type){
  case 'add':if(i<0&&next.length<DEMO_AGENDA_LIMIT)next.push(action.id);break;
  case 'remove':if(i>=0)next.splice(i,1);break;
  case 'up':if(i>0)[next[i-1],next[i]]=[next[i],next[i-1]];break;
  case 'down':if(i>=0&&i<next.length-1)[next[i],next[i+1]]=[next[i+1],next[i]];break;
 }
 return next;
}
export function teacherAgendaRows(agenda,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown agenda language');
 teacherDemoAgenda(agenda,{type:'clear'}); // validate, without mutating caller
 return agenda.map((id,index)=>{
  const m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  return {...teacherLabPlan(m.subject,id,lang),position:index+1,prompt:m.prompt[i],hint:m.hint[i],source:'assets/advanced-lab-engine.js'};
 });
}

/** M50 printable source-derived lab activity: no hints, target values, answers or learner fields.
 * The authored prompt may specify a control example, not a calculated solution. */
export function printableLabActivity(id,lang='en'){
 if(!validDemo(id)||!['en','hi'].includes(lang))throw Error('Unknown printable lab activity');
 const m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 return {id,subject:m.subject,language:lang,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],
  steps:[
   p('Predict the result before using the model. Write your reasoning on paper.','मॉडल चलाने से पहले परिणाम का अनुमान लगाएँ। अपना कारण कागज़ पर लिखें।'),
   p('With a teacher, inspect the computer-only model and compare the displayed values with your prediction.','शिक्षक के साथ केवल कंप्यूटर मॉडल देखें और दिखाए गए मान अपने अनुमान से मिलाएँ।'),
   p('Explain one difference or similarity. If the model is unavailable, discuss your prediction only.','एक अंतर या समानता समझाएँ। मॉडल उपलब्ध न हो तो केवल अनुमान पर चर्चा करें।')
  ],sourceFile:'assets/advanced-lab-engine.js',rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED',humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}
