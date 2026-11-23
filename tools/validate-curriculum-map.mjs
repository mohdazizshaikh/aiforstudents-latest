/** M30: validate DRAFT curriculum source inventory; never certify textbook mapping. */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const OPTIONS_FILE=new URL('../docs/B1_CURRICULUM_SOURCE_OPTIONS.json',import.meta.url);
const isHTTPS=s=>{try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password&&['diksha.gov.in','epathshala.ncert.gov.in'].includes(u.hostname)}catch{return false}};
export function validateCurriculumOptions(data){
 const problems=[];
 if(!data||typeof data!=='object'||data.schema!=='m30-draft-curriculum-options-v1')return {valid:false,problems:['Invalid draft curriculum schema'],certifiedCurriculum:false};
 if(!Array.isArray(data.providerOptions)||data.providerOptions.length<2)problems.push('Provider options missing');
 for(const p of data.providerOptions||[]){
  if(!p.id||!isHTTPS(p.homepage))problems.push('Unrecognized official provider URL');
  if(p.exactEditionVerified!==false||p.redistributionPermission!=='NOT_ASSESSED'||p.use!=='EXTERNAL_LINK_ONLY')problems.push('Provider must remain link-only, source edition and rights unverified');
 }
 const template=data.lessonRecordTemplate;
 if(!template||!Number.isInteger(template.grade)||template.grade<1||template.grade>12||!('ageBand' in template)||template.ageBand!==null||
  template.board!=='UNMAPPED'||template.releaseEligible!==false||
  template.englishReview!=='PENDING'||template.hindiReview!=='PENDING'||
  template.bookEdition!==null||template.chapterId!==null||template.rightsStatus!=='UNASSESSED')problems.push('Unsafe or missing grade/age-band/curriculum draft metadata');
 const grades=data.mathsGradeOutcomes;
 if(!Array.isArray(grades)||grades.length!==12)problems.push('Need 12 explicit provisional grade rows');
 else{
  const seen=new Set();
  for(const g of grades){
   if(!Number.isInteger(g.grade)||g.grade<1||g.grade>12||seen.has(g.grade))problems.push('Invalid/duplicate grade');
   seen.add(g.grade);
   if(g.board!=='UNMAPPED'||g.bookEdition!==null||g.chapterId!==null||g.curriculumVerified!==false||
    g.publishedCoverage!==false||g.reviewStatus!=='PENDING'||g.ageBand!==null)problems.push('False curricular coverage/review claim');
   if(!Array.isArray(g.illustrativeOutcomes)||g.illustrativeOutcomes.length<2||g.illustrativeOutcomes.some(s=>typeof s!=='string'||s.length<10))problems.push('Missing illustrative outcomes');
  }
  if(seen.size!==12)problems.push('Not all grades 1 through 12 represented');
 }
 if(!Array.isArray(data.provisionalGrades1to2)||data.provisionalGrades1to2.length<4||
  data.provisionalGrades1to2.some(x=>![1,2].includes(x.grade)||x.reviewStatus!=='PENDING'||x.chapterVerified!==false||x.board!=='UNMAPPED'))problems.push('Misleading Grade 1–2 draft concept map');
 if(!Array.isArray(data.physicsConceptOptions)||data.physicsConceptOptions.length<3||
  data.physicsConceptOptions.some(x=>x.realHardware!==false||x.verifiedSyllabus!==false))problems.push('Physics concepts must stay safe and provisional');
 if(!Array.isArray(data.chemistryBioSafetyExclusions)||data.chemistryBioSafetyExclusions.length<5)problems.push('Missing Chemistry/Bio safety exclusions');
 return {valid:problems.length===0,problems,grades:grades?.length??0,providerOptions:data.providerOptions?.length??0,certifiedCurriculum:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=validateCurriculumOptions(JSON.parse(readFileSync(OPTIONS_FILE,'utf8')));
 console.log(JSON.stringify(report,null,2));if(!report.valid)process.exitCode=1;
}
