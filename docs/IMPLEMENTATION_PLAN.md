# Implementation Plan — aether-ai-billing

**Status:** Planning only. Do not start coding without explicit approval.

## Phase 0 — product and policy decisions
- Define billable units and source-of-truth usage producers.
- Decide free tiers, plan/entitlement semantics, quota grace behavior, and pricing change policy.
- Define money representation, rounding, currency, tax, refunds, retention, and audit rules.
- Decide whether payments are in first-launch scope; compare providers only after requirements are approved.

## Phase 1 — contract fixtures
- Finalize versioned usage-event and quota-decision schemas.
- Add synthetic positive/negative fixtures for duplicate, late, malformed, and conflicting events.
- Review tenant authorization and data-retention requirements.

## Phase 2 — ledger vertical slice
- Implement event validation and idempotent ledger only after approval.
- Add deterministic pricing snapshot handling and audit trail.
- Verify duplicate/replay behavior under concurrent delivery.

## Phase 3 — quota and reconciliation
- Add quota query/enforcement contract and outage behavior.
- Add reconciliation report and auditable correction workflow.
- Test revocation, tenant isolation, queue failure, and recovery.

## Phase 4 — release gate
Unit, contract, property/idempotency, reconciliation, security, operational recovery, and non-production integration tests; runbook and rollback plan required.
