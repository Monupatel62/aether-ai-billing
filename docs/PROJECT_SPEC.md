# Project Specification — aether-ai-billing

**Status:** Proposed; documentation only.

## Mission
Provide authoritative plan/entitlement definitions, usage metering, quota accounting, billing abstractions, and audit trails for financial or quota-impacting changes.

## Scope
- Versioned usage events and idempotent ingestion.
- Usage ledger and pricing snapshot references.
- Quota/entitlement queries and enforcement contract.
- Auditable adjustments, reversals, and reconciliation.
- Provider-neutral payment integration boundary, selected later by ADR.

## Out of scope
- Executing model requests or owning gateway behavior.
- Identity provider and session lifecycle.
- Secret storage or payment-card data storage.
- Direct access to another component's private database tables.
- Selecting a payment vendor or production pricing without approval.

## Invariants
- Every record has a stable identifier, tenant scope, event time, schema version, and correlation context.
- Duplicate delivery must not create duplicate billable usage.
- Corrections are appended as auditable adjustments; original ledger history is not silently rewritten.
- Quota enforcement behavior during dependency outage must be explicit and fail safely for each operation class.
- Money and quantities use explicit units, currency, precision, and rounding rules.

## Release gates
Unit, contract, idempotency, reconciliation, tenant-isolation, malformed-input, outage, and non-production integration tests must pass before release.
