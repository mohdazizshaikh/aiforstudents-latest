import {miniControlLabels} from './mini-snapshots.js';
import {SCIENCE_IDS,SCIENCE_MODELS} from './science-engine.js';
import {WORKSHOP_MODES,WORKSHOP_CONTENT} from './experiment-engine.js';
import {STUDIO_IDS,STUDIO_LESSONS} from './studio-engine.js';
import {ADVANCED_IDS,ADVANCED_MODELS,advancedExtensionIds,advancedExtension,evaluateAdvancedExtension,calculateAdvanced,advancedResultRows} from './advanced-lab-engine.js';
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
const validAgenda=id=>validDemo(id)||BASIC_PRINT_IDS.includes(id);
export function teacherDemoAgenda(agenda,action){
 if(!Array.isArray(agenda)||agenda.length>DEMO_AGENDA_LIMIT||new Set(agenda).size!==agenda.length||agenda.some(id=>!validAgenda(id)))throw Error('Invalid demonstration agenda');
 if(!action||typeof action!=='object'||Array.isArray(action))throw Error('Invalid demonstration action');
 const type=action.type,keys=Object.keys(action),needsId=['add','remove','up','down'].includes(type);
 if(needsId?keys.length!==2||!Object.hasOwn(action,'id')||!validAgenda(action.id):keys.length!==1||type!=='clear')throw Error('Unknown demonstration action');
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
  if(BASIC_PRINT_IDS.includes(id)){
   const m=basicPrintDefinition(id),i=lang==='hi'?1:0;
   return {...teacherAnyLabPlan(m.subject,id,lang),position:index+1,prompt:m.prompt[i],hint:basicDemoHint(id)[i],source:m.sourceFile};
  }
  const m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  return {...teacherLabPlan(m.subject,id,lang),position:index+1,prompt:m.prompt[i],hint:m.hint[i],source:'assets/advanced-lab-engine.js'};
 });
}

/** M50 printable source-derived lab activity: no hints, target values, answers or learner fields.
 * The authored prompt may specify a control example, not a calculated solution. */
/** M94 source-bound paper investigation. Lists existing computer controls only, never target values, hints or learner responses. */
export function mainWorksheetControls(id,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const i=lang==='hi'?1:0;
 let controls;
 if(ADVANCED_IDS.includes(id))controls=ADVANCED_MODELS[id].fields.map(f=>f.label[i]);
 else if(BASIC_PRINT_IDS.includes(id)){
  const [family,key]=id.split('/');
  controls=family==='science'?SCIENCE_MODELS[key].fields.map(f=>f.label[i]):miniControlLabels(id,lang);
 }else throw Error('Unknown main worksheet');
 if(!controls.length||controls.some(x=>typeof x!=='string'||!x.trim()))throw Error('Missing model control labels');
 return controls;
}
export function mainWorksheetInvestigation(id,lang='en'){
 const controls=mainWorksheetControls(id,lang),list=controls.join('; ');
 return lang==='hi'?'केवल कंप्यूटर मॉडल में इन नियंत्रणों में से एक चुनें: '+list+'। शिक्षक के साथ दो अलग स्थितियाँ आज़माएँ; जहाँ संभव हो बाकी नियंत्रण न बदलें। नीचे की तालिका कागज़ पर भरें। मॉडल उपलब्ध न हो तो तालिका खाली रखें और केवल अपना अनुमान लिखें।':
 'In the computer model, choose one of these controls: '+list+'. With a teacher, try two different settings; keep the other controls unchanged where possible. On paper, complete the table below. If the model is unavailable, leave the table blank and write only your prediction.';
}
/** M95 supplemental paper investigations use the extension's own controls, not the parent model's. */
export function supplementalWorksheetControls(id,mode,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const i=lang==='hi'?1:0,labels=advancedExtension(id,mode).fields.map(f=>f.label[i]);
 if(!labels.length||labels.some(x=>typeof x!=='string'||!x.trim()))throw Error('Missing supplemental control labels');
 return labels;
}
export function supplementalWorksheetInvestigation(id,mode,lang='en'){
 const labels=supplementalWorksheetControls(id,mode,lang).join('; ');
 return lang==='hi'?'केवल अतिरिक्त कंप्यूटर मॉडल में इनमें से एक नियंत्रण चुनें: '+labels+'। शिक्षक के साथ दो अलग स्थितियाँ आज़माएँ; जहाँ संभव हो बाकी नियंत्रण न बदलें। नीचे की तालिका कागज़ पर भरें। मॉडल उपलब्ध न हो तो तालिका खाली रखें और केवल अपना अनुमान लिखें।':
 'In this supplemental computer model, choose one control: '+labels+'. With a teacher, try two different settings; keep other controls unchanged where possible. Complete the table on paper. If the model is unavailable, leave the table blank and write only your prediction.';
}
function blankPaperComparison(lang){
 const p=(en,hi)=>lang==='hi'?hi:en;
 return {caption:p('Two computer model settings — paper notes only','कंप्यूटर मॉडल की दो स्थितियाँ — केवल कागज़ पर नोट'),columns:[p('Trial','स्थिति'),p('Control and setting','नियंत्रण और मान'),p('What the model shows','मॉडल में दिखा परिणाम')],rows:[{label:'A',cells:['','']},{label:'B',cells:['','']}]};
}

