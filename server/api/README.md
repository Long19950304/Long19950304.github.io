# Course showcase likes and comments API

Dependency-free Python API. One anonymous cookie visitor can like or unlike each game once.

- `GET /api/v1/health`
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
