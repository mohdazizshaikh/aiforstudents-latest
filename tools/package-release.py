"""Build and verify a strictly static Hostinger staging ZIP and source/tests ZIP.
Run from the project root with Python 3. No network or paid dependencies.
Note: ZIP creation does NOT deploy or test the actual Hostinger webserver.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json, sys
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT.parent
HOST=OUT/'aiforstudents_hostinger_staging_m32.zip'
SOURCE=OUT/'aiforstudents_m32_source_tests.zip'
ROOT_DEPLOY={'.htaccess','index.html','service-worker.js','manifest.webmanifest','robots.txt'}
SITE_DIRS={'assets','games','privacy','for-parents','methodology','accessibility','future-explorer','grow-together','study-lab','smart-learning-studio','virtual-experiment-lab','teacher-kit','ai-digital-skills','hi'}
SKIP_SOURCE={'__pycache__','.git','node_modules','.pytest_cache','review-packet','review-evidence','safety-handoff','playwright-report','test-results','.venv','venv'}
SOURCE_SUFFIXES={'.html','.js','.mjs','.py','.md','.json','.jsonl','.css','.svg','.webmanifest','.yml','.yaml','.gz'}
SOURCE_ROOT_FILES={'.htaccess','.gitignore','robots.txt'}

def static_files():
    files=[]
    for p in ROOT.rglob('*'):
        if not p.is_file():continue
        rel=p.relative_to(ROOT)
        if (len(rel.parts)==1 and rel.as_posix() in ROOT_DEPLOY) or (rel.parts[0] in SITE_DIRS and (rel.suffix.lower() in ('.html','.js','.css','.svg','.webmanifest') or rel.name=='robots.txt')):
            files.append(p)
    return sorted(files)

def source_files():
    return sorted(p for p in ROOT.rglob('*') if p.is_file()
                  and not (set(p.relative_to(ROOT).parts)&SKIP_SOURCE)
                  and not p.name.startswith(('.env','preview-'))
                  and (p.suffix.lower() in SOURCE_SUFFIXES or p.name in SOURCE_ROOT_FILES)
                  and p.name not in {'apply_m18.py','finalize_m18.py','create_m18_browser.py'})

def build(files,dest):
    with ZipFile(dest,'w',ZIP_DEFLATED,compresslevel=9) as z:
        for p in files:z.write(p,p.relative_to(ROOT).as_posix())
    with ZipFile(dest) as z:
        names=z.namelist()
        assert len(names)==len(set(names)), 'Duplicate ZIP entries'
        assert all(n and not n.startswith('/') and '..' not in Path(n).parts for n in names), 'Unsafe archive paths'
        assert z.testzip() is None, 'Corrupt ZIP entry'
    return len(files)

if __name__=='__main__':
    h=static_files();s=source_files()
    assert all(p.relative_to(ROOT).as_posix() not in {'CONTENT_REVIEW_QUEUE.jsonl','LAB_CONTENT_REVIEW_QUEUE.jsonl','DIGITAL_CONTENT_REVIEW_QUEUE.jsonl','STUDIO_CONTENT_REVIEW_QUEUE.jsonl'} for p in h)
    assert len(h)>=50 and any(p.relative_to(ROOT).as_posix()=='assets/worksheet-print.js' for p in h)
    assert all(not(set(p.relative_to(ROOT).parts)&SKIP_SOURCE) and not p.name.startswith('.env') for p in s)
    assert len(s)>90 and any(p.relative_to(ROOT).as_posix()=='tools/release-preflight.mjs' for p in s)
    print(json.dumps({'staging':str(HOST),'staticFiles':build(h,HOST),'source':str(SOURCE),'sourceFiles':build(s,SOURCE),'hostingBytes':HOST.stat().st_size,'sourceBytes':SOURCE.stat().st_size},indent=2))