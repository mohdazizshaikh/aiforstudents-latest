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
OUTPUT = ROOT / 'test-results' / 'm25-browser'
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
    report = {'milestone': 'M25', 'execution': 'headless local Chromium with real ES modules',
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
                report['checks'].append('390px viewport renders without document-level horizontal overflow')

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
                  return {keys, count: (await caches.open(keys.find(k => k.startsWith('aifs-discovery-m24'))))
                    ? (await (await caches.open(keys.find(k => k.startsWith('aifs-discovery-m24')))).keys()).length : 0}
                }""")
                check(any(k.startswith('aifs-discovery-m24') for k in cache['keys']),
                      'M24 service-worker cache not created')
                check(cache['count'] >= 40, 'Service-worker precache incomplete: ' + str(cache))
                mobile.set_offline(True)
                phone.goto(origin + '/smart-learning-studio/', wait_until='domcontentloaded')
                check('Smart Learning Studio' in phone.locator('h1').inner_text(),
                      'Offline Studio guide not served from cache')
                phone.goto(origin + '/', wait_until='load')
                check(phone.locator('#game-grid button').count() == 5,
                      'Offline native learner modules not bootstrapped from cache')
                check_no_runtime_errors(phone, mobile_errors)
                report['checks'].append('M24 SW installs 40+ assets and loads Studio guide + learner app offline')
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
    print('M25 LOCAL CHROMIUM CI SMOKE PASS:', json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    run()
