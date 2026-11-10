"""Publication-critical checks; network and paid APIs are never used by tests."""
import copy
import importlib.util
from pathlib import Path
import unittest
import json
import tempfile
from unittest import mock

SPEC = importlib.util.spec_from_file_location('digest_daily', Path(__file__).resolve().parents[2] / 'bin/digest_daily.py')
d = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(d)


class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.policy = d.load_config()
        self.candidates = [dict(id=str(i), source_id=str(i), evidence='A verified primary-source passage describing an actual software update and its documented behavior.') for i in range(5)]
        self.candidates[0].update(topic='economy', source_region='china', authority='statistical_agency')
        self.candidates[1].update(topic='economy', source_region='international', authority='central_bank')
        self.issue = dict(intro='Welcome.', intro_zh='欢迎收听。', outro='Thank you.', outro_zh='感谢收听。', note='Useful research tools.', note_zh='实用科研工具。', items=[])
        for i in range(5):
            self.issue['items'].append(dict(id=str(i), coverage='china' if i == 0 else 'world' if i == 1 else 'other', title='Research update', title_zh='研究工具更新',
                summary='A documented software update.', summary_zh='软件更新说明。',
                script=' '.join(['research'] * 245), script_zh='研究工具' * 110,
                evidence_quote=self.candidates[i]['evidence']))

    def test_valid_evidence_and_bilingual_lengths(self):
        self.assertEqual(len(d.validate_issue(self.issue, self.candidates, self.policy)), 5)

    def test_weekend_window_is_explicit_and_bounded(self):
        self.assertEqual(d.load_config('2026-11-09')['lookback_hours'], 48)
        for day in ['2026-11-07', '2026-11-08']:
            self.assertEqual(d.load_config(day)['lookback_hours'], 72)

    def test_delay_notice_never_contains_private_failure_details(self):
        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(d, 'ROOT', Path(tmp)):
            (Path(tmp) / '_data').mkdir()
            path = d.public_status('2026-11-08', 'delayed')
            first = path.read_text()
            self.assertEqual(set(d.yaml.safe_load(first)), {'date', 'state', 'updated'})
            d.public_status('2026-11-08', 'delayed')
            self.assertEqual(path.read_text(), first)
            d.public_status('2026-11-08', 'published')
            self.assertEqual(d.yaml.safe_load(path.read_text())['state'], 'published')
            with self.assertRaises(ValueError): d.public_status('2026-11-08', 'private error')

    def test_scheduler_allows_later_sources_but_bounds_daily_attempts(self):
        spec = importlib.util.spec_from_file_location('daily_job', d.CONFIG / 'daily_job.py')
        job = importlib.util.module_from_spec(spec);spec.loader.exec_module(job)
        def now(hour): return d.dt.datetime(2026, 11, 8, hour, tzinfo=d.TZ)
        self.assertFalse(job.attempt_due(now(6), 0))
        self.assertTrue(job.attempt_due(now(7), 0))
        self.assertTrue(job.attempt_due(now(8), 2))
        self.assertFalse(job.attempt_due(now(9), 3))
        self.assertTrue(job.attempt_due(now(10), 3))
        self.assertFalse(job.attempt_due(now(11), 4))
        self.assertTrue(job.attempt_due(now(12), 4))
        self.assertTrue(job.attempt_due(now(18), 7))
        self.assertFalse(job.attempt_due(now(23), 8))

    def test_resume_archives_incomplete_or_wrong_language_draft(self):
        for problem in ('missing_script', 'wrong_language', 'invalid_json', 'wrong_shape'):
            with self.subTest(problem=problem), tempfile.TemporaryDirectory() as tmp:
                work = Path(tmp)
                broken = copy.deepcopy(self.issue)
                if problem == 'missing_script': del broken['items'][2]['script_zh']
                if problem == 'wrong_language': broken['items'][0]['script'] = '这是中文稿件。' * 250
                if problem == 'wrong_shape': broken = []
                if problem == 'invalid_json': (work / 'draft.json').write_text('{')
                else: d.save_json(work / 'draft.json', broken)
                with mock.patch.object(d, 'draft', return_value=self.issue) as regenerate:
                    result = d.resume_or_draft('2026-11-07', self.candidates, work, self.policy)
                self.assertEqual(result, self.issue)
                regenerate.assert_called_once()
                self.assertEqual(len(list(work.glob('invalid-draft-*.json'))), 1)
                self.assertTrue((work / 'draft-recovery.json').exists())

    def test_resume_reuses_valid_draft_without_regeneration(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp);d.save_json(work / 'draft.json', self.issue)
            with mock.patch.object(d, 'draft') as regenerate:
                self.assertEqual(d.resume_or_draft('2026-11-07', self.candidates, work, self.policy), self.issue)
                regenerate.assert_not_called()

    def test_short_sources_are_not_offered_for_long_narration(self):
        substantial = [{**c, 'evidence': c['evidence'] * 10} for c in self.candidates]
        short = {**self.candidates[0], 'id': 'short'}
        selected = [{'id': str(i + 1), 'coverage': it['coverage']} for i, it in enumerate(self.issue['items'])]
        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(d, 'llm', return_value={'items': selected}) as call, mock.patch.object(d, 'compose_issue', return_value=self.issue):
            d.draft('2026-11-07', substantial + [short], Path(tmp), self.policy)
            offered = call.call_args.args[2]['candidates']
            self.assertEqual([c['id'] for c in offered], ['1', '2', '3', '4', '5'])
            self.assertEqual([c['evidence'] for c in offered], [c['evidence'] for c in substantial])

    def test_partial_selection_is_rechecked_and_reused(self):
        substantial = [{**c, 'evidence': c['evidence'] * 10} for c in self.candidates]
        selected = [{'id': it['id'], 'coverage': it['coverage']} for it in self.issue['items']]
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp);d.save_json(work / 'selection.json', {'items': selected})
            with mock.patch.object(d, 'llm') as call, mock.patch.object(d, 'compose_issue', return_value=self.issue) as compose:
                d.draft('2026-11-07', substantial, work, self.policy)
                call.assert_not_called()
                self.assertEqual(compose.call_args.args[1], selected)

    def test_length_correction_is_targeted_and_does_not_bypass_validation(self):
        issue = copy.deepcopy(self.issue)
        issue['items'][0]['script'] = ' '.join(['research'] * 100)
        original = copy.deepcopy(issue)
        with mock.patch.object(d, 'llm', return_value={'script': self.issue['items'][0]['script']}) as call:
            d.balance_english_length(issue, {c['id']: c for c in self.candidates}, self.policy)
        self.assertEqual(len(d.validate_issue(issue, self.candidates, self.policy)), 5)
        self.assertEqual(issue['items'][1:], original['items'][1:])
        call.assert_called_once()

    def test_per_story_generation_repairs_missing_field_and_reuses_caches(self):
        selection = [{'id': it['id'], 'coverage': it['coverage']} for it in self.issue['items']]
        malformed_once = set()
        def generate(policy, system, payload, **kwargs):
            source = payload['source']
            if 'script_zh' in system:
                return {k: self.issue['items'][0][k] for k in ('title_zh', 'summary_zh', 'script_zh')}
            if source['id'] == '0' and not malformed_once:
                malformed_once.add('0')
                return {'title': 'Missing narration'}
            return {'title': 'Research update', 'summary': 'A documented update.',
                    'script': ' '.join(['research'] * 225), 'evidence_quote_id': '1'}
        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(d, 'llm', side_effect=generate) as call:
            work = Path(tmp)
            result = d.compose_issue('2026-11-07', selection, self.candidates, work, self.policy)
            self.assertEqual(len(d.validate_issue(result, self.candidates, self.policy)), 5)
            self.assertEqual(call.call_count, 11)
            self.assertTrue(any('previous_copy' in c.args[2] for c in call.call_args_list))
            call.reset_mock()
            cached = d.compose_issue('2026-11-07', selection, self.candidates, work, self.policy)
            self.assertEqual(cached, result)
            call.assert_not_called()
            next((work / 'story-drafts').glob('*-en-*.json')).write_text('{')
            d.compose_issue('2026-11-07', selection, self.candidates, work, self.policy)
            call.assert_called_once()

    def test_mandarin_length_retries_with_measured_feedback(self):
        issue = copy.deepcopy(self.issue)
        for item in issue['items']:
            item['script_zh'] = '研究工具' * 80
        replies = [{'script_zh': '研究工具' * n} for n in (80, 150, 160, 140)]
        with mock.patch.object(d, 'llm', side_effect=replies) as call:
            d.balance_chinese_length(issue, {c['id']: c for c in self.candidates}, self.policy)
        self.assertEqual(call.call_count, 4)
        self.assertEqual(call.call_args_list[1].args[2]['previous_attempt']['actual_han_characters'], 320)
        self.assertEqual(len(d.validate_issue(issue, self.candidates, self.policy)), 5)

    def test_mandarin_length_fails_closed_without_progress(self):
        issue = copy.deepcopy(self.issue)
        for item in issue['items']:
            item['script_zh'] = '研究工具' * 80
        original = copy.deepcopy(issue)
        with mock.patch.object(d, 'llm', return_value={'script_zh': '研究工具' * 60}) as call:
            with self.assertRaisesRegex(ValueError, 'Mandarin programme length correction failed'):
                d.balance_chinese_length(issue, {c['id']: c for c in self.candidates}, self.policy)
        self.assertEqual(call.call_count, 15)
        self.assertEqual(issue, original)

    def test_mandarin_length_edit_still_rejects_sensitive_copy(self):
        issue = copy.deepcopy(self.issue)
        for item in issue['items']:
            item['script_zh'] = '研究工具' * 80
        original = copy.deepcopy(issue)
        with mock.patch.object(d, 'llm', return_value={'script_zh': '研究工具' * 150 + '军事冲突'}):
            with self.assertRaisesRegex(ValueError, 'Excluded topic'):
                d.balance_chinese_length(issue, {c['id']: c for c in self.candidates}, self.policy)
        self.assertEqual(issue, original)

    def test_sensitive_topics_in_either_language_block(self):
        for value in ('election', 'export controls', 'military applications', 'global oil prices affected by war', 'conflict in Iran', '台湾', '政策由政府制定'):
            with self.subTest(value=value):
                issue = copy.deepcopy(self.issue)
                issue['items'][0]['summary_zh'] = value
                with self.assertRaises(ValueError): d.validate_issue(issue, self.candidates, self.policy)

    def test_resumed_source_evidence_is_screened_again(self):
        self.candidates[1]['evidence'] += ' The conflict affected the data.'
        with self.assertRaisesRegex(ValueError, 'source evidence'):
            d.validate_issue(self.issue, self.candidates, self.policy)

    def test_commercial_dispute_in_source_background_excludes_whole_story(self):
        for passage in [
            'The founder paid to settle class-action litigation alleging false advertising.',
            'The company faces a lawsuit over earlier product claims.',
            '报道背景包括商业诉讼和虚假宣传指控。',
        ]:
            with self.subTest(passage=passage):
                candidates = copy.deepcopy(self.candidates)
                candidates[1]['evidence'] += ' ' + passage
                with self.assertRaisesRegex(ValueError, 'source evidence'):
                    d.validate_issue(self.issue, candidates, self.policy)
        for allowed in ['A statistical model uses a suite of tests.', 'The research demonstrates a class of RNA molecules.']:
            self.assertFalse(d.blocked(allowed, self.policy))

    def test_unknown_story_duplicate_and_invented_quote_block(self):
        for field, value in [('id', 'invented'), ('id', '1'), ('evidence_quote', 'This quotation was invented and does not occur in the primary source.')]:
            issue = copy.deepcopy(self.issue)
            issue['items'][0][field] = value
            with self.assertRaises(ValueError): d.validate_issue(issue, self.candidates, self.policy)

    def test_short_narration_and_source_monopoly_block(self):
        self.issue['items'][0]['script'] = 'Too short.'
        with self.assertRaises(ValueError): d.validate_issue(self.issue, self.candidates, self.policy)
        self.issue['items'][0]['script'] = ' '.join(['research'] * 245)
        for c in self.candidates: c['source_id'] = 'one-vendor'
        with self.assertRaisesRegex(ValueError, 'source diversity'):
            d.validate_issue(self.issue, self.candidates, self.policy)

    def test_different_channels_of_one_publisher_do_not_establish_diversity(self):
        candidates = copy.deepcopy(self.candidates)
        for c in candidates: c['publisher_id'] = 'one-newsroom'
        with self.assertRaisesRegex(ValueError, 'source diversity'):
            d.validate_issue(self.issue, candidates, self.policy)
        for i, c in enumerate(candidates): c['publisher_id'] = 'newsroom-' + str(i // 2)
        self.assertEqual(len(d.validate_issue(self.issue, candidates, self.policy)), 5)

    def test_established_economic_newsroom_requires_same_evidence_gates(self):
        self.candidates[1]['authority'] = 'established_newsroom'
        self.assertEqual(len(d.validate_issue(self.issue, self.candidates, self.policy)), 5)
        self.candidates[1]['evidence'] += ' Political controversy.'
        with self.assertRaisesRegex(ValueError, 'source evidence'):
            d.validate_issue(self.issue, self.candidates, self.policy)

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

    def test_speech_network_retry_is_bounded_without_billing_fallback(self):
        result = {'base_resp': {'status_code': 0}}
        with mock.patch.object(d.time, 'sleep'), mock.patch.object(d, 'request_json', side_effect=[TimeoutError(), result]) as call:
            self.assertEqual(d.speech_request(self.policy, {'text': 'News'}, 'test-credential'), result)
            self.assertEqual(call.call_count, 2)
            for request in call.call_args_list:
                self.assertEqual(request.args[0], self.policy['tts_endpoint'])
                self.assertEqual(request.args[2], 'test-credential')
        with mock.patch.object(d.time, 'sleep'), mock.patch.object(d, 'request_json', side_effect=TimeoutError()) as call:
            with self.assertRaisesRegex(RuntimeError, 'bounded retry'):
                d.speech_request(self.policy, {}, 'test-credential')
            self.assertEqual(call.call_count, 2)

    def test_economy_requires_domestic_and_international_authority(self):
        self.issue['items'][0]['coverage'] = 'world'
        with self.assertRaisesRegex(ValueError, 'china'): d.validate_issue(self.issue, self.candidates, self.policy)
        self.issue['items'][0]['coverage'] = 'china'
        self.candidates[0]['source_region'] = 'international'
        with self.assertRaisesRegex(ValueError, 'china'): d.validate_issue(self.issue, self.candidates, self.policy)
        self.candidates[0]['source_region'] = 'china'
        self.candidates[0]['authority'] = 'developer_primary'
        with self.assertRaisesRegex(ValueError, 'authoritative'): d.validate_issue(self.issue, self.candidates, self.policy)

    def test_economy_does_not_displace_entire_programme(self):
        for candidate in self.candidates:
            candidate.update(topic='economy', authority='public_media')
        with self.assertRaisesRegex(ValueError, 'count'): d.validate_issue(self.issue, self.candidates, self.policy)

    def test_quote_options_are_verbatim_and_long_enough(self):
        evidence = '短标题\n' + self.candidates[0]['evidence'] + '\n' + '第二段可核查原文内容。' * 8
        options = d.quote_options(evidence)
        self.assertGreaterEqual(len(options), 2)
        normalized = d.re.sub(r'\s+', ' ', evidence)
        for quote in options.values():
            self.assertTrue(40 <= len(quote) <= 300)
            self.assertIn(quote, normalized)

    def test_chinese_evidence_quote_is_checked_against_original(self):
        original = '新华社报道该企业公布本期营业收入，并明确列出数据所属时期、币种、计算单位和比较口径。'
        self.candidates[0]['evidence'] = original
        self.issue['items'][0]['evidence_quote'] = original
        self.assertEqual(len(d.validate_issue(self.issue, self.candidates, self.policy)), 5)
        self.issue['items'][0]['evidence_quote'] = 'The agency reports a figure, but this English quotation is not in the Chinese original.'
        with self.assertRaisesRegex(ValueError, 'quotation'): d.validate_issue(self.issue, self.candidates, self.policy)

    def test_official_body_excludes_navigation_and_keeps_table_units(self):
        raw = '<nav>政治新闻</nav><div class="txt-content"><p>统计数据说明</p><table><tr><td>收入（亿元）</td><td>123.4</td></tr></table>' + '本期统计数据。' * 40 + '</div><footer>政府网站</footer>'
        body = d.extract_evidence(raw, 'https://www.stats.gov.cn/example', {'body_classes': ['txt-content']})
        self.assertIn('收入（亿元） | 123.4', body)
        self.assertNotIn('政府网站', body)
        self.assertNotIn('政治新闻', body)
        with self.assertRaises(ValueError): d.extract_evidence('<div>Subscribe to read this article</div>', 'https://example.com', {})

    def test_publication_dates_keep_shanghai_timezone(self):
        parsed = d.publication_time('2026/11/06 09:30')
        self.assertEqual(parsed.utcoffset(), d.dt.timedelta(hours=8))
        self.assertEqual(d.publication_time('2026-11-06').hour, 0)

    def test_domestic_publication_fields_use_explicit_source_patterns(self):
        sources = {s['id']: s for s in d.yaml.safe_load((d.CONFIG / 'sources.yml').read_text())['sources']}
        samples = [
            ('chinanews-finance', '<span id="pubtime_baidu">2026-11-09 09:32:09</span>', 9),
            ('sciencenet-news', '作者：研究者 来源：科学网 发布时间：2026/11/9 8:12:30</div>', 8),
            ('cas-research', '<meta name="PubDate" content="2026-11-09 08:18">', 8),
        ]
        for source_id, raw, hour in samples:
            with self.subTest(source_id=source_id):
                parsed = d.article_publication_time(raw, sources[source_id])
                self.assertEqual(parsed.date(), d.dt.date(2026, 11, 9))
                self.assertEqual(parsed.hour, hour)
                self.assertEqual(parsed.utcoffset(), d.dt.timedelta(hours=8))
                with self.assertRaises(ValueError):
                    d.article_publication_time('<p>Last year 2026-11-09 was discussed.</p>', sources[source_id])

    def test_expanded_body_selectors_exclude_surrounding_topics(self):
        sources = {s['id']: s for s in d.yaml.safe_load((d.CONFIG / 'sources.yml').read_text())['sources']}
        for source_id, opening, closing in [
            ('chinanews-finance', '<div class="content_maincontent_content">', '</div>'),
            ('sciencenet-news', '<div id="content1">', '</div>'),
            ('cas-research', '<div class="trs_editor_view">', '</div>'),
            ('cnbc-business', '<div class="ArticleBody-articleBody">', '</div>')]:
            with self.subTest(source_id=source_id):
                evidence = 'Verified science and economic reporting. ' * 20
                raw = '<nav>election military</nav>' + opening + '<p>' + evidence + '</p>' + closing + '<footer>politics</footer>'
                text = d.extract_evidence(raw, 'https://example.com/article', sources[source_id])
                self.assertIn(evidence.strip(), text)
                self.assertNotIn('election', text)
                self.assertNotIn('politics', text)

    def test_public_source_catalogue_matches_collector(self):
        configured = d.yaml.safe_load((d.CONFIG / 'sources.yml').read_text())['sources']
        public = d.yaml.safe_load((d.ROOT / '_data/digest_sources_public.yml').read_text())['sources']
        self.assertEqual({s['id'] for s in configured}, {s['id'] for s in public})
        self.assertEqual(len(public), len({s['id'] for s in public}))
        for source in public:
            self.assertIsInstance(source['available'], bool)
            self.assertGreaterEqual(source['initial_candidates'], 0)

    def final_report(self):
        return {'checks': [{'id': str(i), 'decision': 'approve', 'reasons': []} for i in range(5)],
                'programme': {'decision': 'approve', 'reasons': []}}

    def seed_factual_review(self, work):
        audit = {'checks': [dict(id=str(i), fact_check='pass', scope_check='pass',
                                translation_check='pass', blocking_errors=[]) for i in range(5)],
                 'approved': True, 'fingerprint': d.review_fingerprint(self.issue, self.candidates, self.policy, 'factual')}
        d.save_json(work / 'review.json', audit)

    def test_publication_review_requires_every_story_and_programme(self):
        valid = self.final_report();expected = {str(i) for i in range(5)}
        self.assertTrue(d.publication_approved(valid, expected))
        for decision in ['hold', 'reject', True, None, 'APPROVE']:
            for target in ['story', 'programme']:
                report = copy.deepcopy(valid)
                (report['checks'][0] if target == 'story' else report['programme'])['decision'] = decision
                self.assertFalse(d.publication_approved(report, expected))
        malformed = [None, [], {'checks': None}, {'checks': 'approve'}, {'checks': [None], 'programme': {}},
                     {**valid, 'programme': None}, {**valid, 'checks': valid['checks'][:-1]},
                     {**valid, 'checks': valid['checks'] + [valid['checks'][0]]}]
        for report in malformed:
            self.assertFalse(d.publication_approved(report, expected))
        for reasons in [None, '', ['Unresolved concern']]:
            report = copy.deepcopy(valid);report['programme']['reasons'] = reasons
            self.assertFalse(d.publication_approved(report, expected))

    def test_final_hold_or_api_failure_blocks_audio_and_install(self):
        for response in ['hold', 'timeout', 'malformed']:
            with self.subTest(response=response), tempfile.TemporaryDirectory() as tmp:
                work = Path(tmp);self.seed_factual_review(work)
                d.save_json(work / 'candidates.json', self.candidates)
                audit = self.final_report();audit['programme']['decision'] = 'hold';audit['programme']['reasons'] = ['Need more evidence']
                call = mock.patch.object(d, 'llm', side_effect=TimeoutError('private error')) if response == 'timeout' else mock.patch.object(d, 'llm', return_value=audit if response == 'hold' else [])
                with call, self.assertRaises(d.PublicationReviewError):
                    d.publication_review(self.issue, self.candidates, work, self.policy)
                receipt = json.loads((work / 'publication-review.json').read_text())
                self.assertIs(receipt['approved'], False)
                with mock.patch.object(d, 'key') as key:
                    with self.assertRaises(d.PublicationReviewError): d.audio('2026-11-06', self.issue, work, self.policy)
                    key.assert_not_called()
                with self.assertRaises(d.PublicationReviewError):
                    d.install('2026-11-06', self.issue, self.candidates, {}, work, self.policy)

    def test_review_receipts_bind_draft_evidence_policy_and_model(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp);self.seed_factual_review(work)
            with mock.patch.object(d, 'llm', return_value=self.final_report()) as call:
                d.publication_review(self.issue, self.candidates, work, self.policy)
                self.assertEqual(call.call_args.kwargs['purpose'], 'review')
                self.assertNotIn('audit', call.call_args.args[2])
                d.publication_review(self.issue, self.candidates, work, self.policy)
                self.assertEqual(call.call_count, 1)
            d.require_reviews(self.issue, self.candidates, work, self.policy)
            edits = []
            issue = copy.deepcopy(self.issue);issue['intro'] += ' Revised.';edits.append((issue,self.candidates,self.policy))
            candidates = copy.deepcopy(self.candidates);candidates[0]['evidence'] += ' Revised.';edits.append((self.issue,candidates,self.policy))
            policy = {**self.policy, 'version': self.policy['version'] + 1};edits.append((self.issue,self.candidates,policy))
            policy = {**self.policy, 'review_model': 'another-model'};edits.append((self.issue,self.candidates,policy))
            for issue,candidates,policy in edits:
                with self.assertRaises(d.PublicationReviewError): d.require_reviews(issue,candidates,work,policy)
            with mock.patch.object(d, 'PUBLICATION_REVIEW_PROMPT', d.PUBLICATION_REVIEW_PROMPT + ' Revised.'):
                with self.assertRaises(d.PublicationReviewError): d.require_reviews(self.issue,self.candidates,work,self.policy)
            with mock.patch.dict(d.os.environ, {'DIGEST_MINIMAX_REVIEW_MODEL': 'runtime-review-model'}):
                with self.assertRaises(d.PublicationReviewError): d.require_reviews(self.issue,self.candidates,work,self.policy)

    def test_missing_final_receipt_cannot_bypass_fact_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp);self.seed_factual_review(work)
            with self.assertRaisesRegex(d.PublicationReviewError, 'publication'):
                d.require_reviews(self.issue, self.candidates, work, self.policy)
        for report in [None, [], {'checks': None}, {'checks': [None]}]:
            self.assertFalse(d.audit_approved(report, {'a'}))

    def test_forced_factual_api_failure_invalidates_old_receipt(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp);self.seed_factual_review(work)
            with mock.patch.object(d, 'llm', side_effect=TimeoutError('private error')):
                with self.assertRaises(d.PublicationReviewError):
                    d.review(self.issue,self.candidates,work,self.policy,force=True)
            receipt = json.loads((work / 'review.json').read_text())
            self.assertIs(receipt['approved'], False)
            self.assertNotIn('private error', (work / 'review.json').read_text())
            with mock.patch.object(d, 'llm') as call:
                with self.assertRaises(d.PublicationReviewError):
                    d.publication_review(self.issue,self.candidates,work,self.policy)
                call.assert_not_called()

    def test_semantic_rejection_cannot_be_retried_until_a_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp);self.seed_factual_review(work)
            rejected = self.final_report();rejected['checks'][0].update(decision='reject', reasons=['Unsupported promised returns'])
            with mock.patch.object(d, 'llm', return_value=rejected) as call:
                with self.assertRaises(d.PublicationReviewError):
                    d.publication_review(self.issue,self.candidates,work,self.policy)
                with self.assertRaisesRegex(d.PublicationReviewError, 'explicit re-audit'):
                    d.publication_review(self.issue,self.candidates,work,self.policy)
                self.assertEqual(call.call_count, 1)


if __name__ == '__main__': unittest.main()
