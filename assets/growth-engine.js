/** Evidence based, locally stored learning history. Never makes psychometric claims. */
import {GAMES,GAME_IDS} from './catalog.js';
import {validateMissionRecord} from './future-engine.js';
import {isValidLabAttempt} from './lab-engine.js';
import {isValidStudioAttempt} from './studio-engine.js';
import {isValidExperimentAttempt} from './experiment-engine.js';
export const REFLECTIONS=[
 {id:'tried',en:'I tried something new.',hi:'मैंने कुछ नया करने की कोशिश की।'},
 {id:'mistake',en:'I learned from a mistake.',hi:'मैंने अपनी गलती से कुछ सीखा।'},
 {id:'idea',en:'I explored an idea.',hi:'मैंने एक नए विचार पर सोचा।'},
 {id:'help',en:'I thought about helping someone.',hi:'मैंने किसी की मदद करने पर विचार किया।'},
 {id:'steady',en:'I took a thoughtful step today.',hi:'आज मैंने सोच-समझकर एक कदम बढ़ाया।'}
];
const BANDS=['6-10','11-14','15-17','18+'];
const validDay=d=>typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
const validISO=s=>typeof s==='string' && /^\d{4}-\d{2}-\d{2}T/.test(s) && Number.isFinite(Date.parse(s));
export const localDay=(v=new Date())=>{const d=v instanceof Date?v:new Date(v);if(!Number.isFinite(d.getTime()))return '';return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const gameId=a=>a.gameId||'pattern-quest';
const validAttempt=a=>a && typeof a==='object' && BANDS.includes(a.ageBand) && GAME_IDS.includes(gameId(a)) && typeof a.scenarioId==='string' && a.scenarioId.length<110 && typeof a.kind==='string' && a.kind.length<45 && (typeof a.correct==='boolean' || a.correct===null) && validISO(a.at) && typeof a.sessionId==='string' && a.sessionId.length<100;
const validSession=s=>s && typeof s==='object' && BANDS.includes(s.ageBand) && GAME_IDS.includes(gameId(s)) && Number.isInteger(s.attempted) && s.attempted>=0 && s.attempted<=5 && (s.correct===null||(Number.isInteger(s.correct) && s.correct>=0 && s.correct<=s.attempted)) && validISO(s.completedAt) && typeof s.id==='string' && s.id.length<110;
export const emptyHistory=()=>({seen:[],attempts:[],sessions:[],reflections:[],dailyActions:[],teamSessions:[],careerMissions:[],labAttempts:[],studioAttempts:[],experimentAttempts:[]});
const TEAM_MODES=new Set(['pattern-partners','number-bridge','story-signals']);
const validTeamSession=s=>s&&typeof s==='object'&&typeof s.id==='string'&&s.id.length>0&&s.id.length<110&&BANDS.includes(s.ageBand)&&TEAM_MODES.has(s.mode)&&validISO(s.completedAt)&&validDay(s.day)&&Number.isInteger(s.attempted)&&s.attempted>0&&s.attempted<=3&&Number.isInteger(s.solved)&&s.solved>=0&&s.solved<=s.attempted&&Array.isArray(s.missionIds)&&s.missionIds.length===s.attempted&&new Set(s.missionIds).size===s.attempted&&s.missionIds.every(x=>typeof x==='string'&&x.startsWith(s.mode+':'+s.ageBand+':')&&x.length<100)&&s.roleActions?.p1===s.attempted&&s.roleActions?.p2===s.attempted;
export function recordTeamSession(history,session){if(!validTeamSession(session))throw Error('Invalid co-op session');const h=normalizeHistory(history);if(!h.teamSessions.some(x=>x.id===session.id))h.teamSessions.push(session);return normalizeHistory(h)}
export function teamSummary(history,ageBand){const h=normalizeHistory(history),sessions=h.teamSessions.filter(s=>s.ageBand===ageBand);return {rounds:sessions.length,missions:sessions.reduce((a,s)=>a+s.attempted,0),solved:sessions.reduce((a,s)=>a+s.solved,0)}};
const dedupe=(arr,key,max)=>[...new Map(arr.map(x=>[key(x),x])).values()].slice(-max);
export function normalizeHistory(value){const h=value&&typeof value==='object'?value:{};
 return {
  seen:[...new Set((Array.isArray(h.seen)?h.seen:[]).filter(x=>typeof x==='string'&&x.length<110))].slice(-6000),
  attempts:dedupe((Array.isArray(h.attempts)?h.attempts:[]).filter(validAttempt).map(x=>({...x,gameId:gameId(x),mode:x.correct===null?'reflection':'scored'})),x=>`${x.sessionId}:${x.scenarioId}`,4500),
  sessions:dedupe((Array.isArray(h.sessions)?h.sessions:[]).filter(validSession).map(x=>({...x,gameId:gameId(x),mode:x.correct===null?'reflection':'scored'})),x=>x.id,900),
  reflections:dedupe((Array.isArray(h.reflections)?h.reflections:[]).filter(x=>x&&validDay(x.day)&&REFLECTIONS.some(r=>r.id===x.choiceId)).map(x=>({day:x.day,choiceId:x.choiceId})),x=>x.day,180),
  dailyActions:dedupe((Array.isArray(h.dailyActions)?h.dailyActions:[]).filter(x=>x&&validDay(x.day)&&x.actionId==='review').map(x=>({day:x.day,actionId:'review'})),x=>`${x.day}:${x.actionId}`,365),
  teamSessions:dedupe((Array.isArray(h.teamSessions)?h.teamSessions:[]).filter(validTeamSession).map(x=>({...x,missionIds:[...x.missionIds],roleActions:{p1:x.roleActions.p1,p2:x.roleActions.p2}})),x=>x.id,300),
  careerMissions:dedupe((Array.isArray(h.careerMissions)?h.careerMissions:[]).filter(validateMissionRecord).map(x=>({...x})),x=>x.missionId,100),
  labAttempts:dedupe((Array.isArray(h.labAttempts)?h.labAttempts:[]).filter(isValidLabAttempt).map(x=>({...x})),x=>x.id,600),
  studioAttempts:dedupe((Array.isArray(h.studioAttempts)?h.studioAttempts:[]).filter(isValidStudioAttempt).map(x=>({...x})),x=>x.id,300),
  experimentAttempts:dedupe((Array.isArray(h.experimentAttempts)?h.experimentAttempts:[]).filter(isValidExperimentAttempt).map(x=>({...x,response:JSON.parse(JSON.stringify(x.response))})),x=>x.id,400)
 };
}
export function mergeHistory(...sources){let all=emptyHistory();for(const source of sources){const h=normalizeHistory(source);for(const key of Object.keys(all))all[key].push(...h[key]);}return normalizeHistory(all)}
export function recordAttempt(history,entry){if(!validAttempt(entry))throw new Error('Invalid attempt');const h=normalizeHistory(history);
 if(!h.attempts.some(x=>x.sessionId===entry.sessionId&&x.scenarioId===entry.scenarioId))h.attempts.push({...entry,gameId:gameId(entry)});
 if(!h.seen.includes(entry.scenarioId))h.seen.push(entry.scenarioId);
 return normalizeHistory(h);
}
export function recordSession(history,session){if(!validSession(session))throw new Error('Invalid round');const h=normalizeHistory(history);if(!h.sessions.some(x=>x.id===session.id))h.sessions.push({...session,gameId:gameId(session)});return normalizeHistory(h)}
export function recordCareerMission(history,entry){if(!validateMissionRecord(entry))throw Error('Invalid self-reported exploration');const h=normalizeHistory(history);if(!h.careerMissions.some(x=>x.missionId===entry.missionId))h.careerMissions.push({...entry});return normalizeHistory(h)}
export function recordStudioAttempt(history,entry){if(!isValidStudioAttempt(entry))throw Error('Invalid studio attempt');const h=normalizeHistory(history);if(!h.studioAttempts.some(x=>x.id===entry.id))h.studioAttempts.push({...entry});return normalizeHistory(h)}
export function recordExperimentAttempt(history,entry){if(!isValidExperimentAttempt(entry))throw Error('Invalid experiment attempt');const h=normalizeHistory(history);if(!h.experimentAttempts.some(x=>x.id===entry.id))h.experimentAttempts.push({...entry,response:JSON.parse(JSON.stringify(entry.response))});return normalizeHistory(h)}
export function recordLabAttempt(history,entry){if(!isValidLabAttempt(entry))throw Error('Invalid study attempt');const h=normalizeHistory(history);if(!h.labAttempts.some(x=>x.id===entry.id))h.labAttempts.push({...entry});return normalizeHistory(h)}
export function saveReflection(history,day,choiceId){if(!validDay(day)||!REFLECTIONS.some(x=>x.id===choiceId))throw new Error('Invalid reflection');const h=normalizeHistory(history);h.reflections=h.reflections.filter(x=>x.day!==day);h.reflections.push({day,choiceId});return normalizeHistory(h)}
export function markReview(history,day){if(!validDay(day))throw new Error('Invalid date');const h=normalizeHistory(history);if(!h.dailyActions.some(x=>x.day===day&&x.actionId==='review'))h.dailyActions.push({day,actionId:'review'});return normalizeHistory(h)}
const TIPS={
 'pattern-quest':['Look for a repeating rule, then test it with every item.','क्रम में दोहराया जाने वाला नियम खोजें और हर चरण से जाँचें।'],
 'number-market':['Write down what you know and decide whether to add, subtract, share or multiply.','दी गई संख्याएँ लिखें। फिर तय करें कि जोड़ना, घटाना, बाँटना या गुणा करना है।'],
 'story-detective':['Find the exact sentence that supports your answer; distinguish facts from guesses.','उत्तर को सही ठहराने वाला वाक्य खोजें। तथ्य और अनुमान अलग रखें।'],
 'shape-builder':['Visualize one turn or mirror step at a time. Drawing a grid may help.','एक-एक घुमाव या दर्पण चरण सोचें। ग्रिड बनाना मदद कर सकता है।'],
 'fix-the-machine':['Describe the mechanism and trace one cause-and-effect step at a time.','मशीन का काम समझें और कारण-प्रभाव एक-एक चरण में देखें।'],
 'creative-studio':['Try two ideas; compare which requirement each one meets.','दो विचार आज़माएँ और सोचें कि दोनों किस काम आते हैं।'],
 'perspective-explorer':['Consider what each person needs; different respectful approaches can work.','सोचें हर व्यक्ति को क्या चाहिए; कई सम्मानजनक तरीके संभव हैं।'],
 'strategy-island':['List your time or supply limit before choosing a plan.','योजना चुनने से पहले समय या सामान की सीमा लिखें।']
};
export function getPracticeTip(game,lang='en'){const category=GAMES.find(x=>x.id===game)?.category;const categoryTips={'logical-reasoning':'pattern-quest','numerical':'number-market','language':'story-detective','spatial':'shape-builder','practical':'fix-the-machine','creative':'creative-studio','social':'perspective-explorer','planning':'strategy-island'};const pair=TIPS[game]||TIPS[categoryTips[category]]||TIPS['pattern-quest'];return pair[lang==='hi'?1:0]}
export function progressSummary(history,ageBand,game){const h=normalizeHistory(history),id=game||'pattern-quest';const attempts=h.attempts.filter(x=>x.ageBand===ageBand&&x.gameId===id);const sessions=h.sessions.filter(x=>x.ageBand===ageBand&&x.gameId===id&&x.attempted===5&&!x.replay);const scored=GAMES.find(g=>g.id===id)?.mode==='scored';const [before,after]=sessions.slice(-2);
 let comparison=null;
 if(scored&&before&&after&&before.formatVersion===after.formatVersion&&(before.contentVersion??1)===(after.contentVersion??1)&&Array.isArray(before.kinds)&&Array.isArray(after.kinds)&&before.kinds.length===5&&after.kinds.length===5&&[...before.kinds].sort().join('|')===[...after.kinds].sort().join('|')&&Array.isArray(before.scenarioIds)&&Array.isArray(after.scenarioIds)&&!after.scenarioIds.some(x=>before.scenarioIds.includes(x))) comparison={prior:before.correct,current:after.correct,delta:after.correct-before.correct};
 return {attempts:attempts.length,correct:scored?attempts.filter(x=>x.correct===true).length:null,kinds:new Set(attempts.map(x=>x.kind)).size,rounds:sessions.length,todayAttempts:attempts.filter(x=>x.day===localDay()).length,comparison};
}
export function getAchievements(history,today=localDay()){
 const h=normalizeHistory(history),list=[],todayAttempts=h.attempts.filter(a=>a.day===today);
 const allEarlier=new Set(h.attempts.filter(a=>a.day<today).map(a=>a.gameId));
 for(const g of new Set(todayAttempts.map(a=>a.gameId))){
  const first=h.attempts.filter(a=>a.gameId===g).every(a=>a.day===today);
  if(first||!allEarlier.has(g))list.push({id:`explore:${g}:${today}`,title:'New Explorer',titleHi:'नई खोज',detail:`You tried ${GAMES.find(x=>x.id===g)?.en} today.`,detailHi:`आज आपने ${GAMES.find(x=>x.id===g)?.hi} आज़माया।`});
 }
 for(const s of h.sessions.filter(s=>s.day===today&&s.attempted===5)){
  const g=GAMES.find(x=>x.id===s.gameId);list.push({id:`round:${s.id}`,title:'Round Complete',titleHi:'दौर पूरा',detail:`You finished five ${g?.en||'practice'} activities.`,detailHi:`आपने ${g?.hi||'अभ्यास'} की पाँच गतिविधियाँ पूरी कीं।`});
  if(s.correct===5)list.push({id:`five:${s.id}`,title:'Five Puzzles Solved',titleHi:'पाँच पहेलियाँ हल',detail:'You answered all five scored questions in this round.',detailHi:'इस दौर में आपने पाँचों अंकित सवाल सही किए।'});
 }
 if(todayAttempts.some(a=>a.correct===null))list.push({id:`reflective:${today}`,title:'Thoughtful Explorer',titleHi:'सोचने वाला खोजी',detail:'You tried an open-ended reflection activity.',detailHi:'आपने एक खुली चिंतन गतिविधि आज़माई।'});
 if(h.experimentAttempts.some(x=>x.day===today))list.push({id:`experiment:${today}`,title:'Virtual Lab Explorer',titleHi:'वर्चुअल प्रयोग खोजकर्ता',detail:'You tested a simulation setup today. This records exploration, not expertise.',detailHi:'आज आपने एक मॉडल प्रयोग आज़माया। यह अनुभव का रिकॉर्ड है, विशेषज्ञता का नहीं।'});
 if(h.studioAttempts.some(x=>x.day===today))list.push({id:`studio:${today}`,title:'Smart Studio Practice',titleHi:'स्मार्ट स्टूडियो अभ्यास',detail:'You tried an interactive learning step today. This records activity, not mastery.',detailHi:'आज आपने एक इंटरैक्टिव सीखने वाला चरण आज़माया। यह अभ्यास का रिकॉर्ड है, पूर्ण दक्षता नहीं।'});
 if(h.labAttempts.some(x=>x.day===today))list.push({id:`lab:${today}`,title:'Study Check Tried',titleHi:'अध्ययन जाँच की',detail:'You answered at least one short study question today. This is practice, not a mastery certificate.',detailHi:'आज आपने कम से कम एक छोटा अध्ययन प्रश्न हल किया। यह अभ्यास है, पूर्ण दक्षता का प्रमाणपत्र नहीं।'});
 for(const mission of h.careerMissions.filter(x=>x.day===today)){
  list.push({id:`mission:${mission.missionId}`,title:'Future Explorer Step',titleHi:'भविष्य की एक खोज',detail:'You marked a hands-on exploration mission as tried. This is self-reported, not an assessed skill.',detailHi:'आपने खुद एक खोज मिशन आज़माने की जानकारी दी। यह स्वयं बताया गया अनुभव है, आंकी हुई क्षमता नहीं।'});
 }
 for(const s of h.teamSessions.filter(x=>x.day===today)){
  list.push({id:`coop:${s.id}`,title:'Team Adventure Complete',titleHi:'टीम का साहसिक खेल पूरा',detail:`Two game roles completed ${s.attempted} shared puzzles on one device.`,detailHi:`एक डिवाइस पर दो खेल-भूमिकाओं ने ${s.attempted} साझा पहेलियाँ पूरी कीं।`});
  if(s.solved>0)list.push({id:`coopsuccess:${s.id}`,title:'We Solved It Together',titleHi:'हमने मिलकर हल किया',detail:`Your shared answers solved ${s.solved} of ${s.attempted} puzzles.`,detailHi:`आपके साझा जवाबों से ${s.attempted} में से ${s.solved} पहेलियाँ हल हुईं।`});
 }
 return dedupe(list,x=>x.id,12);
}
export function dailyPlan(history,ageBand,game,remaining,lang='en',today=localDay()){
 const h=normalizeHistory(history),play=h.sessions.some(s=>s.ageBand===ageBand&&s.gameId===game&&s.day===today);
 const review=h.dailyActions.some(x=>x.day===today&&x.actionId==='review'),reflect=h.reflections.some(x=>x.day===today);
 const hi=lang==='hi';return [
  {id:'play',done:play,action:'play',title:hi?'आज का नया खेल':'Try a fresh game',description:remaining>0?(hi?`${remaining} नए चुनौती सेट बचे हैं।`:`${remaining} unseen challenges remain in this game.`):(hi?'सभी नए सेट पूरे हो गए; दोहराव स्पष्ट बताया जाएगा।':'Fresh pool completed; replays are clearly labeled.')},
  {id:'review',done:review,action:'review',title:hi?'एक उपयोगी रणनीति':'Review a helpful strategy',description:getPracticeTip(game,lang)},
  {id:'reflect',done:reflect,action:'reflect',title:hi?'आज की गर्व वाली बात':'Choose a proud moment',description:hi?'केवल वही बात चुनें जो सच लगे।':'Choose only a reflection that is true for you.'}
 ];
}