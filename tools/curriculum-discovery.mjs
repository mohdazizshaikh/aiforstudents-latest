/** M36 static draft navigation renderer and structural validator; no chapter approval. */
import {EXPERIMENT_IDS,WORKSHOP_MODES} from '../assets/experiment-engine.js';
import {SCIENCE_IDS,SCIENCE_MODELS} from '../assets/science-engine.js';
import {ADVANCED_IDS,ADVANCED_MODELS} from '../assets/advanced-lab-engine.js';
const subjectLabels={"maths":["Maths","गणित"],"physics":["Physics lens","भौतिकी दृष्टि"],"chemistry":["Chemistry lens","रसायन दृष्टि"],"biology":["Biology lens","जीवविज्ञान दृष्टि"]};
const sectionLinks={"experiment":"experiment-lab","workshop":"math-workshop","science":"science-lab","advanced":"advanced-labs"};
export function renderDiscovery(data){
 const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 let html='<section id="curriculum-discovery" aria-labelledby="curriculum-discovery-title"><h2 id="curriculum-discovery-title">Class 1–12 topic discovery — unreviewed / <span lang="hi">कक्षा 1–12 विषय खोज — समीक्षा बाकी</span></h2><p><strong>Reviewer planning only.</strong> These are illustrative links to related draft models, not grade recommendations, NCERT/CBSE/state-board chapter mapping, or syllabus coverage. Physics, chemistry and biology are topic lenses, not necessarily separate school subjects in early classes.</p><p lang="hi">यह केवल समीक्षा की तैयारी है। यह कक्षा के लिए सिफारिश, बोर्ड अध्याय का मिलान या पूरा पाठ्यक्रम नहीं है। शुरुआती कक्षाओं में विज्ञान के विषय अलग विषय हों, यह आवश्यक नहीं है।</p>';
 for(const g of data.grades){html+='<details class="curriculum-grade" id="draft-grade-'+g.grade+'"><summary>Class '+g.grade+' / <span lang="hi">कक्षा '+g.grade+'</span></summary><ul>';
 for(const t of g.topics){const label=subjectLabels[t.subject];html+='<li><strong>'+esc(label[0])+' / <span lang="hi">'+esc(label[1])+'</span>:</strong> '+esc(t.en)+' / <span lang="hi">'+esc(t.hi)+'</span>. ';
 const families=[...new Set(t.modelIds.map(id=>id.split(":")[0]))];
 if(families.length)html+=families.map(f=>'<a href="../#'+sectionLinks[f]+'">Related '+f+' drafts / <span lang="hi">संबंधित प्रारूप</span></a>').join(' · ')+' <span class="tiny">Choose the relevant model in that section; no grade approval.</span>';
 else html+='<span class="tiny">Gap — no related interactive model listed / <span lang="hi">संबंधित मॉडल अभी सूचीबद्ध नहीं है</span></span>';
 html+='</li>'}
 html+='</ul></details>'}
 return html+'</section>';
}
export function validateDiscovery(d){
 const errors=[],all=new Map([...EXPERIMENT_IDS.map(id=>['experiment:'+id,id==='fractions-lab'?'maths':'physics']),...WORKSHOP_MODES.map(id=>['workshop:'+id,'maths']),...SCIENCE_IDS.map(id=>['science:'+id,SCIENCE_MODELS[id].subject.toLowerCase()]),...ADVANCED_IDS.map(id=>['advanced:'+id,ADVANCED_MODELS[id].subject.toLowerCase()])]),used=new Set();
 if(d?.schema!=='aifs-m36-draft-discovery-v1'||d.publicReleaseApproved!==false||d.curriculumVerified!==false||d.sourceEditionVerified!==false||d.grades?.length!==12)return {valid:false,errors:['Invalid draft discovery'],verifiedChapters:0};
 const grades=new Set();let slots=0,gaps=0;
 for(const g of d.grades){
  if(!Number.isInteger(g.grade)||g.grade<1||g.grade>12||grades.has(g.grade)||g.board!=='UNMAPPED'||g.chapter!==null||g.edition!==null||g.reviewStatus!=='PENDING')errors.push('Unverified or duplicate grade '+g.grade);
  grades.add(g.grade);
  if(!Array.isArray(g.topics)||g.topics.length!==4){errors.push('Expected four topic lenses');continue;}
  const seen=new Set();
  for(const t of g.topics){
   slots++;if(!Object.hasOwn(subjectLabels,t.subject)||seen.has(t.subject)||typeof t.en!=='string'||!t.en.trim()||typeof t.hi!=='string'||!/[\u0900-\u097f]/.test(t.hi)||t.reviewStatus!=='PENDING')errors.push('Invalid bilingual lens '+g.grade);
   seen.add(t.subject);
   if(!Array.isArray(t.modelIds)||new Set(t.modelIds).size!==t.modelIds.length||t.coverage!==(t.modelIds.length?'RELATED_DRAFT_ONLY':'GAP')){errors.push('Invalid coverage '+g.grade);continue;}
   if(!t.modelIds.length)gaps++;
   for(const id of t.modelIds){if(all.get(id)!==t.subject)errors.push('Unknown or mismatched model '+id);else used.add(id);}
  }
 }
 for(const id of all.keys())if(!used.has(id))errors.push('Existing model missing from discovery '+id);
 return {valid:errors.length===0,errors,grades:grades.size,slots,gaps,uniqueExistingModels:used.size,verifiedChapters:0,publicReleaseApproved:false};
}
