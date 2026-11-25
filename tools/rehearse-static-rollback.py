"""M120 local static archive and historical-release rollback rehearsal; never a live deploy."""
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
from hashlib import sha256
from io import BytesIO
import importlib.util
import json
import subprocess
import tarfile
import sys

ROOT=Path(__file__).resolve().parents[1]
BASELINE='0ec46e2947cbabc28c44ee80b36ba9d4544b7dac'
spec=importlib.util.spec_from_file_location('package_release',ROOT/'tools/package-release.py')
pack=importlib.util.module_from_spec(spec)
spec.loader.exec_module(pack)
def digest(b):return sha256(b).hexdigest()
def previous_bytes():
    data=subprocess.check_output(['git','archive','--format=tar',BASELINE],cwd=ROOT)
    out={}
    with tarfile.open(fileobj=BytesIO(data),mode='r:') as t:
        for m in t:
            p=Path(m.name)
            if not m.isfile():continue
            if p.as_posix() in pack.ROOT_DEPLOY or (p.parts[0] in pack.SITE_DIRS and (p.suffix.lower() in ('.html','.js','.css','.svg','.webmanifest') or p.name=='robots.txt')):
                out[p.as_posix()]=t.extractfile(m).read()
    return out
def manifest(files):return {name:digest(data) for name,data in sorted(files.items())}
def tree_manifest(root):return manifest({p.relative_to(root).as_posix():p.read_bytes() for p in root.rglob('*') if p.is_file()})
def write_tree(root,files):
    root.mkdir()
    for name,data in files.items():
        p=root/name
        if not p.resolve().is_relative_to(root):raise ValueError('Unsafe path')
        p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
def run():
    current={p.relative_to(ROOT).as_posix():p.read_bytes() for p in pack.static_files()}
    previous=previous_bytes()
    assert previous and previous['service-worker.js']!=current['service-worker.js']
    expected,old=manifest(current),manifest(previous)
    with TemporaryDirectory(prefix='aifs-m120-') as tmp:
        root=Path(tmp)
        zip_a,zip_b=root/'candidate-a.zip',root/'candidate-b.zip'
        pack.build(pack.static_files(),zip_a);pack.build(pack.static_files(),zip_b)
        reproducible=zip_a.read_bytes()==zip_b.read_bytes()
        with ZipFile(zip_a) as z:
            actual={n:z.read(n) for n in z.namelist()}
        archive_exact=manifest(actual)==expected
        assert not any(n.startswith(('docs/','tools/','tests/','v1/')) for n in actual)
        active,backup,candidate,failed=root/'active',root/'backup',root/'candidate',root/'failed'
        write_tree(active,previous);write_tree(candidate,actual)
        assert tree_manifest(active)==old and tree_manifest(candidate)==expected
        active.rename(backup);candidate.rename(active)
        candidate_verified=tree_manifest(active)==expected
        # Simulate a failed post-switch check and restore the exact historical static tree.
        active.rename(failed);backup.rename(active)
        rollback_verified=tree_manifest(active)==old
        valid=reproducible and archive_exact and candidate_verified and rollback_verified
        return dict(valid=valid,baselineCommit=BASELINE,staticFiles=len(current),baselineFiles=len(previous),archiveBytes=zip_a.stat().st_size,archiveSha256=digest(zip_a.read_bytes()),reproducible=reproducible,archiveExact=archive_exact,candidateVerified=candidate_verified,rollbackVerified=rollback_verified,localTemporaryOnly=True,liveHostingVerified=False,publicReleaseApproved=False)
if __name__=='__main__':
    if len(sys.argv)!=1:raise SystemExit('Fixed local rehearsal only')
    result=run();print(json.dumps(result,indent=2))
    if not result['valid']:raise SystemExit(1)
