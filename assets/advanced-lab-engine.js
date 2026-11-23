/** M33 twelve ORIGINAL, BILINGUAL, DRAFT computer-only mini models.
 * Simplified conceptual teaching. Human subject/Hindi/curriculum/child-safety approval PENDING.
 * No real experiment instructions, no AI inference, no student data, no paid API.
 */
export const ADVANCED_VERSION=1;
export const ADVANCED_IDS=Object.freeze(['ratio-algebra','symmetry','coordinate','probability','temperature','sound','magnetism','measurement','periodic','mass-balance','ecosystem','heredity']);
const P=(en,hi)=>Object.freeze([en,hi]);
const N=(id,en,hi,min,max,step=1,unit='')=>({id,label:P(en,hi),min,max,step,unit});
const O=(id,en,hi,options)=>({id,label:P(en,hi),options:options.map(([v,a,b])=>({value:v,label:P(a,b)}))});
export const ADVANCED_MODELS={
 'ratio-algebra':{
  subject:'maths',title:P('Ratios and a simple expression','अनुपात और सरल बीजीय व्यंजक'),
  prompt:P('Make 3 groups with 4 counters each. Explore total = groups × counters.','3 समूहों में हर समूह के 4 काउंटर रखें। कुल = समूह × प्रति समूह काउंटर समझें।'),
  hint:P('Set groups to 3 and counters per group to 4.','समूह 3 और हर समूह के काउंटर 4 करें।'),
  caveat:P('Simplified multiplication/ratio practice; not a full algebra curriculum or real measurement.','यह सरल गुणा और अनुपात अभ्यास है, पूरा बीजगणित पाठ्यक्रम या वास्तविक मापन नहीं।'),
  fields:[N('groups','Groups','समूह',1,10),N('each','Counters per group','प्रति समूह काउंटर',1,10)],
  initial:{groups:1,each:2},target:{groups:3,each:4}
 },
 symmetry:{
  subject:'maths',title:P('Reflect a point in the vertical axis','ऊर्ध्वाधर अक्ष पर बिंदु का प्रतिबिंब'),
  prompt:P('Choose point (3, 2) and observe its reflection (−3, 2) in the y-axis.','बिंदु (3, 2) चुनें और y-अक्ष पर प्रतिबिंब (−3, 2) देखें।'),
  hint:P('Only the x-coordinate changes sign when reflected in the y-axis.','y-अक्ष पर प्रतिबिंब में केवल x-निर्देशांक का चिह्न बदलता है।'),
  caveat:P('Mathematical coordinate reflection only; not a claim about real mirrors or images.','यह केवल गणितीय निर्देशांक प्रतिबिंब है, असली दर्पण की तस्वीर नहीं।'),
  fields:[N('x','x-coordinate','x-निर्देशांक',-5,5),N('y','y-coordinate','y-निर्देशांक',-5,5)],
  initial:{x:1,y:1},target:{x:3,y:2}
 },
 coordinate:{
  subject:'maths',title:P('Graph a simple linear relationship','सरल रैखिक संबंध का आलेख'),
  prompt:P('Find y when x = 2 on the line y = 2x + 1.','रेखा y = 2x + 1 पर x = 2 होने से y निकालें।'),
  hint:P('Double the chosen x-value and add one.','चुने x को दोगुना करके एक जोड़ें।'),
  caveat:P('One ideal linear function, not a complete graphing or algebra syllabus.','यह केवल एक आदर्श रैखिक फलन है, पूरा आलेख या बीजगणित पाठ्यक्रम नहीं।'),
  fields:[N('x','Choose x','x चुनें',-5,5)],
  initial:{x:0},target:{x:2}
 },
 probability:{
  subject:'maths',title:P('Probability from a simple bag model','सरल थैली मॉडल से प्रायिकता'),
  prompt:P('Make a bag with 3 red and 2 blue counters. The theoretical probability of red is 3/5.','थैली में 3 लाल और 2 नीले काउंटर रखें। लाल आने की सैद्धांतिक प्रायिकता 3/5 है।'),
  hint:P('Set red = 3 and blue = 2. Divide the red count by the total.','लाल = 3 और नीले = 2 रखें। लाल संख्या को कुल से भाग दें।'),
  caveat:P('Ideal equally likely counter draws, not a prediction of actual sample results or a gambling activity.','यह समान संभावना वाला आदर्श मॉडल है; असली परिणाम की भविष्यवाणी या जुआ नहीं।'),
  fields:[N('red','Red counters','लाल काउंटर',0,10),N('blue','Blue counters','नीले काउंटर',0,10)],
  initial:{red:1,blue:2},target:{red:3,blue:2}
 },
 temperature:{
  subject:'physics',title:P('Ideal thermal energy and temperature change','आदर्श ऊष्मीय ऊर्जा और तापमान परिवर्तन'),
  prompt:P('For a fictional material with heat capacity 100 J/(kg °C), make Q = 300 J and mass = 3 kg. Compute ΔT = Q/(mc).','100 J/(kg °C) ऊष्मा क्षमता वाले काल्पनिक पदार्थ के लिए Q = 300 J और द्रव्यमान = 3 kg रखें। ΔT = Q/(mc) निकालें।'),
  hint:P('Set input energy to 300 J and mass to 3 kg. No real heating.','ऊर्जा 300 J और द्रव्यमान 3 kg रखें। वास्तविक गर्म करना नहीं है।'),
  caveat:P('Toy constant-c model, no real heating, burn safety, phase change or human body temperature inference.','यह स्थिर c का कल्पित मॉडल है, वास्तविक गर्म करना, जलने का जोखिम, अवस्था परिवर्तन या शरीर-ताप अनुमान नहीं।'),
  fields:[N('joules','Heat energy Q','ऊष्मा ऊर्जा Q',100,500,100,'J'),N('mass','Mass','द्रव्यमान',1,5,1,'kg')],
  initial:{joules:100,mass:2},target:{joules:300,mass:3}
 },
 sound:{
  subject:'physics',title:P('Sound-wave frequency and period','ध्वनि तरंग की आवृत्ति और आवर्तकाल'),
  prompt:P('Set an ideal period of 5 milliseconds. The frequency is 1000/5 = 200 Hz.','आदर्श आवर्तकाल 5 मिलीसेकंड करें। आवृत्ति 1000/5 = 200 Hz है।'),
  hint:P('Select period = 5 ms; smaller period means higher frequency.','आवर्तकाल 5 ms रखें; कम आवर्तकाल पर आवृत्ति अधिक होती है।'),
  caveat:P('Silent numeric waveform model. Does not play sound or suggest unsafe exposure to loud noise.','यह बिना ध्वनि वाला संख्यात्मक तरंग मॉडल है; तेज़ आवाज़ सुनने का निर्देश नहीं।'),
  fields:[N('period','Period','आवर्तकाल',1,10,1,'ms')],
  initial:{period:2},target:{period:5}
 },
 magnetism:{
  subject:'physics',title:P('Magnetic poles: qualitative interaction','चुंबकीय ध्रुव: गुणात्मक संबंध'),
  prompt:P('Choose North (N) and South (S) poles to illustrate attraction.','आकर्षण दर्शाने के लिए उत्तर (N) और दक्षिण (S) ध्रुव चुनें।'),
  hint:P('Opposite magnetic poles attract in this simple model.','इस सरल मॉडल में विपरीत चुंबकीय ध्रुव आकर्षित करते हैं।'),
  caveat:P('Ideal two-pole sketch; not instructions for strong magnets, electrical wiring or medical devices.','यह आदर्श दो-ध्रुव चित्र है; शक्तिशाली चुंबक, बिजली के तार या चिकित्सकीय यंत्र चलाने का निर्देश नहीं।'),
  fields:[O('a','Pole A','ध्रुव A',[['N','North','उत्तर'],['S','South','दक्षिण']]),O('b','Pole B','ध्रुव B',[['N','North','उत्तर'],['S','South','दक्षिण']])],
  initial:{a:'N',b:'N'},target:{a:'N',b:'S'}
 },
 measurement:{
  subject:'physics',title:P('Compare two simple speed measurements','दो सरल चाल मापों की तुलना'),
  prompt:P('Compare model A: 20 m in 4 s with model B: 30 m in 6 s. Both have 5 m/s.','मॉडल A में 4 s में 20 m और B में 6 s में 30 m की तुलना करें। दोनों की चाल 5 m/s है।'),
  hint:P('Choose A distance 20 m, A time 4 s, B distance 30 m, B time 6 s.','A दूरी 20 m, समय 4 s, B दूरी 30 m, समय 6 s रखें।'),
  caveat:P('Ideal constant-speed data; not field measurements or safe travel advice.','यह आदर्श समान चाल के आँकड़े हैं, वास्तविक मापन या सुरक्षित यात्रा सलाह नहीं।'),
  fields:[N('aDistance','A distance','A दूरी',10,50,10,'m'),N('aTime','A time','A समय',1,10,1,'s'),N('bDistance','B distance','B दूरी',10,50,10,'m'),N('bTime','B time','B समय',1,10,1,'s')],
  initial:{aDistance:10,aTime:2,bDistance:20,bTime:3},target:{aDistance:20,aTime:4,bDistance:30,bTime:6}
 },
 periodic:{
  subject:'chemistry',title:P('First 20 elements: period and group','पहले 20 तत्व: आवर्त और समूह'),
  prompt:P('Choose atomic number 11 (sodium, Na). See period 3 and group 1.','परमाणु क्रमांक 11 (सोडियम, Na) चुनें। आवर्त 3 और समूह 1 देखें।'),
  hint:P('Move the atomic number to 11. This table is limited to 1–20.','परमाणु क्रमांक 11 करें। यह तालिका 1–20 तक सीमित है।'),
  caveat:P('Only a simplified first-20-elements pattern table; hydrogen has distinct chemistry. No chemical handling or full periodic trends.','यह केवल पहले 20 तत्वों की सरल तालिका है; हाइड्रोजन का व्यवहार अलग है। कोई वास्तविक रसायन या पूर्ण आवर्ती प्रवृत्ति नहीं।'),
  fields:[N('atomic','Atomic number','परमाणु क्रमांक',1,20)],
  initial:{atomic:1},target:{atomic:11}
 },
 'mass-balance':{
  subject:'chemistry',title:P('Symbolic conservation of mass','द्रव्यमान संरक्षण का प्रतीकात्मक मॉडल'),
  prompt:P('In a closed ideal model, set symbolic reactant masses to 4 g and 5 g. Total = 9 g.','बंद आदर्श मॉडल में अभिकारकों का प्रतीकात्मक द्रव्यमान 4 g और 5 g रखें। कुल = 9 g।'),
  hint:P('Set A = 4 g and B = 5 g. Add them; no reaction is performed.','A = 4 g और B = 5 g रखें। जोड़ें; कोई प्रतिक्रिया नहीं कराई जाती।'),
  caveat:P('Closed-system symbolic accounting only; not a recipe, real mixing, combustion or proof of an actual reaction.','यह केवल बंद-प्रणाली प्रतीकात्मक जोड़ है; असली मिश्रण, दहन या रासायनिक क्रिया का निर्देश नहीं।'),
  fields:[N('a','Mass A','द्रव्यमान A',1,10,1,'g'),N('b','Mass B','द्रव्यमान B',1,10,1,'g')],
  initial:{a:2,b:3},target:{a:4,b:5}
 },
 ecosystem:{
  subject:'biology',title:P('Different ecosystem interactions','पारितंत्र में अलग-अलग संबंध'),
  prompt:P('Select flower + bee as a commonly taught pollination example.','परागण के सामान्य उदाहरण के लिए फूल + मधुमक्खी चुनें।'),
  hint:P('A bee visiting a flower can transfer pollen; it is not the only pollination route.','फूल पर आने वाली मधुमक्खी पराग ले जा सकती है; परागण का यही एकमात्र तरीका नहीं।'),
  caveat:P('Qualitative illustration, not an ecological field study or instructions to approach insects.','यह केवल गुणात्मक उदाहरण है; क्षेत्र अध्ययन या कीड़ों के पास जाने का निर्देश नहीं।'),
  fields:[O('pair','Choose example','उदाहरण चुनें',[
   ['flower-bee','Flower + bee (pollination example)','फूल + मधुमक्खी (परागण)'],
   ['frog-insect','Frog + insect (predation example)','मेंढक + कीट (परभक्षण)'],
   ['fungus-leaf','Fungus + fallen leaf (decomposition example)','कवक + गिरी पत्ती (अपघटन)']])],
  initial:{pair:'frog-insect'},target:{pair:'flower-bee'}
 },
 heredity:{
  subject:'biology',title:P('Model inheritance of an abstract trait','काल्पनिक गुण की वंशागति मॉडल'),
  prompt:P('Choose two hypothetical Aa parents to display a symbolic 1 AA : 2 Aa : 1 aa outcome grid.','दो काल्पनिक Aa अभिभावक चुनें और प्रतीकात्मक 1 AA : 2 Aa : 1 aa परिणाम-तालिका देखें।'),
  hint:P('Set both symbolic parents to Aa. This is only a simplified Punnett grid.','दोनों प्रतीकात्मक अभिभावकों को Aa रखें। यह सिर्फ सरल पनेट तालिका है।'),
  caveat:P('Abstract single-gene Mendelian model, not human genetic diagnosis or prediction of any real trait, health, identity or ability.','यह एक-जीनी काल्पनिक मेंडलीय मॉडल है; वास्तविक मानव गुण, स्वास्थ्य, पहचान या क्षमता की आनुवंशिक भविष्यवाणी नहीं।'),
  fields:[O('one','Symbolic parent 1','प्रतीकात्मक अभिभावक 1',[['AA','AA','AA'],['Aa','Aa','Aa'],['aa','aa','aa']]),
          O('two','Symbolic parent 2','प्रतीकात्मक अभिभावक 2',[['AA','AA','AA'],['Aa','Aa','Aa'],['aa','aa','aa']])],
  initial:{one:'AA',two:'aa'},target:{one:'Aa',two:'Aa'}
 }
};
const ELEMENTS=[
 ['H',1,1],['He',1,18],['Li',2,1],['Be',2,2],['B',2,13],['C',2,14],
 ['N',2,15],['O',2,16],['F',2,17],['Ne',2,18],['Na',3,1],['Mg',3,2],
 ['Al',3,13],['Si',3,14],['P',3,15],['S',3,16],['Cl',3,17],['Ar',3,18],
 ['K',4,1],['Ca',4,2]
];
const text=(p,lang)=>p[lang==='hi'?1:0];
export function modelAdvanced(id){
 if(!ADVANCED_IDS.includes(id))throw Error('Unknown advanced model');
 return ADVANCED_MODELS[id];
}
export function validateAdvancedState(id,state){
 const m=modelAdvanced(id);
 if(!state||typeof state!=='object'||Array.isArray(state)||Object.keys(state).length!==m.fields.length)throw Error('Missing or unexpected advanced state');
 for(const f of m.fields){
  const v=state[f.id];
  if(f.options){if(!f.options.some(o=>o.value===v))throw Error('Unknown advanced option '+f.id)}
  else if(!Number.isInteger(v)||v<f.min||v>f.max||(v-f.min)%f.step!==0)throw Error('Invalid advanced quantity '+f.id);
 }
 if(Object.keys(state).some(x=>!m.fields.some(f=>f.id===x)))throw Error('Unexpected advanced state field');
 return state;
}
export function calculateAdvanced(id,state){
 validateAdvancedState(id,state);
 switch(id){
  case 'ratio-algebra':return {total:state.groups*state.each};
  case 'symmetry':return {reflectedX:-state.x,reflectedY:state.y};
  case 'coordinate':return {x:state.x,y:2*state.x+1};
  case 'probability':{
   const total=state.red+state.blue;
   return {red:state.red,blue:state.blue,total,probabilityRed:total?state.red/total:null};
  }
  case 'temperature':return {joules:state.joules,mass:state.mass,idealDeltaC:state.joules/(state.mass*100)};
  case 'sound':return {periodMs:state.period,frequencyHz:1000/state.period};
  case 'magnetism':return {interaction:state.a===state.b?'repel':'attract'};
  case 'measurement':return {speedA:state.aDistance/state.aTime,speedB:state.bDistance/state.bTime,
   equalSpeed:state.aDistance*state.bTime===state.bDistance*state.aTime};
  case 'periodic':{
   const [symbol,period,group]=ELEMENTS[state.atomic-1];
   return {atomicNumber:state.atomic,symbol,period,group};
  }
  case 'mass-balance':return {massA:state.a,massB:state.b,totalG:state.a+state.b};
  case 'ecosystem':return {interaction:{'flower-bee':'pollination example','frog-insect':'predation example','fungus-leaf':'decomposition example'}[state.pair]};
  case 'heredity':{
   const genes=x=>x.split('');
   const ratios={AA:0,Aa:0,aa:0};
   for(const a of genes(state.one))for(const b of genes(state.two))ratios[[a,b].sort((x,y)=>x==='A'?-1:y==='A'?1:0).join('')]++;
   return {genotypeGrid:ratios,outcomes:4};
  }
 }
}
export function evaluateAdvanced(id,state,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=modelAdvanced(id),result=calculateAdvanced(id,state);
 const correct=m.fields.every(f=>state[f.id]===m.target[f.id]);
 const numbers=Object.entries(result).map(([k,v])=>k+' = '+(v===null?'undefined (empty bag)':typeof v==='object'?JSON.stringify(v):typeof v==='number'?Number(v.toFixed(4)):v)).join('; ');
 return {id,correct,metrics:result,explanation:text(m.title,lang)+': '+numbers+'. '+text(m.caveat,lang),
  draftStatus:'PENDING_SUBJECT_HINDI_AND_SAFETY_REVIEW',publicReleaseApproved:false,source:'assets/advanced-lab-engine.js'};
}
export function auditAdvancedPairs(models=ADVANCED_MODELS){
 const errors=[];
 for(const id of ADVANCED_IDS){
  const m=models[id];if(!m){errors.push(id+' missing');continue}
  for(const key of ['title','prompt','hint','caveat']){
   if(!Array.isArray(m[key])||m[key].length!==2||m[key].some(x=>typeof x!=='string'||x.trim().length<8))errors.push(id+': missing '+key+' bilingual text');
  }
  for(const f of m.fields||[]){
   if(!Array.isArray(f.label)||f.label.some(x=>!x))errors.push(id+': missing field label');
   for(const option of f.options||[])if(!Array.isArray(option.label)||option.label.some(x=>!x))errors.push(id+': missing option');
  }
  try{validateAdvancedState(id,m.initial);validateAdvancedState(id,m.target);if(!evaluateAdvanced(id,m.target).correct)errors.push(id+': wrong target')}catch(e){errors.push(id+': '+e.message)}
 }
 return errors;
}
