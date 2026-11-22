/** M12-A: eight representative age-adapted PRACTICE banks, not validated assessments.
 * No student information or network requests. ContentVersion 2 deliberately gives fresh IDs.
 * Review status remains pending until external human review and child testing.
 */
export const M12_GAMES=Object.freeze([
 'logic-maze','number-market','story-sequencer','rotation-master',
 'gear-explorer','creative-studio','perspective-explorer','mission-scheduler'
]);
const CATEGORY={
 'logic-maze':'logical-reasoning','number-market':'numerical','story-sequencer':'language',
 'rotation-master':'spatial','gear-explorer':'practical','creative-studio':'creative',
 'perspective-explorer':'social','mission-scheduler':'planning'
};
const LEVEL={'6-10':0,'11-14':1,'15-17':2,'18+':3};
const REFL=['I tried an idea','I compared two approaches','I want to discuss this','I need more time'];
const REFL_HI=['मैंने एक विचार आज़माया','मैंने दो तरीके सोचे','मैं इस पर बातचीत करना चाहता/चाहती हूँ','मुझे और समय चाहिए'];
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
function shuffle(values,seed){const out=[...values];let r=hash(seed)||1;for(let i=out.length-1;i>0;i--){r^=r<<13;r^=r>>>17;r^=r<<5;const j=(r>>>0)%(i+1);[out[i],out[j]]=[out[j],out[i]]}return out}
function item(game,age,kind,v,data){
 const id=`${game}:${age}:m12:${kind}:${v}`;
 const mode=data.mode||'scored',interaction=data.interaction||'choice';
 const result={id,gameId:game,categoryId:CATEGORY[game],ageBand:age,kind,variant:v,
  difficulty:LEVEL[age]+1,contentVersion:2,reviewed:false,
  educationalReviewStatus:'pending',translationReviewStatus:'pending',
  mode,interaction,question:data.en,questionHi:data.hi,
  context:data.context||'',contextHi:data.contextHi||'',
  sequence:data.sequence||[],choices:data.choices||[],labelsHi:data.labelsHi||[],
  answer:mode==='reflection'?null:String(data.answer),
  explanation:data.explanation||'',explanationHi:data.explanationHi||'',
  feedbackByChoice:data.feedbackByChoice||null,feedbackByChoiceHi:data.feedbackByChoiceHi||null,
  reference:data.reference||null};
 if(!result.question||!result.questionHi)throw Error('Missing bilingual question '+id);
 if(mode==='scored' && (!result.explanation||!result.explanationHi))throw Error('Missing bilingual explanation '+id);
 if(interaction!=='number' && (new Set(result.choices).size!==result.choices.length||!result.choices.length))throw Error('Duplicate/empty options '+id);
 if(mode==='scored'&&interaction==='choice'&&!result.choices.includes(result.answer))throw Error('Missing correct choice '+id);
 if(mode==='scored'&&interaction==='order'&&result.answer.split('|').some(x=>!result.choices.includes(x)))throw Error('Invalid order key '+id);
 return Object.freeze(result);
}
function num(game,age,kind,v,en,hi,answer,exp,expHi,reference){
 if(!Number.isSafeInteger(answer)||answer<0)throw Error('Invalid numeric answer');
 return item(game,age,kind,v,{interaction:'number',en,hi,answer,explanation:exp,explanationHi:expHi,reference});
}
function choice(game,age,kind,v,en,hi,answer,opts,labels,exp,expHi,more={}){
 const id=`${game}:${age}:m12:${kind}:${v}`,idx=shuffle(opts.map((_,i)=>i),id);
 return item(game,age,kind,v,{interaction:'choice',en,hi,answer,choices:idx.map(i=>opts[i]),labelsHi:idx.map(i=>labels[i]),explanation:exp,explanationHi:expHi,...more});
}
function reflection(game,age,kind,v,en,hi,ctx,ctxHi){
 const feedback=Object.fromEntries(REFL.map(a=>[a,'Your choice was recorded only on this device. This is not an ability score.']));
 const feedbackHi=Object.fromEntries(REFL.map(a=>[a,'आपका जवाब केवल इसी डिवाइस पर दर्ज हुआ। यह क्षमता का स्कोर नहीं है।']));
 return item(game,age,kind,v,{mode:'reflection',interaction:'reflection',en,hi,
  context:ctx,contextHi:ctxHi,choices:REFL,labelsHi:REFL_HI,
  feedbackByChoice:feedback,feedbackByChoiceHi:feedbackHi,
  explanation:'No ability score assigned.',explanationHi:'क्षमता का कोई स्कोर नहीं दिया गया।'});
}
function ordering(game,age,kind,v,scenario,scenarioHi,steps,stepsHi){
 const id=`${game}:${age}:m12:${kind}:${v}`,order=shuffle(steps.map((_,i)=>i),id);
 const older=LEVEL[age]>=2;
 const deps=shuffle(steps.slice(1).map((s,i)=>[i,i+1]),`${id}:deps`);
 const context=older?
  'Dependencies (not in order): '+deps.map(([a,b])=>`“${steps[a]}” must happen before “${steps[b]}”`).join('; '):
  steps.map((s,i)=>`${i+1}. ${s}`).join(' → ');
 const contextHi=older?
  'निर्भरता (बिना क्रम): '+deps.map(([a,b])=>`“${stepsHi[a]}” का काम “${stepsHi[b]}” से पहले होना चाहिए`).join('; '):
  stepsHi.map((s,i)=>`${i+1}. ${s}`).join(' → ');
 return item(game,age,kind,v,{interaction:'order',en:`${scenario} Arrange the described steps from first to last.`,hi:`${scenarioHi} दिए गए चरण पहले से आखिरी तक क्रम में लगाएँ।`,
  context,contextHi,choices:order.map(i=>steps[i]),labelsHi:order.map(i=>stepsHi[i]),answer:steps.join('|'),
  explanation:`The plan's dependent steps follow the stated sequence: ${steps.join(' → ')}.`,
  explanationHi:`योजना के निर्भर चरणों का बताया गया क्रम है: ${stepsHi.join(' → ')}।`,
  reference:{kind:'order',correctSteps:steps}});
}

