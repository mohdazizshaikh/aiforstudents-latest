/** M116 scoped concept-gap audit. Source proposals are not approved curricula. */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {curriculumPlanningReport} from './curriculum-planning-workbench.mjs';
import {validateDiscovery} from './curriculum-discovery.mjs';
import {PRIMARY_IDS} from '../assets/primary-maths-lab.js';
const read=name=>JSON.parse(readFileSync(new URL('../docs/'+name,import.meta.url),'utf8'));
const boards=['CBSE','Maharashtra'],subjects=['maths','physics','chemistry','biology'];
const bands=[['1-5',1,5],['6-8',6,8],['9-10',9,10],['11-12',11,12]];
export function smartLabGapAudit(){
 const d=read('M36_DRAFT_CURRICULUM_DISCOVERY.json'),g=read('M116_CONCEPT_GAP_MATRIX.json'),r=curriculumPlanningReport();
 if(!validateDiscovery(d).valid||g.schema!=='aifs-m116-gap-hypotheses-v1'||g.verifiedChapters!==0||g.publicReleaseApproved!==false||g.grades.length!==12||JSON.stringify(g.boards)!==JSON.stringify(boards))throw Error('Invalid source inventory or gap manifest');
 const seen=new Set(),prototypes=new Set(),cells=[];
 for(const row of g.grades){
  if(!Number.isInteger(row.grade)||row.grade<1||row.grade>12||seen.has(row.grade)||row.targets.length!==4)throw Error('Invalid gap grade');seen.add(row.grade);
  const lenses=new Set();
  for(const t of row.targets){
   if(!subjects.includes(t.subject)||lenses.has(t.subject)||typeof t.proposedGap!=='string'||!t.proposedGap.trim()||t.officialChapter!==null||t.edition!==null||t.reviewStatus!=='PENDING'||!Array.isArray(t.prototypeIds)||t.prototypeIds.some(k=>!PRIMARY_IDS.includes(k)||prototypes.has(k)))throw Error('Invalid gap target');
   lenses.add(t.subject);for(const k of t.prototypeIds)prototypes.add(k);
   const lens=d.grades.find(x=>x.grade===row.grade).topics.find(x=>x.subject===t.subject);
   const earlier=row.grade===1?null:d.grades.find(x=>x.grade===row.grade-1).topics.find(x=>x.subject===t.subject);
   for(const board of boards){
    const c=r.cells.find(x=>x.board===board&&x.grade===row.grade&&x.subject===t.subject);
    const p=r.proposals.filter(x=>x.board===board&&x.grade===row.grade&&x.subject===t.subject);
    cells.push({board,grade:row.grade,subject:t.subject,stream:row.grade>=11?(t.subject==='maths'?'mathematics option (stream applicability unverified)':'science option (stream applicability unverified)'):'general topic lens (subject structure unverified)',
     relatedDraftConcept:{en:lens.en,hi:lens.hi,modelIds:[...lens.modelIds]},
     earlierConceptCandidate:earlier?{en:earlier.en,hi:earlier.hi,modelIds:[...earlier.modelIds],boardSpecificApproval:false}:null,
     proposedGap:t.proposedGap,prototypeIds:[...t.prototypeIds],
     developmentStatus:t.prototypeIds.length?'NEW_DRAFT_INTERACTION_PRESENT':'PROPOSED_INTERACTION_GAP',
     boardProposals:p.map(x=>({mappingId:x.mappingId,mappingSha256:x.mappingSha256,source:x.source,sourceAnchor:x.sourceAnchor,modelId:x.modelId})),
     pendingChecks:c.pendingChecks,verifiedChapters:0,edition:null,chapter:null,reviewStatus:'PENDING'});
   }
  }
 }
 if(prototypes.size!==PRIMARY_IDS.length)throw Error('Missing primary prototype linkage');
 return {schema:'aifs-m116-concept-gap-audit-v1',scope:'48 proposed grade/subject targets repeated across two boards; not complete syllabus, and absent source proposals do not prove actual curricular gaps.',cells,gradeBands:bands.map(([id,first,last])=>{const group=cells.filter(x=>x.grade>=first&&x.grade<=last);return {id,cells:group.length,sourceProposals:group.reduce((n,x)=>n+x.boardProposals.length,0),pendingChecks:group.reduce((n,x)=>n+x.pendingChecks,0),verifiedChapters:0}}),planningCells:cells.length,uniqueProposedTargets:48,prototypeCount:prototypes.size,verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{if(process.argv.length!==2)throw Error('Fixed source audit only');console.log(JSON.stringify(smartLabGapAudit(),null,2))}catch(e){console.error(e.message);process.exitCode=1}
}
