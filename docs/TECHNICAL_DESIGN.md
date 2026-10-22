# Technical Design — aether-ai-billing

**Status:** Candidate design; implementation and technology choices remain open.

## Logical modules
- Plan and entitlement catalog.
- Usage event validator and deduplication boundary.
- Append-oriented usage ledger.
- Pricing snapshot resolver.
- Quota state and decision API.
- Adjustment/reversal workflow.
- Reconciliation and audit reporting.

## Idempotency
A stable producer plus event ID forms the candidate deduplication key. The exact uniqueness scope and retention window must be decided. Duplicate delivery returns a stable accepted/duplicate result and does not create a second charge. Conflicting payloads for the same key must be rejected and surfaced for investigation.

## Pricing and arithmetic
Each billable event must retain enough versioned evidence to reproduce the charge. Define units, currency, precision, rounding, discounts, free tiers, and effective-time rules before coding. Do not derive historical charges from mutable current plan settings.

## Quotas
Separate authoritative quota decisions from eventually consistent reporting projections. Define whether each operation is fail-closed, deferred, or permitted under a bounded grace policy during outages. Stale projections must expose freshness.

## Reconciliation
Support replay-safe import, totals comparison, discrepancy classification, and auditable correction. Avoid destructive edits to the original ledger.
