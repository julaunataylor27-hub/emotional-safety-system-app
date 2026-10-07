"""Test the installed release APK, including both native reflection graphics."""
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

PACKAGE = "au.org.emotionalsafety.prototype"
OUT = Path("android-smoke")
OUT.mkdir(exist_ok=True)
BODY = (0, 0, 1080, 1920)


def adb(*args, check=True, timeout=30):
    result = subprocess.run(["adb", *args], capture_output=True, timeout=timeout)
    if check and result.returncode:
        raise RuntimeError(result.stdout.decode(errors="replace") + result.stderr.decode(errors="replace"))
    return result.stdout.decode(errors="replace")


def screen():
    global BODY
    adb("shell", "uiautomator", "dump", "/sdcard/window.xml", check=False, timeout=20)
    xml = adb("shell", "cat", "/sdcard/window.xml", check=False)
    (OUT / "latest.xml").write_text(xml)
    try:
        root = ET.fromstring(xml)
        for node in root.iter("node"):
            if node.get("class") == "android.widget.ScrollView":
                values = tuple(map(int, re.findall(r"\d+", node.get("bounds", ""))))
                if len(values) == 4:
                    BODY = values
                    break
        # The fixed navigation overlays the ScrollView, so its lower bound
        # alone is not the visible content boundary.
        for node in root.iter("node"):
            if node.get("content-desc", "").endswith(", Home"):
                values = tuple(map(int, re.findall(r"\d+", node.get("bounds", ""))))
                if len(values) == 4:
                    BODY = (BODY[0], BODY[1], BODY[2], min(BODY[3], values[1]))
                    break
        return root
    except ET.ParseError:
        return ET.Element("empty")


def bounds(node):
    numbers = list(map(int, re.findall(r"\d+", node.get("bounds", ""))))
    if len(numbers) != 4:
        return None
    x1, y1, x2, y2 = numbers
    x1, y1, x2, y2 = max(x1, BODY[0]), max(y1, BODY[1]), min(x2, BODY[2]), min(y2, BODY[3])
    return ((x1 + x2) // 2, (y1 + y2) // 2) if x2 > x1 and y2 > y1 else None


def find(label, scroll=False, by_class=False, exact=False, clickable=False):
    for attempt in range(15 if scroll else 10):
        root = screen()
        for node in root.iter("node"):
            values = [node.get("class", "")] if by_class else [node.get("text", ""), node.get("content-desc", "")]
            matches = any(value.strip().casefold() == label.casefold() if exact else label.casefold() in value.casefold() for value in values)
            if matches and bounds(node) and (not clickable or node.get("clickable") == "true"):
                return node
        logs = adb("logcat", "-d", "-v", "brief")
        if "JavascriptException" in logs or "E ReactNativeJS:" in logs:
            raise AssertionError("JavaScript failed while waiting for " + label)
        if scroll:
            adb("shell", "input", "swipe", "1050", "1540", "1050", "540", "350")
        time.sleep(1)
    raise AssertionError("Visible control was not found: " + label)


def top():
    # Scroll from the outer margin so the movable artwork does not consume it.
    for _ in range(6):
        adb("shell", "input", "swipe", "1050", "540", "1050", "1540", "150")


def tap(label, scroll=False, navigate=False, exact=False):
    node = find(label, scroll=scroll, exact=exact, clickable=True)
    x, y = bounds(node)
    adb("shell", "input", "tap", str(x), str(y))
    time.sleep(1)
    if navigate:
        top()


def capture(name):
    image = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True, timeout=20, check=True)
    (OUT / (name + ".png")).write_bytes(image.stdout)
    adb("shell", "uiautomator", "dump", "/sdcard/window.xml", check=False)
    (OUT / (name + ".xml")).write_text(adb("shell", "cat", "/sdcard/window.xml", check=False))


adb("install", "-r", sys.argv[1], timeout=120)
adb("logcat", "-c")
try:
    try:
        print(adb("shell", "am", "start", "-W", "-n", PACKAGE + "/.MainActivity", timeout=60))
    except (RuntimeError, subprocess.TimeoutExpired) as error:
        print("Launch command failed:", error)
    find("START JOURNEY", scroll=True)
    capture("home")
    print("PASS: real release APK renders Home.")
    tap("SAFETY CHECK", scroll=True, navigate=True)
    node = find("android.widget.EditText", scroll=True, by_class=True)
    x, y = bounds(node)
    adb("shell", "input", "tap", str(x), str(y))
    # A generic fixture only. Never put a person's assessment into test logs.
    adb("shell", "input", "text", "We%sdisagreed%sabout%sa%sgeneric%splan%sand%sI%swant%sto%spause%sand%sget%ssupport.")
    adb("shell", "input", "keyevent", "4")
    tap("Analyse My Situation", scroll=True, navigate=True)
    tap("EXPLORE MY DIAMOND EFFECT", scroll=True, navigate=True)
    find("My Diamond Effect")
    find("Love, pain and choice", scroll=True)
    find("Care / connection", scroll=True)
    capture("triangle")
    tap("Pressure / pain", scroll=True, exact=True)
    find("Describe the specific behaviour", scroll=True)
    print("PASS: native Triangle artwork opens and its focus changes.")
    find("Faith / Hope", scroll=True)
    capture("diamond")
    tap("Values", scroll=True, exact=True)
    find("What matters to you here", scroll=True)
    print("PASS: native Diamond artwork opens and its focus changes.")
finally:
    logs = adb("logcat", "-d", "-v", "threadtime", check=False)
    (OUT / "startup.log").write_text(logs)
    capture("final")
    print("\n".join(line for line in logs.splitlines() if any(word in line for word in ("ReactNativeJS", "AndroidRuntime", "RNSkia", "JavascriptException")))[-16000:])
if "JavascriptException" in logs or "E ReactNativeJS:" in logs:
    raise SystemExit("Release APK logged a JavaScript failure.")
