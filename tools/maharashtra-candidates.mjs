/** M61: link-only state textbook candidate crosswalk, no approval or runtime mapping. */
import {readFileSync} from 'node:fs';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
import {buildReviewRows} from './build-review-packet.mjs';
const FILE=new URL('../docs/M61_MAHARASHTRA_VI_CANDIDATES.json',import.meta.url);
export const readMaharashtraCandidates=()=>JSON.parse(readFileSync(FILE,'utf8'));
const expectedSources={"maths":{"url":"https://books.ebalbharati.in/pdfs/603020004.pdf","title":"Mathematics Standard Six","firstEdition":2016,"reprint":2022,"inspection":"PDF_TEXT_AND_SCREENSHOT"},"science":{"url":"https://books.ebalbharati.in/pdfs/603020012.pdf","title":"General Science Standard Six","firstEdition":2016,"reprint":2022,"inspection":"PDF_TEXT_ONLY_SCREENSHOT_SIZE_LIMIT"}};
const anchors={maths:{outcome:['06.71.06','06.71.11']},science:{outcome:['06.72.03','06.72.05','06.72.06'],'chapter-start':['5:32','2:9','9:65','13:91','15:105']}};
const exact=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function bindMaharashtraCandidates(data=readMaharashtraCandidates(),rows=buildReviewRows()){
 const errors=[],proposals=[],seen=new Set();
 const fail=()=>({valid:false,errors,proposals:[],verifiedChapters:0,currentSessionApplicabilityVerified:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
 if(!exact(data,['schema','board','grade','medium','checkedOn','currentSessionApplicabilityVerified','rightsPermissionAuthenticated','humanApprovalAuthenticated','publicReleaseApproved','sources','proposals'])||
 data.schema!=='aifs-m61-maharashtra-candidates-v1'||data.board!=='Maharashtra'||data.grade!==6||data.medium!=='English'||data.checkedOn!=='2026-11-24'||
 ['currentSessionApplicabilityVerified','rightsPermissionAuthenticated','humanApprovalAuthenticated','publicReleaseApproved'].some(k=>data[k]!==false)||
 !exact(data.sources,Object.keys(expectedSources))||!Array.isArray(data.proposals)){errors.push('Invalid or approving source manifest');return fail()}
 for(const [id,s] of Object.entries(expectedSources)){const actual=data.sources[id];if(!exact(actual,Object.keys(s))||Object.keys(s).some(k=>actual[k]!==s[k]))errors.push('Unexpected source '+id)}
 for(const p of data.proposals){
  if(!exact(p,['sourceId','modelId','subject','anchorType','anchor','limitation','status'])||!Object.hasOwn(expectedSources,p.sourceId)||typeof p.modelId!=='string'||!p.modelId.startsWith('advanced:')||
   p.status!=='PROPOSED_UNVERIFIED'||!Object.hasOwn(anchors[p.sourceId],p.anchorType)||!anchors[p.sourceId][p.anchorType].includes(p.anchor)||typeof p.limitation!=='string'||p.limitation.length<12||p.limitation.length>300){errors.push('Invalid candidate');continue}
  const id=p.modelId.slice(9);
  if(!ADVANCED_IDS.includes(id)||ADVANCED_MODELS[id].subject!==p.subject||(p.sourceId==='maths')!==(p.subject==='maths')||seen.has(p.modelId)){errors.push('Wrong or duplicate model');continue}
  seen.add(p.modelId);
  const match=rows.filter(r=>r.queue==='advanced'&&r.content_id===p.modelId);
  if(match.length!==1||!/^[a-f0-9]{64}$/.test(match[0].content_sha256)||typeof match[0].content_version!=='string'){errors.push('Missing current canonical fingerprint');continue}
  const r=match[0];proposals.push({...p,grade:6,board:'Maharashtra',source:expectedSources[p.sourceId],reviewRef:{queue:r.queue,id:r.content_id,version:r.content_version,sha256:r.content_sha256}});
 }
 if(errors.length)return fail();
 return {valid:true,errors,proposals,verifiedChapters:0,currentSessionApplicabilityVerified:false,rightsPermissionAuthenticated:false,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
