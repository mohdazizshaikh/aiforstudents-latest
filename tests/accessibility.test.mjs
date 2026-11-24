import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');

test('M10: keyboard instructions, skip link, focusable destinations and non-noisy live announcements',()=>{
 const html=read('../index.html'), css=read('../assets/styles.css');
 assert.match(html,/<a class="skip" href="#practice"/);
 assert.match(html,/id="lobby"[^>]*tabindex="-1"/);
 assert.match(html,/id="game"[^>]*tabindex="-1"/);
 assert.match(html,/id="results"[^>]*aria-labelledby="result-title"/);
 assert.match(html,/id="team-surface" role="region"/);
 assert.doesNotMatch(html,/id="team-surface"[^>]*aria-live=/);
 assert.match(html,/id="team-announcer" role="status" aria-live="polite" aria-atomic="true"/);
 assert.match(html,/data-i18n="keyboardHelp"/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/\.sr-only\{/);
});
test('M10: numeric answer is programmatically labelled, order and multi choices keyboard operable',()=>{
 const app=read('../assets/app.js');
 assert.match(app,/label\.htmlFor='game-number-answer'/);
 assert.match(app,/input\.id='game-number-answer'/);
 assert.match(app,/const undo=document\.createElement\('button'\)/);
 assert.match(app,/button\.type='button'/);
 assert.match(app,/setAttribute\('aria-pressed'/);
});
test('M10: team preserves answer across locale switches and locks age selection during active play',()=>{
 const app=read('../assets/app.js'),team=read('../assets/team-app.js');
 assert.match(app,/AIFS_ACTIVITY=\{solo:false,team:false\}/);
 assert.match(team,/el\('age-select'\)\.disabled=true/);
 assert.match(team,/el\('age-select'\)\.disabled=false/);
 assert.match(team,/TEAM\.answers\[role\]===v/);
 assert.match(team,/window\.AIFS_ACTIVITY\?\.solo/);
 assert.match(app,/window\.AIFS_ACTIVITY\?\.team/);
});
test('M10: public co-op guide is linked, child notes and default static hosting retained',()=>{
 const html=read('../index.html'),sw=read('../service-worker.js');
 assert.match(html,/href="grow-together\/"/);
 assert.match(html,/not an IQ, psychological aptitude or career prediction test/);
 assert.match(html,/No account, ads, tracker, child profile upload or AI API call/);
 assert.match(sw,/aifs-discovery-m34/);
 assert.doesNotMatch(html,/https?:\/\/api\.openrouter\.ai|generativelanguage\.googleapis\.com/);
});