/** M97: deterministic main-model review fixtures; no expert answers or authenticated decisions. */
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {ADVANCED_IDS,modelAdvanced} from '../assets/advanced-lab-engine.js';
import {SCIENCE_IDS,scienceModel} from '../assets/science-engine.js';
import {snapshotRows} from '../assets/advanced-snapshots.js';
import {scienceSnapshotRows} from '../assets/science-snapshots.js';
import {MINI_SNAPSHOT_IDS,miniSnapshotRows} from '../assets/mini-snapshots.js';
import {printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const schema='aifs-m97-main-model-fixtures-v1';
export const FIXTURE_IDS=Object.freeze([...ADVANCED_IDS,...SCIENCE_IDS.map(id=>'science/'+id),...MINI_SNAPSHOT_IDS]);
const mini={
 'maths/number-line':[{position:0},{position:1}],
 'maths/rectangle':[{width:2,height:2},{width:3,height:2}],
 'maths/data-table':[{a:1,b:1},{a:2,b:1}],
 'studio/fractions':[{count:0},{count:1}],
 'studio/circuit-path':[{closed:false},{closed:true}]
};
export function fixtureInputStates(m){
 const initial={...m.initial},f=m.fields.find(f=>f.options?f.options.some(o=>o.value!==initial[f.id]):f.max>f.min);
 if(!f)throw Error('Missing alternate control');
 const other=f.options?f.options.find(o=>o.value!==initial[f.id]).value:initial[f.id]===f.min?f.min+f.step:f.min;
 return [initial,{...initial,[f.id]:other}];
}
function mainFixtureData(id){
 if(!FIXTURE_IDS.includes(id))throw Error('Unknown main model');
 const isScience=id.startsWith('science/'),isMini=MINI_SNAPSHOT_IDS.includes(id),sourceId=isScience?id.slice(8):id;
 const inputs=isMini?mini[id].map(s=>({...s})):fixtureInputStates(isScience?scienceModel(sourceId):modelAdvanced(id));
 const rows=lang=>(isMini?miniSnapshotRows:isScience?scienceSnapshotRows:snapshotRows)(sourceId,inputs,lang);
 const en=printableAnyLabActivity(id,'main','en'),hi=printableAnyLabActivity(id,'main','hi');
 const actual=[rows('en'),rows('hi')];
 const cases=inputs.map((state,i)=>({id:i===0?'baseline':'one-control-change',state,englishControls:actual[0][i].controls,hindiControls:actual[1][i].controls,referenceStatus:'PENDING_INDEPENDENT_REFERENCE',referenceRef:'',reviewerRef:'',decision:'pending'}));
 // Bind to inputs and computed behavior while withholding actual outputs from the reviewer template.
 return {fixture:{id,subject:en.subject,sourceFile:en.sourceFile,title:{en:en.title,hi:hi.title},caveat:{en:en.caveat,hi:hi.caveat},fixtureSha256:hash([id,inputs,actual,en.caveat,hi.caveat]),cases},actual};
}
export function modelFixture(id){return mainFixtureData(id).fixture}
export function mainComputedFixture(id){return mainFixtureData(id)}
const flags=()=>({independentReferencesAuthenticated:false,subjectApprovalAuthenticated:false,publicReleaseApproved:false});
export function makeFixtureWorklist(){
 const models=FIXTURE_IDS.map(modelFixture);return {schema,inventorySha256:hash(models),...flags(),models};
}
const exact=(o,keys)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const ref=x=>typeof x==='string'&&/^[A-Za-z0-9._-]{3,80}$/.test(x);
export function validateFixtureWorklist(data){return validateFixtureCollection(data,makeFixtureWorklist())}
export function validateFixtureCollection(data,expected){
 const map=new Map(expected.models.map(m=>[m.id,m])),seen=new Set();
 const fail=()=>({valid:false,documentedCases:0,readyForIndependentAudit:0,...flags()});
 if(!exact(data,Object.keys(expected))||data.schema!==expected.schema||data.inventorySha256!==expected.inventorySha256||Object.keys(flags()).some(k=>data[k]!==false)||!Array.isArray(data.models)||data.models.length!==map.size)return fail();
 let documented=0,ready=0;
 for(const m of data.models){
  if(!m||!map.has(m.id)||seen.has(m.id))return fail();
  seen.add(m.id);const e=map.get(m.id);
  if(!exact(m,Object.keys(e))||!Array.isArray(m.cases)||m.cases.length!==e.cases.length)return fail();
  const {cases,...metadata}=m,{cases:ec,...em}=e;
  if(hash(metadata)!==hash(em))return fail();
  let all=true;
  for(let i=0;i<ec.length;i++){
   const c=cases[i],base=ec[i];if(!exact(c,Object.keys(base)))return fail();
   const {referenceRef,reviewerRef,decision,...fixed}=c,{referenceRef:_,reviewerRef:__,decision:___,...ef}=base;
   if(hash(fixed)!==hash(ef)||!['pending','match','revise','reject'].includes(decision))return fail();
   if(decision==='pending'){if(referenceRef!==''||reviewerRef!=='')return fail();all=false}
   else{if(!ref(referenceRef)||!ref(reviewerRef))return fail();documented++;if(decision!=='match')all=false}
  }
  if(all)ready++;
 }
 return {valid:true,totalModels:map.size,totalCases:map.size*2,documentedCases:documented,pendingCases:map.size*2-documented,readyForIndependentAudit:ready,...flags()};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,...extra]=process.argv.slice(2);if(extra.length)throw Error('Unexpected arguments');
  const data=makeFixtureWorklist();
  if(action==='--template')console.log(JSON.stringify(data,null,2));
  else if(action==='--summary')console.log(JSON.stringify(validateFixtureWorklist(data),null,2));
  else throw Error('Use --template or --summary');
 }catch{console.error('Main fixture worklist failed');process.exitCode=1}
}
