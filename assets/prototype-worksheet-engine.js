/** M121 original paper-only draft prompts, no real substances, names, answers or score export. */
import {prototypeChoices,PROTOTYPE_KEYS} from './extended-lab-catalog.js';
const PROMPTS={
 "polygon-sides": {
  "en": [
   "Sketch a triangle and a hexagon. Label each straight side.",
   "Count sides and vertices for each. What changes?",
   "Sketch a closed shape with five straight sides. Explain your count."
  ],
  "hi": [
   "त्रिभुज और षट्भुज बनाएँ। हर सीधी भुजा चिह्नित करें।",
   "दोनों की भुजाएँ और शीर्ष गिनें। क्या बदलता है?",
   "पाँच सीधी भुजाओं वाली बंद आकृति बनाएँ। अपनी गिनती समझाएँ।"
  ]
 },
 "equal-groups": {
  "en": [
   "Draw three groups of four counters.",
   "Draw five groups of four counters. Write both totals as repeated addition.",
   "Explain what stayed the same and what changed."
  ],
  "hi": [
   "चार-चार गिनतियों के तीन समूह बनाएँ।",
   "चार-चार गिनतियों के पाँच समूह बनाएँ। दोनों योग बार-बार जोड़कर लिखें।",
   "बताएँ क्या समान रहा और क्या बदला।"
  ]
 },
 "decimal-hundredths": {
  "en": [
   "Draw a 10 by 10 grid; shade 23 cells.",
   "Shade 35 cells in a second identical grid. Write each as a fraction out of 100 and as a decimal.",
   "Which shows more of the same whole? Explain."
  ],
  "hi": [
   "10 गुणा 10 खाने बनाएँ; 23 खाने रंगें।",
   "दूसरे समान ग्रिड में 35 खाने रंगें। दोनों को 100 के हर वाले भिन्न और दशमलव में लिखें।",
   "कौन उसी पूर्ण का अधिक भाग दिखाता है? समझाएँ।"
  ]
 },
 "cube-volume": {
  "en": [
   "Draw two layers of three rows of two unit cubes as separate grids.",
   "Draw three such layers. Count the cubes in each stack.",
   "Explain how a layer count relates to the total."
  ],
  "hi": [
   "दो-दो इकाई घनों की तीन पंक्तियों वाली दो परतें अलग ग्रिड में बनाएँ।",
   "ऐसी तीन परतें बनाएँ। दोनों ढेरों के घन गिनें।",
   "समझाएँ कि परतों की संख्या कुल से कैसे जुड़ती है।"
  ]
 },
 "signed-sum": {
  "en": [
   "On a number line start at 2 and move three steps left. Predict the endpoint.",
   "Repeat from 2 with four steps right. Record both endpoints.",
   "Explain how the sign changes the direction."
  ],
  "hi": [
   "संख्या रेखा पर 2 से शुरू करें और तीन कदम बाएँ जाएँ। अंतिम बिंदु का अनुमान करें।",
   "2 से चार कदम दाएँ जाएँ। दोनों अंतिम बिंदु लिखें।",
   "बताएँ चिह्न से दिशा कैसे बदलती है।"
  ]
 },
 "data-range": {
  "en": [
   "Order the numbers 1, 3, 5. Find their range.",
   "Replace 3 with 4; find the range again.",
   "Explain why changing a middle value may not change the range."
  ],
  "hi": [
   "1, 3, 5 को क्रम में लिखें। उनका परिसर निकालें।",
   "3 की जगह 4 रखें; फिर परिसर निकालें।",
   "समझाएँ बीच का मान बदलने पर परिसर क्यों समान रह सकता है।"
  ]
 },
 "ideal-pressure": {
  "en": [
   "For symbolic force 12 and area 2, predict and calculate force divided by area.",
   "Keep force at 12; change area to 4. Compare the two results.",
   "Explain the effect of area in this ideal arithmetic model only."
  ],
  "hi": [
   "प्रतीकात्मक बल 12 और क्षेत्रफल 2 के लिए बल भाग क्षेत्रफल का अनुमान और गणना करें।",
   "बल 12 रखें; क्षेत्रफल 4 करें। दोनों परिणामों की तुलना करें।",
   "केवल इस आदर्श गणितीय मॉडल में क्षेत्रफल का प्रभाव समझाएँ।"
  ]
 },
 "ideal-momentum": {
  "en": [
   "For symbolic mass 2 and signed velocity 3, calculate mass times velocity.",
   "Keep mass 2 and change velocity to −3. Compare signed results.",
   "Explain the sign in this one-dimensional ideal model."
  ],
  "hi": [
   "प्रतीकात्मक द्रव्यमान 2 और चिह्न सहित वेग 3 के लिए दोनों का गुणन करें।",
   "द्रव्यमान 2 रखें और वेग −3 करें। चिह्न सहित परिणामों की तुलना करें।",
   "इस एक-विमीय आदर्श मॉडल में चिह्न का अर्थ समझाएँ।"
  ]
 },
 "mixture-count": {
  "en": [
   "Draw three A tokens and two B tokens mixed together.",
   "Sort the same tokens into two groups. Count before and after.",
   "Explain why the count stays the same. Use paper symbols only."
  ],
  "hi": [
   "तीन A और दो B टोकन मिले हुए बनाएँ।",
   "उन्हीं टोकनों को दो समूहों में छाँटें। पहले और बाद की गिनती लिखें।",
   "बताएँ गिनती समान क्यों रहती है। केवल कागज़ी प्रतीक उपयोग करें।"
  ]
 },
 "formula-ratio": {
  "en": [
   "Write two abstract AAB units. Count A and B symbols.",
   "Write four AAB units. Count both symbol types again.",
   "Explain the fixed A-to-B symbol ratio; this is not a real chemical formula."
  ],
  "hi": [
   "दो काल्पनिक AAB इकाइयाँ लिखें। A और B प्रतीक गिनें।",
   "चार AAB इकाइयाँ लिखें। दोनों प्रकार के प्रतीक फिर गिनें।",
   "निश्चित A और B प्रतीक अनुपात समझाएँ; यह वास्तविक रासायनिक सूत्र नहीं है।"
  ]
 },
 "habitat-tokens": {
  "en": [
   "Draw five food and three shelter tokens. Pair one of each.",
   "Add two shelter tokens; count complete pairs again.",
   "Explain the limiting token type in this invented rule, not a real habitat prediction."
  ],
  "hi": [
   "पाँच भोजन और तीन आश्रय टोकन बनाएँ। एक-एक की जोड़ी बनाएँ।",
   "दो आश्रय टोकन जोड़ें; पूरी जोड़ियाँ फिर गिनें।",
   "इस काल्पनिक नियम में सीमित टोकन का प्रकार समझाएँ, वास्तविक आवास अनुमान नहीं।"
  ]
 },
 "plant-water-tokens": {
  "en": [
   "Draw six input tokens; cross out two transferred tokens.",
   "Start again with six; cross out four. Compare remaining counts.",
   "Explain the subtraction in this invented accounting model, not real plant transport."
  ],
  "hi": [
   "छह आए टोकन बनाएँ; दो स्थानांतरित टोकन काटें।",
   "फिर छह से शुरू करें; चार काटें। शेष गिनतियों की तुलना करें।",
   "इस काल्पनिक हिसाब में घटाव समझाएँ, वास्तविक पौध परिवहन नहीं।"
  ]
 }
};
export const PROTOTYPE_PACK_LIMIT=6;
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===keys.length&&keys.every(k=>Object.hasOwn(o,k));
export function prototypeWorksheet(key,lang='en'){
 const item=prototypeChoices(lang).find(x=>x.key===key);
 if(!item||!Object.hasOwn(PROMPTS,item.id))throw Error('Unknown draft worksheet');
 return {key,language:lang,title:item.title,steps:[...PROMPTS[item.id][lang]],notice:lang==='hi'?'मूल असमीक्षित कागज़ी अभ्यास। कोई वास्तविक प्रयोग, कक्षा अनुमोदन या अंक नहीं। नाम या व्यक्तिगत जानकारी न लिखें।':'Original unreviewed paper exercise. No real experiment, grade approval or scores. Do not write names or personal details.',rightsStatus:'PENDING_INDEPENDENT_REVIEW',humanReviewed:false,gradeVerified:false,publicReleaseApproved:false,storesStudentData:false};
}
export function prototypePack(request){
 if(!exact(request,['language','keys'])||!['en','hi'].includes(request.language)||!Array.isArray(request.keys)||request.keys.length<1||request.keys.length>PROTOTYPE_PACK_LIMIT||new Set(request.keys).size!==request.keys.length||request.keys.some(k=>!PROTOTYPE_KEYS.includes(k)))throw Error('Invalid draft pack');
 return {language:request.language,sheets:request.keys.map(k=>prototypeWorksheet(k,request.language)),rightsStatus:'PENDING_INDEPENDENT_REVIEW',licensedForPublicDistribution:false,publicReleaseApproved:false,storesStudentData:false};
}
export function parseWorksheetLaunch(search){
 const p=new URLSearchParams(search);
 if([...p.keys()].length!==2||p.getAll('prototype').length!==1||p.getAll('lang').length!==1||!PROTOTYPE_KEYS.includes(p.get('prototype'))||!['en','hi'].includes(p.get('lang')))return null;
 return {key:p.get('prototype'),lang:p.get('lang')};
}