const DIR={E:[1,0],W:[-1,0],N:[0,1],S:[0,-1]};
const DHI={E:'पूर्व',W:'पश्चिम',N:'उत्तर',S:'दक्षिण'};
function maze(age,kind,v){
 const L=LEVEL[age],x0=6+v,y0=6+v;
 const patterns={
  east:[['E',1+v],['N',2+L],['W',L+1],['S',1]],
  north:[['N',2+v],['W',1+L],['S',L+1],['E',2]],
  west:[['W',1+v],['S',1+L],['E',2+L],['N',1]],
  south:[['S',1+v],['E',2+L],['N',L+1],['W',1]],
  detour:[['E',2+v],['N',1+L],['W',1+v],['S',L+1]]
 };
 const moves=patterns[kind].slice(0,L+1),pos=[x0,y0];
 for(const [d,n] of moves){pos[0]+=DIR[d][0]*n;pos[1]+=DIR[d][1]*n}
 const axis=['east','west','detour'].includes(kind)?0:1;
 const trail=moves.map(([d,n])=>`${n} step${n===1?'':'s'} ${d==='E'?'east':d==='W'?'west':d==='N'?'north':'south'}`).join(', then ');
 const trailHi=moves.map(([d,n])=>`${n} कदम ${DHI[d]}`).join(', फिर ');
 const answer=pos[axis];
 const axisLabel=axis?'north (y)':'east (x)',axisHi=axis?'उत्तर (y)':'पूर्व (x)';
 return num('logic-maze',age,kind,v,
  `On an open coordinate grid, start at (${x0}, ${y0}); move ${trail}. What is the final ${axisLabel} coordinate?`,
  `खुले निर्देशांक ग्रिड पर (${x0}, ${y0}) से शुरू करें; ${trailHi} जाएँ। आखिरी ${axisHi} निर्देशांक क्या होगा?`,
  answer,`The final coordinate is (${pos[0]}, ${pos[1]}). Track one move at a time.`,
  `अंतिम बिंदु (${pos[0]}, ${pos[1]}) है। हर चाल को अलग-अलग गिनें।`,
  {kind:'maze',start:[x0,y0],moves,axis});
}
function market(age,kind,v){
 const L=LEVEL[age],a=4+v,b=7+2*v;let en,hi,result,rule;
 if(kind==='total'){
  if(L===0){result=a+b;en=`A pencil costs ₹${a} and an eraser costs ₹${b}. What is the total in rupees?`;hi=`पेंसिल ₹${a} और रबर ₹${b} का है। कुल कितने रुपये?`;rule={op:'sum',values:[a,b]}}
  if(L===1){result=2*a+b;en=`Two pencils cost ₹${a} each and an eraser costs ₹${b}. What is the total?`;hi=`दो पेंसिल ₹${a} प्रति पेंसिल और रबर ₹${b} का है। कुल कितना?`;rule={op:'sum',values:[a,a,b]}}
  if(L===2){const p=10*(9+v);result=p*9/10;en=`Two items together cost ₹${p}; the shop gives a 10% discount on the total. What do you pay?`;hi=`दो चीज़ों का कुल मूल्य ₹${p} है। पूरे मूल्य पर 10% छूट मिले तो कितना भुगतान करेंगे?`;rule={op:'percent',base:p,percent:90}}
  if(L===3){const packA=2*(55+5*v),packB=100+8*v;result=Math.min(packA,packB);en=`You need two identical kits. Two individual kits cost ₹${55+5*v} each; a two-kit bundle costs ₹${packB}. What is the least cost?`;hi=`दो एक जैसी किट चाहिए। अलग-अलग किट ₹${55+5*v} प्रति किट या दो-किट पैक ₹${packB} में मिलता है। कम से कम लागत कितनी होगी?`;rule={op:'min',values:[packA,packB]}}
 }
 if(kind==='change'){
  if(L===0){result=20+v-a;en=`You pay ₹${20+v} for a snack costing ₹${a}. How much change?`;hi=`₹${a} की चीज़ के लिए ₹${20+v} दिए। कितने रुपये वापस मिलेंगे?`;rule={op:'minus',values:[20+v,a]}}
  if(L===1){result=100-(3*a+2*b);en=`You buy three pens at ₹${a} each and two pads at ₹${b} each. You pay ₹100. How much change?`;hi=`तीन पेन ₹${a} प्रति पेन और दो पैड ₹${b} प्रति पैड खरीदकर ₹100 दिए। कितना वापस मिलेगा?`;rule={op:'minus',values:[100,3*a+2*b]}}
  if(L===2){const total=50+10*v,packing=8+v;result=100+20*v-total-packing;en=`You have ₹${100+20*v}. An order costs ₹${total} plus ₹${packing} packing. How much money remains?`;hi=`आपके पास ₹${100+20*v} हैं। ऑर्डर ₹${total} और पैकिंग ₹${packing} है। कितने रुपये बचेंगे?`;rule={op:'minus',values:[100+20*v,total+packing]}}
  if(L===3){const price=150+20*v,coupon=20+5*v,delivery=15;result=250+30*v-(price-coupon+delivery);en=`From ₹${250+30*v}, buy an item listed at ₹${price}; apply a ₹${coupon} coupon, then add ₹15 delivery. How much remains?`;hi=`₹${250+30*v} में से ₹${price} की चीज़ खरीदें, ₹${coupon} का कूपन घटाएँ, फिर ₹15 डिलीवरी जोड़ें। कितना बचेगा?`;rule={op:'minus',values:[250+30*v,price-coupon+delivery]}}
 }
 if(kind==='share'){
  if(L===0){result=a;en=`Share ${2*a} tokens equally among two friends. How many each?`;hi=`${2*a} टोकन दो दोस्तों में बराबर बाँटें। हर एक को कितने?`;rule={op:'divide',values:[2*a,2]}}
  if(L===1){result=a+v;en=`Share ${(a+v)*3} tokens equally among three friends. How many each?`;hi=`${(a+v)*3} टोकन तीन दोस्तों में बराबर बाँटें। प्रत्येक को कितने?`;rule={op:'divide',values:[(a+v)*3,3]}}
  if(L===2){result=3+v;const total=result*8;en=`${total} cards are packed into groups of 8. How many complete groups can you make?`;hi=`${total} कार्ड 8 के समूह में रखें। कितने पूरे समूह बनेंगे?`;rule={op:'divide',values:[total,8]}}
  if(L===3){const need=22+7*v,per=6+v;result=Math.ceil(need/per);en=`A group needs at least ${need} cards. Each sealed packet contains ${per} cards. What is the fewest whole packets needed?`;hi=`समूह को कम से कम ${need} कार्ड चाहिए। हर बंद पैकेट में ${per} कार्ड हैं। कम से कम कितने पूरे पैकेट खरीदेंगे?`;rule={op:'ceil',values:[need,per]}}
 }
 if(kind==='discount'){
  if(L===0){result=20+3*v-(2+v);en=`A notebook costs ₹${20+3*v}; its price drops by ₹${2+v}. New price?`;hi=`कॉपी ₹${20+3*v} की है। कीमत ₹${2+v} कम हुई। नई कीमत?`;rule={op:'minus',values:[20+3*v,2+v]}}
  if(L===1){const p=50+10*v;result=p*90/100;en=`An item is ₹${p} with 10% off. What is the final price?`;hi=`₹${p} की चीज़ पर 10% छूट है। अंतिम मूल्य कितना होगा?`;rule={op:'percent',base:p,percent:90}}
  if(L===2){const p=100+50*v;result=p*80/100;en=`A ₹${p} item has a 20% discount. What amount is paid?`;hi=`₹${p} की चीज़ पर 20% छूट है। कितना भुगतान होगा?`;rule={op:'percent',base:p,percent:80}}
  if(L===3){const p=200+100*v;result=p*90/100*80/100;en=`A ₹${p} item gets a 10% discount, then an additional 20% off the reduced price. What is the final cost?`;hi=`₹${p} पर पहले 10% छूट, फिर घटे मूल्य पर 20% और छूट है। अंतिम लागत क्या है?`;rule={op:'percent2',base:p,pct1:90,pct2:80}}
 }
 if(kind==='compare'){
  if(L===0){result=b-a;en=`A blue pen costs ₹${a}; a red pen costs ₹${b}. How much cheaper is the blue one?`;hi=`नीला पेन ₹${a} और लाल पेन ₹${b} का है। नीला कितने रुपये सस्ता है?`;rule={op:'minus',values:[b,a]}}
  if(L===1){result=3*a+2*b;en=`For a project, buy three clips at ₹${a} each and two cards at ₹${b} each. Total cost?`;hi=`परियोजना के लिए तीन क्लिप ₹${a} प्रति क्लिप और दो कार्ड ₹${b} प्रति कार्ड खरीदें। कुल लागत?`;rule={op:'sum',values:[a,a,a,b,b]}}
  if(L===2){const aTotal=100+10*v+20,bTotal=110+7*v+5;result=Math.abs(aTotal-bTotal);en=`Offer A costs ₹${100+10*v} plus ₹20 shipping. Offer B costs ₹${110+7*v} plus ₹5 shipping. Difference between totals?`;hi=`ऑफ़र A ₹${100+10*v} और ₹20 शिपिंग है। ऑफ़र B ₹${110+7*v} और ₹5 शिपिंग है। कुल कीमतों में कितना अंतर?`;rule={op:'absdiff',values:[aTotal,bTotal]}}
  if(L===3){const three=3*(40+5*v)+15,twoPlus=2*(55+6*v)+(40+5*v);result=Math.min(three,twoPlus);en=`You need three items. Plan A: three singles at ₹${40+5*v} each plus ₹15 shipping. Plan B: two-item bundle ₹${2*(55+6*v)} plus one single ₹${40+5*v}, no shipping. Minimum cost?`;hi=`तीन चीज़ें चाहिए। योजना A: ₹${40+5*v} प्रति चीज़ की तीन और ₹15 शिपिंग। योजना B: दो का पैक ₹${2*(55+6*v)} और एक ₹${40+5*v} की, शिपिंग मुफ़्त। न्यूनतम लागत?`;rule={op:'min',values:[three,twoPlus]}}
 }
 if(!Number.isInteger(result)||result<0)throw Error('bad market item');
 return num('number-market',age,kind,v,en,hi,result,`Calculate the total step by step. The answer is ₹${result}.`,`एक-एक चरण गिनें। उत्तर ₹${result} है।`,{kind:'market',rule});
}

