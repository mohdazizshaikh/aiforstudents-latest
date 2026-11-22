/** Strict checks for source package and staging hosting build. */
import {readdirSync,readFileSync,existsSync,statSync} from 'node:fs';import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
function scan(folder){return readdirSync(folder,{withFileTypes:true}).flatMap(item=>{const full=path.join(folder,item.name);return item.isDirectory()?scan(full):[full]})}
const pages=scan(root).filter(f=>f.endsWith('.html'));
const errors=[];for(const page of pages){const text=readFileSync(page,'utf8');if(!text.includes('noindex,nofollow'))errors.push(`${page}: missing staging noindex`);if(!/<title>[\s\S]*?<\/title>/.test(text))errors.push(`${page}: missing title`);if(!/<meta name="description"/.test(text))errors.push(`${page}: missing meta description`)}
const modules=scan(path.join(root,'assets')).filter(f=>f.endsWith('.js'));
for(const js of modules){const text=readFileSync(js,'utf8');for(const [,rel] of text.matchAll(/^import\s+.*?from\s+['"](\.[^'"]+)['"];?/gm)){if(!existsSync(path.resolve(path.dirname(js),rel)))errors.push(`${js}: missing ${rel}`)}}
const sw=readFileSync(path.join(root,'service-worker.js'),'utf8');const m=[...sw.matchAll(/'\.\/(?:[^']+)'/g)].map(x=>x[0].slice(3,-1));for(const rel of m){const fp=path.join(root,rel);if(!existsSync(fp))errors.push(`Service worker cache target missing: ${rel}`)}
if(!existsSync(path.join(root,'.htaccess')))errors.push('Missing conservative static security header file');
console.log(JSON.stringify({htmlPages:pages.length,jsModules:modules.length,swCachePaths:m.length,errors},null,2));if(errors.length)process.exitCode=1;