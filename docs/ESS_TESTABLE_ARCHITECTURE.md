# ESS Testable System Architecture v2

Design principle:

> Human on the surface. Rigorous underneath.

## Human-facing layer

The person sees plain-language prompts:
- What are you feeling?
- What appears known?
- What might be an interpretation?
- What is still uncertain?
- What choices remain?
- What is the next step?

Technical terminology is hidden behind **How ESS reached this**.

## Rigorous layer

For every processed situation, ESS can produce a structured in-memory decision record:

- architecture version
- core version
- deterministic classification
- selected pathway
- rule IDs
- uncertainty count
- whether user control remained preserved
- verification flag

It also produces an aggregate research snapshot containing counts only, not the person's raw text.

## Why this matters

This makes it possible to:
1. Reproduce why a pathway was chosen.
2. Compare behaviour across ESS versions.
3. Test whether rule changes alter outcomes.
4. Measure emotion/evidence/interpretation/uncertainty separation.
5. Audit whether choice remains explicit.
6. Build future research datasets without automatically storing raw personal narratives.

## Current limit

The architecture creates structured records in memory only. It does not automatically upload, persist, or share participant input or research data.
