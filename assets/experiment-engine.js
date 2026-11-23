/** M16 conceptual simulations. Draft educational content: human educator/Hindi review PENDING. */
export const EXPERIMENT_VERSION=1;
export const EXPERIMENT_IDS=Object.freeze(['fractions-lab','series-circuit']);
export const EXPERIMENTS={
 'fractions-lab':{
  title:['Fraction Explorer: two equal wholes','भिन्न खोज: दो बराबर पूरे'],
  overview:['Compare two same-sized fraction strips. Change the shaded pieces and total equal pieces using buttons. Two strips represent equal-sized wholes.','समान आकार के दो भिन्न-पट्टों की तुलना करें। बटन से रंगे हुए और कुल बराबर हिस्से बदलें। दोनों पट्टियाँ समान आकार के पूरे दिखाती हैं।'],
  mission:['Draw two same-sized rectangles on paper. Split one into two equal parts and the other into four. Shade 1/2 and 2/4. Explain why they cover the same area.','कागज़ पर एक ही आकार के दो आयत बनाएँ। एक में दो और दूसरे में चार बराबर हिस्से करें। 1/2 और 2/4 रंगें। बताएँ दोनों में समान क्षेत्र क्यों रंगा है।'],
  source:'https://epathshala.ncert.gov.in/',
  tasks:[{id:'compare',title:['Compare the two fractions','दो भिन्नों की तुलना'],prompt:['Use the controls to explore both strips, then choose whether A is less than, equal to, or greater than B.','दोनों पट्टियों को बटन से बदलकर देखें, फिर चुनें A, B से छोटा, बराबर या बड़ा है।'],hint:['The wholes must be the same size. For A=a/b and B=c/d, compare a×d and c×b.','पूरे बराबर आकार के हों। A=a/b और B=c/d में a×d और c×b की तुलना करें।']},
  {id:'equivalence',title:['Build two equal fractions','दो बराबर भिन्न बनाएँ'],prompt:['Create two equivalent positive fractions using different numbers of equal pieces. Then check your design.','अलग-अलग संख्या के बराबर हिस्सों से दो समान सकारात्मक भिन्न बनाएँ। फिर जाँचें।'],hint:['Try one half in two pieces and two quarters in four pieces. The denominators must differ.','आधा दो हिस्सों में और दो चौथाई चार हिस्सों में आज़माएँ। हर अलग होना चाहिए।']}]
 },
 'series-circuit':{
  title:['Two-switch series circuit model','दो स्विच वाला श्रेणी परिपथ मॉडल'],
  overview:['In this simplified conceptual low-voltage circuit, two switches are in series. The model bulb lights only if BOTH switches are CLOSED. Do not connect any real batteries, wires or sockets.','कम-वोल्टेज के इस सरल वैचारिक परिपथ में दो स्विच श्रेणी में हैं। मॉडल में बल्ब तभी जलता है जब दोनों स्विच बंद हों। असली बैटरी, तार या सॉकेट न जोड़ें।'],
  mission:['Draw a battery, two switches and a lamp connected in one closed loop on paper. Draw the same path with one switch open. No real electrical equipment is needed.','कागज़ पर बैटरी, दो स्विच और बल्ब को एक बंद रास्ते में बनाइए। फिर एक स्विच खुला दिखाइए। असली बिजली के सामान की जरूरत नहीं।'],
  source:'https://diksha.gov.in/virtuallabs.html',
  tasks:[{id:'light',title:['Make the model bulb light','मॉडल बल्ब जलाएँ'],prompt:['Change the two switch positions until the conceptual bulb turns on. Check the switch pattern.','दोनों स्विच की स्थिति बदलकर वैचारिक बल्ब जलाएँ। फिर स्विचों की स्थिति जाँचें।'],hint:['For a series circuit, both switches must complete the same path.','श्रेणी परिपथ में दोनों स्विचों को रास्ता पूरा करना होता है।']},
  {id:'interrupt',title:['Interrupt one part of the path','रास्ते का एक हिस्सा तोड़ें'],prompt:['Start from the closed path and open exactly ONE of the two switches. Check what the model bulb does.','बंद रास्ते से शुरू करके दोनों में से ठीक एक स्विच खोलें। जाँचें मॉडल बल्ब के साथ क्या होता है।'],hint:['Opening either one of two series switches breaks the path. Keep the other switch closed.','श्रेणी के दोनों में से कोई एक स्विच खोलने से रास्ता टूटता है। दूसरा बंद रखें।']}]
 }
};
export const experimentText=(pair,lang='en')=>Array.isArray(pair)?pair[lang==='hi'?1:0]:'';
export const experimentTask=(experimentId,taskId)=>{if(!EXPERIMENT_IDS.includes(experimentId))throw Error('Unknown experiment');const task=EXPERIMENTS[experimentId].tasks.find(x=>x.id===taskId);if(!task)throw Error('Unknown experiment task');return task};
function isFraction(f){return f&&Number.isInteger(f.n)&&Number.isInteger(f.d)&&f.d>=2&&f.d<=8&&f.n>=0&&f.n<=f.d;}
export function relation(a,b){if(!isFraction(a)||!isFraction(b))throw Error('Invalid fractions');const left=a.n*b.d,right=b.n*a.d;return left<right?'lt':left>right?'gt':'eq';}
export function bulbLit(s){if(!s||typeof s.a!=='boolean'||typeof s.b!=='boolean')throw Error('Invalid switches');return s.a&&s.b;}
export function evaluateExperiment(experimentId,taskId,response){experimentTask(experimentId,taskId);
 if(experimentId==='fractions-lab'){
  if(!response||!isFraction(response.a)||!isFraction(response.b))throw Error('Invalid strip state');
  if(taskId==='compare'){
   if(!['lt','eq','gt'].includes(response.choice))throw Error('Invalid comparison');
   return {correct:response.choice===relation(response.a,response.b),expected:relation(response.a,response.b)};
  }
  return {correct:response.a.n>0&&response.a.n<response.a.d&&response.b.n>0&&response.b.n<response.b.d&&response.a.d!==response.b.d&&relation(response.a,response.b)==='eq',expected:'equal positive proper fractions with different denominators'};
 }
 if(!response||typeof response.a!=='boolean'||typeof response.b!=='boolean')throw Error('Invalid switch state');
 if(taskId==='light')return {correct:bulbLit(response),expected:true};
 return {correct:(response.a!==response.b)&&!bulbLit(response),expected:false};
}
const BANDS=new Set(['6-10','11-14','15-17','18+']);
export function isValidExperimentAttempt(attempt){
 if(!attempt||typeof attempt!=='object'||typeof attempt.id!=='string'||attempt.id.length<1||attempt.id.length>110||!EXPERIMENT_IDS.includes(attempt.experimentId)||!BANDS.has(attempt.ageBand)||attempt.version!==EXPERIMENT_VERSION||typeof attempt.correct!=='boolean'||typeof attempt.at!=='string'||!Number.isFinite(Date.parse(attempt.at))||typeof attempt.day!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(attempt.day))return false;
 try{return evaluateExperiment(attempt.experimentId,attempt.taskId,attempt.response).correct===attempt.correct;}catch{return false}
}
export function experimentSummary(attempts=[],age){const valid=(Array.isArray(attempts)?attempts:[]).filter(x=>isValidExperimentAttempt(x)&&(!age||x.ageBand===age));const results=EXPERIMENT_IDS.map(id=>({id,attempts:valid.filter(x=>x.experimentId===id).length,tasksTried:new Set(valid.filter(x=>x.experimentId===id).map(x=>x.taskId)).size}));return {attempts:valid.length,experiments:results,explored:results.filter(x=>x.tasksTried===2).length};}
/** M30 B1: three original, fully local Maths Workshop mini-labs.
 * Draft concepts, NOT a full Class 1–12 maths syllabus or reviewed curriculum.
 * Pure functions enable independent numeric assertions and text-only alternatives.
 */
