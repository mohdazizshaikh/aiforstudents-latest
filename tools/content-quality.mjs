/** Independent, reproducible *structural* audit, not psychometric/human validation. */
import {GAMES,AGE_BANDS,getGameBank,evaluate} from '../assets/catalog.js';
const sortNum=s=>(s.match(/\d+(?:\.\d+)?/g)||[]).map(Number).sort((a,b)=>a-b);
const signature=p=>[p.question,p.context||'',(p.sequence||[]).join('|'),p.choices.slice().sort().join('|'),p.answer??''].join('~');
const validNumber=n=>Number.isFinite(n);
export function auditContent(){
  const errors=[],flags=[],counts={categories:new Set(GAMES.map(g=>g.category)).size,games:GAMES.length,ageBands:AGE_BANDS.length,items:0,scored:0,reflective:0,missingHumanReview:0,englishHindiNumericMismatch:0,ageIdenticalTasks:0,ageIdenticalGames:0,independentCircuitsChecked:0,independentArithmeticChecked:0};
  const ageRepeats=[];
  const must=(b,msg)=>{if(!b)errors.push(msg)};
  for(const g of GAMES){
    const banks=AGE_BANDS.map(a=>getGameBank(g.id,a.id));
    for(let i=0;i<20;i++){
      if(banks.every(b=>signature(b[i])===signature(banks[0][i])))counts.ageIdenticalTasks++;
    }
    const same=banks.every(b=>b.every((item,i)=>signature(item)===signature(banks[0][i])));
    if(same){counts.ageIdenticalGames++;ageRepeats.push(g.id)}
    for(const bank of banks){
      must(bank.length===20,`${g.id}: expected 20 tasks`);
      must(new Set(bank.map(p=>p.id)).size===20,`${g.id}: duplicate ID`);
      must(new Set(bank.map(signature)).size===20,`${g.id}: repeated display state`);
      for(const p of bank){
        counts.items++;
        must(Boolean(p.question?.trim())&&Boolean(p.questionHi?.trim()),`${p.id}: empty English/Hindi question`);
        if(p.mode==='reflection'){
          must(Boolean(p.feedbackByChoice)&&Boolean(p.feedbackByChoiceHi),`${p.id}: missing bilingual reflection feedback`);
        }else{
          must(Boolean(p.explanation?.trim())&&Boolean(p.explanationHi?.trim()),`${p.id}: missing feedback translation`);
        }
        must(p.reviewed!==true,`${p.id}: unverified human-review claim`);
        if(p.reviewed!==true)counts.missingHumanReview++;
        const enNums=sortNum(p.question+' '+(p.context||'')),hiNums=sortNum(p.questionHi+' '+(p.contextHi||''));
        if(JSON.stringify(enNums)!==JSON.stringify(hiNums)){
          counts.englishHindiNumericMismatch++;
          flags.push(`${p.id}: numeric tokens differ across language context (verify manually)`);
        }
        if(p.mode==='scored'){
          counts.scored++;
          must(evaluate(p,p.answer).correct===true,`${p.id}: stored correct answer does not evaluate true`);
          if(p.interaction==='choice'){
            must(p.choices.filter(x=>x===p.answer).length===1,`${p.id}: ambiguous keyed choice`);
            for(const c of p.choices)if(c!==p.answer)must(evaluate(p,c).correct===false,`${p.id}: alternate value erroneously grades true`);
          }
        }else{
          counts.reflective++;
          must(p.answer===null,`${p.id}: reflective task has numeric answer`);
        }
        // Reference evaluation: check circuit topology independently from its prompt/key.
        if(p.gameId==='circuit-logic'){
          const k=Number(p.kind.replace('task','')),L=AGE_BANDS.findIndex(x=>x.id===p.ageBand)+1,v=p.variant;
          const a=Boolean(v&1),b=Boolean(v&2),c=(k+L)%2===0;
          const on=k===0?a&&b:k===1?a||b:k===2?a&&b&&c:k===3?a||b||c:c&&(a||b);
          must(p.answer===(on?'On: a complete conducting path exists':'Off: every conducting path is interrupted'),`${p.id}: circuit reference disagrees with key`);
          counts.independentCircuitsChecked++;
        }
        if(p.gameId==='math-explorer'){
          const m=p.question.match(/sides of (\d+) metres/);
          must(Boolean(m),`${p.id}: math-explorer side not found`);
          if(m){must(Number(p.answer)===4*Number(m[1]),`${p.id}: perimeter mismatch`);counts.independentArithmeticChecked++}
        }
        if(p.gameId==='resource-manager'){
          const m=p.question.match(/needs (\d+) cards.*for (\d+) complete kits/);
          must(Boolean(m),`${p.id}: resource-manager quantities not found`);
          if(m){must(Number(p.answer)===Number(m[1])*Number(m[2]),`${p.id}: resource arithmetic mismatch`);counts.independentArithmeticChecked++}
        }
        if(p.gameId==='plan-b-challenge'){
          const m=p.question.match(/needs (\d+) minutes.*adds (\d+) minutes/);
          must(Boolean(m),`${p.id}: plan-b quantities not found`);
          if(m){must(Number(p.answer)===Number(m[1])+Number(m[2]),`${p.id}: plan-b arithmetic mismatch`);counts.independentArithmeticChecked++}
        }
        if(p.gameId==='estimate-master'){
          const m=p.question.match(/Round (\d+) to/);
          must(Boolean(m),`${p.id}: rounding number not found`);
          if(m){must(Number(p.answer)===Math.round(Number(m[1])/10)*10,`${p.id}: rounding mismatch`);counts.independentArithmeticChecked++}
        }
        if(p.gameId==='change-the-rules'){
          const m=p.question.match(/at least (\d+)/);
          must(Boolean(m),`${p.id}: minimum not found`);
          if(m){const x=Number(m[1]),candidates=p.choices.map(Number).filter(validNumber).filter(y=>y>=x);must(Number(p.answer)===Math.min(...candidates),`${p.id}: minimum-selection mismatch`);counts.independentArithmeticChecked++}
        }
      }
    }
  }
  if(counts.englishHindiNumericMismatch)flags.push(`${counts.englishHindiNumericMismatch} bilingual tasks contain different numeric tokens; many are explanatory 90-degree conversions, and they remain flagged for human review.`);
  if(counts.ageIdenticalGames)flags.push(`${counts.ageIdenticalGames} game banks identical across all age bands: ${ageRepeats.join(', ')}. Not age-calibrated.`);
  if(counts.missingHumanReview)flags.push('All content items explicitly unreviewed by a human educational specialist. Public child-assessment launch blocked.');
  flags.push('Reflection completion is self-reported; the platform does not verify a project was completed or a person performed it.');
  flags.push('Potential overlap between game mechanics and some ambiguous sequence/semantic tasks requires human content review.');
  return {generatedDate:'2026-11-23',status:errors.length===0?'STRUCTURAL_CHECKS_PASS_ONLY':'STRUCTURAL_CHECKS_FAILED',counts,errors,flags,ageRepeats};
}