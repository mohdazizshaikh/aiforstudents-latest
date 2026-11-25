/** M128 bounded local catalog for learner discovery. No grade or mastery inference. */
import {workspaceChoices} from './workspace-engine.js';
export const EXPLORER_SUBJECTS=Object.freeze(['all','maths','physics','chemistry','biology']);
export const EXPLORER_KINDS=Object.freeze(['all','basic','advanced','supplement','prototype']);
export const EXPLORER_PAGE_SIZE=12;
const langs=['en','hi'];
const flags=()=>({localOnly:true,storesStudentData:false,humanReviewed:false,gradeVerified:false,publicReleaseApproved:false});
export function exploreActivities({language='en',subject='all',kind='all',page=1}={}){
 if(!langs.includes(language)||!EXPLORER_SUBJECTS.includes(subject)||!EXPLORER_KINDS.includes(kind)||!Number.isInteger(page)||page<1)throw Error('Invalid activity filter');
 const all=workspaceChoices('teacher',language);
 const items=all.filter(x=>(subject==='all'||x.subject===subject)&&(kind==='all'||x.kind===kind));
 const pages=Math.max(1,Math.ceil(items.length/EXPLORER_PAGE_SIZE)),current=Math.min(page,pages),start=(current-1)*EXPLORER_PAGE_SIZE;
 return {language,subject,kind,page:current,pages,total:items.length,catalogTotal:all.length,items:items.slice(start,start+EXPLORER_PAGE_SIZE).map(x=>({key:x.key,title:x.title,subject:x.subject,kind:x.kind,href:x.href,worksheetHref:x.worksheetHref,...flags()})),...flags()};
}
