/** M18 local, deterministic digital literacy challenges; no remote AI or user identity. */
import {DIGITAL_TOPICS,DIGITAL_VERSION,digitalText,digitalTask,digitalGrade,digitalSummary} from './digital-engine.js';
const $=id=>document.getElementById(id);
const S={topic:'ai',index:0,age:'11-14',lang:'en',result:null};
const tr=(en,hi)=>S.lang==='hi'?hi:en, t=p=>digitalText(p,S.lang);
const make=(tag,cls,label)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(label!==undefined)el.textContent=label;return el};
function setLocale(){S.lang=$('lang').value==='hi'?'hi':'en';const age=$('age-select').value||'11-14';if(age!==S.age){S.age=age;S.result=null}}
function render(){setLocale();const topic=DIGITAL_TOPICS.find(x=>x.id===S.topic),task=digitalTask(S.topic,S.age,S.index);const prior=window.AIFS_DIGITAL_BRIDGE?.getHistory?.().digitalAttempts||[];const summary=digitalSummary(prior,S.age);
 $('digital-nav').textContent=tr('Digital Skills','डिजिटल कौशल');$('digital-title').textContent=tr('AI & Digital Skills Lab','AI और डिजिटल कौशल लैब');$('digital-intro').textContent=tr('Practice how to question AI suggestions, follow algorithms, check evidence and protect privacy. No chatbot or account.','AI सुझावों पर सवाल करें, एल्गोरिदम समझें, प्रमाण जाँचें और गोपनीयता बचाएँ। कोई चैटबॉट या अकाउंट नहीं।');$('digital-notice').textContent=tr('Original unreviewed learning drafts; your chosen answers stay in this browser only. No AI service is called. These activities do not assess intelligence.','मूल अध्ययन मसौदे अभी विशेषज्ञ समीक्षा के बिना हैं। चुने उत्तर केवल इसी ब्राउज़र में रहते हैं। कोई AI सेवा नहीं चलती और बुद्धि नहीं मापी जाती।');
 $('digital-summary').textContent=tr(`${summary.tries} local attempts · ${summary.topics} of 4 topics explored in this age band. Not a skill score.`,`इस उम्र समूह में ${summary.tries} स्थानीय कोशिशें · 4 में से ${summary.topics} विषय आज़माए। यह कौशल का अंक नहीं है।`);
 const tabs=$('digital-topics');tabs.replaceChildren();for(const entry of DIGITAL_TOPICS){const b=make('button','btn outline compact',t(entry.title));b.type='button';b.setAttribute('aria-pressed',String(S.topic===entry.id));b.addEventListener('click',()=>{S.topic=entry.id;S.index=0;S.result=null;render();$('digital-question').focus()});tabs.append(b)}
 $('digital-concept').textContent=t(topic.intro);$('digital-topic-title').textContent=t(topic.title);
 const tasks=$('digital-tasks');tasks.replaceChildren();for(let index=0;index<2;index++){const b=make('button','btn outline compact',tr(`Challenge ${index+1}`,`प्रश्न ${index+1}`));b.type='button';b.setAttribute('aria-pressed',String(S.index===index));b.addEventListener('click',()=>{S.index=index;S.result=null;render();$('digital-question').focus()});tasks.append(b)}
 $('digital-question').textContent=t(task.question);
 const answers=$('digital-choices');answers.replaceChildren();task.options.forEach((option,index)=>{const b=make('button','btn outline',t(option));b.type='button';b.setAttribute('aria-pressed',String(S.result?.choice===index));b.disabled=Boolean(S.result);b.addEventListener('click',()=>check(index));answers.append(b)});
 $('digital-feedback').hidden=!S.result;$('digital-feedback').textContent=S.result?tr(S.result.correct?'This response fits the example. ':'This answer needs reconsidering. ',S.result.correct?'यह उत्तर उदाहरण के अनुसार सही है। ':'इस उत्तर पर फिर सोचें। ')+t(task.explanation):'';
 $('digital-retry').hidden=!S.result;$('digital-mission').textContent=t(topic.mission);$('digital-next').textContent=tr('Next challenge','अगला प्रश्न');$('digital-next').hidden=!(S.result&&S.index===0);
}
function check(choice){if(S.result)return;const result=digitalGrade(S.topic,S.age,S.index,choice),d=new Date();const attempt={id:`digital:${S.topic}:${S.age}:${S.index}:${d.getTime()}:${Math.random().toString(36).slice(2,8)}`,topicId:S.topic,ageBand:S.age,taskIndex:S.index,choice,correct:result.correct,version:DIGITAL_VERSION,at:d.toISOString(),day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 try{if(!window.AIFS_DIGITAL_BRIDGE?.record)throw Error('Local history integration missing');window.AIFS_DIGITAL_BRIDGE.record(attempt);S.result={choice,correct:result.correct};render();$('digital-feedback').focus()}catch{$('digital-feedback').hidden=false;$('digital-feedback').textContent=tr('Could not save locally. Check browser storage settings.','स्थानीय रूप से सेव नहीं हुआ। ब्राउज़र स्टोरेज सेटिंग जाँचें।')}
}
$('digital-retry').addEventListener('click',()=>{S.result=null;render();$('digital-choices button')?.focus()});
$('digital-next').addEventListener('click',()=>{S.index=1;S.result=null;render();$('digital-question').focus()});
$('lang').addEventListener('change',render);$('age-select').addEventListener('change',render);
window.addEventListener('aifs-history-cleared',()=>{S.topic='ai';S.index=0;S.result=null;render()});
window.addEventListener('aifs-digital-history-changed',render);render();