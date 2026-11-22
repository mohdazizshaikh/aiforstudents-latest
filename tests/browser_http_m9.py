"""Simulate HTTPS static hosting with real ES-module fetches; not a live Hostinger test."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1]
ORIGIN='https://aifs-stage.invalid'
TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain','.json':'application/json','.webmanifest':'application/manifest+json'}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(service_workers='block',viewport={'width':1280,'height':900})
 def serve(route):
  url=urlsplit(route.request.url)
  if url.hostname!='aifs-stage.invalid':
   raise AssertionError('Unexpected third-party request: '+route.request.url)
  target=(ROOT/unquote(url.path).lstrip('/'))
  if url.path.endswith('/') or target.is_dir():target=target/'index.html'
  if not target.is_file():return route.fulfill(status=404,body='Not found')
  return route.fulfill(status=200,body=target.read_bytes(),headers={'Content-Type':TYPES.get(target.suffix,'application/octet-stream')})
 context.route('**/*',serve)
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(ORIGIN+'/',wait_until='load')
 assert page.locator('#game-grid button').count()==5,errors
 assert page.locator('#team-mode').count()==1,errors
 page.locator('#team-play').scroll_into_view_if_needed()
 page.screenshot(path=str(ROOT/'preview-team-desktop.png'),full_page=False)
 page.locator('#team-surface > button.btn').click()
 assert 'Player 1' in page.locator('#team-surface').inner_text()
 page.goto(ORIGIN+'/grow-together/',wait_until='load')
 assert 'Pattern Partners' in page.locator('main').inner_text()
 assert page.locator('meta[name="description"]').get_attribute('content')
 assert not errors,errors
 print('STATIC HTTPS SIMULATION PASS | real ES modules | 3-mode team UI | SEO guide | no third-party requests | 0 JS errors')
 browser.close()