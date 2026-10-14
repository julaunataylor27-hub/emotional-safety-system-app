# Yagan Life Journey — research prototype 0.1

Integrated into Emotional Safety System at Julauna Taylor's request, 14 October 2026. This native module carries the established Life Journey prototype into the existing app. It is an invitation to examine evidence with curiosity and humility, including relevant family and Noongar knowledge that may deepen or correct a reading.

## Evidence boundaries

- Source records, cultural context, possible meanings and unknowns remain separate.
- Settler accounts are identified as records with limits, not access to Yagan's private thoughts.
- A selected feeling is the reader's interpretation. Childhood and posthumous chapters have no feeling candidates.
- Questions for life lessons are our learning today, not assertions about lessons Yagan personally learned.
- The letters document examiners' aims and assumptions. Phrenology is pseudoscience; the published Pettigrew letter does not describe brain-tissue testing. Neither a person nor a people can be profiled from those claims.
- Additional knowledge remains unverified in this tool, including family oral history and cultural guidance. Public discussion of culturally restricted information requires care from relevant knowledge holders.
- The six historical questions (Truth, Choice, Boundaries, Coercion, Dependency and Safety) are not the live assessment's six risk signals. No inference, legal engine, emotional score, model training or AI request runs here.

## Sources reviewed on 14 October 2026

The exact links and short provenance notes ship in `src/lifeJourney.cjs` and appear in the native Sources panel and exports:

1. Collard, Harben and van den Berg (2004), *Nidja Beeliar Boodjar Noonookurt Nyininy*, Noongar-authored research, hosted by Derbal Nara. Cultural context, not a complete individual belief record.
2. R. H. W. Reece (2019), *Yagan*, Australian Dictionary of Biography. Later biographical interpretation; check exact chronology against primary records.
3. *Native Corrobory at Perth*, Perth Gazette, 16 March 1833, p. 42. Contemporary settler account, digitised on Wikisource.
4. Moore encounter reported in Perth Gazette, 1 June 1833, p. 87, reproduced by University of Sydney Australharmony. His admission that he could not understand the speech remains explicit.
5. Pettigrew to Dale, 11 September 1834, published in Dale's pamphlet, pp. 18–20, digitised on Wikisource. Racist phrenological claims are not findings about Yagan's mind.
6. Yale Beinecke, Pettigrew Papers OSB MSS 113: Dale, box 16 folder 732 (catalogue 16684184), and Irwin, box 17 folder 843 (16684185). The Sources panel points to the manuscript image locations.
7. Cressida Fforde, *Repatriation: The search for Yagan*. Participant research on related letters and the search for remains.
8. Science Museum, *A Rogues Gallery* (2010). Context identifying phrenology as pseudoscience.

No claim of consultation, endorsement or permission from descendants or Noongar knowledge holders is made. The chapter material is editable repository content so corrections can be reviewed with their evidence.

## Implementation

`LifeJourneyScreen.js` is native React Native, embedded in the app's vertical scrolling content. `lifeJourney.cjs` contains reviewed content, candidate filtering and text export. `lifeJourneyMemory.cjs` queues a separate versioned AsyncStorage record; `useLifeJourneyNotes.js` provides autosave, recovery and chapter clearing. `lifeJourneyPdf.cjs` builds escaped, self-contained HTML for the existing Expo Print/PDF service. There are no remote assets or network calls during reading, note-taking or PDF generation.

Storage key: `@emotional-safety-system/yagan-life-journey-v1`. Writes continue safely when the screen unmounts; reopening waits for pending writes. Loading errors do not replace saved data with defaults. Android open/save/share use the existing service and only act after explicit user input. Local data is not encrypted by this module. Clearing app data/uninstall may erase it.

The release workflow applies `patch_life_journey.py` after the golden Home patch, then runs all tests and the existing App validator. The native release smoke test checks Home entry, early-life uncertainty and restoration of a generic note. Older APK diagnosis omits the opt-in `--life-journey` flag.
