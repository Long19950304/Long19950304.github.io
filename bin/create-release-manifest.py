#!/usr/bin/env python3
"""Describe the exact static build that Tencent Cloud should deploy."""
import argparse
import hashlib
import json
import re
from pathlib import Path


def create(site, revision):
    if not re.fullmatch(r'[0-9a-f]{40}', revision):
        raise ValueError('A full source commit is required')
    files = {}
    for path in sorted(site.rglob('*')):
        if path.is_symlink():
            raise ValueError(f'Symlinks are not allowed: {path}')
        if path.is_file() and path.relative_to(site).as_posix() != 'release.json':
            files[path.relative_to(site).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    for required in ['index.html', 'zh/index.html', 'publications/index.html', 'zh/publications/index.html']:
        if required not in files:
            raise ValueError(f'Missing required page: {required}')
    for private in ['server/', 'infra/', '_audit/', '.git/', 'bin/']:
        if any(name.startswith(private) for name in files):
            raise ValueError(f'Private directory in build: {private}')
    manifest = {'schema': 1, 'source_revision': revision, 'files': files}
    (site / 'release.json').write_text(json.dumps(manifest, sort_keys=True, separators=(',', ':')) + '\n')
    print(f'Release {revision}: {len(files)} verified files')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('site', type=Path)
    parser.add_argument('revision')
    args = parser.parse_args()
    create(args.site, args.revision)
