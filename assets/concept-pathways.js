/** M115 optional draft concept sequence, never validated prerequisites or mastery. */
import {labPackKeys,worksheetReturnLaunch,teacherResourceChoices} from './teacher-cards-engine.js';
import {PROTOTYPE_KEYS,prototypeChoices} from './extended-lab-catalog.js';
export const CONCEPT_GRAPH_VERSION='m118-draft-v2';
const GRAPH=Object.freeze(Object.fromEntries(Object.entries({
 "counting:main": [],
 "place-value:main": [
  "counting:main"
 ],
 "maths/number-line:main": [
  "counting:main"
 ],
 "studio/fractions:main": [
  "counting:main"
 ],
 "ratio-algebra:main": [
  "studio/fractions:main"
 ],
 "ratio-algebra:equation": [
  "ratio-algebra:main",
  "maths/number-line:main"
 ],
 "coordinate:main": [
  "maths/number-line:main"
 ],
 "quadratic:main": [
  "coordinate:main",
  "ratio-algebra:equation"
 ],
 "maths/rectangle:main": [
  "counting:main"
 ],
 "triangle-area:main": [
  "maths/rectangle:main"
 ],
 "right-triangle-ratio:main": [
  "triangle-area:main",
  "ratio-algebra:main"
 ],
 "length-compare:main": [
  "counting:main"
 ],
 "measurement:main": [
  "length-compare:main"
 ],
 "science/motion:main": [
  "measurement:main"
 ],
 "position-change:main": [
  "maths/number-line:main"
 ],
 "path-distance:main": [
  "position-change:main"
 ],
 "force-motion:main": [
  "science/motion:main"
 ],
 "constant-acceleration:main": [
  "science/motion:main",
  "position-change:main"
 ],
 "science/matter:main": [],
 "material-state:main": [
  "science/matter:main"
 ],
 "atom-count:main": [
  "counting:main",
  "science/matter:main"
 ],
 "ion-charge:main": [
  "atom-count:main",
  "maths/number-line:main"
 ],
 "mass-balance:main": [
  "measurement:main",
  "science/matter:main"
 ],
 "mass-fraction:main": [
  "mass-balance:main",
  "studio/fractions:main"
 ],
 "living-examples:main": [],
 "plant-parts:main": [
  "living-examples:main"
 ],
 "science/cells:main": [
  "living-examples:main"
 ],
 "cell-doubling:main": [
  "science/cells:main",
  "counting:main"
 ],
 "science/food-chain:main": [
  "living-examples:main"
 ],
 "food-web-links:main": [
  "science/food-chain:main"
 ],
 "ecosystem:main": [
  "food-web-links:main"
 ],
 "dna-complement:main": [
  "science/cells:main"
 ],
 "heredity:main": [
  "science/cells:main",
  "probability:main"
 ],
 "probability:main": [
  "studio/fractions:main"
 ]
,
"prototype:polygon-sides":["counting:main"],
"prototype:equal-groups":["counting:main"],
"prototype:decimal-hundredths":["place-value:main","studio/fractions:main"],
"prototype:cube-volume":["maths/rectangle:main"],
"prototype:signed-sum":["maths/number-line:main"],
"prototype:data-range":["counting:main"],
"prototype:ideal-pressure":["maths/rectangle:main","measurement:main"],
"prototype:ideal-momentum":["science/motion:main","position-change:main"],
"prototype:mixture-count":["science/matter:main"],
"prototype:formula-ratio":["atom-count:main","ratio-algebra:main"],
"prototype:habitat-tokens":["living-examples:main"],
"prototype:plant-water-tokens":["plant-parts:main"]
}).map(([k,v])=>[k,Object.freeze(v)])));
const known=new Set([...labPackKeys(),...PROTOTYPE_KEYS]),keys=Object.keys(GRAPH),langs=['en','hi'];
export function auditConceptGraph(graph=GRAPH){
 if(!graph||typeof graph!=='object'||Array.isArray(graph))return {valid:false,reason:'INVALID_GRAPH'};
 const ids=Object.keys(graph),set=new Set(ids);
 if(!ids.length||ids.some(k=>!known.has(k)||!Array.isArray(graph[k])||new Set(graph[k]).size!==graph[k].length||graph[k].some(d=>!set.has(d))))return {valid:false,reason:'INVALID_EDGE'};
 const active=new Set(),done=new Set();
 function visit(k){if(active.has(k))return false;if(done.has(k))return true;active.add(k);for(const d of graph[k])if(!visit(d))return false;active.delete(k);done.add(k);return true}
 if(!ids.every(visit))return {valid:false,reason:'CYCLE'};
 return {valid:true,nodes:ids.length,edges:ids.reduce((n,k)=>n+graph[k].length,0)};
}
if(!auditConceptGraph().valid)throw Error('Invalid draft concept graph');
const flags=()=>({localOnly:true,storesStudentData:false,gradeVerified:false,prerequisitesValidated:false,masteryValidated:false,publicReleaseApproved:false});
export function conceptChoices(lang='en'){
 if(!langs.includes(lang))throw Error('Invalid language');
 const source=new Map([...teacherResourceChoices('all','all',lang),...prototypeChoices(lang)].map(x=>[x.key,x]));
 return keys.map(key=>({key,title:source.get(key).title,subject:source.get(key).subject,...flags()}));
}
export function conceptPath(target){
 if(!Object.hasOwn(GRAPH,target))throw Error('Unknown concept');
 const visited=new Set(),order=[];
 function visit(k){if(visited.has(k))return;visited.add(k);for(const dep of GRAPH[k])visit(dep);order.push(k)}
 visit(target);return order;
}
export function createConceptSession(target){
 conceptPath(target);return {target,explored:[],skipped:[]};
}
function validate(s){
 if(!s||Object.keys(s).length!==3||!Array.isArray(s.explored)||!Array.isArray(s.skipped)||!Object.hasOwn(s,'target'))throw Error('Invalid concept session');
 const path=conceptPath(s.target),all=[...s.explored,...s.skipped];
 if(new Set(all).size!==all.length||all.some(k=>!path.includes(k)))throw Error('Invalid concept choices');
 return path;
}
export function conceptSuggestion(s,lang='en'){
 const path=validate(s);if(!langs.includes(lang))throw Error('Invalid language');
 const done=new Set([...s.explored,...s.skipped]),next=path.find(k=>!done.has(k)),choices=new Map(conceptChoices(lang).map(x=>[x.key,x]));
 const item=k=>({...choices.get(k),href:k.startsWith('prototype:')?prototypeChoices(lang).find(x=>x.key===k).href:'../'+worksheetReturnLaunch(k,lang).href});
 const p=(en,hi)=>lang==='hi'?hi:en;
 return {version:CONCEPT_GRAPH_VERSION,target:item(s.target),next:next?{...item(next),reason:next===s.target?p('Your chosen concept.','आपका चुना विषय।'):p('A suggested earlier concept for your chosen topic; optional, not a requirement.','चुने विषय से पहले का सुझाया विषय; वैकल्पिक, अनिवार्य नहीं।')}:null,
  sequence:path.map(k=>({...item(k),status:s.explored.includes(k)?'explored':s.skipped.includes(k)?'skipped':'suggested'})),
  explored:s.explored.length,skipped:s.skipped.length,...flags()};
}
export function conceptAction(s,type){
 const path=validate(s);if(type==='reset')return createConceptSession(s.target);
 const next=path.find(k=>!s.explored.includes(k)&&!s.skipped.includes(k));
 if(!next||!['explore','skip'].includes(type))throw Error('Invalid concept action');
 return {target:s.target,explored:[...s.explored,...(type==='explore'?[next]:[])],skipped:[...s.skipped,...(type==='skip'?[next]:[])]};
}
