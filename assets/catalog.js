import {getAgeAdaptiveBank} from './age-adaptive.js';
import {getAgeAdaptiveBBank} from './age-adaptive-b.js';
import {EXTRA_GAMES,getExtraBank} from './expanded-library.js';
/** Eight exploratory practice modules. NOT normed aptitude tests or career predictions.
 * All question keys are deterministic and all content is bundled: no AI or network needed.
 */
import {getBank as patternBank, AGE_BANDS, selectSession} from './pattern-engine.js';
export {AGE_BANDS,selectSession};
export const GAMES=Object.freeze([
 {id:'pattern-quest', category:'logical-reasoning',en:'Pattern Quest',hi:'पैटर्न खोज',enDomain:'Logic & Patterns',hiDomain:'तर्क और पैटर्न',icon:'◈',description:'Discover rules in visual and number sequences.',descHi:'आकृतियों और संख्याओं के क्रम में नियम खोजें.',mode:'scored'},
 {id:'number-market',category:'numerical',en:'Number Market',hi:'नंबर बाज़ार',enDomain:'Numbers',hiDomain:'संख्याएँ',icon:'₹',description:'Solve shopping, sharing and budgeting puzzles.',descHi:'खरीदारी, बाँटने और बजट की पहेलियाँ हल करें।',mode:'scored'},
 {id:'story-detective',category:'language',en:'Story Detective',hi:'कहानी जासूस',enDomain:'Language',hiDomain:'भाषा',icon:'✎',description:'Find clues and meaning in short stories.',descHi:'छोटी कहानियों में संकेत और अर्थ खोजें।',mode:'scored'},
 {id:'shape-builder',category:'spatial',en:'Shape Builder',hi:'आकृति निर्माता',enDomain:'Spatial',hiDomain:'स्थानिक सोच',icon:'▧',description:'Turn shapes, mirror arrows and navigate grids.',descHi:'आकृतियाँ घुमाएँ, प्रतिबिंब पहचानें और ग्रिड में रास्ता खोजें।',mode:'scored'},
 {id:'fix-the-machine',category:'practical',en:'Fix the Machine',hi:'मशीन समझो',enDomain:'Practical',hiDomain:'व्यावहारिक',icon:'⚙',description:'Explore gears, levers, circuits and simple machines.',descHi:'गियर, लीवर, सर्किट और सरल मशीनें समझें।',mode:'scored'},
 {id:'creative-studio',category:'creative',en:'Creative Studio',hi:'क्रिएटिव स्टूडियो',enDomain:'Creative',hiDomain:'रचनात्मक',icon:'✦',description:'Try small design and idea challenges. No right or wrong answers.',descHi:'डिज़ाइन और नए विचार आज़माएँ। यहाँ सही-गलत अंक नहीं हैं।',mode:'reflection'},
 {id:'perspective-explorer',category:'social',en:'Perspective Explorer',hi:'नज़रिया खोजो',enDomain:'Social exploration',hiDomain:'सामाजिक समझ',icon:'♡',description:'Reflect on different ways people can work together.',descHi:'लोग साथ कैसे काम कर सकते हैं, इस पर विचार करें।',mode:'reflection'},
 {id:'strategy-island',category:'planning',en:'Strategy Island',hi:'रणनीति द्वीप',enDomain:'Planning',hiDomain:'योजना',icon:'➜',description:'Plan with time, supply and route constraints.',descHi:'समय, सामान और रास्ते की सीमाओं के साथ योजना बनाएँ।',mode:'scored'},
 ...EXTRA_GAMES
]);
export const GAME_IDS=GAMES.map(g=>g.id);
const LEVEL={'6-10':0,'11-14':1,'15-17':2,'18+':3};
const assertAge=age=>{if(!(age in LEVEL))throw new Error('Unknown age band')};
function stableHash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function shuffle(a,seed){let x=stableHash(seed)||1;let out=a.slice();for(let i=out.length-1;i>0;i--){x^=x<<13;x^=x>>>17;x^=x<<5;let j=(x>>>0)%(i+1);[out[j],out[i]]=[out[i],out[j]];}return out}
function intOptions(answer,delta,id){const a=[answer,answer+delta,answer-delta,answer+delta*2,answer-delta*2,answer+delta*3,answer+1,answer-1];const choices=[...new Set(a.filter(n=>Number.isSafeInteger(n)&&n>=0))].slice(0,4);if(choices.length!==4 || !choices.includes(answer))throw Error('invalid options '+id);return shuffle(choices.map(String),id)}
function task(game,age,kind,v,data){const id=`${game}:${age}:${kind}:${v}`;const mode=data.mode||'scored';
 const choices=data.choices||intOptions(data.answer,data.step||Math.max(1,Math.floor(Number(data.answer)/5)||1),id);
 const labelsHi=data.labelsHi||choices;
 if(choices.length<2 || new Set(choices).size!==choices.length || (mode==='scored'&&!choices.includes(String(data.answer))))throw new Error('Invalid game choices '+id);
 return Object.freeze({id,gameId:game,categoryId:GAMES.find(g=>g.id===game)?.category,ageBand:age,kind,variant:v,difficulty:1+LEVEL[age],mode,question:data.q,questionHi:data.qHi,context:data.context||'',contextHi:data.contextHi||'',sequence:data.sequence||[],choices:choices.map(String),labelsHi,answer:mode==='scored'?String(data.answer):null,explanation:data.explanation||'',explanationHi:data.explanationHi||'',feedbackByChoice:data.feedbackByChoice||null,feedbackByChoiceHi:data.feedbackByChoiceHi||null,contentVersion:1,reviewed:false});
}
function namedChoices(values,translated,answer,id){const idx=shuffle(values.map((v,i)=>i),id);return {choices:idx.map(i=>values[i]),labelsHi:idx.map(i=>translated[i]),answer};}
function makeNumber(age,kind,v){const m=[1,2,4,7][LEVEL[age]], id=`number:${age}:${kind}:${v}`;let q,qHi,answer,explanation,explanationHi,step=m;
 if(kind==='total'){const a=(3+v)*m,b=(5+2*v)*m;answer=a+b;q=`A notebook costs ₹${a} and a pencil costs ₹${b}. How much for both?`;qHi=`एक कॉपी ₹${a} और पेंसिल ₹${b} की है। दोनों की कीमत कितनी?`;explanation=`Add ₹${a} + ₹${b} = ₹${answer}.`;explanationHi=`₹${a} + ₹${b} = ₹${answer} जोड़ें।`}
 if(kind==='change'){const a=(20+8*v)*m,b=(8+3*v)*m;answer=a-b;q=`You pay ₹${a} for an item costing ₹${b}. What change should you receive?`;qHi=`आप ₹${b} की चीज़ के लिए ₹${a} देते हैं। कितने रुपये वापस मिलेंगे?`;explanation=`Subtract ₹${b} from ₹${a} to get ₹${answer}.`;explanationHi=`₹${a} में से ₹${b} घटाने पर ₹${answer} बचते हैं।`}
 if(kind==='groups'){const pack=2+v,each=(3+LEVEL[age]+v);answer=pack*each;q=`There are ${pack} packs with ${each} stickers each. How many stickers altogether?`;qHi=`${pack} पैकेट हैं और हर पैकेट में ${each} स्टिकर हैं। कुल कितने स्टिकर?`;explanation=`${pack} × ${each} = ${answer} stickers.`;explanationHi=`${pack} × ${each} = ${answer} स्टिकर।`;step=pack;}
 if(kind==='price-cut'){const a=(22+6*v)*m,b=(4+v)*m;answer=a-b;q=`A book costs ₹${a}. The shop reduces its price by ₹${b}. What is the new price?`;qHi=`एक किताब ₹${a} की थी। कीमत ₹${b} कम हुई। नई कीमत कितनी?`;explanation=`₹${a} − ₹${b} = ₹${answer}.`;explanationHi=`₹${a} − ₹${b} = ₹${answer}।`}
 if(kind==='share'){const people=2+v,per=3+LEVEL[age]+v,total=people*per;answer=per;q=`Share ${total} identical counters equally among ${people} friends. How many does each get?`;qHi=`${total} काउंटर ${people} दोस्तों में बराबर बाँटें। हर एक को कितने मिलेंगे?`;explanation=`${total} ÷ ${people} = ${answer}.`;explanationHi=`${total} ÷ ${people} = ${answer}।`;step=1;}
 return task('number-market',age,kind,v,{q,qHi,answer,step,explanation,explanationHi});
}
const NAMES=['Asha','Mira','Kabir','Zoya'];const HNAMES=['आशा','मीरा','कबीर','ज़ोया'];
function makeStory(age,kind,v){const name=NAMES[v],hi=HNAMES[v];let context,contextHi,q,qHi,raw,translated,answer;
 const extra=LEVEL[age]>1?' After the activity, the group wrote down what they had observed.':'';
 if(kind==='detail'){
 const colors=['blue','yellow','red','green'],hcolors=['नीली','पीली','लाल','हरी'],correct=colors[v];
 context=`${name} packed a ${correct} notebook and a pencil for class.${extra}`;contextHi=`${hi} कक्षा के लिए ${hcolors[v]} कॉपी और पेंसिल ले गए।`;
 q='What color was the notebook?';qHi='कॉपी किस रंग की थी?';raw=colors;translated=['नीला','पीला','लाल','हरा'];answer=correct;
 }
 if(kind==='order'){
 const actions=[['washed the cup','filled it with water','placed it on the table'],['opened a book','read one page','closed the book'],['drew a map','colored the roads','wrote the title'],['planted a seed','watered the soil','marked the pot']][v];
 const hiActions=[['कप धोया','उसमें पानी भरा','उसे मेज़ पर रखा'],['किताब खोली','एक पन्ना पढ़ा','किताब बंद की'],['नक्शा बनाया','सड़कों में रंग भरा','शीर्षक लिखा'],['बीज लगाया','मिट्टी में पानी डाला','गमले पर निशान लगाया']][v];
 context=`First, ${name} ${actions[0]}. Next, ${name} ${actions[1]}. Finally, ${name} ${actions[2]}.`;contextHi=`पहले ${hi} ने ${hiActions[0]}। फिर ${hiActions[1]}। आखिर में ${hiActions[2]}।`;
 q='What happened second?';qHi='दूसरे नंबर पर क्या हुआ?';raw=[...actions,'asked a friend'];translated=[...hiActions,'दोस्त से पूछा'];answer=actions[1];
 }
 if(kind==='reason'){
 const events=[['put the drawing in a folder','the rain started','बारिश शुरू हुई','चित्र को फ़ोल्डर में रखा'],['turned on a lamp','the room became dark','कमरे में अँधेरा हो गया','लैंप जलाया'],['carried a water bottle','the walk was long','पैदल रास्ता लंबा था','पानी की बोतल साथ ली'],['closed the window','a strong wind started','तेज़ हवा चलने लगी','खिड़की बंद की']][v];
 context=`${name} ${events[0]} because ${events[1]}.`;contextHi=`${hi} ने ${events[3]} क्योंकि ${events[2]}।`;
 q='Which reason is stated in the story?';qHi='कहानी में कौन-सा कारण बताया गया है?';raw=['the rain started','the room became dark','the walk was long','a strong wind started'];translated=['बारिश शुरू हुई','कमरे में अँधेरा हो गया','रास्ता लंबा था','तेज़ हवा चली'];answer=events[1];
 }
 if(kind==='evidence'){
 const objects=[['a sign said “Wet Paint”','the paint could be wet','एक संकेत पर “गीला पेंट” लिखा था','पेंट गीला हो सकता था'],['the calendar showed Monday','it was Monday','कैलेंडर में सोमवार दिख रहा था','सोमवार था'],['the thermometer read 30°C','the reading was 30°C','थर्मामीटर पर 30°C लिखा था','तापमान 30°C दर्ज था'],['the ticket said Seat 12','the seat number was 12','टिकट पर सीट 12 लिखी थी','सीट नंबर 12 था']][v];
 context=`${name} noticed that ${objects[0]}.`;contextHi=`${hi} ने देखा कि ${objects[2]}।`;
 q='Which observation directly supports the conclusion?';qHi='कौन-सा देखा गया प्रमाण इस निष्कर्ष का समर्थन करता है?';
 // Distinct examples: infer explicit evidence-to-conclusion mapping using an answer label.
 q+=` Conclusion: ${objects[1]}.`;qHi+=` निष्कर्ष: ${objects[3]}।`;
 raw=['a sign saying “Wet Paint”','a Monday calendar entry','a thermometer reading 30°C','a ticket saying Seat 12'];translated=['“गीला पेंट” का संकेत','कैलेंडर पर सोमवार','थर्मामीटर पर 30°C','सीट 12 का टिकट'];answer=raw[v];
 }
 if(kind==='infer'){
 const cases=[['the playground was wet and people carried umbrellas','it may have rained','मैदान गीला था और लोगों के पास छाते थे','शायद बारिश हुई हो'],['several pages of a book had sticky notes','someone may have been studying','किताब के कई पन्नों पर नोट लगे थे','शायद कोई पढ़ाई कर रहा था'],['the bicycle had a flat tyre','it might need repair','साइकिल का टायर पिचका था','शायद मरम्मत चाहिए'],['seeds had started to sprout','the plant was beginning to grow','बीजों से अंकुर निकल रहे थे','पौधा बढ़ना शुरू हुआ होगा']][v];
 context=`${name} observed that ${cases[0]}.`;contextHi=`${hi} ने देखा कि ${cases[2]}।`;
 q='Which cautious conclusion is most supported?';qHi='कौन-सा सावधानी से निकाला निष्कर्ष सबसे उपयुक्त है?';
 raw=['it may have rained','someone may have been studying','it might need repair','the plant was beginning to grow'];translated=['शायद बारिश हुई हो','शायद कोई पढ़ रहा था','शायद मरम्मत चाहिए','पौधा बढ़ना शुरू हुआ होगा'];answer=cases[1];
 }
 const selected=namedChoices(raw,translated,answer,`${age}:${kind}:${v}`);
 return task('story-detective',age,kind,v,{context,contextHi,q,qHi,...selected,explanation:`The story's wording supports “${answer}”. Other choices do not match this specific passage.`,explanationHi:'कहानी में दी गई जानकारी इसी उत्तर का समर्थन करती है; बाकी विकल्प यहाँ नहीं दिए गए हैं।'});
}
const DIR_ARROWS=['↑','→','↓','←'];
function rotatedIndex(i,steps){return (i+steps+16)%4}
function boardRotate(b){return [b[2],b[0],b[3],b[1]]}
function gridString(g){return `${g[0]?'■':'·'} ${g[1]?'■':'·'}\n${g[2]?'■':'·'} ${g[3]?'■':'·'}`}
function makeSpatial(age,kind,v){const id=`${age}:${kind}:${v}`,old=DIR_ARROWS[v];let q,qHi,context='',contextHi='',choices,answer,labelsHi,explanation,explanationHi;
 const moves=LEVEL[age]>=2?2:1;
 if(kind==='turn-right'||kind==='turn-left'||kind==='turn-twice'||kind==='mirror'){
  let steps=kind==='turn-right'?moves:kind==='turn-left'?-moves:kind==='turn-twice'?(moves===2?3:2):0;
  answer=kind==='mirror'?(old==='→'?'←':old==='←'?'→':old):DIR_ARROWS[rotatedIndex(v,steps)];
  q=kind==='mirror'?'Reflect this arrow in a vertical mirror. What direction will it point?':`Turn the arrow ${kind==='turn-left'?'anticlockwise': 'clockwise'} ${Math.abs(steps)*90}°. What direction does it point?`;
  qHi=kind==='mirror'?'तीर का ऊर्ध्वाधर दर्पण में प्रतिबिंब देखें। वह किस ओर होगा?':`तीर को ${kind==='turn-left'?'बाईं ओर':'दाईं ओर'} ${Math.abs(steps)*90}° घुमाएँ। अब वह किस ओर होगा?`;
  context=old;contextHi=old;choices=DIR_ARROWS.slice();labelsHi=choices;
  explanation=kind==='mirror'?'A vertical mirror swaps left and right, but keeps up and down.':`A turn of ${Math.abs(steps)*90}° ${steps<0?'anticlockwise':'clockwise'} changes the arrow to ${answer}.`;
  explanationHi=kind==='mirror'?'ऊर्ध्वाधर दर्पण में बाएँ-दाएँ बदलते हैं, ऊपर-नीचे नहीं।':`तीर घूमने के बाद ${answer} दिशा में है।`;
 }
 if(kind==='rotate-block'){
  const base=[1,0,1,1];let shape=base;for(let i=0;i<v;i++)shape=boardRotate(shape);context=gridString(shape);contextHi=context;
  const variants=[shape];for(let i=0;i<3;i++)variants.push(boardRotate(variants.at(-1)));
  choices=variants.map(gridString);answer=choices[1];labelsHi=choices;
  q='Rotate this 2×2 block 90° clockwise. Which arrangement matches?';qHi='इस 2×2 आकृति को 90° दाईं ओर घुमाएँ। कौन-सी आकृति बनेगी?';
  explanation='Each square moves one corner clockwise around the 2×2 grid.';explanationHi='हर चौकोर ब्लॉक 2×2 ग्रिड में दाईं ओर अगले कोने पर जाता है।';
 }
 return task('shape-builder',age,kind,v,{q,qHi,context,contextHi,choices,labelsHi,answer,explanation,explanationHi});
}
function makeMachine(age,kind,v){const lev=LEVEL[age];let q,qHi,context='',contextHi='',choices,labelsHi,answer,explanation,explanationHi,step=1;
 if(kind==='gears'){
   const count=2+v,first= v%2===0?'clockwise':'counterclockwise';const second=count%2===1?first:(first==='clockwise'?'counterclockwise':'clockwise');answer=second;
   q=`${count} external gears mesh in a straight chain. The first turns ${first}. How does the last turn?`;
   qHi=`${count} गियर एक कतार में जुड़े हैं। पहला ${first==='clockwise'?'घड़ी की दिशा':'घड़ी की उल्टी दिशा'} में घूमता है। आखिरी किस दिशा में घूमेगा?`;
   context=Array.from({length:count},()=> '⚙').join(' ↔ ');contextHi=context;
   choices=['clockwise','counterclockwise'];labelsHi=['घड़ी की दिशा','घड़ी की उल्टी दिशा'];
   explanation='Adjacent external gears turn opposite ways. Count the direction changes between first and last.';explanationHi='बाहर से जुड़े पड़ोसी गियर उल्टी दिशाओं में घूमते हैं। पहले से आखिरी तक दिशा बदलने की गिनती करें।';
 }
 if(kind==='lever'){
  const leftMass=3+v+lev,rightArm=lev>=2?1:2,leftArm=lev>=2?2:2;answer=leftMass*leftArm/rightArm;
  q=`On an ideal balanced lever, the left side has ${leftMass} equal weights at ${leftArm} units from the pivot. The right side is ${rightArm} unit(s) away. How many equal weights balance it?`;
  qHi=`एक आदर्श लीवर में बाईं ओर ${leftMass} समान वज़न धुरी से ${leftArm} इकाई दूर हैं। दाईं ओर दूरी ${rightArm} है। संतुलन के लिए कितने समान वज़न चाहिए?`;
  context='⚖️';contextHi=context;explanation=`Balance moments: ${leftMass} × ${leftArm} = ${answer} × ${rightArm}.`;explanationHi=`संतुलन: ${leftMass} × ${leftArm} = ${answer} × ${rightArm}।`;step=2;
 }
 if(kind==='circuit'){
  const contexts=[
   ['a series circuit with two working lamps and an open switch','दो सही बल्ब और खुले स्विच वाला सीरीज़ सर्किट','neither lamp'],
   ['a series circuit with two working lamps and a closed switch','दो सही बल्ब और बंद स्विच वाला सीरीज़ सर्किट','both lamps'],
   ['a parallel circuit with lamp A on an open-switch branch and lamp B on a closed-switch branch','समानांतर सर्किट: बल्ब A का स्विच खुला है और बल्ब B का बंद है','only lamp B'],
   ['a parallel circuit with lamp A on a closed-switch branch and lamp B on an open-switch branch','समानांतर सर्किट: बल्ब A का स्विच बंद है और बल्ब B का खुला है','only lamp A']
  ];
  const [setup,setupHi,ans]=contexts[v];answer=ans;
  q=`An ideal battery supplies ${setup}. All wires and lamps work. Which lamps light?`;
  qHi=`एक बैटरी ${setupHi} से जुड़ी है। तार और बल्ब सही हैं। कौन-सा बल्ब जलेगा?`;
  choices=['both lamps','neither lamp','only lamp A','only lamp B'];
  labelsHi=['दोनों बल्ब','कोई बल्ब नहीं','केवल बल्ब A','केवल बल्ब B'];
  explanation=ans==='neither lamp'?'The open series switch breaks the only current path.':ans==='both lamps'?'The closed series switch completes the path through both lamps.':'In parallel, each branch has its own path: only the closed-switch branch lights.';
  explanationHi=ans==='neither lamp'?'खुला सीरीज़ स्विच दोनों के लिए रास्ता तोड़ देता है।':ans==='both lamps'?'बंद सीरीज़ स्विच दोनों बल्बों का रास्ता पूरा करता है।':'समानांतर सर्किट में हर शाखा अलग होती है; बंद स्विच वाली शाखा का बल्ब जलता है।';
  context=v<2?'🔋 — 💡 — 💡':'🔋 ⇉ 💡 A / 💡 B';contextHi=context;
 }
 if(kind==='ramp'){
  const d=[3+v,5+v,7+v,9+v].map(n=>n*(lev+1));answer=Math.max(...d);
  q='Four straight ramps rise to the same height. Which horizontal run makes the gentlest slope?';qHi='चार सीधे रैंप एक ही ऊँचाई तक जाते हैं। किसकी क्षैतिज लंबाई सबसे अधिक होने से ढलान सबसे कम होगी?';
  choices=d.map(String);labelsHi=choices;context='↗';contextHi='↗';
  explanation=`For equal height, a longer horizontal run makes a gentler slope. Here that is ${answer} units.`;
  explanationHi=`एक ही ऊँचाई के लिए अधिक क्षैतिज लंबाई से ढलान कम होती है। यहाँ ${answer} इकाई।`;
 }
 if(kind==='pulley'){
  const cases=[
   ['You pull the free end downward. Which way does the load move?','आप रस्सी का खाली सिरा नीचे खींचते हैं। भार किधर जाएगा?','up'],
   ['You want the load to move upward. Which way should you pull the free end?','आप भार को ऊपर ले जाना चाहते हैं। खाली सिरे को किधर खींचेंगे?','down'],
   ['You pull the free end upward. Which way does the load move?','आप खाली सिरा ऊपर खींचते हैं। भार किस ओर जाएगा?','down'],
   ['You want the load to move downward. Which way should you move the free end?','आप भार को नीचे ले जाना चाहते हैं। खाली सिरा किस ओर ले जाएँगे?','up']
  ];
  const [eng,hindi,ans]=cases[v];answer=ans;
  q=`An ideal single fixed pulley has a load on one end of a taut rope. ${eng}`;
  qHi=`एक आदर्श स्थिर पुली में रस्सी के एक सिरे पर भार है। ${hindi}`;
  choices=['up','down','left','right'];labelsHi=['ऊपर','नीचे','बाएँ','दाएँ'];context='◯  ↕';contextHi=context;
  explanation='With a fixed pulley and a taut rope, moving the free end one way moves the load in the opposite vertical direction.';
  explanationHi='स्थिर पुली में तनी रस्सी के खाली सिरे को जिस दिशा में चलाएँ, भार ऊर्ध्वाधर दिशा में उसके विपरीत चलता है।';
 }
 return task('fix-the-machine',age,kind,v,{q,qHi,context,contextHi,choices,labelsHi,answer,step,explanation,explanationHi});
}
const CREATIVE={
 'redesign':[['a backpack','स्कूल बैग'],['a water bottle','पानी की बोतल'],['a pencil box','पेंसिल बॉक्स'],['a study desk','पढ़ाई की मेज़']],
 'invent':[['a cardboard box','गत्ते का डिब्बा'],['a paper cup','कागज़ का कप'],['a notebook','कॉपी'],['a rubber band','रबर बैंड']],
 'story':[['an unexpected visitor','अचानक आए मेहमान'],['a lost key','खोई हुई चाबी'],['a new planet','नए ग्रह'],['a tiny robot','छोटे रोबोट']],
 'limit':[['three pieces of paper','कागज़ के तीन टुकड़े'],['two cups and string','दो कप और धागा'],['a small safe box','एक छोटा सुरक्षित डिब्बा'],['four colored pencils','चार रंगीन पेंसिल']],
 'alternate':[['a playground','खेल का मैदान'],['a library corner','पुस्तकालय का कोना'],['a classroom board','कक्षा का बोर्ड'],['a bus stop','बस स्टॉप']]
};
const CREFLECT=['I made one idea','I explored two ideas','I changed my approach','I want to try again'];const CREFLECT_HI=['मैंने एक विचार बनाया','मैंने दो विचार सोचे','मैंने तरीका बदला','मैं फिर कोशिश करना चाहता/चाहती हूँ'];
function makeCreative(age,kind,v){const [thing,hiThing]=CREATIVE[kind][v];const prompts={redesign:`Sketch one way to make ${thing} easier for someone to use.`,invent:`Imagine a new, safe use for ${thing}. Explain it aloud or on paper.`,story:`Invent a short story featuring ${thing}. What surprising thing happens?`,limit:`Design something using only ${thing}. Explain how you would use it safely.`,alternate:`Think of two different ways to improve ${thing}. What would each help with?`};
 const hprompts={redesign:`${hiThing} को इस्तेमाल में आसान बनाने का एक तरीका सोचें और चित्र बनाएँ।`,invent:`${hiThing} का कोई नया सुरक्षित उपयोग सोचें। बोलकर या कागज़ पर समझाएँ।`,story:`${hiThing} पर एक छोटी कहानी सोचें। उसमें क्या अनोखा होगा?`,limit:`सिर्फ ${hiThing} से कुछ बनाएँ। बताइए इसे सुरक्षित तरीके से कैसे इस्तेमाल करेंगे।`,alternate:`${hiThing} को बेहतर करने के दो तरीके सोचें। दोनों किस काम आएँगे?`};
 return task('creative-studio',age,kind,v,{mode:'reflection',q:prompts[kind],qHi:hprompts[kind],context:'Try it on paper or in your imagination. Then choose a truthful reflection; there is no score.',contextHi:'कागज़ पर या मन में कोशिश करें। फिर सच के अनुसार विकल्प चुनें; कोई अंक नहीं हैं।',choices:CREFLECT,labelsHi:CREFLECT_HI,feedbackByChoice:Object.fromEntries(CREFLECT.map(c=>[c,'Thanks for reflecting. Trying ideas is useful practice.'])),feedbackByChoiceHi:Object.fromEntries(CREFLECT.map(c=>[c,'अपने अनुभव पर सोचने के लिए धन्यवाद। नए विचार आज़माना भी सीखना है।']))});
}
const SOCIAL={
 'invite':[['a new classmate joins a group activity','नया सहपाठी समूह गतिविधि में आता है'],['one player is quiet','एक खिलाड़ी चुप है'],['someone misses the first round','किसी ने पहला दौर छोड़ दिया'],['a teammate is unfamiliar with the game','साथी को खेल की जानकारी नहीं है']],
 'disagree':[['two students suggest different designs','दो छात्रों के डिज़ाइन अलग हैं'],['friends prefer different routes','दोस्त अलग रास्ते पसंद करते हैं'],['group members choose different stories','समूह के सदस्य अलग कहानियाँ चुनते हैं'],['teammates offer different strategies','साथी अलग तरीके बताते हैं']],
 'help':[['a friend asks for a hint','दोस्त संकेत माँगता है'],['a teammate makes a mistake','साथी से गलती हो जाती है'],['a player finds the task hard','खिलाड़ी को काम मुश्किल लगता है'],['someone says they need a break','कोई कहता है कि उसे आराम चाहिए']],
 'feedback':[['a teammate shares a drawing','साथी चित्र दिखाता है'],['a friend explains their idea','दोस्त अपना विचार समझाता है'],['someone builds a model','कोई मॉडल बनाता है'],['a teammate finishes a story','साथी कहानी पूरी करता है']],
 'turns':[['two friends want the same role','दो दोस्त एक ही भूमिका चाहते हैं'],['a group has only one marker','समूह में एक ही मार्कर है'],['several people want to speak','कई लोग बोलना चाहते हैं'],['three teammates want to lead','तीन साथी नेतृत्व करना चाहते हैं']]
};
const SREFLECT=['Ask what others think','Listen first','Suggest taking turns','Take a short pause'];const SREFLECT_HI=['दूसरों की राय पूछें','पहले सुनें','बारी-बारी की बात करें','थोड़ा विराम लें'];
function makeSocial(age,kind,v){const [scenario,scenarioHi]=SOCIAL[kind][v];return task('perspective-explorer',age,kind,v,{mode:'reflection',q:`Imagine this situation: ${scenario}. Which approach would you explore, and why?`,qHi:`यह स्थिति सोचें: ${scenarioHi}। आप कौन-सा तरीका आज़माएँगे और क्यों?`,context:'Different approaches can help in different contexts. No personality or social-ability score is calculated.',contextHi:'अलग स्थितियों में अलग तरीके उपयोगी हो सकते हैं। कोई व्यक्तित्व या सामाजिक क्षमता स्कोर नहीं बनेगा।',choices:SREFLECT,labelsHi:SREFLECT_HI,feedbackByChoice:Object.fromEntries(SREFLECT.map(c=>[c,`You chose “${c}”. Consider how others might feel and what could happen next.`])),feedbackByChoiceHi:Object.fromEntries(SREFLECT.map(c=>[c,'सोचें कि दूसरे लोग कैसा महसूस करेंगे और आगे क्या हो सकता है।']))});}
function makeStrategy(age,kind,v){const m=LEVEL[age]+1;let q,qHi,answer,step=m,explanation,explanationHi;
 if(kind==='schedule'){const a=(4+v)*m,b=(3+v)*m;answer=a+b;q=`Two tasks need ${a} and ${b} minutes, with no break. How many minutes are needed in total?`;qHi=`दो कामों में बिना विराम के ${a} और ${b} मिनट लगते हैं। कुल कितने मिनट चाहिए?`;explanation=`${a} + ${b} = ${answer} minutes.`;explanationHi=`${a} + ${b} = ${answer} मिनट।`}
 if(kind==='supplies'){const kits=2+v,each=(3+m),total=kits*each;answer=kits;q=`One kit needs ${each} tokens. You have ${total} tokens. How many complete kits can you make?`;qHi=`एक किट में ${each} टोकन लगते हैं। आपके पास ${total} टोकन हैं। कितनी पूरी किट बनेंगी?`;explanation=`${total} ÷ ${each} = ${answer}.`;explanationHi=`${total} ÷ ${each} = ${answer}।`;step=1;}
 if(kind==='route'){const a=(7+v)*m,b=(4+v)*m,c=(9+v)*m,d=(6+v)*m;answer=Math.min(a,b,c,d);q=`Four routes are ${a}, ${b}, ${c} and ${d} blocks long. Which length is the shortest?`;qHi=`चार रास्तों की लंबाई ${a}, ${b}, ${c} और ${d} ब्लॉक है। सबसे छोटा रास्ता कितने ब्लॉक का है?`;explanation=`The smallest length is ${answer} blocks.`;explanationHi=`सबसे कम लंबाई ${answer} ब्लॉक है।`;step=m;}
 if(kind==='change-plan'){const planned=(6+v)*m,extra=(2+v)*m;answer=planned+extra;q=`A project was planned for ${planned} minutes. An extra step takes ${extra} minutes. What is the revised total?`;qHi=`एक परियोजना में ${planned} मिनट लगने थे। नया चरण ${extra} मिनट लेगा। अब कुल कितने मिनट चाहिए?`;explanation=`${planned} + ${extra} = ${answer}.`;explanationHi=`${planned} + ${extra} = ${answer}।`}
 if(kind==='capacity'){const capacity=3+v,total=capacity*(3+m)+(v+1);answer=Math.floor(total/capacity);q=`Each box holds at most ${capacity} pieces. You have ${total} pieces. How many full boxes can you fill?`;qHi=`हर डिब्बे में अधिकतम ${capacity} चीज़ें आती हैं। आपके पास ${total} चीज़ें हैं। कितने पूरे डिब्बे भरेंगे?`;explanation=`${total} ÷ ${capacity} leaves ${answer} full boxes and some leftovers.`;explanationHi=`${total} को ${capacity} से बाँटने पर ${answer} पूरे डिब्बे और कुछ बची चीज़ें मिलती हैं।`;step=1;}
 return task('strategy-island',age,kind,v,{q,qHi,answer,step,explanation,explanationHi});
}
const KINDS={
 'number-market':['total','change','groups','price-cut','share'],
 'story-detective':['detail','order','reason','evidence','infer'],
 'shape-builder':['turn-right','turn-left','turn-twice','mirror','rotate-block'],
 'fix-the-machine':['gears','lever','circuit','ramp','pulley'],
 'creative-studio':['redesign','invent','story','limit','alternate'],
 'perspective-explorer':['invite','disagree','help','feedback','turns'],
 'strategy-island':['schedule','supplies','route','change-plan','capacity']
};
const BUILDERS={'number-market':makeNumber,'story-detective':makeStory,'shape-builder':makeSpatial,'fix-the-machine':makeMachine,'creative-studio':makeCreative,'perspective-explorer':makeSocial,'strategy-island':makeStrategy};
export function getGameBank(gameId,ageBand){assertAge(ageBand);const m12=getAgeAdaptiveBank(gameId,ageBand);if(m12)return m12;const m12b=getAgeAdaptiveBBank(gameId,ageBand);if(m12b)return m12b;if(gameId==='pattern-quest')return patternBank(ageBand).map(p=>({...p,mode:'scored',questionHi:'इसके बाद क्या आएगा?',explanationHi:'क्रम का नियम देखें। सही अगला उत्तर '+p.answer+' है।',context:'',contextHi:''}));
 const kinds=KINDS[gameId];if(!kinds)return getExtraBank(gameId,ageBand);const bank=kinds.flatMap(k=>Array.from({length:4},(_,v)=>BUILDERS[gameId](ageBand,k,v)));
 if(bank.length!==20 || new Set(bank.map(x=>x.id)).size!==20)throw new Error('Invalid bank');return bank;
}
export function evaluate(item,response){
 const raw=String(response);
 if(item.interaction==='number'){
   if(!/^-?\d{1,8}$/.test(raw))throw Error('Invalid numeric response');
   return {correct:raw===item.answer,explanation:item.explanation,explanationHi:item.explanationHi};
 }
 if(item.interaction==='order'||item.interaction==='multi'){
   const parts=raw.split('|');
   if(parts.length<1||new Set(parts).size!==parts.length||parts.some(c=>!item.choices.includes(c)))throw Error('Invalid selection');
   if(item.interaction==='order'&&parts.length!==item.choices.length)throw Error('Incomplete order');
   if(item.interaction==='multi'&&parts.length>item.choices.length)throw Error('Invalid selection count');
   const key=item.interaction==='multi'?parts.slice().sort().join('|'):raw;
   return {correct:key===item.answer,explanation:item.explanation,explanationHi:item.explanationHi};
 }
 const chosen=item.choices.indexOf(raw);if(chosen===-1)throw Error('Invalid choice');
 if(item.mode==='reflection')return {correct:null,explanation:item.feedbackByChoice?.[response]||'Reflection recorded.',explanationHi:item.feedbackByChoiceHi?.[response]||'चिंतन दर्ज हुआ।'};
 return {correct:String(response)===item.answer,explanation:item.explanation,explanationHi:item.explanationHi};}
export function recommendedGame(history,ageBand){const attempts=(history?.attempts||[]).filter(a=>a.ageBand===ageBand);const counts=new Map(GAME_IDS.map(id=>[id,attempts.filter(a=>(a.gameId||'pattern-quest')===id).length]));const minimum=Math.min(...counts.values());const options=GAME_IDS.filter(id=>counts.get(id)===minimum);return options[0];}