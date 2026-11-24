import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderDiscovery,validateDiscovery} from '../tools/curriculum-discovery.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const d=JSON.parse(read('docs/M36_DRAFT_CURRICULUM_DISCOVERY.json'));
test('M36 12 grade rows, 48 bilingual lenses, all 36 existing models and explicit gaps, zero verified chapters',()=>{
 const r=validateDiscovery(d);assert.equal(r.valid,true,r.errors.join('; '));assert.equal(r.grades,12);assert.equal(r.slots,48);assert.equal(r.uniqueExistingModels,36);assert.ok(r.gaps>0);assert.equal(r.verifiedChapters,0);assert.equal(r.publicReleaseApproved,false);
});
test('M36 rejects invented model IDs, false approval, duplicate grade, wrong subject and missing Hindi',()=>{
 for(const mutate of [x=>x.curriculumVerified=true,x=>x.grades[0].grade=2,x=>x.grades[0].chapter='fake',x=>x.grades[1].topics[1].modelIds=['advanced:fake'],x=>x.grades[1].topics[1].modelIds=['advanced:probability'],x=>x.grades[1].topics[1].hi='English']){
  const x=structuredClone(d);mutate(x);assert.equal(validateDiscovery(x).valid,false);
 }
});
test('M36 existing cached guide embeds exact generated static disclosure markup and links to local sections',()=>{
 const html=read('virtual-experiment-lab/index.html'),home=read('index.html'),sw=read('service-worker.js');
 assert.ok(html.includes(renderDiscovery(d)));assert.match(html,/noindex,nofollow/);
 for(const id of ['experiment-lab','math-workshop','science-lab','advanced-labs'])assert.ok(home.includes('id="'+id+'"'));
 assert.ok(home.includes('virtual-experiment-lab/#curriculum-discovery'));assert.ok(sw.includes('./virtual-experiment-lab/'));
 assert.doesNotMatch(renderDiscovery(d),/<script|<input|https?:/);
});

test('M36 offline navigation key excludes query and fragment before exact static allowlist check',()=>{
 const sw=read('service-worker.js');assert.match(sw,/if\(nav\)\{bare\.search='';bare\.hash='';\}/);assert.match(sw,/if\(!allowed\.has\(key\)\)return/);
});
