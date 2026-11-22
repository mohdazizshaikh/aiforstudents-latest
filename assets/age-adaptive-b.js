/** M12-B: material age-specific revisions for 14 previously identical game banks.
 * All exercises are experimental and require independent bilingual educator review.
 * This is task complexity adaptation, NOT calibration or psychometric validity.
 */
import {getExtraBank} from './expanded-library.js';
export const M12B_GAMES=Object.freeze(['word-builder','meaning-hunter','explain-it','mirror-puzzle','bridge-builder','cause-effect','story-creator','design-challenge','idea-mixer','invent-something','team-planner','communication-quest','conflict-choices','cooperation-challenge']);
const AGES=['6-10','11-14','15-17','18+'];
const WORD_SETS={
 '6-10':[['SUN','सूरज'],['CAT','बिल्ली'],['PEN','कलम'],['MAP','नक्शा'],['CUP','कप'],['HAT','टोपी'],['BAG','बैग'],['POT','गमला'],['FAN','पंखा'],['DOG','कुत्ता'],['BUS','बस'],['FOX','लोमड़ी'],['ZIP','ज़िप'],['JUG','जग'],['OWL','उल्लू'],['HEN','मुर्गी'],['PIG','सूअर'],['COW','गाय'],['ANT','चींटी'],['RED','लाल']],
 '11-14':[['PLANT','पौधा'],['CHAIR','कुर्सी'],['TRAIN','रेलगाड़ी'],['CLOUD','बादल'],['SMILE','मुस्कान'],['FRUIT','फल'],['TABLE','मेज़'],['SHELF','अलमारी की तख्ती'],['MOUSE','चूहा'],['BRICK','ईंट'],['SNAKE','साँप'],['LIGHT','रोशनी'],['OCEAN','महासागर'],['FIELD','मैदान'],['STONE','पत्थर'],['BREAD','रोटी'],['NIGHT','रात'],['BRUSH','ब्रश'],['COAST','समुद्रतट'],['WATER','पानी']],
 '15-17':[['PLANET','ग्रह'],['GARDEN','बगीचा'],['MARKET','बाज़ार'],['BRIDGE','पुल'],['CAMPUS','परिसर'],['VECTOR','सदिश'],['ORBIT','कक्षा-पथ'],['MAGNET','चुंबक'],['STREAM','जलधारा'],['MEADOW','घास का मैदान'],['POCKET','जेब'],['BRIGHT','चमकीला'],['PICTURE','चित्र'],['METHOD','विधि'],['DIALOG','संवाद'],['SQUARE','वर्ग'],['RUGBY','रग्बी'],['CANDLE','मोमबत्ती'],['VOLUME','आयतन'],['HISTORY','इतिहास']],
 '18+':[['LOGIC','तर्क'],['ETHICS','नैतिकता'],['SCHEMA','रूपरेखा'],['DESIGN','डिज़ाइन'],['FINAL','अंतिम'],['NETWORK','संजाल'],['MATRIX','आव्यूह'],['DYNAMIC','गतिशील'],['POLICY','नीति'],['METRIC','मापदंड'],['CREDIT','श्रेय'],['VALID','वैध'],['SCOPE','दायरा'],['ALGORITHM','कलनविधि'],['PREDICT','अनुमान लगाना'],['FORMULA','सूत्र'],['SURVEY','सर्वेक्षण'],['DOMAIN','क्षेत्र'],['PROBLEM','समस्या'],['FACTOR','कारक']]
};
// Unambiguous synonym/contrast pairs, no high-stakes personal interpretation.
const MEANING_SETS={
 '6-10':[
 ['happy','glad','sad','angry','slow'],['big','large','tiny','late','soft'],['fast','quick','slow','dark','wet'],['small','tiny','huge','loud','warm'],['cold','chilly','hot','bright','rough'],['hot','warm','cold','wet','slow'],['wet','damp','dry','wide','loud'],['clean','tidy','messy','late','angry'],['loud','noisy','silent','tiny','cold'],['quiet','silent','loud','quick','strong'],['easy','simple','difficult','angry','wide'],['smart','clever','sleepy','dirty','late'],['kind','caring','cruel','wet','dark'],['brave','courageous','fearful','small','soft'],['tired','sleepy','energetic','loud','wide'],['pretty','lovely','ugly','slow','cold'],['bright','shiny','dim','wet','small'],['funny','amusing','serious','heavy','dark'],['begin','start','finish','forget','break'],['end','finish','start','carry','open']],
 '11-14':[
 ['ancient','old','recent','brief','weak'],['rapid','swift','slow','fragile','dull'],['polite','courteous','rude','noisy','absent'],['fragile','delicate','sturdy','heavy','loud'],['eager','keen','bored','timid','rare'],['scarce','limited','abundant','clear','swift'],['enormous','huge','tiny','narrow','empty'],['cautious','careful','reckless','noisy','rapid'],['fortunate','lucky','unhappy','fragile','rough'],['essential','necessary','optional','fragile','ancient'],['brief','short','endless','noisy','rough'],['accurate','correct','mistaken','unclear','slow'],['generous','giving','selfish','nervous','tiny'],['obvious','clear','hidden','slow','fragile'],['curious','inquisitive','indifferent','angry','ancient'],['steady','stable','erratic','hollow','noisy'],['resilient','tough','brittle','silent','rapid'],['complex','complicated','simple','tiny','cold'],['reliable','dependable','untrustworthy','swift','wide'],['flexible','adaptable','rigid','noisy','dark']],
 '15-17':[
 ['meticulous','thorough','careless','random','unclear'],['ambiguous','unclear','definite','tiny','warm'],['concise','brief','rambling','fragile','rigid'],['credible','believable','doubtful','shiny','rapid'],['tentative','provisional','final','ancient','loud'],['robust','strong','fragile','quiet','recent'],['coherent','logical','confusing','brief','silent'],['impartial','unbiased','partial','rare','noisy'],['innovative','original','routine','timid','brief'],['feasible','practical','impossible','dull','noisy'],['relevant','pertinent','unrelated','fragile','rapid'],['subtle','nuanced','obvious','huge','slow'],['transparent','open','secretive','fragile','rapid'],['obsolete','outdated','modern','wide','silent'],['cumulative','growing','isolated','tiny','cold'],['ethical','principled','harmful','damp','rapid'],['sustainable','maintainable','wasteful','small','rapid'],['consistent','uniform','erratic','tall','swift'],['plausible','reasonable','absurd','noisy','ancient'],['objective','neutral','biased','slow','wet']],
 '18+':[
 ['rigorous','thorough','careless','casual','silent'],['empirical','observed','imaginary','ornate','swift'],['provisional','temporary','permanent','loud','fragile'],['systematic','organized','random','silent','fragile'],['equitable','fair','biased','rapid','tiny'],['replicable','repeatable','unique','noisy','ancient'],['nuanced','subtle','simplistic','loud','brief'],['pragmatic','practical','idealistic','dull','damp'],['transparent','open','concealed','fragile','rapid'],['accountable','responsible','unanswerable','tiny','ancient'],['comprehensive','complete','partial','recent','silent'],['mitigated','reduced','amplified','fragile','rapid'],['iterative','repeated','single','loud','ancient'],['inferred','deduced','observed','silent','fragile'],['verifiable','checkable','unfounded','damp','rapid'],['discrete','separate','continuous','fragile','rapid'],['robust','resilient','brittle','silent','tiny'],['contextual','situational','universal','loud','fragile'],['ambivalent','conflicted','certain','silent','rapid'],['salient','important','irrelevant','dull','ancient']]
};
const shuffle=(arr,seed)=>{const out=arr.slice();let h=2166136261;for(const c of seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}for(let i=out.length-1;i>0;i--){h^=h<<13;h^=h>>>17;h^=h<<5;const j=(h>>>0)%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out};
function base(game,age,i){return getExtraBank(game,age)[i]}
function updated(old,game,age,i,props){return {...old,...props,id:`${game}:${age}:m12b:${Math.floor(i/4)}:${i%4}`,kind:`m12b-${Math.floor(i/4)}`,variant:i%4,contentVersion:2,reviewed:false,educationalReviewStatus:'pending',translationReviewStatus:'pending',difficulty:AGES.indexOf(age)+1};}
const AGE_WORD_HELP=[
 ['Make a short English word from these letters. Hindi clue:','इन अक्षरों से छोटा अंग्रेज़ी शब्द बनाएँ। हिन्दी संकेत:'],
 ['Unscramble the English vocabulary word for','निम्न अर्थ वाला अंग्रेज़ी शब्द बनाने के लिए अक्षर क्रम में रखें:'],
 ['Rearrange the letters to form the English term described as','निम्न अर्थ वाले अंग्रेज़ी शब्द के लिए अक्षर व्यवस्थित करें:'],
 ['Construct the exact English academic or professional term for','निम्न अर्थ वाले उपयुक्त अंग्रेज़ी अकादमिक या व्यावसायिक शब्द के अक्षर क्रम में रखें:']
];
function wordBank(age){return WORD_SETS[age].map(([w,meaning],i)=>{const original=base('word-builder',age,i);const letters=[...w];if(new Set(letters).size!==letters.length)throw Error('Repeated word letters: '+w);const idx=shuffle(letters.map((_,j)=>j),`word:${age}:${i}`);const level=AGES.indexOf(age);return updated(original,'word-builder',age,i,{interaction:'order',mode:'scored',question:`${AGE_WORD_HELP[level][0]} ${meaning}.`,questionHi:`${AGE_WORD_HELP[level][1]} ${meaning}।`,context:level>1?'You can say the letters aloud before ordering them.':'',contextHi:level>1?'अक्षर क्रम में रखने से पहले बोल सकते हैं।':'',choices:idx.map(j=>letters[j]),labelsHi:idx.map(j=>letters[j]),answer:letters.join('|'),explanation:`The intended word is ${w}, meaning ${meaning}.`,explanationHi:`सही अंग्रेज़ी शब्द ${w} है, जिसका अर्थ ${meaning} है।`,reference:{kind:'spelling',word:w,meaning}})})}
function meaningBank(age){const level=AGES.indexOf(age);return MEANING_SETS[age].map(([word,good,...bads],i)=>{const old=base('meaning-hunter',age,i),all=[good,...bads],idx=shuffle([0,1,2,3],`meaning:${age}:${i}`),prefix=[
 `Which word means nearly the same as “${word}”?`,
 `In a reading passage, “${word}” describes something. Which is the closest meaning?`,
 `A writer chooses the word “${word}” carefully. Which option preserves its intended meaning most closely?`,
 `In a critical discussion, which near-synonym best preserves the meaning of “${word}”?`
 ][level],hi=[
 `“${word}” का सबसे निकट अंग्रेज़ी अर्थ कौन-सा है?`,
 `पढ़ने के पाठ में “${word}” शब्द आया है। सबसे निकट अर्थ चुनें।`,
 `लेखक ने “${word}” शब्द चुना है। कौन-सा विकल्प उसका अर्थ सबसे अच्छी तरह बताता है?`,
 `समीक्षात्मक चर्चा में “${word}” का सबसे सटीक समानार्थी शब्द चुनें।`
 ][level];return updated(old,'meaning-hunter',age,i,{interaction:'choice',mode:'scored',question:prefix,questionHi:hi,choices:idx.map(j=>all[j]),labelsHi:idx.map(j=>all[j]),answer:good,explanation:`“${word}” is close in meaning to “${good}” here; the other choices are not synonyms.`,explanationHi:`यहाँ “${word}” के सबसे करीब “${good}” है; बाकी विकल्प समानार्थी नहीं हैं।`,reference:{kind:'synonym',word,good,bads}})})}
const ARROWS=['↑','→','↓','←'];
const OPERATIONS={V:([x,y])=>[-x,y],H:([x,y])=>[x,-y],CW:([x,y])=>[y,-x],CCW:([x,y])=>[-y,x],HALF:([x,y])=>[-x,-y]};
const VECTOR=[[0,1],[1,0],[0,-1],[-1,0]];
const OP_NAMES={V:['reflect in a vertical mirror','ऊर्ध्वाधर दर्पण में प्रतिबिंब बनाएँ'],H:['reflect in a horizontal mirror','क्षैतिज दर्पण में प्रतिबिंब बनाएँ'],CW:['rotate a quarter-turn clockwise','एक चौथाई घड़ी की दिशा में घुमाएँ'],CCW:['rotate a quarter-turn anticlockwise','एक चौथाई घड़ी की उलटी दिशा में घुमाएँ'],HALF:['rotate a half-turn','आधा घुमाएँ']};
const MIRROR_PROGRAMS={
 '6-10':[['V'],['H'],['CW'],['CCW'],['HALF']],
 '11-14':[['V','CW'],['H','CCW'],['CW','V'],['H','HALF'],['V','H']],
 '15-17':[['V','CW','H'],['H','CCW','V'],['CW','H','CW'],['H','HALF','V'],['V','H','CCW']],
 '18+':[['V','CW','H','HALF'],['H','CCW','V','CW'],['CW','H','CW','V'],['H','HALF','V','CCW'],['V','H','CCW','CW']]
};
function mirrorBank(age){return Array.from({length:20},(_,i)=>{const old=base('mirror-puzzle',age,i),kind=Math.floor(i/4),v=i%4,ops=MIRROR_PROGRAMS[age][kind],vec=ops.reduce((point,op)=>OPERATIONS[op](point),VECTOR[v]),answer=ARROWS[VECTOR.findIndex(v=>v[0]===vec[0]&&v[1]===vec[1])];const q=ops.map(x=>OP_NAMES[x][0]).join(', then '),hi=ops.map(x=>OP_NAMES[x][1]).join(', फिर ');return updated(old,'mirror-puzzle',age,i,{interaction:'choice',mode:'scored',question:`Start with arrow ${ARROWS[v]}. First ${q}. What arrow is shown at the end?`,questionHi:`तीर ${ARROWS[v]} से शुरू करें। पहले ${hi}। अंतिम तीर कौन-सा है?`,choices:shuffle(ARROWS,`${age}:${i}:mirror`),labelsHi:shuffle(ARROWS,`${age}:${i}:mirror`),answer,explanation:`Apply the operations in the stated order. Final arrow: ${answer}.`,explanationHi:`सभी क्रियाएँ क्रम से करें। अंतिम तीर ${answer} है।`,reference:{kind:'mirror',start:ARROWS[v],ops}})})}
const PROCESS={
 poster:{themes:[['weather','मौसम'],['water conservation','जल संरक्षण'],['plants','पौधे'],['space','अंतरिक्ष']],steps:[['Choose the topic','विषय चुनें'],['Collect reliable facts','भरोसेमंद तथ्य जुटाएँ'],['Sketch a layout','रूपरेखा बनाएँ'],['Write the main points','मुख्य बिंदु लिखें'],['Check facts against sources','स्रोतों से तथ्य जाँचें'],['Create the final poster','अंतिम पोस्टर बनाएँ']]},
 garden:{themes:[['bean','सेम'],['pea','मटर'],['sunflower','सूरजमुखी'],['marigold','गेंदा']],steps:[['Choose a suitable container','उपयुक्त बर्तन चुनें'],['Add soil','मिट्टी भरें'],['Plant a seed','बीज लगाएँ'],['Water lightly','थोड़ा पानी दें'],['Observe growth safely','सुरक्षित तरीके से बढ़त देखें'],['Record what changed','बदलाव दर्ज करें']]},
 model:{themes:[['paper bridge','कागज़ का पुल'],['cardboard house','गत्ते का घर'],['paper boat','कागज़ की नाव'],['model windmill','मॉडल पवनचक्की']],steps:[['Describe the purpose','उद्देश्य बताएँ'],['Draw the proposed shape','आकार का चित्र बनाएँ'],['Select safe materials','सुरक्षित सामग्री चुनें'],['Build a small model','छोटा मॉडल बनाएँ'],['Test without dangerous loads','बिना खतरनाक भार के जाँचें'],['Revise one feature','एक हिस्सा सुधारें']]},
 library:{themes:[['science book','विज्ञान की किताब'],['story book','कहानी की किताब'],['history book','इतिहास की किताब'],['drawing guide','चित्रकला की किताब']],steps:[['Identify a reading goal','पढ़ने का लक्ष्य तय करें'],['Find a suitable book','उपयुक्त किताब ढूँढ़ें'],['Check the title and level','शीर्षक और स्तर जाँचें'],['Read a section','एक हिस्सा पढ़ें'],['Summarize one idea','एक विचार का सार बताएँ'],['Return or store the book','किताब लौटाएँ या रखें']]},
 survey:{themes:[['school garden','स्कूल बगीचा'],['library corner','पुस्तकालय का कोना'],['reusable bottles','दोबारा उपयोग की बोतलें'],['classroom lighting','कक्षा की रोशनी']],steps:[['Choose a non-sensitive topic','गैर-संवेदनशील विषय चुनें'],['Write a clear question','स्पष्ट सवाल लिखें'],['Ask willing participants without names','बिना नाम के इच्छुक लोगों से पूछें'],['Count answers anonymously','बिना पहचान के उत्तर गिनें'],['Summarize the totals','कुल का सार बनाएँ'],['Suggest one improvement','एक सुधार सुझाएँ']]}
};
const PROCESS_KEYS=Object.keys(PROCESS);
function causeBank(age){return Array.from({length:20},(_,i)=>{const old=base('cause-effect',age,i),kind=Math.floor(i/4),v=i%4,group=PROCESS[PROCESS_KEYS[kind]],theme=group.themes[v],length=3+AGES.indexOf(age),steps=group.steps.slice(0,length),enSteps=steps.map(s=>s[0]),hiSteps=steps.map(s=>s[1]),idx=shuffle(steps.map((_,j)=>j),`cause:${age}:${i}`);return updated(old,'cause-effect',age,i,{interaction:'order',mode:'scored',question:`For a classroom activity about ${theme[0]}, the following workflow has prerequisites. Put these stated steps in their intended order.`,questionHi:`${theme[1]} की कक्षा गतिविधि के लिए कुछ चरण एक-दूसरे पर निर्भर हैं। इन्हें दिए गए कार्य-क्रम में रखें।`,choices:idx.map(j=>enSteps[j]),labelsHi:idx.map(j=>hiSteps[j]),answer:enSteps.join('|'),explanation:'This is one specified workflow, not a universal law of cause and effect. Each step prepares for the next.',explanationHi:'यह एक बताया हुआ कार्य-क्रम है, हर स्थिति पर लागू नियम नहीं। हर चरण अगले की तैयारी करता है।',reference:{kind:'workflow',steps:enSteps}})})}
// Specific age-differentiated process requirements for each open-ended activity.
const SCAFFOLDS={
 'explain-it':[
 ['Say one simple example and tell what happens first.','एक सरल उदाहरण दें और बताएँ पहले क्या होता है।'],
 ['Give two examples; explain the reason behind each using your own words.','दो उदाहरण दें और दोनों के पीछे का कारण अपने शब्दों में बताएँ।'],
 ['State a claim, support it with one example, and explain one exception or limitation.','एक दावा करें, उदाहरण से समझाएँ और एक सीमा या अपवाद बताएँ।'],
 ['Define the concept, compare alternative explanations, identify an assumption, and suggest a way to check it.','अवधारणा समझाएँ, दो व्याख्याओं की तुलना करें, एक मान्यता पहचानें और जाँच का तरीका बताएँ।']],
 'bridge-builder':[
 ['Sketch one paper-only bridge with a safe support; do not use heavy loads.','हल्के कागज़ से पुल का चित्र बनाएँ; भारी भार न रखें।'],
 ['Compare a folded and flat paper bridge. What makes one more stable for a light paper test?','मुड़े और सीधे कागज़ी पुल की तुलना करें। हल्के परीक्षण में कौन अधिक स्थिर होगा?'],
 ['Propose two safe prototypes with limited materials; explain a trade-off between stability and material use.','सीमित सामग्री के दो सुरक्षित मॉडल सोचें; स्थिरता और सामग्री के बीच समझौता समझाएँ।'],
 ['Specify bridge-design constraints, accessibility of the instructions, one safe non-load-bearing test, and a revision criterion.','पुल डिज़ाइन की सीमाएँ, निर्देशों की सुगमता, एक सुरक्षित हल्का परीक्षण और सुधार का मापदंड बताएँ।']],
 'story-creator':[
 ['Tell or draw a short scene with a beginning and a happy or thoughtful ending.','शुरुआत और सोचने योग्य अंत वाला छोटा दृश्य बनाएँ या सुनाएँ।'],
 ['Give your character a goal and an obstacle; invent two different endings.','पात्र का लक्ष्य और बाधा तय करें; दो अलग अंत सोचें।'],
 ['Write or narrate a scene from two points of view and explain how each person sees the event differently.','दो नज़रियों से दृश्य सुनाएँ और दोनों की सोच का अंतर समझाएँ।'],
 ['Design a narrative arc with a moral choice, an unintended consequence and a revised ending that respects others.','नैतिक विकल्प, अनचाहा परिणाम और दूसरों का सम्मान करता बदला अंत लेकर कहानी की रूपरेखा बनाएँ।']],
 'design-challenge':[
 ['Draw one safer, easier-to-use design for a familiar person.','किसी परिचित व्यक्ति के लिए एक सुरक्षित और आसान डिज़ाइन बनाएँ।'],
 ['Compare two designs by usefulness and cost; ask an adult before any physical testing.','दो डिज़ाइन की उपयोगिता और लागत तुलना करें; असली जाँच से पहले बड़े से पूछें।'],
 ['Consider someone with a different accessibility need and compare environmental and cost trade-offs.','अलग सुगमता ज़रूरत वाले व्यक्ति को ध्यान में रखें; पर्यावरण और लागत के समझौते तुलना करें।'],
 ['Write a user requirement, two competing constraints, accessibility consideration and a low-risk prototype evaluation plan.','उपयोगकर्ता ज़रूरत, दो परस्पर सीमाएँ, सुगमता और कम-जोखिम वाले मॉडल की जाँच योजना लिखें।']],
 'idea-mixer':[
 ['Combine the objects into one playful paper sketch and say who could use it.','दो चीज़ें मिलाकर कागज़ पर एक मज़ेदार विचार बनाएँ और उपयोगकर्ता बताएँ।'],
 ['Invent two combinations, then explain which one is simpler and safer.','दो मिले-जुले विचार सोचें, फिर आसान और सुरक्षित विकल्प चुनकर कारण बताएँ।'],
 ['Compare the two ideas for inclusion, repairability and resource use.','दो विचारों की समावेशिता, मरम्मत और संसाधन उपयोग की तुलना करें।'],
 ['Define a target user, evaluate failure cases, accessibility and a responsible test of your combined idea.','लक्षित उपयोगकर्ता, संभावित विफलता, सुगमता और जिम्मेदार परीक्षण समझाएँ।']],
 'invent-something':[
 ['Draw a safe paper idea that solves one small daily problem.','रोज़ की एक छोटी समस्या के लिए सुरक्षित कागज़ी विचार बनाएँ।'],
 ['List materials, compare two ideas and explain what would be easy to build safely.','सामग्री लिखें, दो विचार तुलना करें और सुरक्षित बनाना किसे आसान होगा बताएँ।'],
 ['Explain who benefits, who might be excluded, and how you can reduce waste.','बताएँ किसे लाभ, कौन छूट सकता है और कचरा कैसे कम करेंगे।'],
 ['Set constraints, privacy/safety boundaries, evaluation criteria and one iteration after imagined user feedback.','सीमाएँ, गोपनीयता/सुरक्षा, जाँच मानक और कल्पित सुझाव के बाद एक सुधार तय करें।']],
 'team-planner':[
 ['Choose one fair way for two people to take turns.','दो लोगों की बारी-बारी का एक उचित तरीका चुनें।'],
 ['Give three roles and explain how everyone can help without pressure.','तीन भूमिकाएँ बाँटें और बताएँ सब बिना दबाव कैसे मदद करेंगे।'],
 ['Consider a quieter teammate and a teammate with an accessibility need; design an inclusive plan.','कम बोलने वाले और सुगमता ज़रूरत वाले साथी के लिए समावेशी योजना बनाएँ।'],
 ['Create roles, consent-based participation rules, conflict resolution, and a way to evaluate the group process without rating people.','भूमिकाएँ, सहमति से भागीदारी, मतभेद का हल और व्यक्तियों को अंक दिए बिना काम की समीक्षा की योजना बनाएँ।']],
 'communication-quest':[
 ['Say one respectful sentence and allow the other person to take a break.','एक सम्मानजनक बात कहें और दूसरे को विराम लेने दें।'],
 ['Ask one open question and repeat what the person said before suggesting help.','एक खुला सवाल पूछें और सलाह से पहले दूसरे की बात अपने शब्दों में दोहराएँ।'],
 ['Explain how you would check understanding, avoid assumptions and offer two respectful options.','समझ कैसे जाँचेंगे, मान्यताओं से कैसे बचेंगे और दो सम्मानजनक विकल्प कैसे देंगे?'],
 ['Write a non-coercive communication plan with boundaries, privacy, accessibility and a safe exit option.','सीमाओं, गोपनीयता, सुगमता और सुरक्षित बाहर निकलने के विकल्प वाली बिना दबाव की संचार योजना बनाएँ।']],
 'conflict-choices':[
 ['Suggest taking turns and allow either person to say no.','बारी-बारी का सुझाव दें और दोनों को मना करने का अधिकार दें।'],
 ['Explain both viewpoints and offer two fair choices.','दोनों नज़रिए बताएँ और दो उचित रास्ते सुझाएँ।'],
 ['Identify a shared need, a competing need and a respectful compromise that does not force agreement.','साझी और अलग ज़रूरत पहचानें तथा बिना दबाव का समझौता सुझाएँ।'],
 ['Compare mediation options, safety boundaries, consent and what to do if agreement is impossible.','मध्यस्थता के विकल्प, सुरक्षा सीमा, सहमति और समाधान न निकलने पर अगला कदम तुलना करें।']],
 'cooperation-challenge':[
 ['Choose two safe helper roles and celebrate each genuine effort.','दो सुरक्षित मददगार भूमिकाएँ चुनें और सच्चे प्रयास की सराहना करें।'],
 ['Plan shared turns, offer two roles and explain how to help someone who needs more time.','साझी बारी, दो भूमिकाएँ और अधिक समय चाहने वाले की मदद की योजना बनाएँ।'],
 ['Adapt roles for different access needs and explain how to check group progress without rankings.','अलग सुगमता ज़रूरतों के अनुसार भूमिकाएँ बदलें और बिना रैंकिंग के काम जाँचें।'],
 ['Design inclusive roles, fallback steps, safe communication rules and an evaluation of collective—not individual—outcomes.','समावेशी भूमिकाएँ, वैकल्पिक चरण, सुरक्षित संवाद नियम और व्यक्तिगत नहीं बल्कि समूह परिणामों की समीक्षा तय करें।']]
};
function reflectionBank(game,age){const level=AGES.indexOf(age),[extraEn,extraHi]=SCAFFOLDS[game][level];return getExtraBank(game,age).map((old,i)=>updated(old,game,age,i,{mode:'reflection',interaction:'reflection',question:`${old.question} ${extraEn}`,questionHi:`${old.questionHi} ${extraHi}`,context:old.context||'You may think, speak or sketch privately; no written answer is uploaded.',contextHi:old.contextHi||'आप निजी तौर पर सोच, बोल या चित्र बना सकते हैं; लिखित उत्तर अपलोड नहीं होता।',explanation:'Reflection recorded, not scored. You may keep your work private.',explanationHi:'आपका चिंतन दर्ज हुआ, अंक नहीं दिए गए। आप अपना काम निजी रख सकते हैं।'}))}
export function getAgeAdaptiveBBank(gameId,ageBand){if(!M12B_GAMES.includes(gameId))return null;if(!AGES.includes(ageBand))throw Error('Unknown age band');switch(gameId){case 'word-builder':return wordBank(ageBand);case 'meaning-hunter':return meaningBank(ageBand);case 'mirror-puzzle':return mirrorBank(ageBand);case 'cause-effect':return causeBank(ageBand);default:return reflectionBank(gameId,ageBand)}}