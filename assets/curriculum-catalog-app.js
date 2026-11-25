import {curriculumCatalog,BOARDS,SUBJECTS} from './curriculum-catalog.js';
const $=id=>document.getElementById(id),root=$('versioned-curriculum');
let lang='en',board='CBSE',grade=1,subject='maths',edition='all';
const p=(en,hi)=>lang==='hi'?hi:en;
const el=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e};
function fill(id,opts,v){const s=$(id);s.replaceChildren(...opts.map(([k,t])=>{const o=el('option',t);o.value=k;return o}));s.value=v}
function list(id,items){$(id).replaceChildren(...items.map(x=>{const li=el('li',''),a=el('a',x.title);a.href=x.href;a.target='_blank';a.rel='noopener noreferrer';li.append(a);return li}));if(!items.length)$(id).append(el('li',p('None listed','सूची में कोई नहीं')))}
function render(){
 root.lang=lang;const v=curriculumCatalog({board,grade,subject,lang});
 $('cc-title').textContent=p('Board and concept discovery (draft)','बोर्ड और विषय खोज (मसौदा)');
 $('cc-note').textContent=p('Planning only. No verified chapters, grade placement or official prerequisite approval.','केवल योजना। कोई सत्यापित अध्याय, कक्षा निर्धारण या आधिकारिक पूर्वापेक्षा मंजूरी नहीं।');
 for(const [id,en,hi] of [['lang','Language','भाषा'],['board','Board','बोर्ड'],['grade','Proposed class','प्रस्तावित कक्षा'],['subject','Topic lens','विषय'],['edition','Source version','स्रोत संस्करण']])$('cc-'+id+'-label').textContent=p(en,hi);
 fill('cc-board',BOARDS.map(x=>[x,x]),board);fill('cc-grade',Array.from({length:12},(_,i)=>[String(i+1),String(i+1)]),String(grade));fill('cc-subject',SUBJECTS.map((x,i)=>[x,p(['Maths','Physics','Chemistry','Biology'][i],['गणित','भौतिकी','रसायन','जीवविज्ञान'][i])]),subject);
 if(edition!=='all'&&!v.editionOptions.includes(edition))edition='all';
 fill('cc-edition',[['all',p('All versions','सभी संस्करण')],...v.editionOptions.map(x=>[x,x])],edition);
 $('cc-concept').textContent=v.concept;$('cc-earlier-title').textContent=p('Optional earlier concept','वैकल्पिक पहले का विषय')+(v.earlierConcept?' — '+v.earlierConcept:'');
 $('cc-drafts-title').textContent=p('Related drafts','संबंधित मसौदे');$('cc-prototypes-title').textContent=p('New prototypes (no worksheets yet)','नए मॉडल (अभ्यास पत्र अभी नहीं)');$('cc-sources-title').textContent=p('Pending source references','लंबित स्रोत संदर्भ');
 list('cc-drafts',v.relatedDrafts);list('cc-earlier',v.earlierLinks);list('cc-prototypes',v.prototypes);
 $('cc-sources').replaceChildren(...v.sources.filter(x=>edition==='all'||x.edition===edition).map(x=>el('li',x.anchor+' · '+x.edition+' · '+x.source)));
 if(!$('cc-sources').children.length)$('cc-sources').append(el('li',p('No source proposal in inventory','सूची में स्रोत प्रस्ताव नहीं')));
}
for(const id of ['lang','board','grade','subject','edition'])$('cc-'+id).addEventListener('change',()=>{const v=$('cc-'+id).value;if(id==='lang')lang=v;if(id==='board')board=v;if(id==='grade')grade=Number(v);if(id==='subject')subject=v;if(id==='edition')edition=v;else edition='all';render()});
function reset(){board='CBSE';grade=1;subject='maths';edition='all';render()}
window.addEventListener('aifs-history-cleared',reset);window.addEventListener('pageshow',e=>{if(e.persisted)reset()});
try{const c=new BroadcastChannel('aifs-discovery-privacy-reset-v1');c.addEventListener('message',e=>{if(e.data?.type==='clear-history')reset()})}catch{}
window.addEventListener('storage',e=>{if(e.key==='aifs-privacy-clear-signal-v1'&&e.newValue==='clear')reset()});
render();
