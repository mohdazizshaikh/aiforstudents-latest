import {AGE_BANDS,GAMES,GAME_IDS,getGameBank,selectSession,evaluate,recommendedGame} from './catalog.js';
import {emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip,recordTeamSession,teamSummary,recordCareerMission,recordDigitalAttempt} from './growth-engine.js';
const $=id=>document.getElementById(id), KEY='aifs-discovery-v1',SESSION_KEY='aifs-discovery-session-v1';
const OLD_KEY='aifs-pattern-quest-v2',OLD_SESSION='aifs-pattern-quest-session-v2',V1_KEY='aifs-pattern-quest-v1',V1_SESSION='aifs-pattern-quest-session-v1';
const ST={age:'11-14',game:'pattern-quest',category:'logical-reasoning',lang:'en',remember:false,history:emptyHistory(),items:[],index:0,responses:[],answered:false,replay:false,sessionId:'',playing:false};
const DICT={
 skip:['Skip to games','खेलों पर जाएँ'],language:['Language','भाषा'],navGames:['Games','खेल'],navGrowth:['My growth','मेरी प्रगति'],navDaily:['Daily plan','आज की योजना'],navTeam:['Grow Together','साथ बढ़ें'],navPrivacy:['Privacy','गोपनीयता'],kicker:['A LITTLE DISCOVERY, EVERY DAY','हर दिन थोड़ी नई खोज'],heroTitle:['Discover what you enjoy. Grow what you can do.','खोजें आपको क्या पसंद है। अपनी क्षमताएँ बढ़ाएँ।'],heroBody:['Forty playful games across eight areas to explore ideas. Try different challenges, see your practice, and choose something to feel proud of today. Free, private on this device, no sign-up needed.','आठ श्रेणियों के चालीस खेलों से नए विचार खोजें। नई चुनौतियाँ आज़माएँ, अपना अभ्यास देखें और आज किस बात पर गर्व है यह चुनें। मुफ़्त, निजी और बिना साइन-अप।'],tag1:['8 categories · 40 games','8 श्रेणियाँ · 40 खेल'],tag2:['5 challenges per round','हर दौर में 5 गतिविधियाँ'],tag3:['No AI bills','कोई AI शुल्क नहीं'],explore:['Explore games ↓','खेल देखें ↓'],scope:['These are educational practice activities, not an IQ, psychological aptitude or career prediction test. Comparisons describe only this practice.','ये सीखने की गतिविधियाँ हैं, IQ, मनोवैज्ञानिक क्षमता या करियर भविष्यवाणी की परीक्षा नहीं। तुलना केवल अभ्यास के बारे में है।'],eyebrowPlay:['EXPLORE & PLAY','खोजें और खेलें'],choosePath:['Choose your discovery path','अपनी खोज चुनें'],chooseHelp:['Try one game today, another tomorrow. All forty are free.','आज एक खेल चुनें, कल दूसरा। सभी चालीस मुफ़्त हैं।'],ageLabel:['Age band (experimental, not calibrated)','उम्र समूह (प्रायोगिक, मानकीकृत नहीं)'],ready:['READY WHEN YOU ARE','जब आप तैयार हों'],start:['Start fresh challenges','नए सवाल शुरू करें'],replay:['Replay familiar challenges','पुराने सवाल फिर खेलें'],leave:['Leave round','दौर छोड़ें'],roundFinished:['ROUND COMPLETE','दौर पूरा'],back:['Back to games','खेलों पर लौटें'],resultCaution:['This round cannot measure intelligence or predict career suitability.','यह दौर बुद्धिमत्ता नहीं मापता और करियर तय नहीं कर सकता।'],private:['PRIVACY FIRST','गोपनीयता पहले'],deviceTitle:['Your device. Your choice.','आपका डिवाइस, आपका फ़ैसला'],deviceText:['Your practice stays in this browser. No account, ads, tracker, child profile upload or AI API call. Enable saving only if you want this browser to remember progress. On shared devices, clear local history and close other open tabs after use.','अभ्यास सिर्फ़ इसी ब्राउज़र में रहता है। कोई अकाउंट, विज्ञापन, ट्रैकर, बच्चों के प्रोफ़ाइल अपलोड या AI API नहीं। याद रखना चाहें तभी सेव करें। साझा डिवाइस पर उपयोग के बाद स्थानीय इतिहास मिटाएँ और दूसरे खुले टैब बंद करें।'],remember:['Remember my progress on this browser','इस ब्राउज़र में मेरी प्रगति याद रखें'],clear:['Clear local history','स्थानीय इतिहास मिटाएँ'],whyScores:['Creative and social activities are explorations, not graded ability tests. No public rankings or friend chat.','रचनात्मक और सामाजिक गतिविधियाँ खोज के लिए हैं, क्षमता का अंकित टेस्ट नहीं। न सार्वजनिक रैंकिंग, न चैट।'],learnMore:['Learn how feedback works','फीडबैक कैसे काम करता है'],growthTag:['MY GROWTH','मेरी प्रगति'],growthTitle:['Celebrate what you actually tried','आपने जो सच में किया उसका उत्सव मनाएँ'],growthSub:['Your own practice records, not your worth or an aptitude ranking.','ये अभ्यास का रिकॉर्ड है, आपका मूल्य या क्षमता की रैंकिंग नहीं।'],metricCategories:['Categories explored','खोजी गई श्रेणियाँ'],metricAttempts:['Activities tried in chosen game','चुने खेल में की गई गतिविधियाँ'],metricRounds:['Fresh rounds completed','नए पूरे हुए दौर'],todayTitle:['Today I practiced','आज मेरा अभ्यास'],comparisonTitle:['Practice-to-practice progress','अभ्यास की तुलना'],proudTitle:["Today's Proud Moments",'आज के गर्व वाले पल'],noBadges:["A good day doesn't require a badge or a perfect score.",'अच्छे दिन के लिए बैज या पूरे अंक ज़रूरी नहीं।'],dailyTag:['DAILY GROWTH','रोज़ की प्रगति'],dailyTitle:['Three useful next steps','अगले तीन छोटे कदम'],dailySub:['Short, optional activities. No streak penalties or pressure to invite friends.','छोटी वैकल्पिक गतिविधियाँ। रोज़ आने या दोस्त बुलाने का दबाव नहीं।'],tip:['Learning strategy: ','सीखने की तरकीब: '],reflectionTag:['PROUD TODAY','आज का गर्व'],reflectionTitle:['What felt meaningful today?','आज आपको किस बात से खुशी हुई?'],reflectionText:['Choose a truthful personal reflection. We never invent achievements or score your feelings.','सच के अनुसार अपनी बात चुनें। हम झूठी उपलब्धि या भावनाओं के अंक नहीं बनाते।'],reflectionLabel:['My reflection','मेरा अनुभव'],saveReflection:['Save reflection','अपनी बात सेव करें'],methodTag:['HOW IT WORKS','कैसे काम करता है'],methodTitle:['Play, reflect, return when it helps','खेलें, सोचें, जब उपयोगी लगे लौटें'],step1:['Pick a category','एक श्रेणी चुनें'],step1b:['Choose one of forty games. Age-band options are experimental and some tasks repeat across age bands.','चालीस में से एक खेल चुनें। उम्र समूह प्रायोगिक हैं और कुछ सवाल अलग उम्र समूहों में एक जैसे हैं।'],step2:['Learn from feedback','फीडबैक से सीखें'],step2b:['You see explanations or thoughtful prompts. No rankings or life labels.','समझाने वाले उत्तर या सोचने के सवाल देखें। कोई रैंक या जीवनभर का लेबल नहीं।'],step3:['Celebrate a real step','सच्चे प्रयास की खुशी'],step3b:['See an activity-based achievement, choose a reflection, and take a break.','गतिविधि पर आधारित उपलब्धि देखें, अपना अनुभव चुनें और विराम लें।'],keyboardHelp:['Keyboard: Tab to move between controls, Enter or Space to select. Ordering games use buttons and Undo; dragging is not required.','कीबोर्ड: नियंत्रण बदलने के लिए Tab और चुनने के लिए Enter या Space दबाएँ। क्रम वाले खेल में बटन और वापस करें विकल्प हैं; खींचना ज़रूरी नहीं।'],methodCaution:["This prototype's games are not expert-validated or calibrated across ages/languages. Different scores cannot establish which field a student is naturally best at. Content and accessibility reviews are still required before a public child-oriented launch.",'यह प्रोटोटाइप विशेषज्ञों द्वारा मान्य या उम्र/भाषा के अनुसार संतुलित परीक्षा नहीं है। अलग स्कोर से यह पता नहीं चलता कि बच्चा किस क्षेत्र में सबसे अच्छा होगा। सार्वजनिक लॉन्च से पहले सामग्री और सुगमता की जाँच ज़रूरी है।']
};
const tr=(en,hi)=>ST.lang==='hi'?hi:en;
function t(key){const v=DICT[key];return v?v[ST.lang==='hi'?1:0]:key}
const CATEGORY_LABELS={
 'logical-reasoning':['Logic & Patterns','तर्क और पैटर्न'],numerical:['Numerical','गणित'],language:['Language','भाषा'],spatial:['Spatial','स्थानिक सोच'],practical:['Practical & Mechanical','व्यावहारिक'],creative:['Creative Exploration','रचनात्मक'],social:['Social Reflection','सामाजिक चिंतन'],planning:['Planning','योजना']
};
function categoryLabel(id){const names=CATEGORY_LABELS[id]||[id,id];return tr(names[0],names[1])}
function renderGameMenu(){const all=Object.keys(CATEGORY_LABELS);$('category-filter').replaceChildren(...all.map(id=>new Option(`${categoryLabel(id)} · 5`,id)));$('category-filter').value=ST.category;
 const cards=GAMES.filter(g=>g.category===ST.category);const container=$('game-grid');container.replaceChildren();
 for(const g of cards){const b=document.createElement('button');b.type='button';b.dataset.game=g.id;b.className=`game-card${ST.game===g.id?' selected':''}`;b.setAttribute('aria-pressed',String(ST.game===g.id));
 const sym=document.createElement('span');sym.className='game-symbol';sym.textContent=g.icon;const name=document.createElement('strong');name.textContent=tr(g.en,g.hi);name.dataset.gameTitle=g.id;const desc=document.createElement('span');desc.textContent=tr(g.description,g.descHi);desc.dataset.gameDesc=g.id;b.append(sym,name,desc);container.append(b);}
 $('category-help').textContent=tr(`Showing five ${categoryLabel(ST.category)} games. Select one to begin.`,`इस श्रेणी में पाँच खेल हैं। शुरू करने के लिए एक चुनें।`);
}
function safeStorage(name){try{return window[name]}catch{return null}}
function read(s,k){try{return JSON.parse(s?.getItem(k)||'null')}catch{return null}}
function write(s,k,v){try{s?.setItem(k,JSON.stringify(v));return !!s}catch{return false}}
function remove(s,k){try{s?.removeItem(k)}catch{}}
function store(){const s=safeStorage(ST.remember?'localStorage':'sessionStorage'),k=ST.remember?KEY:SESSION_KEY;
 if(!write(s,k,ST.remember?{optIn:true,history:ST.history}:ST.history)){$('storage-warning').hidden=false;$('storage-warning').textContent=tr('Storage unavailable: progress may be lost.','स्टोरेज उपलब्ध नहीं: प्रगति मिट सकती है।')}}
