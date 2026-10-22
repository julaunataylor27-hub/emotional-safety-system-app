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
# UI hierarchy snapshots can be reused until an input changes the screen.
# This avoids repeat multi-second uiautomator requests during adjacent assertions.
SCREEN_ROOT = None
SCREEN_XML = ""
SCREEN_DIRTY = True
SCREEN_AT = 0.0
PERF = {"hierarchy_reads": 0, "hierarchy_seconds": 0.0, "top_resets": 0}


def adb(*args, check=True, timeout=30):
    global SCREEN_DIRTY
    result = subprocess.run(["adb", *args], capture_output=True, timeout=timeout)
    # Direct adb input calls in test cases must also invalidate the snapshot.
    if args[:2] == ("shell", "input"):
        SCREEN_DIRTY = True
    if check and result.returncode:
        raise RuntimeError(result.stdout.decode(errors="replace") + result.stderr.decode(errors="replace"))
    return result.stdout.decode(errors="replace")


def screen():
    global BODY, SCROLL_NODES, SCREEN_ROOT, SCREEN_XML, SCREEN_DIRTY, SCREEN_AT
    # One Android shell round-trip instead of a separate dump and cat each time.
    # Fall back to the original two calls if this runner rejects shell operators.
    began = time.monotonic()
    xml = adb(
        "shell",
        "uiautomator dump /sdcard/window.xml >/dev/null 2>&1 && cat /sdcard/window.xml",
        check=False, timeout=30,
    )
    if not xml.lstrip().startswith("<?xml"):
        adb("shell", "uiautomator", "dump", "/sdcard/window.xml", check=False, timeout=20)
        xml = adb("shell", "cat", "/sdcard/window.xml", check=False)
    PERF["hierarchy_reads"] += 1
    PERF["hierarchy_seconds"] += time.monotonic() - began
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
        SCREEN_ROOT = root
        SCREEN_XML = xml
        SCREEN_DIRTY = False
        SCREEN_AT = time.monotonic()
        return root
    except ET.ParseError:
        SCREEN_DIRTY = True
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
    normalised_label = label.strip().casefold().replace("’", "'")
    for attempt in range(15 if scroll else 10):
        # Check a recent unchanged hierarchy first; on a miss ALWAYS read the
        # emulator again before reporting failure or taking a scrolling action.
        cached = (
            attempt == 0 and SCREEN_ROOT is not None and not SCREEN_DIRTY
            and time.monotonic() - SCREEN_AT < 0.8
        )
        for source in ((0, 1) if cached else (1,)):
            root = SCREEN_ROOT if source == 0 else screen()
            for node in root.iter("node"):
                values = [node.get("class", "")] if by_class else [node.get("text", ""), node.get("content-desc", "")]
                normalised_values = [value.strip().casefold().replace("’", "'") for value in values]
                matches = any(value == normalised_label if exact else normalised_label in value for value in normalised_values)
                if matches and bounds(node) and (not clickable or node.get("clickable") == "true"):
                    return node
        logs = adb("logcat", "-d", "-v", "brief")
        if "JavascriptException" in logs or "E ReactNativeJS:" in logs:
            raise AssertionError("JavaScript failed while waiting for " + label)
        if scroll:
            swipe_body(up=True)
        time.sleep(1)
    raise AssertionError("Visible control was not found: " + label)


def swipe_body(up):
    # Stay inside the current ScrollView, including inset modal sheets. Keep
    # to its right margin so movable artwork does not consume the gesture.
    left, upper, right, lower = BODY
    x = max(left + 1, right - 30)
    high = upper + int((lower - upper) * .25)
    low = upper + int((lower - upper) * .8)
    start, end = (low, high) if up else (high, low)
    adb("shell", "input", "swipe", str(x), str(start), str(x), str(end), "250")


