"""M25: real Chromium/local HTTP regression gate for native ES modules and offline cache.
No external hosts, child records, Hostinger deployment, WCAG certification or human approval.
Run with: python3 tests/browser_m25_ci.py (requires playwright + Chromium).
"""
from __future__ import annotations

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import threading

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'test-results' / 'm33-browser'
OUTPUT.mkdir(parents=True, exist_ok=True)


class QuietStaticHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def check_no_runtime_errors(page, errors):
    check(not errors, 'Browser JS errors: ' + json.dumps(errors, ensure_ascii=False))
    check(page.locator('meta[name="robots"]').get_attribute('content') == 'noindex,nofollow',
          'Site unexpectedly allows indexing')


def run():
    report = {'milestone': 'M33', 'execution': 'headless local Chromium with real ES modules',
              'realHostingerVerified': False, 'realDeviceAccessibilityVerified': False,
              'educationalHumanApproval': False, 'publicReleaseApproved': False, 'checks': []}
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietStaticHandler, directory=str(ROOT)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    origin = 'http://localhost:' + str(server.server_port)
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True, args=['--no-sandbox'])
            try:
                # Desktop: native ESM imports, bilingual content and local progress clear.
                desktop = browser.new_context(viewport={'width': 1280, 'height': 820},
                                              service_workers='allow')
                desktop.route('https://**/*', lambda route: route.abort('blockedbyclient'))
                page = desktop.new_page()
                errors = []
                third_party = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('request', lambda request: third_party.append(request.url)
                        if not request.url.startswith(origin + '/') else None)
                page.goto(origin + '/', wait_until='load')
                page.locator('#game-grid button').first.wait_for()
                check(page.locator('#game-grid button').count() == 5, 'Expected five games in selected category')
                check(page.locator('#studio-lessons button').count() == 2, 'Studio source modules not loaded')
                check(page.locator('#experiment-tabs button').count() == 2, 'Virtual Lab module not loaded')
                check(page.locator('#classroom-lessons button').count() == 2, 'Classroom module not loaded')
                check(page.locator('#digital-topics button').count() == 4, 'Digital Skills module not loaded')
                check(page.locator('#digital-choices button').count() == 3, 'Digital exercise not rendered')
                check_no_runtime_errors(page, errors)
                report['checks'].append('Native ES modules load all M15-M18 learning surfaces with no runtime errors')

                page.locator('#lang').select_option('hi')
                check(page.evaluate('document.documentElement.lang') == 'hi', 'Hindi root language missing')
                check('प्रयोगशाला' in page.locator('#experiment-heading').inner_text(),
                      'Virtual Lab did not switch to Hindi')
                check('डिजिटल' in page.locator('#digital-title').inner_text(),
                      'Digital Skills did not switch to Hindi')
                page.locator('#lang').select_option('en')
                report['checks'].append('Hindi language updates document, Virtual Lab and Digital Skills')

                # M30: real native-ESM Maths Workshop with keyboard/button alternatives.
                check(page.locator('#math-workshop-tabs button').count() == 3,
                      'Maths Workshop three original activity tabs missing')
                page.locator('[data-workshop-action="line:inc"]').focus()
                page.keyboard.press('Enter')
                check(page.locator('#math-workshop-number').inner_text() == '1',
                      'Keyboard-only Enter did not move Maths marker')
                check(page.evaluate("document.activeElement?.dataset.workshopAction") == 'line:inc',
                      'Keyboard focus lost after Maths control rerender')
                check(page.locator('#math-workshop-feedback').get_attribute('aria-live') == 'polite',
                      'Screen-reader feedback region is not announced politely')
                for _ in range(4):
                    page.locator('[data-workshop-action="line:dec"]').click()
                check(page.locator('#math-workshop-number').inner_text() == '-3',
                      'Maths number line position incorrect')
                page.locator('#math-workshop-check').click()
                check('Goal reached' in page.locator('#math-workshop-feedback').inner_text(),
                      'Number-line expected target not recognized')
                page.locator('#lang').select_option('hi')
                check('गणित' in page.locator('#math-workshop-title').inner_text(),
                      'Maths Workshop did not localize to Hindi')
                page.locator('#lang').select_option('en')
                report['checks'].append('M30 number line and Hindi Maths Workshop with accessible numeric state')

                page.locator('[data-workshop-action="mode:rectangle"]').click()
                page.locator('[data-workshop-action="width:inc"]').click()
                page.locator('[data-workshop-action="width:inc"]').click()
                page.locator('[data-workshop-action="height:inc"]').click()
                page.locator('#math-workshop-check').click()
                rect = page.locator('#math-workshop-feedback').inner_text()
                check('area = 12' in rect and 'perimeter = 14' in rect,
                      'Rectangle area and perimeter feedback incorrect: ' + rect)
                page.locator('[data-workshop-action="mode:data-table"]').click()
                for _ in range(3):
                    page.locator('[data-workshop-action="a:inc"]').click()
                page.locator('[data-workshop-action="b:inc"]').click()
                check(page.locator('#math-workshop-controls table tbody tr').count() == 2,
                      'Accessible two-row data table missing')
                page.locator('#math-workshop-check').click()
                check('Goal reached' in page.locator('#math-workshop-feedback').inner_text(),
                      'Data-table 4 minus 2 goal not recognized')
                report['checks'].append('M30 geometry and two-row data table, no dragging or network data')

                # M31: real Chromium five-stage reusable shell and seven science modes.
                check(page.locator('#science-tabs button').count() == 7,
                      'M31 seven Science Lab modes not available')
                page.locator('#science-next').click()
                check('TRY' in page.locator('#science-stage').inner_text(),
                      'Science Lab Learn-to-Try transition failed')
                page.locator('[data-science-action="inc:distance"]').focus()
                page.keyboard.press('Enter')
                check(page.locator('#science-output-distance').inner_text() == '30 m',
                      'Keyboard Enter did not manipulate motion distance')
                for _ in range(3):
                    page.locator('[data-science-action="inc:distance"]').click()
                for _ in range(5):
                    page.locator('[data-science-action="inc:seconds"]').click()
                check('6 m/s' in page.locator('.science-explanation').first.inner_text(),
                      '60m/10s speed formula incorrect')
                page.locator('#science-check').click()
                check('matches the example' in page.locator('#science-feedback').inner_text(),
                      'Motion target not verified by state')
                page.locator('#science-next').click()
                check('PLAY' in page.locator('#science-stage').inner_text(),
                      'Science Lab Try-to-Play transition failed')
                page.locator('[data-science-action="answer:0"]').click()
                page.locator('#science-check').click()
                check('matches the example' in page.locator('#science-feedback').inner_text(),
                      'Science Lab play challenge incorrectly graded')
                page.locator('#science-next').click()
                check('UNDERSTAND' in page.locator('#science-stage').inner_text(),
                      'Science Lab Play-to-Understand transition failed')
                page.locator('#science-next').click()
                check('GROW' in page.locator('#science-stage').inner_text(),
                      'Science Lab Understand-to-Grow transition failed')
                check('paper' in page.locator('#science-mission').inner_text().lower(),
                      'No-screen original mission not visible')
                report['checks'].append('M31 seven science models and reusable five-stage motion/quiz/mission with keyboard control')

                page.locator('[data-science-action="mode:reflection"]').click()
                page.locator('#science-next').click()
                for _ in range(3):
                    page.locator('[data-science-action="inc:incident"]').click()
                for _ in range(5):
                    page.locator('[data-science-action="inc:reflected"]').click()
                page.locator('#science-check').click()
                check('matches the example' in page.locator('#science-feedback').inner_text(),
                      '35-degree reflection should be recognised')
                page.locator('[data-science-action="mode:changes"]').click()
                page.locator('#science-next').click()
                page.locator('[data-science-action="select:example:melting"]').click()
                page.locator('#science-check').click()
                check('matches the example' in page.locator('#science-feedback').inner_text(),
                      'Physical change sorting did not work')
                page.locator('[data-science-action="mode:cells"]').click()
                page.locator('#science-next').click()
                page.locator('[data-science-action="select:cell:leaf"]').click()
                check('chloroplasts' in page.locator('.science-explanation').first.inner_text(),
                      'Cell label comparison did not expose text alternative')
                page.locator('#lang').select_option('hi')
                check('विज्ञान' in page.locator('#science-title').inner_text(),
                      'Science Lab title did not switch to Hindi')
                check('हरितलवक' in page.locator('.science-explanation').first.inner_text(),
                      'Hindi cell structure description missing')
                page.locator('#lang').select_option('en')
                report['checks'].append('M31 reflection, safe chemistry sorter, cell text and Hindi/English equivalence')

                # M32: no chatbot or private learner data; only fixed source-backed drafts.
                check(page.locator('#local-guide-topic option').count() == 60,
                      'M32 local hint selector expected twelve fixed draft source topics')
                page.locator('#local-guide-topic').select_option('science:motion')
                page.locator('#local-guide-hint').click()
                draft = page.locator('#local-guide-draft-hint').inner_text()
                check('Source: assets/science-engine.js' in draft and 'draft' in draft.lower(),
                      'M32 source and unreviewed status missing from hint')
                page.locator('#local-guide-subject').select_option('chemistry')
                page.locator('#local-guide-difficulty').select_option('explore')
                page.locator('#local-guide-language').select_option('hi')
                page.locator('#local-guide-suggest').click()
                check('रसायन' in page.locator('#local-guide-reason').inner_text() or
                      'अभ्यास' in page.locator('#local-guide-reason').inner_text(),
                      'M32 learner-chosen Hindi reason for practice missing')
                check(page.locator('#local-guide-target').get_attribute('href') == '#science-lab',
                      'M32 voluntary chemistry suggestion misrouted')
                page.locator('#local-guide-decline').click()
                check(page.locator('#local-guide-recommendation').is_hidden(),
                      'M32 learner cannot decline a suggested task')
                page.locator('#local-guide-sensitive').click()
                check('भरोसेमंद' in page.locator('#local-guide-draft-hint').inner_text(),
                      'M32 privacy-first trusted adult guidance unavailable in Hindi')
                page.locator('#local-guide-review-3').click()
                check('3' not in page.locator('#local-guide-day').inner_text() or
                      len(page.locator('#local-guide-day').inner_text()) > 16,
                      'M32 optional paper review date did not render')
                page.locator('#local-guide-review-clear').click()
                check('कोई तारीख नहीं चुनी' in page.locator('#local-guide-day').inner_text(),
                      'M32 optional reminder cannot be cleared')
                report['checks'].append('M32 fixed-source bilingual hints, no-chat safety fallback, voluntary practice and opt-in review')

                page.locator('#local-guide-fraction-next').click()
                check('TRY' in page.locator('#local-guide-fraction-stage').inner_text(),
                      'M32 fraction shared stage did not enter Try')
                page.locator('#local-guide-fraction-inc').focus()
                page.keyboard.press('Enter')
                page.locator('#local-guide-fraction-inc').click()
                check(page.locator('#local-guide-fraction-count').inner_text() == '2/4',
                      'M32 fraction keyboard input did not match 2/4')
                page.locator('#local-guide-fraction-check').click()
                check('उदाहरण सही' in page.locator('#local-guide-fraction-feedback').inner_text(),
                      'M32 original fraction equivalence was not recognized')
                page.locator('#classroom-jump').select_option('2')
                check('Step 3' in page.locator('#classroom-step-count').inner_text(),
                      'M32 classroom jump-to-step did not navigate')
                check('Reason checker' in page.locator('#classroom-active-role').inner_text() or
                      'Question asker' in page.locator('#classroom-active-role').inner_text(),
                      'M32 generic role did not rotate on step change')
                report['checks'].append('M32 shared five-stage fraction and accessible classroom step/anonymous role navigation')

                cards = desktop.new_page()
                cards_errors = []
                cards.on('pageerror', lambda error: cards_errors.append(str(error)))
                cards.goto(origin + '/teacher-kit/cards/', wait_until='load')
                cards.locator('#card-question').wait_for()
                check('original' in cards.locator('#card-warning').inner_text().lower(),
                      'M32 teacher card did not identify draft provenance')
                check(cards.locator('#card-answer').inner_text() != '',
                      'M32 teacher-screen answer was not loaded')
                cards.locator('#card-language').select_option('hi')
                check('चर्चा' in cards.locator('#card-question-label').inner_text(),
                      'M32 print card lacks Hindi question')
                cards.emulate_media(media='print')
                check(cards.locator('#teacher-guidance').evaluate(
                      "(e) => getComputedStyle(e).display") == 'none',
                      'M32 confidential teacher answer visible on learner print sheet')
                check_no_runtime_errors(cards, cards_errors)
                cards.close()
                report['checks'].append('M32 standalone A4 learner card excludes teacher answers during print')
                # M33: exercise all new bounded lab modes, graph and independent controls.
                check(page.locator('#advanced-topic option').count() == 48, 'Expanded lab modes missing')
                for key in ['ratio-algebra','symmetry','coordinate','probability','temperature','sound',
                            'magnetism','measurement','periodic','mass-balance','ecosystem','heredity','quadratic','force-motion','atom-count','cell-scale','counting','place-value','length-compare','shadow-ray','material-state','material-objects','plant-parts','living-examples','arithmetic-sequence','square-slope','constant-acceleration','thin-lens','ion-charge','mass-fraction','cell-doubling','plant-process','triangle-area','right-triangle-ratio','position-change','path-distance','material-property','dynamic-balance','habitat-match','food-web-links','integral-area','vector-components','magnetic-flux','capacitor-charge','alkane-count','bond-pair-count','dna-complement','gas-exchange']:
                    page.locator('#advanced-topic').select_option(key)
                    check(page.locator('#advanced-values tr').count() > 0, 'No numeric table: ' + key)
                    check(page.locator('#advanced-controls button').count() > 0, 'No accessible controls: ' + key)
                page.locator('#advanced-topic').select_option('coordinate')
                page.locator('[data-advanced-action="inc:x"]').focus()
                page.keyboard.press('Enter')
                page.locator('[data-advanced-action="inc:x"]').click()
                check(page.locator('#advanced-output-x').inner_text() == '2', 'Keyboard graph x incorrect')
                check(page.locator('#advanced-values tr').last.inner_text().endswith('5'), 'Graph y incorrect')
                check(page.locator('#advanced-visual svg').count() == 1, 'Graph visual absent')
                page.locator('#advanced-check').click()
                check('Matches the example' in page.locator('#advanced-feedback').inner_text(), 'Graph check incorrect')
                page.locator('#advanced-topic').select_option('sound')
                page.locator('[data-advanced-action="inc:amplitude"]').click()
                check('3' in page.locator('#advanced-values tr').last.inner_text(), 'Independent amplitude absent')
                page.locator('#lang').select_option('hi')
                check('आवृत्ति' in page.locator('#advanced-values').inner_text(), 'Hindi result labels missing')
                page.locator('#lang').select_option('en')
                report['checks'].append('M36 all 16 draft lab modes, keyboard graph, silent waves and Hindi numeric tables')

                page.locator('#remember').check()
                check(page.evaluate('localStorage.length > 0'), 'Opt-in local history is not persistent')
                page.locator('#digital-choices button').first.click()
                check(page.locator('#digital-feedback').is_visible(), 'Digital response lacks visible feedback')
                check(page.evaluate("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length") == 1,
                      'Local digital attempt missing')
                page.locator('#clear-progress').click()
                check(page.evaluate('localStorage.length === 0'), 'Clear left local storage entries')
                check(page.evaluate("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length") == 0,
                      'Clear left digital history')
                check(not page.locator('#remember').is_checked(), 'Clear left remembering enabled')
                check_no_runtime_errors(page, errors)
                check(not third_party, 'Unexpected third-party requests: ' + str(third_party))
                report['checks'].append('Local opt-in, one practice record and clear-all privacy reset; no third-party calls')

                # M28: real two-tab shared-device privacy. Never share responses between tabs.
                another = desktop.new_page()
                another.goto(origin + '/', wait_until='load')
                another.locator('#digital-choices button').first.click()
                check(another.evaluate("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length") == 1,
                      'Second tab practice did not record')
                page.locator('#clear-progress').click()
                another.wait_for_function("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length === 0")
                check(another.evaluate('sessionStorage.length === 0'),
                      'Cross-tab clear left prior tab session history')
                check(not another.locator('#remember').is_checked(),
                      'Cross-tab reset accidentally kept remember enabled')
                report['checks'].append('M28 default session history clears across same-origin open tabs')

                page.locator('#remember').check()
                page.locator('#digital-topics button').nth(1).click()
                page.locator('#digital-choices button').first.click()
                check(page.evaluate("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length") == 1,
                      'Opt-in tab did not record new attempt')
                follower = desktop.new_page()
                follower.goto(origin + '/', wait_until='load')
                check(follower.evaluate("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length") == 1,
                      'Opt-in persisted attempt was not loaded in fresh same-browser tab')
                follower.locator('#clear-progress').click()
                page.wait_for_function("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length === 0")
                check(page.evaluate('localStorage.length === 0'), 'Cross-tab opt-in history survived clear')
                check(not page.locator('#remember').is_checked(), 'Cross-tab opt-in remained active')
                check_no_runtime_errors(page, errors)
                follower.close()
                another.close()
                report['checks'].append('M28 opt-in persisted history and peer-tab clear with no synced learner payload')

                # No BroadcastChannel: explicit storage fallback must work, preference changes must not clear peers.
                fallback = browser.new_context(service_workers='block')
                fallback.add_init_script("Object.defineProperty(window, 'BroadcastChannel', {value: undefined, configurable: true})")
                a, b = fallback.new_page(), fallback.new_page()
                a.goto(origin + '/', wait_until='load')
                b.goto(origin + '/', wait_until='load')
                b.locator('#digital-choices button').first.click()
                a.locator('#remember').check()
                a.locator('#remember').uncheck()
                # A separate synthetic barrier verifies storage event delivery deterministically.
                b.evaluate("""() => {
                  window.__testStorageBarrier = false;
                  addEventListener('storage', e => {
                    if(e.key==='aifs-test-barrier' && e.newValue==='1') window.__testStorageBarrier = true;
                  });
                }""")
                a.evaluate("localStorage.setItem('aifs-test-barrier','1'); localStorage.removeItem('aifs-test-barrier')")
                b.wait_for_function('window.__testStorageBarrier === true')
                check(b.evaluate('window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length') == 1,
                      'Disabling remember erased another tab session')
                a.locator('#clear-progress').click()
                b.wait_for_function('window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length === 0')
                check(b.evaluate('sessionStorage.length === 0'), 'Fallback did not clear peer session storage')
                check(a.evaluate("localStorage.getItem('aifs-privacy-clear-signal-v1') === null"), 'Control signal retained')
                fallback.close()
                report['checks'].append('M33 storage-only fallback preserves other tab on remember toggle and clears on explicit request')

                # M34: queue actions and cross-tab reset with a real DOM and no extra persistence.
                teacher = desktop.new_page()
                teacher.goto(origin + '/', wait_until='load')
                teacher.locator('#classroom-queue-choice').select_option('fractions')
                teacher.locator('#classroom-queue-add').click()
                teacher.locator('#classroom-queue-choice').select_option('circuits')
                teacher.locator('#classroom-queue-add').click()
                teacher.locator('#classroom-queue-up').click()
                teacher.locator('#classroom-queue-start').click()
                check('series circuit' in teacher.locator('#classroom-subtitle').inner_text(), 'Reordered first lesson did not start')
                teacher.locator('#classroom-reveal').click()
                teacher.locator('#classroom-projector').click()
                teacher.locator('#classroom-queue-clear').click()
                check(teacher.locator('#classroom-queue-start').is_disabled(), 'Queue did not clear')
                check(not teacher.locator('#classroom-answer').is_visible(), 'Teacher answer leaked after reset')
                check(not teacher.evaluate("document.body.classList.contains('classroom-projector')"), 'Projector mode retained')
                teacher.locator('#classroom-queue-add').click()
                page.locator('#clear-progress').click()
                teacher.wait_for_function("document.getElementById('classroom-queue-start').disabled")
                teacher.close()
                report['checks'].append('M34 teacher queue reorder, start, clear and peer reset')

                # M35: simulate the persisted pageshow hook (not a physical BFCache certification).
                restored = desktop.new_page()
                restored.goto(origin + '/', wait_until='load')
                restored.locator('#digital-choices button').first.click()
                check(restored.evaluate("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length") == 1,
                      'Restore fixture has no transient history')
                check(restored.evaluate("sessionStorage.length > 0"), 'Restore fixture has no session key')
                with restored.expect_navigation(wait_until='load'):
                    restored.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted: true}))")
                check(restored.evaluate("window.AIFS_DIGITAL_BRIDGE.getHistory().digitalAttempts.length") == 0,
                      'Restored transient history was revived')
                check(restored.evaluate("sessionStorage.length === 0"), 'Restore kept stale session storage')
                check(not restored.locator('#remember').is_checked(), 'Restore enabled opt-in')
                restored.close()
                report['checks'].append('M35 synthetic persisted pageshow resets transient history and reloads current preference')

                # Keyboard: M24's focusable skip destination tested through real browser navigation.
                keyboard_page = desktop.new_page()
                keyboard_page.goto(origin + '/', wait_until='load')
                keyboard_page.keyboard.press('Tab')
                check(keyboard_page.evaluate("document.activeElement?.classList.contains('skip')"),
                      'First keyboard tab did not reach Skip link')
                keyboard_page.keyboard.press('Enter')
                check(keyboard_page.evaluate("location.hash") == '#practice',
                      'Skip link failed to target main game section')
                check(keyboard_page.evaluate("document.activeElement?.id") == 'practice',
                      'Skip destination did not receive focus')
                keyboard_page.close()
                report['checks'].append('Keyboard skip link reaches and focuses #practice')

                # Print preview checks are actual browser-computed print CSS, not hardware-printer tests.
                print_page = desktop.new_page()
                for lesson in ('fractions', 'circuits'):
                    print_page.goto(origin + '/teacher-kit/worksheets/' + lesson + '/', wait_until='load')
                    check(print_page.locator('main ol li').count() == 3, 'Worksheet questions missing')
                    check(print_page.locator('.teacher-notes').is_visible(), 'Teacher notes missing on screen')
                    print_page.emulate_media(media='print')
                    check(print_page.locator('.teacher-notes').evaluate(
                          'e => getComputedStyle(e).display') == 'none',
                          'Teacher answer guidance leaked into print')
                    check(print_page.locator('.no-print').first.evaluate(
                          'e => getComputedStyle(e).display') == 'none',
                          'Nonprinting navigation leaked into print')
                    print_page.emulate_media(media='screen')
                print_page.close()
                report['checks'].append('Fractions and circuit worksheet print CSS hides teacher notes')
                desktop.close()

                # Mobile-width browser and real SW cache-first behavior on localhost's secure context.
                mobile = browser.new_context(viewport={'width': 390, 'height': 844},
                                             device_scale_factor=1, service_workers='allow')
                mobile.route('https://**/*', lambda route: route.abort('blockedbyclient'))
                phone = mobile.new_page()
                mobile_errors = []
                phone.on('pageerror', lambda err: mobile_errors.append(str(err)))
                phone.goto(origin + '/', wait_until='load')
                phone.locator('#game-grid button').first.wait_for()
                # For mobile, allow tiny scrollbar differences but reject forced horizontal content scroll.
                overflow = phone.evaluate('({actual: document.documentElement.scrollWidth, viewport: innerWidth})')
                check(overflow['actual'] <= overflow['viewport'] + 4,
                      'Unexpected horizontal overflow at 390px: ' + str(overflow))
                check_no_runtime_errors(phone, mobile_errors)
                navigation = phone.evaluate("""() => {
                  const n=performance.getEntriesByType('navigation')[0];
                  return n ? Math.round(n.domContentLoadedEventEnd) : null;
                }""")
                check(navigation is not None and navigation <= 12000,
                      'CI localhost DOMContentLoaded exceeds 12-second engineering budget: ' + str(navigation))
                report['checks'].append('390px viewport and localhost cold-load within 12-second engineering budget')

                ready = phone.evaluate("""async () => {
                  const registration = await navigator.serviceWorker.ready;
                  return {state: registration.active?.state ?? 'none',
                    scope: registration.scope, controlled: Boolean(navigator.serviceWorker.controller)};
                }""")
                check(ready['state'] in ('activated', 'activating'),
                      'Service worker did not activate: ' + repr(ready))
                phone.reload(wait_until='load')
                phone.wait_for_function('navigator.serviceWorker.controller !== null')
                cache = phone.evaluate("""async () => {
                  const keys = await caches.keys();
                  return {keys, count: (await caches.open(keys.find(k => k.startsWith('aifs-discovery-m33'))))
                    ? (await (await caches.open(keys.find(k => k.startsWith('aifs-discovery-m33')))).keys()).length : 0}
                }""")
                check(any(k.startswith('aifs-discovery-m33') for k in cache['keys']),
                      'M30 service-worker cache not created')
                check(cache['count'] >= 40, 'Service-worker precache incomplete: ' + str(cache))
                mobile.set_offline(True)
                phone.goto(origin + '/smart-learning-studio/', wait_until='domcontentloaded')
                check('Smart Learning Studio' in phone.locator('h1').inner_text(),
                      'Offline Studio guide not served from cache')
                phone.goto(origin + '/', wait_until='load')
                check(phone.locator('#game-grid button').count() == 5,
                      'Offline native learner modules not bootstrapped from cache')
                check(phone.locator('#math-workshop-tabs button').count() == 3,
                      'Offline Maths Workshop failed to bootstrap')
                check(phone.locator('#science-tabs button').count() == 7,
                      'Offline Science Concept Lab not bootstrapped with seven models')
                check(phone.locator('#advanced-topic option').count() == 48, 'Offline expanded labs not loaded')
                phone.locator('#advanced-topic').select_option('counting')
                check(phone.locator('#advanced-compare-toggle').is_hidden(), 'Comparison should be opt-in after check')
                phone.locator('#advanced-check').click()
                check(phone.locator('#advanced-compare-panel').is_hidden(), 'Comparison disclosed without action')
                phone.locator('#advanced-compare-toggle').focus()
                phone.keyboard.press('Enter')
                check(phone.locator('#advanced-compare-panel').is_visible(), 'Offline comparison unavailable')
                check(phone.locator('#advanced-compare-fields li').count() == 2, 'Comparison missing model controls')
                check('Example 4' in phone.locator('#advanced-compare-fields li').first.inner_text() or 'उदाहरण 4' in phone.locator('#advanced-compare-fields li').first.inner_text(), 'Comparison target not from authored example')
                phone.locator('#advanced-controls button[data-advanced-action="inc:a"]').click()
                check(phone.locator('#advanced-compare-panel').is_hidden(), 'Comparison retained stale control values')
                phone.locator('#advanced-check').click()
                phone.locator('#advanced-compare-toggle').click()
                phone.locator('#advanced-reset').click()
                check(phone.locator('#advanced-compare-toggle').is_hidden(), 'Reset retained comparison')
                phone.locator('#advanced-topic').select_option('probability')
                phone.locator('#advanced-check').click()
                phone.locator('#advanced-compare-toggle').click()
                comparison_text = phone.locator('#advanced-compare-fields').inner_text()
                check('Free exploration' in comparison_text or 'स्वतंत्र खोज' in comparison_text, 'Optional probability controls incorrectly scored')
                phone.locator('#advanced-compare-toggle').click()
                check(phone.locator('#advanced-compare-panel').is_hidden(), 'Decline comparison failed')
                report['checks'].append('M44 offline opt-in example comparison, free exploration, keyboard and reset')
                phone.locator('#advanced-topic').select_option('counting')
                check(phone.locator('#advanced-variable-panel').is_hidden(), 'Variable baseline not opt-in')
                phone.locator('#advanced-variable-mark').focus()
                phone.keyboard.press('Enter')
                check(phone.locator('#advanced-variable-panel').is_visible(), 'Offline baseline unavailable')
                check(phone.locator('#advanced-variable-table').is_hidden(), 'Comparison shown with zero changes')
                phone.locator('#advanced-controls button[data-advanced-action="inc:a"]').click()
                check(phone.locator('#advanced-variable-changes li').count() == 1, 'One changed control missing')
                check(phone.locator('#advanced-variable-table').is_visible(), 'Single variable comparison missing')
                phone.locator('#advanced-controls button[data-advanced-action="inc:b"]').click()
                check(phone.locator('#advanced-variable-changes li').count() == 2, 'Multiple changes missing')
                check(phone.locator('#advanced-variable-table').is_hidden(), 'Multiple changes mislabelled as single variable')
                phone.locator('#advanced-variable-mark').click()
                check(phone.locator('#advanced-variable-changes li').count() == 0, 'New baseline not reset')
                phone.locator('#advanced-variable-clear').click()
                check(phone.locator('#advanced-variable-panel').is_hidden(), 'Clear retained baseline')
                phone.locator('#advanced-variable-mark').click()
                phone.locator('#advanced-reset').click()
                check(phone.locator('#advanced-variable-panel').is_hidden(), 'Model reset retained baseline')
                phone.locator('#advanced-variable-mark').click()
                phone.evaluate("window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#advanced-variable-panel').is_hidden(), 'Privacy reset retained baseline')
                report['checks'].append('M55 offline one-variable comparison, multiple-change boundary, keyboard and privacy reset')
                phone.locator('#advanced-subject-filter').select_option('biology')
                check(phone.locator('#advanced-topic option').count() < 48, 'Subject filter did not narrow inventory')
                check(phone.locator('#advanced-topic option[value="dna-complement"]').count() == 1, 'Biology draft missing')
                check(phone.locator('#advanced-topic option[value="vector-components"]').count() == 0, 'Maths draft leaked into Biology')
                phone.locator('#advanced-topic').select_option('dna-complement')
                phone.locator('#advanced-subject-filter').select_option('all')
                check(phone.locator('#advanced-topic').input_value() == 'dna-complement', 'All-subject view lost current model')
                check(phone.locator('#advanced-topic option').count() == 48, 'All subjects not restored')
                phone.locator('#advanced-subject-filter').select_option('physics')
                phone.evaluate("window.dispatchEvent(new CustomEvent('aifs-teacher-demo',{detail:'dna-complement'}))")
                check(phone.locator('#advanced-subject-filter').input_value() == 'all', 'Cross-subject launch not restored')
                check(phone.locator('#advanced-topic').input_value() == 'dna-complement', 'Cross-subject launch failed')
                phone.locator('#advanced-subject-filter').select_option('maths')
                phone.evaluate("window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#advanced-subject-filter').input_value() == 'all', 'Privacy reset retained filter')
                report['checks'].append('M56 offline subject filters, current selection, cross-subject launch and privacy reset')
                phone.locator('#advanced-variable-mark').click()
                phone.locator('#advanced-subject-filter').select_option('biology')
                check(phone.locator('#advanced-variable-panel').is_hidden(), 'Cross-subject model switch retained prior baseline')
                phone.locator('#advanced-subject-filter').select_option('all')
                report['checks'].append('M55/M56 combined subject switch discards prior model baseline')
                phone.locator('#advanced-topic').select_option('counting')
                check(phone.locator('#advanced-guided-panel').is_hidden(), 'Guided stages not optional')
                phone.locator('#advanced-guided-toggle').focus()
                phone.keyboard.press('Enter')
                check(phone.locator('#advanced-guided-panel').is_visible(), 'Offline guided stages unavailable')
                check(phone.locator('#advanced-guided-prev').is_disabled(), 'First stage previous not disabled')
                for _ in range(3):
                    phone.locator('#advanced-guided-next').click()
                check('4 / 5' in phone.locator('#advanced-guided-stage').inner_text(), 'Explain stage missing')
                check(phone.locator('#advanced-guided-hint').is_visible(), 'Source hint absent in explain stage')
                phone.locator('#advanced-guided-next').click()
                check(phone.locator('#advanced-guided-next').is_disabled(), 'Final stage next not disabled')
                phone.locator('#advanced-guided-prev').click()
                check('4 / 5' in phone.locator('#advanced-guided-stage').inner_text(), 'Stage return failed')
                phone.locator('#advanced-guided-toggle').click()
                check(phone.locator('#advanced-guided-panel').is_hidden(), 'Optional close failed')
                phone.locator('#advanced-guided-toggle').click()
                phone.locator('#advanced-topic').select_option('dna-complement')
                check(phone.locator('#advanced-guided-panel').is_hidden(), 'Model switch retained stage')
                phone.locator('#advanced-guided-toggle').click()
                phone.evaluate("window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#advanced-guided-panel').is_hidden(), 'Privacy reset retained stage')
                report['checks'].append('M58 offline optional guided stages, source hint, keyboard, model switch and privacy reset')
                phone.locator('#advanced-topic').select_option('ratio-algebra')
                check(phone.locator('#advanced-ratio-extension').is_visible(), 'Ratio extension missing offline')
                check('4:6' in phone.locator('#ratio-extension-values').inner_text(), 'Initial equivalent ratio incorrect')
                phone.locator('#ratio-extension-controls button[data-extension-action="inc:k"]').focus()
                phone.keyboard.press('Enter')
                check('6:9' in phone.locator('#ratio-extension-values').inner_text(), 'Scaled ratio incorrect')
                phone.locator('#ratio-extension-mode').select_option('equation')
                check(phone.locator('#ratio-extension-output-x').inner_text() == '1', 'Equation initial x incorrect')
                for _ in range(3):
                    phone.locator('#ratio-extension-controls button[data-extension-action="inc:x"]').click()
                check(phone.locator('#ratio-extension-values tr').first.locator('td').inner_text() == '12', 'Equation substitution failed')
                phone.locator('#advanced-reset').click()
                check(phone.locator('#ratio-extension-mode').input_value() == 'ratio', 'Reset retained extension mode')
                phone.locator('#ratio-extension-mode').select_option('equation')
                phone.evaluate("window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#ratio-extension-mode').input_value() == 'ratio', 'Privacy clear retained extension')
                phone.locator('#advanced-topic').select_option('counting')
                check(phone.locator('#advanced-ratio-extension').is_hidden(), 'Extension visible on unrelated lab')
                report['checks'].append('M63 offline supplemental ratios and equations, keyboard and reset')
                phone.locator('#advanced-finder-query').fill('ratio-algebra')
                check(phone.locator('#advanced-finder-results option').count() == 1, 'Finder ID match failed')
                phone.locator('#advanced-finder-open').focus()
                phone.keyboard.press('Enter')
                check(phone.locator('#advanced-topic').input_value() == 'ratio-algebra', 'Finder open failed')
                check(phone.locator('#advanced-finder-query').input_value() == '', 'Finder retained opened query')
                phone.locator('#advanced-finder-query').fill('ratio-algebra')
                phone.locator('#advanced-finder-query').press('Enter')
                check(phone.locator('#advanced-topic').input_value() == 'ratio-algebra', 'Single result Enter failed')
                check(phone.locator('#advanced-finder-query').input_value() == '', 'Enter retained search')
                phone.locator('#advanced-finder-query').fill('अनुपात')
                check(phone.locator('#advanced-finder-results option[value="ratio-algebra"]').count() == 1, 'Hindi finder match failed')
                phone.locator('#advanced-subject-filter').select_option('biology')
                check(phone.locator('#advanced-finder-results option[value="ratio-algebra"]').count() == 0, 'Finder escaped subject')
                phone.locator('#advanced-finder-query').fill('zzzznomatchzzzz')
                check(phone.locator('#advanced-finder-open').is_disabled(), 'Finder allowed empty result')
                phone.locator('#advanced-finder-clear').click()
                check(phone.locator('#advanced-finder-query').input_value() == '', 'Finder clear failed')
                phone.locator('#advanced-finder-query').fill('cell')
                phone.evaluate("window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#advanced-finder-query').input_value() == '', 'Privacy clear retained query')
                check(phone.locator('#advanced-finder-open').is_disabled(), 'Privacy clear retained results')
                report['checks'].append('M64 offline bilingual finder, subject, keyboard and privacy reset')
                for model, mode, control, expected, after in [
                    ('coordinate', 'linear', 'x', '1', '3'),
                    ('force-motion', 'net', 'right', '2', '3'),
                    ('mass-balance', 'missing', 'c', '7', '7'),
                    ('cell-doubling', 'rounds', 'a', '4', '8'),
                ]:
                    phone.locator('#advanced-topic').select_option(model)
                    check(phone.locator('#advanced-ratio-extension').is_visible(), 'Supplement missing: '+model)
                    check(phone.locator('#ratio-extension-mode').input_value() == mode, 'Wrong activity: '+model)
                    check(phone.locator('#ratio-extension-values tr').first.locator('td').inner_text() == expected, 'Initial supplemental result: '+model)
                    phone.locator('#ratio-extension-controls button[data-extension-action="inc:'+control+'"]').focus()
                    phone.keyboard.press('Enter')
                    check(phone.locator('#ratio-extension-values tr').first.locator('td').inner_text() == after, 'Changed supplemental result: '+model)
                    phone.locator('#ratio-extension-reset').click()
                    check(phone.locator('#ratio-extension-values tr').first.locator('td').inner_text() == expected, 'Supplement reset: '+model)
                phone.locator('#advanced-topic').select_option('counting')
                check(phone.locator('#advanced-ratio-extension').is_hidden(), 'Supplement leaked to unrelated model')
                phone.locator('#advanced-topic').select_option('cell-doubling')
                phone.evaluate("window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#ratio-extension-mode').input_value() == 'ratio', 'Privacy clear retained cross-subject activity')
                report['checks'].append('M65 offline four-subject supplements, keyboard, model switch and privacy reset')
                phone.locator('#advanced-topic').select_option('heredity')
                check('4' in phone.locator('#advanced-values').inner_text(), 'Offline model result missing')
                check(phone.locator('#local-guide-topic option').count() == 60, 'Offline practice guide missing')
                phone.locator('#local-guide-topic').select_option('advanced:quadratic')
                phone.locator('#local-guide-hint').click()
                check('advanced-lab-engine.js' in phone.locator('#local-guide-draft-hint').inner_text(), 'Advanced source hint missing')
                phone.locator('#local-guide-repeat').click()
                check(phone.locator('#local-guide-next-result').is_visible(), 'Explicit practice choice missing')
                check(phone.locator('#local-guide-next-link').get_attribute('href') == '?advanced=quadratic#advanced-labs', 'Specific draft route missing')
                with phone.expect_navigation(wait_until='load'):
                    phone.locator('#local-guide-next-link').click()
                phone.locator('#advanced-topic option').first.wait_for(state='attached')
                check(phone.locator('#advanced-topic').input_value() == 'quadratic', 'Offline specific draft route not selected')
                phone.locator('#local-guide-topic').select_option('advanced:quadratic')
                phone.locator('#local-guide-different').click()
                check(phone.locator('#local-guide-next-result').is_visible(), 'Related topic missing')
                phone.locator('#clear-progress').click()
                check(phone.locator('#local-guide-next-result').is_hidden(), 'Clear history left practice choice')
                check(phone.locator('#local-guide-topic').input_value() == 'studio:fractions', 'Clear history left old topic')
                report['checks'].append('M38 offline advanced hint, direct model navigation, explicit next choice and privacy reset')
                phone.locator('#local-guide-hint').click()
                check(phone.locator('#local-guide-draft-hint').is_visible(), 'Offline hint missing')
                phone.locator('#classroom-queue-choice').select_option('circuits')
                phone.locator('#classroom-queue-add').click()
                phone.locator('#classroom-queue-start').click()
                phone.locator('#classroom-projector').click()
                phone.locator('#classroom-reveal').click()
                phone.emulate_media(media='print')
                check(not phone.locator('#classroom-answer').is_visible(), 'Main classroom teacher answer leaked in print')
                phone.emulate_media(media='screen')
                phone.locator('#classroom-queue-clear').click()
                phone.locator('#lang').select_option('hi')
                check('स्थानीय पाठ' in phone.locator('#classroom-queue-title').inner_text(), 'Offline Hindi organizer missing')
                bounds = phone.evaluate('({actual: document.documentElement.scrollWidth, viewport: innerWidth})')
                check(bounds['actual'] <= bounds['viewport'] + 4, 'Hindi organizer overflow: ' + str(bounds))
                phone.locator('#lang').select_option('en')
                for lesson in ('fractions', 'circuits'):
                    phone.goto(origin + '/teacher-kit/worksheets/' + lesson + '/', wait_until='load')
                    check(phone.locator('main ol li').count() == 3, 'Offline assignment worksheet missing')
                    phone.emulate_media(media='print')
                    check(not phone.locator('.teacher-notes').is_visible(), 'Offline assignment answer leaked')
                    phone.emulate_media(media='screen')
                report['checks'].append('M34 offline queue/projector, bilingual mobile bounds and existing worksheet print privacy')
                phone.goto(origin + '/virtual-experiment-lab/#curriculum-discovery', wait_until='load')
                check(phone.locator('.curriculum-grade').count() == 12, 'Offline class discovery missing')
                summary = phone.locator('#draft-grade-12 summary')
                summary.focus()
                phone.keyboard.press('Enter')
                check(phone.locator('#draft-grade-12').evaluate('e => e.open'), 'Native keyboard disclosure failed')
                check('equilibrium constants gaps' in phone.locator('#draft-grade-12').inner_text(), 'Remaining curriculum gaps hidden')
                check(phone.evaluate('document.documentElement.scrollWidth <= innerWidth + 4'), 'Draft guide horizontal overflow')
                with phone.expect_navigation(wait_until='load'):
                    phone.locator('#draft-grade-12 a').first.click()
                phone.locator('#advanced-topic option').first.wait_for(state='attached')
                check(phone.url.endswith('/#advanced-labs'), 'Related draft did not navigate to intended section')
                check(phone.locator('#advanced-topic option').count() == 48, 'Offline related draft link failed')
                report['checks'].append('M36 offline 12-grade draft discovery, keyboard disclosure, remaining topic limitations and related model navigation')
                phone.goto(origin + '/teacher-kit/cards/', wait_until='load')
                check(phone.locator('#card-answer').inner_text() != '', 'Offline teacher card dependency not cached')
                phone.locator('#card-language').select_option('hi')
                check('चर्चा' in phone.locator('#card-question-label').inner_text(), 'Offline teacher cards Hindi missing')
                phone.emulate_media(media='print')
                check(phone.locator('#teacher-guidance').evaluate('(e) => getComputedStyle(e).display') == 'none',
                      'Offline print card shows teacher guidance')
                check(phone.locator('#learner-card').evaluate('(e) => getComputedStyle(e).backgroundColor') == 'rgb(255, 255, 255)',
                      'Low-ink learner card is not white')
                phone.emulate_media(media='screen')
                for lesson in ('fractions', 'circuits'):
                    phone.locator('#card-lesson').select_option(lesson)
                    phone.locator('#card-view').select_option('pack')
                    check(phone.locator('#assignment-pages .assignment-page').count() == 5, 'Offline pack missing five source-derived steps')
                    check(not phone.locator('#teacher-guidance').is_visible(), 'Pack screen leaked answer guidance')
                    check(phone.locator('#card-step').is_disabled(), 'Pack step control should be disabled')
                    check(phone.locator('#assignment-heading').is_visible(), 'Pack heading missing')
                    check(phone.evaluate('localStorage.length === 0 && sessionStorage.length === 0'), 'Assignment pack persisted data')
                    phone.emulate_media(media='print')
                    check(phone.locator('#assignment-pack').is_visible(), 'Offline pack is hidden in print')
                    check(not phone.locator('#teacher-guidance').is_visible(), 'Teacher guidance leaked into pack print')
                    check(not phone.locator('#learner-card').is_visible(), 'Single-card output duplicated pack')
                    check(phone.locator('.controls:visible').count() == 0, 'Pack controls leaked into print')
                    phone.emulate_media(media='screen')
                    phone.locator('#card-view').select_option('single')
                    check(phone.locator('#learner-card').is_visible(), 'Single-card mode not restored')
                    check(not phone.locator('#assignment-pack').is_visible(), 'Pack not reset to single card')
                report['checks'].append('M37 two offline five-step learner packs, single-card restore, print privacy and no storage')
                phone.locator('#card-view').select_option('lab')
                phone.locator('#lab-print-subject').select_option('biology')
                phone.locator('#lab-print-model').select_option('dna-complement')
                check(phone.locator('#lab-activity').is_visible(), 'Printable lab activity unavailable offline')
                check(phone.locator('#lab-activity-steps section').count() == 3, 'Lab activity missing paper steps')
                check(phone.locator('#teacher-guidance').is_hidden(), 'Teacher guidance visible in lab activity')
                check(phone.locator('#learner-card').is_hidden(), 'Old learner card visible in lab activity')
                phone.emulate_media(media='print')
                check(phone.locator('#lab-activity').is_visible(), 'Lab print not visible')
                check(phone.locator('#lab-print-controls').is_hidden(), 'Lab print includes controls')
                check(phone.locator('#teacher-guidance').is_hidden(), 'Lab print leaks guidance')
                phone.emulate_media(media='screen')
                phone.locator('#card-language').select_option('hi')
                check('डीएनए' in phone.locator('#lab-activity-heading').inner_text(), 'Hindi lab print title missing')
                for subject, model, mode in [
                    ('maths','ratio-algebra','ratio'),
                    ('maths','ratio-algebra','equation'),
                    ('maths','coordinate','linear'),
                    ('physics','force-motion','net'),
                    ('chemistry','mass-balance','missing'),
                    ('biology','cell-doubling','rounds'),
                ]:
                    phone.locator('#lab-print-subject').select_option(subject)
                    phone.locator('#lab-print-model').select_option(model)
                    check(phone.locator('#lab-print-activity').is_enabled(), 'Supplement selector missing')
                    phone.locator('#lab-print-activity').select_option(mode)
                    check(phone.locator('#lab-activity-steps section').count() == 3, 'Supplement paper steps missing')
                    check(phone.locator('#card-skip').get_attribute('href') == '#lab-activity-heading', 'Skip target not active worksheet')
                    hi_title=phone.locator('#lab-activity-heading').inner_text()
                    phone.locator('#card-language').select_option('en')
                    check(phone.locator('#lab-print-activity').input_value() == mode, 'Language switch lost selected supplement')
                    check(phone.locator('#lab-activity-heading').inner_text() != hi_title, 'Supplement title not bilingual')
                    phone.emulate_media(media='print')
                    check(phone.locator('#lab-activity').is_visible(), 'Supplement print missing')
                    check(phone.locator('#lab-print-controls').is_hidden(), 'Supplement controls leaked')
                    check(phone.locator('#teacher-guidance').is_hidden(), 'Supplement print leaked teacher guidance')
                    phone.emulate_media(media='screen')
                    phone.locator('#card-language').select_option('hi')
                phone.locator('#lab-print-model').select_option('dna-complement')
                check(phone.locator('#lab-print-activity').is_hidden(), 'Supplement selector visible for unrelated model')
                check(phone.locator('#lab-print-activity').input_value() == 'main', 'Old supplement retained across models')
                report['checks'].append('M66 all six bilingual supplemental offline worksheets and print isolation')
                phone.locator('#card-view').select_option('lab-pack')
                check(phone.locator('#card-print').is_disabled(), 'Empty pack printable')
                phone.locator('#lab-print-subject').select_option('maths')
                phone.locator('#lab-print-model').select_option('ratio-algebra')
                phone.locator('#lab-print-activity').select_option('equation')
                phone.locator('#lab-pack-add').click()
                check(phone.locator('#lab-pack-add').is_disabled(), 'Duplicate pack entry allowed')
                phone.locator('#lab-print-subject').select_option('biology')
                phone.locator('#lab-print-model').select_option('cell-doubling')
                phone.locator('#lab-print-activity').select_option('rounds')
                phone.locator('#lab-pack-add').click()
                check(phone.locator('#lab-pack-pages .lab-pack-page').count() == 2, 'Cross-subject pack missing')
                phone.locator('#lab-pack-choice').select_option('cell-doubling:rounds')
                phone.locator('#lab-pack-up').click()
                check(phone.locator('#lab-pack-pages .lab-pack-page').first.get_attribute('data-activity-key') == 'cell-doubling:rounds', 'Pack reorder failed')
                phone.locator('#card-language').select_option('en')
                check(phone.locator('#lab-pack-pages .lab-pack-page').count() == 2, 'Pack language switch lost items')
                phone.emulate_media(media='print')
                check(phone.locator('#lab-pack-output').is_visible(), 'Pack output hidden')
                check(phone.locator('#lab-activity').is_hidden(), 'Single activity leaked into pack')
                check(phone.locator('#lab-pack-controls').is_hidden(), 'Pack controls leaked')
                check(phone.locator('#teacher-guidance').is_hidden(), 'Teacher guidance leaked')
                phone.emulate_media(media='screen')
                phone.locator('#lab-pack-choice').select_option('cell-doubling:rounds')
                phone.locator('#lab-pack-remove').click()
                check(phone.locator('#lab-pack-pages .lab-pack-page').count() == 1, 'Pack remove failed')
                phone.locator('#lab-pack-clear').click()
                check(phone.locator('#card-print').is_disabled(), 'Pack clear failed')
                phone.locator('#lab-pack-add').click()
                phone.locator('#card-view').select_option('single')
                phone.locator('#card-view').select_option('lab-pack')
                check(phone.locator('#lab-pack-pages .lab-pack-page').count() == 0, 'Pack retained after leaving mode')
                report['checks'].append('M67 offline custom assignment pack ordering, language, print isolation and clear')
                phone.locator('#card-view').select_option('single')
                check(phone.locator('#lab-activity').is_hidden(), 'Lab print remains in single mode')
                report['checks'].append('M50 offline bilingual lab activity sheets, three paper steps, print privacy and mode restore')
                phone.goto(origin + '/#classroom-lab-launcher', wait_until='load')
                phone.locator('#classroom-lab-subject option').first.wait_for(state='attached')
                phone.locator('#classroom-lab-subject').select_option('biology')
                phone.locator('#classroom-lab-choice').select_option('plant-parts')
                check(phone.locator('#classroom-lab-open').is_visible(), 'Teacher lab launcher missing selection')
                check(phone.locator('#classroom-lab-open').get_attribute('href') == '?advanced=plant-parts#advanced-labs', 'Wrong teacher lab link')
                check('specimen' in phone.locator('#classroom-lab-caveat').inner_text() or 'नमूना' in phone.locator('#classroom-lab-caveat').inner_text(), 'Missing teacher lab limitations')
                phone.locator('#classroom-lab-clear').click()
                check(phone.locator('#classroom-lab-open').is_hidden(), 'Clear teacher lab selection failed')
                phone.locator('#classroom-lab-subject').select_option('biology')
                phone.locator('#classroom-lab-choice').select_option('plant-parts')
                with phone.expect_navigation(wait_until='load'):
                    phone.locator('#classroom-lab-open').click()
                phone.locator('#advanced-topic option').first.wait_for(state='attached')
                check(phone.locator('#advanced-topic').input_value() == 'plant-parts', 'Teacher lab deep link failed offline')
                check(phone.locator('#classroom-lab-open').is_hidden(), 'Teacher lab selection persisted after navigation')
                report['checks'].append('M42 offline subject-filtered teacher lab launcher, limitations, reset, deep link and transient selection')
                phone.locator('#classroom-lab-subject').select_option('maths')
                phone.locator('#classroom-lab-choice').select_option('integral-area')
                phone.locator('#classroom-agenda-add').click()
                check(phone.locator('#classroom-agenda-list li').count() == 1, 'Agenda did not add selected model')
                check(phone.locator('#classroom-agenda-add').is_disabled(), 'Duplicate agenda entry possible')
                phone.locator('#classroom-lab-subject').select_option('biology')
                phone.locator('#classroom-lab-choice').select_option('dna-complement')
                phone.locator('#classroom-agenda-add').click()
                check(phone.locator('#classroom-agenda-list li').count() == 2, 'Cross-subject agenda missing')
                phone.locator('#classroom-agenda-choice').select_option('dna-complement')
                phone.locator('#classroom-agenda-up').click()
                check(phone.locator('#classroom-agenda-list li a').first.get_attribute('href') == '?advanced=dna-complement#advanced-labs', 'Agenda reorder failed')
                phone.locator('#classroom-agenda-list li a').first.click()
                check(phone.locator('#advanced-topic').input_value() == 'dna-complement', 'Agenda same-document model launch failed')
                check(phone.locator('#classroom-agenda-list li').count() == 2, 'Agenda lost during in-tab demonstration')
                check(phone.locator('#advanced-heading').evaluate('e => e === document.activeElement'), 'Agenda did not move focus to model')
                phone.locator('#classroom-agenda-paper-open').click()
                check(phone.locator('#classroom-agenda-paper').is_visible(), 'Printable agenda preview missing')
                check(phone.locator('#agenda-paper-list li').count() == 2, 'Printable agenda lost models')
                check(phone.locator('#agenda-paper-list li').first.locator('h3').inner_text() == phone.locator('#classroom-agenda-list li').first.locator('strong').inner_text(), 'Printable agenda order differs')
                phone.emulate_media(media='print')
                check(phone.locator('#classroom-agenda-paper').is_visible(), 'Agenda print missing')
                check(phone.locator('#classroom').is_hidden(), 'Other classroom content leaked into agenda print')
                check(phone.locator('#agenda-paper-print').is_hidden(), 'Print controls leaked')
                phone.emulate_media(media='screen')
                phone.locator('#agenda-paper-close').click()
                check(phone.locator('#classroom-agenda-paper').is_hidden(), 'Preview close failed')
                phone.locator('#classroom-agenda-paper-open').click()
                phone.locator('#classroom-agenda-paper').evaluate("e => window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#classroom-agenda-paper').is_hidden(), 'Privacy reset retained print preview')
                check(phone.locator('#agenda-paper-list li').count() == 0, 'Privacy reset retained print contents')
                phone.locator('#classroom-lab-subject').select_option('maths')
                phone.locator('#classroom-lab-choice').select_option('integral-area')
                phone.locator('#classroom-agenda-add').click()
                phone.locator('#classroom-lab-subject').select_option('biology')
                phone.locator('#classroom-lab-choice').select_option('dna-complement')
                phone.locator('#classroom-agenda-add').click()
                report['checks'].append('M62 offline printable demonstration sequence, print isolation and privacy reset')
                phone.locator('#classroom-agenda-choice').select_option('dna-complement')
                phone.locator('#classroom-agenda-remove').click()
                check(phone.locator('#classroom-agenda-list li').count() == 1, 'Agenda remove failed')
                phone.locator('#classroom-agenda-clear').click()
                check(phone.locator('#classroom-agenda-list li').count() == 0, 'Agenda clear failed')
                phone.locator('#classroom-lab-choice').select_option('dna-complement')
                phone.locator('#classroom-agenda-add').click()
                phone.evaluate("window.dispatchEvent(new Event('aifs-history-cleared'))")
                check(phone.locator('#classroom-agenda-list li').count() == 0, 'Shared-device reset retained agenda')
                report['checks'].append('M48 offline demonstration agenda cross-subject add, reorder, remove, clear, duplicate and privacy reset')
                phone.goto(origin + '/?lang=hi', wait_until='load')
                check(phone.locator('#lang').input_value() == 'hi', 'Offline query-driven language navigation broke')
                check(phone.locator('#advanced-topic option').count() == 48, 'Offline query page module not available')
                # Actual offline keyboard operation across each currently shipped lab family/mode.
                def keyboard_control(selector):
                    btn = phone.locator(selector + ' button:enabled').first
                    check(btn.count() == 1 and btn.is_visible(), 'Missing button alternative: ' + selector)
                    check(bool(btn.get_attribute('aria-label') or btn.inner_text().strip()),
                          'Unnamed keyboard control: ' + selector)
                    btn.focus()
                    phone.keyboard.press('Enter')

                for i in range(2):
                    phone.locator('#studio-lessons button').nth(i).click()
                    phone.locator('#studio-start').click()
                    keyboard_control('#studio-controls')
                for i in range(2):
                    phone.locator('#experiment-tabs button').nth(i).click()
                    keyboard_control('#experiment-controls')
                for i in range(3):
                    phone.locator('#math-workshop-tabs button').nth(i).click()
                    keyboard_control('#math-workshop-controls')
                for i in range(7):
                    phone.locator('#science-tabs button').nth(i).click()
                    phone.locator('#science-next').click()
                    keyboard_control('#science-controls')
                for key in ['ratio-algebra','symmetry','coordinate','probability','temperature','sound',
                            'magnetism','measurement','periodic','mass-balance','ecosystem','heredity','quadratic','force-motion','atom-count','cell-scale','counting','place-value','length-compare','shadow-ray','material-state','material-objects','plant-parts','living-examples','arithmetic-sequence','square-slope','constant-acceleration','thin-lens','ion-charge','mass-fraction','cell-doubling','plant-process','triangle-area','right-triangle-ratio','position-change','path-distance','material-property','dynamic-balance','habitat-match','food-web-links','integral-area','vector-components','magnetic-flux','capacitor-charge','alkane-count','bond-pair-count','dna-complement','gas-exchange']:
                    phone.locator('#advanced-topic').select_option(key)
                    keyboard_control('#advanced-controls')
                    check(phone.locator('#advanced-values tr').count() > 0, 'Missing numeric alternative: ' + key)
                for i in range(4):
                    phone.locator('#lab-topics button').nth(i).click()
                    keyboard_control('#lab-options')
                phone.locator('#local-guide-fraction-next').click()
                phone.locator('#local-guide-fraction-inc').focus()
                phone.keyboard.press('Enter')
                check(phone.locator('#local-guide-fraction-count').inner_text() == '1/4', 'Fraction keyboard alternative broke')
                phone.locator('#clear-progress').click()
                check_no_runtime_errors(phone, mobile_errors)
                report['checks'].append('M33 offline keyboard alternatives across every shipped current lab family and model')

                phone.goto(origin + '/teacher-kit/cards/index.html', wait_until='load')
                check(phone.locator('#card-answer').inner_text() != '', 'Offline index.html route alias broke')
                for route in ["/games/creative-studio/","/games/fix-the-machine/","/games/number-market/","/games/pattern-quest/","/games/perspective-explorer/","/games/shape-builder/","/games/story-detective/","/games/strategy-island/","/accessibility/","/ai-digital-skills/","/for-parents/","/future-explorer/","/grow-together/","/hi/","/methodology/","/privacy/","/study-lab/","/teacher-kit/","/teacher-kit/worksheets/circuits/","/teacher-kit/worksheets/fractions/","/virtual-experiment-lab/"]:
                    phone.goto(origin + route, wait_until='load')
                    check(phone.locator('h1').inner_text() != '', 'Offline guide missing: ' + route)
                check_no_runtime_errors(phone, mobile_errors)
                report['checks'].append('M33 offline expanded labs, local hint and complete teacher card dependency graph')
                report['checks'].append('M31 SW installs 40+ assets and loads Studio guide + learner app offline')
                mobile.close()
            finally:
                browser.close()
    except Exception:
        report['result'] = 'FAIL'
        (OUTPUT / 'report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
        raise
    finally:
        server.shutdown()
        server.server_close()
    report['result'] = 'PASS'
    (OUTPUT / 'report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print('M33 LOCAL CHROMIUM CI SMOKE PASS:', json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    run()
