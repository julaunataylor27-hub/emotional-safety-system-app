# Independence & commitment · 1.8.1

Open **Learn → Independence & commitment**, the matching **More** entry, or the
button in **Our Purpose & Vision**. Public learning search includes independence,
commitment, balance, personal space and check-in.

This app-created reflection grew from Julauna Taylor's question about balancing
independence with commitment. The preceding conversation about numerology is
inspiration for the question, not evidence for a personality model. The tool is
available to anyone and does not use birth dates, numerology, a balance score,
diagnoses or a prescribed division of time. No cultural tradition is claimed.

## Four optional parts

1. **My space:** time, interests, identity, privacy and boundaries.
2. **My chosen commitment:** a small, freely chosen and realistic offer.
3. **Room to choose:** a self-reported yes, unsure, no or open answer, plus how
   the person could respect someone else's choices.
4. **Check in & adapt:** possible timing and an honest response to changing plans.

No answer is required or inferred from free text. Unsure/no answers remain visible
in the summary and export, with permission to pause, leave the commitment open,
revise it or seek support. No result certifies consent or safety. One person's
writing cannot establish another person's agreement. The fictional adult example
is read-only and cannot autofill personal needs.

## Privacy and navigation

Writing lives in separate CoreApp session state. It survives navigation and a
pause but clears on app restart. It is not added to saved journey memory,
historical notes, assessment rules or public search. The intro/footer explain
this lifecycle. Preview shows current writing before a manual system-share
action. Sharing errors and cancellation preserve the draft. Clearing asks for
confirmation and affects only this reflection. Times are text, not reminders.

All reading works offline. External source links open only after a tap; a link
failure leaves a copyable URL and retry. No private text is sent to those sources.

## Public guidance

Checked **19 October 2026**:

- WA Department of Communities, [Promoting respectful relationships](https://www.wa.gov.au/organisation/department-of-communities/promoting-respectful-relationships),
  updated 30 September 2026: independence, boundaries, respectful communication
  and joint decision-making.
- 1800RESPECT, [Signs of a healthy relationship](https://1800respect.org.au/signs-healthy-relationship):
  freedom to maintain personal interests and choices, with respect for others.

These sources support general themes. They do not endorse this app or validate
its specific prompts. The feature is a reflection prototype; improved wellbeing
or safety outcomes have not been established.

## Build and verification

`scripts/patch_independence_commitment.py` follows the law/rights/kinship patch in
the existing build sequence and connects state, routes, menu entries and public
search. The patch is idempotent and checks each expected anchor. Keep base
`App.js` in version control; do not commit its generated form.

Model and actual-app tests cover open answers, unsure/no handling, navigation,
session restoration, private-note isolation, preview freshness, share failures,
cancellation, clear confirmation, source failure/retry and support access.
The Android release smoke test adds `--independence-commitment` to verify the
installed four-part flow and capture its intro, choice, summary and preview.

Version **1.8.1 / Android versionCode 28** retains the current app identity and
dependencies. A newly built APK must be installed to update an existing phone.
