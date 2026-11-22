/** M17 teacher content for qualified human review; no auto-approval. */
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {CLASSROOM_IDS,CLASSROOM_LESSONS,CLASSROOM_VERSION} from '../assets/classroom-engine.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const rows=[];
for(const id of CLASSROOM_IDS){const l=CLASSROOM_LESSONS[id];l.steps.forEach((step,idx)=>rows.push({id:`${CLASSROOM_VERSION}:${id}:${idx+1}`,version:CLASSROOM_VERSION,lesson:id,step:idx+1,title:step.title,teacher:step.teacher,question:step.prompt,groupActivity:step.action,teacherGuidance:step.answer,plannedMinutes:step.duration,educationalReview:'PENDING',hindiReview:'PENDING',copyrightStatus:'ORIGINAL DRAFT',publicReleaseApproved:false}));}
writeFileSync(path.join(root,'CLASSROOM_CONTENT_REVIEW_QUEUE.jsonl'),rows.map(r=>JSON.stringify(r)).join('\n')+'\n');
console.log(`Exported ${rows.length} unreviewed classroom facilitation steps`);