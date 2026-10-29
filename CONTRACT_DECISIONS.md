# Decisions and unresolved contract gaps

These records began as UI-pack decisions. I01-A inspected the separate Engine checkout at `96776c8ef8f444c6a3872e2f592c56363c66f004`; local OpenAPI is evidence of implemented route contracts, not a verified browser BFF or staging integration.

| ID | Issue | Current execution rule | Resolution/evidence needed |
|---|---|---|---|
| CD-01 | Source v1.0 is proposed, not engine-verified | Preserve semantics; label proposed operations; use adapters | Actual OpenAPI, engine branch, response examples and staging tests |
| CD-02 | Source section 3.2 proposes teal and temporary visual tokens | Existing audited blue/Slate glass identity and latest user direction apply; English/LTR default, Persian/RTL required | Phase 01 screenshots and user review; preserve usable existing tokens |
| CD-03 | Calendar video requires timed blocks; contract defines start/due DateValue | Separate date projections and ScheduleBlock extension; Demo adapter permitted, no invented Live endpoint | Scheduling schema, read/write operations, timezone/overlap policy and owner; contracts/PHASE05_SCHEDULING_DECISION.md records Demo and Live gap |
| CD-04 | Earlier prototype phases stopped all subsequent work | Latest user authorizes whole UI phased completion; execute one requested phase at a time | Record explicit user continuation/revision accurately |
| CD-05 | Spec v2.5 and adversarial plan v1.4 were absent from the UI pack but **found** in the sibling Engine checkout | Use the inspected local source files for I01-A mapping and test oracles; do not claim full UI/Live coverage from presence alone | Broader UIAPI traceability against the full Spec and 161-case adversarial plan remains separate from I01-A; pinned hashes and I01 scope are in `evidence/I01A_CONTRACT_REPORT.md` |
| CD-06 | Existing prototypes/code not attached to this chat | Phase 00 audits actual repo; no feature assumed accepted | Source paths, commands and observed behavior |
| CD-07 | Voice auto-fill versus approval | Unambiguous values may fill visible local draft; engine writes use contract approval, legal consent never inferred | Provider capability, transcript/provenance schema and approval policy |
| CD-08 | Extended APIs not specified in source: timed scheduling, some organization controls, dashboard widgets, Galaxy/Obsidian, external sends and advanced PM metrics | Record proposals and owner; show capability unavailable if no service; do not fake execution | Explicit interface agreement and tests before Live enablement |

All engine mismatch decisions need an ADR with: context, existing contract,
proposed mapping/extension, compatibility, permissions, owner, evidence and status.
Do not revise the reference copy to hide a conflict. Session/auth changes such as
SPA bearer instead of BFF require an explicit architecture decision.

## Latest user amendments (binding for this pack)
- Every phase requires explicit UI and UX approval before the next phase.
- AI should ask necessary clarification using the provided numbered-options card.
  Source section 11.2 supplies the wire basis; richer presentation and answer request
  details must be mapped to actual schemas and must not bypass approval policies.
