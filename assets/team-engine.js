/** Same-device cooperative tasks. No user identities, online services, or aptitude inferences. */
export const TEAM_MODES = [
 {id:'pattern-partners', en:'Pattern Partners', hi:'पैटर्न पार्टनर्स',icon:'◈',enDesc:'Combine a starting clue and a step clue.',hiDesc:'शुरुआती संख्या और बढ़त का नियम मिलाएँ।'},
 {id:'number-bridge', en:'Number Bridge', hi:'नंबर ब्रिज',icon:'⊕',enDesc:'Combine a shopping total and a saving.',hiDesc:'खरीद की कुल रकम और बचत को मिलाएँ।'},
 {id:'story-signals', en:'Story Signals', hi:'कहानी संकेत',icon:'✎',enDesc:'Combine who and where clues to solve a story.',hiDesc:'कहानी में कौन और कहाँ के संकेत मिलाएँ।'}
];
export const TEAM_AGES=['6-10','11-14','15-17','18+'];
const LEVEL={'6-10':1,'11-14':2,'15-17':3,'18+':4};
const PEOPLE=[['Asha','आशा'],['Kabir','कबीर'],['Mira','मीरा'],['Ravi','रवि'],['Tara','तारा']];
const PLACES=[['library','पुस्तकालय'],['garden','बगीचे'],['museum','संग्रहालय'],['workshop','कार्यशाला'],['market','बाज़ार']];
const opt=(correct,wrong1,wrong2)=> [...new Set([correct,wrong1,wrong2])];
const unique4=(answer,choices)=>{
 const list=[answer,...choices.filter(x=>x!==answer)];
 if(new Set(list).size!==4)throw Error('Invalid answer options');
 return list;
};
function numericChoices(answer,step){return unique4(String(answer),[String(answer+step),String(answer+2*step),String(Math.max(0,answer-step))]);}
function makePattern(age,i){const mul=LEVEL[age],start=2+mul*2+i,step=2+(i%4)+mul,answer=start+3*step;
 return {
 id:`pattern-partners:${age}:${i}`,mode:'pattern-partners',ageBand:age,
 p1:{en:`Your clue: the first number is ${start-1} + 1. Choose it.`,hi:`आपका संकेत: पहली संख्या ${start-1} + 1 है। चुनें।`,options:numericChoices(start,1),answer:String(start)},
 p2:{en:`Your clue: every next number is ${step-1} + 1 more. Choose the increase.`,hi:`आपका संकेत: अगली संख्या ${step-1} + 1 ज़्यादा है। बढ़त चुनें।`,options:numericChoices(step,1),answer:String(step)},
 joint:{en:'Together: what is the fourth number in this sequence?',hi:'साथ में: इस क्रम की चौथी संख्या क्या है?',options:numericChoices(answer,1+mul),answer:String(answer)},
 explain:{en:`Start ${start}, increase ${step} three times: ${start} + 3 × ${step} = ${answer}.`,hi:`शुरुआत ${start}, बढ़त ${step} तीन बार: ${start} + 3 × ${step} = ${answer}।`}
 };
}
function makeNumber(age,i){const mul=LEVEL[age],count=2+(i%4),price=2+mul+(i%6),discount=1+(i%3),subtotal=count*price,answer=subtotal-discount;
 return {
 id:`number-bridge:${age}:${i}`,mode:'number-bridge',ageBand:age,
 p1:{en:`Your clue: ${count} items cost ₹${price} each. Choose the total before savings.`,hi:`आपका संकेत: ${count} वस्तुएँ ₹${price} प्रति वस्तु हैं। छूट से पहले कुल चुनें।`,options:numericChoices(subtotal,1),answer:String(subtotal)},
 p2:{en:`Your clue: the saving is ₹${discount+2} minus ₹2. Choose the saving.`,hi:`आपका संकेत: बचत ₹${discount+2} में से ₹2 घटाकर मिलेगी। बचत चुनें।`,options:numericChoices(discount,1),answer:String(discount)},
 joint:{en:'Together: how many rupees must be paid after the saving?',hi:'साथ में: बचत के बाद कितने रुपये देने हैं?',options:numericChoices(answer,2),answer:String(answer)},
 explain:{en:`Before saving: ${count} × ${price} = ₹${subtotal}. After saving ₹${discount}: ₹${answer}.`,hi:`पहले: ${count} × ${price} = ₹${subtotal}। ₹${discount} बचाने के बाद: ₹${answer}।`}
 };
}
function makeStory(age,i){const pi=i%5,li=Math.floor(i/5)%5,person=PEOPLE[pi],place=PLACES[li],otherPeople=[PEOPLE[(pi+1)%5],PEOPLE[(pi+2)%5],PEOPLE[(pi+3)%5]],otherPlaces=[PLACES[(li+1)%5],PLACES[(li+2)%5],PLACES[(li+3)%5]];
 const answer=`${person[0]} — ${place[0]}`,answerHi=`${person[1]} — ${place[1]}`;
 return {
 id:`story-signals:${age}:${i}`,mode:'story-signals',ageBand:age,
 p1:{en:`Your clue: ${person[0]} is the person in the story. Choose their name.`,hi:`आपका संकेत: कहानी में ${person[1]} हैं। उनका नाम चुनें।`,options:[person[0],...otherPeople.map(x=>x[0])],optionsHi:[person[1],...otherPeople.map(x=>x[1])],answer:person[0]},
 p2:{en:`Your clue: the place is the ${place[0]}. Choose the place.`,hi:`आपका संकेत: स्थान ${place[1]} है। स्थान चुनें।`,options:[place[0],...otherPlaces.map(x=>x[0])],optionsHi:[place[1],...otherPlaces.map(x=>x[1])],answer:place[0]},
 joint:{en:'Together: match the person and place from your two clues.',hi:'साथ में: दोनों संकेतों से व्यक्ति और स्थान मिलाएँ।',options:[answer,...otherPeople.slice(0,2).map((p,j)=>`${p[0]} — ${otherPlaces[j][0]}`),`${person[0]} — ${otherPlaces[2][0]}`],optionsHi:[answerHi,...otherPeople.slice(0,2).map((p,j)=>`${p[1]} — ${otherPlaces[j][1]}`),`${person[1]} — ${otherPlaces[2][1]}`],answer},
 explain:{en:`One clue named ${person[0]}; the other named the ${place[0]}. Together they form “${answer}”.`,hi:`पहले संकेत में ${person[1]} थे और दूसरे में ${place[1]}। दोनों मिलकर “${answerHi}” बनते हैं।`}
 };
}
function scramble(m,i){for(const [idx,role] of ['p1','p2','joint'].entries()){
  const card=m[role],shift=(i+idx+1)%card.options.length;
  card.options=[...card.options.slice(shift),...card.options.slice(0,shift)];
  if(card.optionsHi)card.optionsHi=[...card.optionsHi.slice(shift),...card.optionsHi.slice(0,shift)];
 }return m;}
