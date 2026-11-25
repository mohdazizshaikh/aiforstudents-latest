import test from 'node:test';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import {readFileSync} from 'node:fs';
import {labPackKeys} from '../assets/teacher-cards-engine.js';
import {PROTOTYPE_KEYS} from '../assets/extended-lab-catalog.js';
import {FORBIDDEN_PUBLIC_PATHS, FULL_TARGETS} from '../tools/check-live-staging.mjs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
test('M125 source-derived bilingual metadata and all 96 planning cells without learner data',()=>{
 const f=JSON.parse(execFileSync(process.execPath,[new URL('tools/mysql-rehearsal/fixture-catalog.mjs',root).pathname],{encoding:'utf8'}));
 assert.equal(f.activity.length,labPackKeys().length+PROTOTYPE_KEYS.length);
 assert.equal(new Set(f.activity.map(x=>x.key)).size,f.activity.length);assert.equal(f.cells.length,96);
 assert.equal(f.publicReleaseApproved,false);assert.equal(f.storesStudentData,false);
 for(const r of f.activity){assert.deepEqual(Object.keys(r),['key','subject','kind','title_en','title_hi']);assert.ok(r.title_en&&r.title_hi)}
});
test('M125 schema and repository are CLI-only and never included in static targets',()=>{
 const php=read('tools/mysql-rehearsal/repository.php');assert.match(php,/PHP_SAPI !== 'cli'/);assert.match(php,/host=127\.0\.0\.1;port=3306;dbname=aifs_rehearsal_m125/);assert.match(php,/ATTR_EMULATE_PREPARES=>false/);
 assert.match(read('tools/mysql-rehearsal/schema-v1.sql'),/FOREIGN KEY/);assert.match(read('tools/mysql-rehearsal/schema-v2.sql'),/review_state='PENDING'/);
 for(const p of ['repository.php','run.php','schema-v1.sql','schema-v2.sql'])assert.ok(FORBIDDEN_PUBLIC_PATHS.includes('/tools/mysql-rehearsal/'+p));
 assert.ok(FULL_TARGETS.every(x=>!x.startsWith('/tools/mysql-rehearsal/')));
});
