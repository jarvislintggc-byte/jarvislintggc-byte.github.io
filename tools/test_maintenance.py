from pathlib import Path
from html.parser import HTMLParser
import json
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent


class Meta(HTMLParser):
    def __init__(self):
        super().__init__()
        self.keys = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta':
            key = attrs.get('property', attrs.get('name', ''))
            if key.startswith(('og:', 'twitter:')):
                self.keys.append(key)


class MaintenanceTests(unittest.TestCase):
    def test_home_share_metadata_is_unambiguous(self):
        for name in ['index.html', 'zh/index.html', 'ja/index.html']:
            with self.subTest(page=name):
                parser = Meta()
                parser.feed((ROOT / name).read_text(encoding='utf-8').split('</head>')[0])
                self.assertEqual(len(parser.keys), len(set(parser.keys)))
                self.assertIn('og:image', parser.keys)
                self.assertIn('twitter:card', parser.keys)


if __name__ == '__main__':
    unittest.main()