function load(){const l=safeStorage('localStorage'),s=safeStorage('sessionStorage');const old=read(l,OLD_KEY),veryOld=read(l,V1_KEY),saved=read(l,KEY);
 ST.remember=Boolean(saved?.optIn||(!saved&& (old?.optIn||veryOld?.optIn)));
 if(ST.remember){ST.history=mergeHistory(veryOld?.history,old?.history,saved?.history);store();remove(l,OLD_KEY);remove(l,V1_KEY)}
 else ST.history=mergeHistory(read(s,V1_SESSION),read(s,OLD_SESSION),read(s,SESSION_KEY));
 $('remember').checked=ST.remember;
}
function bank(){return getGameBank(ST.game,ST.age)}
function seenForGame(){const currentIds=new Set(bank().map(p=>p.id));return ST.history.seen.filter(id=>currentIds.has(id))}
function gameMeta(){return GAMES.find(g=>g.id===ST.game)}
function updateLocale(){document.documentElement.lang=ST.lang;for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=t(el.dataset.i18n);
 renderGameMenu();
 $('reflection-choice').replaceChildren(new Option(tr('Choose a truthful reflection','सच्चा अनुभव चुनें'),''),...REFLECTIONS.map(r=>new Option(tr(r.en,r.hi),r.id)));
 $('lang').value=ST.lang;
 refresh();
}
function show(which){for(const id of ['lobby','game','results'])$(id).hidden=id!==which;
 if(['lobby','game','results'].includes(which))$(which).focus({preventScroll:true});
 if(which==='lobby')$('lobby').scrollIntoView({block:'nearest'});
}
function switchGame(id){if(!GAME_IDS.includes(id))return;if(ST.playing){$('feedback').hidden=false;$('feedback').textContent=tr('Finish or leave this round before choosing another game.','दूसरा खेल चुनने से पहले यह दौर पूरा करें या छोड़ें।');return}
 ST.game=id;ST.category=gameMeta().category;renderGameMenu();show('lobby');refresh();}
