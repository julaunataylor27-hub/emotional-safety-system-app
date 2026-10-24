# Australian Humanity — approved scenic theme integration
**Date:** 24 October 2026  
**Status:** App-artwork implementation for Android build review  
**Category:** Technology / app development / visual design

## Artwork
Eight individually generated, user-approved landscape scenes are bundled as compressed WebP images under `assets/graphics/australian-humanity/`. Original PNGs remain in the prior design pack. Each WebP is a real image file and works offline.

| Asset | Use |
| --- | --- |
| home-hero.webp | Home hero |
| knowledge-card.webp | Knowledge card / Connection Trail |
| emotional-safety-card.webp | Emotional Safety card / trail |
| evidence-truth-card.webp | Evidence & Truth card / trail |
| support-services-card.webp | Support & Services card / trail |
| culture-humanity-bg.webp | Cultural Connections hero and Connection Trail |
| my-journey-bg.webp | Life Journey scenic header and trail |
| two-flames-bg.webp | Two Flames learning hero |

## Safeguards
- All text, menus, controls, links, modal content, forms and safety rules remain actual React Native components.
- Decorative scenery is never used as evidence of an event, an authentic image of an identifiable sacred site, or an endorsed depiction of a particular Aboriginal Nation.
- Generated ornamental dots and colours are graphic design choices only, not claimed to reproduce traditional restricted designs.
- No behavioural interpretation, legal outcome, risk scoring, storage, or medical advice is changed.
- These assets are bundled offline and require no internet access or tracking.
- Cultural content and historically specific interpretations still require appropriate First Nations consultation.

## Verification
After PR merge, GitHub Actions will prepare the app using the existing safety patches, run unit tests and the required Android build checks. A new downloadable APK exists only after the build and smoke tests pass.

## Source assets
The assets are recompressed from the user-approved PNGs on 24 October 2026 for mobile performance. The original PNGs are preserved in the prior Australian Humanity GitHub Ready design pack.
