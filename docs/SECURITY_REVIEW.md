# Security Review — aether-ai-billing

**Status:** Threat checklist only; no implementation or security tests are claimed.

## Threats
- Cross-tenant usage or quota disclosure.
- Forged usage events or unauthorized producers.
- Duplicate/replayed events causing double billing.
- Tampering with pricing snapshots or ledger history.
- Abuse of quota adjustment and refund operations.
- Payment credential leakage or excessive access to financial records.
- Stale quota state allowing unintended overuse.
- Sensitive identifiers or financial details leaking into telemetry.

## Required controls
- Authenticate producers and authorize tenant scope at ingestion.
- Idempotent deduplication and conflict detection.
- Append-only audit evidence for adjustments and reversals.
- Least-privilege access to usage, pricing, and billing operations.
- Server-side validation, bounded payloads, and rate limits.
- Secret redaction; no payment credentials in logs or browser payloads.
- Explicit stale-state and dependency-outage behavior.
- Retention, export, deletion, and audit access policy.

## Required tests
Cross-tenant denial, forged producer, duplicate/replay/concurrency, conflicting duplicate, pricing-version drift, malformed quantity/unit, outage/grace behavior, unauthorized adjustment, secret leakage, and reconciliation recovery. All remain unverified.
