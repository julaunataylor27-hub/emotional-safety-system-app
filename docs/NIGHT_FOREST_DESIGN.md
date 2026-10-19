# Emotional Safety System — Night Forest redesign (v2.0.0)

**Design reference:** User-approved concept mockups of Home, Safe Curiosity Lab, Explore the Knowledge, Evidence & Truth and Support Resources (19 October 2026). These are conceptual compositions; native responsive screens cannot be pixel-for-pixel identical at every phone size. This update recreates their style with functioning controls, rather than displaying mock-up screenshots.

## Visual system

- Midnight navy and deep forest teal for scenic sky and pages; consistent warm ivory and luminous gold for text, icons and active states
- Scenic illustration: `src/NightForestScene.js`, deterministic native SVG (moon, stars, mountains, water, glowing leaves, golden tree). It is an illustrative native component, not a stock photo, Aboriginal motif, generated character or endorsed cultural artwork
- Four core experience routes: Home, Learn, Support and More; the existing Journey route remains as a fifth tab so no journey work is lost
- Enlarged rounded, high-contrast cards; touch targets 48 dp or greater; scrollable panels; real native buttons
- Typography uses the existing project heading and body families; no new font files are shared

## Functional acceptance checks

1. Home cards: Assessment → assessment, Safe Curiosity Lab → safeCuriosity, Evidence & Truth → evidence, Support Resources → support, More → more. Back/menu, Journey, values, Life Journey, Settings and Learn remain functional.
2. Safe Curiosity: select age range, choose a fictional question or enter a new one, review a transparent local-rule result. The **Explore the knowledge** action opens a separate view with working accordion, follow-up questions, quiz feedback, external sources and Back to Safe Curiosity navigation.
3. Evidence & Truth: fictional examples, feeling selection, local assessment output, fact/interpretation/uncertainty, and support route remain wired.
4. Support: emergency link, state/territory selector, category selector, search, direct phone/website source links and failure retries remain wired. No automated calls.
5. Other screens: shared palette and scenic banners apply to journey, information and learning screens without removing their functional logic.
6. On Android: check the supported APK, installed-home visible, knowledge journey, source content and existing smoke tests. Inspect captures on the Android 16 emulator and test on an actual Samsung before public use.

Automated tests cover routing and logic but cannot prove all conceivable user interactions, device sizes, or real-world content protection. Field testing remains necessary.

## Safeguarding and privacy

The app remains a **prototype**, not an operating-system-wide filter, monitoring chip, validated mental-health test, legal verdict or child protection system. The Safe Curiosity Lab is example-driven and offline: it does not inspect a child's browsing history, identify people or send prompts online. Do not invite actual child disclosures into research testing. Require qualified accessibility, child-development, cultural, privacy and safeguarding review before deployment with minors.

## Release and installation

Version 2.0.0, Android versionCode 31. Source changes do not update an installed standalone APK. A passing GitHub Actions build should make an artifact named `Emotional-Safety-System-Standalone-APK` available from the build run's **Artifacts** section. Save/extract its ZIP and open the APK on Android. Distinguish a completed code validation from a successfully built and smoke-tested APK.