def top():
    global SCREEN_DIRTY
    screen()
    # Preserve all six existing "go to top" swipes; batch them into one
    # ADB transport instead of launching six separate desktop-side processes.
    # This does NOT shorten the scroll or skip any screenshot/assertion.
    left, upper, right, lower = BODY
    x = max(left + 1, right - 30)
    high = upper + int((lower - upper) * .25)
    low = upper + int((lower - upper) * .8)
    commands = "; ".join(
        "input swipe {} {} {} {} 250".format(x, high, x, low)
        for _ in range(6)
    )
    try:
        adb("shell", commands, timeout=30)
    except (RuntimeError, subprocess.TimeoutExpired):
        for _ in range(6):
            swipe_body(up=False)
    SCREEN_DIRTY = True
    PERF["top_resets"] += 1


def tap(label, scroll=False, navigate=False, exact=False):
    node = find(label, scroll=scroll, exact=exact, clickable=True)
    x, y = bounds(node)
    adb("shell", "input", "tap", str(x), str(y))
    # Assertions poll for actual readiness; a shorter fixed delay avoids
    # waiting a full second after every one of the 100+ UI taps.
    time.sleep(0.5)
    if navigate:
        top()


def capture(name):
    # Keep every evidence screenshot and its XML; don't dump the same
    # unchanged screen twice in a row just to write the evidence file.
    if SCREEN_DIRTY or SCREEN_ROOT is None or time.monotonic() - SCREEN_AT >= 0.8:
        screen()
    hierarchy = SCREEN_XML
    image = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True, timeout=20, check=True)
    (OUT / (name + ".png")).write_bytes(image.stdout)
    (OUT / (name + ".xml")).write_text(hierarchy)




def night_forest_design_checks():
    top()
    find("KNOWLEDGE · CULTURE", scroll=True)
    # Capture the photographic Home cards after scrolling them into view.
    top()
    screen()
    swipe_body(up=True)
    swipe_body(up=True)
    capture("moonlit-riders-cards")
    tap("Emotional Safety", scroll=True, navigate=True)
    find("Proof of Concept", scroll=True)
    tap("How the web works", scroll=True)
    tap("Explore safely", scroll=True)
    find("Understanding the internet", scroll=True)
    tap("Explore the knowledge", scroll=True, navigate=True)
    find("What is an algorithm?", scroll=True)
    tap("Why do I see similar videos?", scroll=True)
    find("A platform may predict", scroll=True)
    capture("night-forest-knowledge")
    # Back is at the top of the scroll content; searching downwards skips it.
    top()
    tap("Back to Safe Curiosity", navigate=True)
    tap("Back to Learn", scroll=True, navigate=True)
    tap("Home", navigate=True, exact=True)
    print("PASS: Moonlit Riders home, curiosity lesson, accordion and return navigation.")

def law_rights_kinship_checks():
    tap("Law, Rights & Kinship", scroll=True, navigate=True)
    find("Understand rights. Respect kinship.", scroll=True)
    find("many Aboriginal Nations", scroll=True)
    capture("law-rights-kinship-intro")
    tap("Rights & law", scroll=True, exact=True)
    tap("Australia-wide", scroll=True, exact=True)
    tap("Read Marriage equality and who can marry. Australia-wide", scroll=True, navigate=True, exact=True)
    find("Limits to understand", scroll=True)
    find("The usual marriage age is 18", scroll=True)
    capture("law-marriage-rights")
    top()
    tap("Back to topics", scroll=True, navigate=True, exact=True)
    tap("Kinship & culture", scroll=True, exact=True)
    tap("Community context", scroll=True, exact=True)
    tap("Read Noongar kinship, family and responsibilities. Selected public Whadjuk / Nyungar accounts · south-west WA", scroll=True, navigate=True, exact=True)
    find("not a universal rule", scroll=True)
    capture("law-noongar-scope")
    top()
    tap("Back to topics", scroll=True, navigate=True, exact=True)
    tap("Parliament & change", scroll=True, exact=True)
    tap("All areas", scroll=True, exact=True)
    tap("Read How a proposal becomes law. Federal Parliament · WA has its own law-making process", scroll=True, navigate=True, exact=True)
    find("commencement also matters", scroll=True)
    capture("law-parliament-proposals")
    tap("Learn", navigate=True, exact=True)
    find("Learning Centre")
    print("PASS: law library opens, switches jurisdiction and cultural scope, and labels proposals separately from commenced law.")


