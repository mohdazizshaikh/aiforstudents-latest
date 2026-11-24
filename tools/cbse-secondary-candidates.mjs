/** M51: secondary candidates, distinct from M49 senior-secondary crosswalk. */
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from './build-review-packet.mjs';
const expected={"9-maths":{"grade":9,"course":"mathematics","url":"https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf","pages":13},"9-science":{"grade":9,"course":"science","url":"https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/ScienceSt_SecP1_2026-27.pdf","pages":20},"10-maths":{"grade":10,"course":"mathematics","url":"https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1X_2026-27.pdf","pages":10},"10-science":{"grade":10,"course":"science","url":"https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf","pages":9}};
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function readSecondaryCandidates(){return JSON.parse(readFileSync(new URL('../docs/M51_CBSE_IX_X_CANDIDATES.json',import.meta.url),'utf8'))}
export function bindSecondaryCandidates(data=readSecondaryCandidates(),rows=buildReviewRows()){
 const errors=[],proposals=[],seen=new Set();
 const fail=()=>({valid:false,errors,proposals:[],verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!exact(data,['schema','academicSession','checkedOn','indexUrl','sourceType','humanApprovalAuthenticated','textbookEditionVerified','publicReleaseApproved','sources','proposals'])||data.schema!=='aifs-cbse-secondary-candidates-v1'||data.academicSession!=='2026-27'||data.checkedOn!=='2026-11-24'||data.indexUrl!=='https://cbseacademic.nic.in/curriculum_2027.html'||data.sourceType!=='OFFICIAL_SYLLABUS_LINK_ONLY'||['humanApprovalAuthenticated','textbookEditionVerified','publicReleaseApproved'].some(k=>data[k]!==false)||!exact(data.sources,Object.keys(expected))||!Array.isArray(data.proposals)){errors.push('Invalid candidate manifest');return fail()}
 for(const [id,s] of Object.entries(expected)){const actual=data.sources[id];if(!exact(actual,Object.keys(s))||Object.keys(s).some(k=>actual[k]!==s[k]))errors.push('Unexpected source '+id)}
 for(const p of data.proposals){
  if(!exact(p,['sourceId','modelId','subject','pdfPage','syllabusRef','limitation','status'])||!Object.hasOwn(expected,p.sourceId)||typeof p.modelId!=='string'||!p.modelId.startsWith('advanced:')||p.status!=='PROPOSED_UNVERIFIED'||typeof p.syllabusRef!=='string'||!p.syllabusRef.trim()||p.syllabusRef.length>100||typeof p.limitation!=='string'||p.limitation.length<12||p.limitation.length>300){errors.push('Invalid proposal');continue}
  const s=expected[p.sourceId],id=p.modelId.slice(9),key=p.sourceId+'|'+p.modelId;
  if(!ADVANCED_IDS.includes(id)||ADVANCED_MODELS[id].subject!==p.subject||(s.course==='mathematics')!==(p.subject==='maths')||!Number.isInteger(p.pdfPage)||p.pdfPage<1||p.pdfPage>s.pages||seen.has(key)){errors.push('Wrong model, course, page or duplicate');continue}
  seen.add(key);const r=rows.find(x=>x.queue==='advanced'&&x.content_id===p.modelId);
  if(!r||!/^[a-f0-9]{64}$/.test(r.content_sha256)){errors.push('Missing current fingerprint');continue}
  proposals.push({...p,grade:s.grade,course:s.course,sourceUrl:s.url,reviewRef:{queue:r.queue,id:r.content_id,version:r.content_version,sha256:r.content_sha256}});
 }
 if(errors.length)return fail();
 return {valid:true,errors,proposals,verifiedChapters:0,textbookEditionVerified:false,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
