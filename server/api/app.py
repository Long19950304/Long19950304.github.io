#!/usr/bin/env python3
"""Persistent likes and comments for course showcases; standard library only."""
import hmac
import json
import os
import re
import secrets
import sqlite3
import time
from pathlib import Path

from moderation import opaque, review, valid_comment
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

DB_PATH = os.environ.get('LIKES_DB', '/var/lib/zhaozhilong/likes.sqlite3')
ORIGIN = os.environ.get('CORS_ORIGIN', 'https://www.zhaozhilong.com')
STUDIO_ORIGIN = 'https://class.zhaozhilong.com'
PUBLIC_WORKS = json.loads(Path(__file__).with_name('public_works.json').read_text())
HOST = os.environ.get('API_HOST', '127.0.0.1')
PORT = int(os.environ.get('API_PORT', '8080'))
COMMENT_INTERVAL = 20
COMMENTS_PER_HOUR = 120
VISIT_INITIAL_BASE = int(os.environ.get('VISIT_INITIAL_BASE', '0'))


def db():
    parent = os.path.dirname(DB_PATH)
    if parent:
        os.makedirs(parent, exist_ok=True)
    con = sqlite3.connect(DB_PATH, timeout=10)
    con.execute('PRAGMA journal_mode=WAL')
    con.executescript("""
        CREATE TABLE IF NOT EXISTS likes (
            game_id TEXT NOT NULL, visitor_id TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (game_id, visitor_id));
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id TEXT NOT NULL, visitor_id TEXT NOT NULL,
            author TEXT NOT NULL, body TEXT NOT NULL,
            created_at INTEGER NOT NULL, client_hash TEXT NOT NULL);
        CREATE INDEX IF NOT EXISTS comments_game ON comments(game_id, id DESC);
        CREATE INDEX IF NOT EXISTS comments_rate ON comments(client_hash, created_at);
        CREATE INDEX IF NOT EXISTS comments_visitor_rate ON comments(visitor_id, created_at);
        CREATE TABLE IF NOT EXISTS site_views (
            singleton INTEGER PRIMARY KEY CHECK (singleton=1),
            initial_base INTEGER NOT NULL CHECK (initial_base>=0),
            observed INTEGER NOT NULL DEFAULT 0 CHECK (observed>=0),
            started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS view_receipts (
            event_id TEXT PRIMARY KEY, created_at INTEGER NOT NULL);
        CREATE INDEX IF NOT EXISTS view_receipts_time ON view_receipts(created_at);
    """)
    con.execute('INSERT OR IGNORE INTO site_views(singleton, initial_base) VALUES (1,?)', (VISIT_INITIAL_BASE,))
    con.commit()
    return con


def cookie(headers):
    for part in headers.get('Cookie', '').split(';'):
        key, _, value = part.strip().partition('=')
        if key == 'visitor_id' and re.fullmatch(r'[A-Za-z0-9_-]{20,80}', value):
            return value
    return None


def view_totals(con):
    base, observed, started = con.execute('SELECT initial_base, observed, started_at FROM site_views WHERE singleton=1').fetchone()
    return {'total': base + observed, 'initial_base': base, 'observed': observed, 'started_at': started + 'Z'}


