/** M112 opt-in developer loopback API. Never deploy in static hosting or expose to students. */
import {createServer} from 'node:http';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createPilotStore,PilotInputError} from './pilot-store.mjs';

const MAX_BODY=4096,MAX_URL=512;
class HttpError extends Error{constructor(status){super('Request rejected');this.status=status}}
const fail=status=>{throw new HttpError(status)};
function json(res,status,data){
 const body=JSON.stringify(data);
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'",'Referrer-Policy':'no-referrer','Content-Length':Buffer.byteLength(body)});
 res.end(body);
}
function validAuth(header,token){
 if(typeof header!=='string'||!/^Bearer [a-f0-9]{64}$/.test(header))return false;
 return timingSafeEqual(Buffer.from(header.slice(7),'hex'),Buffer.from(token,'hex'));
}
function query(url,allowed,required=[]){
 const p=url.searchParams,keys=[...p.keys()];
 if(keys.some(k=>!allowed.includes(k)||p.getAll(k).length!==1)||required.some(k=>!p.has(k)))fail(400);
 return Object.fromEntries(p);
}
async function body(req){
 const n=req.headers['content-length'];
 if(req.headers['content-type']!=='application/json'||req.headers['transfer-encoding']!==undefined||typeof n!=='string'||!/^\d+$/.test(n))fail(400);
 if(Number(n)>MAX_BODY)fail(413);
 if(Number(n)<2)fail(400);
 const chunks=[];let count=0;
 for await(const c of req){count+=c.length;if(count>MAX_BODY)fail(413);chunks.push(c)}
 if(count!==Number(n))fail(400);
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{fail(400)}
}
export async function startPilotBackend({port=0,token=randomBytes(32).toString('hex')}={}){
 if(!Number.isInteger(port)||port<0||port>65535||typeof token!=='string'||! /^[a-f0-9]{64}$/.test(token))throw Error('Invalid local configuration');
 const store=createPilotStore();
 const server=createServer({maxHeaderSize:8192,requestTimeout:5000,headersTimeout:5000,keepAliveTimeout:1000},async(req,res)=>{
  try{
   const expectedHost='127.0.0.1:'+server.address().port;
   if(req.socket.remoteAddress!=='127.0.0.1'||req.headers.host!==expectedHost||req.headers.origin!==undefined||req.headers['sec-fetch-site']!==undefined)fail(403);
   if(!validAuth(req.headers.authorization,token))fail(401);
   if(typeof req.url!=='string'||req.url.length>MAX_URL||!req.url.startsWith('/')||req.url.startsWith('//')||req.url.includes('#'))fail(400);
   const u=new URL(req.url,'http://'+expectedHost);
   if(u.host!==expectedHost)fail(400);
   const route=u.pathname,method=req.method;
   if(method!=='PUT'&&(req.headers['transfer-encoding']!==undefined||Number(req.headers['content-length']||0)>0))fail(400);
   if(route==='/v1/health'){
    if(method!=='GET')fail(405);query(u,[]);
    return json(res,200,{status:'ok',schemaVersion:store.version(),syntheticRehearsalOnly:true,generativeTutorEnabled:false,masteryEnabled:false,publicReleaseApproved:false});
   }
   if(route==='/v1/catalog'){
    if(method!=='GET')fail(405);return json(res,200,store.catalog(query(u,['subject','kind','lang'])));
   }
   if(route==='/v1/curriculum'){
    if(method!=='GET')fail(405);
    const q=query(u,['board','grade','subject'],['board','grade','subject']);
    if(!/^(?:[1-9]|1[0-2])$/.test(q.grade))fail(400);
    return json(res,200,store.curriculum({...q,grade:Number(q.grade)}));
   }
   if(route==='/v1/plan'){
    query(u,[]);
    if(method==='GET')return json(res,200,store.getPlan());
    if(method==='DELETE')return json(res,200,store.clearPlan());
    if(method==='PUT')return json(res,200,store.setPlan(await body(req)));
    fail(405);
   }
   fail(404);
  }catch(e){
   if(!res.headersSent)json(res,e instanceof HttpError?e.status:e instanceof PilotInputError?400:500,{error:'Request rejected'});
   else res.end();
   if(!req.complete)req.resume();
  }
 });
 server.maxConnections=8;
 try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{server.removeListener('error',reject);resolve()})})}catch(e){store.close();throw e}
 let closed=false;
 return {url:'http://127.0.0.1:'+server.address().port,token,close:async()=>{if(closed)return;closed=true;await new Promise(resolve=>{server.close(resolve);server.closeAllConnections()});store.close()}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==2||!process.env.AIFS_DEV_TOKEN){console.error('Set a fresh 64-character lowercase hex AIFS_DEV_TOKEN for this adult-only loopback rehearsal.');process.exitCode=1}
 else try{
  const app=await startPilotBackend({port:8787,token:process.env.AIFS_DEV_TOKEN});
  console.log('Adult developer rehearsal only: '+app.url+' (no child access, no storage after exit)');
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exitCode=0});
 }catch{console.error('Local rehearsal startup failed');process.exitCode=1}
}
