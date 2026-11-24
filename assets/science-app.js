/** M31 standalone Science Lab controls: no student data, no network, no roster, no AI inference.
 * Native HTML buttons + named textual states; draft teaching content unreviewed.
 */
import {
 SCIENCE_IDS,SCIENCE_STAGES,SCIENCE_MODELS,scienceModel,scienceText,
 scienceEvaluate,scienceChoiceCheck,scienceExplain
} from './science-engine.js';
import {SCIENCE_SNAPSHOT_LIMIT,captureScienceSnapshot,restoreScienceSnapshot,scienceSnapshotRows} from './science-snapshots.js';
const $=id=>document.getElementById(id);
const node=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const fresh=(id='motion')=>({id,stage:0,values:{...scienceModel(id).initial},answer:null,feedback:null,snapshots:[]});
const demoScience=new URLSearchParams(location.search).get('demo');
let S=fresh(SCIENCE_IDS.includes(demoScience?.slice(8))&&demoScience.startsWith('science/')?demoScience.slice(8):'motion');
const lang=()=>$('lang')?.value==='hi'?'hi':'en';
const t=x=>scienceText(x,lang());
const p=(en,hi)=>lang()==='hi'?hi:en;
function actionButton(action,label,pressed=null,disabled=false){
 const b=node('button','btn outline compact',label);b.type='button';
 b.dataset.scienceAction=action;b.disabled=disabled;
 if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));
 return b;
}
function gotoStage(step){
 S.stage=Math.max(0,Math.min(SCIENCE_STAGES.length-1,step));
 S.feedback=null;S.answer=null;render();
 $('science-question').focus();
}
function controls(){
 const area=$('science-controls');area.replaceChildren();
 const model=scienceModel(S.id);
 for(const field of model.fields){
  const group=node('div','science-control-group');
  const label=node('strong','',t(field.label));group.append(label);
  const value=S.values[field.id];
  if(field.options){
   const choices=node('div','science-control-choices');
   choices.setAttribute('role','group');
   choices.setAttribute('aria-label',t(field.label));
   for(const option of field.options){
    const b=actionButton('select:'+field.id+':'+option.value,t(option.label),option.value===value);
    choices.append(b);
   }
   group.append(choices);
  }else{
   const adjust=node('div','science-number-control');
   const down=actionButton('dec:'+field.id,'−',null,value<=field.min);
   down.setAttribute('aria-label',p(`Decrease ${field.label[0]} by ${field.step} ${field.unit}`,`${field.label[1]} ${field.step} ${field.unit} घटाएँ`));
   const out=node('output','science-number-value',String(value)+' '+field.unit);
   out.setAttribute('aria-label',t(field.label));
   out.id='science-output-'+field.id;
   const up=actionButton('inc:'+field.id,'+',null,value>=field.max);
   up.setAttribute('aria-label',p(`Increase ${field.label[0]} by ${field.step} ${field.unit}`,`${field.label[1]} ${field.step} ${field.unit} बढ़ाएँ`));
   adjust.append(down,out,up);group.append(adjust);
  }
  area.append(group);
 }
 area.append(node('p','science-explanation',scienceExplain(S.id,S.values,lang())));
}
function renderSnapshots(active){
 const panel=$('science-snapshot-panel');panel.hidden=!active;
 const rows=scienceSnapshotRows(S.id,S.snapshots,lang()),host=$('science-snapshot-rows'),select=$('science-snapshot-select'),previous=select.value;
 $('science-snapshot-heading').textContent=p('Temporary model snapshots','अस्थायी मॉडल स्थितियाँ');
 $('science-snapshot-notice').textContent=p('Keep up to three different computer model states. Compare explanations, not marks or real experiments. Nothing is saved after leaving this page.','अधिकतम तीन अलग कंप्यूटर मॉडल स्थितियाँ रखें। व्याख्याएँ मिलाएँ, अंक या वास्तविक प्रयोग नहीं। पृष्ठ छोड़ने के बाद कुछ सहेजा नहीं जाता।');
 $('science-snapshot-add').textContent=p('Capture current state','वर्तमान स्थिति चुनें');
 $('science-snapshot-clear').textContent=p('Clear snapshots','स्थितियाँ मिटाएँ');
 $('science-snapshot-restore').textContent=p('Restore selected state','चुनी स्थिति लौटाएँ');
 $('science-snapshot-select-label').textContent=p('State to restore','लौटाने की स्थिति');
 $('science-snapshot-status').textContent=rows.length+' / '+SCIENCE_SNAPSHOT_LIMIT+' '+p('temporary states','अस्थायी स्थितियाँ');
 host.replaceChildren();select.replaceChildren();
 for(const r of rows){
  const label=p('State ','स्थिति ')+(r.index+1),o=node('option','',label);o.value=String(r.index);select.append(o);
  const group=node('section',''),list=node('ul','');
  for(const f of r.controls)list.append(node('li','',f.label+': '+f.value));
  group.append(node('h5','',label),list,node('p','',r.explanation));host.append(group);
 }
 if(rows.some(r=>String(r.index)===previous))select.value=previous;
 select.disabled=!active||!rows.length;
 $('science-snapshot-clear').disabled=!active||!rows.length;$('science-snapshot-restore').disabled=!active||!rows.length;
 $('science-snapshot-add').disabled=!active||rows.length===SCIENCE_SNAPSHOT_LIMIT||S.snapshots.some(s=>Object.keys(s).every(k=>s[k]===S.values[k]));
}
function quiz(){
 const area=$('science-quiz');area.replaceChildren();
 const play=scienceModel(S.id).play;
 const field=node('fieldset','science-quiz-fieldset');
 const legend=node('legend','',t(play.question));field.append(legend);
 for(let i=0;i<play.options.length;i++)field.append(actionButton('answer:'+i,t(play.options[i]),S.answer===i));
 area.append(field);
}
function render(){
 const model=scienceModel(S.id),name=SCIENCE_STAGES[S.stage];
 $('science-nav').textContent=p('Science Lab','विज्ञान प्रयोगशाला');
 $('science-title').textContent=p('Science Concept Lab — 7 draft models','विज्ञान अवधारणा प्रयोगशाला — 7 प्रारंभिक मॉडल');
 $('science-intro').textContent=p('Bilingual button-based simulations across Physics, Chemistry and Biology. No real experiments, learner accounts or mastery claim.','भौतिकी, रसायन और जीवविज्ञान के बटन-आधारित द्विभाषी मॉडल। कोई वास्तविक प्रयोग, छात्र खाता या पूर्ण दक्षता का दावा नहीं।');
 $('science-notice').textContent=p('UNREVIEWED drafts. Subject/Hindi teacher review and verified textbook mapping are pending.','असमीक्षित प्रारूप। विषय व हिंदी शिक्षकों की समीक्षा तथा सत्यापित पाठ्यपुस्तक मिलान बाकी है।');
 const tabs=$('science-tabs');tabs.replaceChildren();
 for(const id of SCIENCE_IDS)tabs.append(actionButton('mode:'+id,t(SCIENCE_MODELS[id].title),S.id===id));
 $('science-heading').textContent=t(model.title);
 $('science-stage').textContent=p(`Stage ${S.stage+1}/5: ${name.toUpperCase()}`,`चरण ${S.stage+1}/5: ${({learn:'सीखें',try:'आज़माएँ',play:'खेलें',understand:'समझें',grow:'आगे बढ़ें'})[name]}`);
 $('science-concept').textContent=t(model.concept);
 $('science-caveat').textContent=t(model.caveat);
 $('science-question').textContent=name==='learn'?t(model.title):
  name==='try'?t(model.prompt):name==='play'?t(model.play.question):
  name==='understand'?p('Compare your state with the reference model','अपनी स्थिति और संदर्भ मॉडल की तुलना करें'):
  p('Optional no-screen mission','बिना स्क्रीन के वैकल्पिक गतिविधि');
 $('science-hint').textContent=name==='try'?t(model.hint):'';
 $('science-hint').hidden=name!=='try';
 const tryStage=name==='try',playStage=name==='play';
 $('science-controls').hidden=!tryStage;
 $('science-quiz').hidden=!playStage;
 $('science-check').hidden=!tryStage&&!playStage;
 $('science-check').textContent=p('Check this draft exercise','इस प्रारूप अभ्यास की जाँच करें');
 $('science-reset').hidden=!tryStage&&!playStage;
 $('science-reset').textContent=p('Reset this activity','यह गतिविधि फिर शुरू करें');
 $('science-mission').hidden=name!=='grow';
 $('science-mission').textContent=name==='grow'?t(model.mission):'';
 $('science-understand').hidden=name!=='understand';
 $('science-understand').textContent=name==='understand'?
  p('Target example: ','लक्ष्य का उदाहरण: ')+scienceExplain(S.id,model.target,lang()):'';
 if(tryStage)controls();
 renderSnapshots(tryStage);
 if(playStage)quiz();
 const feedback=$('science-feedback');feedback.hidden=!S.feedback;
 if(S.feedback){
  feedback.textContent=S.feedback.needsChoice?
   p('Choose one answer before checking. No score is recorded.','जाँच से पहले एक उत्तर चुनें। कोई अंक दर्ज नहीं होगा।'):
   p(S.feedback.correct?'This practice step matches the example. ':'Please compare with the hint and try again. ',
    S.feedback.correct?'यह अभ्यास उदाहरण से मेल खाता है। ':'संकेत देखकर फिर कोशिश करें। ')+
    (tryStage?scienceExplain(S.id,S.values,lang()):
     p('This is one example and not a validated measure of understanding.','यह केवल एक उदाहरण है, समझ की सत्यापित जाँच नहीं।'));
 }
 $('science-prev').disabled=S.stage===0;
 $('science-next').disabled=S.stage===SCIENCE_STAGES.length-1;
 $('science-prev').textContent=p('Previous stage','पिछला चरण');
 $('science-next').textContent=p('Next stage (no score required)','अगला चरण (अंक जरूरी नहीं)');
 $('science-help').textContent=p('Five steps: Learn → Try → Play → Understand → Grow. You may retry or skip; no score or personal response is stored.','पाँच चरण: सीखें → आज़माएँ → खेलें → समझें → आगे बढ़ें। दोबारा कर सकते हैं या आगे जा सकते हैं; कोई अंक या निजी उत्तर सेव नहीं होता।');
}
$('science-lab').addEventListener('click',event=>{
 const b=event.target.closest('button[data-science-action]');if(!b)return;
 const act=b.dataset.scienceAction,parts=act.split(':');
 if(parts[0]==='mode'){
  S=fresh(parts[1]);render();$('science-question').focus();return;
 }
 if(parts[0]==='answer'){
  S.answer=Number(parts[1]);S.feedback=null;render();
 }else if(parts[0]==='select'){
  const field=parts[1],value=parts.slice(2).join(':');
  const meta=scienceModel(S.id).fields.find(x=>x.id===field);
  if(!meta?.options.some(x=>x.value===value))return;
  S.values[field]=value;S.feedback=null;render();
 }else if(parts[0]==='inc'||parts[0]==='dec'){
  const field=parts[1],meta=scienceModel(S.id).fields.find(x=>x.id===field);
  if(!meta||meta.options)return;
  S.values[field]=Math.max(meta.min,Math.min(meta.max,S.values[field]+(parts[0]==='inc'?meta.step:-meta.step)));
  S.feedback=null;render();
 }
 const equivalent=[...$('science-lab').querySelectorAll('button[data-science-action]')].find(x=>x.dataset.scienceAction===act);
 if(equivalent&&!equivalent.disabled)equivalent.focus();
});
$('science-check').addEventListener('click',()=>{
 if(SCIENCE_STAGES[S.stage]==='try')S.feedback={correct:scienceEvaluate(S.id,S.values).correct};
 else if(SCIENCE_STAGES[S.stage]==='play'){
  if(S.answer===null){S.feedback={needsChoice:true,correct:false};render();$('science-feedback').focus();return}
  S.feedback={correct:scienceChoiceCheck(S.id,S.answer)};
 }else return;
 render();$('science-feedback').focus();
});
$('science-reset').addEventListener('click',()=>{
 S.values={...scienceModel(S.id).initial};S.answer=null;S.feedback=null;S.snapshots=[];
 render();$('science-question').focus();
});
$('science-snapshot-add').addEventListener('click',()=>{if(SCIENCE_STAGES[S.stage]!=='try')return;S.snapshots=captureScienceSnapshot(S.id,S.snapshots,S.values);renderSnapshots(true);$('science-snapshot-status').focus()});
$('science-snapshot-clear').addEventListener('click',()=>{if(SCIENCE_STAGES[S.stage]!=='try')return;S.snapshots=[];renderSnapshots(true);$('science-snapshot-add').focus()});
$('science-snapshot-restore').addEventListener('click',()=>{if(SCIENCE_STAGES[S.stage]!=='try'||!S.snapshots.length)return;S.values=restoreScienceSnapshot(S.id,S.snapshots,Number($('science-snapshot-select').value));S.feedback=null;S.answer=null;render();$('science-question').focus()});
$('science-prev').addEventListener('click',()=>gotoStage(S.stage-1));
$('science-next').addEventListener('click',()=>gotoStage(S.stage+1));
$('lang').addEventListener('change',render);
window.addEventListener('aifs-teacher-demo',event=>{
 const id=typeof event.detail==='string'&&event.detail.startsWith('science/')?event.detail.slice(8):null;
 if(!SCIENCE_IDS.includes(id))return;S=fresh(id);render();$('science-question').focus();
});
window.addEventListener('aifs-history-cleared',()=>{S=fresh();render()});
render();
