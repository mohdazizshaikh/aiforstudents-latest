import {prototypeChoices} from './extended-lab-catalog.js';
import {prototypePack,PROTOTYPE_PACK_LIMIT,parseWorksheetLaunch} from './prototype-worksheet-engine.js';
const $=id=>document.getElementById(id),root=$('prototype-pack');
const initial=parseWorksheetLaunch(location.search);
let lang=initial?.lang??'en',keys=initial?[initial.key]:[],chosen=initial?.key??'prototype:polygon-sides';
const p=(en,hi)=>lang==='hi'?hi:en;
const e=(tag,t)=>{const n=document.createElement(tag);if(t!==undefined)n.textContent=t;return n};
function render(){
 root.lang=lang;$('pp-lang').value=lang;
 $('pp-title').textContent=p('Draft prototype worksheet pack','मसौदा मॉडल अभ्यास पत्र पैक');
 $('pp-notice').textContent=p('Original paper-only drafts. Rights and independent educational review pending. No names, answers, scores or stored records.','मूल कागज़ी मसौदे। अधिकार और स्वतंत्र शैक्षिक समीक्षा लंबित। नाम, उत्तर, अंक या सहेजे रिकॉर्ड नहीं।');
 $('pp-lang-label').textContent=p('Language','भाषा');$('pp-choice-label').textContent=p('Choose draft activity','मसौदा गतिविधि चुनें');
 $('pp-choice').replaceChildren(...prototypeChoices(lang).map(x=>{const o=e('option',x.title);o.value=x.key;return o}));$('pp-choice').value=chosen;
 $('pp-add').textContent=p('Add sheet','पत्र जोड़ें');$('pp-add').disabled=keys.includes(chosen)||keys.length>=PROTOTYPE_PACK_LIMIT;
 $('pp-remove').textContent=p('Remove last sheet','अंतिम पत्र हटाएँ');$('pp-remove').disabled=!keys.length;
 $('pp-clear').textContent=p('Clear pack','पैक मिटाएँ');$('pp-clear').disabled=!keys.length;
 $('pp-print').textContent=p('Print draft pack / Save as PDF','मसौदा पैक छापें / PDF सहेजें');$('pp-print').disabled=!keys.length;
 $('pp-status').textContent=p('Selected sheets: ','चुने पत्र: ')+keys.length+' / '+PROTOTYPE_PACK_LIMIT;
 $('pp-sheets').replaceChildren();
 if(keys.length)for(const sheet of prototypePack({language:lang,keys}).sheets){
  const article=e('article');article.className='prototype-paper';article.append(e('h3',sheet.title),e('p',sheet.notice));
  const list=e('ol');for(const step of sheet.steps){const li=e('li',step),lines=e('div');lines.className='prototype-writing-lines';lines.setAttribute('aria-hidden','true');li.append(lines);list.append(li)}article.append(list);$('pp-sheets').append(article);
 }
}
$('pp-lang').addEventListener('change',()=>{lang=$('pp-lang').value;render()});
$('pp-choice').addEventListener('change',()=>{chosen=$('pp-choice').value;render()});
$('pp-add').addEventListener('click',()=>{if(!keys.includes(chosen)&&keys.length<PROTOTYPE_PACK_LIMIT)keys=[...keys,chosen];render();if($('pp-add').disabled)$('pp-status').focus()});
$('pp-remove').addEventListener('click',()=>{keys=keys.slice(0,-1);render();if($('pp-remove').disabled)$('pp-status').focus()});
function clear(){keys=[];chosen='prototype:polygon-sides';document.body.classList.remove('prototype-pack-print');render()}
$('pp-clear').addEventListener('click',()=>{clear();$('pp-status').focus()});
$('pp-print').addEventListener('click',()=>{if(!keys.length)return;document.body.classList.add('prototype-pack-print');try{window.print()}finally{document.body.classList.remove('prototype-pack-print')}});
window.addEventListener('afterprint',()=>document.body.classList.remove('prototype-pack-print'));
window.addEventListener('aifs-history-cleared',clear);window.addEventListener('pageshow',ev=>{if(ev.persisted)clear()});
try{const c=new BroadcastChannel('aifs-discovery-privacy-reset-v1');c.addEventListener('message',ev=>{if(ev.data?.type==='clear-history')clear()})}catch{}
window.addEventListener('storage',ev=>{if(ev.key==='aifs-privacy-clear-signal-v1'&&ev.newValue==='clear')clear()});
render();
