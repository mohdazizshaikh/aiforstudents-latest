import {WORKSPACE_LIMIT,createWorkspace,workspaceChoices,workspaceAction,workspaceView} from './workspace-engine.js';
const $=id=>document.getElementById(id);
const root=$('workspace'),role=root.dataset.role;
let state=createWorkspace(role),language='en';
const p=(en,hi)=>language==='hi'?hi:en;
const node=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e};
function link(text,href){const a=node('a',text);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a}
function change(type,key){
 state=workspaceAction(state,key===undefined?{type}:{type,key});render();
 // Focus stays on a stable control or the status when it has become disabled.
 if(document.activeElement?.disabled)$('workspace-status').focus();
}
function render(){
 root.lang=language;
 const teacher=role==='teacher',view=workspaceView(state,language),planning=state.phase==='planning',running=state.phase==='running',paused=state.phase==='paused';
 const title=teacher?p('Teacher planning workspace','शिक्षक योजना कार्यक्षेत्र'):p('My learning workspace','मेरा सीखने का कार्यक्षेत्र');
 $('workspace-title').textContent=title;
 $('workspace-notice').textContent=teacher?p('Unreviewed draft rehearsal. No pupil records. Open resources in fresh tabs and keep this workspace open. Reload or close clears the plan.','असमीक्षित मसौदा पूर्वाभ्यास। विद्यार्थी रिकॉर्ड नहीं। संसाधन नए टैब में खोलें और यह कार्यक्षेत्र खुला रखें। फिर लोड या बंद करने पर योजना मिटती है।'):p('Choose your own activities. Marking a visit is optional, not a score or mastery result. New tabs do not report back. Reload or close clears the plan.','अपनी गतिविधियाँ चुनें। देखने का निशान वैकल्पिक है, अंक या महारत नहीं। नए टैब परिणाम वापस नहीं भेजते। फिर लोड या बंद करने पर योजना मिटती है।');
 $('workspace-lang-label').textContent=p('Language','भाषा');
 $('workspace-choice-label').textContent=p('Choose an activity','गतिविधि चुनें');
 $('workspace-queue-label').textContent=p('Selected activity to move or remove','स्थान बदलने या हटाने के लिए चुनी गतिविधि');
 const previous=$('workspace-choice').value,selected=$('workspace-queue').value,options=workspaceChoices(role,language);
 $('workspace-choice').replaceChildren(...options.map(x=>{const e=node('option',x.title);e.value=x.key;return e}));
 if(options.some(x=>x.key===previous))$('workspace-choice').value=previous;
 $('workspace-queue').replaceChildren(...view.items.map(x=>{const e=node('option',x.position+'. '+x.title);e.value=x.key;return e}));
 if(state.keys.includes(selected))$('workspace-queue').value=selected;
 $('workspace-choice').disabled=!planning;$('workspace-queue').disabled=!planning||!state.keys.length;
 const i=state.keys.indexOf($('workspace-queue').value);
 const buttons={add:[p('Add','जोड़ें'),!planning||state.keys.length>=WORKSPACE_LIMIT||state.keys.includes($('workspace-choice').value)],remove:[p('Remove','हटाएँ'),!planning||i<0],up:[p('Move earlier','पहले करें'),!planning||i<=0],down:[p('Move later','बाद में करें'),!planning||i<0||i>=state.keys.length-1],start:[p('Start plan','योजना शुरू करें'),!planning||!state.keys.length],clear:[p('Clear and reset','मिटाएँ और रीसेट करें'),false],visited:[p('Mark visited and continue','देखा चिह्नित करें और आगे बढ़ें'),!running],skip:[p('Skip','छोड़ें'),!running],next:[p('Next activity','अगली गतिविधि'),!running],pause:[p('Pause','रोकें'),!running],resume:[p('Resume','फिर शुरू करें'),!paused]};
 for(const [id,[label,disabled]] of Object.entries(buttons)){const b=$('workspace-'+id);b.textContent=label;b.disabled=disabled;b.hidden=teacher?['visited','skip'].includes(id):['next','pause','resume'].includes(id)}
 const phase={planning:p('Planning','योजना'),running:p('In progress','चल रही है'),paused:p('Paused','रुकी है'),finished:p('Finished','पूरी हुई')};
 const status={planned:p('Planned','नियोजित'),current:p('Current','वर्तमान'),visited:teacher?p('Advanced','आगे बढ़े'):p('Marked visited','देखा चिह्नित'),skipped:p('Skipped','छोड़ा')};
 $('workspace-status').textContent=phase[view.phase]+' · '+p('Selected: ','चुनी: ')+view.summary.planned+' / '+WORKSPACE_LIMIT+' · '+p('Remaining: ','शेष: ')+view.summary.remaining;
 $('workspace-summary').textContent=teacher?p('Activities advanced: ','आगे बढ़ी गतिविधियाँ: ')+view.summary.visited:p('Marked visited: ','देखा चिह्नित: ')+view.summary.visited+' · '+p('Skipped: ','छोड़ी: ')+view.summary.skipped;
 $('workspace-direct-title').textContent=p('Open any resource (new tab)','कोई संसाधन खोलें (नया टैब)');
 const chosen=options.find(x=>x.key===$('workspace-choice').value);
 $('workspace-direct').replaceChildren();
 if(chosen){$('workspace-direct').append(link(chosen.title,chosen.href));if(teacher&&chosen.worksheetHref)$('workspace-direct').append(link(p('Open draft worksheet (new tab)','मसौदा अभ्यास पत्र खोलें (नया टैब)'),chosen.worksheetHref))}
 $('workspace-current-title').textContent=p('Current activity','वर्तमान गतिविधि');
 $('workspace-current').replaceChildren();
 if(view.current){
  $('workspace-current').append(node('p',view.current.title));
  if(running){$('workspace-current').append(link(p('Open activity (new tab)','गतिविधि खोलें (नया टैब)'),view.current.href));if(teacher&&view.current.worksheetHref)$('workspace-current').append(link(p('Open draft worksheet (new tab)','मसौदा अभ्यास पत्र खोलें (नया टैब)'),view.current.worksheetHref))}
 }else $('workspace-current').append(node('p',p('No active activity','कोई सक्रिय गतिविधि नहीं')));
 $('workspace-list-title').textContent=p('Selected sequence','चुना क्रम');
 $('workspace-list').replaceChildren(...view.items.map(x=>node('li',x.title+' — '+status[x.status])));
}
for(const t of ['add','remove','up','down','start','clear','visited','skip','next','pause','resume'])$('workspace-'+t).addEventListener('click',()=>change(t,t==='add'?$('workspace-choice').value:['remove','up','down'].includes(t)?$('workspace-queue').value:undefined));
for(const id of ['workspace-choice','workspace-queue'])$(id).addEventListener('change',render);
$('workspace-lang').addEventListener('change',()=>{language=$('workspace-lang').value;render()});
function reset(){state=createWorkspace(role);render()}
window.addEventListener('aifs-history-cleared',reset);
let privacyChannel=null;
function connectPrivacy(){if(privacyChannel)return;try{privacyChannel=new BroadcastChannel('aifs-discovery-privacy-reset-v1');privacyChannel.addEventListener('message',e=>{if(e.data?.type==='clear-history')reset()})}catch{privacyChannel=null}}
connectPrivacy();
window.addEventListener('pagehide',()=>{privacyChannel?.close();privacyChannel=null});
window.addEventListener('storage',e=>{if(e.key==='aifs-privacy-clear-signal-v1'&&e.newValue==='clear')reset()});
window.addEventListener('pageshow',e=>{connectPrivacy();if(e.persisted)reset()});
render();
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('../service-worker.js').catch(()=>{});
