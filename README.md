# Aether AI Billing

**Status:** Initial usage-event metadata validator is in review. No usage ledger, quota enforcement, pricing engine, payment integration, or production billing behavior is implemented.

Owns plan definitions, entitlements, usage metering, quota decisions, an idempotent usage ledger, billing abstractions, and auditable adjustments. Payment provider and pricing model remain undecided.

## Initial implementation

The draft package validates versioned synthetic usage-event metadata, identifiers, unit/kind consistency, bounded non-negative quantities, event timestamps, and source/pricing references. It does not authenticate producers, deduplicate events, write a ledger, calculate charges, enforce quotas, or make financial decisions. Pricing and accounting policy remain unresolved.

## Documents
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Research and licenses](docs/RESEARCH_AND_LICENSES.md)
- [Engineering standard](docs/ENGINEERING_STANDARD.md)
- [Work log](docs/WORKLOG.md)

## Non-negotiable boundaries
- Usage records and quota decisions must be tenant-scoped and auditable.
- Retries must not double-count usage or duplicate financial adjustments.
- Payment credentials are server-side only; never log secrets or payment data.
- Billing does not own identity, model execution, or another service's private tables.
