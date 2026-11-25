import {SOURCE_CANDIDATES,DISCOVERY_CONCEPTS,PROTOTYPE_LINKS} from './curriculum-catalog-data.js';
import {prototypeChoices} from './extended-lab-catalog.js';
import {teacherResourceChoices,worksheetReturnLaunch} from './teacher-cards-engine.js';
export const BOARDS=Object.freeze(['CBSE','Maharashtra']);
export const SUBJECTS=Object.freeze(['maths','physics','chemistry','biology']);
const families={experiment:['experiment-lab','Virtual experiment drafts','आभासी प्रयोग मसौदे'],workshop:['math-workshop','Math workshop drafts','गणित कार्यशाला मसौदे'],science:['science-lab','Science lab drafts','विज्ञान लैब मसौदे'],advanced:['advanced-labs','Advanced lab drafts','उन्नत लैब मसौदे']};
export function curriculumCatalog({board,grade,subject,lang='en'}){
 if(!BOARDS.includes(board)||!Number.isInteger(grade)||grade<1||grade>12||!SUBJECTS.includes(subject)||!['en','hi'].includes(lang))throw Error('Invalid curriculum filters');
 const find=g=>DISCOVERY_CONCEPTS.find(x=>x.grade===g&&x.subject===subject),t=find(grade),earlier=find(grade-1);
 const candidates=teacherResourceChoices(subject,'all',lang);
 const links=ids=>ids.map(id=>{const [family,model]=id.split(':'),f=families[family];if(!f)throw Error('Unknown draft family');
 const key=family==='advanced'?model+':main':family==='workshop'?'maths/'+model+':main':family==='science'?'science/'+model+':main':null;
 const x=candidates.find(y=>y.key===key);
 return x?{modelId:id,title:x.title,href:'../'+worksheetReturnLaunch(key,lang).href,exact:true}:{modelId:id,title:f[lang==='hi'?2:1]+' ('+model+')',href:'../?lang='+lang+'#'+f[0],exact:false}});
 const sources=SOURCE_CANDIDATES.filter(x=>x.board===board&&x.grade===grade&&x.subject===subject).map(x=>({...x,chapter:null,status:'PENDING',rightsAuthenticated:false,textbookEditionVerified:false}));
 return {version:'m118-draft-v1',board,grade,subject,language:lang,concept:t[lang],earlierConcept:earlier?.[lang]??null,earlierLinks:earlier?links(earlier.modelIds):[],relatedDrafts:links(t.modelIds),prototypes:prototypeChoices(lang).filter(x=>PROTOTYPE_LINKS.some(y=>y.id===x.id&&y.grade===grade&&y.subject===subject)),sources,editionOptions:[...new Set(sources.map(x=>x.edition))],verifiedChapters:0,humanApprovalAuthenticated:false,publicReleaseApproved:false};
}
