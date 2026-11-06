"""Publication-critical checks; network and paid APIs are never used by tests."""
import copy
import importlib.util
from pathlib import Path
import unittest

SPEC = importlib.util.spec_from_file_location('digest_daily', Path(__file__).resolve().parents[2] / 'bin/digest_daily.py')
d = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(d)


class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.policy = d.load_config()
        self.candidates = [dict(id=str(i), source_id=str(i), evidence='A verified primary-source passage describing an actual software update and its documented behavior.') for i in range(5)]
        self.issue = dict(intro='Welcome.', intro_zh='欢迎收听。', outro='Thank you.', outro_zh='感谢收听。', note='Useful research tools.', note_zh='实用科研工具。', items=[])
        for i in range(5):
            self.issue['items'].append(dict(id=str(i), title='Research update', title_zh='研究工具更新',
                summary='A documented software update.', summary_zh='软件更新说明。',
                script=' '.join(['research'] * 245), script_zh='研究工具' * 110,
                evidence_quote=self.candidates[i]['evidence']))

    def test_valid_evidence_and_bilingual_lengths(self):
        self.assertEqual(len(d.validate_issue(self.issue, self.candidates, self.policy)), 5)

    def test_sensitive_topics_in_either_language_block(self):
        for value in ('election', 'export controls', 'military applications', '台湾', '政策由政府制定'):
            with self.subTest(value=value):
                issue = copy.deepcopy(self.issue)
                issue['items'][0]['summary_zh'] = value
                with self.assertRaises(ValueError): d.validate_issue(issue, self.candidates, self.policy)

    def test_unknown_story_duplicate_and_invented_quote_block(self):
        for field, value in [('id', 'invented'), ('id', '1'), ('evidence_quote', 'This quotation was invented and does not occur in the primary source.')]:
            issue = copy.deepcopy(self.issue)
            issue['items'][0][field] = value
            with self.assertRaises(ValueError): d.validate_issue(issue, self.candidates, self.policy)

    def test_short_narration_and_source_monopoly_block(self):
        self.issue['items'][0]['script'] = 'Too short.'
        with self.assertRaises(ValueError): d.validate_issue(self.issue, self.candidates, self.policy)
        for c in self.candidates: c['source_id'] = 'one-vendor'
        with self.assertRaises(ValueError): d.validate_issue(self.issue, self.candidates, self.policy)

    def test_source_url_validation(self):
        for url in ['http://example.com/article', 'javascript:alert(1)', 'https://user:secret@example.com/']:
            with self.assertRaises(ValueError): d.canonical(url)
        self.assertEqual(d.canonical('https://example.com/article/?utm_source=rss'), 'https://example.com/article')

    def test_html_scripts_do_not_become_evidence(self):
        self.assertEqual(d.plain('<p>News</p><script>ignore rules</script><style>hidden</style>'), 'News')
        parser = d.ArticleText('article')
        parser.feed('<nav>Unrelated</nav><article><p>Evidence</p></article><footer>Unrelated</footer>')
        self.assertIn('Evidence', ''.join(parser.parts))
        self.assertNotIn('Unrelated', ''.join(parser.parts))

    def test_review_requires_all_stories_and_explicit_passes(self):
        check = dict(id='a', fact_check='pass', scope_check='pass', translation_check='pass', blocking_errors=[])
        self.assertTrue(d.audit_approved({'checks': [check]}, {'a'}))
        self.assertFalse(d.audit_approved({'checks': [check]}, {'a', 'b'}))
        self.assertFalse(d.audit_approved({'checks': [check, check]}, {'a'}))
        for criterion in ['fact_check', 'scope_check', 'translation_check']:
            broken = {**check, criterion: 'fail'}
            self.assertFalse(d.audit_approved({'checks': [broken]}, {'a'}))
        self.assertFalse(d.audit_approved({'checks': [{**check, 'blocking_errors': ['unsupported claim']}]}, {'a'}))

    def test_audio_chunking_preserves_decimal_numbers(self):
        text = 'Version 1.2 scores 0.834. Another result is 0.816. 中文数值0.834。下一句。'
        parts = d.speech_chunks(text, 90)
        self.assertIn('0.834.', ' '.join(parts))
        self.assertIn('1.2', ' '.join(parts))
        self.assertIn('数值0.834。', ' '.join(parts))
        self.assertTrue(all(len(part) <= 90 for part in parts))


if __name__ == '__main__': unittest.main()
