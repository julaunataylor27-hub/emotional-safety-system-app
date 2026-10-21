# Ancient Australian Animals & Evidence — 21 October 2026

**Status:** Educational research draft. User-directed addition to the Emotional Safety System Android app. No cultural custodianship or museum endorsement implied.

## Purpose and location
The app's **Learn** and **More** menus and Learn's public-topic search provide an entry to `Ancient Australian Animals & Evidence`. A second layer includes the *Yamuti account*, and a third explains evidence vs reconstruction and the much earlier story of Pangaea/Gondwana.

The app uses original labelled silhouette illustrations, rather than downloading or copying museum photos or family-owned cultural artwork. Museum links are the evidence-image trail, so readers can inspect images and attribution on original sites. The app is not a fossil-identification device and does not infer anyone's culture, ancestry, feelings or safety status.

## Six animal entries
- **Thylacoleo carnifex** (marsupial lion): Australian Museum Pleistocene fossil-jaw account; hunting behaviour discussed as interpretation.
- **Diprotodon optatum:** Queensland Museum's palaeontological account of a large plant-eating marsupial.
- **Procoptodon goliah:** Australian Museum article; notes Nullarbor cave fossils from WA.
- **Genyornis newtoni:** Australian Museum article; flightless bird, fossil bones and eggshells.
- **Varanus priscus:** Queensland Museum reconstruction and specimen discussion of a giant monitor lizard.
- **Quinkana:** Queensland Museum source and separate megafauna specimen gallery with photographed tooth.

Full source URLs, sourced facts, interpreted elements and open questions are in `src/ancientAnimals.cjs`. Each animal has its own illustration path in `src/AncientAnimalsScreen.js`. No dates here are exact extinction dates, and shared fossil times do not prove every animal coexisted with people in all regions.

## Cultural safeguards
Jacinta Koolmatrie identifies as Adnyamathanha and Ngarrindjeri and published her own Yamuti account through Australian Museum in February 2026:
https://australian.museum/learn/first-nations/yamuti/

The app links to her publication, attributes the account, and records that the proposed Yamuti/Diprotodon relationship is **a possibility she discusses rather than an established species identification**. Her niece's drawing is **not reproduced**. Cultural review and permissions would be required for expanded adaptations. The app does not speak on behalf of all Adnyamathanha people or any other community.

## Geology and archaeological context
- Pangaea split about 200 million years ago, far before human settlement: https://australian.museum/learn/dinosaurs/mesozoic-era/
- Sahul and ancient shorelines (National Museum of Australia): https://digital-classroom.nma.gov.au/learning-modules/1/migration-sahul
- Fossil specimens, crocodile tooth and giant kangaroo bone photos (Queensland Museum): https://www.museum.qld.gov.au/collections-and-research/explore/megafauna

## Build and verification
`scripts/patch_ancient_animals.py` runs **after** Safe Curiosity in `.github/workflows/build-android-apk.yml`. It fails if a required insertion point is absent and is a no-op when the version marker is already present. It adds a Learn/More route and includes the module in public learning search while leaving assessment, journal, safety overrides and personal data untouched.

`tests/ancient-animals.test.cjs` checks unique species, referenced sources, attribution distinctions and the original illustration pathways. These tests are included in `npm test`. APK availability is subject to successful GitHub Actions compilation and device checks and is not assumed from a source commit alone.