function refresh(){const meta=gameMeta(),seen=seenForGame().length,remaining=Math.max(0,20-seen);
 document.querySelectorAll('[data-game]').forEach(b=>{b.classList.toggle('selected',b.dataset.game===ST.game);b.setAttribute('aria-pressed',String(b.dataset.game===ST.game))});
 $('lobby-title').textContent=tr(meta.en,meta.hi);$('lobby-desc').textContent=tr(meta.description,meta.descHi);
 $('pool-count').textContent=tr(`${seen}/20 challenge variants seen in this game and age band.`,`${seen}/20 चुनौती प्रकार इस खेल और उम्र समूह में देखे गए।`);
 $('start').disabled=seen>=20;$('start').textContent=remaining>0?tr(`Play up to ${Math.min(5,remaining)} new challenges`,`अधिकतम ${Math.min(5,remaining)} नए सवाल खेलें`):tr('Fresh pool completed','नए सवाल पूरे हुए');
 $('replay').disabled=seen<20;$('replay-note').hidden=remaining!==0;$('replay-note').textContent=tr('All fresh variants are complete; replaying is optional and clearly labeled.','सभी नए सवाल देखे जा चुके हैं; दोहराव वैकल्पिक है और स्पष्ट बताया जाएगा।');
 const ageAdapted=bank()[0]?.contentVersion===2;
 const baselineNotice=meta.mode==='reflection'?tr('Open-ended exploration: your choices are never graded as aptitude.','खुली खोज: आपके विकल्पों को क्षमता के अंक नहीं दिए जाते।'):tr('Practice answers show task feedback, not talent or intelligence rankings.','अभ्यास के उत्तर दिखेंगे, लेकिन प्रतिभा या बुद्धिमत्ता की रैंकिंग नहीं।');
 $('lobby-disclaimer').textContent=baselineNotice+' '+(ageAdapted?tr('Age-specific practice questions redesigned in M12-A; educational and Hindi review pending.','M12-A में उम्र के अनुसार अभ्यास के सवाल बदले गए हैं; शैक्षिक और हिंदी समीक्षा बाकी है।'):tr('This game still needs age-variation and educational review.','इस खेल में उम्र के अनुसार बदलाव और शैक्षिक समीक्षा अभी बाकी है।'));
 renderDashboard();}
