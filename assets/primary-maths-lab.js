/** M116 original draft primary models. No scores, data persistence, or verified grade claims. */
const P=(en,hi)=>[en,hi];
const field=(id,en,hi,min,max,initial)=>({id,label:P(en,hi),min,max,initial});
const def={
 'polygon-sides':{title:P('Count polygon sides','बहुभुज की भुजाएँ गिनें'),note:P('Only regular polygons with 3 to 8 straight sides. Curves are not shown.','केवल 3 से 8 सीधी भुजाओं वाले सम बहुभुज। वक्र नहीं दिखाए गए हैं।'),fields:[field('sides','Sides','भुजाएँ',3,8,4)]},
 'equal-groups':{title:P('Build equal groups','बराबर समूह बनाएँ'),note:P('Each group has the same number of counters. Count all groups.','हर समूह में समान गिनती है। सभी समूहों की कुल गिनती करें।'),fields:[field('groups','Groups','समूह',1,6,3),field('each','Counters per group','प्रति समूह गिनती',1,8,4)]},
 'decimal-hundredths':{title:P('Build a decimal on a hundred grid','सौ खाने वाले ग्रिड पर दशमलव बनाएँ'),note:P('All 100 cells make one equal whole. Each cell is one hundredth.','100 खाने एक समान पूर्ण बनाते हैं। हर खाना एक सौवाँ भाग है।'),fields:[field('tenths','Tenths','दशांश',0,9,3),field('hundredths','Hundredths','शतांश',0,9,7)]},
 'cube-volume':{title:P('Stack unit cubes','इकाई घन जमाएँ'),note:P('A filled rectangular prism of equal unit cubes; no physical measurement.','समान इकाई घनों से भरा आयताकार घनाभ; वास्तविक मापन नहीं।'),fields:[field('length','Cubes along length','लंबाई में घन',1,4,3),field('width','Cubes along width','चौड़ाई में घन',1,4,2),field('height','Layers','परतें',1,4,2)]}
};
export const PRIMARY_IDS=Object.freeze(Object.keys(def));
const langIndex=l=>{if(!['en','hi'].includes(l))throw Error('Unknown language');return l==='hi'?1:0};
function model(id){if(!PRIMARY_IDS.includes(id))throw Error('Unknown primary model');return def[id]}
export function primaryInitial(id){return Object.fromEntries(model(id).fields.map(f=>[f.id,f.initial]))}
export function primaryDefinition(id,lang='en'){const d=model(id),i=langIndex(lang);return {id,title:d.title[i],note:d.note[i],fields:d.fields.map(f=>({...f,label:f.label[i]})),humanReviewed:false,gradeVerified:false,publicReleaseApproved:false}}
export function evaluatePrimary(id,values,lang='en'){
 const d=model(id),i=langIndex(lang);
 if(!values||typeof values!=='object'||Array.isArray(values)||Object.keys(values).length!==d.fields.length||d.fields.some(f=>!Object.hasOwn(values,f.id)||!Number.isInteger(values[f.id])||values[f.id]<f.min||values[f.id]>f.max))throw Error('Invalid primary model controls');
 const {sides,groups,each,tenths,hundredths,length,width,height}=values;
 let rows,visual;
 switch(id){
 case 'polygon-sides':rows=[[P('Straight sides','सीधी भुजाएँ'),sides],[P('Vertices','शीर्ष'),sides]];visual={kind:'polygon',sides};break;
 case 'equal-groups':rows=[[P('Groups','समूह'),groups],[P('Counters in each','प्रति समूह गिनती'),each],[P('Total counters','कुल गिनती'),groups*each]];visual={kind:'groups',groups,each};break;
 case 'decimal-hundredths':{const n=tenths*10+hundredths;rows=[[P('Filled cells','भरे खाने'),n],[P('Fraction of whole','पूर्ण का भिन्न'),n+'/100'],[P('Decimal','दशमलव'),'0.'+String(n).padStart(2,'0')]];visual={kind:'hundred-grid',filled:n};break}
 case 'cube-volume':rows=[[P('Cubes per layer','प्रति परत घन'),length*width],[P('Layers','परतें'),height],[P('Total unit cubes','कुल इकाई घन'),length*width*height]];visual={kind:'layers',length,width,height};break;
 }
 return {id,rows:rows.map(([label,value])=>({label:label[i],value})),visual,humanReviewed:false,gradeVerified:false,storesStudentData:false,publicReleaseApproved:false};
}
