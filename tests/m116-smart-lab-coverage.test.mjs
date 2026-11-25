import test from 'node:test';import assert from 'node:assert/strict';
import {smartLabGapAudit} from '../tools/smart-lab-gap-audit.mjs';
import {PRIMARY_IDS,primaryInitial,primaryDefinition,evaluatePrimary} from '../assets/primary-maths-lab.js';
const report=smartLabGapAudit();
for(const [id,cells] of [['1-5',40],['6-8',24],['9-10',16],['11-12',16]])test('Grade band '+id+' explicit board-specific source and proposed gap inventory',()=>{
 const b=report.gradeBands.find(x=>x.id===id);assert.equal(b.cells,cells);assert.equal(b.verifiedChapters,0);
 const [first,last]=id.split('-').map(Number),rows=report.cells.filter(x=>x.grade>=first&&x.grade<=last);
 assert.equal(new Set(rows.map(x=>[x.board,x.grade,x.subject].join('|'))).size,cells);
 for(const x of rows){assert.equal(x.verifiedChapters,0);assert.equal(x.edition,null);assert.equal(x.chapter,null);assert.equal(x.reviewStatus,'PENDING');assert.ok(x.relatedDraftConcept.modelIds.length);assert.ok(x.proposedGap.length>0);assert.equal(x.earlierConceptCandidate?.boardSpecificApproval??false,false);assert.ok(x.boardProposals.every(y=>/^[a-f0-9]{64}$/.test(y.mappingSha256)));if(x.grade>=11)assert.match(x.stream,/unverified/)}
});
test('Gap audit conserves 32 proposals, 180 pending checks, 96 cells, four linked prototypes',()=>{
 assert.equal(report.planningCells,96);assert.equal(report.uniqueProposedTargets,48);assert.equal(report.prototypeCount,4);
 assert.equal(report.cells.reduce((n,x)=>n+x.boardProposals.length,0),32);assert.equal(report.cells.reduce((n,x)=>n+x.pendingChecks,0),180);assert.equal(report.publicReleaseApproved,false);
});
test('Polygon side count exact across all allowed polygons and languages',()=>{
 for(const lang of ['en','hi'])for(let sides=3;sides<=8;sides++){const r=evaluatePrimary('polygon-sides',{sides},lang);assert.deepEqual(r.rows.map(x=>x.value),[sides,sides]);assert.equal(r.visual.sides,sides)}
});
test('Equal groups count agrees with repeated addition across full control domain',()=>{
 for(const lang of ['en','hi'])for(let groups=1;groups<=6;groups++)for(let each=1;each<=8;each++){const r=evaluatePrimary('equal-groups',{groups,each},lang),n=Array(groups).fill(each).reduce((a,b)=>a+b,0);assert.equal(r.rows.at(-1).value,n);assert.equal(r.visual.groups*r.visual.each,n)}
});
test('Hundred-grid decimal agrees with separate place value representation across 100 states',()=>{
 for(const lang of ['en','hi'])for(let tenths=0;tenths<=9;tenths++)for(let hundredths=0;hundredths<=9;hundredths++){const r=evaluatePrimary('decimal-hundredths',{tenths,hundredths},lang);assert.deepEqual(r.rows.map(x=>x.value),[Number(String(tenths)+hundredths),Number(String(tenths)+hundredths)+'/100','0.'+tenths+hundredths]);assert.equal(r.visual.filled,Number(String(tenths)+hundredths))}
});
test('Unit cube count agrees with independent nested loops across 64 filled prisms',()=>{
 for(const lang of ['en','hi'])for(let length=1;length<=4;length++)for(let width=1;width<=4;width++)for(let height=1;height<=4;height++){let count=0;for(let h=0;h<height;h++)for(let y=0;y<width;y++)for(let x=0;x<length;x++)count++;const r=evaluatePrimary('cube-volume',{length,width,height},lang);assert.equal(r.rows.at(-1).value,count);assert.equal(r.rows[0].value,count/height)}
});
test('Four primary draft models reject extra, missing, out-of-range, fractional and unknown inputs',()=>{
 for(const id of PRIMARY_IDS){const initial=primaryInitial(id),d=primaryDefinition(id),h=primaryDefinition(id,'hi');assert.notEqual(d.title,h.title);assert.equal(d.gradeVerified,false);assert.equal(evaluatePrimary(id,initial).humanReviewed,false);
 assert.throws(()=>evaluatePrimary(id,{...initial,student:'no'}));const f=d.fields[0];for(const value of [f.min-1,f.max+1,1.5,'2',null])assert.throws(()=>evaluatePrimary(id,{...initial,[f.id]:value}));assert.throws(()=>evaluatePrimary(id,{}));assert.throws(()=>evaluatePrimary(id,initial,'xx'));
 }assert.throws(()=>primaryInitial('unknown'));
});
