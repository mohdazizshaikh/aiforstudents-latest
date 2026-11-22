"""M8 isolated Chromium smoke checks. Inline modules for offline/no-localhost browser policy.
Does NOT verify production module fetch, service worker, SEO indexing, or Hostinger deployment.
"""
from pathlib import Path
import re, base64
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def src(name):
 text=(ROOT/'assets'/name).read_text()
 text=re.sub(r'^import .*?;\s*$', '', text, flags=re.M)
 text=re.sub(r'^export \{[^}]*\};\s*$', '', text,flags=re.M)
 return text.replace('export const ','const ').replace('export function ','function ')
def wrap(name,pre,ret,file):return f'const {name}=(()=>{{\n{pre}\n{src(file)}\nreturn {{{ret}}};\n}})();\n'
bundle=''
bundle+=wrap('MOD_expanded','','EXTRA_GAMES,getExtraBank','expanded-library.js')
bundle+=wrap('MOD_ageadaptive','','M12_GAMES,getAgeAdaptiveBank','age-adaptive.js')
bundle+=wrap('MOD_pattern','','AGE_BANDS,getBank,selectSession','pattern-engine.js')
bundle+=wrap('MOD_catalog','const {EXTRA_GAMES,getExtraBank}=MOD_expanded; const {getAgeAdaptiveBank}=MOD_ageadaptive; const {AGE_BANDS,selectSession}=MOD_pattern; const patternBank=MOD_pattern.getBank;','AGE_BANDS,selectSession,GAMES,GAME_IDS,getGameBank,evaluate,recommendedGame','catalog.js')
bundle+=wrap('MOD_growth','const {GAMES,GAME_IDS}=MOD_catalog;','emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip','growth-engine.js')
bundle+='\n{const {AGE_BANDS,GAMES,GAME_IDS,getGameBank,selectSession,evaluate,recommendedGame}=MOD_catalog;\nconst {emptyHistory,normalizeHistory,mergeHistory,recordAttempt,recordSession,saveReflection,markReview,localDay,REFLECTIONS,progressSummary,getAchievements,dailyPlan,getPracticeTip}=MOD_growth;\n'+src('app.js')+'\n}\n'
html=(ROOT/'index.html').read_text().replace('<script type="module" src="assets/app.js"></script>','<script>'+bundle+'</script>')
html=html.replace('href="assets/styles.css"','href="data:text/css;base64,'+base64.b64encode((ROOT/'assets/styles.css').read_bytes()).decode()+'"')

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':400,'height':860},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(150)
 assert page.locator('#category-filter option').count()==8
 assert page.locator('button[data-game]').count()==5, ('menu',errors)
 assert 'Pattern Quest' in page.locator('#lobby-title').inner_text(),errors
 page.screenshot(path=str(ROOT/'preview-mobile.png'),full_page=True)
 kinds_seen=set();games=0
 def do_first():
  typ='choice'
  if page.locator('.number-form input').count():
   page.locator('.number-form input').fill('1');page.locator('.number-form button').dispatch_event('click');typ='number'
  elif page.locator('.order-actions').count():
   page.locator('.choice-inner button').all()[0].dispatch_event('click')
   page.locator('.choice-inner button').all()[1].dispatch_event('click')
   page.locator('.choice-inner button').all()[2].dispatch_event('click')
   # some ordering templates have four items
   for btn in page.locator('.choice-inner button').all():
    if not btn.is_disabled():btn.dispatch_event('click')
   page.locator('.order-actions button').last.dispatch_event('click');typ='order'
  elif page.locator('.choice-inner button').count():
   page.locator('.choice-inner button').nth(0).dispatch_event('click');page.locator('.choice-inner button').nth(2).dispatch_event('click')
   page.locator('#choices > button').last.dispatch_event('click');typ='multi'
  else:
   page.locator('#choices > button').first.dispatch_event('click')
   if 'NO SCORE' in page.locator('#mode-label').inner_text():typ='reflection'
  assert not page.locator('#next').is_hidden(), ('next hidden',typ,errors)
  return typ
 cats=['logical-reasoning','numerical','language','spatial','practical','creative','social','planning']
 for cat in cats:
  page.locator('#category-filter').select_option(cat)
  buttons=page.locator('button[data-game]')
  assert buttons.count()==5,(cat,errors)
  ids=[x.get_attribute('data-game') for x in buttons.all()][:1]
  if cat=='logical-reasoning':ids.append('sequence-builder')
  if cat=='numerical':ids.extend(['math-explorer','budget-challenge'])
  for gid in ids:
   page.locator(f'button[data-game="{gid}"]').dispatch_event('click')
   assert not page.locator('#start').is_disabled(),(gid,errors)
   page.locator('#start').dispatch_event('click');assert not page.locator('#game').is_hidden(),gid
   kinds_seen.add(do_first());games+=1
   page.locator('#leave').dispatch_event('click')
  print('CATEGORY PASS',cat)
 assert games==11 and len(kinds_seen)==5,(games,kinds_seen)
 assert page.locator('#metric-categories').inner_text()=='8/8',page.locator('#metric-categories').inner_text()
 page.locator('#lang').select_option('hi')
 assert page.locator('#category-filter option').count()==8
 page.screenshot(path=str(ROOT/'preview-hindi.png'),full_page=False)
 assert not errors,errors
 # Fresh data shows five card lobby, local history clear resets count
 page.locator('#clear-progress').dispatch_event('click');assert page.locator('#metric-categories').inner_text()=='0/8'
 # Full round with numeric data, results and daily plan
 page.locator('#lang').select_option('en');page.locator('#category-filter').select_option('numerical')
 page.locator('button[data-game="math-explorer"]').dispatch_event('click');page.locator('#start').dispatch_event('click')
 for _ in range(5):assert do_first()=='number';page.locator('#next').dispatch_event('click')
 assert not page.locator('#results').is_hidden()
 page.screenshot(path=str(ROOT/'preview-results.png'),full_page=False)
 assert not errors,errors
 print('BROWSER SMOKE PASS | 8 categories | 11 games via browser | all 40 data-tested | 5 input modes | Hindi | growth reset | round complete | 0 JS exceptions')
 browser.close()