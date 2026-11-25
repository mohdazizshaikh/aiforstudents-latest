/** M98: combined fixed activity reference worklist. No independent evidence authentication. */
import {createHash} from 'node:crypto';
import {mkdirSync,lstatSync,openSync,fstatSync,readFileSync,writeFileSync,closeSync,constants} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {ADVANCED_IDS,advancedExtensionIds,advancedExtension} from '../assets/advanced-lab-engine.js';
import {extensionSnapshotRows} from '../assets/extension-snapshots.js';
import {labPackKeys,printableAnyLabActivity} from '../assets/teacher-cards-engine.js';
import {FIXTURE_IDS,fixtureInputStates,mainComputedFixture,validateFixtureCollection} from './main-model-fixture-worklist.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url)),schema='aifs-m98-all-activity-fixtures-v1';
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const flags=()=>({independentReferencesAuthenticated:false,subjectApprovalAuthenticated:false,publicReleaseApproved:false});
export const SUPPLEMENTAL_FIXTURE_KEYS=Object.freeze(ADVANCED_IDS.flatMap(id=>advancedExtensionIds(id).map(mode=>id+':'+mode)));
export const ACTIVITY_FIXTURE_KEYS=Object.freeze([...FIXTURE_IDS.map(id=>id+':main'),...SUPPLEMENTAL_FIXTURE_KEYS]);
function supplementalData(key){
 if(!SUPPLEMENTAL_FIXTURE_KEYS.includes(key))throw Error('Unknown supplemental fixture');
 const [id,mode]=key.split(':'),m=advancedExtension(id,mode),inputs=fixtureInputStates(m);
 const actual=['en','hi'].map(lang=>extensionSnapshotRows(key,inputs,lang));
 const en=printableAnyLabActivity(id,mode,'en'),hi=printableAnyLabActivity(id,mode,'hi');
 const cases=inputs.map((state,i)=>({id:i===0?'baseline':'one-control-change',state,englishControls:actual[0][i].controls,hindiControls:actual[1][i].controls,referenceStatus:'PENDING_INDEPENDENT_REFERENCE',referenceRef:'',reviewerRef:'',decision:'pending'}));
 return {fixture:{id:key,subject:en.subject,sourceFile:en.sourceFile,title:{en:en.title,hi:hi.title},caveat:{en:en.caveat,hi:hi.caveat},fixtureSha256:hash([key,inputs,actual,en.caveat,hi.caveat]),cases},actual};
}
function activityData(key){
 if(!ACTIVITY_FIXTURE_KEYS.includes(key))throw Error('Unknown activity fixture');
 if(!key.endsWith(':main'))return supplementalData(key);
 const {fixture,actual}=mainComputedFixture(key.slice(0,-5));
 return {fixture:{...fixture,id:key},actual};
}
export function activityFixture(key){return activityData(key).fixture}
export function makeActivityFixtureWorklist(){
 const inventory=labPackKeys();
 if(inventory.length!==ACTIVITY_FIXTURE_KEYS.length||new Set(ACTIVITY_FIXTURE_KEYS).size!==inventory.length||inventory.some(k=>!ACTIVITY_FIXTURE_KEYS.includes(k)))throw Error('Fixture inventory mismatch');
 const models=ACTIVITY_FIXTURE_KEYS.map(activityFixture);
 return {schema,inventorySha256:hash(models),...flags(),models};
}
export function validateActivityFixtureWorklist(data){
 return validateFixtureCollection(data,makeActivityFixtureWorklist());
}
/** Actual engine output is separate from the blinded template. Not an independent answer. */
export function computedActivityFixture(key){
 const {fixture,actual}=activityData(key);
 return {id:key,fixtureSha256:fixture.fixtureSha256,computedOutputsAreNotIndependentReferences:true,...flags(),cases:fixture.cases.map((c,i)=>({id:c.id,state:c.state,english:actual[0][i],hindi:actual[1][i]}))};
}
function evidencePath(name){
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 const dir=path.join(ROOT,'review-evidence');mkdirSync(dir,{recursive:true});
 const st=lstatSync(dir);if(!st.isDirectory()||st.isSymbolicLink())throw Error('Invalid local evidence directory');
 return path.join(dir,name);
}
function readEvidence(name){
 const file=evidencePath(name),fd=openSync(file,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
 try{const st=fstatSync(fd);if(!st.isFile()||st.size>1024*1024)throw Error('Invalid evidence file');return JSON.parse(readFileSync(fd,'utf8'))}finally{closeSync(fd)}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,arg,...extra]=process.argv.slice(2);if(extra.length)throw Error('Unexpected arguments');
  let report;
  if(action==='--summary'&&arg===undefined)report=validateActivityFixtureWorklist(makeActivityFixtureWorklist());
  else if(action==='--template'){const data=makeActivityFixtureWorklist();writeFileSync(evidencePath(arg),JSON.stringify(data,null,2)+'\n',{encoding:'utf8',mode:0o600,flag:'wx'});report=validateActivityFixtureWorklist(data)}
  else if(action==='--check')report=validateActivityFixtureWorklist(readEvidence(arg));
  else if(action==='--computed')report=computedActivityFixture(arg);
  else throw Error('Use --summary, --template|--check <filename>, or --computed <fixed-key>');
  console.log(JSON.stringify(report,null,2));if(report.valid===false)process.exitCode=1;
 }catch{console.error('Activity fixture worklist failed; check local arguments and file');process.exitCode=1}
}
