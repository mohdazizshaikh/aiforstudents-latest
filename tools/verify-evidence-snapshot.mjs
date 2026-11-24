/** Historical evidence snapshot validator. Structural checks never authenticate a human.
 * --require-git checks every path against the immutable verified commit. No fetch or network.
 */
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const hash=/^[a-f0-9]{40}$/;
export function validateEvidenceSnapshot(tracker,snapshot,{resolveBlob}={}){
 const errors=[];
 if(snapshot?.schema!=='aifs-evidence-snapshot-v1'||snapshot.publicReleaseApproved!==false||!hash.test(snapshot.commit||'')||!/^https:\/\/github\.com\/mohdazizshaikh\/aiforstudents-latest\/actions\/runs\/\d+$/.test(snapshot.ciRun||''))errors.push('Invalid evidence snapshot');
 const expected=new Map(tracker.items.filter(x=>x.status==='DONE_VERIFIED').map(x=>[x.id,x]));
 const seen=new Set();
 for(const entry of snapshot?.entries||[]){
  const task=expected.get(entry.id);
  if(!task||seen.has(entry.id)){errors.push('Unexpected/duplicate evidence task '+entry.id);continue;}
  seen.add(entry.id);
  if(!Array.isArray(entry.evidence)||entry.evidence.length!==task.evidence.length){errors.push('Wrong evidence length '+entry.id);continue;}
  const keys=new Set();
  for(const e of entry.evidence){
   const key=e.kind+':'+e.path;
   if(keys.has(key)||!task.evidence.some(t=>t.kind===e.kind&&t.path===e.path)||!hash.test(e.blob||'')){errors.push('Invalid evidence '+entry.id+' '+key);continue;}
   keys.add(key);
   if(resolveBlob){try{if(resolveBlob(snapshot.commit,e.path)!==e.blob)errors.push('Git blob mismatch '+entry.id+' '+e.path)}catch{errors.push('Git object unavailable '+entry.id+' '+e.path)}}
  }
 }
 for(const id of expected.keys())if(!seen.has(id))errors.push('Missing snapshot '+id);
 return {valid:errors.length===0,errors,verifiedTaskReferences:seen.size,gitObjectsChecked:typeof resolveBlob==='function',humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const requireGit=process.argv.includes('--require-git');
 const resolveBlob=requireGit?(commit,p)=>execFileSync('git',['rev-parse',commit+':'+p],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8'}).trim():undefined;
 const r=validateEvidenceSnapshot(read('docs/MASTER_100_WORK_ITEMS.json'),read('docs/M35_EVIDENCE_SNAPSHOT.json'),{resolveBlob});
 console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1;
}
