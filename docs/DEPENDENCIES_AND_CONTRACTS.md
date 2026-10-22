# Dependencies and Contracts — aether-ai-billing

**Status:** Proposed contracts; not approved or implemented.

## Usage event minimum fields
- Schema version and stable event ID.
- Producer and event type.
- Tenant and actor references, subject to privacy policy.
- Occurrence time and ingestion time.
- Measured quantity, unit, and measurement semantics.
- Model/tool/resource reference and correlation ID where applicable.
- Idempotency identity and optional pricing-version reference.

The exact schema is not yet finalized; fields must be reviewed against the shared event envelope.

## Contract requirements
- Explicit delivery guarantee and deduplication retention.
- Stable error categories and retryability.
- Bounded payload size and event validation.
- Tenant authorization and producer authentication.
- Defined ordering, late-event, correction, replay, and retention behavior.
- Versioned quota decision response with reason and freshness metadata.

## Dependency direction
Producers publish facts through a public contract. They must not import billing internals or write billing tables. Billing may consume queue/database abstractions but must not depend on gateway implementation details.

## Financial integrity
Use integer minor units or a precisely specified decimal representation; define currency, rounding, tax treatment, and adjustment semantics before implementation. Never silently overwrite historical usage or pricing evidence.
