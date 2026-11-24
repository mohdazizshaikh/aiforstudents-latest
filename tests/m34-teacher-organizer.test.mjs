import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CLASSROOM_IDS,lessonQueue} from '../assets/classroom-engine.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const action=(type,id)=>({type,id});
test('M34 organizer adds each fixed lesson once, preserves input and order',()=>{
 const empty=Object.freeze([]),a=lessonQueue(empty,action('add',CLASSROOM_IDS[0]));
 assert.deepEqual(empty,[]);assert.deepEqual(a,[CLASSROOM_IDS[0]]);
 assert.deepEqual(lessonQueue(a,action('add',CLASSROOM_IDS[0])),a);
 assert.deepEqual(lessonQueue(a,action('add',CLASSROOM_IDS[1])),CLASSROOM_IDS);
});
test('M34 move, remove, start and clear are deterministic and bounded',()=>{
 const both=Object.freeze([...CLASSROOM_IDS]), reversed=[...both].reverse();
 assert.deepEqual(lessonQueue(both,action('up',both[1])),reversed);
 assert.deepEqual(lessonQueue(both,action('down',both[0])),reversed);
 assert.deepEqual(lessonQueue(both,action('up',both[0])),both);
 assert.deepEqual(lessonQueue(both,action('down',both[1])),both);
 assert.deepEqual(lessonQueue(both,action('remove',both[0])),[both[1]]);
 assert.deepEqual(lessonQueue(both,{type:'start'}),[both[1]]);
 assert.deepEqual(lessonQueue([],{type:'start'}),[]);
 assert.deepEqual(lessonQueue(both,{type:'clear'}),[]);
});
test('M34 rejects unexpected IDs, corrupt state, duplicates and unknown operations',()=>{
 for(const q of [null,{},['fake'],[CLASSROOM_IDS[0],CLASSROOM_IDS[0]]])assert.throws(()=>lessonQueue(q,{type:'clear'}));
 for(const id of ['name','https://example.org',null,123])assert.throws(()=>lessonQueue([],action('add',id)));
 assert.throws(()=>lessonQueue([],action('send',CLASSROOM_IDS[0])));
});
test('M34 organizer uses only existing local app, bilingual native controls and full shared-device reset',()=>{
 const app=read('assets/classroom-app.js'),engine=read('assets/classroom-engine.js');
 assert.match(app,/queueChoice\.id='classroom-queue-choice'/);
 assert.match(app,/setAttribute\('aria-live','polite'\)/);
 assert.match(app,/Start next planned lesson/);
 assert.match(app,/अगला नियोजित पाठ शुरू करें/);
 assert.match(app,/aifs-history-cleared',\(\)=>\{S\.queue=\[\];S\.lesson=CLASSROOM_IDS\[0\];S\.step=0;S\.role=0;S\.revealed=false;S\.projector=false/);
 for(const code of [app,engine])assert.doesNotMatch(code,/fetch\(|localStorage|sessionStorage|XMLHttpRequest/);
 const sw=read('service-worker.js');assert.ok(sw.includes('./assets/classroom-app.js'));assert.ok(sw.includes('./assets/classroom-engine.js'));
});
