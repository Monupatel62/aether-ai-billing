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
7. Product-facing API routes consume Billing's public plan/usage/entitlement contract and enforce caller/resource authorization. Billing does not call API back to validate usage or entitlement decisions.

## Dependencies

- `aether-ai-gateway` and other approved producers: versioned usage facts and measurement semantics through an event/ingestion contract, not private imports.
- `aether-ai-database`: approved persistence/migration tooling.
- `aether-ai-queue`: delivery and retry semantics, if selected.
- `aether-ai-auth` and `aether-ai-security`: principal and authorization contracts.
- `aether-ai-observability`: sanitized audit and operational telemetry.

`aether-ai-api` is a consumer of Billing's public contract, not a Billing implementation dependency. Billing must not call API synchronously to validate usage or quota decisions, and no producer may write Billing's private tables.

## Failure behavior

Retries must be safe. Unavailable billing must not silently imply unlimited quota. Whether a request is blocked, deferred, or allowed under a bounded grace policy is an explicit product/security decision. No payment provider or storage technology is selected here.
