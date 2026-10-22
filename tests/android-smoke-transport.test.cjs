const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../scripts/android_smoke.py'), 'utf8');

test('Android 16 transport optimization preserves full smoke coverage and evidence', () => {
  assert.match(source, /PERF\["hierarchy_reads"\]/);
  assert.match(source, /uiautomator dump \/sdcard\/window\.xml/);
  assert.match(source, /xml\.lstrip\(\)\.startswith\("<\?xml"\)/);
  assert.match(source, /adb\("shell", "uiautomator", "dump", "\/sdcard\/window\.xml"/);
  assert.match(source, /for _ in range\(6\)/);
  assert.match(source, /except \(RuntimeError, subprocess\.TimeoutExpired\)/);
  assert.match(source, /def capture\(name\):/);
  assert.match(source, /screencap/);
  assert.match(source, /"\.png"/);
  assert.match(source, /"\.xml"/);
  assert.match(source, /"JavascriptException"/);
  assert.match(source, /"E ReactNativeJS:"/);
  assert.match(source, /PASS: installed release renders/);
  assert.match(source, /PASS: native Diamond artwork/);
});