/** M96 main and supplemental activities share the same blank paper format. */
export function mainWorksheetComparison(id,lang='en'){
 mainWorksheetControls(id,lang);
 return blankPaperComparison(lang);
}
export function supplementalWorksheetComparison(id,mode,lang='en'){
 supplementalWorksheetControls(id,mode,lang);
 return blankPaperComparison(lang);
}

export function printableLabActivity(id,lang='en'){
 if(!validDemo(id)||!['en','hi'].includes(lang))throw Error('Unknown printable lab activity');
 const m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 return {id,subject:m.subject,language:lang,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],
  steps:[
   p('Predict the result before using the model. Write your reasoning on paper.','मॉडल चलाने से पहले परिणाम का अनुमान लगाएँ। अपना कारण कागज़ पर लिखें।'),
   mainWorksheetInvestigation(id,lang),
   p('Explain one difference or similarity. If the model is unavailable, discuss your prediction only.','एक अंतर या समानता समझाएँ। मॉडल उपलब्ध न हो तो केवल अनुमान पर चर्चा करें।')
  ],comparison:mainWorksheetComparison(id,lang),sourceFile:'assets/advanced-lab-engine.js',rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED',humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
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
 return {...base,mode,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],steps:[base.steps[0],supplementalWorksheetInvestigation(id,mode,lang),base.steps[2]],comparison:supplementalWorksheetComparison(id,mode,lang)};
}

