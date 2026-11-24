/** M33 twelve ORIGINAL, BILINGUAL, DRAFT computer-only mini models.
 * Simplified conceptual teaching. Human subject/Hindi/curriculum/child-safety approval PENDING.
 * No real experiment instructions, no AI inference, no student data, no paid API.
 */
export const ADVANCED_VERSION=1;
export const ADVANCED_IDS=Object.freeze(['ratio-algebra','symmetry','coordinate','probability','temperature','sound','magnetism','measurement','periodic','mass-balance','ecosystem','heredity','quadratic','force-motion','atom-count','cell-scale','counting','place-value','length-compare','shadow-ray','material-state','material-objects','plant-parts','living-examples',"arithmetic-sequence","square-slope","constant-acceleration","thin-lens","ion-charge","mass-fraction","cell-doubling","plant-process","triangle-area","right-triangle-ratio","position-change","path-distance","material-property","dynamic-balance","habitat-match","food-web-links","integral-area","vector-components","magnetic-flux","capacitor-charge","alkane-count","bond-pair-count","dna-complement","gas-exchange"]);
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
  initial:{groups:1,each:2},target:{groups:3,each:4},
  // Supplemental examples are part of this existing draft's serialized review fingerprint.
  extensions:{
   ratio:{title:P('Equivalent ratios','समतुल्य अनुपात'),prompt:P('Scale both parts of a ratio by the same positive integer. Compare the two ratios.','अनुपात के दोनों पदों को उसी धनात्मक पूर्णांक से गुणा करें। दोनों अनुपात मिलाएँ।'),
    hint:P('Multiplying both terms by the same nonzero factor preserves their ratio.','दोनों पदों को उसी अशून्य गुणक से गुणा करने पर अनुपात समान रहता है।'),
    caveat:P('Positive whole-number examples only, not a complete proportion syllabus.','केवल धनात्मक पूर्णांक उदाहरण; पूरा समानुपात पाठ्यक्रम नहीं।'),
    fields:[N('a','First part','पहला पद',1,6),N('b','Second part','दूसरा पद',1,6),N('k','Scale factor','गुणक',1,5)],initial:{a:2,b:3,k:2}},
   equation:{title:P('Check a linear equation','रैखिक समीकरण जाँचें'),prompt:P('Choose a, b and a candidate x. Compare ax + b with the fixed right side 12.','a, b और संभावित x चुनें। ax + b को निश्चित दाएँ पक्ष 12 से मिलाएँ।'),
    hint:P('An equation is satisfied when both sides have the same value. Changing a or b changes the equation.','दोनों पक्षों का मान समान होने पर समीकरण संतुष्ट होता है। a या b बदलने पर समीकरण बदलता है।'),
    caveat:P('Bounded integer substitution only; some equations have no solution in this control range. No mastery score.','केवल सीमित पूर्णांक प्रतिस्थापन; कुछ समीकरणों का हल इस सीमा में नहीं है। कोई दक्षता अंक नहीं।'),
    fields:[N('a','Coefficient a','गुणांक a',1,5),N('b','Constant b','स्थिरांक b',0,6),N('x','Candidate x','संभावित x',0,12)],initial:{a:2,b:4,x:1}}
  }
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
  initial:{x:0},target:{x:2},extensions:{linear:{title:P('Explore slope and intercept','ढाल और अंतःखंड की खोज'),prompt:P('Choose integer slope m, intercept b and x. Calculate y = mx + b.','पूर्णांक ढाल m, अंतःखंड b और x चुनें। y = mx + b निकालें।'),hint:P('The intercept is y at x = 0; changing x by one changes y by m.','x = 0 पर y अंतःखंड है; x को एक बढ़ाने पर y में m का परिवर्तन होता है।'),caveat:P('Bounded integer linear functions only, not a complete graphing curriculum.','केवल सीमित पूर्णांक रैखिक फलन; पूरा आलेख पाठ्यक्रम नहीं।'),fields:[N('m','Slope m','ढाल m',-3,3),N('b','Intercept b','अंतःखंड b',-3,3),N('x','Input x','आगत x',-5,5)],initial:{m:2,b:1,x:0}}}
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
  initial:{a:2,b:3,c:2,d:4},target:{a:4,b:5,c:6,d:3},extensions:{missing:{title:P('Find a missing symbolic mass','अज्ञात प्रतीकात्मक द्रव्यमान निकालें'),prompt:P('Choose two input masses and one proposed output mass. Find the remaining mass needed in an ideal closed system.','दो आगत द्रव्यमान और एक प्रस्तावित निर्गत द्रव्यमान चुनें। आदर्श बंद प्रणाली में शेष आवश्यक द्रव्यमान निकालें।'),hint:P('Subtract the known output from total inputs. A negative result means the proposed outputs cannot fit this model.','कुल आगत से ज्ञात निर्गत घटाएँ। ऋणात्मक परिणाम का अर्थ प्रस्तावित निर्गत इस मॉडल में संभव नहीं।'),caveat:P('Symbolic mass accounting only; not a reaction equation, real experiment or chemical recipe.','केवल प्रतीकात्मक द्रव्यमान गणना; रासायनिक समीकरण, वास्तविक प्रयोग या मिश्रण विधि नहीं।'),fields:[N('a','Input A (g)','आगत A (g)',1,6),N('b','Input B (g)','आगत B (g)',1,6),N('c','Known output (g)','ज्ञात निर्गत (g)',0,12)],initial:{a:3,b:4,c:2}}}
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
  fields:[N('mass','Mass','द्रव्यमान',1,5,1,'kg'),N('accel','Acceleration','त्वरण',0,5,1,'m/s²')],initial:{mass:1,accel:1},target:{mass:3,accel:2},extensions:{net:{title:P('Compare opposing forces','विपरीत बलों की तुलना'),prompt:P('Choose two opposing force magnitudes in an ideal one-dimensional model. Calculate signed net force.','आदर्श एक-विमीय मॉडल में दो विपरीत बलों के परिमाण चुनें। चिह्न सहित परिणामी बल निकालें।'),hint:P('Taking right as positive, net force is rightward magnitude minus leftward magnitude.','दाईं दिशा धनात्मक मानने पर परिणामी बल दाईं ओर का परिमाण घटा बाईं ओर का परिमाण है।'),caveat:P('Ideal force bookkeeping only. Zero net force does not necessarily mean an object is at rest. No real machinery experiment.','केवल आदर्श बल गणना। शून्य परिणामी बल का अर्थ वस्तु का स्थिर होना आवश्यक नहीं। असली मशीन प्रयोग नहीं।'),fields:[N('right','Rightward force (N)','दाईं ओर बल (N)',0,8),N('left','Leftward force (N)','बाईं ओर बल (N)',0,8)],initial:{right:4,left:2}}}
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
 },
 "counting":{subject:"maths",title:P("Compare two groups of counters","काउंटरों के दो समूहों की तुलना"),prompt:P("Make 4 counters in group A and 6 in group B. Which group has more?","समूह A में 4 और समूह B में 6 काउंटर रखें। किसमें अधिक हैं?"),hint:P("Count each group. Six is greater than four; the difference is two.","दोनों समूह गिनें। छह चार से अधिक है; अंतर दो है।"),caveat:P("Abstract counters only, not an assessment of a learner's ability.","केवल प्रतीकात्मक काउंटर; विद्यार्थी की क्षमता का आकलन नहीं।"),fields:[N("a","Group A","समूह A",0,9),N("b","Group B","समूह B",0,9)],initial:{"a":1,"b":2},target:{"a":4,"b":6}},
 "place-value":{subject:"maths",title:P("Build a two-digit number","दो अंकों की संख्या बनाएँ"),prompt:P("Choose 3 tens and 7 ones to build 37.","37 बनाने के लिए 3 दहाई और 7 इकाई चुनें।"),hint:P("A ten represents ten ones. Three tens and seven ones make 37.","एक दहाई दस इकाई होती है। तीन दहाई और सात इकाई से 37 बनता है।"),caveat:P("Base-ten whole number model; no negative or decimal place values.","दशाधारी पूर्ण संख्या मॉडल; ऋणात्मक या दशमलव स्थान नहीं।"),fields:[N("tens","Tens","दहाई",0,9),N("ones","Ones","इकाई",0,9)],initial:{"tens":1,"ones":1},target:{"tens":3,"ones":7}},
 "length-compare":{subject:"physics",title:P("Compare lengths from a common start","समान आरंभ से लंबाई की तुलना"),prompt:P("Make one bar 3 cm and the other 7 cm. Find the difference.","एक पट्टी 3 cm और दूसरी 7 cm करें। अंतर ज्ञात करें।"),hint:P("Compare lengths using the same unit and a common starting point.","समान इकाई और समान आरंभ बिंदु से लंबाई की तुलना करें।"),caveat:P("Diagram is symbolic and is not a calibrated ruler or actual measurement.","चित्र प्रतीकात्मक है; अंशांकित पैमाना या वास्तविक मापन नहीं।"),fields:[N("a","Length A","लंबाई A",1,10,1,"cm"),N("b","Length B","लंबाई B",1,10,1,"cm")],initial:{"a":2,"b":2},target:{"a":3,"b":7}},
 "shadow-ray":{subject:"physics",title:P("Explore a simple shadow diagram","सरल छाया चित्र समझें"),prompt:P("Select the opaque blocker to see a shadow in the ideal diagram.","आदर्श चित्र में छाया देखने के लिए अपारदर्शी अवरोध चुनें।"),hint:P("An opaque object blocks light along the pictured path.","अपारदर्शी वस्तु चित्रित मार्ग में प्रकाश रोकती है।"),caveat:P("Single-ray symbolic model, not actual shadow size or a light experiment. Never look at the Sun.","एक किरण का प्रतीकात्मक मॉडल; वास्तविक छाया का आकार या प्रकाश प्रयोग नहीं। सूर्य को सीधे न देखें।"),fields:[O("blocker","Blocker","अवरोध",[["none","No blocker","अवरोध नहीं"],["opaque","Opaque blocker","अपारदर्शी अवरोध"]])],initial:{"blocker":"none"},target:{"blocker":"opaque"}},
 "material-state":{subject:"chemistry",title:P("Match familiar solid and liquid examples","परिचित ठोस और द्रव उदाहरण मिलाएँ"),prompt:P("Choose liquid water in the example selector.","उदाहरण में द्रव जल चुनें।"),hint:P("The examples are ice as a solid and liquid water as a liquid.","उदाहरण में बर्फ ठोस और द्रव जल द्रव है।"),caveat:P("Only two specified states, no heating or handling. The diagram is not molecular geometry.","केवल दो निर्दिष्ट अवस्थाएँ, कोई गर्म करना या छूना नहीं। चित्र अणु-ज्यामिति नहीं।"),fields:[O("example","Example","उदाहरण",[["ice","Ice","बर्फ"],["water","Liquid water","द्रव जल"]])],initial:{"example":"ice"},target:{"example":"water"}},
 "material-objects":{subject:"chemistry",title:P("Match objects to their stated material","वस्तु को बताई गई सामग्री से मिलाएँ"),prompt:P("Choose the example explicitly described as a wooden block.","लकड़ी का बताया गया घन चुनें।"),hint:P("The example labels state the material; objects in real life may combine many materials.","उदाहरण के लेबल सामग्री बताते हैं; वास्तविक वस्तुएँ कई सामग्रियों से बन सकती हैं।"),caveat:P("Illustrative descriptions, not a material-identification test or physical handling.","केवल उदाहरणात्मक विवरण; सामग्री पहचान परीक्षण या वास्तविक वस्तु छूना नहीं।"),fields:[O("object","Example object","उदाहरण वस्तु",[["glass","Glass bead","काँच का मनका"],["wood","Wooden block","लकड़ी का घन"],["paper","Paper sheet","कागज़ का पन्ना"]])],initial:{"object":"glass"},target:{"object":"wood"}},
 "plant-parts":{subject:"biology",title:P("Explore parts of a simplified flowering plant","सरल फूलदार पौधे के भाग समझें"),prompt:P("Select the root in the labelled model.","नामांकित मॉडल में जड़ चुनें।"),hint:P("Roots commonly anchor a plant and absorb water and mineral nutrients.","जड़ें सामान्यतः पौधे को स्थिर रखती हैं और जल व खनिज पोषक तत्व ग्रहण करती हैं।"),caveat:P("Simplified flowering plant diagram; actual structures vary. No specimen collection.","फूलदार पौधे का सरल चित्र; असली संरचनाएँ भिन्न होती हैं। नमूना संग्रह नहीं।"),fields:[O("part","Plant part","पौधे का भाग",[["leaf","Leaf","पत्ती"],["root","Root","जड़"],["stem","Stem","तना"]])],initial:{"part":"leaf"},target:{"part":"root"}},
 "living-examples":{subject:"biology",title:P("Compare a living plant and a stone","जीवित पौधे और पत्थर की तुलना"),prompt:P("Choose the example of a living plant.","जीवित पौधे का उदाहरण चुनें।"),hint:P("A living plant is an organism; a stone is not an organism.","जीवित पौधा एक जीव है; पत्थर जीव नहीं है।"),caveat:P("Two explicit examples only. Not a universal test of life or a specimen activity.","केवल दो स्पष्ट उदाहरण। जीवन की सार्वभौमिक जाँच या नमूना गतिविधि नहीं।"),fields:[O("example","Example","उदाहरण",[["stone","Stone","पत्थर"],["plant","Living plant","जीवित पौधा"]])],initial:{"example":"stone"},target:{"example":"plant"}},
 "arithmetic-sequence":{subject:"maths",title:P("Arithmetic sequence explorer","समांतर श्रेणी खोज"),prompt:P("Set first term 2, common difference 3, and term number 5. Find the fifth term.","पहला पद 2, सार्व अंतर 3 और पद संख्या 5 रखें। पाँचवाँ पद ज्ञात करें।"),hint:P("The nth term is a + (n − 1)d. A constant difference adds the same amount at each step.","nवाँ पद a + (n − 1)d है। हर कदम पर समान अंतर जुड़ता है।"),caveat:P("Finite display of a simple arithmetic sequence, not a full sequences and series course.","सरल समांतर श्रेणी के सीमित पद; श्रेणी और श्रेढ़ी का पूरा पाठ नहीं।"),fields:[N("first","First term","पहला पद",1,5),N("diff","Common difference","सार्व अंतर",1,5),N("n","Term number","पद संख्या",1,6)],initial:{"first":1,"diff":1,"n":3},target:{"first":2,"diff":3,"n":5}},
 "square-slope":{subject:"maths",title:P("Secant and tangent slopes of x²","x² की छेदक और स्पर्शरेखा की ढाल"),prompt:P("Set x = 2 and step h = 1/2. Compare the secant slope with the tangent slope.","x = 2 और कदम h = 1/2 रखें। छेदक और स्पर्शरेखा की ढाल की तुलना करें।"),hint:P("For f(x)=x², the secant slope is 2x+h, and the derivative at x is 2x.","f(x)=x² में छेदक की ढाल 2x+h और x पर अवकलज 2x है।"),caveat:P("One polynomial example with positive steps only; not a proof of general differentiation.","केवल एक बहुपद उदाहरण और धनात्मक कदम; सामान्य अवकलन का प्रमाण नहीं।"),fields:[N("x","Base x","आधार x",-2,3),N("step","Step numerator (over 4)","कदम का अंश (हर 4)",1,4)],initial:{"x":1,"step":4},target:{"x":2,"step":2}},
 "constant-acceleration":{subject:"physics",title:P("Ideal constant acceleration from rest","विराम से आदर्श नियत त्वरण"),prompt:P("Set acceleration 2 m/s² and time 4 s. Compare final speed and displacement.","त्वरण 2 m/s² और समय 4 s रखें। अंतिम चाल और विस्थापन देखें।"),hint:P("Starting from rest with constant positive acceleration: v = at and s = at²/2.","विराम से नियत धनात्मक त्वरण: v = at और s = at²/2।"),caveat:P("Ideal one-dimensional motion from rest, not real vehicle or falling-body guidance.","विराम से आदर्श एक-विमीय गति; असली वाहन या गिरती वस्तु का निर्देश नहीं।"),fields:[N("accel","Acceleration","त्वरण",0,5,1,"m/s²"),N("seconds","Time","समय",1,5,1,"s")],initial:{"accel":1,"seconds":1},target:{"accel":2,"seconds":4}},
 "thin-lens":{subject:"physics",title:P("Ideal converging thin-lens calculation","आदर्श अभिसारी पतले लेंस की गणना"),prompt:P("Choose focal length 5 cm and object distance 10 cm. Compare image distance and magnification magnitude.","फोकस दूरी 5 cm और वस्तु दूरी 10 cm चुनें। प्रतिबिंब दूरी और आवर्धन का परिमाण देखें।"),hint:P("For a real object outside the focus, positive distance magnitudes satisfy 1/f=1/u+1/v, so v=fu/(u−f). The real image is inverted.","फोकस के बाहर वास्तविक वस्तु के लिए धनात्मक दूरी परिमाण 1/f=1/u+1/v, इसलिए v=fu/(u−f)। वास्तविक प्रतिबिंब उलटा होता है।"),caveat:P("Ideal thin lens, object beyond focus only; no instrument assembly, sunlight or actual optical experiment.","आदर्श पतला लेंस, वस्तु फोकस के बाहर; यंत्र निर्माण, सूर्य प्रकाश या वास्तविक प्रयोग नहीं।"),fields:[N("f","Focal length","फोकस दूरी",2,5,1,"cm"),N("multiple","Object distance in focal-length multiples","फोकस दूरी के गुणक",2,5)],initial:{"f":3,"multiple":3},target:{"f":5,"multiple":2}},
 "ion-charge":{subject:"chemistry",title:P("Symbolic proton and electron charge","प्रोटॉन और इलेक्ट्रॉन का प्रतीकात्मक आवेश"),prompt:P("Choose 11 protons and 10 electrons. Find the net charge in elementary-charge units.","11 प्रोटॉन और 10 इलेक्ट्रॉन चुनें। मूल आवेश इकाई में कुल आवेश ज्ञात करें।"),hint:P("In this symbolic count model, protons contribute +1 each and electrons −1 each.","इस प्रतीकात्मक गिनती में हर प्रोटॉन +1 और हर इलेक्ट्रॉन −1 देता है।"),caveat:P("Charge arithmetic only, not a claim that every proton/electron combination is a stable atom or ion.","केवल आवेश गणना; हर संयोजन स्थिर परमाणु या आयन होने का दावा नहीं।"),fields:[N("protons","Protons","प्रोटॉन",1,12),N("electrons","Electrons","इलेक्ट्रॉन",1,12)],initial:{"protons":4,"electrons":4},target:{"protons":11,"electrons":10}},
 "mass-fraction":{subject:"chemistry",title:P("Symbolic mass fraction and percentage","प्रतीकात्मक द्रव्यमान अंश और प्रतिशत"),prompt:P("Set component A to 2 units and component B to 8 units. Find the mass percentage of A.","घटक A को 2 इकाई और B को 8 इकाई रखें। A का द्रव्यमान प्रतिशत ज्ञात करें।"),hint:P("Divide component A mass by total mass and multiply by 100 for percent.","घटक A के द्रव्यमान को कुल द्रव्यमान से भाग दें और प्रतिशत के लिए 100 से गुणा करें।"),caveat:P("Abstract two-component accounting; no actual chemicals, mixing, concentration recipe or experiment.","दो काल्पनिक घटकों की गणना; वास्तविक रसायन, मिश्रण, सांद्रण विधि या प्रयोग नहीं।"),fields:[N("a","Component A mass units","घटक A द्रव्यमान इकाई",1,9),N("b","Component B mass units","घटक B द्रव्यमान इकाई",1,9)],initial:{"a":1,"b":1},target:{"a":2,"b":8}},
 "cell-doubling":{subject:"biology",title:P("Idealised cell-number doubling","आदर्श कोशिका संख्या का दुगुना होना"),prompt:P("Start with 2 symbolic cells and choose 3 doubling rounds. Count the final cells.","2 प्रतीकात्मक कोशिकाओं से शुरू करें और 3 दुगुना चरण चुनें। अंतिम कोशिकाएँ गिनें।"),hint:P("If every cell divides into two in every round and none are lost, multiply the starting count by 2 for each round.","यदि हर चरण में हर कोशिका दो में बँटे और कोई नष्ट न हो, तो हर चरण पर आरंभिक संख्या दुगुनी होती है।"),caveat:P("Idealised counting model, not real cell growth kinetics, disease prediction or culturing instructions.","आदर्श गिनती मॉडल; वास्तविक कोशिका वृद्धि दर, रोग पूर्वानुमान या संवर्धन निर्देश नहीं।"),fields:[N("start","Starting cells","आरंभिक कोशिकाएँ",1,3),N("rounds","Doubling rounds","दुगुना चरण",0,3)],initial:{"start":1,"rounds":1},target:{"start":2,"rounds":3},extensions:{rounds:{title:P('Compare two symbolic cell counts','दो प्रतीकात्मक कोशिका संख्याएँ मिलाएँ'),prompt:P('Choose a starting count and two round counts. Compare the ideal doubling totals.','आरंभिक संख्या और दो चरण संख्याएँ चुनें। आदर्श दुगुने होने के कुल मिलाएँ।'),hint:P('If all cells divide into two each round and none are lost, count = start × 2 raised to the number of rounds.','यदि हर चरण में सभी कोशिकाएँ दो में बँटें और कोई नष्ट न हो, तो संख्या = आरंभिक संख्या × 2 की चरण संख्या घात।'),caveat:P('Symbolic counting only. Not real cell growth, disease prediction or culturing instructions.','केवल प्रतीकात्मक गिनती। वास्तविक कोशिका वृद्धि, रोग पूर्वानुमान या संवर्धन निर्देश नहीं।'),fields:[N('start','Starting count','आरंभिक संख्या',1,4),N('a','Round count A','चरण संख्या A',0,5),N('b','Round count B','चरण संख्या B',0,5)],initial:{start:2,a:1,b:3}}}},
 "plant-process":{subject:"biology",title:P("Compare photosynthesis and cellular respiration","प्रकाश संश्लेषण और कोशिकीय श्वसन की तुलना"),prompt:P("Select photosynthesis to inspect a simplified net input/output diagram.","सरल कुल आगत/निर्गत चित्र देखने के लिए प्रकाश संश्लेषण चुनें।"),hint:P("Photosynthesis stores energy using light; aerobic cellular respiration releases usable energy from organic molecules. Plants do both.","प्रकाश संश्लेषण प्रकाश से ऊर्जा संचित करता है; वायवीय कोशिकीय श्वसन कार्बनिक अणुओं से उपयोगी ऊर्जा मुक्त करता है। पौधे दोनों करते हैं।"),caveat:P("Simplified net-process descriptions, not biochemical pathways, real experiments or health advice.","सरल कुल प्रक्रिया विवरण; जैव-रासायनिक मार्ग, वास्तविक प्रयोग या स्वास्थ्य सलाह नहीं।"),fields:[O("process","Process","प्रक्रिया",[["respiration","Aerobic cellular respiration","वायवीय कोशिकीय श्वसन"],["photosynthesis","Photosynthesis","प्रकाश संश्लेषण"]])],initial:{"process":"respiration"},target:{"process":"photosynthesis"}},
 "triangle-area":{subject:"maths",title:P("Triangle area explorer","त्रिभुज क्षेत्रफल खोज"),prompt:P("Choose base 6 units and perpendicular height 4 units. Find the area.","आधार 6 इकाई और लंबवत ऊँचाई 4 इकाई चुनें। क्षेत्रफल ज्ञात करें।"),hint:P("Triangle area is half the base times the perpendicular height.","त्रिभुज का क्षेत्रफल आधार और लंबवत ऊँचाई के गुणनफल का आधा है।"),caveat:P("Only perpendicular height is used; diagram is an ideal geometric example, not physical measurement.","केवल लंबवत ऊँचाई का उपयोग; चित्र आदर्श ज्यामितीय उदाहरण है, वास्तविक मापन नहीं।"),fields:[N("base","Base","आधार",1,8),N("height","Perpendicular height","लंबवत ऊँचाई",1,6)],initial:{"base":2,"height":2},target:{"base":6,"height":4}},
 "right-triangle-ratio":{subject:"maths",title:P("Right triangle side ratios","समकोण त्रिभुज की भुजाओं के अनुपात"),prompt:P("Choose the 3-4-5 triangle. Compare sine and cosine for the angle opposite the first leg.","3-4-5 त्रिभुज चुनें। पहली लंब भुजा के सामने वाले कोण के लिए ज्या और कोज्या मिलाएँ।"),hint:P("For that acute angle, sine is opposite divided by hypotenuse and cosine is adjacent divided by hypotenuse.","उस न्यून कोण के लिए ज्या = सामने की भुजा ÷ कर्ण और कोज्या = पास की भुजा ÷ कर्ण।"),caveat:P("Only two fixed right-triangle examples; no general trigonometry or angle measurement.","केवल दो निश्चित समकोण त्रिभुज उदाहरण; सामान्य त्रिकोणमिति या कोण मापन नहीं।"),fields:[O("triangle","Right triangle","समकोण त्रिभुज",[["5-12-13","5-12-13","5-12-13"],["3-4-5","3-4-5","3-4-5"]])],initial:{"triangle":"5-12-13"},target:{"triangle":"3-4-5"}},
 "position-change":{subject:"physics",title:P("Move a marker along a line","रेखा पर चिह्न चलाएँ"),prompt:P("Start at 2 and end at 5 on the imaginary line. Compare the positions.","काल्पनिक रेखा पर 2 से शुरू करके 5 पर पहुँचें। स्थितियों की तुलना करें।"),hint:P("A change in position is the ending position minus the starting position.","स्थिति का परिवर्तन अंतिम स्थिति में से आरंभिक स्थिति घटाने पर मिलता है।"),caveat:P("Symbolic straight line only, not actual motion, speed or a route instruction.","केवल प्रतीकात्मक सीधी रेखा; वास्तविक गति, चाल या मार्ग का निर्देश नहीं।"),fields:[N("start","Starting position","आरंभिक स्थिति",0,8),N("end","Ending position","अंतिम स्थिति",0,8)],initial:{"start":1,"end":1},target:{"start":2,"end":5}},
 "path-distance":{subject:"physics",title:P("Distance along a two-leg path","दो भागों वाले मार्ग की दूरी"),prompt:P("Choose 5 units outward and 2 units back. Compare distance and change in position.","5 इकाई आगे और 2 इकाई वापस चुनें। दूरी और स्थिति परिवर्तन मिलाएँ।"),hint:P("Distance is the sum of both path lengths; signed change in position is outward minus return length.","दूरी दोनों मार्ग लंबाइयों का योग है; चिह्न सहित स्थिति परिवर्तन आगे की लंबाई में से वापसी घटाकर मिलता है।"),caveat:P("Imaginary one-dimensional path, not navigation or an actual movement exercise.","काल्पनिक एक-विमीय मार्ग; नेविगेशन या वास्तविक गति का अभ्यास नहीं।"),fields:[N("out","Outward length","आगे की लंबाई",1,6),N("back","Return length","वापसी की लंबाई",0,6)],initial:{"out":2,"back":1},target:{"out":5,"back":2}},
 "material-property":{subject:"chemistry",title:P("Compare stated material properties","बताए गए सामग्री गुणों की तुलना"),prompt:P("Select the explicitly transparent glass example.","स्पष्ट रूप से पारदर्शी बताया गया काँच का उदाहरण चुनें।"),hint:P("Transparent materials let light through so objects can be seen clearly; opaque examples block the view.","पारदर्शी सामग्री से प्रकाश गुजरता है और वस्तुएँ साफ़ दिख सकती हैं; अपारदर्शी उदाहरण दृश्य रोकते हैं।"),caveat:P("Only two labelled examples, not a material test or physical handling instruction.","केवल दो नामांकित उदाहरण; सामग्री परीक्षण या वास्तविक वस्तु छूने का निर्देश नहीं।"),fields:[O("example","Labelled example","नामांकित उदाहरण",[["wood","Opaque wooden board","अपारदर्शी लकड़ी का पटरा"],["glass","Transparent clear glass","पारदर्शी साफ़ काँच"]])],initial:{"example":"wood"},target:{"example":"glass"}},
 "dynamic-balance":{subject:"chemistry",title:P("Symbolic forward and reverse rate balance","प्रतीकात्मक अग्र और पश्च दर संतुलन"),prompt:P("Set the forward and reverse event rates both to 4 per model step.","अग्र और पश्च घटना दर दोनों को प्रति मॉडल चरण 4 रखें।"),hint:P("When forward and reverse rates are equal and nonzero, the net change is zero; events can still occur in both directions.","जब अग्र और पश्च दर समान और शून्य से अधिक हों, कुल परिवर्तन शून्य है; दोनों दिशाओं में घटनाएँ चल सकती हैं।"),caveat:P("Abstract rate comparison only, not equilibrium constants, reaction kinetics, actual chemicals or reaction instructions.","केवल काल्पनिक दर तुलना; साम्य स्थिरांक, अभिक्रिया गतिकी, वास्तविक रसायन या अभिक्रिया निर्देश नहीं।"),fields:[N("forward","Forward events per step","प्रति चरण अग्र घटनाएँ",1,6),N("reverse","Reverse events per step","प्रति चरण पश्च घटनाएँ",1,6)],initial:{"forward":2,"reverse":1},target:{"forward":4,"reverse":4}},
 "habitat-match":{subject:"biology",title:P("Recognise two example habitats","दो उदाहरण आवास पहचानें"),prompt:P("Select the pictured freshwater pond fish example.","चित्रित मीठे पानी के तालाब की मछली का उदाहरण चुनें।"),hint:P("A freshwater pond is an example habitat for some fish. A desert is a habitat for many different organisms.","मीठे पानी का तालाब कुछ मछलियों का उदाहरण आवास है। मरुस्थल कई अलग जीवों का आवास है।"),caveat:P("Two simplified habitat examples, not a rule for all species or advice to collect animals.","दो सरल आवास उदाहरण; सभी प्रजातियों का नियम या जानवर इकट्ठा करने की सलाह नहीं।"),fields:[O("animal","Example animal","उदाहरण जानवर",[["camel","Dromedary camel","एक कूबड़ वाला ऊँट"],["fish","Freshwater pond fish","मीठे पानी के तालाब की मछली"]])],initial:{"animal":"camel"},target:{"animal":"fish"}},
 "food-web-links":{subject:"biology",title:P("Explore a small symbolic food web","छोटा प्रतीकात्मक खाद्य जाल समझें"),prompt:P("Select the grass to grasshopper feeding link.","घास से टिड्डे की खाद्य कड़ी चुनें।"),hint:P("Arrows show a direction of food-energy transfer from the food organism to the consumer.","तीर खाद्य जीव से उपभोक्ता की ओर खाद्य ऊर्जा हस्तांतरण की दिशा दिखाते हैं।"),caveat:P("A small illustrative web; not a complete ecosystem, prediction or animal-handling activity.","छोटा उदाहरणात्मक जाल; पूरा पारितंत्र, पूर्वानुमान या जानवर छूने की गतिविधि नहीं।"),fields:[O("link","Feeding link","खाद्य कड़ी",[["grass-rabbit","Grass → rabbit","घास → खरगोश"],["grass-insect","Grass → grasshopper","घास → टिड्डा"],["insect-frog","Grasshopper → frog","टिड्डा → मेंढक"]])],initial:{"link":"grass-rabbit"},target:{"link":"grass-insect"}},
 "integral-area":{subject:"maths",title:P("Area under a linear graph","रैखिक आलेख के नीचे क्षेत्रफल"),prompt:P("Set slope 2 and upper bound 3. Find the area under y=2x from 0 to 3.","ढाल 2 और ऊपरी सीमा 3 रखें। 0 से 3 तक y=2x के नीचे का क्षेत्रफल ज्ञात करें।"),hint:P("For y=ax on [0,b] with positive a and b, the integral is the triangle area ab²/2.","धनात्मक a और b के लिए [0,b] पर y=ax का समाकल त्रिभुज का क्षेत्रफल ab²/2 है।"),caveat:P("Only one nonnegative linear function; not a general integration method or proof.","केवल एक गैर-ऋणात्मक रैखिक फलन; सामान्य समाकलन विधि या प्रमाण नहीं।"),fields:[N("slope","Slope a","ढाल a",1,4),N("bound","Upper bound b","ऊपरी सीमा b",1,5)],initial:{"slope":1,"bound":1},target:{"slope":2,"bound":3}},
 "vector-components":{subject:"maths",title:P("Magnitude of a two-dimensional vector","द्विविमीय सदिश का परिमाण"),prompt:P("Set components x=3 and y=4. Calculate the magnitude.","घटक x=3 और y=4 रखें। परिमाण ज्ञात करें।"),hint:P("Perpendicular components give magnitude √(x²+y²), regardless of component signs.","लंबवत घटकों से परिमाण √(x²+y²) मिलता है, चाहे घटकों के चिह्न कुछ भी हों।"),caveat:P("Only Cartesian two-dimensional vectors; not a complete vector algebra course.","केवल कार्तीय द्विविमीय सदिश; सदिश बीजगणित का पूरा पाठ नहीं।"),fields:[N("x","Horizontal component","क्षैतिज घटक",-5,5),N("y","Vertical component","ऊर्ध्वाधर घटक",-5,5)],initial:{"x":1,"y":1},target:{"x":3,"y":4}},
 "magnetic-flux":{subject:"physics",title:P("Ideal magnetic flux through a surface","सतह से आदर्श चुंबकीय फ्लक्स"),prompt:P("Set symbolic field 2, area 3 and normal parallel to the field. Find flux.","प्रतीकात्मक क्षेत्र 2, क्षेत्रफल 3 और अभिलंब को क्षेत्र के समानांतर रखें। फ्लक्स ज्ञात करें।"),hint:P("For a uniform field, flux is BA cos θ; θ is the angle between field and surface normal.","एकसमान क्षेत्र में फ्लक्स BA cos θ है; θ क्षेत्र और सतह के अभिलंब के बीच का कोण है।"),caveat:P("Symbolic uniform field and two fixed orientations only; no real magnets, electrical apparatus or measurements.","केवल प्रतीकात्मक एकसमान क्षेत्र और दो निश्चित दिशाएँ; असली चुंबक, बिजली उपकरण या मापन नहीं।"),fields:[N("field","Field magnitude (symbolic)","क्षेत्र परिमाण (प्रतीकात्मक)",1,5),N("area","Area (symbolic)","क्षेत्रफल (प्रतीकात्मक)",1,5),O("orientation","Normal relative to field","क्षेत्र के सापेक्ष अभिलंब",[["perpendicular","Perpendicular","लंबवत"],["parallel","Parallel","समानांतर"]])],initial:{"field":1,"area":1,"orientation":"perpendicular"},target:{"field":2,"area":3,"orientation":"parallel"}},
 "capacitor-charge":{subject:"physics",title:P("Ideal capacitor charge relationship","आदर्श संधारित्र आवेश संबंध"),prompt:P("Set symbolic capacitance 3 and voltage 4. Compare charge units.","प्रतीकात्मक धारिता 3 और वोल्टता 4 रखें। आवेश इकाइयाँ मिलाएँ।"),hint:P("For an ideal linear capacitor, Q=CV. Doubling C at fixed V doubles Q.","आदर्श रैखिक संधारित्र में Q=CV है। स्थिर V पर C दुगुना करने से Q दुगुना होता है।"),caveat:P("Abstract numerical relationship only; no real voltages, stored energy handling, components or wiring instructions.","केवल काल्पनिक संख्यात्मक संबंध; वास्तविक वोल्टता, संचित ऊर्जा, उपकरण या तार जोड़ने के निर्देश नहीं।"),fields:[N("cap","Capacitance (symbolic units)","धारिता (प्रतीकात्मक इकाई)",1,5),N("volt","Voltage (symbolic units)","वोल्टता (प्रतीकात्मक इकाई)",0,5)],initial:{"cap":1,"volt":1},target:{"cap":3,"volt":4}},
 "alkane-count":{subject:"chemistry",title:P("Symbolic alkane formula patterns","प्रतीकात्मक ऐल्केन सूत्र पैटर्न"),prompt:P("Choose three carbon atoms in an acyclic saturated alkane formula. Count hydrogen atoms.","खुली शृंखला वाले संतृप्त ऐल्केन सूत्र में तीन कार्बन परमाणु चुनें। हाइड्रोजन परमाणु गिनें।"),hint:P("Acyclic saturated alkanes have formula CₙH₂ₙ₊₂; for n=3, the formula is C₃H₈.","खुली शृंखला वाले संतृप्त ऐल्केन का सूत्र CₙH₂ₙ₊₂ है; n=3 पर सूत्र C₃H₈ है।"),caveat:P("Symbolic formula counting only; no synthesis, reaction, fuel use or molecular geometry claim.","केवल प्रतीकात्मक सूत्र गिनती; संश्लेषण, अभिक्रिया, ईंधन प्रयोग या आणविक ज्यामिति का दावा नहीं।"),fields:[N("carbon","Carbon count n","कार्बन संख्या n",1,6)],initial:{"carbon":1},target:{"carbon":3}},
 "bond-pair-count":{subject:"chemistry",title:P("Symbolic shared electron-pair counting","प्रतीकात्मक साझा इलेक्ट्रॉन युग्म गिनती"),prompt:P("Choose a double bond symbol. Count shared electron pairs and electrons.","द्वि-बंध प्रतीक चुनें। साझा इलेक्ट्रॉन युग्म और इलेक्ट्रॉन गिनें।"),hint:P("In a simple Lewis bond depiction, a single, double or triple bond represents one, two or three shared electron pairs.","सरल लुईस बंध चित्र में एकल, द्वि या त्रि-बंध क्रमशः एक, दो या तीन साझा इलेक्ट्रॉन युग्म दिखाता है।"),caveat:P("Symbolic Lewis bond depiction only; no molecule stability, orbital theory or chemical procedure.","केवल प्रतीकात्मक लुईस बंध चित्र; अणु स्थिरता, कक्षक सिद्धांत या रासायनिक विधि नहीं।"),fields:[N("pairs","Shared pairs","साझा युग्म",1,3)],initial:{"pairs":1},target:{"pairs":2}},
 "dna-complement":{subject:"biology",title:P("Complementary DNA base symbols","पूरक डीएनए क्षार प्रतीक"),prompt:P("Select the DNA base C. Identify its complementary base.","डीएनए क्षार C चुनें। उसका पूरक क्षार पहचानें।"),hint:P("In standard DNA base pairing, A pairs with T and C pairs with G.","मानक डीएनए क्षार युग्मन में A के साथ T और C के साथ G जुड़ता है।"),caveat:P("One symbolic base pair only; no gene sequence, genetic profiling, health inference or laboratory method.","केवल एक प्रतीकात्मक क्षार युग्म; जीन अनुक्रम, आनुवंशिक प्रोफाइलिंग, स्वास्थ्य अनुमान या प्रयोगशाला विधि नहीं।"),fields:[O("base","DNA base symbol","डीएनए क्षार प्रतीक",[["A","A","A"],["T","T","T"],["C","C","C"],["G","G","G"]])],initial:{"base":"A"},target:{"base":"C"}},
 "gas-exchange":{subject:"biology",title:P("Direction of gas exchange in an ideal lung diagram","आदर्श फेफड़े के चित्र में गैस विनिमय की दिशा"),prompt:P("Choose oxygen to view its usual net transfer direction in the simplified lung diagram.","सरल फेफड़े के चित्र में सामान्य कुल स्थानांतरण दिशा देखने के लिए ऑक्सीजन चुनें।"),hint:P("In normal lung gas exchange, oxygen moves from alveolar air to blood; carbon dioxide moves from blood to alveolar air.","सामान्य फेफड़े के गैस विनिमय में ऑक्सीजन वायुकोष की हवा से रक्त में और कार्बन डाइऑक्साइड रक्त से वायुकोष की हवा में जाती है।"),caveat:P("Idealised direction-only diagram, not a health assessment, treatment or breathing exercise.","केवल आदर्श दिशा चित्र; स्वास्थ्य आकलन, उपचार या साँस का अभ्यास नहीं।"),fields:[O("gas","Gas","गैस",[["co2","Carbon dioxide","कार्बन डाइऑक्साइड"],["o2","Oxygen","ऑक्सीजन"]])],initial:{"gas":"co2"},target:{"gas":"o2"}}
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
  case 'integral-area':return {slopeA:state.slope,boundB:state.bound,endpointY:state.slope*state.bound,integralArea:state.slope*state.bound**2/2};
  case 'vector-components':return {x:state.x,y:state.y,vectorMagnitude:Math.hypot(state.x,state.y)};
  case 'magnetic-flux':return {fieldMagnitude:state.field,surfaceArea:state.area,normalAngle:state.orientation==='parallel'?0:90,fluxUnits:state.orientation==='parallel'?state.field*state.area:0};
  case 'capacitor-charge':return {capacitanceUnits:state.cap,voltageUnits:state.volt,chargeUnits:state.cap*state.volt};
  case 'alkane-count':return {carbonCount:state.carbon,hydrogenCount:2*state.carbon+2,alkaneFormula:'C'+state.carbon+'H'+(2*state.carbon+2)};
  case 'bond-pair-count':return {sharedPairs:state.pairs,sharedElectrons:state.pairs*2};
  case 'dna-complement':return {dnaBase:state.base,complementBase:{A:'T',T:'A',C:'G',G:'C'}[state.base]};
  case 'gas-exchange':return {gas:state.gas==='o2'?'oxygen gas':'carbon dioxide gas',transferDirection:state.gas==='o2'?'alveolar air to blood':'blood to alveolar air'};
  case 'triangle-area':return {base:state.base,height:state.height,areaUnits:state.base*state.height/2};
  case 'right-triangle-ratio':{const [opposite,adjacent,hypotenuse]=state.triangle.split('-').map(Number);return {opposite,adjacent,hypotenuse,sine:opposite/hypotenuse,cosine:adjacent/hypotenuse};}
  case 'position-change':return {startPosition:state.start,endPosition:state.end,signedChange:state.end-state.start};
  case 'path-distance':return {outward:state.out,returnLength:state.back,pathLength:state.out+state.back,signedChange:state.out-state.back};
  case 'material-property':return {transparent:state.example==='glass'};
  case 'dynamic-balance':return {forwardRate:state.forward,reverseRate:state.reverse,netRate:state.forward-state.reverse,equalRates:state.forward===state.reverse};
  case 'habitat-match':return {habitat:state.animal==='fish'?'freshwater pond example':'arid habitat example'};
  case 'food-web-links':return {foodLink:state.link};
  case 'arithmetic-sequence':return {firstTerm:state.first,commonDifference:state.diff,termNumber:state.n,nthTerm:state.first+(state.n-1)*state.diff};
  case 'square-slope':return {x:state.x,h:state.step/4,secantSlope:2*state.x+state.step/4,tangentSlope:2*state.x};
  case 'constant-acceleration':return {acceleration:state.accel,timeS:state.seconds,finalSpeed:state.accel*state.seconds,displacement:state.accel*state.seconds**2/2};
  case 'thin-lens':{const u=state.f*state.multiple,v=state.f*u/(u-state.f);return {focalCm:state.f,objectCm:u,imageCm:v,magnitude:v/u,inverted:true};}
  case 'ion-charge':return {protons:state.protons,electrons:state.electrons,netCharge:state.protons-state.electrons};
  case 'mass-fraction':return {componentA:state.a,componentB:state.b,componentTotal:state.a+state.b,massPercent:100*state.a/(state.a+state.b)};
  case 'cell-doubling':return {startingCells:state.start,rounds:state.rounds,finalCells:state.start*2**state.rounds};
  case 'plant-process':return state.process==='photosynthesis'?{inputs:'carbon dioxide and water with light energy',outputs:'organic matter and oxygen'}:{inputs:'organic matter and oxygen',outputs:'carbon dioxide and water; usable energy released'};
  case 'counting':return {groupA:state.a,groupB:state.b,absoluteDifference:Math.abs(state.a-state.b),comparison:state.a===state.b?'equal':state.a>state.b?'A greater':'B greater'};
  case 'place-value':return {tens:state.tens,ones:state.ones,total:state.tens*10+state.ones};
  case 'length-compare':return {lengthA:state.a,lengthB:state.b,lengthDifference:Math.abs(state.a-state.b)};
  case 'shadow-ray':return {blocked:state.blocker==='opaque',shadow:state.blocker==='opaque'};
  case 'material-state':return {materialState:state.example==='ice'?'solid':'liquid'};
  case 'material-objects':return {material:{glass:'glass',wood:'wood',paper:'paper'}[state.object]};
  case 'plant-parts':return {plantFunction:{leaf:'photosynthesis example',root:'anchorage and absorption',stem:'support and transport'}[state.part]};
  case 'living-examples':return {organism:state.example==='plant'};
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
 slopeA:P('Slope a','ढाल a'),boundB:P('Upper bound b','ऊपरी सीमा b'),endpointY:P('Endpoint y','अंतिम y'),integralArea:P('Integral (area units)','समाकल (क्षेत्रफल इकाई)'),vectorMagnitude:P('Vector magnitude','सदिश परिमाण'),fieldMagnitude:P('Field (symbolic units)','क्षेत्र (प्रतीकात्मक इकाई)'),surfaceArea:P('Surface area (symbolic units)','सतह क्षेत्रफल (प्रतीकात्मक इकाई)'),normalAngle:P('Angle to normal (°)','अभिलंब से कोण (°)'),fluxUnits:P('Flux (symbolic units)','फ्लक्स (प्रतीकात्मक इकाई)'),capacitanceUnits:P('Capacitance (symbolic units)','धारिता (प्रतीकात्मक इकाई)'),voltageUnits:P('Voltage (symbolic units)','वोल्टता (प्रतीकात्मक इकाई)'),chargeUnits:P('Charge (symbolic units)','आवेश (प्रतीकात्मक इकाई)'),carbonCount:P('Carbon atoms','कार्बन परमाणु'),hydrogenCount:P('Hydrogen atoms','हाइड्रोजन परमाणु'),alkaneFormula:P('Symbolic formula','प्रतीकात्मक सूत्र'),sharedPairs:P('Shared electron pairs','साझा इलेक्ट्रॉन युग्म'),sharedElectrons:P('Shared electrons','साझा इलेक्ट्रॉन'),dnaBase:P('DNA base','डीएनए क्षार'),complementBase:P('Complementary base','पूरक क्षार'),gas:P('Gas','गैस'),transferDirection:P('Net transfer direction','कुल स्थानांतरण दिशा'),
 base:P('Base (units)','आधार (इकाई)'),height:P('Perpendicular height (units)','लंबवत ऊँचाई (इकाई)'),areaUnits:P('Area (square units)','क्षेत्रफल (वर्ग इकाई)'),opposite:P('Opposite leg','सामने की भुजा'),adjacent:P('Adjacent leg','पास की भुजा'),hypotenuse:P('Hypotenuse','कर्ण'),sine:P('Sine','ज्या'),cosine:P('Cosine','कोज्या'),startPosition:P('Start position','आरंभिक स्थिति'),endPosition:P('End position','अंतिम स्थिति'),signedChange:P('Signed change in position','चिह्न सहित स्थिति परिवर्तन'),outward:P('Outward length','आगे की लंबाई'),returnLength:P('Return length','वापसी की लंबाई'),pathLength:P('Total path distance','कुल मार्ग दूरी'),transparent:P('Transparent example','पारदर्शी उदाहरण'),forwardRate:P('Forward events per step','प्रति चरण अग्र घटनाएँ'),reverseRate:P('Reverse events per step','प्रति चरण पश्च घटनाएँ'),netRate:P('Net forward events per step','प्रति चरण कुल अग्र घटनाएँ'),equalRates:P('Equal nonzero rates','समान गैर-शून्य दर'),habitat:P('Example habitat','उदाहरण आवास'),foodLink:P('Food-energy transfer link','खाद्य ऊर्जा हस्तांतरण कड़ी'),
 componentA:P('Component A mass units','घटक A द्रव्यमान इकाई'),componentB:P('Component B mass units','घटक B द्रव्यमान इकाई'),
 firstTerm:P('First term','पहला पद'),commonDifference:P('Common difference','सार्व अंतर'),termNumber:P('Term number','पद संख्या'),nthTerm:P('Selected term','चुना पद'),h:P('Step h','कदम h'),secantSlope:P('Secant slope','छेदक की ढाल'),tangentSlope:P('Tangent slope','स्पर्शरेखा की ढाल'),timeS:P('Time (s)','समय (s)'),finalSpeed:P('Final speed (m/s)','अंतिम चाल (m/s)'),displacement:P('Displacement (m)','विस्थापन (m)'),focalCm:P('Focal length (cm)','फोकस दूरी (cm)'),objectCm:P('Object distance (cm)','वस्तु दूरी (cm)'),imageCm:P('Image distance (cm)','प्रतिबिंब दूरी (cm)'),magnitude:P('Magnification magnitude','आवर्धन परिमाण'),inverted:P('Image inverted','उलटा प्रतिबिंब'),protons:P('Protons','प्रोटॉन'),electrons:P('Electrons','इलेक्ट्रॉन'),netCharge:P('Net charge (e units)','कुल आवेश (e इकाई)'),componentTotal:P('Total mass units','कुल द्रव्यमान इकाई'),massPercent:P('A mass percent (%)','A द्रव्यमान प्रतिशत (%)'),startingCells:P('Starting cells','आरंभिक कोशिकाएँ'),rounds:P('Doubling rounds','दुगुना चरण'),finalCells:P('Final cells','अंतिम कोशिकाएँ'),inputs:P('Simplified inputs','सरल आगत'),outputs:P('Simplified outputs','सरल निर्गत'),
 groupA:P('Group A','समूह A'),groupB:P('Group B','समूह B'),absoluteDifference:P('Difference','अंतर'),comparison:P('Comparison','तुलना'),tens:P('Tens','दहाई'),ones:P('Ones','इकाई'),lengthA:P('Length A (cm)','लंबाई A (cm)'),lengthB:P('Length B (cm)','लंबाई B (cm)'),lengthDifference:P('Difference (cm)','अंतर (cm)'),blocked:P('Light path blocked','प्रकाश मार्ग रुका'),shadow:P('Shadow in model','मॉडल में छाया'),materialState:P('State','अवस्था'),material:P('Material','सामग्री'),plantFunction:P('Example function','उदाहरण कार्य'),organism:P('Living organism','जीवित जीव'),
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
const VALUE_LABELS={'oxygen gas':P('Oxygen','ऑक्सीजन'),'carbon dioxide gas':P('Carbon dioxide','कार्बन डाइऑक्साइड'),'alveolar air to blood':P('Alveolar air → blood','वायुकोष की हवा → रक्त'),'blood to alveolar air':P('Blood → alveolar air','रक्त → वायुकोष की हवा'),'freshwater pond example':P('Freshwater pond example','मीठे पानी के तालाब का उदाहरण'),'arid habitat example':P('Arid habitat example','शुष्क आवास का उदाहरण'),'grass-rabbit':P('Grass → rabbit','घास → खरगोश'),'grass-insect':P('Grass → grasshopper','घास → टिड्डा'),'insect-frog':P('Grasshopper → frog','टिड्डा → मेंढक'),'carbon dioxide and water with light energy':P('Carbon dioxide and water with light energy','प्रकाश ऊर्जा के साथ कार्बन डाइऑक्साइड और जल'),'organic matter and oxygen':P('Organic matter and oxygen','कार्बनिक पदार्थ और ऑक्सीजन'),'carbon dioxide and water; usable energy released':P('Carbon dioxide and water; usable energy released','कार्बन डाइऑक्साइड और जल; उपयोगी ऊर्जा मुक्त'),equal:P('Equal','बराबर'),'A greater':P('A is greater','A अधिक है'),'B greater':P('B is greater','B अधिक है'),solid:P('Solid','ठोस'),liquid:P('Liquid','द्रव'),glass:P('Glass','काँच'),wood:P('Wood','लकड़ी'),paper:P('Paper','कागज़'),'photosynthesis example':P('Photosynthesis example','प्रकाश संश्लेषण उदाहरण'),'anchorage and absorption':P('Anchorage and absorption','स्थिरता और अवशोषण'),'support and transport':P('Support and transport','सहारा और परिवहन'),'Illustrative food web':P('Grass → grasshopper → frog; grass → mouse → snake; frog → snake. Real webs vary.','घास → टिड्डा → मेंढक; घास → चूहा → साँप; मेंढक → साँप। वास्तविक खाद्य-जाल अलग होते हैं।'),attract:P('Attract','आकर्षण'),repel:P('Repel','प्रतिकर्षण'),'pollination example':P('Pollination example','परागण उदाहरण'),'predation example':P('Predation example','परभक्षण उदाहरण'),'decomposition example':P('Decomposition example','अपघटन उदाहरण')};
export function advancedResultRows(metrics,lang='en'){
 return Object.entries(metrics).map(([k,v])=>({label:text(LABELS[k]||P(k,k),lang),value:v===null?text(P('Undefined: empty bag','अपरिभाषित: खाली थैली'),lang):typeof v==='boolean'?text(v?P('Yes','हाँ'):P('No','नहीं'),lang):typeof v==='object'?Object.entries(v).map(([a,b])=>a+': '+b).join(', '):typeof v==='number'?String(Number(v.toFixed(4))):text(VALUE_LABELS[v]||P(v,v),lang)}));
}
export function evaluateAdvanced(id,state,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=modelAdvanced(id),result=calculateAdvanced(id,state);
 const optional=optionalExampleFields(id);
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

/** M44 bounded, example-specific feedback. Compare the current controls to the authored example,
 * not the learner's knowledge. No attempt count, identity, score, history or inferred mastery. */
function optionalExampleFields(id){return id==='probability'?['seed','draws']:id==='sound'?['amplitude']:[];}
export function advancedExampleFeedback(id,state,lang='en'){
 const result=evaluateAdvanced(id,state,lang),m=modelAdvanced(id);
 const optional=optionalExampleFields(id);
 const format=(f,v)=>f.options?text(f.options.find(o=>o.value===v).label,lang):String(v)+(f.unit?' '+f.unit:'');
 const fields=m.fields.map(f=>({id:f.id,label:text(f.label,lang),current:format(f,state[f.id]),example:optional.includes(f.id)?null:format(f,m.target[f.id]),kind:optional.includes(f.id)?'explore':state[f.id]===m.target[f.id]?'matches':'compare'}));
 const first=fields.find(f=>f.kind==='compare');
 const next=first?{fieldId:first.id,reason:text(P('Compare this control with the example. Other allowed values are valid explorations.','इस नियंत्रण को उदाहरण से मिलाएँ। दूसरे अनुमत मान भी सही खोज विकल्प हैं।'),lang)}:
 {fieldId:null,reason:text(P('The specified example matches. Try changing one control and explaining the result.','दिया गया उदाहरण मेल खाता है। एक नियंत्रण बदलकर परिणाम समझाएँ।'),lang)};
 return {id,exampleMatches:result.correct,fields,next,source:result.source,draftStatus:result.draftStatus,declinable:true,persists:false,usesHistory:false,masteryPrediction:false,publicReleaseApproved:false};
}

/** M55 one-control exploration: two transient states of the same model, not learner assessment.
 * A single changed control establishes a within-model comparison, not real-world causation. */
export function advancedVariableComparison(id,before,after,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=modelAdvanced(id),a=calculateAdvanced(id,before),b=calculateAdvanced(id,after);
 const changed=m.fields.filter(f=>before[f.id]!==after[f.id]);
 const mode=changed.length===0?'UNCHANGED':changed.length===1?'ONE_CONTROL':'MULTIPLE_CONTROLS';
 const format=(f,v)=>f.options?text(f.options.find(o=>o.value===v).label,lang):String(v)+(f.unit?' '+f.unit:'');
 const changedControls=changed.map(f=>({id:f.id,label:text(f.label,lang),before:format(f,before[f.id]),after:format(f,after[f.id])}));
 const aRows=advancedResultRows(a,lang),bRows=advancedResultRows(b,lang);
 // Rows are formatted model outputs. Do not parse rounded/localized values or invent deltas.
 const comparisons=mode==='ONE_CONTROL'&&aRows.length===bRows.length&&aRows.every((r,i)=>r.label===bRows[i].label)
  ?aRows.map((r,i)=>({label:r.label,before:r.value,after:bRows[i].value,changed:r.value!==bRows[i].value})):[];
 const guidance=text(mode==='UNCHANGED'?P('Change just one control to compare its displayed model results.','दिखाए गए मॉडल परिणामों की तुलना के लिए केवल एक नियंत्रण बदलें।'):mode==='MULTIPLE_CONTROLS'?P('More than one control changed. Restore all but one, or mark a new starting state.','एक से अधिक नियंत्रण बदले। एक को छोड़कर बाकी लौटाएँ, या नई आरंभिक स्थिति चुनें।'):P('Compare the displayed values in this simplified model. An unchanged displayed value may hide rounding; this is not a real-world causal experiment.','इस सरल मॉडल में दिखाए गए मान मिलाएँ। अपरिवर्तित दिखता मान गोलाई के कारण हो सकता है; यह वास्तविक कारणात्मक प्रयोग नहीं है।'),lang);
 return {id,mode,changedControls,comparisons,guidance,source:'assets/advanced-lab-engine.js',persists:false,usesLearnerHistory:false,masteryPrediction:false,publicReleaseApproved:false};
}

/** M56: local subject discovery; no age/grade or learning-ability inference. */
export const ADVANCED_SUBJECT_FILTERS=Object.freeze(['all','maths','physics','chemistry','biology']);
export function advancedSubjectOptions(subject='all',lang='en'){
 if(!ADVANCED_SUBJECT_FILTERS.includes(subject)||!['en','hi'].includes(lang))throw Error('Unknown subject or language');
 return ADVANCED_IDS.filter(id=>subject==='all'||ADVANCED_MODELS[id].subject===subject).map(id=>({id,subject:ADVANCED_MODELS[id].subject,title:text(ADVANCED_MODELS[id].title,lang),gradeVerified:false,humanReviewed:false}));
}

/** M58 optional learner-directed stages; no response collection, gate or mastery inference. */
export const ADVANCED_GUIDED_STAGES=Object.freeze(['predict','explore','compare','explain','reflect']);
const stageLabels=Object.freeze({
 predict:P('Predict','अनुमान लगाएँ'),explore:P('Explore','खोजें'),compare:P('Compare','तुलना करें'),
 explain:P('Explain','समझाएँ'),reflect:P('Reflect','विचार करें')
});
export function advancedGuidedStage(id,stage,lang='en'){
 if(!ADVANCED_GUIDED_STAGES.includes(stage)||!['en','hi'].includes(lang))throw Error('Unknown stage or language');
 const m=modelAdvanced(id);
 const instructions={
  predict:P('Read the draft question. Before changing controls, make a prediction on paper or in your mind.','मसौदा प्रश्न पढ़ें। नियंत्रण बदलने से पहले कागज़ पर या मन में अनुमान लगाएँ।'),
  explore:P('Inspect the model and change one allowed control. Notice the calculated values; do not perform a physical experiment.','मॉडल देखें और एक अनुमत नियंत्रण बदलें। गणना किए गए मान देखें; वास्तविक प्रयोग न करें।'),
  compare:P('If you want, mark a starting state in the comparison panel below, then change one control. Compare only the displayed model values.','चाहें तो नीचे तुलना पैनल में आरंभिक स्थिति चुनें, फिर एक नियंत्रण बदलें। केवल दिखाए गए मॉडल मान मिलाएँ।'),
  explain:P('Use the draft hint and explain your reasoning aloud or on paper. Ask a teacher to check it.','मसौदा संकेत का उपयोग करके अपना कारण बोलकर या कागज़ पर समझाएँ। शिक्षक से जाँच कराएँ।'),
  reflect:P('Think of one question or another allowed value to explore. You can repeat, leave, or return to any stage; no answer is submitted.','एक और सवाल या खोजने योग्य अनुमत मान सोचें। किसी भी चरण में लौटें, दोहराएँ या छोड़ें; कोई उत्तर जमा नहीं होता।')
 };
 const index=ADVANCED_GUIDED_STAGES.indexOf(stage);
 return {id,stage,index,total:ADVANCED_GUIDED_STAGES.length,label:text(stageLabels[stage],lang),instruction:text(instructions[stage],lang),
  sourcePrompt:text(m.prompt,lang),sourceHint:stage==='explain'?text(m.hint,lang):null,caveat:text(m.caveat,lang),
  source:'assets/advanced-lab-engine.js',optional:true,storesResponses:false,masteryPrediction:false,publicReleaseApproved:false};
}

/** M63 supplemental ratio and equation activities, part of the ratio-algebra review record. */
export const RATIO_EXTENSION_IDS=Object.freeze(['ratio','equation']);
export function ratioExtension(mode){
 if(!RATIO_EXTENSION_IDS.includes(mode))throw Error('Unknown supplemental activity');
 return ADVANCED_MODELS['ratio-algebra'].extensions[mode];
}
export function evaluateRatioExtension(mode,state,lang='en'){
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=ratioExtension(mode);
 if(!state||typeof state!=='object'||Array.isArray(state)||Object.keys(state).length!==m.fields.length||
 m.fields.some(f=>!Object.hasOwn(state,f.id)||!Number.isInteger(state[f.id])||state[f.id]<f.min||state[f.id]>f.max))throw Error('Invalid extension state');
 const {a,b}=state;
 const rows=mode==='ratio'?
  [[P('Original ratio','मूल अनुपात'),a+':'+b],[P('Scaled ratio','गुणित अनुपात'),(a*state.k)+':'+(b*state.k)],[P('Equivalent','समतुल्य'),text(P('Yes','हाँ'),lang)]]:
  [[P('Left side ax + b','बायाँ पक्ष ax + b'),a*state.x+b],[P('Right side','दायाँ पक्ष'),12],[P('Equation satisfied','समीकरण संतुष्ट'),text(a*state.x+b===12?P('Yes','हाँ'):P('No','नहीं'),lang)]];
 return {mode,title:text(m.title,lang),prompt:text(m.prompt,lang),hint:text(m.hint,lang),caveat:text(m.caveat,lang),
 rows:rows.map(([label,value])=>({label:text(label,lang),value:String(value)})),source:'assets/advanced-lab-engine.js',reviewId:'advanced:ratio-algebra',humanReviewed:false,publicReleaseApproved:false,masteryPrediction:false,persists:false};
}

/** M64 local, bounded discovery of existing draft titles and stable IDs.
 * Search terms are never persisted, transmitted, scored, or interpreted as learner ability. */
export function findAdvancedConcepts(query,subject='all',lang='en'){
 if(typeof query!=='string'||query.length>80)throw Error('Invalid concept query');
 const options=advancedSubjectOptions(subject,lang);
 const normalize=s=>s.normalize('NFC').toLowerCase().trim().replace(/\s+/gu,' ');
 const q=normalize(query);
 if(!q)return [];
 const tokens=q.split(' ');
 return options.filter(item=>{
  const model=ADVANCED_MODELS[item.id];
  const haystack=normalize([item.id,item.id.replace(/-/g,' '),...model.title].join(' '));
  return tokens.every(token=>haystack.includes(token));
 });
}

/** M65 supplemental draft activities share the canonical model review fingerprint. */
export function advancedExtensionIds(id){
 return Object.keys(modelAdvanced(id).extensions||{});
}
export function advancedExtension(id,mode){
 if(!advancedExtensionIds(id).includes(mode))throw Error('Unknown supplemental activity');
 return modelAdvanced(id).extensions[mode];
}
export function evaluateAdvancedExtension(id,mode,state,lang='en'){
 if(id==='ratio-algebra')return evaluateRatioExtension(mode,state,lang);
 if(!['en','hi'].includes(lang))throw Error('Unknown language');
 const m=advancedExtension(id,mode);
 if(!state||typeof state!=='object'||Array.isArray(state)||Object.keys(state).length!==m.fields.length||
 m.fields.some(f=>!Object.hasOwn(state,f.id)||!Number.isInteger(state[f.id])||state[f.id]<f.min||state[f.id]>f.max))throw Error('Invalid extension state');
 const {a,b,c,m:slope,x,right,left,start}=state;
 let rows;
 switch(id){
 case 'coordinate':rows=[[P('y = mx + b','y = mx + b'),slope*x+b],[P('y when x = 0','x = 0 पर y'),b],[P('Change in y per +1 x','x में +1 पर y का परिवर्तन'),slope]];break;
 case 'force-motion':rows=[[P('Signed net force (N)','चिह्न सहित परिणामी बल (N)'),right-left],[P('Direction','दिशा'),text(right===left?P('Zero net force','शून्य परिणामी बल'):right>left?P('Right','दाईं ओर'):P('Left','बाईं ओर'),lang)]];break;
 case 'mass-balance':rows=[[P('Total inputs (g)','कुल आगत (g)'),a+b],[P('Remaining output (g)','शेष निर्गत (g)'),a+b>=c?a+b-c:text(P('Not possible','संभव नहीं'),lang)],[P('Fits ideal mass balance','आदर्श द्रव्यमान संतुलन संभव'),text(a+b>=c?P('Yes','हाँ'):P('No','नहीं'),lang)]];break;
 case 'cell-doubling':rows=[[P('Count A','संख्या A'),start*2**a],[P('Count B','संख्या B'),start*2**b],[P('Difference B − A','अंतर B − A'),start*(2**b-2**a)]];break;
 default:throw Error('Unknown supplemental activity');
 }
 return {mode,title:text(m.title,lang),prompt:text(m.prompt,lang),hint:text(m.hint,lang),caveat:text(m.caveat,lang),rows:rows.map(([label,value])=>({label:text(label,lang),value:String(value)})),source:'assets/advanced-lab-engine.js',reviewId:'advanced:'+id,humanReviewed:false,publicReleaseApproved:false,masteryPrediction:false,persists:false};
}

/** M69 temporary supplemental comparison. Display differences, not causality or mastery. */
export function compareAdvancedExtension(id,mode,before,after,lang='en'){
 const a=evaluateAdvancedExtension(id,mode,before,lang),b=evaluateAdvancedExtension(id,mode,after,lang),m=advancedExtension(id,mode);
 const changes=m.fields.filter(f=>before[f.id]!==after[f.id]).map(f=>({id:f.id,label:text(f.label,lang),before:String(before[f.id]),after:String(after[f.id])}));
 if(a.rows.length!==b.rows.length||a.rows.some((r,i)=>r.label!==b.rows[i].label))throw Error('Incompatible supplemental result rows');
 const status=changes.length===0?'UNCHANGED':changes.length===1?'ONE_CONTROL':'MULTIPLE_CONTROLS';
 return {id,mode,status,changes,rows:a.rows.map((r,i)=>({label:r.label,before:r.value,after:b.rows[i].value,changed:r.value!==b.rows[i].value})),
  guidance:text(status==='UNCHANGED'?P('Change one control and compare the displayed values.','एक नियंत्रण बदलें और दिखाए गए मान मिलाएँ।'):status==='ONE_CONTROL'?P('One control changed. Compare the model outputs; this is not proof of a real-world cause.','एक नियंत्रण बदला। मॉडल के परिणाम मिलाएँ; यह वास्तविक कारण का प्रमाण नहीं है।'):P('Several controls changed. Restore the starting state or mark a new one to explore one control at a time.','कई नियंत्रण बदले। एक बार में एक नियंत्रण खोजने के लिए आरंभिक स्थिति लौटाएँ या नई चुनें।'),lang),
  persists:false,usesLearnerHistory:false,masteryPrediction:false,humanReviewed:false,publicReleaseApproved:false};
}
