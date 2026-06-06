import { type NextRequest, NextResponse } from "next/server"
import { ANALYTICS_EVENT_TYPES, type AnalyticsEventType } from "@/lib/analytics/types"
import { getVisitorGeoFromRequest } from "@/lib/analytics/geo"
import { insertAnalyticsEvent, isValidSessionId } from "@/lib/analytics/track-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, businessId, sessionId, pagePath, referrer, metadata } = body

    if (!eventType || !ANALYTICS_EVENT_TYPES.includes(eventType as AnalyticsEventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
    }

    if (!sessionId || !isValidSessionId(sessionId)) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 })
    }

    const needsBusiness = ["page_view", "whatsapp_click", "rfq_submit", "website_click", "social_click"].includes(eventType)
    if (needsBusiness && (businessId == null || Number.isNaN(Number(businessId)))) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 })
    }

    const geo = getVisitorGeoFromRequest(request)

    await insertAnalyticsEvent(
      {
        eventType: eventType as AnalyticsEventType,
        businessId: businessId != null ? Number(businessId) : null,
        pagePath,
        metadata: metadata && typeof metadata === "object" ? metadata : {},
      },
      sessionId,
      geo,
      referrer ?? null,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics track error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
