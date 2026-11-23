"""M24 release ZIP safety guard. Read-only; no upload or deployment."""
from pathlib import Path
from zipfile import ZipFile
from json import dumps
from hashlib import sha256
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT.parent
HOST=OUT/'aiforstudents_hostinger_staging_m30.zip'
SOURCE=OUT/'aiforstudents_m30_source_tests.zip'
BLOCKED_DIRS={'review-evidence','review-packet','safety-handoff','node_modules','.git','__pycache__','.venv','venv'}
BLOCKED_SUFFIXES={'.pem','.key','.p12','.sqlite','.db','.zip','.pyc'}
BLOCKED_NAMES={'CONTENT_REVIEW_QUEUE.jsonl','.env','id_rsa','id_ed25519'}

def private_member(name):
    parts=Path(name).parts
    return (any(p in BLOCKED_DIRS or p.startswith('.env') for p in parts)
            or Path(name).name in BLOCKED_NAMES
            or Path(name).suffix.lower() in BLOCKED_SUFFIXES)

def inspect_zip(file):
    with ZipFile(file) as z:
        names=z.namelist()
        assert z.testzip() is None, f'Corrupt archive: {file.name}'
        forbidden=[x for x in names if private_member(x)]
        assert not forbidden, f'{file.name}: private/unsafe contents: {forbidden}'
        assert all(not Path(x).is_absolute() and '..' not in Path(x).parts for x in names)
        # M27: prove the ZIP bytes match this exact source checkout; do not trust names alone.
        for entry in names:
            source=ROOT/entry
            assert source.is_file(), f'{file.name}: source file missing: {entry}'
            assert sha256(z.read(entry)).digest()==sha256(source.read_bytes()).digest(), \
                f'{file.name}: packaged bytes differ from checkout: {entry}'
        return len(names)

if __name__=='__main__':
    host=inspect_zip(HOST)
    source=inspect_zip(SOURCE)
    with ZipFile(HOST) as z:
        names=z.namelist()
        assert 'index.html' in names and 'service-worker.js' in names and '.htaccess' in names
        assert not any(x.startswith('tests/') or x.startswith('docs/') for x in names)
    print(dumps({'hostingStaticFiles':host,'sourceFiles':source,'privateEvidenceIncluded':False,
                 'sourceHashesVerified':True,'publicReleaseApproved':False},indent=2))
