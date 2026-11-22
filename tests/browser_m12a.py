"""M12-A isolated browser integration test: 8 rebuilt banks × 4 ages × 5 tasks, plus Hindi.
Static HTML and JS modules are inlined ONLY for restricted local test environment;
not a substitute for live HTTPS/Hostinger/module-fetch testing.
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
bundle+=wrap('MOD_pattern','','AGE_BANDS,getBank,selectSession','pattern-engine.js')
bundle+=wrap('MOD_catalog','const {EXTRA_GAMES,getExtraBank}=MOD_expanded; const {getAgeAdaptiveBank}=MOD_ageadaptive; const {AGE_BANDS,selectSession}=MOD_pattern; const patternBank=MOD_pattern.getBank;','AGE_BANDS,selectSession,GAMES,GAME_IDS,getGameBank,evaluate,recommendedGame','catalog.js')
bundle+=wrap('MOD_growth','const {GAMES,GAME_IDS}=MOD_catalog;','emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,recordTeamSession,teamSummary,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip','growth-engine.js')
bundle+=wrap('MOD_team','','TEAM_MODES,TEAM_AGES,getTeamBank,pickTeamMissions,gradeRole,makeTeamResult','team-engine.js')
bundle+='\n{const {AGE_BANDS,GAMES,GAME_IDS,getGameBank,selectSession,evaluate,recommendedGame}=MOD_catalog;\nconst {emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,recordTeamSession,teamSummary,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip}=MOD_growth;\n'+src('app.js')+'\n}\n'
bundle+='\n{const {TEAM_MODES,pickTeamMissions,gradeRole,makeTeamResult}=MOD_team;const {localDay}=MOD_growth;\n'+src('team-app.js')+'\n}\n'
bundle+='window.__M12BANKS=MOD_catalog;window.__M12GAMES=MOD_ageadaptive.M12_GAMES;\n'
html=(ROOT/'index.html').read_text().replace('<script type="module" src="assets/app.js"></script>\n<script type="module" src="assets/team-app.js"></script>','<script>'+bundle+'</script>')
html=html.replace('href="assets/styles.css"','href="data:text/css;base64,'+base64.b64encode((ROOT/'assets/styles.css').read_bytes()).decode()+'"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded')
 report=page.evaluate('''() => {
  const $=id=>document.getElementById(id),
   change=(node,val)=>{node.value=val;node.dispatchEvent(new Event('change',{bubbles:true}))},
   ages=['6-10','11-14','15-17','18+'],ids=window.__M12GAMES;
  const data={sessions:0,answers:0,categories:new Set(),formats:new Set(),hindi:false};
  for(const age of ages)for(const id of ids){
   const game=window.__M12BANKS.GAMES.find(x=>x.id===id),bank=window.__M12BANKS.getGameBank(id,age);
   change($('age-select'),age);change($('category-filter'),game.category);
   const card=document.querySelector(`[data-game="${id}"]`);
   if(!card)throw Error('Missing card '+id);card.click();
   if($('start').disabled)throw Error('Fresh game unavailable '+id+'/'+age);
   $('start').click();
   for(let step=0;step<5;step++){
    if($('game').hidden)throw Error('Game hidden unexpectedly '+id+'/'+age+'/'+step);
    const prompt=$('question').textContent;
    const task=bank.find(x=>x.question===prompt&&x.context===$('context').textContent);
    if(!task)throw Error('Cannot identify question '+id+'/'+age+'/'+prompt);
    data.formats.add(task.interaction);
    if(task.interaction==='number'){
     const n=$('game-number-answer');n.value=task.answer;n.closest('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    }else if(task.interaction==='order'){
     for(const part of task.answer.split('|')){
      const btn=[...document.querySelectorAll('#choices .choice-inner button')].find(x=>x.dataset.choice===part);
      if(!btn)throw Error('Missing order part '+part);btn.click();
     }
     document.querySelector('#choices .order-actions button:last-child').click();
    }else {
     const index=task.mode==='reflection'?0:task.choices.indexOf(task.answer);
     const b=[...document.querySelectorAll('#choices button.option')][index];
     if(!b)throw Error('No choice button '+id+'/'+age);
     b.click();
    }
    if($('feedback').hidden||$('next').hidden)throw Error('Missing feedback '+task.id);
    if(task.mode==='scored'&&!$('feedback').textContent.includes('Nice work'))throw Error('Unexpected answer grading '+task.id);
    data.answers++;$('next').click();
   }
   if($('results').hidden)throw Error('Missing results '+id+'/'+age);
   data.sessions++;data.categories.add(game.category);$('back-home').click();
  }
  change($('lang'),'hi');change($('age-select'),'6-10');
  change($('category-filter'),'creative');
  document.querySelector('[data-game="creative-studio"]').click();$('start').click();
  data.hindi=$('question').textContent.includes('के') && $('mode-label').textContent.includes('कोई अंक नहीं');
  if(!data.hindi)throw Error('Hindi age-adapted UI missing');
  document.querySelector('#choices button.option').click();
  if($('feedback').hidden)throw Error('Hindi feedback missing');
  $('leave').click();
  return {...data,categories:[...data.categories],formats:[...data.formats]};
 }''')
 assert report['sessions']==32,report
 assert report['answers']==160,report
 assert len(report['categories'])==8,report
 assert set(report['formats'])=={'number','choice','order','reflection'},report
 assert report['hindi'] is True,report
 assert not errors,errors
 page.evaluate('''() => {const a=document.getElementById('age-select');a.value='15-17';a.dispatchEvent(new Event('change',{bubbles:true}));const lang=document.getElementById('lang');lang.value='en';lang.dispatchEvent(new Event('change',{bubbles:true}));const filter=document.getElementById('category-filter');filter.value='numerical';filter.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('[data-game="number-market"]').click();document.getElementById('start').click();}''')
 page.locator('#practice').scroll_into_view_if_needed()
 page.screenshot(path=str(ROOT/'preview-m12a-mobile.png'),full_page=False)
 print('M12-A BROWSER PASS',json.dumps(report),'| 0 JavaScript errors')
 browser.close()