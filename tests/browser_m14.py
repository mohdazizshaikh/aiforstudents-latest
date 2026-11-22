"""Isolated Chromium E2E: M12-A + M12-B updated games and Future Explorer.
HTML/JS inlined because this runtime blocks localhost navigation. Not live HTTPS verification.
"""
from pathlib import Path
import re, base64, json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def src(name):
 t=(ROOT/'assets'/name).read_text()
 t=re.sub(r'^import .*?;\s*$', '',t,flags=re.M)
 t=re.sub(r'^export \{[^}]*\};\s*$', '',t,flags=re.M)
 return t.replace('export const ','const ').replace('export function ','function ')
def wrap(name,pre,ret,file):return f'const {name}=(()=>{{\n{pre}\n{src(file)}\nreturn {{{ret}}};\n}})();\n'
bundle=''
bundle+=wrap('MOD_expanded','','EXTRA_GAMES,getExtraBank','expanded-library.js')
bundle+=wrap('MOD_ageadaptive','','M12_GAMES,getAgeAdaptiveBank','age-adaptive.js')
bundle+=wrap('MOD_ageadaptiveb','const {getExtraBank}=MOD_expanded;','M12B_GAMES,getAgeAdaptiveBBank','age-adaptive-b.js')
bundle+=wrap('MOD_future','','PATHS,AGE_BANDS,OFFICIAL_RESOURCES,getMission,explorePaths,validateMissionRecord','future-engine.js')
bundle+=wrap('MOD_pattern','','AGE_BANDS,getBank,selectSession','pattern-engine.js')
bundle+=wrap('MOD_catalog','const {EXTRA_GAMES,getExtraBank}=MOD_expanded; const {getAgeAdaptiveBank}=MOD_ageadaptive; const {getAgeAdaptiveBBank}=MOD_ageadaptiveb; const {AGE_BANDS,selectSession}=MOD_pattern; const patternBank=MOD_pattern.getBank;','AGE_BANDS,selectSession,GAMES,GAME_IDS,getGameBank,evaluate,recommendedGame','catalog.js')
bundle+=wrap('MOD_lab','','LAB_BANDS,LAB_TOPICS,LAB_LESSON_IDS,ALL_LAB_LESSONS,getLabLesson,gradeLabAnswer,labProgress,isValidLabAttempt','lab-engine.js')
bundle+=wrap('MOD_growth','const {GAMES,GAME_IDS}=MOD_catalog; const {validateMissionRecord}=MOD_future; const {isValidLabAttempt}=MOD_lab;','emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,recordTeamSession,teamSummary,recordCareerMission,recordLabAttempt,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip','growth-engine.js')
bundle+=wrap('MOD_team','','TEAM_MODES,TEAM_AGES,getTeamBank,pickTeamMissions,gradeRole,makeTeamResult','team-engine.js')
bundle+='\n{const {AGE_BANDS,GAMES,GAME_IDS,getGameBank,selectSession,evaluate,recommendedGame}=MOD_catalog;\nconst {emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,recordTeamSession,teamSummary,recordCareerMission,recordLabAttempt,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip}=MOD_growth;\n'+src('app.js')+'\n}\n'
bundle+='\n{const {TEAM_MODES,pickTeamMissions,gradeRole,makeTeamResult}=MOD_team;const {localDay}=MOD_growth;\n'+src('team-app.js')+'\n}\n'
bundle+='\n{const {PATHS,AGE_BANDS,OFFICIAL_RESOURCES,getMission,explorePaths}=MOD_future;\n'+src('future-app.js')+'\n}\n'
bundle+='\n{const {LAB_TOPICS,LAB_LESSON_IDS,getLabLesson,gradeLabAnswer,labProgress}=MOD_lab;\n'+src('lab-app.js')+'\n}\n'
bundle+='window.__LAB=MOD_lab;window.__M12BANKS=MOD_catalog;window.__M12GAMES=[...MOD_ageadaptive.M12_GAMES,...MOD_ageadaptiveb.M12B_GAMES];window.__FUTURE=MOD_future;\n'
html=(ROOT/'index.html').read_text()
html=re.sub(r'<script type="module" src="assets/(?:app|team-app|future-app|lab-app)\.js"></script>\s*','',html)
storage_mock="""<script>const mockStorage=()=>{const map=new Map();return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),clear:()=>map.clear(),get length(){return map.size},key:i=>[...map.keys()][i]||null}};Object.defineProperty(window,'sessionStorage',{configurable:true,value:mockStorage()});Object.defineProperty(window,'localStorage',{configurable:true,value:mockStorage()});</script>"""
html=html.replace('</body>',storage_mock+'<script>'+bundle+'</script></body>')
html=html.replace('href="assets/styles.css"','href="data:text/css;base64,'+base64.b64encode((ROOT/'assets/styles.css').read_bytes()).decode()+'"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':400,'height':850},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded')
 report=page.evaluate('''() => {
  const $=id=>document.getElementById(id),change=(e,val)=>{e.value=val;e.dispatchEvent(new Event('change',{bubbles:true}))};
  const results={sessions:0,questions:0,updatedGames:window.__M12GAMES.length,methods:new Set(),ages:new Set(),hindi:false};
  for(const age of ['6-10','11-14','15-17','18+'])for(const id of window.__M12GAMES){
   const game=window.__M12BANKS.GAMES.find(g=>g.id===id),bank=window.__M12BANKS.getGameBank(id,age);
   change($('age-select'),age);change($('category-filter'),game.category);
   const card=document.querySelector(`[data-game="${id}"]`);if(!card)throw Error('Missing game '+id);card.click();
   if($('start').disabled)throw Error('Start disabled '+id+'/'+age);$('start').click();
   for(let j=0;j<5;j++){
    if($('game').hidden)throw Error('Game hidden '+id+'/'+age+'/'+j);
    const prompt=$('question').textContent,context=$('context').textContent;
    const item=bank.find(x=>x.question===prompt&&(x.context||'')===context);
    if(!item)throw Error('Cannot identify item '+id+'/'+age+'/'+prompt+' '+context);
    results.methods.add(item.interaction);
    if(item.interaction==='number'){$('game-number-answer').value=item.answer;$('game-number-answer').closest('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))}
    else if(item.interaction==='order'){for(const part of item.answer.split('|')){const btn=[...document.querySelectorAll('#choices .choice-inner button')].find(x=>x.dataset.choice===part);if(!btn)throw Error('Missing letter/order '+part);btn.click()}document.querySelector('#choices .order-actions button:last-child').click()}
    else {const chosen=item.mode==='reflection'?item.choices[0]:item.answer;const pos=item.choices.indexOf(chosen);const btn=[...document.querySelectorAll('#choices button.option')][pos];if(!btn)throw Error('Missing answer option '+id);btn.click()}
    if($('feedback').hidden||$('next').hidden)throw Error('Missing feedback '+id+'/'+age);
    if(item.mode==='scored'&&!$('feedback').textContent.includes('Nice work'))throw Error('Incorrect keyed answer '+item.id);
    results.questions++;$('next').click();
   }
   if($('results').hidden)throw Error('Missing result '+id+'/'+age);results.sessions++;results.ages.add(age);$('back-home').click();
  }
  change($('lang'),'hi');change($('age-select'),'6-10');change($('category-filter'),'language');
  document.querySelector('[data-game="word-builder"]').click();$('start').click();
  results.hindi=$('question').textContent.includes('अक्षरों')&&$('mode-label').textContent.length>0;
  if(!results.hindi)throw Error('Hindi M12-B UI missing');$('leave').click();
  const future=$('future-explorer');if(!future)throw Error('Future explorer missing');
  const interest=document.querySelector('#future-interests button');if(!interest)throw Error('No interest selector');interest.click();
  if(document.querySelector('#future-interests button').getAttribute('aria-pressed')!=='true')throw Error('Interest button not set');
  let mission=window.__FUTURE.getMission(window.__FUTURE.PATHS[0].id,'6-10');
  const completedBefore=window.AIFS_FUTURE_BRIDGE.getHistory().careerMissions.length;
  const first=document.querySelector('#future-paths button');if(!first)throw Error('Mission action missing');first.click();
  const completedAfter=window.AIFS_FUTURE_BRIDGE.getHistory().careerMissions.length;
  if(completedAfter!==completedBefore+1)throw Error('Mission recording failed');
  if(!document.querySelector('#achievements .achievement'))throw Error('Proud moment not shown');
  $('clear-progress').click();if(window.AIFS_FUTURE_BRIDGE.getHistory().careerMissions.length!==0)throw Error('History clear failed');
  results.futurePathCards=$('future-paths').children.length;results.missionRecorded=true;results.historyClear=true;
  change($('lang'),'en');change($('age-select'),'11-14');
  const surface=$('team-surface');let startBtn=surface.querySelector(':scope > button.btn');if(!startBtn)throw Error('Coop start missing');startBtn.click();
  if(!surface.querySelector('h3')?.textContent.includes('Player 1'))throw Error('Coop player 1 missing');
  for(let step=0;step<3;step++){
   surface.querySelector('.team-actions button')?.click();
   surface.querySelector('.team-options button')?.click();
   surface.querySelector(':scope > button.btn')?.click();
   if(!surface.querySelector('h3')?.textContent.includes('Player 2'))throw Error('Coop player 2 missing');
   surface.querySelector('.team-actions button')?.click();
   surface.querySelector('.team-options button')?.click();
   surface.querySelector(':scope > button.btn')?.click();
   if(!surface.querySelector('h3')?.textContent.includes('Together'))throw Error('Joint answer missing');
   surface.querySelector('.team-options button')?.click();
   surface.querySelector(':scope > button.btn')?.click();
   surface.querySelector('.team-actions button')?.click();
  }
  if(!surface.textContent.includes('Team adventure complete'))throw Error('Team complete missing');
  if(!$('achievements').textContent.includes('Team Adventure Complete'))throw Error('Team achievement missing');
  results.teamRound=true;
  const engine=window.__LAB;
  let checks=0;
  for(const age of ['6-10','11-14','15-17','18+']){
    change($('age-select'),age);
    for(const topic of engine.LAB_TOPICS){
      const b=[...$('lab-topics').children].find(x=>x.textContent===topic.en);if(!b)throw Error('Missing subject '+topic.en);b.click();
      for(const id of engine.LAB_LESSON_IDS){
        const lesson=engine.getLabLesson(id,age);if(lesson.topic!==topic.id)continue;
        const choices=[...$('lab-lessons').children];const ix=engine.LAB_LESSON_IDS.filter(x=>engine.getLabLesson(x,age).topic===topic.id).indexOf(id);
        choices[ix].click();
        if($('lab-question').textContent!==lesson.question)throw Error('Lesson prompt mismatch: '+id+'/'+age);
        const ans=$('lab-options').children[lesson.answerIndex];if(!ans)throw Error('Study answer option missing');ans.click();
        if($('lab-feedback').hidden||!$('lab-feedback').textContent.includes('Correct'))throw Error('Study feedback missing '+id+'/'+age);
        checks++;$('lab-repeat').click();
      }
    }
  }
  if(checks!==32)throw Error('Expected 32 study checks');
  results.studyChecks=checks;results.studyHistory=window.AIFS_LAB_BRIDGE.getHistory().labAttempts.length;
  if(results.studyHistory!==32)throw Error('Study history records missing '+results.studyHistory);
  change($('lang'),'hi');if(!$('lab-heading').textContent.includes('अध्ययन'))throw Error('Hindi study UI missing');
  if(!$('lab-question').textContent.match(/[\u0900-\u097f]/))throw Error('Hindi question missing');
  $('remember').click();if(!localStorage.length)throw Error('Browser remembering not active');
  $('clear-progress').click();if(window.AIFS_LAB_BRIDGE.getHistory().labAttempts.length!==0)throw Error('Study history not cleared');
  results.studyClear=true;results.studyHindi=true;

  return {...results,methods:[...results.methods],ages:[...results.ages]};
 }''')
 assert report['sessions']==88,report
 assert report['questions']==440,report
 assert report['updatedGames']==22,report
 assert set(report['methods'])=={'choice','order','number','reflection'},report
 assert report['futurePathCards']==12 and report['missionRecorded'] and report['historyClear'] and report['teamRound'],report
 assert report['hindi'] is True and report['studyChecks']==32 and report['studyHistory']==32 and report['studyClear'] and report['studyHindi'],report
 assert not errors,errors
 page.locator('#study-lab').scroll_into_view_if_needed()
 page.screenshot(path=str(ROOT/'preview-study-mobile.png'),full_page=False)
 page.evaluate('''() => {document.querySelector('a[href="#practice"]').click();}''')
 page.screenshot(path=str(ROOT/'preview-home-mobile.png'),full_page=False)
 print('M14 BROWSER PASS',json.dumps(report),'0 JS errors')
 browser.close()