export function getTeamBank(mode,age){if(!TEAM_MODES.some(m=>m.id===mode)||!TEAM_AGES.includes(age))throw Error('Unsupported game/age');let make=mode==='pattern-partners'?makePattern:mode==='number-bridge'?makeNumber:makeStory;
 return Array.from({length:20},(_,i)=>scramble(make(age,i),i));}
export function pickTeamMissions(mode,age,seen=[],count=3,rng=Math.random){const bank=getTeamBank(mode,age),set=new Set(seen);const remaining=bank.filter(m=>!set.has(m.id));const exhausted=remaining.length===0;
 const source=exhausted?bank:remaining;const shuffled=[...source];for(let i=shuffled.length-1;i>0;i--){const r=rng(),j=Math.max(0,Math.min(i,Math.floor(r*(i+1))));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 return {items:shuffled.slice(0,count),exhausted,remaining:remaining.length};}
export function gradeRole(mission,role,value){if(!['p1','p2','joint'].includes(role))throw Error('Invalid role');const card=mission[role];if(!card.options.includes(value))throw Error('Invalid answer');return value===card.answer;}
export function makeTeamResult(missions,records){if(!Array.isArray(missions)||!Array.isArray(records)||missions.length!==records.length||!missions.length||missions.length>3)throw Error('Invalid round');
 let solved=0;for(let i=0;i<missions.length;i++){const r=records[i],m=missions[i];if(r.id!==m.id)throw Error('Mismatched result');for(const role of ['p1','p2','joint'])if(typeof r[role]!=='string'||!m[role].options.includes(r[role]))throw Error('Incomplete round');if(gradeRole(m,'joint',r.joint))solved++;}
 return {attempted:missions.length,solved,roleActions:{p1:missions.length,p2:missions.length},missionIds:missions.map(x=>x.id)};
}