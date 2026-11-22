"""Small isolated Chromium print-CSS smoke; not a real printer proof."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':820,'height':1050})
 for lesson in ['fractions','circuits']:
  html=(ROOT/'teacher-kit'/'worksheets'/lesson/'index.html').read_text()
  page.set_content(html)
  assert page.locator('ol li').count()==3
  assert page.locator('.teacher-notes').is_visible()
  assert page.locator('.btn').count()==1
  page.emulate_media(media='print')
  assert page.locator('.teacher-notes').evaluate('el=>getComputedStyle(el).display')=='none'
  assert page.locator('.no-print').first.evaluate('el=>getComputedStyle(el).display')=='none'
  assert page.locator('.writing').count()==3
  page.emulate_media(media='screen')
 print('M17 ORIGINAL PRINTABLES PASS: both worksheets + print guidance hidden')
 b.close()