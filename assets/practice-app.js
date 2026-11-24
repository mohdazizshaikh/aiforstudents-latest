import {pathwayChoices,pathwaySource,pathwayNext,PATHWAY_ACTIONS} from './practice-pathways.js';
/** M32: no input logs, no remote requests, no user accounts, and no AI model. */
import {GUIDED_TOPIC_IDS,PRACTICE_SUBJECTS,PRACTICE_DIFFICULTIES,practiceTopic,guidedHint,recommendPractice,optionalReviewDay,fractionStage,FRACTION_FIVE_STAGES,nextPracticeChoice,NEXT_PRACTICE_CHOICES} from './practice-engine.js';
const $=x=>document.getElementById(x);
const n=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
const state={subject:'maths',difficulty:'gentle',language:'en',hintId:'studio:fractions',response:null,recommendation:null,scheduled:null,fracStage:0,shaded:0,showSensitive:false,nextChoice:null};
const t=(en,hi)=>state.language==='hi'?hi:en;
const pathway={subject:'maths',kind:'all',key:'',reveal:false,sensitive:false,next:null};
const pathPanel=n('section','local-guide-result');pathPanel.id='practice-pathway';pathPanel.setAttribute('aria-labelledby','pathway-heading');
const pathHeading=n('h3','');pathHeading.id='pathway-heading';pathPanel.append(pathHeading);
const pathNotice=n('p','');pathNotice.id='pathway-notice';pathPanel.append(pathNotice);
const pathControls=n('div','local-guide-selectors');pathPanel.append(pathControls);
for(const id of ['subject','kind','activity']){
 const label=n('label',''),span=n('span',''),select=n('select','');span.id='pathway-'+id+'-label';select.id='pathway-'+id;label.append(span,select);pathControls.append(label);
}
const pathActions=n('div','local-guide-actions');pathPanel.append(pathActions);
for(const id of ['hint','adult','repeat','explain','different','clear']){
 const b=n('button','btn outline');b.id='pathway-'+id;b.type='button';pathActions.append(b);
}
const pathResult=n('div','local-guide-result');pathResult.id='pathway-result';pathResult.hidden=true;pathResult.tabIndex=-1;pathResult.setAttribute('role','status');pathPanel.append(pathResult);
const pathNext=n('div','local-guide-result');pathNext.id='pathway-next';pathNext.hidden=true;pathNext.tabIndex=-1;pathNext.setAttribute('role','status');pathPanel.append(pathNext);
const pathLink=n('a','');pathLink.id='pathway-open';pathLink.hidden=true;pathPanel.append(pathLink);
$('local-guide-next-heading').parentElement.before(pathPanel);
function clearPathOutput(){pathway.reveal=false;pathway.sensitive=false;pathway.next=null}
function renderPathway(){
 const l=state.language,i=l==='hi'?1:0,labels={
 maths:['Mathematics','गणित'],physics:['Physics','भौतिकी'],chemistry:['Chemistry','रसायन'],biology:['Biology','जीवविज्ञान'],
 all:['All activities','सभी गतिविधियाँ'],basic:['Basic models','बुनियादी मॉडल'],advanced:['Advanced main models','उन्नत मुख्य मॉडल'],supplement:['Supplemental activities','अतिरिक्त गतिविधियाँ']
 };
 $('pathway-heading').textContent=t('Source-grounded practice pathways','स्रोत आधारित अभ्यास मार्ग');
 $('pathway-notice').textContent=t('Choose a draft activity and next step yourself. No AI generation, grade mapping, stored choices or mastery inference.','मसौदा गतिविधि और अगला चरण स्वयं चुनें। AI उत्तर, कक्षा मिलान, सहेजे विकल्प या दक्षता अनुमान नहीं।');
 for(const [id,en,hi] of [['subject','Subject','विषय'],['kind','Activity type','गतिविधि प्रकार'],['activity','Draft activity','मसौदा गतिविधि']])$('pathway-'+id+'-label').textContent=t(en,hi);
 const options=(id,items,selected)=>{const el=$('pathway-'+id);el.replaceChildren(...items.map(([v,label])=>{const o=n('option','',label);o.value=v;return o}));if(items.some(x=>x[0]===selected))el.value=selected;return el.value};
 options('subject',['maths','physics','chemistry','biology'].map(k=>[k,labels[k][i]]),pathway.subject);
 options('kind',['all','basic','advanced','supplement'].map(k=>[k,labels[k][i]]),pathway.kind);
 const choices=pathwayChoices(pathway.subject,pathway.kind,l);
 pathway.key=options('activity',choices.map(x=>[x.key,x.title]),pathway.key);
 for(const [id,en,hi] of [['hint','Show source draft','स्रोत मसौदा देखें'],['adult','Ask a trusted adult','भरोसेमंद बड़े से मदद लें'],['repeat','Repeat','फिर करें'],['explain','Explain on paper','कागज़ पर समझाएँ'],['different','Another draft','दूसरा मसौदा'],['clear','Clear pathway','अभ्यास मार्ग मिटाएँ']])$('pathway-'+id).textContent=t(en,hi);
 for(const id of ['hint','repeat','explain','different'])$('pathway-'+id).disabled=!pathway.key;
 pathResult.hidden=!pathway.reveal&&!pathway.sensitive;pathResult.replaceChildren();pathNext.hidden=!pathway.next;pathNext.replaceChildren();pathLink.hidden=true;pathLink.removeAttribute('href');
 if(pathway.sensitive){const safe=pathwaySource({key:'',lang:l,risk:'sensitive'});pathResult.textContent=safe.text;return}
 if(pathway.reveal){
  const x=pathwaySource({key:pathway.key,lang:l,risk:'none'});
  pathResult.append(n('h4','',x.title),n('p','',x.prompt),n('p','',x.hint),n('p','',x.caveat),n('p','small',t('Unreviewed source: ','असमीक्षित स्रोत: ')+x.source+' · '+x.contentId+' · '+x.mode));
  pathLink.href=x.href;pathLink.hidden=false;
 }
 if(pathway.next){const x=pathwayNext({key:pathway.key,action:pathway.next,kind:pathway.kind,lang:l});pathNext.textContent=x.title+' — '+x.reason;pathLink.href=x.href;pathLink.hidden=false}
 pathLink.textContent=t('Open selected draft activity','चुनी मसौदा गतिविधि खोलें');
}
for(const id of ['subject','kind','activity'])$('pathway-'+id).addEventListener('change',e=>{if(id==='activity')pathway.key=e.target.value;else{pathway[id]=e.target.value;pathway.key=''}clearPathOutput();renderPathway()});
$('pathway-hint').addEventListener('click',()=>{clearPathOutput();pathway.reveal=true;renderPathway();pathResult.focus()});
$('pathway-adult').addEventListener('click',()=>{clearPathOutput();pathway.sensitive=true;renderPathway();pathResult.focus()});
for(const action of PATHWAY_ACTIONS)$('pathway-'+action).addEventListener('click',()=>{clearPathOutput();pathway.next=action;renderPathway();pathNext.focus()});
function resetPathway(){pathway.subject='maths';pathway.kind='all';pathway.key='';clearPathOutput()}
$('pathway-clear').addEventListener('click',()=>{resetPathway();renderPathway();$('pathway-subject').focus()});
function render(){renderPathway();
 $('local-guide-nav').textContent=t('Practice Guide','अभ्यास मार्गदर्शक');
 $('local-guide-title').textContent=t('Local Practice Guide — draft, not an AI tutor','स्थानीय अभ्यास मार्गदर्शक — मसौदा, AI शिक्षक नहीं');
 $('local-guide-intro').textContent=t('Choose a topic, level and language yourself. No login, AI inference, automatic aptitude label, personal details or stored recommendations.','विषय, अभ्यास स्तर और भाषा स्वयं चुनें। कोई लॉगिन, AI अनुमान, स्थायी क्षमता का लेबल, निजी जानकारी या सहेजे सुझाव नहीं।');
 $('local-guide-review').textContent=t('Every hint comes from an ORIGINAL UNREVIEWED teaching draft. Ask a teacher to verify explanations. This is not curriculum approval.','हर संकेत मूल असमीक्षित शिक्षण मसौदे से है। व्याख्या शिक्षक से जँचवाएँ। यह पाठ्यक्रम की स्वीकृति नहीं है।');
 for(const [id,en,hi] of [['local-guide-subject-label','Choose a subject','विषय चुनें'],['local-guide-difficulty-label','Choose practice level (not aptitude)','अभ्यास स्तर चुनें (क्षमता का माप नहीं)'],['local-guide-language-label','Practice language override','अभ्यास भाषा अलग से चुनें'],['local-guide-topic-label','Choose a fixed source topic for a draft hint','संकेत के लिए निश्चित स्रोत विषय चुनें']])$(id).textContent=t(en,hi);
 const subject=$('local-guide-subject'),difficulty=$('local-guide-difficulty'),language=$('local-guide-language'),topic=$('local-guide-topic');
 subject.value=state.subject;difficulty.value=state.difficulty;language.value=state.language;
 for(const [select,values] of [[subject,PRACTICE_SUBJECTS],[difficulty,PRACTICE_DIFFICULTIES]]){
  const chosen=select.value;select.replaceChildren();
  for(const v of values){const o=n('option','',v);o.value=v;o.textContent=({
   maths:t('Maths','गणित'),physics:t('Physics','भौतिकी'),chemistry:t('Chemistry','रसायन'),biology:t('Biology','जीवविज्ञान'),'digital-safety':t('Digital Safety','डिजिटल सुरक्षा'),
   gentle:t('Gentle','हल्का'),standard:t('Standard','सामान्य'),explore:t('Explore','खोज')})[v];select.append(o)}
  select.value=chosen;
 }
 const selected=state.hintId;topic.replaceChildren();
 for(const id of GUIDED_TOPIC_IDS){
  const option=n('option','',practiceTopic(id,state.language).title);option.value=id;topic.append(option);
 }
 topic.value=selected;
 $('local-guide-suggest').textContent=t('Suggest an optional activity','वैकल्पिक अभ्यास सुझाएँ');
 $('local-guide-decline').textContent=t('Decline / clear suggestion','सुझाव नहीं चाहिए / हटाएँ');
 $('local-guide-hint').textContent=t('Show source-backed draft hint','स्रोत-आधारित मसौदा संकेत दिखाएँ');
 $('local-guide-sensitive').textContent=t('I need a trusted adult, not a lesson answer','मुझे पाठ के उत्तर के बजाय भरोसेमंद बड़े की मदद चाहिए');
 $('local-guide-draft-hint').hidden=!state.response;
 if(state.response){
  const a=state.response;
  $('local-guide-draft-hint').textContent=a.text+' '+(a.attribution||'')+' '+
   (a.source?t('Source: ','स्रोत: ')+a.source:t('No verified reference available.','कोई सत्यापित संदर्भ उपलब्ध नहीं।'));
 }
 $('local-guide-recommendation').hidden=!state.recommendation;
 if(state.recommendation){
  $('local-guide-reason').textContent=state.recommendation.reason+' '+t('Practice suggestion only; it does not estimate mastery or intelligence.','यह सिर्फ अभ्यास-सुझाव है; पूर्ण दक्षता या बुद्धि का अनुमान नहीं।');
  $('local-guide-target').href=state.recommendation.href;
  $('local-guide-target').textContent=t('Open the existing local practice','मौजूदा स्थानीय अभ्यास खोलें');
 }
 $('local-guide-next-heading').textContent=t('Choose your next practice step (no score)','अगला अभ्यास स्वयं चुनें (कोई अंक नहीं)');
 for(const [id,en,hi] of [['repeat','Repeat this model','मॉडल फिर करें'],['explain','Explain the idea','विचार समझाएँ'],['different','Try a related topic','संबंधित विषय आज़माएँ'],['next-clear','Clear choice','विकल्प हटाएँ']])$('local-guide-'+id).textContent=t(en,hi);
 $('local-guide-next-result').hidden=state.nextChoice===null;
 if(state.nextChoice!==null){
  const x=nextPracticeChoice({id:state.hintId,choice:state.nextChoice,lang:state.language});
  $('local-guide-next-reason').textContent=x.title+' — '+x.reason+' '+t('Unreviewed draft; choose the topic yourself if opening a lab section.','असमीक्षित मसौदा; प्रयोग अनुभाग में विषय स्वयं चुनें।');
  $('local-guide-next-link').href=x.href;$('local-guide-next-link').textContent=t('Open draft practice','मसौदा अभ्यास खोलें');
 }
 $('local-guide-review-label').textContent=t('Optional next-day paper reminder (not saved)','वैकल्पिक कागज़ी दोहराव दिन (सहेजा नहीं जाएगा)');
 $('local-guide-review-1').textContent=t('Tomorrow (+1 day)','कल (+1 दिन)');
 $('local-guide-review-3').textContent=t('In 3 days','3 दिन में');
 $('local-guide-review-7').textContent=t('In 7 days','7 दिन में');
 $('local-guide-review-clear').textContent=t('Clear the optional date','वैकल्पिक तारीख हटाएँ');
 $('local-guide-day').textContent=state.scheduled? t('Optional reminder: ','वैकल्पिक याद का दिन: ')+state.scheduled.day+
 t('. Write it down if you want; no notification, streak or penalty.','. चाहें तो लिख लें; कोई सूचना, स्ट्रीक या दंड नहीं।'):
 t('No date selected. There are no automatic reminders.','कोई तारीख नहीं चुनी। कोई स्वचालित याद नहीं।');
 $('local-guide-fraction-title').textContent=t('Fraction five-step practice (reuses the original Studio draft)','भिन्नों का पाँच चरण अभ्यास (मूल स्टूडियो मसौदा)');
 const stage=FRACTION_FIVE_STAGES[state.fracStage];
 const result=fractionStage(stage,state.shaded,state.language);
 $('local-guide-fraction-stage').textContent=t('Stage ','चरण ')+(state.fracStage+1)+'/5 · '+stage.toUpperCase();
 $('local-guide-fraction-question').textContent=result.question;
 $('local-guide-fraction-text').textContent=result.text+' '+t('Source: original unreviewed Studio fraction content.','स्रोत: मूल असमीक्षित स्टूडियो भिन्न सामग्री।');
 $('local-guide-fraction-count').textContent=state.shaded+'/4';
 $('local-guide-fraction-adjust').hidden=stage!=='try';
 $('local-guide-fraction-dec').disabled=state.shaded===0;
 $('local-guide-fraction-inc').disabled=state.shaded===4;
 $('local-guide-fraction-dec').setAttribute('aria-label',t('Shade fewer parts','कम हिस्से रंगें'));
 $('local-guide-fraction-inc').setAttribute('aria-label',t('Shade more parts','और हिस्से रंगें'));
 $('local-guide-fraction-check').hidden=stage!=='try';
 $('local-guide-fraction-check').textContent=t('Check 2/4 = 1/2','2/4 = 1/2 जाँचें');
 $('local-guide-fraction-feedback').hidden=state.fracFeedback===undefined;
 if(state.fracFeedback!==undefined)$('local-guide-fraction-feedback').textContent=t(state.fracFeedback?'Example matched. ':'Try shading two equal parts. ',state.fracFeedback?'उदाहरण सही। ':'दो बराबर हिस्से रंगकर आज़माएँ। ')+result.explanation;
 $('local-guide-fraction-prev').disabled=state.fracStage===0;$('local-guide-fraction-next').disabled=state.fracStage===4;
 $('local-guide-fraction-prev').textContent=t('Previous stage','पिछला चरण');
 $('local-guide-fraction-next').textContent=t('Next stage (no score required)','अगला चरण (अंक आवश्यक नहीं)');
}
function resetGuide(){resetPathway();state.hintId='studio:fractions';state.subject='maths';state.difficulty='gentle';state.nextChoice=null;state.response=null;state.recommendation=null;state.scheduled=null;state.fracStage=0;state.shaded=0;delete state.fracFeedback;render()}
$('local-guide-subject').addEventListener('change',e=>{state.subject=e.target.value;state.recommendation=null;render()});
$('local-guide-difficulty').addEventListener('change',e=>{state.difficulty=e.target.value;state.recommendation=null;render()});
$('local-guide-language').addEventListener('change',e=>{state.language=e.target.value;state.response=null;state.recommendation=null;render()});
$('local-guide-topic').addEventListener('change',e=>{state.hintId=e.target.value;state.response=null;state.nextChoice=null;render()});
$('local-guide-suggest').addEventListener('click',()=>{state.recommendation=recommendPractice({subject:state.subject,difficulty:state.difficulty,lang:state.language});render();$('local-guide-reason').focus()});
$('local-guide-decline').addEventListener('click',()=>{state.recommendation=null;render();$('local-guide-suggest').focus()});
$('local-guide-hint').addEventListener('click',()=>{state.response=guidedHint(state.hintId,state.language);render();$('local-guide-draft-hint').focus()});
$('local-guide-sensitive').addEventListener('click',()=>{state.response=guidedHint('',state.language,'sensitive');render();$('local-guide-draft-hint').focus()});
for(const choice of NEXT_PRACTICE_CHOICES)$('local-guide-'+choice).addEventListener('click',()=>{state.nextChoice=choice;render();$('local-guide-next-reason').focus()});
$('local-guide-next-clear').addEventListener('click',()=>{state.nextChoice=null;render();$('local-guide-repeat').focus()});
for(const gap of [1,3,7])$('local-guide-review-'+gap).addEventListener('click',()=>{
 state.scheduled=optionalReviewDay(new Date().toISOString().slice(0,10),gap);render();$('local-guide-day').focus()
});
$('local-guide-review-clear').addEventListener('click',()=>{state.scheduled=null;render();$('local-guide-day').focus()});
$('local-guide-fraction-inc').addEventListener('click',()=>{state.shaded=Math.min(4,state.shaded+1);delete state.fracFeedback;render();$('local-guide-fraction-inc').focus()});
$('local-guide-fraction-dec').addEventListener('click',()=>{state.shaded=Math.max(0,state.shaded-1);delete state.fracFeedback;render();$('local-guide-fraction-dec').focus()});
$('local-guide-fraction-check').addEventListener('click',()=>{state.fracFeedback=fractionStage('try',state.shaded,state.language).correct;render();$('local-guide-fraction-feedback').focus()});
for(const [id,delta] of [['local-guide-fraction-prev',-1],['local-guide-fraction-next',1]])$(id).addEventListener('click',()=>{
 state.fracStage=Math.max(0,Math.min(4,state.fracStage+delta));delete state.fracFeedback;render();$('local-guide-fraction-question').focus()
});
$('lang').addEventListener('change',()=>{if(!$('local-guide-language').dataset.userSelected){state.language=$('lang').value;render()}});
$('local-guide-language').addEventListener('change',()=>{$('local-guide-language').dataset.userSelected='true'});
window.addEventListener('aifs-history-cleared',resetGuide);
render();