def independence_commitment_checks():
    top()
    tap("Independence & commitment", scroll=True, navigate=True)
    find("Room to be yourself. Care you freely choose.", scroll=True)
    capture("independence-commitment-intro")
    tap("Start or continue my reflection", scroll=True, navigate=True, exact=True)
    find("My space", scroll=True, exact=True)
    tap("Next part", scroll=True, navigate=True, exact=True)
    find("My chosen commitment", scroll=True, exact=True)
    tap("Next part", scroll=True, navigate=True, exact=True)
    tap("I'm not sure", scroll=True, exact=True)
    find("pause before agreeing", scroll=True)
    capture("independence-commitment-choice")
    tap("Pause here", scroll=True, navigate=True, exact=True)
    find("Room to pause.", scroll=True)
    tap("Continue when ready", scroll=True, navigate=True, exact=True)
    find("pause before agreeing", scroll=True)
    tap("Next part", scroll=True, navigate=True, exact=True)
    find("does not set a reminder", scroll=True)
    tap("Review my reflection", scroll=True, navigate=True, exact=True)
    find("My space. My chosen care.", scroll=True)
    find("Left open", scroll=True)
    capture("independence-commitment-summary")
    tap("Preview a copy of my reflection", scroll=True, navigate=True, exact=True)
    find("Another person has not agreed", scroll=True)
    capture("independence-commitment-preview")
    tap("Learn", navigate=True, exact=True)
    find("Learning Centre")
    print("PASS: Independence and commitment preserves open answers, uncertainty and pause, and previews a personal reflection.")


def support_directory_checks():
    find("Support across Australia", scroll=True)
    capture("support-directory-wa")
    tap("Choose state or territory. Current: Western Australia", scroll=True, exact=True)
    find("Northern Territory", scroll=True)
    capture("support-directory-regions")
    tap("Australian Capital Territory", scroll=True, navigate=True, exact=True)
    tap("Choose type of help. Current: All support", scroll=True, exact=True)
    tap("Housing, food and money", scroll=True, navigate=True, exact=True)
    find("FIRST Canberra (formerly OneLink)", scroll=True)
    find("1800 176 468", scroll=True)
    capture("support-directory-act-housing")
    top()
    tap("Choose state or territory. Current: Australian Capital Territory", scroll=True, exact=True)
    tap("National services", scroll=True, navigate=True, exact=True)
    tap("Choose type of help. Current: Housing, food and money", scroll=True, exact=True)
    tap("Aboriginal and Torres Strait Islander support", scroll=True, navigate=True, exact=True)
    find("community-controlled health", scroll=True)
    capture("support-directory-national-first-nations")
    print("PASS: support directory switches jurisdiction and help type, including ACT housing and national First Nations resources.")


