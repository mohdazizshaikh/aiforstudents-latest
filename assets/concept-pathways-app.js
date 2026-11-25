import {conceptChoices,createConceptSession,conceptSuggestion,conceptAction} from './concept-pathways.js';
const $=id=>document.getElementById(id),root=$('concept-pathways');
let lang='en',state=createConceptSession('ratio-algebra:equation');
const p=(en,hi)=>lang==='hi'?hi:en;
function render(){
 root.lang=lang;
 $('concept-title').textContent=p('Optional concept pathway','वैकल्पिक विषय क्रम');
 $('concept-note').textContent=p('Choose a goal. Suggested earlier concepts are optional and unreviewed, not grade placement or mastery. Nothing is saved.','लक्ष्य चुनें। पहले के सुझाए विषय वैकल्पिक और असमीक्षित हैं, कक्षा निर्धारण या महारत नहीं। कुछ सहेजा नहीं जाता।');
 $('concept-lang-label').textContent=p('Language','भाषा');$('concept-goal-label').textContent=p('Choose your concept','अपना विषय चुनें');
 $('concept-goal').replaceChildren(...conceptChoices(lang).map(x=>{const o=document.createElement('option');o.value=x.key;o.textContent=x.title;return o}));
 $('concept-goal').value=state.target;
 const v=conceptSuggestion(state,lang),current=$('concept-next');current.replaceChildren();
 if(v.next){
  const link=document.createElement('a');link.href=v.next.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent=v.next.title+' — '+p('open in new tab','नए टैब में खोलें');
  const reason=document.createElement('p');reason.textContent=v.next.reason;current.append(link,reason);
 }else current.textContent=p('End of this optional sequence. Choose another goal or reset.','वैकल्पिक क्रम समाप्त। दूसरा लक्ष्य चुनें या रीसेट करें।');
 $('concept-goal-link').href=v.target.href;$('concept-goal-link').textContent=p('Open chosen goal now (new tab)','चुना लक्ष्य अभी खोलें (नया टैब)');
 const labels={explored:p('Marked explored','देखा चिह्नित'),skipped:p('Skipped','छोड़ा'),suggested:p('Suggested','सुझाया')};
 $('concept-list').replaceChildren(...v.sequence.map(x=>{const e=document.createElement('li');e.textContent=x.title+' — '+labels[x.status];return e}));
 $('concept-status').textContent=p('Marked explored: ','देखा चिह्नित: ')+v.explored+' · '+p('Skipped: ','छोड़ा: ')+v.skipped;
 $('concept-explore').textContent=p('Mark explored and continue','देखा चिह्नित करें और आगे बढ़ें');$('concept-skip').textContent=p('Skip suggestion','सुझाव छोड़ें');$('concept-reset').textContent=p('Reset pathway','विषय क्रम रीसेट करें');
 $('concept-explore').disabled=$('concept-skip').disabled=!v.next;
}
$('concept-goal').addEventListener('change',()=>{state=createConceptSession($('concept-goal').value);render()});
$('concept-lang').addEventListener('change',()=>{lang=$('concept-lang').value;render()});
for(const t of ['explore','skip','reset'])$('concept-'+t).addEventListener('click',()=>{state=conceptAction(state,t);render();if(document.activeElement?.disabled)$('concept-status').focus()});
function reset(){state=createConceptSession('ratio-algebra:equation');render()}
window.addEventListener('aifs-history-cleared',reset);
try{const channel=new BroadcastChannel('aifs-discovery-privacy-reset-v1');channel.addEventListener('message',e=>{if(e.data?.type==='clear-history')reset()})}catch{}
window.addEventListener('storage',e=>{if(e.key==='aifs-privacy-clear-signal-v1'&&e.newValue==='clear')reset()});
window.addEventListener('pageshow',e=>{if(e.persisted)reset()});
render();