function newId(){return crypto?.randomUUID?.()||`s-${Date.now()}-${Math.random().toString(36).slice(2)}`}
function start(replay=false){if(window.AIFS_ACTIVITY?.team){$('privacy-status').textContent=tr('Finish or leave Grow Together before starting a solo round.','एकल दौर शुरू करने से पहले साथ में खेलना पूरा करें या छोड़ें।');return;}const seen=seenForGame(),b=bank(),selection=selectSession(b,replay?[]:seen,ST.history.sessions.length);
 if(selection.exhausted){refresh();return}
 ST.playing=true;window.AIFS_ACTIVITY.solo=true;window.dispatchEvent(new Event('aifs-solo-state-changed'));ST.items=selection.items;ST.index=0;ST.answered=false;ST.responses=[];ST.replay=replay;ST.sessionId=newId();
 $('game-note').hidden=!replay;$('game-note').textContent=tr('Replay mode: familiar tasks. These are excluded from fresh-round comparison.','दोहराव: पहले देखे गए सवाल। इन्हें नए दौर की तुलना में नहीं गिना जाएगा।');
 show('game');renderQuestion();}
function renderQuestion(){const item=ST.items[ST.index];if(!item){finish();return}ST.answered=false;
 $('game-progress').textContent=tr(`Challenge ${ST.index+1} of ${ST.items.length}`,`चुनौती ${ST.index+1} / ${ST.items.length}`);
 $('difficulty').textContent=tr(`Starting band: ${ST.age}`,`उम्र समूह: ${ST.age}`);
 $('mode-label').textContent=item.mode==='reflection'?tr('EXPLORE · NO SCORE','खोजें · कोई अंक नहीं'):tr('PRACTICE · ANSWER & LEARN','अभ्यास · जवाब और सीख');
 $('question').textContent=tr(item.question,item.questionHi||item.question);
 const ctxt=tr(item.context,item.contextHi||item.context);$('context').hidden=!ctxt;$('context').textContent=ctxt;
 $('sequence').hidden=!item.sequence?.length;
 $('sequence').replaceChildren(...(item.sequence||[]).map((value,i)=>{const tile=document.createElement('span');tile.className='seq-tile';tile.textContent=value;tile.setAttribute('aria-label',tr(`Item ${i+1}: ${value}`,`क्रम ${i+1}: ${value}`));return tile}),...(item.sequence?.length?[(()=>{const tile=document.createElement('span');tile.className='seq-tile mystery';tile.textContent='?';return tile})()]:[]));
 renderInput(item);
 $('feedback').hidden=true;$('next').hidden=true;$('question').focus();}
