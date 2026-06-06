export const ANALYTICS_EVENT_TYPES = [
  "page_view",
  "catalog_page_view",
  "catalog_cta_click",
  "whatsapp_click",
  "rfq_submit",
  "website_click",
  "social_click",
] as const

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number]

export interface TrackEventPayload {
  eventType: AnalyticsEventType
  businessId?: number | null
  pagePath?: string
  metadata?: Record<string, string>
}
