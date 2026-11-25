import {miniControlLabels} from './mini-snapshots.js';
import {SCIENCE_IDS,SCIENCE_MODELS} from './science-engine.js';
import {WORKSHOP_MODES,WORKSHOP_CONTENT} from './experiment-engine.js';
import {STUDIO_IDS,STUDIO_LESSONS} from './studio-engine.js';
import {ADVANCED_IDS,ADVANCED_MODELS,advancedExtensionIds,advancedExtension,evaluateAdvancedExtension,calculateAdvanced,advancedResultRows} from './advanced-lab-engine.js';
/** M32 private classroom paper cards: source-derived, anonymous, not approved lessons. */
import {CLASSROOM_IDS,CLASSROOM_LESSONS,CLASSROOM_ROLES,classroomStep,classroomText} from './classroom-engine.js';
export const ROTATION_ROLES=CLASSROOM_ROLES;
export function rotateAnonymousRole(index,steps=1){
 if(!Number.isInteger(index)||index<0||index>=ROTATION_ROLES.length||!Number.isInteger(steps)||steps<0)throw Error('Invalid anonymous role index');
 return (index+steps)%ROTATION_ROLES.length;
}
export function printableClassroomCard(lessonId,index,lang='en'){
 if(!CLASSROOM_IDS.includes(lessonId)||!['en','hi'].includes(lang))throw Error('Unknown teacher card');
 const lesson=CLASSROOM_LESSONS[lessonId],step=classroomStep(lessonId,index),local=p=>classroomText(p,lang);
 return {lesson:local(lesson.title),stepIndex:index,stage:local(step.title),question:local(step.prompt),
  action:local(step.action),teacherGuidance:local(step.answer),teacherSpeech:local(step.teacher),
  subjectLessonId:lessonId,sourceFile:'assets/classroom-engine.js',
  humanReviewed:false,hasStudentNames:false,quizScore:null,
  worksheetMode:'learner-only',approval:'PENDING',localOnly:true};
}

