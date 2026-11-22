"""Smoke through Chromium with an isolated in-memory JS bundle.
Production ES module loading and HTTPS service-worker behavior require staging verification.
"""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
sources=[]
for path in ('pattern-engine.js','catalog.js','growth-engine.js','app.js'):
 s=(ROOT/'assets'/path).read_text()
 s=re.sub(r'^import .*?;\s*$', '', s,flags=re.M)
 s=re.sub(r'^export \{[^}]*\};\s*$', '', s,flags=re.M)
 s=s.replace('export const ','const ').replace('export function ','function ')
 if path=='pattern-engine.js':s+='\nconst patternBank=getBank;\n'
 sources.append(s)
script='\n'.join(sources)
html=html.replace('<script type="module" src="assets/app.js"></script>', '<script>'+script+'</script>')
html=html.replace('href="assets/styles.css"','href="data:text/css;base64,'+__import__('base64').b64encode((ROOT/'assets/styles.css').read_bytes()).decode()+'"')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
 page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(250)
 page.screenshot(path=str(ROOT/'preview-home-mobile.png'),full_page=True)
 assert page.locator('button[data-game]').count()==8
 assert '0/20' in page.locator('#pool-count').inner_text(), errors
 page.locator('button[data-game="number-market"]').click()
 assert 'Number Market' in page.locator('#lobby-title').inner_text()
 page.locator('#start').click()
 assert not page.locator('#game').is_hidden()
 for _ in range(5):
  page.locator('#choices button').first.click()
  page.locator('#next').click()
 assert not page.locator('#results').is_hidden()
 assert '5' in page.locator('#result-count').inner_text()
 page.locator('#back-home').click()
 assert '5/20' in page.locator('#pool-count').inner_text()
 page.locator('button[data-game="creative-studio"]').click();page.locator('#start').click()
 for _ in range(5):page.locator('#choices button').first.click();page.locator('#next').click()
 assert '5 reflections' in page.locator('#result-count').inner_text()
 page.locator('#back-home').click();page.locator('#lang').select_option('hi')
 assert 'क्रिएटिव' in page.locator('#lobby-title').inner_text()
 page.screenshot(path=str(ROOT/'preview-mobile.png'),full_page=True)
 # Explore each of all eight categories and leave after one answer.
 for card in page.locator('button[data-game]').all():
  card.click();page.locator('#start').click();page.locator('#choices button').first.click();page.locator('#leave').click()
 assert page.locator('#metric-categories').inner_text()=='8/8'
 # Fresh question pool exhaustion and explicitly labeled replay on a clean in-memory page.
 fresh=browser.new_page(viewport={'width':1120,'height':800})
 fresh_errors=[];fresh.on('pageerror',lambda ex:fresh_errors.append(str(ex)))
 fresh.set_content(html,wait_until='domcontentloaded');fresh.wait_for_timeout(100)
 for n in range(4):
  fresh.locator('#start').click()
  for k in range(5):fresh.locator('#choices button').first.click();fresh.locator('#next').click()
  fresh.locator('#back-home').click()
 assert fresh.locator('#start').is_disabled()
 assert '20/20' in fresh.locator('#pool-count').inner_text()
 fresh.locator('#replay').click();assert not fresh.locator('#game-note').is_hidden()
 fresh.screenshot(path=str(ROOT/'preview-desktop.png'),full_page=False)
 assert errors==[] and fresh_errors==[], (errors,fresh_errors)
 print('BROWSER SMOKE PASS | 8 categories | 5 scored tasks | 5 reflections | Hindi | 4 fresh rounds + replay | errors: 0')
 fresh.close()
 browser.close()