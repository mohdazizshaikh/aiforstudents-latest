/** M77 maintainer planning only: absence of a proposal is NOT evidence of missing syllabus content. */
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeBoardReviewWorksheet,validateBoardReviewWorksheet} from './multiboard-mapping-review.mjs';
import {buildReviewRows} from './build-review-packet.mjs';
import {TEACHER_LAB_SUBJECTS,teacherPrintableOptions,teacherActivityChoices} from '../assets/teacher-cards-engine.js';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const BOARDS=Object.freeze(['CBSE','Maharashtra']);
export function curriculumPlanningReport(){
 const rows=buildReviewRows(),worksheet=makeBoardReviewWorksheet(rows),validation=validateBoardReviewWorksheet(worksheet,rows);
 if(!validation.valid||validation.pending!==validation.checks||validation.verifiedChapters!==0)throw Error('Unexpected mapping review state');
 const cells=[],proposals=worksheet.records.map(r=>{
  const m=r.mapping;
  if(!BOARDS.includes(m.board)||!Number.isInteger(m.grade)||m.grade<1||m.grade>12||!TEACHER_LAB_SUBJECTS.includes(m.subject))throw Error('Invalid source mapping coordinate');
  return {mappingId:r.mappingId,mappingSha256:r.mappingSha256,board:m.board,grade:m.grade,subject:m.subject,modelId:m.modelId,reviewRef:m.reviewRef,source:m.sourceUrl??m.source.url,sourceAnchor:m.syllabusRef??m.anchor,checkIds:r.checks.map(c=>c.id),reviewStatus:'PENDING',verified:false};
 });
 for(const board of BOARDS)for(let grade=1;grade<=12;grade++)for(const subject of TEACHER_LAB_SUBJECTS){
  const matches=proposals.filter(p=>p.board===board&&p.grade===grade&&p.subject===subject);
  cells.push({board,grade,subject,proposalCount:matches.length,pendingChecks:matches.reduce((n,p)=>n+p.checkIds.length,0),mappingIds:matches.map(p=>p.mappingId),status:matches.length?'SOURCE_PROPOSALS_UNREVIEWED':'NO_SOURCE_PROPOSAL_IN_INVENTORY',verifiedChapters:0});
 }
 const models=TEACHER_LAB_SUBJECTS.flatMap(subject=>teacherPrintableOptions(subject).map(x=>{
  const modelId=x.id.includes('/')?x.id.replace('/',':'):'advanced:'+x.id;
  const matches=proposals.filter(p=>p.modelId===modelId);
  return {modelId,subject,mappingIds:matches.map(p=>p.mappingId),status:matches.length?'SOURCE_PROPOSALS_UNREVIEWED':'NO_SOURCE_PROPOSAL_IN_INVENTORY',gradeVerified:false};
 }));
 const resourceCounts=Object.fromEntries(TEACHER_LAB_SUBJECTS.map(s=>[s,teacherActivityChoices(s).length]));
 const reviewPriority=[...cells].filter(c=>c.proposalCount).sort((a,b)=>b.pendingChecks-a.pendingChecks||a.board.localeCompare(b.board)||a.grade-b.grade||a.subject.localeCompare(b.subject)).map(c=>({board:c.board,grade:c.grade,subject:c.subject,pendingChecks:c.pendingChecks,mappingIds:c.mappingIds}));
 return {schema:'aifs-m77-curriculum-planning-v1',scope:'Inventory discovery only; no proposal is not a syllabus coverage claim. Early science subject columns are planning categories, not official course structure.',boards:BOARDS,planningCells:cells.length,withProposals:cells.filter(c=>c.proposalCount).length,withoutProposals:cells.filter(c=>!c.proposalCount).length,proposalCount:proposals.length,pendingChecks:validation.pending,mainModels:models.length,printableActivities:Object.values(resourceCounts).reduce((n,x)=>n+x,0),verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false,cells,models,proposals,reviewPriority,resourceCounts};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const args=process.argv.slice(2),report=curriculumPlanningReport();
  if(args.length){
   if(args.length!==2||args[0]!=='--export'||!/^[A-Za-z0-9_-]{1,80}\.json$/.test(args[1]))throw Error('Use --export <simple.json> under review-packet/');
   const dir=path.join(ROOT,'review-packet');mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,args[1]),JSON.stringify(report,null,2)+'\n',{encoding:'utf8',flag:'wx'});
  }
  const {cells,models,proposals,reviewPriority,...summary}=report;console.log(JSON.stringify(summary,null,2));
 }catch(e){console.error(e.message);process.exitCode=1}
}
