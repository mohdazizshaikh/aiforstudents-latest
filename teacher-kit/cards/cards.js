import {CLASSROOM_IDS,CLASSROOM_LESSONS,classroomText} from '../../assets/classroom-engine.js';
import {printableClassroomCard,printableAssignmentPack,printableAnyLabActivity,teacherPrintableOptions,TEACHER_LAB_SUBJECTS,teacherPrintableSupplementOptions,TEACHER_ACTIVITY_KINDS,searchTeacherResources,TEACHER_QUERY_LIMIT,teacherActivityLaunch,resolveActivityWorksheet,worksheetReturnLaunch,teacherMainControlGuide,teacherSupplementControlGuide,teacherMainObservationGuide,LAB_PACK_LIMIT,editLabPack,printableLabPack} from '../../assets/teacher-cards-engine.js';
const $=id=>document.getElementById(id);
const lang=()=>$('card-language').value;
let labPack=[];
let resourceKind='all';
let resourceScope='current';
let resourceQuery='';
const isLabPack=()=>$('card-view').value==='lab-pack';
const isLab=()=>$('card-view').value==='lab'||isLabPack();
const activeHeading=()=>isLabPack()?'lab-pack-heading':isLab()?'lab-activity-heading':$('card-view').value==='pack'?'assignment-heading':'card-heading';
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
 $('card-skip').href='#'+activeHeading();
 renderPack(lesson,l);
 renderLab(l);
}
function renderPack(lesson,l){
 const full=$('card-view').value==='pack',lab=isLab();
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
function renderActivityControlGuide(id,mode,l,active){
 const panel=$('lab-teacher-control-guide'),rows=$('lab-teacher-control-rows');
 const quantities=$('lab-teacher-quantity-rows'),quantityPanel=$('lab-teacher-quantity-panel');
 rows.replaceChildren();quantities.replaceChildren();quantityPanel.hidden=true;panel.hidden=!active;
 if(panel.hidden){panel.open=false;$('lab-teacher-control-title').textContent='';$('lab-teacher-control-notice').textContent='';return}
 const g=mode==='main'?teacherMainControlGuide(id,l):teacherSupplementControlGuide(id,mode,l),p=(en,hi)=>l==='hi'?hi:en;
 $('lab-teacher-control-title').textContent=p('Teacher preparation — computer control guide','शिक्षक तैयारी — कंप्यूटर नियंत्रण मार्गदर्शिका')+' · '+g.title;
 $('lab-teacher-control-notice').textContent=p('Unreviewed draft. Computer settings only; no target values or model answers. Keep the existing safety caution.','असमीक्षित मसौदा। केवल कंप्यूटर की स्थितियाँ; लक्ष्य मान या मॉडल के उत्तर नहीं। मौजूदा सुरक्षा सावधानी का पालन करें।');
 for(const c of g.controls){const term=document.createElement('dt'),desc=document.createElement('dd');term.textContent=c.label;desc.textContent=c.settings;rows.append(term,desc)}
 const labels=mode==='main'?teacherMainObservationGuide(id,l).labels:g.quantityLabels;
 $('lab-teacher-quantity-title').textContent=mode==='main'?p('Model outputs to observe (labels only)','देखने योग्य मॉडल परिणाम (केवल नाम)'):p('Calculated quantities (labels only)','गणना की गई राशियाँ (केवल नाम)');
 for(const label of labels){const item=document.createElement('li');item.textContent=label;quantities.append(item)}
 quantityPanel.hidden=false;
 const key=id+':'+mode+':'+l;if(panel.dataset.guideKey!==key){panel.open=false;panel.dataset.guideKey=key}
}
function renderLab(l){
 const active=isLab(),pack=isLabPack();
 $('lab-print-controls').hidden=!active;$('lab-activity').hidden=!active||pack;
 $('lab-pack-controls').hidden=!pack;$('lab-pack-output').hidden=!pack;
 if(!pack){clearLaunch('lab-pack-launch');labPack=[];$('lab-pack-pages').replaceChildren();$('lab-pack-choice').replaceChildren();$('card-print').disabled=false;}
 const host=$('lab-activity-steps');host.replaceChildren();
 if(!active){renderActivityControlGuide('','',l,false);$('lab-print-activity').value='main';resourceKind='all';resourceScope='current';resourceQuery='';$('lab-resource-query').value='';$('lab-resource-result').replaceChildren();$('lab-resource-kind').value='all';$('lab-resource-scope').value='current';$('lab-resource-add').hidden=true;$('lab-resource-add').disabled=true;clearLaunch('lab-resource-launch');clearLaunch('lab-pack-launch');clearLaunch('lab-worksheet-return');return;}
 const p=(en,hi)=>l==='hi'?hi:en;
 const subject=$('lab-print-subject'),model=$('lab-print-model'),previous=model.value;
 const chosen=subject.value||'maths';subject.replaceChildren();
 const names={maths:['Mathematics','गणित'],physics:['Physics','भौतिकी'],chemistry:['Chemistry','रसायन'],biology:['Biology','जीवविज्ञान']};
 const el=(tag,value)=>{const e=document.createElement(tag);e.textContent=value;return e};
 for(const s of TEACHER_LAB_SUBJECTS){const o=el('option',p(...names[s]));o.value=s;subject.append(o)}subject.value=chosen;
 const options=teacherPrintableOptions(chosen,l);model.replaceChildren();
 for(const item of options){const o=el('option',item.title);o.value=item.id;model.append(o)}
 if(options.some(x=>x.id===previous))model.value=previous;
 const activity=$('lab-print-activity'),previousActivity=activity.value;
 const supplements=teacherPrintableSupplementOptions(model.value,l);activity.replaceChildren();
 const main=el('option',p('Main model','मुख्य मॉडल'));main.value='main';activity.append(main);
 for(const item of supplements){const option=el('option',item.title);option.value=item.mode;activity.append(option)}
 activity.value=supplements.some(x=>x.mode===previousActivity)&&previous===model.value?previousActivity:'main';
 $('lab-print-activity-control').hidden=!supplements.length;
 activity.disabled=!supplements.length;
 $('lab-print-activity-label').textContent=p('Choose a draft activity','मसौदा गतिविधि चुनें');
 renderResourceFinder(l);
 const a=printableAnyLabActivity(model.value,activity.value,l);
 renderActivityControlGuide(model.value,activity.value,l,!pack);
 if(pack)clearLaunch('lab-worksheet-return');else {const plan=worksheetReturnLaunch(model.value+':'+activity.value,l),link=$('lab-worksheet-return');link.href='../../'+plan.href;link.hidden=false;link.textContent=p('Return to exact computer model: ','ठीक उसी कंप्यूटर मॉडल पर लौटें: ')+plan.title;}
 $('lab-activity-heading').textContent=a.title;$('lab-activity-prompt').textContent=a.prompt;
 $('lab-activity-warning').textContent=p('Original unreviewed computer-only activity. Permission and educational review pending.','मूल असमीक्षित कंप्यूटर गतिविधि। अनुमति और शैक्षिक समीक्षा बाकी है।');
 $('lab-activity-caveat').textContent=a.caveat;
 $('lab-activity-private').textContent=p('Write on paper; no names or online submission. Printouts cannot be remotely deleted.','कागज़ पर लिखें; नाम या ऑनलाइन जमा नहीं करें। प्रिंट दूर से मिटाया नहीं जा सकता।');
 $('lab-print-subject-label').textContent=p('Lab subject','प्रयोग विषय');$('lab-print-model-label').textContent=p('Draft model','मसौदा मॉडल');
 $('card-print').textContent=p('Print lab activity','प्रयोग गतिविधि छापें');
 if(pack){renderLabPack(l);return;}
 for(const [i,step] of a.steps.entries()){
  const section=el('section','');section.className='assignment-page';section.append(el('h3',(i+1)+'. '+step));
  const space=el('div','');space.className='writing';space.setAttribute('aria-label',p('Paper response space','कागज़ पर उत्तर की जगह'));section.append(i===1&&a.comparison?paperComparison(a.comparison):space);host.append(section);
 }
}
function matchingResources(){try{return searchTeacherResources(resourceScope==='all'?'all':$('lab-print-subject').value,resourceKind,lang(),resourceQuery)}catch{return []}}
function clearLaunch(id){const a=$(id);a.hidden=true;a.removeAttribute('href')}
function syncLaunch(id,key){
 if(!key){clearLaunch(id);return}
 const a=$(id),plan=teacherActivityLaunch(key,lang());
 // Route is generated exclusively from the fixed source inventory, not the search input.
 a.href='../../'+plan.href;a.hidden=false;
 a.textContent=lang()==='hi'?'कंप्यूटर मॉडल खोलें: '+plan.title:'Open computer model: '+plan.title;
}
function syncResourceAdd(){const button=$('lab-resource-add'),key=$('lab-resource-result').value;button.hidden=!isLabPack();button.disabled=!isLabPack()||!key||labPack.includes(key)||labPack.length>=LAB_PACK_LIMIT;syncLaunch('lab-resource-launch',isLab()?key:'');}
function renderResourceFinder(l){
 const p=(en,hi)=>l==='hi'?hi:en,kind=$('lab-resource-kind'),result=$('lab-resource-result'),previous=result.value;
 const make=(value,label)=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o};
 const labels={all:['All activities','सभी गतिविधियाँ'],basic:['Basic main models','बुनियादी मुख्य मॉडल'],advanced:['Advanced main models','उन्नत मुख्य मॉडल'],supplement:['Supplemental activities','अतिरिक्त गतिविधियाँ']};
 const subjectNames={maths:['Mathematics','गणित'],physics:['Physics','भौतिकी'],chemistry:['Chemistry','रसायन'],biology:['Biology','जीवविज्ञान']};
 const scope=$('lab-resource-scope');
 $('lab-resource-scope-label').textContent=p('Resource subject scope','संसाधन विषय का दायरा');
 scope.replaceChildren(make('current',p('Current subject','वर्तमान विषय')),make('all',p('All subjects','सभी विषय')));scope.value=resourceScope;
 $('lab-resource-add').textContent=p('Add matching activity to pack','मेल खाती गतिविधि पैक में जोड़ें');
 $('lab-resource-kind-label').textContent=p('Find resources by activity type','गतिविधि प्रकार से संसाधन खोजें');
 $('lab-resource-result-label').textContent=p('Matching draft activity','मेल खाती मसौदा गतिविधि');
 $('lab-resource-open').textContent=p('Select this worksheet','यह अभ्यास पत्र चुनें');
 kind.replaceChildren(...TEACHER_ACTIVITY_KINDS.map(k=>make(k,p(...labels[k]))));kind.value=resourceKind;
 $('lab-resource-query-label').textContent=p('Search draft titles (English or Hindi)','मसौदा शीर्षक खोजें (अंग्रेज़ी या हिंदी)');
 $('lab-resource-query').maxLength=TEACHER_QUERY_LIMIT;
 $('lab-resource-query').placeholder=p('Concept title only; no personal details','केवल अवधारणा का शीर्षक; निजी जानकारी नहीं');
 $('lab-resource-query-clear').textContent=p('Clear search','खोज मिटाएँ');
 $('lab-resource-query-clear').disabled=!resourceQuery;
 const choices=matchingResources();
 result.replaceChildren(...choices.map(x=>make(x.key,resourceScope==='all'?p(...subjectNames[x.subject])+' · '+x.title:x.title)));
 if(choices.some(x=>x.key===previous))result.value=previous;
 result.disabled=!choices.length;$('lab-resource-open').disabled=!choices.length;syncResourceAdd();
 $('lab-resource-status').textContent=choices.length+' '+p('matching original drafts; no verified grade mapping.','मेल खाते मूल मसौदे; सत्यापित कक्षा मिलान नहीं।');
}
$('lab-resource-query').addEventListener('input',()=>{resourceQuery=$('lab-resource-query').value;renderResourceFinder(lang())});
$('lab-resource-query-clear').addEventListener('click',()=>{resourceQuery='';$('lab-resource-query').value='';renderResourceFinder(lang());$('lab-resource-query').focus()});
$('lab-resource-scope').addEventListener('change',()=>{resourceScope=$('lab-resource-scope').value;renderResourceFinder(lang())});
$('lab-resource-result').addEventListener('change',syncResourceAdd);
$('lab-resource-add').addEventListener('click',()=>{
 if(!isLabPack())return;
 const x=matchingResources().find(r=>r.key===$('lab-resource-result').value);
 if(!x)return;
 labPack=editLabPack(labPack,{type:'add',key:x.key});renderLabPack(lang());
});
$('lab-resource-kind').addEventListener('change',()=>{resourceKind=$('lab-resource-kind').value;renderResourceFinder(lang())});
$('lab-resource-open').addEventListener('click',()=>{
 if(!isLab())return;
 const key=$('lab-resource-result').value;
 const x=matchingResources().find(r=>r.key===key);
 if(!x)return;
 if($('lab-print-subject').value!==x.subject){$('lab-print-subject').value=x.subject;$('lab-print-activity').value='main';renderLab(lang());}
 $('lab-print-model').value=x.id;$('lab-print-activity').value='main';renderLab(lang());
 $('lab-print-activity').value=x.mode;renderLab(lang());
 $(activeHeading()).focus();
});
// M95: blank, noninteractive paper cells; no learner data or calculated answers.
function paperComparison(data){
 const table=document.createElement('table');table.className='paper-comparison';
 const caption=document.createElement('caption');caption.textContent=data.caption;table.append(caption);
 const head=document.createElement('thead'),header=document.createElement('tr');
 for(const label of data.columns){const th=document.createElement('th');th.scope='col';th.textContent=label;header.append(th)}
 head.append(header);table.append(head);
 const body=document.createElement('tbody');
 for(const r of data.rows){const row=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=r.label;row.append(th);
  for(const value of r.cells){const td=document.createElement('td');td.textContent=value;row.append(td)}body.append(row)}
 table.append(body);return table;
}
function renderLabPack(l){
 const p=(en,hi)=>l==='hi'?hi:en,el=(tag,value)=>{const e=document.createElement(tag);e.textContent=value;return e};
 const current=$('lab-print-model').value+':'+$('lab-print-activity').value;
 const data=printableLabPack(labPack,l),choice=$('lab-pack-choice'),previous=choice.value;
 $('lab-pack-heading').textContent=p('Custom learner lab assignment pack','चुना हुआ विद्यार्थी प्रयोग अभ्यास पैक');
 $('lab-pack-notice').textContent=p('Original unreviewed draft. Rights and educational review pending. Write on paper without names or online submission. Printed copies cannot be remotely deleted.','मूल असमीक्षित मसौदा। अनुमति और शैक्षिक समीक्षा बाकी है। बिना नाम या ऑनलाइन जमा किए कागज़ पर लिखें। प्रिंट दूर से मिटाया नहीं जा सकता।');
 $('lab-pack-status').textContent=labPack.length+' / '+LAB_PACK_LIMIT+' '+p('activities selected','गतिविधियाँ चुनी गईं');
 $('lab-pack-choice-label').textContent=p('Selected activity to move or remove','स्थान बदलने या हटाने के लिए गतिविधि');
 for(const [id,en,hi] of [['add','Add selected lab activity','चुनी प्रयोग गतिविधि जोड़ें'],['remove','Remove','हटाएँ'],['up','Move earlier','पहले करें'],['down','Move later','बाद में करें'],['clear','Clear pack','पैक मिटाएँ']])$('lab-pack-'+id).textContent=p(en,hi);
 choice.replaceChildren();for(const item of data.items){const option=el('option',item.position+'. '+item.title);option.value=item.key;choice.append(option)}
 if(labPack.includes(previous))choice.value=previous;
 const index=labPack.indexOf(choice.value);syncLaunch('lab-pack-launch',index<0?'':choice.value);
 $('lab-pack-add').disabled=labPack.includes(current)||labPack.length>=LAB_PACK_LIMIT;syncResourceAdd();
 choice.disabled=!labPack.length;$('lab-pack-remove').disabled=index<0;$('lab-pack-up').disabled=index<=0;$('lab-pack-down').disabled=index<0||index===labPack.length-1;$('lab-pack-clear').disabled=!labPack.length;
 $('card-print').textContent=p('Print selected lab pack','चुना प्रयोग पैक छापें');$('card-print').disabled=!labPack.length;
 const pages=$('lab-pack-pages');pages.replaceChildren();
 for(const item of data.items){
  const section=el('section','');section.className='lab-pack-page';section.dataset.activityKey=item.key;
  section.append(el('h3',item.position+'. '+item.title),el('p',item.prompt),el('p',item.caveat));
  for(const [i,step] of item.steps.entries()){const group=el('div','');group.className='assignment-page';group.append(el('p',step));const space=el('div','');space.className='writing';space.setAttribute('aria-label',p('Paper response space','कागज़ पर उत्तर की जगह'));group.append(i===1&&item.comparison?paperComparison(item.comparison):space);section.append(group)}
  pages.append(section);
 }
}
$('lab-pack-choice').addEventListener('change',()=>renderLabPack(lang()));
for(const type of ['add','remove','up','down','clear'])$('lab-pack-'+type).addEventListener('click',()=>{
 if(!isLabPack())return;
 const key=type==='add'?$('lab-print-model').value+':'+$('lab-print-activity').value:$('lab-pack-choice').value;
 if(type!=='clear'&&!key)return;
 labPack=editLabPack(labPack,type==='clear'?{type}:{type,key});renderLabPack(lang());
});
window.addEventListener('aifs-history-cleared',()=>{labPack=[];resourceKind='all';resourceScope='current';resourceQuery='';$('lab-resource-query').value='';$('lab-resource-result').replaceChildren();if(isLab())renderLab(lang())});
for(const id of ['lab-print-subject','lab-print-model','lab-print-activity'])$(id).addEventListener('change',()=>{
 if(id!=='lab-print-activity')$('lab-print-activity').value='main';
 renderLab(lang());
});
for(const id of ['card-language','card-lesson','card-step','card-view'])$(id).addEventListener('change',()=>{
 if(id==='card-lesson')$('card-step').value='0';
 render();$(activeHeading()).focus();
});
// Resolve the URL once. It contains only an allowlisted model ID and language, never a response.
const initialWorksheet=resolveActivityWorksheet(location.search);
if(initialWorksheet){
 $('card-language').value=initialWorksheet.language;
 $('card-view').value='lab';
 render();
 $('lab-print-subject').value=initialWorksheet.subject;
 renderLab(lang());
 $('lab-print-model').value=initialWorksheet.id;
 $('lab-print-activity').value='main';
 renderLab(lang());
 $('lab-print-activity').value=initialWorksheet.mode;
 renderLab(lang());
}else render();
