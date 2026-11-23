/** M31: seven original bilingual, in-memory conceptual science mini-labs.
 * ALL content is draft until independently reviewed by qualified teachers/Hindi reviewers.
 * These abstract models are not instructions for hands-on dangerous experiments.
 */
export const SCIENCE_VERSION=1;
export const SCIENCE_STAGES=Object.freeze(['learn','try','play','understand','grow']);
export const SCIENCE_IDS=Object.freeze(['motion','reflection','energy','matter','changes','cells','food-chain']);
const pair=(en,hi)=>[en,hi];
export const SCIENCE_MODELS={
 motion:{
  id:'motion',subject:'Physics',
  title:pair('Steady motion: distance and time','समान चाल: दूरी और समय'),
  concept:pair('This idealised model assumes a constant speed. Speed = distance ÷ time. Always show metres (m), seconds (s), and metres per second (m/s).','इस आदर्श मॉडल में चाल स्थिर मानी गई है। चाल = दूरी ÷ समय। मीटर (m), सेकंड (s) और मीटर प्रति सेकंड (m/s) की इकाइयाँ देखें।'),
  prompt:pair('Make the model travel 60 m in 10 s, then check the speed.','मॉडल में 10 सेकंड में 60 मीटर की दूरी बनाइए और चाल जाँचिए।'),
  hint:pair('Use the increment buttons. The time cannot be zero.','बढ़ाने वाले बटन दबाएँ। समय शून्य नहीं हो सकता।'),
  caveat:pair('Constant-speed classroom diagram only. It is not real traffic or a complete physics model.','सिर्फ समान चाल का कक्षा-चित्र। यह असली यातायात या पूरा भौतिक मॉडल नहीं है।'),
  mission:pair('On paper, calculate the speed for 30 m in 5 s. No outdoor timing is needed.','कागज़ पर 5 सेकंड में 30 मीटर की चाल निकालें। बाहर समय मापने की ज़रूरत नहीं।'),
  fields:[
   {id:'distance',label:pair('Distance','दूरी'),min:0,max:100,step:10,unit:'m'},
   {id:'seconds',label:pair('Time','समय'),min:1,max:20,step:1,unit:'s'}],
  initial:{distance:20,seconds:5},target:{distance:60,seconds:10},
  play:{question:pair('60 m in 10 s means what steady speed?','60 मीटर / 10 सेकंड की समान चाल कितनी है?'),options:[pair('6 m/s','6 मी/से'),pair('600 m/s','600 मी/से'),pair('0.6 m/s','0.6 मी/से')],answer:0}
 },
 reflection:{
  id:'reflection',subject:'Physics',
  title:pair('Light: angle of reflection','प्रकाश: परावर्तन कोण'),
  concept:pair('In a simplified plane-mirror ray diagram, the angle of reflection equals the angle of incidence. Both are measured from the perpendicular normal, not from the mirror surface.','सरल समतल दर्पण किरण-चित्र में परावर्तन कोण आपतन कोण के बराबर होता है। दोनों कोण दर्पण पर खड़ी अभिलंब रेखा से मापे जाते हैं।'),
  prompt:pair('Set incidence and reflection angles to 35° from the normal.','अभिलंब से आपतन और परावर्तन दोनों कोण 35° पर रखें।'),
  hint:pair('The two values need to match: 35° and 35°.','दोनों कोण बराबर होने चाहिए: 35° और 35°।'),
  caveat:pair('A ray diagram, not instructions for lasers, bright lights or mirrors near the eyes.','यह किरण-चित्र है; आँखों के पास लेज़र या तेज़ प्रकाश के प्रयोग का निर्देश नहीं।'),
  mission:pair('Draw a normal line and two equal angles on paper.','कागज़ पर अभिलंब खींचें और दोनों ओर समान कोण बनाएँ।'),
  fields:[
   {id:'incident',label:pair('Incident angle from normal','अभिलंब से आपतन कोण'),min:0,max:90,step:5,unit:'°'},
   {id:'reflected',label:pair('Reflected angle from normal','अभिलंब से परावर्तन कोण'),min:0,max:90,step:5,unit:'°'}],
  initial:{incident:20,reflected:10},target:{incident:35,reflected:35},
  play:{question:pair('The incident ray meets the mirror at 35° from the normal. The reflected angle is...','आपतित किरण अभिलंब से 35° बनाती है। परावर्तन कोण होगा...'),options:[pair('55° from the normal','अभिलंब से 55°'),pair('35° from the normal','अभिलंब से 35°'),pair('70° from the normal','अभिलंब से 70°')],answer:1}
 },
 energy:{
  id:'energy',subject:'Physics',
  title:pair('Energy accounting: two pathways','ऊर्जा का लेखा: दो रास्ते'),
  concept:pair('In this idealised 100 J diagram, the input is divided between a useful output and a thermal transfer: useful + thermal = 100 J. Real systems can have more than two pathways.','इस आदर्श 100 J चित्र में ऊर्जा उपयोगी आउटपुट और ऊष्मीय स्थानांतरण में बाँटी जाती है: उपयोगी + ऊष्मीय = 100 J। असली प्रणालियों में और भी रास्ते हो सकते हैं।'),
  prompt:pair('Set useful output to 70 J. Observe the remaining thermal transfer.','उपयोगी आउटपुट 70 J रखें। बचा ऊष्मीय स्थानांतरण देखें।'),
  hint:pair('Every +10 J of useful output reduces the thermal transfer by 10 J in this two-pathway model.','इस दो-रास्ते के मॉडल में उपयोगी आउटपुट 10 J बढ़ाने पर ऊष्मीय स्थानांतरण 10 J घटेगा।'),
  caveat:pair('Energy is transferred, not created or destroyed. This is not an efficiency measurement or an electrical experiment.','ऊर्जा का स्थानांतरण होता है, न कि निर्माण या विनाश। यह दक्षता माप या बिजली का प्रयोग नहीं है।'),
  mission:pair('On paper, split 100 J into 40 J useful and the rest thermal.','कागज़ पर 100 J को 40 J उपयोगी और बाकी ऊष्मीय भाग में बाँटें।'),
  fields:[{id:'useful',label:pair('Useful energy transfer','उपयोगी ऊर्जा स्थानांतरण'),min:0,max:100,step:10,unit:'J'}],
  initial:{useful:30},target:{useful:70},
  play:{question:pair('In this two-pathway diagram, 70 J useful means how much thermal energy?','इस दो-रास्ते के चित्र में 70 J उपयोगी होने पर ऊष्मीय ऊर्जा कितनी है?'),options:[pair('170 J','170 J'),pair('0 J','0 J'),pair('30 J','30 J')],answer:2}
 },
 matter:{
  id:'matter',subject:'Chemistry',
  title:pair('States of matter: particle ideas','पदार्थ की अवस्थाएँ: कणों की समझ'),
  concept:pair('A simple particle picture: particles in a solid stay near fixed positions; particles in a liquid remain close but rearrange; gas particles are far apart and move freely. It is a schematic model.','सरल कण-चित्र: ठोस में कण लगभग स्थिर स्थानों पर रहते हैं, द्रव में पास रहते हुए स्थान बदलते हैं और गैस में कण दूर-दूर होकर स्वतंत्र गति करते हैं। यह प्रतीकात्मक मॉडल है।'),
  prompt:pair('Select LIQUID to explore its particle description.','कणों का वर्णन जानने के लिए द्रव (LIQUID) चुनें।'),
  hint:pair('Choose the state where particles stay close but flow past one another.','वह अवस्था चुनें जिसमें कण पास रहकर एक-दूसरे के पास से बहते हैं।'),
  caveat:pair('Not a real molecular microscope; no heating or chemicals are required.','यह असली आणविक सूक्ष्मदर्शी नहीं है; गर्म करने या रसायन की ज़रूरत नहीं।'),
  mission:pair('Draw dots showing a solid, liquid and gas, then label this as a simplified model.','ठोस, द्रव और गैस के कणों के बिंदु बनाएँ और लिखें कि यह सरल मॉडल है।'),
  fields:[{id:'state',label:pair('Particle state','कणों की अवस्था'),options:[
   {value:'solid',label:pair('Solid','ठोस')},
   {value:'liquid',label:pair('Liquid','द्रव')},
   {value:'gas',label:pair('Gas','गैस')}]}],
  initial:{state:'solid'},target:{state:'liquid'},
  play:{question:pair('Which state can flow while its particles usually stay close together?','किस अवस्था में कण सामान्यतः पास रहकर भी बह सकते हैं?'),options:[pair('An ideal rigid solid','आदर्श कठोर ठोस'),pair('Liquid','द्रव'),pair('Vacuum','निर्वात')],answer:1}
 },
 changes:{
  id:'changes',subject:'Chemistry',
  title:pair('Physical or chemical change?','भौतिक या रासायनिक परिवर्तन?'),
  concept:pair('Melting ice and dissolving salt in water are commonly modelled as physical changes; burning paper is a chemical change. These are classification examples, not instructions to try them.','बर्फ का पिघलना और पानी में नमक घुलना सामान्यतः भौतिक परिवर्तन के उदाहरण हैं; कागज़ का जलना रासायनिक परिवर्तन है। ये वर्गीकरण के उदाहरण हैं, करने के निर्देश नहीं।'),
  prompt:pair('Choose melting ice and classify it as a physical change.','बर्फ पिघलना चुनें और इसे भौतिक परिवर्तन बताएँ।'),
  hint:pair('A physical change can alter state or form without making a different substance in this example.','इस उदाहरण में नया पदार्थ बने बिना अवस्था या रूप बदलना भौतिक परिवर्तन है।'),
  caveat:pair('Do not burn anything, heat substances or try chemical reactions. Discuss examples only.','कुछ भी न जलाएँ, पदार्थ गर्म न करें या रासायनिक क्रिया न करें। केवल उदाहरणों पर चर्चा करें।'),
  mission:pair('List two everyday changes on paper; ask a teacher before classifying unfamiliar ones.','कागज़ पर रोज़मर्रा के दो बदलाव लिखें; अपरिचित बदलाव के वर्गीकरण में शिक्षक से पूछें।'),
  fields:[
   {id:'example',label:pair('Example','उदाहरण'),options:[
    {value:'melting',label:pair('Ice melting','बर्फ पिघलना')},
    {value:'burning',label:pair('Paper burning (do not try)','कागज़ जलना (प्रयोग न करें)')},
    {value:'dissolving',label:pair('Salt dissolving in water','नमक पानी में घुलना')}]},
   {id:'kind',label:pair('Classify it','वर्गीकरण'),options:[
    {value:'physical',label:pair('Physical','भौतिक')},
    {value:'chemical',label:pair('Chemical','रासायनिक')}]}],
  initial:{example:'burning',kind:'physical'},target:{example:'melting',kind:'physical'},
  play:{question:pair('In this classroom example, paper burning is classified as...','इस कक्षा-उदाहरण में कागज़ का जलना किस प्रकार का परिवर्तन है?'),options:[pair('Only a change of shape','केवल आकार में बदलाव'),pair('No change at all','कोई बदलाव नहीं'),pair('Chemical change','रासायनिक परिवर्तन')],answer:2}
 },
 cells:{
  id:'cells',subject:'Biology',
  title:pair('Cell structures: compare examples','कोशिका संरचना: उदाहरणों की तुलना'),
  concept:pair('A typical green leaf cell has a nucleus, a cell wall and chloroplasts. A typical animal cell has a nucleus and a membrane but no cell wall. A bacterium has no membrane-bound nucleus. Actual cells vary.','सामान्य हरी पत्ती की कोशिका में केंद्रक, कोशिका भित्ति और हरितलवक होते हैं। सामान्य जंतु कोशिका में केंद्रक व झिल्ली होती है पर कोशिका भित्ति नहीं। जीवाणु में झिल्ली से घिरा केंद्रक नहीं होता। असली कोशिकाओं में भिन्नता होती है।'),
  prompt:pair('Choose a typical green leaf cell to show the chloroplast example.','हरितलवक का उदाहरण देखने के लिए सामान्य हरी पत्ती की कोशिका चुनें।'),
  hint:pair('In this limited comparison, chloroplasts are shown in the green leaf cell.','इस सीमित तुलना में हरितलवक हरी पत्ती की कोशिका में दिखाए गए हैं।'),
  caveat:pair('Schematic examples only; not all plant cells have chloroplasts and not all bacteria have the same cell wall. No biological sampling is needed.','सिर्फ प्रतीकात्मक उदाहरण; सभी पादप कोशिकाओं में हरितलवक नहीं होते और सभी जीवाणुओं की कोशिका भित्ति समान नहीं होती। नमूना लेना आवश्यक नहीं।'),
  mission:pair('Draw a simple labelled green leaf cell and a simple animal cell.','कागज़ पर हरी पत्ती और जंतु कोशिका का सरल नामांकित चित्र बनाएँ।'),
  fields:[{id:'cell',label:pair('Cell example','कोशिका उदाहरण'),options:[
   {value:'leaf',label:pair('Green leaf cell','हरी पत्ती कोशिका')},
   {value:'animal',label:pair('Typical animal cell','सामान्य जंतु कोशिका')},
   {value:'bacterium',label:pair('Bacterium','जीवाणु')}]}],
  initial:{cell:'animal'},target:{cell:'leaf'},
  play:{question:pair('Which example has no membrane-bound nucleus?','किस उदाहरण में झिल्ली से घिरा केंद्रक नहीं होता?'),options:[pair('Typical green leaf cell','सामान्य हरी पत्ती कोशिका'),pair('Bacterium','जीवाणु'),pair('Typical animal cell','सामान्य जंतु कोशिका')],answer:1}
 },
 'food-chain':{
  id:'food-chain',subject:'Biology',
  title:pair('Food chain: one simplified path','खाद्य शृंखला: एक सरल मार्ग'),
  concept:pair('One illustrative food chain can be grass → grasshopper → frog → snake. Arrows show the direction of food and energy transfer from the eaten organism to the eater. Real ecosystems form complex food webs.','उदाहरण की एक खाद्य शृंखला घास → टिड्डा → मेंढक → साँप है। तीर खाए जाने वाले जीव से खाने वाले जीव की ओर भोजन व ऊर्जा का प्रवाह दिखाते हैं। असली पारितंत्रों में जटिल खाद्य-जाल होते हैं।'),
  prompt:pair('Choose the example food-chain sequence with arrows from food to consumer.','भोजन से उपभोक्ता की दिशा वाले तीरों की सही उदाहरण-शृंखला चुनें।'),
  hint:pair('Start with grass (producer), then grasshopper, frog and snake.','पहले घास (उत्पादक), फिर टिड्डा, मेंढक और साँप रखें।'),
  caveat:pair('A teaching example only, not a claim that every frog or snake always eats these species. Do not handle wildlife.','यह पढ़ाने का उदाहरण है, सभी मेंढकों या साँपों के भोजन का सार्वभौमिक दावा नहीं। वन्यजीव न पकड़ें।'),
  mission:pair('Draw arrows between producer and consumers on paper. Ask how the web might be more complex.','कागज़ पर उत्पादक व उपभोक्ताओं के बीच तीर बनाएँ। सोचें खाद्य-जाल और कैसे जटिल हो सकता है।'),
  fields:[{id:'chain',label:pair('Illustrative sequence','उदाहरण-शृंखला'),options:[
   {value:'frog-grass-snake',label:pair('Frog → grass → snake','मेंढक → घास → साँप')},
   {value:'grass-grasshopper-frog-snake',label:pair('Grass → grasshopper → frog → snake','घास → टिड्डा → मेंढक → साँप')},
   {value:'snake-grasshopper-grass',label:pair('Snake → grasshopper → grass','साँप → टिड्डा → घास')}]}],
  initial:{chain:'frog-grass-snake'},target:{chain:'grass-grasshopper-frog-snake'},
  play:{question:pair('Food-chain arrows show energy transfer mainly from...','खाद्य शृंखला में तीर मुख्यतः ऊर्जा का प्रवाह किस ओर दिखाते हैं?'),options:[pair('Consumer back to sunlight','उपभोक्ता से वापस सूर्य प्रकाश की ओर'),pair('Always the largest to the smallest','हमेशा बड़े से छोटे जीव की ओर'),pair('Eaten organism to eater','खाए गए जीव से खाने वाले जीव की ओर')],answer:2}
 }
};
export function scienceText(source,lang='en'){
 if(!Array.isArray(source)||source.length!==2||source.some(x=>typeof x!=='string'||x.trim().length===0))
  throw Error('Missing English/Hindi text pair');
 return source[lang==='hi'?1:0];
}
export function scienceModel(id){if(!SCIENCE_IDS.includes(id))throw Error('Unknown science concept');return SCIENCE_MODELS[id];}
export function scienceValidateState(id,state){
 const model=scienceModel(id);
 if(!state||typeof state!=='object'||Array.isArray(state))throw Error('Invalid science state');
 const names=model.fields.map(x=>x.id);
 if(Object.keys(state).length!==names.length||Object.keys(state).some(k=>!names.includes(k)))throw Error('Unexpected or missing science control');
 for(const field of model.fields){
  const v=state[field.id];
  if(field.options){if(!field.options.some(option=>option.value===v))throw Error('Invalid selection '+field.id)}
  else if(!Number.isInteger(v)||v<field.min||v>field.max||(v-field.min)%field.step!==0)throw Error('Invalid bounded quantity '+field.id);
 }
 return state;
}
export function scienceExplain(id,state,lang='en'){
 scienceValidateState(id,state);
 if(id==='motion')return scienceText(pair(`Distance ${state.distance} m ÷ time ${state.seconds} s = ${Number((state.distance/state.seconds).toFixed(3))} m/s (ideal constant speed).`,`दूरी ${state.distance} m ÷ समय ${state.seconds} s = ${Number((state.distance/state.seconds).toFixed(3))} m/s (आदर्श समान चाल)।`),lang);
 if(id==='reflection')return scienceText(pair(`Incident angle ${state.incident}°; chosen reflected angle ${state.reflected}°. Reflection law requires these angles to be equal, measured from the normal.`,`आपतन कोण ${state.incident}°; चुना परावर्तन कोण ${state.reflected}°। नियम के अनुसार अभिलंब से मापे दोनों कोण बराबर होते हैं।`),lang);
 if(id==='energy')return scienceText(pair(`Input 100 J = useful ${state.useful} J + thermal ${100-state.useful} J in this ideal two-pathway accounting.`,`इस आदर्श दो-रास्ते के लेखे में इनपुट 100 J = उपयोगी ${state.useful} J + ऊष्मीय ${100-state.useful} J।`),lang);
 if(id==='matter'){
  const d={
   solid:pair('Solid: particles near fixed positions, vibrating (simplified).','ठोस: कण लगभग स्थिर स्थान पर कंपन करते हैं (सरल मॉडल)।'),
   liquid:pair('Liquid: particles remain close and can move past one another (simplified).','द्रव: कण पास रहते हैं और एक-दूसरे के पास से चल सकते हैं (सरल मॉडल)।'),
   gas:pair('Gas: particles generally spread far apart and move around (simplified).','गैस: कण सामान्यतः दूर फैलकर चलते रहते हैं (सरल मॉडल)।')
  };
  return scienceText(d[state.state],lang);
 }
 if(id==='changes'){
  const kind=state.example==='burning'?'chemical':'physical';
  const exampleHi={melting:'बर्फ पिघलना',burning:'कागज़ जलना',dissolving:'पानी में नमक घुलना'}[state.example];
  const kindHi={physical:'भौतिक',chemical:'रासायनिक'};
  return scienceText(pair(`For this example, ${state.example} is classified as ${kind}; chosen label: ${state.kind}. This is not an experiment instruction.`,`इस उदाहरण में ${exampleHi} को ${kindHi[kind]} परिवर्तन माना गया है; चुना वर्ग: ${kindHi[state.kind]}। यह प्रयोग करने का निर्देश नहीं है।`),lang);
 }
 if(id==='cells'){
  const d={
   leaf:pair('Typical green leaf cell: membrane, cell wall, nucleus, chloroplasts. Not all plant cells contain chloroplasts.','सामान्य हरी पत्ती कोशिका: झिल्ली, भित्ति, केंद्रक, हरितलवक। सभी पादप कोशिकाओं में हरितलवक नहीं होते।'),
   animal:pair('Typical animal cell: plasma membrane and nucleus; no cell wall.','सामान्य जंतु कोशिका: कोशिका झिल्ली और केंद्रक; कोशिका भित्ति नहीं।'),
   bacterium:pair('Bacterium: lacks a membrane-bound nucleus. Features vary by species.','जीवाणु: झिल्ली से घिरा केंद्रक नहीं होता। प्रजातियों में भिन्नता होती है।')
  };
  return scienceText(d[state.cell],lang);
 }
 const hi={ 'frog-grass-snake':'मेंढक → घास → साँप',
  'grass-grasshopper-frog-snake':'घास → टिड्डा → मेंढक → साँप',
  'snake-grasshopper-grass':'साँप → टिड्डा → घास'};
 return scienceText(pair(`Selected chain: ${state.chain.replaceAll('-',' → ')}. This is one simplified classroom example; food webs are more complex.`,`चुनी खाद्य शृंखला: ${hi[state.chain]}। यह कक्षा का सरल उदाहरण है; खाद्य-जाल अधिक जटिल होते हैं।`),lang);
}
export function scienceEvaluate(id,state){
 const model=scienceModel(id);scienceValidateState(id,state);
 const correct=model.fields.every(f=>state[f.id]===model.target[f.id]);
 const metrics=id==='motion'?{speedMetresPerSecond:state.distance/state.seconds}
  :id==='reflection'?{incidentAngle:state.incident,reflectedAngle:state.reflected,equal:state.incident===state.reflected}
  :id==='energy'?{inputJ:100,usefulJ:state.useful,thermalJ:100-state.useful}
  :id==='changes'?{correctClassification:state.kind===(state.example==='burning'?'chemical':'physical')}
  :{};
 return {correct,metrics,english:scienceExplain(id,state,'en'),hindi:scienceExplain(id,state,'hi')};
}
export function scienceChoiceCheck(id,index){
 const model=scienceModel(id);
 if(!Number.isInteger(index)||index<0||index>=model.play.options.length)throw Error('Invalid science quiz choice');
 return index===model.play.answer;
}
export function auditSciencePairs(models=SCIENCE_MODELS){
 const errors=[];
 for(const id of SCIENCE_IDS){
  const m=models[id];
  if(!m){errors.push(id+':missing');continue}
  for(const k of ['title','concept','prompt','hint','caveat','mission']){try{scienceText(m[k]);}catch{errors.push(id+':'+k)}}
  if(!Array.isArray(m.fields)||!m.fields.length)errors.push(id+':fields');
  else for(const f of m.fields){
   try{scienceText(f.label)}catch{errors.push(id+':field '+f.id)}
   if(f.options)for(const o of f.options)try{scienceText(o.label)}catch{errors.push(id+':option '+o.value)}
  }
  try{scienceText(m.play.question)}catch{errors.push(id+':quiz question')}
  if(!Array.isArray(m.play.options)||m.play.options.length!==3)errors.push(id+':quiz options');
  else for(const option of m.play.options)try{scienceText(option)}catch{errors.push(id+':quiz option')}
  if(!Number.isInteger(m.play.answer)||m.play.answer<0||m.play.answer>=m.play.options?.length)errors.push(id+':invalid quiz answer index');
  try{scienceValidateState(id,m.initial);scienceValidateState(id,m.target);if(!scienceEvaluate(id,m.target).correct)errors.push(id+':invalid target')}catch(e){errors.push(id+':'+e.message)}
 }
 return errors;
}
