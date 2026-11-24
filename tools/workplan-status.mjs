/** M30 evidence-only work-plan status reporter; never authenticates real people/hosting.
 * Usage: node tools/workplan-status.mjs [--check] --write requires explicit local editor.
 */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const PLAN=new URL('../docs/MASTER_100_WORK_ITEMS.json',import.meta.url);
export const DASHBOARD=new URL('../docs/B1_PROGRESS_DASHBOARD.md',import.meta.url);
export const STATES=Object.freeze(['NOT_STARTED','IN_PROGRESS','CODE_COMPLETE_TESTED','REVIEW_PENDING','BLOCKED_EXTERNAL','DONE_VERIFIED']);
const validEvidence=e=>e&&typeof e==='object'&&['source','test'].includes(e.kind)&&typeof e.path==='string'&&
 /^(?:(?:docs|tests|tools|assets)\/[A-Za-z0-9_./-]+|index\.html|service-worker\.js)$/.test(e.path)&&!e.path.includes('..');
export function auditWorkPlan(p){
 const errors=[];
 if(p?.schema!=='aifs-full-product-100-work-v1'||!Array.isArray(p.items)||p.items.length!==100)
  return {valid:false,errors:['Expected exact M29 100-item work plan'],humanApprovalAuthenticated:false,publicReleaseApproved:false};
 const byId=new Map(p.items.map(x=>[x.id,x])),used=new Set();
 for(const x of p.items){
  if(!/^FP-\d{3}$/.test(x.id)||used.has(x.id))errors.push('Duplicate/invalid item id '+x.id);
  used.add(x.id);
  if(!STATES.includes(x.status))errors.push(x.id+' invalid status');
  if(x.status==='DONE_VERIFIED'){
   if(x.execution==='HUMAN_GATE')errors.push(x.id+' human gate cannot be authenticated by automated tool');
   if(!Array.isArray(x.evidence)||x.evidence.length<2||
    !x.evidence.some(e=>e.kind==='source')||!x.evidence.some(e=>e.kind==='test')||
    x.evidence.some(e=>!validEvidence(e)))errors.push(x.id+' insufficient or unsafe completion evidence');
   for(const e of x.evidence||[])if(validEvidence(e)&&!existsSync(new URL('../'+e.path,import.meta.url)))
    errors.push(x.id+' referenced evidence file does not exist: '+e.path);
   for(const dep of x.dependsOn||[])if(byId.get(dep)?.status!=='DONE_VERIFIED')
    errors.push(x.id+' cannot be done while dependency '+dep+' remains incomplete');
  }else if(x.evidence?.length)errors.push(x.id+' incomplete task holds fake completion evidence');
 }
 for(const b of ['B1','B2'])if(p.items.filter(x=>x.batch===b).length!==50)errors.push('Invalid batch size '+b);
 if(p.publicReleaseApproved!==false||p.existingUnreviewedContentRecords!==3282||p.safeguardingHumanGatesPending!==6)
  errors.push('Public release or legacy pending review/safety baseline must not be altered by planning tool');
 return {valid:errors.length===0,errors,byBatch:Object.fromEntries(['B1','B2'].map(b=>[b,{
  total:50,verified:p.items.filter(x=>x.batch===b&&x.status==='DONE_VERIFIED').length,
  blockedExternal:p.items.filter(x=>x.batch===b&&x.status==='BLOCKED_EXTERNAL').length
 }])),humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
export function formatWorkPlanDashboard(p){
 const audit=auditWorkPlan(p);if(!audit.valid)throw Error(audit.errors.join('; '));
 const ids=p.items.filter(x=>x.status==='DONE_VERIFIED').map(x=>x.id);
 const pending=p.items.filter(x=>x.batch==='B1'&&x.status!=='DONE_VERIFIED');
 return `# B1 — Engineering Workstream Progress Dashboard (M33)

**Computed from the machine-readable 100-task tracker.** This is engineering evidence ONLY. Human educational, legal, safety, actual Hostinger and school approvals are **NOT AUTHENTICATED**.

| Batch | Verified engineering/design tasks | Total | Still to implement / externally verify |
|---|---:|---:|---:|
| B1 | ${audit.byBatch.B1.verified} | 50 | ${50-audit.byBatch.B1.verified} |
| B2 | ${audit.byBatch.B2.verified} | 50 | ${50-audit.byBatch.B2.verified} |

## Verified task IDs (engineering/source acceptance only)

${ids.length?ids.join(', '):'None'}

## B1 remaining task IDs

${pending.map(x=>`${x.id} (${x.status})`).join(', ')||'None'}

## Unchanged hard launch stops

- Original 3,282 unreviewed educational records + 3 M30 Maths + 7 M31 Science + 12 M33 expanded models = **3,304 pending subject/Hindi reviews**, with no qualified approvals recorded.
- All six actual safeguarding/legal operation human gates remain pending.
- Actual restricted Hostinger HTTPS deployment, rollback, real low-end Android/assistive-technology and properly permitted classroom trial remain pending.
- Prototype scope is NOT a comprehensive Class 1–12 mathematics/science curriculum, full teacher dashboard or real generative AI tutor.
- publicReleaseApproved: false; noindex must remain in place.

[Full scope](FULL_PRODUCT_SCOPE_AND_DONE.md) · [Task register](MASTER_100_WORK_ITEMS.json) · [M33 engineering QA](M33_EXPANDED_LABS_QA.md).
`;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const p=JSON.parse(readFileSync(PLAN,'utf8')),audit=auditWorkPlan(p);
 if(!audit.valid){console.error(audit.errors.join('\n'));process.exitCode=1}
 else{
  const report=formatWorkPlanDashboard(p);
  if(process.argv.includes('--write')){writeFileSync(DASHBOARD,report,'utf8');console.log('Updated progress dashboard (no human approval inferred)')}
  else if(process.argv.includes('--check')){
   if(!existsSync(DASHBOARD)||readFileSync(DASHBOARD,'utf8')!==report){console.error('Stale B1 dashboard. Run --write locally and commit.');process.exitCode=1;}
   else console.log(JSON.stringify(audit,null,2));
  }else console.log(report);
 }
}
