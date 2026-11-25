/** M119 isolated adult-role test authority. No accounts, identity proof, cookies, real authorization or persistence. */
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
const POLICY=Object.freeze({
 reader:Object.freeze(['GET /v1/health','GET /v1/catalog','GET /v1/curriculum','GET /v1/chapter-catalog','GET /v1/prototype-catalog']),
 teacher:Object.freeze(['GET /v1/health','GET /v1/catalog','GET /v1/prototype-catalog','GET /v1/plan','PUT /v1/plan','DELETE /v1/plan','GET /v1/aggregate-rehearsal']),
 reviewer:Object.freeze(['GET /v1/health','GET /v1/chapter-catalog','GET /v1/resource-rehearsal','PUT /v1/resource-rehearsal'])
});
const hash=t=>createHash('sha256').update(t).digest();
export const OPERATOR_ROLES=Object.freeze(Object.keys(POLICY));
export function createOperatorRehearsal({now=Date.now}={}){
 if(typeof now!=='function')throw Error('Invalid clock');
 const sessions=new Map(),limit=12;
 let closed=false;
 function issue(role,ttlMs=60000){
  if(closed||!OPERATOR_ROLES.includes(role)||!Number.isInteger(ttlMs)||ttlMs<1||ttlMs>300000)throw Error('Invalid synthetic session');
  const time=now();if(!Number.isSafeInteger(time)||time<0||!Number.isSafeInteger(time+ttlMs))throw Error('Invalid clock');
  for(const [id,s] of sessions)if(s.expiresAt<=time)sessions.delete(id);
  if(sessions.size>=limit)throw Error('Synthetic session cap');
  const id=randomBytes(16).toString('hex'),secret=randomBytes(32).toString('hex');
  sessions.set(id,{role,hash:hash(secret),expiresAt:time+ttlMs});
  return {id,token:id+'.'+secret,role,expiresAt:time+ttlMs,syntheticOnly:true,realIdentityVerified:false};
 }
 function authorize(header,method,route){
  if(closed||typeof header!=='string'||!/^Bearer [a-f0-9]{32}\.[a-f0-9]{64}$/.test(header))return {authenticated:false,allowed:false};
  const [id,secret]=header.slice(7).split('.'),s=sessions.get(id),time=now();
  if(!s||!Number.isSafeInteger(time)||time<0||time>=s.expiresAt||!timingSafeEqual(hash(secret),s.hash))return {authenticated:false,allowed:false};
  return {authenticated:true,allowed:POLICY[s.role].includes(method+' '+route),role:s.role,syntheticOnly:true};
 }
 function revoke(id){return sessions.delete(id)}
 function close(){closed=true;sessions.clear()}
 return {issue,authorize,revoke,close};
}
