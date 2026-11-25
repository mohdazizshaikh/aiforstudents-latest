/** Original unreviewed M117 symbolic models. No identity, scores, persistence or real procedures. */
const D={
 "signed-sum": {
  "subject": "maths",
  "grade": 6,
  "title": [
   "Add signed integers",
   "चिह्न सहित पूर्णांक जोड़ें"
  ],
  "metric": [
   "Sum",
   "योग"
  ],
  "note": [
   "Abstract number line, not physical motion.",
   "काल्पनिक संख्या रेखा, वास्तविक गति नहीं।"
  ],
  "fields": [
   {
    "id": "a",
    "label": [
     "First integer",
     "पहला पूर्णांक"
    ],
    "options": [
     -5,
     -4,
     -3,
     -2,
     -1,
     0,
     1,
     2,
     3,
     4,
     5
    ],
    "initial": 2
   },
   {
    "id": "b",
    "label": [
     "Second integer",
     "दूसरा पूर्णांक"
    ],
    "options": [
     -5,
     -4,
     -3,
     -2,
     -1,
     0,
     1,
     2,
     3,
     4,
     5
    ],
    "initial": -3
   }
  ]
 },
 "data-range": {
  "subject": "maths",
  "grade": 8,
  "title": [
   "Range of three values",
   "तीन मानों का परिसर"
  ],
  "metric": [
   "Range",
   "परिसर"
  ],
  "note": [
   "Maximum minus minimum, not variance.",
   "अधिकतम घटा न्यूनतम, प्रसरण नहीं।"
  ],
  "fields": [
   {
    "id": "a",
    "label": [
     "First value",
     "पहला मान"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4,
     5,
     6
    ],
    "initial": 1
   },
   {
    "id": "b",
    "label": [
     "Second value",
     "दूसरा मान"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4,
     5,
     6
    ],
    "initial": 3
   },
   {
    "id": "c",
    "label": [
     "Third value",
     "तीसरा मान"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4,
     5,
     6
    ],
    "initial": 5
   }
  ]
 },
 "ideal-pressure": {
  "subject": "physics",
  "grade": 8,
  "title": [
   "Ideal force per area",
   "आदर्श प्रति क्षेत्रफल बल"
  ],
  "metric": [
   "Force / area (symbolic)",
   "बल / क्षेत्रफल (प्रतीकात्मक)"
  ],
  "note": [
   "Uniform perpendicular symbolic force; no hardware or real measurements.",
   "समान लंबवत प्रतीकात्मक बल; उपकरण या वास्तविक मापन नहीं।"
  ],
  "fields": [
   {
    "id": "force",
    "label": [
     "Symbolic force",
     "प्रतीकात्मक बल"
    ],
    "options": [
     12,
     24,
     36
    ],
    "initial": 12
   },
   {
    "id": "area",
    "label": [
     "Symbolic area",
     "प्रतीकात्मक क्षेत्रफल"
    ],
    "options": [
     1,
     2,
     3,
     4,
     6
    ],
    "initial": 2
   }
  ]
 },
 "ideal-momentum": {
  "subject": "physics",
  "grade": 11,
  "title": [
   "Signed momentum",
   "चिह्न सहित संवेग"
  ],
  "metric": [
   "Momentum (symbolic)",
   "संवेग (प्रतीकात्मक)"
  ],
  "note": [
   "Ideal one-dimensional p = mv, no collisions or apparatus.",
   "आदर्श एक-विमीय p = mv, टक्कर या उपकरण नहीं।"
  ],
  "fields": [
   {
    "id": "mass",
    "label": [
     "Symbolic mass",
     "प्रतीकात्मक द्रव्यमान"
    ],
    "options": [
     1,
     2,
     3,
     4
    ],
    "initial": 2
   },
   {
    "id": "velocity",
    "label": [
     "Signed velocity",
     "चिह्न सहित वेग"
    ],
    "options": [
     -4,
     -3,
     -2,
     -1,
     0,
     1,
     2,
     3,
     4
    ],
    "initial": 3
   }
  ]
 },
 "mixture-count": {
  "subject": "chemistry",
  "grade": 3,
  "title": [
   "Sort symbolic mixture tokens",
   "प्रतीकात्मक मिश्रण टोकन छाँटें"
  ],
  "metric": [
   "Total tokens before or after sorting",
   "छाँटने से पहले या बाद कुल टोकन"
  ],
  "note": [
   "Two token types, no real substances or separation procedure.",
   "दो टोकन प्रकार, वास्तविक पदार्थ या पृथक्करण विधि नहीं।"
  ],
  "fields": [
   {
    "id": "a",
    "label": [
     "Type A tokens",
     "प्रकार A टोकन"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4,
     5,
     6
    ],
    "initial": 3
   },
   {
    "id": "b",
    "label": [
     "Type B tokens",
     "प्रकार B टोकन"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4,
     5,
     6
    ],
    "initial": 2
   }
  ]
 },
 "formula-ratio": {
  "subject": "chemistry",
  "grade": 11,
  "title": [
   "Symbolic formula-unit ratio",
   "प्रतीकात्मक सूत्र इकाई अनुपात"
  ],
  "metric": [
   "A symbols (two per unit)",
   "A प्रतीक (प्रति इकाई दो)"
  ],
  "note": [
   "Abstract A₂B counts only, not mole mass, real chemistry or synthesis.",
   "काल्पनिक A₂B गिनती, मोल द्रव्यमान, वास्तविक रसायन या संश्लेषण नहीं।"
  ],
  "fields": [
   {
    "id": "units",
    "label": [
     "Formula units",
     "सूत्र इकाइयाँ"
    ],
    "options": [
     1,
     2,
     3,
     4,
     5,
     6
    ],
    "initial": 2
   },
   {
    "id": "copies",
    "label": [
     "Equal sets",
     "समान समूह"
    ],
    "options": [
     1,
     2,
     3,
     4
    ],
    "initial": 1
   }
  ]
 },
 "habitat-tokens": {
  "subject": "biology",
  "grade": 6,
  "title": [
   "Resource-limited habitat tokens",
   "संसाधन-सीमित आवास टोकन"
  ],
  "metric": [
   "Supported symbolic occupants",
   "समर्थित प्रतीकात्मक निवासी"
  ],
  "note": [
   "Each invented occupant needs one food and one shelter token; not a population prediction.",
   "हर काल्पनिक निवासी को एक भोजन और एक आश्रय टोकन चाहिए; जनसंख्या अनुमान नहीं।"
  ],
  "fields": [
   {
    "id": "food",
    "label": [
     "Food tokens",
     "भोजन टोकन"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4,
     5,
     6,
     7,
     8
    ],
    "initial": 5
   },
   {
    "id": "shelter",
    "label": [
     "Shelter tokens",
     "आश्रय टोकन"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4,
     5,
     6,
     7,
     8
    ],
    "initial": 3
   }
  ]
 },
 "plant-water-tokens": {
  "subject": "biology",
  "grade": 5,
  "title": [
   "Plant water token accounting",
   "पौधे के जल टोकन की गणना"
  ],
  "metric": [
   "Remaining tokens",
   "शेष टोकन"
  ],
  "note": [
   "Invented bookkeeping only, not a transport rate or plant care advice.",
   "केवल काल्पनिक हिसाब, परिवहन दर या पौध देखभाल सलाह नहीं।"
  ],
  "fields": [
   {
    "id": "input",
    "label": [
     "Input tokens",
     "आए टोकन"
    ],
    "options": [
     4,
     5,
     6,
     7,
     8,
     9
    ],
    "initial": 6
   },
   {
    "id": "transfer",
    "label": [
     "Transferred tokens",
     "स्थानांतरित टोकन"
    ],
    "options": [
     0,
     1,
     2,
     3,
     4
    ],
    "initial": 2
   }
  ]
 }
};
const calculate={"signed-sum":v=>v.a+v.b,"data-range":v=>Math.max(v.a,v.b,v.c)-Math.min(v.a,v.b,v.c),"ideal-pressure":v=>v.force/v.area,"ideal-momentum":v=>v.mass*v.velocity,"mixture-count":v=>v.a+v.b,"formula-ratio":v=>2*v.units*v.copies,"habitat-tokens":v=>Math.min(v.food,v.shelter),"plant-water-tokens":v=>v.input-v.transfer};
export const COMPARISON_IDS=Object.freeze(Object.keys(D));
export const DIRECTIONS=Object.freeze(['lower','same','higher']);
const langIndex=l=>{if(!['en','hi'].includes(l))throw Error('Unknown language');return l==='hi'?1:0};
const def=id=>{if(!COMPARISON_IDS.includes(id))throw Error('Unknown model');return D[id]};
const flags=()=>({humanReviewed:false,gradeVerified:false,storesStudentData:false,publicReleaseApproved:false});
export function comparisonDefinition(id,lang='en'){
 const d=def(id),i=langIndex(lang);
 return {id,subject:d.subject,proposedGrade:d.grade,title:d.title[i],note:d.note[i],metric:d.metric[i],fields:d.fields.map(f=>({id:f.id,label:f.label[i],options:[...f.options],initial:f.initial})),...flags()};
}
export function comparisonInitial(id){return Object.fromEntries(def(id).fields.map(f=>[f.id,f.initial]))}
export function comparisonValue(id,v,lang='en'){
 const d=def(id),i=langIndex(lang);
 if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==d.fields.length||d.fields.some(f=>!Object.hasOwn(v,f.id)||!f.options.includes(v[f.id])))throw Error('Invalid controls');
 const metric=calculate[id](v),rows=d.fields.map(f=>({label:f.label[i],value:v[f.id]}));
 if(id==='formula-ratio')rows.push({label:i?'B प्रतीक':'B symbols',value:v.units*v.copies});
 if(id==='data-range')rows.push({label:i?'न्यूनतम':'Minimum',value:Math.min(...Object.values(v))},{label:i?'अधिकतम':'Maximum',value:Math.max(...Object.values(v))});
 rows.push({label:d.metric[i],value:metric});
 return {id,metric,rows,...flags()};
}
export function controlledComparison(id,baseline,trial,field,prediction,lang='en'){
 const d=def(id),a=comparisonValue(id,baseline,lang),b=comparisonValue(id,trial,lang);
 const changed=d.fields.filter(f=>baseline[f.id]!==trial[f.id]);
 if(changed.length!==1||changed[0].id!==field||!DIRECTIONS.includes(prediction))throw Error('Change exactly one selected variable and predict');
 const direction=b.metric>a.metric?'higher':b.metric<a.metric?'lower':'same';
 return {id,field,prediction,direction,baseline:a.metric,trial:b.metric,delta:b.metric-a.metric,matched:direction===prediction,...flags()};
}