const THEMES={
 'poster':[['a weather poster','मौसम का पोस्टर'],['a plant poster','पौधों का पोस्टर'],['a space poster','अंतरिक्ष का पोस्टर'],['a road-safety poster','सड़क सुरक्षा का पोस्टर']],
 'garden':[['a bean seed','सेम का बीज'],['a sunflower seed','सूरजमुखी का बीज'],['a pea seed','मटर का बीज'],['a marigold seed','गेंदे का बीज']],
 'model':[['a paper bridge','कागज़ का पुल'],['a cardboard tower','गत्ते की मीनार'],['a paper boat','कागज़ की नाव'],['a model bus','बस का मॉडल']],
 'library':[['an adventure book','रोमांच की किताब'],['a science book','विज्ञान की किताब'],['a history book','इतिहास की किताब'],['a story collection','कहानियों का संग्रह']],
 'showcase':[['a class drawing','कक्षा का चित्र'],['a science chart','विज्ञान का चार्ट'],['a map model','नक्शे का मॉडल'],['a recycling idea','पुनर्चक्रण का विचार']]
};
const SEQUENCES={
 poster:[['Choose a topic','विषय चुनें'],['Sketch the layout','रूपरेखा बनाएँ'],['Add the main facts','मुख्य तथ्य जोड़ें'],['Check the facts','तथ्य जाँचें'],['Make a final copy','अंतिम प्रति बनाएँ'],['Explain the poster','पोस्टर समझाएँ']],
 garden:[['Choose a safe pot','सुरक्षित गमला चुनें'],['Put soil in the pot','गमले में मिट्टी डालें'],['Plant the seed','बीज लगाएँ'],['Water lightly','थोड़ा पानी दें'],['Observe changes','बदलाव देखें'],['Record an observation','अवलोकन लिखें']],
 model:[['Draw a plan','योजना का चित्र बनाएँ'],['Choose safe materials','सुरक्षित सामग्री चुनें'],['Make a small model','छोटा मॉडल बनाएँ'],['Check its shape','आकार जाँचें'],['Improve one part','एक भाग सुधारें'],['Describe the revision','सुधार समझाएँ']],
 library:[['Find the book title','किताब का शीर्षक खोजें'],['Locate the book','किताब ढूँढ़ें'],['Check out the book','किताब उधार लें'],['Read the introduction','भूमिका पढ़ें'],['Write a short note','छोटी टिप्पणी लिखें'],['Return it on time','समय पर लौटाएँ']],
 showcase:[['Choose a project idea','परियोजना का विचार चुनें'],['List what is needed','ज़रूरी चीज़ें लिखें'],['Prepare the materials','सामग्री तैयार करें'],['Complete the activity','गतिविधि पूरी करें'],['Check the result','नतीजा जाँचें'],['Share what you learned','सीख साझा करें']]
};
function storyOrder(age,kind,v,game='story-sequencer'){
 const L=LEVEL[age],subject=THEMES[kind][v],steps=SEQUENCES[kind].slice(0,3+L),en=steps.map(a=>a[0]),hi=steps.map(a=>a[1]);
 return ordering(game,age,kind,v,
  `A learner is working on ${subject[0]}. The plan states the dependencies in a particular order.`,
  `एक छात्र ${subject[1]} पर काम कर रहा है। योजना में चरण एक निश्चित क्रम से जुड़े हैं।`,en,hi);
}

