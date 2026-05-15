"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics/client"

export function KatalogPageTracker() {
  useEffect(() => {
    trackEvent({ eventType: "catalog_page_view", pagePath: "/katalog" })
  }, [])

  return null
}