function renderInput(item){
 const el=$('choices');el.replaceChildren();el.classList.remove('single-input');
 const interaction=item.interaction||'choice';
 if(interaction==='number'){
  el.classList.add('single-input');const form=document.createElement('form');form.className='number-form';const label=document.createElement('label');label.htmlFor='game-number-answer';label.textContent=tr('Your whole-number answer','आपका पूरा अंक उत्तर');const input=document.createElement('input');input.type='number';input.id='game-number-answer';input.inputMode='numeric';input.required=true;input.step='1';input.min='0';input.max='99999999';input.setAttribute('aria-label',label.textContent);const btn=document.createElement('button');btn.type='submit';btn.className='btn';btn.textContent=tr('Check answer','उत्तर जाँचें');form.addEventListener('submit',e=>{e.preventDefault();if(!ST.answered&&input.checkValidity())answer(input.value.trim())});form.append(label,input,btn);el.append(form);return;
 }
 const selected=[];const makeButton=(choice,i)=>{const button=document.createElement('button');button.type='button';button.className='option';button.textContent=ST.lang==='hi'?(item.labelsHi?.[i]||choice):choice;return button};
 if(interaction==='order'){
  const instructions=document.createElement('p');instructions.className='muted small';instructions.textContent=tr('Tap the steps in the correct order. Use Undo to revise.','चरणों को सही क्रम में दबाएँ। बदलने के लिए वापस करें।');el.append(instructions);
  const preview=document.createElement('div');preview.className='order-preview';preview.setAttribute('aria-live','polite');el.append(preview);const buttons=document.createElement('div');buttons.className='choice-inner';el.append(buttons);
  const render=()=>{preview.textContent=tr('Your order: ','आपका क्रम: ')+(selected.join(' → ')||tr('none','अभी नहीं'));[...buttons.children].forEach(b=>{b.disabled=selected.includes(b.dataset.choice);b.setAttribute('aria-pressed',String(selected.includes(b.dataset.choice)))});commit.disabled=selected.length!==item.choices.length;undo.disabled=!selected.length};
  item.choices.forEach((choice,i)=>{const b=makeButton(choice,i);b.dataset.choice=choice;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(!selected.includes(choice)&&!ST.answered){selected.push(choice);render()}});buttons.append(b)});
  const controls=document.createElement('div');controls.className='order-actions';const undo=document.createElement('button');undo.className='btn outline compact';undo.textContent=tr('Undo','वापस');undo.type='button';undo.addEventListener('click',()=>{if(!ST.answered){selected.pop();render()}});const commit=document.createElement('button');commit.type='button';commit.className='btn compact';commit.textContent=tr('Check order','क्रम जाँचें');commit.addEventListener('click',()=>answer(selected.join('|')));controls.append(undo,commit);el.append(controls);render();return;
 }
 if(interaction==='multi'){
  const ins=document.createElement('p');ins.className='muted small';ins.textContent=tr('Choose all correct options, then check.','सभी सही विकल्प चुनें, फिर जाँचें।');el.append(ins);
  const buttons=document.createElement('div');buttons.className='choice-inner';el.append(buttons);
  item.choices.forEach((choice,i)=>{const b=makeButton(choice,i);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(ST.answered)return;const ix=selected.indexOf(choice);if(ix===-1)selected.push(choice);else selected.splice(ix,1);b.setAttribute('aria-pressed',String(selected.includes(choice)));b.classList.toggle('selected-option',selected.includes(choice));submit.disabled=!selected.length});buttons.append(b)});
  const submit=document.createElement('button');submit.type='button';submit.className='btn compact';submit.textContent=tr('Check selection','चयन जाँचें');submit.disabled=true;submit.addEventListener('click',()=>answer(selected.slice().sort().join('|')));el.append(submit);return;
 }
 item.choices.forEach((choice,i)=>{const b=makeButton(choice,i);b.addEventListener('click',()=>answer(choice));el.append(b)});
}
function answer(choice){if(ST.answered)return;const item=ST.items[ST.index],grade=evaluate(item,choice);ST.answered=true;
 [...$('choices').querySelectorAll('button')].forEach((b,i)=>{b.disabled=true;if(!item.interaction||item.interaction==='choice'||item.interaction==='reflection'){const value=item.choices[i];if(item.mode==='scored'){if(value===item.answer)b.classList.add('correct');if(value===choice&&!grade.correct)b.classList.add('wrong')}else if(value===choice)b.classList.add('selected-option')}});
 $('choices').querySelectorAll('input').forEach(input=>input.disabled=true);
 const at=new Date().toISOString();const attempt={scenarioId:item.id,gameId:ST.game,kind:item.kind,ageBand:ST.age,correct:grade.correct,at,day:localDay(),sessionId:ST.sessionId,replay:ST.replay,contentVersion:item.contentVersion??1};
 ST.responses.push(attempt);ST.history=recordAttempt(ST.history,attempt);store();
 let msg=grade.explanation; if(ST.lang==='hi')msg=grade.explanationHi||grade.explanation;
 $('feedback').textContent=item.mode==='reflection'?msg:(grade.correct?tr('Nice work! ','बहुत अच्छा! '):tr('Good attempt. ','अच्छी कोशिश। '))+msg;
 $('feedback').hidden=false;$('next').textContent=ST.index===ST.items.length-1?tr('See my progress','मेरी प्रगति देखें'):tr('Next challenge','अगली चुनौती');$('next').hidden=false;$('next').focus();renderDashboard();}
