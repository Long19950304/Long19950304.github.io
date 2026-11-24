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
- `POST /api/v1/games/{game_id}/comments` — JSON `{"text":"..."}`; new comments always display as anonymous
- `DELETE /api/v1/games/{game_id}/comments/{id}` — the visitor can delete their own comment


All public writes require a work in `public_works.json`. Existing comments keep their attribution.
New comments are limited to 600 characters. The server sends only the comment text to MiniMax, and stores it
only after explicit approval. Refusals and provider errors are not published. Independent per-visitor,
per-network and global review limits apply before the model call, including to rejected attempts.
Add backend-only `MINIMAX_MODERATION_KEY` and `COURSEWORK_GATE_KEY` as a root-owned systemd
environment file. The studio uses the same gate credential for its loopback review requests.
Never put these values in the repository or browser. Keep the public work manifest in sync with the teaching galleries.

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
footer displays the combined total. The configured base is not measured historical
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
