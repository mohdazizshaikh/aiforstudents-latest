/** M20: Read-only bilingual human-review worklist. Never mutates approvals or student data. */
import {readFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {auditContentQueues, REVIEW_FILES} from './release-preflight.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KINDS=Object.keys(REVIEW_FILES);
const HEADERS=['queue','content_id','content_version','priority','age_band','subject_or_topic','source_file','line','english_draft','hindi_draft','choices_english','choices_hindi','answer_or_guidance','source_review_flags','human_decision'];

export function csvCell(value) {
 const raw=String(value ?? '');
 // Spreadsheet applications may evaluate expressions even inside quoted CSV fields.
 const safe=/^\s*[=+\-@]/.test(raw) ? "'" + raw : raw;
 return '"' + safe.replaceAll('"','""') + '"';
}
const val=(...options)=>options.find(x=>x!==undefined && x!==null && x!=='') ?? '';
const localized=(record,field,language)=>typeof record[field]==='object' && record[field]!==null ? record[field][language] : '';
const asText=(v)=>typeof v==='object' && v!==null?JSON.stringify(v):String(v ?? '');
export function itemId(kind,item) {
 if(kind==='studio')return [item.journeyId,item.stageId].filter(Boolean).join(':');
 if(kind==='experiment')return [item.experimentId,item.taskId].filter(Boolean).join(':');
 return String(item.id ?? '');
}
function readJsonl(root,kind){
 const name=REVIEW_FILES[kind], direct=path.join(root,name);
 const archive=path.join(root,'docs/CONTENT_REVIEW_QUEUE.jsonl.gz');
 const archived=kind==='game' && !existsSync(direct);
 if(!existsSync(direct) && !(archived && existsSync(archive)))throw Error('Missing review queue '+name);
 const source=archived?'docs/CONTENT_REVIEW_QUEUE.jsonl.gz':name;
 const data=archived?gunzipSync(readFileSync(archive)).toString('utf8'):readFileSync(direct,'utf8');
 const result=[];const seen=new Set();
 data.split(/\r?\n/).forEach((line,i)=>{
  if(!line.trim())return;
  let item;try{item=JSON.parse(line)}catch{throw Error(source+':'+(i+1)+' invalid JSON')}
  const id=itemId(kind,item);
  if(!id || id.endsWith(':') || id.startsWith(':'))throw Error(source+':'+(i+1)+' missing stable item ID');
  if(seen.has(id))throw Error(source+':'+(i+1)+' duplicate ID '+id);
  seen.add(id);
  result.push({item,id,source,line:i+1});
 });
 return result;
}
export function buildReviewRows(root=ROOT){
 const rows=[];
 for(const kind of KINDS){
  for(const {item,id,source,line} of readJsonl(root,kind)){
   const en=val(item.question_en,item.questionEn,localized(item,'question','en'),item.question_en,localized(item,'title','en'),item.stageId,item.taskId);
   const hi=val(item.question_hi,item.questionHi,localized(item,'question','hi'),localized(item,'title','hi'));
   const choicesEn=val(item.choicesEn,Array.isArray(item.options)?item.options.map(x=>x.en):null);
   const choicesHi=val(item.choicesHi,Array.isArray(item.options)?item.options.map(x=>x.hi):null);
   const guidance=val(item.answer_for_reviewer,item.correctChoice,item.answer,localized(item,'teacherGuidance','en'),item.explanation_en,item.explanationEn,localized(item,'explanation','en'));
   const flags=Object.entries(item).filter(([k])=>/review|approv|mapping|license|copyright/i.test(k)).map(([k,v])=>k+': '+asText(v)).join('; ');
   rows.push({
    queue:kind,content_id:id,content_version:asText(val(item.content_version,item.contentVersion,item.version,'unspecified')),
    priority:['studio','experiment','classroom'].includes(kind)?'pilot-first':kind==='game'?'extended-library':'foundation',
    age_band:asText(val(item.age_band,item.ageBand,'not-mapped')),
    subject_or_topic:asText(val(item.category,item.subject,item.topic,item.lesson,'not-mapped')),
    source_file:source,line,
    english_draft:asText(en),hindi_draft:asText(hi),
    choices_english:asText(choicesEn),choices_hindi:asText(choicesHi),answer_or_guidance:asText(guidance),
    source_review_flags:flags,
    human_decision:'NO DECISION RECORDED BY THIS EXPORT'
   });
  }
 }
 return rows;
}
export function packetCsv(rows){
 return HEADERS.map(csvCell).join(',')+'\n'+rows.map(row=>HEADERS.map(key=>csvCell(row[key])).join(',')).join('\n')+'\n';
}
export function buildSummary(root=ROOT,rows=buildReviewRows(root)){
 const audit=auditContentQueues(root);
 if(audit.problems.length)throw Error('Review inventory validation: '+audit.problems.join('; '));
 if(rows.length!==audit.total)throw Error('Review packet count mismatch: '+rows.length+' vs '+audit.total);
 return {
  packetVersion:'m20-review-worklist-v1',
  generatedAt:null,
  totalRows:rows.length,pendingHumanReviewRecords:audit.pending,
  byQueue:audit.counts,
  humanApprovalGrantedByTool:false,publicReleaseApproved:false,
  note:'Export is for qualified human review only. No content approvals or safety signoffs are conferred.'
 };
}
export function exportPacket(outputDir,root=ROOT){
 const rows=buildReviewRows(root);
 const summary=buildSummary(root,rows);
 mkdirSync(outputDir,{recursive:true});
 writeFileSync(path.join(outputDir,'review-packet.csv'),packetCsv(rows),'utf8');
 writeFileSync(path.join(outputDir,'summary.json'),JSON.stringify(summary,null,2)+'\n','utf8');
 writeFileSync(path.join(outputDir,'README.txt'),
 'M20 DRAFT REVIEW WORKLIST — NOT HUMAN APPROVAL\n'+
 'Review CSV using a spreadsheet capable of preserving UTF-8 Hindi. Spreadsheet formula-like cells are escaped.\n'+
 'Source file/line points to canonical JSONL or a compressed game archive. Keep exact source version when recording real decisions.\n'+
 'No decisions are imported or written to the source queues by this command. Do not publish unreviewed material.\n','utf8');
 return summary;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const argv=process.argv.slice(2);
 if(argv.length!==2 || argv[0]!=='--out' || !argv[1]){
  console.error('Usage: node tools/build-review-packet.mjs --out <directory>');process.exitCode=2;
 }else{
  try{console.log(JSON.stringify(exportPacket(path.resolve(argv[1])),null,2))}
  catch(e){console.error(e.message);process.exitCode=1}
 }
}
