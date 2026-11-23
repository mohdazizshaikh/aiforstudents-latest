/** M24 — deterministic structural HTML accessibility smoke for private staging.
 * This does NOT replace screen readers, keyboard testing, WCAG audit or human review. */
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const SKIP=new Set(['.git','node_modules','review-evidence','review-packet','__pycache__','.pytest_cache']);
function walk(folder){
 return readdirSync(folder,{withFileTypes:true}).flatMap(e=>{
  if(e.isDirectory())return SKIP.has(e.name)?[]:walk(path.join(folder,e.name));
  return e.isFile()&&e.name.endsWith('.html')?[path.join(folder,e.name)]:[];
 });
}
const tags=(html,tag)=>[...html.matchAll(new RegExp('<'+tag+'\\b[^>]*>','gi'))].map(x=>x[0]);
const attr=(element,name)=>element.match(new RegExp('\\b'+name+'=["\\x27]([^"\\x27]*)["\\x27]','i'))?.[1]??null;
export function auditStaticAccessibility(root=ROOT){
 const problems=[],pages=walk(root).sort();
 for(const page of pages){
  const rel=path.relative(root,page).replaceAll('\\','/'),html=readFileSync(page,'utf8');
  const fail=message=>problems.push(rel+': '+message);
  const lang=tags(html,'html')[0]&&attr(tags(html,'html')[0],'lang');
  if(!lang||!['en','hi'].includes(lang))fail('missing or unsupported HTML lang');
  const main=tags(html,'main');
  if(main.length!==1)fail('expected exactly one main landmark; found '+main.length);
  const allIds=[...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(x=>x[1]);
  const seen=new Set();
  for(const id of allIds){if(seen.has(id))fail('duplicate id '+id);seen.add(id)}
  const skip=tags(html,'a').filter(t=>(attr(t,'class')??'').split(/\s+/).includes('skip'));
  if(skip.length!==1)fail('expected exactly one skip link; found '+skip.length);
  else{
   const href=attr(skip[0],'href');
   if(!href?.startsWith('#')||!seen.has(href.slice(1)))fail('skip link target missing');
  }
  for(const img of tags(html,'img'))if(attr(img,'alt')===null)fail('image without alt attribute');
 }
 return {htmlPages:pages.length,problems,structuralOnly:true,
  approval:'No WCAG/assistive-technology or child-safety approval'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=auditStaticAccessibility();
 console.log(JSON.stringify(result,null,2));
 if(result.problems.length)process.exitCode=1;
}
