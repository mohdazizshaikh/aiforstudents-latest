/** M21: Read-only bilingual review packet. Source data and human signoffs are never modified. */
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {STUDIO_LESSONS,STUDIO_VERSION} from '../assets/studio-engine.js';
import {EXPERIMENTS,EXPERIMENT_VERSION} from '../assets/experiment-engine.js';
import {auditContentQueues,REVIEW_FILES} from './release-preflight.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const KINDS=Object.keys(REVIEW_FILES);
const HEADERS=[
 'queue','content_id','content_version','priority','age_band','subject_or_topic',
 'source_file','line','content_source','content_sha256',
 'english_draft','hindi_draft','context_english','context_hindi',
 'choices_english','choices_hindi','answer_or_guidance',
 'hints_english','hints_hindi','explanation_english','explanation_hindi',
 'source_review_flags','human_decision'
];
export function csvCell(value) {
 const raw=String(value ?? '');
 // Quoting alone does not prevent spreadsheet programs from treating user-authored text as formulas.
 const safe=/^\s*[=+\-@]/.test(raw)?"'"+raw:raw;
 return '"'+safe.replaceAll('"','""')+'"';
}
const val=(...options)=>options.find(x=>x!==undefined&&x!==null&&x!=='')??'';
const pair=(x,lang)=>Array.isArray(x)?(x[lang==='hi'?1:0]??''):x&&typeof x==='object'?(x[lang]??''):'';
const asText=x=>typeof x==='object'&&x!==null?JSON.stringify(x):String(x??'');
export function itemId(kind,item) {
 if(kind==='studio')return [item.journeyId,item.stageId].filter(Boolean).join(':');
 if(kind==='experiment')return [item.experimentId,item.taskId].filter(Boolean).join(':');
 return String(item.id??'');
}
function readJsonl(root,kind) {
 const name=REVIEW_FILES[kind],direct=path.join(root,name);
 const archive=path.join(root,'docs/CONTENT_REVIEW_QUEUE.jsonl.gz');
 const archived=kind==='game'&&!existsSync(direct);
 if(!existsSync(direct)&&!(archived&&existsSync(archive)))throw Error('Missing review queue '+name);
 const source=archived?'docs/CONTENT_REVIEW_QUEUE.jsonl.gz':name;
 const data=archived?gunzipSync(readFileSync(archive)).toString('utf8'):readFileSync(direct,'utf8');
 const result=[],seen=new Set();
 data.split(/\r?\n/).forEach((line,i)=>{
  if(!line.trim())return;
  let item;try{item=JSON.parse(line)}catch{throw Error(source+':'+(i+1)+' invalid JSON')}
  const id=itemId(kind,item);
  if(!id||id.endsWith(':')||id.startsWith(':'))throw Error(source+':'+(i+1)+' missing stable item ID');
  if(seen.has(id))throw Error(source+':'+(i+1)+' duplicate ID '+id);
  seen.add(id);result.push({item,id,source,line:i+1});
 });
 return result;
}
// Some pilot queues contain *metadata only*. Reviewers need the actual authored content,
// which lives in the imported deterministic teaching engines, not the queue.
export function resolvePilotContent(kind,item) {
 if(kind==='studio'){
  const lesson=STUDIO_LESSONS[item.journeyId];
  const task=lesson?.stages.find(s=>s.id===item.stageId);
  if(!task)throw Error('Studio queue refers to unknown exercise: '+itemId(kind,item));
  if(item.contentVersion!==STUDIO_VERSION)throw Error('Studio queue version mismatch: '+itemId(kind,item));
  const correct=task.type==='choice'
    ? 'choice index '+task.answer+' (zero-based): '+pair(task.options[task.answer],'en')
    : task.type==='fraction'?'shade '+task.target+' equal parts'
    : task.type==='switch'?'switch closed = '+task.target:'inspect engine';
  return {
   content_source:'assets/studio-engine.js',
   english_draft:pair(task.question,'en'),hindi_draft:pair(task.question,'hi'),
   context_english:pair(lesson.concept,'en')+' | Offline: '+pair(lesson.mission,'en'),
   context_hindi:pair(lesson.concept,'hi')+' | ऑफ़लाइन: '+pair(lesson.mission,'hi'),
   choices_english:task.options?.map(o=>pair(o,'en'))??[],
   choices_hindi:task.options?.map(o=>pair(o,'hi'))??[],
   answer_or_guidance:correct,
   hints_english:pair(task.hint,'en'),hints_hindi:pair(task.hint,'hi'),
   explanation_english:pair(task.explanation,'en'),
   explanation_hindi:pair(task.explanation,'hi')
  };
 }
 if(kind==='experiment'){
  const experiment=EXPERIMENTS[item.experimentId];
  const task=experiment?.tasks.find(s=>s.id===item.taskId);
  if(!task)throw Error('Experiment queue refers to unknown task: '+itemId(kind,item));
  if(item.contentVersion!==EXPERIMENT_VERSION)throw Error('Experiment queue version mismatch: '+itemId(kind,item));
  return {
   content_source:'assets/experiment-engine.js',
   english_draft:pair(task.prompt,'en'),hindi_draft:pair(task.prompt,'hi'),
   context_english:pair(experiment.overview,'en')+' | '+pair(experiment.mission,'en'),
   context_hindi:pair(experiment.overview,'hi')+' | '+pair(experiment.mission,'hi'),
   choices_english:[],choices_hindi:[],
   // Simulations do not have one fixed answer. Never invent a choice key here.
   answer_or_guidance:'State-dependent validation: inspect evaluateExperiment in assets/experiment-engine.js',
   hints_english:pair(task.hint,'en'),hints_hindi:pair(task.hint,'hi'),
   explanation_english:'',explanation_hindi:''
  };
 }
 return null;
}
function reviewRow(kind,{item,id,source,line}) {
 const pilot=resolvePilotContent(kind,item);
 const english=val(pilot?.english_draft,item.question_en,item.questionEn,pair(item.question,'en'),pair(item.title,'en'),item.stageId,item.taskId);
 const hindi=val(pilot?.hindi_draft,item.question_hi,item.questionHi,pair(item.question,'hi'),pair(item.title,'hi'));
 const contextEn=val(pilot?.context_english,item.context_en,pair(item.teacher,'en'));
 const contextHi=val(pilot?.context_hindi,item.context_hi,pair(item.teacher,'hi'));
 const choicesEn=val(pilot?.choices_english,item.choicesEn,Array.isArray(item.options)?item.options.map(x=>x.en):null);
 const choicesHi=val(pilot?.choices_hindi,item.choicesHi,Array.isArray(item.options)?item.options.map(x=>x.hi):null);
 const guidance=val(pilot?.answer_or_guidance,item.answer_for_reviewer,item.correctChoice,item.answer,pair(item.teacherGuidance,'en'),item.explanation_en,item.explanationEn,pair(item.explanation,'en'));
 const hintsEn=val(pilot?.hints_english,item.hint_en);
 const hintsHi=val(pilot?.hints_hindi,item.hint_hi);
 const explanationEn=val(pilot?.explanation_english,item.explanation_en,item.explanationEn,pair(item.teacherGuidance,'en'),pair(item.explanation,'en'));
 const explanationHi=val(pilot?.explanation_hindi,item.explanation_hi,item.explanationHi,pair(item.teacherGuidance,'hi'),pair(item.explanation,'hi'));
 const row={
  queue:kind,content_id:id,
  content_version:asText(val(item.content_version,item.contentVersion,item.version,'unspecified')),
  priority:['studio','experiment','classroom'].includes(kind)?'pilot-first':kind==='game'?'extended-library':'foundation',
  age_band:asText(val(item.age_band,item.ageBand,'not-mapped')),
  subject_or_topic:asText(val(item.category,item.subject,item.topic,item.lesson,'not-mapped')),
  source_file:source,line,content_source:pilot?.content_source??source,
  english_draft:asText(english),hindi_draft:asText(hindi),
  context_english:asText(contextEn),context_hindi:asText(contextHi),
  choices_english:asText(choicesEn),choices_hindi:asText(choicesHi),
  answer_or_guidance:asText(guidance),
  hints_english:asText(hintsEn),hints_hindi:asText(hintsHi),
  explanation_english:asText(explanationEn),explanation_hindi:asText(explanationHi),
  source_review_flags:Object.entries(item).filter(([k])=>/review|approv|mapping|license|copyright/i.test(k)).map(([k,v])=>k+': '+asText(v)).join('; '),
  human_decision:'NO DECISION RECORDED BY THIS EXPORT'
 };
 if(!row.english_draft.trim()||!row.hindi_draft.trim())throw Error(source+':'+line+' missing English/Hindi reviewer text');
 // Exclude mutable review flags from digest: a text edit must invalidate prior content review,
 // whereas a status-only change does not alter the underlying teaching content.
 const reviewContent=Object.fromEntries(Object.entries(row).filter(([k])=>!['source_file','line','source_review_flags','human_decision','content_sha256'].includes(k)));
 row.content_sha256=createHash('sha256').update(JSON.stringify(reviewContent),'utf8').digest('hex');
 return row;
}
export function buildReviewRows(root=ROOT) {
 const rows=[];
 for(const kind of KINDS)for(const entry of readJsonl(root,kind))rows.push(reviewRow(kind,entry));
 return rows;
}
export function packetCsv(rows) {
 return HEADERS.map(csvCell).join(',')+'\n'+rows.map(row=>HEADERS.map(key=>csvCell(row[key])).join(',')).join('\n')+'\n';
}
export function buildSummary(root=ROOT,rows=buildReviewRows(root)) {
 const audit=auditContentQueues(root);
 if(audit.problems.length)throw Error('Review inventory validation: '+audit.problems.join('; '));
 if(rows.length!==audit.total)throw Error('Review packet count mismatch: '+rows.length+' vs '+audit.total);
 return {
  packetVersion:'m21-review-worklist-v2',
  generatedAt:null,totalRows:rows.length,pendingHumanReviewRecords:audit.pending,
  byQueue:audit.counts,humanApprovalGrantedByTool:false,publicReleaseApproved:false,
  note:'Bilingual review worklist with content fingerprints. Expert signoffs, actual syllabus mapping and child-safety approval remain external.'
 };
}
export function exportPacket(outputDir,root=ROOT) {
 const rows=buildReviewRows(root),summary=buildSummary(root,rows);
 mkdirSync(outputDir,{recursive:true});
 writeFileSync(path.join(outputDir,'review-packet.csv'),packetCsv(rows),'utf8');
 writeFileSync(path.join(outputDir,'summary.json'),JSON.stringify(summary,null,2)+'\n','utf8');
 writeFileSync(path.join(outputDir,'README.txt'),
  'M21 BILINGUAL DRAFT WORKLIST — NOT HUMAN APPROVAL\n'+
  'UTF-8 CSV includes authored Studio/Experiment prompts from engine source and SHA-256 content fingerprints.\n'+
  'Do not interpret a SHA-256 as authenticity or educational correctness; compare it against the exact source before signoff.\n'+
  'A human reviewer must separately inspect examples, correct answers, age/class mapping, Hindi, licensing and safety.\n'+
  'No status change or approval is written to canonical queues or source by this tool.\n','utf8');
 return summary;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const args=process.argv.slice(2);
 if(args.length!==2||args[0]!=='--out'||!args[1]){
  console.error('Usage: node tools/build-review-packet.mjs --out <directory>');process.exitCode=2;
 }else{
  try{console.log(JSON.stringify(exportPacket(path.resolve(args[1])),null,2))}
  catch(e){console.error(e.message);process.exitCode=1}
 }
}
