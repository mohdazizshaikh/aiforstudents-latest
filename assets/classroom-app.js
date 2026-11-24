import {CLASSROOM_IDS,CLASSROOM_LESSONS,CLASSROOM_ROLES,classroomText,classroomStep,classroomSummary,lessonQueue} from './classroom-engine.js';
import {rotateAnonymousRole,TEACHER_LAB_SUBJECTS,teacherLabOptions,teacherLabPlan} from './teacher-cards-engine.js';
/** M17 classroom mode: transient UI state only. No student names, answers, accounts or analytics. */
const $=id=>document.getElementById(id);
const S={lesson:'fractions',step:0,role:0,revealed:false,projector:false,queue:[],labSubject:'maths',labId:null};
const lang=()=> $('lang')?.value==='hi'?'hi':'en';
const txt=p=>classroomText(p,lang());
const both=(en,hi)=>lang()==='hi'?hi:en;
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
// Existing route, no storage or remote service. Fixed controls retain focus on language/lesson changes.
const organizer=make('section','notice classroom-organizer');
organizer.setAttribute('aria-labelledby','classroom-queue-title');
const queueTitle=make('h3','');queueTitle.id='classroom-queue-title';
const queueNote=make('p','');
const queueLabel=make('label','');queueLabel.htmlFor='classroom-queue-choice';
const queueChoice=make('select','');queueChoice.id='classroom-queue-choice';
const queueStatus=make('p','');queueStatus.setAttribute('role','status');queueStatus.setAttribute('aria-live','polite');
const queueButtons=make('div','classroom-queue-actions');
const queueControls={};
function queueAction(type){
 const id=queueChoice.value;
 if(type==='start'){
  if(!S.queue.length)return;
  S.lesson=S.queue[0];S.queue=lessonQueue(S.queue,{type:'start'});
  S.step=0;S.role=0;S.revealed=false;
  render();$('classroom-step-heading').focus();return;
 }
 if(type==='clear'){
  S.queue=lessonQueue(S.queue,{type:'clear'});S.step=0;S.role=0;S.revealed=false;S.projector=false;S.labSubject='maths';S.labId=null;S.lesson=CLASSROOM_IDS[0];
 }else S.queue=lessonQueue(S.queue,{type,id});
 render();queueChoice.focus();
}
for(const type of ['add','remove','up','down','start','clear']){
 const b=make('button','btn outline compact');b.type='button';b.id='classroom-queue-'+type;
 b.addEventListener('click',()=>queueAction(type));queueControls[type]=b;queueButtons.append(b);
}
organizer.append(queueTitle,queueNote,queueLabel,queueChoice,queueButtons,queueStatus);
$('classroom-lessons').after(organizer);
const labPanel=make('section','notice classroom-organizer');labPanel.id='classroom-lab-launcher';labPanel.setAttribute('aria-labelledby','classroom-lab-heading');
const labHeading=make('h3','');labHeading.id='classroom-lab-heading';
const labNotice=make('p',''),subjectLabel=make('label',''),subjectSelect=make('select',''),labLabel=make('label',''),labSelect=make('select','');
subjectSelect.id='classroom-lab-subject';subjectLabel.htmlFor=subjectSelect.id;
labSelect.id='classroom-lab-choice';labLabel.htmlFor=labSelect.id;
const labCaveat=make('p','');labCaveat.id='classroom-lab-caveat';labCaveat.setAttribute('role','status');
const labLink=make('a','btn outline compact');labLink.id='classroom-lab-open';
const labClear=make('button','btn outline compact');labClear.id='classroom-lab-clear';labClear.type='button';
const labActions=make('div','classroom-queue-actions');labActions.append(labLink,labClear);
labPanel.append(labHeading,labNotice,subjectLabel,subjectSelect,labLabel,labSelect,labCaveat,labActions);organizer.after(labPanel);
function renderLabLauncher(){
 labHeading.textContent=both('Teacher lab launcher — original drafts','शिक्षक प्रयोग चयन — मूल मसौदे');
 labNotice.textContent=both('Choose a subject and draft model for a supervised demonstration. No approved grade mapping, real experiment or student record.','देखरेख में प्रदर्शन के लिए विषय और मसौदा मॉडल चुनें। कोई स्वीकृत कक्षा मिलान, वास्तविक प्रयोग या विद्यार्थी रिकॉर्ड नहीं।');
 subjectLabel.textContent=both('Lab subject','प्रयोग विषय');labLabel.textContent=both('Draft concept','मसौदा अवधारणा');
 const names={maths:['Mathematics','गणित'],physics:['Physics','भौतिकी'],chemistry:['Chemistry','रसायन'],biology:['Biology','जीवविज्ञान']};
 subjectSelect.replaceChildren();for(const s of TEACHER_LAB_SUBJECTS){const o=make('option','',both(...names[s]));o.value=s;subjectSelect.append(o)}subjectSelect.value=S.labSubject;
 const options=teacherLabOptions(S.labSubject,lang());labSelect.replaceChildren();
 const blank=make('option','',both('Select a draft','मसौदा चुनें'));blank.value='';labSelect.append(blank);
 for(const item of options){const o=make('option','',item.title);o.value=item.id;labSelect.append(o)}
 labSelect.value=S.labId||'';
 labLink.textContent=both('Open selected offline lab','चुना ऑफ़लाइन प्रयोग खोलें');labClear.textContent=both('Clear lab selection','प्रयोग चयन मिटाएँ');
 const chosen=S.labId?teacherLabPlan(S.labSubject,S.labId,lang()):null;
 labLink.hidden=!chosen;
 if(chosen){labLink.href=chosen.href;labCaveat.textContent=chosen.caveat}else{labLink.removeAttribute('href');labCaveat.textContent=both('No lab selected. All models require review.','कोई प्रयोग नहीं चुना। सभी मॉडलों की समीक्षा बाकी है।')}
}
subjectSelect.addEventListener('change',()=>{S.labSubject=subjectSelect.value;S.labId=null;renderLabLauncher();subjectSelect.focus()});
labSelect.addEventListener('change',()=>{S.labId=labSelect.value||null;renderLabLauncher();labSelect.focus()});
labClear.addEventListener('click',()=>{S.labSubject='maths';S.labId=null;renderLabLauncher();subjectSelect.focus()});

