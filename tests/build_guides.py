"""Build eight plain, static, linkable educational game guide pages.
These are supporting descriptions; do not create fake sitemap/canonical until real domain is known.
"""
from pathlib import Path
from html import escape
ROOT=Path(__file__).resolve().parents[1]
GUIDES=[
 ('pattern-quest','Pattern Quest','Free pattern recognition practice',
  'Pattern puzzles invite you to search for rules in sequences of numbers, shapes, and directions. A helpful strategy is to describe what changes between two consecutive items, then test that explanation against the entire sequence.',
  'Try comparing the gaps between numbers, noticing a repeating group of shapes, or examining odd and even positions separately. A single guess is less informative than explaining why a rule fits every step.',
  'The game currently uses five short pattern templates per age band, with alternate examples for later rounds. It does not provide a psychometric logic score.'),
 ('number-market','Number Market','Free everyday mathematics activities',
  'Mathematics is useful when buying, sharing, organizing, and checking quantities. These short problems use simple prices and objects so students can practice choosing the correct operation.',
  'Read a word problem slowly. Decide whether the situation requires adding totals, calculating change, multiplying groups, or dividing equally. Check the answer by asking whether the quantity makes sense.',
  'Question values vary by practice age band, but these activities are not standardized numeracy tests or claims about financial decision-making ability.'),
 ('story-detective','Story Detective','Free reading comprehension activities',
  'A story can contain facts, reasons, an order of events, and clues supporting a cautious inference. Learning to separate what is actually written from what we imagine can improve reading comprehension.',
  'Practice finding a sentence that supports your answer. When the story only gives clues, describe a possibility rather than presenting a guess as certain fact.',
  'Short passages can introduce reading strategies, but they cannot measure overall language ability, communication skills, or predict success in writing careers.'),
 ('shape-builder','Shape Builder','Free visual-spatial puzzle practice',
  'Spatial practice involves imagining how an object changes when it is rotated or reflected. These interactive puzzles use arrows and compact grids, so they work without large graphics downloads.',
  'For a rotation, trace each corner or direction one step at a time. For a mirror image, check what changes and what stays in the same direction. Drawing the shape on paper is perfectly fine.',
  'Short rotation tasks are only one narrow aspect of spatial activity. A game score does not determine architecture, engineering, or art potential.'),
 ('fix-the-machine','Fix the Machine','Free simple-mechanics puzzles',
  'Simple machines offer useful examples of cause and effect. Games here cover connected gears, fixed pulleys, balanced levers, ramps, and idealized electrical circuits.',
  'Follow the energy or motion through each part of the system. For example, adjacent external gears rotate in opposite directions, and an open switch breaks a circuit path.',
  'These are simplified classroom-style models with stated assumptions. Real systems have more complications, and the game is not a measure of mechanical aptitude.'),
 ('creative-studio','Creative Studio','Free creativity exploration prompts',
  'Creativity can involve imagining several ideas, trying unusual combinations, and improving everyday things. This studio gives small challenges you can explore on paper or in your imagination.',
  'Try making two different approaches to the same design request. Explain who each one would help. The goal is to practice generating ideas, not to receive a computer-generated creativity score.',
  'There is no single correct answer and no algorithmic ranking of imagination. The platform records only a selected reflection, not the student’s private drawings.'),
 ('perspective-explorer','Perspective Explorer','Free social-situation reflection activities',
  'Working with others often involves listening, sharing turns, and considering more than one point of view. These short scenarios invite reflection on choices people can make during a group activity.',
  'Think about what each person may need, and ask what would happen after your chosen response. Different respectful approaches may be suitable in different contexts.',
  'Choosing an option in an imaginary situation is not evidence of real-world teamwork, empathy, leadership, or personality. This is not a scored social intelligence test.'),
 ('strategy-island','Strategy Island','Free practical planning exercises',
  'Planning a project involves understanding available time, supplies, and constraints. These simple scenarios ask learners to calculate requirements and adjust a plan when something changes.',
  'Write down the resources you have and what each task needs. Check which constraint matters most. Take one decision at a time rather than jumping to an answer.',
  'These exercises are educational arithmetic and planning practice, not a comprehensive measure of real-life executive function or career suitability.')
]
for slug,name,title,lead,tip,limit in GUIDES:
 folder=ROOT/'games'/slug;folder.mkdir(parents=True,exist_ok=True)
 siblings=''.join(f'<li><a href="../{escape(s)}/">{escape(n)}</a></li>' for s,n,*_ in GUIDES if s!=slug)
 page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Explore {escape(name)}: free educational activities, learning strategies, and clear limits. No sign-up, no paid AI, no career prediction."><title>{escape(title)} | AI for Students</title><link rel="stylesheet" href="../../assets/styles.css"><link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg"></head><body>
<header class="header"><div class="wrap bar"><a class="brand" href="../../"><span class="mark">a</span><span>AI for Students<small>Discover · Develop · Decide</small></span></a><nav aria-label="Navigation"><a href="../../#practice">All games</a><a href="../../#methodology">Methodology</a><a href="../../#privacy">Privacy</a></nav></div></header>
<main class="wrap"><section class="section"><p class="eyebrow">EDUCATIONAL GAME GUIDE</p><h1>{escape(name)}</h1><p class="muted guide-intro">{escape(lead)}</p><p><a class="btn guide-play-link" href="../../?game={escape(slug)}#practice">Play {escape(name)} free</a></p><div class="two"><article class="panel"><h2>How to practice</h2><p>{escape(tip)}</p><p>No timed pressure or mandatory account is required to try these short activities on a compatible browser.</p></article><article class="panel"><h2>What results mean</h2><p>{escape(limit)}</p><p>Feedback is based on the specific activity, not a prediction of the learner's intelligence or future job.</p></article></div>
<section class="section"><h2>Try another way to learn</h2><p>Learning is broader than any one challenge. Explore a different topic when you feel ready.</p><ul>{siblings}</ul></section></section></main><footer><div class="wrap foot">AI for Students · Exploratory practice only · Not a diagnostic career test</div></footer></body></html>'''
 (folder/'index.html').write_text(page)
index=ROOT/'index.html'
s=index.read_text()
links=''.join(f'<a href="games/{escape(slug)}/">{escape(name)}</a>' for slug,name,*_ in GUIDES)
section=f'<section class="section" id="game-guides"><div class="eyebrow">EXPLORE THE GAMES</div><h2>Game guides & learning tips</h2><p class="muted">Read what each activity practices and what its results do not mean.</p><div class="guide-links">{links}</div></section>'
s=s.replace('</main>',section+'</main>')
index.write_text(s)
styles=ROOT/'assets/styles.css'
styles.write_text(styles.read_text()+'\n.guide-links{display:flex;gap:10px;flex-wrap:wrap}.guide-links a{display:inline-block;padding:9px 13px;border:1px solid var(--border);background:#fff;border-radius:12px;text-decoration:none;font-size:.85rem;font-weight:650}.guide-links a:hover{background:#e9f5ef}\n')
print('Generated',len(GUIDES),'static educational game guides')