function finish(){ST.playing=false;window.AIFS_ACTIVITY.solo=false;window.dispatchEvent(new Event('aifs-solo-state-changed'));const meta=gameMeta(),attempted=ST.responses.length,correct=ST.responses.filter(a=>a.correct===true).length;
 const session={id:ST.sessionId,gameId:ST.game,ageBand:ST.age,attempted,correct:meta.mode==='scored'?correct:null,completedAt:new Date().toISOString(),day:localDay(),replay:ST.replay,formatVersion:2,contentVersion:ST.items[0]?.contentVersion??1,kinds:ST.responses.map(x=>x.kind),scenarioIds:ST.responses.map(x=>x.scenarioId)};
 ST.history=recordSession(ST.history,session);store();
 $('result-title').textContent=tr('You made time to explore!','आपने सीखने के लिए समय निकाला!');
 $('result-count').textContent=meta.mode==='scored'?`${correct} / ${attempted}`:tr(`${attempted} reflections explored`,`${attempted} अनुभवों पर विचार किया`);
 $('result-desc').textContent=meta.mode==='scored'?tr('These are correct responses in this round—not a measure of overall intelligence or talent.','ये इस दौर के सही जवाब हैं—कुल बुद्धिमत्ता या प्रतिभा का माप नहीं।'):tr('These tasks encourage ideas and reflection. There is no numeric creativity or social-ability score.','इन गतिविधियों में विचारों पर सोचते हैं। रचनात्मक या सामाजिक क्षमता का कोई अंक नहीं दिया जाता।');
 $('proud').textContent=tr('Proud moment: you completed a set of activities.','गर्व वाला पल: आपने गतिविधियों का एक दौर पूरा किया।');
 show('results');refresh();}
