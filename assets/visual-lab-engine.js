/** M122 bounded interactive diagram drafts. No educational approval, real measurements or assessment. */
const P=(en,hi)=>[en,hi],R=(lo,hi)=>Array.from({length:hi-lo+1},(_,i)=>lo+i);
const F=(id,en,hi,options,initial)=>({id,label:P(en,hi),options,initial});
const D={
 'matrix-transform':{subject:'maths',grade:12,title:P('Matrix transformation explorer','आव्यूह रूपांतरण खोज'),note:P('Transform a fixed triangle with a 2 by 2 integer matrix. A zero determinant can collapse its area.','एक निश्चित त्रिभुज को 2 गुणा 2 पूर्णांक आव्यूह से बदलें। शून्य सारणिक पर क्षेत्रफल शून्य हो सकता है।'),fields:[F('a','Matrix entry a','आव्यूह पद a',R(-2,2),1),F('b','Matrix entry b','आव्यूह पद b',R(-2,2),0),F('c','Matrix entry c','आव्यूह पद c',R(-2,2),0),F('d','Matrix entry d','आव्यूह पद d',R(-2,2),1)]},
 'velocity-graph':{subject:'physics',grade:9,title:P('Velocity–time graph explorer','वेग–समय आलेख खोज'),note:P('Ideal constant acceleration in one dimension. Signed area under velocity–time graph gives displacement, not distance. No real vehicle or measurement.','एक आयाम में आदर्श स्थिर त्वरण। वेग–समय आलेख के नीचे चिह्न सहित क्षेत्रफल विस्थापन है, दूरी नहीं। वास्तविक वाहन या मापन नहीं।'),fields:[F('v','Initial velocity (symbolic)','प्रारंभिक वेग (प्रतीकात्मक)',R(-3,3),2),F('a','Acceleration (symbolic)','त्वरण (प्रतीकात्मक)',R(-2,2),1),F('t','Time interval (symbolic)','समय अंतराल (प्रतीकात्मक)',R(1,4),3)]},
 'particle-mixing':{subject:'chemistry',grade:6,title:P('Discrete particle mixing','विविक्त कण मिश्रण'),note:P('An invented grid of eight A and eight B tokens. Each step exchanges one neighboring pair (possibly identical). This is one illustrative rearrangement, not a diffusion rate or physical simulation.','आठ A और आठ B टोकन का काल्पनिक ग्रिड। हर चरण में एक पड़ोसी जोड़ी (समान भी हो सकती है) स्थान बदलती है। यह केवल उदाहरण है, विसरण दर या भौतिक अनुकरण नहीं।'),fields:[F('steps','Exchange steps','स्थान बदलने के चरण',R(0,16),0)]},
 'cell-division-stages':{subject:'biology',grade:8,title:P('Mitosis stage explorer','समसूत्री विभाजन चरण खोज'),note:P('Simplified fictional cell with two chromosomes. DNA replication precedes mitosis. Diagram is not microscopy or a complete cell cycle.','दो गुणसूत्र वाली काल्पनिक सरल कोशिका। डीएनए प्रतिकृति समसूत्री विभाजन से पहले होती है। चित्र सूक्ष्मदर्शी दृश्य या पूरा कोशिका चक्र नहीं।'),fields:[F('stage','Stage number (0–4)','चरण संख्या (0–4)',R(0,4),0)]}
};
export const VISUAL_IDS=Object.freeze(Object.keys(D));
const index=l=>{if(!['en','hi'].includes(l))throw Error('Invalid language');return l==='hi'?1:0};
const definition=id=>{if(!VISUAL_IDS.includes(id))throw Error('Unknown model');return D[id]};
const flags=()=>({humanReviewed:false,gradeVerified:false,publicReleaseApproved:false,storesStudentData:false});
export function visualDefinition(id,lang='en'){const d=definition(id),i=index(lang);return {id,subject:d.subject,proposedGrade:d.grade,title:d.title[i],note:d.note[i],fields:d.fields.map(f=>({id:f.id,label:f.label[i],options:[...f.options],initial:f.initial})),...flags()}}
export function visualInitial(id){return Object.fromEntries(definition(id).fields.map(f=>[f.id,f.initial]))}
const STAGES=[
 [P('Prophase','पूर्वावस्था'),2,4,1,P('Two replicated chromosomes condense.','दो प्रतिकृत गुणसूत्र संघनित होते हैं।')],
 [P('Metaphase','मध्यावस्था'),2,4,1,P('Two replicated chromosomes align at the middle.','दो प्रतिकृत गुणसूत्र मध्य में व्यवस्थित होते हैं।')],
 [P('Anaphase','पश्चावस्था'),4,4,1,P('Sister chromatids separate; each is now counted as a chromosome.','बहन क्रोमैटिड अलग होते हैं; प्रत्येक अब गुणसूत्र गिना जाता है।')],
 [P('Telophase','अंत्यावस्था'),4,4,1,P('Two nuclei form; each has two chromosomes.','दो केंद्रक बनते हैं; प्रत्येक में दो गुणसूत्र हैं।')],
 [P('After cytokinesis','कोशिकाद्रव्य विभाजन के बाद'),4,4,2,P('Two daughter cells, each with two chromosomes.','दो पुत्री कोशिकाएँ, प्रत्येक में दो गुणसूत्र।')]
];
export function evaluateVisual(id,v,lang='en'){
 const d=definition(id),i=index(lang),p=(en,hi)=>i?hi:en;
 if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==d.fields.length||d.fields.some(f=>!Object.hasOwn(v,f.id)||!f.options.includes(v[f.id])))throw Error('Invalid diagram controls');
 let visual,rows;
 if(id==='matrix-transform'){
  const base=[[0,0],[2,0],[0,1]],{a,b,c,d}=v,points=base.map(([x,y])=>[a*x+b*y,c*x+d*y]),det=a*d-b*c;
  visual={kind:'matrix',base,points};rows=[[p('Transformed vertices','रूपांतरित शीर्ष'),points.map(q=>'('+q.join(', ')+')').join('; ')],[p('Determinant','सारणिक'),det],[p('Area (square units)','क्षेत्रफल (वर्ग इकाई)'),Math.abs(det)]];
 }else if(id==='velocity-graph'){
  const {v:u,a,t}=v,points=R(0,t).map(x=>[x,u+a*x]),end=u+a*t,displacement=(u+end)*t/2;
  visual={kind:'velocity',points};rows=[[p('Final velocity','अंतिम वेग'),end],[p('Signed displacement','चिह्न सहित विस्थापन'),displacement],[p('Time–velocity pairs','समय–वेग युग्म'),points.map(q=>'('+q.join(', ')+')').join('; ')]];
 }else if(id==='particle-mixing'){
  const cells=Array.from({length:16},(_,n)=>n%4<2?'A':'B');
  // Adjacent swaps along an explicit serpentine path; no stochastic/kinetic claim.
  const path=[0,1,2,3,7,6,5,4,8,9,10,11,15,14,13,12];
  for(let n=0;n<v.steps;n++){const k=n%15,x=path[k],y=path[k+1];[cells[x],cells[y]]=[cells[y],cells[x]]}
  let unlike=0;for(let n=0;n<16;n++){if(n%4!==3&&cells[n]!==cells[n+1])unlike++;if(n<12&&cells[n]!==cells[n+4])unlike++}
  visual={kind:'particles',cells};rows=[[p('A tokens','A टोकन'),cells.filter(x=>x==='A').length],[p('B tokens','B टोकन'),cells.filter(x=>x==='B').length],[p('Unlike neighboring pairs','असमान पड़ोसी जोड़ियाँ'),unlike],[p('Grid rows','ग्रिड पंक्तियाँ'),R(0,3).map(r=>cells.slice(r*4,r*4+4).join(' ')).join(' / ')]];
 }else{
  const s=STAGES[v.stage];visual={kind:'division',stage:v.stage};rows=[[p('Stage','चरण'),s[0][i]],[p('Total chromosomes across shown cells','दिखाई गई कोशिकाओं में कुल गुणसूत्र'),s[1]],[p('Total DNA copies represented','दिखाई गई कुल डीएनए प्रतियाँ'),s[2]],[p('Cells shown','दिखाई गई कोशिकाएँ'),s[3]],[p('Description','विवरण'),s[4][i]]];
 }
 return {id,visual,rows:rows.map(([label,value])=>({label,value})),...flags()};
}
