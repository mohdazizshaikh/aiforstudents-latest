/** M8 additional game modules. Age-scaled educational exercises, NOT aptitude assessment.
 * Four variations for each of five task families per game = 20 tasks/game/age band.
 * Creative/social prompts are non-scored reflections; no profiling or third-party calls.
 */
export const EXTRA_GAMES = [
['rule-detective','logical-reasoning','Rule Detective','नियम जासूस','Choose the rule that explains a sequence.','संख्याओं के क्रम के पीछे का नियम खोजें।','◇','scored'],
['logic-maze','logical-reasoning','Logic Maze','तर्क भूलभुलैया','Follow directions to find an exit.','दिशाओं की मदद से रास्ता खोजें।','↗','scored'],
['sequence-builder','logical-reasoning','Sequence Builder','क्रम निर्माता','Arrange steps in a meaningful order.','सही क्रम में चरण व्यवस्थित करें।','≡','scored'],
['code-breaker','logical-reasoning','Code Breaker','कोड खोजी','Decode simple letter and number messages.','अक्षर और अंक के कोड समझें।','⌘','scored'],
['math-explorer','numerical','Math Explorer','गणित खोज','Solve everyday measurement problems.','रोज़मर्रा के माप की समस्याएँ हल करें।','∑','scored'],
['budget-challenge','numerical','Budget Challenge','बजट चुनौती','Select all items that fit a budget.','बजट में आने वाली सभी चीज़ें चुनें।','₹','scored'],
['number-detective','numerical','Number Detective','अंक जासूस','Find the incorrect arithmetic statement.','गणना में गलत कथन खोजें।','⊕','scored'],
['estimate-master','numerical','Estimate Master','अनुमान विशेषज्ञ','Estimate and round everyday quantities.','संख्याओं का अनुमान और राउंडिंग करें।','≈','scored'],
['word-builder','language','Word Builder','शब्द निर्माता','Build words by arranging letters.','अक्षर जोड़कर शब्द बनाएं।','Aa','scored'],
['meaning-hunter','language','Meaning Hunter','अर्थ खोजी','Find words that fit a sentence.','वाक्यों के अनुसार शब्दों का अर्थ पहचानें।','✍','scored'],
['story-sequencer','language','Story Sequencer','कहानी का क्रम','Put events in the order they happened.','घटनाओं को सही क्रम में रखें।','☰','scored'],
['explain-it','language','Explain It','समझाकर बताओ','Practice explaining an idea in your own words.','अपने शब्दों में विचार समझाने का अभ्यास करें।','❝','reflection'],
['rotation-master','spatial','Rotation Master','घुमाव गुरु','Turn arrows and directions in your mind.','तीरों को दिमाग में घुमाकर उत्तर दें।','⟳','scored'],
['map-navigator','spatial','Map Navigator','नक्शा मार्गदर्शक','Follow moves on a small grid.','छोटे ग्रिड पर रास्ते की चालें समझें।','⌖','scored'],
['block-architect','spatial','Block Architect','ब्लॉक वास्तुकार','Count cubes in towers and layers.','टावरों और परतों में ब्लॉक गिनें।','▣','scored'],
['mirror-puzzle','spatial','Mirror Puzzle','दर्पण पहेली','Reflect arrows in a mirror.','तीरों का दर्पण प्रतिबिंब पहचानें।','◀','scored'],
['gear-explorer','practical','Gear Explorer','गियर खोज','Track direction through connected gears.','जुड़े गियरों की घूमने की दिशा देखें।','⚙','scored'],
['bridge-builder','practical','Bridge Builder','पुल निर्माता','Explore safe paper-bridge design ideas.','कागज़ के पुल बनाने के सुरक्षित विचार सोचें।','▰','reflection'],
['cause-effect','practical','Cause & Effect','कारण और परिणाम','Put simple processes in cause-and-effect order.','सरल प्रक्रियाओं का कारण-परिणाम क्रम बनाएं।','↝','scored'],
['circuit-logic','practical','Circuit Logic','सर्किट तर्क','Reason about idealized switches and lamps.','सरल स्विच और बल्ब की पहेलियाँ हल करें।','⚡','scored'],
['story-creator','creative','Story Creator','कहानी रचो','Imagine a new ending or character.','नया अंत या पात्र सोचें।','✿','reflection'],
['design-challenge','creative','Design Challenge','डिज़ाइन चुनौती','Design for a real user need.','किसी वास्तविक ज़रूरत के लिए डिज़ाइन सोचें।','◉','reflection'],
['idea-mixer','creative','Idea Mixer','विचार मिलाओ','Combine two ideas into something new.','दो विचार मिलाकर कुछ नया सोचें।','✧','reflection'],
['invent-something','creative','Invent Something','कुछ नया बनाओ','Imagine a safe helpful invention.','सुरक्षित उपयोगी आविष्कार की कल्पना करें।','⚗','reflection'],
['team-planner','social','Team Planner','टीम योजना','Reflect on sharing tasks fairly.','टीम में काम उचित तरीके से बाँटने पर सोचें।','♧','reflection'],
['communication-quest','social','Communication Quest','बातचीत चुनौती','Explore respectful communication choices.','सम्मान से बातचीत के तरीके खोजें।','☏','reflection'],
['conflict-choices','social','Conflict Choices','मतभेद का समाधान','Reflect on disagreements without labeling people.','असहमति में कई सम्मानजनक रास्ते सोचें।','⚖','reflection'],
['cooperation-challenge','social','Cooperation Challenge','सहयोग चुनौती','Consider how a group could solve a task.','समूह मिलकर समस्या कैसे हल करे, सोचें।','♬','reflection'],
['resource-manager','planning','Resource Manager','संसाधन प्रबंधक','Allocate limited supplies to projects.','सीमित सामान को कामों में बाँटना सीखें।','▤','scored'],
['plan-b-challenge','planning','Plan B Challenge','नई योजना चुनौती','Adjust calculations when plans change.','योजना बदलने पर नई गणना करें।','↺','scored'],
['mission-scheduler','planning','Mission Scheduler','काम का क्रम','Arrange dependent tasks in order.','निर्भर कामों को सही क्रम में रखें।','▦','scored'],
['change-the-rules','planning','Change the Rules','नियम बदलो','Find choices that meet changing constraints.','बदली हुई शर्तों के अनुरूप चुनें।','⇄','scored']
].map(([id,category,en,hi,description,descHi,icon,mode])=>Object.freeze({id,category,en,hi,description,descHi,icon,mode}));

