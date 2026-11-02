# ESS v2 Migration Boundary

## Core rule

**Migrate capability and evidence. Redesign every interface.**

ESS v1 remains the working reference/evidence build. ESS v2 is a clean product rebuild.

## Migrate as proven capability

### Core reasoning
- ESS Core structured separation
- Evidence & Truth deterministic engine
- emotion / reported information / interpretation / uncertainty separation
- choice preservation
- safety routing
- versioned decision records
- rule IDs
- aggregate research snapshots

### Product capabilities to migrate later
- journal and reflection memory
- PDF/export functions after v2 UX is defined
- Learning Centre content and source metadata
- cultural/history learning content
- support directory data
- law / rights / kinship educational content
- language and accessibility preferences
- Life Journey content
- Connection Trail concepts
- presentation / research transparency content

### Testing knowledge to migrate
- safety regression cases
- evidence-vs-interpretation cases
- uncertainty tests
- user-control tests
- privacy/no-automatic-upload tests
- accessibility behaviours
- support-routing checks

## Do not migrate

- v1 Home layout
- v1 bottom navigation
- v1 card hierarchy
- v1 giant hero cards
- v1 colour overrides
- v1 PresentationTheme layout assumptions
- legacy App.js UI shell
- any Python UI patch script
- build-time UI rewrites
- duplicated navigation injections
- presentation-only layout hacks

## v2 architecture

```text
v2/
  App.js
  src/
    core/
      essCore.cjs
      evidenceTruthEngine.cjs
      essArchitecture.cjs
    theme.js
    screens/        # new screens only
    components/     # new components only
    data/           # migrated verified content later
  tests/
  android/          # generated only during build
```

## v2 product direction

Persistent navigation:
- Home
- Journal
- Learn
- Support
- More

Primary product entry:
- ESS Core

Design principle:
> Human on the surface. Rigorous underneath.

## Migration gate

A v1 capability moves into v2 only when:
1. the underlying behaviour is understood,
2. useful tests exist or are added,
3. personal data behaviour is explicit,
4. the v2 interface is designed fresh,
5. no v1 visual component or patch script is required.
