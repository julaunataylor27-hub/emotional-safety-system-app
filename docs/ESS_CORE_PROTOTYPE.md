# ESS Core Prototype v1

This branch introduces the first stand-alone **Emotional Safety System Core**.

## Why this exists

The app already has a deterministic Evidence & Truth Engine. The ESS Core builds on that work and turns a person's input into a consistent structure that future app screens, APIs, research tools, or AI components can use.

## Current flow

```text
Person's words
   ↓
ESS Core
   ├─ Emotion cues
   ├─ Reported observations
   ├─ Possible interpretations
   ├─ Unknowns / uncertainty
   ├─ Existing Evidence & Truth safety assessment
   ├─ Choice options
   └─ Next pathway
```

## Important architecture rule

**AI may later help interpret language, but the ESS Core governs the pathway.**

The current prototype deliberately uses no remote AI.

## Example

Input:

```text
He hasn't replied for 6 hours. I feel rejected and I think he doesn't care.
```

Output includes:

- emotion: rejected
- reported observation: no reply for six hours
- interpretation: "I think he doesn't care"
- unknown: why the person has not replied
- safety classification: insufficient/unknown unless stronger safety language is present
- next pathway: truth_and_evidence
- choices: wait, ask calmly, take space, or decide later

## Files

- `src/essCore.cjs` — prototype logic
- `tests/ess-core.test.cjs` — regression tests
- `src/evidenceTruthEngine.cjs` — existing engine reused by the core

## Next build stages

1. Run the ESS Core tests.
2. Add an on-device prototype screen that shows the structured result.
3. Connect that screen to the existing Evidence & Truth area.
4. Add a small API boundary only after the local core is stable.
5. Add AI language interpretation behind a strict structured schema.
6. Add trusted knowledge retrieval.
7. Add research measurement and professional safety review.

## Safety and evidence limitations

This prototype does not verify events, diagnose people, determine legal responsibility, or replace emergency/professional support. It is designed to keep feelings, reports, interpretations, uncertainty, choices, and safety signals visibly separated.
