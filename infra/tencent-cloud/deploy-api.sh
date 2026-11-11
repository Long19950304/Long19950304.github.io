#!/usr/bin/env bash
# Run as root on the existing host: bash deploy-api.sh REVISION APP_SHA256 [INITIAL_BASE]
set -euo pipefail
revision=${1:?Source revision required}
expected_sha=${2:?API SHA-256 required}
initial_base=${3:-}
[[ "$revision" =~ ^[a-f0-9]{40}$ && "$expected_sha" =~ ^[a-f0-9]{64}$ ]]
[[ -z "$initial_base" || "$initial_base" =~ ^[0-9]{1,6}$ ]]
test "$(id -u)" = 0
api_root=/opt/zhaozhilong-api
state_root=/var/lib/zhaozhilong
config=/etc/systemd/system/zhaozhilong-api.service.d/site-views.conf
backup_dir="/opt/zhaozhilong-deploy/backups/$(date -u +%Y%m%dT%H%M%SZ)-site-views"
stage_dir=$(mktemp -d)
rollback_needed=0
cleanup() {
  if [[ "$rollback_needed" = 1 ]]; then
    cp -a "$backup_dir/app.py" "$api_root/app.py"
    if [[ -f "$backup_dir/site-views.conf" ]]; then
      cp -a "$backup_dir/site-views.conf" "$config"
    elif [[ -f "$backup_dir/config-was-absent" ]]; then
      rm -f "$config"
    fi
    systemctl daemon-reload
    systemctl restart zhaozhilong-api
  fi
  rm -rf "$stage_dir"
}
trap cleanup EXIT
curl -fsSL --connect-timeout 20 --max-time 120 --retry 2 \
  "https://raw.githubusercontent.com/Long19950304/Long19950304.github.io/$revision/server/api/app.py" -o "$stage_dir/app.py"
echo "$expected_sha  $stage_dir/app.py" | sha256sum -c -
python3 - "$stage_dir/app.py" <<'PY'
import sys
compile(open(sys.argv[1]).read(), sys.argv[1], 'exec')
PY
install -d -m 0700 "$backup_dir"
cp -a "$api_root/app.py" "$backup_dir/app.py"
if [[ -f "$config" ]]; then cp -a "$config" "$backup_dir/site-views.conf"; else touch "$backup_dir/config-was-absent"; fi
systemctl stop zhaozhilong-api
rollback_needed=1
python3 - "$state_root/likes.sqlite3" "$backup_dir/likes.sqlite3" <<'PY'
import sqlite3, sys
with sqlite3.connect(sys.argv[1]) as src, sqlite3.connect(sys.argv[2]) as dst:
    src.backup(dst)
    assert dst.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
PY
if [[ -n "$initial_base" ]]; then
  install -d -m 0755 "$(dirname "$config")"
  printf '[Service]\nEnvironment=VISIT_INITIAL_BASE=%s\n' "$initial_base" > "$config"
  chmod 0644 "$config"
fi
install -o zhaozhilong -g zhaozhilong -m 0644 "$stage_dir/app.py" "$api_root/app.py"
systemctl daemon-reload
systemctl start zhaozhilong-api
for attempt in {1..15}; do
  if curl -fsS --max-time 3 http://127.0.0.1:8080/api/v1/site/views > "$stage_dir/views.json"; then break; fi
  sleep 1
done
curl -fsS --max-time 5 http://127.0.0.1:8080/api/v1/health > "$stage_dir/health.json"
python3 - "$state_root/likes.sqlite3" "$backup_dir/likes.sqlite3" "$stage_dir/views.json" "$stage_dir/health.json" <<'PY'
import json, sqlite3, sys
with sqlite3.connect(sys.argv[1]) as current, sqlite3.connect(sys.argv[2]) as backup:
    for table in ('likes', 'comments'):
        before = backup.execute(f'SELECT * FROM {table} ORDER BY rowid').fetchall()
        after = current.execute(f'SELECT * FROM {table} ORDER BY rowid').fetchall()
        assert all(row in after for row in before), f'{table} lost records'
        print(table, 'preserved:', len(before))
    assert current.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
views = json.load(open(sys.argv[3]))
assert views['total'] == views['initial_base'] + views['observed']
assert json.load(open(sys.argv[4]))['ok'] is True
print('Page-view counter ready:', json.dumps(views))
PY
rollback_needed=0
printf 'Backup retained at %s\n' "$backup_dir"
