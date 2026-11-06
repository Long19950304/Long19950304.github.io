#!/usr/bin/env python3
"""Install the already-authorized daily digest job using an isolated SSD checkout."""
import os
from pathlib import Path
import plistlib
import shutil
import subprocess

SSD = Path('/Volumes/longssd')
BASE = SSD / 'WorkData/ResearchData/zhaozhilong-digest'
LABEL = 'com.longnewmini.zhaozhilong-digest'


def install():
    if not SSD.is_mount(): raise RuntimeError('External SSD is not mounted')
    BASE.mkdir(parents=True, exist_ok=True)
    repo = BASE / 'publisher'
    if not repo.exists():
        subprocess.run(['git', 'clone', '--single-branch', '--branch', 'main',
                        'git@github.com:Long19950304/Long19950304.github.io.git', str(repo)], check=True)
    (BASE / 'logs').mkdir(exist_ok=True)
    # Keep a small stable launcher on the internal disk so an unmounted SSD does
    # not cause launchd to recreate /Volumes/longssd or write data internally.
    launcher = Path.home() / 'Library/Application Support/zhaozhilong-digest'
    launcher.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(Path(__file__).with_name('daily_job.py'), launcher / 'daily_job.py')
    logs = Path.home() / 'Library/Logs/zhaozhilong-digest'
    logs.mkdir(parents=True, exist_ok=True)
    plist = {'Label': LABEL,
             'ProgramArguments': ['/usr/bin/python3', str(launcher / 'daily_job.py')],
             'EnvironmentVariables': {'PATH': f'{Path.home()}/.local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin'},
             'StartCalendarInterval': {'Hour': 8, 'Minute': 0}, 'StartInterval': 1800,
             'RunAtLoad': True, 'ProcessType': 'Background',
             'StandardOutPath': str(logs / 'stdout.log'),
             'StandardErrorPath': str(logs / 'stderr.log')}
    dest = Path.home() / 'Library/LaunchAgents' / (LABEL + '.plist')
    dest.write_bytes(plistlib.dumps(plist))
    domain = 'gui/' + str(os.getuid())
    subprocess.run(['launchctl', 'bootout', domain + '/' + LABEL], capture_output=True)
    subprocess.run(['launchctl', 'bootstrap', domain, str(dest)], check=True)
    print(f'Installed {LABEL}: 08:00 Asia/Shanghai, catch-up every 30 minutes after 08:00, at most 3 attempts/day')


if __name__ == '__main__': install()
