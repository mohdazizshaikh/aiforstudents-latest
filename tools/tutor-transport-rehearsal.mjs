/** M123 actual loopback HTTP transport using fixed non-educational fixtures only.
 * No external URL, vendor credentials, arbitrary prompt, production activation or student records.
 */
import {createServer,request as httpRequest} from 'node:http';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {syntheticTutorFixture,verifySyntheticTutorContract,checkDisabledTutorResponse} from './tutor-response-contract.mjs';
import {retrieveSandboxSource} from './tutor-sandbox.mjs';
import {APPROVED_SOURCE_REGISTRY} from './approved-source-retrieval.mjs';
export const TRANSPORT_LIMITS=Object.freeze({requestBytes:800,responseBytes:1024,excerptBytes:250,timeoutMs:800,maxRequests:20});
export const WIRE_CASES=Object.freeze(['match','wrong-citation','extra-claim','extra-field','invalid-json','duplicate-key','wrong-mime','redirect','http-error','oversized-header','oversized-stream','truncated','timeout','wrong-language']);
const flags=()=>({syntheticOnly:true,externalProviderTested:false,remoteEnabled:false,generativeTutorEnabled:false,storesStudentData:false,humanApprovalAuthenticated:false,publicReleaseApproved:false});
const deny=reason=>({status:'unavailable',reason,excerpt:null,citation:null,...flags()});
const exact=(v,ks)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===ks.length&&ks.every(k=>Object.hasOwn(v,k));
const bytes=s=>Buffer.byteLength(s,'utf8');
function fixtureResponse(mode,candidate,res){
 const send=(body,type='application/json',status=200)=>{res.writeHead(status,{'Content-Type':type,'Content-Length':bytes(body),'Cache-Control':'no-store'});res.end(body)};
 switch(mode){
  case 'match':return send(JSON.stringify(candidate));
  case 'wrong-citation':return send(JSON.stringify({...candidate,passageSha256:'0'.repeat(64)}));
  case 'extra-claim':return send(JSON.stringify({...candidate,excerpt:candidate.excerpt+' unsupported'}));
  case 'extra-field':return send(JSON.stringify({...candidate,toolCall:'forbidden'}));
  case 'wrong-language':return send(JSON.stringify({...candidate,language:candidate.language==='en'?'hi':'en'}));
  case 'invalid-json':return send('{not json');
  case 'duplicate-key':return send(JSON.stringify(candidate).slice(0,-1)+',"excerpt":'+JSON.stringify(candidate.excerpt)+'}');
  case 'wrong-mime':return send(JSON.stringify(candidate),'text/html');
  case 'redirect':res.writeHead(302,{Location:'https://example.invalid/never-follow'});return res.end();
  case 'http-error':return send('{}','application/json',503);
  case 'oversized-header':return send('x'.repeat(2048));
  case 'oversized-stream':res.writeHead(200,{'Content-Type':'application/json'});res.write('x'.repeat(800));return res.end('x'.repeat(800));
  case 'truncated':res.writeHead(200,{'Content-Type':'application/json','Content-Length':1000});return res.end('{}');
  case 'timeout':return;
 }
}
function wireRequest(port,secret,payload,timeoutMs){
 return new Promise(resolve=>{
  let done=false,timer,req;
  const finish=(result)=>{if(done)return;done=true;clearTimeout(timer);resolve(result);req?.destroy()};
  req=httpRequest({hostname:'127.0.0.1',port,path:'/fixed-fixture',method:'POST',agent:false,headers:{Authorization:'Bearer '+secret,'Content-Type':'application/json','Content-Length':bytes(payload)}},res=>{
   if(res.statusCode!==200){res.destroy();return finish(deny('HTTP_STATUS'))}
   if(res.headers['content-type']!=='application/json'||res.headers['content-encoding']!==undefined){res.destroy();return finish(deny('RESPONSE_MIME'))}
   const n=res.headers['content-length'];
   if(n!==undefined&&(!/^\d+$/.test(n)||Number(n)>TRANSPORT_LIMITS.responseBytes)){res.destroy();return finish(deny('RESPONSE_LIMIT'))}
   let total=0;const chunks=[];
   res.on('data',chunk=>{total+=chunk.length;if(total>TRANSPORT_LIMITS.responseBytes){finish(deny('RESPONSE_LIMIT'));res.destroy()}else chunks.push(chunk)});
   res.on('aborted',()=>finish(deny('TRANSPORT_FAILURE')));
   res.on('error',()=>finish(deny('TRANSPORT_FAILURE')));
   res.on('end',()=>{
    if(n!==undefined&&total!==Number(n))return finish(deny('TRANSPORT_FAILURE'));
    try{
     const raw=new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)),value=JSON.parse(raw);
     // Canonical compact JSON is the fixed rehearsal wire contract. Reject duplicate keys and ambiguous encodings.
     if(JSON.stringify(value)!==raw)return finish(deny('NONCANONICAL_JSON'));
     finish({status:'wire-response',value});
    }catch{return finish(deny('INVALID_JSON'))}
   });
  });
  req.on('error',()=>finish(deny('TRANSPORT_FAILURE')));
  timer=setTimeout(()=>finish(deny('TIMEOUT')),timeoutMs);
  req.end(payload);
 });
}
export function createTransportRehearsal({timeoutMs=TRANSPORT_LIMITS.timeoutMs,maxRequests=TRANSPORT_LIMITS.maxRequests}={}){
 if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>TRANSPORT_LIMITS.timeoutMs||!Number.isInteger(maxRequests)||maxRequests<1||maxRequests>20)throw Error('Invalid local transport limits');
 let used=0,busy=false,wireCalls=0,closed=false;
 const status=()=>({used,remaining:maxRequests-used,wireCalls,busy,closed,externalSpendInr:0,...flags()});
 async function rehearse(input){
  if(closed)return deny('CLOSED');
  if(!exact(input,['request','scenario'])||!WIRE_CASES.includes(input.scenario))return deny('INVALID_REQUEST');
  const source=retrieveSandboxSource(input.request);
  if(source.status!=='synthetic-source')return source;
  if(busy)return deny('BUSY');if(used>=maxRequests)return deny('QUOTA_EXHAUSTED');
  if(APPROVED_SOURCE_REGISTRY.length!==0)throw Error('Independent approval required');
  const payload=JSON.stringify(source.candidate);
  if(bytes(payload)>TRANSPORT_LIMITS.requestBytes)return deny('INPUT_BUDGET');
  used++;busy=true;
  const secret=randomBytes(32).toString('hex');
  let server;
  try{
   server=createServer({maxHeaderSize:4096,requestTimeout:2000,headersTimeout:2000},async(req,res)=>{
    try{
     if(req.socket.remoteAddress!=='127.0.0.1'||req.method!=='POST'||req.url!=='/fixed-fixture'||req.headers.host!=='127.0.0.1:'+server.address().port||req.headers['content-type']!=='application/json'||req.headers['content-length']!==String(bytes(payload))||req.headers['transfer-encoding']!==undefined||typeof req.headers.authorization!=='string'||!/^Bearer [a-f0-9]{64}$/.test(req.headers.authorization)||!timingSafeEqual(Buffer.from(req.headers.authorization.slice(7),'hex'),Buffer.from(secret,'hex'))){res.writeHead(403);return res.end()}
     let n=0;const chunks=[];for await(const c of req){n+=c.length;if(n>TRANSPORT_LIMITS.requestBytes){res.writeHead(413);res.end();return}chunks.push(c)}
     if(!Buffer.concat(chunks).equals(Buffer.from(payload))){res.writeHead(400);return res.end()}
     wireCalls++;fixtureResponse(input.scenario,source.candidate,res);
    }catch{if(!res.headersSent)res.writeHead(500);res.end()}
   });
   await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
   const r=await wireRequest(server.address().port,secret,payload,timeoutMs);
   if(r.status!=='wire-response')return r;
   const v=r.value;
   if(typeof v?.excerpt==='string'&&bytes(v.excerpt)>TRANSPORT_LIMITS.excerptBytes)return deny('OUTPUT_BUDGET');
   const check=verifySyntheticTutorContract(input.request,v);
   if(!check.contractMatches)return deny(check.reason);
   if(checkDisabledTutorResponse(input.request,v).accepted)throw Error('Unexpected activation');
   const {id,versionHash,language,passageId,passageSha256,excerpt}=v;
   return {status:'synthetic-match',reason:'SYNTHETIC_EXACT_MATCH',excerpt,citation:{id,versionHash,language,passageId,passageSha256},...flags()};
  }catch{return deny('TRANSPORT_FAILURE')}
  finally{if(server?.listening)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections()});busy=false}
 }
 return {status,rehearse,close:()=>{closed=true}};
}
export function transportCatalog(){return {scenarios:[...WIRE_CASES],requests:['en','hi'].map(l=>syntheticTutorFixture(l).request),limits:{...TRANSPORT_LIMITS},...flags()}}
