import {COMPARISON_IDS,DIRECTIONS,comparisonDefinition,comparisonInitial,comparisonValue,controlledComparison} from './comparison-lab-engine.js';
const $=id=>document.getElementById(id),root=$('comparison-lab');
let id=COMPARISON_IDS[0],lang='en',values=comparisonInitial(id),baseline=null,field=null,prediction='',result=null;
const p=(en,hi)=>lang==='hi'?hi:en;
const e=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
const labels=()=>({lower:p('Lower','कम'),same:p('Same','समान'),higher:p('Higher','अधिक')});
function fill(s,options,value){s.replaceChildren(...options.map(([key,label])=>{const o=e('option',label);o.value=key;return o}));s.value=value}
function resetTrial(){baseline=null;field=null;prediction='';result=null;values=comparisonInitial(id)}
function output(){
 const r=comparisonValue(id,values,lang);
 $('compare-results').replaceChildren(...r.rows.map(x=>e('li',x.label+': '+x.value)));
 $('compare-baseline').textContent=baseline?p('Baseline: ','आधार मान: ')+comparisonValue(id,baseline,lang).metric:p('No baseline captured','आधार मान नहीं लिया गया');
 $('compare-run').disabled=!(baseline&&field&&values[field]!==baseline[field]&&DIRECTIONS.includes(prediction));
 $('compare-output').textContent=result?p('Predicted: ','अनुमान: ')+labels()[result.prediction]+' · '+p('Observed: ','देखा गया: ')+labels()[result.direction]+' · '+result.baseline+' → '+result.trial:p('Capture baseline, predict, then change one control.','आधार मान लें, अनुमान करें, फिर एक नियंत्रण बदलें।');
}
function render(){
 root.lang=lang;const d=comparisonDefinition(id,lang);
 $('compare-title').textContent=p('Compare virtual experiments','आभासी प्रयोगों की तुलना');
 $('compare-notice').textContent=p('Unreviewed symbolic models. No scores, stored results or real experiments.','असमीक्षित प्रतीकात्मक मॉडल। अंक, सहेजे परिणाम या वास्तविक प्रयोग नहीं।');
 $('compare-lang-label').textContent=p('Language','भाषा');$('compare-model-label').textContent=p('Model','मॉडल');
 fill($('compare-model'),COMPARISON_IDS.map(k=>[k,comparisonDefinition(k,lang).title]),id);$('compare-note').textContent=d.note;
 $('compare-controls').replaceChildren(...d.fields.map(f=>{const wrap=e('div'),label=e('label',f.label),s=e('select');s.id='compare-field-'+f.id;label.htmlFor=s.id;fill(s,f.options.map(v=>[String(v),String(v)]),String(values[f.id]));s.disabled=!!baseline&&(f.id!==field||!DIRECTIONS.includes(prediction));s.addEventListener('change',()=>{values={...values,[f.id]:Number(s.value)};result=null;output()});wrap.append(label,s);return wrap}));
 $('compare-variable-label').textContent=p('Variable to change','बदलने वाला चर');
 fill($('compare-variable'),d.fields.map(f=>[f.id,f.label]),field??d.fields[0].id);$('compare-variable').disabled=!baseline;
 $('compare-prediction-label').textContent=p('Predict output direction before changing variable','चर बदलने से पहले परिणाम की दिशा का अनुमान');
 fill($('compare-prediction'),[['',p('Choose prediction','अनुमान चुनें')],...DIRECTIONS.map(k=>[k,labels()[k]])],prediction);$('compare-prediction').disabled=!baseline;
 $('compare-capture').textContent=p('Capture baseline','आधार मान लें');$('compare-capture').disabled=!!baseline;
 $('compare-run').textContent=p('Compare with baseline','आधार से तुलना करें');$('compare-reset').textContent=p('Reset experiment','प्रयोग रीसेट करें');$('compare-results-title').textContent=p('Numerical description','संख्यात्मक विवरण');output();
}
$('compare-model').addEventListener('change',()=>{id=$('compare-model').value;resetTrial();render()});
$('compare-lang').addEventListener('change',()=>{lang=$('compare-lang').value;render()});
$('compare-capture').addEventListener('click',()=>{baseline={...values};field=comparisonDefinition(id).fields[0].id;prediction='';result=null;render();$('compare-variable').focus()});
$('compare-variable').addEventListener('change',()=>{field=$('compare-variable').value;values={...baseline};prediction='';result=null;render()});
$('compare-prediction').addEventListener('change',()=>{prediction=$('compare-prediction').value;values={...baseline};result=null;render()});
$('compare-run').addEventListener('click',()=>{result=controlledComparison(id,baseline,values,field,prediction,lang);output()});
$('compare-reset').addEventListener('click',()=>{resetTrial();render()});
function reset(){id=COMPARISON_IDS[0];resetTrial();render()}
window.addEventListener('aifs-history-cleared',reset);
try{const channel=new BroadcastChannel('aifs-discovery-privacy-reset-v1');channel.addEventListener('message',ev=>{if(ev.data?.type==='clear-history')reset()})}catch{}
window.addEventListener('storage',ev=>{if(ev.key==='aifs-privacy-clear-signal-v1'&&ev.newValue==='clear')reset()});
window.addEventListener('pageshow',ev=>{if(ev.persisted)reset()});
render();
