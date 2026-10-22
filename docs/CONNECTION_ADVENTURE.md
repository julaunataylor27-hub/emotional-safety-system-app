# Connection Trail — cinematic investigation-inspired learning adventure
Date: 22 October 2026
Status: Prototype implementation, pending completed Android 16 smoke test

## Intent
A welcoming **adventurous hunt for connection**, not a forensic investigation, surveillance system, diagnosis or verdict about other people.

The existing gold-and-emerald cinematic Home now has a distinct bundled-path-art **Follow the Connection Trail** entry. The six clue chapters, each illustrated with a different already-bundled image, are:

1. Find the spark → existing optional assessment
2. Follow the clues → Evidence & Truth
3. Trace the sources → Knowledge Trail
4. Discover other paths → Explore Connections
5. Find your meaning → My Humanity Journey
6. Choose a connection → support and next steps

A six-dot selector and Previous/Next controls let people browse clues in any order. No stages are locked and no new user-input records or scores are stored. The shared compact compass on other pages gives a return route to the trail. Main app navigation is consistent across Home, Journey, Learn, Evidence, Support and More.

## Safety and cultural boundaries
Fictional examples and educational prompts must not imply proof of another person's intentions or identity. No culturally restricted knowledge is invented or attributed. Existing factual uncertainty labels, cited learning trails, support resources and app safety checks remain unchanged. The existing screen illustrations are symbolic and do not claim to depict a historical event.

## Build
The existing Actions workflow invokes `scripts/patch_connection_adventure.py` after other app patches and before the existing test suite, native build and Android 16 installed-APK smoke check. A new regression test confirms all six routes and distinct bundled images.

## Validation status
Code change proposed; successful installation, Android 16 compatibility, visual accessibility and actual test-run duration still require a completed workflow result.