adb("install", "-r", sys.argv[1], timeout=120)
adb("logcat", "-c")
try:
    try:
        print(adb("shell", "am", "start", "-W", "-n", PACKAGE + "/.MainActivity", timeout=60))
    except (RuntimeError, subprocess.TimeoutExpired) as error:
        print("Launch command failed:", error)
    find("Symbolic Aboriginal riders on horseback in a cinematic Australian night landscape")
    # The tagline is intentionally rendered on two lines; assert both halves.
    find("KNOWLEDGE · CULTURE")
    find("PEOPLE · CHOICE")
    capture("home")
    # Verify the value label remains on one physical line on Android.
    value = find("Understanding", scroll=True, exact=True)
    coordinates = list(map(int, re.findall(r"\d+", value.get("bounds", ""))))
    if len(coordinates) != 4 or coordinates[3] - coordinates[1] > 85:
        raise AssertionError("Understanding value label wraps or has invalid layout bounds: " + str(coordinates))
    capture("home-aligned-values")
    top()
    print("PASS: installed release renders the Moonlit Riders cinematic Home.")
    if "--night-forest" in sys.argv[2:]:
        night_forest_design_checks()
    if "--picture-release-check" in sys.argv[2:]:
        tap("Learn", navigate=True)
        tap("Knowledge Trail", scroll=True, navigate=True)
        tap("Explore Tim’s story", scroll=True, navigate=True, exact=True)
        tap("Choose a milestone. Current: March 1989 · The proposal", scroll=True, exact=True)
        tap("1990 · First Web server", scroll=True, navigate=True, exact=True)
        # Position the complete bundled photograph inside the viewport. Its
        # intrinsic width/height previously overrode the responsive layout.
        image = None
        for _ in range(15):
            root = screen()
            for node in root.iter("node"):
                if node.get("resource-id", "").endswith("picture-trail-image"):
                    coords = tuple(map(int, re.findall(r"\d+", node.get("bounds", ""))))
                    if len(coords) == 4:
                        left, upper, right, lower = coords
                        if upper >= BODY[1] + 30 and lower <= BODY[3] - 30 and lower - upper > 500:
                            image = node
                            break
            if image is not None:
                break
            left, upper, right, lower = BODY
            adb("shell", "input", "swipe", str(right - 30), str(lower - 100), str(right - 30), str(lower - 350), "250")
        assert image is not None, "The complete server photograph must fit on screen"
        assert left >= 40 and right <= 1040, "Photograph exceeds content margins"
        assert abs((right-left)/(lower-upper) - 4/3) < .04, "Server photograph lost its aspect ratio"
        assert image.get("clickable") == "false", "Pictures should not open zoom controls"
        capture("picture-server-responsive")
        find("Question · our prompt", scroll=True)
        find("What the evidence establishes", scroll=True)
        capture("picture-decisions")
        print("PASS: complete bundled photograph fits content width and ratio, with no image zoom, and decision trail opens.")
        tap("Home", navigate=True)
        tap("Support & Services", scroll=True, navigate=True)
        support_directory_checks()
        tap("Home", navigate=True)
    if "--balance-release-check" in sys.argv[2:]:
        tap("Learn", navigate=True)
        find("Learning Centre")
        independence_commitment_checks()
        tap("Home", navigate=True)
    if "--law-release-check" in sys.argv[2:]:
        tap("Learn", navigate=True)
        find("Learning Centre")
        law_rights_kinship_checks()
        tap("Home", navigate=True)
        tap("Support & Services", scroll=True, navigate=True)
        support_directory_checks()
        tap("Home", navigate=True)
    # Diagnose journey/reflection independently after navigation has passed.
    if "--journey-and-reflection" not in sys.argv[2:]:
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
        if "--independence-commitment" in sys.argv[2:]:
            independence_commitment_checks()
        if "--law-rights-kinship" in sys.argv[2:]:
            law_rights_kinship_checks()
        if "--living-connections" in sys.argv[2:]:
            tap("Living connections", scroll=True, navigate=True)
            find("Research draft", scroll=True)
            find("Cultural review, reuse permissions and legal review pending", scroll=True)
            capture("living-connections-draft")
            tap("Choose a connection", scroll=True, exact=True)
            tap("Care, love and responsibility", scroll=True, exact=True)
            top()
            find("Comparison of public accounts", scroll=True)
            tap("Yawuru", scroll=True, exact=True)
            find("Mabu liyan links wellbeing", scroll=True)
            find("Read original source", scroll=True)
            capture("living-connections-yawuru")
            tap("20 public words and concepts", scroll=True, exact=True)
            find("Choose a word or concept", scroll=True)
            find("boodjar", scroll=True)
            capture("living-connections-word-guide")
            top()
            tap("Back to Learn", scroll=True, navigate=True, exact=True)
            find("Learning Centre")
            print("PASS: Living connections preserves draft status, changes topics and opens the word guide.")
        if "--cultural-inquiry" in sys.argv[2:]:
            tap("Compare & stay curious", scroll=True, navigate=True)
            find("What are you curious about?", scroll=True)
            capture("cultural-inquiry-questions")
            find("Educational research draft", scroll=True)
            tap("About this research draft", scroll=True, exact=True)
            find("Cultural review, reuse permissions and legal review pending", scroll=True)
            capture("cultural-inquiry-draft")
            tap("About this research draft", scroll=True, exact=True)
            tap("Is there a traditional Yamatji triangle?", scroll=True, navigate=True, exact=True)
            find("has not been verified", scroll=True)
            capture("cultural-inquiry-triangle-question")
            tap("Explore these two accounts", scroll=True, navigate=True, exact=True)
            find("Country & responsibilities", scroll=True)
            find("Short summary", scroll=True)
            tap("Read full Whadjuk Noongar account", scroll=True, exact=True)
            find("The authors explain Noongar knowledge", scroll=True)
            capture("cultural-inquiry-comparison")
            top()
            tap("Change topic: Country & responsibilities", scroll=True, exact=True)
            tap("Different views & repair", scroll=True, exact=True)
            find("No detailed interpersonal dispute or repair procedure", scroll=True)
            capture("cultural-inquiry-open-question")
            top()
            tap("Back to Learn", scroll=True, navigate=True, exact=True)
            find("Learning Centre")
            print("PASS: cultural inquiry keeps draft scope, evidence gaps and question-to-comparison navigation.")
        if "--knowledge-trail" in sys.argv[2:]:
            top()
            tap("Knowledge Trail", scroll=True, navigate=True)
            find("Follow your curiosity.", scroll=True)
            capture("knowledge-trail-start")
            tap("Explore Tim’s story", scroll=True, navigate=True, exact=True)
            find("Tim’s work, in order.", scroll=True)
            find("Put the idea on paper.", scroll=True)
            capture("knowledge-trail-picture-proposal")
            find("Question · our prompt", scroll=True)
            find("What the evidence establishes", scroll=True)
            capture("knowledge-trail-picture-decisions")
            top()
            tap("Choose a milestone. Current: March 1989 · The proposal", scroll=True, exact=True)
            tap("1990 · First Web server", scroll=True, navigate=True, exact=True)
            find("Give the idea a working machine.", scroll=True)
            find("2005", scroll=True)
            capture("knowledge-trail-picture-server")
            top()
            tap("Back to trails", scroll=True, navigate=True, exact=True)
            tap("Explore the five-step learning example", scroll=True, navigate=True, exact=True)
            find("Why was information so hard to find?", scroll=True)
            tap("Step 3: Evidence", scroll=True, navigate=True, exact=True)
            find("do not establish a complete algorithm", scroll=True)
            capture("knowledge-trail-evidence")
            top()
            tap("Step 4: Connections", scroll=True, navigate=True, exact=True)
            find("our reading of his accounts", scroll=True)
            top()
            tap("Step 5: Choice", scroll=True, navigate=True, exact=True)
            tap("Try my own question", scroll=True, navigate=True, exact=True)
            find("What am I trying to understand?", scroll=True)
            capture("knowledge-trail-own-question")
            top()
            tap("Back to trails", scroll=True, navigate=True, exact=True)
            tap("Back to Learn", scroll=True, navigate=True, exact=True)
            find("Learning Centre")
            print("PASS: Knowledge Trail opens sourced history, keeps uncertainty and interpretation visible, and starts a personal question.")
        if "--learning-together" in sys.argv[2:]:
            top()
            tap("Learning together", scroll=True, navigate=True)
            find("Make room to learn together.", scroll=True)
            capture("learning-together-start")
            tap("Try the garden example", scroll=True, navigate=True, exact=True)
            tap("Invite their questions", scroll=True, exact=True)
            tap("Pause here", scroll=True, navigate=True, exact=True)
            find("Room to pause.", scroll=True)
            tap("Continue when ready", scroll=True, navigate=True, exact=True)
            find("Ask what they would like to learn.", scroll=True)
            for part, choice in [("Pace", "One step at a time"), ("Timing", "Check if now suits"),
                                 ("Knowledge", "Leave this open"), ("Conversation", "Ask what needs explaining"),
                                 ("Peace", "Pause and listen")]:
                tap("Next part", scroll=True, navigate=True, exact=True)
                find(part, scroll=True, exact=True)
                tap(choice, scroll=True, exact=True)
            capture("learning-together-peace")
            tap("Review my practice plan", scroll=True, navigate=True, exact=True)
            find("My practice plan.", scroll=True)
            find("Left open", scroll=True)
            capture("learning-together-plan")
            tap("Learn", navigate=True, exact=True)
            find("Learning Centre")
            print("PASS: Learning together preserves choices through a pause, completes six parts and keeps an unanswered approach open.")
        if "--explore-connections" in sys.argv[2:]:
            top()
            tap("Explore connections", scroll=True, navigate=True)
            find("One question. Many connections.", scroll=True)
            capture("explore-connections-start")
            tap("Try the linked example", scroll=True, navigate=True, exact=True)
            find("Practice question", scroll=True)
            tap("Explore What happened.", scroll=True, navigate=True)
            find("Fictional event", scroll=True)
            find("Jo asks for a break.", scroll=True)
            capture("explore-connections-event")
            tap("Explore What is unknown.", scroll=True, navigate=True)
            find("Missing information", scroll=True)
            tap("Pause here", scroll=True, navigate=True, exact=True)
            find("Room to pause.", scroll=True)
            tap("Continue when ready", scroll=True, navigate=True, exact=True)
            find("Leave space for what we do not know.", scroll=True)
            capture("explore-connections-unknowns")
            tap("Explore Read the source.", scroll=True, navigate=True)
            find("Published source", scroll=True)
            find("1800RESPECT", scroll=True)
            capture("explore-connections-source")
            tap("My optional reflection", scroll=True, navigate=True, exact=True)
            find("My reflection.", scroll=True)
            tap("Preview my reflection", scroll=True, navigate=True, exact=True)
            find("unverified", scroll=True)
            capture("explore-connections-preview")
            tap("Learn", navigate=True, exact=True)
            find("Learning Centre")
            print("PASS: Explore connections follows explained links, distinguishes fiction, sources and unknowns, pauses and previews optional reflection.")
        tap("Home", navigate=True)
        tap("Support & Services", scroll=True, navigate=True)
        find("Support Resources")
        if "--support-directory" in sys.argv[2:]:
            support_directory_checks()
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
    # The redesigned first card is called Start Assessment and is above the journey link.
    top()
    tap("Explore the system with a new assessment", scroll=True, navigate=True, exact=True)
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
    print("PERF: {} Android hierarchy reads ({:.1f}s total), {} complete top resets".format(
        PERF["hierarchy_reads"], PERF["hierarchy_seconds"], PERF["top_resets"]
    ), flush=True)
    logs = adb("logcat", "-d", "-v", "threadtime", check=False)
    (OUT / "startup.log").write_text(logs)
    capture("final")
    print("\n".join(line for line in logs.splitlines() if any(word in line for word in ("ReactNativeJS", "AndroidRuntime", "RNSkia", "JavascriptException")))[-16000:])
if "JavascriptException" in logs or "E ReactNativeJS:" in logs:
    raise SystemExit("Release APK logged a JavaScript failure.")
