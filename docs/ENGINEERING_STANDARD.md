# Engineering Standard — aether-ai-billing

**Status:** Proposed standards for future implementation.

- Use strict types and versioned schemas for all usage and quota contracts.
- Make ingestion and adjustment operations idempotent.
- Use explicit units, currencies, precision, and rounding rules.
- Preserve historical evidence; corrections are auditable and reversible.
- Validate at trust boundaries and reject unknown or inconsistent event shapes.
- Keep secrets and sensitive financial details out of logs and fixtures.
- Test duplicates, retries, concurrent delivery, late events, outages, and reconciliation drift.
- Use synthetic tenant data in automated tests.
- Document error, retry, retention, and migration semantics.
- Do not select vendors or begin application coding before explicit approval.
