import {CLASSROOM_IDS,CLASSROOM_LESSONS,classroomText} from '../../assets/classroom-engine.js';
import {printableClassroomCard,draftAssignmentPack} from '../../assets/teacher-cards-engine.js';
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
 const pack=$('learner-pack'),full=$('card-pack-mode').checked;
 $('learner-card').hidden=full;pack.hidden=!full;pack.replaceChildren();
 if(full){
  const data=draftAssignmentPack(lesson,l),add=(parent,tag,text)=>{const x=document.createElement(tag);x.textContent=text;parent.append(x);return x};
  add(pack,'h2',l==='hi'?'असमीक्षित पूरा पाठ मसौदा':'UNREVIEWED full lesson draft pack');
  add(pack,'p',l==='hi'?'सार्वजनिक वितरण के अधिकार सत्यापित नहीं हैं। स्थानीय निजी परीक्षण मात्र।':'Rights for public distribution are not verified. Private local testing only.');
  for(const [i,card] of data.cards.entries()){
   const item=add(pack,'article','');item.className='pack-card';add(item,'h3',(i+1)+'. '+card.stage);add(item,'p',card.question);add(item,'p',card.action);
   const line=add(item,'div','');line.className='writing';line.setAttribute('aria-hidden','true');
  }
 }
 $('card-step').disabled=full;
 document.documentElement.lang=l;
}
for(const id of ['card-language','card-lesson','card-step','card-pack-mode'])$(id).addEventListener('change',()=>{if(id==='card-lesson')$('card-step').value='0';render();if(!$('learner-card').hidden)$('card-heading').focus()});
render();
