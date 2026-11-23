import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {validateCurriculumOptions} from '../tools/validate-curriculum-map.mjs';

const root=new URL('../',import.meta.url),read=name=>readFileSync(new URL(name,root),'utf8');
const source=JSON.parse(read('docs/B1_CURRICULUM_SOURCE_OPTIONS.json'));
test('M30 curriculum options have 12 draft grades, explicit age/board/edition separation and link-only sources',()=>{
 const r=validateCurriculumOptions(source);assert.equal(r.valid,true,JSON.stringify(r.problems));
 assert.equal(r.grades,12);assert.equal(r.certifiedCurriculum,false);assert.equal(r.publicReleaseApproved,false);
 assert.ok(source.mathsGradeOutcomes.every(x=>x.publishedCoverage===false));
});
test('M30 curriculum checker fails closed on false board mapping and unlicensed source assumptions',()=>{
 const modified=structuredClone(source);modified.mathsGradeOutcomes[0].publishedCoverage=true;
 assert.equal(validateCurriculumOptions(modified).valid,false);
 const fake=structuredClone(source);fake.providerOptions[0].homepage='https://evil.example.edu/free';
 assert.equal(validateCurriculumOptions(fake).valid,false);
 const notLicensed=structuredClone(source);notLicensed.providerOptions[0].redistributionPermission='FREE';
 assert.equal(validateCurriculumOptions(notLicensed).valid,false);
});
test('M30 copyright design keeps each third-party asset unredistributable without permission evidence',()=>{
 const p=source.rightsRecordTemplate;
 assert.equal(p.mayRedistribute,false);
 assert.equal(p.permittedUse,'UNASSESSED');
 assert.equal(p.permissionEvidenceRef,null);
 assert.equal(p.humanCopyrightReview,'PENDING');
});
test('M30 metadata separates school grade and age band without claiming verified textbook chapters',()=>{
 const m=source.lessonRecordTemplate;
 assert.equal(m.grade,1);assert.equal(m.ageBand,null);assert.equal(m.board,'UNMAPPED');
 assert.equal(m.bookEdition,null);assert.equal(m.chapterId,null);
 assert.equal(m.releaseEligible,false);assert.equal(m.englishReview,'PENDING');
});
test('M30 science policy excludes unsafe hands-on chemistry, real mains and biological profiling',()=>{
 const note=source.chemistryBioSafetyExclusions.join(' ');
 assert.match(note,/hazardous chemicals/);
 assert.match(note,/mains/);
 assert.match(note,/genetic profiling/);
 assert.equal(source.physicsConceptOptions.length,3);
});
test('M30 static source remains inside first explicit low-bandwidth asset size budgets',()=>{
 const paths=['index.html','assets/styles.css'];
 for(const file of paths)assert.ok(statSync(new URL(file,root)).size < (file.endsWith('html')?96:64)*1024,file+' too large');
 const assets=new URL('../assets/',import.meta.url);
 const jsFiles=readdirSync(assets).filter(f=>f.endsWith('.js'));
 for(const file of jsFiles)assert.ok(statSync(new URL('../assets/'+file,import.meta.url)).size<160*1024,file+' exceeds JS module budget');
 const staticDirectories=['assets','games','privacy','for-parents','methodology','accessibility','future-explorer','grow-together','study-lab','smart-learning-studio','virtual-experiment-lab','teacher-kit','ai-digital-skills','hi'];
 let bytes=0;
 function walk(p){for(const entry of readdirSync(p,{withFileTypes:true})){const full=path.join(p,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()&&/\.(?:js|css|html|svg|webmanifest)$/.test(entry.name))bytes+=statSync(full).size}}
 for(const directory of staticDirectories)walk(new URL('../'+directory+'/',import.meta.url).pathname);
 for(const name of ['index.html','service-worker.js','manifest.webmanifest','robots.txt','.htaccess'])bytes+=statSync(new URL('../'+name,import.meta.url)).size;
 assert.ok(bytes<2*1024*1024,'Static hosting bytes exceed 2MiB budget: '+bytes);
});
