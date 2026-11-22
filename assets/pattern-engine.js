/**
 * AI for Students — Pattern Quest M1-M3 engine (prototype).
 * All puzzles generated deterministically from rule-defined practice templates.
 * These are practice exercises, NOT psychometric or career assessment instruments.
 * No network calls or personal data collection.
 */
export const AGE_BANDS = Object.freeze([
  { id: '6-10', label: '6–10 years', description: 'Short visual and number patterns' },
  { id: '11-14', label: '11–14 years', description: 'Two-step and alternating patterns' },
  { id: '15-17', label: '15–17 years', description: 'Multi-step numerical sequences' },
  { id: '18+', label: '18+ years', description: 'Advanced patterns and reasoning' }
]);

const SYMBOLS = ['●', '▲', '■', '◆'];
const SYMBOL_LABELS = {'●':'circle','▲':'triangle','■':'square','◆':'diamond',
 '↑':'up arrow','→':'right arrow','↓':'down arrow','←':'left arrow'};
const ARROWS = ['↑','→','↓','←'];
const CONFIG = {
  '6-10': ['add','subtract','alternate-shapes','repeat-shapes','skip-count'],
  '11-14': ['add','step-growth','interleave','repeat-shapes','multiply'],
  '15-17': ['step-growth','square-offset','multiply','interleave','turn-arrows'],
  '18+': ['step-growth','square-offset','multiply-plus','fibonacci','turn-arrows']
};

