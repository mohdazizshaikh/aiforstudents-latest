"""M126: disposable CI MySQL full logical dump/restore. Never run against hosting."""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

SOURCE = "aifs_rehearsal_m125"
RESTORE = "aifs_recovery_m126"
FIXTURE = "m125-ephemeral-root-only"

def run():
    if os.environ.get("GITHUB_ACTIONS") != "true" or os.environ.get("AIFS_MYSQL_REHEARSAL") != "1":
        raise RuntimeError("Disposable GitHub Actions service only")
    cid = os.environ.get("AIFS_MYSQL_SERVICE_CONTAINER", "")
    if not re.fullmatch(r"[a-f0-9]{12,64}", cid):
        raise RuntimeError("Expected exact service container identifier")
    info = json.loads(subprocess.check_output(["docker", "inspect", cid]))
    config = info[0]["Config"]
    # Bind to fixed disposable service image and fixture database, never arbitrary server.
    if config["Image"] != "mysql:8.4" or "MYSQL_DATABASE="+SOURCE not in config["Env"] or "MYSQL_ROOT_PASSWORD="+FIXTURE not in config["Env"]:
        raise RuntimeError("Unexpected service configuration")
    def command(program, args, *, data=None):
        return subprocess.run(["docker", "exec", "-i", "-e", "MYSQL_PWD="+FIXTURE, cid, program, "-uroot", *args],
                              input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, timeout=45).stdout
    def sql(query):
        return command("mysql", ["--batch", "--skip-column-names", "-e", query])
    def dump(db):
        return command("mysqldump", ["--single-transaction", "--no-tablespaces", "--set-gtid-purged=OFF", "--skip-comments", "--skip-dump-date", "--order-by-primary", db])
    def require(condition, label):
        if not condition:
            raise RuntimeError(label)
    def digest(data):
        return hashlib.sha256(data).hexdigest()
    require(sql("SELECT version_number FROM "+SOURCE+".aifs_version WHERE singleton=1").strip()==b"2", "Expected migrated v2 source")
    require(sql("SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='"+RESTORE+"'").strip()==b"0", "Restore target already exists")
    # Dump fixed synthetic source. Never drop, overwrite, or mutate source.
    with tempfile.TemporaryDirectory(prefix="aifs-m126-") as temp:
        data = dump(SOURCE)
        require(0 < len(data) <= 2_000_000, "Unexpected dump size")
        backup=Path(temp)/"fixture.sql"
        fd=os.open(backup,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
        with os.fdopen(fd,"wb") as f:
            f.write(data)
        checksum=digest(data)
        require(digest(backup.read_bytes())==checksum, "Backup checksum mismatch")
        # Use matching schema defaults from this fixed service; restore into a distinct empty schema.
        sql("CREATE DATABASE "+RESTORE+" CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci")
        try:
            command("mysql", [RESTORE], data=backup.read_bytes())
            restored=dump(RESTORE)
            require(restored==data, "Restored logical dump differs")
            require(dump(SOURCE)==data, "Source changed")
            tables=int(sql("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='"+RESTORE+"'").strip())
            require(tables==5,"Unexpected table count")
            require(sql("SELECT version_number FROM "+RESTORE+".aifs_version WHERE singleton=1").strip()==b"2","Restore schema version mismatch")
            require(sql("SELECT COUNT(*) FROM "+RESTORE+".aifs_curriculum").strip()==b"96","Restore curriculum count mismatch")
            require(sql("SELECT COUNT(*) FROM "+RESTORE+".aifs_plan_item").strip()==b"6","Restore plan count mismatch")
            # Prove the restored constraints are operational rather than only trusting DDL text.
            invalid=[
              "UPDATE "+RESTORE+".aifs_activity SET review_state='APPROVED' LIMIT 1",
              "UPDATE "+RESTORE+".aifs_curriculum SET grade=13 LIMIT 1",
              "UPDATE "+RESTORE+".aifs_plan_item SET position=7 WHERE position=1",
              "UPDATE "+RESTORE+".aifs_plan_item SET activity_key='unknown:main' WHERE position=1",
            ]
            for query in invalid:
                try:
                    sql(query)
                except subprocess.CalledProcessError:
                    continue
                raise RuntimeError("Restored constraint accepted invalid fixture")
            require(dump(RESTORE)==data,"Rejected writes changed restored database")
            report={"valid":True,"schemaVersion":2,"tables":tables,"dumpBytes":len(data),"dumpSha256":checksum,"logicalDumpByteParity":True,"sourceUnchanged":True,"restoredConstraintDenials":len(invalid),"physicalBackupVerified":False,"liveHostingVerified":False,"publicReleaseApproved":False,"storesStudentData":False}
        finally:
            sql("DROP DATABASE "+RESTORE)
        require(sql("SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name='"+RESTORE+"'").strip()==b"0","Restore cleanup failed")
    print(json.dumps(report,indent=2))

if __name__=="__main__":
    if len(sys.argv)!=1:
        raise SystemExit("Fixed CI fixture only")
    run()
