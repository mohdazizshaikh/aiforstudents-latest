/** M91 temporary source-derived supplemental snapshots. No learner records or persistence. */
import {advancedExtension,evaluateAdvancedExtension} from './advanced-lab-engine.js';
export const EXTENSION_SNAPSHOT_LIMIT=3;
function checked(key,state){
 if(typeof key!=='string'||key.split(':').length!==2)throw Error('Invalid supplemental key');
 const [id,mode]=key.split(':'),m=advancedExtension(id,mode);
 if(!state||typeof state!=='object'||Array.isArray(state)||Object.keys(state).length!==m.fields.length||m.fields.some(f=>!Object.hasOwn(state,f.id)||!Number.isInteger(state[f.id])||(state[f.id]-f.min)%(f.step||1)!==0))throw Error('Invalid supplemental state');
 evaluateAdvancedExtension(id,mode,state,'en');return {...state};
}
const same=(a,b)=>Object.keys(a).every(k=>a[k]===b[k]);
function collection(key,states){
 if(typeof key!=='string'||key.split(':').length!==2)throw Error('Invalid supplemental key');
 advancedExtension(...key.split(':'));
 if(!Array.isArray(states)||states.length>EXTENSION_SNAPSHOT_LIMIT)throw Error('Invalid supplemental snapshots');
 const out=states.map(s=>checked(key,s));
 if(out.some((s,i)=>out.slice(0,i).some(t=>same(s,t))))throw Error('Duplicate snapshot');
 return out;
}
export function captureExtensionSnapshot(key,states,current){
 const out=collection(key,states),next=checked(key,current);
 if(out.length<EXTENSION_SNAPSHOT_LIMIT&&!out.some(s=>same(s,next)))out.push(next);
 return out;
}
export function restoreExtensionSnapshot(key,states,index){
 const out=collection(key,states);
 if(!Number.isInteger(index)||index<0||index>=out.length)throw Error('Unknown snapshot');
 return out[index];
}
export function removeExtensionSnapshot(key,states,index){
 restoreExtensionSnapshot(key,states,index);
 return collection(key,states).filter((_,i)=>i!==index);
}
export function extensionSnapshotRows(key,states,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const out=collection(key,states),[id,mode]=key.split(':'),m=advancedExtension(id,mode),i=lang==='hi'?1:0;
 return out.map((s,index)=>({index,controls:m.fields.map(f=>({label:f.label[i],value:String(s[f.id])})),results:evaluateAdvancedExtension(id,mode,s,lang).rows,persists:false,masteryPrediction:false,publicReleaseApproved:false}));
}
