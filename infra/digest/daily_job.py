#!/usr/bin/env python3
"""launchd entry point: catch up after sleep, with bounded retries and no overlap."""
import datetime as dt
import fcntl
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from zoneinfo import ZoneInfo

SSD = Path('/Volumes/longssd')
BASE = SSD / 'WorkData/ResearchData/zhaozhilong-digest'


def run():
    print('Digest scheduler started', flush=True)
    if not SSD.is_mount():
        print('Digest scheduler: external SSD is not mounted', flush=True)
        return 1
    now = dt.datetime.now(ZoneInfo('Asia/Shanghai'))
    if now.hour < 8: return 0
    day = now.date().isoformat()
    work = BASE / 'runs' / day
    with (BASE / 'scheduler.lock').open('w') as lock:
        try: fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError: return 0
        if (work / 'published.json').exists():
            print(f'{day}: already published; skipped', flush=True)
            return 0
        attempts_path = BASE / 'scheduler-attempts.json'
        attempts = json.loads(attempts_path.read_text()) if attempts_path.exists() else {}
        if attempts.get('date') != day: attempts = {'date': day, 'attempts': 0}
        if attempts['attempts'] >= 3:
            print(f'{day}: daily retry budget exhausted; inspect runs/{day}/status.json', flush=True)
            return 1
        attempts['attempts'] += 1
        attempts_path.write_text(json.dumps(attempts) + '\n')
        repo = BASE / 'publisher'
        print(f'{now.isoformat()}: daily attempt {attempts["attempts"]}', flush=True)
        # This dedicated checkout contains no user work. Rebase a previous locally
        # committed edition if an interrupted push coincided with another site edit.
        subprocess.run(['git', '-C', str(repo), 'pull', '--rebase', 'origin', 'main'], check=True, timeout=180)
        uv = shutil.which('uv') or str(Path.home() / '.local/bin/uv')
        return subprocess.run([uv, 'run', '--with', 'feedparser==6.0.14', '--with', 'pyyaml==6.0.3',
                               'python', str(repo / 'bin/digest_daily.py'), 'run', '--resume', '--publish'],
                              cwd=repo, timeout=3600).returncode


if __name__ == '__main__':
    try: sys.exit(run())
    except Exception as exc:
        print('Digest scheduler failed: ' + str(exc), file=sys.stderr)
        sys.exit(1)
