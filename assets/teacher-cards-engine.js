import {ADVANCED_IDS,ADVANCED_MODELS,advancedExtensionIds,advancedExtension} from './advanced-lab-engine.js';
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

/** M62 printable demonstration sequence, source-derived and deliberately omits teacher hints/answers. */
export function printableDemoAgenda(agenda,lang='en'){
 const rows=teacherAgendaRows(agenda,lang);
 return {language:lang,items:rows.map(({position,id,title,prompt,caveat})=>({position,id,title,prompt,caveat})),humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}

/** M66 source-derived supplemental paper activity, without hints or computed results. */
export function teacherSupplementOptions(id,lang='en'){
 if(!validDemo(id)||!['en','hi'].includes(lang))throw Error('Unknown supplemental worksheet model or language');
 const i=lang==='hi'?1:0;
 return advancedExtensionIds(id).map(mode=>({mode,title:advancedExtension(id,mode).title[i]}));
}
export function printableSupplementActivity(id,mode,lang='en'){
 if(!teacherSupplementOptions(id,lang).some(x=>x.mode===mode))throw Error('Unknown supplemental worksheet activity');
 const base=printableLabActivity(id,lang),m=advancedExtension(id,mode),i=lang==='hi'?1:0;
 return {...base,mode,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i]};
}

/** M67 transient assignment pack: known source keys only, no free text or learner records. */
export const LAB_PACK_LIMIT=6;
export function labPackKeys(){
 return ADVANCED_IDS.flatMap(id=>[id+':main',...advancedExtensionIds(id).map(mode=>id+':'+mode)]);
}
function validateLabPack(keys){
 const allowed=labPackKeys();
 if(!Array.isArray(keys)||keys.length>LAB_PACK_LIMIT||new Set(keys).size!==keys.length||keys.some(key=>!allowed.includes(key)))throw Error('Invalid lab pack');
}
export function editLabPack(keys,action){
 validateLabPack(keys);
 if(!action||typeof action!=='object'||Array.isArray(action))throw Error('Invalid lab pack action');
 const type=action.type,needsKey=['add','remove','up','down'].includes(type);
 if(needsKey?Object.keys(action).length!==2||!Object.hasOwn(action,'key')||!labPackKeys().includes(action.key):Object.keys(action).length!==1||type!=='clear')throw Error('Unknown lab pack action');
 const next=[...keys];if(type==='clear')return [];
 const i=next.indexOf(action.key);
 if(type==='add'&&i<0&&next.length<LAB_PACK_LIMIT)next.push(action.key);
 if(type==='remove'&&i>=0)next.splice(i,1);
 if(type==='up'&&i>0)[next[i-1],next[i]]=[next[i],next[i-1]];
 if(type==='down'&&i>=0&&i<next.length-1)[next[i],next[i+1]]=[next[i+1],next[i]];
 return next;
}
export function printableLabPack(keys,lang='en'){
 validateLabPack(keys);
 if(!['en','hi'].includes(lang))throw Error('Unknown lab pack language');
 const items=keys.map((key,i)=>{
  const [id,mode]=key.split(':');
  const a=mode==='main'?printableLabActivity(id,lang):printableSupplementActivity(id,mode,lang);
  return {...a,key,position:i+1};
 });
 return {language:lang,items,localOnly:true,hasStudentNames:false,humanReviewed:false,publicReleaseApproved:false,rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED'};
}
