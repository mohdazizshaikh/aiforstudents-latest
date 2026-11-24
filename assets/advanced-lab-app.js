/** M33: original draft-only conceptual labs, all activity state is transient. */
import {ADVANCED_IDS,modelAdvanced,evaluateAdvanced,advancedResultRows,advancedExampleFeedback,advancedVariableComparison} from './advanced-lab-engine.js';
const $=id=>document.getElementById(id);
const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
const lang=()=>$('lang').value==='hi'?'hi':'en';
const p=(en,hi)=>lang()==='hi'?hi:en;
const t=pair=>pair[lang()==='hi'?1:0];
const selected=new URLSearchParams(location.search).get('advanced');
let id=ADVANCED_IDS.includes(selected)?selected:ADVANCED_IDS[0],state={...modelAdvanced(id).initial},feedback=null,comparisonOpen=false,variableBaseline=null;
const button=(text,action,label,disabled=false,pressed=null)=>{
 const b=node('button',text);b.type='button';b.className='btn outline compact';b.dataset.advancedAction=action;
 b.disabled=disabled;if(label)b.setAttribute('aria-label',label);
 if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));return b
};
function visualize(metrics){
 const host=$('advanced-visual');host.replaceChildren();
 
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
 }else if(id==='integral-area'){
  const cx=32,cy=145,x=cx+state.bound*48,y=cy-metrics.endpointY*6;line(cx,cy,300,cy,'#304f47',2);line(cx,cy,cx,10,'#304f47',2);shape('polygon',{points:cx+','+cy+' '+x+','+cy+' '+x+','+y,fill:'#d8eee3',stroke:'#39826b'});line(cx,cy,x,y,'#39826b',3);txt(x-10,160,String(state.bound));txt(40,20,'y = '+state.slope+'x');txt(40,38,p('Area ','क्षेत्रफल ')+metrics.integralArea);
 }else if(id==='vector-components'){
  const cx=160,cy=85,x=cx+state.x*24,y=cy-state.y*13;line(12,cy,308,cy,'#304f47',2);line(cx,8,cx,162,'#304f47',2);line(cx,cy,x,cy,'#346b9e',2);line(x,cy,x,y,'#346b9e',2);line(cx,cy,x,y,'#ad7525',3);dot(x,y,'#ad7525');txt(8,16,p('Magnitude ','परिमाण ')+Number(metrics.vectorMagnitude.toFixed(2)));
 }else if(id==='magnetic-flux'){
  const parallel=state.orientation==='parallel';for(let i=0;i<state.field;i++){const y=44+i*21;line(18,y,298,y,'#346b9e',2);shape('polygon',{points:'298,'+y+' 289,'+(y-4)+' 289,'+(y+4),fill:'#346b9e'})}
  if(parallel)shape('rect',{x:150,y:25,width:20,height:120,fill:'#39826b','fill-opacity':0.5,stroke:'#304f47'});else shape('rect',{x:87,y:83,width:146,height:16,fill:'#39826b','fill-opacity':0.5,stroke:'#304f47'});txt(8,165,p('Symbolic flux ','प्रतीकात्मक फ्लक्स ')+metrics.fluxUnits);
 }else if(id==='capacitor-charge'){
  shape('rect',{x:100,y:35,width:12,height:100,fill:'#39826b'});shape('rect',{x:208,y:35,width:12,height:100,fill:'#346b9e'});for(let i=0;i<state.volt;i++){txt(83,50+i*18,'+');txt(230,50+i*18,'−')}txt(20,155,'Q = '+state.cap+' × '+state.volt+' = '+metrics.chargeUnits);
 }else if(id==='alkane-count'){
  for(let i=0;i<state.carbon;i++){const x=35+i*48;dot(x,55,'#39826b');txt(x-4,77,'C')}for(let i=0;i<metrics.hydrogenCount;i++){const x=15+(i%7)*44,y=100+Math.floor(i/7)*30;dot(x,y,'#346b9e');txt(x+7,y+4,'H')}txt(12,20,metrics.alkaneFormula);
 }else if(id==='bond-pair-count'){
  shape('circle',{cx:85,cy:80,r:28,fill:'#d8eee3',stroke:'#39826b'});shape('circle',{cx:235,cy:80,r:28,fill:'#d8eee3',stroke:'#39826b'});for(let i=0;i<state.pairs;i++){const y=80+(i-(state.pairs-1)/2)*18;line(113,y,207,y,'#346b9e',3);dot(151,y,'#ad7525');dot(169,y,'#ad7525')}txt(10,155,p('Shared electrons ','साझा इलेक्ट्रॉन ')+metrics.sharedElectrons);
 }else if(id==='dna-complement'){
  shape('rect',{x:35,y:48,width:105,height:65,rx:8,fill:'#d8eee3',stroke:'#39826b'});shape('rect',{x:180,y:48,width:105,height:65,rx:8,fill:'#b6d5ef',stroke:'#346b9e'});line(140,81,180,81,'#304f47',3);txt(84,84,metrics.dnaBase);txt(229,84,metrics.complementBase);txt(12,150,p('Symbolic pair','प्रतीकात्मक युग्म'));
 }else if(id==='gas-exchange'){
  shape('rect',{x:15,y:40,width:125,height:100,rx:10,fill:'#d8eee3'});shape('rect',{x:180,y:40,width:125,height:100,rx:10,fill:'#b6d5ef'});txt(22,65,p('Alveolar air','वायुकोष की हवा'));txt(192,65,p('Blood','रक्त'));const a=state.gas==='o2'?80:240,b=state.gas==='o2'?240:80,dir=Math.sign(b-a);line(a,100,b,100,'#ad7525',4);shape('polygon',{points:b+',100 '+(b-dir*12)+',94 '+(b-dir*12)+',106',fill:'#ad7525'});txt(125,28,state.gas==='o2'?'O₂':'CO₂');
 }else if(id==='triangle-area'){
  const w=state.base*30,h=state.height*19;shape('polygon',{points:'35,145 '+(35+w)+',145 35,'+(145-h),fill:'#d8eee3',stroke:'#39826b','stroke-width':2});txt(35,162,p('Base ','आधार ')+state.base);txt(38,24,p('Height ','ऊँचाई ')+state.height);
 }else if(id==='right-triangle-ratio'){
  const scale=100/Math.max(metrics.opposite,metrics.adjacent),w=metrics.adjacent*scale,h=metrics.opposite*scale;shape('polygon',{points:'45,140 '+(45+w)+',140 '+(45+w)+','+(140-h),fill:'#d8eee3',stroke:'#39826b','stroke-width':2});txt(45,155,String(metrics.adjacent));txt(51+w,130-h/2,String(metrics.opposite));txt(55,40,p('Hypotenuse ','कर्ण ')+metrics.hypotenuse);txt(58,133,'θ');
 }else if(id==='position-change'){
  line(30,90,286,90,'#304f47',2);for(let i=0;i<=8;i++){line(30+i*32,85,30+i*32,95,'#304f47');txt(25+i*32,112,String(i))}dot(30+state.start*32,70,'#346b9e');dot(30+state.end*32,55,'#ad7525');txt(15,25,p('Start / end','आरंभ / अंत'));
 }else if(id==='path-distance'){
  line(20,135,300,135,'#304f47',2);const origin=150,x=origin+state.out*22,y=x-state.back*22;line(origin,50,x,50,'#39826b',4);dot(x,50,'#39826b');line(x,95,y,95,'#346b9e',4);dot(y,95,'#346b9e');txt(15,30,p('Outward ','आगे ')+state.out);txt(15,78,p('Return ','वापसी ')+state.back);txt(15,162,p('Total ','कुल ')+metrics.pathLength);
 }else if(id==='material-property'){
  shape('rect',{x:125,y:30,width:65,height:105,fill:state.example==='glass'?'#d6edf8':'#b78a58',stroke:'#304f47'});line(20,80,state.example==='glass'?295:125,80,'#ad7525',3);txt(15,158,t(modelAdvanced(id).fields[0].options.find(o=>o.value===state.example).label));
 }else if(id==='dynamic-balance'){
  const a=state.forward*38,b=state.reverse*38;shape('rect',{x:30,y:45,width:a,height:24,fill:'#39826b'});shape('rect',{x:30,y:105,width:b,height:24,fill:'#346b9e'});txt(30,34,p('Forward ','अग्र ')+state.forward);txt(30,94,p('Reverse ','पश्च ')+state.reverse);txt(30,155,p('Net ','कुल ')+metrics.netRate);
 }else if(id==='habitat-match'){
  shape('rect',{x:15,y:40,width:290,height:100,rx:8,fill:state.animal==='fish'?'#b6d5ef':'#e6cf9b'});if(state.animal==='fish'){shape('ellipse',{cx:150,cy:90,rx:45,ry:20,fill:'#346b9e'});shape('polygon',{points:'195,90 220,70 220,110',fill:'#346b9e'});dot(125,85,'#304f47')}else{shape('ellipse',{cx:155,cy:88,rx:48,ry:25,fill:'#ad7525'});shape('ellipse',{cx:153,cy:63,rx:23,ry:24,fill:'#ad7525'});line(114,105,108,132,'#ad7525',6);line(185,105,185,132,'#ad7525',6);line(115,84,85,59,'#ad7525',7);dot(80,57,'#ad7525')}txt(15,160,t(modelAdvanced(id).fields[0].options.find(o=>o.value===state.animal).label));
 }else if(id==='food-web-links'){
  const nodes={grass:[30,80,p('Grass','घास')],rabbit:[155,30,p('Rabbit','खरगोश')],insect:[155,125,p('Grasshopper','टिड्डा')],frog:[268,125,p('Frog','मेंढक')]};for(const [key,a,b] of [['grass-rabbit','grass','rabbit'],['grass-insect','grass','insect'],['insect-frog','insect','frog']]){const [x,y]=nodes[a],[xx,yy]=nodes[b];line(x,y,xx,yy,key===state.link?'#ad7525':'#9fb5ac',key===state.link?4:1)}for(const [x,y,label] of Object.values(nodes)){dot(x,y,'#39826b');txt(Math.max(3,x-25),y+21,label)}txt(10,165,p('Highlighted food → consumer','चुना खाद्य → उपभोक्ता'));
 }else if(id==='arithmetic-sequence'){
  for(let i=0;i<state.n;i++){const v=state.first+i*state.diff,h=v/30*110,x=22+i*48;shape('rect',{x,y:140-h,width:32,height:h,fill:i===state.n-1?'#ad7525':'#39826b'});txt(x,135-h,String(v));txt(x,157,String(i+1))}
 }else if(id==='square-slope'){
  const cx=125,cy=150,sx=32,sy=7,points=[];line(10,cy,310,cy,'#304f47',2);line(cx,8,cx,160,'#304f47',2);
  for(let x=-3;x<=4;x+=0.1)points.push((cx+x*sx)+','+(cy-x*x*sy));shape('polyline',{points:points.join(' '),stroke:'#26785d','stroke-width':2,fill:'none'});
  const a=state.x,b=a+metrics.h;dot(cx+a*sx,cy-a*a*sy,'#ad7525');dot(cx+b*sx,cy-b*b*sy,'#346b9e');line(cx+a*sx,cy-a*a*sy,cx+b*sx,cy-b*b*sy,'#346b9e',3);
  const l=a-0.4,r=a+0.4;line(cx+l*sx,cy-(a*a+metrics.tangentSlope*(l-a))*sy,cx+r*sx,cy-(a*a+metrics.tangentSlope*(r-a))*sy,'#ad7525',3);txt(12,18,'y = x²');
 }else if(id==='constant-acceleration'){
  const x=26,y=140;line(x,y,300,y,'#304f47',2);line(x,y,x,20,'#304f47',2);
  line(x,y,x+state.seconds*48,y-metrics.finalSpeed*4,'#39826b',3);dot(x+state.seconds*48,y-metrics.finalSpeed*4,'#ad7525');txt(12,15,p('Speed vs time','चाल बनाम समय'));txt(240,158,'t (s)');
 }else if(id==='thin-lens'){
  line(15,90,305,90,'#304f47');shape('ellipse',{cx:160,cy:90,rx:12,ry:65,fill:'#b6d5ef',stroke:'#346b9e'});
  const u=metrics.objectCm,v=metrics.imageCm,scale=120/Math.max(u,v),ox=160-u*scale,ix=160+v*scale;
  line(ox,90,ox,35,'#39826b',4);line(ox,35,ix,90+55*metrics.magnitude,'#ad7525',1);line(ix,90,ix,90+55*metrics.magnitude,'#346b9e',4);
  txt(10,170,p('Ideal distances; diagram not to scale','आदर्श दूरियाँ; चित्र पैमाने पर नहीं'));
 }else if(id==='ion-charge'){
  for(const [v,y,label,fill] of [[state.protons,48,'p⁺','#ad7525'],[state.electrons,115,'e⁻','#346b9e']]){txt(10,y+5,label);for(let i=0;i<v;i++)dot(45+i*22,y,fill)}
 }else if(id==='mass-fraction'){
  const w=260*state.a/(state.a+state.b);shape('rect',{x:30,y:55,width:w,height:55,fill:'#39826b'});shape('rect',{x:30+w,y:55,width:260-w,height:55,fill:'#b6d5ef'});txt(30,40,'A: '+state.a+' · B: '+state.b);txt(30,140,Number(metrics.massPercent.toFixed(2))+'% A');
 }else if(id==='cell-doubling'){
  for(let i=0;i<metrics.finalCells;i++)shape('circle',{cx:30+(i%8)*35,cy:35+Math.floor(i/8)*47,r:12,fill:'#d8eee3',stroke:'#39826b'});
 }else if(id==='plant-process'){
  const rows=advancedResultRows(metrics,lang());for(let i=0;i<2;i++){shape('rect',{x:12,y:15+i*76,width:296,height:58,rx:6,fill:i?'#d8eee3':'#b6d5ef'});txt(20,32+i*76,rows[i].label);const words=rows[i].value.split(' ');let lineText='',dy=0;for(const word of words){if((lineText+' '+word).length>38&&lineText){txt(20,48+i*76+dy,lineText);dy+=14;lineText=''}lineText+=(lineText?' ':'')+word}if(lineText)txt(20,48+i*76+dy,lineText)}
 }else if(id==='counting'){
  txt(15,25,'A');txt(15,95,'B');
  for(const [value,y,fill] of [[state.a,50,'#26785d'],[state.b,120,'#346b9e']])for(let i=0;i<value;i++)dot(35+i*29,y,fill);
 }else if(id==='place-value'){
  txt(15,18,p('Tens','दहाई'));txt(15,116,p('Ones','इकाई'));
  for(let i=0;i<state.tens;i++)for(let j=0;j<10;j++)shape('rect',{x:18+i*29,y:25+j*7,width:23,height:6,fill:'#26785d'});
  for(let i=0;i<state.ones;i++)shape('rect',{x:18+i*29,y:125,width:23,height:12,fill:'#346b9e'});
 }else if(id==='length-compare'){
  for(const [v,y,label] of [[state.a,40,'A'],[state.b,105,'B']]){txt(15,y-9,label+' · '+v+' cm');shape('rect',{x:15,y,width:v*27,height:25,fill:'#39826b'});}line(15,25,15,145,'#304f47',2);
 }else if(id==='shadow-ray'){
  dot(25,85,'#ad7525');line(25,85,state.blocker==='opaque'?145:290,85,'#ad7525',3);
  if(state.blocker==='opaque'){shape('rect',{x:145,y:45,width:20,height:80,fill:'#304f47'});shape('rect',{x:275,y:60,width:15,height:50,fill:'#304f47'})}
  line(290,25,290,145,'#73968a',2);txt(12,165,p('Symbolic light path','प्रतीकात्मक प्रकाश मार्ग'));
 }else if(id==='material-state'){
  shape('rect',{x:55,y:30,width:210,height:115,rx:5,fill:'#f3f8f6',stroke:'#73968a'});
  if(state.example==='ice')shape('rect',{x:125,y:65,width:70,height:65,fill:'#b6d5ef',stroke:'#346b9e'});
  else shape('rect',{x:58,y:85,width:204,height:57,fill:'#b6d5ef'});
  txt(65,160,state.example==='ice'?p('Solid ice','ठोस बर्फ'):p('Liquid water','द्रव जल'));
 }else if(id==='material-objects'){
  if(state.object==='glass')shape('circle',{cx:160,cy:85,r:42,fill:'#b6d5ef',stroke:'#346b9e'});
  else shape('rect',{x:85,y:45,width:150,height:state.object==='wood'?85:12,fill:state.object==='wood'?'#b78a58':'#e6f2ea',stroke:'#73968a'});
  txt(15,160,t(modelAdvanced(id).fields[0].options.find(o=>o.value===state.object).label));
 }else if(id==='plant-parts'){
  line(160,95,160,30,state.part==='stem'?'#ad7525':'#26785d',8);shape('ellipse',{cx:125,cy:48,rx:36,ry:16,fill:state.part==='leaf'?'#ad7525':'#39826b'});
  shape('ellipse',{cx:195,cy:60,rx:36,ry:16,fill:state.part==='leaf'?'#ad7525':'#39826b'});
  for(const x of [110,135,160,185,210])line(160,95,x,150,state.part==='root'?'#ad7525':'#805731',4);
  txt(15,170,t(modelAdvanced(id).fields[0].options.find(o=>o.value===state.part).label));
 }else if(id==='living-examples'){
  if(state.example==='stone')shape('polygon',{points:'90,120 115,55 195,45 230,95 200,130',fill:'#81958e',stroke:'#304f47'});
  else{line(160,145,160,35,'#26785d',8);shape('ellipse',{cx:125,cy:65,rx:36,ry:18,fill:'#39826b'});shape('ellipse',{cx:195,cy:90,rx:36,ry:18,fill:'#39826b'})}
  txt(15,165,t(modelAdvanced(id).fields[0].options.find(o=>o.value===state.example).label));
 }else if(id==='quadratic'){
  const cx=160,cy=153,sx=23,sy=5;
  line(18,cy,302,cy,'#304f47',2);line(cx,12,cx,165,'#304f47',2);
  const pts=[];for(let x=-5;x<=5;x+=0.1)pts.push((cx+x*sx)+','+(cy-x*x*sy));
  shape('polyline',{points:pts.join(' '),fill:'none',stroke:'#26785d','stroke-width':2});
  dot(cx+metrics.x*sx,cy-metrics.y*sy,'#9b5620');dot(cx+metrics.oppositeX*sx,cy-metrics.oppositeSquare*sy,'#296cba');txt(18,18,'y = x²');txt(300,cy-5,'x');
 }else if(id==='force-motion'){
  shape('rect',{x:24,y:62,width:55+state.mass*12,height:50,rx:5,fill:'#b8dfc8',stroke:'#26785d'});
  txt(35,92,state.mass+' kg');
  if(metrics.forceN>0){const end=152+metrics.forceN*5;line(152,87,end,87,'#9b5620',3);shape('polygon',{points:end+',87 '+(end-10)+',81 '+(end-10)+',93',fill:'#9b5620'})}
  txt(152,62,metrics.forceN+' N');txt(24,145,p('Ideal net force','आदर्श परिणामी बल'));
 }else if(id==='atom-count'){
  for(let i=0;i<state.molecules;i++){const x=35+(i%3)*105,y=42+Math.floor(i/3)*80;shape('circle',{cx:x+24,cy:y,r:15,fill:'#af4d52'});shape('circle',{cx:x+8,cy:y+20,r:10,fill:'#b6d5ef'});shape('circle',{cx:x+40,cy:y+20,r:10,fill:'#b6d5ef'});txt(x+20,y+4,'O');txt(x+4,y+24,'H');txt(x+36,y+24,'H')}
 }else if(id==='cell-scale'){
  const w=metrics.diagramMm/10*240;
  shape('rect',{x:30,y:45,width:w,height:70,rx:12,fill:'#d8eee3',stroke:'#477d66','stroke-width':2});
  line(30,130,30+w,130,'#304f47',2);txt(30,150,metrics.diagramMm+' mm');
  txt(30,24,p('Drawing scale','चित्र पैमाना'));
 }else if(id==='sound'){
  line(10,90,310,90,'#304f47');const pts=[];
  for(let x=10;x<=310;x+=2)pts.push(x+','+(90-12*state.amplitude*Math.sin((x-10)/300*2*Math.PI*10/state.period)));
  shape('polyline',{points:pts.join(' '),fill:'none',stroke:'#26785d','stroke-width':2});
 }else if(id==='ratio-algebra'){
  for(let g=0;g<state.groups;g++)for(let j=0;j<state.each;j++)shape('circle',{cx:24+g*29,cy:14+j*15,r:5,fill:'#26785d'});
 }else if(id==='heredity'){
  for(let r=0;r<2;r++)for(let c=0;c<2;c++){shape('rect',{x:30+c*130,y:15+r*75,width:130,height:75,fill:'#e5f2ec',stroke:'#73968a'});txt(77+c*130,55+r*75,[state.one[r],state.two[c]].sort().join(''))}
 }else if(id==='probability'){
  const total=metrics.total;if(total){shape('rect',{x:20,y:40,width:280*state.red/total,height:32,fill:'#a63d42'});shape('rect',{x:20+280*state.red/total,y:40,width:280*state.blue/total,height:32,fill:'#346b9e'});txt(20,30,p('Model bag','मॉडल थैली'));if(metrics.sampleSize){shape('rect',{x:20,y:110,width:280*metrics.sampleProportion,height:32,fill:'#a63d42'});shape('rect',{x:20+280*metrics.sampleProportion,y:110,width:280*(1-metrics.sampleProportion),height:32,fill:'#346b9e'});txt(20,100,p('Simulated sample','कल्पित नमूना'))}}
 }else if(id==='periodic'){
  const groups=[1,2,13,14,15,16,17,18];
  const symbols='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca'.split(' ');
  const positions=[[1,0],[1,7],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[4,0],[4,1]];
  groups.forEach((g,i)=>txt(24+i*35,16,String(g)));
  positions.forEach(([r,c],i)=>{
   const x=14+c*36,y=22+(r-1)*36;
   shape('rect',{x,y,width:33,height:33,fill:i+1===state.atomic?'#b8dfc8':'#f3f8f6',stroke:i+1===state.atomic?'#165c44':'#91aca0','stroke-width':i+1===state.atomic?2:1});
   txt(x+3,y+11,String(i+1));txt(x+7,y+25,symbols[i])
  });
 }else if(id==='measurement'||id==='mass-balance'||id==='temperature'){
  let a,b,la,lb;
  if(id==='measurement'){a=metrics.speedA;b=metrics.speedB;la=p('Speed A (m/s)','चाल A (m/s)');lb=p('Speed B (m/s)','चाल B (m/s)')}
  else if(id==='mass-balance'){a=metrics.totalG;b=metrics.productTotalG;la=p('Inputs (g)','अभिकारक (g)');lb=p('Proposed outputs (g)','प्रस्तावित उत्पाद (g)')}
  else{a=metrics.idealDeltaC;b=0;la=p('Ideal temperature change (°C)','आदर्श तापमान परिवर्तन (°C)');lb=p('Baseline change (°C)','आधार परिवर्तन (°C)')}
  const max=Math.max(a,b,1);
  [[a,la,40],[b,lb,110]].forEach(([v,l,y])=>{txt(15,y-8,l);shape('rect',{x:15,y,width:260*v/max,height:24,fill:'#39826b'});txt(18,y+39,String(Number(v.toFixed(3))))})
 }else if(id==='magnetism'){
  const block=(x,pol)=>{shape('rect',{x,y:60,width:70,height:50,rx:5,fill:pol==='N'?'#b04b48':'#426eac'});const t=shape('text',{x:x+29,y:91,fill:'#fff','font-size':16});t.textContent=pol};
  block(32,state.a);block(218,state.b);txt(110,140,metrics.interaction==='attract'?p('Attraction','आकर्षण'):p('Repulsion','प्रतिकर्षण'));
  const direction=metrics.interaction==='attract';txt(114,88,direction?'→':'←');txt(185,88,direction?'←':'→')
 }else if(id==='ecosystem'){
  const pts=[[30,20],[145,20],[260,20],[145,120],[260,120]],labels=[p('Grass','घास'),p('Grasshopper','टिड्डा'),p('Frog','मेंढक'),p('Mouse','चूहा'),p('Snake','साँप')];
  const edge=(a,b)=>{const [x1,y1]=pts[a],[x2,y2]=pts[b],dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ex=x2-dx*22/len,ey=y2-dy*22/len;line(x1+dx*22/len,y1+dy*22/len,ex,ey,'#477d66',2);shape('polygon',{points:ex+','+ey+' '+(ex-dx*9/len+dy*4/len)+','+(ey-dy*9/len-dx*4/len)+' '+(ex-dx*9/len-dy*4/len)+','+(ey-dy*9/len+dx*4/len),fill:'#477d66'})};
  [[0,1],[1,2],[0,3],[3,4],[2,4]].forEach(([a,b])=>edge(a,b));
  pts.forEach(([x,y],i)=>{shape('circle',{cx:x,cy:y,r:18,fill:'#d8eee3',stroke:'#4c806c'});txt(Math.max(2,x-22),y+34,labels[i])})
 }
 host.append(svg)
}
function renderVariableComparison(){
 const mark=$('advanced-variable-mark'),clear=$('advanced-variable-clear'),panel=$('advanced-variable-panel');
 $('advanced-variable-heading').textContent=p('Explore one changed control','एक बदले नियंत्रण को खोजें');
 $('advanced-variable-notice').textContent=p('Optional: mark this model state, then change one control. Only the current tab remembers the starting state. No learner score or real experiment.','वैकल्पिक: इस मॉडल स्थिति को चुनें, फिर एक नियंत्रण बदलें। आरंभिक स्थिति केवल इस टैब में रहती है। कोई विद्यार्थी अंक या वास्तविक प्रयोग नहीं।');
 mark.textContent=variableBaseline?p('Mark a new starting state','नई आरंभिक स्थिति चुनें'):p('Mark current starting state','वर्तमान आरंभिक स्थिति चुनें');
 clear.textContent=p('Clear starting state','आरंभिक स्थिति मिटाएँ');clear.disabled=variableBaseline===null;
 panel.hidden=variableBaseline===null;
 const controls=$('advanced-variable-changes'),values=$('advanced-variable-values');controls.replaceChildren();values.replaceChildren();
 $('advanced-variable-table').hidden=true;$('advanced-variable-status').textContent='';
 $('advanced-variable-quantity').textContent=p('Calculated quantity','गणना की गई राशि');
 $('advanced-variable-before').textContent=p('Starting value','आरंभिक मान');
 $('advanced-variable-after').textContent=p('Current value','वर्तमान मान');
 if(!variableBaseline)return;
 const r=advancedVariableComparison(id,variableBaseline,state,lang());
 $('advanced-variable-status').textContent=r.guidance;
 for(const f of r.changedControls)controls.append(node('li',f.label+': '+f.before+' → '+f.after));
 $('advanced-variable-table').hidden=r.comparisons.length===0;
 for(const item of r.comparisons){const row=node('tr'),head=node('th',item.label);head.scope='row';row.append(head,node('td',item.before),node('td',item.after));values.append(row)}
}
function render(){
 const m=modelAdvanced(id),result=evaluateAdvanced(id,state,lang());
 $('advanced-nav').textContent=p('Explore Labs','प्रयोग खोजें');
 $('advanced-title').textContent=p('Explore Maths & Science Labs — 48 draft models','गणित और विज्ञान प्रयोग — 48 मसौदा मॉडल');
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
 visualize(result.metrics);renderVariableComparison();
 $('advanced-check').textContent=p('Check example','उदाहरण जाँचें');$('advanced-reset').textContent=p('Reset model','मॉडल फिर शुरू करें');
 $('advanced-feedback').hidden=feedback===null;
 if(feedback!==null)$('advanced-feedback').textContent=(feedback?p('Matches the example. ','उदाहरण से मेल खाता है। '):p('Compare the chosen values with the hint. ','चुने मान संकेत से मिलाएँ। '))+result.explanation
 const compareButton=$('advanced-compare-toggle'),panel=$('advanced-compare-panel');
 compareButton.hidden=feedback===null;
 compareButton.textContent=comparisonOpen?p('Hide example comparison','उदाहरण तुलना छिपाएँ'):p('Show optional control comparison','वैकल्पिक नियंत्रण तुलना दिखाएँ');
 compareButton.setAttribute('aria-expanded',String(feedback!==null&&comparisonOpen));
 panel.hidden=feedback===null||!comparisonOpen;
 $('advanced-compare-heading').textContent=p('Compare with this example (not a score)','इस उदाहरण से तुलना (अंक नहीं)');
 $('advanced-compare-notice').textContent=p('Other allowed control values are valid explorations. This checks one authored example, not learning ability or mastery.','दूसरे अनुमत नियंत्रण मान भी सही खोज विकल्प हैं। यह केवल एक लिखित उदाहरण की जाँच है, सीखने की क्षमता या दक्षता की नहीं।');
 const list=$('advanced-compare-fields');list.replaceChildren();
 $('advanced-compare-next').textContent='';
 if(feedback!==null&&comparisonOpen){
  const comparison=advancedExampleFeedback(id,state,lang());
  for(const f of comparison.fields){
   const status=f.kind==='explore'?p('Free exploration; not part of example check','स्वतंत्र खोज; उदाहरण जाँच का भाग नहीं'):f.kind==='matches'?p('Matches example','उदाहरण से मेल'):p('Compare with example','उदाहरण से मिलाएँ');
   list.append(node('li',f.label+': '+p('Current ','वर्तमान ')+f.current+(f.example===null?'':p(' · Example ',' · उदाहरण ')+f.example)+' · '+status));
  }
  const focusField=comparison.fields.find(f=>f.id===comparison.next.fieldId);
  $('advanced-compare-next').textContent=(focusField?focusField.label+' — ':'')+comparison.next.reason;
 }
}
$('advanced-controls').addEventListener('click',e=>{
 const b=e.target.closest('button[data-advanced-action]');if(!b)return;
 const action=b.dataset.advancedAction,[op,k,...rest]=action.split(':'),f=modelAdvanced(id).fields.find(x=>x.id===k);
 if(!f)return;
 if(op==='set'&&f.options?.some(x=>x.value===rest.join(':')))state[k]=rest.join(':');
 else if(!f.options&&['inc','dec'].includes(op))state[k]=Math.max(f.min,Math.min(f.max,state[k]+(op==='inc'?f.step:-f.step)));
 else return;
 feedback=null;comparisonOpen=false;render();
 const buttons=[...$('advanced-controls').querySelectorAll('button')];(buttons.find(x=>x.dataset.advancedAction===action&&!x.disabled)||buttons.find(x=>x.dataset.advancedAction.endsWith(':'+k)&&!x.disabled))?.focus()
});
function reset(){state={...modelAdvanced(id).initial};feedback=null;comparisonOpen=false;variableBaseline=null;render()}
$('advanced-topic').addEventListener('change',e=>{id=e.target.value;reset();$('advanced-heading').focus()});
$('advanced-check').addEventListener('click',()=>{feedback=evaluateAdvanced(id,state,lang()).correct;comparisonOpen=false;render();$('advanced-feedback').focus()});
$('advanced-compare-toggle').addEventListener('click',()=>{if(feedback===null)return;comparisonOpen=!comparisonOpen;render();$('advanced-compare-toggle').focus()});
$('advanced-reset').addEventListener('click',()=>{reset();$('advanced-heading').focus()});
$('advanced-variable-mark').addEventListener('click',()=>{variableBaseline={...state};renderVariableComparison();$('advanced-variable-status').focus()});
$('advanced-variable-clear').addEventListener('click',()=>{variableBaseline=null;renderVariableComparison();$('advanced-variable-mark').focus()});
$('lang').addEventListener('change',render);
window.addEventListener('aifs-teacher-demo',event=>{if(!ADVANCED_IDS.includes(event.detail))return;id=event.detail;reset();$('advanced-heading').focus();});
window.addEventListener('aifs-history-cleared',()=>{id=ADVANCED_IDS[0];reset()});
render();
