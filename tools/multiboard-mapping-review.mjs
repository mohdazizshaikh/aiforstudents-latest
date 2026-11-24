/** M62 board-specific mapping evidence, separate from canonical content and M52 worksheets. */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {combinedMappingCandidates} from './cbse-mapping-review.mjs';
import {bindMaharashtraCandidates,readMaharashtraCandidates} from './maharashtra-candidates.mjs';
import {buildReviewRows} from './build-review-packet.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const schema='aifs-m62-multiboard-review-v1';
const canonical=x=>Array.isArray(x)?'['+x.map(canonical).join(',')+']':x!==null&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
const hash=x=>createHash('sha256').update(canonical(x),'utf8').digest('hex');
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const opaque=x=>typeof x==='string'&&/^[A-Za-z0-9._-]{3,80}$/.test(x);
const rules=Object.freeze({
 CBSE:Object.freeze(['syllabus-anchor','textbook-edition','learning-outcome-fit','grade-suitability','rights']),
 Maharashtra:Object.freeze(['source-anchor','textbook-edition','current-session-applicability','learning-outcome-fit','grade-suitability','medium-language-fit','rights'])
});
export function boardMappingInventory(rows=buildReviewRows(),maharashtra=readMaharashtraCandidates()){
 const state=bindMaharashtraCandidates(maharashtra,rows);
 if(!state.valid)throw Error('Invalid Maharashtra source candidate manifest');
 const candidates=[
  ...combinedMappingCandidates(rows).map(x=>x.mapping),
  ...state.proposals.map(p=>({board:p.board,grade:p.grade,modelId:p.modelId,subject:p.subject,source:p.source,anchorType:p.anchorType,anchor:p.anchor,limitation:p.limitation,reviewRef:p.reviewRef,medium:maharashtra.medium,currentSessionApplicabilityVerified:false}))
 ];
 const out=candidates.map(mapping=>({mappingId:[mapping.board,mapping.grade,mapping.modelId].join('|'),mappingSha256:hash(mapping),mapping}));
 if(new Set(out.map(x=>x.mappingId)).size!==out.length)throw Error('Duplicate board/grade/model candidate');
 return out.sort((a,b)=>a.mappingId<b.mappingId?-1:a.mappingId>b.mappingId?1:0);
}
export function makeBoardReviewWorksheet(rows=buildReviewRows(),maharashtra=readMaharashtraCandidates()){
 return {schema,humanApprovalAuthenticated:false,publicReleaseApproved:false,records:boardMappingInventory(rows,maharashtra).map(x=>({...x,checks:rules[x.mapping.board].map(id=>({id,decision:'pending',reviewerRef:'',evidenceRef:'',note:''}))}))};
}
export function validateBoardReviewWorksheet(data,rows=buildReviewRows(),maharashtra=readMaharashtraCandidates()){
 const errors=[],seen=new Set();
 const report={CBSE:{mappings:0,checks:0,pending:0,readyForIndependentAudit:0,needsRevision:0},Maharashtra:{mappings:0,checks:0,pending:0,readyForIndependentAudit:0,needsRevision:0}};
 const reject=()=>({valid:false,errors,verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!exact(data,['schema','humanApprovalAuthenticated','publicReleaseApproved','records'])||data.schema!==schema||data.humanApprovalAuthenticated!==false||data.publicReleaseApproved!==false||!Array.isArray(data.records)){errors.push('Invalid or approving worksheet');return reject()}
 let expected;try{expected=boardMappingInventory(rows,maharashtra)}catch(e){errors.push(e.message);return reject()}
 const lookup=new Map(expected.map(x=>[x.mappingId,x]));
 for(const r of data.records){
  if(!exact(r,['mappingId','mappingSha256','mapping','checks'])||!lookup.has(r.mappingId)||seen.has(r.mappingId)){errors.push('Unknown or duplicate mapping');continue}
  seen.add(r.mappingId);const p=lookup.get(r.mappingId);
  if(r.mappingSha256!==p.mappingSha256||canonical(r.mapping)!==canonical(p.mapping)){errors.push('Stale or altered mapping '+r.mappingId);continue}
  const required=rules[p.mapping.board],stats=report[p.mapping.board];
  if(!Array.isArray(r.checks)||r.checks.length!==required.length){errors.push('Incomplete checks '+r.mappingId);continue}
  stats.mappings++;stats.checks+=required.length;
  const ids=new Set();let ready=true,revise=false,before=errors.length;
  for(const v of r.checks){
   if(!exact(v,['id','decision','reviewerRef','evidenceRef','note'])||!required.includes(v.id)||ids.has(v.id)||!['pending','pass','revise','reject'].includes(v.decision)){errors.push('Invalid check '+r.mappingId);ready=false;continue}
   ids.add(v.id);
   if(v.decision==='pending'){stats.pending++;ready=false;if([v.reviewerRef,v.evidenceRef,v.note].some(x=>x!==''))errors.push('Pending check must be blank');continue}
   if(!opaque(v.reviewerRef)||!opaque(v.evidenceRef)||typeof v.note!=='string'||v.note.trim().length<12||v.note.length>1000)errors.push('Missing evidence '+r.mappingId);
   if(v.decision!=='pass'){ready=false;revise=true}
  }
  if(revise)stats.needsRevision++;
  if(ready&&ids.size===required.length&&errors.length===before)stats.readyForIndependentAudit++;
 }
 for(const p of expected)if(!seen.has(p.mappingId))errors.push('Missing mapping '+p.mappingId);
 if(errors.length)return reject();
 return {valid:true,errors,byBoard:report,mappings:seen.size,checks:Object.values(report).reduce((n,x)=>n+x.checks,0),pending:Object.values(report).reduce((n,x)=>n+x.pending,0),verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
const output=name=>{
 if(typeof name!=='string'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(name))throw Error('Use a simple JSON filename under review-evidence/');
 return path.join(ROOT,'review-evidence',name);
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [action,name,...extra]=process.argv.slice(2);if(extra.length||!['--template','--check'].includes(action))throw Error('Use --template or --check <filename>');
  const file=output(name);
  if(action==='--template'){const data=makeBoardReviewWorksheet();mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(data,null,2)+'\n',{encoding:'utf8',flag:'wx'});console.log(JSON.stringify(validateBoardReviewWorksheet(data),null,2))}
  else{if(statSync(file).size>4*1024*1024)throw Error('Worksheet too large');const r=validateBoardReviewWorksheet(JSON.parse(readFileSync(file,'utf8')));console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}
 }catch(e){console.error(e.message);process.exitCode=1}
}
