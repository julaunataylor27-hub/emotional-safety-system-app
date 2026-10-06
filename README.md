# Emotional Safety System — Mobile App Prototype

A privacy-first Expo / React Native prototype for Android and iPhone.

## Core safety signals

- Choice
- Boundaries
- Pressure
- Power
- Dependency
- Secrecy

This prototype uses a transparent local rule engine. It does not diagnose people, determine guilt, or replace emergency, legal, medical, child-protection, or professional advice.

## Android APK

A GitHub Actions workflow in this repository builds a standalone release APK automatically from the Expo project and uploads it as a workflow artifact.

## Journey memory and sharing

The build applies `scripts/patch_journey_memory.py` after the existing visual patches. It connects a summary preview, native text sharing and autosave/restore for all seven journey stages. Run the patches in workflow order before `npm test` or running the app locally; `App.js` is the original base source.

`src/journeyMemory.js` is the memory/summary engine and `src/useJourneyMemory.js` connects it to device storage. Personal answers are stored locally using AsyncStorage, which is unencrypted. No answers are committed to GitHub, sent to an AI service or shared automatically. Users review their summary before choosing a sharing destination and can clear saved journey answers. Clearing app data or uninstalling may erase this memory. Journal entries and safety-assessment descriptions remain session-only.

Version 1.0.1 (Android version code 2) requires installing the newly built APK; a source change cannot update an already installed standalone APK.

## Personal PDF documents

Version 1.0.2 (Android version code 3) adds Open My PDF, Save PDF to My Files and Share PDF above the summary. The build applies `scripts/patch_journey_pdf.py` after the memory patch. Each document is generated locally from the current seven-stage answers, with readable A4 formatting. Opening uses a compatible PDF reader; Android saving uses the system folder picker, and sharing sends a PDF attachment. Cancellation never reports a successful save. Edited answers regenerate the document before export. No personal writing is uploaded by the PDF feature.

## Journal progress

Version 1.0.3 (Android version code 4) connects the Entries and Progress tabs. Progress shows journal activity for the current session and the seven journey stages, with links to edit each stage and view the summary. Switching tabs preserves the current draft and entries. The Technology Lab progress card opens the same view. Prefilled names, motto and default values do not count as personal input; the percentage tracks stages with user answers, not wellbeing or recovery. Journey answers remain device-local. Journal notes are still session-only: copy or screenshot notes before closing or updating the app. The build applies `scripts/patch_journal_progress.py` after the PDF patch.

## Explanation tabs

Version 1.0.4 (Android version code 5) connects all four tabs on What This Might Mean. Signals shows the existing six signal statuses and coercion indicators; Emotion shows the selected/reported feeling and the existing emotional explanation; Context shows the original assessment settings and description, structural checks, input conflicts and question-mode legal information. The assessment input is captured with each result in session memory so later edits cannot change the context of an older result. A new assessment resets the tab to Overview. Next Steps remains available from every tab. Unknown signals and unscored question/observation results keep their existing meaning; this patch does not change the safety or legal rules. The build applies `scripts/patch_explanation_tabs.py` after the Journal progress patch.

## Diamond Effect and structural fact review

Version 1.1.0 (Android version code 6) adds the Diamond Effect from Structural Safety and Next Steps. People can drag the gold point or tap Truth, Values, Beliefs and Faith/Hope, write their reflections, compare two options using five transparent self-reported checks, and build a purpose and next-step plan. The count is a reflection aid, not an outcome prediction, truth score, diagnosis or measure of human worth. Harm/boundary checks marked No prevent that option being used in a plan; unknowns remain visible. Active safeguarding concerns require a protective support step and cannot be reduced by moving the diamond or changing reflection answers. Users can save a local PDF or explicitly share their text plan. Reflections last only for the current session and reset with a new assessment; no assessment or Diamond writing is uploaded automatically.

The structural review now uses explicit under-18, sexual-boundary and immediate-danger questions, selected family details, word-boundary matching, broader sexual-concern wording and age cues. It explains matched reported information and missing/conflicting details. This is safety triage and does not establish abuse or guilt. The old “No structural override triggered” wording is replaced with clearer limits and a route to review details. WA child-safety contacts and links use the [Department of Communities guidance](https://www.wa.gov.au/organisation/department-of-communities/concerns-the-safety-or-wellbeing-of-child-or-young-person), checked 7 October 2026. Existing legal-information rules remain separate. The build applies `scripts/patch_diamond_effect.py` after the explanation tabs.


## Multiple observed responses

Version 1.1.1 (Android version code 7) lets observers select several appearance labels and observable behaviours for each of up to four people. Unknown is exclusive within each group; selecting it clears the other labels, and removing the last selected label returns to Unknown. Optional names and factual observation notes stay in the app session. Emotion and Context show a separate, immutable snapshot for each person from the completed assessment. Labels include worried, sad, angry, overwhelmed, withdrawn, happy/cheerful, excited, affectionate, embarrassed and numb/detached alongside the earlier choices. Behaviours such as asleep, unresponsive, crying, pulling away and saying no are recorded separately from feelings.

Witness-mode appearances no longer receive a numeric emotional score. The result transparently counts the recorded labels, without claiming they measure risk, enjoyment, consent, intent or anyone's internal emotional state. Observed feelings cannot create or cancel a structural rule. Selected sleep or unresponsiveness plus a reported sexual concern raises capacity triage with an explicit request to clarify whose state was observed and whether contact occurred then. Those behaviour selections are ignored outside witness mode. Reported under-18 sexual concerns remain priority concerns even when the apparent feelings are calm or happy. Observation notes are displayed, not automatically interpreted as verified events. Nothing is uploaded or shared automatically. Existing personal-feeling, journey, PDF, Journal and Diamond functions remain available. The build applies `scripts/patch_observed_responses.py` after the Diamond patch.
