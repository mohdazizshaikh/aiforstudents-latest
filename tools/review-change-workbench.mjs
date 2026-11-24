/** M68: local, read-only comparison and supplemental reviewer worklist. Not approval. */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildReviewRows} from './build-review-packet.mjs';
import {ADVANCED_IDS,advancedExtensionIds,advancedExtension,evaluateAdvancedExtension} from '../assets/advanced-lab-engine.js';
const SHA=/^[a-f0-9]{64}$/;
const safeId=s=>typeof s==='string'&&s.length>0&&s.length<=256&&!/[\u0000-\u001f\u007f]/u.test(s);
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const keyOf=x=>JSON.stringify([x.queue,x.id]);
const cmp=(a,b)=>a<b?-1:a>b?1:0;
const sorted=xs=>[...xs].sort((a,b)=>cmp(keyOf(a),keyOf(b)));
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
function* states(fields,i=0,state={}){
 if(i===fields.length){yield {...state};return}
 const f=fields[i];
 if(!Number.isInteger(f.min)||!Number.isInteger(f.max)||!Number.isInteger(f.step)||f.step<1||f.max<f.min)throw Error('Invalid supplemental range');
 for(let v=f.min;v<=f.max;v+=f.step)yield* states(fields,i+1,{...state,[f.id]:v});
}
export function supplementalReviewWorklist(rows=buildReviewRows()){
 const byId=new Map(rows.filter(r=>r.queue==='advanced').map(r=>[r.content_id,r]));
 const activities=[];
 for(const id of ADVANCED_IDS)for(const mode of advancedExtensionIds(id)){
  const reviewId='advanced:'+id,canonical=byId.get(reviewId),m=advancedExtension(id,mode);
  if(!canonical||!SHA.test(canonical.content_sha256))throw Error('Missing canonical supplemental review record');
  const digest=createHash('sha256');let combinations=0;
  digest.update(JSON.stringify(m)+'\n','utf8');
  for(const state of states(m.fields))for(const lang of ['en','hi']){
   digest.update(JSON.stringify([state,lang,evaluateAdvancedExtension(id,mode,state,lang)])+'\n','utf8');combinations++;
   if(combinations>20000)throw Error('Supplemental review state limit exceeded');
  }
  const boundary=minmax=>Object.fromEntries(m.fields.map(f=>[f.id,f[minmax]]));
  const examples=[m.initial,boundary('min'),boundary('max')].filter((s,i,arr)=>arr.findIndex(x=>JSON.stringify(x)===JSON.stringify(s))===i)
   .map(state=>({state,english:evaluateAdvancedExtension(id,mode,state,'en').rows,hindi:evaluateAdvancedExtension(id,mode,state,'hi').rows}));
  activities.push({id,mode,reviewId,canonicalContentSha256:canonical.content_sha256,behaviorSha256:digest.digest('hex'),combinations,
   title:m.title,prompt:m.prompt,hint:m.hint,caveat:m.caveat,fields:m.fields,examples,
   source:'assets/advanced-lab-engine.js',reviewStatus:'PENDING_HUMAN_REVIEW',computedOutputsAreNotExpertApproved:true});
 }
 return {schema:'aifs-supplement-review-v1',activities,activityCount:activities.length,bilingualCombinations:activities.reduce((n,a)=>n+a.combinations,0),humanApprovalGranted:false,publicReleaseApproved:false};
}
export function validateReviewSnapshot(snapshot){
 if(!exact(snapshot,['schema','entries'])||snapshot.schema!=='aifs-review-change-snapshot-v1'||!Array.isArray(snapshot.entries)||snapshot.entries.length>10000)throw Error('Invalid review snapshot');
 const seen=new Set();
 for(const row of snapshot.entries){
  if(!exact(row,['queue','id','sha256'])||!safeId(row.queue)||!safeId(row.id)||typeof row.sha256!=='string'||!SHA.test(row.sha256)||seen.has(keyOf(row)))throw Error('Invalid or duplicate snapshot entry');
  seen.add(keyOf(row));
 }
 return snapshot;
}
export function makeReviewSnapshot(rows=buildReviewRows(),supplements=supplementalReviewWorklist(rows)){
 return validateReviewSnapshot({schema:'aifs-review-change-snapshot-v1',entries:sorted([
  ...rows.map(r=>({queue:r.queue,id:r.content_id,sha256:r.content_sha256})),
  ...supplements.activities.map(a=>({queue:'supplement-behavior',id:a.id+':'+a.mode,sha256:hash([a.canonicalContentSha256,a.behaviorSha256])}))
 ])});
}
export function compareReviewSnapshots(before,after){
 validateReviewSnapshot(before);validateReviewSnapshot(after);
 const old=new Map(before.entries.map(x=>[keyOf(x),x])),now=new Map(after.entries.map(x=>[keyOf(x),x]));
 const added=[],removed=[],changed=[];let unchanged=0;
 for(const row of sorted(after.entries)){
  const prev=old.get(keyOf(row));
  if(!prev)added.push(row);
  else if(prev.sha256!==row.sha256)changed.push({queue:row.queue,id:row.id,before:prev.sha256,after:row.sha256});
  else unchanged++;
 }
 for(const row of sorted(before.entries))if(!now.has(keyOf(row)))removed.push(row);
 return {schema:'aifs-review-change-report-v1',counts:{added:added.length,removed:removed.length,changed:changed.length,unchanged},added,removed,changed,
  humanApprovalGranted:false,publicReleaseApproved:false,note:'Unchanged hashes do not establish approval; supplemental behavior hashes are engineering indicators, not independent reference answers.'};
}
function saveExclusive(file,value){
 mkdirSync(path.dirname(file),{recursive:true});
 writeFileSync(file,JSON.stringify(value,null,2)+'\n',{encoding:'utf8',flag:'wx'});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [op,file,...rest]=process.argv.slice(2);
  if(rest.length||!file||!['--snapshot','--compare','--supplements'].includes(op))throw Error('Usage: node tools/review-change-workbench.mjs --snapshot|--compare|--supplements <file>');
  const rows=buildReviewRows(),supplements=supplementalReviewWorklist(rows);
  if(op==='--snapshot')saveExclusive(file,makeReviewSnapshot(rows,supplements));
  else if(op==='--supplements')saveExclusive(file,supplements);
  else{
   const report=compareReviewSnapshots(JSON.parse(readFileSync(file,'utf8')),makeReviewSnapshot(rows,supplements));
   console.log(JSON.stringify(report,null,2));
  }
 }catch(e){console.error(e.message);process.exitCode=1}
}
