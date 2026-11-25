import {resolvePrototypeLaunch} from './extended-lab-catalog.js';
import {PRIMARY_IDS,primaryDefinition,primaryInitial,evaluatePrimary} from './primary-maths-lab.js';
const $=id=>document.getElementById(id),root=$('primary-maths-lab');
let id=PRIMARY_IDS[0],lang='en',values=primaryInitial(id);
const p=(en,hi)=>lang==='hi'?hi:en;
const e=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
function renderResults(){
 const r=evaluatePrimary(id,values,lang);
 $('primary-results').replaceChildren(...r.rows.map(row=>{const li=e('li',row.label+': '+row.value);return li}));
 const box=$('primary-visual'),v=r.visual;box.replaceChildren();
 if(v.kind==='polygon'){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 220 220');svg.classList.add('primary-polygon');
  const polygon=document.createElementNS(svg.namespaceURI,'polygon');polygon.setAttribute('points',Array.from({length:v.sides},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/v.sides;return (110+85*Math.cos(a)).toFixed(2)+','+(110+85*Math.sin(a)).toFixed(2)}).join(' '));svg.append(polygon);box.append(svg);
 }else if(v.kind==='hundred-grid'){
  const grid=e('div');grid.className='primary-hundred-grid';for(let i=0;i<100;i++){const cell=e('span');if(i<v.filled)cell.className='filled';grid.append(cell)}box.append(grid);
 }else if(v.kind==='groups'){
  for(let i=0;i<v.groups;i++){const row=e('div','● '.repeat(v.each).trim());row.className='primary-counter-group';box.append(row)}
 }else{
  for(let i=0;i<v.height;i++){const layer=e('div');layer.className='primary-counter-group';for(let j=0;j<v.width;j++)layer.append(e('div','■ '.repeat(v.length).trim()));box.append(layer)}
 }
}
function render(){
 root.lang=lang;
 $('primary-title').textContent=p('New primary maths draft models','नए प्रारंभिक गणित मॉडल');
 $('primary-notice').textContent=p('Original unreviewed interactive drafts; not verified grade or board content. No results are stored.','मूल असमीक्षित इंटरैक्टिव मसौदे; सत्यापित कक्षा या बोर्ड सामग्री नहीं। परिणाम सहेजे नहीं जाते।');
 $('primary-lang-label').textContent=p('Language','भाषा');$('primary-model-label').textContent=p('Choose model','मॉडल चुनें');
 $('primary-model').replaceChildren(...PRIMARY_IDS.map(k=>{const o=e('option',primaryDefinition(k,lang).title);o.value=k;return o}));$('primary-model').value=id;
 const d=primaryDefinition(id,lang);$('primary-note').textContent=d.note;
 $('primary-controls').replaceChildren(...d.fields.map(f=>{
  const wrap=e('div'),label=e('label',f.label),select=e('select');select.id='primary-field-'+f.id;label.htmlFor=select.id;
  for(let x=f.min;x<=f.max;x++){const o=e('option',String(x));o.value=String(x);select.append(o)}
  select.value=String(values[f.id]);select.addEventListener('change',()=>{values={...values,[f.id]:Number(select.value)};renderResults()});wrap.append(label,select);return wrap;
 }));
 $('primary-reset').textContent=p('Reset model','मॉडल रीसेट करें');$('primary-results-title').textContent=p('Numerical description','संख्यात्मक विवरण');renderResults();
}
$('primary-model').addEventListener('change',()=>{id=$('primary-model').value;values=primaryInitial(id);render()});
$('primary-lang').addEventListener('change',()=>{lang=$('primary-lang').value;render()});
$('primary-reset').addEventListener('click',()=>{values=primaryInitial(id);render()});
function reset(){id=PRIMARY_IDS[0];values=primaryInitial(id);render()}
window.addEventListener('aifs-history-cleared',reset);
try{const channel=new BroadcastChannel('aifs-discovery-privacy-reset-v1');channel.addEventListener('message',ev=>{if(ev.data?.type==='clear-history')reset()})}catch{}
window.addEventListener('storage',ev=>{if(ev.key==='aifs-privacy-clear-signal-v1'&&ev.newValue==='clear')reset()});
window.addEventListener('pageshow',ev=>{if(ev.persisted)reset()});
const launch=resolvePrototypeLaunch(location.search,PRIMARY_IDS);if(launch){id=launch.id;lang=launch.lang;values=primaryInitial(id);$('primary-lang').value=lang}

render();
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('../service-worker.js').catch(()=>{});
