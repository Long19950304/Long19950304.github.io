"""Integration checks use a temporary database and a real local HTTP server."""
import http.client
import json
import tempfile
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch
from pathlib import Path

import app


class SiteViewsAPI(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.db_patch = patch.object(app, 'DB_PATH', str(Path(self.temp.name) / 'visits.sqlite3'))
        self.db_patch.start()
        self.base_patch = patch.object(app, 'VISIT_INITIAL_BASE', 731)
        self.base_patch.start()
        app.db().close()
        self.server = app.ThreadingHTTPServer(('127.0.0.1', 0), app.Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown(); self.server.server_close(); self.thread.join()
        self.base_patch.stop(); self.db_patch.stop(); self.temp.cleanup()

    def request(self, event_id=None, method='POST', origin=None):
        con = http.client.HTTPConnection(*self.server.server_address)
        body = json.dumps({'event_id': event_id}) if method == 'POST' else None
        headers = {'Content-Type': 'application/json'}
        if origin: headers['Origin'] = origin
        con.request(method, '/api/v1/site/views', body, headers)
        response = con.getresponse()
        result = response.status, json.loads(response.read())
        con.close()
        return result

    def test_count_persists_and_initial_base_is_never_reapplied(self):
        self.assertEqual(self.request(method='GET')[1]['total'], 731)
        status, first = self.request('a' * 32)
        self.assertEqual((status, first['initial_base'], first['observed'], first['total']), (200, 731, 1, 732))
        self.assertEqual(self.request('a' * 32)[1], first)
        self.assertEqual(self.request(method='GET')[1], first)
        with patch.object(app, 'VISIT_INITIAL_BASE', 999):
            app.db().close()
            self.assertEqual(self.request(method='GET')[1], first)
        self.assertEqual(self.request('b' * 32)[1]['total'], 733)

    def test_parallel_views_and_retries_do_not_lose_or_duplicate_counts(self):
        ids = [f'{number:032x}' for number in range(12)]
        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(self.request, ids + ids))
        self.assertTrue(all(status == 200 for status, _ in results))
        self.assertEqual(self.request(method='GET')[1]['observed'], 12)

    def test_invalid_input_and_foreign_origin_cannot_increment(self):
        for event in [None, '', 123, [], 'x' * 81, '<script>bad</script>']:
            self.assertEqual(self.request(event)[0], 400)
        self.assertEqual(self.request('c' * 32, origin='https://other.example')[0], 403)
        self.assertEqual(self.request('c' * 32, method='DELETE')[0], 404)
        self.assertEqual(self.request(method='GET')[1]['observed'], 0)

    def test_receipt_cleanup_keeps_aggregate_and_existing_showcase_rows(self):
        with app.db() as con:
            con.execute('INSERT INTO likes(game_id,visitor_id) VALUES (?,?)', ('kept', 'visitor'))
            con.execute('INSERT INTO view_receipts VALUES (?,?)', ('old' * 10, 1))
        self.request('d' * 32)
        with app.db() as con:
            self.assertEqual(con.execute('SELECT COUNT(*) FROM likes').fetchone()[0], 1)
            self.assertEqual(con.execute('SELECT COUNT(*) FROM view_receipts').fetchone()[0], 1)
        self.assertEqual(self.request(method='GET')[1]['observed'], 1)


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
        self.assertEqual(self.request('POST', 'validation/comments', {'text': 'again'}, client='rate')[0], 429)
        # A second student on the classroom network can still post.
        self.assertEqual(self.request('POST', 'validation/comments', {'text': 'another student'}, visitor='d' * 32, client='rate')[0], 201)
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

    def test_saved_likes_follow_visitor_cookie(self):
        self.request('POST', 'saved-like/like', {}, visitor='s' * 32)
        _, owner = self.request('GET', 'likes', visitor='s' * 32)
        _, other = self.request('GET', 'likes', visitor='t' * 32)
        self.assertIn('saved-like', owner['liked'])
        self.assertNotIn('saved-like', other['liked'])
        self.assertEqual(owner['likes'], other['likes'])
        self.request('DELETE', 'saved-like/like', {}, visitor='s' * 32)
        self.assertNotIn('saved-like', self.request('GET', 'likes', visitor='s' * 32)[1]['liked'])

    def test_review_all_games_and_cooldown_expires(self):
        visitor = 'r' * 32
        with patch('app.time.time', return_value=2000000000):
            for i in range(27):
                self.assertEqual(self.request('POST', f'review-{i}/comments', {'text': '试玩反馈'}, visitor=visitor, client='shared-classroom')[0], 201)
            status, data = self.request('POST', 'review-0/comments', {'text': '补充'}, visitor=visitor)
            self.assertEqual(status, 429)
            self.assertEqual(data, {'error': 'comment_cooldown', 'retry_after': 20})
        with patch('app.time.time', return_value=2000000020):
            self.assertEqual(self.request('POST', 'review-0/comments', {'text': '等过20秒后的补充'}, visitor=visitor)[0], 201)

    def test_hourly_limit_reports_real_wait_and_expires_without_data_loss(self):
        visitor = 'h' * 32
        now = 2100000000
        with app.db() as con:
            for i in range(app.COMMENTS_PER_HOUR):
                con.execute('INSERT INTO comments(game_id,visitor_id,author,body,created_at,client_hash) VALUES (?,?,?,?,?,?)', ('hourly', visitor, '老师', f'反馈{i}', now - 100, 'fixture'))
        self.request('POST', 'hourly-like/like', {}, visitor=visitor)
        with patch('app.time.time', return_value=now):
            status, data = self.request('POST', 'another-game/comments', {'text': '继续反馈'}, visitor=visitor)
            self.assertEqual(status, 429)
            self.assertEqual(data, {'error': 'comment_hourly_limit', 'retry_after': 3500})
        with patch('app.time.time', return_value=now + 3500):
            self.assertEqual(self.request('POST', 'another-game/comments', {'text': '继续反馈'}, visitor=visitor)[0], 201)
        with app.db() as con:
            self.assertEqual(con.execute('SELECT COUNT(*) FROM comments WHERE visitor_id=?', (visitor,)).fetchone()[0], app.COMMENTS_PER_HOUR + 1)
        self.assertIn('hourly-like', self.request('GET', 'likes', visitor=visitor)[1]['liked'])


if __name__ == '__main__':
    unittest.main()
