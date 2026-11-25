import {exploreActivities,EXPLORER_SUBJECTS,EXPLORER_KINDS} from './activity-explorer-engine.js';
const $=id=>document.getElementById(id),root=$('activity-explorer');
let language='en',subject='all',kind='all',page=1;
const p=(en,hi)=>language==='hi'?hi:en;
const n=(tag,t)=>{const x=document.createElement(tag);if(t!==undefined)x.textContent=t;return x};
function link(t,href){const a=n('a',t);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a}
function options(select,keys,labels,current){
 select.replaceChildren(...keys.map(k=>{const o=n('option',labels[k]);o.value=k;return o}));select.value=current;
}
function render(){
 root.lang=language;
 const v=exploreActivities({language,subject,kind,page});page=v.page;
 const subjects={all:p('All subjects','सभी विषय'),maths:p('Mathematics','गणित'),physics:p('Physics topics','भौतिकी विषय'),chemistry:p('Chemistry topics','रसायन विषय'),biology:p('Biology topics','जीवविज्ञान विषय')};
 const kinds={all:p('All types','सभी प्रकार'),basic:p('Basic models','मूल मॉडल'),advanced:p('Advanced models','उन्नत मॉडल'),supplement:p('Supplementary activities','पूरक गतिविधियाँ'),prototype:p('New draft prototypes','नए मसौदा मॉडल')};
 $('ae-title').textContent=p('Explore all draft learning activities','सभी मसौदा सीखने की गतिविधियाँ खोजें');
 $('ae-note').textContent=p('Choose any topic for exploration, not an official class recommendation or assessment. Worksheets are unreviewed paper drafts. No selections are saved.','खोज के लिए कोई विषय चुनें; यह आधिकारिक कक्षा सुझाव या आकलन नहीं है। अभ्यास पत्र असमीक्षित कागज़ी मसौदे हैं। चयन सहेजे नहीं जाते।');
 $('ae-lang-label').textContent=p('Language','भाषा');$('ae-lang').value=language;
 $('ae-subject-label').textContent=p('Subject topic','विषय');$('ae-kind-label').textContent=p('Activity type','गतिविधि प्रकार');
 options($('ae-subject'),EXPLORER_SUBJECTS,subjects,subject);options($('ae-kind'),EXPLORER_KINDS,kinds,kind);
 $('ae-status').textContent=p('Matching activities: ','मिली गतिविधियाँ: ')+v.total+' / '+v.catalogTotal+' · '+p('Page ','पृष्ठ ')+v.page+' / '+v.pages;
 $('ae-results').replaceChildren(...v.items.map(x=>{
  const li=n('li'),heading=n('h3',x.title),metadata=n('p',subjects[x.subject]+' · '+kinds[x.kind]),actions=n('div');
  actions.className='workspace-actions';actions.append(link(p('Open activity (new tab)','गतिविधि खोलें (नया टैब)'),x.href),link(p('Open draft worksheet (new tab)','मसौदा अभ्यास पत्र खोलें (नया टैब)'),x.worksheetHref));
  li.append(heading,metadata,actions);return li;
 }));
 $('ae-empty').hidden=v.total!==0;$('ae-empty').textContent=p('No matching draft. Try another filter.','कोई मेल खाता मसौदा नहीं। दूसरा फ़िल्टर चुनें।');
 $('ae-prev').textContent=p('Previous page','पिछला पृष्ठ');$('ae-prev').disabled=page<=1;
 $('ae-next').textContent=p('Next page','अगला पृष्ठ');$('ae-next').disabled=page>=v.pages;
 $('ae-clear').textContent=p('Reset filters','फ़िल्टर रीसेट करें');
}
$('ae-lang').addEventListener('change',()=>{language=$('ae-lang').value;render()});
$('ae-subject').addEventListener('change',()=>{subject=$('ae-subject').value;page=1;render()});
$('ae-kind').addEventListener('change',()=>{kind=$('ae-kind').value;page=1;render()});
for(const [id,delta] of [['ae-prev',-1],['ae-next',1]])$(id).addEventListener('click',()=>{page+=delta;render();$('ae-status').focus()});
function reset(){subject='all';kind='all';page=1;render()}
$('ae-clear').addEventListener('click',()=>{reset();$('ae-status').focus()});
window.addEventListener('aifs-history-cleared',reset);
let channel=null;function connect(){if(channel)return;try{channel=new BroadcastChannel('aifs-discovery-privacy-reset-v1');channel.addEventListener('message',e=>{if(e.data?.type==='clear-history')reset()})}catch{channel=null}}
connect();window.addEventListener('pagehide',()=>{channel?.close();channel=null});
window.addEventListener('pageshow',e=>{connect();if(e.persisted)reset()});
window.addEventListener('storage',e=>{if(e.key==='aifs-privacy-clear-signal-v1'&&e.newValue==='clear')reset()});
render();
