/** M49 source-linked candidate crosswalk: maintainer-only, no external retrieval or approval. */
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from './build-review-packet.mjs';
import {readFileSync} from 'node:fs';
const FILE=new URL('../docs/M49_CBSE_2026_27_CANDIDATES.json',import.meta.url);
export function readCbseCandidates(){return JSON.parse(readFileSync(FILE,'utf8'))}
const expectedSources={maths:['041','Maths'],physics:['042','Physics'],chemistry:['043','Chemistry'],biology:['044','Biology']};
const prefix='https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/';
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function bindCbseCandidates(data=readCbseCandidates(),reviewRows=buildReviewRows()){
 const errors=[],proposals=[],seen=new Set();
 const fail=()=>({valid:false,errors,proposals:[],verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!exact(data,['schema','board','academicSession','checkedOn','indexUrl','sourceType','textbookEditionVerified','rightsPermissionAuthenticated','humanApprovalAuthenticated','publicReleaseApproved','sources','proposals'])||
 data.schema!=='aifs-cbse-syllabus-candidates-v1'||data.board!=='CBSE'||data.academicSession!=='2026-27'||data.checkedOn!=='2026-11-24'||data.indexUrl!=='https://cbseacademic.nic.in/curriculum_2027.html'||data.sourceType!=='OFFICIAL_SYLLABUS_LINK_ONLY'||
 ['textbookEditionVerified','rightsPermissionAuthenticated','humanApprovalAuthenticated','publicReleaseApproved'].some(k=>data[k]!==false)||!exact(data.sources,Object.keys(expectedSources))||!Array.isArray(data.proposals)){errors.push('Invalid or approving source manifest');return fail()}
 for(const [subject,[code,file]] of Object.entries(expectedSources)){
  const s=data.sources[subject];if(!exact(s,['code','url'])||s.code!==code||s.url!==prefix+file+'_SecP2_2026-27.pdf')errors.push('Unexpected official source '+subject);
 }
 for(const p of data.proposals){
  if(!exact(p,['modelId','subject','grade','pdfPage','syllabusRef','topic','limitation','status'])||typeof p.modelId!=='string'||!p.modelId.startsWith('advanced:')||p.status!=='PROPOSED_UNVERIFIED'||![11,12].includes(p.grade)||!Number.isInteger(p.pdfPage)||p.pdfPage<1||p.pdfPage>50||typeof p.syllabusRef!=='string'||p.syllabusRef.length>30||typeof p.topic!=='string'||!p.topic.trim()||typeof p.limitation!=='string'||p.limitation.length<12){errors.push('Invalid candidate row');continue}
  const id=p.modelId.slice(9);
  if(!ADVANCED_IDS.includes(id)||ADVANCED_MODELS[id].subject!==p.subject||seen.has(p.modelId)){errors.push('Unknown, duplicate or wrong-subject model');continue}
  seen.add(p.modelId);
  const r=reviewRows.find(r=>r.queue==='advanced'&&r.content_id===p.modelId);
  if(!r||!/^[a-f0-9]{64}$/.test(r.content_sha256)){errors.push('Missing canonical fingerprint '+p.modelId);continue}
  proposals.push({...p,sourceUrl:data.sources[p.subject].url,subjectCode:data.sources[p.subject].code,reviewRef:{queue:r.queue,id:r.content_id,version:r.content_version,sha256:r.content_sha256}});
 }
 if(errors.length)return fail();
 return {valid:true,errors,proposals,verifiedChapters:0,textbookEditionVerified:false,rightsPermissionAuthenticated:false,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
