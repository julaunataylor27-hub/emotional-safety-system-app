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


## Observation guidance and WA support

Version 1.1.2 (Android version code 8) adds separate optional date/time, direct-observation, unconfirmed-interpretation and unknown-detail fields for each observed person. Completed assessments keep these fields distinct in Emotion and Context. Interpretations and unknowns are not parsed into reported facts or added to a risk score. Existing safety questions, the main description and selected behaviours continue to supply safety checks. Notes remain session-only and are not uploaded or shared automatically.

The witness form and Support Resources now include a shared WA support card with Central Intake (1800 273 889), after-hours Crisis Care (1800 199 008), emergency 000 and official guidance links. Opening a phone number opens the dialler; the app does not place a call or transmit assessment writing. Link failures show the numbers and copyable URLs so the person can still contact the service. Contacts were checked against the [Department of Communities child-safety guidance](https://www.wa.gov.au/organisation/department-of-communities/concerns-the-safety-or-wellbeing-of-child-or-young-person) and [Crisis Care page](https://www.wa.gov.au/service/community-services/community-support/crisis-care) on 7 October 2026. The app offers one manageable next step: keep a dated record separating observations from uncertainty, and ask a service what additional firsthand information they need.

## Analyse before choosing and triangle reflection

Version 1.2.0 (Android version code 9) moves option selection after **Analyse both options**. Comparison remains available when a harm or boundary check is marked No; adopting that action is blocked, while a pause/clarification plan can keep both options open. Every comparison exposes each option's supported, uncertain and attention checks, without choosing a winner or averaging away safety concerns. Editing either option or its checks invalidates the review and selection. Plans include both reviewed options, uncertainties and an optional chosen action. A plan can also contain a next step without any options; active safeguarding still requires a protective support step.

**Possible next steps** uses action checks. **Possible explanations** uses observation, assumption, alternative-explanation and missing-information checks, retains both explanations as unconfirmed and never adopts either as fact. Switching mode resets the checks because their meanings change. Counts are self-reported reflection checks, not outcome probabilities or a truth score.

The coloured, movable triangle explores care/connection, pressure/pain and choice/boundaries. It uses explicit Yes/No/Unsure answers, a separate repetition question, reported behaviour notes, uncertainties and emotional impact. Its symbolic equation and short possible pattern phrase show the exact reported inputs and unknowns behind them. “Possible coercive caretaking” is an app reflection phrase only when care, pressure, restricted choice and repetition are reported; missing context is not inferred. This is not a validated emotional measure, diagnosis, proof of coercive control or determination of consent. Feelings do not establish motives. Moving the point changes a prompt, while exploring more choice, clearer boundaries or appropriate support changes only the aim being discussed. Neither changes the assessment or clears safeguarding. The original reported description can be read alongside the reflection.

The triangle links to [1800RESPECT's coercive-control guidance](https://1800respect.org.au/coercive-control), checked 7 October 2026. Official guidance describes a pattern of abusive behaviours affecting freedom; the app's short reflection phrases must not be equated with a verified finding. All new writing stays in the app session and is included only in a user-requested plan PDF/text share. Existing device-local journey memory retains the same storage key. No additional native dependency is required.

## Two feelings and the possible why

Version 1.2.1 (Android version code 10) adds **Feeling 1 × Feeling 2** to the triangle and **Find a possible middle word**. Each feeling has an optional person label and a source: the user's own feeling, a direct report, an impression or unsure. A separate selection records whether the feelings belong to one person about the same situation, two people or an unknown grouping. Compact feeling pickers keep both inputs visible without leaving the screen. The centre starts with a specific instruction rather than an unexplained “Pattern unclear”.

The vocabulary rules explain why a possible word fits, suggest questions about possible causes, show missing context and expose all sources. For example, conflicting directly reported feelings in one person can offer **ambivalence**, with a link to the [APA Dictionary definition](https://dictionary.apa.org/ambivalence), checked 7 October 2026. Feelings in different people are not combined into one person's emotional state. Impressions remain **mixed impressions**; conflicting sources and grouping prompt clarification. Other short descriptions such as **painful connection** and **strained care** are app reflection phrases, not diagnoses or validated equations. Multiplication is symbolic and does not discover motives, establish causation, consent or safety. All supported pairs remain descriptive when behavioural information is unknown.

Reported care, pressure, restricted choice and repetition remain a separate behaviour review. A supported concern phrase may appear in the centre with its basis stated explicitly; positive feelings cannot cancel it or the assessment's safeguarding requirements. The result distinguishes a feeling word from a reported dynamic and distinguishes why a word fits from why behaviour occurred. Editing either feeling, source, grouping, behaviour answer or note clears the prior interpretation. Plans export a current reviewed pair, its sources, questions and unknowns; an edited or unreviewed pair is recorded without carrying forward old wording. These fields are session-only and are not automatically uploaded or shared. The existing two-option action/explanation comparison remains available further down the planner.

## Facts, rights and self-directed decisions

Version 1.3.0 (Android version code 11) adds a final **Know your rights · Leave with a purpose** review. The person confirms where the event happened (WA, elsewhere or unsure), and can record the event date, statements they were told, a legal-advice question, a boundary and a check-in step. The review gathers the completed assessment snapshot and current reflection into separately labelled observations, reported statements, unconfirmed interpretations, feelings/behaviours and unknowns. It does not independently verify events, infer motives, predict outcomes or rate truth. Appearance labels and reflection phrases cannot establish consent or guilt.

Selected WA information covers consent/capacity, age and child safety, specified family sexual-offence provisions, family violence, protection-order information, and recording/disclosure restrictions. Each topic explains why it appears, provides a primary-source link and exposes the source check date. Sexual/child topics follow reported safety context, not feeling pairs or interpretation notes. WA rules are withheld unless the person selects WA for this review; the assessment's default location alone is insufficient. Elsewhere/unsure directs the person to local advice while keeping existing safeguarding concerns visible. Current law is not automatically applied to historical events. This is a curated fixed information set, not legal advice, a live legislation feed or an exhaustive legal system.

Sources checked 7 October 2026: [WA Criminal Code](https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_218_homepage.html), current 19-aq0-01 from 1 May 2026 (ss 319–322, 329); [Restraining Orders Act](https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_822_homepage.html), current 05-u0-01 from 25 September 2025 (s 5A); [Magistrates Court protection information](https://www.magistratescourt.wa.gov.au/r/restraining_orders.aspx); [Surveillance Devices Act](https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_2979_homepage.html), current 02-g0-00 from 5 April 2023 (ss 5, 6, 9); [eSafety evidence guidance](https://www.esafety.gov.au/key-topics/domestic-family-violence/collecting-evidence-safely); [Legal Aid WA](https://www.legalaid.wa.gov.au/get-legal-help); and [WA child-safety guidance](https://www.wa.gov.au/organisation/department-of-communities/concerns-the-safety-or-wellbeing-of-child-or-young-person). Official act pages include current versions and version histories. The app encourages qualified advice about applicability, role-specific reporting duties and lawful recording or disclosure, without adjudicating exceptions.

The final decision review repeats the person's purpose, next step, protective support, boundary and check-in plan. **Encouragement** affirms self-worth, support and careful choices toward a kinder future without promising safety or resolution. The entire review and note are included in the explicitly saved PDF/text plan. Changes hide the previous preview and regenerate the export from current inputs. Link failures retain copyable URLs and phone numbers. No calls, uploads, messages, reminders or sharing occur automatically; writing remains session-only. Existing safeguarding requirements and the device-local journey storage key are unchanged.
