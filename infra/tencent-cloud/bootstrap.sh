#!/usr/bin/env bash
set -euo pipefail

# Run once on a fresh Ubuntu 22.04/24.04 Tencent Cloud instance as root.
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y nginx python3 certbot python3-certbot-nginx rsync ufw
id -u zhaozhilong >/dev/null 2>&1 || useradd --system --home /opt/zhaozhilong-api --shell /usr/sbin/nologin zhaozhilong
install -d -o zhaozhilong -g zhaozhilong /opt/zhaozhilong-api /var/lib/zhaozhilong /var/www/zhaozhilong.com
install -m 0644 infra/tencent-cloud/nginx.conf /etc/nginx/sites-available/zhaozhilong.com
ln -sf /etc/nginx/sites-available/zhaozhilong.com /etc/nginx/sites-enabled/zhaozhilong.com
rm -f /etc/nginx/sites-enabled/default
install -m 0644 infra/tencent-cloud/zhaozhilong-api.service /etc/systemd/system/zhaozhilong-api.service
systemctl daemon-reload
systemctl enable nginx zhaozhilong-api
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
nginx -t
systemctl restart nginx zhaozhilong-api
cat <<'NEXT'
Bootstrap complete. Before requesting TLS:
  1. Point zhaozhilong.com and www.zhaozhilong.com to this server.
  2. Run: certbot --nginx -d zhaozhilong.com -d www.zhaozhilong.com
  3. Add the GitHub Actions secrets listed in infra/tencent-cloud/README.md.
NEXT
