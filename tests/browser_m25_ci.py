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
OUTPUT = ROOT / 'test-results' / 'm32-browser'
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
    report = {'milestone': 'M32', 'execution': 'headless local Chromium with real ES modules',
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
                check(page.locator('#local-guide-topic option').count() == 12,
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
                  return {keys, count: (await caches.open(keys.find(k => k.startsWith('aifs-discovery-m32'))))
                    ? (await (await caches.open(keys.find(k => k.startsWith('aifs-discovery-m32')))).keys()).length : 0}
                }""")
                check(any(k.startswith('aifs-discovery-m32') for k in cache['keys']),
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
                check_no_runtime_errors(phone, mobile_errors)
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
    print('M32 LOCAL CHROMIUM CI SMOKE PASS:', json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    run()
