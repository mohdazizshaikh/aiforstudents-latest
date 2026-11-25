/** Source-derived draft metadata, no student data. CLI only. */
import {teacherResourceChoices} from '../../assets/teacher-cards-engine.js';
import {prototypeChoices} from '../../assets/extended-lab-catalog.js';
import {curriculumPlanningReport} from '../curriculum-planning-workbench.mjs';
const choices=lang=>[...teacherResourceChoices('all','all',lang),...prototypeChoices(lang)];
const en=choices('en'),hi=new Map(choices('hi').map(x=>[x.key,x])),r=curriculumPlanningReport();
if(hi.size!==en.length||new Set(en.map(x=>x.key)).size!==en.length||r.verifiedChapters!==0||r.publicReleaseApproved!==false)throw Error('Draft inventory mismatch');
const activity=en.map(x=>{const y=hi.get(x.key);if(!y||x.subject!==y.subject||x.kind!==y.kind||x.humanReviewed!==false||y.humanReviewed!==false||x.gradeVerified!==false||y.gradeVerified!==false)throw Error('Invalid draft inventory');return {key:x.key,subject:x.subject,kind:x.kind,title_en:x.title,title_hi:y.title}}).sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);
const cells=r.cells.map(c=>({board:c.board,grade:c.grade,subject:c.subject,proposals:c.proposalCount,checks:c.pendingChecks,mapping_ids:JSON.stringify(c.mappingIds)})).sort((a,b)=>a.board.localeCompare(b.board)||a.grade-b.grade||a.subject.localeCompare(b.subject));
if(cells.length!==96)throw Error('Unexpected planning inventory');
if(process.argv.length!==2)throw Error('Fixed source fixture only');
console.log(JSON.stringify({activity,cells,publicReleaseApproved:false,storesStudentData:false}));
