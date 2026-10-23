import { describe, expect, it } from "vitest";
import { validateUsageEvent } from "../src/index.js";
import type { UsageEventV1 } from "../src/index.js";

const event: UsageEventV1 = {
  schemaVersion: "1",
  eventId: "evt-1",
  producerId: "gateway",
  tenantId: "tenant-1",
  principalId: "user-1",
  kind: "model_input_tokens",
  quantity: 128,
  unit: "token",
  occurredAt: "2026-10-23T12:00:00.000Z",
  receivedAt: "2026-10-23T12:00:01.000Z",
  idempotencyKey: "gateway:req-1:input",
  sourceRef: "run:run-123"
};

describe("usage event metadata validation", () => {
  it("accepts a well-formed synthetic usage event", () => {
    expect(validateUsageEvent(event, { now: "2026-10-23T12:01:00.000Z" })).toEqual([]);
  });

  it("rejects unit mismatches and negative or unsafe quantities", () => {
    const codes = validateUsageEvent({ ...event, unit: "byte", quantity: -1 }, { now: "2026-10-23T12:01:00.000Z" }).map(x => x.code);
    expect(codes).toContain("unit_kind_mismatch");
    expect(codes).toContain("invalid_quantity");
  });

  it("rejects event timestamps too far in the future", () => {
    expect(validateUsageEvent({ ...event, occurredAt: "2026-10-23T12:10:00.000Z" }, {
      now: "2026-10-23T12:01:00.000Z", maxFutureSkewMs: 1000
    }).map(x => x.code)).toContain("event_from_future");
  });

  it("rejects malformed IDs and source references", () => {
    const codes = validateUsageEvent({ ...event, tenantId: "../tenant", sourceRef: "//external" }, {
      now: "2026-10-23T12:01:00.000Z"
    }).map(x => x.code);
    expect(codes).toContain("invalid_identifier");
    expect(codes).toContain("invalid_source_ref");
  });
});
