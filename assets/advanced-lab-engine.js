/** M33 twelve ORIGINAL, BILINGUAL, DRAFT computer-only mini models.
 * Simplified conceptual teaching. Human subject/Hindi/curriculum/child-safety approval PENDING.
 * No real experiment instructions, no AI inference, no student data, no paid API.
 */
export const ADVANCED_VERSION=1;
export const ADVANCED_IDS=Object.freeze(['ratio-algebra','symmetry','coordinate','probability','temperature','sound','magnetism','measurement','periodic','mass-balance','ecosystem','heredity','quadratic','force-motion','atom-count','cell-scale']);
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
  fields:[N('x','x-coordinate','x-निर्देशांक',-5,5),N('y','y-coordinate','y-निर्देशांक',-5,5),O('transform','Transformation','रूपांतरण',[['reflect','Reflect in y-axis','y-अक्ष पर प्रतिबिंब'],['rotate','Rotate 90° counterclockwise','90° वामावर्त घुमाएँ'],['translate','Translate by (2, −1)','(2, −1) से स्थानांतरण']])],
  initial:{x:1,y:1,transform:'reflect'},target:{x:3,y:2,transform:'reflect'}
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
  caveat:P('Ideal draws with replacement; finite simulated samples vary by seed. Not a prediction of real samples or gambling.','यह वापस रखकर निकाले गए आदर्श नमूने हैं; सीमित नमूने बीज से बदलते हैं। वास्तविक परिणाम या जुए की भविष्यवाणी नहीं।'),
  fields:[N('red','Red counters','लाल काउंटर',0,10),N('blue','Blue counters','नीले काउंटर',0,10),N('seed','Repeatable seed','दोहराने योग्य बीज',1,10),N('draws','Number of draws','नमूना संख्या',10,100,10)],
  initial:{red:1,blue:2,seed:1,draws:20},target:{red:3,blue:2,seed:1,draws:20}
 },
 temperature:{
  subject:'physics',title:P('Ideal thermal energy and temperature change','आदर्श ऊष्मीय ऊर्जा और तापमान परिवर्तन'),
  prompt:P('For a fictional material with heat capacity 100 J/(kg °C), make Q = 300 J and mass = 3 kg. Compute ΔT = Q/(mc).','100 J/(kg °C) ऊष्मा क्षमता वाले काल्पनिक पदार्थ के लिए Q = 300 J और द्रव्यमान = 3 kg रखें। ΔT = Q/(mc) निकालें।'),
  hint:P('Set input energy to 300 J and mass to 3 kg. No real heating.','ऊर्जा 300 J और द्रव्यमान 3 kg रखें। वास्तविक गर्म करना नहीं है।'),
  caveat:P('Heat is energy transfer; temperature is not heat. Toy constant-c model, no real heating, phase change or body temperature inference.','ऊष्मा ऊर्जा का स्थानांतरण है; तापमान ऊष्मा नहीं है। स्थिर c का काल्पनिक मॉडल; वास्तविक गर्म करना, अवस्था परिवर्तन या शरीर-ताप अनुमान नहीं।'),
  fields:[N('joules','Heat energy Q','ऊष्मा ऊर्जा Q',100,500,100,'J'),N('mass','Mass','द्रव्यमान',1,5,1,'kg')],
  initial:{joules:100,mass:2},target:{joules:300,mass:3}
 },
 sound:{
  subject:'physics',title:P('Sound-wave frequency and period','ध्वनि तरंग की आवृत्ति और आवर्तकाल'),
  prompt:P('Set an ideal period of 5 milliseconds. The frequency is 1000/5 = 200 Hz.','आदर्श आवर्तकाल 5 मिलीसेकंड करें। आवृत्ति 1000/5 = 200 Hz है।'),
  hint:P('Select period = 5 ms; smaller period means higher frequency.','आवर्तकाल 5 ms रखें; कम आवर्तकाल पर आवृत्ति अधिक होती है।'),
  caveat:P('Silent numeric waveform model. Relative amplitude is not a calibrated loudness measurement. No sound playback.','यह मौन संख्यात्मक तरंग मॉडल है। सापेक्ष आयाम वास्तविक ध्वनि-तीव्रता का मापन नहीं। ध्वनि नहीं बजती।'),
  fields:[N('period','Period','आवर्तकाल',1,10,1,'ms'),N('amplitude','Relative amplitude','सापेक्ष आयाम',1,5)],
  initial:{period:2,amplitude:2},target:{period:5,amplitude:2}
 },
 magnetism:{
  subject:'physics',title:P('Magnetic poles: qualitative interaction','चुंबकीय ध्रुव: गुणात्मक संबंध'),
  prompt:P('Choose North (N) and South (S) poles to illustrate attraction.','आकर्षण दर्शाने के लिए उत्तर (N) और दक्षिण (S) ध्रुव चुनें।'),
  hint:P('Opposite magnetic poles attract in this simple model.','इस सरल मॉडल में विपरीत चुंबकीय ध्रुव आकर्षित करते हैं।'),
  caveat:P('Ideal two-pole sketch. Use the computer model only; do not use real magnets or electrical equipment.','यह आदर्श दो-ध्रुव चित्र है। केवल कंप्यूटर मॉडल का उपयोग करें; वास्तविक चुंबक या बिजली उपकरण न लें।'),
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
  prompt:P('In a closed ideal model, make input masses 4 g and 5 g; choose product masses 6 g and 3 g. Both totals must match.','बंद आदर्श मॉडल में अभिकारक 4 g और 5 g तथा उत्पाद 6 g और 3 g चुनें। दोनों कुल बराबर होने चाहिए।'),
  hint:P('Compare total inputs and proposed total outputs. Unequal totals do not satisfy this closed-system model. No reaction is performed.','कुल अभिकारक और प्रस्तावित कुल उत्पाद मिलाएँ। अलग कुल बंद प्रणाली के मॉडल में सही नहीं हैं। कोई वास्तविक प्रतिक्रिया नहीं है।'),
  caveat:P('Closed-system symbolic accounting only; not a recipe, real mixing, combustion or proof of an actual reaction.','यह केवल बंद-प्रणाली प्रतीकात्मक जोड़ है; असली मिश्रण, दहन या रासायनिक क्रिया का निर्देश नहीं।'),
  fields:[N('a','Input A','अभिकारक A',1,10,1,'g'),N('b','Input B','अभिकारक B',1,10,1,'g'),N('c','Proposed product C','प्रस्तावित उत्पाद C',1,10,1,'g'),N('d','Proposed product D','प्रस्तावित उत्पाद D',1,10,1,'g')],
  initial:{a:2,b:3,c:2,d:4},target:{a:4,b:5,c:6,d:3}
 },
 ecosystem:{
  subject:'biology',title:P('Different ecosystem interactions','पारितंत्र में अलग-अलग संबंध'),
  prompt:P('Select flower + bee as a commonly taught pollination example.','परागण के सामान्य उदाहरण के लिए फूल + मधुमक्खी चुनें।'),
  hint:P('A bee visiting a flower can transfer pollen; it is not the only pollination route.','फूल पर आने वाली मधुमक्खी पराग ले जा सकती है; परागण का यही एकमात्र तरीका नहीं।'),
  caveat:P('These links are examples in a larger food web: organisms can interact in multiple ways; actual ecosystems vary. No field study or insect handling.','ये बड़े खाद्य-जाल के उदाहरण हैं; जीव कई प्रकार से संबंध रखते हैं और वास्तविक पारितंत्र अलग होते हैं। क्षेत्र अध्ययन या कीड़ों को पकड़ना नहीं।'),
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
 },

 quadratic:{
  subject:'maths',title:P('Explore the square function','वर्ग फलन समझें'),
  prompt:P('Set x to −3 and compare its square with the square of +3.','x को −3 रखें और उसके वर्ग की तुलना +3 के वर्ग से करें।'),
  hint:P('The square of either −3 or +3 is 9. The graph of y = x² is symmetric.','−3 और +3 दोनों का वर्ग 9 है। y = x² का आलेख सममित है।'),
  caveat:P('A single ideal square function, not a full quadratic equation or calculus lesson.','केवल एक आदर्श वर्ग फलन; पूरा द्विघात समीकरण या कलन पाठ नहीं।'),
  fields:[N('x','Input x','इनपुट x',-5,5)],initial:{x:1},target:{x:-3}
 },
 'force-motion':{
  subject:'physics',title:P('Net force in an ideal motion model','आदर्श गति मॉडल में परिणामी बल'),
  prompt:P('Set an ideal mass of 3 kg and acceleration of 2 m/s². Find the net force.','आदर्श द्रव्यमान 3 kg और त्वरण 2 m/s² रखें। परिणामी बल ज्ञात करें।'),
  hint:P('For constant mass in this one-dimensional model, net force = mass × acceleration.','इस एक-विमीय मॉडल में स्थिर द्रव्यमान के लिए परिणामी बल = द्रव्यमान × त्वरण।'),
  caveat:P('Ideal net-force calculation only. Not real vehicle, falling object or machinery guidance.','केवल आदर्श परिणामी बल की गणना। असली वाहन, गिरती वस्तु या मशीन का निर्देश नहीं।'),
  fields:[N('mass','Mass','द्रव्यमान',1,5,1,'kg'),N('accel','Acceleration','त्वरण',0,5,1,'m/s²')],initial:{mass:1,accel:1},target:{mass:3,accel:2}
 },
 'atom-count':{
  subject:'chemistry',title:P('Count atoms in water symbols','जल के प्रतीक में परमाणु गिनें'),
  prompt:P('Select 3 symbolic H₂O molecules and count hydrogen and oxygen atoms.','3 प्रतीकात्मक H₂O अणु चुनें और हाइड्रोजन तथा ऑक्सीजन के परमाणु गिनें।'),
  hint:P('Each water molecule has two hydrogen atoms and one oxygen atom. Multiply both counts by the number of molecules.','हर जल अणु में दो हाइड्रोजन और एक ऑक्सीजन परमाणु हैं। दोनों संख्याओं को अणुओं की संख्या से गुणा करें।'),
  caveat:P('Symbolic counting only; drawing size and shape are not molecular geometry. No mixing or reaction.','केवल प्रतीकात्मक गिनती; चित्र का आकार और आकृति असली अणु-ज्यामिति नहीं। कोई मिश्रण या प्रतिक्रिया नहीं।'),
  fields:[N('molecules','Symbolic molecules','प्रतीकात्मक अणु',1,6)],initial:{molecules:1},target:{molecules:3}
 },
 'cell-scale':{
  subject:'biology',title:P('Scale an imaginary cell diagram','काल्पनिक कोशिका चित्र का पैमाना'),
  prompt:P('Set the hypothetical cell length to 20 µm and drawing magnification to 100×. Find the diagram length in mm.','काल्पनिक कोशिका की लंबाई 20 µm और चित्र का आवर्धन 100× रखें। चित्र की लंबाई mm में ज्ञात करें।'),
  hint:P('Diagram length = actual length × magnification. Divide micrometres by 1000 to convert to millimetres.','चित्र की लंबाई = वास्तविक लंबाई × आवर्धन। माइक्रोमीटर को मिलीमीटर में बदलने के लिए 1000 से भाग दें।'),
  caveat:P('Hypothetical diagram scale, not microscope calibration, specimen collection or real cell measurement.','काल्पनिक चित्र का पैमाना; सूक्ष्मदर्शी का अंशांकन, नमूना संग्रह या वास्तविक कोशिका मापन नहीं।'),
  fields:[N('length','Imaginary cell length','काल्पनिक कोशिका लंबाई',10,50,10,'µm'),N('magnification','Drawing magnification','चित्र आवर्धन',50,200,50,'×')],initial:{length:10,magnification:50},target:{length:20,magnification:100}
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
  case 'quadratic':return {x:state.x,y:state.x*state.x,oppositeX:-state.x,oppositeSquare:state.x*state.x};
  case 'force-motion':return {mass:state.mass,acceleration:state.accel,forceN:state.mass*state.accel};
  case 'atom-count':return {molecules:state.molecules,hydrogen:2*state.molecules,oxygen:state.molecules,totalAtoms:3*state.molecules};
  case 'cell-scale':return {cellLengthUm:state.length,magnification:state.magnification,diagramMm:state.length*state.magnification/1000};
  case 'ratio-algebra':return {total:state.groups*state.each,groupRatio:state.groups+':'+(state.groups*state.each)+' = 1:'+state.each,expression:'x = '+state.groups+' × '+state.each};
  case 'symmetry':{const {x,y,transform}=state;const [transformedX,transformedY]=transform==='reflect'?[-x,y]:transform==='rotate'?[-y,x]:[x+2,y-1];return {transformedX,transformedY};}
  case 'coordinate':return {x:state.x,y:2*state.x+1};
  case 'probability':{
   const total=state.red+state.blue;
   let seed=state.seed,redDraws=0;for(let i=0;i<state.draws&&total;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;if(seed/4294967296<state.red/total)redDraws++;}
   return {red:state.red,blue:state.blue,total,probabilityRed:total?state.red/total:null,sampleSize:total?state.draws:0,sampleRed:total?redDraws:0,sampleProportion:total?redDraws/state.draws:null};
  }
  case 'temperature':return {joules:state.joules,mass:state.mass,idealDeltaC:state.joules/(state.mass*100)};
  case 'sound':return {periodMs:state.period,frequencyHz:1000/state.period,relativeAmplitude:state.amplitude};
  case 'magnetism':return {interaction:state.a===state.b?'repel':'attract'};
  case 'measurement':return {speedA:state.aDistance/state.aTime,speedB:state.bDistance/state.bTime,
   equalSpeed:state.aDistance*state.bTime===state.bDistance*state.aTime};
  case 'periodic':{
   const [symbol,period,group]=ELEMENTS[state.atomic-1];
   return {atomicNumber:state.atomic,symbol,period,group};
  }
  case 'mass-balance':return {massA:state.a,massB:state.b,totalG:state.a+state.b,productC:state.c,productD:state.d,productTotalG:state.c+state.d,balanced:state.a+state.b===state.c+state.d};
  case 'ecosystem':return {interaction:{'flower-bee':'pollination example','frog-insect':'predation example','fungus-leaf':'decomposition example'}[state.pair],foodWeb:'Illustrative food web'};
  case 'heredity':{
   const genes=x=>x.split('');
   const ratios={AA:0,Aa:0,aa:0};
   for(const a of genes(state.one))for(const b of genes(state.two))ratios[[a,b].sort((x,y)=>x==='A'?-1:y==='A'?1:0).join('')]++;
   return {genotypeGrid:ratios,outcomes:4};
  }
 }
}
const LABELS={
 oppositeX:P('Opposite input','विपरीत इनपुट'),oppositeSquare:P('Opposite input squared','विपरीत इनपुट का वर्ग'),acceleration:P('Acceleration (m/s²)','त्वरण (m/s²)'),forceN:P('Net force (N)','परिणामी बल (N)'),molecules:P('Molecules','अणु'),hydrogen:P('Hydrogen atoms','हाइड्रोजन परमाणु'),oxygen:P('Oxygen atoms','ऑक्सीजन परमाणु'),totalAtoms:P('Total atoms','कुल परमाणु'),cellLengthUm:P('Imaginary cell length (µm)','काल्पनिक कोशिका लंबाई (µm)'),magnification:P('Magnification (×)','आवर्धन (×)'),diagramMm:P('Diagram length (mm)','चित्र की लंबाई (mm)'),
 total:P('Total','कुल'),groupRatio:P('Groups : total counters','समूह : कुल काउंटर'),expression:P('Expression for the total','कुल के लिए व्यंजक'),transformedX:P('New x','नया x'),transformedY:P('New y','नया y'),
 x:P('x','x'),y:P('y','y'),red:P('Red','लाल'),blue:P('Blue','नीले'),
 probabilityRed:P('Theoretical red probability','लाल की सैद्धांतिक प्रायिकता'),
 sampleSize:P('Sample size','नमूना संख्या'),sampleRed:P('Red draws','लाल नमूने'),sampleProportion:P('Observed red proportion','लाल का देखा गया अनुपात'),
 joules:P('Energy (J)','ऊर्जा (J)'),mass:P('Mass (kg)','द्रव्यमान (kg)'),idealDeltaC:P('Ideal temperature change (°C)','आदर्श तापमान परिवर्तन (°C)'),
 periodMs:P('Period (ms)','आवर्तकाल (ms)'),frequencyHz:P('Frequency (Hz)','आवृत्ति (Hz)'),relativeAmplitude:P('Relative amplitude','सापेक्ष आयाम'),
 interaction:P('Interaction','संबंध'),speedA:P('Speed A (m/s)','चाल A (m/s)'),speedB:P('Speed B (m/s)','चाल B (m/s)'),equalSpeed:P('Equal speeds','समान चाल'),
 atomicNumber:P('Atomic number','परमाणु क्रमांक'),symbol:P('Symbol','प्रतीक'),period:P('Period','आवर्त'),group:P('Group','समूह'),
 massA:P('Input A (g)','अभिकारक A (g)'),massB:P('Input B (g)','अभिकारक B (g)'),totalG:P('Reactant total (g)','अभिकारक कुल (g)'),productTotalG:P('Product total (g)','उत्पाद कुल (g)'),productC:P('Proposed product C (g)','प्रस्तावित उत्पाद C (g)'),productD:P('Proposed product D (g)','प्रस्तावित उत्पाद D (g)'),balanced:P('Mass totals match','द्रव्यमान के कुल बराबर'),foodWeb:P('Example food → consumer paths','उदाहरण भोजन → उपभोक्ता मार्ग'),genotypeGrid:P('Hypothetical genotype counts','काल्पनिक जीनोटाइप संख्या'),outcomes:P('Grid cells','तालिका खाने')
};
const VALUE_LABELS={'Illustrative food web':P('Grass → grasshopper → frog; grass → mouse → snake; frog → snake. Real webs vary.','घास → टिड्डा → मेंढक; घास → चूहा → साँप; मेंढक → साँप। वास्तविक खाद्य-जाल अलग होते हैं।'),attract:P('Attract','आकर्षण'),repel:P('Repel','प्रतिकर्षण'),'pollination example':P('Pollination example','परागण उदाहरण'),'predation example':P('Predation example','परभक्षण उदाहरण'),'decomposition example':P('Decomposition example','अपघटन उदाहरण')};
export function advancedResultRows(metrics,lang='en'){
 return Object.entries(metrics).map(([k,v])=>({label:text(LABELS[k]||P(k,k),lang),value:v===null?text(P('Undefined: empty bag','अपरिभाषित: खाली थैली'),lang):typeof v==='boolean'?text(v?P('Yes','हाँ'):P('No','नहीं'),lang):typeof v==='object'?Object.entries(v).map(([a,b])=>a+': '+b).join(', '):typeof v==='number'?String(Number(v.toFixed(4))):text(VALUE_LABELS[v]||P(v,v),lang)}));
}
export function evaluateAdvanced(id,state,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=modelAdvanced(id),result=calculateAdvanced(id,state);
 const optional=id==='probability'?['seed','draws']:id==='sound'?['amplitude']:[];
 const correct=m.fields.filter(f=>!optional.includes(f.id)).every(f=>state[f.id]===m.target[f.id]);
 const numbers=advancedResultRows(result,lang).map(x=>x.label+' = '+x.value).join('; ');
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
