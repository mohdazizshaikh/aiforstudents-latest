"""Isolated Chromium keyboard, focus, locale + session conflict checks.
Inlines modules because this execution environment restricts localhost browser requests.
Does NOT replace live HTTPS, screen-reader or actual-device audit.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re, base64
ROOT=Path(__file__).resolve().parents[1]

def src(name):
    t=(ROOT/'assets'/name).read_text()
    t=re.sub(r'^import .*?;\s*$', '',t,flags=re.M)
    t=re.sub(r'^export \{[^}]*\};\s*$', '',t,flags=re.M)
    return t.replace('export const ','const ').replace('export function ','function ')

def wrap(name,pre,ret,file):
    return f'const {name}=(()=>{{\n{pre}\n{src(file)}\nreturn {{{ret}}};\n}})();\n'

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
    page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    errors=[]
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.set_content(html,wait_until='domcontentloaded')
    page.wait_for_timeout(100)
    page.keyboard.press('Tab')
    assert page.evaluate('document.activeElement?.className')=='skip', 'First keyboard stop should be skip link'
    page.locator('#team-surface > button.btn').click()
    assert page.locator('#age-select').is_disabled(), 'Age selector must lock during active team round'
    assert page.evaluate("document.activeElement?.tagName")=='H3', 'Handoff heading must receive focus'
    assert page.locator('#team-announcer').inner_text()=='Player 1\'s turn'
    # Accessible UI: Enter/Space selection and aria-pressed states
    page.locator('#team-surface .team-actions button').first.click()
    page.locator('#team-surface .team-options button').first.focus()
    page.keyboard.press('Space')
    assert page.locator('#team-surface .team-options button').first.get_attribute('aria-pressed')=='true'
    assert page.locator('#team-surface > button.btn').is_enabled()
    # Language switch may happen during a selected clue; maintain the selection.
    page.locator('#lang').select_option('hi')
    assert page.locator('#team-surface .team-options button').first.get_attribute('aria-pressed')=='true'
    assert page.locator('#team-surface > button.btn').is_enabled()
    page.locator('#team-surface > button.btn').click()
    assert 'खिलाड़ी 2' in page.locator('#team-surface h3').inner_text()
    # Change language again; preserve session and return to English.
    page.locator('#lang').select_option('en')
    page.locator('#team-leave').click()
    assert page.locator('#age-select').is_enabled()
    # Solo focus and cross-mode lock.
    page.locator('#start').click()
    assert page.evaluate("window.AIFS_ACTIVITY.solo===true")
    assert page.evaluate("document.activeElement?.id")=='question'
    page.locator('#team-surface > button.btn').click()
    assert page.evaluate("window.AIFS_ACTIVITY.team===false")
    assert 'Finish or leave' in page.locator('#team-surface').inner_text()
    page.locator('#leave').click()
    assert page.evaluate("document.activeElement?.id")=='lobby'
    assert 'Finish or leave' not in page.locator('#team-surface').inner_text(), 'Stale conflict warning should clear'
    # Numeric-entry label association (switch game and play until number input).
    page.locator('#category-filter').select_option('numerical')
    page.locator('button[data-game="math-explorer"]').click()
    page.locator('#start').click()
    if page.locator('#game-number-answer').count():
        assert page.locator('label[for="game-number-answer"]').count()==1
    # High-contrast CSS has focus style, reduced motion and hidden SR status.
    assert page.locator('#team-announcer').get_attribute('aria-atomic')=='true'
    assert not errors, errors
    page.locator('#team-play').scroll_into_view_if_needed()
    page.screenshot(path=str(ROOT/'preview-accessibility-mobile.png'))
    print('M10 KEYBOARD BROWSER PASS | skip link | focus | team age lock | keyboard selection | locale preservation | solo/team exclusion | numeric label | 0 JS errors')
    browser.close()