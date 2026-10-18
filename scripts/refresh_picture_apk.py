"""Refresh only Hermes JS in a known prototype APK; keep native bytes unchanged."""
import hashlib
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

BASE_SHA256 = '0f720b765cae90cb961874892b585bed897e42bb8bea39f041550bc028d0b7e4'
BASE_SOURCE = '25a494ddec30909d933b0c097c284b7a7f544717'
base, bundle, output = map(Path, sys.argv[1:])
assert hashlib.sha256(base.read_bytes()).hexdigest() == BASE_SHA256, 'Unexpected base APK'
new_bundle = bundle.read_bytes()
with zipfile.ZipFile(base) as old:
    old_bundle = old.read('assets/index.android.bundle')
    assert new_bundle[:12] == old_bundle[:12], 'Hermes bytecode format changed'
    for asset in json.loads(Path('scripts/picture-release-assets.json').read_text()):
        assert asset.encode() in old_bundle and asset.encode() in new_bundle, 'Asset registry changed: ' + asset
    with zipfile.ZipFile(output, 'w') as updated:
        for item in old.infolist():
            if re.match(r'META-INF/(MANIFEST.MF|.*\.(SF|RSA|DSA|EC))$', item.filename, re.I):
                continue
            data = new_bundle if item.filename == 'assets/index.android.bundle' else old.read(item.filename)
            updated.writestr(item, data)
    with zipfile.ZipFile(output) as updated:
        for name in updated.namelist():
            if name != 'assets/index.android.bundle':
                assert updated.read(name) == old.read(name), 'Native/resource bytes changed: ' + name
report = {
    'base_source': BASE_SOURCE, 'base_apk_sha256': BASE_SHA256,
    'source_commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(),
    'bundle_sha256': hashlib.sha256(new_bundle).hexdigest(),
    'changed_payload_entries': ['assets/index.android.bundle'],
    'native_resources_and_libraries_unchanged': True,
    'signing': 'Re-aligned and signed afterward with the same prototype certificate',
}
Path('picture-apk-refresh.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps(report, indent=2))