function hash(str) {
  let h=2166136261;
  for(const c of str){h^=c.charCodeAt(0); h=Math.imul(h,16777619);}
  return h>>>0;
}
function shuffleStable(items,seed) {
  const arr=items.slice(); let x=hash(seed)||1;
  for(let i=arr.length-1;i>0;i--) {
    x^=x<<13; x^=x>>>17; x^=x<<5;
    const j=(x>>>0)%(i+1); [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
const fmt = v => String(v);
function numericOptions(answer, delta, seed) {
  const pool = [answer,answer-delta,answer+delta,answer+(delta*2), answer-(delta*2),answer+1,answer-1];
  const valid=[...new Set(pool.filter(n=>Number.isSafeInteger(n) && n>=0))];
  // Include answer, then choose three distinct, plausible distractors.
  const choices = [answer, ...valid.filter(n=>n!==answer).slice(0,3)];
  if(choices.length!==4) throw new Error('Cannot generate distinct numeric choices');
  return shuffleStable(choices.map(fmt),seed);
}
function symbolicOptions(answer,seed,arr=SYMBOLS){
  return shuffleStable(arr.slice(),seed);
}

function makePuzzle(ageBand, kind, variant) {
  const id=`${ageBand}:${kind}:${variant}`;
  let sequence, answer, explanation, choices, difficulty=1;
  const base=variant+2;
  switch(kind){
    case 'add': {
      const a=base+1, step=variant+2;
      sequence=Array.from({length:4},(_,i)=>a+i*step); answer=a+4*step;
      explanation=`Each number increases by ${step}. The next number is ${answer}.`;
      choices=numericOptions(answer,step,id); difficulty=1; break;
    }
    case 'subtract': {
      const step=variant+1,a=24+variant*5;
      sequence=Array.from({length:4},(_,i)=>a-i*step); answer=a-4*step;
      explanation=`Each number decreases by ${step}. The next number is ${answer}.`;
      choices=numericOptions(answer,step,id); difficulty=1; break;
    }
    case 'alternate-shapes': {
      const a=SYMBOLS[variant],b=SYMBOLS[(variant+1)%4];
      sequence=[a,b,a,b]; answer=a;
      explanation=`The shapes alternate: ${SYMBOL_LABELS[a]}, ${SYMBOL_LABELS[b]}, then ${SYMBOL_LABELS[a]}.`;
      choices=symbolicOptions(answer,id); difficulty=1; break;
    }
    case 'repeat-shapes': {
      const a=SYMBOLS[variant],b=SYMBOLS[(variant+1)%4],c=SYMBOLS[(variant+2)%4];
      sequence=[a,b,c,a,b]; answer=c;
      explanation=`The three-shape cycle repeats: ${SYMBOL_LABELS[a]}, ${SYMBOL_LABELS[b]}, ${SYMBOL_LABELS[c]}.`;
      choices=symbolicOptions(answer,id); difficulty=2; break;
    }
    case 'skip-count': {
      const a=variant+1,step=variant+3;
      sequence=[a,a+step,a+2*step,a+3*step]; answer=a+4*step;
      explanation=`Count forward by ${step} each time. The next number is ${answer}.`;
      choices=numericOptions(answer,step,id); difficulty=2; break;
    }
    case 'step-growth': {
      const a=base+1, first=variant+1;
      sequence=[a,a+first,a+first+(first+1),a+first+(first+1)+(first+2)];
      answer=sequence[3]+first+3;
      explanation=`The increases are ${first}, ${first+1}, ${first+2}, then ${first+3}. The next number is ${answer}.`;
      choices=numericOptions(answer,first+3,id); difficulty=3; break;
    }
    case 'interleave': {
      const a=variant+2,b=variant+12, stepA=variant+1,stepB=variant+2;
      sequence=[a,b,a+stepA,b+stepB,a+2*stepA]; answer=b+2*stepB;
      explanation=`The alternating positions form two sequences. The second sequence adds ${stepB}, so its next value is ${answer}.`;
      choices=numericOptions(answer,stepB,id); difficulty=3; break;
    }
    case 'multiply': {
      const a=variant+1,factor=variant%2===0?2:3;
      sequence=Array.from({length:4},(_,i)=>a*(factor**i)); answer=a*(factor**4);
      explanation=`Multiply by ${factor} each time. The next number is ${answer}.`;
      choices=numericOptions(answer,Math.max(2,a*factor),id); difficulty=3; break;
    }
    case 'square-offset': {
      const off=variant+1;
      sequence=[1,2,3,4].map(n=>n*n+off); answer=25+off;
      explanation=`The terms are consecutive squares plus ${off}. The next is 5² + ${off} = ${answer}.`;
      choices=numericOptions(answer,Math.max(2,off),id); difficulty=4; break;
    }
    case 'multiply-plus': {
      const a=variant+1, add=variant+1;
      sequence=[a]; for(let i=1;i<4;i++) sequence.push(sequence[i-1]*2+add);
      answer=sequence[3]*2+add;
      explanation=`Multiply the previous term by 2 and add ${add}. The next number is ${answer}.`;
      choices=numericOptions(answer,add+2,id); difficulty=4; break;
    }
    case 'fibonacci': {
      const a=variant+1,b=variant+3;
      sequence=[a,b,a+b,a+2*b,2*a+3*b]; answer=3*a+5*b;
      explanation=`Each term is the sum of the preceding two. The next number is ${answer}.`;
      choices=numericOptions(answer,a+b,id); difficulty=4; break;
    }
    case 'turn-arrows': {
      const start=variant%4;
      sequence=Array.from({length:4},(_,i)=>ARROWS[(start+i)%4]);answer=ARROWS[start];
      explanation='The arrow turns 90° clockwise each step, then returns to the first direction.';
      choices=symbolicOptions(answer,id,ARROWS); difficulty=3; break;
    }
    default: throw new Error(`Unrecognized template: ${kind}`);
  }
  const allowed=CONFIG[ageBand];
  if(!allowed || !allowed.includes(kind)) throw new Error(`Invalid template for age band: ${id}`);
  if(!choices.includes(fmt(answer)) || new Set(choices).size!==4) throw new Error(`Invalid options: ${id}`);
  return Object.freeze({
    id, categoryId:'logical-reasoning', gameId:'pattern-quest', ageBand,
    kind, variant, difficulty, question:'What comes next?',
    sequence:sequence.map(fmt), choices, answer:fmt(answer),
    explanation, estimatedSeconds:50, contentVersion:1, reviewed:false
  });
}

export function getBank(ageBand) {
  if(!CONFIG[ageBand]) throw new Error('Unknown age band');
  const items=CONFIG[ageBand].flatMap(k=>Array.from({length:4},(_,i)=>makePuzzle(ageBand,k,i)));
  if(items.length!==20 || new Set(items.map(i=>i.id)).size!==20) throw new Error('Invalid question bank');
  return items;
}

/** Selects a maximum of one item from each mechanic in a session. 
 * Unseen items always take priority; no silent repeat once all 20 are completed.
 */
export function selectSession(bank, seenIds, sessionOrdinal=0, count=5) {
  const seen = new Set(seenIds || []);
  const available=bank.filter(p=>!seen.has(p.id));
  const kinds=[...new Set(bank.map(p=>p.kind))];
  const kindOrder=shuffleStable(kinds,`kinds:${bank[0]?.ageBand}:${sessionOrdinal}`);
  let result=[];
  for(const kind of kindOrder) {
    const candidates=available.filter(p=>p.kind===kind);
    if(candidates.length) result.push(shuffleStable(candidates,`p:${sessionOrdinal}:${kind}`)[0]);
    if(result.length===count)break;
  }
  return Object.freeze({items:result, exhausted:result.length===0, remainingAfter:available.length-result.length});
}

export function grade(puzzle, response) {
  return Object.freeze({correct:String(response)===puzzle.answer, correctAnswer:puzzle.answer, explanation:puzzle.explanation});
}

export function activitySummary(responses) {
  const attempted=responses.length;
  const correct=responses.filter(r=>r.correct).length;
  return {attempted,correct, message:attempted?`You tried ${attempted} different patterns and solved ${correct} correctly. Each attempt is useful practice.`:'No challenges completed yet.'};
}