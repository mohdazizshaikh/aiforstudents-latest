import {CLASSROOM_IDS,CLASSROOM_LESSONS,CLASSROOM_ROLES,classroomText,classroomStep,classroomSummary} from './classroom-engine.js';
import {rotateAnonymousRole} from './teacher-cards-engine.js';
/** M17 classroom mode: transient UI state only. No student names, answers, accounts or analytics. */
const $=id=>document.getElementById(id);
const S={lesson:'fractions',step:0,role:0,revealed:false,projector:false};
const lang=()=> $('lang')?.value==='hi'?'hi':'en';
const txt=p=>classroomText(p,lang());
const both=(en,hi)=>lang()==='hi'?hi:en;
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
function render(){const lesson=CLASSROOM_LESSONS[S.lesson],step=classroomStep(S.lesson,S.step),sum=classroomSummary(S.lesson);
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
 $('classroom-cards-link').textContent=both('Print learner-only discussion card','विद्यार्थी के लिए चर्चा कार्ड छापें');
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
 $('classroom-privacy').textContent=both('This mode keeps only the current lesson, step and generic group role in memory. No child names, answers, scores or classroom reports are stored or sent.','यह मोड केवल वर्तमान पाठ, चरण और सामान्य समूह भूमिका अस्थायी रूप से रखता है। बच्चों के नाम, उत्तर, अंक या रिपोर्ट सेव या भेजी नहीं जाती।');
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
window.addEventListener('aifs-history-cleared',()=>{S.step=0;S.role=0;S.revealed=false;render()});
render();