/** M32: offline practice choice tools, NOT an AI chatbot, aptitude inference or mastery certification.
 * Unreviewed content must be labelled as a draft; no personal data or API integration.
 */
import {SCIENCE_IDS,SCIENCE_MODELS,SCIENCE_STAGES} from './science-engine.js';
import {STUDIO_LESSONS} from './studio-engine.js';
import {WORKSHOP_MODES,WORKSHOP_CONTENT,evaluateWorkshop} from './experiment-engine.js';
const P=(en,hi)=>Object.freeze([en,hi]);
const title=(lang,p)=>p[lang==='hi'?1:0];
export const GUIDED_TOPIC_IDS=Object.freeze([...SCIENCE_IDS.map(x=>'science:'+x),...WORKSHOP_MODES.map(x=>'maths:'+x),'studio:fractions','studio:circuit-path']);
export const PRACTICE_DIFFICULTIES=Object.freeze(['gentle','standard','explore']);
export const PRACTICE_SUBJECTS=Object.freeze(['maths','physics','chemistry','biology','digital-safety']);
export const REFERENCE_STATUS='UNREVIEWED_ORIGINAL_DRAFT';
export const FIVE_STEP_LABELS=SCIENCE_STAGES;
const TOPIC_PATHS=Object.freeze({
 maths:'#math-workshop',physics:'#science-lab',chemistry:'#science-lab',biology:'#science-lab','digital-safety':'#digital-skills'
});
const safety=P('I cannot assess emergencies, personal health, threats, or harm. Stop this exercise and speak with a trusted adult or the appropriate local emergency service for urgent danger.','मैं आपात स्थिति, स्वास्थ्य, धमकी या नुकसान का आकलन नहीं कर सकता। यह अभ्यास बंद करके किसी भरोसेमंद बड़े से बात करें; तत्काल खतरे में स्थानीय आपात सेवा की मदद लें।');
const unreviewed=P('Original draft on this site; educational/Hindi expert review and board mapping are pending. This is not verified teaching advice.','इस साइट का मूल मसौदा; विषय/हिंदी विशेषज्ञ समीक्षा और बोर्ड मिलान बाकी है। यह सत्यापित शिक्षण सलाह नहीं है।');
const fallback=P('No local source-backed hint is available for that choice. Please ask a teacher; I will not invent an answer.','इस विकल्प के लिए स्थानीय स्रोत-आधारित संकेत नहीं है। कृपया शिक्षक से पूछें; मैं उत्तर नहीं गढ़ूँगा।');
export function practiceTopic(id,lang='en'){
 if(!GUIDED_TOPIC_IDS.includes(id))return null;
 let content;
 if(id.startsWith('science:'))content=SCIENCE_MODELS[id.slice(8)];
 else if(id.startsWith('maths:'))content=WORKSHOP_CONTENT[id.slice(6)];
 else content=STUDIO_LESSONS[id.slice(7)];
 return {id,title:title(lang,content.title),subject:id.startsWith('science:')?content.subject.toLowerCase():id.startsWith('maths:')||id.endsWith('fractions')?'maths':'physics'};
}
/** No free text prompt: only a fixed selector against this repository's already-authored drafts.
 * Parent/adult escalation is a fixed safe-state branch and does not invite disclosure.
 */
