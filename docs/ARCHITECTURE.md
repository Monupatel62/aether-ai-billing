# Architecture — aether-ai-billing

**Status:** Proposed; not implemented.

## Responsibilities
Billing is the authority for plans, entitlements, usage records, quota state, pricing snapshots, and billing adjustments. Gateway and other producers emit usage facts but do not write billing's private storage.

## Proposed flow
1. A producer emits a versioned usage event with stable event and tenant identifiers.
2. The event is validated and accepted through an authenticated ingestion contract.
3. Billing deduplicates by producer/event identity and records an immutable usage fact.
4. Pricing is resolved using a recorded pricing version/snapshot, not mutable current settings alone.
5. Entitlement/quota projections are updated idempotently.
6. Reconciliation compares source events, ledger entries, and provider statements where relevant.

## Dependencies
- aether-ai-api: authorized product-facing plan and usage queries.
- aether-ai-gateway: usage facts with documented measurement semantics.
- aether-ai-database: approved persistence/migration tooling.
- aether-ai-queue: delivery and retry semantics, if selected.
- aether-ai-auth/security: principal and authorization contracts.

## Failure behavior
Retries must be safe. Unavailable billing must not silently imply unlimited quota. Whether a request is blocked, deferred, or allowed under a bounded grace policy is an explicit product/security decision. No payment provider or storage technology is selected here.
