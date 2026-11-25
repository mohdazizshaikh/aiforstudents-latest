/** M113 local-only learning and teacher workspaces. No learner identity, history or assessment. */
import {teacherResourceChoices,labPackKeys,worksheetReturnLaunch,activityWorksheet} from './teacher-cards-engine.js';
import {PROTOTYPE_KEYS,prototypeChoices} from './extended-lab-catalog.js';
const modules=Object.freeze([
 ['games','Games','खेल','practice'],['study','Study Lab','अध्ययन लैब','study-lab'],
 ['studio','Smart Studio','स्मार्ट स्टूडियो','smart-studio'],['virtual','Virtual Lab','आभासी प्रयोगशाला','experiment-lab'],
 ['maths','Maths Workshop','गणित कार्यशाला','math-workshop'],['science','Science Lab','विज्ञान लैब','science-lab'],
 ['advanced','Explore Labs','प्रयोगशालाएँ खोजें','advanced-labs'],['guide','Practice Guide','अभ्यास मार्गदर्शिका','local-learning-guide'],
 ['digital','Digital Skills','डिजिटल कौशल','digital-skills'],['future','Future Explorer','भविष्य खोज','future-explorer'],
 ['team','Grow Together','साथ बढ़ें','team-play']
]);
export const WORKSPACE_LIMIT=6;
const roles=['learner','teacher'],langs=['en','hi'];
const checked=(role,lang='en')=>{if(!roles.includes(role)||!langs.includes(lang))throw Error('Unknown workspace selection')};
const keysets={learner:new Set([...modules.map(x=>x[0]),...labPackKeys(),...PROTOTYPE_KEYS]),teacher:new Set([...labPackKeys(),...PROTOTYPE_KEYS])};
const flags=()=>({localOnly:true,storesStudentData:false,humanReviewed:false,publicReleaseApproved:false});
export function workspaceChoices(role,lang='en'){
 checked(role,lang);
 const moduleChoices=role==='learner'?modules.map(([key,en,hi,anchor])=>({key,title:lang==='hi'?hi:en,href:'../?lang='+lang+'#'+anchor,...flags()})):[];
 return [...moduleChoices,...teacherResourceChoices('all','all',lang).map(x=>({key:x.key,title:x.title,subject:x.subject,kind:x.kind,href:'../'+worksheetReturnLaunch(x.key,lang).href,worksheetHref:'../'+activityWorksheet(x.key,lang).href,...flags()})),...prototypeChoices(lang)];
}
export function createWorkspace(role){
 checked(role);
 return {role,keys:[],cursor:0,phase:'planning',outcomes:[]};
}
function valid(s){
 if(!s||!roles.includes(s.role)||!Array.isArray(s.keys)||s.keys.length>WORKSPACE_LIMIT||new Set(s.keys).size!==s.keys.length||s.keys.some(k=>!keysets[s.role].has(k))||!['planning','running','paused','finished'].includes(s.phase)||!Number.isInteger(s.cursor)||!Array.isArray(s.outcomes)||s.outcomes.some(x=>!['visited','skipped'].includes(x)))throw Error('Invalid workspace');
 if(s.phase==='planning'){if(s.cursor!==0||s.outcomes.length!==0)throw Error('Invalid planning state')}
 else if(!s.keys.length||s.cursor<0||s.cursor>s.keys.length||s.outcomes.length!==s.cursor||((s.phase==='finished')!==(s.cursor===s.keys.length)))throw Error('Invalid session state');
 if(s.role==='teacher'&&s.outcomes.includes('skipped'))throw Error('Invalid teacher outcome');
}
export function workspaceAction(state,action){
 valid(state);
 if(!action||typeof action!=='object'||Array.isArray(action))throw Error('Invalid workspace action');
 const t=action.type,editing=['add','remove','up','down'].includes(t);
 if(Object.keys(action).length!==(editing?2:1)||!Object.hasOwn(action,'type')||(editing&&(!Object.hasOwn(action,'key')||!keysets[state.role].has(action.key))))throw Error('Invalid workspace action');
 const s={...state,keys:[...state.keys],outcomes:[...state.outcomes]};
 if(t==='clear')return createWorkspace(s.role);
 if(editing){
  if(s.phase!=='planning')throw Error('Edit only while planning');
  const i=s.keys.indexOf(action.key);
  if(t==='add'&&i<0&&s.keys.length<WORKSPACE_LIMIT)s.keys.push(action.key);
  if(t==='remove'&&i>=0)s.keys.splice(i,1);
  if(t==='up'&&i>0)[s.keys[i-1],s.keys[i]]=[s.keys[i],s.keys[i-1]];
  if(t==='down'&&i>=0&&i<s.keys.length-1)[s.keys[i],s.keys[i+1]]=[s.keys[i+1],s.keys[i]];
  return s;
 }
 if(t==='start'&&s.phase==='planning'&&s.keys.length){s.phase='running';return s}
 if(t==='pause'&&s.phase==='running'&&s.role==='teacher'){s.phase='paused';return s}
 if(t==='resume'&&s.phase==='paused'&&s.role==='teacher'){s.phase='running';return s}
 if(s.phase==='running'&&((s.role==='learner'&&['visited','skip'].includes(t))||(s.role==='teacher'&&t==='next'))){
  s.outcomes.push(t==='skip'?'skipped':'visited');s.cursor++;
  if(s.cursor===s.keys.length)s.phase='finished';
  return s;
 }
 throw Error('Action not available in this phase');
}
export function workspaceView(state,lang='en'){
 valid(state);checked(state.role,lang);
 const available=new Map(workspaceChoices(state.role,lang).map(x=>[x.key,x]));
 const items=state.keys.map((k,i)=>({...available.get(k),position:i+1,status:i<state.cursor?state.outcomes[i]:i===state.cursor&&['running','paused'].includes(state.phase)?'current':'planned'}));
 return {role:state.role,phase:state.phase,items,current:['running','paused'].includes(state.phase)?items[state.cursor]:null,summary:{planned:items.length,visited:state.outcomes.filter(x=>x==='visited').length,skipped:state.outcomes.filter(x=>x==='skipped').length,remaining:items.length-state.cursor},...flags()};
}