/** M37 source-derived print pack, not a licensed/approved curriculum release. Learner payload omits answer keys. */
export function printableAssignmentPack(lessonId,lang='en'){
 if(!CLASSROOM_IDS.includes(lessonId)||!['en','hi'].includes(lang))throw Error('Unknown assignment pack');
 const lesson=CLASSROOM_LESSONS[lessonId];
 const cards=lesson.steps.map((_,index)=>{
  const {stepIndex,stage,question,action}=printableClassroomCard(lessonId,index,lang);
  return {stepIndex,stage,question,action};
 });
 return {lesson:classroomText(lesson.title,lang),lessonId,language:lang,cards,
  sourceFile:'assets/classroom-engine.js',rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED',
  humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}

/** Teacher-side discovery only. No learner records, grade approval or inferred difficulty. */
export const TEACHER_LAB_SUBJECTS=Object.freeze(['maths','physics','chemistry','biology']);
export function teacherLabOptions(subject,lang='en'){
 if(!TEACHER_LAB_SUBJECTS.includes(subject)||!['en','hi'].includes(lang))throw Error('Unknown teacher lab subject or language');
 return ADVANCED_IDS.filter(id=>ADVANCED_MODELS[id].subject===subject).map(id=>{
  const model=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  return {id,subject,title:model.title[i],caveat:model.caveat[i],href:'?advanced='+encodeURIComponent(id)+'#advanced-labs',humanReviewed:false,gradeVerified:false,publicReleaseApproved:false};
 });
}
export function teacherLabPlan(subject,id,lang='en'){
 const model=teacherLabOptions(subject,lang).find(x=>x.id===id);
 if(!model)throw Error('Unknown or mismatched teacher lab');
 return {...model,localOnly:true,storesStudentData:false,projectorReadyClaim:false};
}

/** M48 transient teacher demonstration agenda: fixed source IDs, no pupil data or free text. */
export const DEMO_AGENDA_LIMIT=8;
const validDemo=id=>typeof id==='string'&&ADVANCED_IDS.includes(id);
const validAgenda=id=>validDemo(id)||BASIC_PRINT_IDS.includes(id);
export function teacherDemoAgenda(agenda,action){
 if(!Array.isArray(agenda)||agenda.length>DEMO_AGENDA_LIMIT||new Set(agenda).size!==agenda.length||agenda.some(id=>!validAgenda(id)))throw Error('Invalid demonstration agenda');
 if(!action||typeof action!=='object'||Array.isArray(action))throw Error('Invalid demonstration action');
 const type=action.type,keys=Object.keys(action),needsId=['add','remove','up','down'].includes(type);
 if(needsId?keys.length!==2||!Object.hasOwn(action,'id')||!validAgenda(action.id):keys.length!==1||type!=='clear')throw Error('Unknown demonstration action');
 const next=[...agenda];if(type==='clear')return [];
 const i=next.indexOf(action.id);
 switch(type){
  case 'add':if(i<0&&next.length<DEMO_AGENDA_LIMIT)next.push(action.id);break;
  case 'remove':if(i>=0)next.splice(i,1);break;
  case 'up':if(i>0)[next[i-1],next[i]]=[next[i],next[i-1]];break;
  case 'down':if(i>=0&&i<next.length-1)[next[i],next[i+1]]=[next[i+1],next[i]];break;
 }
 return next;
}
export function teacherAgendaRows(agenda,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown agenda language');
 teacherDemoAgenda(agenda,{type:'clear'}); // validate, without mutating caller
 return agenda.map((id,index)=>{
  if(BASIC_PRINT_IDS.includes(id)){
   const m=basicPrintDefinition(id),i=lang==='hi'?1:0;
   return {...teacherAnyLabPlan(m.subject,id,lang),position:index+1,prompt:m.prompt[i],hint:basicDemoHint(id)[i],source:m.sourceFile};
  }
  const m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
  return {...teacherLabPlan(m.subject,id,lang),position:index+1,prompt:m.prompt[i],hint:m.hint[i],source:'assets/advanced-lab-engine.js'};
 });
}

/** M50 printable source-derived lab activity: no hints, target values, answers or learner fields.
 * The authored prompt may specify a control example, not a calculated solution. */
/** M94 source-bound paper investigation. Lists existing computer controls only, never target values, hints or learner responses. */
export function mainWorksheetControls(id,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const i=lang==='hi'?1:0;
 let controls;
 if(ADVANCED_IDS.includes(id))controls=ADVANCED_MODELS[id].fields.map(f=>f.label[i]);
 else if(BASIC_PRINT_IDS.includes(id)){
  const [family,key]=id.split('/');
  controls=family==='science'?SCIENCE_MODELS[key].fields.map(f=>f.label[i]):miniControlLabels(id,lang);
 }else throw Error('Unknown main worksheet');
 if(!controls.length||controls.some(x=>typeof x!=='string'||!x.trim()))throw Error('Missing model control labels');
 return controls;
}
export function mainWorksheetInvestigation(id,lang='en'){
 const controls=mainWorksheetControls(id,lang),list=controls.join('; ');
 return lang==='hi'?'केवल कंप्यूटर मॉडल में इन नियंत्रणों में से एक चुनें: '+list+'। शिक्षक के साथ दो अलग स्थितियाँ आज़माएँ; जहाँ संभव हो बाकी नियंत्रण न बदलें। नीचे की तालिका कागज़ पर भरें। मॉडल उपलब्ध न हो तो तालिका खाली रखें और केवल अपना अनुमान लिखें।':
 'In the computer model, choose one of these controls: '+list+'. With a teacher, try two different settings; keep the other controls unchanged where possible. On paper, complete the table below. If the model is unavailable, leave the table blank and write only your prediction.';
}
/** M95 supplemental paper investigations use the extension's own controls, not the parent model's. */
export function supplementalWorksheetControls(id,mode,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const i=lang==='hi'?1:0,labels=advancedExtension(id,mode).fields.map(f=>f.label[i]);
 if(!labels.length||labels.some(x=>typeof x!=='string'||!x.trim()))throw Error('Missing supplemental control labels');
 return labels;
}
export function supplementalWorksheetInvestigation(id,mode,lang='en'){
 const labels=supplementalWorksheetControls(id,mode,lang).join('; ');
 return lang==='hi'?'केवल अतिरिक्त कंप्यूटर मॉडल में इनमें से एक नियंत्रण चुनें: '+labels+'। शिक्षक के साथ दो अलग स्थितियाँ आज़माएँ; जहाँ संभव हो बाकी नियंत्रण न बदलें। नीचे की तालिका कागज़ पर भरें। मॉडल उपलब्ध न हो तो तालिका खाली रखें और केवल अपना अनुमान लिखें।':
 'In this supplemental computer model, choose one control: '+labels+'. With a teacher, try two different settings; keep other controls unchanged where possible. Complete the table on paper. If the model is unavailable, leave the table blank and write only your prediction.';
}
function blankPaperComparison(lang){
 const p=(en,hi)=>lang==='hi'?hi:en;
 return {caption:p('Two computer model settings — paper notes only','कंप्यूटर मॉडल की दो स्थितियाँ — केवल कागज़ पर नोट'),columns:[p('Trial','स्थिति'),p('Control and setting','नियंत्रण और मान'),p('What the model shows','मॉडल में दिखा परिणाम')],rows:[{label:'A',cells:['','']},{label:'B',cells:['','']}]};
}

/** M96 main and supplemental activities share the same blank paper format. */
export function mainWorksheetComparison(id,lang='en'){
 mainWorksheetControls(id,lang);
 return blankPaperComparison(lang);
}
export function supplementalWorksheetComparison(id,mode,lang='en'){
 supplementalWorksheetControls(id,mode,lang);
 return blankPaperComparison(lang);
}

/** M106 model-specific original draft reflection prompts, no answers or learner records. */
const MAIN_REFLECTIONS=Object.freeze({
 "ratio-algebra": [
  "How did the total counter count respond when you changed only the number of groups?",
  "केवल समूहों की संख्या बदलने पर कुल काउंटरों की संख्या कैसे बदली?"
 ],
 "symmetry": [
  "Which coordinates changed and which stayed the same in the two point transformations you compared?",
  "जिन दो बिंदु रूपांतरणों की तुलना की, उनमें कौन से निर्देशांक बदले और कौन से समान रहे?"
 ],
 "coordinate": [
  "How did the displayed y-coordinate change when you changed x on this line?",
  "इस रेखा पर x बदलने से प्रदर्शित y-निर्देशांक कैसे बदला?"
 ],
 "probability": [
  "How did the theoretical red probability compare with the simulated red proportion in your trials?",
  "अपनी स्थितियों में लाल की सैद्धांतिक प्रायिकता और अनुकरण में लाल के अनुपात की तुलना करें।"
 ],
 "temperature": [
  "What happened to the calculated temperature change when you changed one control in the fictional material model?",
  "काल्पनिक पदार्थ मॉडल में एक नियंत्रण बदलने पर गणितीय तापमान परिवर्तन कैसे बदला?"
 ],
 "sound": [
  "How did the displayed frequency respond to changing the period in the silent waveform model?",
  "मौन तरंग मॉडल में आवर्तकाल बदलने पर प्रदर्शित आवृत्ति कैसे बदली?"
 ],
 "magnetism": [
  "Compare the displayed interaction for two different pole combinations in the sketch.",
  "चित्र में ध्रुवों के दो अलग संयोजनों की प्रदर्शित पारस्परिक क्रिया की तुलना करें।"
 ],
 "measurement": [
  "What did the two displayed speeds tell you about comparing distance and duration together?",
  "दो प्रदर्शित चालों से दूरी और समय को साथ लेकर तुलना करने के बारे में क्या समझ आया?"
 ],
 "periodic": [
  "What did you notice about the displayed group and period as you changed atomic number within this table?",
  "इस तालिका में परमाणु क्रमांक बदलने पर प्रदर्शित समूह और आवर्त में क्या देखा?"
 ],
 "mass-balance": [
  "How did changing one symbolic mass affect the comparison of input and output totals?",
  "एक प्रतीकात्मक द्रव्यमान बदलने से आगत और निर्गत के कुल की तुलना कैसे बदली?"
 ],
 "ecosystem": [
  "Compare the two example organism interactions shown; what does the sketch leave out?",
  "दिखाए गए जीवों के दो उदाहरण संबंधों की तुलना करें; चित्र में क्या नहीं दिखाया गया है?"
 ],
 "heredity": [
  "How did the symbolic genotype grid change between your two hypothetical parent combinations?",
  "काल्पनिक अभिभावकों के दो संयोजनों के बीच प्रतीकात्मक जीनोटाइप तालिका कैसे बदली?"
 ],
 "quadratic": [
  "What pattern did you notice between the selected x values and their displayed squares?",
  "चुने हुए x मानों और उनके प्रदर्शित वर्गों में क्या पैटर्न देखा?"
 ],
 "force-motion": [
  "How did the calculated net force change when you changed one control in the ideal model?",
  "आदर्श मॉडल में एक नियंत्रण बदलने पर गणितीय परिणामी बल कैसे बदला?"
 ],
 "atom-count": [
  "Compare the displayed hydrogen and oxygen counts for your two symbolic molecule counts.",
  "अणुओं की अपनी दो प्रतीकात्मक संख्याओं के लिए प्रदर्शित हाइड्रोजन और ऑक्सीजन की गिनती मिलाएँ।"
 ],
 "cell-scale": [
  "How did the diagram length respond when you changed one of the size or magnification controls?",
  "आकार या आवर्धन में से एक नियंत्रण बदलने पर चित्र की लंबाई कैसे बदली?"
 ],
 "counting": [
  "Which counter group was larger in each trial, and how did the difference change?",
  "हर स्थिति में कौन सा समूह बड़ा था और अंतर कैसे बदला?"
 ],
 "place-value": [
  "How did changing only tens or only ones affect the displayed two-digit number?",
  "केवल दहाई या केवल इकाई बदलने पर प्रदर्शित दो अंकों की संख्या कैसे बदली?"
 ],
 "length-compare": [
  "How did the difference between the two bars change when you changed just one length?",
  "केवल एक लंबाई बदलने पर दोनों पट्टियों की लंबाई का अंतर कैसे बदला?"
 ],
 "shadow-ray": [
  "Compare the light path and shadow shown for two blocker choices in the diagram.",
  "चित्र में दो अवरोध विकल्पों के लिए दिखाए प्रकाश मार्ग और छाया की तुलना करें।"
 ],
 "material-state": [
  "What differences did the labels show between the selected solid and liquid examples?",
  "चुने हुए ठोस और द्रव उदाहरणों के लेबलों में क्या अंतर दिखा?"
 ],
 "material-objects": [
  "Compare the stated materials of two pictured objects; what does the label not tell you about the whole object?",
  "चित्रित दो वस्तुओं की बताई सामग्री मिलाएँ; लेबल पूरी वस्तु के बारे में क्या नहीं बताता?"
 ],
 "plant-parts": [
  "Compare the stated roles of two selected parts of the flowering plant diagram.",
  "फूलदार पौधे के चित्र के दो चुने भागों के बताए कार्यों की तुलना करें।"
 ],
 "living-examples": [
  "What differences did the model describe between the living plant and stone examples?",
  "जीवित पौधे और पत्थर के उदाहरणों में मॉडल ने क्या अंतर बताया?"
 ],
 "arithmetic-sequence": [
  "How did changing the common difference or term number affect the displayed term?",
  "सार्व अंतर या पद संख्या बदलने पर प्रदर्शित पद कैसे बदला?"
 ],
 "square-slope": [
  "What did you notice about the gap between the secant and tangent slopes in your two settings?",
  "अपनी दो स्थितियों में छेदक और स्पर्शरेखा की ढालों के अंतर में क्या देखा?"
 ],
 "constant-acceleration": [
  "Compare how final speed and displacement changed between your two ideal settings.",
  "अपनी दो आदर्श स्थितियों में अंतिम चाल और विस्थापन के परिवर्तन की तुलना करें।"
 ],
 "thin-lens": [
  "Compare the displayed image distance and magnification magnitude in two allowed lens settings.",
  "लेंस की दो अनुमत स्थितियों में प्रदर्शित प्रतिबिंब दूरी और आवर्धन के परिमाण की तुलना करें।"
 ],
 "ion-charge": [
  "How did the symbolic net charge change when one particle count changed?",
  "एक कण संख्या बदलने पर प्रतीकात्मक कुल आवेश कैसे बदला?"
 ],
 "mass-fraction": [
  "How did changing one symbolic component mass affect the displayed percentage of A?",
  "एक प्रतीकात्मक घटक का द्रव्यमान बदलने पर A का प्रदर्शित प्रतिशत कैसे बदला?"
 ],
 "cell-doubling": [
  "Compare the final symbolic cell counts in your two settings; which model assumption matters to this comparison?",
  "अपनी दो स्थितियों की अंतिम प्रतीकात्मक कोशिका संख्याएँ मिलाएँ; इस तुलना में मॉडल की कौन सी मान्यता महत्वपूर्ण है?"
 ],
 "plant-process": [
  "Compare the labelled inputs and outputs in the two process diagrams.",
  "दो प्रक्रिया चित्रों के नामांकित आगत और निर्गत की तुलना करें।"
 ],
 "triangle-area": [
  "How did the displayed triangle area respond when you changed only its base or perpendicular height?",
  "केवल आधार या लंबवत ऊँचाई बदलने पर प्रदर्शित त्रिभुज क्षेत्रफल कैसे बदला?"
 ],
 "right-triangle-ratio": [
  "Compare the sine and cosine displayed for two allowed right-triangle choices.",
  "समकोण त्रिभुज के दो अनुमत विकल्पों के लिए प्रदर्शित ज्या और कोज्या की तुलना करें।"
 ],
 "position-change": [
  "How did the displayed signed position change depend on the start and end positions?",
  "प्रदर्शित चिह्न सहित स्थिति परिवर्तन आरंभ और अंतिम स्थितियों पर कैसे निर्भर था?"
 ],
 "path-distance": [
  "Compare total distance and signed position change in the two model paths.",
  "दो मॉडल मार्गों में कुल दूरी और चिह्न सहित स्थिति परिवर्तन की तुलना करें।"
 ],
 "material-property": [
  "What difference did the pictured examples show in their stated ability to let light through?",
  "चित्रित उदाहरणों में प्रकाश गुजरने देने के बताए गुण में क्या अंतर दिखा?"
 ],
 "dynamic-balance": [
  "Compare the forward and reverse rates with the displayed net change in your two settings.",
  "अपनी दो स्थितियों में अग्र और पश्च दरों की प्रदर्शित कुल परिवर्तन से तुलना करें।"
 ],
 "habitat-match": [
  "Compare the two depicted habitat examples; what other details would a real habitat description need?",
  "चित्रित दो आवास उदाहरण मिलाएँ; वास्तविक आवास के वर्णन में और कौन सी बातें चाहिए?"
 ],
 "food-web-links": [
  "Compare the direction of the two selected food-energy links in the symbolic web.",
  "प्रतीकात्मक खाद्य जाल में चुनी दो खाद्य ऊर्जा कड़ियों की दिशा मिलाएँ।"
 ],
 "integral-area": [
  "How did the displayed area under the line change when you changed one control?",
  "एक नियंत्रण बदलने पर रेखा के नीचे प्रदर्शित क्षेत्रफल कैसे बदला?"
 ],
 "vector-components": [
  "How did changing one vector component affect the displayed magnitude?",
  "सदिश का एक घटक बदलने पर प्रदर्शित परिमाण कैसे बदला?"
 ],
 "magnetic-flux": [
  "How did changing one of the symbolic field, area or orientation controls affect the displayed flux?",
  "प्रतीकात्मक क्षेत्र, क्षेत्रफल या दिशा में से एक नियंत्रण बदलने पर प्रदर्शित फ्लक्स कैसे बदला?"
 ],
 "capacitor-charge": [
  "Compare the calculated symbolic charge for two capacitance or voltage settings.",
  "धारिता या वोल्टता की दो स्थितियों के लिए गणितीय प्रतीकात्मक आवेश की तुलना करें।"
 ],
 "alkane-count": [
  "What pattern did you observe between the carbon and hydrogen counts in the two symbolic formulas?",
  "दो प्रतीकात्मक सूत्रों में कार्बन और हाइड्रोजन की गिनती में क्या पैटर्न देखा?"
 ],
 "bond-pair-count": [
  "Compare the displayed shared pairs and electron counts for two bond symbols.",
  "दो बंध प्रतीकों के लिए प्रदर्शित साझा युग्म और इलेक्ट्रॉन संख्याओं की तुलना करें।"
 ],
 "dna-complement": [
  "Compare the displayed complementary base symbols for your two selected bases.",
  "अपने दो चुने क्षारों के लिए प्रदर्शित पूरक क्षार प्रतीकों की तुलना करें।"
 ],
 "gas-exchange": [
  "Compare the labelled net transfer directions for oxygen and carbon dioxide in the diagram.",
  "चित्र में ऑक्सीजन और कार्बन डाइऑक्साइड की नामांकित कुल स्थानांतरण दिशाओं की तुलना करें।"
 ],
 "science/motion": [
  "How did the displayed ideal speed change between your two distance or time settings?",
  "दूरी या समय की अपनी दो स्थितियों में प्रदर्शित आदर्श चाल कैसे बदली?"
 ],
 "science/reflection": [
  "Compare the two selected reflected angles with their incident angles measured from the normal.",
  "दो चुने परावर्तन कोणों को अभिलंब से मापे उनके आपतन कोणों से मिलाएँ।"
 ],
 "science/energy": [
  "How did the displayed useful and thermal energy portions compare in your two settings?",
  "अपनी दो स्थितियों में प्रदर्शित उपयोगी और ऊष्मीय ऊर्जा के हिस्सों की तुलना करें।"
 ],
 "science/matter": [
  "Compare the particle arrangement and motion in two selected state diagrams.",
  "दो चुने अवस्था चित्रों में कणों की व्यवस्था और गति की तुलना करें।"
 ],
 "science/changes": [
  "Compare the model's classifications for two pictured changes and explain the difference using the labels.",
  "चित्रित दो परिवर्तनों के मॉडल वर्गीकरणों को मिलाएँ और लेबलों की मदद से अंतर समझाएँ।"
 ],
 "science/cells": [
  "Compare the listed cell structures for two selected cell examples.",
  "दो चुने कोशिका उदाहरणों की सूचीबद्ध संरचनाओं की तुलना करें।"
 ],
 "science/food-chain": [
  "Compare the organism order in two selected chain diagrams and discuss the arrow direction.",
  "दो चुनी शृंखला के चित्रों में जीवों का क्रम मिलाएँ और तीरों की दिशा पर चर्चा करें।"
 ],
 "maths/number-line": [
  "Compare your two positions on the number line: which is farther to the right, and why?",
  "संख्या रेखा पर अपनी दो स्थितियाँ मिलाएँ: कौन सी अधिक दाईं ओर है और क्यों?"
 ],
 "maths/rectangle": [
  "Compare how the displayed area and perimeter changed when you changed only width or height.",
  "केवल चौड़ाई या ऊँचाई बदलने पर प्रदर्शित क्षेत्रफल और परिमाप कैसे बदले, इसकी तुलना करें।"
 ],
 "maths/data-table": [
  "Compare the group counts and their displayed difference for two settings.",
  "दो स्थितियों में समूहों की संख्या और उनके प्रदर्शित अंतर की तुलना करें।"
 ],
 "studio/fractions": [
  "Compare the shaded equal parts in two diagrams and describe what remained the same.",
  "दो चित्रों के रंगे बराबर हिस्सों की तुलना करें और बताएँ कि क्या समान रहा।"
 ],
 "studio/circuit-path": [
  "Compare the model bulb state and path when you select the two switch choices.",
  "स्विच के दो विकल्प चुनने पर मॉडल बल्ब की स्थिति और मार्ग की तुलना करें।"
 ]
});
export function mainWorksheetReflection(id,lang='en'){
 if(!['en','hi'].includes(lang)||!Object.hasOwn(MAIN_REFLECTIONS,id)||(!ADVANCED_IDS.includes(id)&&!BASIC_PRINT_IDS.includes(id)))throw Error('Unknown main reflection');
 const text=MAIN_REFLECTIONS[id][lang==='hi'?1:0];
 return text+(lang==='hi'?' कागज़ पर अपने मॉडल अवलोकन से कारण दें। मॉडल उपलब्ध न हो तो केवल अपने अनुमान पर चर्चा करें।':' Explain using your model observations on paper. If the model is unavailable, discuss your prediction only.');
}
/** M108 individualized predictions before changing the computer model. */
const MAIN_PREDICTIONS=Object.freeze({
 "ratio-algebra": [
  "If you keep counters per group fixed and increase the number of groups, what do you expect to happen to the total?",
  "हर समूह के काउंटर समान रखकर समूहों की संख्या बढ़ाएँ तो कुल में क्या परिवर्तन होने का अनुमान है?"
 ],
 "symmetry": [
  "For a point away from the y-axis, predict which coordinate will change when you select its reflection in that axis.",
  "y-अक्ष से दूर किसी बिंदु का उस अक्ष में प्रतिबिंब चुनने पर किस निर्देशांक के बदलने का अनुमान है?"
 ],
 "coordinate": [
  "If you increase x on the displayed line, what do you predict will happen to y?",
  "दिखाई गई रेखा पर x बढ़ाने से y में क्या परिवर्तन होने का अनुमान है?"
 ],
 "probability": [
  "With the blue count fixed, predict how adding red counters would affect the theoretical probability of red.",
  "नीले काउंटरों की संख्या समान रखते हुए लाल काउंटर बढ़ाने पर लाल की सैद्धांतिक प्रायिकता कैसे बदलने का अनुमान है?"
 ],
 "temperature": [
  "For the fictional material, predict how increasing mass at the same energy transfer might affect the temperature change.",
  "काल्पनिक पदार्थ में समान ऊर्जा हस्तांतरण पर द्रव्यमान बढ़ाने से तापमान परिवर्तन पर क्या प्रभाव होने का अनुमान है?"
 ],
 "sound": [
  "Predict whether the displayed frequency will rise, fall or stay the same if you increase the period.",
  "आवर्तकाल बढ़ाने पर प्रदर्शित आवृत्ति बढ़ेगी, घटेगी या समान रहेगी, इसका अनुमान लगाएँ।"
 ],
 "magnetism": [
  "Predict what interaction the computer sketch will show when you change one of the two selected poles.",
  "दो चुने ध्रुवों में से एक बदलने पर कंप्यूटर चित्र में किस पारस्परिक क्रिया का अनुमान है?"
 ],
 "measurement": [
  "Predict how one model speed will change if its duration increases while its distance stays fixed.",
  "एक मॉडल की दूरी समान रखकर समय बढ़ाने पर उसकी चाल कैसे बदलेगी, इसका अनुमान लगाएँ।"
 ],
 "periodic": [
  "Predict whether a nearby atomic number will display the same group or period as your starting element in this table.",
  "इस तालिका में पास के परमाणु क्रमांक पर आरंभिक तत्व के समान समूह या आवर्त दिखने का अनुमान है या नहीं?"
 ],
 "mass-balance": [
  "Predict what happens to the comparison of totals when only one symbolic input mass increases.",
  "केवल एक प्रतीकात्मक आगत द्रव्यमान बढ़ने पर कुल राशियों की तुलना कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "ecosystem": [
  "Choose two organism-interaction examples and predict how their displayed relationship labels may differ.",
  "जीवों के संबंधों के दो उदाहरण चुनें और अनुमान लगाएँ कि उनके प्रदर्शित संबंध लेबल कैसे अलग हो सकते हैं।"
 ],
 "heredity": [
  "Predict how the symbolic genotype grid may differ if you change one hypothetical parent choice.",
  "एक काल्पनिक अभिभावक विकल्प बदलने पर प्रतीकात्मक जीनोटाइप तालिका कैसे बदल सकती है, अनुमान लगाएँ।"
 ],
 "quadratic": [
  "Predict how the displayed square compares for two x values with the same magnitude but opposite signs.",
  "समान परिमाण और विपरीत चिह्न वाले दो x मानों के प्रदर्शित वर्गों की तुलना का अनुमान लगाएँ।"
 ],
 "force-motion": [
  "At fixed ideal mass, predict how increasing acceleration will affect the calculated net force.",
  "आदर्श द्रव्यमान समान रखकर त्वरण बढ़ाने पर गणितीय परिणामी बल कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "atom-count": [
  "Predict how the symbolic hydrogen and oxygen counts will change if the molecule count increases.",
  "प्रतीकात्मक अणुओं की संख्या बढ़ाने पर हाइड्रोजन और ऑक्सीजन की गिनती कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "cell-scale": [
  "For a fixed hypothetical cell size, predict how greater magnification affects the diagram length.",
  "काल्पनिक कोशिका आकार समान रखने पर अधिक आवर्धन से चित्र की लंबाई कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "counting": [
  "Predict which group will contain more counters after you increase the count in just one group.",
  "केवल एक समूह में काउंटर बढ़ाने के बाद किस समूह में अधिक काउंटर होंगे, अनुमान लगाएँ।"
 ],
 "place-value": [
  "Predict how the displayed number will change if you increase tens but leave ones unchanged.",
  "इकाई समान रखकर दहाई बढ़ाने पर प्रदर्शित संख्या कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "length-compare": [
  "Predict how the length difference will change when one bar grows longer and the other stays fixed.",
  "एक पट्टी लंबी करने और दूसरी समान रखने पर लंबाई का अंतर कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "shadow-ray": [
  "Predict how the computer shadow diagram may differ for two blocker choices.",
  "दो अवरोध विकल्पों के लिए कंप्यूटर छाया चित्र में क्या अंतर होगा, अनुमान लगाएँ।"
 ],
 "material-state": [
  "Predict which state label will appear for two familiar example choices in the model.",
  "मॉडल में दो परिचित उदाहरण चुनने पर कौन से अवस्था लेबल दिखेंगे, अनुमान लगाएँ।"
 ],
 "material-objects": [
  "Predict which material labels the model will display for two object examples.",
  "दो वस्तु उदाहरणों के लिए मॉडल कौन से सामग्री लेबल दिखाएगा, अनुमान लगाएँ।"
 ],
 "plant-parts": [
  "Predict how the stated role will differ when you select two different parts of the plant diagram.",
  "पौधे के चित्र के दो अलग भाग चुनने पर बताए गए कार्य कैसे अलग होंगे, अनुमान लगाएँ।"
 ],
 "living-examples": [
  "Predict how the model will classify its plant and stone examples.",
  "मॉडल पौधे और पत्थर के उदाहरणों का वर्गीकरण कैसे करेगा, अनुमान लगाएँ।"
 ],
 "arithmetic-sequence": [
  "With the first term and common difference fixed, predict how a later term will compare with an earlier term.",
  "पहला पद और सार्व अंतर समान रखकर बाद के पद की पहले के पद से तुलना का अनुमान लगाएँ।"
 ],
 "square-slope": [
  "At a fixed x, predict how changing the allowed secant step might affect the gap between the two displayed slopes.",
  "x समान रखकर अनुमत छेदक कदम बदलने पर प्रदर्शित ढालों का अंतर कैसे बदल सकता है, अनुमान लगाएँ।"
 ],
 "constant-acceleration": [
  "With acceleration fixed, predict how a longer model duration affects the final speed and displacement from rest.",
  "त्वरण समान रखकर मॉडल का समय बढ़ाने पर विराम से अंतिम चाल और विस्थापन कैसे बदलेंगे, अनुमान लगाएँ।"
 ],
 "thin-lens": [
  "At a fixed focal length, predict how a larger allowed object distance will affect the displayed image distance.",
  "फोकस दूरी समान रखकर अधिक अनुमत वस्तु दूरी पर प्रदर्शित प्रतिबिंब दूरी कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "ion-charge": [
  "With proton count fixed, predict how adding symbolic electrons changes the net charge.",
  "प्रोटॉन संख्या समान रखकर प्रतीकात्मक इलेक्ट्रॉन बढ़ाने पर कुल आवेश कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "mass-fraction": [
  "If only component A increases, predict how its displayed share of the total mass will change.",
  "केवल घटक A बढ़ने पर कुल द्रव्यमान में उसका प्रदर्शित हिस्सा कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "cell-doubling": [
  "With the initial symbolic count fixed, predict how an additional doubling round affects the final count.",
  "आरंभिक प्रतीकात्मक संख्या समान रखकर एक अतिरिक्त दुगुना चरण पर अंतिम संख्या कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "plant-process": [
  "Predict how the labelled inputs and outputs may differ when switching between the two model processes.",
  "दो मॉडल प्रक्रियाओं के बीच बदलने पर नामांकित आगत और निर्गत कैसे अलग हो सकते हैं, अनुमान लगाएँ।"
 ],
 "triangle-area": [
  "With the base fixed, predict how increasing perpendicular height will affect the displayed triangle area.",
  "आधार समान रखकर लंबवत ऊँचाई बढ़ाने पर प्रदर्शित त्रिभुज क्षेत्रफल कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "right-triangle-ratio": [
  "Choose two allowed triangle examples and predict whether their displayed sine values will be the same or different.",
  "दो अनुमत त्रिभुज उदाहरण चुनें और अनुमान लगाएँ कि उनके प्रदर्शित ज्या मान समान होंगे या अलग।"
 ],
 "position-change": [
  "Predict how the signed change will differ if you exchange the start and end positions.",
  "आरंभ और अंतिम स्थितियाँ आपस में बदलने पर चिह्न सहित परिवर्तन कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "path-distance": [
  "Keep the outward distance fixed and predict how a longer return leg will affect both displayed quantities.",
  "आगे की दूरी समान रखकर लंबी वापसी पर दोनों प्रदर्शित राशियों में क्या परिवर्तन होगा, अनुमान लगाएँ।"
 ],
 "material-property": [
  "Predict how the stated optical property may differ for two labelled material examples.",
  "दो नामांकित सामग्री उदाहरणों के बताए प्रकाश संबंधी गुण में क्या अंतर होगा, अनुमान लगाएँ।"
 ],
 "dynamic-balance": [
  "Predict how the signed net change will respond if the forward event rate increases at a fixed reverse rate.",
  "पश्च घटना दर समान रखकर अग्र दर बढ़ाने पर चिह्न सहित कुल परिवर्तन कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "habitat-match": [
  "Predict which habitat label will accompany each of two selected example pictures.",
  "दो चुने उदाहरण चित्रों में से प्रत्येक के साथ कौन सा आवास लेबल आएगा, अनुमान लगाएँ।"
 ],
 "food-web-links": [
  "Predict the arrow direction for two selected food-energy links in the symbolic web.",
  "प्रतीकात्मक खाद्य जाल में दो चुनी खाद्य ऊर्जा कड़ियों की तीर दिशा का अनुमान लगाएँ।"
 ],
 "integral-area": [
  "With the positive slope fixed, predict how increasing the upper bound affects the displayed area under the line.",
  "धनात्मक ढाल समान रखकर ऊपरी सीमा बढ़ाने पर रेखा के नीचे प्रदर्शित क्षेत्रफल कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "vector-components": [
  "Keep one component fixed and predict whether increasing the magnitude of the other component changes the vector magnitude.",
  "एक घटक समान रखकर दूसरे का परिमाण बढ़ाने पर सदिश का परिमाण बदलेगा या नहीं, अनुमान लगाएँ।"
 ],
 "magnetic-flux": [
  "With the symbolic field and orientation fixed, predict how increasing surface area affects the displayed flux.",
  "प्रतीकात्मक क्षेत्र और दिशा समान रखकर सतह क्षेत्रफल बढ़ाने पर प्रदर्शित फ्लक्स कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "capacitor-charge": [
  "At a fixed symbolic voltage, predict how increasing capacitance affects the ideal charge.",
  "प्रतीकात्मक वोल्टता समान रखकर धारिता बढ़ाने पर आदर्श आवेश कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "alkane-count": [
  "Predict how the symbolic hydrogen count will change when the carbon count increases by one.",
  "कार्बन संख्या एक बढ़ाने पर प्रतीकात्मक हाइड्रोजन संख्या कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "bond-pair-count": [
  "Predict how the represented shared-pair count will change if you choose a higher-order bond symbol.",
  "उच्च क्रम का बंध प्रतीक चुनने पर दर्शाई साझा युग्म संख्या कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "dna-complement": [
  "Choose two different base symbols and predict their displayed complementary symbols.",
  "दो अलग क्षार प्रतीक चुनें और उनके प्रदर्शित पूरक प्रतीकों का अनुमान लगाएँ।"
 ],
 "gas-exchange": [
  "Predict how the labelled direction of transfer will differ for oxygen and carbon dioxide in the ideal diagram.",
  "आदर्श चित्र में ऑक्सीजन और कार्बन डाइऑक्साइड की नामांकित स्थानांतरण दिशाएँ कैसे अलग होंगी, अनुमान लगाएँ।"
 ],
 "science/motion": [
  "At fixed distance, predict what a longer model time will do to the displayed ideal speed.",
  "दूरी समान रखकर मॉडल समय बढ़ाने पर प्रदर्शित आदर्श चाल कैसे बदलेगी, अनुमान लगाएँ।"
 ],
 "science/reflection": [
  "Choose an incident angle and predict the reflected angle required by the ideal reflection model, measured from the normal.",
  "एक आपतन कोण चुनें और आदर्श परावर्तन मॉडल में अभिलंब से मापे आवश्यक परावर्तन कोण का अनुमान लगाएँ।"
 ],
 "science/energy": [
  "Predict how increasing the useful portion of the fixed input energy will affect the thermal portion in the two-path model.",
  "दो-रास्ते मॉडल में निश्चित आगत ऊर्जा का उपयोगी हिस्सा बढ़ाने पर ऊष्मीय हिस्सा कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "science/matter": [
  "Predict how particle arrangement and motion may differ between two selected state diagrams.",
  "दो चुने अवस्था चित्रों में कणों की व्यवस्था और गति कैसे अलग हो सकती है, अनुमान लगाएँ।"
 ],
 "science/changes": [
  "Predict the model classification of two selected change examples without carrying out a real experiment.",
  "वास्तविक प्रयोग किए बिना दो चुने परिवर्तन उदाहरणों के मॉडल वर्गीकरण का अनुमान लगाएँ।"
 ],
 "science/cells": [
  "Predict which listed structures may differ between two typical cell examples.",
  "दो सामान्य कोशिका उदाहरणों में कौन सी सूचीबद्ध संरचनाएँ अलग हो सकती हैं, अनुमान लगाएँ।"
 ],
 "science/food-chain": [
  "Predict which of two displayed organism orders represents a possible simplified feeding sequence.",
  "दो प्रदर्शित जीव क्रमों में कौन सा एक संभव सरल खाद्य शृंखला क्रम है, अनुमान लगाएँ।"
 ],
 "maths/number-line": [
  "Predict whether increasing the position value will move the marker left or right on the number line.",
  "स्थिति का मान बढ़ाने पर संख्या रेखा का चिह्न बाईं या दाईं ओर जाएगा, अनुमान लगाएँ।"
 ],
 "maths/rectangle": [
  "If width increases while height stays fixed, predict how both area and perimeter will change.",
  "ऊँचाई समान रखकर चौड़ाई बढ़ाने पर क्षेत्रफल और परिमाप दोनों कैसे बदलेंगे, अनुमान लगाएँ।"
 ],
 "maths/data-table": [
  "With group B fixed, predict how increasing group A will affect the displayed signed difference.",
  "समूह B समान रखकर समूह A बढ़ाने पर प्रदर्शित चिह्न सहित अंतर कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "studio/fractions": [
  "Predict how shading one more equal part will change the diagram while the whole stays the same.",
  "पूरा आकार समान रखकर एक और बराबर हिस्सा रंगने पर चित्र कैसे बदलेगा, अनुमान लगाएँ।"
 ],
 "studio/circuit-path": [
  "Predict the model bulb state for each of the two switch choices in the computer diagram.",
  "कंप्यूटर चित्र में स्विच के दोनों विकल्पों के लिए मॉडल बल्ब की स्थिति का अनुमान लगाएँ।"
 ]
});
export function mainWorksheetPrediction(id,lang='en'){
 if(!['en','hi'].includes(lang)||!Object.hasOwn(MAIN_PREDICTIONS,id)||(!ADVANCED_IDS.includes(id)&&!BASIC_PRINT_IDS.includes(id)))throw Error('Unknown main prediction');
 return MAIN_PREDICTIONS[id][lang==='hi'?1:0]+(lang==='hi'?' मॉडल चलाने से पहले अपना कारण कागज़ पर लिखें।':' Write your reasoning on paper before using the model.');
}
export function printableLabActivity(id,lang='en'){
 if(!validDemo(id)||!['en','hi'].includes(lang))throw Error('Unknown printable lab activity');
 const m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 return {id,subject:m.subject,language:lang,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],
  steps:[
   mainWorksheetPrediction(id,lang),
   mainWorksheetInvestigation(id,lang),
   mainWorksheetReflection(id,lang)
  ],comparison:mainWorksheetComparison(id,lang),sourceFile:'assets/advanced-lab-engine.js',rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED',humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}

/** M62 printable demonstration sequence, source-derived and deliberately omits teacher hints/answers. */
export function printableDemoAgenda(agenda,lang='en'){
 const rows=teacherAgendaRows(agenda,lang);
 return {language:lang,items:rows.map(({position,id,title,prompt,caveat})=>({position,id,title,prompt,caveat})),humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}

/** M66 source-derived supplemental paper activity, without hints or computed results. */
export function teacherSupplementOptions(id,lang='en'){
 if(!validDemo(id)||!['en','hi'].includes(lang))throw Error('Unknown supplemental worksheet model or language');
 const i=lang==='hi'?1:0;
 return advancedExtensionIds(id).map(mode=>({mode,title:advancedExtension(id,mode).title[i]}));
}
/** M107 original, model-specific supplemental reflection drafts. */
const SUPPLEMENT_REFLECTIONS=Object.freeze({
 "ratio": [
  "Compare the original and scaled ratios in your two settings. What stayed equivalent?",
  "अपनी दो स्थितियों में मूल और गुणित अनुपात मिलाएँ। क्या समतुल्य रहा?"
 ],
 "equation": [
  "Compare the left and right sides in your two substitutions. What evidence shows whether each equation is satisfied?",
  "अपने दो प्रतिस्थापनों में बाएँ और दाएँ पक्ष मिलाएँ। किस प्रमाण से पता चलता है कि हर समीकरण संतुष्ट है या नहीं?"
 ],
 "axis-reflections": [
  "Which coordinate signs changed in each axis reflection for your two points?",
  "अपने दो बिंदुओं के प्रत्येक अक्ष प्रतिबिंब में किन निर्देशांकों के चिह्न बदले?"
 ],
 "linear": [
  "Compare the displayed y values after changing one of slope, intercept or x. Explain the observed difference.",
  "ढाल, अंतःखंड या x में से एक बदलने पर प्रदर्शित y मान मिलाएँ। देखा गया अंतर समझाएँ।"
 ],
 "energy-required": [
  "How did the calculated energy transfer respond when you changed one control in the ideal heat model?",
  "आदर्श ऊष्मा मॉडल में एक नियंत्रण बदलने पर गणितीय ऊर्जा हस्तांतरण कैसे बदला?"
 ],
 "period-compare": [
  "Compare the ordering of the two periods with the ordering of their calculated frequencies.",
  "दो आवर्तकालों के क्रम को उनकी गणितीय आवृत्तियों के क्रम से मिलाएँ।"
 ],
 "average-speed": [
  "Compare the overall average speed in your two settings. How did the distances and durations contribute?",
  "अपनी दो स्थितियों में कुल औसत चाल मिलाएँ। दूरियों और समय का क्या योगदान था?"
 ],
 "neutral-counts": [
  "Compare the proton, electron and nucleon counts after changing one symbolic input.",
  "एक प्रतीकात्मक आगत बदलने पर प्रोटॉन, इलेक्ट्रॉन और न्यूक्लिऑन की गिनती मिलाएँ।"
 ],
 "missing": [
  "Compare the remaining mass in two settings. What does its sign tell you within this symbolic model?",
  "दो स्थितियों में शेष द्रव्यमान मिलाएँ। इस प्रतीकात्मक मॉडल में उसका चिह्न क्या बताता है?"
 ],
 "grid-counts": [
  "Compare the genotype-square counts for two combinations of imaginary grids; what are you counting rather than predicting?",
  "काल्पनिक तालिकाओं के दो संयोजनों में जीनोटाइप खानों की गिनती मिलाएँ; आप भविष्यवाणी के बजाय क्या गिन रहे हैं?"
 ],
 "shift": [
  "Compare the displayed square values for two choices of x or shift h. What difference did you observe?",
  "x या स्थानांतरण h के दो विकल्पों के प्रदर्शित वर्ग मान मिलाएँ। क्या अंतर देखा?"
 ],
 "net": [
  "Compare the signed net force for two opposing-force settings and explain its sign.",
  "विपरीत बलों की दो स्थितियों के चिह्न सहित परिणामी बल मिलाएँ और उसका चिह्न समझाएँ।"
 ],
 "two-formulas": [
  "Compare the H, C and O counts after changing only one symbolic molecule count.",
  "केवल एक प्रतीकात्मक अणु संख्या बदलने पर H, C और O की गिनती मिलाएँ।"
 ],
 "reverse-scale": [
  "How did the estimated actual length change when you changed the diagram length or magnification?",
  "चित्र की लंबाई या आवर्धन बदलने पर अनुमानित वास्तविक लंबाई कैसे बदली?"
 ],
 "regroup": [
  "Compare the regrouped tens and ones in two settings. How did regrouping relate to the total number?",
  "दो स्थितियों में फिर से समूहित दहाई और इकाई मिलाएँ। पुनः समूहन का कुल संख्या से क्या संबंध था?"
 ],
 "unit-conversion": [
  "Compare the lengths after expressing both in millimetres. Why does the common unit help?",
  "दोनों लंबाइयों को मिलीमीटर में व्यक्त करके मिलाएँ। समान इकाई क्यों उपयोगी है?"
 ],
 "state-account": [
  "Compare the total symbolic particle count and the two state groups in your settings.",
  "अपनी स्थितियों में कुल प्रतीकात्मक कण संख्या और दोनों अवस्था समूह मिलाएँ।"
 ],
 "leaf-diagram": [
  "How did the total drawn leaf count change when you changed one of the imaginary branch counts?",
  "काल्पनिक शाखाओं की एक संख्या बदलने पर चित्रित पत्तियों की कुल गिनती कैसे बदली?"
 ],
 "sum": [
  "Compare the last term and sum for two finite sequence settings.",
  "सीमित श्रेणी की दो स्थितियों के अंतिम पद और योग मिलाएँ।"
 ],
 "initial-speed": [
  "Compare final speed and displacement after changing one of the initial speed, acceleration or duration controls.",
  "आरंभिक चाल, त्वरण या समय में से एक नियंत्रण बदलने पर अंतिम चाल और विस्थापन मिलाएँ।"
 ],
 "mass-number": [
  "Compare atomic number and mass number when only one symbolic particle count changes.",
  "केवल एक प्रतीकात्मक कण संख्या बदलने पर परमाणु क्रमांक और द्रव्यमान संख्या मिलाएँ।"
 ],
 "three-components": [
  "Compare the three displayed mass percentages after changing one component. How did the total mass change?",
  "एक घटक बदलने पर तीन प्रदर्शित द्रव्यमान प्रतिशत मिलाएँ। कुल द्रव्यमान कैसे बदला?"
 ],
 "rounds": [
  "Compare the two final cell counts for your selected doubling rounds. Which assumptions limit this model?",
  "चुने हुए दुगुना चरणों के लिए दोनों अंतिम कोशिका संख्याएँ मिलाएँ। कौन सी मान्यताएँ इस मॉडल को सीमित करती हैं?"
 ],
 "oxygen-account": [
  "Compare symbolic oxygen production and consumption in two net-process settings.",
  "कुल प्रक्रियाओं की दो स्थितियों में प्रतीकात्मक ऑक्सीजन उत्पादन और उपभोग मिलाएँ।"
 ],
 "area-compare": [
  "Compare the two triangle areas and their perpendicular heights at the shared base.",
  "समान आधार पर दोनों त्रिभुजों के क्षेत्रफल और लंबवत ऊँचाइयाँ मिलाएँ।"
 ],
 "similar-triangles": [
  "Compare the side lengths and areas for two scale factors. What pattern did the model show?",
  "दो मापनी गुणकों के लिए भुजाओं की लंबाइयाँ और क्षेत्रफल मिलाएँ। मॉडल ने क्या पैटर्न दिखाया?"
 ],
 "three-legs": [
  "Compare the total distance and signed displacement for two three-leg paths.",
  "तीन भागों वाले दो मार्गों की कुल दूरी और चिह्न सहित विस्थापन मिलाएँ।"
 ],
 "net-over-steps": [
  "Compare total forward and reverse events with the signed net change for two settings.",
  "दो स्थितियों में कुल अग्र और पश्च घटनाओं को चिह्न सहित कुल परिवर्तन से मिलाएँ।"
 ],
 "survey-count": [
  "Compare the symbolic pond and desert counts, their total and signed difference; why is this not a real survey?",
  "तालाब और मरुस्थल की प्रतीकात्मक गिनती, कुल और चिह्न सहित अंतर मिलाएँ; यह वास्तविक सर्वेक्षण क्यों नहीं है?"
 ],
 "energy-account": [
  "Compare retained and remaining symbolic energy in two settings and explain the bookkeeping.",
  "दो स्थितियों में बचाकर रखी और शेष प्रतीकात्मक ऊर्जा मिलाएँ तथा लेखा समझाएँ।"
 ],
 "interval-area": [
  "Compare the area displayed for two line-interval settings. Which control did you change?",
  "रेखा के अंतराल की दो स्थितियों में प्रदर्शित क्षेत्रफल मिलाएँ। आपने कौन सा नियंत्रण बदला?"
 ],
 "vector-addition": [
  "Compare the resulting vector components after changing one input component.",
  "एक आगत घटक बदलने के बाद परिणामी सदिश के घटक मिलाएँ।"
 ],
 "surface-compare": [
  "Compare the two ideal flux values with their selected surface areas.",
  "दो आदर्श फ्लक्स मानों को उनके चुने सतह क्षेत्रफलों से मिलाएँ।"
 ],
 "charge-compare": [
  "Compare the two symbolic charges with their capacitances at the shared potential difference.",
  "समान विभवांतर पर दोनों प्रतीकात्मक आवेशों को उनकी धारिताओं से मिलाएँ।"
 ],
 "formula-compare": [
  "Compare hydrogen counts for the two selected symbolic alkane carbon counts.",
  "चुनी दो प्रतीकात्मक ऐल्केन कार्बन संख्याओं के लिए हाइड्रोजन की गिनती मिलाएँ।"
 ],
 "bond-symbols": [
  "Compare the represented shared pairs and electrons when one bond-symbol count changes.",
  "एक बंध-प्रतीक संख्या बदलने पर दर्शाए साझा युग्म और इलेक्ट्रॉन मिलाएँ।"
 ],
 "pair-count": [
  "Compare the total symbolic pairs and the counts of individual base types for two settings.",
  "दो स्थितियों में कुल प्रतीकात्मक युग्म और अलग-अलग क्षार प्रकारों की गिनती मिलाएँ।"
 ],
 "symbolic-transfer": [
  "Compare two proposed transfer counts with the initial symbolic oxygen count. What makes a proposal fit the model?",
  "दो प्रस्तावित स्थानांतरण संख्याओं को आरंभिक प्रतीकात्मक ऑक्सीजन संख्या से मिलाएँ। कौन सी बात प्रस्ताव को मॉडल में संभव बनाती है?"
 ],
 "group-total": [
  "Compare the combined group count and signed difference for two settings.",
  "दो स्थितियों में समूहों की संयुक्त गिनती और चिह्न सहित अंतर मिलाएँ।"
 ],
 "two-draws": [
  "Compare the displayed one-red and two-red probabilities for two imaginary bag settings.",
  "काल्पनिक थैली की दो स्थितियों में एक लाल और दो लाल आने की प्रदर्शित प्रायिकताएँ मिलाएँ।"
 ],
 "symmetric-secant": [
  "Compare the symmetric secant slope and tangent slope in two settings. What did you observe?",
  "दो स्थितियों में सममित छेदक की ढाल और स्पर्शरेखा की ढाल मिलाएँ। क्या देखा?"
 ],
 "pole-pairs": [
  "Compare the counted attraction and repulsion examples in two symbolic pole-pair settings.",
  "ध्रुव युग्मों की दो प्रतीकात्मक स्थितियों में आकर्षण और प्रतिकर्षण उदाहरणों की गिनती मिलाएँ।"
 ],
 "lens-distance-compare": [
  "Compare the two image-distance magnitudes with their object distances in the ideal lens model.",
  "आदर्श लेंस मॉडल में दोनों प्रतिबिंब दूरी के परिमाणों को उनकी वस्तु दूरियों से मिलाएँ।"
 ],
 "signed-positions": [
  "Compare the signed change and its magnitude for two start-and-end position choices.",
  "आरंभ और अंतिम स्थिति के दो विकल्पों के लिए चिह्न सहित परिवर्तन और उसका परिमाण मिलाएँ।"
 ],
 "ray-account": [
  "Compare the proposed blocked-ray counts with the available symbolic rays. What makes a count possible in this diagram?",
  "प्रस्तावित रुकी किरणों की गिनती को उपलब्ध प्रतीकात्मक किरणों से मिलाएँ। इस चित्र में कौन सी गिनती संभव है और क्यों?"
 ],
 "material-groups": [
  "Compare the labelled paper and wood group counts and their total in two settings.",
  "दो स्थितियों में कागज़ और लकड़ी के नामांकित समूहों की गिनती और कुल मिलाएँ।"
 ],
 "property-groups": [
  "Compare transparent and opaque labelled example counts in two settings.",
  "दो स्थितियों में पारदर्शी और अपारदर्शी नामांकित उदाहरणों की गिनती मिलाएँ।"
 ],
 "interaction-examples": [
  "Compare the symbolic counts of pollination, predation and decomposition cards and their total.",
  "परागण, परभक्षण और अपघटन कार्डों की प्रतीकात्मक गिनती और कुल मिलाएँ।"
 ],
 "living-groups": [
  "Compare the counts of living-plant and stone cards in two imaginary groups.",
  "दो काल्पनिक समूहों में जीवित पौधे और पत्थर वाले कार्डों की गिनती मिलाएँ।"
 ]
});
export function supplementalWorksheetReflection(id,mode,lang='en'){
 if(!['en','hi'].includes(lang)||!ADVANCED_IDS.includes(id)||!advancedExtensionIds(id).includes(mode)||!Object.hasOwn(SUPPLEMENT_REFLECTIONS,mode))throw Error('Unknown supplemental reflection');
 return SUPPLEMENT_REFLECTIONS[mode][lang==='hi'?1:0]+(lang==='hi'?' कागज़ पर अपने मॉडल अवलोकन से कारण दें। मॉडल उपलब्ध न हो तो केवल अपने अनुमान पर चर्चा करें।':' Explain using your model observations on paper. If the model is unavailable, discuss your prediction only.');
}
/** M109 original supplemental prediction drafts, paper only. */
const SUPPLEMENT_PREDICTIONS=Object.freeze({
 "ratio": [
  "What do you expect to happen to the scaled ratio if only the scale factor increases?",
  "केवल मापनी गुणक बढ़ने पर गुणित अनुपात में क्या होने की अपेक्षा है?"
 ],
 "equation": [
  "Before changing the substitution, what do you expect the left and right sides to show?",
  "प्रतिस्थापन बदलने से पहले बाएँ और दाएँ पक्ष क्या दिखाएँगे, इसका अनुमान लगाएँ।"
 ],
 "axis-reflections": [
  "Which coordinate signs do you expect to change when the selected point is reflected across each axis?",
  "चुने बिंदु को प्रत्येक अक्ष पर प्रतिबिंबित करने से किन निर्देशांकों के चिह्न बदलने की अपेक्षा है?"
 ],
 "linear": [
  "What change in y do you predict when only x is increased on the selected line?",
  "चुनी रेखा पर केवल x बढ़ाने से y में किस परिवर्तन का अनुमान है?"
 ],
 "energy-required": [
  "If only the ideal temperature-change control increases, what do you predict for the calculated energy?",
  "आदर्श तापमान-परिवर्तन नियंत्रण अकेले बढ़ने पर गणितीय ऊर्जा का क्या अनुमान है?"
 ],
 "period-compare": [
  "Which of two selected periods do you predict will correspond to the greater frequency?",
  "चुने दो आवर्तकालों में से किसकी आवृत्ति अधिक होने का अनुमान है?"
 ],
 "average-speed": [
  "If one duration increases while distances are unchanged, what do you predict for overall average speed?",
  "दूरियाँ समान रहते हुए एक समय बढ़ने पर कुल औसत चाल का क्या अनुमान है?"
 ],
 "neutral-counts": [
  "What change in the displayed particle counts do you expect when one symbolic input changes?",
  "एक प्रतीकात्मक आगत बदलने पर प्रदर्शित कण गिनती में किस परिवर्तन की अपेक्षा है?"
 ],
 "missing": [
  "How do you expect remaining symbolic mass to respond if one known output mass increases?",
  "एक ज्ञात निर्गत द्रव्यमान बढ़ने पर शेष प्रतीकात्मक द्रव्यमान में क्या परिवर्तन अपेक्षित है?"
 ],
 "grid-counts": [
  "What genotype-square counts do you predict for your chosen imaginary grid?",
  "अपनी चुनी काल्पनिक तालिका में जीनोटाइप खानों की कौन सी गिनती का अनुमान है?"
 ],
 "shift": [
  "What do you predict for the square value when the shift changes and x stays fixed?",
  "x समान रखकर स्थानांतरण बदलने पर वर्ग मान का क्या अनुमान है?"
 ],
 "net": [
  "Which sign do you predict for the net force when the selected opposing forces are compared?",
  "चुने विपरीत बलों की तुलना में परिणामी बल के किस चिह्न का अनुमान है?"
 ],
 "two-formulas": [
  "Which symbolic atom counts do you expect to change when only one molecule count increases?",
  "केवल एक अणु संख्या बढ़ने पर किन प्रतीकात्मक परमाणु गिनतियों के बदलने की अपेक्षा है?"
 ],
 "reverse-scale": [
  "If diagram length stays fixed and magnification increases, what do you predict for estimated actual length?",
  "चित्र की लंबाई समान रहे और आवर्धन बढ़े, तो अनुमानित वास्तविक लंबाई का क्या अनुमान है?"
 ],
 "regroup": [
  "How do you predict the tens and ones will regroup when the selected ones count changes?",
  "चुनी इकाई संख्या बदलने पर दहाई और इकाई किस तरह पुनः समूहित होंगी, इसका अनुमान लगाएँ।"
 ],
 "unit-conversion": [
  "Before converting, which selected length do you predict will be greater in a common unit?",
  "रूपांतरण से पहले समान इकाई में कौन सी चुनी लंबाई अधिक होगी, इसका अनुमान लगाएँ।"
 ],
 "state-account": [
  "What do you expect the total particle count to show when one symbolic state group changes?",
  "एक प्रतीकात्मक अवस्था समूह बदलने पर कुल कण गिनती क्या दिखाएगी, इसका अनुमान लगाएँ।"
 ],
 "leaf-diagram": [
  "How do you predict the total drawn leaves will change when one branch count increases?",
  "एक शाखा संख्या बढ़ाने पर चित्रित पत्तियों की कुल संख्या कैसे बदलेगी, इसका अनुमान लगाएँ।"
 ],
 "sum": [
  "What do you expect the finite sequence sum to do when you increase the number of terms in your setting?",
  "अपनी स्थिति में पदों की संख्या बढ़ाने पर सीमित श्रेणी के योग में क्या होने की अपेक्षा है?"
 ],
 "initial-speed": [
  "How do you predict final speed and displacement will respond to a change in initial speed alone?",
  "केवल आरंभिक चाल बदलने पर अंतिम चाल और विस्थापन का क्या अनुमान है?"
 ],
 "mass-number": [
  "Which of atomic number and mass number do you expect to change when one neutron is added symbolically?",
  "प्रतीकात्मक रूप से एक न्यूट्रॉन जोड़ने पर परमाणु क्रमांक और द्रव्यमान संख्या में से किसके बदलने की अपेक्षा है?"
 ],
 "three-components": [
  "How do you expect the displayed percentages to respond when one component mass increases?",
  "एक घटक द्रव्यमान बढ़ने पर प्रदर्शित प्रतिशतों में क्या परिवर्तन अपेक्षित है?"
 ],
 "rounds": [
  "What final symbolic cell count do you predict after changing the selected doubling rounds?",
  "चुने दुगुना चरण बदलने पर अंतिम प्रतीकात्मक कोशिका संख्या का क्या अनुमान है?"
 ],
 "oxygen-account": [
  "Which net oxygen balance do you predict for the selected symbolic production and consumption counts?",
  "चुनी प्रतीकात्मक उत्पादन और उपभोग गिनतियों के लिए कुल ऑक्सीजन संतुलन का क्या अनुमान है?"
 ],
 "area-compare": [
  "With the shared base fixed, which triangle do you predict will have the greater area?",
  "समान आधार स्थिर रखने पर किस त्रिभुज का क्षेत्रफल अधिक होने का अनुमान है?"
 ],
 "similar-triangles": [
  "How do you expect side lengths and area to change when the scale factor changes?",
  "मापनी गुणक बदलने पर भुजाओं की लंबाइयों और क्षेत्रफल में किस परिवर्तन की अपेक्षा है?"
 ],
 "three-legs": [
  "What do you predict for total distance and signed displacement in your chosen three-leg path?",
  "अपने चुने तीन-भाग वाले मार्ग में कुल दूरी और चिह्न सहित विस्थापन का क्या अनुमान है?"
 ],
 "net-over-steps": [
  "What signed net change do you expect from the selected forward and reverse event counts?",
  "चुनी अग्र और पश्च घटना गिनतियों से चिह्न सहित किस कुल परिवर्तन की अपेक्षा है?"
 ],
 "survey-count": [
  "Before changing the imaginary pond count, predict what will happen to the total and signed difference.",
  "काल्पनिक तालाब गिनती बदलने से पहले कुल और चिह्न सहित अंतर का अनुमान लगाएँ।"
 ],
 "energy-account": [
  "What do you predict for the symbolic retained and remaining energy when one control changes?",
  "एक नियंत्रण बदलने पर प्रतीकात्मक बची और शेष ऊर्जा का क्या अनुमान है?"
 ],
 "interval-area": [
  "How do you predict the displayed area will respond when you change the selected interval?",
  "चुना अंतराल बदलने पर प्रदर्शित क्षेत्रफल का क्या अनुमान है?"
 ],
 "vector-addition": [
  "Which resulting vector component do you expect to change when one input component changes?",
  "एक आगत घटक बदलने पर परिणामी सदिश के किस घटक के बदलने की अपेक्षा है?"
 ],
 "surface-compare": [
  "At the selected field and orientation, which surface do you predict will show the larger flux magnitude?",
  "चुने क्षेत्र और दिशा पर किस सतह का फ्लक्स परिमाण बड़ा होने का अनुमान है?"
 ],
 "charge-compare": [
  "At the shared potential difference, which capacitance do you predict will correspond to the larger charge magnitude?",
  "समान विभवांतर पर किस धारिता के लिए अधिक आवेश परिमाण का अनुमान है?"
 ],
 "formula-compare": [
  "What hydrogen count do you predict for each selected symbolic alkane carbon count?",
  "चुनी प्रत्येक प्रतीकात्मक ऐल्केन कार्बन संख्या के लिए हाइड्रोजन गिनती का क्या अनुमान है?"
 ],
 "bond-symbols": [
  "What change in shared-pair and electron counts do you predict when one bond-symbol count increases?",
  "एक बंध-प्रतीक संख्या बढ़ने पर साझा युग्म और इलेक्ट्रॉन गिनती में क्या परिवर्तन अनुमानित है?"
 ],
 "pair-count": [
  "What change in symbolic pair totals and base-type counts do you predict when one input changes?",
  "एक आगत बदलने पर प्रतीकात्मक युग्म कुल और क्षार प्रकारों की गिनती में क्या अनुमानित परिवर्तन है?"
 ],
 "symbolic-transfer": [
  "Before checking the model, which proposed transfer count do you expect to fit the available symbolic oxygen count?",
  "मॉडल जाँचने से पहले कौन सी प्रस्तावित स्थानांतरण गिनती उपलब्ध प्रतीकात्मक ऑक्सीजन संख्या में संभव लगती है?"
 ],
 "group-total": [
  "How do you predict the combined group count and signed difference will change when one group grows?",
  "एक समूह बढ़ने पर संयुक्त गिनती और चिह्न सहित अंतर कैसे बदलेंगे, इसका अनुमान लगाएँ।"
 ],
 "two-draws": [
  "What do you predict for the displayed red-draw probabilities when the imaginary bag composition changes?",
  "काल्पनिक थैली की संरचना बदलने पर लाल आने की प्रदर्शित प्रायिकताओं का क्या अनुमान है?"
 ],
 "symmetric-secant": [
  "How do you expect the symmetric secant and tangent slopes to compare for the selected settings?",
  "चुनी स्थितियों में सममित छेदक और स्पर्शरेखा की ढालों की कैसी तुलना अपेक्षित है?"
 ],
 "pole-pairs": [
  "Which attraction and repulsion counts do you predict for the selected symbolic pole pairs?",
  "चुने प्रतीकात्मक ध्रुव युग्मों में आकर्षण और प्रतिकर्षण की किस गिनती का अनुमान है?"
 ],
 "lens-distance-compare": [
  "Which selected object distance do you predict will produce the larger image-distance magnitude in the ideal model?",
  "आदर्श मॉडल में किस चुनी वस्तु दूरी से प्रतिबिंब दूरी का अधिक परिमाण अनुमानित है?"
 ],
 "signed-positions": [
  "What sign and magnitude do you predict for the change between your selected positions?",
  "चुनी स्थितियों के बीच परिवर्तन के किस चिह्न और परिमाण का अनुमान है?"
 ],
 "ray-account": [
  "Which proposed blocked-ray count do you predict will fit the available symbolic rays?",
  "कौन सी प्रस्तावित रुकी किरण गिनती उपलब्ध प्रतीकात्मक किरणों में संभव होने का अनुमान है?"
 ],
 "material-groups": [
  "How do you predict the total will change when one labelled material group count increases?",
  "एक नामांकित सामग्री समूह की गिनती बढ़ने पर कुल में क्या परिवर्तन अनुमानित है?"
 ],
 "property-groups": [
  "What counts do you predict for the selected transparent and opaque example groups after changing one input?",
  "एक आगत बदलने के बाद चुने पारदर्शी और अपारदर्शी उदाहरण समूहों की किस गिनती का अनुमान है?"
 ],
 "interaction-examples": [
  "How do you predict the symbolic interaction-card total will change when one category count changes?",
  "एक श्रेणी की गिनती बदलने पर प्रतीकात्मक पारस्परिक क्रिया कार्डों के कुल में क्या परिवर्तन अनुमानित है?"
 ],
 "living-groups": [
  "What do you predict for the imaginary living-plant and stone group counts after changing one selected count?",
  "एक चुनी गिनती बदलने के बाद काल्पनिक जीवित पौधे और पत्थर समूहों की गिनती का क्या अनुमान है?"
 ]
});
export function supplementalWorksheetPrediction(id,mode,lang='en'){
 if(!['en','hi'].includes(lang)||!ADVANCED_IDS.includes(id)||!advancedExtensionIds(id).includes(mode)||!Object.hasOwn(SUPPLEMENT_PREDICTIONS,mode))throw Error('Unknown supplemental prediction');
 return SUPPLEMENT_PREDICTIONS[mode][lang==='hi'?1:0]+(lang==='hi'?' मॉडल चलाने से पहले अपना कारण कागज़ पर लिखें।':' Write your reasoning on paper before using the model.');
}
export function printableSupplementActivity(id,mode,lang='en'){
 if(!teacherSupplementOptions(id,lang).some(x=>x.mode===mode))throw Error('Unknown supplemental worksheet activity');
 const base=printableLabActivity(id,lang),m=advancedExtension(id,mode),i=lang==='hi'?1:0;
 return {...base,mode,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],steps:[supplementalWorksheetPrediction(id,mode,lang),supplementalWorksheetInvestigation(id,mode,lang),supplementalWorksheetReflection(id,mode,lang)],comparison:supplementalWorksheetComparison(id,mode,lang)};
}

/** M75 basic model worksheets use only existing source prompts and cautions, not answer keys. */
export const BASIC_PRINT_IDS=Object.freeze([...SCIENCE_IDS.map(id=>'science/'+id),...WORKSHOP_MODES.map(id=>'maths/'+id),...STUDIO_IDS.map(id=>'studio/'+id)]);
function basicPrintDefinition(id){
 if(!BASIC_PRINT_IDS.includes(id))throw Error('Unknown basic worksheet');
 const [kind,key]=id.split('/');
 if(kind==='science'){const m=SCIENCE_MODELS[key];return {subject:m.subject.toLowerCase(),title:m.title,prompt:m.prompt,caveat:m.caveat,sourceFile:'assets/science-engine.js'};}
 if(kind==='maths'){const m=WORKSHOP_CONTENT[key];return {subject:'maths',title:m.title,prompt:m.prompt,caveat:['Whole-number computer practice only; not a complete curriculum or assessment.','केवल पूर्णांक कंप्यूटर अभ्यास; पूरा पाठ्यक्रम या आकलन नहीं।'],sourceFile:'assets/experiment-engine.js'};}
 const m=STUDIO_LESSONS[key];
 return {subject:key==='fractions'?'maths':'physics',title:m.title,prompt:m.stages.find(s=>s.id==='try').question,caveat:key==='fractions'?['Equal-size whole and equal pieces in a symbolic diagram only.','केवल प्रतीकात्मक चित्र में समान आकार के पूरे और बराबर हिस्से।']:['Computer diagram only. Do not connect real batteries, wires or sockets.','केवल कंप्यूटर चित्र। वास्तविक बैटरी, तार या सॉकेट न जोड़ें।'],sourceFile:'assets/studio-engine.js'};
}
export function teacherPrintableOptions(subject,lang='en'){
 const advanced=teacherLabOptions(subject,lang),i=lang==='hi'?1:0;
 return [...advanced,...BASIC_PRINT_IDS.map(id=>({id,...basicPrintDefinition(id)})).filter(m=>m.subject===subject).map(m=>({id:m.id,subject:m.subject,title:m.title[i],caveat:m.caveat[i],humanReviewed:false,gradeVerified:false,publicReleaseApproved:false}))];
}
/** M76 fixed internal deep links for all 60 main draft models. No external or user-entered URLs. */
function basicDemoHint(id){
 const [kind,key]=id.split('/');
 return kind==='science'?SCIENCE_MODELS[key].hint:kind==='maths'?WORKSHOP_CONTENT[key].hint:STUDIO_LESSONS[key].stages.find(s=>s.id==='try').hint;
}
export function teacherAnyLabPlan(subject,id,lang='en'){
 if(!BASIC_PRINT_IDS.includes(id))return teacherLabPlan(subject,id,lang);
 const m=basicPrintDefinition(id);
 if(m.subject!==subject||!['en','hi'].includes(lang))throw Error('Unknown or mismatched teacher lab');
 const [kind,key]=id.split('/'),i=lang==='hi'?1:0;
 const anchor={science:'science-lab',maths:'math-workshop',studio:'smart-studio'}[kind];
 return {id,subject,title:m.title[i],caveat:m.caveat[i],href:'?demo='+encodeURIComponent(id)+'#'+anchor,humanReviewed:false,gradeVerified:false,publicReleaseApproved:false,localOnly:true,storesStudentData:false,projectorReadyClaim:false};
}

export function teacherPrintableSupplementOptions(id,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 return BASIC_PRINT_IDS.includes(id)?[]:teacherSupplementOptions(id,lang);
}
export function printableBasicLabActivity(id,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=basicPrintDefinition(id),i=lang==='hi'?1:0,p=(en,hi)=>lang==='hi'?hi:en;
 return {id,subject:m.subject,language:lang,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],steps:[
 mainWorksheetPrediction(id,lang),
 mainWorksheetInvestigation(id,lang),
 mainWorksheetReflection(id,lang)
 ],comparison:mainWorksheetComparison(id,lang),sourceFile:m.sourceFile,rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED',humanReviewed:false,publicReleaseApproved:false,localOnly:true,hasStudentNames:false};
}
export function printableAnyLabActivity(id,mode='main',lang='en'){
 if(BASIC_PRINT_IDS.includes(id)){if(mode!=='main')throw Error('Unknown basic activity mode');return printableBasicLabActivity(id,lang);}
 return mode==='main'?printableLabActivity(id,lang):printableSupplementActivity(id,mode,lang);
}

/** M67 transient assignment pack: known source keys only, no free text or learner records. */
export const LAB_PACK_LIMIT=6;
export function labPackKeys(){
 return [...ADVANCED_IDS.flatMap(id=>[id+':main',...advancedExtensionIds(id).map(mode=>id+':'+mode)]),...BASIC_PRINT_IDS.map(id=>id+':main')];
}
function validateLabPack(keys){
 const allowed=labPackKeys();
 if(!Array.isArray(keys)||keys.length>LAB_PACK_LIMIT||new Set(keys).size!==keys.length||keys.some(key=>!allowed.includes(key)))throw Error('Invalid lab pack');
}
export function editLabPack(keys,action){
 validateLabPack(keys);
 if(!action||typeof action!=='object'||Array.isArray(action))throw Error('Invalid lab pack action');
 const type=action.type,needsKey=['add','remove','up','down'].includes(type);
 if(needsKey?Object.keys(action).length!==2||!Object.hasOwn(action,'key')||!labPackKeys().includes(action.key):Object.keys(action).length!==1||type!=='clear')throw Error('Unknown lab pack action');
 const next=[...keys];if(type==='clear')return [];
 const i=next.indexOf(action.key);
 if(type==='add'&&i<0&&next.length<LAB_PACK_LIMIT)next.push(action.key);
 if(type==='remove'&&i>=0)next.splice(i,1);
 if(type==='up'&&i>0)[next[i-1],next[i]]=[next[i],next[i-1]];
 if(type==='down'&&i>=0&&i<next.length-1)[next[i],next[i+1]]=[next[i+1],next[i]];
 return next;
}
export function printableLabPack(keys,lang='en'){
 validateLabPack(keys);
 if(!['en','hi'].includes(lang))throw Error('Unknown lab pack language');
 const items=keys.map((key,i)=>{
  const [id,mode]=key.split(':');
  const a=printableAnyLabActivity(id,mode,lang);
  return {...a,key,position:i+1};
 });
 return {language:lang,items,localOnly:true,hasStudentNames:false,humanReviewed:false,publicReleaseApproved:false,rightsStatus:'ORIGINAL_DRAFT_PERMISSION_NOT_AUTHENTICATED'};
}

/** M77 local activity discovery across all fixed source keys. No free text, learner records or inferred grade. */
export const TEACHER_ACTIVITY_KINDS=Object.freeze(['all','basic','advanced','supplement']);
export function teacherActivityChoices(subject,kind='all',lang='en'){
 if(!TEACHER_LAB_SUBJECTS.includes(subject)||!TEACHER_ACTIVITY_KINDS.includes(kind)||!['en','hi'].includes(lang))throw Error('Unknown activity discovery filter');
 return labPackKeys().map(key=>{
  const [id,mode]=key.split(':'),type=BASIC_PRINT_IDS.includes(id)?'basic':mode==='main'?'advanced':'supplement';
  const a=printableAnyLabActivity(id,mode,lang);
  return {key,id,mode,subject:a.subject,kind:type,title:a.title,humanReviewed:false,gradeVerified:false,publicReleaseApproved:false};
 }).filter(a=>a.subject===subject&&(kind==='all'||a.kind===kind));
}

/** M79 explicit cross-subject inventory, not grade or curriculum recommendations. */
export function teacherResourceChoices(subject,kind='all',lang='en'){
 if(subject==='all')return TEACHER_LAB_SUBJECTS.flatMap(s=>teacherActivityChoices(s,kind,lang));
 return teacherActivityChoices(subject,kind,lang);
}

/** M88 bilingual local title/key search. Never persist or echo query text in results. */
export const TEACHER_QUERY_LIMIT=80;
const resourceTokens=value=>value.normalize('NFKC').toLowerCase().trim().split(/\s+/u).filter(Boolean);
export function searchTeacherResources(subject,kind='all',lang='en',query=''){
 const choices=teacherResourceChoices(subject,kind,lang);
 if(typeof query!=='string'||query.length>TEACHER_QUERY_LIMIT||/[\p{Cc}\p{Cf}]/u.test(query))throw Error('Invalid resource search query');
 const terms=resourceTokens(query);
 if(!terms.length)return choices;
 const other=new Map(teacherResourceChoices(subject,kind,lang==='hi'?'en':'hi').map(x=>[x.key,x.title]));
 return choices.filter(x=>{
  const corpus=[x.title,other.get(x.key),x.key].join(' ').normalize('NFKC').toLowerCase();
  return terms.every(t=>corpus.includes(t));
 });
}

/** M90: source-bound demonstration routes, never arbitrary URLs or learner data. */
export function teacherActivityLaunch(key,lang='en'){
 if(typeof key!=='string'||!labPackKeys().includes(key)||!['en','hi'].includes(lang))throw Error('Unknown activity launch');
 const [id,mode]=key.split(':'),a=printableAnyLabActivity(id,mode,lang);
 const href=mode==='main'?teacherAnyLabPlan(a.subject,id,lang).href:
  '?advanced='+encodeURIComponent(id)+'&extension='+encodeURIComponent(mode)+'#advanced-ratio-extension';
 return {key,id,mode,subject:a.subject,title:a.title,href,localOnly:true,storesStudentData:false,humanReviewed:false,gradeVerified:false,publicReleaseApproved:false};
}
/** Resolve only known supplemental identifiers for the specified advanced model. */
export function teacherPackLaunches(keys,lang='en'){
 validateLabPack(keys);
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 return keys.map(key=>teacherActivityLaunch(key,lang));
}

/** M92 main-model worksheet links. The only URL fields are fixed model ID and language. */
export function mainModelWorksheet(id,lang='en'){
 if(typeof id!=='string'||(!ADVANCED_IDS.includes(id)&&!BASIC_PRINT_IDS.includes(id))||!['en','hi'].includes(lang))throw Error('Unknown main worksheet');
 const a=printableAnyLabActivity(id,'main',lang);
 return {id,subject:a.subject,title:a.title,language:lang,href:'./teacher-kit/cards/?worksheet='+encodeURIComponent(id)+'&language='+lang+'#lab-activity',localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}
export function resolveMainWorksheet(search){
 if(typeof search!=='string'||search.length>256)return null;
 const p=new URLSearchParams(search);
 if([...p.keys()].length!==2||p.getAll('worksheet').length!==1||p.getAll('language').length!==1)return null;
 try{return mainModelWorksheet(p.get('worksheet'),p.get('language'))}catch{return null}
}
export function renderMainWorksheetLink(anchor,id,lang){
 const plan=mainModelWorksheet(id,lang);
 anchor.href=plan.href;
 anchor.textContent=(lang==='hi'?'मसौदा अभ्यास पत्र खोलें: ':'Open draft worksheet: ')+plan.title;
 anchor.hidden=false;
}

/** M93 supplemental worksheet route, with original M92 main routes unchanged. */
export function activityWorksheet(key,lang='en'){
 const plan=teacherActivityLaunch(key,lang);
 if(plan.mode==='main')return {...mainModelWorksheet(plan.id,lang),key,mode:'main'};
 return {id:plan.id,key,mode:plan.mode,subject:plan.subject,title:plan.title,language:lang,href:'./teacher-kit/cards/?worksheet='+encodeURIComponent(plan.id)+'&extension='+encodeURIComponent(plan.mode)+'&language='+lang+'#lab-activity',localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}
export function resolveActivityWorksheet(search){
 const main=resolveMainWorksheet(search);
 if(main)return {...main,key:main.id+':main',mode:'main'};
 if(typeof search!=='string'||search.length>256)return null;
 const p=new URLSearchParams(search);
 if([...p.keys()].length!==3||['worksheet','extension','language'].some(k=>p.getAll(k).length!==1)||p.get('extension')==='main')return null;
 try{return activityWorksheet(p.get('worksheet')+':'+p.get('extension'),p.get('language'))}catch{return null}
}
export function renderActivityWorksheetLink(anchor,key,lang){
 const plan=activityWorksheet(key,lang);anchor.href=plan.href;
 anchor.textContent=(lang==='hi'?'मसौदा अभ्यास पत्र खोलें: ':'Open draft worksheet: ')+plan.title;anchor.hidden=false;
}
/** Language-specific return route from the exact selected worksheet, not query input. */
export function worksheetReturnLaunch(key,lang='en'){
 const plan=teacherActivityLaunch(key,lang),[query,fragment]=plan.href.split('#');
 return {...plan,language:lang,href:query+'&lang='+lang+'#'+fragment};
}

/** M99 teacher-only source-bound control ranges, not target settings or answer keys. */
export function teacherMainControlGuide(id,lang='en'){
 const labels=mainWorksheetControls(id,lang),a=printableAnyLabActivity(id,'main',lang),i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 const mini={
  'maths/number-line':[{min:-10,max:10,step:1}],
  'maths/rectangle':[{min:1,max:12,step:1},{min:1,max:12,step:1}],
  'maths/data-table':[{min:0,max:10,step:1},{min:0,max:10,step:1}],
  'studio/fractions':[{min:0,max:4,step:1}],
  'studio/circuit-path':[{options:[{label:['Open','खुला']},{label:['Closed','बंद']}]}]
 };
 const fields=ADVANCED_IDS.includes(id)?ADVANCED_MODELS[id].fields:id.startsWith('science/')?SCIENCE_MODELS[id.slice(8)].fields:mini[id];
 if(!fields||fields.length!==labels.length)throw Error('Control guide source mismatch');
 const controls=fields.map((f,j)=>{
  if(f.options)return {label:labels[j],kind:'choice',settings:f.options.map(o=>o.label[i]).join('; ')};
  if(!Number.isInteger(f.min)||!Number.isInteger(f.max)||!Number.isInteger(f.step)||f.step<1||f.max<f.min)throw Error('Invalid control range');
  return {label:labels[j],kind:'range',settings:p(f.min+' to '+f.max+'; step '+f.step,f.min+' से '+f.max+'; कदम '+f.step)+(f.unit?' ('+f.unit+')':'')};
 });
 return {id,title:a.title,caveat:a.caveat,controls,teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}

/** M100 teacher-only supplemental preparation. Only source labels and control bounds,
 * never calculated values, targets, learner states or independently approved answers. */
export function teacherSupplementControlGuide(id,mode,lang='en'){
 if(!['en','hi'].includes(lang)||!ADVANCED_IDS.includes(id)||!advancedExtensionIds(id).includes(mode))throw Error('Unknown supplemental guide');
 const m=advancedExtension(id,mode),a=printableSupplementActivity(id,mode,lang),i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 const controls=m.fields.map(f=>{
  if(!Number.isInteger(f.min)||!Number.isInteger(f.max)||f.max<f.min)throw Error('Invalid supplemental control bounds');
  return {label:f.label[i],kind:'range',settings:p(f.min+' to '+f.max+'; step 1',f.min+' से '+f.max+'; कदम 1')+(f.unit?' ('+f.unit+')':'')};
 });
 const quantityLabels=evaluateAdvancedExtension(id,mode,m.initial,lang).rows.map(r=>r.label);
 if(!quantityLabels.length||quantityLabels.some(s=>typeof s!=='string'||!s.trim()))throw Error('Invalid quantity label');
 return {id,mode,title:a.title,caveat:a.caveat,controls,quantityLabels,teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}

/** M101 main model output labels only. Advanced labels derive from canonical
 * calculation rows; basic labels are explicit bilingual draft descriptions
 * of existing model displays, not new calculations or approved answers. */
const MAIN_BASIC_OBSERVATIONS={
 "science/motion": [
  [
   "Ideal constant speed (m/s)",
   "आदर्श समान चाल (m/s)"
  ]
 ],
 "science/reflection": [
  [
   "Incident angle from normal",
   "अभिलंब से आपतन कोण"
  ],
  [
   "Selected reflected angle from normal",
   "अभिलंब से चुना परावर्तन कोण"
  ],
  [
   "Angle equality",
   "कोणों की समानता"
  ]
 ],
 "science/energy": [
  [
   "Input energy (J)",
   "आगत ऊर्जा (J)"
  ],
  [
   "Useful energy (J)",
   "उपयोगी ऊर्जा (J)"
  ],
  [
   "Thermal energy (J)",
   "ऊष्मीय ऊर्जा (J)"
  ]
 ],
 "science/matter": [
  [
   "Particle arrangement",
   "कणों की व्यवस्था"
  ],
  [
   "Particle motion",
   "कणों की गति"
  ]
 ],
 "science/changes": [
  [
   "Example classification",
   "उदाहरण का वर्गीकरण"
  ],
  [
   "Selected classification",
   "चुना वर्गीकरण"
  ]
 ],
 "science/cells": [
  [
   "Cell structures",
   "कोशिका की संरचनाएँ"
  ]
 ],
 "science/food-chain": [
  [
   "Selected food chain order",
   "चुनी खाद्य शृंखला का क्रम"
  ]
 ],
 "maths/number-line": [
  [
   "Position on number line",
   "संख्या रेखा पर स्थिति"
  ]
 ],
 "maths/rectangle": [
  [
   "Area (square units)",
   "क्षेत्रफल (वर्ग इकाई)"
  ],
  [
   "Perimeter (units)",
   "परिमाप (इकाई)"
  ]
 ],
 "maths/data-table": [
  [
   "Group A count",
   "समूह A की संख्या"
  ],
  [
   "Group B count",
   "समूह B की संख्या"
  ],
  [
   "Difference A − B",
   "अंतर A − B"
  ]
 ],
 "studio/fractions": [
  [
   "Shaded equal parts",
   "रंगे बराबर हिस्से"
  ],
  [
   "Total equal parts",
   "कुल बराबर हिस्से"
  ]
 ],
 "studio/circuit-path": [
  [
   "Model bulb state",
   "मॉडल बल्ब की स्थिति"
  ],
  [
   "Path continuity",
   "परिपथ पथ की निरंतरता"
  ]
 ]
};
export function teacherMainObservationGuide(id,lang='en'){
 if(!['en','hi'].includes(lang)||(!ADVANCED_IDS.includes(id)&&!BASIC_PRINT_IDS.includes(id)))throw Error('Unknown main observation guide');
 const i=lang==='hi'?1:0,advanced=ADVANCED_IDS.includes(id);
 const labels=advanced?advancedResultRows(calculateAdvanced(id,ADVANCED_MODELS[id].initial),lang).map(r=>r.label):MAIN_BASIC_OBSERVATIONS[id].map(pair=>pair[i]);
 if(!labels.length||labels.some(x=>typeof x!=='string'||!x.trim()))throw Error('Invalid observation labels');
 return {id,labels,source:advanced?'CANONICAL_CALCULATION_LABELS':'DRAFT_DISPLAY_DESCRIPTIONS',teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}

/** M102 ordered, transient teacher rehearsal agenda; never part of a learner print pack. */
export function teacherPackPreparation(keys,lang='en'){
 validateLabPack(keys);
 if(!['en','hi'].includes(lang))throw Error('Unknown preparation language');
 const items=keys.map((key,index)=>{
  const [id,mode]=key.split(':'),a=mode==='main'?teacherMainControlGuide(id,lang):teacherSupplementControlGuide(id,mode,lang);
  const observationLabels=mode==='main'?teacherMainObservationGuide(id,lang).labels:a.quantityLabels;
  const route=worksheetReturnLaunch(key,lang);
  return {key,position:index+1,title:a.title,caveat:a.caveat,controls:a.controls,observationLabels,href:route.href};
 });
 return {language:lang,items,teacherOnly:true,localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}

/** M103 portable teacher-only selection recipe. Fragment is not sent in HTTP requests.
 * Fixed activity keys and language only; never include learner state, names or answers. */
export const PACK_HANDOFF_PREFIX='#pack-v1:';
export const PACK_HANDOFF_MAX=512;
export function teacherPackHandoff(keys,lang='en'){
 validateLabPack(keys);
 if(!keys.length||!['en','hi'].includes(lang))throw Error('Invalid pack handoff');
 const fragment=PACK_HANDOFF_PREFIX+lang+':'+keys.map(encodeURIComponent).join(',');
 if(fragment.length>PACK_HANDOFF_MAX)throw Error('Pack handoff too long');
 return {keys:[...keys],language:lang,fragment,href:'./'+fragment,localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}
export function resolveTeacherPackHandoff(fragment){
 if(typeof fragment!=='string'||fragment.length>PACK_HANDOFF_MAX||!fragment.startsWith(PACK_HANDOFF_PREFIX))return null;
 const encoded=fragment.slice(PACK_HANDOFF_PREFIX.length),split=encoded.indexOf(':');
 if(split<0)return null;
 try{
  const lang=encoded.slice(0,split),keys=encoded.slice(split+1).split(',').map(decodeURIComponent);
  const plan=teacherPackHandoff(keys,lang);
  return plan.fragment===fragment?plan:null;
 }catch{return null}
}

/** M104 fresh demonstration tabs for the current selected pack only.
 * No arbitrary URL, pack recipe, learner state or opener access. */
export function teacherPackDemoLaunch(keys,key,lang='en'){
 validateLabPack(keys);
 if(!keys.includes(key)||!['en','hi'].includes(lang))throw Error('Unknown selected pack demonstration');
 const plan=worksheetReturnLaunch(key,lang);
 return {key,title:plan.title,language:lang,href:'../../'+plan.href,target:'_blank',rel:'noopener noreferrer',preservesOriginalPack:true,localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}

/** M105 fixed-resource preview for discovery before pack selection.
 * No query text, answers, learner state or pack contents in the URL. */
export function teacherResourcePreview(key,lang='en'){
 const plan=worksheetReturnLaunch(key,lang);
 return {key,title:plan.title,language:lang,href:'../../'+plan.href,target:'_blank',rel:'noopener noreferrer',localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}

/** M107 optional pack-wide comparison, teacher discussion only, no responses collected. */
export function teacherPackReflectionGuide(keys,lang='en'){
 validateLabPack(keys);
 if(!['en','hi'].includes(lang))throw Error('Unknown reflection language');
 if(keys.length<2)return null;
 return {language:lang,prompt:lang==='hi'?'दो गतिविधियों को चलाने से पहले अनुमान लगाएँ कि किस नियंत्रण या विचार की तुलना उपयोगी होगी। पैक की दो गतिविधियों में एक समानता और एक अंतर पहचानें। बताएँ कि कौन सा निष्कर्ष केवल मॉडल पर लागू होता है और कौन सा प्रश्न अभी खुला है। कागज़ या मौखिक चर्चा तक सीमित रखें; कोई उत्तर जमा न करें।':'Before running two activities, predict which control or concept would make a useful comparison. Identify one similarity and one difference between two activities in this pack. Explain which conclusion applies only to the model and what question remains open. Discuss orally or on paper; do not submit an answer.',teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}

/** M110 original teacher-only discussion about model boundaries; no answers or learner records. */
const MAIN_BOUNDARY_PROMPTS=Object.freeze({
 "ratio-algebra": [
  "Does doubling the number of groups change the counters in each group, or the total? Which quantity was fixed?",
  "समूहों की संख्या दुगुनी करने पर हर समूह के काउंटर बदलते हैं या कुल? कौन सी राशि स्थिर थी?"
 ],
 "symmetry": [
  "How can the class distinguish a reflected point from a point that has merely moved?",
  "कक्षा प्रतिबिंबित बिंदु और केवल स्थान बदले बिंदु में अंतर कैसे पहचान सकती है?"
 ],
 "coordinate": [
  "Does the displayed line describe every possible relationship between two variables? What is assumed here?",
  "क्या प्रदर्शित रेखा दो चरों के बीच हर संभव संबंध बताती है? यहाँ क्या मान लिया गया है?"
 ],
 "probability": [
  "Why might a short simulated trial give a proportion different from the theoretical probability?",
  "छोटे अनुकरण में अनुपात सैद्धांतिक प्रायिकता से अलग क्यों हो सकता है?"
 ],
 "temperature": [
  "Which properties of a real material might make its temperature response differ from this ideal calculation?",
  "वास्तविक पदार्थ के कौन से गुण उसकी तापमान प्रतिक्रिया को इस आदर्श गणना से अलग बना सकते हैं?"
 ],
 "sound": [
  "Why is the silent waveform diagram not evidence of how loud a real sound would be?",
  "मौन तरंग चित्र किसी वास्तविक ध्वनि की प्रबलता का प्रमाण क्यों नहीं है?"
 ],
 "magnetism": [
  "What does the pole-interaction sketch leave out about the distance and strength of real magnets?",
  "ध्रुवों की पारस्परिक क्रिया का चित्र वास्तविक चुंबकों की दूरी और बल के बारे में क्या नहीं बताता?"
 ],
 "measurement": [
  "Can two objects with the same average speed have different journeys? What does the calculation not show?",
  "क्या समान औसत चाल वाले दो पिंडों की यात्राएँ अलग हो सकती हैं? गणना क्या नहीं दिखाती?"
 ],
 "periodic": [
  "Why should the small element table not be treated as a complete account of every element's properties?",
  "छोटी तत्व सारणी को हर तत्व के गुणों का पूरा विवरण क्यों नहीं मानना चाहिए?"
 ],
 "mass-balance": [
  "What would need to be accounted for if mass appears to leave a real system? Discuss without conducting an experiment.",
  "यदि वास्तविक तंत्र से द्रव्यमान निकलता दिखाई दे तो किसका लेखा आवश्यक होगा? बिना प्रयोग किए चर्चा करें।"
 ],
 "ecosystem": [
  "Why does one depicted interaction not describe an organism's entire role in an ecosystem?",
  "दिखाया गया एक संबंध किसी जीव की पारितंत्र में पूरी भूमिका क्यों नहीं बताता?"
 ],
 "heredity": [
  "Why should a symbolic genotype grid not be used to predict the traits of a real child?",
  "प्रतीकात्मक जीनोटाइप तालिका से वास्तविक बच्चे के लक्षणों की भविष्यवाणी क्यों नहीं करनी चाहिए?"
 ],
 "quadratic": [
  "What distinction should learners make between the sampled square values and the entire graph?",
  "विद्यार्थियों को चुने वर्ग मानों और पूरे आलेख में क्या अंतर समझना चाहिए?"
 ],
 "force-motion": [
  "Why does the ideal force calculation alone not establish what will happen to a real moving object?",
  "केवल आदर्श बल गणना से वास्तविक गतिमान पिंड के साथ क्या होगा, यह क्यों तय नहीं होता?"
 ],
 "atom-count": [
  "Why are symbolic atom totals not pictures of the shapes or sizes of actual molecules?",
  "प्रतीकात्मक परमाणु कुल वास्तविक अणुओं के आकार या माप के चित्र क्यों नहीं हैं?"
 ],
 "cell-scale": [
  "Why does magnifying a diagram not increase the actual size of the object represented?",
  "चित्र का आवर्धन दर्शाई गई वस्तु का वास्तविक आकार क्यों नहीं बढ़ाता?"
 ],
 "counting": [
  "Would rearranging a group of counters change its count? How could the class distinguish arrangement from quantity?",
  "काउंटरों के समूह को फिर से सजाने पर क्या गिनती बदलेगी? कक्षा व्यवस्था और संख्या में अंतर कैसे पहचाने?"
 ],
 "place-value": [
  "Why must learners distinguish the digit in the tens position from the value that digit represents?",
  "दहाई स्थान के अंक और उस अंक के मान में अंतर समझना क्यों आवश्यक है?"
 ],
 "length-compare": [
  "Why must two lengths use comparable units before their numerical difference can be interpreted?",
  "दो लंबाइयों के संख्यात्मक अंतर को समझने से पहले समान रूप से तुलनीय इकाइयाँ क्यों चाहिए?"
 ],
 "shadow-ray": [
  "What effects of real light sources or blocker shapes are missing from the simple shadow sketch?",
  "सरल छाया चित्र में वास्तविक प्रकाश स्रोत या अवरोध के आकार के कौन से प्रभाव नहीं दिखते?"
 ],
 "material-state": [
  "Why should the chosen solid and liquid examples not be treated as a list of all possible materials?",
  "चुने ठोस और द्रव उदाहरणों को सभी संभावित पदार्थों की सूची क्यों नहीं मानना चाहिए?"
 ],
 "material-objects": [
  "Can an object consist of more than one material? What can a single pictured label establish?",
  "क्या एक वस्तु एक से अधिक सामग्रियों से बनी हो सकती है? चित्र का एक लेबल क्या स्थापित कर सकता है?"
 ],
 "plant-parts": [
  "Why might the functions of plant parts be more varied than those in a single flowering-plant diagram?",
  "पौधे के भागों के कार्य एक फूलदार पौधे के चित्र से अधिक विविध क्यों हो सकते हैं?"
 ],
 "living-examples": [
  "Why is a single observed feature not always enough to distinguish a living thing from a nonliving object?",
  "एक देखा गया गुण जीवित और निर्जीव वस्तु में अंतर करने के लिए हमेशा पर्याप्त क्यों नहीं होता?"
 ],
 "arithmetic-sequence": [
  "How can learners distinguish the term number from the value of that term?",
  "विद्यार्थी पद संख्या और उस पद के मान में अंतर कैसे समझ सकते हैं?"
 ],
 "square-slope": [
  "Why should a secant slope at two distinct points not automatically be called the tangent slope?",
  "दो अलग बिंदुओं पर छेदक की ढाल को अपने आप स्पर्शरेखा की ढाल क्यों नहीं कहना चाहिए?"
 ],
 "constant-acceleration": [
  "What changes in acceleration would make the ideal constant-acceleration calculation unsuitable for a journey?",
  "त्वरण में कौन से परिवर्तन किसी यात्रा के लिए आदर्श समान त्वरण की गणना को अनुपयुक्त बना देंगे?"
 ],
 "thin-lens": [
  "Which real optical effects are not represented by an ideal thin-lens calculation?",
  "आदर्श पतले लेंस की गणना में कौन से वास्तविक प्रकाशीय प्रभाव नहीं दर्शाए गए हैं?"
 ],
 "ion-charge": [
  "Why does counting symbolic charged particles not identify the full chemical behavior of a real ion?",
  "प्रतीकात्मक आवेशित कणों की गिनती वास्तविक आयन का पूरा रासायनिक व्यवहार क्यों नहीं बताती?"
 ],
 "mass-fraction": [
  "How should the class distinguish a component's mass percentage from its absolute mass?",
  "कक्षा किसी घटक के द्रव्यमान प्रतिशत और उसके वास्तविक द्रव्यमान में अंतर कैसे समझे?"
 ],
 "cell-doubling": [
  "Why should the ideal doubling sequence not be interpreted as a growth forecast for a real cell population?",
  "आदर्श दुगुनी होने वाली श्रेणी को वास्तविक कोशिका समूह की वृद्धि का पूर्वानुमान क्यों नहीं मानना चाहिए?"
 ],
 "plant-process": [
  "What factors affecting a living plant are absent from a simple input-output process diagram?",
  "सरल आगत-निर्गत प्रक्रिया चित्र में जीवित पौधे को प्रभावित करने वाले कौन से कारक नहीं हैं?"
 ],
 "triangle-area": [
  "Why is the perpendicular height relevant rather than just the length of a sloping side?",
  "केवल तिरछी भुजा की लंबाई के बजाय लंबवत ऊँचाई का महत्व क्यों है?"
 ],
 "right-triangle-ratio": [
  "Why must learners identify the reference angle before naming opposite and adjacent sides?",
  "विपरीत और आसन्न भुजाएँ पहचानने से पहले संदर्भ कोण जानना क्यों आवश्यक है?"
 ],
 "position-change": [
  "Why can the sign of position change depend on the chosen coordinate direction?",
  "स्थिति परिवर्तन का चिह्न चुनी निर्देशांक दिशा पर क्यों निर्भर हो सकता है?"
 ],
 "path-distance": [
  "Could returning to the start give zero displacement but nonzero distance? What does each quantity describe?",
  "क्या आरंभ पर लौटने से विस्थापन शून्य लेकिन दूरी अशून्य हो सकती है? हर राशि क्या बताती है?"
 ],
 "material-property": [
  "Why can a material's thickness or condition matter to whether light passes through it?",
  "किसी सामग्री की मोटाई या अवस्था प्रकाश गुजरने के लिए क्यों महत्वपूर्ण हो सकती है?"
 ],
 "dynamic-balance": [
  "Why should equal forward and reverse rates not be interpreted as an absence of events in the symbolic model?",
  "प्रतीकात्मक मॉडल में समान अग्र और पश्च दरों को घटनाओं के अभाव के रूप में क्यों नहीं समझना चाहिए?"
 ],
 "habitat-match": [
  "What environmental details are missing when a habitat is represented by a single example picture?",
  "आवास को एक उदाहरण चित्र से दर्शाने पर कौन से पर्यावरणीय विवरण छूट जाते हैं?"
 ],
 "food-web-links": [
  "Why should a food-energy arrow not be interpreted simply as the direction an organism moves?",
  "खाद्य ऊर्जा के तीर को केवल जीव की गति की दिशा क्यों नहीं समझना चाहिए?"
 ],
 "integral-area": [
  "When discussing an area represented under a line, why are the selected interval and sign convention important?",
  "रेखा के नीचे दर्शाए क्षेत्रफल की चर्चा में चुना अंतराल और चिह्न की परंपरा क्यों महत्वपूर्ण है?"
 ],
 "vector-components": [
  "Why is the magnitude of a vector different from either of its signed components?",
  "सदिश का परिमाण उसके किसी एक चिह्न सहित घटक से अलग क्यों है?"
 ],
 "magnetic-flux": [
  "What field and surface assumptions limit the interpretation of this ideal flux calculation?",
  "कौन सी क्षेत्र और सतह संबंधी मान्यताएँ इस आदर्श फ्लक्स गणना की व्याख्या सीमित करती हैं?"
 ],
 "capacitor-charge": [
  "Why must this symbolic charge calculation not be treated as a practical guide to connecting a real capacitor?",
  "इस प्रतीकात्मक आवेश गणना को वास्तविक संधारित्र जोड़ने की व्यावहारिक मार्गदर्शिका क्यों नहीं मानना चाहिए?"
 ],
 "alkane-count": [
  "Why does a symbolic carbon and hydrogen count not specify all details of a molecule's structure?",
  "प्रतीकात्मक कार्बन और हाइड्रोजन गिनती अणु की संरचना के सभी विवरण क्यों नहीं बताती?"
 ],
 "bond-pair-count": [
  "What is missing from a bond symbol when it is compared with a full description of molecular bonding?",
  "आणविक बंधन के पूरे विवरण की तुलना में बंध प्रतीक में क्या नहीं दिखता?"
 ],
 "dna-complement": [
  "Why does a single complementary base pair not determine a complete genetic sequence or a person's traits?",
  "एक पूरक क्षार युग्म से पूरी आनुवंशिक शृंखला या किसी व्यक्ति के लक्षण क्यों तय नहीं होते?"
 ],
 "gas-exchange": [
  "Why does a net-transfer diagram not measure the breathing or health of a real person?",
  "कुल स्थानांतरण चित्र वास्तविक व्यक्ति के श्वसन या स्वास्थ्य को क्यों नहीं मापता?"
 ],
 "science/motion": [
  "What changes in speed might a single distance-and-time calculation hide?",
  "दूरी और समय की एक गणना चाल में होने वाले कौन से परिवर्तन छिपा सकती है?"
 ],
 "science/reflection": [
  "Why must an angle of reflection be measured from the normal rather than the mirror surface?",
  "परावर्तन कोण दर्पण की सतह के बजाय अभिलंब से क्यों मापना चाहिए?"
 ],
 "science/energy": [
  "Why does the useful-versus-thermal split describe an energy accounting model rather than energy disappearing?",
  "उपयोगी और ऊष्मीय भागों का बँटवारा ऊर्जा लुप्त होने के बजाय ऊर्जा लेखा मॉडल को क्यों दर्शाता है?"
 ],
 "science/matter": [
  "Why are the drawn particles not scale photographs of actual particles?",
  "चित्रित कण वास्तविक कणों के मापानुसार छायाचित्र क्यों नहीं हैं?"
 ],
 "science/changes": [
  "What evidence would be needed beyond a picture to classify an unfamiliar change? Discuss only; do not test materials.",
  "अपरिचित परिवर्तन के वर्गीकरण के लिए चित्र से अतिरिक्त कौन सा प्रमाण चाहिए? केवल चर्चा करें; सामग्री का परीक्षण न करें।"
 ],
 "science/cells": [
  "Why should a simplified plant or animal cell diagram not be read as an inventory of every real cell?",
  "सरल पादप या जंतु कोशिका चित्र को हर वास्तविक कोशिका की पूरी सूची क्यों नहीं समझना चाहिए?"
 ],
 "science/food-chain": [
  "Why does one linear food chain omit other feeding relationships in a real habitat?",
  "एक रैखिक खाद्य शृंखला वास्तविक आवास के अन्य भोजन संबंधों को क्यों नहीं दिखाती?"
 ],
 "maths/number-line": [
  "Why does a position farther left not necessarily mean a smaller distance from zero?",
  "बाईं ओर अधिक दूर की स्थिति का शून्य से कम दूरी होना आवश्यक क्यों नहीं है?"
 ],
 "maths/rectangle": [
  "Why can equal areas have different perimeters? Discuss the distinction without giving a target setting.",
  "समान क्षेत्रफल के परिमाप अलग क्यों हो सकते हैं? लक्ष्य मान बताए बिना अंतर पर चर्चा करें।"
 ],
 "maths/data-table": [
  "Why is a difference between two group counts not the same as their total?",
  "दो समूहों की गिनती का अंतर उनके कुल के समान क्यों नहीं है?"
 ],
 "studio/fractions": [
  "Why must the whole and its equal parts be identified before comparing shaded fractions?",
  "रंगे भिन्नों की तुलना से पहले पूरे और उसके बराबर भागों की पहचान क्यों आवश्यक है?"
 ],
 "studio/circuit-path": [
  "Why is a computer path diagram not evidence that a real electrical connection is safe?",
  "कंप्यूटर परिपथ चित्र वास्तविक विद्युत संयोजन के सुरक्षित होने का प्रमाण क्यों नहीं है?"
 ]
});
export function teacherMainBoundaryGuide(id,lang='en'){
 if(!['en','hi'].includes(lang)||(!ADVANCED_IDS.includes(id)&&!BASIC_PRINT_IDS.includes(id))||!Object.hasOwn(MAIN_BOUNDARY_PROMPTS,id))throw Error('Unknown main boundary guide');
 return {id,language:lang,prompt:MAIN_BOUNDARY_PROMPTS[id][lang==='hi'?1:0],teacherOnly:true,localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}

/** M111 distinct supplemental boundaries; never inherit the main model's question. */
const SUPPLEMENT_BOUNDARY_PROMPTS=Object.freeze({
 "ratio": [
  "Why can two ratios be equivalent even when their individual numbers differ?",
  "दो अनुपातों की अलग-अलग संख्याएँ भिन्न होने पर भी वे समतुल्य क्यों हो सकते हैं?"
 ],
 "equation": [
  "Why does checking one substitution not show that every value satisfies the equation?",
  "एक प्रतिस्थापन जाँचने से यह क्यों सिद्ध नहीं होता कि हर मान समीकरण को संतुष्ट करता है?"
 ],
 "axis-reflections": [
  "How can learners distinguish reflection in an axis from a change of both coordinate signs?",
  "विद्यार्थी किसी अक्ष में प्रतिबिंब और दोनों निर्देशांकों के चिह्न बदलने में अंतर कैसे पहचानें?"
 ],
 "linear": [
  "Why is changing the intercept different from changing the slope of the displayed line?",
  "प्रदर्शित रेखा का अंतःखंड बदलना उसकी ढाल बदलने से अलग क्यों है?"
 ],
 "energy-required": [
  "What material assumptions limit this ideal energy calculation? Discuss only, not as a heating procedure.",
  "कौन सी पदार्थ संबंधी मान्यताएँ इस आदर्श ऊर्जा गणना को सीमित करती हैं? केवल चर्चा करें, गरम करने की विधि न समझें।"
 ],
 "period-compare": [
  "Why does comparing periods and frequencies not tell us the loudness of the corresponding sounds?",
  "आवर्तकाल और आवृत्ति की तुलना से संबंधित ध्वनियों की प्रबलता क्यों नहीं पता चलती?"
 ],
 "average-speed": [
  "Why may averaging two segment speeds without considering their durations give a misleading overall speed?",
  "दो भागों की चालों का समय ध्यान में रखे बिना औसत निकालने से कुल चाल भ्रामक क्यों हो सकती है?"
 ],
 "neutral-counts": [
  "Why does equal proton and electron count not establish the full properties of an atom?",
  "प्रोटॉन और इलेक्ट्रॉन की समान गिनती से परमाणु के सभी गुण क्यों तय नहीं होते?"
 ],
 "missing": [
  "Why is an unexplained mass remainder in a symbolic accounting model not proof that matter disappeared?",
  "प्रतीकात्मक लेखा मॉडल में अस्पष्ट शेष द्रव्यमान पदार्थ के लुप्त होने का प्रमाण क्यों नहीं है?"
 ],
 "grid-counts": [
  "Why must imaginary genotype-square counts not be treated as observed outcomes for a real family?",
  "काल्पनिक जीनोटाइप खानों की गिनती को वास्तविक परिवार के देखे गए परिणाम क्यों नहीं मानना चाहिए?"
 ],
 "shift": [
  "Why is shifting the input before squaring different from adding a constant to the square result?",
  "वर्ग करने से पहले आगत में स्थानांतरण और वर्ग के परिणाम में स्थिरांक जोड़ना अलग क्यों है?"
 ],
 "net": [
  "Why does zero net force in a symbolic calculation not establish that an object is at rest?",
  "प्रतीकात्मक गणना में शून्य परिणामी बल से यह क्यों सिद्ध नहीं होता कि पिंड विराम में है?"
 ],
 "two-formulas": [
  "Why are combined H, C and O counts insufficient to describe the chemical behavior of the represented substances?",
  "संयुक्त H, C और O की गिनती दर्शाए पदार्थों का रासायनिक व्यवहार बताने के लिए पर्याप्त क्यों नहीं है?"
 ],
 "reverse-scale": [
  "What could make an estimate based on diagram length and magnification inaccurate for a real image?",
  "चित्र की लंबाई और आवर्धन पर आधारित अनुमान वास्तविक छवि के लिए किन कारणों से गलत हो सकता है?"
 ],
 "regroup": [
  "Why should regrouping preserve the total represented number even when the tens and ones counts change?",
  "दहाई और इकाई की गिनती बदलने पर भी पुनः समूहन में दर्शाई गई कुल संख्या समान क्यों रहनी चाहिए?"
 ],
 "unit-conversion": [
  "Why is a larger numeral not necessarily a greater length when two measurements use different units?",
  "दो माप अलग इकाइयों में हों तो बड़ा अंक आवश्यक रूप से अधिक लंबाई क्यों नहीं बताता?"
 ],
 "state-account": [
  "Why do symbolic counts of particles in two groups not establish the actual distribution of particles in a material?",
  "दो समूहों में कणों की प्रतीकात्मक गिनती से पदार्थ में कणों का वास्तविक वितरण क्यों तय नहीं होता?"
 ],
 "leaf-diagram": [
  "Why should the branch-and-leaf count in this diagram not be used to estimate a real plant's growth?",
  "इस चित्र की शाखा और पत्ती की गिनती से वास्तविक पौधे की वृद्धि का अनुमान क्यों नहीं लगाना चाहिए?"
 ],
 "sum": [
  "Why are the last term and sum of a finite sequence different quantities?",
  "सीमित श्रेणी का अंतिम पद और योग अलग राशियाँ क्यों हैं?"
 ],
 "initial-speed": [
  "Why must the initial speed and the change in speed be distinguished when discussing the ideal final speed?",
  "आदर्श अंतिम चाल की चर्चा में आरंभिक चाल और चाल के परिवर्तन में अंतर क्यों करना चाहिए?"
 ],
 "mass-number": [
  "Why is mass number a particle count rather than a measured mass of the nucleus?",
  "द्रव्यमान संख्या नाभिक का मापा हुआ द्रव्यमान होने के बजाय कणों की गिनती क्यों है?"
 ],
 "three-components": [
  "Why can the percentage of one component change even when its own mass stays fixed?",
  "किसी घटक का द्रव्यमान स्थिर रहने पर भी उसका प्रतिशत क्यों बदल सकता है?"
 ],
 "rounds": [
  "What assumptions about division and survival prevent these doubling rounds from being a real population forecast?",
  "विभाजन और जीवित रहने की कौन सी मान्यताएँ इन दुगुने चरणों को वास्तविक जनसंख्या पूर्वानुमान बनने से रोकती हैं?"
 ],
 "oxygen-account": [
  "Why is the symbolic net oxygen balance not a measurement of oxygen exchange in a real organism?",
  "प्रतीकात्मक कुल ऑक्सीजन संतुलन वास्तविक जीव में ऑक्सीजन विनिमय का माप क्यों नहीं है?"
 ],
 "area-compare": [
  "Why does a shared base not ensure equal triangle areas when perpendicular heights differ?",
  "लंबवत ऊँचाइयाँ अलग होने पर समान आधार से त्रिभुजों के क्षेत्रफल समान क्यों नहीं हो जाते?"
 ],
 "similar-triangles": [
  "Why must the class distinguish a length scale factor from an area scale factor?",
  "कक्षा को लंबाई के मापनी गुणक और क्षेत्रफल के मापनी गुणक में अंतर क्यों करना चाहिए?"
 ],
 "three-legs": [
  "Why can adding unsigned leg lengths give a different result from adding signed position changes?",
  "चिह्न रहित मार्ग लंबाइयाँ जोड़ने का परिणाम चिह्न सहित स्थिति परिवर्तन जोड़ने से अलग क्यों हो सकता है?"
 ],
 "net-over-steps": [
  "Why can two symbolic settings have the same net change but different total event counts?",
  "दो प्रतीकात्मक स्थितियों में समान कुल परिवर्तन होते हुए घटनाओं की कुल गिनती अलग क्यों हो सकती है?"
 ],
 "survey-count": [
  "Why are selected pond and desert counts not evidence about the biodiversity of real habitats?",
  "चुनी तालाब और मरुस्थल गिनतियाँ वास्तविक आवासों की जैव विविधता का प्रमाण क्यों नहीं हैं?"
 ],
 "energy-account": [
  "What is the difference between energy recorded as remaining in this model and energy vanishing from a real system?",
  "इस मॉडल में शेष दर्ज ऊर्जा और वास्तविक तंत्र से ऊर्जा लुप्त होने में क्या अंतर है?"
 ],
 "interval-area": [
  "Why does changing the interval affect an area calculation even if the line itself is unchanged?",
  "रेखा समान रहने पर भी अंतराल बदलने से क्षेत्रफल की गणना क्यों प्रभावित होती है?"
 ],
 "vector-addition": [
  "Why should components be combined with their signs instead of simply adding vector magnitudes?",
  "सदिश परिमाणों को सीधे जोड़ने के बजाय घटकों को उनके चिह्नों सहित क्यों जोड़ना चाहिए?"
 ],
 "surface-compare": [
  "Why does the comparison of two surface areas alone not describe flux in every real magnetic field?",
  "केवल दो सतह क्षेत्रफलों की तुलना हर वास्तविक चुंबकीय क्षेत्र का फ्लक्स क्यों नहीं बताती?"
 ],
 "charge-compare": [
  "Why is a symbolic shared-voltage charge comparison not a safety assessment for actual capacitors?",
  "समान वोल्टता की प्रतीकात्मक आवेश तुलना वास्तविक संधारित्रों का सुरक्षा आकलन क्यों नहीं है?"
 ],
 "formula-compare": [
  "Why can a formula count comparison not distinguish all possible structural arrangements of molecules?",
  "सूत्र गिनती की तुलना अणुओं की सभी संभावित संरचनात्मक व्यवस्थाओं में अंतर क्यों नहीं बता सकती?"
 ],
 "bond-symbols": [
  "Why do counts of shared pairs in selected symbols not reveal the full three-dimensional bonding structure?",
  "चुने प्रतीकों में साझा युग्मों की गिनती से बंधन की पूरी त्रिआयामी संरचना क्यों नहीं पता चलती?"
 ],
 "pair-count": [
  "Why do total base-type counts not establish the order of bases in a genetic sequence?",
  "क्षार प्रकारों की कुल गिनती से आनुवंशिक शृंखला में क्षारों का क्रम क्यों तय नहीं होता?"
 ],
 "symbolic-transfer": [
  "Why is a count fitting the symbolic transfer rules not proof of a physiologically possible gas-transfer rate?",
  "प्रतीकात्मक स्थानांतरण नियमों में संभव गिनती शारीरिक रूप से संभव गैस स्थानांतरण दर का प्रमाण क्यों नहीं है?"
 ],
 "group-total": [
  "Why can two pairs of groups have equal totals but different signed differences?",
  "समूहों के दो युग्मों के कुल समान लेकिन चिह्न सहित अंतर अलग क्यों हो सकते हैं?"
 ],
 "two-draws": [
  "Why does the assumed rule for returning or not returning a drawn item matter to two-draw probabilities?",
  "निकाली वस्तु वापस रखने या न रखने का माना गया नियम दो बार निकालने की प्रायिकताओं के लिए क्यों महत्वपूर्ण है?"
 ],
 "symmetric-secant": [
  "Why should agreement of two displayed slope values not be generalized to every curve?",
  "दो प्रदर्शित ढाल मानों की समानता को हर वक्र पर लागू क्यों नहीं करना चाहिए?"
 ],
 "pole-pairs": [
  "Why do counts of attracting and repelling pole pairs not measure the strength of real magnetic forces?",
  "आकर्षित और प्रतिकर्षित ध्रुव युग्मों की गिनती वास्तविक चुंबकीय बल की शक्ति क्यों नहीं मापती?"
 ],
 "lens-distance-compare": [
  "Why does comparing image-distance magnitudes omit information about image orientation and real lens imperfections?",
  "प्रतिबिंब दूरी के परिमाणों की तुलना में प्रतिबिंब की दिशा और वास्तविक लेंस की अपूर्णताओं की जानकारी क्यों छूट जाती है?"
 ],
 "signed-positions": [
  "Why can equal magnitudes of position change correspond to opposite directions?",
  "स्थिति परिवर्तन के समान परिमाण विपरीत दिशाओं को क्यों दर्शा सकते हैं?"
 ],
 "ray-account": [
  "Why is a count of blocked symbolic rays not a measurement of real light intensity?",
  "रुकी प्रतीकात्मक किरणों की गिनती वास्तविक प्रकाश तीव्रता का माप क्यों नहीं है?"
 ],
 "material-groups": [
  "Why should counts of labelled paper and wood cards not be interpreted as measurements of material mass or strength?",
  "कागज़ और लकड़ी के नामांकित कार्डों की गिनती को सामग्री के द्रव्यमान या मजबूती का माप क्यों नहीं मानना चाहिए?"
 ],
 "property-groups": [
  "Why do counts of transparent and opaque example cards not measure how much light each material transmits?",
  "पारदर्शी और अपारदर्शी उदाहरण कार्डों की गिनती हर सामग्री से गुजरने वाले प्रकाश की मात्रा क्यों नहीं मापती?"
 ],
 "interaction-examples": [
  "Why does counting interaction cards not measure how frequently those interactions happen in nature?",
  "पारस्परिक क्रिया कार्डों की गिनती प्रकृति में उन संबंधों की वास्तविक आवृत्ति क्यों नहीं मापती?"
 ],
 "living-groups": [
  "Why do two labelled groups of plants and stones not establish a universal rule for identifying living things?",
  "पौधों और पत्थरों के दो नामांकित समूह जीवित वस्तुओं की पहचान का सार्वभौमिक नियम क्यों स्थापित नहीं करते?"
 ]
});
export function teacherSupplementBoundaryGuide(id,mode,lang='en'){
 if(!['en','hi'].includes(lang)||!ADVANCED_IDS.includes(id)||!advancedExtensionIds(id).includes(mode)||!Object.hasOwn(SUPPLEMENT_BOUNDARY_PROMPTS,mode))throw Error('Unknown supplemental boundary guide');
 return {id,mode,language:lang,prompt:SUPPLEMENT_BOUNDARY_PROMPTS[mode][lang==='hi'?1:0],teacherOnly:true,localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false};
}
/** Unified strict activity dispatch shared by worksheet and selected pack. */
export function teacherActivityBoundaryGuide(key,lang='en'){
 if(typeof key!=='string'||!labPackKeys().includes(key)||!['en','hi'].includes(lang))throw Error('Unknown activity boundary guide');
 const [id,mode]=key.split(':');
 const data=mode==='main'?teacherMainBoundaryGuide(id,lang):teacherSupplementBoundaryGuide(id,mode,lang);
 return {...data,key,mode};
}
