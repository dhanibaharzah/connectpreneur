"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics/client"

export function BusinessPageTracker({ businessId }: { businessId: string }) {
  useEffect(() => {
    const id = Number.parseInt(businessId, 10)
    if (Number.isNaN(id)) return
    trackEvent({
      eventType: "page_view",
      businessId: id,
      pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    })
  }, [businessId])

  return null
}