function renderQueue(){
 queueTitle.textContent=both('Local lesson organizer','स्थानीय पाठ आयोजक');
 queueNote.textContent=both('Queue the two original draft lessons for this open tab. No names, records or saved plan.','इस खुले टैब में दो मूल प्रारूप पाठ क्रम से चुनें। कोई नाम, रिकॉर्ड या सहेजी गई योजना नहीं।');
 queueLabel.textContent=both('Choose a lesson to organize','क्रम में रखने के लिए पाठ चुनें');
 const selected=queueChoice.value;
 queueChoice.replaceChildren();
 for(const id of CLASSROOM_IDS){const o=make('option','',txt(CLASSROOM_LESSONS[id].title));o.value=id;queueChoice.append(o)}
 if(CLASSROOM_IDS.includes(selected))queueChoice.value=selected;
 const labels={add:['Add to plan','योजना में जोड़ें'],remove:['Remove from plan','योजना से हटाएँ'],up:['Move earlier','पहले करें'],down:['Move later','बाद में करें'],start:['Start next planned lesson','अगला नियोजित पाठ शुरू करें'],clear:['Clear plan and reset classroom','योजना मिटाएँ और कक्षा रीसेट करें']};
 for(const type of Object.keys(queueControls))queueControls[type].textContent=both(...labels[type]);
 queueStatus.textContent=S.queue.length?both('Plan: ','योजना: ')+S.queue.map((id,i)=>(i+1)+'. '+txt(CLASSROOM_LESSONS[id].title)).join(' · '):both('Plan is empty.','योजना खाली है।');
 const i=S.queue.indexOf(queueChoice.value);
 queueControls.add.disabled=i>=0;queueControls.remove.disabled=i<0;queueControls.up.disabled=i<=0;
 queueControls.down.disabled=i<0||i===S.queue.length-1;queueControls.start.disabled=!S.queue.length;
}
queueChoice.addEventListener('change',renderQueue);
function render(){renderQueue();renderLabLauncher();const lesson=CLASSROOM_LESSONS[S.lesson],step=classroomStep(S.lesson,S.step),sum=classroomSummary(S.lesson);
 $('classroom-nav').textContent=both('Classroom','कक्षा');$('classroom-title').textContent=both('Smart Classroom & Teacher Kit','स्मार्ट कक्षा और शिक्षक किट');
 $('classroom-intro').textContent=both('Use one screen to discuss, predict, explore and explain. No student login or class roster.','एक स्क्रीन पर चर्चा, अनुमान, अभ्यास और समझ। कोई विद्यार्थी लॉगिन या कक्षा सूची नहीं।');
 $('classroom-notice').textContent=both('Original, unreviewed prototype lesson plans. Teacher supervision required. No student answers are collected.','मूल प्रारूप पाठ-योजनाएँ, अभी विशेषज्ञ समीक्षा बाकी है। शिक्षक की देखरेख ज़रूरी है। विद्यार्थियों के उत्तर दर्ज नहीं होते।');
 const options=$('classroom-lessons');options.replaceChildren();for(const id of CLASSROOM_IDS){const item=CLASSROOM_LESSONS[id],b=make('button','btn outline compact',txt(item.title));b.type='button';b.setAttribute('aria-pressed',String(id===S.lesson));b.addEventListener('click',()=>{S.lesson=id;S.step=0;S.revealed=false;S.role=0;render();$('classroom-step-heading').focus()});options.append(b)}
 const jump=$('classroom-jump');
 const rememberedFocus=jump===document.activeElement;
 jump.replaceChildren();
 for(let i=0;i<lesson.steps.length;i++){
  const choice=make('option','',both('Step ','चरण ')+(i+1)+' · '+txt(lesson.steps[i].title));
  choice.value=String(i);jump.append(choice);
 }
 jump.value=String(S.step);
 $('classroom-jump-label').textContent=both('Jump to lesson step','पाठ के चरण पर जाएँ');
 $('classroom-cards-link').textContent=both('Print learner card or full assignment pack','विद्यार्थी के लिए चर्चा कार्ड या पूरा पैक छापें');
 if(rememberedFocus)jump.focus();
 $('classroom-summary').textContent=both(`${sum.steps} teacher-led steps · about ${sum.minutes} minutes (design estimate), not a measured lesson duration.`,`शिक्षक के साथ ${sum.steps} चरण · लगभग ${sum.minutes} मिनट (केवल अनुमानित समय)।`);
 $('classroom-step-count').textContent=both(`Step ${S.step+1} of ${sum.steps}`,`चरण ${S.step+1} / ${sum.steps}`);
 $('classroom-step-heading').textContent=txt(step.title);$('classroom-subtitle').textContent=txt(lesson.subtitle);
 $('classroom-teacher-label').textContent=both('Teacher says or does','शिक्षक क्या कहें या करें');$('classroom-teacher-text').textContent=txt(step.teacher);
 $('classroom-question-label').textContent=both('Question to discuss','चर्चा का सवाल');$('classroom-question').textContent=txt(step.prompt);
 $('classroom-group-label').textContent=both('Learner group action','विद्यार्थियों का सामूहिक काम');$('classroom-group-action').textContent=txt(step.action);
 $('classroom-active-role').textContent=both('Group role: ','समूह की भूमिका: ')+txt(CLASSROOM_ROLES[S.role]);
 $('classroom-switch-role').textContent=both('Rotate group role','समूह की भूमिका बदलें');
 $('classroom-reveal').textContent=S.revealed?both('Hide teacher guidance','शिक्षक का उत्तर छिपाएँ'):both('Show teacher guidance','शिक्षक का उत्तर दिखाएँ');
 $('classroom-reveal').setAttribute('aria-expanded',String(S.revealed));
 $('classroom-answer').hidden=!S.revealed;$('classroom-answer').textContent=txt(step.answer);
 $('classroom-previous').disabled=S.step===0;$('classroom-next').disabled=S.step===sum.steps-1;
 $('classroom-previous').textContent=both('Previous step','पिछला चरण');$('classroom-next').textContent=both('Next step','अगला चरण');
 $('classroom-projector').textContent=S.projector?both('Exit projector view','प्रोजेक्टर दृश्य बंद करें'):both('Projector-friendly view','प्रोजेक्टर के लिए दृश्य');$('classroom-projector').setAttribute('aria-pressed',String(S.projector));
 $('classroom-worksheet').href=lesson.worksheet;$('classroom-worksheet').textContent=both('Original printable worksheet (external page on this site)','मूल प्रिंट करने योग्य कार्यपत्र (इसी साइट पर)');
 $('classroom-experiment').href=lesson.resource;$('classroom-experiment').textContent=both('Open existing M16 Virtual Lab','पहले से उपलब्ध M16 प्रयोगशाला खोलें');
 $('classroom-privacy').textContent=both('This mode keeps only the current lesson, planned lesson queue, step and generic group role in memory. No child names, answers, scores or classroom reports are stored or sent.','यह मोड केवल वर्तमान पाठ, पाठों का क्रम, चरण और सामान्य समूह भूमिका अस्थायी रूप से रखता है। बच्चों के नाम, उत्तर, अंक या रिपोर्ट सेव या भेजी नहीं जाती।');
 document.body.classList.toggle('classroom-projector',S.projector);
}
function stepTo(delta){const dest=S.step+delta;if(dest<0||dest>=CLASSROOM_LESSONS[S.lesson].steps.length)return;S.step=dest;S.revealed=false;S.role=rotateAnonymousRole(S.role,delta===1?1:0);render();$('classroom-step-heading').focus()}
$('classroom-jump').addEventListener('change',event=>{
 const next=Number(event.target.value);
 if(!Number.isInteger(next)||next<0||next>=CLASSROOM_LESSONS[S.lesson].steps.length)return;
 const distance=Math.max(0,next-S.step);
 S.role=rotateAnonymousRole(S.role,distance);S.step=next;S.revealed=false;render();$('classroom-step-heading').focus();
});
$('classroom-previous').addEventListener('click',()=>stepTo(-1));$('classroom-next').addEventListener('click',()=>stepTo(1));
$('classroom-switch-role').addEventListener('click',()=>{S.role=rotateAnonymousRole(S.role);render();$('classroom-switch-role').focus()});
$('classroom-reveal').addEventListener('click',()=>{S.revealed=!S.revealed;render();$('classroom-reveal').focus()});
$('classroom-projector').addEventListener('click',()=>{S.projector=!S.projector;render();$('classroom-projector').focus()});
$('lang').addEventListener('change',render);
window.addEventListener('aifs-history-cleared',()=>{S.queue=[];S.lesson=CLASSROOM_IDS[0];S.step=0;S.role=0;S.revealed=false;S.projector=false;S.labSubject='maths';S.labId=null;render()});
render();