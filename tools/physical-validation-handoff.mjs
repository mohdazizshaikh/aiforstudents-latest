/** M59 local physical-validation worksheet. No device access or authenticated evidence. */
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m59-physical-validation-v1';
export const PHYSICAL_SCENARIOS=Object.freeze([
 ['android-layout','Low-end Android: portrait layout and 200% zoom, English/Hindi'],
 ['android-offline','Low-end Android: cached routes, offline reload and reconnect'],
 ['talkback','Android TalkBack: navigation, controls, output and announcements'],
 ['voiceover','iOS VoiceOver: navigation, controls, output and announcements'],
 ['desktop-keyboard','Desktop keyboard: visible focus, all controls, no traps'],
 ['desktop-screen-reader','Desktop screen reader: headings, tables, model results'],
 ['reduced-motion','Physical device reduced-motion setting and non-motion alternatives'],
 ['shared-device-tabs','Same-profile physical device: two tabs, opt-in history and clear-all'],
 ['shared-device-resume','Physical device sleep/resume and restored-page privacy reset'],
 ['projector','Classroom projector: readable text, teacher controls and offline launch'],
 ['a4-learner','Physical A4 printer: learner activity, legibility and no teacher guidance'],
 ['a4-lab','Physical A4 printer: advanced model activity, page breaks and no controls']
].map(([id,instruction])=>Object.freeze({id,instruction})));
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const commit=x=>typeof x==='string'&&/^[a-f0-9]{40}$/.test(x)&&x!=='0'.repeat(40);
const ref=x=>typeof x==='string'&&/^[A-Za-z0-9._-]{3,80}$/.test(x);
export function makePhysicalWorksheet(sourceCommit){
 if(!commit(sourceCommit))throw Error('Use exact source commit SHA');
 return {schema,sourceCommit,physicalEvidenceAuthenticated:false,publicReleaseApproved:false,
 scenarios:PHYSICAL_SCENARIOS.map(s=>({id:s.id,result:'pending',operatorRef:'',deviceRef:'',evidenceRef:'',defectRef:''}))};
}
export function checkPhysicalWorksheet(data,expectedCommit){
 const errors=[],seen=new Set();let documented=0,failed=0;
 const fail=()=>({valid:false,errors,documentedForIndependentAudit:0,failedScenarios:0,physicalEvidenceAuthenticated:false,publicReleaseApproved:false});
 if(!commit(expectedCommit)||!exact(data,['schema','sourceCommit','physicalEvidenceAuthenticated','publicReleaseApproved','scenarios'])||data.schema!==schema||data.sourceCommit!==expectedCommit||data.physicalEvidenceAuthenticated!==false||data.publicReleaseApproved!==false||!Array.isArray(data.scenarios)){errors.push('Invalid, stale or approving worksheet');return fail()}
 const ids=PHYSICAL_SCENARIOS.map(s=>s.id);
 for(const s of data.scenarios){
  if(!exact(s,['id','result','operatorRef','deviceRef','evidenceRef','defectRef'])||!ids.includes(s.id)||seen.has(s.id)||!['pending','pass','fail','blocked'].includes(s.result)){errors.push('Invalid or duplicate scenario');continue}
  seen.add(s.id);
  if(s.result==='pending'){if([s.operatorRef,s.deviceRef,s.evidenceRef,s.defectRef].some(v=>v!==''))errors.push('Pending scenario must be blank');continue}
  if(!ref(s.operatorRef)||!ref(s.deviceRef)||!ref(s.evidenceRef))errors.push('Missing opaque evidence references '+s.id);
  if(s.result==='pass'){if(s.defectRef!=='')errors.push('Pass must not conceal unresolved defect '+s.id)}
  else if(!ref(s.defectRef))errors.push('Fail/blocked requires defect reference '+s.id);
  documented++;if(s.result!=='pass')failed++;
 }
 for(const id of ids)if(!seen.has(id))errors.push('Missing scenario '+id);
 if(errors.length)return fail();
 return {valid:true,errors,totalScenarios:ids.length,documentedForIndependentAudit:documented,failedScenarios:failed,pendingScenarios:ids.length-documented,physicalEvidenceAuthenticated:false,publicReleaseApproved:false};
}
const output=name=>{
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 return path.join(ROOT,'review-evidence',name);
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,name,sourceCommit,...extra]=process.argv.slice(2);if(extra.length||!['--template','--check'].includes(action)||!commit(sourceCommit))throw Error('Use --template|--check <filename> <exact-source-commit>');
  const file=output(name);
  if(action==='--template'){const data=makePhysicalWorksheet(sourceCommit);mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(data,null,2)+'\n',{encoding:'utf8',flag:'wx'});console.log(JSON.stringify({scenarios:PHYSICAL_SCENARIOS.length,allPending:true,publicReleaseApproved:false}))}
  else{if(statSync(file).size>1024*1024)throw Error('Worksheet too large');const r=checkPhysicalWorksheet(JSON.parse(readFileSync(file,'utf8')),sourceCommit);console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}
 }catch(e){console.error(e.message);process.exitCode=1}
}
