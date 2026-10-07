"""Launch the real release APK; retain logs and a screen capture on failure."""
import re, subprocess, sys, time
from pathlib import Path

PACKAGE = "au.org.emotionalsafety.prototype"
OUT = Path("android-smoke")
OUT.mkdir(exist_ok=True)

def adb(*args, check=True, timeout=30):
    result = subprocess.run(["adb", *args], capture_output=True, timeout=timeout)
    if check and result.returncode:
        raise RuntimeError(result.stdout.decode(errors="replace") + result.stderr.decode(errors="replace"))
    return result.stdout.decode(errors="replace")

adb("install", "-r", sys.argv[1], timeout=120)
adb("logcat", "-c")
ready = False
xml = ""
try:
    try:
        print(adb("shell", "am", "start", "-W", "-n", PACKAGE + "/.MainActivity", timeout=60))
    except (RuntimeError, subprocess.TimeoutExpired) as error:
        print("Launch command failed:", error)
    for attempt in range(18):
        time.sleep(3)
        adb("shell", "uiautomator", "dump", "/sdcard/window.xml", check=False, timeout=15)
        xml = adb("shell", "cat", "/sdcard/window.xml", check=False)
        if PACKAGE in xml and ("Journey" in xml or "Humanity" in xml):
            ready = True
            break
        logs = adb("logcat", "-d", "-v", "brief")
        if "FATAL EXCEPTION" in logs or "JavascriptException" in logs:
            break
finally:
    logs = adb("logcat", "-d", "-v", "threadtime", check=False)
    (OUT / "startup.log").write_text(logs)
    (OUT / "startup.xml").write_text(xml)
    image = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True, timeout=15)
    (OUT / "startup.png").write_bytes(image.stdout)
    print("\\n".join(line for line in logs.splitlines() if any(word in line for word in ("ReactNativeJS", "AndroidRuntime", "FATAL", "SoLoader", "RNSkia", "JavascriptException")))[-22000:])
    print("UI rendered:", ready)
    print("Visible text:", re.findall(r'text="([^"]+)"', xml)[:30])
if not ready:
    raise SystemExit("Release APK did not render the home screen.")
