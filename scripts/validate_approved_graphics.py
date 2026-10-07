"""Validate the approved graphics set before app integration."""
from pathlib import Path
import hashlib

ROOT = Path("assets/graphics")
EXPECTED = {
    "australia-code-art-v1.webp": ("46538d0c75dc4c2ef0dc8eba4654f2bcf11e9897a5f726352b5f8ec34f3f5fc4", 280526),
    "humanity-hero-v1.webp": ("9f16600cda26c1dcc440507b03223baabe0f9eb5ea066efc8101984d562136b8", 286590),
    "knowledge-justice-v1.webp": ("d82daab586042ecfd0cecc7879a3451c7c0d0f1f0664126aa9387c804594d471", 428988),
    "primary-riders-v1.webp": ("55f799cee944d6123ef8d9f19781547c73a83b5ddf202bca10043a2bde161f9b", 318116),
    "riders-crest-v1.webp": ("3ec6d2f1a4be8798808ffec66da0724ab6c28bc0713f683b80d3cab5ae8bcc8d", 261908),
}

missing = []
bad = []
for name, (digest, size) in EXPECTED.items():
    path = ROOT / name
    if not path.exists():
        missing.append(name)
        continue
    data = path.read_bytes()
    actual = hashlib.sha256(data).hexdigest()
    if actual != digest or len(data) != size:
        bad.append((name, len(data), actual))

if missing:
    raise SystemExit("Missing approved graphics: " + ", ".join(missing))
if bad:
    raise SystemExit("Approved graphics changed unexpectedly: " + repr(bad))
print("PASS: all five approved graphics match the locked v1 assets.")
