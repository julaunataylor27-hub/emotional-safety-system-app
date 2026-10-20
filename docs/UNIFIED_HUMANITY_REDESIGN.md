# Emotional Safety System — Unified Humanity redesign

**Status: PREPARATION ONLY · not installed, not an active app theme.**  
**Approved visual direction:** Warm sunrise on Country, cream reading surfaces, deep eucalyptus/forest headers, ochre-gold actions, terracotta only for important support, shared tree-and-community token.  
**App identity:** *Grow Yourself. Grow Humanity.*  
**Branch:** `design/unified-humanity-theme-foundation` (do not merge before complete cross-screen review).

## Why this branch exists

The last release combined a cinematic Moonlit Riders Home with older forest banners, different bottom navigation layouts and separate page styling. A visual refresh of Home alone does not create a theme. In particular:

- `src/GoldenTreeHome.js` contains both older styles and a later `Object.assign` cinematic override.
- `src/PresentationTheme.js` exports hard-coded `P` colours and static `presentationStyles` overrides.
- `src/PresentationChrome.js` provides header, navigation and scenic banner styles different from Home; it also shows five tabs while the current Home lists six.
- `src/PreferencesScreen.js` saves language/region/reading preferences but has **no whole-app theme selector**.
- `src/EvidenceTruthScreen.js`, `src/SupportDirectoryScreen.js`, `src/KnowledgeTrailScreen.js`, and other secondary views maintain their own styles.
- Many `scripts/patch_*.py` files modify `App.js` during the Android workflow. Changes need to survive **the patched release**, not only the unpatched source.

**Reference stable baseline:** successful Android workflow run 39372820153, commit `13ced60b61e6417d6eed684b0d867117d99bf3c4`. This branch starts from that main-branch commit and must not change its working APK.

## Master visual contract

- **Background:** Sand Cream `#F9F3E8`; reading cards `#FFF9EF`; warm panels `#EAD9BE`.
- **Foreground:** Deep Brown `#25221D` text; Forest `#193D32` for headers, major navigation and selected states.
- **Actions:** Sunrise Gold `#ECB65F` for primary actions; Ochre `#C6812A` as an accent, Terracotta `#A74634` for urgent actions only.
- **Secondary:** Eucalyptus `#57744D`, Muted Teal `#336C73`.
- **Fonts already bundled:** Marcellus headings (`ESSHeading`) and DM Sans body (`ESSBody`).
- **Touch and text:** Minimum 48dp interactive targets, body generally >=16sp, captions >=14sp. Keep text on readable solid/gradient overlays; do not rely on photos for contrast.
- **Core values:** Knowledge, Understanding, Love, Kindness, Patience, Growth, Humanity and Life. On narrow phones or large text settings use two columns rather than tiny/truncated labels.
- **Illustrations:** Consistent sunrise/rivers/trees/people. Generated images are concept illustrations, **not archival evidence**. Cultural artwork, stories and symbols need appropriate permissions and cultural review before distribution.

The draft machine-readable design contract lives in `src/unifiedHumanityTheme.cjs`. It contains six screen definitions, colour/spacing/type/button tokens, value names and a mapping from existing secondary routes to visual families. **It is not yet imported by the application.**

## Approved wording and layout by main screen

| Screen | Heading | Intro / action | Visual treatment |
| --- | --- | --- | --- |
| Home | **Knowledge Creates Choice** | “Culture, evidence and emotional safety to support stronger individuals, families and communities.” · **Explore the System** | Sunrise hero and eight values |
| Journey | **My Humanity Journey** | “Grow yourself. Grow humanity.” · **Start / Continue My Journey** | River/path and reflection cards |
| Learn | **Learn Together** | “Ideas. Perspectives. Real Change.” | Warm educational topic cards; existing learning trails |
| Evidence | **Evidence & Truth** | “Understand the facts. Explore your options.” | Minimal decorative background; reported facts, interpretations and uncertainty |
| Support | **You Are Not Alone** | “Support. Connection. Hope.” · **I Need Support Now** | Reassuring community imagery and plain support directory |
| More | **Settings & More** | “Your app. Your preferences.” | Clear settings, reading/language, documents, about and privacy |

All pages must use one shared header, card components, type tokens, dialogue sheets and **consistent** bottom navigation. Target tab order: **Home · Journey · Learn · Evidence · Support · More**. On compact devices validate six-tab label legibility and Android safe areas; do not add a second or third navigation bar. The approved concept mockup with four phones is a **design target**, not production screenshots.

### Secondary screen coverage — required before theme switching

