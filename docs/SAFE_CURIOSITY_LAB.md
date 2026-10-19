# Safe Curiosity Lab — offline proof of concept (v1.9.0)

**Status: prototype demonstration, not a child-protection product, internet filter, AI model or chip.**

## Goal

Test whether a small number of age-appropriate educational responses can be presented alongside transparent safeguarding explanations in the existing Emotional Safety System app. Keep healthy curiosity distinct from danger, avoid shaming normal questions, and protect privacy.

## How to try

From **Learn → Safe Curiosity Lab** (also under **More**):

1. Select an example age range; no birth date, account or identity is collected.
2. Tap one of five fictional examples, or type a non-identifying question.
3. Tap **Explore safely**. Read the matched example category, the reason, the educational text and next step.
4. Try a question not covered by the examples. It should say the lab cannot assess it, not declare it safe.
5. Change the age range, edit the text, or clear the question. Results must reset.

## Technical scope

- `src/safeCuriosity.cjs` implements a small, deterministic, keyword-based offline example engine. Urgent words are checked first.
- `src/SafeCuriosityScreen.js` is the gold-and-forest native screen, with accessible controls and a no-personal-details warning.
- The lab does not fetch URLs, analyse webpages, inspect images or videos, use machine learning, infer emotions, request device permissions, upload text or write lab questions to persistent storage.
- No existing legal, culture, journey, safety-assessment, or safeguarding rule is modified.
- The question and selected age band are temporary React component state, not a background monitoring service. No claims of effective real-world content protection are made.

## Limitations and review before use with children

Keywords can miss risks and return the wrong category. The examples have not been evaluated for sensitivity, cultural appropriateness, child development stages, accessibility, false negatives, or real-world outcomes. A trusted adult and qualified safeguarding reviewers should evaluate prototypes before trials with minors. Genuine device-wide filtering would need opt-in and platform integration, security and privacy impact assessment, safe age assurance where appropriate, a child-rights review, and a tested process to address mistakes and complaints.

## Demonstration checks

Run `node --test tests/safe-curiosity.test.cjs`, then follow the Android workflow steps to patch the app, test and build. Document all successes and failures without using real child disclosures or sensitive personal data.

## Future engineering hypothesis

With suitable partners, explore a supported-browser test, followed by an on-device AI model running on a phone's existing neural accelerator. Do not promise universal web coverage or physical chip integration before controlled evidence supports either.


## Knowledge Trail addition — version 1.9.1

The learner now sees four expandable explanations per supported topic, two optional deeper questions and one check-your-learning question. The quiz is an educational check, not a safety, health or psychological score. Human-edited material sits in `src/safeCuriosityKnowledge.cjs` and uses fixed source URLs (eSafety and Raising Children Network), verified for this draft on 19 October 2026. Sources open externally only after tapping, never automatically. A failed link leaves a copyable URL. Younger audiences see simplified body/privacy content; more explicit adolescent source links are not offered to under-13 bands.

Unknown questions remain unknown and show a research method rather than fabricated subject knowledge. Possible urgent disclosures do not become quiz exercises. No real child disclosures should be used in testing. Source content is static, not refreshed when the internet changes. Before real deployment, commission expert fact review, local cultural review, child safeguarding assessment, usability testing and privacy impact assessment.

Run `node --test tests/safe-curiosity.test.cjs tests/safe-curiosity-knowledge.test.cjs`. The GitHub app build workflow includes both via npm test.
