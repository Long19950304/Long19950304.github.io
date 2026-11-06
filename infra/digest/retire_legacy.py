#!/usr/bin/env python3
"""Retire the unscreened legacy digest from public pages, retaining stable URLs.

An existing verified SSD backup is mandatory; this does not rewrite Git history.
"""
import datetime as dt
from pathlib import Path
import tarfile
import yaml

ROOT = Path(__file__).resolve().parents[2]
BACKUP = Path('/Volumes/longssd/WorkData/ResearchData/zhaozhilong-digest/legacy-digest-before-restart-20261106.tar.gz')


def retire():
    if not Path('/Volumes/longssd').is_mount() or not BACKUP.is_file(): raise RuntimeError('Verified external archive required')
    with tarfile.open(BACKUP) as archive:
        names = set(archive.getnames())
        if not {'_digests', '_digests_zh', '_data/digests', 'assets/img/digests'} <= names: raise RuntimeError('Incomplete legacy backup')
    count = 0
    for path in sorted((ROOT / '_data/digests').glob('*.yml')):
        doc = yaml.safe_load(path.read_text())
        if doc.get('edition') == 'daily-audio' or doc.get('archived'): continue
        day = path.stem
        doc = {'date': day, 'archived': True, 'note': 'Legacy edition archived.', 'note_zh': '旧版简报已归档。', 'items': []}
        path.write_text(yaml.safe_dump(doc, allow_unicode=True, sort_keys=False))
        for lang in ('en', 'zh'):
            zh = lang == 'zh'
            prefix = '/zh' if zh else ''
            front = {'layout': 'page', 'title': ('简报档案 · ' if zh else 'Archived digest · ') + day,
                     'lang': lang, 'permalink': f'{prefix}/digest/{day}/', 'digest_date': day,
                     'translation_key': 'digest-' + day, 'page_class': 'digest-page', 'archived': True}
            body = ('这期属于旧版简报，已转入离线历史档案。新版简报提供经筛选的科技与研究进展、中英文音频和原始来源。' if zh else
                    'This legacy edition has moved to the offline historical archive. The renewed digest provides selected technology and research developments, Chinese and English audio, and primary sources.')
            label = '前往新版简报' if zh else 'Visit the renewed digest'
            target = ROOT / ('_digests_zh' if zh else '_digests') / (day + '.md')
            target.write_text('---\n' + yaml.safe_dump(front, allow_unicode=True, sort_keys=False) + '---\n\n' + body + f'\n\n[{label}]({prefix}/digest/)\n')
        count += 1
    # Old cards embed headlines in pixels; they must not remain directly public.
    images = 0
    for path in (ROOT / 'assets/img/digests').glob('*'):
        if path.is_file() and path.suffix.lower() in ('.png', '.webp'):
            path.unlink()
            images += 1
    (ROOT / '_data/digest_weekly.yml').write_text('weeks: []\n')
    print(f'Retired {count} legacy editions and {images} old headline cards; archive retained on SSD')


if __name__ == '__main__': retire()
