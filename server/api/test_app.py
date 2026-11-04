"""Integration checks use a temporary database and a real local HTTP server."""
import http.client
import json
import tempfile
import threading
import unittest
from pathlib import Path

import app


class ShowcaseAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        app.DB_PATH = str(Path(cls.temp.name) / 'test.sqlite3')
        app.ORIGIN = 'https://www.example.com'
        app.db().close()
        cls.server = app.ThreadingHTTPServer(('127.0.0.1', 0), app.Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.temp.cleanup()

    def request(self, method, path, body=None, visitor='a' * 32, client='test', origin=None):
        con = http.client.HTTPConnection(*self.server.server_address)
        headers = {'Cookie': 'visitor_id=' + visitor, 'X-Real-IP': client}
        if origin:
            headers['Origin'] = origin
        if body is not None:
            headers['Content-Type'] = 'application/json'
        con.request(method, '/api/v1/games/' + path, json.dumps(body) if body is not None else None, headers)
        response = con.getresponse()
        value = response.status, json.loads(response.read())
        con.close()
        return value

    def test_anonymous_named_persistence_and_owner_deletion(self):
        for game, name, visitor in [('one', '', 'a' * 32), ('two', '试玩同学', 'b' * 32)]:
            status, data = self.request('POST', game + '/comments', {'name': name, 'text': '操作顺畅\n建议增加提示'}, visitor, game)
            self.assertEqual(status, 201)
            comment_id = data['comment']['id']
            # Read from a fresh connection; author and content survive.
            _, data = self.request('GET', game + '/comments', visitor=visitor)
            self.assertEqual(data['comments'][0]['name'], name)
            self.assertTrue(data['comments'][0]['own'])
            self.assertEqual(data['comments'][0]['text'], '操作顺畅\n建议增加提示')
            self.assertEqual(self.request('DELETE', game + '/comments/' + str(comment_id), visitor='c' * 32)[0], 403)
            self.assertEqual(self.request('DELETE', game + '/comments/' + str(comment_id), visitor=visitor)[0], 200)
            self.assertEqual(self.request('GET', game + '/comments')[1]['comments'], [])

    def test_validation_origin_and_rate_limit(self):
        for body in [{'text': ' '}, {'name': '名' * 41, 'text': 'ok'}, {'text': 'a' * 601}, {'text': []}]:
            self.assertEqual(self.request('POST', 'validation/comments', body)[0], 400)
        self.assertEqual(self.request('POST', 'validation/comments', {'text': 'ok'}, origin='https://other.example')[0], 403)
        self.assertEqual(self.request('POST', 'validation/comments', {'text': 'ok'}, client='rate')[0], 201)
        self.assertEqual(self.request('POST', 'validation/comments', {'text': 'again'}, visitor='d' * 32, client='rate')[0], 429)
        self.assertEqual(self.request('GET', 'validation/comments?before=bad')[0], 400)

    def test_pagination_isolated_by_game_and_text_kept_as_data(self):
        with app.db() as con:
            for i in range(22):
                con.execute('INSERT INTO comments(game_id,visitor_id,author,body,created_at,client_hash) VALUES (?,?,?,?,?,?)', ('pages', 'a' * 32, '', '<script>alert(1)</script>', i, 'fixture'))
        _, first = self.request('GET', 'pages/comments')
        self.assertEqual(len(first['comments']), 20)
        self.assertEqual(first['comments'][0]['text'], '<script>alert(1)</script>')
        _, second = self.request('GET', 'pages/comments?before=' + str(first['next']))
        self.assertEqual(len(second['comments']), 2)
        self.assertIsNone(second['next'])
        self.assertFalse(set(x['id'] for x in first['comments']) & set(x['id'] for x in second['comments']))
        self.assertEqual(self.request('GET', 'other/comments')[1]['comments'], [])

    def test_likes_remain_idempotent_with_request_bodies(self):
        for _ in range(2):
            status, data = self.request('POST', 'likes-test/like', {})
            self.assertEqual((status, data['likes']), (200, 1))
        self.assertEqual(self.request('DELETE', 'likes-test/like', {})[1]['likes'], 0)


if __name__ == '__main__':
    unittest.main()
