/** M112 optional adult developer rehearsal only. In-memory SQLite; no learner records. */
import {DatabaseSync} from 'node:sqlite';
import {teacherResourceChoices,labPackKeys,LAB_PACK_LIMIT} from '../assets/teacher-cards-engine.js';
import {curriculumPlanningReport} from './curriculum-planning-workbench.mjs';

const SUBJECTS=Object.freeze(['maths','physics','chemistry','biology']);
const KINDS=Object.freeze(['basic','advanced','supplement']);
const BOARDS=Object.freeze(['CBSE','Maharashtra']);
const LANGS=Object.freeze(['en','hi']);
const flags=()=>({localOnly:true,storesStudentData:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
export class PilotInputError extends Error {}
const invalid=()=>{throw new PilotInputError('Invalid request')};
const exact=(o,keys)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
const enumValue=(v,allowed)=>{if(!allowed.includes(v))invalid();return v};
export function createPilotStore(){
 const db=new DatabaseSync(':memory:');
 try{
  db.exec(`PRAGMA foreign_keys=ON;
  BEGIN;
  CREATE TABLE activity(
   key TEXT PRIMARY KEY, subject TEXT NOT NULL CHECK(subject IN ('maths','physics','chemistry','biology')),
   kind TEXT NOT NULL CHECK(kind IN ('basic','advanced','supplement')),
   title_en TEXT NOT NULL, title_hi TEXT NOT NULL
  ) STRICT;
  CREATE TABLE curriculum_cell(
   board TEXT NOT NULL CHECK(board IN ('CBSE','Maharashtra')),
   grade INTEGER NOT NULL CHECK(grade BETWEEN 1 AND 12),
   subject TEXT NOT NULL CHECK(subject IN ('maths','physics','chemistry','biology')),
   proposals INTEGER NOT NULL CHECK(proposals>=0), checks INTEGER NOT NULL CHECK(checks>=0),
   mapping_ids TEXT NOT NULL,
   PRIMARY KEY(board,grade,subject)
  ) STRICT;
  CREATE TABLE rehearsal(
   singleton INTEGER PRIMARY KEY CHECK(singleton=1),
   language TEXT NOT NULL CHECK(language IN ('en','hi'))
  ) STRICT;
  INSERT INTO rehearsal VALUES(1,'en');
  CREATE TABLE rehearsal_item(
   position INTEGER PRIMARY KEY CHECK(position BETWEEN 1 AND 6),
   activity_key TEXT NOT NULL UNIQUE REFERENCES activity(key)
  ) STRICT;
  PRAGMA user_version=1;
  COMMIT;`);
  const en=teacherResourceChoices('all','all','en'), hi=new Map(teacherResourceChoices('all','all','hi').map(x=>[x.key,x]));
  const keys=labPackKeys();
  if(en.length!==keys.length||hi.size!==keys.length||new Set(en.map(x=>x.key)).size!==keys.length||keys.some(k=>!hi.has(k)||!en.some(x=>x.key===k)))throw Error('Inventory mismatch');
  const put=db.prepare('INSERT INTO activity VALUES(?,?,?,?,?)');
  const cell=db.prepare('INSERT INTO curriculum_cell VALUES(?,?,?,?,?,?)');
  const report=curriculumPlanningReport();
  if(report.verifiedChapters!==0||report.publicReleaseApproved!==false)throw Error('Unexpected review state');
  db.exec('BEGIN');
  for(const x of en){const y=hi.get(x.key);if(x.subject!==y.subject||x.kind!==y.kind||x.humanReviewed!==false||y.humanReviewed!==false||x.gradeVerified!==false||y.gradeVerified!==false)throw Error('Invalid draft inventory');put.run(x.key,x.subject,x.kind,x.title,y.title)}
  for(const c of report.cells)cell.run(c.board,c.grade,c.subject,c.proposalCount,c.pendingChecks,JSON.stringify(c.mappingIds));
  db.exec('COMMIT');
 }catch(e){db.close();throw e}
 const known=new Set(labPackKeys());
 const version=()=>db.prepare('PRAGMA user_version').get().user_version;
 function catalog({subject='all',kind='all',lang='en'}={}){
  enumValue(subject,['all',...SUBJECTS]);enumValue(kind,['all',...KINDS]);enumValue(lang,LANGS);
  const title=lang==='hi'?'title_hi':'title_en';
  const items=db.prepare(`SELECT key,subject,kind,${title} AS title FROM activity WHERE (?='all' OR subject=?) AND (?='all' OR kind=?) ORDER BY key`).all(subject,subject,kind,kind).map(x=>({...x,humanReviewed:false,gradeVerified:false}));
  return {language:lang,total:items.length,items,...flags()};
 }
 function curriculum({board,grade,subject}){
  enumValue(board,BOARDS);enumValue(subject,SUBJECTS);if(!Number.isInteger(grade)||grade<1||grade>12)invalid();
  const row=db.prepare('SELECT proposals,checks,mapping_ids FROM curriculum_cell WHERE board=? AND grade=? AND subject=?').get(board,grade,subject);
  if(!row)throw Error('Missing planning cell');
  return {board,grade,subject,proposalCount:row.proposals,pendingChecks:row.checks,mappingIds:JSON.parse(row.mapping_ids),status:row.proposals?'SOURCE_PROPOSALS_UNREVIEWED':'NO_SOURCE_PROPOSAL_IN_INVENTORY',verifiedChapters:0,...flags()};
 }
 function getPlan(){
  const language=db.prepare('SELECT language FROM rehearsal WHERE singleton=1').get().language;
  const items=db.prepare('SELECT position,activity_key AS key FROM rehearsal_item ORDER BY position').all().map(x=>({...x}));
  return {language,items,syntheticRehearsalOnly:true,...flags()};
 }
 function setPlan(data){
  if(!exact(data,['language','keys'])||!LANGS.includes(data.language)||!Array.isArray(data.keys)||data.keys.length>LAB_PACK_LIMIT||new Set(data.keys).size!==data.keys.length||data.keys.some(k=>!known.has(k)))invalid();
  db.exec('BEGIN');
  try{
   db.prepare('UPDATE rehearsal SET language=? WHERE singleton=1').run(data.language);
   db.exec('DELETE FROM rehearsal_item');
   const insert=db.prepare('INSERT INTO rehearsal_item VALUES(?,?)');
   data.keys.forEach((k,i)=>insert.run(i+1,k));
   db.exec('COMMIT');
  }catch(e){db.exec('ROLLBACK');throw e}
  return getPlan();
 }
 return {version,catalog,curriculum,getPlan,setPlan,clearPlan:()=>setPlan({language:'en',keys:[]}),close:()=>db.close()};
}
