import {GAMES,AGE_BANDS,getGameBank} from '../assets/catalog.js';
import {writeFileSync} from 'node:fs';
const out=[];
for(const g of GAMES)for(const age of AGE_BANDS)for(const p of getGameBank(g.id,age.id)){
 const en=(p.question+' '+(p.context||'')).match(/\d+(?:\.\d+)?/g)||[];
 const hi=(p.questionHi+' '+(p.contextHi||'')).match(/\d+(?:\.\d+)?/g)||[];
 const numDiff=JSON.stringify(en.map(Number).sort((a,b)=>a-b))!==JSON.stringify(hi.map(Number).sort((a,b)=>a-b));
 out.push(JSON.stringify({id:p.id,game:g.en,category:g.category,age_band:age.id,content_version:p.contentVersion||1,mode:p.mode,question_en:p.question,question_hi:p.questionHi,context_en:p.context||'',context_hi:p.contextHi||'',answer_for_reviewer:p.answer,explanation_en:p.explanation||'',explanation_hi:p.explanationHi||'',numeric_language_flag:numDiff,review_status:'UNREVIEWED',reviewer_notes:'',approved_for_child_launch:false}));
}
writeFileSync('CONTENT_REVIEW_QUEUE.jsonl',out.join('\n')+'\n');
console.log(`Wrote ${out.length} unreviewed tasks to CONTENT_REVIEW_QUEUE.jsonl`);