function makeEl(tag,className,textContent){const e=document.createElement(tag);if(className)e.className=className;if(textContent!==undefined)e.textContent=textContent;return e}
function renderDashboard(){const p=progressSummary(ST.history,ST.age,ST.game),meta=gameMeta();const categories=new Set(ST.history.attempts.filter(a=>a.ageBand===ST.age).map(a=>GAMES.find(g=>g.id===a.gameId)?.category).filter(Boolean));
 $('metric-categories').textContent=`${categories.size}/8`;$('metric-attempts').textContent=p.attempts;$('metric-correct').textContent=meta.mode==='scored'?p.correct:'—';
 $('correct-label').textContent=meta.mode==='scored'?tr('Correct answers in chosen game','चुने खेल में सही उत्तर'):tr('Not scored in this category','इस श्रेणी में अंक नहीं');$('metric-rounds').textContent=p.rounds;
 $('today-activity').textContent=p.todayAttempts?tr(`You tried ${p.todayAttempts} activities in ${meta.en} today.`,`आज आपने ${meta.hi} की ${p.todayAttempts} गतिविधियाँ कीं।`):tr('No activity in this game recorded today. Try when you feel ready.','आज इस खेल में कोई गतिविधि दर्ज नहीं हुई। मन हो तो खेलें।');
 $('growth-comparison').replaceChildren();let comparison='';
 if(meta.mode==='reflection')comparison=tr('This is a reflection activity. We do not assign numerical ability scores.','यह चिंतन गतिविधि है। इसमें क्षमता के अंक नहीं दिए जाते।');
 else if(p.comparison)comparison=tr(`Previous round ${p.comparison.prior}/5 → latest ${p.comparison.current}/5. Difference ${p.comparison.delta>0?'+':''}${p.comparison.delta} correct answers. Same task types but variants are NOT calibrated or equated: this does not establish an aptitude change.`,`पिछला दौर ${p.comparison.prior}/5 → नया ${p.comparison.current}/5। अंतर ${p.comparison.delta>0?'+':''}${p.comparison.delta} सही उत्तर। सवाल अलग हैं और वैज्ञानिक रूप से समान कठिनाई के नहीं माने गए; यह क्षमता में बदलाव नहीं बताता।`);
 else comparison=tr('Complete two fresh five-task rounds in this game to see a cautious practice comparison.','इस खेल में पाँच-पाँच नए सवालों के दो दौर पूरे करें, फिर सावधानी से तुलना देखें।');
 $('growth-comparison').textContent=comparison;
 const awards=getAchievements(ST.history),holder=$('achievements');holder.replaceChildren();if(!awards.length)holder.append(makeEl('p','small muted',tr('No recorded milestones today yet. Every honest effort counts.','अभी आज का कोई दर्ज पड़ाव नहीं है। सच्ची कोशिश मायने रखती है।')));
 for(const a of awards){const card=makeEl('div','achievement');card.append(makeEl('strong','',tr(a.title,a.titleHi)),makeEl('p','small muted',tr(a.detail,a.detailHi)));holder.append(card)}
 const saved=ST.history.reflections.find(x=>x.day===localDay());$('reflection-choice').value=saved?.choiceId||'';$('reflection-status').textContent=saved?tr('Saved on this device for today. You can change it.','आज का अनुभव इसी डिवाइस पर सेव है। आप बदल सकते हैं।'):tr('Optional. Select a statement that is true for you.','वैकल्पिक। केवल सच्चा अनुभव चुनें।');
 const plans=dailyPlan(ST.history,ST.age,ST.game,20-seenForGame().length,ST.lang),daily=$('daily-tasks');daily.replaceChildren();
 for(const plan of plans){const card=makeEl('div','daily-card');card.append(makeEl('span',`status ${plan.done?'complete':''}`,plan.done?tr('Completed','पूरा हुआ'):tr('Optional','वैकल्पिक')),makeEl('h3','',plan.title),makeEl('p','',plan.description));const btn=makeEl('button','btn outline compact',plan.action==='play'?tr('Open game','खेल खोलें'):plan.action==='review'?tr('Read strategy','रणनीति पढ़ें'):tr('Choose reflection','अनुभव चुनें'));btn.type='button';btn.addEventListener('click',()=>{
 if(plan.action==='play'){$('practice').scrollIntoView({block:'start'});if(!ST.playing){if(seenForGame().length<20)start(false);else start(true)}}
 if(plan.action==='review'){$('strategy-tip').textContent=getPracticeTip(ST.game,ST.lang);$('strategy-note').hidden=false;ST.history=markReview(ST.history,localDay());store();renderDashboard()}
 if(plan.action==='reflect'){$('reflection-choice').focus();$('proud-today').scrollIntoView({block:'center'});}});card.append(btn);daily.append(card)}
}
$('category-filter').addEventListener('change',e=>{if(ST.playing){e.target.value=ST.category;return;}ST.category=e.target.value;ST.game=GAMES.find(g=>g.category===ST.category)?.id||'pattern-quest';show('lobby');renderGameMenu();refresh()});
$('game-grid').addEventListener('click',e=>{const b=e.target.closest('button[data-game]');if(b)switchGame(b.dataset.game)});
$('age-select').addEventListener('change',e=>{if(ST.playing){e.target.value=ST.age;return}if(!AGE_BANDS.some(a=>a.id===e.target.value))return;ST.age=e.target.value;refresh()});
$('lang').addEventListener('change',e=>{if(ST.playing){e.target.value=ST.lang;$('feedback').hidden=false;$('feedback').textContent=tr('Finish or leave the round before changing language.','भाषा बदलने से पहले दौर पूरा करें या छोड़ें।');return;}ST.lang=e.target.value==='hi'?'hi':'en';updateLocale()});
$('start').addEventListener('click',()=>start(false));$('replay').addEventListener('click',()=>start(true));
$('next').addEventListener('click',()=>{if(!ST.answered)return;ST.index++;if(ST.index>=ST.items.length)finish();else renderQuestion()});
$('leave').addEventListener('click',()=>{ST.playing=false;window.AIFS_ACTIVITY.solo=false;window.dispatchEvent(new Event('aifs-solo-state-changed'));ST.items=[];ST.responses=[];show('lobby');refresh()});
$('back-home').addEventListener('click',()=>show('lobby'));
$('remember').addEventListener('change',e=>{ST.remember=Boolean(e.target.checked);const l=safeStorage('localStorage'),s=safeStorage('sessionStorage');
 if(ST.remember){ST.history=mergeHistory(ST.history,read(s,SESSION_KEY));store();remove(s,SESSION_KEY)}else{remove(l,KEY);store()}
 $('privacy-status').textContent=ST.remember?tr('Remembered only on this device.','सिर्फ़ इसी डिवाइस पर सेव।'):tr('Kept only in this tab until closed.','टैब बंद होने तक ही रहेगा।');});
