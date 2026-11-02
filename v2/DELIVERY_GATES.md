# ESS v2 — End-to-end delivery gates
Date: 2026-11-02 (Australia/Perth)
Scope: development branch only, not the published v1 Android app
Design reference: docs/ESS_V2_2027_VISUAL_SOURCE_OF_TRUTH.md
Principle: each feature must help a person understand, choose, learn, reflect, or get support.

## 1. Functional architecture
- [x] New independent v2 Expo app with Home, Journal, Learn, Support, More
- [x] Eight-step guided ESS Core and explainable deterministic rules
- [x] Core to Learn, Journal and Support handoffs
- [ ] Review core accuracy and limits with qualified specialists; never call it a verified truth detector

## 2. User usefulness
- [x] Five explanatory Learn trails with source/uncertainty warnings
- [x] Context-aware Support modes: calm, boundaries, coercion, urgent
- [x] Support cards open useful details; verified Australian phone/web options are optional, not automatically contacted
- [x] More cards explain the prototype and its limitations, rather than doing nothing
- [x] Journal reflection entry, filters and session history
- [ ] Protected local storage, user-controlled deletion and export for Journal
- [ ] Source-reviewed cultural, historical, legal and service content
- [ ] Optional feedback capture only after consent, privacy and delivery method are approved

## 3. Privacy and safeguarding
- [x] No fabricated example notes presented as personal saved entries
- [x] Journal clearly states entries are session-only
- [x] External support calls/links require a deliberate tap
- [ ] Privacy threat model: coercive use, shoulder-surfing, sensitive data and device sharing
- [ ] No automatic uploads; audit all libraries and permissions before release
- [ ] Accessible urgent safety guidance and specialist content review

## 4. Visual acceptance
- [x] Locked 2027 earth design direction and unified five-tab shell
- [ ] Check every screen against approved reference on actual phone and Android emulator
- [ ] Accessibility: dynamic fonts, contrast, dyslexia-friendly spacing, screen reader and tap target tests
- [ ] Confirm no duplicate or off-direction images, false controls, unreadable text or theme inconsistencies

## 5. Build -> test -> download
- [x] Structural, rules and end-to-end automated test suites exist
- [x] Added support action/contact tests and Journal/More transparency tests
- [ ] Reconfirm all automated tests pass on latest v2 branch
- [ ] V2 clean release APK GitHub workflow succeeds
- [ ] Android 16 emulator installation, navigation, back, emergency links and phone dialler tests pass
- [ ] Real Samsung phone test, including private-storage behaviour and accessibility
- [ ] User reviews the complete v2 look against the approved image
- [ ] Only then approve merge, publish a release and give a direct downloadable APK

## Important boundary
Draft and tested-in-CI are not the same as installed, verified, privately reviewed or production ready.
Do not merge into main or publish a v2 release until the unfinished gates are checked and approved.