- **Journey family:** foundation, values, identity, story, projects, sharing, legacy, technology, summary, journal, Yagan Life Journey.
- **Learning family:** Safe Curiosity, Knowledge Trail, Living Connections, Cultural Inquiry, Learning Together, Explore Connections, Law/Rights/Kinship and Independence/Commitment.
- **Evidence family:** assessment, analysis, results, explanation, next steps, structural safety, Diamond Effect, report/PDF previews.
- **Support family:** support directory, emergency and crisis pathways, source/link error and retry screens.
- **More family:** settings, presentation overview, about, translation notices, document and sharing controls.
- **Shared:** any extra/dynamic route, confirmation dialogs, alerts, fields, forms, tabs and sheets.

Theme application must be comprehensive. An off-brand secondary page counts as an **incomplete theme**, even if Home looks correct.

## Engineering order — one careful change at a time

1. **Baseline:** Keep release run 39372820153 and all existing tests. Do not edit `main` for the redesign.
2. **Design contract (this PR):** Add central tokens, route map, readability decisions and automated contract tests. No UI or saved-data changes.
3. **Theme engine (future PR):** Build a provider/hook that supplies a complete theme to every screen/component. **Do not change a global mutable `P` object:** existing `StyleSheet.create` styles are often evaluated once at module load and won't update correctly.
4. **Safe persistence (future PR):** Add a `themeId` to preferences with a carefully tested **backward-compatible** migration. Old `ess.preferences.v1` records must retain language, country, reading size, motion and requested language; never reset journey/journal/assessment storage. If loading fails, preserve existing data and show recovery UI.
5. **Shared components (future PR):** Header, six-tab navigation, primary/secondary/urgent buttons, cards, forms and modals. Keep testIDs and accessibility labels stable, or update checks to verify the same real interaction.
6. **Main screens (future PRs):** Home, Journey, Learn, Evidence, Support, More; apply shared components, preserving the existing feature routes. No dummy actions.
7. **Every secondary screen (future PRs):** Update all route families listed above. This includes code inserted by Android build-time patch scripts; use one source of truth that survives the patched release.
8. **Theme selector only when complete:** In Settings, select Unified Humanity across all screens. If Moonlit Riders is offered later, it too must have a **complete** screen-wide token/asset set. Never expose a partially applied choice as a full theme.
9. **Verification:** Run unit tests, patched build tests, screenshots, Android 16 installed-app smoke tests, and Samsung user checks. Only then merge the redesign and cut a new APK.

## Testing gates

- **Consistency:** No Moonlit/golden-tree banner unexpectedly appears in Unified Humanity; all six main screens and every secondary route share the selected tokens.
- **Readability:** 360dp/390dp Android viewports, font scale 1.0/1.3/1.7, standard/large in-app reading size. `Understanding` must not split into a stray final letter. Wrapping where genuinely needed is better than illegibly small text.
- **Navigation:** Buttons go to actual tools, including Evidence and urgent support. Hardware Back, modals, tabs and bottom nav all work.
- **Data protection:** Theme changes never overwrite journal entries, device-local notes, journey progress, exports, or valid stored preferences. Test save failures and retry; avoid silent resets.
- **Safety logic:** Leave evidence/uncertainty classifications, crisis routing, coercion indicators and child-protection cautions unchanged. Do not imply the app itself proves allegations or is a validated clinical/legal assessment.
- **Sources:** Australian and WA contact numbers, jurisdiction labels, links, source URLs, Indigenous provenance and cultural draft caveats remain available and accurate to the same level as the baseline. Update links only in a separately verified content change.
- **Release:** UI test + test bundle + standalone APK + Android emulator smoke + screenshot review all pass before reporting “ready.”
- **Real device:** Test on Samsung after automation passes. Emulator success is not proof of all-device compatibility.

## Explicit non-goals for this preparation branch

No redesign of live screens yet; no replacement of approved historical/cultural images; no new behavioural classification, recommendation algorithm, monitoring capability, chip, adult content, user accounts, backend upload, support claim, or changes to child safeguarding. No rebuild is needed simply to review this foundation.

## Definition of done for the preparation stage

- [x] Separate GitHub branch preserves the working release.
- [x] Central theme contract with six screen definitions and eight values.
- [x] Screen-family coverage map and responsive-value-grid rule.
- [x] Contract tests for structure, visual contrast and accessibility defaults.
- [ ] Draft pull request reviewed; migration approach approved before any UI changes.
- [ ] Real visual rollout and full-system switching (future work, **not complete**).

**Guiding rule: a theme change must eventually update the entire Emotional Safety System, not only Home, without altering personal data or safety behaviour.**
