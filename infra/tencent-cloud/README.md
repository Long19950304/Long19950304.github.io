# Tencent Cloud deployment notes

Target: Ubuntu 22.04/24.04, Nginx, Python 3, systemd, and SQLite.

1. Create a 2 vCPU / 2 GB overseas Lighthouse instance with a 40 GB disk.
2. Add an SSH public key. Open TCP 22, 80, and 443 only.
3. Point `www.zhaozhilong.com` and `zhaozhilong.com` to the server IP after the first deployment.
4. Install Nginx and Certbot; copy `nginx.conf` to `/etc/nginx/sites-available/zhaozhilong.com`, enable it, then run `certbot --nginx -d zhaozhilong.com -d www.zhaozhilong.com`.
5. Copy `server/api` to `/opt/zhaozhilong-api`, install `zhaozhilong-api.service`, create the `zhaozhilong` user and `/var/lib/zhaozhilong`, then enable the service.
6. Add GitHub Actions secrets documented in `.github/workflows/deploy-tencent.yml` and run the workflow manually.

Keep GitHub Pages active until the Tencent site passes link and mobile checks. Switch DNS only after that check.

## GitHub Actions secrets

Create these repository secrets before running `Deploy to Tencent Cloud`:

- `TENCENT_HOST`: server public IP or deploy hostname
- `TENCENT_USER`: SSH user with permission to write the web root and restart services
- `TENCENT_SSH_KEY`: private key matching the server's authorized public key
- `TENCENT_PORT` (optional, defaults to `22`)
- `TENCENT_WEB_ROOT` (optional, defaults to `/var/www/zhaozhilong.com`)