/** M75 basic model worksheets use only existing source prompts and cautions, not answer keys. */
export const BASIC_PRINT_IDS=Object.freeze([...SCIENCE_IDS.map(id=>'science/'+id),...WORKSHOP_MODES.map(id=>'maths/'+id),...STUDIO_IDS.map(id=>'studio/'+id)]);
function basicPrintDefinition(id){
 if(!BASIC_PRINT_IDS.includes(id))throw Error('Unknown basic worksheet');
 const [kind,key]=id.split('/');
 if(kind==='science'){const m=SCIENCE_MODELS[key];return {subject:m.subject.toLowerCase(),title:m.title,prompt:m.prompt,caveat:m.caveat,sourceFile:'assets/science-engine.js'};}
 if(kind==='maths'){const m=WORKSHOP_CONTENT[key];return {subject:'maths',title:m.title,prompt:m.prompt,caveat:['Whole-number computer practice only; not a complete curriculum or assessment.','केवल पूर्णांक कंप्यूटर अभ्यास; पूरा पाठ्यक्रम या आकलन नहीं।'],sourceFile:'assets/experiment-engine.js'};}
 const m=STUDIO_LESSONS[key];
 return {subject:key==='fractions'?'maths':'physics',title:m.title,prompt:m.stages.find(s=>s.id==='try').question,caveat:key==='fractions'?['Equal-size whole and equal pieces in a symbolic diagram only.','केवल प्रतीकात्मक चित्र में समान आकार के पूरे और बराबर हिस्से।']:['Computer diagram only. Do not connect real batteries, wires or sockets.','केवल कंप्यूटर चित्र। वास्तविक बैटरी, तार या सॉकेट न जोड़ें।'],sourceFile:'assets/studio-engine.js'};
}
export function teacherPrintableOptions(subject,lang='en'){
 const advanced=teacherLabOptions(subject,lang),i=lang==='hi'?1:0;
 return [...advanced,...BASIC_PRINT_IDS.map(id=>({id,...basicPrintDefinition(id)})).filter(m=>m.subject===subject).map(m=>({id:m.id,subject:m.subject,title:m.title[i],caveat:m.caveat[i],humanReviewed:false,gradeVerified:false,publicReleaseApproved:false}))];
}
/** M76 fixed internal deep links for all 60 main draft models. No external or user-entered URLs. */
function basicDemoHint(id){
 const [kind,key]=id.split('/');
 return kind==='science'?SCIENCE_MODELS[key].hint:kind==='maths'?WORKSHOP_CONTENT[key].hint:STUDIO_LESSONS[key].stages.find(s=>s.id==='try').hint;
}
export function teacherAnyLabPlan(subject,id,lang='en'){
 if(!BASIC_PRINT_IDS.includes(id))return teacherLabPlan(subject,id,lang);
 const m=basicPrintDefinition(id);
 if(m.subject!==subject||!['en','hi'].includes(lang))throw Error('Unknown or mismatched teacher lab');
 const [kind,key]=id.split('/'),i=lang==='hi'?1:0;
 const anchor={science:'science-lab',maths:'math-workshop',studio:'smart-studio'}[kind];
 return {id,subject,title:m.title[i],caveat:m.caveat[i],href:'?demo='+encodeURIComponent(id)+'#'+anchor,humanReviewed:false,gradeVerified:false,publicReleaseApproved:false,localOnly:true,storesStudentData:false,projectorReadyClaim:false};
}

export function teacherPrintableSupplementOptions(id,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 return BASIC_PRINT_IDS.includes(id)?[]:teacherSupplementOptions(id,lang);
}
export function printableBasicLabActivity(id,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=basicPrintDefinition(id),i=lang==='hi'?1:0,p=(en,hi)=>lang==='hi'?hi:en;
 return {id,subject:m.subject,language:lang,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],steps:[
 p('Predict what the computer model will show. Write your reasoning on paper.','अनुमान लगाएँ कि कंप्यूटर मॉडल क्या दिखाएगा। अपना कारण कागज़ पर लिखें।'),
 mainWorksheetInvestigation(id,lang),
 p('Explain one thing you noticed. If the model is unavailable, discuss your prediction only.','एक बात समझाएँ जो आपने देखी। मॉडल उपलब्ध न हो तो केवल अनुमान पर चर्चा करें।')
 ],comparison:mainWorksheetComparison(id,lang),sourceFile:m.sourceFile,rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED',humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}
export function printableAnyLabActivity(id,mode='main',lang='en'){
 if(BASIC_PRINT_IDS.includes(id)){if(mode!=='main')throw Error('Unknown basic activity mode');return printableBasicLabActivity(id,lang);}
 return mode==='main'?printableLabActivity(id,lang):printableSupplementActivity(id,mode,lang);
}

/** M67 transient assignment pack: known source keys only, no free text or learner records. */
export const LAB_PACK_LIMIT=6;
export function labPackKeys(){
 return [...ADVANCED_IDS.flatMap(id=>[id+':main',...advancedExtensionIds(id).map(mode=>id+':'+mode)]),...BASIC_PRINT_IDS.map(id=>id+':main')];
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
  const a=printableAnyLabActivity(id,mode,lang);
  return {...a,key,position:i+1};
 });
 return {language:lang,items,localOnly:true,hasStudentNames:false,humanReviewed:false,publicReleaseApproved:false,rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED'};
}

