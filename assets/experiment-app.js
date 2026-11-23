/** M16 interactive virtual experiments. All input stays in current browser. */
import {EXPERIMENTS,EXPERIMENT_IDS,EXPERIMENT_VERSION,experimentTask,experimentText,relation,bulbLit,evaluateExperiment,experimentSummary,WORKSHOP_MODES,WORKSHOP_CONTENT,evaluateWorkshop} from './experiment-engine.js';
const $=id=>document.getElementById(id), el=(tag,cls,txt)=>{const n=document.createElement(tag);n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const S={id:'fractions-lab',index:0,lang:'en',ageBand:'11-14',frac:{a:{n:1,d:2},b:{n:2,d:3}},switches:{a:false,b:false},choice:null,feedback:null};
const loc=(en,hi)=>S.lang==='hi'?hi:en;
const t=x=>experimentText(x,S.lang);
const getHistory=()=>window.AIFS_EXPERIMENT_BRIDGE?.getHistory?.()||{};
function resetTask(){S.frac=S.index===0?{a:{n:1,d:2},b:{n:2,d:3}}:{a:{n:1,d:2},b:{n:2,d:4}};S.switches=S.index===0?{a:false,b:false}:{a:true,b:true};S.choice=null;S.feedback=null;}
function updateLocale(){S.lang=$('lang')?.value==='hi'?'hi':'en';S.ageBand=$('age-select')?.value||'11-14';}
function control(text,fn,pressed=null,label=null){const b=el('button','btn outline compact',text);b.type='button';if(label)b.setAttribute('aria-label',label);if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));b.addEventListener('click',()=>{const buttons=[...document.querySelectorAll('#experiment-lab button')],position=buttons.indexOf(b);fn();S.feedback=null;render();const next=[...document.querySelectorAll('#experiment-lab button')][position];const target=next?.disabled?(next.closest('.experiment-strip-actions')?.querySelector('button:not(:disabled)')||next.closest('#experiment-lab')?.querySelector('button:not(:disabled)')):next;if(target&&!target.disabled)target.focus();});return b;}
function fractionUI(parent){const names={a:loc('Strip A','पट्टी A'),b:loc('Strip B','पट्टी B')};for(const side of ['a','b']){
 const f=S.frac[side],g=el('div','experiment-strip-group');const head=el('div','experiment-strip-heading');head.append(el('strong','',names[side]),el('output','experiment-number',`${f.n}/${f.d}`));g.append(head);
 const strip=el('div','experiment-strip');strip.setAttribute('role','img');strip.setAttribute('aria-label',loc(`${f.n} of ${f.d} equal parts are shaded on ${names[side]}`,`${names[side]} में ${f.d} बराबर हिस्सों में ${f.n} रंगे हैं`));for(let i=0;i<f.d;i++)strip.append(el('span',i<f.n?'filled':'empty'));g.append(strip);
 const actions=el('div','experiment-strip-actions');const minus=control('−',()=>{f.n=Math.max(0,f.n-1)},null,loc(`${names[side]}: shade one fewer`,`${names[side]}: एक हिस्सा कम रंगें`));minus.disabled=f.n<=0;
 const plus=control('+',()=>{f.n=Math.min(f.d,f.n+1)},null,loc(`${names[side]}: shade one more`,`${names[side]}: एक हिस्सा और रंगें`));plus.disabled=f.n>=f.d;
 const down=control('−',()=>{f.d=Math.max(2,f.d-1);f.n=Math.min(f.n,f.d)},null,loc(`${names[side]}: use one fewer equal part`,`${names[side]}: कुल हिस्से एक कम करें`));down.disabled=f.d<=2;
 const up=control('+',()=>{f.d=Math.min(8,f.d+1)},null,loc(`${names[side]}: use one more equal part`,`${names[side]}: कुल हिस्से एक और करें`));up.disabled=f.d>=8;
 actions.append(el('span','experiment-input-label',loc('Shaded','रंगे')),minus,plus,el('span','experiment-input-label',loc('Total equal parts','कुल बराबर हिस्से')),down,up);g.append(actions);parent.append(g);
 }
 if(S.index===0){const choices=el('div','experiment-choice-row');choices.setAttribute('role','group');choices.setAttribute('aria-label',loc('Compare the two fractions','दो भिन्नों की तुलना करें'));for(const [val,label] of [['lt','A < B'],['eq','A = B'],['gt','A > B']])choices.append(control(label,()=>{S.choice=val},S.choice===val));parent.append(choices)}
 else parent.append(el('p','small muted',loc('Goal: two equal positive fractions smaller than one, with different denominators.','लक्ष्य: एक से छोटी दो बराबर सकारात्मक भिन्न, जिनके हर अलग हों।')));
}
function circuitUI(parent){const list=el('div','experiment-switch-row');list.setAttribute('role','group');list.setAttribute('aria-label',loc('Two series switch controls','दो श्रेणी स्विच बटन'));for(const side of ['a','b']){const caption=side.toUpperCase();const b=control(loc(`Switch ${caption}: ${S.switches[side]?'CLOSED':'OPEN'}`,`स्विच ${caption}: ${S.switches[side]?'बंद':'खुला'}`),()=>{S.switches[side]=!S.switches[side]},S.switches[side]);list.append(b)}parent.append(list);
 const on=bulbLit(S.switches),desc=el('div','experiment-circuit');desc.setAttribute('role','img');desc.setAttribute('aria-label',loc(`Battery, switch A ${S.switches.a?'closed':'open'}, switch B ${S.switches.b?'closed':'open'}, lamp ${on?'on':'off'}`,`बैटरी, स्विच A ${S.switches.a?'बंद':'खुला'}, स्विच B ${S.switches.b?'बंद':'खुला'}, बल्ब ${on?'जला':'बुझा'}`));desc.textContent=loc(`Battery → A (${S.switches.a?'closed':'open'}) → B (${S.switches.b?'closed':'open'}) → lamp (${on?'ON':'OFF'}) → battery`,`बैटरी → A (${S.switches.a?'बंद':'खुला'}) → B (${S.switches.b?'बंद':'खुला'}) → बल्ब (${on?'जला':'बुझा'}) → बैटरी`);parent.append(desc);
 parent.append(el('p','experiment-bulb',on?loc('● MODEL BULB ON — both series switches closed','● मॉडल बल्ब जला — दोनों स्विच बंद'):loc('○ MODEL BULB OFF — path interrupted','○ मॉडल बल्ब बुझा — रास्ता टूटा')));
}
function feedbackText(){const task=experimentTask(S.id,EXPERIMENTS[S.id].tasks[S.index].id),r=S.feedback;
 if(!r)return '';
 const lead=loc(r.correct?'This setup meets the task. ':'This setup does not yet meet the task. ',r.correct?'यह स्थिति सही है। ':'यह स्थिति अभी लक्ष्य के अनुसार नहीं है। ');
 if(S.id==='fractions-lab'){
 const {a,b}=r.response,rel=relation(a,b),result=rel==='lt'?'<':rel==='gt'?'>':'=';
 return lead+loc(`Strip A ${a.n}/${a.d} ${result} strip B ${b.n}/${b.d}. Cross-products: ${a.n}×${b.d}=${a.n*b.d} and ${b.n}×${a.d}=${b.n*a.d}. Equal fractions need the same proportion of equal-sized wholes.`, `पट्टी A ${a.n}/${a.d} ${result} पट्टी B ${b.n}/${b.d}। गुणनफल: ${a.n}×${b.d}=${a.n*b.d} और ${b.n}×${a.d}=${b.n*a.d}। समान आकार के पूरे का हिस्सा बराबर होने पर भिन्न बराबर होते हैं।`);
 }
 const on=bulbLit(r.response);return lead+loc(`Switch A is ${r.response.a?'closed':'open'}; B is ${r.response.b?'closed':'open'}. The lamp is ${on?'ON':'OFF'} in this simplified series model. Both switches must be closed to complete the path.`,`स्विच A ${r.response.a?'बंद':'खुला'} है, B ${r.response.b?'बंद':'खुला'} है। इस सरल श्रेणी मॉडल में बल्ब ${on?'जलता':'बुझा रहता'} है। रास्ता पूरा करने के लिए दोनों स्विच बंद होने चाहिए।`);
}
function render(){updateLocale();const exp=EXPERIMENTS[S.id],task=exp.tasks[S.index],sum=experimentSummary(getHistory().experimentAttempts,S.ageBand);
 $('experiment-nav').textContent=loc('Virtual Lab','वर्चुअल लैब');$('experiment-heading').textContent=loc('Virtual Experiment Lab','वर्चुअल प्रयोगशाला');$('experiment-desc').textContent=loc('Explore fraction strips and a conceptual series circuit. Free, local-first, no real electrical work.','भिन्न-पट्टियों और वैचारिक श्रेणी परिपथ को समझें। मुफ़्त, स्थानीय अभ्यास, असली बिजली का काम नहीं।');$('experiment-notice').textContent=loc('Educational draft: not expert-reviewed, board-calibrated or a real electrical safety guide.','शैक्षिक मसौदा: अभी विशेषज्ञ समीक्षा/बोर्ड मान्यता नहीं; असली बिजली सुरक्षा का मार्गदर्शन नहीं।');$('experiment-summary').textContent=loc(`${sum.explored}/2 experiments explored across both tasks; ${sum.attempts} local checks in this age band. Not mastery.`,`इस उम्र समूह में ${sum.explored}/2 प्रयोगों के दोनों काम आज़माए गए; ${sum.attempts} स्थानीय जाँचें। यह पूर्ण दक्षता नहीं है।`);
 const tabs=$('experiment-tabs');tabs.replaceChildren();for(const id of EXPERIMENT_IDS){const b=control(t(EXPERIMENTS[id].title),()=>{S.id=id;S.index=0;resetTask()},S.id===id);tabs.append(b)}
 $('experiment-title').textContent=t(exp.title);$('experiment-overview').textContent=t(exp.overview);
 const tasks=$('experiment-tasks');tasks.replaceChildren();for(let i=0;i<exp.tasks.length;i++)tasks.append(control(`${i+1}. ${t(exp.tasks[i].title)}`,()=>{S.index=i;resetTask()},i===S.index));
 $('experiment-question').textContent=t(task.prompt);$('experiment-hint').textContent=t(task.hint);
 const controls=$('experiment-controls');controls.replaceChildren();if(S.id==='fractions-lab')fractionUI(controls);else circuitUI(controls);
 $('experiment-check').textContent=loc('Check this setup','यह स्थिति जाँचें');$('experiment-check').disabled=S.id==='fractions-lab'&&S.index===0&&!S.choice;
 $('experiment-feedback').hidden=!S.feedback;$('experiment-feedback').textContent=feedbackText();
 $('experiment-mission-title').textContent=loc('Optional paper-only mission','वैकल्पिक कागज़ पर गतिविधि');$('experiment-mission').textContent=t(exp.mission);$('experiment-source').textContent=loc('Browse official learning resources (external)','आधिकारिक संसाधन देखें (बाहरी साइट)');$('experiment-source').href=exp.source;
}
function check(){const task=EXPERIMENTS[S.id].tasks[S.index];const response=S.id==='fractions-lab'?{a:{...S.frac.a},b:{...S.frac.b},...(S.index===0?{choice:S.choice}:{})}:{...S.switches};
 let result;try{result=evaluateExperiment(S.id,task.id,response)}catch{return}
 const d=new Date(),record={id:`experiment:${S.id}:${task.id}:${d.getTime()}:${Math.random().toString(36).slice(2,10)}`,experimentId:S.id,taskId:task.id,ageBand:S.ageBand,version:EXPERIMENT_VERSION,response,correct:result.correct,at:d.toISOString(),day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
 try{if(!window.AIFS_EXPERIMENT_BRIDGE?.record)throw Error('History bridge unavailable');window.AIFS_EXPERIMENT_BRIDGE.record(record);S.feedback=record;render();$('experiment-feedback').focus();}catch{$('experiment-feedback').hidden=false;$('experiment-feedback').textContent=loc('Could not save the check locally. Please check privacy/storage settings.','यह जाँच स्थानीय रूप से सहेज नहीं सकी। गोपनीयता/स्टोरेज सेटिंग जाँचें।')}
}
$('experiment-check').addEventListener('click',check);
$('experiment-reset').addEventListener('click',()=>{resetTask();render();$('experiment-question').focus()});
$('lang').addEventListener('change',render);$('age-select').addEventListener('change',render);
window.addEventListener('aifs-history-cleared',()=>{S.index=0;resetTask();render()});
window.addEventListener('aifs-experiment-history-changed',render);
resetTask();render();
/** M30 independent Maths Workshop: in-memory only, zero remote API, no profile.
 * The experimental three mini-labs deliberately do NOT record learner scores.
 */
const WORKSHOP_DEFAULTS=()=>({mode:'number-line',values:{position:0,width:2,height:2,a:1,b:1},checked:false});
let W=WORKSHOP_DEFAULTS();
const workshopLang=(en,hi)=>$('lang')?.value==='hi'?hi:en;
const workshopPair=(p)=>p[$('lang')?.value==='hi'?1:0];
function workshopButton(action,label,pressed=false,disabled=false){
 const b=el('button','btn outline compact',label);
 b.type='button';b.dataset.workshopAction=action;b.disabled=disabled;
 if(action.includes(':')&&!action.startsWith('mode:')){
  const [control,direction]=action.split(':');
  const names={line:['number-line position','संख्या रेखा पर स्थिति'],width:['rectangle width','आयत की चौड़ाई'],height:['rectangle height','आयत की ऊँचाई'],a:['group A count','समूह A की संख्या'],b:['group B count','समूह B की संख्या']};
  b.setAttribute('aria-label',workshopLang(`Change ${names[control][0]} ${direction==='inc'?'up':'down'} by one`,`${names[control][1]} एक ${direction==='inc'?'बढ़ाएँ':'घटाएँ'}`));
 }
 if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));
 return b;
}
function renderWorkshop(){
 const root=$('math-workshop');if(!root)return;
 const meta=WORKSHOP_CONTENT[W.mode],v=W.values,mode=W.mode;
 $('math-workshop-nav').textContent=workshopLang('Maths Workshop','गणित कार्यशाला');
 $('math-workshop-title').textContent=workshopLang('Maths Workshop — 3 pilot mini-labs','गणित कार्यशाला — 3 प्रारंभिक छोटे प्रयोग');
 $('math-workshop-intro').textContent=workshopLang('Practice with buttons or keyboard, without dragging or student accounts. Draft, not an approved Class 1–12 syllabus.','बिना खींचे बटन या कीबोर्ड से अभ्यास करें। खाता नहीं चाहिए। यह मसौदा है, मान्यता प्राप्त कक्षा 1–12 पाठ्यक्रम नहीं।');
 const tabs=$('math-workshop-tabs');tabs.replaceChildren();
 for(const name of WORKSHOP_MODES)tabs.append(workshopButton('mode:'+name,workshopPair(WORKSHOP_CONTENT[name].title),W.mode===name));
 $('math-workshop-question').textContent=workshopPair(meta.prompt);
 $('math-workshop-hint').textContent=workshopPair(meta.hint);
 const control=$('math-workshop-controls');control.replaceChildren();
 if(mode==='number-line'){
  const out=el('output','workshop-numeric',String(v.position));out.setAttribute('aria-label',workshopLang('Position on the number line','संख्या रेखा पर स्थिति'));out.id='math-workshop-number';
  control.append(workshopButton('line:dec',workshopLang('Move left −1','एक कदम बाएँ −1'),null,v.position<=-10),out,workshopButton('line:inc',workshopLang('Move right +1','एक कदम दाएँ +1'),null,v.position>=10));
  const strip=el('p','workshop-readable',workshopLang(`Current position: ${v.position}. Each step changes the number by one. Range −10 to 10.`,`वर्तमान स्थिति: ${v.position}। हर कदम संख्या को एक से बदलता है। सीमा −10 से 10।`));
  control.append(strip);
 }else if(mode==='rectangle'){
  const names=[['width','Width','चौड़ाई'],['height','Height','ऊँचाई']];
  for(const [dim,en,hi] of names){
   const field=el('div','workshop-group');field.append(el('strong','',workshopLang(en,hi)));
   field.append(workshopButton(dim+':dec','−',null,v[dim]<=1));
   field.append(el('output','workshop-numeric',String(v[dim])));
   field.append(workshopButton(dim+':inc','+',null,v[dim]>=12));
   control.append(field);
  }
  const result=evaluateWorkshop('rectangle',v);
  const out=el('p','workshop-readable',workshopLang(`Width ${v.width} and height ${v.height}. Area: ${result.metrics.area} square units. Perimeter: ${result.metrics.perimeter} units.`,`चौड़ाई ${v.width}, ऊँचाई ${v.height}। क्षेत्रफल: ${result.metrics.area} वर्ग इकाई। परिमाप: ${result.metrics.perimeter} इकाई।`));
  control.append(out);
 }else{
  for(const [group,label] of [['a','A'],['b','B']]){
   const field=el('div','workshop-group');field.append(el('strong','',workshopLang('Group ','समूह ')+label));
   field.append(workshopButton(group+':dec','−',null,v[group]<=0));
   field.append(el('output','workshop-numeric',String(v[group])));
   field.append(workshopButton(group+':inc','+',null,v[group]>=10));
   control.append(field);
  }
  const table=el('table','workshop-table');
  const caption=el('caption','',workshopLang('Accessible data table (items)','सुलभ आँकड़ा तालिका (वस्तुएँ)'));
  const head=el('tr');head.append(el('th','',workshopLang('Group','समूह')),el('th','',workshopLang('Count','संख्या')));
  const body=el('tbody');for(const group of ['a','b']){const row=el('tr');row.append(el('th','',group.toUpperCase()),el('td','',String(v[group])));body.append(row)}
  const thead=el('thead');thead.append(head);table.append(caption,thead,body);control.append(table);
  control.append(el('p','workshop-readable',workshopLang(`A minus B = ${v.a-v.b} items.`,`A घटा B = ${v.a-v.b} वस्तुएँ।`)));
 }
 $('math-workshop-check').textContent=workshopLang('Check my setup','मेरी स्थिति जाँचें');
 $('math-workshop-reset').textContent=workshopLang('Reset this activity','यह गतिविधि फिर शुरू करें');
 const feedback=$('math-workshop-feedback');
 feedback.hidden=!W.checked;
 if(W.checked){
  const result=evaluateWorkshop(W.mode,v);
  feedback.textContent=workshopLang(result.correct?'Goal reached. ':'Try adjusting the values again. ',result.correct?'लक्ष्य पूरा हुआ। ':'संख्याएँ बदलकर फिर कोशिश करें। ')+workshopPair(result.explanation);
 }
}
$('math-workshop').addEventListener('click',event=>{
 const b=event.target.closest('button[data-workshop-action]');if(!b)return;
 const action=b.dataset.workshopAction;
 if(action.startsWith('mode:')){
  W={...WORKSHOP_DEFAULTS(),mode:action.slice(5)};
  renderWorkshop();$('math-workshop-question').focus();
  return;
 }
 const [key,delta]=action.split(':');
 const limits=key==='line'?[-10,10]:['width','height'].includes(key)?[1,12]:[0,10];
 const name=key==='line'?'position':key;
 const old=W.values[name];
 W.values[name]=Math.min(limits[1],Math.max(limits[0],old+(delta==='inc'?1:-1)));
 W.checked=false;renderWorkshop();
 const peer=[...$('math-workshop').querySelectorAll('button[data-workshop-action]')].find(x=>x.dataset.workshopAction===action);
 if(peer&&!peer.disabled)peer.focus();
});
$('math-workshop-check').addEventListener('click',()=>{W.checked=true;renderWorkshop();$('math-workshop-feedback').focus()});
$('math-workshop-reset').addEventListener('click',()=>{W={...WORKSHOP_DEFAULTS(),mode:W.mode};renderWorkshop();$('math-workshop-question').focus()});
$('lang').addEventListener('change',renderWorkshop);
window.addEventListener('aifs-history-cleared',()=>{W=WORKSHOP_DEFAULTS();renderWorkshop()});
renderWorkshop();
