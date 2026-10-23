import test from "node:test";
import assert from "node:assert/strict";
import { BillingError, calculateUsageCost, createUsageMeter } from "../src/index.js";

const event = { schemaVersion: 1, id: "evt-1", tenantId: "tenant-a", producerId: "api", metric: "input_tokens", units: 123, occurredAt: 1000 };
function fixture(overrides = {}) {
  const ledger = new Map();
  const meter = createUsageMeter({
    store: { async appendOnce(record) { if (ledger.has(record.id)) return { inserted: false, record: ledger.get(record.id) }; ledger.set(record.id, record); return { inserted: true, record }; } },
    verifyEvent: async () => true, clock: () => 2000, ...overrides,
  });
  return { meter, ledger };
}

test("records verified usage event and makes duplicate delivery idempotent", async () => {
  const { meter, ledger } = fixture();
  assert.deepEqual(await meter.record(event), { accepted: true, duplicate: false, eventId: "evt-1" });
  assert.deepEqual(await meter.record(event), { accepted: true, duplicate: true, eventId: "evt-1" });
  assert.equal(ledger.size, 1);
});

test("rejects untrusted producer and malformed event fields", async () => {
  const denied = fixture({ verifyEvent: async () => false }).meter;
  await assert.rejects(denied.record(event), (e) => e.code === "untrusted_usage_event");
  const { meter } = fixture();
  await assert.rejects(meter.record({ ...event, units: -1 }), BillingError);
  await assert.rejects(meter.record({ ...event, metric: "credit_card_number" }), BillingError);
  await assert.rejects(meter.record({ ...event, occurredAt: 9_000_000 }), BillingError);
});

test("normalizes ledger errors", async () => {
  const meter = fixture({ store: { appendOnce: async () => { throw new Error("private db detail"); } } }).meter;
  await assert.rejects(meter.record(event), (e) => e.code === "ledger_unavailable" && !e.message.includes("private"));
});

test("calculates exact integer costs and rejects overflow", () => {
  assert.equal(calculateUsageCost(123, 17), 2091);
  assert.throws(() => calculateUsageCost(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), (e) => e.code === "cost_overflow");
  assert.throws(() => calculateUsageCost(-1, 1), BillingError);
});


test("rejects an idempotency key reused for different usage", async () => {
  const meter = fixture({ store: { appendOnce: async (record) => ({ inserted: false, record: { ...record, units: record.units + 1 } }) } }).meter;
  await assert.rejects(meter.record(event), (e) => e.code === "idempotency_conflict");
});