class Handler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, *args):
        pass

    def allowed_origin(self):
        source = self.headers.get('Origin')
        if source in {ORIGIN, ORIGIN.replace('://www.', '://')}:
            return source
        if source == STUDIO_ORIGIN and urlparse(self.path).path.startswith('/api/v1/games/'):
            return source
        return None

    def send_json(self, status, payload, visitor=None, retry_after=None):
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        for key, value in {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': str(len(body)),
            'Access-Control-Allow-Origin': self.allowed_origin() or ORIGIN,
            'Access-Control-Allow-Credentials': 'true',
            'Vary': 'Origin', 'Cache-Control': 'no-store',
        }.items():
            self.send_header(key, value)
        if visitor:
            self.send_header('Set-Cookie', f'visitor_id={visitor}; Max-Age=31536000; Path=/; Secure; HttpOnly; SameSite=Lax')
        if retry_after is not None:
            self.send_header('Retry-After', str(retry_after))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        for key, value in {
            'Access-Control-Allow-Origin': self.allowed_origin() or ORIGIN,
            'Access-Control-Allow-Credentials': 'true',
            'Vary': 'Origin',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Length': '0',
        }.items():
            self.send_header(key, value)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')
        if path == '/api/v1/health':
            self.send_json(200, {'ok': True})
            return
        con = db()
        try:
            if path == '/api/v1/site/views':
                self.send_json(200, view_totals(con))
                return
            if path in ('/api/v1/games/likes', '/api/v1/games/comments'):
                table = 'likes' if path.endswith('/likes') else 'comments'
                counts = {r[0]: r[1] for r in con.execute(f'SELECT game_id, COUNT(*) FROM {table} GROUP BY game_id')}
                payload = {table: counts}
                if table == 'likes':
                    payload['liked'] = [r[0] for r in con.execute('SELECT game_id FROM likes WHERE visitor_id=?', (cookie(self.headers),))]
                self.send_json(200, payload, visitor=secrets.token_urlsafe(24) if table == 'likes' and not cookie(self.headers) else None)
                return
            match = re.fullmatch(r'/api/v1/games/([^/]+)/comments', path)
            if not match:
                self.send_json(404, {'error': 'not_found'})
                return
            game_id = unquote(match[1])
            try:
                before = int(parse_qs(parsed.query).get('before', [str(2**63 - 1)])[0])
                if not 0 < before <= 2**63 - 1:
                    raise ValueError
            except ValueError:
                self.send_json(400, {'error': 'invalid_cursor'})
                return
            rows = con.execute('SELECT id, author, body, created_at, visitor_id FROM comments WHERE game_id=? AND id<? ORDER BY id DESC LIMIT 21', (game_id, before)).fetchall()
            items = [{'id': r[0], 'name': r[1], 'text': r[2], 'created_at': r[3], 'own': r[4] == cookie(self.headers)} for r in rows[:20]]
            self.send_json(200, {'comments': items, 'next': items[-1]['id'] if len(rows) > 20 else None})
        finally:
            con.close()

    def read_body(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 <= length <= 8192:
                self.close_connection = True
                self.send_json(413, {'error': 'too_large'})
                return None
            value = json.loads(self.rfile.read(length).decode()) if length else {}
            if not isinstance(value, dict):
                raise ValueError
            return value
        except (ValueError, UnicodeDecodeError):
            self.send_json(400, {'error': 'invalid_json'})
            return None

    def mutate(self, add):
        data = self.read_body()
        if data is None:
            return
        origin = self.headers.get('Origin')
        if origin and not self.allowed_origin():
            self.send_json(403, {'error': 'invalid_origin'})
            return
        path = urlparse(self.path).path.rstrip('/')
        if path == '/internal/coursework-review' and add:
            key = os.environ.get('COURSEWORK_GATE_KEY', '')
            supplied = self.headers.get('X-Coursework-Gate', '').encode('utf-8')
            if origin or not key or not hmac.compare_digest(key.encode(), supplied):
                self.send_json(404, {'error': 'not_found'})
                return
            text, peer, actor = (data.get(k) for k in ('text', 'peer', 'actor'))
            if (not valid_comment(text) or not all(isinstance(x, str) and re.fullmatch(r'[a-f0-9]{64}', x)
                                                   for x in (peer, actor))):
                self.send_json(400, {'error': 'invalid_comment'})
                return
            status, code = review(text, peer, actor)
            self.send_json(status, {'error': code} if status != 200 else {'approved': True})
            return
        if path == '/api/v1/site/views' and add:
            event_id = data.get('event_id')
            if not isinstance(event_id, str) or not re.fullmatch(r'[A-Za-z0-9_-]{20,80}', event_id):
                self.send_json(400, {'error': 'invalid_view_event'})
                return
            con = db()
            try:
                now = int(time.time())
                con.execute('BEGIN IMMEDIATE')
                con.execute('DELETE FROM view_receipts WHERE created_at<?', (now - 172800,))
                inserted = con.execute('INSERT OR IGNORE INTO view_receipts(event_id,created_at) VALUES (?,?)', (event_id, now)).rowcount
                if inserted:
                    con.execute('UPDATE site_views SET observed=observed+1 WHERE singleton=1')
                totals = view_totals(con)
                con.commit()
                self.send_json(200, totals)
            finally:
                con.close()
            return
        match = re.fullmatch(r'/api/v1/games/([^/]+)/(like|comments)(?:/(\d+))?', path)
        if not match:
            self.send_json(404, {'error': 'not_found'})
            return
        game_id, action, comment_id = unquote(match[1]), match[2], match[3]
        if game_id not in PUBLIC_WORKS:
            self.send_json(404, {'error': 'invalid_game'})
            return
        visitor = cookie(self.headers) or secrets.token_urlsafe(24)
        con = db()
        try:
            if action == 'like' and not comment_id:
                if add:
                    con.execute('INSERT OR IGNORE INTO likes(game_id, visitor_id) VALUES (?,?)', (game_id, visitor))
                else:
                    con.execute('DELETE FROM likes WHERE game_id=? AND visitor_id=?', (game_id, visitor))
                con.commit()
                count = con.execute('SELECT COUNT(*) FROM likes WHERE game_id=?', (game_id,)).fetchone()[0]
                self.send_json(200, {'game_id': game_id, 'likes': count}, visitor)
            elif action == 'comments' and add and not comment_id:
                text = data.get('text', '')
                if not isinstance(text, str) or not valid_comment(text.strip()):
                    self.send_json(400, {'error': 'invalid_comment'})
                    return
                text = text.strip()
                client_hash = opaque(self.headers.get('X-Real-IP', self.client_address[0]))
                now = int(time.time())
                retry_after, reason = self.comment_wait(con, visitor, game_id, now)
                if retry_after:
                    self.send_json(429, {'error': reason, 'retry_after': retry_after}, visitor, retry_after)
                    return
                status, code = review(text, client_hash, opaque(visitor))
                if status != 200:
                    self.send_json(status, {'error': code}, visitor)
                    return
                # Check again without holding a database lock during model review.
                now = int(time.time())
                con.execute('BEGIN IMMEDIATE')
                retry_after, reason = self.comment_wait(con, visitor, game_id, now)
                if retry_after > 0:
                    con.rollback()
                    self.send_json(429, {'error': reason, 'retry_after': retry_after}, visitor, retry_after)
                    return
                name = ''
                cur = con.execute('INSERT INTO comments(game_id, visitor_id, author, body, created_at, client_hash) VALUES (?,?,?,?,?,?)', (game_id, visitor, name, text, now, client_hash))
                con.commit()
                self.send_json(201, {'comment': {'id': cur.lastrowid, 'name': name, 'text': text, 'created_at': now, 'own': True}}, visitor)
            elif action == 'comments' and not add and comment_id:
                cur = con.execute('DELETE FROM comments WHERE id=? AND game_id=? AND visitor_id=?', (comment_id, game_id, visitor))
                con.commit()
                self.send_json(200 if cur.rowcount else 403, {'ok': bool(cur.rowcount)}, visitor)
            else:
                self.send_json(404, {'error': 'not_found'})
        finally:
            con.close()

    @staticmethod
    def comment_wait(con, visitor, game_id, now):
        cutoff = con.execute('SELECT created_at FROM comments WHERE visitor_id=? AND created_at>? ORDER BY created_at DESC LIMIT 1 OFFSET ?',
                             (visitor, now - 3600, COMMENTS_PER_HOUR - 1)).fetchone()
        latest = con.execute('SELECT MAX(created_at) FROM comments WHERE visitor_id=? AND game_id=?', (visitor, game_id)).fetchone()[0]
        cool = latest + COMMENT_INTERVAL - now if latest is not None else 0
        hourly = cutoff[0] + 3600 - now if cutoff else 0
        return (hourly, 'comment_hourly_limit') if hourly > max(0, cool) else (max(0, cool), 'comment_cooldown')

    def do_POST(self):
        self.mutate(True)

    def do_DELETE(self):
        self.mutate(False)


if __name__ == '__main__':
    db().close()
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
