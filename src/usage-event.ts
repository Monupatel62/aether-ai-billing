export type UsageEventKind = "model_input_tokens" | "model_output_tokens" | "tool_invocation" | "file_processed" | "embedding_tokens";

export interface UsageEventV1 {
  readonly schemaVersion: "1";
  readonly eventId: string;
  readonly producerId: string;
  readonly tenantId: string;
  readonly principalId: string;
  readonly kind: UsageEventKind;
  readonly quantity: number;
  readonly unit: "token" | "invocation" | "byte";
  readonly occurredAt: string;
  readonly receivedAt: string;
  readonly idempotencyKey: string;
  readonly sourceRef: string;
  readonly pricingSnapshotRef?: string;
}

export type UsageEventIssueCode =
  | "unsupported_schema"
  | "invalid_identifier"
  | "invalid_kind"
  | "unit_kind_mismatch"
  | "invalid_quantity"
  | "invalid_timestamp"
  | "event_from_future"
  | "invalid_source_ref"
  | "invalid_pricing_ref";

export interface UsageEventIssue {
  readonly code: UsageEventIssueCode;
  readonly path: string;
}

const ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;
const REF = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,255}$/;

/** Validates usage event shape only; does not authenticate producer or write/deduplicate a ledger. */
export function validateUsageEvent(
  event: UsageEventV1,
  options: { readonly now?: string; readonly maxQuantity?: number; readonly maxFutureSkewMs?: number } = {}
): readonly UsageEventIssue[] {
  const issues: UsageEventIssue[] = [];
  if (event.schemaVersion !== "1") issues.push({ code: "unsupported_schema", path: "/schemaVersion" });
  for (const field of ["eventId", "producerId", "tenantId", "principalId", "idempotencyKey"] as const) {
    if (typeof event[field] !== "string" || !ID.test(event[field])) issues.push({ code: "invalid_identifier", path: `/${field}` });
  }
  if (!["model_input_tokens", "model_output_tokens", "tool_invocation", "file_processed", "embedding_tokens"].includes(event.kind)) {
    issues.push({ code: "invalid_kind", path: "/kind" });
  }
  const expectedUnit = event.kind === "tool_invocation" ? "invocation" : event.kind === "file_processed" ? "byte" : "token";
  if (event.unit !== expectedUnit) issues.push({ code: "unit_kind_mismatch", path: "/unit" });
  const maxQuantity = options.maxQuantity ?? 1_000_000_000;
  if (!Number.isSafeInteger(event.quantity) || event.quantity < 0 || event.quantity > maxQuantity) {
    issues.push({ code: "invalid_quantity", path: "/quantity" });
  }
  const occurred = Date.parse(event.occurredAt);
  const received = Date.parse(event.receivedAt);
  const now = Date.parse(options.now ?? new Date().toISOString());
  if (!Number.isFinite(occurred) || !Number.isFinite(received) || !Number.isFinite(now)) {
    issues.push({ code: "invalid_timestamp", path: "/occurredAt" });
  } else if (occurred > now + (options.maxFutureSkewMs ?? 300_000)) {
    issues.push({ code: "event_from_future", path: "/occurredAt" });
  }
  if (!REF.test(event.sourceRef)) issues.push({ code: "invalid_source_ref", path: "/sourceRef" });
  if (event.pricingSnapshotRef !== undefined && !REF.test(event.pricingSnapshotRef)) {
    issues.push({ code: "invalid_pricing_ref", path: "/pricingSnapshotRef" });
  }
  return issues;
}
