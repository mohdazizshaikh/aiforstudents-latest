import {auditContent} from './content-quality.mjs';
import {writeFileSync} from 'node:fs';
const r=auditContent();
writeFileSync('CONTENT_AUDIT.json',JSON.stringify(r,null,2)+'\n');
writeFileSync('CONTENT_AUDIT.md',`# M12-B — Content quality audit\n\nAutomated structural checks only; **not a psychometric or educational expert review**.\n\nStatus: **${r.status}**.\n\n| Indicator | Count |\n|---|---:|\n${Object.entries(r.counts).map(([k,v])=>`| ${k} | ${v} |`).join('\n')}\n\n## Remaining risks / review flags\n\n${r.flags.map(x=>`- ${x}`).join('\n')}\n\n## Automated errors\n\n${r.errors.length?r.errors.map(e=>`- ${e}`).join('\n'):'No structural audit errors found.'}\n\n## Mandatory release gate\n\nDo not market or launch this prototype as a validated aptitude, intelligence, or career-fit test. Human subject-matter review, bilingual review, fairness studies, accessibility/device testing and child safety/legal review are required before the child-facing public launch.\n`);
console.log(JSON.stringify({status:r.status,counts:r.counts,errors:r.errors.slice(0,8)},null,2));
if(r.errors.length)process.exitCode=1;