export const WORKSHOP_MODES=Object.freeze(['number-line','rectangle','data-table']);
export const WORKSHOP_DRAFT_REVIEW='pending-subject-and-Hindi-review';
export const WORKSHOP_CONTENT={
 'number-line':{
  title:['Number line: move to −3','संख्या रेखा: −3 पर जाएँ'],
  prompt:['Start at zero. Move left or right to −3. Negative values sit to the left of zero.','शून्य से शुरू करें। बाएँ या दाएँ चलते हुए −3 पर पहुँचें। ऋणात्मक संख्याएँ शून्य के बाएँ होती हैं।'],
  hint:['Each arrow changes the position by exactly one.','हर तीर स्थिति को ठीक एक से बदलता है।']
 },
 rectangle:{
  title:['Rectangle: area and perimeter','आयत: क्षेत्रफल और परिमाप'],
  prompt:['Make a rectangle 4 units wide and 3 units high. Count square units for area; add all sides for perimeter.','4 इकाई चौड़ा और 3 इकाई ऊँचा आयत बनाएँ। क्षेत्रफल के लिए वर्ग इकाइयाँ और परिमाप के लिए चारों भुजाएँ जोड़ें।'],
  hint:['Area = width × height; perimeter = 2 × (width + height).','क्षेत्रफल = चौड़ाई × ऊँचाई; परिमाप = 2 × (चौड़ाई + ऊँचाई)।']
 },
 'data-table':{
  title:['Compare a simple data table','सरल आँकड़ा तालिका की तुलना'],
  prompt:['Set group A to 4 items and B to 2 items. How many more are in A than B?','समूह A को 4 और B को 2 वस्तुओं पर रखें। A में B से कितनी अधिक हैं?'],
  hint:['Compare counts by subtracting smaller from larger.','संख्याओं का अंतर जानने के लिए छोटी संख्या बड़ी से घटाएँ।']
 }
};
export function workshopValues(mode,values){
 if(!WORKSHOP_MODES.includes(mode)||!values||typeof values!=='object')throw Error('Unknown workshop mode or values');
 const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
 if(mode==='number-line'){
  if(!int(values.position,-10,10))throw Error('Number line must be an integer between -10 and 10');
  return {position:values.position};
 }
 if(mode==='rectangle'){
  if(!int(values.width,1,12)||!int(values.height,1,12))throw Error('Rectangle dimensions must be whole units 1–12');
  return {width:values.width,height:values.height};
 }
 if(!int(values.a,0,10)||!int(values.b,0,10))throw Error('Data groups must be whole counts 0–10');
 return {a:values.a,b:values.b};
}
export function evaluateWorkshop(mode,values){
 const v=workshopValues(mode,values);
 if(mode==='number-line')return{
  correct:v.position===-3,metrics:{position:v.position},
  explanation:[`The marker is at ${v.position}. Three steps left from zero reaches −3. This is one practice task, not proof of mastery.`,
   `बिंदु ${v.position} पर है। शून्य से तीन कदम बाएँ चलकर −3 आता है। यह अभ्यास है, पूर्ण दक्षता का प्रमाण नहीं।`]
 };
 if(mode==='rectangle'){
  const area=v.width*v.height,perimeter=2*(v.width+v.height);
  return {correct:v.width===4&&v.height===3,metrics:{area,perimeter},
   explanation:[`Width ${v.width}, height ${v.height}: area = ${area} square units, perimeter = ${perimeter} units. This simplified rectangle uses whole-number units.`,
    `चौड़ाई ${v.width}, ऊँचाई ${v.height}: क्षेत्रफल = ${area} वर्ग इकाई, परिमाप = ${perimeter} इकाई। यह पूर्णांक इकाइयों वाला सरल आयत है।`]};
 }
 const difference=v.a-v.b;
 return {correct:v.a===4&&v.b===2,metrics:{difference},
  explanation:[`A has ${v.a} and B has ${v.b}. A − B = ${difference}; negative means A has fewer. Try the goal 4 and 2.`,
   `A में ${v.a} और B में ${v.b} हैं। A − B = ${difference}; ऋणात्मक होने पर A में कम हैं। लक्ष्य 4 और 2 है।`]};
}