/** M77 local activity discovery across all fixed source keys. No free text, learner records or inferred grade. */
export const TEACHER_ACTIVITY_KINDS=Object.freeze(['all','basic','advanced','supplement']);
export function teacherActivityChoices(subject,kind='all',lang='en'){
 if(!TEACHER_LAB_SUBJECTS.includes(subject)||!TEACHER_ACTIVITY_KINDS.includes(kind)||!['en','hi'].includes(lang))throw Error('Unknown activity discovery filter');
 return labPackKeys().map(key=>{
  const [id,mode]=key.split(':'),type=BASIC_PRINT_IDS.includes(id)?'basic':mode==='main'?'advanced':'supplement';
  const a=printableAnyLabActivity(id,mode,lang);
  return {key,id,mode,subject:a.subject,kind:type,title:a.title,humanReviewed:false,gradeVerified:false,publicReleaseApproved:false};
 }).filter(a=>a.subject===subject&&(kind==='all'||a.kind===kind));
}

/** M79 explicit cross-subject inventory, not grade or curriculum recommendations. */
export function teacherResourceChoices(subject,kind='all',lang='en'){
 if(subject==='all')return TEACHER_LAB_SUBJECTS.flatMap(s=>teacherActivityChoices(s,kind,lang));
 return teacherActivityChoices(subject,kind,lang);
}

/** M88 bilingual local title/key search. Never persist or echo query text in results. */
export const TEACHER_QUERY_LIMIT=80;
const resourceTokens=value=>value.normalize('NFKC').toLowerCase().trim().split(/\s+/u).filter(Boolean);
export function searchTeacherResources(subject,kind='all',lang='en',query=''){
 const choices=teacherResourceChoices(subject,kind,lang);
 if(typeof query!=='string'||query.length>TEACHER_QUERY_LIMIT||/[\p{Cc}\p{Cf}]/u.test(query))throw Error('Invalid resource search query');
 const terms=resourceTokens(query);
 if(!terms.length)return choices;
 const other=new Map(teacherResourceChoices(subject,kind,lang==='hi'?'en':'hi').map(x=>[x.key,x.title]));
 return choices.filter(x=>{
  const corpus=[x.title,other.get(x.key),x.key].join(' ').normalize('NFKC').toLowerCase();
  return terms.every(t=>corpus.includes(t));
 });
}

/** M90: source-bound demonstration routes, never arbitrary URLs or learner data. */
export function teacherActivityLaunch(key,lang='en'){
 if(typeof key!=='string'||!labPackKeys().includes(key)||!['en','hi'].includes(lang))throw Error('Unknown activity launch');
 const [id,mode]=key.split(':'),a=printableAnyLabActivity(id,mode,lang);
 const href=mode==='main'?teacherAnyLabPlan(a.subject,id,lang).href:
  '?advanced='+encodeURIComponent(id)+'&extension='+encodeURIComponent(mode)+'#advanced-ratio-extension';
 return {key,id,mode,subject:a.subject,title:a.title,href,localOnly:true,storesStudentData:false,humanReviewed:false,gradeVerified:false,publicReleaseApproved:false};
}
/** Resolve only known supplemental identifiers for the specified advanced model. */
export function teacherPackLaunches(keys,lang='en'){
 validateLabPack(keys);
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 return keys.map(key=>teacherActivityLaunch(key,lang));
}

