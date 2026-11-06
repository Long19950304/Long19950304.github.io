#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
install -d -m 0755 /opt/zhaozhilong-deploy
install -m 0644 pull-release.py /opt/zhaozhilong-deploy/pull-release.py
install -m 0644 zhaozhilong-deploy.service /etc/systemd/system/zhaozhilong-deploy.service
install -m 0644 zhaozhilong-deploy.timer /etc/systemd/system/zhaozhilong-deploy.timer
systemctl daemon-reload
systemctl enable --now zhaozhilong-deploy.timer
systemctl start --no-block zhaozhilong-deploy.service
