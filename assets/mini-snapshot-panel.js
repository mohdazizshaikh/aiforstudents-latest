/** Shared native DOM snapshot panel; no history bridge, storage or network. */
import {MINI_SNAPSHOT_LIMIT,miniSnapshotRows,captureMiniSnapshot,restoreMiniSnapshot} from './mini-snapshots.js';
export function createMiniSnapshotPanel(prefix,getModel,getCurrent,getLanguage,restore,focusTarget){
 const $=id=>document.getElementById(prefix+'-snapshot-'+id);
 let states=[],active=false;
 const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
 function render(enabled=active){
  active=enabled;const lang=getLanguage(),p=(en,hi)=>lang==='hi'?hi:en;
  $('panel').hidden=!active;
  const rows=miniSnapshotRows(getModel(),states,lang),select=$('select'),previous=select.value;
  $('heading').textContent=p('Temporary model snapshots','अस्थायी मॉडल स्थितियाँ');
  $('notice').textContent=p('Compare up to three model states without recording an attempt. These are simplified computer models, not grades or real experiments.','बिना प्रयास दर्ज किए अधिकतम तीन मॉडल स्थितियाँ मिलाएँ। ये सरल कंप्यूटर मॉडल हैं, अंक या वास्तविक प्रयोग नहीं।');
  $('add').textContent=p('Capture current state','वर्तमान स्थिति चुनें');
  $('clear').textContent=p('Clear snapshots','स्थितियाँ मिटाएँ');
  $('restore').textContent=p('Restore selected state','चुनी स्थिति लौटाएँ');
  $('label').textContent=p('State to restore','लौटाने की स्थिति');
  $('status').textContent=rows.length+' / '+MINI_SNAPSHOT_LIMIT+' '+p('temporary states','अस्थायी स्थितियाँ');
  $('rows').replaceChildren();select.replaceChildren();
  for(const r of rows){
   const label=p('State ','स्थिति ')+(r.index+1),opt=node('option',label);opt.value=String(r.index);select.append(opt);
   const group=node('section'),list=node('ul');for(const f of r.controls)list.append(node('li',f.label+': '+f.value));
   group.append(node('h5',label),list,node('p',r.explanation));$('rows').append(group);
  }
  if(rows.some(r=>String(r.index)===previous))select.value=previous;
  const current=getCurrent();
  $('add').disabled=!active||rows.length===MINI_SNAPSHOT_LIMIT||states.some(s=>Object.keys(s).every(k=>s[k]===current[k]));
  select.disabled=$('restore').disabled=$('clear').disabled=!active||!rows.length;
 }
 $('add').addEventListener('click',()=>{if(!active)return;states=captureMiniSnapshot(getModel(),states,getCurrent());render();$('status').focus()});
 $('clear').addEventListener('click',()=>{if(!active)return;states=[];render();$('add').focus()});
 $('restore').addEventListener('click',()=>{if(!active||!states.length)return;restore(restoreMiniSnapshot(getModel(),states,Number($('select').value)));document.getElementById(focusTarget).focus()});
 return {render,clear(){states=[];}};
}
