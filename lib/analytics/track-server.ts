import { sql } from "@/lib/sql"
import type { TrackEventPayload, AnalyticsEventType } from "./types"
import type { VisitorGeo } from "./geo"

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{16,64}$/

export function isValidSessionId(sessionId: string): boolean {
  return SESSION_ID_PATTERN.test(sessionId)
}

export async function insertAnalyticsEvent(
  payload: TrackEventPayload,
  sessionId: string,
  geo: VisitorGeo,
  referrer: string | null,
) {
  const businessId =
    payload.businessId != null && !Number.isNaN(Number(payload.businessId))
      ? Number(payload.businessId)
      : null

  const metadata = payload.metadata ?? {}

  await sql`
    INSERT INTO analytics_events (
      event_type,
      business_id,
      session_id,
      visitor_city,
      visitor_region,
      visitor_country,
      referrer,
      page_path,
      metadata
    ) VALUES (
      ${payload.eventType as AnalyticsEventType},
      ${businessId},
      ${sessionId},
      ${geo.city},
      ${geo.region},
      ${geo.country ?? "ID"},
      ${referrer},
      ${payload.pagePath ?? null},
      ${JSON.stringify(metadata)}
    )
  `
}
