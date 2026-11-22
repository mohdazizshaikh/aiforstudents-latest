"""M16 integrated isolated Chromium UI smoke: inline modules due local HTTP restrictions. No live HTTPS assertion."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re,base64,json
ROOT=Path(__file__).resolve().parents[1]
def src(name):
 t=(ROOT/'assets'/name).read_text()
 t=re.sub(r'^import .*?;\s*$', '',t,flags=re.M)
 t=re.sub(r'^export \{[^}]*\};\s*$', '',t,flags=re.M)
 return t.replace('export const ','const ').replace('export function ','function ')
def wrap(name,pre,ret,file):return f'const {name}=(()=>{{\n{pre}\n{src(file)}\nreturn {{{ret}}};\n}})();\n'
bundle=''
bundle+=wrap('MOD_extra','','EXTRA_GAMES,getExtraBank','expanded-library.js')
bundle+=wrap('MOD_age','','M12_GAMES,getAgeAdaptiveBank','age-adaptive.js')
bundle+=wrap('MOD_ageb','const {getExtraBank}=MOD_extra;','M12B_GAMES,getAgeAdaptiveBBank','age-adaptive-b.js')
bundle+=wrap('MOD_future','','PATHS,AGE_BANDS,OFFICIAL_RESOURCES,getMission,explorePaths,validateMissionRecord','future-engine.js')
bundle+=wrap('MOD_pattern','','AGE_BANDS,getBank,selectSession','pattern-engine.js')
bundle+=wrap('MOD_catalog','const {EXTRA_GAMES,getExtraBank}=MOD_extra; const {getAgeAdaptiveBank}=MOD_age; const {getAgeAdaptiveBBank}=MOD_ageb; const {AGE_BANDS,selectSession}=MOD_pattern; const patternBank=MOD_pattern.getBank;','AGE_BANDS,selectSession,GAMES,GAME_IDS,getGameBank,evaluate,recommendedGame','catalog.js')
bundle+=wrap('MOD_lab','','LAB_BANDS,LAB_TOPICS,LAB_LESSON_IDS,ALL_LAB_LESSONS,getLabLesson,gradeLabAnswer,labProgress,isValidLabAttempt','lab-engine.js')
bundle+=wrap('MOD_studio','','STUDIO_IDS,STUDIO_LESSONS,STUDIO_VERSION,studioExercise,studioCheck,studioLang,isValidStudioAttempt,studioSummary','studio-engine.js')
bundle+=wrap('MOD_experiment','','EXPERIMENT_IDS,EXPERIMENTS,EXPERIMENT_VERSION,experimentTask,experimentText,relation,bulbLit,evaluateExperiment,isValidExperimentAttempt,experimentSummary','experiment-engine.js')
bundle+=wrap('MOD_growth','const {GAMES,GAME_IDS}=MOD_catalog;const {validateMissionRecord}=MOD_future;const {isValidLabAttempt}=MOD_lab;const {isValidStudioAttempt}=MOD_studio;const {isValidExperimentAttempt}=MOD_experiment;','emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,recordTeamSession,teamSummary,recordCareerMission,recordLabAttempt,recordStudioAttempt,recordExperimentAttempt,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip','growth-engine.js')
bundle+=wrap('MOD_team','','TEAM_MODES,TEAM_AGES,getTeamBank,pickTeamMissions,gradeRole,makeTeamResult','team-engine.js')
bundle+='\n{const {AGE_BANDS,GAMES,GAME_IDS,getGameBank,selectSession,evaluate,recommendedGame}=MOD_catalog;\nconst {emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,recordTeamSession,teamSummary,recordCareerMission,recordLabAttempt,recordStudioAttempt,recordExperimentAttempt,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip}=MOD_growth;\n'+src('app.js')+'\n}\n'
bundle+='\n{const {TEAM_MODES,pickTeamMissions,gradeRole,makeTeamResult}=MOD_team;const {localDay}=MOD_growth;\n'+src('team-app.js')+'\n}\n'
bundle+='\n{const {PATHS,AGE_BANDS,OFFICIAL_RESOURCES,getMission,explorePaths}=MOD_future;\n'+src('future-app.js')+'\n}\n'
bundle+='\n{const {LAB_TOPICS,LAB_LESSON_IDS,getLabLesson,gradeLabAnswer,labProgress}=MOD_lab;\n'+src('lab-app.js')+'\n}\n'
bundle+='\n{const {STUDIO_IDS,STUDIO_LESSONS,studioExercise,studioCheck,studioLang,studioSummary,STUDIO_VERSION}=MOD_studio;\n'+src('studio-app.js')+'\n}\n'
bundle+='\n{const {EXPERIMENT_IDS,EXPERIMENTS,EXPERIMENT_VERSION,experimentTask,experimentText,relation,bulbLit,evaluateExperiment,experimentSummary}=MOD_experiment;\n'+src('experiment-app.js')+'\n}\n'
html=(ROOT/'index.html').read_text()
html=re.sub(r'<script type="module" src="assets/(?:app|team-app|future-app|lab-app|studio-app|experiment-app)\.js"></script>\s*','',html)
storage='''<script>const makeStore=()=>{let m=new Map();return{getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,''+v),removeItem:k=>m.delete(k),clear:()=>m.clear(),get length(){return m.size}}};Object.defineProperty(window,'sessionStorage',{configurable:true,value:makeStore()});Object.defineProperty(window,'localStorage',{configurable:true,value:makeStore()});</script>'''
html=html.replace('</body>',storage+'<script>'+bundle+'</script></body>')
html=html.replace('href="assets/styles.css"','href="data:text/css;base64,'+base64.b64encode((ROOT/'assets/styles.css').read_bytes()).decode()+'"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded')
 report=page.evaluate('''() => {
  const $=id=>document.getElementById(id),change=(e,v)=>{e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}))};
  const notes=[];
  for(const journey of ['fractions','circuit-path']){
   const tab=[...$('studio-lessons').children].find(x=>x.textContent.includes(journey==='fractions'?'Fractions':'Simple circuits'));
   if(!tab)throw Error('Missing lesson tab '+journey);tab.click();
   if(!$('studio-learn').hidden){}else throw Error('Not on Learn');
   $('studio-start').click();if($('studio-try').hidden)throw Error('Try not opened');
   if(journey==='fractions'){document.querySelector('#studio-controls button:nth-child(3)').click();document.querySelector('#studio-controls button:nth-child(3)').click()}
   else document.querySelector('#studio-controls button').click();
   $('studio-check').click();if($('studio-feedback').hidden||!$('studio-feedback').textContent.includes('correct'))throw Error('Try feedback absent: '+journey+' '+$('studio-feedback').textContent);
   $('studio-forward').click();if($('studio-question').textContent.length<12)throw Error('Play question absent');
   document.querySelector('#studio-controls button').click();if($('studio-feedback').hidden)throw Error('Play feedback absent');
   $('studio-forward').click();if($('studio-understand').hidden)throw Error('Understand absent');
   $('studio-understand-next').click();if($('studio-grow').hidden||!$('studio-resource').href.startsWith('https:'))throw Error('Grow absent');
   notes.push(journey);
  }
  let h=window.AIFS_STUDIO_BRIDGE.getHistory();if(h.studioAttempts.length!==4)throw Error('Expected 4 studio tries, got '+h.studioAttempts.length);
  if(!document.querySelector('#achievements')?.textContent.includes('Smart Studio Practice'))throw Error('Proud event missing');
  // M16: fraction comparison, equivalence, then conceptual two-switch circuit.
  let tabs=[...$('experiment-tabs').children];if(tabs.length!==2)throw Error('Missing virtual lab tabs');
  if(!tabs[0].textContent.includes('Fraction'))throw Error('Missing Fraction Explorer');
  const adjust=document.querySelectorAll('#experiment-controls .experiment-strip-actions button')[1];adjust.focus();adjust.click();
  if(!document.activeElement?.closest('#experiment-controls')||document.activeElement.disabled)throw Error('Fraction adjustment lost keyboard focus');
  document.querySelector('#experiment-reset').click();
  if(!$('experiment-question').textContent.includes('Use the controls'))throw Error('Fractions compare prompt absent');
  const buttons=[...document.querySelectorAll('#experiment-controls .experiment-choice-row button')];
  if(buttons.length!==3)throw Error('Comparison choices absent');buttons[0].click();
  $('experiment-check').click();if($('experiment-feedback').hidden||!$('experiment-feedback').textContent.includes('meets the task'))throw Error('Comparison explanation absent');
  document.querySelectorAll('#experiment-tasks button')[1].click();
  $('experiment-check').click();if($('experiment-feedback').hidden||!$('experiment-feedback').textContent.includes('meets the task'))throw Error('Equivalence setup not accepted');
  tabs=[...$('experiment-tabs').children];tabs[1].click();
  if(!document.querySelector('#experiment-controls .experiment-switch-row'))throw Error('Switch controls absent');
  for(const btn of [...document.querySelectorAll('#experiment-controls .experiment-switch-row button')])btn.click();
  $('experiment-check').click();if(!document.querySelector('#experiment-feedback').textContent.includes('meets the task'))throw Error('Both switches closed not accepted');
  document.querySelectorAll('#experiment-tasks button')[1].click();
  document.querySelector('#experiment-controls .experiment-switch-row button').click();
  $('experiment-check').click();if(!document.querySelector('#experiment-feedback').textContent.includes('meets the task'))throw Error('Series switch interrupt not accepted');
  const expH=window.AIFS_EXPERIMENT_BRIDGE.getHistory();if(expH.experimentAttempts.length!==4)throw Error('Expected 4 virtual experiment attempts');
  if(!$('achievements').textContent.includes('Virtual Lab Explorer'))throw Error('Virtual Lab Pride evidence absent');
  $('remember').click();if(!localStorage.length)throw Error('Persist toggle not stored');
  change($('lang'),'hi');if(!$('studio-title').textContent.includes('स्मार्ट'))throw Error('Hindi studio title absent');
  if(!$('studio-lesson-title').textContent.includes('परिपथ'))throw Error('Hindi studio lesson absent');
  if(!$('experiment-heading').textContent.includes('प्रयोगशाला'))throw Error('Hindi virtual lab title absent');
  $('clear-progress').click();h=window.AIFS_STUDIO_BRIDGE.getHistory();if(h.studioAttempts.length!==0)throw Error('Clear left studio history');
  if(h.experimentAttempts.length!==0)throw Error('Clear left experiment history');
  if($('studio-learn').hidden)throw Error('Clear failed to reset studio state');
  return {journeys:notes,studioChecks:4,experimentChecks:4,hindi:true,clear:true};
 }''')
 assert not errors,errors
 assert report['journeys']==['fractions','circuit-path'],report
 page.evaluate("""() => {document.getElementById('lang').value='en';document.getElementById('lang').dispatchEvent(new Event('change',{bubbles:true})); document.querySelector('#studio-lessons button').click()}""")
 page.locator('#experiment-lab').scroll_into_view_if_needed()
 page.screenshot(path=str(ROOT/'preview-experiment-mobile.png'),full_page=False)
 page.evaluate("""() => window.scrollTo(0,0)""")
 page.screenshot(path=str(ROOT/'preview-home-m16.png'),full_page=False)
 print('M16 CHROMIUM UI PASS',json.dumps(report),'runtimeErrors:',errors)
 browser.close()