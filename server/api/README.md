# Course showcase likes and comments API

Dependency-free Python API. One anonymous cookie visitor can like or unlike each game once.

- `GET /api/v1/health`
- `GET /api/v1/site/views` — read global page-view totals without incrementing
- `POST /api/v1/site/views` — JSON `{"event_id":"random-per-document-id"}`; one increment per ID, with retries deduplicated for 48 hours
- `GET /api/v1/games/likes`
- `POST /api/v1/games/{game_id}/like`
- `DELETE /api/v1/games/{game_id}/like`
- `GET /api/v1/games/comments` — comment counts by game
- `GET /api/v1/games/{game_id}/comments?before={id}` — latest 20, with an earlier-page cursor
- `POST /api/v1/games/{game_id}/comments` — JSON `{"name":"","text":"..."}`; empty name means anonymous
- `DELETE /api/v1/games/{game_id}/comments/{id}` — the visitor can delete their own comment

Names are limited to 40 characters and comments to 600. Comments are public. The browser renders names and messages as text, including any HTML-like input. Posts are limited to one per 20 seconds per visitor on the same game, and 120 per hour per visitor across games. Different games can be reviewed consecutively. Rate-limit responses report the actual retry time. Nginx supplies the client address; the database stores its hash. No login or student ID is required.

The existing SQLite database gains a comments table automatically; existing likes remain intact. Keep `/var/lib/zhaozhilong` across releases and back up the database with SQLite's backup command before replacing the API. Never place it in the public web root.

Run integration checks with `cd server/api && python3 -m unittest -v`. They use a temporary database.

## Footer page views

The footer records a view when each page document becomes visible. Refreshing or
opening another page creates another view; this measures page views, not unique
people. A back/forward-cache restore of the same document is not a new view. Bots
that do not execute JavaScript, blocked scripts, and network failures are not
counted. No cookie, IP, URL, user identity or external analytics provider is used
by this counter. Only the aggregate and temporary random retry receipts are kept.

`VISIT_INITIAL_BASE` defaults to zero and is applied only when the singleton is
first created in SQLite. If a nonzero initial display base is configured, the
footer visibly identifies it as an initial base rather than measured historical
traffic. Responses expose `observed`, `initial_base`, `total` and `started_at`
separately. Deployments and restarts never reset these numbers. The frontend hides
the counter on failure rather than displaying a made-up fallback total.

Install API changes separately from static releases, backing up the existing
database and application first. Optional service configuration:

```ini
[Service]
Environment=VISIT_INITIAL_BASE=731
```

Set the initial value before starting the updated API for the first time. Changing
that environment variable after initialization cannot overwrite the stored base.
