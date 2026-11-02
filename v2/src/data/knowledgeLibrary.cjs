'use strict';
// New ESS v2 public knowledge integration. All reading is offline by default.
// Each source link is intentionally external and opens only after a user tap.
// No private genealogy, confidential research, personal notes or unpublished cultural
// knowledge are included. Reviewed public sources ≠ legal/cultural endorsement.
const CURATED_MODULES=Object.freeze([
  {
    "id": "evidence-truth-lab",
    "title": "Evidence & Truth Lab",
    "subtitle": "Separate records, meaning and uncertainty",
    "helps": "Explore how an account, a source, a possible meaning and a verified finding differ before drawing conclusions.",
    "ideas": [
      "Start with what was directly observed or said; mark it as reported until independently checked.",
      "Ask where each claim came from, when the source was created, and whether context is missing.",
      "A feeling deserves respect but cannot prove another person's motives.",
      "Collect evidence only when safe; getting help is more important than proving a situation."
    ],
    "unknown": "ESS cannot inspect other people's thoughts or independently establish an event. Any missing source remains an open question.",
    "sourceStatus": "Educational reading, not forensic proof or a factual verdict. Safety guidance is from eSafety; ESS's sorting questions are original prototype material.",
    "related": "History & Truth",
    "scope": "National / educational",
    "reviewStatus": "Public source reviewed; technical and safeguarding assessment ongoing",
    "sources": [
      {
        "title": "eSafety Commissioner — Collecting evidence safely",
        "url": "https://www.esafety.gov.au/key-topics/domestic-family-violence/collecting-evidence-safely",
        "author": "Australian eSafety Commissioner",
        "checked": "2 November 2026",
        "role": "Guidance on safety and evidence, not validation of personal accounts",
        "sourceType": "Official or attributed public source"
      },
      {
        "title": "eSafety — How to collect evidence",
        "url": "https://www.esafety.gov.au/report/how-to-collect-evidence",
        "author": "Australian eSafety Commissioner",
        "checked": "2 November 2026",
        "role": "Official guidance for documenting online material safely",
        "sourceType": "Official or attributed public source"
      }
    ]
  },
  {
    "id": "law-rights-kinship",
    "title": "Law, Rights & Kinship",
    "subtitle": "Australian law and diverse cultural systems",
    "helps": "Understand how Australian laws, your rights, public services and distinct community knowledge may intersect.",
    "ideas": [
      "Different laws apply in Commonwealth and state or territory jurisdictions; check the relevant place and date.",
      "A proposed bill, a petition and a law currently in force are not the same.",
      "A personal boundary or signed agreement does not automatically determine legal consent.",
      "Aboriginal Nations have distinct knowledge and kinship systems; they must not be flattened into one rulebook."
    ],
    "unknown": "Specific circumstances require professional advice. ESS cannot decide whether an act is lawful or assign someone's kinship, rights, ancestry or culturally restricted knowledge.",
    "sourceStatus": "Official parliamentary overview checked 2 Nov 2026. Other detailed law and cultural material remains under professional and relevant community review.",
    "related": "Culture & Country",
    "scope": "Australia-wide overview; not personal legal advice",
    "reviewStatus": "Legal and cultural review pending before public release",
    "sources": [
      {
        "title": "Parliamentary Education Office — Sources of law",
        "url": "https://peo.gov.au/understand-our-parliament/how-parliament-works/bills-and-laws/sources-of-law",
        "author": "Parliamentary Education Office",
        "checked": "2 November 2026",
        "role": "Statute, delegated and common law overview",
        "sourceType": "Official or attributed public source"
      },
      {
        "title": "Parliamentary Education Office — Law-making",
        "url": "https://peo.gov.au/understand-our-parliament/how-parliament-works/bills-and-laws/law-making",
        "author": "Parliamentary Education Office",
        "checked": "2 November 2026",
        "role": "Bills, parliamentary passage and royal assent",
        "sourceType": "Official or attributed public source"
      }
    ]
  },
  {
    "id": "ancient-animals",
    "title": "Ancient Animals & Evidence",
    "subtitle": "Megafauna, fossils, Country and deep time",
    "helps": "Explore Australia's extinct animals and ask what fossils prove, what scientists reconstruct, and how cultural knowledge is respectfully attributed.",
    "ideas": [
      "Thylacoleo carnifex is known from fossils; details of its hunting behaviour are reconstructed from anatomy and remain open to interpretation.",
      "Diprotodon was a very large plant-eating marsupial; museum models are reconstructions, not eyewitness pictures.",
      "The Yamuti account belongs to its named Adnyamathanha storyteller and must not be flattened into an established scientific species identification.",
      "Pangaea's breakup occurred much earlier than the human presence documented in Sahul."
    ],
    "unknown": "Shared time periods do not prove particular human-animal encounters. Species identification from oral traditions requires contextual evidence and appropriate community authority.",
    "sourceStatus": "Fossil science and attributed cultural writing are separate source types. No cultural artwork is copied.",
    "related": "History & Truth",
    "scope": "Public educational sources; cultural permissions and interpretation remain distinct",
    "reviewStatus": "Museum and attributed source links reviewed; deeper cultural review pending",
    "sources": [
      {
        "title": "Australian Museum — Thylacoleo carnifex",
        "url": "https://australian.museum/learn/animals/mammals/thylacoleo-carnifex/",
        "author": "Australian Museum",
        "checked": "2 November 2026",
        "role": "Paleontology and interpretive limits",
        "sourceType": "Official or attributed public source"
      },
      {
        "title": "Jacinta Koolmatrie — Yamuti and Diprotodon",
        "url": "https://australian.museum/learn/first-nations/yamuti/",
        "author": "Jacinta Koolmatrie / Australian Museum",
        "checked": "2 November 2026",
        "role": "Author-attributed cultural perspective; not proven fossil identification",
        "sourceType": "Official or attributed public source"
      },
      {
        "title": "Queensland Museum — Megafauna collections",
        "url": "https://www.museum.qld.gov.au/collections-and-research/explore/megafauna",
        "author": "Queensland Museum",
        "checked": "21 October 2026 (project register)",
        "role": "Specimens and reconstructions",
        "sourceType": "Official or attributed public source"
      }
    ]
  },
  {
    "id": "life-journey-historical",
    "title": "Historical Life Journeys",
    "subtitle": "Research people through sources and gaps",
    "helps": "Study a historical person's life without pretending to know their private thoughts or assigning unverified feelings.",
    "ideas": [
      "Separate contemporary written records from later biographical interpretations and cultural context.",
      "Settler accounts reflect the language and limits of their authors; they are not the whole history.",
      "Questions for life lessons are about what we can learn now, not a claim about what a historical person felt.",
      "Phrenology was a pseudoscientific practice; colonial claims using it are not evidence of identity or worth."
    ],
    "unknown": "Personal ancestry, historical family links and community-held cultural knowledge need separate research and appropriate consent. ESS does not infer any user's connection.",
    "sourceStatus": "Links to public contextual sources only. The broader Yagan research archive remains outside this app copy.",
    "related": "Culture & Country",
    "scope": "Research method, public historical context only",
    "reviewStatus": "Cultural, source-use and community review pending before expanded biography",
    "sources": [
      {
        "title": "Australian Dictionary of Biography — Yagan",
        "url": "https://adb.anu.edu.au/biography/yagan-2826",
        "author": "Australian National University / R. H. W. Reece",
        "checked": "14 October 2026 (project register)",
        "role": "Biographical interpretation, not direct access to personal thoughts",
        "sourceType": "Official or attributed public source"
      },
      {
        "title": "Science Museum — A Rogues Gallery",
        "url": "https://blog.sciencemuseum.org.uk/a-rogues-gallery/",
        "author": "Science Museum",
        "checked": "14 October 2026 (project register)",
        "role": "Historical context on pseudoscience",
        "sourceType": "Official or attributed public source"
      }
    ]
  },
  {
    "id": "connection-trail",
    "title": "Connection Trail",
    "subtitle": "Follow questions without forcing conclusions",
    "helps": "Move from curiosity to context, evidence and choices through a guided trail where every stage can be skipped or revisited.",
    "ideas": [
      "Find the spark — notice the question that caught your attention.",
      "Follow the clues — separate reports, possible meanings and evidence.",
      "Trace the sources — look at what sources can and cannot establish.",
      "Discover other paths — compare different explanations and information.",
      "Find your meaning — reflect on what matters to you, without a score.",
      "Choose a connection — keep exploring, pause, seek support or stop."
    ],
    "unknown": "No clue proves another person's intent, ancestry or identity. The sequence is an educational invitation, not a surveillance or investigation tool.",
    "sourceStatus": "Original ESS educational framework created in the project; no external scientific validation or endorsement claimed.",
    "related": "Evidence & Truth Lab",
    "scope": "Original prototype learning method",
    "reviewStatus": "User-designed framework; usability and safeguarding tests still needed",
    "sources": []
  },
  {
    "id": "world-wide-web",
    "title": "World Wide Web Trail",
    "subtitle": "Ideas, records, decisions and connections",
    "helps": "Explore the difference between the web's documented history and the personal motivations we can only interpret cautiously.",
    "ideas": [
      "The first World Wide Web proposal was made by Tim Berners-Lee at CERN in 1989.",
      "An archived proposal is evidence of a documented idea, not a complete record of private thoughts.",
      "A server, browser, website and internet are different concepts that developed through connected work.",
      "For every milestone, ask what document exists, what happened and what remains uncertain."
    ],
    "unknown": "Historical images and reconstructions may have been produced long after a milestone. Source dates and image provenance must stay visible.",
    "sourceStatus": "Public education based on the project's Tim Berners-Lee research notes. Picture licenses and chronological detail need checking before adding full photo modules.",
    "related": "Evidence & Truth Lab",
    "scope": "Public history; original ESS reflection prompts",
    "reviewStatus": "Expanded image-based history pending attribution and reuse checks",
    "sources": [
      {
        "title": "CERN — Birth of the Web",
        "url": "https://home.cern/science/computing/the-birth-of-the-web",
        "author": "CERN",
        "checked": "22 October 2026 (project register)",
        "role": "Historical account and milestones",
        "sourceType": "Official or attributed public source"
      }
    ]
  },
  {
    "id": "safe-curiosity",
    "title": "Safe Curiosity Principles",
    "subtitle": "Questions, learning and appropriate support",
    "helps": "Explore why curiosity should be met with clear knowledge, respectful boundaries and honest uncertainty.",
    "ideas": [
      "Questions are not themselves evidence of danger.",
      "Age and context matter when presenting sensitive education to young people.",
      "Unknown questions should stay unknown rather than producing a false reassurance.",
      "A learning tool is not an internet filter, clinical assessment or child-protection service."
    ],
    "unknown": "ESS's curiosity prototype has not been independently evaluated or approved for unsupervised use by children.",
    "sourceStatus": "Educational overview for adults and researchers; no child profiling, user monitoring, accounts or automated content filtering.",
    "related": "Everyday Tools",
    "scope": "General educational principles; specialist review required",
    "reviewStatus": "Child-safeguarding and privacy review pending",
    "sources": [
      {
        "title": "eSafety Commissioner — Online safety",
        "url": "https://www.esafety.gov.au/",
        "author": "Australian eSafety Commissioner",
        "checked": "19 October 2026 (project register)",
        "role": "Public online safety and education resources",
        "sourceType": "Official or attributed public source"
      }
    ]
  }
]);
module.exports={CURATED_MODULES};
