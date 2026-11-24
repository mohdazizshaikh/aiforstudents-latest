/** M78: deterministic source-bound practice choices, not a generative tutor or mastery estimator. */
import {TEACHER_LAB_SUBJECTS,TEACHER_ACTIVITY_KINDS,teacherActivityChoices,printableAnyLabActivity,teacherAnyLabPlan,labPackKeys} from './teacher-cards-engine.js';
import {advancedExtension} from './advanced-lab-engine.js';
import {guidedHint,REFERENCE_STATUS} from './practice-engine.js';
export const PATHWAY_ACTIONS=Object.freeze(['repeat','explain','different']);
const validLang=l=>['en','hi'].includes(l);
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
export function pathwayChoices(subject,kind,lang='en'){
 return teacherActivityChoices(subject,kind,lang);
}
function knownActivity(key,lang){
 if(!validLang(lang)||!labPackKeys().includes(key))throw Error('Unknown practice activity or language');
 const [id,mode]=key.split(':'),a=printableAnyLabActivity(id,mode,lang);
 const href=mode==='main'?teacherAnyLabPlan(a.subject,id,lang).href:'?advanced='+encodeURIComponent(id)+'&extension='+encodeURIComponent(mode)+'#advanced-labs';
 const sourceId=id.includes('/')?id.replace('/',':'):'advanced:'+id;
 const hint=mode==='main'?guidedHint(sourceId,lang).text:advancedExtension(id,mode).hint[lang==='hi'?1:0];
 return {key,subject:a.subject,title:a.title,prompt:a.prompt,caveat:a.caveat,hint,source:a.sourceFile,contentId:sourceId,mode,href};
}
export function pathwaySource(request){
 if(!exact(request,['key','lang','risk'])||!validLang(request.lang)||!['none','sensitive'].includes(request.risk))throw Error('Invalid source request');
 const {key,lang,risk}=request;
 const flags={reviewStatus:REFERENCE_STATUS,allowRemoteChat:false,usesHistory:false,persists:false,isMasteryPrediction:false,publicReleaseApproved:false};
 if(risk==='sensitive'){
  const safe=guidedHint('',lang,'sensitive');return {kind:'adult-guidance',text:safe.text,source:null,...flags};
 }
 if(!labPackKeys().includes(key)){
  const unknown=guidedHint('',lang);return {kind:'unknown',text:unknown.text,source:null,...flags};
 }
 return {kind:'draft-source',...knownActivity(key,lang),...flags};
}
export function pathwayNext(request){
 if(!exact(request,['key','action','kind','lang'])||!PATHWAY_ACTIONS.includes(request.action)||!TEACHER_ACTIVITY_KINDS.includes(request.kind)||!validLang(request.lang))throw Error('Invalid next practice request');
 const {key,action,kind,lang}=request,current=knownActivity(key,lang);
 const choices=pathwayChoices(current.subject,kind,lang);
 const index=choices.findIndex(x=>x.key===key);if(index<0)throw Error('Activity outside chosen filter');
 const next=action==='different'&&choices.length>1?knownActivity(choices[(index+1)%choices.length].key,lang):current;
 const reasons={repeat:['Repeat at your own pace.','अपनी गति से फिर अभ्यास करें।'],explain:['Read the source hint and explain your reasoning to a teacher or on paper.','स्रोत संकेत पढ़ें और अपना कारण शिक्षक को या कागज़ पर समझाएँ।'],different:['Choose the next draft in this subject and activity type; this is not a difficulty estimate.','इस विषय और गतिविधि प्रकार का अगला मसौदा चुनें; यह कठिनाई का अनुमान नहीं है।']};
 return {action,key:next.key,title:next.title,href:next.href,reason:reasons[action][lang==='hi'?1:0],alternativeAvailable:choices.length>1,declinable:true,reviewStatus:REFERENCE_STATUS,usesHistory:false,persists:false,isMasteryPrediction:false,publicReleaseApproved:false};
}
