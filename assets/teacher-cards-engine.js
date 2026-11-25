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
export function printableLabActivity(id,lang='en'){
 if(!validDemo(id)||!['en','hi'].includes(lang))throw Error('Unknown printable lab activity');
 const m=ADVANCED_MODELS[id],i=lang==='hi'?1:0;
 const p=(en,hi)=>lang==='hi'?hi:en;
 return {id,subject:m.subject,language:lang,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],
  steps:[
   p('Predict the result before using the model. Write your reasoning on paper.','मॉडल चलाने से पहले परिणाम का अनुमान लगाएँ। अपना कारण कागज़ पर लिखें।'),
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
export function printableSupplementActivity(id,mode,lang='en'){
 if(!teacherSupplementOptions(id,lang).some(x=>x.mode===mode))throw Error('Unknown supplemental worksheet activity');
 const base=printableLabActivity(id,lang),m=advancedExtension(id,mode),i=lang==='hi'?1:0;
 return {...base,mode,title:m.title[i],prompt:m.prompt[i],caveat:m.caveat[i],steps:[base.steps[0],supplementalWorksheetInvestigation(id,mode,lang),supplementalWorksheetReflection(id,mode,lang)],comparison:supplementalWorksheetComparison(id,mode,lang)};
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
 p('Predict what the computer model will show. Write your reasoning on paper.','अनुमान लगाएँ कि कंप्यूटर मॉडल क्या दिखाएगा। अपना कारण कागज़ पर लिखें।'),
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
 return {language:lang,prompt:lang==='hi'?'पैक की दो गतिविधियों में एक समानता और एक अंतर पहचानें। बताएँ कि कौन सा निष्कर्ष केवल मॉडल पर लागू होता है और कौन सा प्रश्न अभी खुला है। कागज़ या मौखिक चर्चा तक सीमित रखें; कोई उत्तर जमा न करें।':'Identify one similarity and one difference between two activities in this pack. Explain which conclusion applies only to the model and what question remains open. Discuss orally or on paper; do not submit an answer.',teacherOnly:true,humanReviewed:false,publicReleaseApproved:false,storesStudentData:false};
}
