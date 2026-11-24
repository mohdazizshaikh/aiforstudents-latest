/** Shared native DOM snapshot panel; no history bridge, storage or network. */
import {MINI_SNAPSHOT_LIMIT,miniSnapshotRows,captureMiniSnapshot,restoreMiniSnapshot,removeMiniSnapshot} from './mini-snapshots.js';
export function createMiniSnapshotPanel(prefix,getModel,getCurrent,getLanguage,restore,focusTarget,adapter={limit:MINI_SNAPSHOT_LIMIT,rows:miniSnapshotRows,capture:captureMiniSnapshot,restore:restoreMiniSnapshot,remove:removeMiniSnapshot}){
 const $=id=>document.getElementById(prefix+'-snapshot-'+id);
 let states=[],active=false;
 const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
 function render(enabled=active){
  active=enabled;const lang=getLanguage(),p=(en,hi)=>lang==='hi'?hi:en;
  $('panel').hidden=!active;
  const rows=active?adapter.rows(getModel(),states,lang):[],select=$('select'),previous=select.value;
  $('heading').textContent=p('Temporary model snapshots','अस्थायी मॉडल स्थितियाँ');
  $('notice').textContent=p('Compare up to three model states without recording an attempt. These are simplified computer models, not grades or real experiments.','बिना प्रयास दर्ज किए अधिकतम तीन मॉडल स्थितियाँ मिलाएँ। ये सरल कंप्यूटर मॉडल हैं, अंक या वास्तविक प्रयोग नहीं।');
  $('add').textContent=p('Capture current state','वर्तमान स्थिति चुनें');
  $('clear').textContent=p('Clear snapshots','स्थितियाँ मिटाएँ');
  $('restore').textContent=p('Restore selected state','चुनी स्थिति लौटाएँ');
  $('remove').textContent=p('Remove selected state','चुनी स्थिति हटाएँ');
  $('label').textContent=p('State to restore','लौटाने की स्थिति');
  $('status').textContent=rows.length+' / '+adapter.limit+' '+p('temporary states','अस्थायी स्थितियाँ');
  $('rows').replaceChildren();select.replaceChildren();
  for(const r of rows){
   const label=p('State ','स्थिति ')+(r.index+1),opt=node('option',label);opt.value=String(r.index);select.append(opt);
   const group=node('section'),list=node('ul');for(const f of r.controls)list.append(node('li',f.label+': '+f.value));
   group.append(node('h5',label),list);if(r.results){const values=node('ul');for(const f of r.results)values.append(node('li',f.label+': '+f.value));group.append(node('p',p('Calculated values','गणना किए गए मान')),values)}else group.append(node('p',r.explanation));$('rows').append(group);
  }
  if(rows.some(r=>String(r.index)===previous))select.value=previous;
  const current=active?getCurrent():{};
  $('add').disabled=!active||rows.length===adapter.limit||states.some(s=>Object.keys(s).every(k=>s[k]===current[k]));
  select.disabled=$('restore').disabled=$('remove').disabled=$('clear').disabled=!active||!rows.length;
 }
 $('add').addEventListener('click',()=>{if(!active)return;states=adapter.capture(getModel(),states,getCurrent());render();$('status').focus()});
 $('clear').addEventListener('click',()=>{if(!active)return;states=[];render();$('add').focus()});
 $('restore').addEventListener('click',()=>{if(!active||!states.length)return;restore(adapter.restore(getModel(),states,Number($('select').value)));document.getElementById(focusTarget).focus()});
 $('remove').addEventListener('click',()=>{if(!active||!states.length)return;states=adapter.remove(getModel(),states,Number($('select').value));render();$('status').focus()});
 return {render,clear(){states=[];}};
}
