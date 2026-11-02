'use strict';
// ESS v2 Connection Trail: optional public navigation, no surveillance, scoring,
// hidden access, personal data persistence or inference of another person's intent.
const CONNECTION_STEPS=Object.freeze([
  {
    "id": "spark",
    "title": "Find the spark",
    "prompt": "What question has caught your attention?",
    "helps": "Put your question into your own words if you wish. Nothing is automatically saved.",
    "destination": "core",
    "label": "Start a private reflection",
    "hint": "The reflection opens blank; you decide what to write"
  },
  {
    "id": "clues",
    "title": "Follow the clues",
    "prompt": "What was reported, what was inferred, and what can be independently checked?",
    "helps": "Look for evidence and truth without confusing feelings with proof.",
    "destination": "learn",
    "target": "Evidence & Truth Lab",
    "label": "Explore Evidence & Truth",
    "hint": "Read about sources and limits"
  },
  {
    "id": "sources",
    "title": "Trace the sources",
    "prompt": "Where does this information come from, and whose perspective is represented?",
    "helps": "Research context, publication dates and what remains unknown.",
    "destination": "learn",
    "target": "History & Truth",
    "label": "Examine source questions",
    "hint": "Explore what records can and cannot tell us"
  },
  {
    "id": "other-paths",
    "title": "Discover other paths",
    "prompt": "What different explanations or learning pathways might help?",
    "helps": "You can explore without agreeing with a single interpretation.",
    "destination": "learn",
    "target": "Law, Rights & Kinship",
    "label": "Explore another knowledge path",
    "hint": "Explore boundaries between public knowledge and legal claims"
  },
  {
    "id": "meaning",
    "title": "Find your meaning",
    "prompt": "What feels important to you, without assigning someone else a feeling?",
    "helps": "Use a Journal entry to reflect in your own words; no score or automatic conclusion.",
    "destination": "journal",
    "label": "Open my Journal",
    "hint": "Create a session-only note only if you choose"
  },
  {
    "id": "choice",
    "title": "Choose a connection",
    "prompt": "What feels like a helpful next step, if any?",
    "helps": "You can talk to someone, look for services, return to learning or stop here.",
    "destination": "support",
    "label": "See support options",
    "hint": "Support choices never contact anyone automatically"
  }
]);
function connectionStep(index){return CONNECTION_STEPS[index]||null;}
module.exports={CONNECTION_STEPS,connectionStep};
