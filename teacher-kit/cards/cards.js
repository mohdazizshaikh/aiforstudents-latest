import {CLASSROOM_IDS,CLASSROOM_LESSONS,classroomText} from '../../assets/classroom-engine.js';
import {printableClassroomCard,printableAssignmentPack} from '../../assets/teacher-cards-engine.js';
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
 renderPack(lesson,l);
}
function renderPack(lesson,l){
 const full=$('card-view').value==='pack';
 $('learner-card').hidden=full;$('teacher-guidance').hidden=full;$('assignment-pack').hidden=!full;
 $('card-step').disabled=full;
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
for(const id of ['card-language','card-lesson','card-step','card-view'])$(id).addEventListener('change',()=>{
 if(id==='card-lesson')$('card-step').value='0';
 render();$( $('card-view').value==='pack'?'assignment-heading':'card-heading').focus();
});
render();
