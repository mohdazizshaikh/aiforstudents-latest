/** M124 private version-bound review worklist; no evidence authentication or approval. */
import {createHash} from 'node:crypto';
import {mkdirSync,lstatSync,openSync,fstatSync,readFileSync,writeFileSync,closeSync,constants} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {PRIMARY_IDS,primaryDefinition,primaryInitial,evaluatePrimary} from '../assets/primary-maths-lab.js';
import {COMPARISON_IDS,comparisonDefinition,comparisonInitial,comparisonValue} from '../assets/comparison-lab-engine.js';
import {VISUAL_IDS,visualDefinition,visualInitial,evaluateVisual} from '../assets/visual-lab-engine.js';
import {PROTOTYPE_KEYS,prototypeChoices} from '../assets/extended-lab-catalog.js';
import {PROTOTYPE_LINKS} from '../assets/curriculum-catalog-data.js';
import {prototypeWorksheet} from '../assets/prototype-worksheet-engine.js';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m124-prototype-review-v1',langs=['en','hi'];
const hash=x=>createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const sourceHash=p=>createHash('sha256').update(readFileSync(path.join(ROOT,p))).digest('hex');
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const opaque=x=>typeof x==='string'&&/^[A-Za-z0-9._-]{3,80}$/.test(x);
const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const flags=()=>({humanApprovalAuthenticated:false,rightsAuthenticated:false,independentReferencesAuthenticated:false,publicReleaseApproved:false});
export const REVIEW_CRITERIA=Object.freeze(['subject-correctness','model-limitations','hindi-language','proposed-grade-fit','worksheet-pedagogy','authorship','redistribution','accessibility']);
function family(id){
 if(PRIMARY_IDS.includes(id))return ['primary-maths-lab.js','primary-maths-app.js',primaryDefinition,primaryInitial,evaluatePrimary];
 if(COMPARISON_IDS.includes(id))return ['comparison-lab-engine.js','comparison-lab-app.js',comparisonDefinition,comparisonInitial,comparisonValue];
 if(VISUAL_IDS.includes(id))return ['visual-lab-engine.js','visual-lab-app.js',visualDefinition,visualInitial,evaluateVisual];
 throw Error('Unknown prototype');
}
function modelData(key){
 if(!PROTOTYPE_KEYS.includes(key))throw Error('Unknown prototype');
 const id=key.slice(10),[engine,app,define,initial,evaluate]=family(id),defs=langs.map(l=>define(id,l)),base=initial(id),field=defs[0].fields[0],options=field.options??Array.from({length:field.max-field.min+1},(_,i)=>field.min+i);
 const next=options.find(x=>x!==base[field.id]);if(next===undefined)throw Error('Missing comparison input');
 const states=[base,{...base,[field.id]:next}];
 const outputs=states.map(state=>langs.map(l=>evaluate(id,state,l)));
 const worksheets=langs.map(l=>prototypeWorksheet(key,l));
 const links=langs.map(l=>prototypeChoices(l).find(x=>x.key===key)),proposed=PROTOTYPE_LINKS.filter(x=>x.id===id);
 if(proposed.length!==1||worksheets.some(x=>x.publicReleaseApproved!==false)||defs.some(x=>x.humanReviewed!==false))throw Error('Unexpected prototype state');
 const sources=['assets/'+engine,'assets/'+app,'assets/prototype-worksheet-engine.js','assets/prototype-worksheet-app.js','assets/extended-lab-catalog.js','assets/curriculum-catalog-data.js','assets/styles.css','virtual-experiment-lab/index.html','teacher-kit/index.html'].map(p=>({path:p,sha256:sourceHash(p)}));
 const metadata={key,subject:proposed[0].subject,proposedGrade:proposed[0].grade,officialChapter:null,title:{en:defs[0].title,hi:defs[1].title},limitations:{en:defs[0].note,hi:defs[1].note},sources};
 const contentSha256=hash([metadata,defs,states,outputs,worksheets,links]);
 return {metadata,contentSha256,defs,states,outputs,worksheets,links};
}
export function prototypeReviewInventory(){
 if(new Set(PROTOTYPE_KEYS).size!==PROTOTYPE_KEYS.length||PROTOTYPE_LINKS.length!==PROTOTYPE_KEYS.length)throw Error('Inventory mismatch');
 return PROTOTYPE_KEYS.map(key=>{const d=modelData(key);return {...d.metadata,contentSha256:d.contentSha256,...flags()}});
}
export function makePrototypeReviewWorklist(){
 const inventory=prototypeReviewInventory();
 return {schema,inventorySha256:hash(inventory),...flags(),records:inventory.map(r=>{
  const d=modelData(r.key);
  return {key:r.key,contentSha256:r.contentSha256,criteria:REVIEW_CRITERIA.map(id=>({id,decision:'pending',reviewerRef:'',evidenceRef:'',reviewDate:''})),cases:d.states.map((state,i)=>({id:i?'one-control-change':'baseline',state,decision:'pending',reviewerRef:'',evidenceRef:'',reviewDate:''}))};
 })};
}
/** Only schema and source parity: submitted review decisions are NOT trusted human approvals. */
export function validatePrototypeReviewWorklist(data){
 const expected=makePrototypeReviewWorklist(),byKey=new Map(expected.records.map(r=>[r.key,r])),invalid=reason=>({valid:false,reason,...flags()});
 if(!exact(data,['schema','inventorySha256','humanApprovalAuthenticated','rightsAuthenticated','independentReferencesAuthenticated','publicReleaseApproved','records'])||data.schema!==schema||data.inventorySha256!==expected.inventorySha256||Object.keys(flags()).some(k=>data[k]!==false)||!Array.isArray(data.records)||data.records.length!==byKey.size)return invalid('INVALID_OR_STALE_WORKLIST');
 let criteriaDecided=0,casesDecided=0,ready=0,needsRevision=0;
 const seen=new Set();
 function checkDecision(c){
  if(!['pending','pass','revise','reject'].includes(c.decision))return false;
  return c.decision==='pending'?[c.reviewerRef,c.evidenceRef,c.reviewDate].every(v=>v===''):opaque(c.reviewerRef)&&opaque(c.evidenceRef)&&date(c.reviewDate);
 }
 for(const r of data.records){
  const e=byKey.get(r?.key);
  if(!exact(r,['key','contentSha256','criteria','cases'])||!e||seen.has(r.key)||r.contentSha256!==e.contentSha256||!Array.isArray(r.criteria)||r.criteria.length!==REVIEW_CRITERIA.length||!Array.isArray(r.cases)||r.cases.length!==e.cases.length)return invalid('INVALID_RECORD');
  seen.add(r.key);const ids=new Set(),caseIds=new Set();let allPass=true,revision=false;
  for(const c of r.criteria){
   if(!exact(c,['id','decision','reviewerRef','evidenceRef','reviewDate'])||!REVIEW_CRITERIA.includes(c.id)||ids.has(c.id)||!checkDecision(c))return invalid('INVALID_CRITERION');
   ids.add(c.id);if(c.decision!=='pending')criteriaDecided++;if(c.decision!=='pass')allPass=false;if(['revise','reject'].includes(c.decision))revision=true;
  }
  for(const c of r.cases){
   const want=e.cases.find(x=>x.id===c?.id);
   if(!exact(c,['id','state','decision','reviewerRef','evidenceRef','reviewDate'])||!want||caseIds.has(c.id)||JSON.stringify(c.state)!==JSON.stringify(want.state)||!checkDecision(c))return invalid('INVALID_REFERENCE_CASE');
   caseIds.add(c.id);if(c.decision!=='pending')casesDecided++;if(c.decision!=='pass')allPass=false;if(['revise','reject'].includes(c.decision))revision=true;
  }
  if(allPass)ready++;if(revision)needsRevision++;
 }
 const totalCriteria=byKey.size*REVIEW_CRITERIA.length,totalCases=byKey.size*2;
 return {valid:true,totalModels:byKey.size,totalCriteria,criteriaDecided,pendingCriteria:totalCriteria-criteriaDecided,totalCases,casesDecided,pendingCases:totalCases-casesDecided,readyForIndependentAudit:ready,needsRevision,...flags()};
}
export function computedPrototypeReference(key){
 const d=modelData(key);return {key,contentSha256:d.contentSha256,computedOutputsAreNotIndependentReferences:true,cases:d.states.map((state,i)=>({id:i?'one-control-change':'baseline',state,english:d.outputs[i][0],hindi:d.outputs[i][1]})),worksheets:d.worksheets,...flags()};
}
function evidencePath(name){
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename');
 const dir=path.join(ROOT,'review-evidence');mkdirSync(dir,{recursive:true,mode:0o700});
 const s=lstatSync(dir);if(!s.isDirectory()||s.isSymbolicLink())throw Error('Unsafe evidence directory');
 return path.join(dir,name);
}
function readEvidence(name){
 const fd=openSync(evidencePath(name),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
 try{const s=fstatSync(fd);if(!s.isFile()||s.size>1024*1024)throw Error('Invalid evidence file');return JSON.parse(readFileSync(fd,'utf8'))}finally{closeSync(fd)}
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{
 const [action,arg,...extra]=process.argv.slice(2);if(extra.length)throw Error('Unexpected argument');
 let result;
 if(action==='--summary'&&arg===undefined)result=validatePrototypeReviewWorklist(makePrototypeReviewWorklist());
 else if(action==='--index'&&arg===undefined)result={records:prototypeReviewInventory(),...flags()};
 else if(action==='--template'){const data=makePrototypeReviewWorklist();writeFileSync(evidencePath(arg),JSON.stringify(data,null,2)+'\n',{flag:'wx',mode:0o600});result=validatePrototypeReviewWorklist(data)}
 else if(action==='--check')result=validatePrototypeReviewWorklist(readEvidence(arg));
 else if(action==='--computed')result=computedPrototypeReference(arg);
 else throw Error('Invalid action');
 console.log(JSON.stringify(result,null,2));if(result.valid===false)process.exitCode=1;
 }catch{console.error('Prototype review worklist failed; verify local arguments and exact source version');process.exitCode=1}
}
