#!/usr/bin/env python3
"""Pull verified public static releases; never touch the API or its SQLite data."""
import argparse
import fcntl
import hashlib
import json
import os
import re
import shutil
import subprocess
import tarfile
import tempfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from urllib.request import Request, urlopen

REPOSITORY = 'Long19950304/Long19950304.github.io'
REQUIRED = ['index.html', 'zh/index.html', 'publications/index.html', 'zh/publications/index.html']
PRIVATE = {'server', 'infra', '_audit', '.git', '.github', 'bin'}


def download(url, destination=None):
    request = Request(url, headers={'User-Agent': 'zhaozhilong-site-deployer/1', 'Cache-Control': 'no-cache'})
    with urlopen(request, timeout=60) as response:
        if destination:
            with destination.open('wb') as target:
                shutil.copyfileobj(response, target)
        else:
            return response.read()


def safe_path(name):
    path = PurePosixPath(name)
    return bool(name) and not path.is_absolute() and '..' not in path.parts and path.parts[0] not in PRIVATE


def verify(site):
    manifest = json.loads((site / 'release.json').read_text())
    assert manifest['schema'] == 1, 'Unsupported manifest schema'
    assert re.fullmatch('[0-9a-f]{40}', manifest['source_revision']), 'Invalid source commit'
    files = manifest['files']
    assert all(name in files for name in REQUIRED), 'Missing required pages'
    actual = {p.relative_to(site).as_posix() for p in site.rglob('*') if p.is_file()} - {'release.json'}
    assert actual == set(files), 'Manifest does not match archive contents'
    for name, digest in files.items():
        assert safe_path(name) and re.fullmatch('[0-9a-f]{64}', digest), f'Invalid manifest entry: {name}'
        path = site / name
        assert not path.is_symlink() and hashlib.sha256(path.read_bytes()).hexdigest() == digest, f'Checksum mismatch: {name}'
    return manifest


def atomic_copy(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + '.deploying')
    shutil.copyfile(source, temporary)
    temporary.chmod(0o644)
    os.replace(temporary, target)


def apply_release(site, root, state, commit, probe=True):
    manifest = verify(site)
    previous_path = state / 'deployed.json'
    previous = json.loads(previous_path.read_text()) if previous_path.exists() else {}
    # Only previously managed files can be removed; existing unrelated files remain.
    desired = set(manifest['files']) | {'release.json'}
    obsolete = set(previous.get('files', {})) - desired
    changed = [name for name in desired if not (root / name).is_file() or hashlib.sha256((root / name).read_bytes()).digest() != hashlib.sha256((site / name).read_bytes()).digest()]
    backup = state / 'backups' / (datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '-' + commit[:12])
    backup.mkdir(parents=True)
    existing = []
    for name in set(changed) | obsolete:
        assert safe_path(name), f'Unsafe managed path: {name}'
        target = root / name
        assert not target.is_symlink(), f'Symlink in web root: {name}'
        assert root.resolve() in target.resolve().parents, f'Path outside web root: {name}'
        if target.exists():
            saved = backup / name
            saved.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target, saved)
            existing.append(name)
    (backup / 'operations.json').write_text(json.dumps({'changed': changed, 'removed': sorted(obsolete), 'existing': existing}))
    try:
        # Assets first, HTML next, the public version marker last.
        for name in sorted(changed, key=lambda n: (n == 'release.json', n.endswith('.html'), n)):
            atomic_copy(site / name, root / name)
        for name in obsolete:
            (root / name).unlink(missing_ok=True)
        if probe:
            for name in REQUIRED:
                response = subprocess.check_output(['curl', '-fsS', '--max-time', '20', '--resolve', 'www.zhaozhilong.com:443:127.0.0.1', 'https://www.zhaozhilong.com/' + name.removesuffix('index.html')])
                assert hashlib.sha256(response).hexdigest() == manifest['files'][name], f'HTTP content mismatch: {name}'
            assert json.loads(download('http://127.0.0.1:8080/api/v1/health'))['ok'], 'API health check failed'
    except Exception:
        for name in set(changed) | obsolete:
            if name in existing:
                atomic_copy(backup / name, root / name)
            else:
                (root / name).unlink(missing_ok=True)
        raise
    manifest['build_commit'] = commit
    manifest['deployed_at'] = datetime.now(timezone.utc).isoformat()
    temporary = state / 'deployed.json.tmp'
    temporary.write_text(json.dumps(manifest))
    os.replace(temporary, previous_path)
    print(f'Deployed source {manifest["source_revision"]}; build {commit}; changed {len(changed)}, removed {len(obsolete)}; backup {backup}', flush=True)


def run(root, state):
    state.mkdir(parents=True, exist_ok=True)
    with (state / 'deploy.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print('Deployment already running', flush=True)
            return
        commit = json.loads(download(f'https://api.github.com/repos/{REPOSITORY}/commits/gh-pages'))['sha']
        assert re.fullmatch('[0-9a-f]{40}', commit)
        previous = state / 'deployed.json'
        if previous.exists() and json.loads(previous.read_text()).get('build_commit') == commit:
            print('Already current: ' + commit, flush=True)
            return
        with tempfile.TemporaryDirectory(prefix='release-', dir=state) as temporary:
            stage = Path(temporary)
            archive = stage / 'site.tar.gz'
            download(f'https://codeload.github.com/{REPOSITORY}/tar.gz/{commit}', archive)
            site = stage / 'site'
            site.mkdir()
            with tarfile.open(archive) as tar:
                for member in tar.getmembers():
                    name = '/'.join(PurePosixPath(member.name).parts[1:])
                    if not name:
                        continue
                    assert safe_path(name) and not member.issym() and not member.islnk(), f'Unsafe archive member: {name}'
                    target = site / name
                    if member.isdir():
                        target.mkdir(parents=True, exist_ok=True)
                    else:
                        assert member.isfile(), f'Unsupported archive member: {name}'
                        target.parent.mkdir(parents=True, exist_ok=True)
                        with tar.extractfile(member) as source, target.open('wb') as destination:
                            shutil.copyfileobj(source, destination)
            manifest = verify(site)
            current = json.loads(download(f'https://api.github.com/repos/{REPOSITORY}/commits/main'))['sha']
            if manifest['source_revision'] != current:
                print('Newer source is building; keeping current production release', flush=True)
                return
            apply_release(site, root, state, commit)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--web-root', type=Path, default=Path('/var/www/zhaozhilong.com'))
    parser.add_argument('--state-dir', type=Path, default=Path('/opt/zhaozhilong-deploy'))
    args = parser.parse_args()
    run(args.web_root, args.state_dir)
