/** Optional release-time SEO finalization after domain ownership is known.
 * Usage: node tools/configure-domain.mjs https://example.org
 * On a COPY of the static site, writes real canonical URLs and a valid absolute XML sitemap.
 * No hreflang until separate verified Hindi URLs exist.
 * This script deliberately retains staging noindex. Remove only after launch approvals.
 */
import fs from 'node:fs';import path from 'node:path';
const given=process.argv[2];
if(!given){console.error('Usage: node tools/configure-domain.mjs https://your-verified-domain.example');process.exit(1)}
let origin;try{const u=new URL(given);if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash)throw Error();origin=u.origin}catch{throw Error('Pass a verified HTTPS site origin without path, query or fragment')}
const root=path.resolve(import.meta.dirname,'..');
const pages=[{file:'index.html',url:'/'},{file:'grow-together/index.html',url:'/grow-together/'},...['future-explorer','study-lab','smart-learning-studio','privacy','for-parents','methodology','accessibility','hi'].map(name=>({file:`${name}/index.html`,url:`/${name}/`})),...fs.readdirSync(path.join(root,'games'),{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>({file:`games/${d.name}/index.html`,url:`/games/${d.name}/`}))];
for(const page of pages){const file=path.join(root,page.file);let html=fs.readFileSync(file,'utf8');const canonical=`<link rel="canonical" href="${origin}${page.url}">`;
 html=html.replace(/<link rel="canonical"[^>]*>/g,'');html=html.replace('</head>',canonical+'</head>');fs.writeFileSync(file,html)}
const escapeXml=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`  <url><loc>${escapeXml(origin+p.url)}</loc></url>`).join('\n')}\n</urlset>\n`);
const robots=path.join(root,'robots.txt');let old=fs.readFileSync(robots,'utf8').split('\n').filter(l=>!l.startsWith('Sitemap:')).join('\n').trimEnd();fs.writeFileSync(robots,`${old}\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Configured ${pages.length} canonical HTML pages, sitemap.xml and robots.txt for ${origin}`);