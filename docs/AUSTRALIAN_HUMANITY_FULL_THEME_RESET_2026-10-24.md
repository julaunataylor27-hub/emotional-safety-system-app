# Australian Humanity — full theme reset plan

**Date:** 24 October 2026  
**Project:** Emotional Safety System / Australian Humanity  
**Stage:** Design-system foundation and rollout specification  
**Status:** Development proposal; do not describe as a finished app until a passing Android release build and visual device checks.

## 1. What is wrong today
The Home screen uses realistic Australian landscapes, but the broader app chrome, Journey banners and some learning tools still use the older forest-green palette, moonlit illustrated tree and different spacing. `App.js` is assembled from many sequential patch scripts during CI, while modern screens also have their own local styles. Replacing one background image is not a whole-app theme conversion.

## 2. Design decisions
- **Brand:** Emotional Safety System / Australian Humanity, “Knowledge Creates Choice”.
- **Mood:** cinematic, human, calm, credible. Use approved river, bush, sunset, starlight and gathering scenes.
- **Palette:** background `#060E18`, panels `#0B2633` / `#123643`, cream `#FFF6E8`, gold `#F1B650`, muted `#D0D7D7`.
- **Typography:** existing ESSHeading for major titles and ESSBody for buttons and paragraphs. Font size/line height must remain legible when enlarged.
- **Components:** navigation, header, scene panels, page gutters, cards, buttons and labels use the same design tokens.
- **Image policy:** artwork has **no baked-in words, fake controls, false official symbols or invented cultural claims**. Text and navigation remain native and accessible; use tinted scrims for readability. Scenic art is illustrative, not evidence or community-endorsed traditional artwork.
- **Safety:** never hide support controls under scenery. Avoid flashing or distracting animation, preserve a reduced-motion option.

## 3. Architecture
```
assets/graphics/australian-humanity/*.webp
                   |
                   v
src/theme/AustralianHumanityTheme.js  <- one palette, spacing, image map
          |                     |
          v                     v
src/PresentationTheme.js   src/NightForestScene.js (compatibility scene adapter)
          |                     |
          v                     v
src/PresentationChrome.js (shared header, bottom nav, ScenicBannerV2)
          |
          +--> Home / Journey / Learn / Evidence / Support / More
          +--> Two Flames / Cultural knowledge / Connection Trail / Legal guidance
```
The previous interface name `NightForestScene` is temporarily retained to avoid breaking older imports. It now renders an Australian Humanity landscape rather than drawing a different visual identity. Eventually replace that import name with `AustralianHumanityScene` after all references have been migrated.

## 4. Screen-by-screen design and content map

| Screen | Art direction | Main action | Important restriction |
| --- | --- | --- | --- |
| Home | Starry river and sunset; full-height hero | Explore the System | Always show urgent support and native nav |
| Journey | Bush pathway / night-sky landscape | Choose chapter or reflection | Keep device-local journal, PDF/export and stage progress |
| Learn | Golden-hour river or book imagery | Search and open lessons | Preserve source links and user reading preferences |
| Emotional Safety | Quiet river at sunset | Reflect on feelings, boundaries and choice | Never diagnose or claim inferred certainty |
| Evidence & Truth | Rocky Country / calm river | Distinguish observed facts and unknowns | Preserve transparent scoring limitations and source trails |
| Support | People together at a lookout | Open local/national support resources | Always accessible, particularly in a crisis |
| Culture & Humanity | Country landscape | Explore Country, kinship and identity | Do not imply pan-Aboriginal cultural authority; validate with communities |
| Two Flames | Campfire with separate people, shared light | Explore joy, space, choice and honesty | No pressure, assumptions, promises or labels |
| Connection Trail | Landscape journey linking distinct scenes | Follow six clues | Different artwork per clue, navigation stays live |
| Law & Rights | Restrained Country imagery + readable cards | Read verified jurisdiction-specific laws | No unverified legal conclusions |
| More / Settings | Subtle background and calm cards | Change language, text size and motion | Readability before ornament |

## 5. Rollout

1. **Foundation (this branch):** Centralise palette and image map. Align the shared non-Home header and navigation with Home. Replace inherited moonlit-tree scenic banners with Australian landscape imagery, using different scenes where possible.
2. **Card and component migration:** Move repeated hard-coded styles from Home and learning screens into shared card/button/header components; remove old overrides only after test coverage and design review.
3. **Screen conversion:** Connect Journey, learning subpages, culture, evidence, law, support and Two Flames to the scene map; check image crops for portrait Android and large fonts.
4. **Accessibility and cultural review:** Contrast, 48dp touch targets, hardware Back, reduced motion, read-aloud/text scaling, support visibility, cultural permission and attribution review.
5. **Android QA and release:** Run `NODE_ENV=test npm test`, Metro bundle, native APK build and Android 16 installed-app smoke checks, plus visual screenshot review. Preserve ability to roll back to the previous passing APK.

## 6. Definition of done
- Every major screen uses a consistent palette, typography, nav and card structure.
- Different screen assets are actually displayed, not repeated placeholder images.
- Buttons, learning trails, journal, PDFs, emergency support, six safety signals and law/cultural disclaimers still function.
- No stray old illustrated-tree banners unless explicitly retained as historical artwork.
- Passing pull-request validation plus a *new* successful installed Android APK run with visual review.
- No automatic merge of this full redesign without visual approval.

## 7. File plan
**Initial foundation:** `src/theme/AustralianHumanityTheme.js`, `src/PresentationTheme.js`, `src/NightForestScene.js`, `src/PresentationChrome.js`, image-bearing main screens and regression tests.  
**Later component work:** `src/GoldenTreeHome.js`, individual feature screens, then an intentional simplification of the `scripts/patch_*.py` pipeline. Functional rules and memory/PDF code should not be rewritten for a style change.
