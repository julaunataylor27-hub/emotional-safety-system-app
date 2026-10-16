# Cultural comparison and guided curiosity

Version 1.7.3 (Android code 21) refines **Compare & stay curious** to Learn, public learning search and More. Living connections also opens it. Existing cultural learning and Yagan Life Journey remain available.

## Reader experience

- Start with six large question cards, then follow one question at a time.
- Compare two named accounts: Whadjuk Noongar, Wajarri Yamatji or Badimia.
- Choose Country and responsibilities, family and belonging, teaching and guidance, or different views and repair.
- Account cards start with an editorial preview of their first attributed statement. Read full account reveals every original statement. Evidence gaps, group scope, source type, attribution and dates stay visible. Gold Read the source buttons open the original websites; Source details expands the locator and full source scope.
- Topic and full-name account selectors open one set of choices at a time and close after selection. Selecting the other account swaps the pair, keeping them distinct. Body text is 18 with 29 line height, and supporting text is at least 15; the existing larger-reading preference still applies.
- Six guided questions connect to relevant topics and pairs. Readers can change direction, keep questions open and return to the question list. There is no completion score or required answer.
- Two columns are used at wider window sizes with standard reading text. Phone layouts and larger reading text stack the accounts. All controls wrap, have accessible labels and use the existing typography and colours.
- Android Back closes an open selector, returns from comparison to the selected question or question list, then returns from the list to Learn. Source websites open only on a tap; failed links retain selectable URLs and can be retried.

The module is read-only and offline except for deliberate external source navigation. It does not write personal journey storage, infer ancestry, alter assessments or call an AI service. The sources-checked date is 16 October 2026, not an approval date. It remains an educational research draft: cultural review, reuse permissions and legal review are pending. No community endorsement or clinical effectiveness is claimed.

## Source provenance and limits

`src/culturalInquiry.cjs` keeps the attributed statements separate from our questions, comparisons and unanswered points.

| Source | Material used | Limit kept visible |
| --- | --- | --- |
| Collard, Harben and van den Berg, Noongar interpretive history (2004), printed pp. 14–15 and 42–43 | Attributed trilogy; intergenerational teaching; kinship and Country; provisional interpretations | Not a three-part system devised by Yagan; includes other Noongar voices alongside Whadjuk-focused material |
| Derbal Nara, Moieties and Totems, undated public page | Traditional Whadjuk social divisions and responsibilities | Not a substitute for all Noongar kinship accounts and cannot classify a reader |
| Hamlett [2018] FCA 545, paragraphs 25–30 and 42–44 | Wajarri connection evidence about family areas, waterholes and continuity through change | Hosted judgment copy; incomplete reconstruction of law at sovereignty; landholding is not an equivalent marriage or moiety chart |
| Badimia Language Learning, Country, People and Culture, undated public page | Barna, language and family responsibilities; care of resources | Does not supply detailed descent, marriage or personal dispute procedures |
| Badimia Language Learning, Acknowledgements, undated public page | Named women’s, men’s and family contributions to language work | Attribution does not settle reuse permission for recordings or knowledge |
| Wajarri Yamaji Aboriginal Corporation rulebook registered 20 February 2023, rules 9 and 19 and definition of Consensus | Elders’ guidance and corporation-related disagreement procedures | A dated contemporary governance example, not a general family dispute process or proof of 1830s practice |

Original URLs are stored with the source records in the module. No cultural artwork, maps, audio, source-page images or extended quotations are reproduced. A source link is not an endorsement. Missing evidence stays a research gap; it is not treated as proof of absence.

## Integration and checks

The release pipeline applies `scripts/patch_cultural_inquiry.py` after Living connections. Its marker makes repeat application a no-op, and missing anchors stop the patch rather than silently omit routes. The checked-in base `App.js` remains in the form expected by the existing rebuild scripts.

Content checks cover source integrity, question destinations and key attribution/scope boundaries. Interface tests cover the question-first entry, full-account and source-detail expansion, public search, pair switching, open evidence gaps, source failure/retry, existing learning routes, Android Back and preservation of personal journey answers. The Android release workflow opts into installed-app checks for comparison and curiosity with `--cultural-inquiry` and saves screenshots.

Further review should involve relevant knowledge holders in scope, wording, permitted public use, correction processes and appropriate attribution. A named reviewer and approval state must only be added when that review actually occurs.
