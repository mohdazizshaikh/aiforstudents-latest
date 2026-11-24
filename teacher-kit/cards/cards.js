import {CLASSROOM_IDS,CLASSROOM_LESSONS,classroomText} from '../../assets/classroom-engine.js';
import {printableClassroomCard,printableAssignmentPack,printableLabActivity,teacherLabOptions,TEACHER_LAB_SUBJECTS,teacherSupplementOptions,printableSupplementActivity} from '../../assets/teacher-cards-engine.js';
const $=id=>document.getElementById(id);
const lang=()=>$('card-language').value;
function render(){
 const lesson=$('card-lesson').value,steps=CLASSROOM_LESSONS[lesson].steps,select=$('card-step');
 const index=Math.min(steps.length-1,Math.max(0,Number(select.value)||0)),l=lang();
 select.replaceChildren();
 steps.forEach((s,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=(i+1)+'. '+classroomText(s.title,l);select.append(o)});
 select.value=String(index);
 const x=printableClassroomCard(lesson,index,l);
 $('card-heading').textContent=x.lesson+' · '+x.stage;
 $('card-question-label').textContent=l==='hi'?'चर्चा का सवाल':'Question to discuss';
 $('card-question').textContent=x.question;
 $('card-action-label').textContent=l==='hi'?'समूह का काम':'Group task';
 $('card-action').textContent=x.action;
 $('card-teacher-speech').textContent=x.teacherSpeech;
 $('card-answer').textContent=x.teacherGuidance;
 $('card-answer-heading').textContent=l==='hi'?'शिक्षक का उत्तर — विद्यार्थी के प्रिंट में कभी नहीं':'Teacher-only guidance — never in learner print';
 $('card-warning').textContent=l==='hi'?'असमीक्षित कक्षा मसौदा':'UNREVIEWED original lesson draft';
 $('card-no-data').textContent=l==='hi'?'कागज़ पर लिखें। यह पृष्ठ कोई उत्तर या जानकारी सेव नहीं करता।':'Write on paper. This page does not store or submit any answer.';
 document.documentElement.lang=l;
 $('card-skip').textContent=l==='hi'?'अभ्यास पत्र पर जाएँ':'Skip to the learner worksheet';
 $('card-skip').href='#'+($('card-view').value==='lab'?'lab-activity-heading':$('card-view').value==='pack'?'assignment-heading':'card-heading');
 renderPack(lesson,l);
 renderLab(l);
}
function renderPack(lesson,l){
 const full=$('card-view').value==='pack',lab=$('card-view').value==='lab';
 $('learner-card').hidden=full;$('teacher-guidance').hidden=full;$('assignment-pack').hidden=!full;
 $('card-step').disabled=full||lab;$('card-lesson').disabled=lab;
 if(lab){$('learner-card').hidden=true;$('teacher-guidance').hidden=true;$('assignment-pack').hidden=true;}
 $('card-print').textContent=full?(l==='hi'?'पूरा अभ्यास पैक छापें':'Print full learner pack'):(l==='hi'?'अभ्यास कार्ड छापें':'Print learner card');
 const host=$('assignment-pages');host.replaceChildren();
 if(!full)return;
 const pack=printableAssignmentPack(lesson,l);
 $('assignment-heading').textContent=pack.lesson+(l==='hi'?' — अभ्यास पैक':' — learner assignment pack');
 $('assignment-notice').textContent=l==='hi'?'मूल असमीक्षित मसौदा। अनुमति और विषय समीक्षा बाकी है। कागज़ पर उत्तर दें; कोई जानकारी ऑनलाइन न भेजें।':'Original unreviewed draft. Permission and subject review pending. Write on paper; do not submit personal information.';
 const el=(tag,value)=>{const e=document.createElement(tag);e.textContent=value;return e};
 for(const card of pack.cards){
  const section=el('section','');section.className='assignment-page';
  section.append(el('h3',(card.stepIndex+1)+'. '+card.stage),el('h4',l==='hi'?'चर्चा का सवाल':'Discussion question'),el('p',card.question),el('h4',l==='hi'?'समूह का काम':'Group action'),el('p',card.action));
  const space=el('div','');space.className='writing';space.setAttribute('aria-label',l==='hi'?'कागज़ पर लिखने की जगह':'Space for paper response');section.append(space);host.append(section);
 }
}
function renderLab(l){
 const active=$('card-view').value==='lab';
 $('lab-print-controls').hidden=!active;$('lab-activity').hidden=!active;
 const host=$('lab-activity-steps');host.replaceChildren();
 if(!active){$('lab-print-activity').value='main';return;}
 const p=(en,hi)=>l==='hi'?hi:en;
 const subject=$('lab-print-subject'),model=$('lab-print-model'),previous=model.value;
 const chosen=subject.value||'maths';subject.replaceChildren();
 const names={maths:['Mathematics','गणित'],physics:['Physics','भौतिकी'],chemistry:['Chemistry','रसायन'],biology:['Biology','जीवविज्ञान']};
 const el=(tag,value)=>{const e=document.createElement(tag);e.textContent=value;return e};
 for(const s of TEACHER_LAB_SUBJECTS){const o=el('option',p(...names[s]));o.value=s;subject.append(o)}subject.value=chosen;
 const options=teacherLabOptions(chosen,l);model.replaceChildren();
 for(const item of options){const o=el('option',item.title);o.value=item.id;model.append(o)}
 if(options.some(x=>x.id===previous))model.value=previous;
 const activity=$('lab-print-activity'),previousActivity=activity.value;
 const supplements=teacherSupplementOptions(model.value,l);activity.replaceChildren();
 const main=el('option',p('Main model','मुख्य मॉडल'));main.value='main';activity.append(main);
 for(const item of supplements){const option=el('option',item.title);option.value=item.mode;activity.append(option)}
 activity.value=supplements.some(x=>x.mode===previousActivity)&&previous===model.value?previousActivity:'main';
 $('lab-print-activity-control').hidden=!supplements.length;
 activity.disabled=!supplements.length;
 $('lab-print-activity-label').textContent=p('Choose a draft activity','मसौदा गतिविधि चुनें');
 const a=activity.value==='main'?printableLabActivity(model.value,l):printableSupplementActivity(model.value,activity.value,l);
 $('lab-activity-heading').textContent=a.title;$('lab-activity-prompt').textContent=a.prompt;
 $('lab-activity-warning').textContent=p('Original unreviewed computer-only activity. Permission and educational review pending.','मूल असमीक्षित कंप्यूटर गतिविधि। अनुमति और शैक्षिक समीक्षा बाकी है।');
 $('lab-activity-caveat').textContent=a.caveat;
 $('lab-activity-private').textContent=p('Write on paper; no names or online submission. Printouts cannot be remotely deleted.','कागज़ पर लिखें; नाम या ऑनलाइन जमा नहीं करें। प्रिंट दूर से मिटाया नहीं जा सकता।');
 $('lab-print-subject-label').textContent=p('Lab subject','प्रयोग विषय');$('lab-print-model-label').textContent=p('Draft model','मसौदा मॉडल');
 $('card-print').textContent=p('Print lab activity','प्रयोग गतिविधि छापें');
 for(const [i,step] of a.steps.entries()){
  const section=el('section','');section.className='assignment-page';section.append(el('h3',(i+1)+'. '+step));
  const space=el('div','');space.className='writing';space.setAttribute('aria-label',p('Paper response space','कागज़ पर उत्तर की जगह'));section.append(space);host.append(section);
 }
}
for(const id of ['lab-print-subject','lab-print-model','lab-print-activity'])$(id).addEventListener('change',()=>{
 if(id!=='lab-print-activity')$('lab-print-activity').value='main';
 renderLab(lang());
});
for(const id of ['card-language','card-lesson','card-step','card-view'])$(id).addEventListener('change',()=>{
 if(id==='card-lesson')$('card-step').value='0';
 render();$( $('card-view').value==='lab'?'lab-activity-heading':$('card-view').value==='pack'?'assignment-heading':'card-heading').focus();
});
render();
