# aether-ai-billing

**Status:** Initial usage-metering primitives implemented on a feature branch. No invoicing, subscription management, payment processor, or financial ledger is configured.

## Implemented

- [Usage meter](src/index.js): versioned usage-event validation, producer verification callback, bounded metric/units/timestamps, idempotent append contract, and integer microcurrency cost calculation.
- [Unit tests](test/billing.test.js): duplicate event delivery, untrusted producer rejection, malformed usage, ledger failure, and cost overflow.
- Dependency-free Node.js package with Node 20/22 CI.

## Financial integrity boundaries

The store must atomically enforce uniqueness on event ID. The verifier must authenticate the producer and authorize it to report usage for the tenant; client-supplied usage must never be trusted directly. Pricing is integer-based to avoid floating-point rounding, but currency, rounding, credits, taxes, invoicing, reconciliation, and audit requirements remain to be specified.

## Documentation

- [Repository specification](docs/REPOSITORY_SPECIFICATION.md)
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Master catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
