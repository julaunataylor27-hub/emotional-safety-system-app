# Living connections — educational research draft

Added to **Learn → Living connections** and **More → Living connections** in version 1.7.1 (Android version code 19).

The screen carries the user-reviewed research draft into the native app: ten connection views, twenty public words/concepts, twenty-one research-source links and seven wider research/protocol links. The short accounts are available offline; external pages require a browser and connection. Links open only after a tap. If opening fails, the URL is selectable for copying and the link can be retried.

## Purpose and boundaries

For inspiration, learning and understanding. This is an AI-assisted summary of selected public sources checked on 15 October 2026. Cultural review, reuse permissions and legal review remain pending; no community endorsement is claimed. It is not a complete national catalogue, a genealogy, a boundary map, a clinical tool or evidence that the Emotional Safety System improves safety or wellbeing.

Documented connections are distinguished from the app authors' thematic comparisons. The latter compare distinct published accounts and do not establish common descent, interchangeable teachings or one universal Aboriginal system. Nations, language groups, clans and individual voices retain their source identities. The Noongar trilogy is credited to Collard, Harben and van den Berg's 2004 study rather than attributed to Yagan personally. Charmaine Papertalk Green's essay is identified as a particular first-person account.

## Cultural-use and source limits

- The Ngarrindjeri Regional Authority asks people to seek advice about use of its knowledge, including distribution, storage and reproduction. The draft therefore directs readers to its own pages for Ruwe/Ruwar, Yannarumi and Yarluwar-Ruwe rather than reproducing explanations. Guidance has not been obtained.
- The Tasmanian Aboriginal Centre's published palawa kani language-use protocol is linked. Reporting on its public language program does not claim permission to create new translations, language products or teaching material.
- The Wilgie Mia entry attributes regional connections to Wajarri evidence recorded in *Hamlett [2018] FCA 545*, paragraphs 46–48. Its URL is a hosted copy of the judgment, explicitly identified as such.
- The AIATSIS map is linked, not reproduced. No cultural artwork, maps, audio recordings or source-page images are bundled by this feature.
- Short English descriptions are orientations to their cited context, not full translations or unrestricted authority to reuse knowledge.

All source URLs and attribution labels are maintained in `src/culturalConnections.cjs`, alongside the public comparison content and review metadata. The native renderer is `src/CulturalConnectionsScreen.js`. A source link does not imply that the source owner endorses the app or has approved its interpretation.

## Privacy, accessibility and verification

This is a read-only learning section. It does not collect personal reflections, upload data, use an AI API, change assessment rules or write to journey storage. Topic and glossary selections are transient UI state. It uses the existing app typography, larger-reading preference, native accessibility labels and touch controls; it introduces no animation or dependency. Android Back and the visible Back to Learn control return to Learn.

The late build step `scripts/patch_living_connections.py` runs after the presentation patch. Tests cover source reference integrity, draft/use boundaries, Learn/More navigation, topic and word selection, link failure/retry, no automatic link opening and preservation of existing journey storage. The release smoke workflow checks the installed native screen on Android 16 without following external links.

The content remains a review draft. Legal and cultural clearance are separate from passing technical tests. Further work includes wider regional coverage, women's leadership and contemporary voices, local accounts of decision-making and disagreement, and a community-led correction and review process.
