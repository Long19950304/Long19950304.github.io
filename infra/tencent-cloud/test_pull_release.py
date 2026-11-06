import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

BASE = Path(__file__).resolve().parent


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


pull = module('pull', BASE / 'pull-release.py')
manifest = module('manifest', BASE.parent.parent / 'bin/create-release-manifest.py')


class Releases(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.site = self.base / 'site'
        self.root = self.base / 'www'
        self.state = self.base / 'state'
        for directory in [self.site, self.root, self.state]:
            directory.mkdir()
        for name in pull.REQUIRED:
            path = self.site / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('new page ' + name)
        manifest.create(self.site, 'a' * 40)

    def test_verified_release_preserves_unmanaged_files_and_backup(self):
        (self.root / 'index.html').write_text('old homepage')
        (self.root / 'unrelated.txt').write_text('preserve')
        pull.apply_release(self.site, self.root, self.state, 'b' * 40, probe=False)
        self.assertEqual((self.root / 'unrelated.txt').read_text(), 'preserve')
        backup = next((self.state / 'backups').iterdir())
        self.assertEqual((backup / 'index.html').read_text(), 'old homepage')
        self.assertEqual(json.loads((self.state / 'deployed.json').read_text())['build_commit'], 'b' * 40)

    def test_modified_payload_is_rejected_before_writes(self):
        (self.site / 'index.html').write_text('tampered')
        with self.assertRaisesRegex(AssertionError, 'Checksum mismatch'):
            pull.apply_release(self.site, self.root, self.state, 'b' * 40, probe=False)
        self.assertFalse((self.root / 'index.html').exists())

    def test_obsolete_managed_files_removed_unmanaged_files_kept(self):
        (self.site / 'old.txt').write_text('old asset')
        manifest.create(self.site, 'a' * 40)
        pull.apply_release(self.site, self.root, self.state, 'b' * 40, probe=False)
        (self.site / 'old.txt').unlink()
        manifest.create(self.site, 'c' * 40)
        pull.apply_release(self.site, self.root, self.state, 'd' * 40, probe=False)
        self.assertFalse((self.root / 'old.txt').exists())

    def test_failed_health_probe_rolls_back_changed_and_new_files(self):
        (self.root / 'index.html').write_text('old homepage')
        with patch.object(pull.subprocess, 'check_output', side_effect=RuntimeError('HTTP failure')):
            with self.assertRaises(RuntimeError):
                pull.apply_release(self.site, self.root, self.state, 'b' * 40)
        self.assertEqual((self.root / 'index.html').read_text(), 'old homepage')
        self.assertFalse((self.root / 'zh/index.html').exists())
        self.assertFalse((self.state / 'deployed.json').exists())

    def test_symlink_cannot_write_outside_web_root(self):
        outside = self.base / 'outside'
        outside.mkdir()
        (self.root / 'zh').symlink_to(outside)
        with self.assertRaisesRegex(AssertionError, 'outside web root'):
            pull.apply_release(self.site, self.root, self.state, 'b' * 40, probe=False)
        self.assertEqual(list(outside.iterdir()), [])


if __name__ == '__main__':
    unittest.main()
