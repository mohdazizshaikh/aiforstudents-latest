/** M83: temporary science states, no answers, grades, persistence or approval. */
import {scienceModel,scienceValidateState,scienceExplain,scienceText} from './science-engine.js';
export const SCIENCE_SNAPSHOT_LIMIT=3;
const same=(a,b)=>Object.keys(a).every(k=>a[k]===b[k]);
const checked=(id,state)=>({...scienceValidateState(id,state)});
function collection(id,states){
 scienceModel(id);
 if(!Array.isArray(states)||states.length>SCIENCE_SNAPSHOT_LIMIT)throw Error('Invalid science snapshots');
 const out=states.map(s=>checked(id,s));
 if(out.some((s,i)=>out.slice(0,i).some(t=>same(s,t))))throw Error('Duplicate snapshot');
 return out;
}
export function captureScienceSnapshot(id,states,state){
 const out=collection(id,states),current=checked(id,state);
 if(out.length<SCIENCE_SNAPSHOT_LIMIT&&!out.some(s=>same(s,current)))out.push(current);
 return out;
}
export function restoreScienceSnapshot(id,states,index){
 const out=collection(id,states);
 if(!Number.isInteger(index)||index<0||index>=out.length)throw Error('Unknown science snapshot');
 return out[index];
}
export function scienceSnapshotRows(id,states,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=scienceModel(id);
 return collection(id,states).map((s,index)=>({index,controls:m.fields.map(f=>({label:scienceText(f.label,lang),value:f.options?scienceText(f.options.find(o=>o.value===s[f.id]).label,lang):String(s[f.id])+(f.unit?' '+f.unit:'')})),explanation:scienceExplain(id,s,lang),persists:false,masteryPrediction:false,publicReleaseApproved:false}));
}

/** M91 discard exactly one validated state without mutating the original. */
export function removeScienceSnapshot(id,states,index){
 restoreScienceSnapshot(id,states,index);
 return collection(id,states).filter((_,i)=>i!==index);
}
