/** M33: original draft-only conceptual labs, all activity state is transient. */
import {ADVANCED_IDS,modelAdvanced,evaluateAdvanced,advancedResultRows} from './advanced-lab-engine.js';
const $=id=>document.getElementById(id);
const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
const lang=()=>$('lang').value==='hi'?'hi':'en';
const p=(en,hi)=>lang()==='hi'?hi:en;
const t=pair=>pair[lang()==='hi'?1:0];
let id=ADVANCED_IDS[0],state={...modelAdvanced(id).initial},feedback=null;
const button=(text,action,label,disabled=false,pressed=null)=>{
 const b=node('button',text);b.type='button';b.className='btn outline compact';b.dataset.advancedAction=action;
 b.disabled=disabled;if(label)b.setAttribute('aria-label',label);
 if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));return b
};
function visualize(metrics){
 const host=$('advanced-visual');host.replaceChildren();
 if(!['symmetry','coordinate','sound','probability','ratio-algebra','heredity'].includes(id))return;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 320 180');svg.setAttribute('aria-hidden','true');
 const shape=(tag,attrs)=>{const e=document.createElementNS(svg.namespaceURI,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));svg.append(e);return e};
 const line=(x1,y1,x2,y2,stroke='#adc1bb',w=1)=>shape('line',{x1,y1,x2,y2,stroke,'stroke-width':w});
 const dot=(x,y,fill)=>shape('circle',{cx:x,cy:y,r:5,fill});
 const txt=(x,y,text)=>{const e=shape('text',{x,y,fill:'#183c33','font-size':11});e.textContent=text};
 if(id==='coordinate'||id==='symmetry'){
  const sc=id==='coordinate'?7:10,cx=160,cy=90;
  for(let i=-8;i<=8;i++){line(cx+i*sc,10,cx+i*sc,170);line(10,cy+i*sc,310,cy+i*sc)}
  line(10,cy,310,cy,'#304f47',2);line(cx,10,cx,170,'#304f47',2);txt(300,cy-5,'x');txt(cx+5,14,'y');
  if(id==='coordinate'){line(cx-5*sc,cy+9*sc,cx+5*sc,cy-11*sc,'#26785d',2);dot(cx+metrics.x*sc,cy-metrics.y*sc,'#9b5620');txt(14,14,'y = 2x + 1')}
  else{dot(cx+state.x*sc,cy-state.y*sc,'#296cba');dot(cx+metrics.transformedX*sc,cy-metrics.transformedY*sc,'#9b5620');txt(14,14,'P → P′')}
 }else if(id==='sound'){
  line(10,90,310,90,'#304f47');const pts=[];
  for(let x=10;x<=310;x+=2)pts.push(x+','+(90-12*state.amplitude*Math.sin((x-10)/300*2*Math.PI*10/state.period)));
  shape('polyline',{points:pts.join(' '),fill:'none',stroke:'#26785d','stroke-width':2});
 }else if(id==='ratio-algebra'){
  for(let g=0;g<state.groups;g++)for(let j=0;j<state.each;j++)shape('circle',{cx:24+g*29,cy:14+j*15,r:5,fill:'#26785d'});
 }else if(id==='heredity'){
  for(let r=0;r<2;r++)for(let c=0;c<2;c++){shape('rect',{x:30+c*130,y:15+r*75,width:130,height:75,fill:'#e5f2ec',stroke:'#73968a'});txt(77+c*130,55+r*75,[state.one[r],state.two[c]].sort().join(''))}
 }else{
  const total=metrics.total;if(total){shape('rect',{x:20,y:40,width:280*state.red/total,height:32,fill:'#a63d42'});shape('rect',{x:20+280*state.red/total,y:40,width:280*state.blue/total,height:32,fill:'#346b9e'});txt(20,30,p('Model bag','मॉडल थैली'));if(metrics.sampleSize){shape('rect',{x:20,y:110,width:280*metrics.sampleProportion,height:32,fill:'#a63d42'});shape('rect',{x:20+280*metrics.sampleProportion,y:110,width:280*(1-metrics.sampleProportion),height:32,fill:'#346b9e'});txt(20,100,p('Simulated sample','कल्पित नमूना'))}}
 }
 host.append(svg)
}
function render(){
 const m=modelAdvanced(id),result=evaluateAdvanced(id,state,lang());
 $('advanced-nav').textContent=p('Explore Labs','प्रयोग खोजें');
 $('advanced-title').textContent=p('Explore Maths & Science Labs — 12 draft models','गणित और विज्ञान प्रयोग — 12 मसौदा मॉडल');
 $('advanced-intro').textContent=p('Offline computer-only concepts: Maths, Physics, Chemistry and Biology.','ऑफ़लाइन कंप्यूटर आधारित गणित, भौतिकी, रसायन और जीवविज्ञान अवधारणाएँ।');
 $('advanced-notice').textContent=p('UNREVIEWED original teaching drafts. Independent subject, Hindi and safety review pending. No grade mapping or real experiments.','असमीक्षित मूल शिक्षण मसौदे। विषय, हिंदी और सुरक्षा समीक्षा बाकी है। कक्षा मिलान या असली प्रयोग नहीं।');
 $('advanced-topic-label').textContent=p('Choose a concept','अवधारणा चुनें');
 const select=$('advanced-topic');select.replaceChildren();
 for(const key of ADVANCED_IDS){const o=node('option',t(modelAdvanced(key).title));o.value=key;select.append(o)}select.value=id;
 $('advanced-heading').textContent=t(m.title);$('advanced-prompt').textContent=t(m.prompt);$('advanced-hint').textContent=t(m.hint);$('advanced-caveat').textContent=t(m.caveat);
 $('advanced-result-caption').textContent=p('Calculated model values (not observations)','गणना किए गए मॉडल मान (वास्तविक अवलोकन नहीं)');
 $('advanced-field-label').textContent=p('Quantity','राशि');$('advanced-value-label').textContent=p('Value','मान');
 $('advanced-source').textContent=p('Original unreviewed draft: assets/advanced-lab-engine.js. No learner response stored.','मूल असमीक्षित मसौदा: assets/advanced-lab-engine.js। विद्यार्थी का उत्तर सहेजा नहीं जाता।');
 const controls=$('advanced-controls');controls.replaceChildren();
 for(const f of m.fields){
  const group=node('div');group.className='science-control-group';group.append(node('strong',t(f.label)));
  const row=node('div');row.className='science-number-control';row.setAttribute('role','group');row.setAttribute('aria-label',t(f.label));
  if(f.options){for(const o of f.options)row.append(button(t(o.label),'set:'+f.id+':'+o.value,null,false,state[f.id]===o.value))}
  else{
   const output=node('output',String(state[f.id])+(f.unit?' '+f.unit:''));output.id='advanced-output-'+f.id;output.className='science-number-value';output.setAttribute('aria-label',t(f.label));
   row.append(button('−','dec:'+f.id,p('Decrease ','घटाएँ ')+t(f.label),state[f.id]<=f.min),output,button('+','inc:'+f.id,p('Increase ','बढ़ाएँ ')+t(f.label),state[f.id]>=f.max))
  }
  group.append(row);controls.append(group)
 }
 const values=$('advanced-values');values.replaceChildren();
 for(const item of advancedResultRows(result.metrics,lang())){const row=node('tr'),head=node('th',item.label);head.scope='row';row.append(head,node('td',item.value));values.append(row)}
 visualize(result.metrics);
 $('advanced-check').textContent=p('Check example','उदाहरण जाँचें');$('advanced-reset').textContent=p('Reset model','मॉडल फिर शुरू करें');
 $('advanced-feedback').hidden=feedback===null;
 if(feedback!==null)$('advanced-feedback').textContent=(feedback?p('Matches the example. ','उदाहरण से मेल खाता है। '):p('Compare the chosen values with the hint. ','चुने मान संकेत से मिलाएँ। '))+result.explanation
}
$('advanced-controls').addEventListener('click',e=>{
 const b=e.target.closest('button[data-advanced-action]');if(!b)return;
 const action=b.dataset.advancedAction,[op,k,...rest]=action.split(':'),f=modelAdvanced(id).fields.find(x=>x.id===k);
 if(!f)return;
 if(op==='set'&&f.options?.some(x=>x.value===rest.join(':')))state[k]=rest.join(':');
 else if(!f.options&&['inc','dec'].includes(op))state[k]=Math.max(f.min,Math.min(f.max,state[k]+(op==='inc'?f.step:-f.step)));
 else return;
 feedback=null;render();
 const buttons=[...$('advanced-controls').querySelectorAll('button')];(buttons.find(x=>x.dataset.advancedAction===action&&!x.disabled)||buttons.find(x=>x.dataset.advancedAction.endsWith(':'+k)&&!x.disabled))?.focus()
});
function reset(){state={...modelAdvanced(id).initial};feedback=null;render()}
$('advanced-topic').addEventListener('change',e=>{id=e.target.value;reset();$('advanced-heading').focus()});
$('advanced-check').addEventListener('click',()=>{feedback=evaluateAdvanced(id,state,lang()).correct;render();$('advanced-feedback').focus()});
$('advanced-reset').addEventListener('click',()=>{reset();$('advanced-heading').focus()});
$('lang').addEventListener('change',render);
window.addEventListener('aifs-history-cleared',()=>{id=ADVANCED_IDS[0];reset()});
render();