// M28: a minimal same-browser signal, never student responses or identifiers.
let privacyClearChannel=null;
try{if(typeof BroadcastChannel==='function')privacyClearChannel=new BroadcastChannel('aifs-discovery-privacy-reset-v1')}catch{}
function clearAllHistory(notifyPeers=true){
 for(const key of [KEY,OLD_KEY,V1_KEY])remove(safeStorage('localStorage'),key);
 for(const key of [SESSION_KEY,OLD_SESSION,V1_SESSION])remove(safeStorage('sessionStorage'),key);
 ST.history=emptyHistory();
 window.dispatchEvent(new Event('aifs-team-reset'));
 window.dispatchEvent(new Event('aifs-team-history-changed'));
 window.dispatchEvent(new Event('aifs-history-cleared'));
 ST.remember=false;ST.playing=false;window.AIFS_ACTIVITY.solo=false;
 window.dispatchEvent(new Event('aifs-solo-state-changed'));
 ST.items=[];ST.responses=[];$('remember').checked=false;
 $('strategy-note').hidden=true;$('storage-warning').hidden=true;
 show('lobby');refresh();
 $('privacy-status').textContent=tr('Local history cleared.','स्थानीय इतिहास मिटा दिया गया।');
 if(notifyPeers){
  try{privacyClearChannel?.postMessage({type:'clear-history'})}catch{}
  // Separate control-only signal: removing the history key (e.g. disabling remember)
  // is NOT an explicit request to erase another tab's session.
  try{const s=safeStorage('localStorage');s?.setItem('aifs-privacy-clear-signal-v1','clear');s?.removeItem('aifs-privacy-clear-signal-v1')}catch{}
 }
}
$('clear-progress').addEventListener('click',()=>clearAllHistory(true));
privacyClearChannel?.addEventListener('message',event=>{
 if(event.data?.type==='clear-history')clearAllHistory(false);
});
// Explicit control-only fallback also reaches session-only tabs without BroadcastChannel.
window.addEventListener('storage',event=>{
 if(event.storageArea===safeStorage('localStorage')&&
    event.key==='aifs-privacy-clear-signal-v1'&&event.newValue==='clear')clearAllHistory(false);
});
$('save-reflection').addEventListener('click',()=>{const val=$('reflection-choice').value;if(!val){$('reflection-status').textContent=tr('Choose a statement first.','पहले विकल्प चुनें।');return}ST.history=saveReflection(ST.history,localDay(),val);store();renderDashboard()});
window.AIFS_DIGITAL_BRIDGE={
 getHistory:()=>ST.history,
 record:entry=>{ST.history=recordDigitalAttempt(ST.history,entry);store();renderDashboard();window.dispatchEvent(new Event('aifs-digital-history-changed'))}
};
window.AIFS_EXPERIMENT_BRIDGE={
 getHistory:()=>ST.history,
 record:entry=>{ST.history=recordExperimentAttempt(ST.history,entry);store();renderDashboard();window.dispatchEvent(new Event('aifs-experiment-history-changed'))}
};
window.AIFS_STUDIO_BRIDGE={
 getHistory:()=>ST.history,
 record:entry=>{ST.history=recordStudioAttempt(ST.history,entry);store();renderDashboard();window.dispatchEvent(new Event('aifs-studio-history-changed'))}
};
window.AIFS_LAB_BRIDGE={
 getHistory:()=>ST.history,
 record:entry=>{ST.history=recordLabAttempt(ST.history,entry);store();renderDashboard();window.dispatchEvent(new Event('aifs-lab-history-changed'))}
};
window.AIFS_FUTURE_BRIDGE={
 getHistory:()=>ST.history,
 record:entry=>{ST.history=recordCareerMission(ST.history,entry);store();renderDashboard();window.dispatchEvent(new Event('aifs-future-history-changed'))}
};
window.AIFS_TEAM_BRIDGE={
 getSeen:(mode,age)=>ST.history.teamSessions.filter(s=>s.mode===mode&&s.ageBand===age).flatMap(s=>s.missionIds),
 summary:age=>teamSummary(ST.history,age),
 record:session=>{ST.history=recordTeamSession(ST.history,session);store();renderDashboard();window.dispatchEvent(new Event('aifs-team-history-changed'))}
};
// M35: a restored back-forward-cache page may have missed a peer clear signal.
 // Drop this tab's stale session state and reinitialize from the current opt-in store.
 // Do not erase another tab's valid persistent preference or transmit any history.
 window.addEventListener('pageshow',event=>{
  if(!event.persisted)return;
  for(const key of [SESSION_KEY,OLD_SESSION,V1_SESSION])remove(safeStorage('sessionStorage'),key);
  location.reload();
 });
window.AIFS_ACTIVITY={solo:false,team:false};
load();try{const url=new URL(location.href);const param=url.searchParams.get('game');if(GAME_IDS.includes(param)){ST.game=param;ST.category=gameMeta().category}if(['en','hi'].includes(url.searchParams.get('lang')))ST.lang=url.searchParams.get('lang')}catch{}
$('age-select').value=ST.age;updateLocale();$('privacy-status').textContent=ST.remember?tr('Progress is saved on this browser only.','प्रगति केवल इसी ब्राउज़र पर सेव है।'):tr('Progress stays in this tab unless you choose to remember it.','जब तक याद रखने का विकल्प नहीं चुनते, प्रगति इसी टैब तक रहेगी।');
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./service-worker.js').catch(()=>{});