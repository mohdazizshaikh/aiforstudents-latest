import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COMPARISON_IDS,comparisonDefinition,comparisonInitial,comparisonValue,controlledComparison} from '../assets/comparison-lab-engine.js';
const fixtures={
 'signed-sum':v=>{let n=v.a;for(let i=0;i<Math.abs(v.b);i++)n+=Math.sign(v.b);return n},
 'data-range':v=>{const a=Object.values(v).sort((a,b)=>a-b);return a[2]-a[0]},
 'ideal-pressure':v=>{let n=0;while(n*v.area<v.force)n++;return n},
 'ideal-momentum':v=>Array(v.mass).fill(v.velocity).reduce((a,b)=>a+b,0),
 'mixture-count':v=>[...Array(v.a).fill('A'),...Array(v.b).fill('B')].length,
 'formula-ratio':v=>Array(v.copies).fill('AAB'.repeat(v.units)).join('').split('').filter(x=>x==='A').length,
 'habitat-tokens':v=>{let n=0;for(let i=0;i<v.food&&i<v.shelter;i++)n++;return n},
 'plant-water-tokens':v=>Array(v.input).fill(1).slice(v.transfer).length
};
const states=fields=>fields.reduce((acc,f)=>acc.flatMap(o=>f.options.map(v=>({...o,[f.id]:v}))),[{}]);
for(const id of COMPARISON_IDS)test(id+' finite-domain bilingual reference and comparison',()=>{
 const d=comparisonDefinition(id);assert.notEqual(d.title,comparisonDefinition(id,'hi').title);
 for(const v of states(d.fields))for(const lang of ['en','hi']){const r=comparisonValue(id,v,lang);assert.equal(r.metric,fixtures[id](v));assert.equal(r.rows.at(-1).value,r.metric);assert.equal(r.humanReviewed,false)}
 const b=comparisonInitial(id);
 for(const f of d.fields){assert.throws(()=>comparisonValue(id,{...b,[f.id]:999}));for(const x of f.options.filter(v=>v!==b[f.id])){const trial={...b,[f.id]:x},a=fixtures[id](b),z=fixtures[id](trial),dir=z>a?'higher':z<a?'lower':'same';const r=controlledComparison(id,b,trial,f.id,dir);assert.equal(r.direction,dir);assert.equal(r.delta,z-a);assert.equal(r.matched,true);assert.deepEqual(b,comparisonInitial(id))}}
 assert.throws(()=>comparisonValue(id,{...b,studentId:'invalid'}));assert.throws(()=>comparisonValue(id,b,'xx'));
});
test('One variable comparison denies unchanged, multiple fields, wrong field or invalid prediction',()=>{
 const b={force:12,area:2};
 for(const [v,f,p] of [[b,'area','lower'],[{force:24,area:4},'area','same'],[{force:24,area:2},'area','higher'],[{force:12,area:4},'area','guess']])assert.throws(()=>controlledComparison('ideal-pressure',b,v,f,p));
 assert.equal(controlledComparison('ideal-pressure',b,{force:12,area:4},'area','higher').matched,false);
 assert.equal(controlledComparison('data-range',{a:1,b:3,c:5},{a:1,b:4,c:5},'b','same').direction,'same');
});
test('Eight pending review candidates refer to exact original gap targets',()=>{
 const r=JSON.parse(readFileSync(new URL('../docs/M117_MODEL_REVIEW_MANIFEST.json',import.meta.url),'utf8')),s=JSON.parse(readFileSync(new URL('../docs/M116_CONCEPT_GAP_MATRIX.json',import.meta.url),'utf8'));
 assert.deepEqual(r.models.map(x=>x.id).sort(),[...COMPARISON_IDS].sort());
 for(const m of r.models){const d=comparisonDefinition(m.id);assert.equal(d.subject,m.subject);assert.equal(d.proposedGrade,m.proposedGrade);assert.equal(m.reviewStatus,'PENDING');assert.equal(m.officialChapter,null);assert.equal(s.grades.find(g=>g.grade===m.proposedGrade).targets.find(t=>t.subject===m.subject).proposedGap,m.gapTarget)}
 assert.equal(r.publicReleaseApproved,false);
});
test('Offline source registration and no new persistence or remote transport',()=>{
 const a=readFileSync(new URL('../assets/comparison-lab-app.js',import.meta.url),'utf8'),s=readFileSync(new URL('../service-worker.js',import.meta.url),'utf8');
 assert.doesNotMatch(a,/\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest)\b/);assert.match(s,/comparison-lab-engine\.js/);assert.match(s,/comparison-lab-app\.js/);assert.match(a,/aifs-history-cleared/);
});
