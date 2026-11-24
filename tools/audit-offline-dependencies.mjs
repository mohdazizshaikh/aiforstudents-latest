/** M33 audit: every source HTML route, executable/style dependency and local ES import has an explicit precache entry. */
import {readdirSync,readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const dirs=['assets','games','privacy','for-parents','methodology','accessibility','future-explorer','grow-together','study-lab','smart-learning-studio','virtual-experiment-lab','teacher-kit','ai-digital-skills','hi'];
export function auditOfflineDependencies(root=ROOT,override){
 const issues=[];
 const sw=override??readFileSync(path.join(root,'service-worker.js'),'utf8');
 const match=sw.match(/\bconst FILES\s*=\s*\[([\s\S]*?)\];/);
 const entries=match?[...match[1].matchAll(/'\.\/([^']*)'/g)].map(x=>'/'+x[1]):[];
 const cache=new Set(entries);
 if(!entries.length||cache.size!==entries.length)issues.push('Missing or duplicate precache entries');
 const scan=d=>readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?scan(d+'/'+e.name):[d+'/'+e.name]);
 const files=['index.html',...dirs.flatMap(scan)];
 const pages=files.filter(x=>x.endsWith('.html')),js=files.filter(x=>x.endsWith('.js'));
 function requireEntry(target,source){if(!cache.has(target))issues.push(source+' missing precache entry: '+target)}
 function resolve(source,ref){try{const u=new URL(ref,'https://local.invalid/'+source);return u.origin==='https://local.invalid'?u.pathname:null}catch{return null}}
 for(const page of pages){
  requireEntry('/'+page.replace(/index\.html$/,''),page);
  const html=readFileSync(path.join(root,page),'utf8');
  for(const [,tag,ref] of html.matchAll(/<(script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi)){
   if(tag.toLowerCase()==='link'&&!/\.(?:css|svg|webmanifest)(?:$|[?#])/.test(ref))continue;
   const target=resolve(page,ref);if(!target)issues.push(page+' remote executable/style dependency');else requireEntry(target,page);
  }
 }
 for(const script of js){
  requireEntry('/'+script,script);
  const content=readFileSync(path.join(root,script),'utf8');
  for(const [,ref] of content.matchAll(/\bfrom\s*['"](\.[^'"]+)['"]/g)){
   const target=resolve(script,ref);if(target)requireEntry(target,script)
  }
 }
 for(const entry of cache)if(!existsSync(path.join(root,entry.replace(/^\//,'')+(entry.endsWith('/')?'index.html':''))))issues.push('Missing source '+entry);
 return {valid:issues.length===0,issues,htmlRoutes:pages.length,jsFiles:js.length,cachePaths:entries.length,physicalDeviceVerified:false,publicReleaseApproved:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const r=auditOfflineDependencies();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1
}
