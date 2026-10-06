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