/** M92 main-model worksheet links. The only URL fields are fixed model ID and language. */
export function mainModelWorksheet(id,lang='en'){
 if(typeof id!=='string'||(!ADVANCED_IDS.includes(id)&&!BASIC_PRINT_IDS.includes(id))||!['en','hi'].includes(lang))throw Error('Unknown main worksheet');
 const a=printableAnyLabActivity(id,'main',lang);
 return {id,subject:a.subject,title:a.title,language:lang,href:'./teacher-kit/cards/?worksheet='+encodeURIComponent(id)+'&language='+lang+'#lab-activity',localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}
export function resolveMainWorksheet(search){
 if(typeof search!=='string'||search.length>256)return null;
 const p=new URLSearchParams(search);
 if([...p.keys()].length!==2||p.getAll('worksheet').length!==1||p.getAll('language').length!==1)return null;
 try{return mainModelWorksheet(p.get('worksheet'),p.get('language'))}catch{return null}
}
export function renderMainWorksheetLink(anchor,id,lang){
 const plan=mainModelWorksheet(id,lang);
 anchor.href=plan.href;
 anchor.textContent=(lang==='hi'?'मसौदा अभ्यास पत्र खोलें: ':'Open draft worksheet: ')+plan.title;
 anchor.hidden=false;
}

/** M93 supplemental worksheet route, with original M92 main routes unchanged. */
export function activityWorksheet(key,lang='en'){
 const plan=teacherActivityLaunch(key,lang);
 if(plan.mode==='main')return {...mainModelWorksheet(plan.id,lang),key,mode:'main'};
 return {id:plan.id,key,mode:plan.mode,subject:plan.subject,title:plan.title,language:lang,href:'./teacher-kit/cards/?worksheet='+encodeURIComponent(plan.id)+'&extension='+encodeURIComponent(plan.mode)+'&language='+lang+'#lab-activity',localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}
export function resolveActivityWorksheet(search){
 const main=resolveMainWorksheet(search);
 if(main)return {...main,key:main.id+':main',mode:'main'};
 if(typeof search!=='string'||search.length>256)return null;
 const p=new URLSearchParams(search);
 if([...p.keys()].length!==3||['worksheet','extension','language'].some(k=>p.getAll(k).length!==1)||p.get('extension')==='main')return null;
 try{return activityWorksheet(p.get('worksheet')+':'+p.get('extension'),p.get('language'))}catch{return null}
}
export function renderActivityWorksheetLink(anchor,key,lang){
 const plan=activityWorksheet(key,lang);anchor.href=plan.href;
 anchor.textContent=(lang==='hi'?'मसौदा अभ्यास पत्र खोलें: ':'Open draft worksheet: ')+plan.title;anchor.hidden=false;
}
/** Language-specific return route from the exact selected worksheet, not query input. */
export function worksheetReturnLaunch(key,lang='en'){
 const plan=teacherActivityLaunch(key,lang),[query,fragment]=plan.href.split('#');
 return {...plan,language:lang,href:query+'&lang='+lang+'#'+fragment};
}

/** M99 teacher-only source-bound control ranges, not target settings or answer keys. */
export function teacherMainControlGuide(id,lang='en'){
 const labels=mainWorksheetControls(id,lang),a=printableAnyLabActivity(id,'main',lang),i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 const mini={
  'maths/number-line':[{min:-10,max:10,step:1}],
  'maths/rectangle':[{min:1,max:12,step:1},{min:1,max:12,step:1}],
  'maths/data-table':[{min:0,max:10,step:1},{min:0,max:10,step:1}],
  'studio/fractions':[{min:0,max:4,step:1}],
  'studio/circuit-path':[{options:[{label:['Open','खुला']},{label:['Closed','बंद']}]}]
 };
 const fields=ADVANCED_IDS.includes(id)?ADVANCED_MODELS[id].fields:id.startsWith('science/')?SCIENCE_MODELS[id.slice(8)].fields:mini[id];
 if(!fields||fields.length!==labels.length)throw Error('Control guide source mismatch');
 const controls=fields.map((f,j)=>{
  if(f.options)return {label:labels[j],kind:'choice',settings:f.options.map(o=>o.label[i]).join('; ')};
  if(!Number.isInteger(f.min)||!Number.isInteger(f.max)||!Number.isInteger(f.step)||f.step<1||f.max<f.min)throw Error('Invalid control range');
  return {label:labels[j],kind:'range',settings:p(f.min+' to '+f.max+'; step '+f.step,f.min+' से '+f.max+'; कदम '+f.step)+(f.unit?' ('+f.unit+')':'')};
 });
 return {id,title:a.title,caveat:a.caveat,controls,teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}

/** M100 teacher-only supplemental preparation. Only source labels and control bounds,
 * never calculated values, targets, learner states or independently approved answers. */
export function teacherSupplementControlGuide(id,mode,lang='en'){
 if(!['en','hi'].includes(lang)||!ADVANCED_IDS.includes(id)||!advancedExtensionIds(id).includes(mode))throw Error('Unknown supplemental guide');
 const m=advancedExtension(id,mode),a=printableSupplementActivity(id,mode,lang),i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 const controls=m.fields.map(f=>{
  if(!Number.isInteger(f.min)||!Number.isInteger(f.max)||f.max<f.min)throw Error('Invalid supplemental control bounds');
  return {label:f.label[i],kind:'range',settings:p(f.min+' to '+f.max+'; step 1',f.min+' से '+f.max+'; कदम 1')+(f.unit?' ('+f.unit+')':'')};
 });
 const quantityLabels=evaluateAdvancedExtension(id,mode,m.initial,lang).rows.map(r=>r.label);
 if(!quantityLabels.length||quantityLabels.some(s=>typeof s!=='string'||!s.trim()))throw Error('Invalid quantity label');
 return {id,mode,title:a.title,caveat:a.caveat,controls,quantityLabels,teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}

/** M101 main model output labels only. Advanced labels derive from canonical
 * calculation rows; basic labels are explicit bilingual draft descriptions
 * of existing model displays, not new calculations or approved answers. */
const MAIN_BASIC_OBSERVATIONS={
 "science/motion": [
  [
   "Ideal constant speed (m/s)",
   "आदर्श समान चाल (m/s)"
  ]
 ],
 "science/reflection": [
  [
   "Incident angle from normal",
   "अभिलंब से आपतन कोण"
  ],
  [
   "Selected reflected angle from normal",
   "अभिलंब से चुना परावर्तन कोण"
  ],
  [
   "Angle equality",
   "कोणों की समानता"
  ]
 ],
 "science/energy": [
  [
   "Input energy (J)",
   "आगत ऊर्जा (J)"
  ],
  [
   "Useful energy (J)",
   "उपयोगी ऊर्जा (J)"
  ],
  [
   "Thermal energy (J)",
   "ऊष्मीय ऊर्जा (J)"
  ]
 ],
 "science/matter": [
  [
   "Particle arrangement",
   "कणों की व्यवस्था"
  ],
  [
   "Particle motion",
   "कणों की गति"
  ]
 ],
 "science/changes": [
  [
   "Example classification",
   "उदाहरण का वर्गीकरण"
  ],
  [
   "Selected classification",
   "चुना वर्गीकरण"
  ]
 ],
 "science/cells": [
  [
   "Cell structures",
   "कोशिका की संरचनाएँ"
  ]
 ],
 "science/food-chain": [
  [
   "Selected food chain order",
   "चुनी खाद्य शृंखला का क्रम"
  ]
 ],
 "maths/number-line": [
  [
   "Position on number line",
   "संख्या रेखा पर स्थिति"
  ]
 ],
 "maths/rectangle": [
  [
   "Area (square units)",
   "क्षेत्रफल (वर्ग इकाई)"
  ],
  [
   "Perimeter (units)",
   "परिमाप (इकाई)"
  ]
 ],
 "maths/data-table": [
  [
   "Group A count",
   "समूह A की संख्या"
  ],
  [
   "Group B count",
   "समूह B की संख्या"
  ],
  [
   "Difference A − B",
   "अंतर A − B"
  ]
 ],
 "studio/fractions": [
  [
   "Shaded equal parts",
   "रंगे बराबर हिस्से"
  ],
  [
   "Total equal parts",
   "कुल बराबर हिस्से"
  ]
 ],
 "studio/circuit-path": [
  [
   "Model bulb state",
   "मॉडल बल्ब की स्थिति"
  ],
  [
   "Path continuity",
   "परिपथ पथ की निरंतरता"
  ]
 ]
};
export function teacherMainObservationGuide(id,lang='en'){
 if(!['en','hi'].includes(lang)||(!ADVANCED_IDS.includes(id)&&!BASIC_PRINT_IDS.includes(id)))throw Error('Unknown main observation guide');
 const i=lang==='hi'?1:0,advanced=ADVANCED_IDS.includes(id);
 const labels=advanced?advancedResultRows(calculateAdvanced(id,ADVANCED_MODELS[id].initial),lang).map(r=>r.label):MAIN_BASIC_OBSERVATIONS[id].map(pair=>pair[i]);
 if(!labels.length||labels.some(x=>typeof x!=='string'||!x.trim()))throw Error('Invalid observation labels');
 return {id,labels,source:advanced?'CANONICAL_CALCULATION_LABELS':'DRAFT_DISPLAY_DESCRIPTIONS',teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}
