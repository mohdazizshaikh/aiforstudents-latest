import {VISUAL_IDS,visualDefinition,visualInitial,evaluateVisual} from './visual-lab-engine.js';
const $=id=>document.getElementById(id),root=$('visual-lab');
let lang='en',id=VISUAL_IDS[0],values=visualInitial(id);
const p=(en,hi)=>lang==='hi'?hi:en;
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
const ns='http://www.w3.org/2000/svg';
function svgEl(tag,attrs){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n}
function draw(v){
 const svg=svgEl('svg',{viewBox:'0 0 320 240',class:'visual-lab-diagram','aria-hidden':'true'});
 const add=(tag,attrs)=>{const n=svgEl(tag,attrs);svg.append(n);return n};
 const text=(x,y,t)=>{const n=add('text',{x,y,'text-anchor':'middle',fill:'#19343b','font-size':13});n.textContent=t};
 const line=(x1,y1,x2,y2,stroke='#829a98')=>add('line',{x1,y1,x2,y2,stroke,'stroke-width':1.5});
 if(v.kind==='matrix'){
  const X=x=>160+x*20,Y=y=>120-y*20;
  for(let n=-6;n<=6;n++){line(X(n),0,X(n),240,'#e1eae6');line(40,Y(n),280,Y(n),'#e1eae6')}line(20,120,300,120);line(160,8,160,232);
  for(const [pts,stroke,fill] of [[v.base,'#4970a5','#d9e5fa'],[v.points,'#087f75','#c9ede3']]){
   add('polygon',{points:pts.map(([x,y])=>X(x)+','+Y(y)).join(' '),stroke,fill,'fill-opacity':0.55,'stroke-width':2});
   for(const [x,y] of pts)add('circle',{cx:X(x),cy:Y(y),r:3,fill:stroke});
  }
  text(294,115,'x');text(169,15,'y');
 }else if(v.kind==='velocity'){
  const X=t=>35+t*62,Y=u=>120-u*9;
  for(let n=-10;n<=10;n+=2)line(35,Y(n),290,Y(n),'#e1eae6');line(35,10,35,230);line(35,120,290,120);
  const pts=v.points.map(([t,u])=>X(t)+','+Y(u));
  add('polygon',{points:[X(0)+',120',...pts,X(v.points.at(-1)[0])+',120'].join(' '),fill:'#c9ede3','fill-opacity':0.8});
  add('polyline',{points:pts.join(' '),fill:'none',stroke:'#087f75','stroke-width':3});
  for(const [t,u] of v.points){add('circle',{cx:X(t),cy:Y(u),r:3,fill:'#19343b'});text(X(t),135,String(t))}
  text(19,15,'v');text(303,136,'t');
 }else if(v.kind==='particles'){
  v.cells.forEach((token,i)=>{const x=85+(i%4)*50,y=45+Math.floor(i/4)*50;add('circle',{cx:x,cy:y,r:19,fill:token==='A'?'#c9ede3':'#f6dbac',stroke:'#19343b'});text(x,y+5,token)});
 }else{
  const s=v.stage,cell=(x,y,rx,ry)=>add('ellipse',{cx:x,cy:y,rx,ry,fill:'#eff5f3',stroke:'#497c75','stroke-width':2});
  const chrom=(x,y,rep)=>{line(x-5,y-10,x+5,y+10,'#355c97');if(rep)line(x+5,y-10,x-5,y+10,'#355c97')};
  if(s===4){cell(88,120,65,70);cell(232,120,65,70);for(const x of [75,101,219,245])chrom(x,120,false)}
  else{cell(160,120,140,92);if(s===0){chrom(120,92,true);chrom(196,145,true)}else if(s===1){line(160,40,160,200);chrom(160,86,true);chrom(160,154,true)}else{if(s===3){cell(85,120,48,53);cell(235,120,48,53)}for(const x of [72,98,222,248])chrom(x,120,false)}}
 }
 $('visual-diagram').replaceChildren(svg);
}
function output(){const r=evaluateVisual(id,values,lang);draw(r.visual);$('visual-results').replaceChildren(...r.rows.map(x=>el('li',x.label+': '+x.value)))}
function render(){
 root.lang=lang;$('visual-title').textContent=p('Interactive visual lab (draft)','इंटरैक्टिव दृश्य प्रयोगशाला (मसौदा)');$('visual-notice').textContent=p('Unreviewed educational diagrams, not validated grade content. No results are stored.','असमीक्षित शैक्षिक चित्र, सत्यापित कक्षा सामग्री नहीं। परिणाम सहेजे नहीं जाते।');
 $('visual-lang-label').textContent=p('Language','भाषा');$('visual-model-label').textContent=p('Model','मॉडल');
 $('visual-model').replaceChildren(...VISUAL_IDS.map(k=>{const o=el('option',visualDefinition(k,lang).title);o.value=k;return o}));$('visual-model').value=id;$('visual-lang').value=lang;
 const d=visualDefinition(id,lang);$('visual-note').textContent=d.note;
 $('visual-controls').replaceChildren(...d.fields.map(f=>{const w=el('div'),l=el('label',f.label),s=el('select');s.id='visual-field-'+f.id;l.htmlFor=s.id;for(const x of f.options){const o=el('option',String(x));o.value=String(x);s.append(o)}s.value=String(values[f.id]);s.addEventListener('change',()=>{values={...values,[f.id]:Number(s.value)};output()});w.append(l,s);return w}));
 $('visual-reset').textContent=p('Reset diagram','चित्र रीसेट करें');$('visual-results-title').textContent=p('Text description','पाठ विवरण');output();
}
$('visual-model').addEventListener('change',()=>{id=$('visual-model').value;values=visualInitial(id);render()});
$('visual-lang').addEventListener('change',()=>{lang=$('visual-lang').value;render()});
$('visual-reset').addEventListener('click',()=>{values=visualInitial(id);render()});
function clear(){id=VISUAL_IDS[0];values=visualInitial(id);render()}
window.addEventListener('aifs-history-cleared',clear);window.addEventListener('pageshow',e=>{if(e.persisted)clear()});
try{const c=new BroadcastChannel('aifs-discovery-privacy-reset-v1');c.addEventListener('message',e=>{if(e.data?.type==='clear-history')clear()})}catch{}
window.addEventListener('storage',e=>{if(e.key==='aifs-privacy-clear-signal-v1'&&e.newValue==='clear')clear()});
const q=new URLSearchParams(location.search);if([...q.keys()].length===2&&q.getAll('model').length===1&&q.getAll('lang').length===1&&VISUAL_IDS.includes(q.get('model'))&&['en','hi'].includes(q.get('lang'))){id=q.get('model');lang=q.get('lang');values=visualInitial(id)}
render();
