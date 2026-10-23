const ID = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const METRICS = new Set(["input_tokens", "output_tokens", "tool_calls", "compute_ms", "storage_bytes"]);
export class BillingError extends Error {
  constructor(code, message = "Usage metering failed") { super(message); this.name = "BillingError"; this.code = code; }
}
function isRecord(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function validId(value) { return typeof value === "string" && ID.test(value) && value.trim() === value; }

/**
 * Store contract: appendOnce(event) must atomically enforce unique event.id and
 * return { inserted:boolean, record }. Verification callback must authenticate
 * the producer and validate its authority to emit usage for the tenant.
 */
export function createUsageMeter({ store, verifyEvent, clock = () => Date.now(), maxUnits = 1_000_000_000 }) {
  if (!store || typeof store.appendOnce !== "function") throw new TypeError("Idempotent usage store is required");
  if (typeof verifyEvent !== "function" || typeof clock !== "function") throw new TypeError("Event verifier and clock are required");
  if (!Number.isSafeInteger(maxUnits) || maxUnits < 1) throw new TypeError("maxUnits must be positive");
  return Object.freeze({
    async record(event) {
      const now = clock();
      if (!Number.isSafeInteger(now) || now < 0) throw new BillingError("clock_unavailable");
      if (!isRecord(event) || event.schemaVersion !== 1 || !validId(event.id) || !validId(event.tenantId) || !validId(event.producerId)
        || !validId(event.metric) || !METRICS.has(event.metric) || !Number.isSafeInteger(event.units) || event.units < 0 || event.units > maxUnits
        || !Number.isSafeInteger(event.occurredAt) || event.occurredAt < 0 || event.occurredAt > now + 300_000) {
        throw new BillingError("invalid_usage_event");
      }
      let verified = false;
      try { verified = (await verifyEvent(event)) === true; } catch { verified = false; }
      if (!verified) throw new BillingError("untrusted_usage_event", "Usage event producer could not be verified");
      const record = Object.freeze({
        id: event.id, tenantId: event.tenantId, producerId: event.producerId,
        metric: event.metric, units: event.units, occurredAt: event.occurredAt,
        receivedAt: now, schemaVersion: 1,
      });
      let result;
      try { result = await store.appendOnce(record); } catch { throw new BillingError("ledger_unavailable"); }
      if (!isRecord(result) || typeof result.inserted !== "boolean" || !isRecord(result.record)) throw new BillingError("invalid_store_response");
      const stored = result.record;
      const sameEvent = stored.id === record.id && stored.tenantId === record.tenantId && stored.producerId === record.producerId
        && stored.metric === record.metric && stored.units === record.units && stored.occurredAt === record.occurredAt
        && stored.schemaVersion === record.schemaVersion;
      if (!sameEvent) throw new BillingError("idempotency_conflict", "Usage event ID was already used for a different event");
      return Object.freeze({ accepted: true, duplicate: !result.inserted, eventId: event.id });
    },
  });
}

/** Deterministic integer pricing: unit price is expressed in microcurrency units. */
export function calculateUsageCost(units, pricePerUnitMicros) {
  if (!Number.isSafeInteger(units) || units < 0 || !Number.isSafeInteger(pricePerUnitMicros) || pricePerUnitMicros < 0) throw new BillingError("invalid_pricing_input");
  const cost = BigInt(units) * BigInt(pricePerUnitMicros);
  if (cost > BigInt(Number.MAX_SAFE_INTEGER)) throw new BillingError("cost_overflow");
  return Number(cost);
}
