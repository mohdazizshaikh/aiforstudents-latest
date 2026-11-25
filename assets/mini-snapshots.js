/** M84: bounded local-only snapshots for five foundational maths/Studio models. */
import {workshopValues,evaluateWorkshop,WORKSHOP_MODES} from './experiment-engine.js';
import {STUDIO_IDS} from './studio-engine.js';
export const MINI_SNAPSHOT_LIMIT=3;
const specs={
 'maths/number-line':[['position','Position','स्थिति']],
 'maths/rectangle':[['width','Width','चौड़ाई'],['height','Height','ऊँचाई']],
 'maths/data-table':[['a','Group A','समूह A'],['b','Group B','समूह B']],
 'studio/fractions':[['count','Shaded equal parts','रंगे बराबर हिस्से']],
 'studio/circuit-path':[['closed','Switch','स्विच']]
};
const pair=(lang,en,hi)=>lang==='hi'?hi:en;
function checked(id,s){
 if(!Object.hasOwn(specs,id)||!s||typeof s!=='object'||Array.isArray(s))throw Error('Invalid mini model');
 const fields=specs[id];
 if(Object.keys(s).length!==fields.length||fields.some(([k])=>!Object.hasOwn(s,k)))throw Error('Invalid mini model fields');
 if(id.startsWith('maths/'))return workshopValues(id.slice(6),s);
 if(id==='studio/fractions'&&(!Number.isInteger(s.count)||s.count<0||s.count>4))throw Error('Invalid fraction');
 if(id==='studio/circuit-path'&&typeof s.closed!=='boolean')throw Error('Invalid circuit');
 return {...s};
}
export function miniControlLabels(id,lang='en'){
 if(!Object.hasOwn(specs,id)||!['en','hi'].includes(lang))throw Error('Unknown mini controls');
 return specs[id].map(([,en,hi])=>pair(lang,en,hi));
}
export const MINI_SNAPSHOT_IDS=Object.freeze([...WORKSHOP_MODES.map(m=>'maths/'+m),...STUDIO_IDS.map(m=>'studio/'+m)]);
const equal=(a,b)=>Object.keys(a).every(k=>a[k]===b[k]);
function validate(id,states){
 if(!MINI_SNAPSHOT_IDS.includes(id)||!Array.isArray(states)||states.length>MINI_SNAPSHOT_LIMIT)throw Error('Invalid mini snapshots');
 const out=states.map(s=>checked(id,s));
 if(out.some((s,i)=>out.slice(0,i).some(t=>equal(t,s))))throw Error('Duplicate snapshot');
 return out;
}
export function captureMiniSnapshot(id,states,current){
 const out=validate(id,states),s=checked(id,current);
 if(out.length<MINI_SNAPSHOT_LIMIT&&!out.some(t=>equal(t,s)))out.push(s);
 return out;
}
export function restoreMiniSnapshot(id,states,index){
 const out=validate(id,states);
 if(!Number.isInteger(index)||index<0||index>=out.length)throw Error('Unknown snapshot');
 return out[index];
}
export function miniSnapshotRows(id,states,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 return validate(id,states).map((s,index)=>{
  const controls=specs[id].map(([key,en,hi])=>({label:pair(lang,en,hi),value:typeof s[key]==='boolean'?(s[key]?pair(lang,'Closed','बंद'):pair(lang,'Open','खुला')):String(s[key])}));
  let explanation;
  if(id==='maths/number-line')explanation=pair(lang,'Position: '+s.position,'स्थिति: '+s.position);
  else if(id==='maths/rectangle'){const m=evaluateWorkshop('rectangle',s).metrics;explanation=pair(lang,'Area: '+m.area+' square units; perimeter: '+m.perimeter+' units.','क्षेत्रफल: '+m.area+' वर्ग इकाई; परिमाप: '+m.perimeter+' इकाई।');}
  else if(id==='maths/data-table'){const d=evaluateWorkshop('data-table',s).metrics.difference;explanation=pair(lang,'A − B = '+d,'A घटा B = '+d);}
  else if(id==='studio/fractions')explanation=pair(lang,s.count+' of 4 equal parts shaded.', 'चार बराबर हिस्सों में '+s.count+' रंगे हैं।');
  else explanation=s.closed?pair(lang,'Model bulb on — path complete.','मॉडल बल्ब जला — रास्ता पूरा।'):pair(lang,'Model bulb off — path interrupted.','मॉडल बल्ब बुझा — रास्ता टूटा।');
  return {index,controls,explanation,persists:false,recordsAttempt:false,masteryPrediction:false,publicReleaseApproved:false};
 });
}

/** M91 discard exactly one validated state without mutating the original. */
export function removeMiniSnapshot(id,states,index){
 restoreMiniSnapshot(id,states,index);
 return validate(id,states).filter((_,i)=>i!==index);
}