const levels={'6-10':1,'11-14':2,'15-17':3,'18+':4};
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
function mixed(arr,seed){let a=[...arr],h=hash(seed)||1;for(let i=a.length-1;i>0;i--){h^=h<<13;h^=h>>>17;h^=h<<5;let j=(h>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const strings = (a) => a.map(String);
function info(game,age,k,v,mode){return {id:`${game}:${age}:task${k}:${v}`,gameId:game,categoryId:EXTRA_GAMES.find(x=>x.id===game).category,ageBand:age,kind:`task${k}`,variant:v,difficulty:levels[age],mode,contentVersion:1,reviewed:false,context:'',contextHi:'',sequence:[]}}
function choice(g,a,k,v,q,qHi,opts,optsHi,ans,exp,expHi){const p=info(g,a,k,v,'scored');const indexes=mixed(opts.map((_,i)=>i),p.id);if(new Set(opts).size!==4||!opts.includes(ans))throw Error('Invalid choice options '+p.id);return {...p,interaction:'choice',question:q,questionHi:qHi,choices:indexes.map(i=>String(opts[i])),labelsHi:indexes.map(i=>optsHi[i]),answer:String(ans),explanation:exp,explanationHi:expHi}}
function number(g,a,k,v,q,qHi,ans,exp,expHi){return {...info(g,a,k,v,'scored'),interaction:'number',question:q,questionHi:qHi,choices:[],labelsHi:[],answer:String(ans),explanation:exp,explanationHi:expHi}}
function order(g,a,k,v,q,qHi,tokens,hiTokens,exp,expHi){const p=info(g,a,k,v,'scored'),idx=mixed(tokens.map((_,i)=>i),p.id);if(new Set(tokens).size!==tokens.length||tokens.length<3)throw Error('Invalid ordering '+p.id);return {...p,interaction:'order',question:q,questionHi:qHi,choices:idx.map(i=>tokens[i]),labelsHi:idx.map(i=>hiTokens[i]),answer:tokens.join('|'),explanation:exp,explanationHi:expHi}}
function multi(g,a,k,v,q,qHi,opts,labels,correct,exp,expHi){const p=info(g,a,k,v,'scored'),idx=mixed(opts.map((_,i)=>i),p.id);if(correct.length<2||correct.length>3)throw Error('Invalid multi key');return {...p,interaction:'multi',question:q,questionHi:qHi,choices:idx.map(i=>String(opts[i])),labelsHi:idx.map(i=>labels[i]),answer:[...correct].map(String).sort().join('|'),explanation:exp,explanationHi:expHi}}
const REFL=['I tried one approach','I tried another approach','I want to explore more','I need a break'];
const REFL_HI=['मैंने एक तरीका आज़माया','मैंने दूसरा तरीका सोचा','मैं और जानना चाहता/चाहती हूँ','मुझे थोड़ा आराम चाहिए'];
function reflect(g,a,k,v,q,qHi,context='',contextHi=''){const p=info(g,a,k,v,'reflection');return {...p,interaction:'reflection',question:q,questionHi:qHi,context,contextHi,choices:REFL,labelsHi:REFL_HI,answer:null,explanation:'Thanks for reflecting. No ability score is assigned.',explanationHi:'सोचने के लिए धन्यवाद। इससे क्षमता का कोई अंक नहीं बनता।',feedbackByChoice:Object.fromEntries(REFL.map(c=>[c,'Your reflection was recorded on this device.'])),feedbackByChoiceHi:Object.fromEntries(REFL.map(c=>[c,'आपका विचार इस डिवाइस पर दर्ज हुआ।']))}}
const DIR=['North','East','South','West'],DIR_HI=['उत्तर','पूर्व','दक्षिण','पश्चिम'];
const colorWords=['blue','green','red','yellow'],colorHi=['नीला','हरा','लाल','पीला'];
const WORDS=[['sun','सूर्य'],['cat','बिल्ली'],['pen','कलम'],['map','नक्शा'],['cup','कप'],['hat','टोपी'],['bag','बैग'],['pot','गमला'],['fan','पंखा'],['dog','कुत्ता'],['bus','बस'],['fox','लोमड़ी'],['zip','ज़िप'],['jug','जग'],['owl','उल्लू'],['hen','मुर्गी'],['pig','सूअर'],['cow','गाय'],['ant','चींटी'],['red','लाल']];
const STORIES=[
 {en:['Wash the cup','Fill the cup','Put it on the table'],hi:['कप धोएँ','कप में पानी भरें','कप मेज़ पर रखें']},
 {en:['Open the book','Read a page','Close the book'],hi:['किताब खोलें','एक पन्ना पढ़ें','किताब बंद करें']},
 {en:['Plant a seed','Water the soil','Watch for a sprout'],hi:['बीज लगाएँ','मिट्टी में पानी दें','अंकुर देखें']},
 {en:['Draw a plan','Build the model','Check the result'],hi:['योजना बनाएँ','मॉडल बनाएँ','नतीजा जाँचें']}
];
const STORY_TASKS=[
[['Wash a cup','Fill it with water','Put it on the table'],['कप धोएँ','उसमें पानी भरें','मेज़ पर रखें']],
[['Open a book','Read one page','Close the book'],['किताब खोलें','पन्ना पढ़ें','किताब बंद करें']],
[['Plant a seed','Water the soil','Watch for a sprout'],['बीज लगाएँ','मिट्टी में पानी दें','अंकुर देखें']],
[['Draw a plan','Make a paper model','Check the model'],['योजना बनाएँ','कागज़ का मॉडल बनाएँ','मॉडल जाँचें']],
[['Prepare lunch','Close the lunch box','Place it in the bag'],['खाना तैयार करें','टिफ़िन बंद करें','बैग में रखें']],
[['Choose a topic','Write main points','Review the notes'],['विषय चुनें','मुख्य बिंदु लिखें','नोट्स जाँचें']],
[['Gather paper','Fold the paper','Make a paper airplane'],['कागज़ लें','कागज़ मोड़ें','कागज़ का हवाई जहाज़ बनाएँ']],
[['Find a paintbrush','Paint a shape','Clean the brush'],['ब्रश लें','आकृति में रंग भरें','ब्रश साफ करें']],
[['Collect leaves','Sort by size','Count each group'],['पत्तियाँ चुनें','आकार से छाँटें','हर समूह गिनें']],
[['Read a map','Choose a route','Follow the route'],['नक्शा पढ़ें','रास्ता चुनें','रास्ते पर चलें']],
[['Take a clean cup','Fill it with water','Water the plant'],['साफ कप लें','पानी भरें','पौधे को पानी दें']],
[['Read the timetable','Pack the books','Go to class'],['समय-सारणी पढ़ें','किताबें पैक करें','कक्षा जाएँ']],
[['Read the instructions','Solve the puzzle','Check the answer'],['निर्देश पढ़ें','पहेली हल करें','उत्तर जाँचें']],
[['Wash your hands','Dry your hands','Eat a snack'],['हाथ धोएँ','हाथ सुखाएँ','नाश्ता खाएँ']],
[['Find poster materials','Create a poster','Put it on display'],['पोस्टर की सामग्री लें','पोस्टर बनाएँ','पोस्टर लगाएँ']],
[['Draw an outline','Color the outlined drawing','Display the finished drawing'],['बाहरी रेखा बनाएँ','रेखांकित चित्र में रंग भरें','तैयार चित्र प्रदर्शित करें']],
[['Collect notes','Group notes by topic','Review a topic'],['नोट्स इकट्ठा करें','विषय के अनुसार बाँटें','विषय दोहराएँ']],
[['Choose a question','Think through a solution','Explain the answer'],['सवाल चुनें','हल पर सोचें','उत्तर समझाएँ']],
[['Pick a safe container','Put pencils inside','Place it on the desk'],['सुरक्षित डिब्बा चुनें','पेंसिल डालें','मेज़ पर रखें']],
[['Notice a messy shelf','Sort items by type','Put them neatly back'],['बिखरी शेल्फ देखें','चीजें प्रकार से छाँटें','अच्छे से रखें']]
];
const MEANINGS=[
['joyful','happy','sad','angry','tired','खुश','उदास','नाराज़','थका'],
['tiny','small','huge','heavy','loud','छोटा','बहुत बड़ा','भारी','तेज़ आवाज़'],
['rapid','fast','slow','quiet','late','तेज़','धीमा','शांत','देर से'],
['calm','peaceful','noisy','worried','rushed','शांत','शोर वाला','चिंतित','जल्दी में'],
['brief','short','long','wide','deep','छोटा','लंबा','चौड़ा','गहरा'],
['silent','quiet','loud','bright','tall','शांत','तेज़ आवाज़','चमकदार','लंबा'],
['ancient','old','new','tiny','rapid','पुराना','नया','छोटा','तेज़'],
['brave','courageous','fearful','sleepy','hungry','साहसी','डरा','नींद में','भूखा'],
['damp','wet','dry','warm','bright','गीला','सूखा','गर्म','चमकीला'],
['neat','tidy','messy','noisy','dark','साफ-सुथरा','बिखरा','शोर','अँधेरा'],
['fragile','delicate','strong','heavy','long','नाज़ुक','मज़बूत','भारी','लंबा'],
['vast','huge','small','narrow','light','बहुत बड़ा','छोटा','संकरा','हल्का'],
['eager','keen','bored','unsure','absent','उत्सुक','ऊबा','अनिश्चित','अनुपस्थित'],
['simple','easy','complex','rare','heavy','आसान','जटिल','दुर्लभ','भारी'],
['enormous','large','tiny','silent','quick','बहुत बड़ा','बहुत छोटा','शांत','तेज़'],
['dull','boring','exciting','fresh','narrow','उबाऊ','रोमांचक','ताज़ा','संकरा'],
['polite','courteous','rude','rushed','sleepy','विनम्र','अशिष्ट','जल्दबाज़','नींद में'],
['swift','quick','slow','rough','heavy','तेज़','धीमा','खुरदुरा','भारी'],
['narrow','slim','wide','thick','noisy','संकरा','चौड़ा','मोटा','शोर वाला'],
['honest','truthful','dishonest','careless','sleepy','सच्चा','बेईमान','लापरवाह','नींद में']
];
function build(g,a,k,v){const L=levels[a],n=k+v+L,base=(k+2)*(v+2)*L;let answer,options,hi,items;
 switch(g){
 case 'rule-detective':{
  const start=2+v,step=2+k+L,seq=Array.from({length:4},(_,i)=>start+i*step);return choice(g,a,k,v,`Which rule describes ${seq.join(', ')}?`,`कौन सा नियम ${seq.join(', ')} में लागू है?`,[`Add ${step}`,`Add ${step+1}`,`Subtract ${step}`,`Multiply by ${step}`],[`हर बार ${step} जोड़ें`,`हर बार ${step+1} जोड़ें`,`हर बार ${step} घटाएँ`,`हर बार ${step} से गुणा करें`],`Add ${step}`,`The difference is ${step} each time.`,`हर दो संख्याओं का अंतर ${step} है।`)}
 case 'logic-maze':{
  const start=v%4,turns=k+1,end=(start+turns)%4;return choice(g,a,k,v,`You face ${DIR[start]}. Turn right ${turns} quarter-turn(s). Which direction now?`,`आप ${DIR_HI[start]} दिशा में हैं। ${turns} बार 90° दाएँ मुड़ें। अब किस दिशा में?`,DIR,DIR_HI,DIR[end],`A right quarter-turn moves clockwise; the final direction is ${DIR[end]}.`,`हर बार दाएँ मुड़ने पर दिशा 90° बदलती है; अंतिम दिशा ${DIR_HI[end]} है।`)}
 case 'sequence-builder':{
  const start=2+v+k*L,step=L+k+1,seq=[start,start+step,start+2*step,start+3*step].map(String);return order(g,a,k,v,'Tap the numbers in ascending order.','संख्याओं को छोटे से बड़े क्रम में छुएँ।',seq,seq,'The numbers increase from left to right.','संख्याएँ छोटे से बड़े क्रम में रखी गई हैं।')}
 case 'code-breaker':{
  const word=WORDS[(k+v)%WORDS.length][0].toUpperCase(),shift=L+v+1,code=[...word].map(c=>String.fromCharCode(65+(c.charCodeAt(0)-65+shift)%26)).join('');const alternatives=[word,WORDS[(k+v+1)%WORDS.length][0].toUpperCase(),WORDS[(k+v+2)%WORDS.length][0].toUpperCase(),WORDS[(k+v+3)%WORDS.length][0].toUpperCase()];return choice(g,a,k,v,`Each coded letter is ${shift} steps forward in A–Z (wrap after Z). Decode ${code}.`,`हर कोड अक्षर A–Z में ${shift} स्थान आगे बढ़ा है (Z के बाद A)। ${code} का मूल शब्द क्या था?`,alternatives,alternatives,word,`Shift each letter back ${shift} to get ${word}.`,`हर अक्षर ${shift} स्थान पीछे ले जाने पर ${word} मिलता है।`)}
 case 'math-explorer':{
  const side=3+k*4+v+L;answer=side*4;return number(g,a,k,v,`A square garden has sides of ${side} metres. What is its perimeter in metres?`,`वर्गाकार बगीचे की हर भुजा ${side} मीटर है। कुल परिमाप कितने मीटर?`,answer,`Four sides × ${side} = ${answer} metres.`,`चार भुजाएँ × ${side} = ${answer} मीटर।`)}
 case 'budget-challenge':{
  const budget=20+k*20+v*(L+2),prices=[budget-2,budget+3,budget-1,budget+6];const codes=['Item A','Item B','Item C','Item D'];const listed=codes.map((c,i)=>`${c}: ₹${prices[i]}`);return multi(g,a,k,v,`Budget ₹${budget}. Select EVERY item individually affordable within the budget.`,`बजट ₹${budget} है। ऐसे सभी आइटम चुनें जिन्हें अलग-अलग खरीद सकते हैं।`,listed,listed,[listed[0],listed[2]],`A and C cost ₹${prices[0]} and ₹${prices[2]}, both at most ₹${budget}.`,`A और C की कीमत ₹${prices[0]} व ₹${prices[2]} है, दोनों बजट के अंदर हैं।`)}
 case 'number-detective':{
  const x=3+n,y=2+v;const equations=[`${x}+${y}=${x+y}`,`${x}×${y}=${x*y}`,`${x+y}−${y}=${x}`,`${x}+${y}=${x+y+1}`];return choice(g,a,k,v,'Which one arithmetic statement is INCORRECT?','कौन सा एक गणितीय कथन गलत है?',equations,equations,equations[3],`The actual sum is ${x+y}, not ${x+y+1}.`,`सही योग ${x+y} है, ${x+y+1} नहीं।`)}
 case 'estimate-master':{
  const amount=22+10*k+v*3+L,rounded=Math.floor((amount+5)/10)*10;return number(g,a,k,v,`Round ${amount} to the nearest 10.`,`संख्या ${amount} को निकटतम 10 पर राउंड करें।`,rounded,`${amount} rounds to ${rounded}.`,`${amount} को राउंड करने पर ${rounded} आता है।`)}
 case 'word-builder':{
  const w=WORDS[k*4+v][0].toUpperCase();return order(g,a,k,v,`Arrange these letters to form the English word for ${WORDS[k*4+v][1]}.`,`अक्षरों को लगाकर ${WORDS[k*4+v][1]} का अंग्रेज़ी शब्द बनाएं।`,[...w],[...w],`The word is ${w}.`,`शब्द ${w} बनता है।`)}
 case 'meaning-hunter':{
  const answers=MEANINGS[k*4+v];const [w,good,...others]=answers;const opts=[good,...others.slice(0,3)];const hiOpts=answers.slice(5);return choice(g,a,k,v,`Which word has the closest meaning to “${w}”?`,`अंग्रेज़ी शब्द “${w}” का सबसे करीब अर्थ क्या है?`,opts,hiOpts,good,`${good} is a close meaning of ${w}.`,`${w} का निकट अर्थ ${hiOpts[0]} है।`)}
 case 'story-sequencer':{
  const [events,eventsHi]=STORY_TASKS[k*4+v];return order(g,a,k,v,'Put the story events into a natural order.','कहानी की घटनाएँ स्वाभाविक क्रम में रखें।',events,eventsHi,'The first action prepares the next, which leads to the final action.','पहले कदम से दूसरे की तैयारी होती है और अंत में आखिरी काम होता है।')}
 case 'explain-it':{
  const topic=['Why plants need water','How you check a sum','How you share something fairly','Why a plan may change','What makes a story clear'][(k+v)%5];const topicsHi=['पौधों को पानी क्यों चाहिए','योग कैसे जाँचते हैं','बराबर बाँटना कैसे समझाएँ','योजना क्यों बदल सकती है','कहानी साफ़ कैसे समझ आती है'];return reflect(g,a,k,v,`Explain in your own words: ${topic}. ${['Use an example.','Use a comparison.','Draw a simple diagram.','Describe one common mistake.'][v]}`,`अपने शब्दों में समझाएँ: ${topicsHi[(k+v)%5]}। ${['उदाहरण दें।','तुलना करें।','सरल चित्र बनाएं।','एक सामान्य गलती बताएं।'][v]}`,'No written response is collected; speak, draw or write privately on paper.','लिखा हुआ जवाब यहाँ नहीं लिया जाता; बोलें, चित्र बनाएँ या कागज़ पर लिखें।')}
 case 'rotation-master':{
  const start=v%4,rotate=k+1,end=(start+rotate)%4;return choice(g,a,k,v,`Arrow points ${DIR[start]}. Rotate it clockwise ${rotate} quarter-turn(s). Where does it point?`,`तीर ${DIR_HI[start]} में है। इसे ${rotate} बार 90° घड़ी की दिशा में घुमाएँ। अब दिशा?`,DIR,DIR_HI,DIR[end],`Clockwise turns lead to ${DIR[end]}.`,`घड़ी की दिशा में घुमाने पर दिशा ${DIR_HI[end]} होगी।`)}
 case 'map-navigator':{
  const x=2+v,y=2+k,Lstep=1+(L%2);const endX=x+Lstep,endY=y+v%2;const opts=[`(${endX},${endY})`,`(${endX-1},${endY})`,`(${endX},${endY+1})`,`(${endX+1},${endY})`];return choice(g,a,k,v,`Start at grid (${x},${y}). Move ${Lstep} step(s) east, then ${v%2} step(s) north. Final coordinate?`,`ग्रिड (${x},${y}) से शुरू करें। ${Lstep} कदम पूर्व और ${v%2} कदम उत्तर जाएँ। अंतिम स्थान?`,opts,opts,opts[0],`East increases x, north increases y: (${endX},${endY}).`,`पूर्व से x और उत्तर से y बढ़ता है: (${endX},${endY})।`)}
 case 'block-architect':{
  const stacks=[2+v,1+k,2+L];const total=stacks.reduce((a,b)=>a+b,0);return number(g,a,k,v,`Three cube towers contain ${stacks.join(', ')} cubes. No cubes are hidden or shared. How many cubes in total?`,`तीन टावरों में क्रमशः ${stacks.join(', ')} घन हैं। कोई घन छिपा या साझा नहीं है। कुल कितने?`,total,`${stacks.join(' + ')} = ${total} cubes.`,`${stacks.join(' + ')} = ${total} घन।`)}
 case 'mirror-puzzle':{
  const arrows=['←','↑','→','↓'], idx=v;
  const vertical=[2,1,0,3],horizontal=[0,3,2,1];
  const reflected=k===1||k===4?horizontal[idx]:vertical[idx];
  const shift=[0,0,1,2,1][k],answerArrow=arrows[(reflected+shift)%4];
  const action=['reflect in a vertical mirror','reflect in a horizontal mirror','reflect vertically then rotate 90° clockwise','reflect vertically then rotate 180°','reflect horizontally then rotate 90° clockwise'][k];
  const actionHi=['ऊर्ध्वाधर दर्पण में प्रतिबिंब बनाएं','क्षैतिज दर्पण में प्रतिबिंब बनाएं','ऊर्ध्वाधर प्रतिबिंब फिर 90° घड़ी की दिशा में घुमाएं','ऊर्ध्वाधर प्रतिबिंब फिर 180° घुमाएं','क्षैतिज प्रतिबिंब फिर 90° घड़ी की दिशा में घुमाएं'][k];
  return choice(g,a,k,v,`Arrow ${arrows[idx]}: ${action}. What is the result?`,`तीर ${arrows[idx]}: ${actionHi}। नतीजा क्या होगा?`,arrows,arrows,answerArrow,'Apply the mirror operation first, then the stated rotation.','पहले दर्पण का प्रतिबिंब, फिर बताया गया घुमाव करें.')
 }
 case 'gear-explorer':{
  const count=2+k,first=(v%2?'counterclockwise':'clockwise'),last=count%2===1?first:(first==='clockwise'?'counterclockwise':'clockwise');
  const givenIndex=v<2?1:count,asked=v<2?count:1,givenDirection=v<2?first:last,target=v<2?last:first;
  const opts=['clockwise','counterclockwise','stopped','cannot tell'];
  return choice(g,a,k,v,`A line has ${count} external gears, each touching the next. Gear ${givenIndex} turns ${givenDirection}. What direction does gear ${asked} turn?`,`एक पंक्ति में ${count} बाहरी गियर जुड़े हैं। गियर ${givenIndex} ${givenDirection==='clockwise'?'घड़ी की दिशा':'घड़ी की उलटी दिशा'} में घूमता है। गियर ${asked} की दिशा क्या होगी?`,opts,['घड़ी की दिशा','घड़ी की उलटी दिशा','रुका हुआ','पता नहीं चलता'],target,`Each connection reverses direction. Gear ${asked} turns ${target}.`,`हर जुड़े गियर पर दिशा बदलती है; गियर ${asked} ${target==='clockwise'?'घड़ी की दिशा':'घड़ी की उलटी दिशा'} में घूमता है।`)
 }
 case 'bridge-builder':{
  const materials=['two sheets of paper','three strips of cardboard','folded paper','four craft sticks','paper tubes'];const hiMaterials=['कागज़ की दो शीट','गत्ते की तीन पट्टियाँ','मुड़ा हुआ कागज़','चार शिल्प वाली लकड़ियाँ','कागज़ की नलियाँ'];return reflect(g,a,k,v,`Sketch a safe paper-model bridge using ${materials[(k+v)%5]}. ${['Draw a support idea.','Choose a safe paper load.','Compare two folded shapes.','Explain one improvement.'][v]}`,` ${hiMaterials[(k+v)%5]} से सुरक्षित कागज़ी पुल सोचें। ${['सहारे का चित्र बनाएं।','हल्के कागज़ का भार चुनें।','दो मुड़े आकार तुलना करें।','एक सुधार बताएं।'][v]}`,'Do not build elevated or load-bearing structures. Paper-only experiments with adult supervision if needed.','ऊँची या भारी भार वाली संरचना न बनाएँ। ज़रूरत हो तो बड़े की देखरेख में सिर्फ़ हल्का मॉडल बनाएँ।')}
 case 'cause-effect':{
  const [events,eventsHi]=STORY_TASKS[k*4+v];return order(g,a,k,v,'Arrange the process steps in a reasonable order.','प्रक्रिया के चरण उचित क्रम में रखें।',events,eventsHi,'The order shows a simple classroom process, not a general law of causation.','यह एक सरल प्रक्रिया का क्रम है, हर स्थिति का कारण बताने वाला नियम नहीं।')}
 case 'circuit-logic':{
  const s1=(v&1)===1,s2=(v&2)===2,s3=(k+L)%2===0;
  let lit,setup,setupHi;
  if(k===0){lit=s1&&s2;setup='two switches A and B in series';setupHi='दो स्विच A और B श्रृंखला में'}
  if(k===1){lit=s1||s2;setup='two switches A and B in parallel';setupHi='दो स्विच A और B समांतर में'}
  if(k===2){lit=s1&&s2&&s3;setup=`three switches A, B and C in series (C ${s3?'closed':'open'})`;setupHi=`तीन स्विच A B C श्रृंखला में (C ${s3?'बंद':'खुला'})`}
  if(k===3){lit=s1||s2||s3;setup=`three switches A, B and C in parallel (C ${s3?'closed':'open'})`;setupHi=`तीन स्विच A B C समांतर में (C ${s3?'बंद':'खुला'})`}
  if(k===4){lit=s3&&(s1||s2);setup=`A and B in parallel, then master switch C in series (C ${s3?'closed':'open'})`;setupHi=`A व B समांतर, फिर C मुख्य स्विच श्रृंखला में (C ${s3?'बंद':'खुला'})`}
  const opts=[
   'On: a complete conducting path exists',
   'Off: every conducting path is interrupted',
   'On: an open switch allows current to pass',
   'Off: a closed switch prevents current flow'
  ];
  const optsHi=[
   'जलेगा: करंट का पूरा बंद रास्ता है',
   'नहीं जलेगा: करंट के सभी रास्ते टूटे हैं',
   'जलेगा: खुला स्विच करंट को जाने देता है',
   'नहीं जलेगा: बंद स्विच करंट रोकता है'
  ];
  return choice(g,a,k,v,`Ideal circuit: one lamp, ${setup}. A is ${s1?'closed':'open'}; B is ${s2?'closed':'open'}. Which statement correctly explains the lamp?`,`आदर्श सर्किट: एक बल्ब, ${setupHi}। A ${s1?'बंद':'खुला'}; B ${s2?'बंद':'खुला'}। कौन-सा कथन सही कारण बताता है?`,opts,optsHi,lit?opts[0]:opts[1],lit?'At least one complete conducting route exists.':'Every possible conducting route is interrupted by at least one open switch.',lit?'करंट बहने के लिए कम से कम एक पूरा बंद रास्ता है।':'करंट के हर संभावित रास्ते में कम से कम एक खुला स्विच है।')
 }
 case 'story-creator':{
  const subjects=['a curious robot','a lost map','a seed in a garden','a flying paper plane','a friendly alien'];const h=['जिज्ञासु रोबोट','खोया नक्शा','बगीचे का बीज','उड़ता कागज़ का हवाई जहाज़','दोस्ताना एलियन'];return reflect(g,a,k,v,`Invent a short scene about ${subjects[k]}. ${['Add a surprising ending.','Give a character a new goal.','Tell it from another point of view.','Find a different solution.'][v]}`,` ${h[k]} पर एक दृश्य सोचें। ${['अनोखा अंत दें।','पात्र को नया लक्ष्य दें।','दूसरे नज़रिए से बताएँ।','एक अलग समाधान सोचें।'][v]}`,'You can think, draw or speak; nothing is uploaded.','आप सोच, चित्र बना या बोल सकते हैं; कुछ अपलोड नहीं होता।')}
 case 'design-challenge':{
  const things=['a pencil holder','a reusable bottle','a classroom notice','a study corner','a lunch box'];const h=['पेंसिल होल्डर','पानी की बोतल','कक्षा की सूचना','पढ़ाई का कोना','टिफ़िन बॉक्स'];return reflect(g,a,k,v,`Redesign ${things[k]} to ${['make it easier to carry','use less material','work for more people','make it easier to clean'][v]}. Explain for whom.`,` ${h[k]} को ${['आसानी से ले जाने','कम सामग्री लगाने','ज़्यादा लोगों के उपयोग','आसानी से साफ करने'][v]} के लिए बेहतर बनाएँ। किसके लिए?`)}
 case 'idea-mixer':{
  const a1=['paper','a garden','a clock','a backpack','a desk'][k],a2=['a map','a story','a ruler','a light','a box'][v%5];return reflect(g,a,k,v,`Combine ${a1} and ${a2} into a playful, safe new idea. Who might use it?`,` ${['कागज़','बगीचा','घड़ी','बैग','मेज़'][k]} और ${['नक्शा','कहानी','स्केल','लाइट','डिब्बा'][v%5]} को मिलाकर नया सुरक्षित विचार सोचें। कौन उपयोग करेगा?`)}
 case 'invent-something':{
  const issue=['keeping books tidy','saving water','remembering chores','organizing pencils','sharing a table'][k];const hiIssue=['किताबें व्यवस्थित रखना','पानी बचाना','काम याद रखना','पेंसिल व्यवस्थित रखना','मेज़ साझा करना'][k];return reflect(g,a,k,v,`Invent a simple safe tool for ${issue}. ${['Sketch a first idea.','Try a different material.','Explain how to make it easier to use.','Describe a way to test it safely.'][v]}`,` ${hiIssue} के लिए सुरक्षित चीज़ सोचें। ${['पहला चित्र बनाएं।','दूसरी सामग्री सोचें।','इसे आसान कैसे करेंगे?','सुरक्षित जाँच कैसे करेंगे?'][v]}`)}
 case 'team-planner':{
  const task=['prepare a wall poster','arrange a reading corner','make a paper garden','organize library books','plan a quiz'][k];const h=['दीवार पोस्टर बनाना','पढ़ने का कोना सजाना','कागज़ का बगीचा बनाना','पुस्तकालय की किताबें लगाना','प्रश्नोत्तरी बनाना'][k];return reflect(g,a,k,v,`A small team wants to ${task}. ${['Share three roles fairly.','Include someone quiet.','Adapt if one person is absent.','Decide how to check progress.'][v]}`,`एक छोटी टीम ${h} चाहती है। ${['तीन भूमिकाएँ ठीक से बाँटें।','कम बोलने वाले को शामिल करें।','एक साथी न हो तो योजना बदलें।','काम की जाँच कैसे करेंगे?'][v]}`)}
 case 'communication-quest':{
  const m=['a teammate is unsure','someone asks for a pause','two friends misunderstand','a learner wants help','a group has a new idea'][k];const h=['एक साथी अनिश्चित है','किसी को विराम चाहिए','दो दोस्त गलत समझ रहे हैं','किसी को मदद चाहिए','समूह के पास नया विचार है'][k];return reflect(g,a,k,v,`Imagine ${m}. ${['Say something respectful.','Ask a helpful question.','Listen and paraphrase.','Offer a next step.'][v]}`,`मानिए कि ${h}। ${['सम्मानजनक बात कहें।','मददगार सवाल पूछें।','सुनकर अपने शब्दों में कहें।','अगला कदम बताएं।'][v]}`)}
 case 'conflict-choices':{
  const cases=['choosing a game','dividing supplies','setting a meeting time','selecting an idea','sharing turns'];const h=['खेल चुनना','सामान बाँटना','मिलने का समय चुनना','विचार चुनना','बारी-बारी खेलना'];return reflect(g,a,k,v,`Two friends disagree about ${cases[k]}. ${['Suggest a fair turn-taking method.','Ask why each option matters.','Offer a compromise.','Suggest a respectful pause.'][v]}`,`दो दोस्त ${h[k]} पर असहमत हैं। ${['बारी-बारी का तरीका बताएं।','हर विकल्प क्यों जरूरी है पूछें।','बीच का रास्ता सुझाएँ।','सम्मान से विराम लेने को कहें।'][v]}`)}
 case 'cooperation-challenge':{
  const tasks=['build a paper tower','solve a map','write a group story','make a classroom display','sort picture cards'];const h=['कागज़ का टावर बनाना','नक्शा सुलझाना','समूह कहानी लिखना','कक्षा का डिस्प्ले बनाना','चित्र कार्ड छाँटना'];return reflect(g,a,k,v,`Imagine a group trying to ${tasks[k]}. ${['Choose two roles.','Make a plan to share turns.','Adapt to a missing tool.','Celebrate an actual contribution.'][v]}`,`समूह ${h[k]} चाहता है। ${['दो भूमिकाएँ चुनें।','बारी-बारी की योजना बनाएं।','एक उपकरण कम हो तो बदलाव सोचें।','किसी की वास्तविक मदद सराहें।'][v]}`)}
 case 'resource-manager':{
  const per=2+k+L,quantity=3+v;answer=per*quantity;return number(g,a,k,v,`Each activity kit needs ${per} cards. How many cards for ${quantity} complete kits?`,`हर गतिविधि किट में ${per} कार्ड लगते हैं। ${quantity} पूरी किट के लिए कितने कार्ड?`,answer,`${per} × ${quantity} = ${answer}.`,`${per} × ${quantity} = ${answer}।`)}
 case 'plan-b-challenge':{
  const original=10+k*20+v*L,extra=k+v+L,answer=original+extra;return number(g,a,k,v,`A project needs ${original} minutes. A new step adds ${extra} minutes. What is the revised time?`,`एक काम को ${original} मिनट लगते हैं। नया चरण ${extra} मिनट जोड़ता है। अब कुल समय?`,answer,`Add ${original} + ${extra} = ${answer}.`,` ${original} + ${extra} = ${answer} जोड़ें।`)}
 case 'mission-scheduler':{
  const [events,eventsHi]=STORY_TASKS[k*4+v];return order(g,a,k,v,'Put these dependent tasks in a workable order.','ये निर्भर काम उचित क्रम में करें।',events,eventsHi,'Prepare first, carry out the work, then review.','पहले तैयारी, फिर काम, फिर जाँच।')}
 case 'change-the-rules':{
  const target=10+k*20+v*L,values=[target-2,target-1,target,target+2];return choice(g,a,k,v,`The rule changed: choose the SMALLEST number that is at least ${target}.`,`नियम बदल गया: ${target} से कम न हो, ऐसा सबसे छोटा अंक चुनें।`,strings(values),strings(values),String(target),`${target} is the smallest listed number meeting the new minimum.`,` ${target} नई न्यूनतम शर्त पूरा करने वाली सबसे छोटी संख्या है।`)}
 default:throw Error('Unknown additional game '+g);
 }
}
export function getExtraBank(gameId,ageBand){if(!EXTRA_GAMES.some(x=>x.id===gameId)||!levels[ageBand])throw Error('Unknown game / age band');let items=[];for(let k=0;k<5;k++)for(let v=0;v<4;v++)items.push(build(gameId,ageBand,k,v));if(new Set(items.map(x=>x.id)).size!==20)throw Error('Duplicate task IDs');return items}