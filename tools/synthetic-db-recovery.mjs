/** M119 fixed fictional database rehearsal. No arbitrary input paths, production DB or student records. */
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,rmSync,readFileSync,copyFileSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const digest=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const version=db=>db.prepare('PRAGMA user_version').get().user_version;
const rows=db=>db.prepare('SELECT id,title FROM draft ORDER BY id').all().map(x=>({...x}));
const invariant=db=>{if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||db.prepare('PRAGMA foreign_key_check').all().length)throw Error('Integrity failure')};
function migrate(db,{fail=false}={}){
 if(version(db)!==1)throw Error('Unexpected schema');
 db.exec('BEGIN IMMEDIATE');
 try{
  db.exec("ALTER TABLE draft ADD COLUMN review_state TEXT NOT NULL DEFAULT 'PENDING' CHECK(review_state='PENDING'); CREATE TABLE draft_link(id TEXT PRIMARY KEY REFERENCES draft(id), kind TEXT NOT NULL CHECK(kind='SYNTHETIC')); INSERT INTO draft_link SELECT id,'SYNTHETIC' FROM draft;");
  if(fail)throw Error('Injected migration failure');
  db.exec('PRAGMA user_version=2; COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e}
}
function rollback(db){
 if(version(db)!==2)throw Error('Unexpected schema');
 db.exec('BEGIN IMMEDIATE');
 try{db.exec('DROP TABLE draft_link; ALTER TABLE draft DROP COLUMN review_state; PRAGMA user_version=1; COMMIT')}catch(e){db.exec('ROLLBACK');throw e}
}
export function rehearseDatabaseRecovery(){
 const dir=mkdtempSync(join(tmpdir(),'aifs-m119-')),source=join(dir,'fixture.sqlite'),backup=join(dir,'backup.sqlite'),restored=join(dir,'restored.sqlite');
 let db;
 try{
  db=new DatabaseSync(source);db.exec("PRAGMA foreign_keys=ON; CREATE TABLE draft(id TEXT PRIMARY KEY,title TEXT NOT NULL) STRICT; INSERT INTO draft VALUES('fictional-a','Synthetic A'),('fictional-b','Synthetic B'); PRAGMA user_version=1;");
  invariant(db);const initial=rows(db);
  db.close();db=null;copyFileSync(source,backup);const backupHash=digest(backup);
  db=new DatabaseSync(source);db.exec('PRAGMA foreign_keys=ON');
  let injectedFailure=false;try{migrate(db,{fail:true})}catch(e){if(e.message!=='Injected migration failure')throw e;injectedFailure=true}
  invariant(db);const failureAtomic=injectedFailure&&version(db)===1&&JSON.stringify(rows(db))===JSON.stringify(initial)&&!db.prepare("SELECT name FROM sqlite_master WHERE name='draft_link'").get()&&!db.prepare('PRAGMA table_info(draft)').all().some(x=>x.name==='review_state');
  migrate(db);invariant(db);const migratedVersion=version(db),pending=db.prepare("SELECT count(*) AS n FROM draft WHERE review_state='PENDING'").get().n,links=db.prepare('SELECT count(*) AS n FROM draft_link').get().n;
  rollback(db);invariant(db);const rollbackPreserved=version(db)===1&&JSON.stringify(rows(db))===JSON.stringify(initial)&&!db.prepare('PRAGMA table_info(draft)').all().some(x=>x.name==='review_state');
  db.close();db=null;
  if(digest(backup)!==backupHash)throw Error('Backup modified');
  copyFileSync(backup,restored);const byteIdentical=digest(restored)===backupHash,backupBytes=statSync(backup).size;
  db=new DatabaseSync(restored,{readOnly:true});invariant(db);
  const restorePreserved=version(db)===1&&JSON.stringify(rows(db))===JSON.stringify(initial);
  const valid=failureAtomic&&migratedVersion===2&&pending===2&&links===2&&rollbackPreserved&&byteIdentical&&restorePreserved;
  return {schema:'aifs-m119-recovery-v1',valid,fixtureRows:2,initialVersion:1,migratedVersion,pending,links,failureAtomic,rollbackPreserved,restorePreserved,byteIdentical,backupBytes,syntheticOnly:true,productionMigrationTested:false,storesStudentData:false,publicReleaseApproved:false};
 }finally{if(db)db.close();rmSync(dir,{recursive:true,force:true})}
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 if(process.argv.length!==2){console.error('Fixed synthetic rehearsal only');process.exitCode=1}
 else{const r=rehearseDatabaseRecovery();console.log(JSON.stringify(r,null,2));if(!r.valid)process.exitCode=1}
}
