import {PRIMARY_IDS,primaryDefinition} from './primary-maths-lab.js';
import {COMPARISON_IDS,comparisonDefinition} from './comparison-lab-engine.js';
import {VISUAL_IDS,visualDefinition} from './visual-lab-engine.js';
export const PROTOTYPE_KEYS=Object.freeze([...PRIMARY_IDS,...COMPARISON_IDS,...VISUAL_IDS].map(id=>'prototype:'+id));
export function prototypeChoices(lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Invalid language');
 return PROTOTYPE_KEYS.map(key=>{const id=key.slice(10),primary=PRIMARY_IDS.includes(id),visual=VISUAL_IDS.includes(id),d=primary?primaryDefinition(id,lang):visual?visualDefinition(id,lang):comparisonDefinition(id,lang);
 return {key,id,subject:primary?'maths':d.subject,kind:'prototype',title:d.title,href:'../virtual-experiment-lab/?model='+encodeURIComponent(id)+'&lang='+lang+'#'+(primary?'primary-maths-lab':visual?'visual-lab':'comparison-lab'),worksheetHref:'../teacher-kit/?prototype='+encodeURIComponent(key)+'&lang='+lang+'#prototype-pack',humanReviewed:false,gradeVerified:false,publicReleaseApproved:false,storesStudentData:false}});
}
export function resolvePrototypeLaunch(search,allowed){
 const p=new URLSearchParams(search);
 if([...p.keys()].length!==2||p.getAll('model').length!==1||p.getAll('lang').length!==1||!allowed.includes(p.get('model'))||!['en','hi'].includes(p.get('lang')))return null;
 return {id:p.get('model'),lang:p.get('lang')};
}
