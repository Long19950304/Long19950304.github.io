#!/usr/bin/env python3
"""Small, dependency-free likes API for reusable course showcases."""
import json, os, secrets, sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote
DB_PATH=os.environ.get('LIKES_DB','/var/lib/zhaozhilong/likes.sqlite3'); ORIGIN=os.environ.get('CORS_ORIGIN','https://www.zhaozhilong.com'); HOST=os.environ.get('API_HOST','127.0.0.1'); PORT=int(os.environ.get('API_PORT','8080'))
def db():
 parent=os.path.dirname(DB_PATH)
 if parent: os.makedirs(parent,exist_ok=True)
 con=sqlite3.connect(DB_PATH); con.execute('PRAGMA journal_mode=WAL'); con.execute('CREATE TABLE IF NOT EXISTS likes (game_id TEXT NOT NULL, visitor_id TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (game_id, visitor_id))'); con.commit(); return con
def counts(con): return {r[0]:r[1] for r in con.execute('SELECT game_id, COUNT(*) FROM likes GROUP BY game_id')}
def cookie(headers):
 for part in headers.get('Cookie','').split(';'):
  k,_,v=part.strip().partition('=')
  if k=='visitor_id' and v: return v
 return None
class Handler(BaseHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*args): pass
 def send_json(self,status,payload,visitor=None):
  body=json.dumps(payload,ensure_ascii=False).encode(); self.send_response(status); self.send_header('Content-Type','application/json; charset=utf-8'); self.send_header('Content-Length',str(len(body))); self.send_header('Access-Control-Allow-Origin',ORIGIN); self.send_header('Access-Control-Allow-Credentials','true'); self.send_header('Vary','Origin')
  if visitor: self.send_header('Set-Cookie',f'visitor_id={visitor}; Max-Age=31536000; Path=/; Secure; HttpOnly; SameSite=Lax')
  self.end_headers(); self.wfile.write(body)
 def do_OPTIONS(self):
  self.send_response(204); self.send_header('Access-Control-Allow-Origin',ORIGIN); self.send_header('Access-Control-Allow-Credentials','true'); self.send_header('Access-Control-Allow-Methods','GET, POST, DELETE, OPTIONS'); self.send_header('Access-Control-Allow-Headers','Content-Type'); self.send_header('Content-Length','0'); self.end_headers()
 def do_GET(self):
  path=urlparse(self.path).path.rstrip('/')
  if path=='/api/v1/health': self.send_json(200,{'ok':True})
  elif path=='/api/v1/games/likes':
   con=db()
   try: self.send_json(200,{'likes':counts(con)})
   finally: con.close()
  else: self.send_json(404,{'error':'not_found'})
 def change_like(self,add):
  path=urlparse(self.path).path.rstrip('/'); prefix='/api/v1/games/'; suffix='/like'
  if not (path.startswith(prefix) and path.endswith(suffix)): self.send_json(404,{'error':'not_found'}); return
  game_id=unquote(path[len(prefix):-len(suffix)])
  if not game_id or len(game_id)>120: self.send_json(400,{'error':'invalid_game'}); return
  visitor=cookie(self.headers) or secrets.token_urlsafe(24); con=db()
  try:
   if add: con.execute('INSERT OR IGNORE INTO likes(game_id, visitor_id) VALUES (?,?)',(game_id,visitor))
   else: con.execute('DELETE FROM likes WHERE game_id=? AND visitor_id=?',(game_id,visitor))
   con.commit(); self.send_json(200,{'game_id':game_id,'likes':counts(con).get(game_id,0)},visitor)
  finally: con.close()
 def do_POST(self): self.change_like(True)
 def do_DELETE(self): self.change_like(False)
if __name__=='__main__': db().close(); ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
