# Research and Licenses — aether-ai-billing

**Status:** Research register; no vendor or dependency selected.

## Research topics
- Versioned usage-event design and delivery/idempotency guarantees.
- Ledger integrity, reconciliation, and correction patterns.
- Decimal arithmetic and currency/rounding requirements.
- Queue/database options already under evaluation in the Aether platform.
- Payment provider requirements, supported countries/currencies, fees, disputes, refunds, and data responsibilities if payments enter scope.

## Evaluation rules
- Prefer platform-approved shared abstractions over duplicate persistence or queue layers.
- Check release maintenance, license, transitive dependencies, security advisories, data processing terms, and operational costs.
- Do not store cardholder data unless requirements, legal review, and compliance scope explicitly permit it.
- Preserve license notices and review source-level licenses before reuse.

## Open decisions
Pricing model, billable units, tax/refund policy, currency support, retention, payment provider, and quota outage policy require product/legal/security review. This document is not legal, tax, or compliance advice.
