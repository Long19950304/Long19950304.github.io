# Tencent Cloud production deployment

The public domain runs on the existing Hong Kong Lighthouse instance. GitHub Actions builds Jekyll and publishes `gh-pages`; the server checks for a new build every two minutes. No inbound SSH connection or repository deploy secret is required.

## How a release reaches production

1. Push to `main` (or run `Deploy site` manually). Jekyll builds and CSS is processed.
2. `bin/create-release-manifest.py` records the source revision and SHA-256 of every generated file in `release.json`.
3. `zhaozhilong-deploy.timer` fetches the immutable `gh-pages` commit, verifies the archive and every checksum, and rejects a build if newer source is still building.
4. Changed static files are backed up under `/opt/zhaozhilong-deploy/backups/`; assets are installed before HTML. Only files managed by a previous release can be removed. The version marker is written last.
5. The server checks the main pages through local HTTPS and checks API health. Failure restores the changed files. A separate GitHub workflow waits for the public version marker and reports whether production reached the expected revision.

The deployer only writes `/var/www/zhaozhilong.com` and its own deployment state. It does not replace API code, SQLite data, Nginx configuration, or the other movie website. API changes require a separate backed-up deployment.

## API updates and page-view counter

`deploy-api.sh REVISION APP_SHA256 [INITIAL_BASE]` installs the API from a pinned
source revision after verifying its SHA-256. Run it as root on the existing host.
It stops the API briefly, backs up its application, optional counter configuration
and complete SQLite database, then verifies API health, the counter response,
database integrity and retention of all original likes and comments. A failure
restores the previous application and configuration; the database is never reset.
Backups stay in `/opt/zhaozhilong-deploy/backups/`.

The optional initial base must be selected before the new API first starts. It is
stored once, separately from observed page views. The footer displays the combined
total; the base is not measured historical traffic. Omit it for a counter starting at zero.
Static builds cannot modify either stored number. See `server/api/README.md` for
counting semantics. Verify `GET /api/v1/site/views` without incrementing production
counts; exercise mutations against temporary databases in the integration tests.

Checks: `python3 -m unittest discover -s server/api -p test_app.py -v` and
`node --test infra/tencent-cloud/test_site_views.cjs`.

## One-time setup

Copy this directory to the server, inspect it, then run:

```sh
sudo bash install-auto-deploy.sh
```

The service is installed at `/opt/zhaozhilong-deploy/pull-release.py`. Installing a new copy of this script is a separate maintenance action; web releases cannot update the privileged deployer automatically.

## Status and recovery

```sh
systemctl status zhaozhilong-deploy.timer
journalctl -u zhaozhilong-deploy.service -n 30 --no-pager
sudo systemctl start zhaozhilong-deploy.service
curl -fsS https://www.zhaozhilong.com/release.json
```

A failed checksum, download or health check leaves the previous release in place; the timer retries on its next run. If the public version does not advance, inspect the journal rather than treating a successful GitHub Pages build as production deployment success. Backups include `operations.json` with the changed, removed and previously existing files. Backups are retained for manual review; monitor disk use before pruning them.