const ARR=['↑','→','↓','←'];
function rotateDirection(a,op){const idx=ARR.indexOf(a);if(op==='CW')return ARR[(idx+1)%4];if(op==='CCW')return ARR[(idx+3)%4];if(op==='HALF')return ARR[(idx+2)%4];if(op==='MIRROR')return a==='→'?'←':a==='←'?'→':a;throw Error(op)}
const OPS={clockwise:['CW','CCW','CW','MIRROR'],anticlockwise:['CCW','CW','HALF','CCW'],halfturn:['HALF','CW','CCW','MIRROR'],mirror:['MIRROR','HALF','MIRROR','CW'],composite:['CW','MIRROR','CCW','HALF','MIRROR']};
const OPNAMES={CW:['90° clockwise','90° घड़ी की दिशा में'],CCW:['90° anticlockwise','90° घड़ी की उल्टी दिशा में'],HALF:['180°','180°'],MIRROR:['reflect in a vertical mirror','ऊर्ध्वाधर दर्पण में प्रतिबिंबित करें']};
function rotation(age,kind,v){
 const L=LEVEL[age],start=ARR[v],ops=OPS[kind].slice(0,L+(kind==='composite'?2:1));let ans=start;
 for(const op of ops)ans=rotateDirection(ans,op);
 const en=ops.map(op=>OPNAMES[op][0]).join(', then '),hi=ops.map(op=>OPNAMES[op][1]).join(', फिर ');
 return choice('rotation-master',age,kind,v,
  `Start with arrow ${start}. ${en}. Which arrow points in the final direction?`,
  `शुरुआती तीर ${start} है। ${hi}। अंतिम दिशा में कौन-सा तीर होगा?`,
  ans,ARR,ARR,`Apply each rotation or reflection in order; the result is ${ans}.`,`हर घुमाव या प्रतिबिंब क्रम से करें। उत्तर ${ans} है।`,
  {reference:{kind:'rotation',start,ops}});
}
function gear(age,kind,v){
 const L=LEVEL[age],base=2+L,extra=['pair','chain','middle','trace','reverse'].indexOf(kind);
 const total=base+extra,from=L>=2?Math.min(total,2+v%2):1,to=(kind==='reverse'&&L>=2)?(v>=2?2:1):(v>=2?Math.max(1,total-1):total);
 const source=(kind==='reverse'&&L>=2)?total:from;
 const initial=v%2?'counterclockwise':'clockwise';
 const answer=Math.abs(source-to)%2===0?initial:(initial==='clockwise'?'counterclockwise':'clockwise');
 const hiDir=initial==='clockwise'?'घड़ी की दिशा में':'घड़ी की उल्टी दिशा में';
 const hiAnswer=answer==='clockwise'?'घड़ी की दिशा':'घड़ी की उल्टी दिशा';
 return choice('gear-explorer',age,kind,v,
  `A model has ${total} external gears in a straight meshed chain. Gear ${source} turns ${initial}. How does gear ${to} turn?`,
  `एक मॉडल में ${total} बाहरी गियर एक कतार में जुड़े हैं। गियर ${source} ${hiDir} घूमता है। गियर ${to} किस दिशा में घूमेगा?`,
  answer,['clockwise','counterclockwise','not moving','both directions'],['घड़ी की दिशा','घड़ी की उल्टी दिशा','नहीं घूमेगा','दोनों दिशाओं में'],
  `Every adjacent pair turns in opposite directions. There are ${Math.abs(source-to)} gear connections; the result is ${answer}.`,
  `हर पड़ोसी गियर विपरीत दिशा में घूमता है। ${Math.abs(source-to)} जोड़ हैं; उत्तर ${hiAnswer} है।`,
  {reference:{kind:'gears',total,source,to,initial}});
}
const CREATIVE_OBJECTS={
 design:[['a school bag','स्कूल बैग'],['a water bottle','पानी की बोतल'],['a reading desk','पढ़ने की मेज़'],['a pencil box','पेंसिल बॉक्स']],
 story:[['a friendly robot','मित्र रोबोट'],['a rainy day','बारिश का दिन'],['a mystery box','रहस्यमय डिब्बा'],['a tiny garden','छोटा बगीचा']],
 invention:[['a cardboard box','गत्ते का डिब्बा'],['a paper tube','कागज़ की नली'],['some fabric scraps','कपड़े के टुकड़े'],['a recycled notebook','पुरानी कॉपी']],
 constraints:[['three sheets of paper','कागज़ की तीन शीट'],['two cups','दो कप'],['four colored pencils','चार रंगीन पेंसिल'],['a small paper bag','कागज़ का छोटा थैला']],
 improve:[['a library corner','पुस्तकालय का कोना'],['a bus-stop sign','बस स्टॉप का संकेत'],['a school garden','विद्यालय का बगीचा'],['a shared study table','साझी पढ़ाई की मेज़']]
};
function creative(age,kind,v){
 const [obj,objHi]=CREATIVE_OBJECTS[kind][v],L=LEVEL[age];
 const en=[
  `Imagine ${obj}. Draw or tell one new idea. What would it look like?`,
  `Imagine ${obj} for a younger learner. Design two safe ideas and say which is easier to use.`,
  `Imagine ${obj} with limited materials. Compare two designs for usefulness and environmental impact.`,
  `Create a prototype plan for ${obj}. State a user need, two trade-offs, a safe test, and what you would change after feedback.`
 ][L];
 const hi=[
  `${objHi} के लिए एक नया विचार सोचें। चित्र बनाकर या बोलकर बताएं कि वह कैसा होगा।`,
  `छोटे विद्यार्थी के लिए ${objHi} के दो सुरक्षित विचार सोचें। कौन-सा इस्तेमाल में आसान होगा?`,
  `सीमित सामग्री से ${objHi} के दो डिज़ाइन सोचें। उपयोगिता और पर्यावरण पर प्रभाव की तुलना करें।`,
  `${objHi} के नमूने की योजना बनाएँ। उपयोगकर्ता की ज़रूरत, दो समझौते, सुरक्षित परीक्षण और सुझाव के बाद सुधार बताएँ।`
 ][L];
 return reflection('creative-studio',age,kind,v,en,hi,
  'You can use paper, speech or imagination. Sharing work is optional.',
  'कागज़, बोलकर या कल्पना से काम कर सकते हैं। साझा करना वैकल्पिक है।');
}
const SOCIAL_SITUATIONS={
 invite:[['a new person joins the game','नया साथी खेल में आता है'],['someone is quiet in a group','समूह में कोई चुप है'],['a friend missed instructions','दोस्त निर्देश नहीं सुन पाया'],['someone needs more time','किसी को अधिक समय चाहिए']],
 disagree:[['two friends choose different pictures','दो दोस्तों के चुने चित्र अलग हैं'],['friends want different games','दोस्त अलग खेल चाहते हैं'],['two students suggest different solutions','दो विद्यार्थियों के समाधान अलग हैं'],['teammates disagree about a plan','टीम के सदस्य योजना पर सहमत नहीं हैं']],
 feedback:[['a friend shows a drawing','दोस्त चित्र दिखाता है'],['a learner reads a story','विद्यार्थी कहानी पढ़ता है'],['someone presents a project','कोई परियोजना दिखाता है'],['a teammate makes a mistake','साथी से गलती होती है']],
 fairness:[['two friends want one pencil','दो दोस्तों को एक पेंसिल चाहिए'],['three students share a game board','तीन छात्र एक गेम बोर्ड साझा करते हैं'],['a group has one computer','समूह के पास एक कंप्यूटर है'],['some players have different accessibility needs','कुछ खिलाड़ियों की पहुँच संबंधी ज़रूरतें अलग हैं']],
 repair:[['a friend feels left out','दोस्त को अलग-थलग महसूस होता है'],['someone interrupts a speaker','किसी की बात काटी जाती है'],['a plan did not work','योजना सफल नहीं हुई'],['someone says a joke hurt them','कोई कहता है कि मज़ाक से उसे दुख पहुँचा']]
};
function social(age,kind,v){const [s,hiS]=SOCIAL_SITUATIONS[kind][v],L=LEVEL[age];
 const en=[
  `Imagine ${s}. What kind words could help? Think of one gentle response.`,
  `Imagine ${s}. Suggest two respectful responses and how to take turns listening.`,
  `Imagine ${s}. Describe two people's needs, a boundary, and a fair next step.`,
  `Imagine ${s}. Compare stakeholder perspectives, power differences, privacy and consent; suggest a reversible, respectful group decision.`
 ][L];
 const hi=[
  `कल्पना करें: ${hiS}। कौन-सी प्यार भरी बात मदद कर सकती है? एक उत्तर सोचें।`,
  `कल्पना करें: ${hiS}। दो सम्मानजनक जवाब और बारी-बारी सुनने का तरीका सोचें।`,
  `कल्पना करें: ${hiS}। दो लोगों की ज़रूरतें, एक सीमा और न्यायपूर्ण अगला कदम बताएँ।`,
  `कल्पना करें: ${hiS}। सबके नज़रिए, शक्ति के अंतर, निजता और सहमति पर सोचें; सम्मानजनक, बदला जा सकने वाला समूह निर्णय सुझाएँ।`
 ][L];
 return reflection('perspective-explorer',age,kind,v,en,hi,
  'There is no single personality label or social intelligence score. Choose a truthful reflection.',
  'यहाँ कोई व्यक्तित्व का लेबल या सामाजिक बुद्धिमत्ता स्कोर नहीं है। सच के अनुसार अनुभव चुनें।');
}
const PLAN_TYPES={
 exhibition:[['an art exhibition','कला प्रदर्शनी'],['a science poster day','विज्ञान पोस्टर दिवस'],['a library display','पुस्तकालय प्रदर्शनी'],['a map showcase','नक्शा प्रदर्शन']],
 study:[['a reading session','पढ़ने का समय'],['a homework session','गृहकार्य का समय'],['a language practice day','भाषा अभ्यास का दिन'],['a maths revision period','गणित दोहराने का समय']],
 event:[['a small class event','छोटा कक्षा कार्यक्रम'],['a plant-care activity','पौधा देखभाल गतिविधि'],['a music practice','संगीत अभ्यास'],['a recycling day','पुनर्चक्रण दिवस']],
 trip:[['a local museum visit','स्थानीय संग्रहालय भ्रमण'],['a school library visit','विद्यालय पुस्तकालय भ्रमण'],['a community garden visit','सामुदायिक उद्यान भ्रमण'],['a science fair visit','विज्ञान मेले का भ्रमण']],
 contingency:[['a group drawing','सामूहिक चित्र'],['a class presentation','कक्षा प्रस्तुति'],['a small model demo','मॉडल प्रदर्शन'],['a reading circle','पठन समूह']]
};
const PLAN_STEPS={
 exhibition:[['Choose the theme','विषय चुनें'],['List materials','सामग्री लिखें'],['Create the work','काम बनाएँ'],['Check all labels','सभी लेबल जाँचें'],['Arrange the display','प्रदर्शनी सजाएँ'],['Invite visitors','दर्शकों को बुलाएँ']],
 study:[['Choose a learning goal','पढ़ाई का लक्ष्य चुनें'],['Gather study notes','नोट्स जुटाएँ'],['Review examples','उदाहरण दोहराएँ'],['Practice questions','सवाल हल करें'],['Check mistakes','गलतियाँ जाँचें'],['Write a next-step plan','अगली योजना लिखें']],
 event:[['Decide on an activity','गतिविधि तय करें'],['Invite interested helpers','इच्छुक साथियों को बुलाएँ'],['Allocate safe tasks','सुरक्षित काम बाँटें'],['Prepare materials','सामग्री तैयार करें'],['Run the activity','गतिविधि करें'],['Clean up and reflect','सफ़ाई और समीक्षा करें']],
 trip:[['Choose the destination','जगह चुनें'],['Check permission and safety','अनुमति और सुरक्षा जाँचें'],['Make a travel plan','आने-जाने की योजना बनाएँ'],['Prepare what is needed','ज़रूरी सामान तैयार करें'],['Visit with supervision','निगरानी में भ्रमण करें'],['Reflect on the visit','भ्रमण पर विचार करें']],
 contingency:[['State the goal','लक्ष्य बताएँ'],['List possible obstacles','सम्भावित बाधाएँ लिखें'],['Choose the first plan','पहली योजना चुनें'],['Prepare a backup','वैकल्पिक योजना बनाएँ'],['Try the safe plan','सुरक्षित योजना आज़माएँ'],['Check if it worked','परिणाम जाँचें']]
};
function mission(age,kind,v){const L=LEVEL[age],[topic,topicHi]=PLAN_TYPES[kind][v],steps=PLAN_STEPS[kind].slice(0,3+L);
 return ordering('mission-scheduler',age,kind,v,`You are planning ${topic}. Each later step depends on the preceding step.`,
  `आप ${topicHi} की योजना बना रहे हैं। हर अगला चरण पहले चरण पर निर्भर है।`,steps.map(x=>x[0]),steps.map(x=>x[1]));
}
const BUILD={
 'logic-maze':maze,'number-market':market,'story-sequencer':storyOrder,
 'rotation-master':rotation,'gear-explorer':gear,'creative-studio':creative,
 'perspective-explorer':social,'mission-scheduler':mission
};
const KINDS={
 'logic-maze':['east','north','west','south','detour'],
 'number-market':['total','change','share','discount','compare'],
 'story-sequencer':['poster','garden','model','library','showcase'],
 'rotation-master':['clockwise','anticlockwise','halfturn','mirror','composite'],
 'gear-explorer':['pair','chain','middle','trace','reverse'],
 'creative-studio':['design','story','invention','constraints','improve'],
 'perspective-explorer':['invite','disagree','feedback','fairness','repair'],
 'mission-scheduler':['exhibition','study','event','trip','contingency']
};
export function getAgeAdaptiveBank(gameId,ageBand){
 if(!(gameId in BUILD))return null;
 if(!(ageBand in LEVEL))throw Error('Unknown age band');
 const all=KINDS[gameId].flatMap(k=>Array.from({length:4},(_,v)=>BUILD[gameId](ageBand,k,v)));
 if(all.length!==20||new Set(all.map(p=>p.id)).size!==20)throw Error('Invalid age-adaptive bank '+gameId);
 return all;
}