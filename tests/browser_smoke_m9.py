"""Offline/inlined module UI test. Does not prove live Hostinger deployment or SW fetch."""
from pathlib import Path
import re,base64
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
html=(ROOT/'index.html').read_text()
html=html.replace('<script type="module" src="assets/app.js"></script>\n<script type="module" src="assets/team-app.js"></script>','<script>'+bundle+'</script>')
html=html.replace('href="assets/styles.css"','href="data:text/css;base64,'+base64.b64encode((ROOT/'assets/styles.css').read_bytes()).decode()+'"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':420,'height':870},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(100)
 assert page.locator('button[data-game]').count()==5,errors
 assert page.locator('#team-play').count()==1
 page.locator('#team-play').scroll_into_view_if_needed();page.screenshot(path=str(ROOT/'preview-team-lobby.png'),full_page=False)
 page.locator('#team-surface > button.btn').click()
 assert 'Player 1' in page.locator('#team-surface h3').inner_text()
 for i in range(3):
  page.locator('#team-surface .team-actions button').first.click()
  assert 'Player 1' in page.locator('#team-surface h3').inner_text()
  page.locator('#team-surface .team-options button').first.click()
  page.locator('#team-surface > button.btn').click()
  assert 'Player 2' in page.locator('#team-surface h3').inner_text()
  page.locator('#team-surface .team-actions button').first.click()
  page.locator('#team-surface .team-options button').first.click()
  page.locator('#team-surface > button.btn').click()
  assert 'Together' in page.locator('#team-surface h3').inner_text()
  page.locator('#team-surface .team-options button').first.click()
  page.locator('#team-surface > button.btn').click()
  assert 'practice' in page.locator('#team-surface h3').inner_text().lower() or 'solved' in page.locator('#team-surface h3').inner_text().lower()
  if i==0:
   page.locator('#team-play').scroll_into_view_if_needed();page.screenshot(path=str(ROOT/'preview-team-feedback.png'),full_page=False)
   page.locator('.team-quick-btn').first.click();assert page.locator('#team-cheer').inner_text()
  page.locator('#team-surface .team-actions button').first.click()
 assert 'Team adventure complete' in page.locator('#team-surface h3').inner_text(), errors
 assert 'Team Adventure Complete' in page.locator('#achievements').inner_text(),page.locator('#achievements').inner_text()
 assert page.locator('#team-mode-label').inner_text().startswith('Round')
 page.locator('#team-play').scroll_into_view_if_needed();page.screenshot(path=str(ROOT/'preview-team-complete.png'),full_page=False)
 # Re-enter, change mode and test Hindi; age selection remains external and UI remains operable.
 page.locator('#team-surface .team-actions button').first.click()
 page.locator('#team-mode').select_option('number-bridge')
 page.locator('#lang').select_option('hi')
 assert 'साथ बढ़ें' in page.locator('#team-title').inner_text()
 page.locator('#team-surface > button.btn').click()
 assert 'खिलाड़ी 1' in page.locator('#team-surface h3').inner_text()
 page.locator('#team-leave').click()
 # Clear history removes team achievements and prevents stale team count.
 page.locator('#clear-progress').click()
 assert 'Team Adventure Complete' not in page.locator('#achievements').inner_text()
 assert not errors, errors
 print('M9 BROWSER PASS | full 3-mission 2-role co-op | achievement | quick encouragement | Hindi | reset | 0 JS errors')
 browser.close()