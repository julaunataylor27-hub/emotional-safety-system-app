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
SCROLL_NODES = set()


def adb(*args, check=True, timeout=30):
    result = subprocess.run(["adb", *args], capture_output=True, timeout=timeout)
    if check and result.returncode:
        raise RuntimeError(result.stdout.decode(errors="replace") + result.stderr.decode(errors="replace"))
    return result.stdout.decode(errors="replace")


def screen():
    global BODY, SCROLL_NODES
    adb("shell", "uiautomator", "dump", "/sdcard/window.xml", check=False, timeout=20)
    xml = adb("shell", "cat", "/sdcard/window.xml", check=False)
    (OUT / "latest.xml").write_text(xml)
    try:
        root = ET.fromstring(xml)
        SCROLL_NODES = set()
        for node in root.iter("node"):
            if node.get("class") == "android.widget.ScrollView":
                SCROLL_NODES = {id(child) for child in node.iter("node")}
                values = tuple(map(int, re.findall(r"\d+", node.get("bounds", ""))))
                if len(values) == 4:
                    BODY = values
                    break
        # The fixed navigation overlays the ScrollView, so its lower bound
        # alone is not the visible content boundary.
        for node in root.iter("node"):
            if node.get("content-desc", "").endswith(", Home") or node.get("content-desc", "") == "Home":
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
    # Only clip scroll content to the visible body. Header and navigation
    # controls live outside it and must remain tappable.
    clip = BODY if id(node) in SCROLL_NODES else (0, 0, 1080, 1920)
    x1, y1, x2, y2 = max(x1, clip[0]), max(y1, clip[1]), min(x2, clip[2]), min(y2, clip[3])
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
    find("Eucalyptus tree at dawn; illustrative artwork")
    find("Grow yourself.")
    capture("home")
    print("PASS: installed release renders the approved golden-tree Home.")
    tap("Start my journey", scroll=True, navigate=True)
    find("My Humanity Journey")
    tap("Home", navigate=True)
    tap("Explore Knowledge", scroll=True, navigate=True)
    find("A Noongar connection")
    find("What we learn through experience")
    capture("knowledge-meaning")
    tap("Reflect on Knowledge", scroll=True, exact=True)
    find("Stage 2")
    tap("Home", navigate=True)
    for value in ["Understanding", "Love", "Kindness", "Patience", "Growth", "Humanity", "Life"]:
        tap("Explore " + value, scroll=True, exact=True)
        find("A Noongar connection")
        tap("Close " + value + " meaning", exact=True)
    print("PASS: all eight circles open cultural meanings and return to Home.")
    tap("Learn", navigate=True)
    find("Learning Centre")
    tap("Home", navigate=True)
    tap("Find support", scroll=True, navigate=True)
    find("Support Resources")
    tap("Home", navigate=True)
    tap("Open menu", navigate=True)
    find("More")
    tap("Home", navigate=True)
    print("PASS: Home controls open Journey, Values, Learn, Support and More.")
    if "--life-journey" in sys.argv[2:]:
        tap("Yagan's Life Journey", scroll=True, navigate=True, exact=True)
        find("Country under pressure", scroll=True)
        capture("life-journey-country")
        tap("Possible meaning", scroll=True, exact=True)
        find("A selection records your interpretation", scroll=True)
        tap("Previous chapter", scroll=True, exact=True)
        top()
        find("Early life & upbringing", scroll=True)
        find("No feelings are assigned in this chapter", scroll=True)
        capture("life-journey-early-life")
        # An artificial note verifies actual device storage, not family history.
        node = find("Life Journey interpretation or question", scroll=True, exact=True)
        x, y = bounds(node)
        adb("shell", "input", "tap", str(x), str(y))
        adb("shell", "input", "text", "Generic%sLife%sJourney%stest%squestion")
        adb("shell", "input", "keyevent", "4")
        find("Notes saved only on this device", scroll=True)
        tap("Home", navigate=True)
        tap("Yagan's Life Journey", scroll=True, navigate=True, exact=True)
        find("Country under pressure", scroll=True)
        tap("Previous chapter", scroll=True, exact=True)
        find("Generic Life Journey test question", scroll=True)
        capture("life-journey-restored-notes")
        print("PASS: native Life Journey opens, preserves uncertainty and restores device-local notes.")
        tap("Home", navigate=True)
    find("Start my journey", scroll=True)
    capture("home-actions")
    tap("Explore a situation", scroll=True, navigate=True)
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
