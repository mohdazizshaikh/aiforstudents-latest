/** M82 temporary model calculation snapshots; not observations, responses or mastery. */
import {modelAdvanced,calculateAdvanced,advancedResultRows} from './advanced-lab-engine.js';
export const SNAPSHOT_LIMIT=3;
function checked(id,state){
 if(!state||typeof state!=='object'||Array.isArray(state))throw Error('Invalid model state');
 const m=modelAdvanced(id);
 if(Object.keys(state).length!==m.fields.length||m.fields.some(f=>!Object.hasOwn(state,f.id)))throw Error('Invalid model state fields');
 calculateAdvanced(id,state);
 return {...state};
}
const same=(a,b)=>Object.keys(a).every(k=>a[k]===b[k]);
function validate(id,states){
 modelAdvanced(id);
 if(!Array.isArray(states)||states.length>SNAPSHOT_LIMIT)throw Error('Invalid snapshot collection');
 const copies=states.map(s=>checked(id,s));
 if(copies.some((s,i)=>copies.slice(0,i).some(p=>same(p,s))))throw Error('Duplicate model snapshot');
 return copies;
}
export function snapshotState(id,states,current){
 const copies=validate(id,states),next=checked(id,current);
 if(copies.length<SNAPSHOT_LIMIT&&!copies.some(s=>same(s,next)))copies.push(next);
 return copies;
}
export function restoreSnapshot(id,states,index){
 const copies=validate(id,states);
 if(!Number.isInteger(index)||index<0||index>=copies.length)throw Error('Unknown snapshot');
 return copies[index];
}
export function snapshotRows(id,states,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=modelAdvanced(id),i=lang==='hi'?1:0;
 return validate(id,states).map((state,index)=>({index,controls:m.fields.map(f=>({label:f.label[i],value:f.options?f.options.find(o=>o.value===state[f.id]).label[i]:String(state[f.id])+(f.unit?' '+f.unit:'')})),
 results:advancedResultRows(calculateAdvanced(id,state),lang),persists:false,masteryPrediction:false,publicReleaseApproved:false}));
}
