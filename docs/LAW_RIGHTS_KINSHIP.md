# Law, Rights & Kinship · 1.8.0

The app now has a public learning section at **Learn → Law, Rights & Kinship**,
**More → Law, Rights & Kinship**, and **Our Purpose & Vision → Law, Rights & Kinship**.
Public learning search recognises terms including LGBTQ, consent, polyamory,
kinship, legislation, Parliament and common spelling variations.

## Scope and presentation

Eighteen topics use the existing forest-and-gold styling and larger-reading
preference. People can browse Rights & law, Kinship & culture, or Parliament &
change, combine those with information-area filters, and search the public reading.
Each detail keeps its jurisdiction, status, choices, limits, a further question,
attribution, source locator, source date and check date available. Android Back
returns from a detail to its filtered list, then to Learn. A missing match offers
an explicit filter reset. Source failure retains a selectable URL and retry.

This is selected educational information, not an inventory of every Australian
law. WA-only consent, age, family-violence, recording and child-protection cards
are excluded from the Australia-wide rights-and-law view. An information-area
filter does not select a jurisdiction for a personal assessment. Other states
need their own applicable law; the existing national/state Support directory
provides local legal-service pathways.

## Legal topics and current sources

Checked **19 October 2026**. `src/lawRightsKinship.json` retains the full 25-source
register, with source-specific locators, scope and dates. This is a fixed review
date, not automatic legal monitoring or professional approval.

| Topics | Principal public sources |
| --- | --- |
| Marriage equality; three adults in a relationship | Attorney-General’s Department, Marriage equality / Get married; Justice Sarah Derrington’s 21 November 2019 Federal Court speech (dated contextual discussion, not a new rule) |
| Consent; age and authority; specified-relative questions | Legal Aid WA, Sex and consent; WA Criminal Code ss 319–322 and 329, compilation 19-aq0-01 from 1 May 2026 |
| Family violence and control | WA Government coercive-control hub, updated 30 September 2026; Restraining Orders Act 1997 s 5A, compilation 05-u0-01 from 25 September 2025 |
| Forced marriage | Attorney-General’s Department, Forced marriage |
| Privacy and evidence | Surveillance Devices Act 1998 ss 5, 6 and 9, compilation 02-g0-00 from 5 April 2023; eSafety, Collecting evidence safely |
| Intimate images | Legal Aid WA, Image-based abuse, which distinguishes Commonwealth and WA rules |
| Child safety and cultural connections | WA Department of Communities child-safety and Aboriginal Family Led Decision Making pages; Legal Aid WA, Best interests of children |
| Discrimination | Australian Human Rights Commission, Information for people making complaints |
| Law-making and participation | Parliamentary Education Office; WA Legislative Assembly petition guide; federal e-petition and committee-submission guidance |

The primary legislation index pages and current compilation details were checked.
Full-page retrieval of some Parliament pages was blocked, so the petition and
submission pathways also used the indexed official descriptions. Their detailed
rules are left for the current official page, rather than reconstructed in the
app. Unavailable Kaartdijin URLs were not added as new sources in this section.

The content distinguishes legal marriage from consensual relationships involving
three adults, and legislation in force from a proposal or petition. It does not
claim a WA standalone coercive-control offence has commenced. A signature does
not certify ongoing consent or waive the ability to report harm. Legal definitions
and cultural family labels are not treated as interchangeable. No individual’s
conduct is classified as lawful or unlawful by this section.

## Cultural authority and kinship

The framing is **living across legal and cultural systems in WA**, with many
Aboriginal Nations and diverse communities. It does not present all Aboriginal
peoples as one society or as subject to a single customary code.

Derbal Nara’s public *Moort* and *Moieties and Totems* accounts remain attributed
to their Nyungar/Whadjuk context. Kinship Connections is an Aboriginal organisation
resource, not an authority for every Nation. Native Title Tribunal information
illustrates a specific form of legal recognition of traditional laws and customs;
it is not a general statement that every customary rule has been enacted.

The AIATSIS 2020 Code of Ethics is labelled ethical guidance, rather than a new
criminal law. Public reading does not establish permission to reproduce restricted
knowledge. Professional legal review and appropriate cultural review remain
pending, clearly stated in the app. No government or community endorsement is
claimed. No restricted teachings, family ancestry, skin groups, totems or approved
partners are generated or assigned. Reading can link to the already existing
Living connections section for separately attributed accounts.

## Integration, privacy and verification

The final build step is `scripts/patch_law_rights_kinship.py`, after the support
directory patch. Follow the build workflow order when preparing `App.js`; the
tracked App.js remains the original base. No dependencies are added. Native app
identity and all existing personal-memory keys remain unchanged. Version 1.8.0
uses Android versionCode 27; an installed standalone app needs the newly built
APK to show this section.

The new screen reads bundled content offline. It has no personal-input fields,
storage writes, network requests, scoring or automatic reporting. It opens a
source only on a deliberate tap; source URLs are from the bundled register and
must be HTTPS without embedded credentials. Search never reads personal writing.
The app does not lodge submissions, sign petitions or contact anyone.

Local verification: the complete 129-test suite passes, including actual app
navigation, jurisdiction filters, public search and private-note isolation,
Android Back, source failure/retry, More/presentation entry points, cultural
learning, and Support links. The patch is idempotent, JSX compiles, and routed
legal-question validation passes. The Android release workflow includes
`--law-rights-kinship` for installed-screen checks and screenshots. A workflow
result, not these local tests, establishes whether that particular APK passed
installed Android verification.
