# ESS v2 — Locked layout, new content copy
Started: 2 November 2026 (Australia/Perth)

## Baseline
- The user-approved ESS v2 structured APK was built successfully from commit `4c486f849e2ef17e6c5300c4c43175661b66d406` (GitHub Actions run 41376149682).
- **Untouched locked copy:** branch `ess-v2-layout-locked-20261102`, at that exact commit.
- **New content copy:** branch `ess-v2-content-integration-20261102`, created from the exact same commit.
- Existing main app, v2 clean-rebuild branch, released APK and private project archive are unchanged.
- The baseline APK remains the correct download if the user wants to return to the design they already liked.

## Scope of integration
Only add capabilities inside the existing Home, Journal, Learn, Support, More and ESS Core structure. Preserve the cinematic 2027 theme, five tabs and Android safe areas. This connected testing copy deliberately uses **a separate Android package** (`au.com.emotionalsafetysystem.v2.connected`) so it installs alongside the original app instead of overwriting it. Never import the old v1 screens or patch scripts.

Added **7 offline public learning trails** with questions, limits, scope, source-specific attribution and deliberate external links:
- Evidence & Truth Lab (research method and safe evidence)
- Law, Rights & Kinship (overview, not legal advice)
- Ancient Animals & Evidence (museum evidence and separately attributed Yamuti discussion)
- Historical Life Journeys (how to read histories, not personal genealogy)
- Connection Trail (the six-stage original curiosity framework)
- World Wide Web Trail (public historical method)
- Safe Curiosity Principles (educational overview, not a child-protection product)

Imported the project's **73 dated public directory entries**, with region and text search, expandable details and explicit contact/source actions. Their checked date is 18 October 2026; not live availability or eligibility verification. No background GPS, messaging, recording or notes transfer.

## Boundaries
- **No private family research, ancestry, confidential intellectual property, unpublished research evidence or restricted cultural knowledge is moved into the app.**
- No cultural review has been certified; cultural review pending. No government, institution or museum endorses ESS through a link.
- The museum and government source links are attribution and education, not proof of each ESS interpretation; legal, cultural, clinical and safeguarding expert review remains pending.
- A source-specific review date is shown; dates are not rolling checks. Outgoing links require a deliberate tap. Reflection and journal entries are never added to external URLs.
- User Journal entries remain session-only until user-controlled protected storage is designed, reviewed and tested.
- Safety rules, uncertainty, personal consent, user review and urgent support options remain unchanged.
- APP content additions use blank thumbnail icon fallbacks instead of duplicating landscape pictures.

## Single-system connected experience
- **More → System Map:** direct actions for Understand, Evidence, Learn, Reflect, Support and Connection Trail. No extra tab.
- **Learn → Connection Trail:** 6 optional selectable clues, Previous/Next, direct routing to related public reading, blank ESS Core reflection, session-only Journal and user-chosen Support. Users may leave at any time; no score.
- **Learn → any topic:** public knowledge, relevant source status and links, related trail, a deliberate blank ESS Core reflection and optional Support route.
- **No personal data handoff:** reading and public queries are not copied to Core, external providers or service URLs. No automatic saving.
- **Navigation resets to top** when opening a new route; the active Android inset and 2027 visual tokens are retained.
- **Quality gates:** content dataset + page metadata tests, six-step route tests, visual identity tests and complete Android APK compile.
- **Faster clean builds:** obsolete commits are cancelled by workflow concurrency; the latest build still runs all checks.

## Next content migrations (not yet included)
- Full interactive legal reading from the vetted 25-source register after legal review and fresh source checks.
- Individually attributed cultural comparisons after relevant knowledge-holder review and permission checks.
- Historical Life Journey modules after cultural/sensitive-source clearance; private genealogical work stays out.
- Detailed megafauna species pages and illustrations after image permissions and scientific review.
- Structured Web milestone picture trail with rights-checked media.
- Protected journal storage / PDF export after explicit privacy and safeguards review.
- Broader accessibility preference and language support, tested end to end.

## Build → test → download
- Test on this branch with `cd v2 && npm test` after installing dependencies.
- Prepare locally licensed photographic assets with `npm run prepare:art`; app reads new source data offline.
- Build via the ESS v2 GitHub Actions workflow on the content branch, keeping artifact name separate from the locked baseline.
- Compare all five tabs and each new entry on Android before the user approves release.
- **Never merge into main or update the baseline branch without the user's explicit approval.**