export function guidedHint(id,lang='en',risk='none'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 if(risk!=='none'){
  if(risk!=='sensitive')throw Error('Unknown safety mode');
  return {kind:'adult-guidance',text:title(lang,safety),source:null,reviewStatus:REFERENCE_STATUS,allowRemoteChat:false};
 }
 if(!GUIDED_TOPIC_IDS.includes(id))
  return {kind:'unknown',text:title(lang,fallback),source:null,reviewStatus:REFERENCE_STATUS,allowRemoteChat:false};
 let entry,field,path;
 if(id.startsWith('science:')){entry=SCIENCE_MODELS[id.slice(8)];field=entry.hint;path='assets/science-engine.js'}
 else if(id.startsWith('maths:')){entry=WORKSHOP_CONTENT[id.slice(6)];field=entry.hint;path='assets/experiment-engine.js'}
 else{entry=STUDIO_LESSONS[id.slice(7)];field=entry.stages[0].hint;path='assets/studio-engine.js'}
 return {kind:'draft-hint',text:title(lang,field),attribution:title(lang,unreviewed),source:path,contentId:id,reviewStatus:REFERENCE_STATUS,allowRemoteChat:false};
}
export function validateChoice({subject,difficulty,lang}={}){
 if(!PRACTICE_SUBJECTS.includes(subject)||!PRACTICE_DIFFICULTIES.includes(difficulty)||!['en','hi'].includes(lang))
  throw Error('Choose an available subject, difficulty and language');
 return {subject,difficulty,lang};
}
const REASONS={
 maths:P('You selected Maths; this suggests a short numbers/geometry practice, not a measure of intelligence.','आपने गणित चुना; यह संख्या/ज्यामिति का छोटा अभ्यास है, बुद्धि का माप नहीं।'),
 physics:P('You selected Physics; this suggests a model you can inspect and question.','आपने भौतिकी चुना; यह मॉडल देखने और सवाल पूछने का विकल्प है।'),
 chemistry:P('You selected Chemistry; this suggests a discussion-only concept, not physical mixing.','आपने रसायन चुना; यह केवल चर्चा का विषय है, असली मिश्रण नहीं।'),
 biology:P('You selected Biology; this suggests a labelled diagram, not a real biological specimen.','आपने जीवविज्ञान चुना; यह नामांकित चित्र है, असली जैव नमूना नहीं।'),
 'digital-safety':P('You selected Digital Safety; this suggests checking claims and protecting privacy.','आपने डिजिटल सुरक्षा चुनी; यह दावों की जाँच और गोपनीयता बचाने का अभ्यास है।')
};
export function recommendPractice(input){
 const {subject,difficulty,lang}=validateChoice(input);
 const reason=title(lang,REASONS[subject]);
 const difficultyNote=title(lang,({
  gentle:P('Short and gentle option selected by you.','आपने हल्का और छोटा अभ्यास चुना।'),
  standard:P('Standard practice chosen by you.','आपने सामान्य अभ्यास चुना।'),
  explore:P('Exploratory challenge chosen by you; you may change it any time.','आपने खोज वाला अभ्यास चुना; कभी भी बदल सकते हैं।')
 })[difficulty]);
 return {subject,difficulty,lang,reason:reason+' '+difficultyNote,href:TOPIC_PATHS[subject],declinable:true,
  reviewStatus:REFERENCE_STATUS,isMasteryPrediction:false,persists:false};
}
export function optionalReviewDay(isoDay,gapDays){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(isoDay))||![1,3,7].includes(gapDays))throw Error('Use a real day and an optional short gap');
 const d=new Date(isoDay+'T12:00:00Z');
 if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==isoDay)throw Error('Invalid calendar day');
 d.setUTCDate(d.getUTCDate()+gapDays);
 return {day:d.toISOString().slice(0,10),gapDays,optional:true,notification:false,streak:false,penalty:false,stored:false};
}
export const FRACTION_FIVE_STAGES=FIVE_STEP_LABELS;
/** Reuses existing validated-in-code fraction explanation; not a new approved source. */
export function fractionStage(stage,shaded=0,lang='en'){
 if(!FRACTION_FIVE_STAGES.includes(stage)||!Number.isInteger(shaded)||shaded<0||shaded>4||!['en','hi'].includes(lang))throw Error('Invalid fraction practice state');
 const lesson=STUDIO_LESSONS.fractions;
 const t=p=>title(lang,p);
 const exact=shaded===2;
 const source={id:'studio:fractions',sourceFile:'assets/studio-engine.js',reviewStatus:REFERENCE_STATUS};
 return {...source,stage,shaded,correct:exact,question:stage==='try'?t(lesson.stages[0].question):stage==='play'?t(lesson.stages[1].question):t(lesson.title),
  text:stage==='learn'?t(lesson.concept):stage==='grow'?t(lesson.mission):stage==='understand'?t(lesson.stages[0].explanation):t(lesson.stages[0].hint),
  explanation:t(lesson.stages[0].explanation),completionIsMastery:false,sourceAttribution:t(unreviewed)};
}
