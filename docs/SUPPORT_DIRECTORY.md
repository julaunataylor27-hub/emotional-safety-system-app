# Australia support directory - Android 1.7.7

Open **Support** from Home or the bottom navigation. Choose National or one of
WA, NSW, VIC, QLD, SA, TAS, ACT and NT, then a type of help. Public search combines
with those choices. Emergency 000 stays available regardless of filters. An empty
result offers a reset to national support. Filters remain in the current app
session when navigating away and back; no location permission is requested.

The directory bundles the 73 service/directory records researched on 18 October
2026 in `src/supportDirectory.json`. One Aboriginal Legal Service entry covers
both NSW and ACT. The existing 13YARN national resource is retained separately
from this research dataset. Each new service card shows its audience, purpose,
hours and labelled telephone/text options, or a website for online directories.
Expandable details contain notes, the checked date and the verification source.
Source URLs remain selectable. Phone, text and website actions require a tap;
they do not include assessment, journal or journey writing. Failures display a
manual contact option and a retry next to the affected service.

Government, provider and sector-peak pages were used as verification sources.
Provider-specific hours were preferred where older directories disagreed.
This is a starting directory, not an exhaustive list of every local service;
contact numbers were not phone-tested. Eligibility, fees, hours and availability
need confirming with the service. Website-only entries do not invent a phone
number. Limited geographic coverage and after-hours-only lines are labelled.

Notable distinctions preserved in the records include WA SARC medical versus
telephone-counselling hours, Victoria's sexual-assault counselling versus
after-hours response numbers, Victoria's regional child-protection lines,
Queensland's regional business-hours versus after-hours intake, and regional
NT services. FIRST Canberra is listed under its current name, with OneLink
retained as a searchable former name.

The Android workflow applies `scripts/patch_support_directory.py` after the
existing patches. `App.js` in the repository remains the unprepared source;
do not commit the generated app after running the build patches locally.
`tests/support-directory.test.cjs` checks reachability and contact scope;
`tests/journey-ui.test.cjs` exercises the actual screen, navigation, source
actions, failures and state retention. Android smoke testing selects ACT
housing and national First Nations support and saves evidence screenshots.

Version 1.7.7 uses Android versionCode 25 and the existing package ID.
