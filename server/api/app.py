#!/usr/bin/env python3
"""Persistent likes and comments for course showcases; standard library only."""
import hashlib
import json
import os
import re
import secrets
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

DB_PATH = os.environ.get('LIKES_DB', '/var/lib/zhaozhilong/likes.sqlite3')
ORIGIN = os.environ.get('CORS_ORIGIN', 'https://www.zhaozhilong.com')
HOST = os.environ.get('API_HOST', '127.0.0.1')
PORT = int(os.environ.get('API_PORT', '8080'))


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
    """)
    con.commit()
    return con


def cookie(headers):
    for part in headers.get('Cookie', '').split(';'):
        key, _, value = part.strip().partition('=')
        if key == 'visitor_id' and re.fullmatch(r'[A-Za-z0-9_-]{20,80}', value):
            return value
    return None


class Handler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, *args):
        pass

    def send_json(self, status, payload, visitor=None):
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        for key, value in {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': str(len(body)),
            'Access-Control-Allow-Origin': ORIGIN,
            'Access-Control-Allow-Credentials': 'true',
            'Vary': 'Origin', 'Cache-Control': 'no-store',
        }.items():
            self.send_header(key, value)
        if visitor:
            self.send_header('Set-Cookie', f'visitor_id={visitor}; Max-Age=31536000; Path=/; Secure; HttpOnly; SameSite=Lax')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        for key, value in {
            'Access-Control-Allow-Origin': ORIGIN,
            'Access-Control-Allow-Credentials': 'true',
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
            if path in ('/api/v1/games/likes', '/api/v1/games/comments'):
                table = 'likes' if path.endswith('/likes') else 'comments'
                counts = {r[0]: r[1] for r in con.execute(f'SELECT game_id, COUNT(*) FROM {table} GROUP BY game_id')}
                self.send_json(200, {table: counts})
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
        if origin and origin not in {ORIGIN, ORIGIN.replace('://www.', '://')}:
            self.send_json(403, {'error': 'invalid_origin'})
            return
        path = urlparse(self.path).path.rstrip('/')
        match = re.fullmatch(r'/api/v1/games/([^/]+)/(like|comments)(?:/(\d+))?', path)
        if not match:
            self.send_json(404, {'error': 'not_found'})
            return
        game_id, action, comment_id = unquote(match[1]), match[2], match[3]
        if not re.fullmatch(r'[A-Za-z0-9_-]{1,120}', game_id):
            self.send_json(400, {'error': 'invalid_game'})
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
                name, text = data.get('name', ''), data.get('text', '')
                if not isinstance(name, str) or not isinstance(text, str):
                    self.send_json(400, {'error': 'invalid_comment'})
                    return
                name, text = name.strip(), text.strip()
                if len(name) > 40 or not 1 <= len(text) <= 600 or any(ord(c) < 32 for c in name) or any(ord(c) < 32 and c not in '\r\n\t' for c in text):
                    self.send_json(400, {'error': 'invalid_comment'})
                    return
                client = self.headers.get('X-Real-IP', self.client_address[0])
                client_hash = hashlib.sha256(client.encode()).hexdigest()
                now = int(time.time())
                # Serialize the rate check and insert to cover simultaneous posts.
                con.execute('BEGIN IMMEDIATE')
                recent = con.execute('SELECT COUNT(*), MAX(created_at) FROM comments WHERE client_hash=? AND created_at>?', (client_hash, now - 3600)).fetchone()
                if recent[0] >= 20 or (recent[1] is not None and now - recent[1] < 20):
                    self.send_json(429, {'error': 'too_fast'})
                    return
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

    def do_POST(self):
        self.mutate(True)

    def do_DELETE(self):
        self.mutate(False)


if __name__ == '__main__':
    db().close()
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
